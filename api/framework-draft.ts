import { createHash, timingSafeEqual } from 'node:crypto'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { parseDraftRequest, generateDraft } from '../server/framework-ai.js'
export const config = { maxDuration: 60 }
export default async function handler(req: IncomingMessage & {body?:unknown}, res: ServerResponse) {
  res.setHeader('Cache-Control','no-store');res.setHeader('Content-Type','application/json')
  const send=(status:number,body:unknown)=>{res.statusCode=status;res.end(JSON.stringify(body))}
  const configured=!!(process.env.GEMINI_API_KEY && process.env.FRAMEWORK_AI_ACCESS_CODE)
  if(req.method==='GET')return send(200,{configured})
  if(req.method!=='POST'){res.setHeader('Allow','GET, POST');return send(405,{error:'Method not allowed.'})}
  if(!configured)return send(503,{error:'AI drafting is not configured yet. You can continue editing and exporting your framework.'})
  const origin=req.headers.origin
  if(origin && origin!==`https://${req.headers.host}` && origin!==`http://${req.headers.host}`)return send(403,{error:'Use AI drafting from the Atlas workspace.'})
  const code=req.headers['x-framework-access']
  if(typeof code!=='string'||code.length>200||!timingSafeEqual(new Uint8Array(createHash('sha256').update(code).digest()),new Uint8Array(createHash('sha256').update(process.env.FRAMEWORK_AI_ACCESS_CODE!).digest())))return send(401,{error:'Enter the AI access code provided by the Atlas owner.'})
  if(Number(req.headers['content-length']??0)>70000)return send(413,{error:'Request too large.'})
  let workspace
  try {workspace=parseDraftRequest(typeof req.body==='string'?JSON.parse(req.body):req.body)} catch(error){return send(400,{error:error instanceof Error?error.message:'Invalid request.'})}
  try {return send(200,{draft:await generateDraft(workspace,process.env.GEMINI_API_KEY!,process.env.GEMINI_MODEL||'gemini-2.5-flash')})}
  catch(error){return send(502,{error:error instanceof Error && !/JSON|Unexpected|position/i.test(error.message)?error.message:'The AI response could not be validated. Your framework has not changed.'})}
}
