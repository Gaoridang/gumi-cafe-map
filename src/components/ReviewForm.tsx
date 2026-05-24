import { useState, useEffect } from 'react'
import type { Review, Tag } from '../types'
import { TAG_VOCAB } from '../types'

function getRelativeTime(isoString: string): string {
  const date = new Date(isoString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)

  if (diffMin < 1) return 'just now'
  if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? '' : 's'} ago`
  if (diffMin < 1440) {
    const hours = Math.floor(diffMin / 60)
    return `${hours} hour${hours === 1 ? '' : 's'} ago`
  }
  return 'yesterday or earlier'
}

interface RatingRowProps {
  label: string
  value: 1 | 2 | 3 | 4 | 5 | undefined
  onChange: (value: 1 | 2 | 3 | 4 | 5 | undefined) => void
}

function RatingRow({ label, value, onChange }: RatingRowProps) {
  const handleClick = (star: number) => {
    // Toggle: clicking the same value clears it
    if (value === star) {
      onChange(undefined)
    } else {
      onChange(star as 1 | 2 | 3 | 4 | 5)
    }
  }

  return (
    <div className="flex items-center gap-3 mb-1.5">
      <div className="w-20 text-sm text-neutral-600">{label}</div>
      <div className="flex gap-0.5 text-2xl">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleClick(star)}
            className={`transition ${value && star <= value ? 'text-accent' : 'text-neutral-200 hover:text-neutral-300'}`}
          >
            ★
          </button>
        ))}
      </div>
      {value && (
        <button
          onClick={() => onChange(undefined)}
          className="ml-1 text-xs text-neutral-400 hover:text-red-400"
        >
          clear
        </button>
      )}
    </div>
  )
}

interface ReviewFormProps {
  cafeName: string
  existingReview?: Review
  onSave: (review: Review) => void
  onClose: () => void
}

export function ReviewForm({ cafeName, existingReview, onSave, onClose }: ReviewFormProps) {
  const [coffeeRating, setCoffeeRating] = useState<1 | 2 | 3 | 4 | 5 | undefined>(
    existingReview?.ratings?.coffee
  )
  const [dessertRating, setDessertRating] = useState<1 | 2 | 3 | 4 | 5 | undefined>(
    existingReview?.ratings?.dessert
  )
  const [moodRating, setMoodRating] = useState<1 | 2 | 3 | 4 | 5 | undefined>(
    existingReview?.ratings?.mood
  )

  const [selectedTags, setSelectedTags] = useState<Tag[]>((existingReview?.tags as Tag[]) ?? [])
  const [note, setNote] = useState(existingReview?.note ?? '')
  const [justSaved, setJustSaved] = useState(false)

  // Reset form when switching to a different café
  useEffect(() => {
    Promise.resolve().then(() => {
      if (existingReview?.ratings) {
        setCoffeeRating(existingReview.ratings.coffee)
        setDessertRating(existingReview.ratings.dessert)
        setMoodRating(existingReview.ratings.mood)
        setSelectedTags(existingReview.tags as Tag[])
        setNote(existingReview.note ?? '')
      } else {
        setCoffeeRating(undefined)
        setDessertRating(undefined)
        setMoodRating(undefined)
        setSelectedTags([])
        setNote('')
      }
      setJustSaved(false)
    })
  }, [existingReview])

  const toggleTag = (tag: Tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const handleSave = () => {
    const review: Review = {
      ratings: {
        coffee: coffeeRating,
        dessert: dessertRating,
        mood: moodRating,
      },
      tags: selectedTags,
      note: note.trim() ? note.trim() : undefined,
      updatedAt: new Date().toISOString(),
    }
    onSave(review)
    setJustSaved(true)

    // Hide the "Saved" message after a short time
    setTimeout(() => setJustSaved(false), 1400)
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <div className="font-semibold text-lg" role="heading" aria-level={2}>{cafeName}</div>
        <div className="flex items-center gap-2 text-xs text-neutral-500">
          {existingReview ? 'Edit your memory' : 'Capture this visit'}
          {existingReview && (
            <span className="text-neutral-400">· {getRelativeTime(existingReview.updatedAt)}</span>
          )}
        </div>
      </div>

      {/* Multi-dimensional Ratings */}
      <div>
        <div className="text-xs uppercase tracking-widest text-neutral-500 mb-2">Ratings</div>
        
        <RatingRow
          label="Coffee"
          value={coffeeRating}
          onChange={setCoffeeRating}
        />
        <RatingRow
          label="Dessert"
          value={dessertRating}
          onChange={setDessertRating}
        />
        <RatingRow
          label="Mood"
          value={moodRating}
          onChange={setMoodRating}
        />
      </div>

      {/* Tags */}
      <div>
        <div className="text-xs uppercase tracking-widest text-neutral-500 mb-1.5">
          What stood out?
        </div>
        <div className="flex flex-wrap gap-1.5">
          {TAG_VOCAB.map((tag) => {
            const isActive = selectedTags.includes(tag)
            return (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 text-xs rounded-full border transition ${
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
      </div>

      {/* Note */}
      <div>
        <div className="text-xs uppercase tracking-widest text-neutral-500 mb-1.5">
          Quick memory (optional)
        </div>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Loved the oat latte and the quiet corner by the window..."
          className="w-full border border-neutral-200 rounded-xl p-3 text-sm h-24 resize-y focus:ring-1 focus:ring-accent placeholder:text-neutral-400"
        />
      </div>

      {/* Actions */}
      <div className="pt-1 space-y-2">
        <button
          onClick={handleSave}
          disabled={!existingReview && !coffeeRating && !dessertRating && !moodRating}
          className="w-full py-3 rounded-2xl bg-accent text-white font-medium active:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {justSaved 
            ? (existingReview ? 'Memory updated ✓' : 'Memory saved ✓') 
            : (existingReview ? 'Update memory' : 'Save memory')}
        </button>

        <button
          onClick={onClose}
          className="w-full text-xs text-neutral-500 hover:text-neutral-700 transition"
        >
          Close
        </button>
      </div>
    </div>
  )
}
