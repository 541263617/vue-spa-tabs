<template>
  <div class="channel-page">
    <div class="channel-con">
      <p class="tip">系统检测到您从属多条业务线,请先选择数据权限!</p>
      <ul class="list">
        <li v-for="item,index in channels" :key="'channel'+index" @click="setChannel(item.channelCode)">
          {{item.channelName}}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    computed: {
      ...mapState({
        channels: state => state.public.channelList
      })
    },
    methods: {
      getChannel () {
        this.$store.dispatch('getChannel')
      },
      setChannel (channelCode) {
        this.$store.dispatch('setChannel', {channelCode: channelCode})
      }
    },
    created () {
      this.getChannel()
    }
  }
</script>

<style lang="less" scoped="">
  .channel-page {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    font-size: 16px;
    background-color: #3e3e56;
    .channel-con {
      width: 1100px;
      margin: 250px auto 0;
      .tip {
        color: #fff;
        font-weight: bold;
        text-align: center;
      }
      ul {
        display: flex;
        justify-content: space-around;
        flex-wrap: wrap;
        li {
          width: 250px;
          height: 150px;
          line-height: 150px;
          background: #fff;
          text-align: center;
          border-radius: 5px;
          margin-top: 32px;
          cursor: pointer;
        }
      }
    }
  }
</style>
