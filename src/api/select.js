import axios from '@/api/interception'

const getSupplierOrderStatus = () => {
  return axios({
    method: 'get',
    url: '/select/selectByTypeCode/supplierOrderStatus'
  })
}

export default {
  getSupplierOrderStatus
}
