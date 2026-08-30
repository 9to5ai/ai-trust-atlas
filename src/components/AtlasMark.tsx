export function AtlasMark() {
  return (
    <svg className="atlas-mark" viewBox="0 0 48 48" aria-hidden="true">
      <circle className="atlas-mark-halo" cx="24" cy="24" r="17.5" />
      <g className="atlas-mark-orbit atlas-mark-orbit-a">
        <ellipse cx="24" cy="24" rx="17" ry="8.5" />
        <circle cx="40.5" cy="24" r="2.25" />
      </g>
      <g className="atlas-mark-orbit atlas-mark-orbit-b">
        <ellipse cx="24" cy="24" rx="8.5" ry="17" />
        <circle cx="24" cy="7.5" r="1.75" />
      </g>
      <path className="atlas-mark-core" d="M24 16.5c1.15 4.55 2.95 6.35 7.5 7.5-4.55 1.15-6.35 2.95-7.5 7.5-1.15-4.55-2.95-6.35-7.5-7.5 4.55-1.15 6.35-2.95 7.5-7.5Z" />
      <circle className="atlas-mark-centre" cx="24" cy="24" r="2.1" />
    </svg>
  )
}
