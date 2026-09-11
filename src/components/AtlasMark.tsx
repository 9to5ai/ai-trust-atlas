export function AtlasMark() {
  return (
    <svg className="atlas-mark" viewBox="0 0 48 48" aria-hidden="true">
      <path className="atlas-mark-frame" d="M24 4.5 40.9 14.25v19.5L24 43.5 7.1 33.75v-19.5Z" />
      <path className="atlas-mark-facet facet-a" d="M24 4.5v19.3L7.1 14.25Z" />
      <path className="atlas-mark-facet facet-b" d="m40.9 14.25-16.9 9.55V4.5Z" />
      <path className="atlas-mark-facet facet-c" d="m7.1 33.75 16.9-9.95v19.7Z" />
      <path className="atlas-mark-facet facet-d" d="M24 43.5V23.8l16.9 9.95Z" />
      <path className="atlas-mark-river" d="M9.8 29.9c5.6-8.8 8.9 1.2 14.2-6.1 5.3-7.2 8.3 2.7 14.1-5.7" />
      <circle className="atlas-mark-node node-a" cx="9.8" cy="29.9" r="1.6" />
      <circle className="atlas-mark-node node-b" cx="24" cy="23.8" r="2.6" />
      <circle className="atlas-mark-node node-c" cx="38.1" cy="18.1" r="1.6" />
    </svg>
  )
}
