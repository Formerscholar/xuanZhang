<template>
  <div id="Login">
    <div class="logo">
      <img src="../../assets/image/logo.png" alt="logo" />
    </div>
    <div class="from">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="50px"
        class="demo-ruleForm"
      >
        <el-form-item class="from_title" label-width="0px" prop="name">
          <el-input
            @focus="allfocusnone"
            @blur="allfocusblbock"
            class="userInput"
            type="number"
            placeholder="请输入手机号"
            v-model="ruleForm.name"
            clearable
            :trigger-on-focus="false"
            maxlength="11"
            minlength="11"
            autofocus
          ></el-input>
        </el-form-item>
        <el-form-item prop="pass" label-width="0px">
          <el-input
            @focus="allfocusnone"
            @blur="allfocusblbock"
            :trigger-on-focus="false"
            class="userInput"
            clearable
            type="password"
            placeholder="请输入密码"
            maxlength="21"
            minlength="6"
            v-model="ruleForm.pass"
          ></el-input>
        </el-form-item>

        <el-form-item label-width="0px" class="loginBtn">
          <el-button class="nextbtn" type="primary" @click="submitForm">登 录</el-button>
        </el-form-item>
        <div class="puzzle-box" v-if="isShow">
          <PuzzleVerification
            :puzzleImgList="puzzleImgList"
            deviation="5"
            blockType="puzzle"
            :onSuccess="handleSuccess"
          />
        </div>
        <el-link :underline="false" class="from_tip" type="primary">用手机号登录</el-link>
      </el-form>
    </div>
    <div class="tips">
      <el-link :underline="false" class="tips_one tipsItem" type="primary">注册账号</el-link>
      <el-link :underline="false" class="tips_two tipsItem" type="primary">遇到问题？</el-link>
    </div>
    <van-overlay :show="MaskShow" />
  </div>
</template>

<script>
import { getlogin, getIndex } from '@/network/login.js'
import { ruleForm } from '@/AppConfig'

export default {
  name: 'Login',
  components: {
    PuzzleVerification: () =>
      import('@/components/common/puzzleVerification/puzzleVerification'),
  },
  data() {
    return {
      MaskShow: false,
      isShow: false,
      puzzleImgList: [
        require('../../assets/image/thumbnail-img01.jpg'),
        require('../../assets/image/thumbnail-img02.jpg'),
        require('../../assets/image/thumbnail-img03.jpg'),
      ],
      text: '',
      ruleForm,
      rules: {
        name: [
          { required: true, message: '请输入你的手机号', trigger: 'blur' },
          { min: 11, max: 11, message: '长度在 11 个字符', trigger: 'blur' },
        ],
        pass: [
          { required: true, message: '请输入你的密码', trigger: 'blur' },
          { min: 6, max: 21, message: '长度在 6-21 个字符', trigger: 'blur' },
        ],
      },
    }
  },
  methods: {
    handleSuccess() {
      this.isShow = false
      this.MaskShow = false
      this.gologin()
    },
    submitForm() {
      this.isShow = true
      this.MaskShow = true
    },
    gologin() {
      this.$refs['ruleForm'].validate(async (valid) => {
        if (valid) {
          const res = await getlogin({
            username: this.ruleForm.name,
            password: this.ruleForm.pass,
          })
          if (res.code == 200) {
            this.$store.commit('setLoginDate', { ...res.data })
            var storage = window.localStorage
            storage.setItem('username', this.ruleForm.name)
            storage.setItem('password', this.ruleForm.pass)
            if (res.data.customers.length > 1) {
              this.$router.replace('/businessLogin')
            } else {
              storage.setItem('ChooseCompany', res.data.company_id)
              var form = new FormData()
              form.append('username', res.data.requestData.username)
              form.append('password', res.data.requestData.password)
              form.append('company_id', res.data.company_id)
              const res1 = await getIndex(form)
              if (res1.code == 200) {
                this.$store.commit(
                  'setUserInfo',
                  JSON.parse(JSON.stringify(res1.data.userInfo))
                )
                this.$store.commit('setToken', res1.data.token)
                storage.setItem(
                  'oparr',
                  ',' + res1.data.userInfo[0].role.oparr + ','
                )
                storage.setItem(
                  'catearr',
                  ',' + res1.data.userInfo[0].role.catearr + ','
                )
                if (!window.localStorage) {
                  alert('浏览器不支持localstorage')
                } else {
                  storage.setItem(
                    'token',
                    JSON.stringify(this.$store.state.token)
                  )
                }
              }
              this.$router.replace('/')
              this.$vnode.parent.componentInstance.cache = {}
              this.$vnode.parent.componentInstance.keys = []
            }
          } else {
            this.$message.error('账号或密码错误!')
            return
          }
        } else {
          return false
        }
      })
    },
    allfocusnone() {
      document.querySelector('#Login .tips').style.display = 'none'
    },
    allfocusblbock() {
      document.querySelector('#Login .tips').style.display = 'block'
    },
  },
  created() {
    const h = document.body.scrollHeight
    window.onresize = function () {
      if (document.body.scrollHeight < h) {
        document.body.style.height = h
      }
    }
    document
      .querySelectorAll('.el-form-item .userInput input')
      .forEach((item) => {
        item.style.border = 'none'
        item.style.height = '3rem'
        item.style.borderRadius = '0px'
        item.style.borderBottom = '1px solid #f3f3f3'
        item.style.fontSize = '1.285714rem '
      })
  },
}
</script>

<style lang="scss" scoped>
.puzzle-box {
  width: 100%;
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
  position: fixed;
  z-index: 10;
  transform: translate(-5%, -50%);
}

#app {
  padding: 0 !important;
  padding-bottom: 0;
}
#Login {
  .van-overlay {
    z-index: 1 !important;
  }
  .logo {
    width: 100%;
    padding-top: 2.857143rem;
    padding-bottom: 2.142857rem;
    img {
      display: block;
      margin: 0 auto;
      width: 5rem;
    }
  }
  .from {
    padding: 0 1.428571rem;
    .from_title {
      text-align: left;
    }
    .nextbtn {
      width: 100%;
      height: 3rem;
      font-size: 1.428571rem;
    }
    .from_tip {
      text-align: center;
      width: 100%;
    }
  }
  .tips {
    width: 100%;
    text-align: center;
    position: fixed;
    bottom: 4rem;
    left: 0;
    right: 0;

    .tips_one {
      margin-right: 0.714286rem;
    }
    .tips_two {
    }
  }
}
</style>
