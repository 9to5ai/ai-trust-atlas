import PptxGenJS from 'pptxgenjs'
import { assessmentDisclaimer } from '../assess/content'
import { formatScore, obligationsForGaps, scoreAssessment } from '../assess/score'
import type { Assessment } from '../assess/store'
import type { Question } from '../data/leadershipQuestions'
import { questionsForNode } from '../data/nodeQuestions'
import { formatEventDate, upcomingEvents } from '../lib/horizon'

/*
 * Board pack as an editable PowerPoint: native text, tables and charts, so a
 * team can restyle it into a house template. Fonts are Georgia and Arial,
 * which are installed on client laptops.
 */
const ink = '0B1220', paper = 'FFFFFF', accent = '0B7FA6', muted = '56607A', rule = 'D9DDE6', soft = 'F3F5F9'
const title = { fontFace: 'Georgia', color: ink }
const body = { fontFace: 'Arial', color: ink }

export async function buildBoardPack(assessment: Assessment, briefQuestions: Question[] = []) {
  const score = scoreAssessment(assessment)
  const pptx = new PptxGenJS()
  pptx.layout = 'LAYOUT_WIDE'
  pptx.author = 'AI Trust Atlas'
  pptx.title = `AI readiness — ${assessment.name}`
  pptx.defineSlideMaster({
    title: 'ATLAS',
    background: { color: paper },
    objects: [
      { rect: { x: 0, y: 0, w: 0.12, h: 7.5, fill: { color: accent } } },
      { line: { x: 0.6, y: 6.9, w: 12.1, h: 0, line: { color: rule, width: 0.75 } } },
      { text: { text: `AI Trust Atlas · ${assessment.example ? 'Example data · ' : ''}For discussion — self-reported, not an assurance conclusion`, options: { x: 0.6, y: 6.95, w: 10, h: 0.35, fontFace: 'Arial', fontSize: 9, color: muted } } },
    ],
    slideNumber: { x: 12.3, y: 6.95, w: 0.5, h: 0.35, fontFace: 'Arial', fontSize: 9, color: muted },
  })
  const heading = (slide: PptxGenJS.Slide, text: string, kicker: string) => {
    slide.addText(kicker.toUpperCase(), { x: 0.6, y: 0.35, w: 12, h: 0.3, fontFace: 'Arial', fontSize: 10, color: accent, bold: true, charSpacing: 2 })
    slide.addText(text, { x: 0.6, y: 0.65, w: 12, h: 0.8, ...title, fontSize: 28 })
  }

  // 1. Cover
  const cover = pptx.addSlide()
  cover.background = { color: ink }
  cover.addShape(pptx.ShapeType.ellipse, { x: 8.6, y: -1.2, w: 6.5, h: 6.5, fill: { color: '123A55', transparency: 30 }, line: { color: '5EE4FF', width: 1, transparency: 40 } })
  cover.addText('AI READINESS', { x: 0.8, y: 1.6, w: 8, h: 0.4, fontFace: 'Arial', fontSize: 12, color: '5EE4FF', bold: true, charSpacing: 4 })
  cover.addText(assessment.name, { x: 0.8, y: 2.1, w: 8.8, h: 1.8, fontFace: 'Georgia', fontSize: 38, color: 'FFFFFF', valign: 'top' })
  cover.addText(assessment.scope || 'Scope to be confirmed', { x: 0.8, y: 4.0, w: 8.5, h: 0.9, fontFace: 'Arial', fontSize: 14, color: 'B9C3DB', valign: 'top' })
  cover.addText(`Prepared for discussion · ${new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}`, { x: 0.8, y: 5.6, w: 8, h: 0.4, fontFace: 'Arial', fontSize: 12, color: 'EEF2FB' })
  cover.addText(assessmentDisclaimer, { x: 0.8, y: 6.3, w: 11.5, h: 0.6, fontFace: 'Arial', fontSize: 9, color: '8B98B8' })

  // 2. Summary
  const summary = pptx.addSlide({ masterName: 'ATLAS' })
  heading(summary, 'Where we stand', 'Summary')
  const tiles: [string, string][] = [['Controls rated', `${score.rated}/${score.total}`], ['Current maturity', `${formatScore(score.current)} / 5`], ['Target maturity', `${formatScore(score.target)} / 5`], ['Below target', String(score.gaps.length)]]
  tiles.forEach(([label, value], index) => {
    const x = 0.6 + index * 3.05
    summary.addShape(pptx.ShapeType.rect, { x, y: 1.7, w: 2.85, h: 1.5, fill: { color: soft }, line: { color: rule, width: 0.75 } })
    summary.addText(value, { x: x + 0.2, y: 1.8, w: 2.5, h: 0.8, ...title, fontSize: 30 })
    summary.addText(label, { x: x + 0.2, y: 2.6, w: 2.5, h: 0.4, ...body, fontSize: 11, color: muted })
  })
  const messages = [
    score.gaps[0] ? `Largest priority gap: ${score.gaps[0].item.control.code} ${score.gaps[0].item.control.name} (${score.gaps[0].current} → ${score.gaps[0].target}).` : 'No control is rated below its target.',
    `${score.families.filter((family) => family.current !== undefined && family.target !== undefined && family.target - family.current >= 1).length} of 6 control families are a full level or more below target.`,
    `${score.evidence.filter((entry) => entry.status === 'reviewed').length} of ${score.total} controls have reviewed evidence; ratings elsewhere are unsupported self-assessment.`,
  ]
  summary.addText(messages.map((text) => ({ text, options: { bullet: true, breakLine: true } })), { x: 0.6, y: 3.6, w: 12, h: 2.6, ...body, fontSize: 16, paraSpaceAfter: 10, valign: 'top' })

  // 3. Maturity by family
  const families = pptx.addSlide({ masterName: 'ATLAS' })
  heading(families, 'Maturity by control family', 'Current and target')
  families.addChart(pptx.ChartType.bar, [
    { name: 'Current', labels: score.families.map((family) => family.family.name), values: score.families.map((family) => Number((family.current ?? 0).toFixed(1))) },
    { name: 'Target', labels: score.families.map((family) => family.family.name), values: score.families.map((family) => Number((family.target ?? 0).toFixed(1))) },
  ], { x: 0.6, y: 1.6, w: 12, h: 5.1, barDir: 'bar', barGrouping: 'clustered', chartColors: ['2A78D6', 'EB6834'], valAxisMaxVal: 5, valAxisMinVal: 0, valAxisMajorUnit: 1, showLegend: true, legendPos: 'b', showValue: true, dataLabelFontSize: 10, catAxisLabelFontFace: 'Arial', catAxisLabelFontSize: 12, valAxisLabelFontSize: 10, legendFontFace: 'Arial', legendFontSize: 11 })

  // 4. Priority gaps
  const gaps = pptx.addSlide({ masterName: 'ATLAS' })
  heading(gaps, 'Priority gaps', 'Where to focus')
  const header = ['Control objective', 'Now', 'Target', 'Obligations it maps to (Atlas interpretation)'].map((text) => ({ text, options: { bold: true, color: 'FFFFFF', fill: { color: ink } } }))
  const rows = score.gaps.slice(0, 6).map((gap) => [`${gap.item.control.code} ${gap.item.control.name}`, String(gap.current), String(gap.target), gap.links.slice(0, 4).map((link) => `${link.instrument.shortTitle} ${link.provision.ref}`).join('; ') || '—'])
  gaps.addTable([header, ...rows.map((row) => row.map((text) => ({ text })))], { x: 0.6, y: 1.6, w: 12.1, colW: [4.2, 0.9, 0.9, 6.1], fontFace: 'Arial', fontSize: 11, color: ink, border: { type: 'solid', color: rule, pt: 0.75 }, valign: 'middle', rowH: 0.55 })
  gaps.addNotes('Gaps are ordered by size, weighted by the number of risks and mapped obligations each control connects to. Mappings are Atlas interpretations drafted for review.')

  // 5. Obligations touched
  const obligations = obligationsForGaps(score.gaps)
  const touched = pptx.addSlide({ masterName: 'ATLAS' })
  heading(touched, 'Obligations touched by the top gaps', 'Crosswalk')
  obligations.slice(0, 6).forEach((entry, index) => {
    const x = 0.6 + (index % 3) * 4.05, y = 1.7 + Math.floor(index / 3) * 2.55
    touched.addShape(pptx.ShapeType.rect, { x, y, w: 3.85, h: 2.35, fill: { color: soft }, line: { color: rule, width: 0.75 } })
    touched.addText(entry.framework, { x: x + 0.15, y: y + 0.1, w: 3.5, h: 0.4, ...body, fontSize: 13, bold: true })
    touched.addText(entry.provisions.slice(0, 5).map((link) => ({ text: `${link.provision.ref} — ${link.provision.title}`, options: { bullet: true, breakLine: true } })), { x: x + 0.15, y: y + 0.55, w: 3.55, h: 1.7, ...body, fontSize: 10, valign: 'top' })
  })
  if (!obligations.length) touched.addText('No gaps with mapped obligations.', { x: 0.6, y: 1.8, w: 12, h: 0.5, ...body, fontSize: 14 })

  // 6. Horizon
  const horizon = pptx.addSlide({ masterName: 'ATLAS' })
  heading(horizon, 'What’s coming', 'Regulatory horizon')
  const upcoming = upcomingEvents(new Date().toISOString().slice(0, 10)).slice(0, 8)
  horizon.addTable([[{ text: 'When', options: { bold: true, color: 'FFFFFF', fill: { color: ink } } }, { text: 'What', options: { bold: true, color: 'FFFFFF', fill: { color: ink } } }, { text: 'Where', options: { bold: true, color: 'FFFFFF', fill: { color: ink } } }], ...upcoming.map((event) => [{ text: formatEventDate(event) }, { text: event.title }, { text: event.region }])], { x: 0.6, y: 1.6, w: 12.1, colW: [2, 8, 2.1], fontFace: 'Arial', fontSize: 12, color: ink, border: { type: 'solid', color: rule, pt: 0.75 }, rowH: 0.5 })

  // 7. Questions for the board
  const questions = briefQuestions.length ? briefQuestions.slice(0, 6) : score.gaps.slice(0, 5).flatMap((gap) => questionsForNode('control-objective', gap.item.control.id, 'board').slice(0, 1))
  const ask = pptx.addSlide({ masterName: 'ATLAS' })
  heading(ask, 'Questions for the board', briefQuestions.length ? 'From your meeting brief' : 'Suggested by the top gaps')
  ask.addText(questions.map((question) => ({ text: question.text, options: { bullet: { type: 'number' }, breakLine: true } })), { x: 0.6, y: 1.7, w: 12, h: 4.9, ...body, fontSize: 16, paraSpaceAfter: 12, valign: 'top' })

  // 8. Next steps
  const next = pptx.addSlide({ masterName: 'ATLAS' })
  heading(next, 'Next steps to consider', 'Plan')
  next.addText(score.gaps.slice(0, 5).map((gap) => ({ text: `${gap.item.control.code} ${gap.item.control.shortName}: ${gap.item.control.implementationExamples[0]}; request ${gap.item.evidenceRequests[0]?.toLowerCase() ?? 'supporting evidence'}.`, options: { bullet: true, breakLine: true } })), { x: 0.6, y: 1.7, w: 12, h: 4.9, ...body, fontSize: 15, paraSpaceAfter: 10, valign: 'top' })

  // 9. About
  const about = pptx.addSlide({ masterName: 'ATLAS' })
  heading(about, 'About this pack', 'Method and limitations')
  about.addText([
    { text: assessmentDisclaimer, options: { breakLine: true } },
    { text: 'Maturity scale: 0 Not started · 1 Initial · 2 Developing · 3 Defined · 4 Managed · 5 Optimising.', options: { breakLine: true } },
    { text: 'Control objectives are the AI Trust Atlas’s 24 neutral candidates. Obligation mappings are Atlas interpretations drafted for editorial review; they do not establish legal applicability or that a control satisfies a provision.', options: { breakLine: true } },
    { text: 'Regulatory dates are drawn from Atlas records; confirm against official sources before relying on them.' },
  ], { x: 0.6, y: 1.7, w: 12, h: 4.8, ...body, fontSize: 14, paraSpaceAfter: 14, valign: 'top' })
  return pptx
}

export async function downloadBoardPack(assessment: Assessment, briefQuestions: Question[] = []) {
  const pptx = await buildBoardPack(assessment, briefQuestions)
  await pptx.writeFile({ fileName: `${assessment.name.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}-board-pack.pptx` })
}
