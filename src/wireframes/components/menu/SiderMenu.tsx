import { useStore as useReduxStore } from 'react-redux'
import { useEventCallback } from '@app/core'
import { texts } from '@app/texts'
import {
  getDiagramId,
  addShape,
  ShapeInfo,
  getFilteredShapes,
  loadDiagramFromServer,
  RecentDiagram,
  useStore
} from '@app/wireframes/model'

import { Menu, Empty, Typography, Button } from 'antd'

import { ShapeImage } from '../assets/ShapeImage'
import { RootState, useAppDispatch } from '@app/store'
import { useEffect, useMemo } from 'react'
import { formatDistanceToNow } from 'date-fns'

import { RecentItem } from '../recent/RecentItem'
import { DownloadOutlined } from '@ant-design/icons'

export const SiderMenu = () => {
  const dispatch = useAppDispatch()
  const recent = useStore((x) => x.loading.recentDiagrams)

  const shapesFiltered = useStore(getFilteredShapes)
  const store = useReduxStore<RootState>()

  const doAdd = (shape: ShapeInfo) => {
    const selectedDiagramId = getDiagramId(store.getState())

    if (selectedDiagramId) {
      dispatch(
        addShape(selectedDiagramId, shape.name, {
          position: { x: 100, y: 100 }
        })
      )
    }
  }

  const doLoad = useEventCallback((item: RecentDiagram) => {
    dispatch(
      loadDiagramFromServer({
        tokenToRead: item.tokenToRead,
        tokenToWrite: item.tokenToWrite,
        navigate: true
      })
    )
  })

  const orderedRecent = useMemo(() => {
    const result = Object.entries(recent).map(([tokenToRead, value]) => {
      return { ...value, tokenToRead }
    })

    result.sort((lhs, rhs) => rhs.date - lhs.date)
    console.log(result, 'orderedRecent')
    return result
  }, [recent])

  return (
    <Menu
      mode="inline"
      style={{ border: 0 }}
      defaultOpenKeys={['shape', 'recent']}
    >
      <Menu.SubMenu key="shape" title="Shapes">
        {shapesFiltered.map((item) => (
          <Menu.Item key={item.name} style={{ height: '80px', paddingLeft: 0 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center'
              }}
              onDoubleClick={() => doAdd(item)}
            >
              <div style={{ flex: 6 }}>
                <ShapeImage shape={item} />
              </div>

              <div style={{ marginLeft: '10px', flex: 4 }}>
                {item.displayName}
              </div>
            </div>
          </Menu.Item>
        ))}
      </Menu.SubMenu>
      <Menu.SubMenu key="recent" title="Recent">
        {orderedRecent.map((item) => (
          <Menu.Item style={{ height: '80px', paddingLeft: 0 }} key={item.date}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ flex: 6 }}>
                <div style={{ paddingLeft: '40px' }}>
                  <Typography.Text strong>{item.tokenToRead}</Typography.Text>
                  <br />
                  <Typography.Text type="secondary">
                    {formatDistanceToNow(new Date(item.date), {
                      addSuffix: true
                    })}
                  </Typography.Text>
                </div>
              </div>
              <div>
                <Button onClick={() => doLoad(item)}>
                  <DownloadOutlined />
                </Button>
              </div>
            </div>
          </Menu.Item>
        ))}
        {orderedRecent.length === 0 && (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={texts.common.noRecentDocument}
          />
        )}
      </Menu.SubMenu>
    </Menu>
  )
}
