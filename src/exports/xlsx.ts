/*
 * Spreadsheet export, loaded only when a user asks for a download. Sheets are
 * plain tables with a frozen, styled header and wrapped text.
 */
export type Sheet = { name: string; columns: { header: string; key: string; width?: number }[]; rows: Record<string, string | number | { text: string; hyperlink: string }>[] }

export async function downloadWorkbook(filename: string, sheets: Sheet[], notes: string[] = []) {
  const { default: ExcelJS } = await import('exceljs')
  const workbook = new ExcelJS.Workbook()
  workbook.creator = 'AI Trust Atlas'
  workbook.created = new Date()
  for (const sheet of sheets) {
    const worksheet = workbook.addWorksheet(sheet.name.slice(0, 31), { views: [{ state: 'frozen', ySplit: 1 }] })
    worksheet.columns = sheet.columns.map((column) => ({ header: column.header, key: column.key, width: column.width ?? 24 }))
    sheet.rows.forEach((row) => worksheet.addRow(row))
    const header = worksheet.getRow(1)
    header.font = { bold: true, color: { argb: 'FFFFFFFF' } }
    header.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0B1220' } }
    header.alignment = { vertical: 'middle' }
    worksheet.eachRow((row, index) => { if (index > 1) row.alignment = { wrapText: true, vertical: 'top' } })
    worksheet.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: sheet.columns.length } }
  }
  if (notes.length) {
    const about = workbook.addWorksheet('About')
    about.columns = [{ header: 'About this export', key: 'note', width: 120 }]
    notes.forEach((note) => about.addRow({ note }))
    about.getRow(1).font = { bold: true }
  }
  const buffer = await workbook.xlsx.writeBuffer()
  const url = URL.createObjectURL(new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }))
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 2000)
}
