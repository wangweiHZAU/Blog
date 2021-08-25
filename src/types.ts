export interface IUser {
  username: string
}

export interface User extends IUser {
  password: string
  remember: boolean
}

export interface UserInfo{
  account: string
  nickname: string 
  avatar: string
  ctime: number
}

export interface PutUserInfo{
  nickname: string,
  avatar: string
}

export interface IArticle {
  title: string
  subtitle: string
  tags: string[]
  banner: string[]
  content: string
}

export interface ArticleInfo extends IArticle{
  ctime: number,
  mtime: number,
  preview: number,
  status: number,
  _id: string
}

export interface Articles {
  items: ArticleInfo[]
}

export interface ArticleID{
  info: ArticleInfo
}