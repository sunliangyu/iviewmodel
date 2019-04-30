import HttpRequest from '@/libs/axios'
import config from '@/config'
const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro

const axios = new HttpRequest(baseUrl)

export const registry = ({ username, password }) => {
  const data = JSON.stringify({ 'username': username, 'password': password })
  return axios.request({
    url: 'user/registry',
    data,
    method: 'post',
    timeout: 1000 * 60 * 2
  })
}

export const login = ({ username, password }) => {
  console.log(axios)
  return axios.request({
    url: 'system/system/login',
    data: JSON.stringify({ 'username': username, 'password': password }),
    method: 'post',
    timeout: 1000 * 60 * 2,
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
    timeout: 1000 * 60 * 2,
    method: 'post'
  })
}

export const logout = () => {
  return axios.request({
    url: 'logout',
    timeout: 1000 * 60 * 2,
    method: 'post'
  })
}

export const getUnreadCount = (restaurant) => {
  return axios.request({
    url: 'system/system/messageCount',
    method: 'get',
    timeout: 1000 * 60 * 2,
    params: {
      restaurant
    }
  })
}

export const getMessage = (restaurant) => {
  return axios.request({
    url: 'system/system/getMessage',
    method: 'get',
    timeout: 1000 * 60 * 2,
    params: {
      restaurant
    }
  })
}

export const getContentByMsgId = (restaurant, msg_id) => {
  return axios.request({
    url: 'system/system/getmessageid',
    method: 'get',
    timeout: 1000 * 60 * 2,
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
    timeout: 1000 * 60 * 2,
    data: {
      msg_id
    }
  })
}

export const alertmessage = (restaurant, msg_id, state) => {
  return axios.request({
    url: 'system/system/altermessage',
    method: 'post',
    timeout: 1000 * 60 * 2,
    data: {
      restaurant,
      msg_id,
      state
    }
  })
}
