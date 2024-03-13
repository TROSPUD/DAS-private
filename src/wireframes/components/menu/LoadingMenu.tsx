import { Title } from '@app/core'
import { texts } from '@app/texts'
import { useStore } from '@app/wireframes/model'
import { ActionMenuButton, buildMenuItem, useLoading } from './../actions'
import { memo, useEffect, useRef } from 'react'

export const LoadingMenu = memo(() => {
  const forLoading = useLoading()
  const editor = useStore((s) => s.editor)
  const tokenToRead = useStore((s) => s.loading.tokenToRead)
  const tokenToWrite = useStore((s) => s.loading.tokenToWrite)
  const saveTimer = useRef<any>()
  const saveAction = useRef(forLoading.saveDiagram)

  saveAction.current = forLoading.saveDiagram

  useEffect(() => {
    function clearTimer() {
      if (saveTimer.current) {
        clearInterval(saveTimer.current)
        saveTimer.current = null
      }
    }

    if (tokenToWrite) {
      if (!saveTimer.current) {
        saveTimer.current = setInterval(() => {
          if (!saveAction.current.disabled) {
            saveAction.current.onAction()
          }
        }, 30000)
      }

      const stopTimer = setTimeout(() => {
        clearTimer()
      }, 40000)

      return () => {
        clearTimeout(stopTimer)
      }
    } else {
      clearTimer()

      return undefined
    }
  }, [tokenToWrite, editor])

  return (
    <>
      {/* <CustomTitle token={tokenToRead} /> */}

      <ActionMenuButton displayMode="Icon" action={forLoading.newDiagram} />
      <ActionMenuButton
        displayMode="Icon"
        action={forLoading.openDiagramAction}
      />
      <ActionMenuButton
        displayMode="Icon"
        action={forLoading.saveDiagramToFile}
      />

      <ActionMenuButton
        style={{ marginLeft: '0.25rem', marginRight: '0.25rem' }}
        displayMode="Label"
        type="primary"
        action={forLoading.saveDiagram}
      />
      <ActionMenuButton
        style={{ marginLeft: '0.25rem', marginRight: '0.25rem' }}
        displayMode="Label"
        type="primary"
        action={forLoading.generateSolution}
      />
    </>
  )
})

// const CustomTitle = React.memo(({ token }: { token?: string | null }) => {
//   const title =
//     token && token.length > 0
//       ? `mydraft.cc - Diagram ${token}`
//       : `mydraft.cc - Diagram ${texts.common.unsaved}`

//   return <Title text={title} />
// })
