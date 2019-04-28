import axios from '@/libs/api.request'

// 拒绝或接受订单
export const operateOrder = (order, token, operate) => {
  return axios.request({
    url: 'order/receive',
    method: 'post',
    data: {
      order,
      token,
      operate
    }
  })
}

// 获取订单详细信息
export const getOrderById = (order, token, resid) => {
  return axios.request({
    url: 'order/getById',
    method: 'post',
    data: {
      order,
      token,
      resid
    }
  })
}
// 获取未处理订单以及当天拒绝订单
export const getOrders = (token, resid) => {
  return axios.request({
    url: 'order/getOrders',
    method: 'post',
    data: {
      token,
      resid
    }
  })
}
