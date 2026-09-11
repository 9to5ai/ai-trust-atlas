import { questionCoverageIssues } from '../src/lib/questionCoverage'
import { questionNodes } from '../src/data/nodeQuestions'
import { developments } from '../src/data/developments'
const issues = questionCoverageIssues()
if (issues.length) {
  console.error(`Question coverage failed:\n${issues.join('\n')}`)
  process.exitCode = 1
} else {
  console.log(`Question coverage passed: ${questionNodes.length} Atlas cards and ${developments.length} developments; all three audiences.`)
}
