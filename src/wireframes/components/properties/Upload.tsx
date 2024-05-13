import { UploadOutlined } from '@ant-design/icons'
import { changeBackgroundImg } from '@app/wireframes/model/actions/diagrams'
import { useAppDispatch } from '@app/store'

import { Button, message } from 'antd'

export const UploadImage = () => {
  const dispatch = useAppDispatch()

  const handleChangeBackground = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files ? event.target.files[0] : null
    if (file) {
      // 将文件对象转换为Base64编码
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        const base64 = reader.result as string
        message.success(`${file.name} file read successfully`)
        // 使用dispatch调用reducer更改背景图片
        dispatch(changeBackgroundImg(base64))
      }
      reader.onerror = (error) => {
        message.error(`Failed to read file: ${error}`)
      }
    }
  }

  return (
    <>
      <>
        <input
          type="file"
          accept="image/png, image/jpeg"
          style={{ display: 'none' }}
          id="backgroundImageUpload"
          onChange={handleChangeBackground}
        />
        <Button
          icon={<UploadOutlined />}
          onClick={() =>
            document.getElementById('backgroundImageUpload')?.click()
          }
        >
          Click to Upload
        </Button>
      </>
    </>
  )
}
