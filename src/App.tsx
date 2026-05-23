import { useState, useEffect, useRef } from 'react'
import './index.css'
import { seedCafes } from './data/cafes'
import { MapView } from './components/MapView'
import { ReviewForm } from './components/ReviewForm'
import type { FilterState, Review, ReviewsMap } from './types'
import { TAG_VOCAB } from './types'

function getAverageRating(review?: Review): number | null {
  if (!review?.ratings) return null
  const values = Object.values(review.ratings).filter(
    (v): v is 1 | 2 | 3 | 4 | 5 => typeof v === 'number'
  )
  if (values.length === 0) return null
  const avg = values.reduce((sum, v) => sum + v, 0) / values.length
  return Math.round(avg * 10) / 10 // one decimal place
}

// Shared URL <-> FilterState (used in init + popstate)
function parseUrlFilters(): FilterState {
  if (typeof window === 'undefined') {
    return { query: '', minRating: 0, selectedTags: [], onlyReviewed: false }
  }
  const p = new URLSearchParams(window.location.search)
  const rawTags = (p.get('tags') || '').split(',').filter(Boolean)
  const safeTags = [...new Set(rawTags.filter((t) => (TAG_VOCAB as readonly string[]).includes(t)))]
  return {
    query: p.get('q') || '',
    minRating: Math.max(0, Math.min(5, Number(p.get('min') || '0') || 0)),
    selectedTags: safeTags,
    onlyReviewed: p.get('reviewed') === '1',
  }
}

function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const [filters, setFilters] = useState<FilterState>(parseUrlFilters)

  const [reviews, setReviews] = useState<ReviewsMap>({})

  // For calm export/import feedback (v1, no full toast system)
  const [persistStatus, setPersistStatus] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('gumi-cafe-reviews')
      if (saved) {
        const parsed = JSON.parse(saved)
        Promise.resolve().then(() => setReviews(parsed))
      }
    } catch {
      console.warn('Failed to load reviews from localStorage')
    }
  }, [])

  // Save to localStorage whenever reviews change
  useEffect(() => {
    try {
      localStorage.setItem('gumi-cafe-reviews', JSON.stringify(reviews))
    } catch {
      console.warn('Failed to save reviews to localStorage')
    }
  }, [reviews])

  // URL-driven filters (UX-Spec): popstate listener (initial state already from parseUrlFilters)
  useEffect(() => {
    const onPop = () => setFilters(parseUrlFilters())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  useEffect(() => {
    const p = new URLSearchParams()
    if (filters.query) p.set('q', filters.query)
    if (filters.minRating > 0) p.set('min', String(filters.minRating))
    if (filters.selectedTags.length > 0) p.set('tags', filters.selectedTags.join(','))
    if (filters.onlyReviewed) p.set('reviewed', '1')
    const qs = p.toString()
    const newUrl = qs ? `${window.location.pathname}?${qs}` : window.location.pathname
    window.history.replaceState(null, '', newUrl)
  }, [filters])

  const currentReview = selectedId ? reviews[selectedId] : undefined
  const selectedCafe = selectedId ? seedCafes.find((c) => c.id === selectedId) : undefined

  const filteredCafes = seedCafes.filter((cafe) => {
    const matchesQuery =
      filters.query === '' ||
      cafe.name.toLowerCase().includes(filters.query.toLowerCase()) ||
      (cafe.address ?? '').toLowerCase().includes(filters.query.toLowerCase())

    const matchesTags =
      filters.selectedTags.length === 0 ||
      filters.selectedTags.every((tag) => cafe.tags?.includes(tag) ?? false)

    const review = reviews[cafe.id]
    const avg = getAverageRating(review)
    const matchesRating =
      filters.minRating === 0 || (avg !== null && avg >= filters.minRating)

    const matchesReviewed = !filters.onlyReviewed || !!review

    return matchesQuery && matchesTags && matchesRating && matchesReviewed
  })

  const visibleIds = filteredCafes.map((c) => c.id)

  // Guard: clear inspector if selected cafe is filtered out (e.g. raise minRating or toggle onlyReviewed)
  useEffect(() => {
    if (selectedId && !visibleIds.includes(selectedId)) {
      Promise.resolve().then(() => setSelectedId(null))
    }
  }, [visibleIds, selectedId])

  // Export: one-click JSON download of user's reviews (with metadata)
  const handleExport = () => {
    try {
      const count = Object.keys(reviews).length
      const payload = {
        reviews,
        exportedAt: new Date().toISOString(),
        version: 1,
        count,
      }
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `gumi-reviews-${new Date().toISOString().slice(0, 10)}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      setPersistStatus(`Exported ${count} reviews ✓`)
      setTimeout(() => setPersistStatus(null), 1800)
    } catch {
      setPersistStatus('Export failed')
      setTimeout(() => setPersistStatus(null), 2000)
    }
  }

  // Import: File API, validate, safe merge (user confirms), feedback
  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const text = (ev.target?.result as string) || ''
        const parsed = JSON.parse(text)
        const imported: ReviewsMap = parsed.reviews ?? parsed
        if (typeof imported !== 'object' || Array.isArray(imported) || imported === null) {
          throw new Error('Invalid shape')
        }
        const valid = Object.values(imported).every((r) => {
          const rec = r as unknown as Record<string, unknown>
          return rec && typeof rec.updatedAt === 'string' && Array.isArray(rec.tags)
        })
        if (!valid) throw new Error('Invalid review format')
        const importCount = Object.keys(imported).length
        const currentCount = Object.keys(reviews).length
        const doMerge = window.confirm(
          currentCount > 0
            ? `Merge ${importCount} reviews from file? (will overwrite any same-cafe memories)`
            : `Load ${importCount} reviews from file?`
        )
        if (doMerge) {
          setReviews((prev) => ({ ...prev, ...imported }))
          setPersistStatus(`Imported ${importCount} reviews ✓`)
          setTimeout(() => setPersistStatus(null), 1800)
        }
      } catch {
        setPersistStatus('Import failed — check file format')
        setTimeout(() => setPersistStatus(null), 2200)
      }
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
    reader.onerror = () => {
      setPersistStatus('Failed to read the file')
      setTimeout(() => setPersistStatus(null), 2000)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
    reader.readAsText(file)
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans">
      {/* Header */}
      <header className="h-16 border-b border-neutral-200 bg-white flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center text-white text-sm font-semibold">G</div>
          <div>
            <div className="font-semibold tracking-tight">Gumi Cafe Map</div>
            <div className="text-[10px] text-neutral-500 -mt-0.5">My memories • {seedCafes.length} cafés</div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <button
            onClick={handleExport}
            className="px-3 py-1.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 active:bg-neutral-100 transition"
          >
            Export
          </button>
          <button
            onClick={handleImportClick}
            className="px-3 py-1.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 active:bg-neutral-100 transition"
          >
            Import
          </button>
          {persistStatus && (
            <span
              className={`ml-1 text-xs font-medium ${persistStatus.includes('failed') || persistStatus.includes('Failed') ? 'text-red-500' : 'text-success'}`}
              aria-live="polite"
            >
              {persistStatus}
            </span>
          )}
          {/* Hidden file input for import */}
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </header>

      {/* v8 Desktop Power Layout (lg) — graceful stack on mobile with map first (order-1) then list (order-2) then inspector for map-primary UX per spec compromise */}
      <div className="grid grid-cols-1 lg:grid-cols-[440px_1fr_380px] h-auto lg:h-[calc(100vh-4rem)] overflow-hidden">
        {/* Left: Filters + Results — vertical on mobile, side-by-side on lg. order-2 so map (order-1) appears first on small screens for map-primary feel */}
        <div className="flex h-auto lg:h-full border-r border-neutral-200 bg-white flex-col lg:flex-row order-2 lg:order-none">
          {/* Filters Column */}
          <div className="w-full lg:w-48 border-b lg:border-b-0 lg:border-r border-neutral-200 flex-shrink-0 overflow-y-auto px-3 py-4 text-sm">
            <div className="font-semibold mb-1 text-neutral-900">Search</div>
            <input
              type="text"
              value={filters.query}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, query: e.target.value }))
              }
              placeholder="Search cafés..."
              className="w-full border border-neutral-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent placeholder:text-neutral-400"
            />

            <div className="font-semibold mt-4 mb-1 text-neutral-900">Min Rating</div>
            <div className="flex gap-1 flex-wrap">
              {[0, 3, 4, 5].map((r) => {
                const isActive = filters.minRating === r
                return (
                  <button
                    key={r}
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, minRating: r }))
                    }
                    className={`px-2.5 py-0.5 text-xs rounded-full border transition ${
                      isActive
                        ? 'bg-accent text-white border-accent'
                        : 'border-neutral-200 hover:border-accent'
                    }`}
                  >
                    {r ? `${r}+` : 'Any'}
                  </button>
                )
              })}
            </div>

            <label className="mt-3 flex items-center gap-2 text-sm text-neutral-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={filters.onlyReviewed}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, onlyReviewed: e.target.checked }))
                }
                className="accent-accent w-4 h-4"
              />
              Only reviewed
            </label>

            <div className="font-semibold mt-4 mb-1 text-neutral-900">Tags</div>
            <div className="flex flex-col gap-1 px-0.5">
              {TAG_VOCAB.map((tag) => {
                const isActive = filters.selectedTags.includes(tag)
                return (
                  <button
                    key={tag}
                    onClick={() => {
                      setFilters((prev) => ({
                        ...prev,
                        selectedTags: isActive
                          ? prev.selectedTags.filter((t) => t !== tag)
                          : [...prev.selectedTags, tag],
                      }))
                    }}
                    className={`w-full text-left px-3 py-[7px] rounded-xl border text-sm transition ${
                      isActive
                        ? 'bg-accent/10 border-accent text-accent font-medium'
                        : 'border-neutral-200 hover:border-accent'
                    }`}
                  >
                    {tag}
                  </button>
                )
              })}
            </div>

            {(filters.query || filters.minRating > 0 || filters.selectedTags.length > 0) && (
              <button
                onClick={() =>
                  setFilters({
                    query: '',
                    minRating: 0,
                    selectedTags: [],
                    onlyReviewed: false,
                  })
                }
                className="mt-3 w-full text-xs text-neutral-500 hover:text-accent transition"
              >
                Clear all filters
              </button>
            )}
          </div>

          {/* Results Column */}
          <div className="flex-1 overflow-y-auto px-3 py-4">
            <div className="text-xs uppercase tracking-widest text-neutral-500 mb-2 px-1">
              Results • {filteredCafes.length}
            </div>
            <div className="space-y-2">
              {filteredCafes.map((cafe) => {
                const review = reviews[cafe.id]
                const avgRating = getAverageRating(review)

                return (
                  <button
                    type="button"
                    key={cafe.id}
                    onClick={() => setSelectedId(cafe.id)}
                    className={`cafe-card p-3 cursor-pointer text-left w-full ${selectedId === cafe.id ? 'ring-1 ring-accent' : ''}`}
                    aria-label={`Select ${cafe.name}${avgRating !== null ? `, average rating ${avgRating.toFixed(1)}` : ''}`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="font-medium text-[15px]">{cafe.name}</div>
                      {avgRating !== null && (
                        <div className="flex items-center gap-1 text-sm text-accent font-medium tabular-nums">
                          <span>★</span>
                          <span>{avgRating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-neutral-500 mt-0.5">{cafe.address ?? 'Gumi'}</div>
                    {cafe.tags && cafe.tags.length > 0 && (
                      <div className="flex gap-1 mt-2 flex-wrap">
                        {cafe.tags.map((t) => (
                          <span
                            key={t}
                            className="text-[10px] px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded-full"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </button>
                )
              })}
              {filteredCafes.length === 0 && (
                <div className="text-sm text-neutral-500 px-1">No matches — clear filters?</div>
              )}
            </div>
          </div>
        </div>

        {/* Center: Live MapView — bidirectional with list + inspector */}
        <MapView
          cafes={seedCafes}
          selectedId={selectedId}
          onSelect={setSelectedId}
          visibleIds={visibleIds}
          reviews={reviews}
          className="h-[50vh] lg:h-full w-full order-1 lg:order-none"
        />

        {/* Right: Inspector — ReviewForm (stacks on mobile) */}
        <div className="border-l border-neutral-200 bg-white overflow-y-auto p-5 text-sm h-auto lg:h-full order-3 lg:order-none">
          {selectedId && selectedCafe ? (
            <ReviewForm
              cafeName={selectedCafe.name}
              existingReview={currentReview}
              onSave={(review) => {
                setReviews((prev) => ({
                  ...prev,
                  [selectedId]: review,
                }))
              }}
              onClose={() => setSelectedId(null)}
            />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center px-6 text-neutral-400">
              <div className="text-3xl mb-3 opacity-40">☕</div>
              <div className="text-sm">Select a café from the list or map</div>
              <div className="text-xs mt-1 text-neutral-300">to capture your memory</div>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}

export default App
