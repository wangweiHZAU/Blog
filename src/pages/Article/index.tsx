import { useState, useEffect } from 'react'
import { Input, Form, Table, message } from 'antd'

import { ArticleInfo, UserInfo } from '../../types'
import * as api from '../../services/api'
import { NumToStr } from '../../components/Time'

const { Search } = Input
export default function Article() {
  const [articles, setArticles] = useState<ArticleInfo[]>()
  const [user, setUser] = useState<UserInfo>()

  // used for pagination
  const [end, setEnd] = useState<boolean>(false)
  const [pageSize] = useState<number>(20)
  const [pageIdx, setPageIdx] = useState<number>(1)

  const onSearch = async (value: string) => {
    if (!end) {
      let res = await api.searchAll(pageIdx, pageSize, value)
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

  const userBaseInfo = async () => {
    let res = await api.getUserInfo()
    if (res.data.stat === 'ok' && res.data.data) {
      const userInfo: UserInfo = res.data.data
      setUser(userInfo)
    } else {
      console.log(res.data)
    }
  }
  const getArticles = async () => {
    let res = await api.searchAll(pageIdx, pageSize)
    if (res.data.stat === 'ok') {
      console.log('articles', res.data.data.items)
      setArticles(res.data.data.items)
    } else {
      message.error('获取文章信息失败')
    }
  }

  const columns = [
    {
      title: '文章标题',
      dataIndex: 'title',
      width: 150,
      ellipsis: true,
      sorter: true,
    },
    {
      title: '作者',
      dataIndex: 'author',
      sorter: true,
      render: (author: UserInfo) => {
        return author.nickname || author.account
      },
    },
    {
      title: '标签',
      dataIndex: 'tags',
    },
    {
      title: '创建时间',
      dataIndex: 'ctime',
      sorter: true,
      render: (time: number) => NumToStr(time),
    },
    {
      title: '正文',
      dataIndex: 'content',
      width: 300,
      ellipsis: true,
    },
  ]

  useEffect(() => {
    userBaseInfo()
    getArticles()
  }, [])
  return (
    <Form>
      <Form.Item>
        <Search
          placeholder="请输入您要检索的文章作者"
          allowClear
          enterButton="搜索"
          size="large"
          onSearch={onSearch}
          maxLength={50}
        />
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
}
