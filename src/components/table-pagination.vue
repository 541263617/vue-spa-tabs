<template>
  <div class="table-pagination">
    <table-view
      :index="index"
      :selection="selection"
      :loading="loading"
      :pageList="pageData.result"
      :indexMethod="indexMethod"
      :columns="columns"
      @current-change="handleColClick"
      @selection-change="handleSelectionChange"
      :cellClassName="cellClassName"
      :rowClassName="rowClassName"
      :height="height"
    >
    </table-view>
    <pagination-view
      @size-change="handleSizeChange"
      @current-change="handleNumberChange"
      :current-page="defaultConfig.pageNo"
      :total="pageData.totalCount"
    >
    </pagination-view>
  </div>
</template>

<script>
  export default {
    props: {
      selection: false,
      index: false,
      init: {
        type: Boolean,
        default () {
          return true
        }
      },
      height: {
        type: Number,
        default () {
          return 350
        }
      },
      loading: {
        type: Boolean,
        default () {
          return false
        }
      },
      columns: {
        type: Array,
        default () {
          return []
        }
      },
      params: {
        type: Object,
        default () {
          return {}
        }
      },
      pageData: {
        type: Object,
        default () {
          return {
            result: []
          }
        }
      },
      cellClassName: {
        type: Function
      },
      rowClassName: {
        type: Function
      }
    },
    data () {
      return {
        defaultConfig: {
          pageNo: 1,
          pageSize: 10
        }
      }
    },
    methods: {
      getPageData () {
        let _params = Object.assign({}, this.params, this.defaultConfig)
        this.$emit('getPageData', _params)
      },
      handleNumberChange (val) {
        this.defaultConfig.pageNo = val
        this.getPageData()
      },
      handleSizeChange (val) {
        this.defaultConfig.pageSize = val
        this.getPageData()
      },
      handleColClick (val) {
        this.$emit('col-click', val)
      },
      handleSelectionChange (val) {
        this.$emit('selection-change', val)
      },
      indexMethod (index) {
        return (this.pageData.pageNo - 1) * this.pageData.pageSize + index + 1
      }
    },
    created () {
      this.init && this.getPageData()
    }
  }
</script>
<style>
  .table-pagination {
    overflow: hidden;
  }

  .el-pagination {
    float: right;
    margin-top: 10px;
  }
</style>
