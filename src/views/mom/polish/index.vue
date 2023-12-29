<template>
  <div class="app-container">
    <!-- 头部筛选 -->
    <el-card shadow="never" class="card">
      <el-form ref="queryForm" :inline="true" :model="queryParams">
        <el-form-item prop="lineNo">
          <el-select v-model="queryParams.lineNo" size="small" style="width: 180px;" placeholder="产线名称">
            <el-option label="全部" :value="''" />
            <el-option v-for="(item,index) in lineLists" :key="index" :label="item.lineName" :value="item.lineNo" />
          </el-select>
        </el-form-item>
        <el-form-item prop="orderNo">
          <el-input
            v-model="queryParams.orderNo"
            v-support
            size="small"
            clearable
            placeholder="生产任务订单号"
            style="width: 180px;"
          />
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
import { appointList } from '@/api/mom/mom'
import { getlineSelect } from '@/api/commens'

export default {
  name: 'Anren',
  data() {
    return {
      total: 0,
      list: [],
      lineLists: [],
      loading: false,
      // 分页搜索参数
      queryParams: {
        page: 1,
        limit: 20,
        lineNo: undefined,
        orderNo: undefined,
        field: undefined,
        type: undefined
      },
      column: [
        { type: 'index', index: this.indexMethod, fixed: true },
        { label: '产线名称', prop: 'lineName', width: 120 },
        { label: '产线编号', prop: 'productionLine', width: 120 },
        { label: '生产任务订单号', prop: 'wiporderno', width: 160 },
        { label: '生产任务订单类型', prop: 'wipOrderType', width: 160, formatter: this.wipOrderTypeFormat },
        { label: '产品名称', prop: 'productName', width: 120 },
        { label: '产品对接码', prop: 'dockingCode', width: 140 },
        { label: '产品物料号', prop: 'productNo', width: 200 },
        { label: '工序名称', prop: 'workName', width: 120 },
        { label: '计划生产数量', prop: 'quantity', width: 140 },
        { label: '实际生产数量', prop: 'orderOutput', width: 140 },
        { label: '计划开始时间', prop: 'scheduledStartDate', width: 140 },
        { label: '实际开始时间', prop: 'realityStartDate', width: 140 },
        { label: '计划结束时间', prop: 'scheduledCompleteDate', width: 140 },
        { label: '实际结束时间', prop: 'realityCompleteDate', width: 140 },
        { label: '订单状态', prop: 'progressStatus', width: 200, formatter: this.ProgressStatusFormat }
      ]
    }
  },
  mounted() {
    this.getList()
    this.handleLines()
  },
  methods: {
    // 格式化序号
    indexMethod(index) {
      return (this.queryParams.page - 1) * this.queryParams.limit + index + 1
    },
    sortChange(column) {
      this.$mySort(this.queryParams, column, this.getList)
    },
    getList() {
      appointList(this.queryParams).then(res => {
        this.list = res.data
        this.total = res.count || 0
        this.loading = false
      })
    },
    // 获取产线列表
    handleLines() {
      getlineSelect().then(res => {
        this.lineLists = res.data
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
    },
    // 过滤设备类型
    ProgressStatusFormat(row) {
      const obj = {
        '110': '已下达',
        '120': '进行中',
        '130': '已完工',
        '140': '已删除',
        '150': '强制关闭'
      }
      return obj[row.progressStatus]
    },
    wipOrderTypeFormat(row) {
      const obj = {
        '1': '正常订单',
        '2': '返工返修订单'
      }
      return obj[row.wipOrderType]
    }
  }
}
</script>

<style scoped>

</style>
