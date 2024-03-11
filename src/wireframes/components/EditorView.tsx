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
  const [menuVisible, setMenuVisible] = React.useState(false)
  const editor = useStore(getEditor)
  const editorColor = editor.color
  const editorSize = editor.size
  const masterDiagram = useStore(getMasterDiagram)
  const renderRef = React.useRef<any>()
  const selectedPoint = React.useRef({ x: 0, y: 0 })
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
    console.log(
      event.nativeEvent.offsetX,
      'x---',
      event.nativeEvent.offsetY,
      'y---'
    )
    selectedPoint.current = {
      x: event.nativeEvent.offsetX,
      y: event.nativeEvent.offsetY
    }
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

  const w = sizeInPx(zoomedOuterWidth)
  const h = sizeInPx(zoomedOuterHeight)

  const padding = sizeInPx(spacing)

  return (
    // triggered by right-clicking
    <Dropdown
      menu={contextMenu}
      trigger={['contextMenu']}
      onOpenChange={setMenuVisible}
    >
      <div className="editor-view" onClick={doSetPosition}>
        <div
          className="editor-diagram"
          style={{ width: w, height: h, padding }}
          ref={renderRef}
        >
          <Editor
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
          />
        </div>
      </div>
    </Dropdown>
  )
}
