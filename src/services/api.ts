import {User, IArticle, Articles, UserInfo, PutUserInfo, ArticleInfo, ArticleID} from '../types'
import axios from 'axios'

interface BaseRes {
  stat: string
}

interface Axios {
  stat: string,
  data: {
    token: string
  }
}

interface Post extends BaseRes{
  data: string
}

interface UserRes  extends BaseRes{
  data: {
    account: string,
    nickname: string,
    avatar: string
    ctime: number
  }
}

interface ArticleRes extends BaseRes{
  data: Articles
}

interface ArticleIDRes extends BaseRes{
  data: ArticleID
}

export async function login(user: User){
  let res =  await axios.post<Axios>("/api/auth/login", {
    account: user.username,
    pwd: user.password,
  })
  return res.data
}

export async function registry(user: User){
  let res = await axios.post<Axios>("/api/auth/registry", {
    account: user.username,
    pwd: user.password,
  })
  return res.data
}

export function logout(){
  return axios.post<Axios>("/api/auth/logout")
}

export function getUserInfo() {
  return axios.get<UserRes>("/api/user/userInfo") 
}

export function updateInfo(userInfo: PutUserInfo){
  return axios.put<BaseRes>("/api/user/updateUserInfo", userInfo)
}

export function add(article: IArticle){
  return axios.post<Post>("/api/article/add", {...article})
}

export function searchOwner(idx: number, size: number){
  return axios.post<ArticleRes>('/api/article/searchowner',
  {
    pageIndex: idx,
    pageSize: size,
    keyword: ""
  })
}

export function searchAll(idx: number, size: number, keyword?: string){
  return axios.post<ArticleRes>('/api/article/searchall', 
  {
    pageIndex: idx,
    pageSize: size,
    keyword: keyword || ''
  })
}

export function getArticle(id: string){
  return axios.get<ArticleIDRes>(`/api/article/${id}`)
}

export function delArticle(id:string){
  return axios.delete<BaseRes>(`/api/article/${id}`)
}