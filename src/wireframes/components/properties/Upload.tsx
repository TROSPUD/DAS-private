import { UploadOutlined } from '@ant-design/icons'
import { useEventCallback } from '@app/core'
import { changeBackgroundImg } from '@app/wireframes/model/actions/diagrams'
import { useAppDispatch } from '@app/store'

import { Button, message, Upload } from 'antd'
import type { UploadProps } from 'antd'

export const UploadImage = () => {
  const dispatch = useAppDispatch()

  const props: UploadProps = {
    name: 'file',
    action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
    headers: {
      authorization: 'authorization-text'
    }
  }

  const getBase64 = (file: any): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })

  const doChangeBackgroundImg = useEventCallback((backgroundImg: string) => {
    dispatch(changeBackgroundImg(backgroundImg))
  })

  return (
    <Upload
      {...props}
      maxCount={1}
      accept="image/png, image/jpeg"
      onChange={async (info) => {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList)
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} file uploaded successfully`)
          const base = await getBase64(info.file.originFileObj)
          doChangeBackgroundImg(base)
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`)
        }
      }}
    >
      <Button icon={<UploadOutlined />}>Click to Upload</Button>
    </Upload>
  )
}
