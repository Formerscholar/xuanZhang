<template>
  <div id="cardbox">
    <van-swipe-cell v-for="(item, index) in distributor" :key="index">
      <div class="box-card">
        <div class="content" @click="gokhlist(item)">
          <div class="title">
            <span class="kh_name">{{ item.name }}</span>
            <span class="kh_moneny"
              >￥{{
                item.arrearsCount.indexOf('-') == -1
                  ? fmoney(item.arrearsCount)
                  : '-' + fmoney(item.arrearsCount.substr(1))
              }}</span
            >
          </div>
          <div class="body">
            <span class="kh_address"
              >{{ item.province }}{{ item.contacts_address }}</span
            >
          </div>
          <div class="btn_box">
            <span class="kh_phone">
              <i>{{
                item.contacts.length != 0 ? item.contacts[0].contacts : ''
              }}</i>
              <em>{{
                item.contacts.length != 0 ? item.contacts[0].contacts_tel : ''
              }}</em>
            </span>
            <span class="kh_created">{{ item.created_at | getCreatedAt }}</span>
          </div>
        </div>
      </div>
      <template #right>
        <div style=" height: 100%;">
          <van-button
            square
            type="primary"
            text="编辑"
            style=" height: 100%;"
            @click="editClick(item)"
          />
        </div>
      </template>
    </van-swipe-cell>
  </div>
</template>

<script>
import { deleteDistributor, deleteSupplier } from '@/network/client'
import { fmoney } from '@/common/utils'

export default {
  data() {
    return {
      fmoney,
    }
  },
  props: {
    titlename: {
      type: String,
      default: '客户',
    },
    distributor: {
      type: Array,
      default: [],
    },
  },
  filters: {
    getCreatedAt(value) {
      return value.split(' ')[0]
    },
  },
  methods: {
    editClick(item) {
      if (this.titlename == '客户') {
        if (item.status == 1) {
          this.$router.push(`/enterpriseedit/client/${item.id}`)
        } else if (item.status == 2) {
          this.$router.push(`/clientedit/client/${item.id}`)
        }
      } else if (this.titlename == '供应商') {
        if (item.status == 1) {
          this.$router.push(`/enterpriseedit/supplier/${item.id}`)
        } else if (item.status == 2) {
          this.$router.push(`/clientedit/supplier/${item.id}`)
        }
      }
    },
    async delelClick(id) {
      var form = new FormData()
      form.append('token', this.$store.state.token)
      form.append('id', id * 1)
      if (this.titlename == '客户') {
        const { code, msg } = await deleteDistributor(form)
        if (code == 200) {
          this.$message({
            showClose: true,
            message: msg,
            type: 'success',
          })
          this.$emit('refreshList')
        } else {
          this.$message({
            showClose: true,
            message: msg,
            type: 'error',
          })
        }
      } else {
        const { code, msg } = await deleteSupplier(form)
        if (code == 200) {
          this.$message({
            showClose: true,
            message: msg,
            type: 'success',
          })
          this.$emit('refreshList')
        } else {
          this.$message({
            showClose: true,
            message: msg,
            type: 'error',
          })
        }
      }
    },
    gokhlist(item) {
      this.$emit('gokhlist', item)
    },
  },
}
</script>

<style scoped lang="scss">
#cardbox {
  padding: 0 1.571429rem;
  .box-card {
    border-bottom: 1px solid #f2f2f2;
    .content {
      padding: 0.357143rem 0;
      .title,
      .body,
      .btn_box {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
      }
      .kh_name {
        font-size: 1rem;
        font-weight: 700;
        color: #020202;
      }
      .kh_moneny {
        color: #d6503e;
        font-size: 1rem;
      }
      .kh_address {
        font-size: 0.857143rem;
        white-space: nowrap;
        color: #727272;
      }
      .kh_phone {
        display: flex;
        justify-content: flex-start;
        align-items: flex-end;
        font-size: 0.857143rem;
        color: rgb(66, 147, 200);
        i {
          margin-right: 0.714286rem;
        }
      }
      .kh_created {
        font-size: 0.857143rem;
        color: #a5a5a5;
      }
    }
  }
}
</style>
