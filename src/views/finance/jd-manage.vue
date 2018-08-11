<template>
  <div class="jd-manage">
    <div class="date-syn">
      最近同步时间：{{balance.time}}
    </div>
    <div class="account-info" v-loading="balanceLoading">
      <div class="title">
        京东账户信息<span class="tip">（基于京东接口的不确定性，以下信息仅供参考，实际请以银行信息为准）</span>
      </div>
      <div class="inner">
        <div class="amount">
          <label>当前余额（元）：</label>
          <span class="value">{{balance.currentBalance}}</span>
        </div>
        <div class="amount-syn">
          <ul class="clear-fix">
            <li class="remain">
              <label>同步时余额（元）： </label>
              <span>{{balance.balance}}</span>
            </li>
            <li class="in">
              <label>同步时累计收入（元）： </label>
              <span>{{balance.refundAll}}</span>
            </li>
            <li class="out">
              <label>同步时累计支出（元）： </label>
              <span>{{balance.expendAll}}</span>
            </li>
          </ul>
        </div>
        <div class="state" v-if="balance.state===1">
          <span>同步时余额</span>
          <span> = </span>
          <span>同步时累计收入 - 同步时累计支出</span>
          <span class="normal">正常</span>
        </div>
        <div class="state" v-if="balance.state!==1">
          <span>同步时余额</span>
          <span> ≠ </span>
          <span>同步时累计收入 - 同步时累计支出</span>
          <span class="abnormal">不正常</span>
        </div>
      </div>
    </div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="订单比对明细" name="order">
        <el-form :model="orderParams" ref="orderForm" label-width="130px" class="demo-ruleForm" size="medium">
          <el-row>
            <el-col :span="6">
              <el-form-item label="京东订单编号：" prop="orderCode">
                <el-input v-model="orderParams.orderCode" placeholder="京东订单编号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="京东商品编号：" prop="itemSkuCode">
                <el-input v-model="orderParams.itemSkuCode" placeholder="京东商品编号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="京东商品名称：" prop="itemSkuName">
                <el-input v-model="orderParams.itemSkuName" placeholder="京东商品名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="异常说明：" prop="errMsg">
                <el-select v-model="orderParams.errMsg" placeholder="异常说明">
                  <el-option label="全部" value=""></el-option>
                  <el-option value="正常">正常</el-option>
                  <el-option value="非正常">非正常</el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="渠道平台订单号：" prop="channelPlatformOrder">
                <el-input v-model="orderParams.channelPlatformOrder" placeholder="渠道平台订单号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="渠道店铺订单号：" prop="shopOrderCode">
                <el-input v-model="orderParams.shopOrderCode" placeholder="渠道店铺订单号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="余额变动日期：">
                <el-col :span="11">
                  <el-form-item prop="startUpdateTime">
                    <el-date-picker
                      v-model="orderParams.startUpdateTime"
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
                  <el-form-item prop="endUpdateTime">
                    <el-date-picker
                      v-model="orderParams.endUpdateTime"
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
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="渠道商品订单号：" prop="orderItemCode">
                <el-input v-model="orderParams.orderItemCode" placeholder="渠道商品订单号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :offset="10" :span="8">
              <el-form-item>
                <el-button type="primary" @click="searchOrder">查询</el-button>
                <el-button type="default" @click="resetForm('orderForm')">重置</el-button>
                <el-button type="default" @click="exportOrderReport">导出</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <table-pagination
          :index="true"
          :loading="loading"
          ref="orderTable"
          @getPageData="getOrderPageData"
          :params="orderParams"
          :pageData="orderPageData"
          :columns="orderColumns"
          :cell-class-name="cellClassName"
          :row-class-name="rowClassName"
        >
        </table-pagination>
      </el-tab-pane>
      <el-tab-pane label="余额变动明细" name="balance">
        <el-form :model="balanceParams" ref="balanceForm" label-width="130px" class="demo-ruleForm" size="medium">
          <el-row>
            <el-col :span="5">
              <el-form-item label="京东订单号：" prop="orderId">
                <el-input v-model="balanceParams.orderId" placeholder="京东订单号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="业务类型：" prop="tradeTypeName">
                <el-select v-model="balanceParams.tradeTypeName" placeholder="业务类型">
                  <el-option label="全部" value=""></el-option>
                  <el-option :key="'tradeTypeName'+index" v-for="item,index in treadType" :label="item.treadTypeName" :value="item.treadTypeName"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="日期范围：">
                <el-col :span="11">
                  <el-form-item prop="startUpdateTime">
                    <el-date-picker
                      v-model="balanceParams.startUpdateTime"
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
                  <el-form-item prop="endUpdateTime">
                    <el-date-picker
                      v-model="balanceParams.endUpdateTime"
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
            <el-col :offset="1" :span="5">
              <el-button type="primary" @click="searchBalance">查询</el-button>
              <el-button type="default" @click="resetForm('balanceForm')">重置</el-button>
              <el-button type="default" @click="exportBalanceReport">导出</el-button>
            </el-col>
          </el-row>
        </el-form>
        <div class="balance-sum clear-fix">
          <p>
            余额支出：<span>{{statisticsBalance.totalOutCome}}</span>
          </p>
          <p>
            余额收入（含退款）：<span>{{statisticsBalance.totalIncome}}</span>
          </p>
        </div>
        <table-pagination
          :index="true"
          :loading="loading"
          ref="balanceTable"
          @getPageData="getBalancePageData"
          :params="balanceParams"
          :pageData="balancePageData"
          :columns="balanceColumns"
        >
        </table-pagination>
      </el-tab-pane>
    </el-tabs>

    <el-dialog title="操作" :visible.sync="operateDialogVisible">
      <el-form :model="operateDialogForm" label-width="100px">
        <el-form-item label="是否了结：">
          <el-radio v-model="operateDialogForm.operate" :label="2">是</el-radio>
          <el-radio v-model="operateDialogForm.operate" :label="1">否</el-radio>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input type="textarea"
                    :rows="4"
                    placeholder="请输入备注"
                    v-model="operateDialogForm.cancelReason">
          </el-input>
          <p style="color: gray">注：了结时必填</p>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="operateBill(operateDialogForm)">确定关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import bill from '@/api/bill'
  import notify from '@/utils/notify'

  export default {
    name: 'finance-jd-manage',
    data () {
      return {
        activeName: 'order',
        balanceLoading: false,
        operateDialogVisible: false,
        loading: false,
        treadType: [],
        operateDialogForm: {
          operate: 0,
          id: 0,
          remark: ''
        },
        orderParams: {
          startUpdateTime: '',
          endUpdateTime: '',
          start: 0,
          orderCode: '',
          itemSkuCode: '',
          itemSkuName: '',
          channelPlatformOrder: '',
          shopOrderCode: '',
          orderItemCode: '',
          errMsg: ''
        },
        balanceParams: {
          start: 0,
          orderId: '',
          tradeTypeName: '',
          startUpdateTime: '',
          endUpdateTime: ''
        },
        balancePageData: {},
        statisticsBalance: {},
        balance: {},
        orderPageData: {},
        orderColumns: [
          {label: '异常说明', field: 'errMsg', width: '150'},
          {label: '京东订单生成时间', field: 'jingdongOrderCreateTime', width: '140'},
          {label: '京东父订单编号', field: 'parentOrderCode', width: '140'},
          {label: '京东子订单编号', field: 'orderCode', width: '140'},
          {label: '京东商品编号', field: 'itemSkuCode', width: '140'},
          {label: '京东商品名称', field: 'itemSkuName', width: '200'},
          {label: '京东商品一级分类', field: 'firstClassify', width: '140'},
          {label: '京东商品二级分类', field: 'secondClassify', width: '140'},
          {label: '京东商品三级分类', field: 'thirdClassify', width: '140'},
          {label: '京东商品发货数量', field: 'jdItemsNum', width: '140'},
          {label: '京东商品单价', field: 'price', width: '100'},
          {label: '京东商品总金额', field: 'totalPrice', width: '120'},
          {label: '京东子订单运费', field: 'freight', width: '100'},
          {label: '京东子订单总金额', field: 'subTotalPrice', width: '130'},
          {label: '京东父订单总金额', field: 'parentTotalPrice', width: '130'},
          {label: '账户实际支付金额', field: 'actualPay', width: '120'},
          {label: '账户实际退款金额', field: 'refund', width: '120'},
          {label: '渠道订单提交时间', field: 'channelOrderSubmitTime', width: '140'},
          {label: '渠道平台订单号', field: 'channelPlatformOrder', width: '140'},
          {label: '渠道店铺订单号', field: 'shopOrderCode', width: '140'},
          {label: '渠道商品订单号', field: 'orderItemCode', width: '140'},
          {label: '客户购买商品数量', field: 'channelItemsNum', width: '120'},
          {label: '客户实付商品金额', field: 'pay', width: '120'},
          {label: '余额变动时间', field: 'balanceCreateTime', width: '160'},
          {label: '订单状态', field: 'state', width: '75'},
          {label: '了结状态', field: 'operate', width: '100'},
          {
            label: '操作',
            width: '80',
            actions: [
              {
                label: '操作',
                type: 'primary',
                size: 'mini',
                visible: (row) => {
                  return (row.operate === '待了结' || row.operate === '已了结')
                },
                click: (index, row) => {
                  let operate = row.operate
                  if (operate === '已了结') {
                    this.operateDialogForm.operate = 2
                  } else if (operate === '待了结') {
                    this.operateDialogForm.operate = 1
                  }
                  this.operateDialogForm.id = row.id
                  this.operateDialogVisible = true
                }
              }
            ]
          }
        ],
        balanceColumns: [
          {label: '业务号', field: 'tradeNo', width: '120'},
          {label: '京东账号', field: 'pin', width: '120'},
          {label: '京东订单号', field: 'orderId', width: '140'},
          {label: '收入', field: 'income', width: '120'},
          {label: '支出', field: 'outcome', width: '120'},
          {label: '账号类型', field: 'accountType', width: '100'},
          {label: '余额变动时间', field: 'createdDate', width: '180'},
          {label: '业务类型', field: 'tradeTypeName', width: '180'},
          {label: '备注', field: 'notePub', width: '320'}
        ]
      }
    },
    methods: {
      getBalance () {
        this.balanceLoading = true
        bill.getBalance()
        .then((res) => {
          this.balance = res.data.result
          this.balanceLoading = false
        })
      },
      getOrderPageData (params) {
        this.loading = true
        bill.getOrderDetailPage(params)
        .then((res) => {
          this.orderPageData = res.data
          this.loading = false
        })
      },
      getBalancePageData (params) {
        this.loading = true
        bill.getBalanceDetailPage(params)
        .then((res) => {
          this.balancePageData = res.data
          this.loading = false
        })
      },
      getStatisticsBalance () {
        bill.getStatisticsBalance(this.params)
        .then((res) => {
          this.statisticsBalance = res.data.result
        })
      },
      operateBill (data) {
        if (data.operate === 2 && !data.remark) {
          notify.warning('了结时，备注必填')
          return
        }
        bill.operateBill(data)
        .then((res) => {
          notify.success(res.data.databuffer)
          this.operateDialogVisible = false
          this.operateDialogForm.remark = ''
        })
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      searchOrder () {
        this.$refs['orderTable'].getPageData()
      },
      searchBalance () {
        this.$refs['balanceTable'].getPageData()
        this.getStatisticsBalance()
      },
      exportOrderReport () {
        this.$store.dispatch('exportReport', {
          url: 'bill/exportOrderDetail',
          params: this.orderParams
        })
      },
      exportBalanceReport () {
        this.$store.dispatch('exportReport', {
          url: 'bill/exportBalanceDetail',
          params: this.balanceParams
        })
      },
      getTreadType () {
        bill.getTreadType()
        .then((res) => {
          this.treadType = res.data.result
        })
      },
      cellClassName ({row, column}) {
        if (column.property === 'errMsg' && row[column.property] !== '正常') {
          return 'error-cell'
        }
      },
      rowClassName ({row, rowIndex}) {
        if (row['errMsg'] !== '正常') {
          return 'error-row'
        }
      }
    },
    created () {
      /*this.getBalance()
      this.getTreadType()
      this.getStatisticsBalance()*/
    }
  }
</script>
<style lang="less" scoped>
  .jd-manage {
    position: relative;
    font-size: 12px;
    .date-syn {
      position: absolute;
      top: 10px;
      right: 10px;
      color: blue;
    }
    .account-info {
      width: 100%;
      padding: 10px 30px 0 65px;
      border: 1px dashed green;
      border-radius: 7px;
      background-color: #eee;
      color: #333;
      .title {
        font-weight: bold;
        margin-left: -35px;
        padding-left: 35px;
        height: 32px;
        line-height: 32px;
        background: url("../../assets/money-coin.png") no-repeat;
        background-position: 0 center;
        .tip {
          font-weight: normal;
          color: gray;
        }
      }
      .inner {
        > div {
          height: 42px;
          line-height: 32px;
          padding: 5px 0;
          border-bottom: 1px dashed green;
        }
        > div:last-child {
          border: none;
        }
        .amount {
          .value {
            color: orange;
            font-size: 16px;
            font-weight: bold;
            margin-left: 5px;
            vertical-align: middle;
          }
        }
        .amount-syn {
          ul {
            li {
              width: 300px;
              float: left;
            }
          }
        }
        .state {
          .normal {
            margin-left: 10px;
            color: green;
            font-weight: bold;
          }
          .abnormal {
            margin-left: 10px;
            color: red;
            font-weight: bold;
          }
        }
      }
    }
    .balance-sum {
      height: 40px;
      line-height: 40px;
      font-size: 14px;
      font-weight: bold;
      padding-left: 20px;
      p {
        float: left;
        padding-right: 20px;
      }
    }
  }
</style>
