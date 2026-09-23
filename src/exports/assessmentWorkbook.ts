import { assessmentDisclaimer, assessmentItems, evidenceLabels, levels } from '../assess/content'
import { scoreAssessment } from '../assess/score'
import type { Assessment } from '../assess/store'
import { standardNotes } from './notes'

export async function downloadAssessmentWorkbook(assessment: Assessment) {
  const { default: ExcelJS } = await import('exceljs')
  const score = scoreAssessment(assessment)
  const workbook = new ExcelJS.Workbook()
  workbook.creator = 'AI Trust Atlas'
  const styleHeader = (sheet: import('exceljs').Worksheet) => {
    const header = sheet.getRow(1)
    header.font = { bold: true, color: { argb: 'FFFFFFFF' } }
    header.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0B1220' } }
    sheet.views = [{ state: 'frozen', ySplit: 1 }]
    sheet.eachRow((row, index) => { if (index > 1) row.alignment = { wrapText: true, vertical: 'top' } })
  }

  const ratings = workbook.addWorksheet('Assessment')
  ratings.columns = [{ header: 'Code', key: 'code', width: 9 }, { header: 'Control objective', key: 'name', width: 36 }, { header: 'Family', key: 'family', width: 22 }, { header: 'Current', key: 'current', width: 9 }, { header: 'Target', key: 'target', width: 9 }, { header: 'Gap', key: 'gap', width: 7 }, { header: 'Evidence', key: 'evidence', width: 14 }, { header: 'Notes', key: 'notes', width: 50 }]
  for (const item of assessmentItems) {
    const response = assessment.responses[item.control.id]
    ratings.addRow({ code: item.control.code, name: item.control.name, family: item.familyName, current: response?.current ?? '', target: response?.target ?? '', gap: response?.current !== undefined && response?.target !== undefined ? response.target - response.current : '', evidence: evidenceLabels[response?.evidence ?? 'not-requested'], notes: response?.notes ?? '' })
  }
  styleHeader(ratings)

  const requests = workbook.addWorksheet('Evidence requests')
  requests.columns = [{ header: 'Ref', key: 'ref', width: 10 }, { header: 'Control', key: 'control', width: 32 }, { header: 'Evidence requested', key: 'request', width: 46 }, { header: 'Owner', key: 'owner', width: 20 }, { header: 'Due', key: 'due', width: 12 }, { header: 'Status', key: 'status', width: 14 }, { header: 'Notes', key: 'notes', width: 40 }]
  assessmentItems.forEach((item) => item.evidenceRequests.forEach((request, index) => requests.addRow({ ref: `${item.control.code}.${index + 1}`, control: item.control.name, request, owner: item.control.roleArchetypes[0] ?? '', due: '', status: evidenceLabels[assessment.responses[item.control.id]?.evidence ?? 'not-requested'], notes: '' })))
  styleHeader(requests)
  for (let row = 2; row <= requests.rowCount; row++) requests.getCell(`F${row}`).dataValidation = { type: 'list', allowBlank: false, formulae: [`"${Object.values(evidenceLabels).join(',')}"`] }

  const gaps = workbook.addWorksheet('Priority gaps')
  gaps.columns = [{ header: 'Rank', key: 'rank', width: 7 }, { header: 'Control objective', key: 'name', width: 36 }, { header: 'Current', key: 'current', width: 9 }, { header: 'Target', key: 'target', width: 9 }, { header: 'Mapped provisions (Atlas interpretation)', key: 'links', width: 70 }]
  score.gaps.forEach((gap, index) => gaps.addRow({ rank: index + 1, name: `${gap.item.control.code} ${gap.item.control.name}`, current: gap.current, target: gap.target, links: gap.links.map((link) => `${link.instrument.shortTitle} ${link.provision.ref} — ${link.provision.title}`).join('\n') }))
  styleHeader(gaps)

  const about = workbook.addWorksheet('About')
  about.columns = [{ header: 'About this workbook', key: 'note', width: 120 }]
  ;[`${assessment.name}${assessment.example ? ' (example data)' : ''}`, assessment.scope, assessmentDisclaimer, `Scale: ${levels.map((level) => `${level.level} ${level.name}`).join(' · ')}`, ...standardNotes].forEach((note) => about.addRow({ note }))
  about.getRow(1).font = { bold: true }

  const buffer = await workbook.xlsx.writeBuffer()
  const url = URL.createObjectURL(new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }))
  const link = document.createElement('a')
  link.href = url
  link.download = `${assessment.name.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}-assessment.xlsx`
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 2000)
}
