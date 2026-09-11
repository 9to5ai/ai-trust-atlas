import {afterEach,it,expect,vi} from 'vitest'
import handler from '../api/framework-draft'
const call=async(method:string,headers:Record<string,string>={},body?:unknown)=>{let value='';const res={setHeader:vi.fn(),statusCode:0,end:(s:string)=>{value=s}};await handler({method,headers,body} as any,res as any);return {status:res.statusCode,body:JSON.parse(value)}}
afterEach(()=>vi.unstubAllEnvs())
it('fails closed without configuration',async()=>{vi.stubEnv('GEMINI_API_KEY','');vi.stubEnv('FRAMEWORK_AI_ACCESS_CODE','');expect((await call('GET')).body.configured).toBe(false);expect((await call('POST')).status).toBe(503)})
it('rejects unauthorised and cross-origin drafting before model use',async()=>{vi.stubEnv('GEMINI_API_KEY','test');vi.stubEnv('FRAMEWORK_AI_ACCESS_CODE','owner');expect((await call('POST',{'x-framework-access':'wrong'})).status).toBe(401);expect((await call('POST',{'x-framework-access':'owner',origin:'https://other.test',host:'atlas.test'})).status).toBe(403);expect((await call('POST',{'x-framework-access':'owner'},{})).status).toBe(400)})
