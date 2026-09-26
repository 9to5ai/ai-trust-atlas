import { Chip } from '../../ui/Kit'
import { Page, PageHero } from '../../ui/Page'
import { systemTypeIds, systemTypes } from '../core/facets'
import { jurisdictionIds, regulatedFlags, type Profile as ProfileType } from '../core/workspace'
import { setProfile, useWorkspace } from '../store'
import styles from './Workspace.module.css'

/* The organisation profile. It tailors the roadmap and fills agent briefs, and never leaves this browser. */
const jurisdictionNames: Record<ProfileType['jurisdictions'][number], string> = {
  AU: 'Australia', 'AU-WA': 'Western Australia (state public sector)', NZ: 'New Zealand', EU: 'European Union', UK: 'United Kingdom', US: 'United States', CA: 'Canada', SG: 'Singapore', HK: 'Hong Kong', JP: 'Japan', KR: 'South Korea', CN: 'China', Other: 'Other',
}
const regulatedNames: Record<ProfileType['regulated'][number], string> = {
  apra: 'APRA-regulated', 'asic-licensee': 'ASIC licensee', 'commonwealth-agency': 'Commonwealth agency', 'state-agency': 'State or territory agency', health: 'Health service provider', 'critical-infrastructure': 'Critical infrastructure',
}
const sizes: [NonNullable<ProfileType['size']>, string, string][] = [
  ['small', 'Small', 'Under 50 people'], ['medium', 'Medium', '50–249 people'], ['large', 'Large', '250–4,999 people'], ['enterprise', 'Enterprise', '5,000 people or more'],
]
const appetites: [NonNullable<ProfileType['riskAppetite']>, string, string][] = [
  ['low', 'Low', 'Cautious. AI mainly in low-risk, internal uses, with close oversight.'],
  ['moderate', 'Moderate', 'Selective. AI in customer or decision-support uses where controls are proven.'],
  ['high', 'High', 'Ambitious. AI in core products and decisions, including agents, with strong controls.'],
]
const sectors = ['Banking', 'Insurance', 'Superannuation', 'Wealth and advice', 'Government', 'Health', 'Education', 'Retail and consumer', 'Technology', 'Professional services', 'Energy and utilities', 'Telecommunications', 'Not-for-profit']

function toggle<T>(list: T[], value: T) {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value]
}

export function Profile() {
  const { profile } = useWorkspace()
  return (
    <Page labelledBy="profile-title">
      <PageHero id="profile-title" eyebrow="Your organisation" title="Organisation profile" lede="A few facts about your organisation. They tailor the roadmap and are filled into the instructions you give your AI agent. They stay in this browser and are never sent to this site." />
      <form className={styles.form} onSubmit={(event) => event.preventDefault()}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="org-name">Organisation name</label>
          <input id="org-name" className={styles.input} value={profile.orgName ?? ''} maxLength={120} onChange={(event) => setProfile({ orgName: event.target.value || undefined })} autoComplete="organization" />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="org-sector">Sector</label>
          <input id="org-sector" className={styles.input} list="sector-options" value={profile.sector ?? ''} maxLength={120} onChange={(event) => setProfile({ sector: event.target.value || undefined })} placeholder="For example Banking" />
          <datalist id="sector-options">{sectors.map((sector) => <option key={sector} value={sector} />)}</datalist>
        </div>
        <fieldset className={styles.field}>
          <legend className={styles.label}>Size</legend>
          <div className={`${styles.radioCards} ${styles.fourCards}`}>
            {sizes.map(([value, name, detail]) => (
              <label key={value} className={styles.radioCard}>
                <input type="radio" name="size" checked={profile.size === value} onChange={() => setProfile({ size: value })} />
                <strong>{name}</strong>{detail}
              </label>
            ))}
          </div>
        </fieldset>
        <div className={styles.field}>
          <span className={styles.label} id="jurisdictions-label">Where you operate</span>
          <div className={styles.choices} role="group" aria-labelledby="jurisdictions-label">
            {jurisdictionIds.map((id) => <Chip key={id} pressed={profile.jurisdictions.includes(id)} onClick={() => setProfile({ jurisdictions: toggle(profile.jurisdictions, id) })}>{jurisdictionNames[id]}</Chip>)}
          </div>
          <p className={styles.hint}>Australia is the default. Australian deadlines move practices up the roadmap when Australia is selected.</p>
        </div>
        <div className={styles.field}>
          <span className={styles.label} id="regulated-label">Regulatory status</span>
          <div className={styles.choices} role="group" aria-labelledby="regulated-label">
            {regulatedFlags.map((id) => <Chip key={id} pressed={profile.regulated.includes(id)} onClick={() => setProfile({ regulated: toggle(profile.regulated, id) })}>{regulatedNames[id]}</Chip>)}
          </div>
        </div>
        <div className={styles.field}>
          <span className={styles.label} id="systems-label">Kinds of AI you use or plan to use</span>
          <div className={styles.choices} role="group" aria-labelledby="systems-label">
            {systemTypeIds.map((id) => <Chip key={id} pressed={profile.systemTypes.includes(id)} onClick={() => setProfile({ systemTypes: toggle(profile.systemTypes, id) })}>{systemTypes[id].name}</Chip>)}
          </div>
          <p className={styles.hint}>Practices that do not apply to the kinds of AI you use are ranked lower on the roadmap.</p>
        </div>
        <fieldset className={styles.field}>
          <legend className={styles.label}>Appetite for AI risk</legend>
          <div className={styles.radioCards}>
            {appetites.map(([value, name, detail]) => (
              <label key={value} className={styles.radioCard}>
                <input type="radio" name="appetite" checked={profile.riskAppetite === value} onChange={() => setProfile({ riskAppetite: value })} />
                <strong>{name}</strong>{detail}
              </label>
            ))}
          </div>
        </fieldset>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="org-notes">Anything else your agent should know</label>
          <textarea id="org-notes" className={styles.textarea} value={profile.notes ?? ''} maxLength={1000} onChange={(event) => setProfile({ notes: event.target.value || undefined })} placeholder="For example: we are mid-way through an ISO/IEC 42001 certification; our AI steering committee meets monthly." />
          <p className={styles.hint}>Do not include personal information or anything confidential.</p>
        </div>
        <p className={styles.saved} role="status">Saved in this browser as you type.</p>
      </form>
    </Page>
  )
}
