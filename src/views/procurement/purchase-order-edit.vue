<template>
  <div class="action-page">
    <el-form ref="editForm" :rules="rules" :model="purchaseOrderEdit" label-width="120px" size="small">
      <div class="sub-title">基本信息</div>
      <el-form-item label="采购单编号：" prop="purchaseOrderCode">
        <label>{{purchaseOrderEdit.purchaseOrderCode}}</label>
      </el-form-item>
      <el-row :span="20">
        <el-col :span="5">
          <el-form-item label="供应商名称：" prop="supplierCode">
            <el-select v-model="purchaseOrderEdit.supplierCode" placeholder="供应商名称：">
              <el-option label="请选择" value=""></el-option>
              <el-option v-for="item,index in Suppliers" :key="'supplierCode'+index" :label="item.supplierName" :value="item.supplierCode"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="采购合同：" prop="contractCode">
            <el-input v-model="purchaseOrderEdit.contractCode"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="采购类型：" prop="purchaseType">
            <el-select v-model="purchaseOrderEdit.purchaseType" placeholder="采购类型：">
              <el-option label="请选择" value=""></el-option>
              <el-option v-for="item,index in purchaseTypes" :key="'purchaseType'+index" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="付款方式：" prop="payType">
            <el-select v-model="purchaseOrderEdit.payType" placeholder="付款方式：">
              <el-option label="请选择" value=""></el-option>
              <el-option v-for="item,index in payTypes" :key="'payType'+index" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4" v-if="purchaseOrderEdit.payType==='deliveryAfterPayment'">
          <el-form-item label="预付款比例(%)：" prop="paymentProportion" label-width="140px">
            <el-input type="number" v-model="purchaseOrderEdit.paymentProportion"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :span="20">
        <el-col :span="5">
          <el-form-item label="归属采购组：" prop="purchaseGroupCode">
            <el-select v-model="purchaseOrderEdit.purchaseGroupCode" placeholder="归属采购组：" @change="purchaseGroupsChange">
              <el-option label="请选择" value=""></el-option>
              <el-option v-for="item,index in purchaseGroups" :key="'purchaseGroupCode'+index" :label="item.name" :value="item.code"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="归属采购人：" prop="purchasePersonId">
            <el-select v-model="purchaseOrderEdit.purchasePersonId" placeholder="归属采购人：">
              <el-option label="请选择" value=""></el-option>
              <el-option v-for="item,index in purchasePersons" :key="'purchasePersonId'+index" :label="item.name" :value="item.userId"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="收货仓库：" prop="warehouseInfoId">
            <el-select v-model="purchaseOrderEdit.warehouseInfoId" placeholder="收货仓库：">
              <el-option label="请选择" value=""></el-option>
              <el-option v-for="item,index in warehouse" :key="'warehouse'+index" :label="item.warehouseName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="币制：" prop="currencyType">
            <el-select v-model="purchaseOrderEdit.currencyType" placeholder="币制：">
              <el-option label="请选择" value=""></el-option>
              <el-option v-for="item,index in currencyTypes" :key="'currencyType'+index" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">
          <el-form-item label="收货人：" prop="receiver">
            <el-input v-model="purchaseOrderEdit.receiver"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="收货人手机：" prop="receiverNumber">
            <el-input v-model="purchaseOrderEdit.receiverNumber"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="提运单号：" prop="takeGoodsNo">
            <el-input v-model="purchaseOrderEdit.takeGoodsNo"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="运费承担方：" prop="transportFeeDestId">
            <el-select v-model="purchaseOrderEdit.transportFeeDestId" placeholder="运输费用承担方：">
              <el-option label="请选择" value=""></el-option>
              <el-option v-for="item,index in transportCostsTake" :key="'transportFeeDestId'+index" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">
          <el-form-item label="要求到货日期">
            <el-date-picker type="date" value-format="yyyy-MM-dd" placeholder="选择日期" v-model="purchaseOrderEdit.requriedReceiveDate" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="截止到货日期">
            <el-date-picker type="date" value-format="yyyy-MM-dd" placeholder="选择日期" v-model="purchaseOrderEdit.endReceiveDate" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="处理优先级：" prop="handlerPriority">
            <el-select v-model="purchaseOrderEdit.handlerPriority" placeholder="处理优先级：">
              <el-option label="请选择" value=""></el-option>
              <el-option v-for="item,index in handlerPriority" :key="'handlerPriority'+index" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="15">
          <el-form-item label="备注：" prop="remark">
            <el-input type="textarea" :rows="3" v-model="purchaseOrderEdit.remark"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="采购总金额：" prop="totalFee">
            <el-input v-model="purchaseOrderEdit.totalFee">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="sub-title">发件方信息</div>
      <el-row :span="20">
        <el-col :span="5">
          <el-form-item label="发件人：" prop="sender">
            <el-input v-model="purchaseOrderEdit.sender"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="发件方省份.城市">
            <el-col :span="12">
              <el-form-item prop="senderProvince">
                <el-select v-model="purchaseOrderEdit.senderProvince" placeholder="省份：" @change="changeProvince">
                  <el-option label="省份" value=""></el-option>
                  <el-option v-for="item,index in address" :key="'senderProvince'+index" :label="item.text" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="senderCity">
                <el-select v-model="purchaseOrderEdit.senderCity" placeholder="城市：">
                  <el-option label="城市" value=""></el-option>
                  <el-option v-for="item,index in cities" :key="'senderCity'+index" :label="item.text" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="发件方手机：" prop="senderNumber">
            <el-input v-model="purchaseOrderEdit.senderNumber"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="发件方详细地址：" prop="senderAddress" labelWidth="140px">
            <el-input v-model="purchaseOrderEdit.senderAddress"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="sub-title">商品明细</div>
      <el-button type="primary" icon="el-icon-plus" size="small" @click="showPurchaseOrderDialog" style="margin-bottom: 20px">选择采购商品</el-button>
      <el-table
        :data="goodsListEdit"
        :height="220"
        stripe
        border
        highlight-current-row
        style="width: 100%">
        <el-table-column
          label="序号"
          width="50"
          type="index"
        >
        </el-table-column>
        <el-table-column
          label="商品SKU名称"
          prop="skuName"
          width="160px">
        </el-table-column>
        <el-table-column
          label="商品SKU编号"
          prop="skuCode"
          width="180px">
        </el-table-column>
        <el-table-column
          label="规格"
          prop="specNatureInfo"
          width="160px">
        </el-table-column>
        <el-table-column
          label="货号"
          prop="itemNo"
          width="120px">
        </el-table-column>
        <el-table-column
          label="条形码"
          prop="barCode"
          width="140px">
        </el-table-column>
        <el-table-column
          label="品牌名称"
          prop="brandName"
          width="140px">
        </el-table-column>
        <el-table-column
          label="一级分类/二级分类/三级分类"
          prop="allCategoryName"
          width="200px">
        </el-table-column>
        <el-table-column
          label="*进价(元)"
          prop="purchasePrice"
          width="100px">
          <template slot-scope="scope">
            <el-input type="number" v-model="scope.row.purchasePrice"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="*采购数量"
          prop="purchasingQuantity"
          width="100px">
          <template slot-scope="scope">
            <el-input type="number" v-model="scope.row.purchasingQuantity"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="采购总金额(元)"
          prop="totalPurchaseAmount"
          width="120px">
        </el-table-column>
        <el-table-column
          label="*批次号"
          prop="batchCode"
          width="160px">
          <template slot-scope="scope">
            <el-input v-model="scope.row.batchCode"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="生产编码"
          prop="produceCode"
          width="160px">
          <template slot-scope="scope">
            <el-input v-model="scope.row.produceCode"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="生产日期"
          prop="productDate"
          width="160px">
          <template slot-scope="scope">
            <el-date-picker type="date" v-model="scope.row.productDate" style="width: 100%;"></el-date-picker>
          </template>
        </el-table-column>
        <el-table-column
          label="截止保质日期"
          prop="expireDate"
          width="160px">
          <template slot-scope="scope">
            <el-date-picker type="date" v-model="scope.row.expireDate" style="width: 100%;"></el-date-picker>
          </template>
        </el-table-column>
        <el-table-column
          label="理论保质期限(天)"
          prop="shelfLifeDays"
          width="140px">
          <template slot-scope="scope">
            <el-input v-model="scope.row.shelfLifeDays"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="80px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click.stop="deleteGoodsItem(scope.$index)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-form-item>
        <el-row>
          <el-col :offset="9" style="margin-top: 20px">
            <el-button type="primary" @click="audit('editForm')">提交审核</el-button>
            <el-button type="primary" @click="save()">保存</el-button>
            <el-button @click="back()">返回</el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
    <el-dialog title="选择采购商品" :visible.sync="purchaseOrderDialog" width="1000px">
      <el-form :model="params" ref="queryForm" label-width="120px" class="demo-ruleForm" size="medium">
        <el-row :span="20">
          <el-col :span="6">
            <el-form-item label="SKU名称：" prop="skuName">
              <el-input v-model="params.skuName" placeholder="SKU名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="商品sku编号：" prop="skus">
              <el-input v-model="params.skus" placeholder="商品sku编号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="品牌名称：" prop="brandName">
              <el-select v-model="params.brandName" placeholder="品牌名称">
                <el-option label="请选择" value=""></el-option>
                <el-option :key="'brandName'+index" v-for="item,index in supplierBrand" :label="item.brandName" :value="item.brandName"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="商品货号：" prop="itemNo">
              <el-input v-model="params.itemNo" placeholder="商品货号"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :span="20">
          <el-col :span="6">
            <el-form-item label="条形码：" prop="barCode">
              <el-input v-model="params.barCode" placeholder="条形码"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item>
              <el-button type="primary" icon="search">查询</el-button>
              <el-button type="default" icon="circle-cross" @click="resetForm('queryForm')">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <table-pagination
        :loading="loading"
        :selection="true"
        ref="dialogTable"
        @getPageData="getPurchaseOrderItem"
        :params="params"
        :pageData="purchaseOrderItem"
        :columns="purchaseGoodsColumns"
        @selection-change="handleSelectionChange">
      </table-pagination>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="setGoodsList">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { createNamespacedHelpers } from 'vuex'
  import notify from '@/utils/notify'
  import ElOption from '../../../node_modules/element-ui/packages/select/src/option.vue'
  import ElCol from 'element-ui/packages/col/src/col'

  const {mapState, mapActions} = createNamespacedHelpers('purchaseOrder')
  export default {
    components: {
      ElCol,
      ElOption
    },
    name: 'procurement-purchase-order',
    data () {
      let checkPaymentProportion = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('不能为空'))
        } else if (value <= 0) {
          return callback(new Error('必须大于0'))
        } else {
          callback()
        }
      }
      return {
        params: {
          start: 0,
          direction: 'ASC',
          isValid: 1
        },
        rules: {
          supplierCode: [
            {required: true, message: '不能为空', trigger: 'blur'}
          ],
          purchaseType: [
            {required: true, message: '不能为空', trigger: 'change'}
          ],
          payType: [
            {required: true, message: '不能为空', trigger: 'change'}
          ],
          paymentProportion: [
            {validator: checkPaymentProportion, trigger: 'blur'}
          ],
          purchaseGroupCode: [
            {required: true, message: '不能为空', trigger: 'change'}
          ],
          purchasePersonId: [
            {required: true, message: '不能为空', trigger: 'change'}
          ],
          warehouseInfoId: [
            {required: true, message: '不能为空', trigger: 'change'}
          ],
          currencyType: [
            {required: true, message: '不能为空', trigger: 'change'}
          ],
          receiver: [
            {required: true, message: '不能为空', trigger: 'blur'}
          ],
          receiverNumber: [
            {required: true, message: '不能为空', trigger: 'blur'}
          ],
          transportFeeDestId: [
            {required: true, message: '不能为空', trigger: 'change'}
          ],
          requriedReceiveDate: [
            {required: true, message: '不能为空', trigger: 'change'}
          ],
          endReceiveDate: [
            {required: true, message: '不能为空', trigger: 'change'}
          ],
          handlerPriority: [
            {required: true, message: '不能为空', trigger: 'change'}
          ],
          totalFee: [
            {required: true, message: '不能为空', trigger: 'blur'}
          ],
          sender: [
            {required: true, message: '不能为空', trigger: 'blur'}
          ],
          senderProvince: [
            {required: true, message: '不能为空', trigger: 'change'}
          ],
          senderCity: [
            {required: true, message: '不能为空', trigger: 'change'}
          ],
          senderNumber: [
            {required: true, message: '不能为空', trigger: 'blur'}
          ],
          senderAddress: [
            {required: true, message: '不能为空', trigger: 'blur'}
          ]
        },
        selectedGoods: [],
        purchaseOrderDialog: false,
        purchaseGoodsColumns: [
          {
            label: '商品SKU名称',
            field: 'skuName',
            width: '120px'
          }, {
            label: '商品SKU编号',
            field: 'skuCode',
            width: '120px'
          }, {
            label: '规格',
            field: 'specNatureInfo',
            width: '100px'
          }, {
            label: '货号',
            field: 'itemNo',
            width: '100px'
          }, {
            label: '条形码',
            field: 'barCode',
            width: '100px'
          }, {
            label: '品牌名称',
            field: 'brandName',
            width: '100px'
          }, {
            label: '一级分类/二级分类/三级分类',
            field: 'allCategoryName'
          }
        ]
      }
    },
    computed: {
      cities () {
        let province = this.addressMap[this.purchaseOrderEdit.senderProvince]
        return (province && province.children) || []
      },
      ...mapState(['purchaseOrderEdit', 'goodsListEdit', 'loading', 'purchaseTypes', 'Suppliers', 'address', 'addressMap', 'payTypes', 'purchaseGroups', 'handlerPriority', 'currencyTypes', 'warehouse', 'transportCostsTake', 'purchasePersons', 'supplierBrand', 'purchaseOrderItem'])
    },
    methods: {
      purchaseGroupsChange (value) {
        this.purchaseOrderEdit.purchasePersonId = ''
        this.getPurchasePersonById(value)
      },
      changeProvince () {
        this.purchaseOrderEdit.senderCity = ''
      },
      handleSelectionChange (val) {
        this.selectedGoods = val
      },
      ...mapActions(['saveOrder', 'deleteArray', 'getPurchaseOrderEditById', 'getGoodsListEdit', 'getPurchaseTypes', 'getSuppliers', 'getAddress', 'getPayType', 'getPurchaseGroups', 'getHandlerPriority', 'getCurrencyTypes', 'getWarehouse', 'getTransportCostsTake', 'getPurchasePersonById', 'getSupplierBrand', 'getPurchaseOrderItem']),
      showPurchaseOrderDialog () {
        let {supplierCode, warehouseInfoId, currencyType} = this.purchaseOrderEdit
        if (!supplierCode) {
          notify.error('请选择供应商！')
          return
        }
        if (!warehouseInfoId) {
          notify.error('请选择仓库！')
          return
        }
        if (!currencyType) {
          notify.error('请选择币制！')
          return
        }
        this.getSupplierBrand(supplierCode)
        this.params.warehouseInfoId = this.purchaseOrderEdit.warehouseInfoId
        this.params.supplierCode = this.purchaseOrderEdit.supplierCode
        this.purchaseOrderDialog = true
        this.$refs['dialogTable'].getPageData()
      },
      setGoodsList () {
        this.goodsListEdit.push(...this.selectedGoods.slice())
        this.purchaseOrderDialog = false
      },
      deleteGoodsItem (index) {
        this.deleteArray({
          name: 'goodsListEdit',
          index: index
        })
      },
      formatData (data) {
        return {
          ...data,
          totalFeeD: data.totalFee
        }
      },
      checkInt (input) {
        let reg = '^[1-9]*[1-9][0-9]*$'
        let re = new RegExp(reg)
        return re.test(input)
      },
      checkFloat (input) {
        let reg = '^([1-9]+\\d*(\\.[0-9]{1,2})?|0\\.[1-9][0-9]|0\\.0[1-9]|0\\.[1-9])$'
        let re = new RegExp(reg)
        return re.test(input)
      },
      audit (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.goodsListEdit.length <= 0) {
              notify.warning('请添加采购商品')
            } else {
              for (let i = 0; i < this.goodsListEdit.length; i++) {
                let purchasePrice = this.goodsListEdit[i].purchasePrice
                let purchasingQuantity = this.goodsListEdit[i].purchasingQuantity
                let batchCode = this.goodsListEdit[i].batchCode
                if (!purchasePrice) {
                  notify.warning('进价不能为空')
                  return
                } else if (!this.checkFloat(purchasePrice)) {
                  notify.warning('进价必须为大于0，最多只能保留2位小数')
                  return
                }
                if (!purchasingQuantity) {
                  notify.warning('采购数量不能为空')
                  return
                } else if (!this.checkInt(purchasingQuantity)) {
                  notify.warning('采购数量必须为正整数')
                  return
                }
                if (!batchCode) {
                  notify.warning('批次号不能为空')
                  return
                }
              }
              console.log(1)
            }
          }
        })
      },
      save () {
        if (this.purchaseOrderEdit.paymentProportion < 0) {
          notify.warning('预付款比例必须大于0')
          return
        }
        this.saveOrder(this.formatData(this.purchaseOrderEdit))
      },
      back () {
        this.$router.push({path: this.$router.currentRoute.meta.navPath})
      }
    },
    created () {
      let id = this.$route.params.id
      if (!this.purchaseOrderEdit.id) {
        this.getGoodsListEdit({purchaseId: id, start: 0, pageIndex: 0})
        this.getPurchaseOrderEditById(id)
      }
      this.getPurchaseTypes()
      this.getSuppliers()
      this.getAddress()
      this.getPayType()
      this.getPurchaseGroups()
      this.getHandlerPriority()
      this.getCurrencyTypes()
      this.getWarehouse()
      this.getTransportCostsTake()
    }
  }
</script>

<style lang="less" scoped>
  .action-page {
    font-size: 14px;
    .title {
      color: #409EFF;
    }
    .sub-title {
      height: 30px;
      line-height: 30px;
      background-color: #dcdfe6;
      padding-left: 10px;
      margin-bottom: 20px;
    }
  }
</style>
