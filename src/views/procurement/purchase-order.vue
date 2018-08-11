<template>
  <div>
    <el-form :model="params" ref="queryForm" label-width="120px" class="demo-ruleForm" size="medium">
      <el-row :span="20">
        <el-col :span="6">
          <el-form-item label="采购单编号：" prop="purchaseOrderCode">
            <el-input v-model="params.purchaseOrderCode" placeholder="采购单编号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="供应商名称：" prop="supplierName">
            <el-input v-model="params.supplierName" placeholder="供应商名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="采购类型：" prop="purchaseType">
            <el-select v-model="params.purchaseType" placeholder="采购类型">
              <el-option :key="'purchaseTypes'+index" v-for="item,index in purchaseTypes" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="采购人：" prop="purchaseName">
            <el-input v-model="params.purchaseName" placeholder="采购人"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :span="20">
        <el-col :span="6">
          <el-form-item label="采购单状态：" prop="purchaseStatus">
            <el-select v-model="params.purchaseStatus" placeholder="采购类型">
              <el-option :key="'purchaseStatus'+index" v-for="item,index in purchaseOrderStatus" :label="item.name" :value="item.code"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="最近更新日期：">
            <el-col :span="11">
              <el-form-item prop="startDate">
                <el-date-picker
                  v-model="params.startDate"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  style="width: 100%">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col style="text-align: center" :span="2">-</el-col>
            <el-col :span="11">
              <el-form-item prop="endDate">
                <el-date-picker
                  v-model="params.endDate"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy 年 MM 月 dd 日"
                  value-format="yyyy-MM-dd"
                  style="width: 100%">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :offset="2" :span="6">
          <el-form-item>
            <el-button type="primary" icon="search" @click="search">查询</el-button>
            <el-button type="default" icon="circle-cross" @click="resetForm('queryForm')">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <table-pagination
      :loading="loading"
      ref="mainTable"
      @getPageData="getPageData"
      :params="params"
      :pageData="pageData"
      :columns="columns"
      @col-click="handleColClick"
    >
    </table-pagination>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="商品明细" name="goods">
        <table-view
          :index="true"
          :pageList="goodsList"
          :columns="goodsColumns"
          :height="220"
        >
        </table-view>
      </el-tab-pane>
      <el-tab-pane label="发件方信息" name="receiver">
        <el-row :gutter="20" style="font-size: 14px">
          <el-col :span="6">
            收件人：{{purchaseOrder.sender}}
          </el-col>
          <el-col :span="6">
            发件方手机：{{purchaseOrder.senderNumber}}
          </el-col>
          <el-col :span="6">
            发件方省份.城市：{{purchaseOrder.senderProvinceName}}-{{purchaseOrder.senderCityName}}
          </el-col>
          <el-col :span="6">
            发件方详细地址：{{purchaseOrder.senderAddress}}
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="其他信息" name="other">
        <el-row class="mb20" :gutter="20" style="font-size: 14px">
          <el-col :span="purchaseOrder.payTypeName!=='deliveryAfterPayment'?3:6">
            付款方式：{{purchaseOrder.payTypeName || ''}}
          </el-col>
          <el-col :span="3" v-show="purchaseOrder.payTypeName!=='deliveryAfterPayment'">
            预付款比例：{{purchaseOrder.paymentProportion}}
          </el-col>
          <el-col :span="5">
            币制：{{purchaseOrder.currencyTypeName}}
          </el-col>
          <el-col :span="5">
            运输费用承担方：{{purchaseOrder.transportFeeDestIdName}}
          </el-col>
          <el-col :span="4">
            提运单号：{{purchaseOrder.takeGoodsNo}}
          </el-col>
          <el-col :span="4">
            处理优先级：{{purchaseOrder.handlerPriorityName}}
          </el-col>
        </el-row>
        <el-row class="mb20" :gutter="20" style="font-size: 14px">
          <el-col :span="6">
            收货人：{{purchaseOrder.receiver}}
          </el-col>
          <el-col :span="5">
            收货人手机：{{purchaseOrder.receiverNumber}}
          </el-col>
          <el-col :span="5">
            要求到货日期：{{purchaseOrder.requriedReceiveDate}}
          </el-col>
          <el-col :span="8">
            截止到货日期：{{purchaseOrder.endReceiveDate}}
          </el-col>
        </el-row>
        <el-row :gutter="20" style="font-size: 14px">
          <el-col :span="20">
            备注：{{purchaseOrder.remark}}
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="操作日志" name="log">
        <log-table ref="logTable"></log-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
  import { createNamespacedHelpers } from 'vuex'
  import notify from '@/utils/notify'
  import purchase from '@/api/purchase'
  import ElRow from 'element-ui/packages/row/src/row'
  import ElCol from 'element-ui/packages/col/src/col'

  const {mapState, mapActions} = createNamespacedHelpers('purchaseOrder')
  export default {
    components: {
      ElCol,
      ElRow
    },
    name: 'procurement-purchase-order',
    data () {
      return {
        activeTab: 'goods',
        params: {
          start: 0,
          direction: 'ASC'
        },
        columns: [{
          label: '采购单编号',
          field: 'purchaseOrderCode'
        }, {
          label: '采购类型',
          field: 'purchaseType',
          formatter: (row, column, cellValue) => {
            return (this.purchaseTypesMap[cellValue] && this.purchaseTypesMap[cellValue].name) || ''
          }
        }, {
          label: '归属采购组',
          field: 'purchaseGroupName'
        }, {
          label: '归属采购人',
          field: 'purchasePerson'
        }, {
          label: '供应商名称',
          field: 'supplierName'
        }, {
          label: '收货仓库',
          field: 'warehouseName'
        }, {
          label: '要求到货日期',
          field: 'requriedReceiveDate'
        }, {
          label: '截止到货日期',
          field: 'endReceiveDate'
        }, {
          label: '采购单状态',
          field: 'status',
          formatter: (row, column, cellValue) => {
            return this.purchaseOrderStatusMap[cellValue].name
          }
        }, {
          label: '最近更新时间',
          field: 'updateTime'
        }, {
          label: '操作',
          width: '300',
          actions: [
            {
              label: '编辑',
              type: 'primary',
              click: (index, row) => {
                this.getGoodsListEdit({purchaseId: row.id, start: 0, pageIndex: 0})
                this.getPurchaseOrderEditById(row.id)
              }
            },
            {
              label: '删除',
              type: 'warning',
              click: (index, row) => {
                this.$confirm('删除后数据将不可恢复。', '您确认要删除吗？', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  this.deleteOrder(row)
                })
              }
            }
          ]
        }],
        goodsColumns: [
          {
            label: '商品SKU名称',
            field: 'skuName',
            width: '120px'
          },
          {
            label: '商品SKU编号',
            field: 'skuCode',
            width: '120px'
          },
          {
            label: '规格',
            field: 'specNatureInfo',
            width: '80px'
          },
          {
            label: '货号',
            field: 'itemNo',
            width: '120px'
          },
          {
            label: '条形码',
            field: 'barCode',
            width: '140px'
          },
          {
            label: '品牌名称',
            field: 'brandName',
            width: '120px'
          },
          {
            label: '一级分类/二级分类/三级分类',
            field: 'allCategoryName',
            width: '200px'
          },
          {
            label: '进价(元)',
            field: 'purchasePrice',
            width: '80px'
          },
          {
            label: '采购数量',
            field: 'purchasingQuantity',
            width: '90px'
          },
          {
            label: '采购总金额(元)',
            field: 'totalPurchaseAmount',
            width: '120px'
          },
          {
            label: '批次号',
            field: 'batchCode',
            width: '120px'
          },
          {
            label: '生产编码',
            field: 'produceCode',
            width: '120px'
          },
          {
            label: '生产日期',
            field: 'productDate',
            width: '100px'
          },
          {
            label: '截止保质日期',
            field: 'expireDate',
            width: '120px'
          },
          {
            label: '理论保质期限(天)',
            field: 'shelfLifeDays',
            width: '140px'
          }
        ]
      }
    },
    computed: {
      ...mapState(['purchaseOrderStatus', 'purchaseTypes', 'purchaseTypesMap', 'purchaseOrderStatusMap', 'pageData', 'loading', 'purchaseOrder', 'goodsList', 'purchaseOrderEdit', 'goodsListEdit'])
    },
    methods: {
      search () {
        this.$refs['mainTable'].getPageData()
      },
      handleColClick (val) {
        this.getGoodsList({purchaseId: val.id, start: 0, pageIndex: 0})
        this.getPurchaseOrderById(val.id)
        this.$refs['logTable'].getLogData({entityId: val.id, entityType: 'PurchaseOrder'})
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      deleteOrder (row) {
        purchase.deleteOrder(row).then((res) => {
          notify.success(res.data.databuffer)
          this.search()
        })
      },
      ...mapActions(['getPurchaseOrderStatus', 'getPurchaseTypes', 'getPageData', 'getPurchaseOrderById', 'getGoodsList', 'getPurchaseOrderEditById', 'getGoodsListEdit'])
    },
    created () {
      this.getPurchaseTypes()
      this.getPurchaseOrderStatus()
    }
  }
</script>
