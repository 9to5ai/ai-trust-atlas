import { Starfield } from './Starfield'
import styles from './PageSky.module.css'

/*
 * A faint sky behind every Practice page, so it still feels like the Atlas Universe: sparse twinkling stars that
 * drift a little with scrolling, slow nebulae, one dashed orbit and a rare shooting star. It sits behind the content
 * and never takes pointer events.
 */
export function PageSky() {
  return (
    <div className={styles.sky} aria-hidden="true">
      <div className={styles.nebula} />
      <svg className={styles.orbit} viewBox="0 0 1000 1000" preserveAspectRatio="xMaxYMin slice">
        <g className={styles.spin}>
          <circle cx="1000" cy="0" r="520" />
          <circle cx="1000" cy="0" r="700" />
        </g>
      </svg>
      <Starfield className={styles.stars} spacing={11000} intensity={0.6} meteorEvery={[14000, 16000]} scrollParallax />
    </div>
  )
}

export const pageContentClass = styles.content
