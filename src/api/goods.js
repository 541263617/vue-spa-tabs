import axios from '@/api/interception'

const getGoodsInfoBySku = (params) => {
  return axios({
    method: 'get',
    url: '/goods/externalItemSkus',
    params: params
  })
}

export default {
  getGoodsInfoBySku
}
