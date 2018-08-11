import axios from '@/api/interception'

const getLogData = (params) => {
  return axios({
    method: 'get',
    url: '/logInfoPage',
    params: params
  })
}

export default {
  getLogData
}
