<template>
  <div id="IncomingDelivery">
    <navbar class="p_root_box">
      <div class="left" slot="left" @click="blacknext">
        <i class="el-icon-arrow-left"></i>
      </div>
      <div class="center" slot="center">
        <span>流水发货</span>
      </div>
      <div slot="right"></div>
    </navbar>
    <scroll
      class="scroll-wrapper"
      ref="scroll"
      :probe-type="3"
      :pull-up-load="true"
      @pullingUp="loadMore"
    >
      <div class="content">
        <van-swipe-cell
          v-for="(item, index) in deliveryRecordList"
          :key="index"
        >
          <el-card class="box-card">
            <div>
              <div class="topbox">
                <span>
                  {{ item.order_number }}
                  <em>操作:{{ item.operator_name }}</em>
                </span>
                <i class>{{ item.name }}</i>
              </div>
              <div class="botbox">
                <span
                  :class="item.total_funds.indexOf('-') == -1 ? 'black' : 'red'"
                  >￥{{ item.total_funds }}</span
                >
                <em>发货时间:{{ item.created_at }}</em>
              </div>
            </div>
          </el-card>
          <template #right>
            <van-button
              @click="
                repealClick({
                  id: item.id,
                  type: item.deleted_at,
                })
              "
              style="height:100%;"
              square
              type="danger"
              :text="item.deleted_at == null ? '作废' : '取消'"
            />
            <van-button
              @click="printClick(item.print_html)"
              style="height:100%;"
              square
              type="primary"
              text="打印"
            />
          </template>
        </van-swipe-cell>
      </div>
    </scroll>
    <i class="el-icon-plus"></i>
    <van-overlay :show="isShow" @click="isShow = false">
      <div class="wrapr">
        <myVqr :Content="textContent"></myVqr>
      </div>
    </van-overlay>
  </div>
</template>

<script>
import {
  getDeliverGoodsList,
  delDeliverRecord,
  cancelDelDeliverRecord,
} from '@/network/deal'

export default {
  components: { myVqr: () => import('@/components/common/my_vqr/myVqr') },
  data() {
    return {
      deliveryRecordList: [],
      pages: 1,
      ifquire: true,
      isShow: false,
      textContent: '',
    }
  },
  computed: {
    getDeliverGoodData() {
      return {
        token: this.$store.state.token,
        page: this.pages,
        offset: 20,
        order_type: 'flow',
        distributor_id: 0,
        _: new Date().getTime(),
      }
    },
  },
  methods: {
    printClick(html) {
      if (html != null) {
        this.isShow = true
        this.textContent = html
      } else {
        this.$message({
          showClose: true,
          message: '暂未生成',
          type: 'error',
        })
      }
    },
    async repealClick(data) {
      let form = new FormData()
      form.append('token', this.$store.state.token)
      form.append('id', data.id)
      form.append('order_type', 'flow')
      if (data.type == null) {
        const { code, msg } = await delDeliverRecord(form)
        if (code == 200) {
          this.deliveryRecordList = []
          this.pages = 1
          this.getDeliverGoods()
          this.$message({
            showClose: true,
            message: msg,
            type: 'success',
          })
        } else {
          this.$message({
            showClose: true,
            message: '不可作废',
            type: 'error',
          })
        }
      } else {
        const { code, msg } = await cancelDelDeliverRecord(form)
        if (code == 200) {
          this.deliveryRecordList = []
          this.pages = 1
          this.getDeliverGoods()
          this.$message({
            showClose: true,
            message: msg,
            type: 'success',
          })
        } else {
          this.$message({
            showClose: true,
            message: msg,
            type: 'error',
          })
        }
      }
    },
    loadMore() {
      ++this.pages
      if (this.ifquire) {
        this.getDeliverGoods()
      } else {
        this.$toast('没有更多数据了')
      }
    },
    async getDeliverGoods() {
      const { data } = await getDeliverGoodsList(this.getDeliverGoodData)

      if (data.deliveryRecordList.length) {
        data.deliveryRecordList.map((item) => {
          this.deliveryRecordList.push(item)
        })
      } else {
        this.ifquire = false
      }
    },
    blacknext() {
      this.$router.replace('/home')
    },
  },
  created() {
    this.getDeliverGoods()
  },
  destroyed() {
    this.deliveryRecordList = []
    this.pages = 1
    this.textContent = ''
  },
}
</script>

<style scoped lang="scss">
#IncomingDelivery {
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
      margin-left: -3.071429rem;
      font-size: 1.285714rem;
      font-weight: 700;
      color: #030303;
    }
  }
  .el-icon-plus {
    position: fixed;
    bottom: 3.357143rem;
    right: 3.357143rem;
    padding: 0.571429rem;
    z-index: 999;
    font-size: 2.714286rem;
    background-color: rgb(66, 147, 200);
    color: #fff;
    border-radius: 50%;
  }
  .scroll-wrapper {
    position: absolute;
    left: 0;
    top: 5.428571rem;
    bottom: 0;
    width: 100%;
    overflow: hidden;
  }
  .box-card {
    margin-bottom: 0.571429rem;
    .topbox {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      span {
        font-size: 0.857143rem;
        color: #ff9d17;
        font-weight: 700;
        em {
          color: #acacac;
          padding-left: 0.571429rem;
          font-weight: normal;
        }
      }
      i {
        font-size: 1rem;
        font-weight: 700;
        color: #000;
      }
    }
    .botbox {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      font-size: 0.857143rem;
      margin-top: 0.714286rem;
      span {
        font-weight: 700;
      }
      .black {
        color: #000000;
      }
      .red {
        color: red;
      }
      em {
        color: #acacac;
      }
    }
  }
  .wrapr {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
}
</style>
