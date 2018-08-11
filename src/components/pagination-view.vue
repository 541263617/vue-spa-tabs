<template>
  <el-pagination
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="currentPage"
    :page-sizes="[10, 20, 50, 100]"
    :page-size="10"
    layout="total, sizes, prev, pager, next, jumper"
    :total="total||0">
  </el-pagination>
</template>

<script>
  export default {
    props: {
      total: {
        type: Number,
        default () {
          return 0
        }
      },
      currentPage: {
        type: Number,
        default () {
          return 0
        }
      }
    },
    methods: {
      handleSizeChange (val) {
        this.$emit('size-change', val)
      },
      handleCurrentChange (val) {
        this.$emit('current-change', val)
      }
    }
  }
</script>
