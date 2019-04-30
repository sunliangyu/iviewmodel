import axios from '@/libs/api.request'

// 拒绝或接受订单
export const operateOrder = (order, restaurant, operate, reason) => {
  return axios.request({
    url: 'client/order/alertOrder',
    method: 'post',
    timeout: 1000 * 60 * 2,
    data: {
      order,
      operate,
      restaurant,
      reason
    }
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
