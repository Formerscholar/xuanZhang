<template>
  <div id="Ship">
    <navbar class="p_root_box">
      <div class="left" slot="left" @click="blacknext">
        <i class="el-icon-arrow-left"></i>
      </div>
      <div class="center" slot="center">
        <span>流水发货</span>
      </div>
      <div slot="right"></div>
    </navbar>
    <scroll class="scroll-wrapper" :probeType="3">
      <div class="body">
        <el-card class="box-card item1">
          <van-field
            v-model="state"
            label="客户名称"
            @focus="focusClick"
            class="newStyle"
            @click-right-icon="focusClick"
            placeholder="点击检索客户名称"
            right-icon="arrow"
          />
        </el-card>
        <el-card class="box-card item1">
          <el-row
            class="tanle line"
            style="border-bottom: .714286rem solid #f2f2f2;"
          >
            <div
              class="product_box"
              v-for="(item, index) in tableData"
              :key="index"
            >
              <van-swipe-cell>
                <div class="wrap_item">
                  <div class="wrap_left">
                    <img
                      v-if="item.product_img && item.product_img != 0"
                      class="img"
                      v-lazy="item.product_img | getUrl"
                    />
                    <img src="@/assets/image/Default.png" class="img" v-else />
                    <div class="text">
                      <div class="title">
                        <p>{{ item.goods }}</p>
                      </div>
                      <p class="model">{{ item.model }}</p>
                      <div class="wrap_right">
                        <span class="wrap_right_text"
                          >({{ item.price }}×{{ item.weight }}+{{
                            item.process_cost
                          }})×{{ item.nums }}</span
                        >
                        <span class="funds_box">
                          <span>￥</span>
                          <span class="funds">{{ item.totalPrice }}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <template #right>
                  <van-button
                    class="delect"
                    type="danger"
                    @click="tableClick(index)"
                    text="删除"
                  />
                </template>
              </van-swipe-cell>
            </div>
          </el-row>

          <el-row class="AddProduct line">
            <div @click="addNewProduct" class="coutent">
              <i class="iconfont icon-copy"></i>
              <em>添加产品</em>
            </div>
          </el-row>
        </el-card>

        <el-card class="box-card item1">
          <van-field
            v-model="Shipment"
            class="newStyle"
            type="number"
            label="发货金额"
          />
          <van-field
            v-model="Amounts"
            class="newStyle"
            type="number"
            label="折后金额"
          />

          <el-row class="DeliveryDate">
            <span class="lable">日期</span>
            <span class="time" @click="tiemrClick">{{ DeliveryDate }}</span>
          </el-row>

          <van-uploader
            style="padding: .714286rem 1.142857rem;"
            v-model="fileList"
            multiple
            @delete="filedelete"
            :after-read="afterRead"
          />
          <van-field
            v-model="DeliveryNotes"
            autosize
            type="textarea"
            label="发货备注"
            placeholder="(选填)简要描述产品说明"
            class="newStyle"
          />
        </el-card>
      </div>
    </scroll>

    <myBtns :commitFun="SubmitNow" :cancelFun="PendingNow">
      <span slot="cancel-btn">提交待核</span>
      <span slot="commit-btn">
        ￥{{ Amounts }}
        <span>立即提交</span>
      </span>
    </myBtns>

    <van-overlay :show="isShow" @click="closeOverlay">
      <div class="wrapper-qrCode">
        <myVqr :Content="textContent"></myVqr>
      </div>
    </van-overlay>

    <van-datetime-picker
      class="datetime"
      v-if="isDatetime"
      v-model="currentDate"
      type="date"
      title="选择年月日"
      :min-date="minDate"
      :max-date="maxDate"
      @confirm="confirms"
      @cancel="cancel"
    />
  </div>
</template>

<script>
import { regionData, CodeToText } from 'element-china-area-data'

import {
  getAddDeliverGoodsDistributors,
  addAutonomousDeliverRecord,
  getMateriel,
} from '@/network/deal'

import { uploadImg } from '@/network/materials'
import { setTimerType } from '@/common/filter'

import { TotalPriceCalc } from '@/common/utils'

import { bestURL, crosURl } from '@/network/baseURL'

export default {
  data() {
    return {
      isDatetime: false,
      minDate: new Date(2020, 0, 1),
      maxDate: new Date(2025, 10, 1),
      currentDate: new Date(),
      Shipment: 0,
      Amounts: 0,
      number: '',
      DeliveryDate: setTimerType(new Date().getTime()),
      distributors: [],
      materiel: [],
      isShow: false,
      textContent: '',
      fileList: [],
      restaurants: [],
      restaurant: [],
      state: '',
      states: '',
      timeout: null,
      radio: '0',
      table: false,
      dialog: false,
      Addresslog: false,
      productlog: false,
      loading: false,
      form: {
        companyName: '',
        Referred: '',
        selectedOptions: [],
        DetailedAddress: '',
        contact: '',
        position: '',
        phone: '',
        email: '',
        salesman: '',
      },
      Address: {
        DetailedAddress: '',
        contact: '',
        phone: '',
        weight: '',
        number: '',
        ProductTesting1: '',
        ProductTesting2: '',
        note: '',
      },
      product: {
        name: '',
        specifications: '',
        price: '',
      },
      options: regionData,
      address: [],
      tableData: [],
      isShowed: false,
      distributor_id: 0,
      shippingValue: '',
      shippingData: [],
      img_url_Arr: [],
      DeliveryNotes: '',
      isFlowingShow: [],
      isWeightShow: false,
      isTemporary: '0',
      processCost: '',
      product_img: '',
    }
  },
  components: {
    myVqr: () => import('@/components/common/my_vqr/myVqr'),
    myBtns: () => import('@/components/common/my_btns/my_btns'),
  },
  activated() {
    this.getAddDeliverGood()
  },
  filters: {
    getUrl(value) {
      return bestURL + value
    },
  },
  computed: {
    getAddDeliverData() {
      return {
        token: this.$store.state.token,
        _: new Date().getTime(),
      }
    },
    addAutonomousData() {
      return {
        distributor_id: this.distributor_id,
        shipping_details: this.shippingData,
        token: this.$store.state.token,
        total_funds: this.Amounts,
        total_money: this.Shipment,
        apply_time: this.DeliveryDate,
        type: 0,
        remark: this.DeliveryNotes,
        img_url: this.img_url_Arr,
      }
    },
    addAutonomousDatas() {
      let apply_time = setTimerType(this.DeliveryDate)
      return {
        distributor_id: this.distributor_id,
        shipping_details: this.shippingData,
        token: this.$store.state.token,
        total_funds: this.Amounts,
        total_money: this.Shipment,
        apply_time: this.DeliveryDate,
        type: 1,
        remark: this.DeliveryNotes,
        img_url: this.img_url_Arr,
      }
    },
    getMaterieldata() {
      return {
        token: this.$store.state.token,
        product_name: this.shippingValue,
        product_model: this.Products,
        _: new Date().getTime(),
      }
    },
  },
  methods: {
    cancel() {
      this.isDatetime = false
    },
    confirms(value) {
      this.DeliveryDate = setTimerType(value)
      this.isDatetime = false
    },
    tiemrClick() {
      this.isDatetime = true
    },
    filedelete(file, detail) {
      this.img_url_Arr.splice(detail.index, 1)
    },
    async afterRead(file) {
      lrz(file.content, {
        quality: 0.6,
        fieldName: 'user_file',
      }).then(async (rst) => {
        const { data } = await uploadImg({
          user_image: rst.base64,
          token: this.$store.state.token,
        })

        this.img_url_Arr.push(data.url)
      })
    },
    tableClick(index) {
      this.$dialog
        .confirm({
          title: '提示',
          message: '是否删除产品?',
        })
        .then(() => {
          if (this.tableData.length == 1) {
            this.tableData = []
            this.shippingData = []
          } else {
            this.tableData.splice(index, 1)
            this.shippingData.splice(index, 1)
          }
          let allmonpement = 0
          this.tableData.forEach((item) => {
            allmonpement += parseFloat(item.totalPrice)
          })
          this.Shipment = allmonpement
          this.Amounts = allmonpement
        })
    },
    focusClick() {
      this.$router.push({
        path: '/nameSearch',
        query: {
          data: { ...this.distributors },
        },
      })
      this.$bus.$off('nameSupplier')
      this.$bus.$on('nameSupplier', (item) => {
        if (typeof item == 'string') {
          this.state = item
        } else {
          this.state = item.name
          this.distributor_id = item.id
        }
      })
    },
    async getAddDeliverGood() {
      const { data } = await getAddDeliverGoodsDistributors(
        this.getAddDeliverData
      )

      if (data.customerProductExtraField.length > 0) {
        this.isFlowingShow = data.customerProductExtraField
      }
      if (data?.customerProductField?.weight == 1) {
        this.isWeightShow = true
      }
      this.distributors = data.distributors
      this.materiel = data.materiel
    },
    blacknext() {
      this.Shipment = 0
      this.Amounts = 0
      this.number = ''
      this.distributors = []
      this.materiel = []
      this.restaurants = []
      this.restaurant = []
      this.state = ''
      this.states = ''
      this.timeout = null
      this.fileList = []
      this.table = false
      this.form = {}
      this.Address = {}
      this.product = {}
      this.options = regionData
      this.address = []
      this.img_url_Arr = []
      this.tableData = []
      this.isShowed = false
      this.distributor_id = 0
      this.shippingValue = ''
      this.shippingData = []
      this.DeliveryNotes = ''
      this.isFlowingShow = []
      this.isWeightShow = false
      this.isTemporary = '0'
      this.loading = false
      this.dialog = false
      this.Addresslog = false
      this.productlog = false
      this.radio = '0'
      this.$router.replace('/deal/contract')
    },

    createStateFilter(queryString) {
      return (state) => {
        return (
          state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        )
      }
    },
    addNewProduct() {
      this.$router.push({
        path: '/SelectProducts',
        query: {
          data: {
            isFlowingShow: this.isFlowingShow,
          },
        },
      })
      this.$bus.$off('SelectProducts')
      this.$bus.$on('SelectProducts', (item) => {
        this.shippingValue = item.selectData.productName
        this.Products = item.selectData.productModel
        this.productPrice = item.selectData.productPrice
        this.quantity = item.selectData.quantity
        this.states = item.selectData.productName
        this.ProductNotes = item.selectData.ProductNotes
        this.productWeight = item.selectData.productWeight
        this.FlowingProducts = item.selectData.FlowingProducts
        this.product_img = item.selectData.img_url
        this.processCost = item.selectData.processCost
        this.AddClick()
      })
    },

    async AddClick() {
      const { data } = await getMateriel(this.getMaterieldata)
      if (data.isExistence == 0) {
        this.$dialog
          .confirm({
            title: '提示',
            message: '是否加入临时物料库？',
          })
          .then(() => {
            this.isTemporary = '1'
          })
          .catch(() => {
            this.isTemporary = '0'
            this.tableData.pop()
          })
          .finally(() => {
            let totalPrice = TotalPriceCalc(
              this.productPrice,
              this.productWeight,
              this.processCost,
              this.quantity
            )

            let addproductdata = {
              goods: this.states,
              model: this.Products,
              nums: this.quantity,
              price: this.productPrice,
              totalPrice,
              weight: this.productWeight,
              process_cost: this.processCost,
              product_img: this.product_img,
            }
            this.tableData.push(addproductdata)

            let newArr = []
            newArr.push(this.shippingValue)
            newArr.push(this.Products)
            newArr.push(this.quantity)
            newArr.push(this.productPrice)
            newArr.push(this.ProductNotes)
            newArr.push(this.productWeight)
            newArr.push(this.isTemporary)
            newArr.push(this.processCost)
            newArr.push(this.product_img)
            newArr.push(this.FlowingProducts)
            this.shippingData.push(newArr)

            let allmonpement = 0
            this.tableData.forEach((item) => {
              allmonpement += parseFloat(item.totalPrice)
            })
            this.Shipment = allmonpement
            this.Amounts = allmonpement

            this.states = ''
            this.Products = ''
            this.productPrice = ''
            this.productWeight = ''
            this.FlowingProducts = ''
            this.quantity = ''
            this.ProductSubtotal = ''
            this.ProductNotes = ''
            this.isShowed = false
          })
      } else {
        let totalPrice = TotalPriceCalc(
          this.productPrice,
          this.productWeight,
          this.processCost,
          this.quantity
        )

        let addproductdata = {
          goods: this.states,
          model: this.Products,
          nums: this.quantity,
          price: this.productPrice,
          totalPrice,
          weight: this.productWeight,
          process_cost: this.processCost,
          product_img: this.product_img,
        }
        this.tableData.push(addproductdata)

        let newArr = []
        newArr.push(this.shippingValue)
        newArr.push(this.Products)
        newArr.push(this.quantity)
        newArr.push(this.productPrice)
        newArr.push(this.ProductNotes)
        newArr.push(this.productWeight)
        newArr.push(this.isTemporary)
        newArr.push(this.processCost)
        newArr.push(this.product_img)
        newArr.push(this.FlowingProducts)
        this.shippingData.push(newArr)

        let allmonpement = 0
        this.tableData.forEach((item) => {
          allmonpement += parseFloat(item.totalPrice)
        })
        this.Shipment = allmonpement
        this.Amounts = allmonpement

        this.states = ''
        this.Products = ''
        this.productPrice = ''
        this.productWeight = ''
        this.FlowingProducts = ''
        this.quantity = ''
        this.ProductSubtotal = ''
        this.ProductNotes = ''
        this.isShowed = false
      }
    },
    closeOverlay() {
      this.isShow = false
      this.blacknext()
    },
    async SubmitNow() {
      const { code, msg, data } = await addAutonomousDeliverRecord(
        this.addAutonomousData
      )

      if (code == 200) {
        this.$message({
          showClose: true,
          message: msg,
          type: 'success',
        })
        this.isShow = true
        this.textContent = `http://219.83.161.11:8030/view/html/run/print.php?id=${data.flowId}&orderType=flow`
      } else {
        this.$message({
          showClose: true,
          message: msg,
          type: 'error',
        })
      }
    },
    async PendingNow() {
      const { code, msg, data } = await addAutonomousDeliverRecord(
        this.addAutonomousDatas
      )

      if (code == 200) {
        this.$message({
          showClose: true,
          message: msg,
          type: 'success',
        })
        this.isShow = true
        this.textContent = `http://219.83.161.11:8030/view/html/run/print.php?id=${data.flowId}&orderType=flow`
      } else {
        this.$message({
          showClose: true,
          message: msg,
          type: 'error',
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
#Ship {
  padding-top: 5.428571rem;
  padding-bottom: 3.785714rem;
  .scroll-wrapper {
    position: absolute;
    left: 0;
    top: 5.428571rem;
    bottom: 4.428571rem;
    width: 100%;
    overflow: hidden;
  }
  .drawer_my {
    .demo-drawer__content {
      max-width: 1024px;
      margin: 0 auto;
      margin-top: 1.714286rem;
      padding: 0.357143rem;
      .demo-drawer__header {
      }
      .demo-drawer__footer {
        width: 100%;
        position: fixed;
        padding: 0.714286rem;
        background-color: #fff;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        justify-content: flex-end;
      }
    }
  }
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
  .body {
    background-color: #f8f7f5;

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
      .btns {
        display: flex;
        justify-content: flex-end;
        align-items: flex-end;
        .van-button {
          margin-right: 0.714286rem;
        }
      }
      .line {
        display: flex;
        flex-direction: column;
        border-bottom: 1px solid #f8f7f5;
        padding: 0.714286rem 1.142857rem;
        .delect {
          height: 100%;
          line-height: 6.571429rem;
        }
        .product_box {
          .wrap_item {
            padding: 0.357143rem;

            .wrap_left {
              display: flex;
              justify-content: flex-start;
              align-items: center;
              .img {
                width: 5.928571rem;
                height: 5.928571rem;
                background-color: #655d55;
                border-radius: 0.357143rem;
                margin-right: 0.714286rem;
              }
              .text {
                flex: 1;
                font-size: 1rem;
                color: #000;
                overflow: hidden;
                .title {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  font-size: 1rem;
                }
                .model {
                  color: #ccc;
                }
                p {
                  margin-bottom: 0.357143rem;
                }
                .wrap_right {
                  width: 100%;
                  display: flex;
                  justify-content: space-between;
                  align-items: flex-end;
                  color: #ccc;
                  .wrap_right_text {
                    font-size: 0.857143rem;
                  }
                  .funds_box {
                    font-size: 1.142857rem;
                    color: black;
                  }
                }
              }
            }
          }
          .wrap_money {
            display: flex;
            justify-content: flex-end;
            align-items: flex-end;
            padding: 0.357143rem;
            font-size: 1.142857rem;
            color: #848484;
          }
        }
        em {
          display: block;
          font-size: 1.142857rem;
          color: #585858;
          width: 6.357143rem;
          text-align: left;
        }
        div {
          display: block;
          font-size: 1.142857rem;
          text-align: left;
          flex: 1;
        }
      }
      .AddProduct {
        display: flex;
        justify-content: center;
        align-items: center;
        .coutent {
          display: flex;
          justify-content: center;
          align-items: center;
          .icon-copy {
            font-size: 1.428571rem;
          }
          em {
            text-align: center;
          }
        }
      }
    }
  }
  .datetime {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
  }
}
</style>
