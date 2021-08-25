import { Form, Input, Button, Checkbox, message } from 'antd'
import { RouteComponentProps } from 'react-router-dom'

import style from './style.module.less'
import { User } from '../../types'
import * as api from '../../services/api'

export default function Login(props: RouteComponentProps) {
  const [form] = Form.useForm()

  const onFinish = async (values: User) => {
    // console.log('formValue', values)

    let res = await api.login(values)
    console.log('res', res)
    if (res.stat === 'ok') {
      // message.info('登录成功')
      props.history.push('/home')
    } else message.error('用户名或密码输入错误，请重试')
  }

  const registry = async () => {
    let values = form.getFieldsValue()
    let res = await api.registry(values)
    if (res.stat === 'ok') {
      message.info('登录成功')
      props.history.push('/home')
    } else if (res.stat === 'Err_User_Exist') {
      message.error('用户已存在')
    } else console.log('注册错误', res.stat)
  }

  return (
    <div className={style.wrap}>
      <Form
        form={form}
        className={style.form}
        name="basic"
        labelCol={{ span: 8 }}
        // wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}>
        <div className={style.title}>登录</div>
        <Form.Item
          label="用户名"
          name="username"
          rules={[{ required: true, message: '请输入用户名' }]}>
          <Input maxLength={15} />
        </Form.Item>
        <Form.Item
          label="密码"
          name="password"
          rules={[{ required: true, message: '请输入密码' }]}>
          <Input.Password maxLength={30} />
        </Form.Item>
        <Form.Item
          name="remember"
          valuePropName="checked"
          wrapperCol={{ offset: 8, span: 16 }}>
          <Checkbox>记住密码</Checkbox>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8 }}>
          <Button type="primary" htmlType="submit" block>
            登录
          </Button>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8 }}>
          <Button type="default" onClick={registry} block>
            注册并登录
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}
