import {
  login,
  // logout,
  getUserInfo,
  getMessage,
  getContentByMsgId,
  alertmessage,
  getUnreadCount
} from '@/api/user'
import {
  getOrders,
  getOrderById,
  operateOrder,
  getHome,
  getPie,
  getBar,
  getMaterial,
  getSpecific,
  alertMaterial,
  checkName,
  saveMaterial,
  deleteMaterial,
  orderpage,
  inquiryOrder,
  topay
} from '@/api/order'

import {
  getfoodClass,
  addFood,
  getFoodsByClass,
  deleteFoodById,
  getFoodById,
  updateFood,
  getImage,
  addoutflow,
  getMateFlow,
  getFoods,
  getcodepage,
  getNeed,
  updateorder
} from '@/api/food'

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
      const index = state[from].findIndex(_ => _.msg_id === msg_id)
      const msgItem = state[from].splice(index, 1)[0]
      msgItem.loading = false
      state[to].unshift(msgItem)
    },
    // 更新当前订单信息
    updateOrder (state, { order, content }) {
      state.orderContentStore[order] = content
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
            resolve(null)
          } else {
            commit('setToken', data.token)
            resolve('true')
          }
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 退出登录
    handleLogOut ({ state, commit }) {
      commit('setToken', '')
      commit('setAccess', [])
      // return new Promise((resolve, reject) => {
      //
      //   // logout(state.restaurant).then(() => {
      //   //   commit('setToken', '')
      //   //   commit('setAccess', [])
      //   //   resolve()
      //   // }).catch(err => {
      //   //   reject(err)
      //   // })
      // })
    },
    // 获取用户相关信息
    getUserInfo ({ state, commit }) {
      return new Promise((resolve, reject) => {
        try {
          var token = getToken()
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
            const content = res.data.message
            commit('updateMessageContentStore', { msg_id, content })
            resolve(content)
          })
        }
      })
    },
    // 把一个未读消息标记为已读
    hasRead ({ state, commit }, { msg_id }) {
      var restaurant = state.restaurant
      return new Promise((resolve, reject) => {
        var state = 'b'
        alertmessage(restaurant, msg_id, state).then(() => {
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
    removeReaded ({ state, commit }, { msg_id }) {
      var restaurant = state.restaurant
      return new Promise((resolve, reject) => {
        var state = 'c'
        alertmessage(restaurant, msg_id, state).then(() => {
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
    restoreTrash ({ state, commit }, { msg_id }) {
      var restaurant = state.restaurant
      return new Promise((resolve, reject) => {
        var state = 'b'
        alertmessage(restaurant, msg_id, state).then(() => {
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
      const operate = 'b'
      const restaurant = state.restaurant
      return new Promise((resolve, reject) => {
        operateOrder(msg_id, restaurant, operate, null).then(
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
    refuseOrders: function ({ commit, state }, { msg_id, reason }) {
      const operate = 'c'
      const restaurant = state.restaurant
      return new Promise((resolve, reject) => {
        operateOrder(msg_id, restaurant, operate, reason).then(
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
    getOrderContentByMsgId: function ({ commit, state }, order) {
      return new Promise((resolve, reject) => {
        let content = state.orderContentStore[order]
        if (content) {
          resolve(content)
        } else {
          getOrderById(order, state.restaurant).then(res => {
            const content = res.data
            commit('updateOrder', { order, content })
            resolve(content)
          })
        }
      })
    },
    getOrderDetail: function ({ commit, state }, order) {
      return new Promise((resolve, reject) => {
        getOrderById(order, state.restaurant).then(res => {
          const content = res.data
          resolve(content)
        })
      })
    },
    // 获取今天处理订单以及未处理订单
    getOrders: function ({ commit, state }, user_id) {
      return new Promise((resolve, reject) => {
        getOrders(state.restaurant).then(res => {
          var data = res.data
          const unread = data.unread
          const receive = data.receive
          const refuse = data.refuse
          commit('setOrderUnreadList', unread)
          commit('setOrderReceiveList', receive.map(_ => {
            _.loading = false
            return _
          }))
          commit('setOrderRefuseList', refuse.map(_ => {
            _.loading = false
            return _
          }))
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    getHome: ({ commit, state }) => {
      var restaurant = state.restaurant
      return new Promise((resolve, reject) => {
        getHome(restaurant).then(res => {
          const data = res.data
          resolve(data)
        })
      })
    },
    getpie: ({ commit, state }) => {
      var restaurant = state.restaurant
      return new Promise((resolve, reject) => {
        getPie(restaurant).then(res => {
          const data = res.data
          resolve(data)
        })
      })
    },
    getBar: ({ commit, state }) => {
      var restaurant = state.restaurant
      return new Promise((resolve, reject) => {
        getBar(restaurant).then(res => {
          const data = res.data
          resolve(data)
        })
      })
    },
    getMaterial: ({ commit, state }, types) => {
      var restaurant = state.restaurant
      return new Promise((resolve, reject) => {
        getMaterial({ restaurant, types }).then(res => {
          const data = res.data
          resolve(data)
        })
      })
    },
    getSpecific: ({ commit, state }, id) => {
      var restaurant = state.restaurant
      return new Promise((resolve, reject) => {
        getSpecific({ restaurant, id }).then(res => {
          const data = res.data
          resolve(data)
        })
      })
    },
    alertMaterial: ({ commit, state }, { id, save, count, name }) => {
      var restaurant = state.restaurant
      return new Promise((resolve, reject) => {
        alertMaterial({ restaurant, id, save, count, name }).then(() => {
          resolve()
        })
      })
    },
    checkName ({ commit, state }, { name, type }) {
      var restaurant = state.restaurant
      return new Promise((resolve, reject) => {
        checkName({ restaurant, name, type }).then((res) => {
          var data = res.data
          resolve(data)
        })
      })
    },
    saveMaterial  ({ commit, state }, { name, type, count, save }) {
      var restaurant = state.restaurant
      return new Promise((resolve, reject) => {
        saveMaterial({ restaurant, name, type, count, save }).then((res) => {
          var data = res.data
          resolve(data)
        })
      })
    },

    deleteMaterial ({ commit, state }, { id }) {
      var restaurant = state.restaurant
      return new Promise((resolve, reject) => {
        deleteMaterial({ restaurant, id }).then((res) => {
          var data = res.data
          resolve(data)
        })
      })
    },

    getfoodClass ({ commit, state }) {
      var restaurant = state.restaurant
      return new Promise((resolve, reject) => {
        getfoodClass({ restaurant }).then((res) => {
          var data = res.data
          resolve(data)
        })
      })
    },
    addFoods ({ commit, state }, { type, food }) {
      var restaurant = state.restaurant
      return new Promise((resolve, reject) => {
        addFood({ restaurant, type, food }).then((res) => {
          resolve()
        })
      })
    },
    getFoodsByClass  ({ commit, state }, { type }) {
      var restaurant = state.restaurant
      return new Promise((resolve, reject) => {
        getFoodsByClass({ restaurant, type }).then((res) => {
          var data = res.data
          resolve(data)
        })
      })
    },
    getFoodById ({ commit, state }, id) {
      var restaurant = state.restaurant
      return new Promise((resolve, reject) => {
        getFoodById({ restaurant, id }).then((res) => {
          var data = res.data
          resolve(data)
        })
      })
    },
    deleteFoodById ({ commit, state }, { id }) {
      var restaurant = state.restaurant
      return new Promise((resolve, reject) => {
        deleteFoodById({ restaurant, id }).then(() => {
          resolve()
        })
      })
    },
    updateFood ({ commit, state }, { name, des, price, cost, add, dfood, id }) {
      var restaurant = state.restaurant
      return new Promise((resolve, reject) => {
        updateFood({ restaurant, name, des, price, cost, add, dfood, id }).then(() => {
          resolve()
        })
      })
    },
    orderpage ({ commit, state }, { start, condition, quality, page }) {
      var restaurant = state.restaurant
      return new Promise((resolve, reject) => {
        orderpage({ restaurant, start, condition, quality, page }).then(res => {
          var data = res.data
          resolve(data)
        })
      })
    },
    getImage ({ commit, state }, id) {
      var restaurant = state.restaurant
      return new Promise((resolve, reject) => {
        getImage({ restaurant, start, condition, quality, page }).then(res => {
          var data = res.data
          resolve(data)
        })
      })
    },
    addoutflow ({ commit, state }, { id, name, count, price, remark }) {
      var restaurant = state.restaurant
      return new Promise((resolve, reject) => {
        addoutflow({ restaurant, id, name, count, price, remark }).then(res => {
          var data = res.data
          resolve(data)
        })
      })
    },
    getMateFlow ({ commit, state }, { time, id, page }) {
      var restaurant = state.restaurant
      return new Promise((resolve, reject) => {
        getMateFlow({ restaurant, id, time, page }).then(res => {
          var data = res.data
          resolve(data)
        })
      })
    },
    inquiryOrder ({ commit, state }, { type, id }) {
      var restaurant = state.restaurant
      return new Promise((resolve, reject) => {
        inquiryOrder({ type, id, restaurant }).then(res => {
          var data = res.data
          resolve(data)
        })
      })
    },
    topay ({ commit, state }, { pay, id, price }) {
      var restaurant = state.restaurant
      return new Promise((resolve, reject) => {
        topay({ restaurant, pay, id, price }).then(res => {
          resolve()
        })
      })
    },
    getFoods ({ commit, state }) {
      var restaurant = state.restaurant
      return new Promise((resolve, reject) => {
        getFoods({ restaurant }).then(res => {
          var data = res.data
          resolve(data)
        })
      })
    },
    getcodepage ({ commit, state }, { page, status, id }) {
      var restaurant = state.restaurant
      return new Promise((resolve, reject) => {
        getcodepage({ restaurant, page, id, state: status }).then(res => {
          var data = res.data
          resolve(data)
        })
      })
    },
    getNeed ({ commit, state }, id) {
      var restaurant = state.restaurant
      return new Promise((resolve, reject) => {
        getNeed({ restaurant, id }).then(res => {
          var data = res.data
          resolve(data)
        })
      })
    },
    updateorder ({ commit, state }, { id, order, status }) {
      var restaurant = state.restaurant
      return new Promise((resolve, reject) => {
        updateorder({ restaurant, id, order, state: status }).then(res => {
          resolve()
        })
      })
    }
  }
}
