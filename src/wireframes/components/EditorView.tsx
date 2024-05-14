import { Dropdown } from 'antd'
import * as React from 'react'
import { DropTargetMonitor, useDrop } from 'react-dnd'
import { NativeTypes } from 'react-dnd-html5-backend'
import { findDOMNode } from 'react-dom'
import {
  loadImagesToClipboardItems,
  sizeInPx,
  useClipboard,
  useEventCallback
} from '@app/core'
import { useAppDispatch } from '@app/store'
import {
  addShape,
  changeItemsAppearance,
  Diagram,
  getDiagram,
  getDiagramId,
  getEditor,
  getMasterDiagram,
  getSelection,
  RendererService,
  selectItems,
  Transform,
  transformItems,
  useStore
} from '@app/wireframes/model'
import { Editor } from '@app/wireframes/renderer/Editor'
import { DiagramRef, ItemsRef } from '../model/actions/utils'
import { ShapeSource } from './../interface'
import { useContextMenu } from './context-menu'
import './EditorView.scss'
import { useEffect, useRef, useState } from 'react'

export interface EditorViewProps {
  // The spacing.
  spacing: number
}

export const EditorView = (props: EditorViewProps) => {
  const diagram = useStore(getDiagram)

  if (!diagram) {
    return null
  }

  return <EditorViewInner {...props} diagram={diagram} />
}

export const EditorViewInner = ({
  diagram,
  spacing
}: EditorViewProps & { diagram: Diagram }) => {
  const dispatch = useAppDispatch()
  const [menuVisible, setMenuVisible] = useState(false)
  const editor = useStore(getEditor)
  const editorColor = editor.color
  const editorSize = editor.size
  const masterDiagram = useStore(getMasterDiagram)
  const renderRef = useRef<any>()
  const selectedPoint = useRef({ x: 0, y: 0 })
  const selectedDiagramId = useStore(getDiagramId)
  const state = useStore((s) => s)
  const zoom = useStore((s) => s.ui.zoom)
  const zoomedSize = editorSize.mul(zoom)
  const contextMenu = useContextMenu(menuVisible)

  const doChangeItemsAppearance = useEventCallback(
    (diagram: DiagramRef, visuals: ItemsRef, key: string, value: any) => {
      dispatch(changeItemsAppearance(diagram, visuals, key, value))
    }
  )

  const doSelectItems = useEventCallback(
    (diagram: DiagramRef, items: ItemsRef) => {
      dispatch(selectItems(diagram, items))
    }
  )

  const doTransformItems = useEventCallback(
    (
      diagram: DiagramRef,
      items: ItemsRef,
      oldBounds: Transform,
      newBounds: Transform
    ) => {
      dispatch(transformItems(diagram, items, oldBounds, newBounds))
    }
  )

  const doSetPosition = useEventCallback((event: React.MouseEvent) => {
    selectedPoint.current = {
      x: event.nativeEvent.offsetX,
      y: event.nativeEvent.offsetY
    }
    console.log(selectedPoint.current, '<-----select point')
  })

  const [, drop] = useDrop({
    accept: [
      NativeTypes.URL,
      NativeTypes.FILE,
      NativeTypes.TEXT,
      'DND_ASSET',
      'DND_ICON'
    ],
    drop: async (item: any, monitor: DropTargetMonitor) => {
      if (!monitor || !renderRef.current || !selectedDiagramId) {
        return
      }

      let offset = monitor.getSourceClientOffset()

      if (!offset) {
        offset = monitor.getClientOffset()
      }

      if (!offset) {
        return
      }
      const componentRect = (findDOMNode(
        renderRef.current
      ) as HTMLElement)!.getBoundingClientRect()

      let x = ((offset?.x || 0) - spacing - componentRect.left) / zoom
      let y = ((offset?.y || 0) - spacing - componentRect.top) / zoom

      dispatch(
        addShape(selectedDiagramId, item['name'], { position: { x, y } })
      )
    }
  })

  drop(renderRef)

  const zoomedOuterWidth = 2 * spacing + zoomedSize.x
  const zoomedOuterHeight = 2 * spacing + zoomedSize.y

  // store dimension of image
  const [imageSize, setImageSize] = useState({
    width: zoomedOuterWidth,
    height: zoomedOuterHeight
  })

  useEffect(() => {
    const img = new Image()

    img.onload = function (event) {
      let imgElement = event.target as HTMLImageElement
      setImageSize({
        width: imgElement.naturalWidth,
        height: imgElement.naturalHeight
      })
    }

    img.src = editor.backgroundImg || '' // 你的图片url
  }, [editor.backgroundImg]) // 当图片url发生变化时重新运行useEffect

  // 计算新的editorSize

  const newEditorHeight = editorSize.x * (imageSize.height / imageSize.width)
  editorSize.y = newEditorHeight

  // 计算新的宽高
  const newZommedHeight = zoomedSize.x * (imageSize.height / imageSize.width)
  zoomedSize.y = newZommedHeight
  const newOuterZoomHeight = zoomedSize.y + 2 * spacing

  const w = sizeInPx(zoomedOuterWidth)
  const h = sizeInPx(newOuterZoomHeight)

  console.log(
    editorSize,
    zoomedSize,
    newOuterZoomHeight,
    newEditorHeight,
    '<---editor size'
  )

  const padding = sizeInPx(spacing)

  return (
    // triggered by right-clicking
    <Dropdown
      menu={contextMenu}
      trigger={['contextMenu']}
      onOpenChange={setMenuVisible}
    >
      <div className="editor-view">
        <div
          className="editor-diagram"
          style={{ width: w, height: h, padding }}
          ref={renderRef}
        >
          <Editor
            backgroundImg={editor.backgroundImg || ''}
            color={editorColor}
            diagram={diagram}
            masterDiagram={masterDiagram}
            onChangeItemsAppearance={doChangeItemsAppearance}
            onSelectItems={doSelectItems}
            onTransformItems={doTransformItems}
            selectionSet={getSelection(state)}
            viewSize={editor.size}
            zoom={zoom}
            zoomedSize={zoomedSize}
            isDefaultView={true}
            doSetPosition={doSetPosition}
          />
        </div>
      </div>
    </Dropdown>
  )
}
