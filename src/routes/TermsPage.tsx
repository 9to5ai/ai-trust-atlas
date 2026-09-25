import { Page, PageHero } from '../ui/Page'
import styles from './TermsPage.module.css'

const repo = 'https://github.com/9to5ai/ai-trust-atlas'
const citation = 'AI Trust Atlas by Momo & Ray, https://ai-trust-atlas.vercel.app, licensed under CC BY-NC-SA 4.0.'

export function TermsPage() {
  return (
    <Page labelledBy="terms-title">
      <PageHero id="terms-title" eyebrow="About and licence" title="Licence and terms" lede="The AI Trust Atlas is open to read, share and adapt for non-commercial use, with credit. © 2026 Momo & Ray." />
      <div className={styles.body}>
        <section>
          <h2>Content</h2>
          <p>The Atlas content — source summaries, sections, requirements, concepts, mappings, controls, questions, tours, incidents and use cases — is licensed under <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noreferrer">Creative Commons Attribution-NonCommercial-ShareAlike 4.0</a>.</p>
          <ul>
            <li><strong>You may</strong> share it and adapt it, including inside your organisation.</li>
            <li><strong>You must</strong> credit “AI Trust Atlas by Momo &amp; Ray”, link to the licence, say if you made changes, and share adaptations under the same licence.</li>
            <li><strong>You may not</strong> use it for commercial purposes, such as repackaging it into a paid product or paid services, without permission.</li>
          </ul>
        </section>
        <section>
          <h2>Code</h2>
          <p>The software is licensed under the <a href={`${repo}/blob/main/LICENSE`} target="_blank" rel="noreferrer">Apache License 2.0</a>. See <a href={`${repo}/blob/main/NOTICE`} target="_blank" rel="noreferrer">NOTICE</a> and <a href={`${repo}/blob/main/LICENSE-CONTENT`} target="_blank" rel="noreferrer">LICENSE-CONTENT</a> for which files each licence covers.</p>
        </section>
        <section>
          <h2>Name and logo</h2>
          <p>“AI Trust Atlas” and its logo are trade marks of Momo &amp; Ray and are not covered by either licence. Copies and adaptations must use a different name and must not suggest they are endorsed or maintained by Momo &amp; Ray.</p>
        </section>
        <section>
          <h2>How to cite</h2>
          <p className={styles.cite}>{citation}</p>
        </section>
        <section>
          <h2>Third-party material</h2>
          <p>Official documents, titles, quotations and brands belong to their owners and are referenced, not relicensed. The MIT AI Risk Repository taxonomy is used under CC BY 4.0. Licensed standards appear only as short original paraphrases.</p>
        </section>
        <section>
          <h2>Not advice</h2>
          <p>The Atlas is a reference and planning tool. It is not legal, regulatory, audit or assurance advice. Connections do not establish legal applicability, compliance, implemented controls or their effectiveness. Content marked “Draft · awaiting review” has not yet been editorially approved.</p>
        </section>
        <section>
          <h2>Commercial use and questions</h2>
          <p>For commercial use or permissions, contact the owners through <a href={repo} target="_blank" rel="noreferrer">GitHub</a>.</p>
        </section>
      </div>
    </Page>
  )
}
