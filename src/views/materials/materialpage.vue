<template>
  <div id="materialpage">
    <navbar class="p_root_box bg-primary">
      <div class="left" slot="left" @click="onClickLeft">
        <i class="el-icon-arrow-left"></i>
      </div>
      <div class="center" slot="center">
        <span>物料</span>
      </div>
      <div slot="right"></div>
    </navbar>
    <van-search
      class="head_search"
      v-model="searchValue"
      placeholder="请输入搜索关键词"
      @search="primarySearch"
    />
    <van-tabs v-model="active">
      <van-tab title="物料列表" class="Delivery" v-if="ismaterielList">
        <scroll
          class="scroll-wrapper"
          ref="scroll"
          :probe-type="3"
          :pull-up-load="true"
          @pullingUp="loadMores"
          @scroll="clickscroll"
        >
          <van-swipe-cell v-for="(item, index) in materielList" :key="index">
            <div @click="editClick(item.id)">
              <el-card class="box-card">
                <div class="content_box_card">
                  <img
                    class="left_card"
                    v-if="item.img_url && item.img_url != '0'"
                    v-lazy="bestURL + item.img_url"
                    alt="logo"
                  />
                  <img
                    v-else
                    class="left_card"
                    src="@/assets/image/Default.png"
                    alt="defaultLogo"
                  />
                  <div class="right_card">
                    <span class="right_card_name">{{ item.name }}</span>
                    <span class="right_card_model">{{
                      item.specification
                    }}</span>
                    <span>
                      {{ item.stock }}
                      <em>当前库存</em>
                    </span>
                  </div>
                </div>
              </el-card>
            </div>
            <template #right>
              <van-button
                v-if="istobomPage"
                square
                text="bom"
                type="primary"
                style="height: 5.857143rem;width: 4.571429rem;"
                @click="tobomPage(item.id)"
              />
              <van-button
                square
                text="废弃"
                type="danger"
                style="height: 5.857143rem;width: 4.571429rem;"
                @click="Abandoned(item.id)"
              />
            </template>
          </van-swipe-cell>
        </scroll>
      </van-tab>
      <van-tab title="临时物料" class="Delivery" v-if="isTemporary">
        <scroll
          class="scroll-wrapper"
          ref="scrolls"
          :probe-type="3"
          :pull-up-load="true"
          @pullingUp="loadMores"
          @scroll="clickscroll"
        >
          <van-swipe-cell v-for="(item, index) in Temporary" :key="index">
            <div>
              <el-card class="box-card">
                <div class="content_box_card">
                  <img
                    class="left_card"
                    v-if="item.img_url && item.img_url != '0'"
                    v-lazy="bestURL + item.img_url"
                    alt="logo"
                  />
                  <img
                    v-else
                    class="left_card"
                    src="@/assets/image/Default.png"
                    alt="defaultLogo"
                  />
                  <div class="right_card">
                    <span class="right_card_name">{{ item.name }}</span>
                    <span class="right_card_model">{{
                      item.specification
                    }}</span>
                    <span>
                      {{ item.stock }}
                      <em>当前库存</em>
                    </span>
                  </div>
                </div>
              </el-card>
            </div>
            <template #right>
              <van-button
                square
                text="使用"
                type="primary"
                style="height: 5.857143rem;width: 4.571429rem;"
                @click="uses(item.id)"
              />
              <van-button
                square
                text="废弃"
                type="danger"
                style="height: 5.857143rem;width: 4.571429rem;"
                @click="Abandonedss(item)"
              />
            </template>
          </van-swipe-cell>
        </scroll>
      </van-tab>
    </van-tabs>
    <i class="el-icon-plus" @click="addMaterial" v-if="isaddMaterial"></i>
  </div>
</template>

<script>
import { getMaterielList } from '@/network/materials'
import { bestURL } from '@/network/baseURL'

export default {
  name: 'materialpage',
  data() {
    return {
      active: 0,
      searchValue: '',
      materielList: [],
      Temporary: [],
      allPage: 1,
      onePage: 1,
      twoPage: 1,
      bestURL: '',
      isOne: true,
      isTwo: true,
      ismaterielList: true,
      isTemporary: true,
      isaddMaterial: true,
      istobomPage: true,
    }
  },
  created() {
    this.bestURL = bestURL
    this.getMaterie()
    this.getTemporary()
  },
  activated() {
    this.$Jurisdiction('67', localStorage.getItem('catearr'), () => {
      this.$router.replace('/home')
      this.$toast('您的账号无该模块权限!')
    })
    this.$Jurisdiction('137', localStorage.getItem('catearr'), () => {
      this.ismaterielList = false
    })
    this.$Jurisdiction('139', localStorage.getItem('catearr'), () => {
      this.isTemporary = false
    })
    this.$Jurisdiction('27', localStorage.getItem('oparr'), () => {
      this.isaddMaterial = false
    })
    this.$Jurisdiction('31', localStorage.getItem('oparr'), () => {
      this.istobomPage = false
    })
  },
  destroyed() {
    this.allPage = 1
    this.onePage = 1
    this.twoPage = 1
    this.isOne = true
    this.isTwo = true
    this.materielList = []
    this.Temporary = []
  },
  computed: {
    getMaterielData() {
      return {
        token: this.$store.state.token,
        page: this.allPage,
        offset: 20,
        materiel_name: null,
        specification: null,
        materiel_status: 'normal',
        _: new Date().getTime(),
      }
    },
    getTemporaryData() {
      return {
        token: this.$store.state.token,
        page: this.allPage,
        offset: 20,
        materiel_name: null,
        specification: null,
        materiel_status: 'wait_check',
        _: new Date().getTime(),
      }
    },
  },
  methods: {
    clickscroll() {
      this.allPage = 1
      if (!this.active) {
        this.onePage = 1
        this.isOne = true
        this.materielList = []
        this.getMaterie()
      } else {
        this.twoPage = 1
        this.isTwo = true
        this.Temporary = []
        this.getTemporary()
      }
    },
    loadMores() {
      if (!this.active) {
        if (this.isOne) {
          this.allPage = ++this.onePage
          this.getMaterie()
        } else {
          this.$toast('没有更多数据了')
        }
      } else {
        if (this.isTwo) {
          this.allPage = ++this.twoPage
          this.getTemporary()
        } else {
          this.$toast('没有更多数据了')
        }
      }
    },
    async primarySearch(value) {
      let datamateriel_status
      if (!this.active) {
        datamateriel_status = 'normal'
      } else {
        datamateriel_status = 'wait_check'
      }
      const { data, code, msg } = await getMaterielList({
        token: this.$store.state.token,
        page: 1,
        offset: 20,
        materiel_name: value,
        specification: null,
        materiel_status: datamateriel_status,
        _: new Date().getTime(),
      })
      if (!this.active) {
        this.materielList = data.materielList
      } else {
        this.Temporary = data.materielList
      }
    },
    tobomPage(id) {
      this.$router.push(`/bompage/${id}`)
    },
    uses(iid) {
      this.$router.push(`/because/${iid}`)
    },
    async Abandonedss(data) {
      const { code, msg } = await editMaterielStatus({
        token: this.$store.state.token,
        id: data.id,
        materiel_status: 'discard',
        name: data.name,
        specification: data.specification,
        attribute: data.attribute,
        materiel_category_id: data.materiel_category_id,
        unit_id: data.unit_id,
      })
      if (code == 200) {
        this.getMaterie()
        this.getTemporary()
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
    },
    async Abandoned(id) {
      const { code, msg } = await editMaterielStatus({
        token: this.$store.state.token,
        id: id,
        materiel_status: 'discard',
        name: null,
        specification: null,
        attribute: 'product',
        materiel_category_id: null,
        unit_id: null,
      })
      if (code == 200) {
        this.getMaterie()
        this.getTemporary()
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
    },
    editClick(id) {
      this.$router.push(`/editMaterial/${id}`)
    },
    addMaterial() {
      this.$router.push('/addMaterial')
    },
    async getMaterie() {
      const { data } = await getMaterielList(this.getMaterielData)

      if (data.materielList.length) {
        data.materielList.map((item) => {
          this.materielList.push(item)
        })
      } else {
        this.isOne = false
      }
    },
    async getTemporary() {
      const { data } = await getMaterielList(this.getTemporaryData)

      if (data.materielList.length) {
        data.materielList.map((item) => {
          this.Temporary.push(item)
        })
      } else {
        this.isTwo = false
      }
    },
    onClickLeft() {
      this.$router.replace('/home')
    },
    onClickRight() {},
  },
}
</script>

<style scoped lang="scss">
#materialpage {
  padding-top: 5.428571rem;
  .p_root_box {
    .left {
      margin-left: 1.071429rem;
      i {
        font-size: 1.571429rem;
      }
    }
    .center {
      margin-left: -2.071429rem;
      span {
        font-size: 1.428571rem;
      }
    }
  }
  .Delivery {
    height: calc(100vh - 8.928571rem);
    .scroll-wrapper {
      position: absolute;
      left: 0;
      right: 0;
      top: 3.142857rem;
      bottom: 0;
      width: 100%;
      overflow: hidden;
      .content_right {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .van-button {
          height: 2.357143rem !important;
        }
      }
    }
    .box-card {
      margin-bottom: 0.571429rem;
      .content_box_card {
        overflow: auto;
        padding: 0 0.714286rem;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .left_card {
          float: left;
          width: 4.214286rem;
          height: 4.214286rem;
          background-color: #e8e8e8;
          border-radius: 0.357143rem;
          margin-right: 1.428571rem;
        }
        .right_card {
          float: left;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          white-space: nowrap;
          span {
            font-size: 1rem;
            color: #686868;
            &:first-child {
              font-size: 1.142857rem;
              font-weight: 700;
              color: #666666;
            }
            &:last-child {
              color: #ffcc00;
            }
            em {
              color: #c6c6c6;
              font-weight: 700;
            }
          }
        }
      }
    }
  }
  .el-icon-plus {
    position: fixed;
    bottom: 3.142857rem;
    right: 2.357143rem;
    padding: 0.571429rem;
    z-index: 999;
    font-size: 2.714286rem;
    background-color: rgb(66, 147, 200);
    color: #fff;
    border-radius: 50%;
  }
}
</style>
