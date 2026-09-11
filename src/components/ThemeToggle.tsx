import { Moon, Sun } from '@phosphor-icons/react'
import { useLayoutEffect, useState } from 'react'
export function ThemeToggle() {
  const [dark,setDark]=useState(()=>{try{return localStorage.getItem('atlas-theme')==='dark'}catch{return false}})
  useLayoutEffect(()=>{
    const theme=dark?'dark':'light'
    document.documentElement.dataset.theme=theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content',dark?'#0b1422':'#f5f8fc')
    try{localStorage.setItem('atlas-theme',theme)}catch{/* Theme works even when storage is unavailable. */}
  },[dark])
  return <button className="theme-toggle" type="button" onClick={()=>setDark(value=>!value)} aria-label={dark?'Switch to light mode':'Switch to dark mode'} title={dark?'Light mode':'Dark mode'}>{dark?<Sun size={18}/>:<Moon size={18}/>}</button>
}
