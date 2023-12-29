<template>
  <div class="app-container">
    <!-- 头部筛选 -->
    <el-card shadow="never" class="card">
      <div style="float: right;">
        <el-button type="info" icon="el-icon-arrow-left" size="small" @click="goBack">
          Back
        </el-button>
      </div>

      <div style="clear: both" />
    </el-card>
    <!-- 表格信息 -->
    <dz-table
      v-loading="loading"
      :column="column"
      :data="list"
      @pagination="getList"
    />

  </div>
</template>

<script>
import { disableDetail, enableDetail, getJobDetail } from '@/api/shardingSphere/shardingSphereJob'

export default {
  name: 'ShardingSphereJobDetail',
  data() {
    return {
      column: [
        { label: '分片项', prop: 'item' },
        { label: '服务器IP', prop: 'serverIp' },
        { label: '进程ID', prop: 'instanceId' },
        { label: '状态', render: (h, scope) => {
          return (
            <el-tag size='small' type={this.statusColors(scope.row.status)}>{ this.statusText(scope.row.status)}</el-tag>
          )
        } },
        { label: '支持自动失效转移', prop: 'failover' },
        { label: '操作', render: (h, scope) => {
          return (
            <el-button-group>
              {scope.row.status === 'DISABLED' && (<el-button type='success' size='mini' onClick={() => { this.handleEnable(scope.row) }}>生效</el-button>)}
              {scope.row.status === 'PENDING' && (<el-button type='warning' size='mini' onClick={() => { this.handleDisable(scope.row) }} >失效</el-button>)}
            </el-button-group>
          )
        }, width: 100, fixed: 'right' }
      ],
      // 遮罩层(加载)
      loading: false,
      queryParams: { // 查询信息
        jobName: undefined // 订单编号
      },
      list: [] // 表格数据
    }
  },
  mounted() {
    // this.getList()
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.queryParams.jobName = to.query.jobName
      vm.getList()
    })
  },
  methods: {
    // 获取机器人列表
    getList() {
      this.loading = true
      getJobDetail(this.queryParams).then(res => {
        this.list = res.data
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    statusColors(status) {
      const obj = {
        OK: 'success',
        DISABLED: 'warning',
        CRASHED: 'info',
        PENDING: 'info',
        SHARDING_FLAG: 'primary'
      }
      return obj[status]
    },
    statusText(status) {
      const obj = {
        OK: '正常',
        DISABLED: '已失效',
        CRASHED: '已下线',
        PENDING: '等待运行',
        RUNNING: '正在运行',
        SHARDING_FLAG: '分片待调整'
      }
      return obj[status]
    },
    // 生效
    handleEnable(row) {
      const params = { jobName: this.queryParams.jobName, item: row.item }
      enableDetail(params).then(res => {
        this.$notify({
          title: '提示',
          message: '操作成功',
          type: 'success'
        })
        this.getList()
      })
    },
    // 失效
    handleDisable(row) {
      const params = { jobName: this.queryParams.jobName, item: row.item }
      disableDetail(params).then(res => {
        this.$notify({
          title: '提示',
          message: '操作成功',
          type: 'success'
        })
        this.getList()
      })
    },
    goBack() {
      this.$router.push({ name: 'ShardingSphereJob' })
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    }
  }
}
</script>

<style>

</style>
