let _this
const init = (target) => {
  _this = target
}
const success = (msg) => {
  _this.$notify({
    title: '成功',
    message: msg || '操作成功',
    type: 'success'
  })
}
const warning = (msg) => {
  _this.$notify({
    title: '警告',
    message: msg || '操作有误',
    type: 'warning'
  })
}
const error = (msg) => {
  _this.$notify({
    title: '错误',
    message: msg || '请求失败，请稍后再试！',
    type: 'error'
  })
}

export default {
  init,
  success,
  warning,
  error
}
