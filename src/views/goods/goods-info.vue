<template>
  <div class="goods-info">
    <el-form label-width="152px" class="demo-ruleForm" size="medium">
      <el-row>
        <el-col :span="12">
          <el-form-item label="商品SKU编号：">{{goodsInfo.skuCode}}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="供应商名称：">{{goodsInfo.supplierName}}</el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="供应商商品状态：">{{goodsState}}</el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="供应商编号：">{{goodsInfo.supplierCode}}</el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="供应商商品SKU编号：">{{goodsInfo.supplierSkuCode}}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="商品名称：">{{goodsInfo.itemName}}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="商品副名称：">{{goodsInfo.subtitle}}</el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="属性：">{{goodsInfo.properties}}</el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="品牌：">{{goodsInfo.brand}}</el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="分类：">{{goodsInfo.category}}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="进货价(元)：">{{goodsInfo.supplyPrice}}</el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="市场价(元)：">{{goodsInfo.marketReferencePrice}}</el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="供应商售价(元)：">{{goodsInfo.supplierPrice}}</el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="条形码：">{{goodsInfo.barCode}}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="产地：">{{goodsInfo.producingArea}}</el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="发货地：">{{goodsInfo.placeOfDelivery}}</el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="重量(KG)：">{{goodsInfo.weight}}</el-form-item>
        </el-col>
        <el-col :span=6">
          <el-form-item label="商品类型：">{{goodsInfo.itemType}}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="商品关税税率：">{{goodsInfo.tariff}}</el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="仓库名：">{{goodsInfo.warehouse}}</el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="当前库存：">{{goodsInfo.stock}}</el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="最小购买量：">{{goodsInfo.minBuyCount}}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="商品主图：">
            <div class="img-con" @click="mainPictureDialog=true">
              <img :src="goodsInfo.mainPictrue">
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="商品详情图：">
            <div class="img-con" v-for="item,index in detailPictureList" :key="'detailPicture'+index">
              <div style="text-align: center" @click="setActiveItem(index)">
                <img :src="item">
              </div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="商品详情文本：">{{goodsInfo.detail}}</el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-dialog title="查看图片" :visible.sync="mainPictureDialog" width="1000px">
      <div class="block">
        <img class="carousel-img" :src="goodsInfo.mainPictrue">
      </div>
    </el-dialog>


    <el-dialog title="查看图片" :visible.sync="pictureDialog" width="1000px">
      <div class="block">
        <el-carousel :autoplay="false" height="500px" ref="carousel" trigger="click">
          <el-carousel-item v-for="item,index in detailPictureList" :key="'pictureDialog'+index">
            <img class="carousel-img" :src="item">
          </el-carousel-item>
        </el-carousel>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import goods from '@/api/goods'
  import * as format from '../../utils/format'

  export default {
    data () {
      return {
        mainPictureDialog: false,
        pictureDialog: false,
        goodsInfo: {}
      }
    },
    computed: {
      goodsState () {
        return format.goodsState(this.goodsInfo.state)
      },
      detailPictureList () {
        let detailPictrues = this.goodsInfo.detailPictrues
        return (detailPictrues && detailPictrues.split(',')) || []
      }
    },
    methods: {
      getGoodsInfoBySku (params) {
        goods.getGoodsInfoBySku(params)
        .then((res) => {
          this.goodsInfo = res.data.result[0]
        })
      },
      setActiveItem (index) {
        this.pictureDialog = true
        setTimeout(() => {
          this.$refs['carousel'].setActiveItem(index)
        })
      }
    },
    created () {
      let skuCode = this.$route.params.id
      this.getGoodsInfoBySku({skuCode: skuCode})
    }
  }
</script>
<style lang="less" scoped="">
  .goods-info {
    .img-con {
      display: inline-block;
      width: 120px;
      margin: 0 5px;
      img {
        height: 120px;
      }
    }
    .carousel-img {
      display: block;
      margin: 0 auto;
      width: auto;
      height: 500px;
    }
  }
</style>
