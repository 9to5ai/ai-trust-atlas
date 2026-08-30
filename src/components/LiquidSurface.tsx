import type { CSSProperties, ReactNode } from 'react'
import LiquidGlass from 'liquid-glass-react'

type Props = {
  children: ReactNode
  className: string
  cornerRadius: number
  displacementScale?: number
  blurAmount?: number
  saturation?: number
  aberrationIntensity?: number
  elasticity?: number
}

const engineStyle: CSSProperties = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  width: '100%',
  height: '100%',
}

export function LiquidSurface({
  children,
  className,
  cornerRadius,
  displacementScale = 34,
  blurAmount = 0.12,
  saturation = 118,
  aberrationIntensity = 0.7,
  elasticity = 0.06,
}: Props) {
  return (
    <div className={`liquid-surface ${className}`}>
      <LiquidGlass
        className="liquid-surface-engine"
        style={engineStyle}
        padding="0"
        cornerRadius={cornerRadius}
        displacementScale={displacementScale}
        blurAmount={blurAmount}
        saturation={saturation}
        aberrationIntensity={aberrationIntensity}
        elasticity={elasticity}
        mode="standard"
      >
        {children}
      </LiquidGlass>
    </div>
  )
}
