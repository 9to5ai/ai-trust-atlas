import { clearedCookies } from './_lib/auth'
import { json } from './_lib/http'

/* POST /api/practice/logout — clears the session on this device. */
export const handleLogout = () => json(200, { ok: true }, clearedCookies().map((cookie) => ['set-cookie', cookie] as [string, string]))
export const POST = () => handleLogout()
