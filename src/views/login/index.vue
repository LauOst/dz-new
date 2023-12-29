<template>
  <div class="login-container">
    <div class="login-form-wrap">
      <div class="logo">
        <img src="../../assets/images/logo.png" alt="">
      </div>
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        auto-complete="on"
        label-position="left"
      >
        <el-form-item prop="username">
          <span class="svg-container" style="color: #333">
            <svg-icon icon-class="user" />
          </span>
          <el-input
            ref="username"
            v-model="loginForm.username"
            placeholder="请输入账号"
            name="username"
            type="text"
            tabindex="1"
            auto-complete="on"
          />
        </el-form-item>

        <el-form-item prop="password">
          <span class="svg-container" style="color: #333">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="请输入密码"
            name="password"
            tabindex="2"
            auto-complete="on"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" style="color: #333" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
        <el-button
          :loading="loading"
          type="primary"
          style="width:100%;margin-bottom:30px;"
          @click.native.prevent="handleLogin"
        >登录
        <!-- {{ $t('btn.Login') }} -->
        </el-button>
      </el-form>
      <!-- <el-dropdown
        class="right-menu-item"
        trigger="click"
      >
        <div>
          <svg-icon
            icon-class="language"
            class-name="language-icon"
          />
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            :disabled="$i18n.locale == 'zh'"
            @click.native="toggleLang('zh')"
          >中文</el-dropdown-item>
          <el-dropdown-item
            :disabled="$i18n.locale == 'en'"
            @click.native="toggleLang('en')"
          >English</el-dropdown-item>
          <el-dropdown-item
            :disabled="$i18n.locale == 'th'"
            @click.native="toggleLang('th')"
          >ภาษาไทย</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown> -->
    </div>

    <el-dialog v-dialogDrag :close-on-click-modal="false" :modal-append-to-body="false" title="选择站点" :visible.sync="dialogVisible" width="480px" class="dialog">
      <el-form ref="departForm" :model="departForm" class="depart-form" label-width="90px" style="width: 450px; margin-left:50px;">
        <el-form-item label="站点信息">
          <el-select v-model="departForm.id" placeholder="请选择" style="width: 240px">
            <el-option v-for="item in departOptions" :key="item.id" :label="item.departName" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <!--        <el-button @click="dialogVisible = false">-->
        <el-button @click="cancel">
          取消
        </el-button>
        <el-button type="primary" @click="submitForm">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import { validUsername } from '@/utils/function/validate'
import { getSite } from '@/api/user'

export default {
  name: 'Login',
  data() {
    // const validateUsername = (rule, value, callback) => {
    //   if (!validUsername(value)) {
    //     callback(new Error('Please enter the correct user name'))
    //   } else {
    //     callback()
    //   }
    // }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error('密码不能小于5位数'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: '',
        rememberMe: true
      },
      loginRules: {
        username: [{ required: true, message: '账号不能为空', trigger: 'blur' }],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      dialogVisible: false,
      // 切换站点表单
      departForm: {},
      // 站点集合
      departOptions: []
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    },
    dialogVisible: {
      handler(val, oldVal) {
        if (!val) {
          this.$store.dispatch('user/resetToken').then(() => {
            // location.reload()
          })
        }
      }
    }
  },
  created() {
    window.addEventListener('beforeunload', e => {
      this.dialogVisible = false
    })
  },
  methods: {
    async cancel() {
      this.dialogVisible = false
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then((res) => {
            this.departOptions = res.departs
            // console.log('departOptions', this.departOptions)
            if (this.departOptions.length > 1) {
              this.dialogVisible = true
            } else {
              this.departForm.id = this.departOptions[0].id
              this.submitForm()
            }
            // this.dialogVisible = true
            // this.$router.push({ path: '/' })
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    submitForm() {
      getSite(this.departForm).then(response => {
        this.$router.push({ path: this.redirect || '/' })
      })
    },
    toggleLang(lang) {
      if (lang === 'zh') {
        localStorage.setItem('locale', 'zh')
        this.$i18n.locale = localStorage.getItem('locale')
        this.$message({
          message: '切换为中文',
          type: 'success'
        })
      } else if (lang === 'en') {
        localStorage.setItem('locale', 'en')
        this.$i18n.locale = localStorage.getItem('locale')
        this.$message({
          message: 'Switch to English',
          type: 'success'
        })
      } else if (lang === 'th') {
        localStorage.setItem('locale', 'th')
        this.$i18n.locale = localStorage.getItem('locale')
        this.$message({
          message: 'เปลี่ยนเป็นภาษาไทย',
          type: 'success'
        })
      }
      // location.reload() //  如有字段没有成功更改，可添加刷新页面步骤
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #333;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .login-form {
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;

      input {
        //background: transparent;
        border: 0;
        -webkit-appearance: none;
        border-radius: 0;
        padding: 12px 5px 12px 15px;
        color: #333;
        height: 47px;
        caret-color: $cursor;
        &:-webkit-autofill {
          box-shadow: 0 0 0px 1000px #fff inset !important;
          -webkit-text-fill-color: $cursor !important;
        }
      }
    }

    .el-form-item {
      border: 1px solid rgba(0, 0, 0, 0.1);
      //background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #333;
    }
  }

}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #fff;
$light_gray: #eee;

.login-container {
  position: relative;
  min-height: 100%;
  width: 100%;
  //display: flex;
  //align-items: center;
  //background-color: $bg;
  overflow: hidden;
  background-image: url('../../assets/images/blur-bg.jpg');
  background-size: cover;
  .login-form-wrap {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -60%);
    //margin: 0 auto;
    background: #fff;
    border-radius: 5px;
    width: 480px;
    //background-image: radial-gradient(70px at 240px -10px, transparent 100%, #fff 0px);
    .logo {
      position: absolute;
      top: -85px;
      left: 50%;
      transform: translateX(-50%);
      width: 140px;
      height: 140px;
      padding: 14px;
      border-radius: 50%;
      background: #fff;
      box-shadow: 0 0 30px rgba(0,0,0,.4);
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .right-menu-item{
      font-size: 20px;
      position: absolute;
      right: 10px;
      bottom: 50px;
    }
  }
  .login-form {
    position: relative;
    width: 480px;
    max-width: 100%;
    padding: 80px 35px 20px;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
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
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .depart-form{
    input {
      color: #333;
    }
  }
}
</style>
