import axios from '@/api/interception'

const getSuppliers = (params) => {
  return axios({
    method: 'get',
    url: '/supplier/suppliers',
    params: params
  })
}

export default {
  getSuppliers
}
