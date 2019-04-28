import {
  login,
  logout,
  getUserInfo,
  getMessage,
  getContentByMsgId,
  hasRead,
  removeReaded,
  restoreTrash,
  getUnreadCount
} from '@/api/user'
import {
  getOrders,
  getOrderById,
  operateOrder
} from '@/api/order'
import { setToken, getToken } from '@/libs/util'

export default {
  state: {
    userName: '',
    userId: 0,
    avatarImgPath: '',
    restaurant: 0,
    job: '',
    token: getToken(),
    access: '',
    hasGetInfo: false,
    unreadCount: 0,
    messageUnreadList: [],
    messageReadedList: [],
    messageTrashList: [],
    orderUnreadList: [],
    orderReceiveList: [],
    orderRefuseList: [],
    messageContentStore: {},
    orderContentStore: {},
    unreadorder: 0
  },
  mutations: {
    setAvatar (state, avatarPath) {
      state.avatarImgPath = avatarPath
    },
    setUserId (state, id) {
      state.userId = id
    },
    setUserName (state, name) {
      state.userName = name
    },
    setAccess (state, access) {
      state.access = access
    },
    setToken (state, token) {
      state.token = token
      setToken(token)
    },
    setHasGetInfo (state, status) {
      state.hasGetInfo = status
    },
    setMessageCount (state, count) {
      state.unreadCount = count
    },
    setMessageUnreadList (state, list) {
      state.messageUnreadList = list
    },
    setMessageReadedList (state, list) {
      state.messageReadedList = list
    },
    setMessageTrashList (state, list) {
      state.messageTrashList = list
    },
    setOrderUnreadList (state, list) {
      state.orderUnreadList = list
    },
    setOrderReceiveList (state, list) {
      state.orderReceiveList = list
    },
    setOrderRefuseList (state, list) {
      state.orderRefuseList = list
    },
    setRestaurant (state, id) {
      state.restaurant = id
    },
    setUnreadorder (state, unreadorder) {
      state.unreadorder = unreadorder
    },
    updateMessageContentStore (state, { msg_id, content }) {
      state.messageContentStore[msg_id] = content
    },
    moveMsg (state, { from, to, msg_id }) {
      alert('from ' + from + 'to : ' + to)
      const index = state[from].findIndex(_ => _.msg_id === msg_id)
      const msgItem = state[from].splice(index, 1)[0]
      msgItem.loading = false
      state[to].unshift(msgItem)
    },
    // 更新当前订单信息
    updateOrder (state, content) {
      state.orderContentStore.push(content)
    }
  },
  getters: {
    messageUnreadCount: state => state.messageUnreadList.length,
    messageReadedCount: state => state.messageReadedList.length,
    messageTrashCount: state => state.messageTrashList.length,
    orderUnreadCount: state => state.orderUnreadList.length,
    orderReceiveCount: state => state.orderReceiveList.length,
    orderRefuseCount: state => state.orderRefuseList.length,
    userid: state => state.userId,
    restaurant: state => state.restaurant,
    unreadorder: state => state.unreadorder
  },
  actions: {
    // 登录
    handleLogin ({ commit }, { userName, password }) {
      var username = userName.trim()
      return new Promise((resolve, reject) => {
        login({
          username,
          password
        }).then(res => {
          const data = res.data
          if (data.token == null) {
            alert(data.message)
            resolve()
          } else {
            commit('setToken', data.token)
            resolve()
          }
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 退出登录
    handleLogOut ({ state, commit }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('setToken', '')
          commit('setAccess', [])
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 获取用户相关信息
    getUserInfo ({ state, commit }) {
      return new Promise((resolve, reject) => {
        try {
          var token = getToken()
          alert('token:' + token)
          getUserInfo(token).then(res => {
            const data = res.data
            if (data.user_id == null) {
              alert('请重新登录')
              commit('setToken', '')
              commit('setAccess', [])
            } else {
              commit('setAvatar', data.avatar)
              commit('setUserName', data.name)
              commit('setUserId', data.user_id)
              commit('setAccess', data.access)
              commit('setHasGetInfo', true)
              commit('setRestaurant', data.restaurant)
            }
            resolve(data)
          }).catch(err => {
            reject(err)
          })
        } catch (error) {
          reject(error)
        }
      })
    },
    // 此方法用来获取未读消息条数，接口只返回数值，不返回消息列表
    getUnreadMessageCount ({ state, commit }) {
      getUnreadCount(state.restaurant).then(res => {
        const data = res.data
        commit('setMessageCount', data.message)
        commit('setUnreadorder', data.order)
      })
    },
    // 获取消息列表，其中包含未读、已读、回收站三个列表
    getMessageList ({ state, commit }) {
      return new Promise((resolve, reject) => {
        getMessage(state.restaurant).then(res => {
          const { unread, readed, trash } = res.data
          alert(unread.toString())
          var time = new Date(1472048779952)
          alert(time)
          commit('setMessageUnreadList', unread.sort((a, b) => new Date(b.create_time) - new Date(a.create_time)))
          commit('setMessageReadedList', readed.map(_ => {
            _.loading = false
            return _
          }).sort((a, b) => new Date(b.create_time) - new Date(a.create_time)))
          commit('setMessageTrashList', trash.map(_ => {
            _.loading = false
            return _
          }).sort((a, b) => new Date(b.create_time) - new Date(a.create_time)))
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 根据当前点击的消息的id获取内容
    getContentByMsgId ({ state, commit }, { msg_id }) {
      return new Promise((resolve, reject) => {
        let contentItem = state.messageContentStore[msg_id]
        if (contentItem) {
          resolve(contentItem)
        } else {
          var restaurant = state.restaurant
          getContentByMsgId(restaurant, msg_id).then(res => {
            const content = res.data
            alert(content)
            commit('updateMessageContentStore', { msg_id, content })
            resolve(content)
          })
        }
      })
    },
    // 把一个未读消息标记为已读
    hasRead ({ state, commit }, { msg_id }) {
      return new Promise((resolve, reject) => {
        hasRead(msg_id).then(() => {
          commit('moveMsg', {
            from: 'messageUnreadList',
            to: 'messageReadedList',
            msg_id
          })
          commit('setMessageCount', state.unreadCount - 1)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 删除一个已读消息到回收站
    removeReaded ({ commit }, { msg_id }) {
      return new Promise((resolve, reject) => {
        removeReaded(msg_id).then(() => {
          commit('moveMsg', {
            from: 'messageReadedList',
            to: 'messageTrashList',
            msg_id
          })
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 还原一个已删除消息到已读消息
    restoreTrash ({ commit }, { msg_id }) {
      return new Promise((resolve, reject) => {
        restoreTrash(msg_id).then(() => {
          commit('moveMsg', {
            from: 'messageTrashList',
            to: 'messageReadedList',
            msg_id
          })
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 接受操作
    receiveOrders: function ({ commit, state }, msg_id) {
      const token = state.token
      const operate = '1'
      return new Promise((resolve, reject) => {
        operateOrder(msg_id, token, operate).then(
          () => {
            commit('moveMsg', {
              from: 'orderUnreadList',
              to: 'orderReceiveList',
              msg_id
            })
            resolve()
          }
        ).catch(
          error => {
            reject(error)
          }
        )
      }
      )
    },
    refuseOrders: function ({ commit, state }, msg_id) {
      const token = state.token
      const operate = '2'
      this.$axios.post()
      return new Promise((resolve, reject) => {
        operateOrder(msg_id, token, operate).then(
          () => {
            commit('moveMsg', {
              from: 'orderUnreadList',
              to: 'orderRefuseList',
              msg_id
            })
            resolve()
          }).catch(error => {
          reject(error)
        })
      }
      )
    },
    // 根据当前订单点击的消息的id获取内容
    getOrderContentByMsgId: function ({ state, commit }, { msg_id }) {
      return new Promise((resolve, reject) => {
        getOrderById(msg_id, state.restaurant).then(res => {
          const content = res.data
          resolve(content)
        })
      })
    },
    rceiveText: function ({ commit, state }, msg_id) {
      commit('moveMsg', {
        from: 'messageUnreadList',
        to: 'messageReadedList',
        msg_id
      })
    },
    getOrders: function ({ commit, state }, user_id) {
      return new Promise((resolve, reject) => {
        getOrders(user_id).then(res => {
          const { unread, receive, refuse } = res.data
          commit('setOrderUnreadList', unread.sort((a, b) => new Date(b.create_time) - new Date(a.create_time)))
          commit('setOrderReceiveList', receive.map(_ => {
            _.loading = false
            return _
          }).sort((a, b) => new Date(b.create_time) - new Date(a.create_time)))
          commit('setOrderRefuseList', refuse.map(_ => {
            _.loading = false
            return _
          }).sort((a, b) => new Date(b.create_time) - new Date(a.create_time)))
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }

  }
}
