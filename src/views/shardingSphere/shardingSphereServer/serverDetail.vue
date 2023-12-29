<template>
  <div class="app-container">
    <!-- 服务器维度表格信息 -->
    <el-page-header title="详情信息" :content="`服务器IP:${serverIp}`" @back="goBack" />
    <div class="table-wrapper">
      <dz-table
        v-loading="loading"
        :column="column"
        :data="list"
        @pagination="handleServerDetail(serverIp)"
      />
    </div>
  </div>
</template>

<script>
import {
  getServersByServerIp, // 服务器详情
  ServersDetailDisable, // 服务器维度详情失效
  ServersDetailEnable, // 服务器维度详情生效
  ServersDetailDelete, // 服务器维度详情删除
  ServersDetailShutdown // 服务器维度详情终止
} from '@/api/shardingSphere/shardingSphereServer'

export default {
  name: 'ShardingSphereServerDetail',
  data() {
    return {
      column: [
        { label: '作业名称', prop: 'jobName' },
        { label: '运行实例数', prop: 'instanceCount' },
        { label: '状态', render: (h, scope) => {
          return (
            <el-button-group>
              <el-tag size='mini' type={this.statusColor[scope.row.status]} >{ this.statusFormat(scope.row.status) }</el-tag>
            </el-button-group>
          )
        } },
        { label: '操作', render: (h, scope) => {
          return (
            <el-button-group>
              {scope.row.instanceCount > 0 && scope.row.status === 'DISABLED' && (<el-button type='success' size='mini' onClick={() => { this.handleEnable(scope.row) }}>生效</el-button>)}
              {scope.row.instanceCount > 0 && scope.row.status === 'OK' && (<el-button type='warning' size='mini' onClick={() => { this.handleDisable(scope.row) }}>失效</el-button>)}
              {scope.row.instanceCount > 0 && (<el-button type='danger' size='mini' onClick={() => { this.handleShutdown(scope.row) }}>终止</el-button>)}
              {!scope.row.instanceCount && (<el-button type='danger' size='mini' onClick={() => { this.handleDelete(scope.row) }}>删除</el-button>)}
            </el-button-group>
          )
        }, width: 240, fixed: 'right', align: 'left', headerAlign: 'center' }
      ],
      statusColor: { // 状态信息
        OK: 'primary',
        DISABLED: 'warning',
        CRASHED: 'info',
        PENDING: 'info',
        SHARDING_FLAG: 'success'
      },
      loading: false, // 遮罩层(加载)
      list: [], // 表格数据
      serverIp: '' // 服务器IP
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.serverIp = to.query.serverIp
      vm.handleServerDetail(vm.serverIp)
    })
  },
  mounted() {
    // this.serverIp = this.$route.query.serverIp
    // this.handleServerDetail(this.serverIp)
  },
  methods: {
    handleServerDetail(serverIp) { // 根据服务器IP获取详情
      this.loading = true
      getServersByServerIp(serverIp).then(res => {
        this.list = res.data
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    handleEnable(row) { // 生效
      ServersDetailEnable(this.serverIp, row.jobName).then(res => {
        this.handleServerDetail(this.serverIp)
        this.msgSuccess('操作成功')
      })
    },
    handleDisable(row) { // 失效
      ServersDetailDisable(this.serverIp, row.jobName).then(res => {
        this.handleServerDetail(this.serverIp)
        this.msgSuccess('操作成功')
      })
    },
    handleShutdown(row) { // 终止
      this.$confirm('是否确认终止作业名称为"' + row.jobName + '"的数据项', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return ServersDetailShutdown(this.serverIp, row.jobName)
      }).then(() => {
        this.handleServerDetail(this.serverIp)
        this.msgSuccess('终止成功')
      }).catch(() => {})
    },
    handleDelete(row) { // 删除
      this.$confirm('是否确认删除作业名称为"' + row.jobName + '"的数据项', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return ServersDetailDelete(this.serverIp, row.jobName)
      }).then(() => {
        this.handleServerDetail(this.serverIp)
        this.msgSuccess('删除成功')
      }).catch(() => {})
    },
    statusFormat(val) { // 状态信息
      const obj = {
        OK: '已启用',
        DISABLED: '已失效',
        CRASHED: '已下线',
        PENDING: '等待运行',
        SHARDING_FLAG: '分片待调整'
      }
      return obj[val]
    },
    goBack() { // 返回
      this.$router.back(-1)
    }
  }
}
</script>
<style lang="scss" scoped>
.table-wrapper{
  padding: 20px 0;
}

// pageHeader页头组件页头样式
::v-deep .el-page-header__left{
  position: absolute;
  right: 0;
}

// pageHeader页头组件内容样式
::v-deep .el-page-header__content{
  font-size: 12px;
  color: #999;
}

</style>
