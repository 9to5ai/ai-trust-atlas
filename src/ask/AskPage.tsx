import { Page, PageHero } from '../ui/Page'
import { AskPanel } from './AskPanel'

export function AskPage() {
  return (
    <Page labelledBy="ask-title">
      <PageHero id="ask-title" eyebrow="Ask the Atlas" title="Questions, answered from the record" lede="A research assistant that reads only the Atlas’s reviewed sources and interpretations, cites every claim, and says so when the record runs out." />
      <AskPanel variant="page" />
    </Page>
  )
}
