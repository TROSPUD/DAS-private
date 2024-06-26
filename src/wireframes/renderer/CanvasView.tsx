import * as svg from '@svgdotjs/svg.js'
import * as React from 'react'
import { Rect2, sizeInPx, Vec2 } from '@app/core'
import { useEffect } from 'react'

export interface CanvasViewProps {
  // The zoomed width of the canvas.
  zoomedSize: Vec2

  // The optional viewbox.
  viewBox?: Rect2

  // The view size.
  viewSize: Vec2

  // The zoom value of the canvas.
  zoom: number

  // The class name.
  className?: string

  // The backgroud Image.
  backgroundImg?: string

  // The callback when the canvas has been initialized.
  onInit: (scope: svg.Svg) => any
}

export const CanvasView = (props: CanvasViewProps) => {
  const {
    className,
    onInit,
    viewBox,
    viewSize,
    zoom,
    zoomedSize,
    backgroundImg
  } = props

  const [document, setDocument] = React.useState<svg.Svg>()

  const doInit = React.useCallback((ref: HTMLDivElement) => {
    if (!ref) {
      return
    }

    const doc = svg
      .SVG()
      .addTo(ref)
      .css({ position: 'relative', overflow: 'visible' })
      .attr('tabindex', 0)

    setDocument(doc)
  }, [])

  useEffect(() => {
    if (document && onInit) {
      onInit(document)
    }
  }, [document, onInit])

  useEffect(() => {
    if (document) {
      const x = viewBox?.x || 0
      const y = viewBox?.y || 0
      const w = viewBox ? viewBox.w : viewSize.x
      const h = viewBox ? viewBox.h : viewSize.y
      document.size(zoomedSize.x, zoomedSize.y).viewbox(x, y, w, h)
    }
  }, [viewSize, viewBox, zoom, zoomedSize, document])

  const w = sizeInPx(zoomedSize.x)
  const h = sizeInPx(zoomedSize.y)

  return (
    <div
      className={className}
      style={{
        width: w,
        height: h,
        backgroundImage: `url(${backgroundImg})`,
        backgroundSize: 'cover'
      }}
      ref={doInit}
    />
  )
}
