<template>
  <table-pagination
    ref="logTable"
    @getPageData="getLogData"
    :params="params"
    :pageData="logData"
    :columns="columns"
    :height="180"
    :init="false"
    :loading="loading"
  >
  </table-pagination>
</template>

<script>
  import log from '@/api/log'

  export default {
    data () {
      return {
        loading: false,
        logData: {},
        params: {
          start: 0,
          operateType: 0,
          entityType: '',
          entityId: 0
        },
        columns: [
          {
            label: '动作',
            field: 'operation'
          },
          {
            label: '操作人',
            field: 'operator'
          },
          {
            label: '操作时间',
            field: 'operateTime'
          },
          {
            label: '备注',
            field: 'remark'
          }
        ]
      }
    },
    methods: {
      getLogData (_params) {
        this.loading = true
        let paginationConfig = this.$refs['logTable'].defaultConfig
        this.params = {...paginationConfig, ...this.params, ..._params}
        log.getLogData(this.params)
        .then((res) => {
          this.logData = res.data
          this.loading = false
        })
      }
    }
  }
</script>
