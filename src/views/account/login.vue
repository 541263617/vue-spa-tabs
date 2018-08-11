<template>
  <div class="login-page">
    <header-view></header-view>
    <div class="login-con">
      <el-form :model="loginByPsw" status-icon :rules="rules" ref="loginByPsw">
        <el-form-item label="手机号" prop="username">
          <el-input
            v-model="loginByPsw.username"
            placeholder="请输入手机号"
            class="username">
          </el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            type="password"
            v-model="loginByPsw.password"
            placeholder="请输入密码"
            auto-complete="off"
            class="password">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-row :gutter="20">
            <el-col :span="12" :offset="2">
              <el-button type="primary" :loading="isSubmitting" @click="submitForm('loginByPsw')">登录</el-button>
            </el-col>
            <el-col :span="8">
              <el-button :disabled="isSubmitting" @click="resetForm('loginByPsw')">重置</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import headerView from '@/components/header'
  import { mapActions, mapState } from 'vuex'
  import JSEncrypt from 'jsencrypt'

  export default {
    components: {
      headerView
    },
    data () {
      const checkUsername = (rule, value, callback) => {
        // TODO: hack code
        if (!value) {
          return callback(new Error('请输入手机号'))
        } else if (!value.match(/1\d{10}/g)) {
          return callback(new Error('请输入正确的手机号码'))
        } else {
          callback()
        }
      }
      const checkPassword = (rule, value, callback) => {
        let reg = /[^\u4e00-\u9fa5]/
        if (!value) {
          return callback(new Error('请输入密码'))
        } else if (!reg.test(value)) {
          return callback(new Error('不能输入中文'))
        } else {
          callback()
        }
      }
      return {
        loginByPsw: {
          username: '',
          password: ''
        },
        rules: {
          username: [
            {validator: checkUsername, trigger: 'blur'},
            {max: 11, message: '请输入正确的手机号码', trigger: 'blur'}
          ],
          password: [
            {validator: checkPassword, trigger: 'blur'},
            {min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur'}
          ]
        },
        isSubmitting: false
      }
    },
    computed: {
      ...mapState({
        publicKey: state => state.public.publicKey
      })
    },
    methods: {
      ...mapActions([
        'login',
        'getPublicKey',
        'getChannel'
      ]),
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let encrypt = new JSEncrypt.JSEncrypt()
            encrypt.setPublicKey(this.publicKey)
            let encryptData = encrypt.encrypt(this.$refs[formName].model.password)
            this.login({phone: this.$refs[formName].model.username, password: encryptData})
          }
        })
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      }
    },
    created () {
      this.getPublicKey()
    }
  }
</script>

<style scoped lang="less">
  .login-page {
    .login-con {
      width: 300px;
      margin: 50px auto;
      text-align: center;
      img {
        width: 200px;
        margin-bottom: 30px;
      }
      button {
        width: 100%;
      }
    }
  }
</style>
