import React from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/lib/locale/zh_CN'

import Home from '../Home'
import Login from '../Login'
import Details from '../Details'
import NotFound from '../NotFound'
import UserInfo from '../User'

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <BrowserRouter>
        <Switch>
          <Route path="/home" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/details" component={Details} />
          <Route path="/user" component={UserInfo} />
          <Redirect from="/" to="/login" exact />
          <Route component={NotFound} />
        </Switch>
      </BrowserRouter>
    </ConfigProvider>
  )
}
export default App
