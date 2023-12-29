<template>
  <div class="notify">
    <el-popover
      ref="popoverRef"
      placement="bottom"
      :width="350"
      trigger="click"
    >
      <el-tabs v-model="activeName" class="demo-tabs" stretch>
        <el-tab-pane v-for="(item, index) in paneList" :key="index" :name="item.name">
          <template #label>
            {{ item.name }}
          </template>
          <el-scrollbar height="400px">
            <NotifyList :list="totalList" @handleTo="handleTo" />
          </el-scrollbar>
        </el-tab-pane>
      </el-tabs>
      <el-badge slot="reference" :value="badgeValue" :max="10" :hidden="badgeValue === 0">
        <el-tooltip effect="dark" content="消息通知" placement="bottom">
          <svg-icon class-name="search-icon" icon-class="msgxx" />
        </el-tooltip>
      </el-badge>
    </el-popover>
  </div>
</template>

<script>
import NotifyList from '@/components/Notify/NotifyList'
import { mapGetters } from 'vuex'
export default {
  components: { NotifyList },
  data() {
    return {
      paneList: [
        {
          name: '通知',
          type: 'primary'
        }
      ],
      activeName: '通知',
      timer: null
    }
  },

  computed: {
    ...mapGetters([
      'totalList'
    ]),
    badgeValue() {
      return this.totalList.length
    }
  },
  created() {
    this.$store.dispatch('navbar/merge')
    this.createSetInterval()
  },
  destroyed() {
    this.stopSetInterval()
  },
  methods: {
    // 开启轮询  如果存在则先销毁定时器后重新开启
    createSetInterval() {
      this.stopSetInterval()
      const _this = this
      this.timer = setInterval(() => {
        _this.$store.dispatch('navbar/merge')
      }, 5000)
    },
    // 关闭轮询
    stopSetInterval() {
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }
    },
    handleTo(e) {
      console.log('e', e)
      if (e === '1' || e === '4') {
        this.$router.push({ path: '/baseConfig/regularInspection' })
        this.$refs.popoverRef.doClose()
      } else if (e === '2') {
        this.$router.push({ path: '/tool/toolMsg' })
        this.$refs.popoverRef.doClose()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.notify {
  font-size: 0 !important;
}
.search-icon {
  cursor: pointer;
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  vertical-align: middle !important;
}
</style>
<style>
.el-badge__content.is-fixed{
  top: 12px !important;
}
</style>
