<template>
  <el-table
    v-loading="loading"
    :data="pageList"
    :height="height"
    stripe
    border
    highlight-current-row
    @current-change="handleCurrentChange"
    @selection-change="handleSelectionChange"
    :cell-class-name="cellClassName"
    :row-class-name="rowClassName"
    style="width: 100%">
    <el-table-column
      v-if="selection"
      type="selection"
      width="35">
    </el-table-column>
    <el-table-column
      v-if="index"
      label="序号"
      width="50"
      type="index"
      :index="indexFn"
    >
    </el-table-column>
    <el-table-column
      v-for="(item,index) in columns"
      v-if="item.field&&!item.link&&!item.desField"
      :key="'col'+index"
      :header-align="item.headerAlign||'left'"
      :label="item.label"
      :prop="item.field"
      :width="item.width"
      :formatter="item.formatter">
    </el-table-column>
    <el-table-column
      v-else-if="item.field&&item.desField"
      :header-align="item.headerAlign||'left'"
      :key="'col'+index"
      :label="item.label"
      :width="item.width">
      <template slot-scope="scope">
        <el-popover trigger="hover" placement="top" v-if="scope.row[item.desField]">
          <p v-html="scope.row[item.desField]"></p>
          <div slot="reference" class="name-wrapper" style="cursor: pointer;color: red">
            {{ item.formatter ? item.formatter(scope.row, columns, scope.row[item.field]) : scope.row[item.field] }}
          </div>
        </el-popover>
        <div v-else>
          <div slot="reference" class="name-wrapper">
            {{ item.formatter ? item.formatter(scope.row, columns, scope.row[item.field]) : scope.row[item.field] }}
          </div>
        </div>
      </template>
    </el-table-column>
    <el-table-column
      v-else-if="item.field&&item.link"
      :header-align="item.headerAlign||'left'"
      :key="'col'+index"
      :label="item.label"
      :width="item.width">
      <template slot-scope="scope">
        <router-link style="color:blue" :to="`${item.link}/${scope.row[item.field]}`">{{scope.row[item.field]}}</router-link>
      </template>
    </el-table-column>
    <el-table-column
      v-else-if="!item.field&&item.children"
      :key="'col'+index"
      :header-align="item.headerAlign||'left'"
      :label="item.label">
      <el-table-column
        v-for="(item,index) in item.children"
        :key="'col'+index"
        :label="item.label"
        :prop="item.field"
        :width="item.width"
        :formatter="item.formatter">
      </el-table-column>
    </el-table-column>
    <el-table-column
      v-else-if="!item.field&&item.actions"
      :fixed="item.fixed"
      :header-align="item.headerAlign||'left'"
      :label="item.label"
      :width="item.width">
      <template slot-scope="scope">
        <el-button
          v-for="subItem,index in item.actions"
          v-if="subItem.visible?subItem.visible(scope.row):true"
          :key="'action'+index"
          :type="subItem.type"
          :size="subItem.size||'mini'"
          @click.stop="subItem.click(scope.$index,scope.row)"
        >
          {{subItem.label}}
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
  export default {
    props: {
      selection: false,
      index: false,
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
      pageList: {
        type: Array,
        default () {
          return []
        }
      },
      columns: {
        type: Array,
        default () {
          return []
        }
      },
      indexMethod: {
        type: Function
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
        loadingInstance: '',
        loadingOption: {}
      }
    },
    methods: {
      handleCurrentChange (val) {
        this.$emit('current-change', val)
      },
      handleSelectionChange (val) {
        this.$emit('selection-change', val)
      },
      indexFn (index) {
        return (this.indexMethod && this.indexMethod(index)) || (index + 1)
      }
    }
  }
</script>
<style>
  .el-pagination {
    float: right;
    margin-top: 10px;
  }

  .el-table .error-row, .el-table .error-row td {
    background: #ffcc33 !important;
  }

  .el-table .success-row, .el-table .warning-row td {
    background: #f0f9eb;
  }

  .el-table .error-cell {
    color: red;
  }
</style>
