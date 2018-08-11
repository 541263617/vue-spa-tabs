<template>
  <div class="supplier-order">
    <el-form :model="params" ref="queryForm" label-width="130px" class="demo-ruleForm" size="medium">
      <el-row>
        <el-col :span="6">
          <el-form-item label="供应商订单编号：" prop="warehouseOrderCode">
            <el-input v-model="params.warehouseOrderCode" placeholder="供应商订单编号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="店铺订单编号：" prop="shopOrderCode">
            <el-input v-model="params.shopOrderCode" placeholder="店铺订单编号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="平台订单编号：" prop="platformOrderCode">
            <el-input v-model="params.platformOrderCode" placeholder="平台订单编号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="供应商名称：" prop="supplierCode">
            <el-select v-model="params.supplierCode" placeholder="供应商名称">
              <el-option label="全部" value=""></el-option>
              <el-option :key="'supplierCode'+index" v-for="item,index in suppliers" :label="item.supplierName" :value="item.supplierInterfaceId"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="状态：" prop="supplierOrderStatus">
            <el-select v-model="params.supplierOrderStatus" placeholder="状态">
              <el-option label="全部" value=""></el-option>
              <el-option :key="'supplierOrderStatus'+index" v-for="item,index in supplierOrderStatus" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="付款日期：">
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
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  style="width: 100%">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item>
            <el-button type="primary" @click="search">查询</el-button>
            <el-button type="default" @click="resetForm('queryForm')">重置</el-button>
            <el-button type="default" @click="exportReport">导出</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <table-pagination
      :index="true"
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
          :pageList="orderInfo.orderItemList"
          :columns="goodsColumns"
          :height="220"
        >
        </table-view>
      </el-tab-pane>
      <el-tab-pane label="收货信息" name="receiver">
        <el-row :gutter="20" style="font-size: 14px">
          <el-col :span="6">
            收货人姓名：{{orderInfo.platformOrder.receiverName}}
          </el-col>
          <el-col :span="6">
            收货人手机号：{{orderInfo.platformOrder.receiverMobile}}
          </el-col>
          <el-col :span="6">
            收货省份.城市.区域：{{addressFull(orderInfo.platformOrder)}}
          </el-col>
          <el-col :span="6">
            收货详细地址：{{orderInfo.platformOrder.receiverAddress}}
          </el-col>
        </el-row>
        <el-row :gutter="20" style="font-size: 14px" v-show="orderInfo.supplierCode = 'JD' && orderInfo.supplierOrderStatus !== '1'">
          <el-col :span="6">
            京东四级地址：{{orderInfo.jdAddress}}
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="其他信息" name="other">
        <el-row class="mb20" :gutter="20" style="font-size: 14px">
          <el-col :span="5">
            店铺名称：{{orderInfo.shopName}}
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="操作日志" name="log">
        <log-table ref="logTable"></log-table>
      </el-tab-pane>
    </el-tabs>

    <el-dialog title="确认关闭" :visible.sync="cancelDialogVisible">
      <el-form :model="cancelDialogForm">
        <el-form-item label="请输入关闭原因：">
          <el-input type="textarea"
                    :rows="4"
                    placeholder="请输入关闭原因"
                    v-model="cancelDialogForm.cancelReason">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="cancelOrder(cancelDialogForm)">确定关闭</el-button>
      </div>
    </el-dialog>

    <el-dialog title="映射京东地址" :visible.sync="mapJDDialogVisible">
      <el-form :model="jdOrderForm" label-width="140px">
        <el-form-item label="收货人省市区：">
          <p>{{addressFull(platformOrder)}}</p>
        </el-form-item>
        <el-form-item label="收货人详细地址：">
          <p>{{platformOrder.receiverAddress}}</p>
        </el-form-item>
        <el-form-item label="京东地址：">
          <el-row>
            <el-col :span="6">
              <el-select v-model="jdOrderForm.province" placeholder="省份">
                <el-option label="省份" value=""></el-option>
                <el-option :key="'jdProvince'+index" v-for="item,index in jdAddress" :label="item.text" :value="item.id"></el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-select v-model="jdOrderForm.city" placeholder="城市">
                <el-option label="城市" value=""></el-option>
                <el-option :key="'jdCity'+index" v-for="item,index in jdCity" :label="item.text" :value="item.id"></el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-select v-model="jdOrderForm.area" placeholder="区/县">
                <el-option label="区/县" value=""></el-option>
                <el-option :key="'jdArea'+index" v-for="item,index in jdArea" :label="item.text" :value="item.id"></el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-select v-model="jdOrderForm.street" placeholder="街道">
                <el-option label="街道" value=""></el-option>
                <el-option :key="'jdStreet'+index" v-for="item,index in jdStreet" :label="item.text" :value="item.id"></el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmJdOrder(jdOrderForm)">确认并发送京东</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import tools from '@/utils/tools'
  import notify from '@/utils/notify'
  import jdAddress from '@/utils/jdAddress.json'
  import order from '@/api/order'
  import select from '@/api/select'
  import supplier from '@/api/supplier'
  import metadata from '@/api/metadata'

  export default {
    name: 'orders-supplier-order',
    data () {
      return {
        jdAddress: [],
        jdAddressMap: {},
        platformOrder: {},
        activeTab: 'goods',
        cancelDialogVisible: false,
        cancelDialogForm: {
          cancelReason: '',
          warehouseOrderCode: '',
          isCancel: 1
        },
        mapJDDialogVisible: false,
        jdOrderForm: {
          province: '',
          city: '',
          area: '',
          street: ''
        },
        params: {
          start: 0,
          orderType: 1,
          startDate: '',
          endDate: '',
          warehouseOrderCode: '',
          shopOrderCode: '',
          platformOrderCode: '',
          supplierCode: '',
          supplierOrderStatus: ''
        },
        pageData: {},
        loading: false,
        supplierOrderStatus: [],
        supplierOrderStatusMap: {},
        suppliers: [],
        orderInfo: {
          orderItemList: [],
          platformOrder: {}
        },
        columns: [
          {label: '供应商订单编号', field: 'warehouseOrderCode', width: '230'},
          {label: '供应商名称', field: 'supplierName', width: '100'},
          {label: '平台订单号', field: 'platformOrderCode', width: '150'},
          {label: '店铺订单号', field: 'shopOrderCode', width: '160'},
          {label: '商品总数量', field: 'itemsNum', width: '100'},
          {label: '商品总金额(元)', field: 'payment', width: '120'},
          {label: '付款时间', field: 'payTime', width: '160'},
          {
            label: '状态',
            width: '120',
            desField: 'message',
            field: 'supplierOrderStatus',
            formatter: (row, column, cellValue) => {
              let data = this.supplierOrderStatusMap[cellValue]
              return (data && data.name) || ''
            }
          },
          {label: '供应商反馈物流公司和运单号', field: 'logisticsInfo', width: '220'},
          {
            label: '操作',
            width: '170',
            actions: [
              {
                label: '映射地址',
                type: 'primary',
                size: 'mini',
                visible: (row) => {
                  return ((row.supplierOrderStatus === '1' || row.supplierOrderStatus === '5') && row.supplierCode === 'JD')
                },
                click: (index, row) => {
                  this.jdOrderForm.warehouseOrderCode = row.warehouseOrderCode
                  this.getPlatformOrders({platformOrderCode: row.platformOrderCode})
                  this.mapJDDialogVisible = true
                }
              },
              {
                label: '关闭',
                type: 'danger',
                size: 'mini',
                visible: (row) => {
                  return (row.supplierOrderStatus === '1' || row.supplierOrderStatus === '5')
                },
                click: (index, row) => {
                  this.cancelDialogForm.warehouseOrderCode = row.warehouseOrderCode
                  this.cancelDialogVisible = true
                }
              },
              {
                label: '取消关闭',
                size: 'mini',
                visible: (row) => {
                  return (row.supplierOrderStatus === '7' || row.showCancel === '1')
                },
                click: (index, row) => {
                  this.$confirm('确定后数据将恢复到关闭前的状态。', '您确认取消关闭吗？', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                    order.cancelOrder({warehouseOrderCode: row.warehouseOrderCode, isCancel: 0})
                    .then((res) => {
                      notify.success('订单取消关闭成功')
                      this.search()
                    })
                  })
                }
              }
            ]
          }
        ],
        goodsColumns: [
          {label: 'SKU名称', field: 'itemName', width: '150'},
          {label: 'SKU编号', field: 'skuCode', link: '/goods/goods-info', width: '170'},
          {label: '供应商SKU编号', field: 'supplierSkuCode', width: '170'},
          {label: '供应商反馈订单号', field: 'supplierOrderCode', width: '160'},
          {label: '实付总金额（元）', field: 'payment', width: '140'},
          {label: '应发商品数量', field: 'num', width: '120'},
          {label: '实发商品数量', field: 'deliverNum', width: '120'},
          {
            label: '发货状态',
            field: 'supplierOrderStatus',
            width: '120',
            formatter: (row, column, cellValue) => {
              let data = this.supplierOrderStatusMap[cellValue]
              return (data && data.name) || ''
            }
          }, {
            label: '物流信息',
            headerAlign: 'center',
            children: [{
              label: '物流公司',
              width: '120',
              field: 'deliverPackageFormList',
              formatter: (row, column, cellValue) => {
                let result = '';
                (cellValue || []).map((val) => {
                  result += val.logisticsCorporation
                })
                return result
              }
            }, {
              label: '运单编号',
              width: '160',
              field: 'deliverPackageFormList',
              formatter: (row, column, cellValue) => {
                let result = '';
                (cellValue || []).map((val) => {
                  result += val.waybillNumber
                })
                return result
              }
            }, {
              label: '商品数量',
              width: '100',
              field: 'deliverPackageFormList',
              formatter: (row, column, cellValue) => {
                let result = 0;
                (cellValue || []).map((val) => {
                  result += val.skuNum
                })
                return result || ''
              }
            }]
          }]
      }
    },
    computed: {
      jdCity () {
        this.jdOrderForm.city = ''
        let province = this.jdAddressMap[this.jdOrderForm.province]
        return (province && province.children) || []
      },
      jdArea () {
        this.jdOrderForm.area = ''
        let city = this.jdAddressMap[this.jdOrderForm.city]
        return (city && city.children) || []
      },
      jdStreet () {
        this.jdOrderForm.street = ''
        let area = this.jdAddressMap[this.jdOrderForm.area]
        return (area && area.children) || []
      }
    },
    methods: {
      getPageData (params) {
        this.loading = true
        order.getWarehouseOrderPage(params)
        .then((res) => {
          this.pageData = res.data
          this.loading = false
        })
      },
      search () {
        this.$refs['mainTable'].getPageData()
      },
      getSupplierOrderStatus () {
        select.getSupplierOrderStatus()
        .then((res) => {
          let map = {}
          let result = res.data.result
          this.supplierOrderStatus = result
          tools.getMap(result, map, 'value')
          this.supplierOrderStatusMap = map
        })
      },
      getSuppliers (params) {
        supplier.getSuppliers(params)
        .then((res) => {
          this.suppliers = res.data.result
        })
      },
      handleColClick (val) {
        this.getWarehouseOrderById(val.warehouseOrderCode)
        this.$refs['logTable'].getLogData({entityId: val.id, entityType: 'WarehouseOrder'})
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      getWarehouseOrderById (id) {
        order.getWarehouseOrderById(id)
        .then((res) => {
          this.orderInfo = res.data.result
        })
      },
      addressFull (platformOrder) {
        let province = platformOrder.receiverProvince
        let city = platformOrder.receiverCity
        let district = platformOrder.receiverDistrict
        let result = []
        province && result.push(province)
        city && result.push(city)
        district && result.push(district)
        return result.join('.')
      },
      getPlatformOrders (params) {
        order.getPlatformOrders(params)
        .then((res) => {
          let platformOrders = res.data.result
          if (platformOrders && platformOrders.length > 0) {
            this.platformOrder = platformOrders[0]
          } else {
            notify.error('获取信息失败！')
          }
        })
      },
      cancelOrder (data) {
        order.cancelOrder(data)
        .then((res) => {
          notify.success(res.data.databuffer)
          data.cancelReason = ''
          this.cancelDialogVisible = false
          this.search()
        })
      },
      confirmJdOrder (formData) {
        if (!formData.province && this.jdAddress.length > 0) {
          notify.warning('请选择省份！')
        } else if (!formData.city && this.jdCity.length > 0) {
          notify.warning('请选择城市！')
        } else if (!formData.area && this.jdArea.length > 0) {
          notify.warning('请选择区/县！')
        } else if (!formData.street && this.jdStreet.length > 0) {
          notify.warning('请选择街道！')
        } else {
          let jdAddressCode = []
          let jdAddressName = []
          if (formData.province) {
            jdAddressCode.push(formData.province)
            jdAddressName.push(this.jdAddressMap[formData.province].text)
          }
          if (formData.city) {
            jdAddressCode.push(formData.city)
            jdAddressName.push(this.jdAddressMap[formData.city].text)
          }
          if (formData.area) {
            jdAddressCode.push(formData.area)
            jdAddressName.push(this.jdAddressMap[formData.area].text)
          }
          if (formData.street) {
            jdAddressCode.push(formData.street)
            jdAddressName.push(this.jdAddressMap[formData.street].text)
          }
          let submitData = {
            warehouseOrderCode: formData.warehouseOrderCode,
            jdAddressCode: jdAddressCode.join('/'),
            jdAddressName: jdAddressName.join('/')
          }
          order.confirmJdOrder(submitData)
          .then((res) => {
            notify.success(res.data.databuffer)
            this.mapJDDialogVisible = false
            this.search()
            for (let i in formData) {
              formData[i] = ''
            }
          })
        }
      },
      getJdAddress () {
        metadata.getJdAddress().then((res) => {
          console.log(res)
        })
      },
      exportReport () {
        this.$store.dispatch('exportReport', {
          url: 'order/exportSupplierOrder',
          params: this.params
        })
      }
    },
    created () {
      /*this.getSupplierOrderStatus()
      this.getSuppliers({supplierKindCode: 'oneAgentSelling'})*/
      this.jdAddress = jdAddress
      tools.getMap(jdAddress, this.jdAddressMap)
      let now = new Date()
      let day = now.getDate()
      this.params.startDate = new Date(new Date().setDate(day - 29)).format('yyyy-MM-dd')
      this.params.endDate = now.format('yyyy-MM-dd')
    }
  }
</script>
