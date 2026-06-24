import './GenreShelfSkeleton.css'

// GenreShelfSkeleton renders a single placeholder shelf: a gray heading bar
// and a row of gray poster-shaped cards, all shimmering. It takes no movie
// data — it's pure "shape of what's coming" shown while the fetch is in flight.
//
// Reuse these classes so the layout matches a real GenreShelf exactly:
//   <section className="genre-shelf">            ← outer spacing
//     <div className="genre-shelf-skeleton__heading skeleton" />  ← title bar
//     <div className="genre-shelf__row">          ← horizontal row
//       <div className="genre-shelf-skeleton__card skeleton" />   ← one card
//       ...repeat for however many cards you want
//     </div>
//   </section>
//
// The `skeleton` class (in index.css) supplies the shimmer animation.
export default function GenreShelfSkeleton() {
  return (
    <section className="genre-shelf">
      <div className="genre-shelf-skeleton__heading skeleton" />
      <div className="genre-shelf__row">
        <div className="genre-shelf-skeleton__card skeleton" />
        <div className="genre-shelf-skeleton__card skeleton" />
        <div className="genre-shelf-skeleton__card skeleton" />
      </div>
    </section>
  )
}
