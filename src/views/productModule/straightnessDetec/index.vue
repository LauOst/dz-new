<template>
  <div class="app-container">
    <!-- 头部筛选 -->
    <el-card shadow="never" class="card">
      <el-form ref="queryForm" :inline="true" :model="queryParams">
        <el-form-item prop="productNo">
          <el-input v-model="queryParams.productNo" clearable size="small" placeholder="工件名称" style="width: 180px;" />
        </el-form-item>
        <el-form-item prop="qrCode">
          <el-input v-model="queryParams.qrCode" clearable size="small" placeholder="工件二维码" style="width: 180px;" />
        </el-form-item>
        <el-form-item prop="detectionResult">
          <el-input v-model="queryParams.detectionResult" clearable size="small" placeholder="结果" style="width: 180px;" />
        </el-form-item>
        <el-form-item>
          <start-date v-model="queryParams.startTime" :type="'datetime'" :value-format="'yyyy-MM-dd HH:mm:ss'" />
          <end-date v-model="queryParams.endTime" :type="'datetime'" :value-format="'yyyy-MM-dd HH:mm:ss'" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
          <el-button v-hasPermi="['productModule:straightnessDetec:excel']" :loading="btnLoading" type="warning" icon="el-icon-download" size="small" @click="handleExport">导出</el-button>
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
    />
  </div>
</template>

<script>
import { listDetection, downloadDetection } from '@/api/productModule/straightnessDetec'

export default {
  name: 'StraightnessDetec',
  data() {
    return {
      column: [
        { type: 'index', index: this.indexMethod },
        { label: '工件名称', prop: 'productNo', disableSort: true },
        { label: '工件二维码', prop: 'qrCode', disableSort: true },
        { label: '承载力', prop: 'detection01', disableSort: true },
        { label: '直线度', prop: 'detection02', disableSort: true },
        { label: '结果', prop: 'detectionResult', disableSort: true },
        { label: '检测时间', prop: 'createTime', disableSort: true }
      ],
      loading: false,
      btnLoading: false,
      total: 0, // 列表总条数
      // 查询信息
      queryParams: {
        page: 1,
        limit: 20,
        field: undefined,
        type: undefined,
        detectionNo: '1',
        productNo: undefined,
        qrcode: undefined,
        detectionResult: undefined,
        startTime: undefined,
        endTime: undefined
      },
      list: []
    }
  },
  mounted() {
    [this.queryParams.startTime, this.queryParams.endTime] = this.getTodayTimeEnd()
    this.getList()
  },
  methods: {
    // 格式化序号
    indexMethod(index) {
      return (this.queryParams.page - 1) * this.queryParams.limit + index + 1
    },
    getList() {
      this.loading = true
      listDetection(this.queryParams).then(res => {
        this.list = res.data
        this.total = res.count || 0
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 导出按钮
    handleExport() {
      const newData = JSON.parse(JSON.stringify(this.queryParams))
      newData.page = 1
      newData.limit = -1
      this.btnLoading = true
      downloadDetection(newData).then((res) => {
        this.btnLoading = false
        if (!res.data) return
        this.$downloadFunc(res)
      }).catch((err) => {
        console.log('err', err)
        this.btnLoading = false
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
      [this.queryParams.startTime, this.queryParams.endTime] = this.getTodayTimeEnd()
      this.handleQuery()
    }
  }
}
</script>

<style scoped>

</style>
