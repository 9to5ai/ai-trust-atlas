import { fireEvent, render, screen, cleanup } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { StageToggle, ThemeToggle } from './ThemeToggle'
beforeEach(()=>{localStorage.clear();document.documentElement.removeAttribute('data-theme');document.documentElement.removeAttribute('data-stage');document.head.innerHTML='<meta name="theme-color" content="#05080f">'})
afterEach(()=>{cleanup();vi.restoreAllMocks();document.documentElement.removeAttribute('data-theme')})
describe('observatory and paper themes',()=>{
 it('opens in the Observatory theme, switches both ways and persists the choice across a fresh mount',()=>{
  const view=render(<ThemeToggle/>);
  expect(document.documentElement.dataset.theme).toBe('dark')
  fireEvent.click(screen.getByRole('button',{name:'Switch to light mode'}))
  expect(document.documentElement.dataset.theme).toBe('light')
  expect(document.querySelector('meta[name="theme-color"]')).toHaveAttribute('content','#f5f3ec')
  expect(localStorage.getItem('atlas-theme')).toBe('light')
  view.unmount();render(<ThemeToggle/>);
  expect(screen.getByRole('button',{name:'Switch to dark mode'})).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button',{name:'Switch to dark mode'}))
  expect(document.documentElement.dataset.theme).toBe('dark')
  expect(localStorage.getItem('atlas-theme')).toBe('dark')
  expect(document.querySelector('meta[name="theme-color"]')).toHaveAttribute('content','#05080f')
 })
 it('still switches when browser storage is unavailable',()=>{
  vi.spyOn(Storage.prototype,'getItem').mockImplementation(()=>{throw new Error('blocked')})
  vi.spyOn(Storage.prototype,'setItem').mockImplementation(()=>{throw new Error('blocked')})
  render(<ThemeToggle/>);fireEvent.click(screen.getByRole('button',{name:'Switch to light mode'}))
  expect(document.documentElement.dataset.theme).toBe('light')
 })
})
describe('stage mode',()=>{
 it('toggles from the button and the S key, but not while typing',()=>{
  render(<><StageToggle/><input aria-label="Notes"/></>)
  fireEvent.click(screen.getByRole('button',{name:'Enter stage mode'}))
  expect(document.documentElement).toHaveAttribute('data-stage')
  fireEvent.keyDown(window,{key:'s'})
  expect(document.documentElement).not.toHaveAttribute('data-stage')
  fireEvent.keyDown(screen.getByLabelText('Notes'),{key:'s'})
  expect(document.documentElement).not.toHaveAttribute('data-stage')
 })
})
