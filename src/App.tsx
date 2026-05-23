import { useState } from 'react'
// v8 clean shell — no Vite template assets needed
import './index.css'

function App() {
  // v8 Desktop Split-Left shell (visual foundation only — real data/components in later slices)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [query, setQuery] = useState('')

  // Static demo data matching seed style (real data in src/data/cafes.ts)
  const demoCafes = [
    { id: 'c1', name: 'Cafe Layer', rating: 4.5, tags: ['Great coffee', 'Cozy / Aesthetic'] },
    { id: 'c2', name: 'The Quiet Cup', rating: 4, tags: ['Quiet', 'Work / Study friendly'] },
    { id: 'c3', name: 'Aroma 128', rating: 3.5, tags: ['Power / Outlets', 'WiFi'] },
  ]

  const filtered = demoCafes.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans">
      {/* Header */}
      <header className="h-16 border-b border-neutral-200 bg-white flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center text-white text-sm font-semibold">G</div>
          <div>
            <div className="font-semibold tracking-tight">Gumi Cafe Map</div>
            <div className="text-[10px] text-neutral-500 -mt-0.5">My memories • 8 cafés</div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <button
            onClick={() => alert('Export JSON (wired in persistence slice)')}
            className="px-3 py-1.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 active:bg-neutral-100 transition"
          >
            Export
          </button>
          <button
            onClick={() => alert('Import (wired in persistence slice)')}
            className="px-3 py-1.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 active:bg-neutral-100 transition"
          >
            Import
          </button>
          <div className="ml-2 px-3 py-1 bg-neutral-100 rounded-full text-xs text-neutral-600">v8 shell • tokens synced</div>
        </div>
      </header>

      {/* v8 Desktop Power Layout: 440px left split | map | 380px inspector */}
      <div className="grid grid-cols-[440px_1fr_380px] h-[calc(100vh-4rem)] overflow-hidden">
        {/* Left: Filters + Results (split) */}
        <div className="flex h-full border-r border-neutral-200 bg-white">
          {/* Filters Column (~190px) */}
          <div className="w-48 border-r border-neutral-200 flex-shrink-0 overflow-y-auto px-3 py-4 text-sm">
            <div className="font-semibold mb-1 text-neutral-900">Search</div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search cafés..."
              className="w-full border border-neutral-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent placeholder:text-neutral-400"
            />

            <div className="font-semibold mt-4 mb-1 text-neutral-900">Min Rating</div>
            <div className="flex gap-1 flex-wrap">
              {[0, 3, 4, 5].map(r => (
                <button key={r} className="px-2.5 py-0.5 text-xs rounded-full border border-neutral-200 hover:border-accent active:bg-accent active:text-white transition">
                  {r ? `${r}+` : 'Any'}
                </button>
              ))}
            </div>

            <div className="font-semibold mt-4 mb-1 text-neutral-900">Tags</div>
            <div className="flex flex-col gap-1 px-0.5">
              {['WiFi', 'Quiet', 'Great coffee', 'Cozy / Aesthetic', 'Work / Study friendly'].map(tag => (
                <button
                  key={tag}
                  className="tag-chip w-full text-left px-3 py-[7px] rounded-xl border border-neutral-200 text-sm hover:border-accent active:bg-accent active:text-white transition"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Results Column */}
          <div className="flex-1 overflow-y-auto px-3 py-4">
            <div className="text-xs uppercase tracking-widest text-neutral-500 mb-2 px-1">Results • {filtered.length}</div>
            <div className="space-y-2">
              {filtered.map(cafe => (
                <div
                  key={cafe.id}
                  onClick={() => setSelectedId(cafe.id)}
                  className={`cafe-card p-3 cursor-pointer ${selectedId === cafe.id ? 'ring-1 ring-accent' : ''}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="font-medium text-[15px]">{cafe.name}</div>
                    <div className="text-sm text-accent font-semibold">★ {cafe.rating}</div>
                  </div>
                  <div className="text-xs text-neutral-500 mt-0.5">Gumi • 3 visits</div>
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {cafe.tags.map(t => (
                      <span key={t} className="text-[10px] px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded-full">{t}</span>
                    ))}
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="text-sm text-neutral-500 px-1">No matches — clear filters?</div>
              )}
            </div>
          </div>
        </div>

        {/* Center: Map placeholder (exact v8 size & calm) */}
        <div className="relative bg-neutral-100 flex items-center justify-center text-center p-8">
          <div>
            <div className="text-2xl font-semibold tracking-tight text-neutral-700">Map</div>
            <div className="text-sm text-neutral-500 mt-1">Leaflet + custom markers<br />bidirectional sync • flyTo<br />(next slice)</div>
            <div className="mt-6 text-[10px] text-neutral-400">Gumi center • 36.1195° N, 128.3447° E</div>
          </div>
        </div>

        {/* Right: Inspector (v8 contextual review panel) */}
        <div className="border-l border-neutral-200 bg-white overflow-y-auto p-5 text-sm">
          {selectedId ? (
            <div>
              <div className="font-semibold text-lg mb-1">Remember Cafe Layer?</div>
              <div className="text-neutral-500 text-xs mb-4">Gumi-dong • Last logged 2 days ago</div>

              {/* Mini ReviewForm (shell) */}
              <div className="space-y-4">
                <div>
                  <div className="text-xs uppercase tracking-widest text-neutral-500 mb-1">Rating</div>
                  <div className="flex gap-1 text-3xl">★★★★☆</div>
                </div>

                <div>
                  <div className="text-xs uppercase tracking-widest text-neutral-500 mb-1">Quick memory (optional)</div>
                  <textarea
                    className="w-full border border-neutral-200 rounded-xl p-3 text-sm h-20 resize-y focus:ring-1 focus:ring-accent"
                    placeholder="Loved the oat latte and quiet corner..."
                  />
                </div>

                <div>
                  <div className="text-xs uppercase tracking-widest text-neutral-500 mb-1">What stood out?</div>
                  <div className="flex flex-wrap gap-1.5">
                    {['Great coffee', 'Cozy / Aesthetic', 'Quiet'].map(t => (
                      <button key={t} className="px-3 py-1 text-xs rounded-full border border-neutral-200 bg-neutral-50 active:bg-accent active:text-white">{t}</button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => alert('Saved ✓ (full persistence + optimistic update in Slice 5)')}
                  className="w-full mt-2 py-3 rounded-2xl bg-accent text-white font-medium active:opacity-90 transition"
                >
                  Save memory
                </button>
                <button onClick={() => setSelectedId(null)} className="w-full text-xs text-neutral-500">Close</button>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-center text-neutral-400 text-sm">
              Select a café from the list or map<br />to start your review
            </div>
          )}
        </div>
      </div>

      <div className="text-[10px] text-neutral-400 text-center py-1 border-t bg-white">
        v8 Desktop Split-Left • tokens from UI-Spec • design-reviewer approved • worktree: feature/slice0-visual-foundation
      </div>
    </div>
  )
}

export default App
