<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <search style="padding: 0 20px" />
      <Notify v-if="useOrgCode.indexOf('xiaozhou') !== -1" style="padding-right:20px" />
      <!-- <el-dropdown
        class="toggle-lang"
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
      <!-- 切换站点 -->
      <el-dropdown v-if="userIdentity === 1" class="depart-container" trigger="click" @visible-change="aepartChange">
        <div class="avatar-wrapper">
          <span style="color: #fff;cursor: pointer">站点：{{ departName }}</span>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <el-dropdown-item v-for="item in siteList" :key="item.id">
            <span style="display:block;" @click="chooseSite(item.id, item.departName)">{{ item.departName }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <!--          <img :src="avatar" class="user-avatar">-->
          <img src="../../assets/images/logo.png" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/user/profile">
            <el-dropdown-item>
              个人中心
            </el-dropdown-item>
          </router-link>
          <!--          <el-dropdown-item v-hasPermi="['layout:update']">-->
          <el-dropdown-item>
            <span style="display:block;" @click="handleUpdatePassword">更新锁屏密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import Notify from '@/components/Notify'
import Search from '@/components/HeaderSearch'
import { switchSite } from '@/api/system/depart'
import { getSite, updatePassword } from '@/api/user'
import router, { resetRouter } from '@/router'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    Notify,
    Search
  },
  inject: ['reload'],
  data() {
    return {
      siteList: []
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'departName',
      'userIdentity',
      'useOrgCode'
    ])
  },
  mounted() {
    this.getSiteList()
  },
  methods: {
    // 点击下拉框e
    aepartChange(e) {
      if (e === true) {
        this.getSiteList()
      }
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      this.$confirm('确定注销并退出系统吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('user/logout').then(() => {
          location.href = '/home'
        })
      })
    },
    handleUpdatePassword() {
      this.$prompt('请输入新密码', '更新锁屏密码', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        const md5Passwird = this.$md5(value)
        updatePassword({ lockPassword: md5Passwird }).then(response => {
          this.msgSuccess('修改成功，新密码是：' + value)
        })
      }).catch(() => {})
    },
    // async logout() {
    //   await this.$store.dispatch('user/logout')
    //   this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    // },
    // 获取可切换站点
    getSiteList() {
      switchSite({ isAll: false }).then(res => {
        this.siteList = res.data
      })
    },
    // 切换站点
    chooseSite(id, name) {
      const _this = this
      this.$confirm('确定切换到"' + name + '"站点?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async function() {
        const res = await getSite({ id })
        if (res.code === 0) {
          _this.$message.success('切换成功')
        }
        _this.$router.push({ path: _this.redirect || '/' }) // 跳转到首页，否则会保留当前页面而且如果没有对应权限刷新会出现404
        /**
         * 这部分逻辑待核对
         */
        // 重新渲染路由
        const { roles } = await _this.$store.dispatch('user/getInfo')
        const accessRoutes = await _this.$store.dispatch('permission/generateRoutes', roles)
        // 添加新的路由之前清空之前的路由信息
        resetRouter()
        // 动态添加可访问路由表
        router.addRoutes(accessRoutes)
        _this.$store.dispatch('tagsView/delAllViews', _this.$route) // 关闭所有tagviews
        _this.$store.dispatch('public/orderList')
        _this.reload() // 无痕刷新
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
<style lang="scss" scoped>
.navbar {
  height: 60px;
  overflow: hidden;
  position: relative;
  background: #20222A;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
  .hamburger-container {
    line-height: 56px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container,.notify-container {
    float: left;
  }
  //.site-wrapper {
  //  .avatar-container{
  //    color: #fff;
  //  }
  //}
  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    display: flex;
    -js-display: flex;
    align-items: center;
    &:focus {
      outline: none;
    }

    .toggle-lang{
      font-size: 20px;
      color: #fff;
      margin-right: 20px;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }
    .depart-container {
      margin-right: 30px;
      color: #fff;
    }

    .avatar-container {
      margin-right: 30px;
      color: #fff;
      .avatar-wrapper {
        display: flex;
        -js-display: flex;
        align-items: center;
        //margin-top: 1px;
        position: relative;
        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 50%;
          transform: translateY(-50%);
          //font-size: 12px;
        }
      }
    }
  }
  .site-wrapper{
    position: absolute;
    right: 100px;
    top: 16px;
  }
}
</style>
