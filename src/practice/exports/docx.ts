import { AlignmentType, BorderStyle, Document, HeadingLevel, Packer, Paragraph, ShadingType, Table, TableCell, TableRow, TextRun, WidthType } from 'docx'
import { domains, maturityLevels } from '../core/facets'
import { evidenceStatusNames, type EvidencePack } from '../core/evidence'

/* The evidence pack as a Word document, built in the browser. Loaded only when someone asks for it. */
const cellBorder = { style: BorderStyle.SINGLE, size: 4, color: 'C9CFDB' }
const borders = { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder }
const cell = (text: string, header = false) => new TableCell({
  borders,
  shading: header ? { type: ShadingType.CLEAR, color: 'auto', fill: 'EEF1F6' } : undefined,
  children: [new Paragraph({ children: [new TextRun({ text, bold: header, size: 18 })] })],
})

export async function evidencePackDocx(pack: EvidencePack): Promise<Blob> {
  const now = pack.roadmap.filter((item) => item.bucket === 'now')
  const children: (Paragraph | Table)[] = [
    new Paragraph({ heading: HeadingLevel.TITLE, children: [new TextRun(`AI trust evidence pack: ${pack.organisation}`)] }),
    new Paragraph({ children: [new TextRun({ text: `Prepared ${pack.generatedAt} with AI Trust Practice (corpus ${pack.corpusVersion}). General information, not legal or professional advice.`, italics: true, size: 18 })] }),
    new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun('Summary')] }),
    new Paragraph({ bullet: { level: 0 }, children: [new TextRun(`Practices assessed: ${pack.result.overall.rated} of ${pack.result.overall.total}${pack.result.overall.score !== undefined ? ` (average level ${pack.result.overall.score})` : ''}`)] }),
    new Paragraph({ bullet: { level: 0 }, children: [new TextRun(`Evidence: ${pack.counts.reviewed} reviewed, ${pack.counts.collected} collected, ${pack.counts.planned} planned, ${pack.counts.none} not started`)] }),
    new Paragraph({ bullet: { level: 0 }, children: [new TextRun(`Evidence produced with AI tools: ${pack.aiProduced}`)] }),
  ]
  if (now.length) {
    children.push(new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun('Priorities now')] }))
    for (const item of now) children.push(new Paragraph({ bullet: { level: 0 }, children: [new TextRun({ text: `${item.practiceId} ${item.title}`, bold: true }), new TextRun(` (owner: ${item.owner}). ${item.reasons[0]}`)] }))
  }
  children.push(new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun('Practices')] }))
  for (const practice of pack.practices) {
    children.push(new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(`${practice.id} ${practice.title}`)] }))
    children.push(new Paragraph({ children: [new TextRun({ text: `${domains[practice.domain].name} · ${practice.levelName ?? 'Not assessed'} → target ${maturityLevels[practice.target - 1].name} · ${practice.steps.done} of ${practice.steps.total} steps done`, size: 18 })] }))
    children.push(new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({ tableHeader: true, children: ['Test', 'What an auditor looks for', 'Status', 'Where it is', 'Notes', 'Provenance'].map((text) => cell(text, true)) }),
        ...practice.tests.map((test) => new TableRow({ children: [
          cell(`${test.id}: ${test.test}`),
          cell(test.expected),
          cell(evidenceStatusNames[test.status]),
          cell(test.location ?? ''),
          cell(test.note ?? ''),
          cell(test.provenance && (test.provenance.tool || test.provenance.model || test.provenance.reviewer)
            ? [test.provenance.tool, test.provenance.model, test.provenance.date, test.provenance.reviewer ? `reviewed by ${test.provenance.reviewer}` : 'not yet reviewed'].filter(Boolean).join(', ')
            : ''),
        ] })),
      ],
    }))
  }
  if (pack.gaps.length) {
    children.push(new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun('Gaps')] }))
    for (const gap of pack.gaps) children.push(new Paragraph({ bullet: { level: 0 }, children: [new TextRun(gap)] }))
  }
  children.push(new Paragraph({ alignment: AlignmentType.LEFT, children: [new TextRun({ text: 'Sign-off: ______________________    Date: ____________', size: 20 })] }))
  const document = new Document({ creator: 'AI Trust Practice', title: `AI trust evidence pack: ${pack.organisation}`, styles: { default: { document: { run: { font: 'Calibri', size: 20 } } } }, sections: [{ children }] })
  return Packer.toBlob(document)
}
