import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { Button, Layout, TabsProps } from 'antd'
import classNames from 'classnames'
import * as React from 'react'
import { useStore as useReduxStore } from 'react-redux'
import { useRouteMatch } from 'react-router'
import { ClipboardContainer, useEventCallback } from '@app/core'
import {
  ClipboardMenu,
  EditorView,
  HistoryMenu,
  LoadingMenu,
  Pages,
  Properties,
  Recent,
  Shapes,
  UIMenu
} from '@app/wireframes/components'
import {
  loadDiagramFromServer,
  newDiagram,
  toggleLeftSidebar,
  toggleRightSidebar,
  useStore
} from '@app/wireframes/model'
import { useAppDispatch } from './store'
import { texts } from './texts'
import { CustomDragLayer } from './wireframes/components/CustomDragLayer'
import { PresentationView } from './wireframes/components/PresentationView'
import { OverlayContainer } from './wireframes/contexts/OverlayContext'
import { useEffect, useRef, useState } from 'react'
import { SiderMenu } from './wireframes/components/menu/SiderMenu'

const { Header, Sider, Content } = Layout

export const App = () => {
  const dispatch = useAppDispatch()
  const route = useRouteMatch<{ token?: string }>()
  const routeToken = route.params.token || null
  const routeTokenSnapshot = useRef(routeToken)

  // const selectedTab = useStore((s) => s.ui.selectedTab)
  const showLeftSidebar = useStore((s) => s.ui.showLeftSidebar)
  const showRightSidebar = useStore((s) => s.ui.showRightSidebar)
  const [presenting, setPresenting] = useState(false)

  useEffect(() => {
    const token = routeTokenSnapshot.current

    if (token && token.length > 0) {
      dispatch(loadDiagramFromServer({ tokenToRead: token, navigate: false }))
    } else {
      dispatch(newDiagram(false))
    }
  }, [dispatch])

  const doToggleLeftSidebar = useEventCallback(() => {
    dispatch(toggleLeftSidebar())
  })

  const doToggleRightSidebar = useEventCallback(() => {
    dispatch(toggleRightSidebar())
  })

  const doEdit = useEventCallback(() => {
    setPresenting(false)
  })

  const doPresent = useEventCallback(() => {
    setPresenting(true)
  })

  return (
    // <OverlayContainer>
    <ClipboardContainer>
      <>
        <Layout className="screen-mode">
          <Header>
            <div className="top-menu">
              <img className="logo" src="logo.svg" alt="mydraft.cc" />
              <div>
                <HistoryMenu />
                <span className="menu-separator" />

                <ClipboardMenu />
                <span className="menu-separator" />

                <UIMenu onPlay={doPresent} />
              </div>

              <div>
                <LoadingMenu />
              </div>
            </div>
          </Header>
          <Layout className="content">
            <Sider
              width={320}
              className="sidebar-left"
              collapsed={!showLeftSidebar}
              collapsedWidth={0}
            >
              <SiderMenu />
            </Sider>
            <Content className="editor-content">
              <EditorView spacing={40} />
            </Content>
            <Sider
              width={330}
              className="sidebar-right"
              collapsed={!showRightSidebar}
              collapsedWidth={0}
            >
              <Properties />
            </Sider>
            <Button
              icon={showLeftSidebar ? <LeftOutlined /> : <RightOutlined />}
              className={classNames('toggle-button-left', {
                visible: showLeftSidebar
              })}
              size="small"
              shape="circle"
              onClick={doToggleLeftSidebar}
            />

            <Button
              icon={showRightSidebar ? <RightOutlined /> : <LeftOutlined />}
              className={classNames('toggle-button-right', {
                visible: showRightSidebar
              })}
              size="small"
              shape="circle"
              onClick={doToggleRightSidebar}
            />
          </Layout>
        </Layout>

        {presenting && <PresentationView onClose={doEdit} />}

        <CustomDragLayer />
      </>
    </ClipboardContainer>
    // </OverlayContainer>
  )
}
