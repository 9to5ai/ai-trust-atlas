import { render, fireEvent, screen, cleanup } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useSheetDismiss } from './useSheetDismiss'
function Sheet({close}:{close:()=>void}){const sheet=useSheetDismiss(close);return <aside ref={sheet.ref} data-testid="sheet"><button className="mobile-inspector-peek">Handle</button><p>Scrollable content</p><button>Content action</button></aside>}
afterEach(()=>{cleanup();vi.unstubAllGlobals()})
const mobile=()=>vi.stubGlobal('matchMedia',vi.fn((q:string)=>({matches:q.includes('max-width')})))
const swipe=(target:HTMLElement,dx=0,dy=130)=>{
 fireEvent.touchStart(target,{touches:[{clientX:100,clientY:100}]})
 fireEvent.touchMove(target,{touches:[{clientX:100+dx,clientY:100+dy}]})
 fireEvent.touchEnd(target,{touches:[]})
}
describe('mobile sheet dismissal',()=>{
 it('dismisses downwards from the top and lets the handle work when scrolled',()=>{
  mobile();const close=vi.fn();render(<Sheet close={close}/>);
  swipe(screen.getByText('Scrollable content'));expect(close).toHaveBeenCalledTimes(1)
  screen.getByTestId('sheet').scrollTop=120
  swipe(screen.getByText('Handle'));expect(close).toHaveBeenCalledTimes(2)
 })
 it('preserves scrolling and content actions and ignores upward, horizontal and short gestures',()=>{
  mobile();const close=vi.fn();render(<Sheet close={close}/>);
  const content=screen.getByText('Scrollable content')
  screen.getByTestId('sheet').scrollTop=120;swipe(content)
  screen.getByTestId('sheet').scrollTop=0;swipe(content,130,20);swipe(content,0,-120);swipe(content,0,20)
  swipe(screen.getByText('Content action'))
  expect(close).not.toHaveBeenCalled()
 })
 it('keeps a handle click available and captures only an actual pointer drag',()=>{
  mobile();vi.stubGlobal('PointerEvent',MouseEvent);const close=vi.fn();render(<Sheet close={close}/>);
  const sheet=screen.getByTestId('sheet'),handle=screen.getByText('Handle');
  sheet.setPointerCapture=vi.fn();sheet.hasPointerCapture=vi.fn(()=>false);
  fireEvent.pointerDown(handle,{button:0,clientX:100,clientY:100});
  expect(sheet.setPointerCapture).not.toHaveBeenCalled();
  fireEvent.pointerMove(handle,{clientX:100,clientY:130});
  expect(sheet.setPointerCapture).toHaveBeenCalledOnce();
 })
 it('does not dismiss on cancellation or on desktop',()=>{
  mobile();const close=vi.fn();render(<Sheet close={close}/>);
  const handle=screen.getByText('Handle')
  fireEvent.touchStart(handle,{touches:[{clientX:100,clientY:100}]})
  fireEvent.touchMove(handle,{touches:[{clientX:100,clientY:250}]})
  fireEvent.touchCancel(handle)
  expect(close).not.toHaveBeenCalled()
  vi.stubGlobal('matchMedia',()=>({matches:false}));swipe(handle)
  expect(close).not.toHaveBeenCalled()
 })
})
