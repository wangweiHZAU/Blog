import { useEffect, useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Button, Card, Form, message, Table, Input, Dropdown, Menu } from 'antd'
import * as api from '../../services/api'
import Cover from '../../components/Cover'
import { NumToStr } from '../../components/Time'
import { UserInfo, ArticleInfo, IArticle } from '../../types'

import style from './style.module.less'
import { SettingOutlined } from '@ant-design/icons'

export default function User(props: RouteComponentProps) {
  const [user, setUser] = useState<UserInfo>()
  const [articles, setArticles] = useState<ArticleInfo[]>()
  const [image, setImage] = useState<string>('')
  const [end, setEnd] = useState<boolean>(false)
  const [pageSize] = useState<number>(20)
  const [pageIdx, setPageIdx] = useState<number>(1)

  const userBaseInfo = async () => {
    let res = await api.getUserInfo()
    if (res.data.stat === 'ok' && res.data.data) {
      const userInfo: UserInfo = res.data.data
      setUser(userInfo)
    } else if (res.data.stat === 'Err_Token_Not_Found') {
      message.error('登录失效')
      props.history.push('/login')
    } else {
      console.log('UserRes', res.data)
    }
  }

  const getArticles = async () => {
    if (!end) {
      let res = await api.searchOwner(pageIdx, pageSize)
      if (res.data.stat === 'ok') {
        console.log('articles', res.data.data.items)
        setArticles(res.data.data.items)

        if (res.data.data.items.length <= pageSize) {
          setEnd(!end)
        } else {
          setPageIdx(pageIdx + 1)
        }
      } else {
        message.error('获取文章信息失败')
      }
    }
  }

  const uploadImage = (img: string) => {
    setImage(img)
  }

  const updateInfo = async (values: { nickname: string }) => {
    let res = await api.updateInfo({ nickname: values.nickname, avatar: image })
    if (res.data.stat === 'ok') {
      message.success('信息更新成功')
    } else if (res.data.stat === 'Err_Token_Not_Found') {
      message.error('信息更新失败，请登录')
      props.history.push('/login')
    }
  }

  const deleteArticle = async (id: string) => {
    let res = await api.delArticle(id)
    if (res.data.stat === 'ok') {
      message.success('删除成功')
      getArticles()
    } else if (res.data.stat === 'Err_Token_Not_Found') {
      message.info('请先登录')
      props.history.push('/login')
    } else {
      message.error('删除失败')
      console.log('deleteErr', res.data)
    }
  }

  useEffect(() => {
    userBaseInfo()
    getArticles()
  }, [])

  const columns = [
    {
      title: '文章标题',
      dataIndex: 'title',
      align: 'center' as 'center',
      width: 150,
      ellipsis: true,
    },
    {
      title: '标签',
      dataIndex: 'tags',
    },
    {
      title: '创建时间',
      dataIndex: 'ctime',
      render: (time: number) => NumToStr(time),
    },
    {
      title: '修改时间',
      dataIndex: 'mtime',
      render: (time: number) => NumToStr(time),
    },
    {
      title: '主题图片',
      dataIndex: 'banner',
      align: 'center' as 'center',
      render: (img: string[]) => (
        <img className={style.image} src={img[0]} alt="banner" />
      ),
    },
    {
      title: '内容',
      dataIndex: 'content',
      width: 300,
      ellipsis: true,
    },
    {
      title: '操作',
      render: (article: ArticleInfo) => {
        return (
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item
                  onClick={() => {
                    props.history.push(
                      `${props.match.url}/details/${article._id}`,
                    )
                  }}>
                  编辑
                </Menu.Item>
                <Menu.Item
                  onClick={() => {
                    deleteArticle(article._id)
                  }}>
                  删除
                </Menu.Item>
              </Menu>
            }>
            <Button icon={<SettingOutlined />} />
          </Dropdown>
        )
      },
    },
  ]

  return (
    <Form onFinish={updateInfo}>
      <Form.Item>账号：{user ? user.account : ''}</Form.Item>
      <Form.Item name="nickname" label="昵称：">
        <Input
          style={{ width: '60%' }}
          maxLength={50}
          value={user ? user.nickname : ''}
        />
      </Form.Item>
      <Form.Item>
        头像：
        {user ? (
          <Cover setImage={uploadImage} defaultCover={user.avatar} />
        ) : (
          <Cover setImage={uploadImage} defaultCover="" />
        )}
      </Form.Item>
      <Form.Item>账号创建时间：{user ? NumToStr(user.ctime) : ''}</Form.Item>
      <Form.Item>
        <Button htmlType="submit" type="primary">
          保存修改
        </Button>
      </Form.Item>
      <Table
        dataSource={articles}
        columns={columns}
        rowKey={(article: ArticleInfo) => {
          return article._id
        }}
      />
    </Form>
  )

  //   return  <Card
  //   hoverable
  //   style={{ width: 240 }}
  //   cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
  // >
  //   <Card.Meta title="Europe Street beat" description="www.instagram.com" />
  // </Card>
}
