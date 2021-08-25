import {makeAutoObservable} from 'mobx'
import {IUser} from './types'

class Store {
  user: IUser = {username: ''}

  setUser(user: IUser) {
    this.user = user
  }

  constructor() {
    makeAutoObservable(this)
  }
}

export default new Store()