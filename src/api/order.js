import axios from '@/libs/api.request'

// 拒绝或接受订单
export const operateOrder = (order, restaurant, operate, reason) => {
  return axios.request({
    url: 'client/order/alertOrder',
    method: 'post',
    timeout: 1000 * 60 * 2,
    data: JSON.stringify({ 'restaurant': restaurant, 'order': order, 'operate': operate, 'reason': reason })
  })
}

// 获取订单详细信息
export const getOrderById = (order, restaurant) => {
  return axios.request({
    url: 'client/order/getOrderById',
    method: 'get',
    timeout: 1000 * 60 * 2,
    params: {
      order,
      restaurant
    }
  })
}
// 获取未处理订单以及当天拒绝订单
export const getOrders = (restaurant) => {
  return axios.request({
    url: 'client/order/getOrder',
    method: 'get',
    timeout: 1000 * 60 * 2,
    params: {
      restaurant
    }
  })
}

// 获取home页的参数
export const getHome = (restaurant) => {
  return axios.request({
    url: 'client/order/getOrderCount',
    method: 'get',
    timeout: 1000 * 60 * 2,
    params: {
      restaurant
    }
  })
}
// 获取pie元素的参数
export const getPie = (restaurant) => {
  return axios.request({
    url: 'client/order/getOrderall',
    method: 'get',
    timeout: 1000 * 60 * 2,
    params: {
      restaurant
    }
  })
}

export const getBar = (restaurant) => {
  return axios.request({
    url: 'client/order/getBar',
    method: 'get',
    timeout: 1000 * 60 * 2,
    params: {
      restaurant
    }
  })
}

export const getMaterial = ({ restaurant, types }) => {
  return axios.request({
    url: 'kitchen/kitchen/getMaterial',
    method: 'get',
    timeout: 1000 * 60 * 2,
    params: {
      restaurant,
      types
    }
  })
}

export const getSpecific = ({ restaurant, id }) => {
  return axios.request({
    url: 'kitchen/kitchen/getSpecific',
    method: 'get',
    timeout: 1000 * 60 * 2,
    params: {
      restaurant,
      id
    }
  })
}

export const alertMaterial = ({ restaurant, id, save, count, name }) => {
  return axios.request({
    url: 'kitchen/kitchen/alertMaterial',
    method: 'post',
    timeout: 1000 * 60 * 2,
    data: JSON.stringify({ 'restaurant': restaurant, 'id': id, 'save': save, 'count': count, 'name': name })
  })
}

export const checkName = ({ restaurant, name, type }) => {
  return axios.request({
    url: 'kitchen/kitchen/checkName',
    method: 'get',
    timeout: 1000 * 60 * 2,
    params: {
      restaurant,
      name,
      type
    }
  })
}

export const saveMaterial = ({ restaurant, name, type, count, save }) => {
  return axios.request({
    url: 'kitchen/kitchen/saveMaterial',
    method: 'post',
    timeout: 1000 * 60 * 2,
    data: JSON.stringify({ 'restaurant': restaurant, 'type': type, 'save': save, 'count': count, 'name': name })
  })
}

export const deleteMaterial = ({ restaurant, id }) => {
  return axios.request({
    url: 'kitchen/kitchen/deleteMaterial',
    method: 'get',
    timeout: 1000 * 60 * 2,
    params: {
      restaurant,
      id
    }
  })
}

export const orderpage = ({ restaurant, start, condition, quality, page }) => {
  return axios.request({
    url: 'client/order/orderpage',
    method: 'post',
    timeout: 1000 * 60 * 2,
    data: JSON.stringify({ 'restaurant': restaurant, 'start': start, 'condition': condition, 'quality': quality, 'page': page })
  })
}
export const inquiryOrder = ({ restaurant, type, id }) => {
  return axios.request({
    url: 'client/order/inquiryOrder',
    method: 'get',
    timeout: 1000 * 60 * 2,
    params: {
      restaurant,
      type,
      id
    }
  })
}

export const topay = ({ restaurant, pay, id, price }) => {
  return axios.request({
    url: 'client/order/pay',
    method: 'post',
    timeout: 1000 * 60 * 2,
    data: JSON.stringify({ 'restaurant': restaurant, 'pay': pay, 'id': id, 'price': price })
  })
}
