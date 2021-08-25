import React from 'react'
import { Upload, message } from 'antd'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'

interface Props {
  defaultCover: string
  setImage: (imageUrl: string) => void
}

function getBase64(img: any, callback: any) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}

function beforeUpload(file: any) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng) {
    message.error('只支持上传JPG/PNG格式的图片！')
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('图像不能超过 2MB!')
  }
  return isJpgOrPng && isLt2M
}

export default class Cover extends React.Component<Props> {
  state = {
    imageUrl: '',
    loading: false,
  }

  handleChange = (info: any) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true })
      return
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (imageUrl: string) =>
        this.setState({
          imageUrl,
          loading: false,
        }),
      )
    }
  }

  render() {
    const { loading, imageUrl } = this.state
    // console.log('cover image', imageUrl)
    const uploadButton = this.props.defaultCover ? (
      <img
        src={this.props.defaultCover}
        alt="defaultCover"
        style={{ width: '100%', height: '100%', objectFit: 'scale-down' }}
      />
    ) : (
      <div>
        {loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div style={{ marginTop: 8 }}>点此上传</div>
      </div>
    )
    return (
      <Upload
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        action="/api/file/upload"
        beforeUpload={beforeUpload}
        onChange={this.handleChange}>
        {imageUrl ? (
          <img src={imageUrl} alt="image" style={{ width: '100%' }} />
        ) : (
          uploadButton
        )}
        {this.props.setImage(imageUrl)}
      </Upload>
    )
  }
}
