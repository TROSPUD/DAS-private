import * as React from 'react'
import { ActionMenuButton, useScale } from './../actions/'

export const ScaleMenu = React.memo(() => {
  const forScale = useScale()

  return (
    <>
      <ActionMenuButton action={forScale.setScale} />
    </>
  )
})
