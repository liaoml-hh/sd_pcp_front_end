<template>
  <div class="container">
    <div class="titleInfo">
      <img class="sdLogo" src="../../assets/404_images/power.jpg" width="60" alt="">
      <div class="titleName">{{ systemName }}</div>
      <div class="operation">
        <a class="operaInfo">设为首页</a> |
        <a class="operaInfo" @click="CreateShortcut">收藏</a>
      </div>
    </div>
    <div class="login-container">
      <slider v-if="isShowSlider" @SliderSucess="sliderSucess" @closeSlider="closeSlider" />
      <div class="title-container">
        <!-- <h3 class="title">{{ systemName }}</h3> -->
      </div>
      <el-form class="companyInfo-container">
        <text>JeeSite Demo</text>
      </el-form>
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
        <div class="chooseLogin">
          <div v-for="(item,index) in loginMethod" :key="index" class="chooseLoginItem" :class="{chooseLoginItemActive:loginChoose==index}" @click="loginChoose=index">{{ item }}</div>
        </div>
        <el-form-item prop="code">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input
            ref="code"
            v-model="loginForm.code"
            placeholder="请输入工号"
            name="code"
            type="text"
            tabindex="1"
            auto-complete="on"
          />
        </el-form-item>
        <el-form-item v-if="loginChoose==0" prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            id="pcp_input_id"
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="请输入密码"
            name="password"
            class="pcp_input_id"
            tabindex="2"
            auto-complete="on"
            @blur="visible=false"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
          <el-popover
            v-model="visible"
            placement="bottom"
            trigger="manual"
          >
            <span>大写锁定已打开</span>
          </el-popover>
        </el-form-item>
        <el-checkbox v-model="saveLoginInfo">记住用户名和密码?</el-checkbox>

        <!--      租户-->
        <el-form-item v-show="false" prop="tenant_id">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input
            ref="account"
            v-model="loginForm.account"
            placeholder="租户id"
            name="account"
            type="text"
            tabindex="3"
            auto-complete="on"
          />
        </el-form-item>
        <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="isShowSlider=true">登录</el-button>
      </el-form>
    </div>
    <div class="webInfo">
      <div class="info-container">
        <div class="beian">ICP证：沪12047276号</div>
        <div class="support">Copyright (C) 2017-2020 © Avant-Port</div>
        <div class="suggest">浏览器：
          <a target="_blank" href="https://www.google.cn/intl/zh-CN/chrome/">chrome90</a>/
          <a target="_blank" href="https://www.microsoft.com/en-us/edge">IE10</a> 以上 | 分辨率建议1024*1960</div>
        <img class="code" src="../../assets/404_images/aiwenpu.jpg" width="60" alt="" srcset="">
        <div class="support2">上海艾文普信息技术有限公司</div>
      </div>
    </div>
  </div>

</template>

<script>
// import { validUsername } from '@/utils/validate'
// import { login } from '@/api/user'
import Slider from '@/views/login/Slider'
import { Message } from 'element-ui'
export default {
  name: 'Login',
  components: {
    Slider
  },
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能少于6位'))
      } else if (value.length > 16) {
        callback(new Error('密码不能大于16位'))
      } else {
        callback()
      }
    }
    return {
      saveLoginInfo: false,
      visible: false,
      loginForm: {
        code: '',
        password: '',
        account: 'PCP'
      },
      loginRules: {
        code: [{ required: true, message: '用户名不能为空', trigger: 'blur' },
          { min: 3, max: 16, message: '长度在 3 到 16 个字符', trigger: 'blur' }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      systemName: '换电平台系统 v1.0.1', // 系统名称
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      // loginMethod: ['账号登录', '短信登录', '验证码登录'],
      loginMethod: ['账号登录'],
      loginChoose: 0,
      isShowSlider: false
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  mounted() {
    let str = localStorage.getItem('key1') || null
    if (str) {
      let code = str.split('@')[0]
      let password = str.split('@')[1]
      this.loginForm.code = code
      this.loginForm.password = password
      this.saveLoginInfo = true
    } else {
      this.saveLoginInfo = false
    }
    console.log(document.getElementById('pcp_input_id').onkeydown = this.keyDown)
    console.log(document.getElementById('pcp_input_id').onmousedown = this.keyDown)
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        console.log(document.getElementById('pcp_input_id').onkeydown = this.keyDown)
        console.log(document.getElementById('pcp_input_id').onmousedown = this.keyDown)
        this.$refs.password.focus()
      })
    },
    CreateShortcut(url = location.href, title = document.title) {
      alert('快捷键Ctrl+D收藏为书签')
      document.dispatchEvent(new KeyboardEvent('keydown', { key: '17' }))
      document.dispatchEvent(new KeyboardEvent('keydown', { key: '68' }))
      return false
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true

          this.$store.dispatch('user/login', this.loginForm).then(res => {
            if (res.code === 200) {
              if (this.saveLoginInfo) {
                localStorage.setItem('key1', this.loginForm.code + '@' + this.loginForm.password)
              } else {
                localStorage.removeItem('key1')
              }
              Message({
                message: res.msg,
                type: 'success',
                duration: 5 * 1000
              })
            } else {
              Message({
                message: res.msg,
                type: 'error',
                duration: 5 * 1000
              })
            }
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
          }).catch((res) => {
            Message({
              message: res.msg,
              type: 'error',
              duration: 5 * 1000
            })
            this.loading = false
          })
        } else {
          return false
        }
      })
    },
    sliderSucess() {
      var that = this
      setTimeout(function() { that.isShowSlider = false }, 1000)
      this.handleLogin()
    },
    closeSlider() {
      this.isShowSlider = false
    },
    keyDown(e) {
      console.log(e, this.visible = e.getModifierState('CapsLock'))
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$light_gray:rgb(0, 0, 0);
$cursor: rgb(0, 0, 0);

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  position: relative;
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px white  inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(0, 0, 0, 0.2);
    background: rgba(255, 255, 255);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$dark_gray:#889aa4;
$light_gray:#eee;

.container::-webkit-scrollbar {display:none}
.container{
  width: 100%;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: scroll;
  -ms-overflow-style: none!important;
  overflow: -moz-scrollbars-none!important;
  .titleInfo{
    width: 100%;
    height: 8%;
    position: relative;
    .sdLogo{
      vertical-align: middle;
      text-align: center;
      margin-left: 10px;
    }
    .titleName{
      top: -13px;
      display: inline-block;
      text-align: center;
      margin-left: 15px;
      line-height: 20px;
    }
    .operation{
      position: absolute;
      right: 10px;
      top: 20px;
      .operaInfo:hover{
        color: #409EFF;
      }
    }
  }
  .login-container {
    width: 100%;
    height: 82%;
    background-size: 110%;
    background: #409eff;
    overflow: hidden;
        .companyInfo-container{
    position: absolute;
    width: 520px;
    height: 400px;
    background:url("../../assets/404_images/sybg.png") no-repeat;
    box-sizing:border-box;
    max-width: 100%;
    padding: 20px 35px 0;
    top: 0;
    bottom: 0;
    left: 0;
    right: 520px;
    margin: auto;
    border-radius: 1em;
  }
    .login-form {
      position: absolute;
      width: 520px;
      height: 400px;
      max-width: 100%;
      padding: 20px 35px 0;
      top: 0;
      bottom: 0;
      left: 520px;
      right: 0;
      margin: auto;
      border-radius: 1em;
      // background-color: rgba(255,255,255,0.2);
      background-color: rgba(255,255,255);
      .el-input{
        background: white;
      }
      span{
        background: white;
      }

    }
    .tips {
      font-size: 14px;
      color: rgb(0, 0, 0);
      margin-bottom: 10px;

      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }

    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
    }

    .title-container {
      position: relative;
      margin-top:50px;

      .title {
        font-size: 26px;
        color: black;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
      }
    }

    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: black;
      cursor: pointer;
      user-select: none;
    }
  }
  .webInfo{
    width: 100%;
    height: 10%;
    background-color: #E4E7ED;
    position: relative;
    margin:0;
    .info-container{
      position: absolute;
      width: 100%;
      left: 0;
      right: 0;
      bottom: 0;
      top: 0;
      margin:auto;
      .support{
        margin: 10px auto 5px;
        color: #687F7F;
        font-size: 13px;
        width: 260px;
      }
      .support2{
        position: absolute;
        bottom: 2px;
        right: 10px;
        font-size: 13px;
      }
      .beian{
        color: #687F7F;
        font-size: 13px;
        width:194px;
        margin: 10px auto 5px;
      }
      .suggest{
        color: red;
        margin: 10px auto 5px;
        width: 340px;
        font-size: 14px;
      }
      .code{
        position: absolute;
        top: 10px;
        right: 30px;
      }
    }
  }
}

.chooseLogin{
  color:black;
  display: flex;
  height:50px;
  .chooseLoginItem{
    line-height: 50px;
    padding:0 10px;
    cursor: pointer;
  }
  .chooseLoginItemActive{
    background-color: rgba(255, 255, 255);
    color: #000000;
  }
}
.drag {
  width: 300px;
  height: 40px;
  line-height: 40px;
  background-color: #e8e8e8;
  position: relative;
  margin: 0 auto;
}

.bg {
  width: 40px;
  height: 100%;
  position: absolute;
  background-color: #75CDF9;
}

.text {
  position: absolute;
  width: 100%;
  height: 100%;
  text-align: center;
  user-select: none;
}

.btn {
  width: 40px;
  height: 38px;
  position: absolute;
  border: 1px solid #ccc;
  cursor: move;
  font-family: "宋体";
  text-align: center;
  background-color: #fff;
  user-select: none;
  color: rgb(255, 255, 255);
}
</style>
