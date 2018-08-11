import axios from '@/api/interception'

const getJdAddress = () => {
  return axios({
    method: 'get',
    url: '/metadata/jdAddress'
  })
}

const getAddress = () => {
  return axios({
    method: 'get',
    url: '/metadata/address'
  })
}

export default {
  getJdAddress,
  getAddress
}
