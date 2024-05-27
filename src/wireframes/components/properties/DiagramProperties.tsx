import { Col, Row } from 'antd'
import * as React from 'react'
// import { useEventCallback } from '@app/core'
// import { useAppDispatch } from '@app/store'
import { texts } from '@app/texts'
// import { changeSize, getEditor, useStore } from '@app/wireframes/model'
// import { useEffect } from 'react'
import { UploadImage } from './Upload'

export const DiagramProperties = React.memo(() => {
  // const dispatch = useAppDispatch()
  // const editor = useStore(getEditor)
  // const editorSize = editor.size
  // const [sizeWidth, setWidth] = React.useState(0)
  // const [sizeHeight, setHeight] = React.useState(0)

  // useEffect(() => {
  //   setWidth(editorSize.x)
  //   setHeight(editorSize.y)
  // }, [editorSize])

  // const doChangeSize = useEventCallback(() => {
  //   dispatch(changeSize(sizeWidth, sizeHeight))
  // })

  return (
    <>
      {/* <Row className="property">
        <Col span={12} className="property-label">
          {texts.common.width}
        </Col>
        <Col span={12} className="property-value">
          <InputNumber
            value={sizeWidth}
            min={100}
            max={3000}
            onChange={setWidth as any}
            onBlur={doChangeSize}
          />
        </Col>
      </Row>

      <Row className="property">
        <Col span={12} className="property-label">
          {texts.common.height}
        </Col>
        <Col span={12} className="property-value">
          <InputNumber
            value={sizeHeight}
            min={100}
            max={3000}
            onChange={setHeight as any}
            onBlur={doChangeSize}
          />
        </Col>
      </Row> */}

      <Row className="property">
        <Col span={12} className="property-label">
          {texts.common.backgroundImg}
        </Col>
        <Col span={12} className="property-value">
          <UploadImage />
        </Col>
      </Row>
    </>
  )
})
