import axios from '@/api/interception'
import qs from 'qs'

const getWarehouseOrderPage = (params) => {
  return axios({
    method: 'get',
    url: '/order/warehouseOrderPage',
    params: params
  })
}

const getWarehouseOrderById = (id) => {
  return axios({
    method: 'get',
    url: '/order/warehouseOrder/warehouseOrderCode/' + id
  })
}

const cancelOrder = (data) => {
  return axios({
    method: 'PUT',
    url: '/order/orderCancel',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    data: qs.stringify(data)
  })
}

const getPlatformOrders = (params) => {
  return axios({
    method: 'get',
    url: '/order/platformOrders',
    params: params
  })
}

const confirmJdOrder = (data) => {
  return axios({
    method: 'POST',
    url: '/order/jingDongOrder',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    data: qs.stringify(data)
  })
}

export default {
  getWarehouseOrderPage,
  getWarehouseOrderById,
  cancelOrder,
  getPlatformOrders,
  confirmJdOrder
}
