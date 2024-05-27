import { Collapse } from 'antd'
import { CollapseProps } from 'antd/lib'
import classNames from 'classnames'
import { texts } from '@app/texts'
import { getDiagram, getSelection, useStore } from '@app/wireframes/model'
import { CustomProperties } from './CustomProperties'
import { DiagramProperties } from './DiagramProperties'
import { TransformProperties } from './TransformProperties'
import { useEffect, useState } from 'react'

const layoutItems: CollapseProps['items'] = [
  {
    key: 'layout',
    label: texts.common.layout,
    children: (
      <>
        <TransformProperties />
      </>
    )
  },
  {
    key: 'custom',
    label: texts.common.custom,
    children: <CustomProperties />
  }
]

const scaleItems: CollapseProps['items'] = [
  {
    key: 'layout',
    label: texts.common.layout,
    children: (
      <>
        <TransformProperties />
      </>
    )
  },
  {
    key: 'length',
    label: texts.common.length,
    children: <CustomProperties />
  }
]

const diagramItems: CollapseProps['items'] = [
  {
    key: 'diagram',
    label: texts.common.diagram,
    children: <DiagramProperties />
  }
]

export const Properties = () => {
  const selectedItems = useStore(getSelection).selectedItems
  const hasSelection = selectedItems.length > 0
  const hasDiagram = !!useStore(getDiagram)
  const [hasOnlyLine, setOnlyLine] = useState(false)

  useEffect(() => {
    if (selectedItems.length === 1) {
      const onlyLine = selectedItems.some(
        (item) => item.values.renderer === 'HorizontalLine'
      )
      setOnlyLine(onlyLine)
    }
  }, [selectedItems])

  return (
    <>
      <Collapse
        className={classNames({ hidden: !hasSelection || hasOnlyLine })}
        items={layoutItems}
        bordered={false}
        defaultActiveKey={['layout', 'custom']}
      />
      {/* collapse for horizontal line */}
      <Collapse
        className={classNames({
          hidden: !hasOnlyLine || (!hasSelection && hasDiagram)
        })}
        items={scaleItems}
        bordered={false}
        defaultActiveKey={['layout', 'length']}
      />
      <Collapse
        className={classNames({
          hidden: hasSelection || !hasDiagram
        })}
        items={diagramItems}
        bordered={false}
        defaultActiveKey={['diagram', 'colors']}
      />
    </>
  )
}
