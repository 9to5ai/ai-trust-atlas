/* Orbit and constellation: sources, concepts and controls held in one frame of reference. */
export function AtlasMark({ size = 28 }: { size?: number }) {
  return (
    <svg className="atlas-mark" width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" fill="none">
      <circle cx="16" cy="16" r="13.5" stroke="currentColor" strokeOpacity=".28" strokeWidth="1.2" />
      <ellipse cx="16" cy="16" rx="13.5" ry="5.4" transform="rotate(-28 16 16)" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8.6 21 16 16l7.6-5.6" stroke="currentColor" strokeOpacity=".75" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="16" cy="16" r="3.4" fill="currentColor" />
      <circle cx="23.6" cy="10.4" r="1.9" fill="currentColor" />
      <circle cx="8.6" cy="21" r="1.9" fill="currentColor" />
    </svg>
  )
}
