import axios from '@/api/interception'

const logout = () => {
  return axios({
    method: 'POST',
    url: '/account/user/logout'
  })
}

export default {
  logout
}
