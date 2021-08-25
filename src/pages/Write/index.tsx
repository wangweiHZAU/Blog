import { useState } from 'react'
import { Editor } from '@bytemd/react'
import { Input, Form, Button, Row, Col, message } from 'antd'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { RouteComponentProps } from 'react-router-dom'
import gfm from '@bytemd/plugin-gfm'
import 'bytemd/dist/index.min.css'
import highlight from '@bytemd/plugin-highlight'

import Cover from '../../components/Cover'
import { IArticle } from '../../types'
import * as api from '../../services/api'
import './style.css'

const plugins = [gfm(), highlight()]

export default function Write(props: RouteComponentProps) {
  const [text, setText] = useState('')
  const [image, setImage] = useState('')
  const uploadImage = (imageUrl: string) => {
    setImage(imageUrl)
  }

  const publicArticle = async (values: any) => {
    if (values.title) {
      let article: IArticle = {
        title: values.title,
        subtitle: values.subtitle,
        tags: values.tag,
        content: text,
        banner: [image],
      }
      console.log('article', article)
      let res = await api.add(article)
      if (res.data.stat === 'ok') {
        message.info('文章添加成功！')
        props.history.push('/home')
      } else {
        message.error('文章添加失败')
        console.log('error', res)
      }
    }
    // else {
    //   // base event
    //   console.log(values)
    // }
  }

  return (
    <Form onFinish={publicArticle}>
      <Form.Item
        label="标题"
        name="title"
        rules={[{ required: true, message: '您的文章必须有一个标题' }]}>
        <Input style={{ width: '60%' }} maxLength={50} />
      </Form.Item>
      <Form.Item label="子标题" name="subtitle">
        <Input style={{ width: '40%' }} maxLength={100} />
      </Form.Item>
      <Form.List name="tag">
        {(fields, { add, remove }, { errors }) => (
          <Row>
            {fields.map((field, index) => (
              <Col span={index === 0 ? 5 : 4} key={field.key}>
                <Form.Item label={index === 0 ? '标签' : ''} required={true}>
                  <Form.Item
                    {...field}
                    validateTrigger={['onChange', 'onBlur']}
                    rules={[
                      {
                        required: true,
                        whitespace: true,
                        message: '请输入关键词或删除该标签',
                      },
                    ]}
                    noStyle>
                    <Input
                      placeholder="关键词"
                      style={{ width: '60%' }}
                      maxLength={10}
                    />
                  </Form.Item>
                  {fields.length > 1 ? (
                    <MinusCircleOutlined
                      className="dynamic-delete-button"
                      onClick={() => remove(field.name)}
                    />
                  ) : null}
                </Form.Item>
              </Col>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => {
                  if (fields.length < 5) add()
                  else message.warning('请不要添加超过五个标签')
                }}
                style={{ width: '100%' }}
                icon={<PlusOutlined />}>
                添加关键词
              </Button>
              <Form.ErrorList errors={errors} />
            </Form.Item>
          </Row>
        )}
      </Form.List>
      <Form.Item label="封面" name="image">
        <Cover setImage={uploadImage} defaultCover={image} key="cover" />
      </Form.Item>
      <Form.Item>
        <Editor
          value={text}
          plugins={plugins}
          onChange={(v) => {
            setText(v)
          }}
          maxLength={5000}
        />
      </Form.Item>
      <Form.Item>
        <Button htmlType="submit" type="primary" onClick={publicArticle}>
          发布文章
        </Button>
      </Form.Item>
    </Form>
  )
}
