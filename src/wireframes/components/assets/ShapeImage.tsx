import * as React from 'react'
import { useDrag } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'
import { ShapeInfo } from '@app/wireframes/model'
import { ShapeRenderer } from '@app/wireframes/shapes/ShapeRenderer'
import { useEffect } from 'react'

interface ShapeImageProps {
  // The shape data.
  shape: ShapeInfo
}

const DESIRED_WIDTH = 80
const DESIRED_HEIGHT = 50

export const ShapeImage = React.memo((props: ShapeImageProps) => {
  const { shape } = props

  const [, drag, connectDragPreview] = useDrag({
    item: shape,
    previewOptions: {
      anchorX: 0,
      anchorY: 0
    },
    type: 'DND_ASSET'
  })

  useEffect(() => {
    connectDragPreview(getEmptyImage(), {
      anchorX: 0,
      anchorY: 0,
      captureDraggingState: true
    })
  }, [connectDragPreview])

  return (
    <div className="asset-shape-image">
      <ShapeRenderer
        ref={drag}
        desiredHeight={DESIRED_HEIGHT}
        desiredWidth={DESIRED_WIDTH}
        plugin={shape.plugin}
        usePreviewOffset
        usePreviewSize
      />
    </div>
  )
})
