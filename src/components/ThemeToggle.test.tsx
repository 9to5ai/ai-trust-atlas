import { fireEvent, render, screen, cleanup } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ThemeToggle } from './ThemeToggle'
beforeEach(()=>{localStorage.clear();document.documentElement.removeAttribute('data-theme');document.head.innerHTML='<meta name="theme-color" content="#f5f8fc">'})
afterEach(()=>{cleanup();vi.restoreAllMocks();document.documentElement.removeAttribute('data-theme')})
describe('light and dark theme',()=>{
 it('switches both directions and persists the selection across a fresh mount',()=>{
  const view=render(<ThemeToggle/>);
  expect(document.documentElement.dataset.theme).toBe('light')
  fireEvent.click(screen.getByRole('button',{name:'Switch to dark mode'}))
  expect(document.documentElement.dataset.theme).toBe('dark')
  expect(document.querySelector('meta[name="theme-color"]')).toHaveAttribute('content','#0b1422')
  expect(localStorage.getItem('atlas-theme')).toBe('dark')
  view.unmount();render(<ThemeToggle/>);
  expect(screen.getByRole('button',{name:'Switch to light mode'})).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button',{name:'Switch to light mode'}))
  expect(document.documentElement.dataset.theme).toBe('light')
  expect(localStorage.getItem('atlas-theme')).toBe('light')
  expect(document.querySelector('meta[name="theme-color"]')).toHaveAttribute('content','#f5f8fc')
 })
 it('still switches when browser storage is unavailable',()=>{
  vi.spyOn(Storage.prototype,'getItem').mockImplementation(()=>{throw new Error('blocked')})
  vi.spyOn(Storage.prototype,'setItem').mockImplementation(()=>{throw new Error('blocked')})
  render(<ThemeToggle/>);fireEvent.click(screen.getByRole('button',{name:'Switch to dark mode'}))
  expect(document.documentElement.dataset.theme).toBe('dark')
 })
})
