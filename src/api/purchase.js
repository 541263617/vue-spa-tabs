import axios from '@/api/interception'
import qs from 'qs'

const deleteOrder = (data) => {
  return axios({
    method: 'PUT',
    url: '/purchase/purchaseOrder/updateState/' + data.id,
    headers: {'content-type': 'application/x-www-form-urlencoded'},
    data: qs.stringify(data)
  })
}

export default {
  deleteOrder
}
