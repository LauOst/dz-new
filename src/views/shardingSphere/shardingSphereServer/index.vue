<template>
  <div class="app-container">
    <!-- 服务器维度表格信息 -->
    <dz-table
      v-loading="loading"
      :column="column"
      :data="list"
      :total="total"
      pagination
      :page.sync="queryParams.page"
      :limit.sync="queryParams.limit"
      @pagination="getList"
      @sortChange="sortChange"
    />
  </div>
</template>

<script>
import { getAllServers, // 获取服务器列表
  getAllServersCount, // 获取服务器总条数
  ServersDisable, // 服务器维度失效
  ServersEnable, // 服务器维度生效
  ServersDelete, // 服务器维度删除
  ServersShutdown // 服务器维度终止
} from '@/api/shardingSphere/shardingSphereServer'

export default {
  name: 'ShardingSphereServer',
  data() {
    return {
      column: [
        { type: 'index', index: this.indexMethod, fixed: true },
        { label: '服务器IP', prop: 'serverIp' },
        { label: '运行实例数', prop: 'instancesNum' },
        { label: '作业总数', prop: 'jobsNum' },
        { label: '禁用作业数', prop: 'disabledJobsNum' },
        { label: '操作', render: (h, scope) => {
          return (
            <el-button-group>
              {scope.row.instancesNum > 0 && (<el-button type='info' size='mini' onClick={() => { this.handleServerDetail(scope.row) }}>详情</el-button>)}
              {scope.row.instancesNum > 0 && scope.row.disabledJobsNum > 0 && (<el-button type='success' size='mini' onClick={() => { this.handleEnable(scope.row) }}>生效</el-button>)}
              {scope.row.disabledJobsNum === 0 && scope.row.instancesNum > 0 && (<el-button type='warning' size='mini' onClick={() => { this.handleDisable(scope.row) }}>失效</el-button>)}
              {scope.row.instancesNum > 0 && (<el-button type='danger' size='mini' onClick={() => { this.handleShutdown(scope.row) }}>终止</el-button>)}
              {scope.row.instancesNum === 0 && (<el-button type='danger' size='mini' onClick={() => { this.handleDelete(scope.row) }}>删除</el-button>)}
            </el-button-group>
          )
        }, width: 300, fixed: 'right', align: 'left', headerAlign: 'center' }
      ],
      // 遮罩层(加载)
      loading: false,
      total: 0, // 列表总条数
      queryParams: { // 查询信息
        page: 1,
        limit: 20,
        jobName: undefined, // 产线id
        ip: undefined, // 产线id
        isSuccess: undefined // 订单编号
      },
      list: [] // 表格数据
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    sortChange(column) { // 排序
      this.$mySort(this.queryParams, column, this.getList)
    },
    indexMethod(index) { // 格式化序号
      return (this.queryParams.page - 1) * this.queryParams.limit + index + 1
    },
    getList() { // 获取服务器列表
      this.loading = true
      getAllServers(this.queryParams).then(res => {
        this.list = res.data
        this.loading = false
        this.handleServerCount() // 获取列表总条数
      }).catch(() => {
        this.loading = false
      })
    },
    handleServerCount() { // 列表总条数
      getAllServersCount().then(res => {
        this.total = res.data || 0
      }).catch(() => { })
    },
    handleServerDetail(row) { // 详情
      this.$router.push({ name: 'ShardingSphereServerDetail', query: { serverIp: row.serverIp }})
    },
    handleEnable(row) { // 生效
      ServersEnable(row.serverIp).then(res => {
        this.getList()
        this.msgSuccess('操作成功')
      })
    },
    handleDisable(row) { // 失效
      ServersDisable(row.serverIp).then(res => {
        this.getList()
        this.msgSuccess('操作成功')
      })
    },
    handleShutdown(row) { // 终止
      this.$confirm('是否确认终止IP为"' + row.serverIp + '"的数据项', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return ServersShutdown(row.serverIp)
      }).then(() => {
        this.getList()
        this.msgSuccess('终止成功')
      }).catch(() => {})
    },
    handleDelete(row) { // 删除
      this.$confirm('是否确认删除IP为"' + row.serverIp + '"的数据项', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return ServersDelete(row.serverIp)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(() => {})
    }
  }
}
</script>
