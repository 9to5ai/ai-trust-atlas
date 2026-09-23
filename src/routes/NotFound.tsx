import { Link } from '../app/router'
import { Page, PageHero } from '../ui/Page'

export function NotFound() {
  return (
    <Page labelledBy="not-found-title">
      <PageHero id="not-found-title" eyebrow="Off the map" title="This page isn’t in the Atlas" lede="The link may be out of date. Search the Atlas with ⌘K, or head back to the start.">
        <p><Link to="/">Return home</Link> · <Link to="/universe">Open the Universe</Link></p>
      </PageHero>
    </Page>
  )
}
