<template>
  <div id="StorageCompany">
    <navbar class="p_root_box">
      <div class="left" slot="left" @click="blackhome">
        <i class="el-icon-arrow-left"></i>
      </div>
      <div class="center" slot="center">
        <span>{{ distributorNew.name }}</span>
      </div>
      <div class="right" slot="right">
        <van-icon @click="newAccount" name="orders-o" />
      </div>
    </navbar>
    <scroll class="scroll-wrapper" :probeType="3">
      <div class="coutent">
        <div class="card topcard">
          <el-card class="box-card">
            <ul>
              <li>
                <span>总金额</span>
                <em>{{ distributorNew.notInvoiceMoney }}</em>
              </li>
              <li>
                <span>总欠款</span>
                <em>{{ distributorNew.actualNotSettlementMoney }}</em>
              </li>
              <li>
                <span>已结算</span>
                <em>{{ distributorNew.settlementMoney }}</em>
              </li>
              <li>
                <span>已开票</span>
                <em>{{ distributorNew.invoiceMoney }}</em>
              </li>
            </ul>
          </el-card>
        </div>
        <div v-for="(item, index) in orderList" :key="item.id" class="Delivery">
          <van-swipe-cell v-if="item.to_examine != undefined">
            <el-card class="box-card">
              <div
                @click="gocontractList(orderList[index])"
                :class="item.deleted_at && 'color_break '"
              >
                <div class="title">
                  <div class="title_text">
                    <span
                      :class="item.deleted_at ? 'color_break model' : ' model'"
                      >{{ item.order_number }}</span
                    >
                    <span
                      :class="item.deleted_at ? 'color_break name' : ' name'"
                      >{{ item.name }}</span
                    >
                  </div>

                  <div class="ControlledDelaybox">
                    <span
                      v-for="(item, index) in item.auditRecord"
                      :key="index"
                      :class="
                        item.status == 0
                          ? 'glyphicon pramary'
                          : 'glyphicon info'
                      "
                    ></span>
                  </div>
                </div>

                <div class="time_box">
                  <span
                    :class="
                      item.deleted_at ? 'color_break timer_text' : ' timer_text'
                    "
                    >{{ item.created_at | setCommitmentPeriod }}</span
                  >
                  <span
                    :class="
                      item.deleted_at
                        ? 'color_break time_pircle'
                        : ' time_pircle'
                    "
                  >
                    <el-tag
                      :class="item.deleted_at ? 'color_break ' : ' '"
                      :type="item.type == 0 ? '' : 'danger'"
                      effect="plain"
                      >{{ item.type == 0 ? '正常' : '待审' }}</el-tag
                    >
                    <em
                      :class="
                        item.deleted_at
                          ? 'color_break '
                          : item.total_price.indexOf('-') == -1
                          ? 'black'
                          : 'red'
                      "
                      >￥{{ item.total_price }}</em
                    >
                  </span>
                </div>
              </div>
            </el-card>
            <template #right>
              <van-button
                v-if="!item.to_examine"
                square
                type="primary"
                style="height:100%; margin:0 auto;width:2.142857rem;line-height:1.714286rem;"
                text="受控"
                @click.stop="ControlledDelay(item.id)"
              />
              <van-button
                v-else
                style="height:100%; margin:0 auto;width:2.142857rem;line-height:1.714286rem;"
                square
                type="danger"
                text="解锁"
                @click.stop="unlockyoursidekick(item.id)"
              />
            </template>
          </van-swipe-cell>
          <el-card class="box-card" v-else>
            <div
              @click="gocontractList(orderList[index])"
              :class="item.deleted_at && 'color_break '"
            >
              <div class="title">
                <div class="title_text">
                  <span
                    :class="item.deleted_at ? 'color_break model' : ' model'"
                    >{{ item.order_number }}</span
                  >
                  <span
                    :class="item.deleted_at ? 'color_break name' : ' name'"
                    >{{ item.name }}</span
                  >
                </div>
                <div class="ControlledDelaybox">
                  <span
                    v-for="(item, index) in item.auditRecord"
                    :key="index"
                    :class="
                      item.status == 0 ? 'glyphicon pramary' : 'glyphicon info'
                    "
                  ></span>
                </div>
              </div>

              <div class="time_box">
                <span
                  :class="
                    item.deleted_at ? 'color_break timer_text' : ' timer_text'
                  "
                  >{{ item.created_at | setCommitmentPeriod }}</span
                >
                <span
                  :class="
                    item.deleted_at ? 'color_break time_pircle' : ' time_pircle'
                  "
                >
                  <el-tag
                    :class="item.deleted_at ? 'color_break ' : ' '"
                    :type="item.type == 0 ? '' : 'danger'"
                    effect="plain"
                    >{{ item.type == 0 ? '正常' : '待审' }}</el-tag
                  >
                  <em
                    :class="
                      item.deleted_at
                        ? 'color_break '
                        : item.total_price.indexOf('-') == -1
                        ? 'black'
                        : 'red'
                    "
                    >￥{{ item.total_price }}</em
                  >
                </span>
              </div>
            </div>
          </el-card>
        </div>
      </div>
    </scroll>
  </div>
</template>

<script>
import { getSupplierDetail } from '@/network/deal'

export default {
  data() {
    return {
      active: 0,
      iid: 0,
      distributorNew: {},
      orderList: [],
    }
  },
  created() {
    this.iid = this.$route.params.id
    this.getDistributor()
  },
  computed: {
    getDistributorDate() {
      return {
        token: this.$store.state.token,
        supplier_id: this.iid,
        order_type: 'warehouse',
        page: 1,
        order_number: null,
        start_time: null,
        end_time: null,
        _: new Date().getTime(),
      }
    },
  },
  filters: {
    setOperatorName(value) {
      return '操作:' + value
    },
    setApplyTime(value) {
      return '发货时间:' + value
    },
    setCommitmentPeriod(value) {
      return '创建:' + value
    },
    setApply(value) {
      return '交期:' + value
    },
    setNumber(value) {
      return '×' + value
    },
  },
  methods: {
    gocontractList(deliveryRecordList) {
      this.$router.push(`/asidesItem/${deliveryRecordList.id}`)
    },
    blackhome() {
      this.$router.go(-1)
    },
    newAccount() {},
    async getDistributor() {
      const { data } = await getSupplierDetail(this.getDistributorDate)

      this.distributorNew = data.supplierNew
      this.orderList = data.orderList
    },
  },
}
</script>

<style scoped lang="scss">
#StorageCompany {
  padding-top: 5.428571rem;
  .p_root_box {
    .left {
      margin-left: 1.071429rem;
      i {
        font-size: 1.571429rem;
      }
    }
    .center {
      margin-left: 0.928571rem;
      span {
        font-size: 1.571429rem;
      }
    }
    .right {
      margin-right: 1.071429rem;
      .newbtn {
      }
    }
  }
  .scroll-wrapper {
    position: absolute;
    left: 0;
    top: 5.428571rem;
    bottom: 0;
    width: 100%;
    overflow: hidden;
  }
  .coutent {
    padding: 0.571429rem 1rem;
    .card {
      .box-card {
        margin-bottom: 0.571429rem;
        ul {
          display: flex;
          width: 100%;
          flex-wrap: wrap;
          li {
            width: 50%;
            height: 5.571429rem;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: flex-start;
            padding: 1.014286rem;
            span {
              color: #9b9b9b;
            }
            em {
              font-weight: 700;
              font-style: normal;
              font-size: 1.142857rem;
            }
          }
        }
      }
    }
    .Delivery {
      .box-card {
        margin-bottom: 0.571429rem;
        padding: 0.571429rem 1rem;

        .color_break {
          color: #ccc !important;
          border-color: #ccc !important;
          filter: grayscale(100%);
        }
        .title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.357143rem;

          .title_text {
            display: flex;
            font-size: 1rem;
            .model {
              color: rgb(66, 147, 200);
              margin-right: 0.714286rem;
            }
            .name {
            }
          }
          .ControlledDelaybox {
            display: flex;
            .glyphicon {
              width: 0.857143rem;
              height: 0.857143rem;
              margin-right: 0.357143rem;
            }
            .pramary {
              background-color: #e3e3e3;
            }
            .info {
              background-color: rgb(66, 147, 200);
            }
          }
        }
        .itemlist {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.357143rem;
          white-space: nowrap;
          position: relative;
          .items {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            flex: 1;
            overflow: hidden;
          }
          .right_box {
            position: absolute;
            right: 0;
            top: 0;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            color: #818181;
            background-color: rgba(255, 255, 255, 0.6);
          }
        }
        .time_box {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.857143rem;
          color: #818181;
          .timer_text {
            white-space: nowrap;
            overflow: hidden;
          }
          .time_pircle {
            display: flex;
            justify-content: center;
            align-items: center;
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
      }
    }
  }
}
</style>
