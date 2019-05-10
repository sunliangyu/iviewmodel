import axios from '@/libs/api.request'
// 拒绝或接受订单
export const getfoodClass = ({ restaurant }) => {
  return axios.request({
    url: 'kitchen/food/getfoodClass',
    method: 'get',
    timeout: 1000 * 60 * 2,
    params: {
      restaurant
    }
  })
}

export const addFood = ({ restaurant, type, food }) => {
  return axios.request({
    url: 'kitchen/food/addFood',
    method: 'post',
    timeout: 1000 * 60 * 2,
    data: JSON.stringify({ 'restaurant': restaurant, 'type': type, 'addFood': food })
  })
}

export const getFoodById = ({ restaurant, id }) => {
  return axios.request({
    url: 'kitchen/food/getFoodById',
    method: 'get',
    timeout: 1000 * 60 * 2,
    params: {
      restaurant,
      id
    }
  })
}

export const getFoodsByClass = ({ restaurant, type }) => {
  return axios.request({
    url: 'kitchen/food/getfoodByclass',
    method: 'get',
    timeout: 1000 * 60 * 2,
    params: {
      restaurant,
      type
    }
  })
}

export const deleteFoodById = ({ restaurant, id }) => {
  return axios.request({
    url: 'kitchen/food/deleteFood',
    method: 'get',
    timeout: 1000 * 60 * 2,
    params: {
      restaurant,
      id
    }
  })
}

export const updateFood = ({ restaurant, name, des, price, cost, add, dfood, id }) => {
  return axios.request({
    url: 'kitchen/food/updateFood',
    method: 'post',
    timeout: 1000 * 60 * 2,
    data: JSON.stringify({ 'restaurant': restaurant, 'des': des, 'price': price, 'cost': cost, 'add': add, 'dfood': dfood, 'id': id, 'name': name })
  })
}

export const getImage = ({ restaurant, id }) => {
  return axios.request({
    url: 'kitchen/food/getImage',
    method: 'get',
    timeout: 1000 * 60 * 2,
    params: {
      restaurant,
      id
    }
  })
}

export const addoutflow = ({ restaurant, id, name, count, price, remark }) => {
  return axios.request({
    url: 'kitchen/kitchen/addoutflow',
    method: 'post',
    timeout: 1000 * 60 * 2,
    data: JSON.stringify({ 'restaurant': restaurant, 'des': remark, 'price': price, 'count': count, 'id': id, 'name': name })
  })
}

export const getMateFlow = ({ restaurant, time, id, page }) => {
  return axios.request(
    {
      url: 'kitchen/kitchen/getMateFlow',
      method: 'post',
      timeout: 1000 * 60 * 2,
      data: JSON.stringify({ 'restaurant': restaurant, 'time': time, 'page': page, 'id': id })
    }
  )
}

export const getFoods = ({ restaurant }) => {
  return axios.request(
    {
      url: 'kitchen/food/getfoods',
      method: 'get',
      timeout: 1000 * 60 * 2,
      params: {
        restaurant
      }
    }
  )
}

export const getcodepage = ({ restaurant, page, id, state }) => {
  return axios.request(
    {
      url: 'kitchen/food/getcodepage',
      method: 'get',
      timeout: 1000 * 60 * 2,
      params: {
        restaurant,
        page,
        id,
        state
      }
    }
  )
}

export const getNeed = ({ restaurant, id }) => {
  return axios.request(
    {
      url: 'kitchen/food/getNeed',
      method: 'get',
      timeout: 1000 * 60 * 2,
      params: {
        restaurant,
        id
      }
    }
  )
}

export const updateorder = ({ restaurant, id, order, state }) => {
  return axios.request(
    {
      url: 'kitchen/food/updateorder',
      method: 'post',
      timeout: 1000 * 60 * 2,
      data: JSON.stringify({ 'restaurant': restaurant, 'order': order, 'state': state, 'id': id })
    }
  )
}
