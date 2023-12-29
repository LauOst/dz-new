<template>
  <div class="app-container">
    <!-- 头部筛选 -->
    <el-card shadow="never" class="card">
      <el-form ref="queryForm" :inline="true" :model="queryParams.model">
        <el-form-item prop="qrCode">
          <el-input v-model="queryParams.model.qrCode" clearable size="small" placeholder="工件二维码" style="width: 180px;" />
        </el-form-item>
        <el-form-item prop="cncNo10">
          <el-input v-model="queryParams.model.cncNo10" clearable size="small" placeholder="cnc10机床编号" style="width: 180px;" />
        </el-form-item>
        <el-form-item prop="cncNo20">
          <el-input v-model="queryParams.model.cncNo20" clearable size="small" placeholder="cnc20机床编号" style="width: 180px;" />
        </el-form-item>
        <el-form-item prop="director">
          <el-input v-model="queryParams.model.director" clearable size="small" placeholder="产线负责人" style="width: 180px;" />
        </el-form-item>
        <el-form-item prop="programCode10L">
          <el-input v-model="queryParams.model.programCode10L" clearable size="small" placeholder="cnc10左加工程序号" style="width: 180px;" />
        </el-form-item>
        <el-form-item prop="programCode10R">
          <el-input v-model="queryParams.model.programCode10R" clearable size="small" placeholder="cnc10右加工程序号" style="width: 180px;" />
        </el-form-item>
        <el-form-item prop="programCode20">
          <el-input v-model="queryParams.model.programCode20L" clearable size="small" placeholder="cnc20左加工程序号" style="width: 180px;" />
        </el-form-item>
        <el-form-item prop="programCode20">
          <el-input v-model="queryParams.model.programCode20R" clearable size="small" placeholder="cnc20右加工程序号" style="width: 180px;" />
        </el-form-item>
        <el-form-item>
          <start-date v-model="queryParams.model.startTime" />
          <end-date v-model="queryParams.model.endTime" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
          <el-button v-hasPermi="['trace:rough:excel']" :loading="btnLoading" type="warning" icon="el-icon-download" size="small" @click="handleExport">导出</el-button>
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
import { listTraceRough } from '@/api/trace/roughCar'
import { downloadRraceRough } from '@/api/excel/excel'

export default {
  name: 'Rough',
  data() {
    return {
      queryParams: {
        type: '',
        field: '',
        page: 1,
        limit: 20,
        model: {
          cncNo10: '',
          cncNo20: '',
          director: '',
          endTime: '',
          programCode10L: '',
          programCode10R: '',
          programCode20L: '',
          programCode20R: '',
          qrCode: '',
          startTime: ''
        }
      },
      column: [
        { type: 'index', index: this.indexMethod, fixed: true },
        { label: '工件二维码', prop: 'afterCode', minWidth: 120 },
        { label: 'OP10机床编号', prop: 'cncNo10', minWidth: 140 },
        { label: 'OP10开始加工时间', prop: 'startTime10', width: 180 },
        { label: 'OP10加工时长', prop: 'processTime10', minWidth: 140 },
        { label: 'OP10左加工程序号', prop: 'programCode10L', minWidth: 170 },
        { label: 'OP10右加工程序号', prop: 'programCode10R', minWidth: 170 },
        { label: 'OP20开始加工时间', prop: 'startTime20', width: 180 },
        { label: 'OP20加工时长', prop: 'processTime20', minWidth: 140 },
        { label: 'OP20左加工程序号', prop: 'programCode20L', minWidth: 170 },
        { label: 'OP20右加工程序号', prop: 'programCode20R', minWidth: 170 },
        { label: '中心孔直径检测数据', prop: 'centreHole', width: 180 },
        { label: '合格情况', prop: 'qualified', minWidth: 120 },
        { label: '产线负责人', prop: 'director', minWidth: 120 },
        { label: '产品型号和规则', prop: 'productCode', minWidth: 160 }
      ],
      loading: false,
      btnLoading: false,
      total: 0, // 列表总条数
      dateRange: [], // 时间范围
      list: [] // 表格数据
    }
  },
  mounted() {
    [this.queryParams.model.startTime, this.queryParams.model.endTime] = this.getMonthWeeks()
    this.getList()
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
    getList() {
      this.loading = true
      listTraceRough(this.queryParams).then(res => {
        const { list, total } = res.data
        this.list = list
        this.total = total || 0
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
    async resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    handleExport() {
      const newData = JSON.parse(JSON.stringify(this.queryParams))
      newData.page = 1
      newData.limit = -1
      this.btnLoading = true
      downloadRraceRough(newData).then((res) => {
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
