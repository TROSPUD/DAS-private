import * as React from 'react'
import { ActionMenuButton, useHistory } from './../actions/'

export const HistoryMenu = React.memo(() => {
  const forHistory = useHistory()

  return (
    <>
      <ActionMenuButton action={forHistory.undo} />
      <ActionMenuButton action={forHistory.redo} />
    </>
  )
})
