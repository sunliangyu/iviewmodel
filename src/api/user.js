import HttpRequest from '@/libs/axios'
import config from '@/config'
const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro

const axios = new HttpRequest(baseUrl)

export const registry = ({ username, password }) => {
  const data = JSON.stringify({ 'username': username, 'password': password })
  return axios.request({
    url: 'user/registry',
    data,
    method: 'post'
  })
}

export const login = ({ username, password }) => {
  console.log(axios)
  return axios.request({
    url: 'system/system/login',
    data: JSON.stringify({ 'username': username, 'password': password }),
    method: 'post',
    headers: {
    }
  })
}

export const getUserInfo = (token) => {
  return axios.request({
    url: 'system/system/getUserInfo',
    data: JSON.stringify({ 'token': token }),
    headers: {
    },
    method: 'post'
  })
}

export const logout = () => {
  return axios.request({
    url: 'logout',
    method: 'post'
  })
}

export const getUnreadCount = (restaurant) => {
  alert(restaurant)
  return axios.request({
    url: 'system/system/messageCount',
    method: 'get',
    params: {
      restaurant
    }
  })
}

export const getMessage = (restaurant) => {
  return axios.request({
    url: 'system/system/getMessage',
    method: 'get',
    params: {
      restaurant
    }
  })
}

export const getContentByMsgId = (restaurant, msg_id) => {
  return axios.request({
    url: 'system/system/getmessageid',
    method: 'get',
    params: {
      restaurant,
      msg_id
    }
  })
}

export const hasRead = msg_id => {
  return axios.request({
    url: 'message/has_read',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const removeReaded = msg_id => {
  return axios.request({
    url: 'message/remove_readed',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const restoreTrash = msg_id => {
  return axios.request({
    url: 'message/restore',
    method: 'post',
    data: {
      msg_id
    }
  })
}
