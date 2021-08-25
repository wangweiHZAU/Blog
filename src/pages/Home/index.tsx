import { useEffect, createContext, useContext } from 'react'
import { RouteComponentProps, Switch, Route, Redirect } from 'react-router'
import { Menu, Layout, Avatar, Dropdown, message } from 'antd'
import {
  ProfileOutlined,
  UserOutlined,
  SelectOutlined,
  ExportOutlined,
} from '@ant-design/icons'
import { observer } from 'mobx-react-lite'

import Store from '../../store'
import * as api from '../../services/api'
import style from './style.module.less'
import NotFound from '../NotFound'
import Article from '../Article'
import Write from '../Write'
import User from '../User'
import Details from '../Details'

const userContext = createContext<typeof Store>(Store)

export default function Home(props: RouteComponentProps) {
  //const user = useContext(userContext)
  const UserStat = observer(() => {
    const stat = async () => {
      try {
        let result = await api.getUserInfo()
        console.log('result', result)
        if (result.data.stat === 'ok') {
          Store.setUser({ username: result.data.data.account })
        } else {
          if (result.data.stat === 'Err_Token_Not_Found') {
            message.warning('请先登录')
            props.history.push('/login')
          } else message.error(result.data.stat)
        }
      } catch (error) {
        console.log('error', error.response)
        message.warning('请先登录')
        props.history.push('/login')
      }
    }
    stat()
    return <div></div>
  })

  useEffect(() => {
    ;(async () => {
      try {
        let result = await api.getUserInfo()
        // console.log('result', result)
        if (result.data.stat === 'ok') {
          Store.setUser({ username: result.data.data.account })
        } else {
          if (result.data.stat === 'Err_Token_Not_Found') {
            message.warning('请先登录')
            props.history.push('/login')
          } else message.error(result.data.stat)
        }
      } catch (error) {
        console.log('error', error.response)
        message.warning('请先登录')
        props.history.push('/login')
      }
    })()
  })

  const logout = async () => {
    let res = await api.logout()
    if (res.data.stat === 'ok') {
      message.success('已成功退出')
      // props.history.push('/login')
    } else {
      message.error('退出失败，请重试')
    }
  }

  const prefix = props.match.url
  return (
    <userContext.Provider value={Store}>
      {/* <UserStat /> */}
      <Layout className={style.layout}>
        <Layout.Header className={style.header}>
          <div className={style.brand}>梦开始的地方</div>
          <span className={style.username}>{Store.user.username}</span>
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item key="logout" onClick={logout}>
                  退出登录
                </Menu.Item>
              </Menu>
            }
            className={style.logout}>
            <ExportOutlined />
          </Dropdown>
        </Layout.Header>
        <Layout>
          <Layout.Sider width={150}>
            <Menu
              theme="dark"
              onSelect={(item) => {
                props.history.push(item.key)
              }}
              selectedKeys={[props.location.pathname]}>
              <Menu.Item icon={<ProfileOutlined />} key={`${prefix}/article`}>
                文章列表
              </Menu.Item>
              <Menu.Item icon={<SelectOutlined />} key={`${prefix}/write`}>
                发布文章
              </Menu.Item>
              <Menu.Item icon={<UserOutlined />} key={`${prefix}/user`}>
                个人中心
              </Menu.Item>
            </Menu>
          </Layout.Sider>
          <Layout.Content className={style.content}>
            <Switch>
              <Route path={`${prefix}/article`} exact component={Article} />
              <Route path={`${prefix}/write`} exact component={Write} />
              <Route path={`${prefix}/user`} exact component={User} />
              <Route path={`${prefix}/user/details/:id`} component={Details} />
              <Redirect from={`${prefix}`} to={`${prefix}/article`} exact />
              <Route component={NotFound} />
            </Switch>
          </Layout.Content>
        </Layout>
      </Layout>
    </userContext.Provider>
  )
}
