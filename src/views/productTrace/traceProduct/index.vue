<template>
  <div class="app-container">
    <el-card shadow="never" class="card">
      <el-form ref="queryForm" :model="queryParams.model" :inline="true">
        <el-form-item prop="lineId">
          <el-select v-model="queryParams.model.lineId" size="small" style="width: 180px;" placeholder="产线名称">
            <el-option label="全部" :value="''" />
            <el-option v-for="(item,index) in lineList" :key="index" :label="item.lineName" :value="item.lineId" />
          </el-select>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            v-model="queryParams.model.stationName"
            placeholder="工位名称"
            clearable
            size="small"
            style="width: 180px"
          />
        </el-form-item>
        <el-form-item prop="qrCode">
          <el-input
            v-model="queryParams.model.qrCode"
            placeholder="二维码"
            clearable
            size="small"
            style="width: 180px"
          />
        </el-form-item>
        <el-form-item>
          <start-date v-model="queryParams.model.startTime" />
          <end-date v-model="queryParams.model.endTime" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
          <el-button v-hasPermi="['productTrace:traceProduct:excel']" :loading="btnLoading" type="warning" icon="el-icon-download" size="small" @click="handleExport">导出</el-button>
        </el-form-item>
      </el-form>
    </el-card>
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
import { listTraceProduct } from '@/api/productTrace/traceProduct'
import { downloadTraceProduct } from '@/api/excel/excel'
import { getlineSelect } from '@/api/commens'

export default {
  name: 'TraceProduct',
  data() {
    return {
      column: [
        { type: 'index', index: this.indexMethod },
        { label: '产线名称', prop: 'lineName' },
        { label: '工位名称', prop: 'stationName' },
        { label: '节拍', prop: 'taktTime' },
        { label: '二维码', prop: 'qrCode' },
        { label: '生产开始时间', prop: 'startTime' },
        { label: '生产完成时间', prop: 'completeTime' }
      ],
      total: 0,
      loading: false,
      btnLoading: false,
      lineList: [], // 产线列表
      list: [],
      queryParams: { // 查询信息
        page: 1,
        limit: 20,
        orderNo: undefined, // 订单编号
        field: undefined,
        type: undefined,
        model: {
          stationName: undefined,
          qrCode: undefined,
          lineId: undefined,
          endTime: '',
          startTime: ''
        }
      }
    }
  },
  mounted() {
    [this.queryParams.model.startTime, this.queryParams.model.endTime] = this.getMonthWeeks()
    this.getList()
    this.handleLine()
  },
  methods: {
    // 格式化序号
    indexMethod(index) {
      return (this.queryParams.page - 1) * this.queryParams.limit + index + 1
    },
    // 排序
    sortChange(column) {
      this.$mySort(this.queryParams, column, this.getList)
    },
    // 获取产线列表
    handleLine() {
      getlineSelect().then(res => {
        this.lineList = res.data
      }).catch(() => {
        this.loading = false
      })
    },
    getList() {
      this.loading = true
      listTraceProduct(this.queryParams).then(
        response => {
          this.list = response.data.list
          this.total = response.data.total
          this.loading = false
        }
      ).catch(() => {
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
      this.resetForm('queryForm');
      [this.queryParams.model.startTime, this.queryParams.model.endTime] = this.getMonthWeeks()
      this.handleQuery()
    },
    // 导出按钮
    handleExport() {
      this.btnLoading = true
      const obj = JSON.parse(JSON.stringify(this.queryParams))
      obj.limit = 0
      downloadTraceProduct(obj).then((res) => {
        this.btnLoading = false
        if (!res.data) return
        this.$downloadFunc(res)
      }).catch((err) => {
        console.log('err', err)
        this.btnLoading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
