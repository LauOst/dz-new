<template>
  <div class="app-container">
    <!-- 头部筛选 -->
    <el-card shadow="never" class="card">
      <el-form ref="queryForm" :inline="true" :model="queryParams">
        <el-form-item prop="jobName">
          <el-input v-model="queryParams.jobName" v-support size="small" clearable placeholder="请输入作业名称" style="width: 180px;" />
        </el-form-item>
        <el-form-item prop="ip">
          <el-input v-model="queryParams.ip" v-support size="small" clearable placeholder="请输入服务器IP" style="width: 180px;" />
        </el-form-item>
        <el-form-item prop="isSuccess">
          <el-select v-model="queryParams.isSuccess" v-support size="small" style="width: 180px;" placeholder="请选择执行结果">
            <el-option v-for="(item,index) in resultList" :key="index" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 表格信息 -->
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
import { getTrack } from '@/api/shardingSphere/shardingSphere'

export default {
  name: 'ShardingSphereTrack',
  data() {
    return {
      column: [
        { type: 'index', index: this.indexMethod, fixed: true },
        { label: 'ID', prop: 'id' },
        { label: '作业名称', prop: 'jobName' },
        { label: '服务器IP', prop: 'ip' },
        { label: '分片项', prop: 'shardingItem' },
        { label: '执行结果', render: (h, scope) => {
          return (
            <el-tag size='small' type={ scope.row.isSuccess === 1 ? 'success' : 'danger' }>{ scope.row.isSuccess === 1 ? '成功' : '失败' }</el-tag>
          )
        } },
        // { label: '失败原因', prop: 'failureCause' },
        { label: '失败原因', render: (h, scope) => {
          return (
            <span>{scope.row.failureCause}</span>
          )
        } },
        { label: '开始时间', prop: 'startTime' },
        { label: '完成时间', prop: 'endTime' }
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
      list: [], // 表格数据
      resultList: [{ name: '失败', id: 0 }, { name: '成功', id: 1 }]
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    // 排序
    sortChange(column) {
      this.$mySort(this.queryParams, column, this.getList)
    },
    // 格式化序号
    indexMethod(index) {
      return (this.queryParams.page - 1) * this.queryParams.limit + index + 1
    },
    // 获取机器人列表
    getList() {
      this.loading = true
      getTrack(this.queryParams).then(res => {
        this.list = res.data
        this.total = res.count || 0
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1
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

<style >
.el-tooltip__popper {
  max-width: 50%;
}
</style>
