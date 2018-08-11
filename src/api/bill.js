import axios from '@/api/interception'
import qs from 'qs'

const getBalance = () => {
  return axios({
    method: 'GET',
    url: '/bill/balance'
  })
}

const getOrderDetailPage = (params) => {
  return axios({
    method: 'GET',
    url: '/bill/orderDetailPage',
    params: params
  })
}

const operateBill = (data) => {
  return axios({
    method: 'PUT',
    url: '/bill/operate',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    data: qs.stringify(data)
  })
}

const getStatisticsBalance = (params) => {
  return axios({
    method: 'GET',
    url: '/bill/statisticsBalance',
    params: params
  })
}

const getBalanceDetailPage = (params) => {
  return axios({
    method: 'GET',
    url: '/bill/balanceDetailPage',
    params: params
  })
}

const getTreadType = () => {
  return axios({
    method: 'GET',
    url: '/bill/treadType'
  })
}

export default {
  getBalance,
  getOrderDetailPage,
  operateBill,
  getStatisticsBalance,
  getBalanceDetailPage,
  getTreadType
}
