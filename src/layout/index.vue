<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <sidebar class="sidebar-container" />
    <div class="main-container">
      <div :class="{'fixed-header':fixedHeader}">
        <navbar />
        <tags-view />
      </div>
      <app-main />
    </div>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
    >
      <el-form ref="formData" :model="formData" :rules="addFormRules" label-width="100px" style="width: 480px;">
        <el-form-item label="条形编码" prop="compIdSep">
          <el-input v-model="formData.compIdSep" clearable placeholder="请输入条形编码" disabled />
        </el-form-item>
        <el-form-item label="抽检结果" prop="checkResult">
          <el-input v-model="formData.checkResult" clearable placeholder="请输入抽检结果" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <!--        <el-button @click="dialogVisible = false">取 消</el-button>-->
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain, TagsView } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { mapState } from 'vuex'
import { updateCheckResult } from '@/api/commens'

export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
    TagsView
  },
  mixins: [ResizeMixin],
  data() {
    return {
      dialogVisible: false,
      formData: {},
      addFormRules: { // 表单验证
        checkResult: [
          { required: true, message: '请输入抽检结果', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar,
      device: state => state.app.device,
      fixedHeader: state => state.settings.fixedHeader
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  created() {
    // this.$socket.emit('getPopUpNotification')
  },
  sockets: {
    // 连接成功
    connect() {
      console.log('socket连接成功')
    },
    getPopUpNotification(res) {
      const result = res
      console.log('getPopUpNotification', result.dialogVisible)
      if (result) {
        this.reset()
        this.formData.compIdSep = result.compIdSep
        this.dialogVisible = result.dialogVisible
      }
    },
    // 断开链接回调
    disconnect() {
      // this.$store.commit('SET_Sockets', false)
      console.log('socket断开')
    },
    reconnect() {
      // 自动执行，直到链接成功
      console.log('重新连接')
      this.$socket.emit('getPopUpNotification')
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    },
    confirm() {
      this.$refs['formData'].validate((valid) => {
        if (valid) {
          updateCheckResult(this.formData).then(res => {
            this.$message.success(res.msg)
            this.dialogVisible = false
          })
        }
      })
    },
    // 表单重置
    reset() {
      this.formData = {
        compIdSep: undefined,
        checkResult: undefined
      }
      this.resetForm('formData')
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  @import "~@/styles/variables.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px)
  }

  .mobile .fixed-header {
    width: 100%;
  }
</style>
