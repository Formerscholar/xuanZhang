<template>
  <div id="SelectProducts">
    <navbar class="p_root_box">
      <div class="left" slot="left" @click="blacknext">
        <i class="el-icon-arrow-left"></i>
      </div>
      <div class="center" slot="center">
        <span>选择产品</span>
      </div>
      <div slot="right"></div>
    </navbar>
    <scroll class="scroll-wrapper" ref="scroll" :probe-type="3">
      <el-card class="box-card item1">
        <div class="title_box_ess">
          <span>请认真填写每一条数据信息</span>
        </div>
        <div class="product_box">
          <div class="right_box">
            <div class="right_name" @click.stop="focusClick">
              <span v-if="state">{{ state }}</span>
              <span v-else class="pltext">请选择产品名称</span>
            </div>
            <div class="right_model" v-if="isfouck" @click.stop="focusClick">
              <span v-if="Products">{{ Products }}</span>
              <span v-else class="pltext">请选择产品型号</span>
            </div>
            <van-field
              class="right_model field_handle"
              style="padding:0 0 ;"
              v-else
              v-model="Products"
              placeholder="请手动填写产品型号"
            />
          </div>
          <div class="left_img" @click="imgClick">
            <img
              v-if="img_URL && img_URL != 0"
              v-lazy="img_URL | getUrl"
              alt="logo"
            />
            <img
              v-else-if="img_url_lin && img_url_lin != 0"
              class="img"
              v-lazy="img_url_lin | getUrl"
            />
            <img src="@/assets/image/Default.png" v-else />
          </div>
        </div>
      </el-card>

      <el-card class="box-card item1">
        <van-field
          v-model="quantity"
          type="number"
          label="数量"
          class="newStyle"
          placeholder="请填写产品数量"
          @input="SubtotalFocus"
        />

        <van-field
          v-model="productWeight"
          v-if="isWeightShow"
          type="number"
          label="重量"
          placeholder="请填写单件重量"
          @input="SubtotalFocus"
          class="newStyle"
        />

        <van-field
          v-model="productPrice"
          type="number"
          label="单价"
          class="newStyle"
          placeholder="请填写产品单价"
          @input="SubtotalFocus"
        />
        <van-field
          v-for="(item, index) in isFlowingShow"
          v-model="FlowingProducts[index + 1]"
          :key="item.id"
          :data-id="item.id"
          class="newStyle"
          :label="item.field_name"
        />
        <van-field
          v-model="processCost"
          type="number"
          class="newStyle"
          label="加工费"
          placeholder="请填写产品加工费"
          @input="SubtotalFocus"
        />

        <el-row class="DeliveryDate van-cell">
          <span class="lable">小计</span>
          <span class="time" style="color:#ea6e33;"
            >￥{{ ProductSubtotal }}</span
          >
        </el-row>

        <van-field
          v-model="ProductNotes"
          autosize
          type="textarea"
          class="newStyle"
          label="备注"
          placeholder="(选填)简要描述产品说明"
        />
      </el-card>
    </scroll>

    <myBtns :commitFun="commite" :cancelFun="blacknext">
      <span slot="cancel-btn">取消</span>
      <span slot="commit-btn">
        ￥{{ ProductSubtotal }}
        <span>提交订单</span>
      </span>
    </myBtns>

    <simple-cropper
      :initParam="uploadParam"
      :successCallback="uploadHandle"
      ref="cropper"
    />
  </div>
</template>

<script>
import { bestURL, crosURl } from '@/network/baseURL'
import { getMaterielList } from '@/network/deal'
import { TotalPriceCalc } from '@/common/utils'

export default {
  data() {
    return {
      state: '',
      Products: '',
      productPrice: '',
      productWeight: '',
      FlowingProducts: ['0'],
      isWeightShow: false,
      isFlowingShow: [],
      quantity: '',
      img_url_lin: '',
      uploadParam: 4,
      ProductSubtotal: 0,
      processCost: '',
      ProductNotes: '',
      img_URL: '',
      PropsImg: '',
      listItem: {},
      listItems: [],
      allData: {},
      isfouck: true,
    }
  },
  components: {
    SimpleCropper: () =>
      import('@/components/common/SimpleCroppes/SimpleCroppes'),
    myBtns: () => import('@/components/common/my_btns/my_btns'),
  },
  filters: {
    getUrl(value) {
      if (value.indexOf(bestURL) == -1) {
        return bestURL + value
      } else {
        return value
      }
    },
  },
  computed: {
    getMaterielListData() {
      return {
        company_id: this.$store.state.userInfo[0].user_compser_id,
        _: new Date().getTime(),
      }
    },
  },
  methods: {
    stepperChange(value) {
      this.ProductSubtotal = TotalPriceCalc(
        this.productPrice,
        this.productWeight,
        this.processCost,
        this.quantity
      )
    },
    SubtotalFocus() {
      this.ProductSubtotal = TotalPriceCalc(
        this.productPrice,
        this.productWeight,
        this.processCost,
        this.quantity
      )
    },
    async getMaterielLists() {
      const { data } = await getMaterielList(this.getMaterielListData)
      this.listItem = { ...data }
      this.isFlowingShow = [...this.$route.query.data.isFlowingShow]
      for (const key in this.listItem) {
        this.listItems.push(this.listItem[key])
      }
    },
    imgClick() {
      this.$refs['cropper'].upload()
    },
    uploadHandle(data) {
      this.img_URL = data
      this.PropsImg = this.img_URL.split(bestURL)[1]
    },
    commite() {
      let selectData = {
        productName: this.state,
        productModel: this.Products,
        productPrice: this.productPrice,
        productWeight: this.productWeight,
        FlowingProducts: this.FlowingProducts,
        quantity: this.quantity,
        ProductNotes: this.ProductNotes,
        processCost: this.processCost,
        img_url: this.PropsImg,
      }
      this.$bus.$emit('SelectProducts', {
        allData: this.allData,
        selectData,
      })
      this.state = ''
      this.Products = ''
      this.productPrice = ''
      this.productWeight = ''
      this.FlowingProducts = ['0']
      this.isWeightShow = false
      this.quantity = ''
      this.isfouck = true
      this.img_url_lin = ''
      this.ProductSubtotal = 0
      this.ProductNotes = ''
      this.listItem = {}
      this.listItems = []
      this.img_URL = ''
      this.isFlowingShow = []
      this.allData = {}
      this.$router.go(-1)
    },
    focusClick() {
      this.$router.push({
        path: '/productNameSearch',
        query: {
          data: { ...this.listItems },
        },
      })
      this.$bus.$off('productNameSearch')
      this.$bus.$on('productNameSearch', (item) => {
        if (typeof item == 'string') {
          this.isfouck = false
          this.state = item
        } else {
          this.isfouck = true
          this.isWeightShow = item.weight ? true : false
          this.productWeight = item.weight
          this.allData = item
          this.state = item.name
          this.Products = item.specification
          this.productPrice = item.out_price
          this.img_URL = item?.img_url
          this.PropsImg = item?.img_url
          this.img_url_lin = item.img_url_lin
          this.listItem = { ...this.$route.query.data.materiel }
          this.isFlowingShow = [...this.$route.query.data.isFlowingShow]
          for (const key in this.listItem) {
            this.listItems.push(this.listItem[key])
          }
        }
      })
    },
    blacknext() {
      this.isfouck = true
      this.listItems = []
      this.$router.go(-1)
    },
  },
  activated() {
    this.getMaterielLists()
  },
  deactivated() {
    this.state = ''
    this.Products = ''
    this.img_URL = ''
    this.PropsImg = ''
    this.productPrice = ''
    this.productWeight = ''
    this.FlowingProducts = ['0']
    this.isWeightShow = false
    this.quantity = ''
    this.ProductSubtotal = 0
    this.ProductNotes = ''
    this.allData = {}
  },
}
</script>

<style scoped lang="scss">
#SelectProducts {
  padding-top: 5.428571rem;
  .p_root_box {
    color: #747474;
    background-color: #fff;
    border: none;
    box-shadow: none;

    .left {
      margin-left: 1.071429rem;
    }
    .center {
      margin-left: -1.071429rem;
      font-size: 1.285714rem;
      font-weight: 700;
      color: #030303;
    }
  }
  .scroll-wrapper {
    position: absolute;
    left: 0;
    right: 0;
    top: 5.142857rem;
    bottom: 4.442857rem;
    overflow: hidden;
  }
  .item1 {
    margin-bottom: 0.714286rem;
    .DeliveryDate {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .lable {
        width: 4.928571rem;
        text-align: justify;
        text-align-last: justify;
        color: black;
        padding-right: 0.714286rem;
        border-right: 1px solid #e7e7e7;
      }
      .time {
        flex: 1;
        text-align: right;
        padding: 0 1rem;
      }
    }
    .title_box_ess {
      background-color: #eee;
      font-size: 1rem;
      color: #ea6e33;
      height: 3.142857rem;
      line-height: 3.142857rem;
      padding: 0 1.142857rem;
    }

    .product_box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.571429rem 1.142857rem;
      .left_img {
        width: 5.357143rem;
        height: 5rem;
        margin-right: 0.857143rem;
        border-radius: 0.357143rem;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .right_box {
        height: 100%;
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        .right_name {
          font-size: 1.285714rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          span {
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .pltext {
            width: 100%;
            color: #a2a2a2;
            font-size: 1rem;
            margin-right: 2rem;
          }
          .van-icon {
          }
        }
        .right_model {
          font-size: 1.142857rem;
          color: #a2a2a2;
          display: flex;
          justify-content: space-between;
          align-items: center;
          overflow: hidden;
          span {
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .pltext {
            width: 100%;
            font-size: 1rem;
            color: #a2a2a2;
            margin-right: 2rem;
          }
          .van-icon {
            font-size: 1.285714rem;
            color: #303133;
          }
        }
      }
    }
  }
}
</style>
