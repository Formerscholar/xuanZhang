<template>
  <div id="OEM">
    <navbar class="p_root_box">
      <div class="left" slot="left" @click="blacknext">
        <i class="el-icon-arrow-left"></i>
      </div>
      <div class="center" slot="center">
        <span>委外编辑</span>
      </div>
      <div slot="right"></div>
    </navbar>
    <scroll class="scroll-wrapper" :probeType="3">
      <div class="body">
        <el-card class="box-card item1">
          <van-field v-model="state" label="供应商" @focus="focusClick" />
          <timers
            class="SigningDate"
            type="SigningDate"
            title="承诺交期"
            :valueData="timersList.SigningDate"
          />
          <van-field v-model="states" label="负责人" @focus="focusClicks" />
        </el-card>
        <el-card class="box-card item1">
          <el-row class="tanle line">
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
                        <div class="funds_box">
                          <span>￥</span>
                          <span class="funds">{{ item.totalPrice }}</span>
                        </div>
                      </div>
                      <p class="model">{{ item.model }}</p>
                      <div class="wrap_right">
                        <span
                          >({{ item.price }}×{{ item.weight }}+{{
                            item.process_cost
                          }})×{{ item.nums }}</span
                        >
                      </div>
                    </div>
                  </div>
                </div>
                <template #right>
                  <van-button
                    class="delect"
                    type="danger"
                    @click="tableClick(index, item.id)"
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

          <van-field v-model="contractAmount" type="number" label="合同金额" />
          <van-field
            v-model="DiscountedAmount"
            type="number"
            label="折后金额"
          />
        </el-card>
      </div>
    </scroll>

    <myBtns :commitFun="quoteclick" :cancelFun="quxiaoClick">
      <span slot="cancel-btn">取消</span>
      <span slot="commit-btn">
        ￥{{ DiscountedAmount }}
        <span>立即提交</span>
      </span>
    </myBtns>
  </div>
</template>

<script>
import { regionData, CodeToText } from 'element-china-area-data'
import { setTimerType } from '@/common/filter'
import { TotalPriceCalc } from '@/common/utils'
import { bestURL, crosURl } from '@/network/baseURL'

import {
  getReceivingInformationList,
  editOutsourcingOrder,
  getMateriel,
  getEditOutsourcingOrder,
  deleteOutsourcingOrderProduct,
} from '@/network/deal'
export default {
  name: 'OEM',
  data() {
    return {
      state: '',
      timersList: {
        SigningDate: new Date().getTime(),
        ContractField: new Date().getTime(),
      },
      tableData: [],
      isShowed: false,
      Products: '',
      productName: '',
      FlowingProducts: [null],
      isFlowingShow: [],
      productNum: '',
      productSubtotal: '',
      productPrice: '',
      CustomerContact: '',
      quantity: '',
      ProductNotes: '',
      contractAmount: 0,
      CompanyNumber: '',
      DiscountedAmount: 0,
      addressData: {
        id: '0',
        name: '',
        tel: '',
        address: '',
      },
      restaurants: [],
      restaurant: [],
      selectedID: '',
      shippingData: [],
      PartyContract: '',
      userId: '',
      distributors: [],
      CustomerNumber: '',
      TermsPaymentInput: '',
      TransportationAssume: '',
      WarrantyTime: '',
      fileList: [],
      OtherInstructions: '',
      isWeightShow: false,
      timeout: null,
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
      states: '',
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
      number: 0,
      iid: '',
      isEdit: true,
    }
  },
  components: {
    myBtns: () => import('@/components/common/my_btns/my_btns'),
  },
  watch: {
    $route(to, from) {
      const toDepths = to.path
      const fromDepths = from.path
      if (
        fromDepths == '/SelectProducts' ||
        fromDepths == '/nameSearch' ||
        fromDepths == '/productNameSearch' ||
        fromDepths == '/selectTime/DeliveryDate'
      ) {
        this.isEdit = false
      }
    },
  },
  created() {
    if (this.isEdit) {
      this.iid = this.$route.params.id
      this.getEditOutsourcingOrders()
    }

    if (this.$store.state.timers.timers.SigningDate != '') {
      this.timersList.SigningDate = this.$store.state.timers.timers.SigningDate
    }
    if (this.$store.state.timers.timers.ContractField != '') {
      this.timersList.ContractField = this.$store.state.timers.timers.ContractField
    }
    if (this.$store.state.Address.id != undefined) {
      this.addressData.name = this.$store.state.Address.name
      this.addressData.tel = this.$store.state.Address.tel
      this.addressData.address = this.$store.state.Address.address
      this.addressData.id = this.$store.state.Address.id
      this.$store.commit('setAddress', {})
    }
    document.querySelectorAll('input').forEach((item) => {
      item.style.border = 'none'
    })
    document.querySelector('textarea').style.border = 'none'
  },
  computed: {
    addContractOrderData() {
      let timer = setTimerType(new Date(this.timersList.SigningDate))
      return {
        supplier_id: this.selectedID,
        contract_amount: this.contractAmount,
        amount_of_discount: this.DiscountedAmount,
        outsourcing_order_product: this.shippingData,
        token: this.$store.state.token,
        user_id: this.userId,
        template_set: null,
        acceptance_criteria: null,
        transport_undertaking: null,
        commitment_period: timer,
        id: this.iid,
      }
    },
    getReceiveDate() {
      return {
        token: this.$store.state.token,
        id: this.selectedID,
        type: 'distributor',
        _: new Date().getTime(),
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
    getEditOutsourcingOrderData() {
      return {
        token: this.$store.state.token,
        id: this.iid,
        _: new Date().getTime(),
      }
    },
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
  methods: {
    tableClick(index, id) {
      this.$dialog
        .confirm({
          title: '提示',
          message: '是否删除产品?',
        })
        .then(async () => {
          const { code, msg } = await deleteOutsourcingOrderProduct({
            token: this.$store.state.token,
            product_id: id,
            id: this.iid,
          })
          if (code == 200) {
            if (this.tableData.length == 1) {
              this.tableData = []
              this.shippingData = []
            } else {
              this.tableData = this.tableData.splice(index - 1, 1)
              this.shippingData = this.shippingData.splice(index - 1, 1)
            }
            let allmonpement = 0
            this.tableData.forEach((item) => {
              allmonpement += parseFloat(item.totalPrice)
            })
            this.contractAmount = allmonpement
            this.DiscountedAmount = allmonpement
          } else {
            this.$dialog.alert({
              message: msg,
            })
          }
        })
    },
    async getEditOutsourcingOrders() {
      const { code, data, msg } = await getEditOutsourcingOrder(
        this.getEditOutsourcingOrderData
      )
      if (code !== 200) {
        this.$message.error(msg)
        this.$router.replace('/deal/outsourcing')
      } else {
        this.userId = data.outsourcingOrder.salesperson
        this.distributors = [...data.suppliers]
        data.suppliers.forEach((item) => {
          if (item.id == data.outsourcingOrder.supplier_id) {
            this.state = item.name
            this.selectedID = item.id
          }
        })
        this.states = data.outsourcingOrder.salesperson_name
        data.outsourcingOrder.outsourcingOrderProduct.forEach((item, index) => {
          let totalPrice = TotalPriceCalc(
            item.unit_price,
            item.weight || '',
            item.process_cost || '',
            item.number
          )
          this.tableData.push({
            goods: item.product_name,
            model: item.product_model,
            nums: item.number,
            price: item.unit_price,
            totalPrice,
            weight: item.weight,
            process_cost: item.process_cost,
            product_img: item.img_url,
            id: item.id,
          })
          let newArr = []
          newArr.push(item.product_name)
          newArr.push(item.product_model)
          newArr.push(item.number)
          newArr.push(item.unit_price)
          newArr.push(item.remark)
          newArr.push(item.weight)
          newArr.push(0)
          newArr.push(item.process_cost)
          newArr.push(item.img_url)
          newArr.push(item.extra)
          this.shippingData.push(newArr)
        })
        this.contractAmount = data.outsourcingOrder.amount_of_discount
        this.DiscountedAmount = data.outsourcingOrder.amount_of_discount
      }
    },
    focusClicks() {
      this.$router.push({
        path: '/outSearch',
        query: {
          data: { ...this.usersList },
        },
      })
      this.$bus.$off('outSupplier')
      this.$bus.$on('outSupplier', (item) => {
        this.states = item.name
        this.userId = item.id
      })
    },
    focusClick() {
      this.$router.push({
        path: '/outSearch',
        query: {
          data: { ...this.distributors },
        },
      })
      this.$bus.$off('outSupplier')
      this.$bus.$on('outSupplier', (item) => {
        this.state = item.name
        this.selectedID = item.id
      })
    },
    async quoteclick() {
      const { code } = await editOutsourcingOrder(this.addContractOrderData)
      if (code == 200) {
        this.state = ''
        this.PartyContract = ''
        this.CompanyNumber = ''
        this.CustomerContact = ''
        this.CustomerNumber = ''
        this.tableData = []
        this.contractAmount = 0
        this.DiscountedAmount = 0
        this.TermsPaymentInput = ''
        this.TransportationAssume = ''
        this.WarrantyTime = ''
        this.OtherInstructions = ''
        this.fileList = []
        this.addressData = {}
        this.$router.replace('/deal/outsourcing')
      }
    },
    quxiaoClick() {
      this.state = ''
      this.PartyContract = ''
      this.CompanyNumber = ''
      this.CustomerContact = ''
      this.CustomerNumber = ''
      this.tableData = []
      this.contractAmount = 0
      this.DiscountedAmount = 0
      this.TermsPaymentInput = ''
      this.TransportationAssume = ''
      this.WarrantyTime = ''
      this.OtherInstructions = ''
      this.fileList = []
      this.addressData = {}
      this.$router.replace('/deal/outsourcing')
    },
    handleChange() {
      var loc = ''
      for (let i = 0; i < this.form.selectedOptions.length; i++) {
        loc += CodeToText[this.form.selectedOptions[i]]
      }
    },
    handleChange(file, fileList) {
      this.fileList = fileList.slice(-3)
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
      }

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
      this.contractAmount = allmonpement
      this.DiscountedAmount = allmonpement
      this.cancelClick()
    },
    calcPrice() {
      if (this.productPrice != '' && this.productNum != '') {
        this.productSubtotal =
          parseFloat(this.productPrice) * parseFloat(this.productNum)
      }
    },
    cancelClick() {
      this.states = ''
      this.productName = ''
      this.Products = ''
      this.productPrice = ''
      this.productNum = ''
      this.FlowingProducts = []
      this.quantity = ''
      this.productSubtotal = ''
      this.ProductNotes = ''
      this.isShowed = false
    },
    blacknext() {
      this.isEdit = true
      this.state = ''
      this.timersList = {}
      this.tableData = []
      this.isShowed = false
      this.Products = ''
      this.productName = ''
      this.FlowingProducts = [null]
      this.isFlowingShow = []
      this.productNum = ''
      this.productSubtotal = ''
      this.productPrice = ''
      this.CustomerContact = ''
      this.quantity = ''
      this.ProductNotes = ''
      this.contractAmount = 0
      this.CompanyNumber = ''
      this.DiscountedAmount = 0
      this.addressData = {}
      this.restaurants = []
      this.restaurant = []
      this.selectedID = ''
      this.shippingData = []
      this.PartyContract = ''
      this.userId = ''
      this.distributors = []
      this.CustomerNumber = ''
      this.TermsPaymentInput = ''
      this.TransportationAssume = ''
      this.WarrantyTime = ''
      this.fileList = []
      this.OtherInstructions = ''
      this.isWeightShow = false
      this.timeout = null
      this.Address = {}
      this.states = ''
      this.radio = '0'
      this.table = false
      this.dialog = false
      this.Addresslog = false
      this.productlog = false
      this.loading = false
      this.form = {}
      this.Address = {}
      this.product = {}
      this.options = regionData
      this.address = []
      this.number = 0
      clearTimeout(this.timer)
      this.$router.replace('/deal/outsourcing')
    },
    async getReceiving() {
      const { data } = await getReceivingInformationList(this.getReceiveDate)

      this.listData = data.receivingInformationList
      this.addressData.name = this.listData[0].consignee
      this.addressData.id = this.listData[0].id
      this.addressData.tel = this.listData[0].consignee_tel
      this.addressData.address = this.listData[0].consignee_address
    },
    querySearchAsync(queryString, cb) {
      var restaurants = this.restaurants
      var results = queryString
        ? restaurants.filter(this.createStateFilter(queryString))
        : restaurants
      cb(results)
    },
    createStateFilter(queryString) {
      return (state) => {
        return (
          state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        )
      }
    },
    handleSelect(val) {
      this.selectedID = val.address

      this.getReceiving()
    },
    handleSelectss(val) {
      this.userId = val.address
    },
    handleClose(done) {
      if (this.loading) {
        return
      }
      if (this.form.companyName != '' && this.form.DetailedAddress != '') {
        this.restaurants.push({
          value: this.form.companyName,
          address: this.form.DetailedAddress,
        })
      }
      if (this.Address.DetailedAddress != '') {
        let addinfo = `${this.Address.contact} ${this.Address.phone}`
        this.address.push(addinfo)
        this.radio = this.address.length - 1
      }

      if (
        this.product.name != '' &&
        this.product.specifications != '' &&
        this.product.number != '' &&
        this.product.price != ''
      ) {
        let addproductdata = {
          goods: this.product.name,
          model: this.product.specifications,
          nums: this.product.number,
          price: this.product.price,
          totalPrice: this.product.price * this.product.number,
        }
        this.tableData.push(addproductdata)
      }

      this.loading = true
      this.Addresslog = false
      this.productlog = false
      this.loading = false
    },
    cancelForm() {
      this.loading = false
      this.dialog = false
      this.Addresslog = false
      this.productlog = false
      this.radio = '0'
      clearTimeout(this.timer)
    },
    addressClick() {
      this.$router.push({
        name: 'addressList',
        params: {
          data: this.listData,
        },
      })
    },
    querySearchAsyncs(queryString, cb) {
      var restaurants = this.restaurant
      var results = queryString
        ? restaurants.filter(this.createStateFilter(queryString))
        : restaurants
      cb(results)
    },
  },
}
</script>

<style lang="scss" scoped>
#OEM {
  padding-top: 5.428571rem;
  padding-bottom: 2.785714rem;
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
      margin-left: -3.071429rem;
      font-size: 1.285714rem;
      font-weight: 700;
      color: #030303;
    }
  }
  .scroll-wrapper {
    position: absolute;
    left: 0;
    top: 5.428571rem;
    bottom: 4.428571rem;
    width: 100%;
    overflow: hidden;
    .body {
      padding: 1.071429rem 0;
      background-color: #f8f7f5;

      .item1 {
        margin-bottom: 0.714286rem;
        .btns {
          display: flex;
          justify-content: flex-end;
          align-items: flex-end;
          .van-button {
            margin-right: 0.714286rem;
          }
        }
        .address {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.642857rem 1.142857rem;
          .lefticon {
            width: 1.714286rem;
            height: 1.714286rem;
            border-radius: 50%;
            background-color: #ff4400;
            display: flex;
            justify-content: center;
            align-items: center;
            .van-icon {
              color: #fff;
              font-size: 0.857143rem;
            }
          }
          .cententbox {
            text-align: left;
            margin: 0 0.714286rem;
            flex: 1;
            .nametell {
              span {
                font-size: 0.857143rem;
                color: #333333;
              }
              em {
                font-size: 0.571429rem;
                color: #999;
                margin-left: 0.357143rem;
              }
            }
            .NEWSaddress {
              margin: 0.607143rem 0;
              span {
                font-size: 0.642857rem;
                color: #333333;
              }
            }
            .title {
              span {
                font-size: 0.642857rem;
                color: #d85c26;
              }
            }
          }
          .righticon {
            .van-icon {
              color: #ccc;
            }
          }
        }
        .customerName {
          padding: 0.714286rem 1.142857rem;
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
              border-bottom: 1px solid #f2f2f2;

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
                    .funds_box {
                      flex: 0;
                    }
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
                    justify-content: flex-start;
                    color: #ccc;
                    span {
                      font-size: 0.857143rem;
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
            font-weight: 700;
            width: 6.357143rem;
            text-align: left;
          }
          div {
            display: block;
            font-size: 1.142857rem;
            font-weight: 700;
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
            em {
              text-align: center;
            }
          }
        }
      }
    }
  }
  .picker {
    position: fixed;
    left: 0;
    right: 0;
    z-index: 99;
    bottom: 0;
  }
}
</style>
