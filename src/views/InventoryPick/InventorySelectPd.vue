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
          <div class="right_box">
            <div class="right_name" @click.stop="focusClick">
              <span v-if="state">{{ state }}</span>
              <span v-else class="pltext">请选择产品名称</span>
              <van-icon name="arrow" />
            </div>
            <div class="right_model" v-if="isfouck" @click.stop="focusClick">
              <span v-if="Products">{{ Products }}</span>
              <span v-else class="pltext">请选择产品型号</span>
              <van-icon name="arrow" />
            </div>
            <van-field
              class="right_model field_handle"
              style="padding:0 0 ;"
              v-else
              v-model="Products"
              placeholder="请手动填写产品型号"
            />
          </div>
        </div>
        <div class="nums">库存数量:{{ nums }}</div>
      </el-card>

      <el-card class="box-card item1">
        <el-row class="DeliveryDate van-cell">
          <span class="lable">数量</span>
          <span class="time">
            <van-stepper
              v-model="quantity"
              min="0"
              max="99999999"
              default-value="0"
              @change="stepperChange"
              integer
            />
          </span>
        </el-row>
      </el-card>
    </scroll>

    <myBtns :commitFun="commite" :cancelFun="blacknext">
      <span slot="cancel-btn">取消</span>
      <span slot="commit-btn">
        <span>提交</span>
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
      quantity: '',
      img_url_lin: '',
      uploadParam: 4,
      ProductSubtotal: 0,
      processCost: '',
      ProductNotes: '',
      nums: 0,
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
      this.$bus.$emit('InventorySelectPd', {
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
      this.nums = 0
      this.isfouck = true
      this.img_url_lin = ''
      this.ProductSubtotal = 0
      this.ProductNotes = ''
      this.listItem = {}
      this.listItems = []
      this.img_URL = ''
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
          this.nums = 0
          this.state = item
        } else {
          this.isfouck = true
          this.isWeightShow = item.weight ? true : false
          this.productWeight = item.weight
          this.allData = item
          this.state = item.name
          this.nums = item.stock
          this.Products = item.specification
          this.productPrice = item.out_price
          this.img_URL = item?.img_url
          this.PropsImg = item?.img_url
          this.img_url_lin = item.img_url_lin
          this.listItem = { ...this.$route.query.data.materiel }

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
            text-align: right;
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
            text-align: right;
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
    .nums {
      padding: 0.571429rem 1.142857rem;
      font-size: 1.142857rem;
    }
  }
}
</style>
