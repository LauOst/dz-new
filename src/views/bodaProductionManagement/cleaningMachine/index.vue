<template>
  <div class="app-container">
    <!-- 头部筛选 -->
    <el-card shadow="never" class="card">
      <el-form ref="queryForm" :inline="true" :model="queryParams">
        <start-date v-model="queryParams.startTime" />
        <end-date v-model="queryParams.endTime" />
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
          <el-button v-hasPermi="['bodaProductionManagement:cleaningMachine:excel']" :loading="btnLoading" type="warning" icon="el-icon-download" size="small" @click="handleExport">导出</el-button>
        </el-form-item>
        <el-form-item class="top-right-btn">
          <span class="l-font-16">故障率：</span>
          <span class="font-bolder l-font-sm">{{ failureRate }}</span>
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
import StartDate from '@/components/StartDate'
import EndDate from '@/components/EndDate'
import { listCleaningMachine } from '@/api/bodaProductionManagement/cleaningMachine'
import { downloadCleaningMachine } from '@/api/excel/excel'
export default {
  name: 'CleaningMachine',
  components: { StartDate, EndDate },
  data() {
    return {
      column: [
        { type: 'index', index: this.indexMethod },
        { label: '总运行时长(分钟)', prop: 'allRunTimes', disableSort: true },
        { label: '总故障时长(分钟)', prop: 'allFaultTimes', disableSort: true },
        { label: '运行时长(分钟)', prop: 'runTimes', disableSort: true },
        { label: '故障时长(分钟)', prop: 'faultTimes', disableSort: true },
        { label: '记录时间', render: (h, scope) => {
          return (
            <span>{ scope.row.startTime }~{ scope.row.endTime }</span>
          )
        }, width: '380', disableSort: true },
        { label: '创建时间', prop: 'createTime', width: '180', disableSort: true }
      ],
      // 遮罩层(加载)
      loading: false,
      btnLoading: false,
      total: 0, // 列表总条数
      queryParams: { // 查询信息
        page: 1,
        limit: 20,
        orderNo: 1,
        lineNo: 1,
        startTime: undefined, // 开始时间
        endTime: undefined // 结束时间
      },
      failureRate: 0,
      list: [] // 表格数据
    }
  },

  mounted() {
    // [this.queryParams.startTime, this.queryParams.endTime] = this.getToday()
    this.getList()
  },
  methods: {
    // 格式化序号
    indexMethod(index) {
      return (this.queryParams.page - 1) * this.queryParams.limit + index + 1
    },
    // 获取清洗机故障列表
    getList() {
      this.loading = true
      listCleaningMachine(this.queryParams).then(res => {
        this.list = res.data.list
        this.failureRate = res.data.cate
        this.total = res.count || 0
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    /** 搜索按钮操作 */
    handleQuery() {
      // console.log('?', this.queryParams)
      this.$refs.queryForm.validate((valid) => {
        if (valid) {
          this.queryParams.page = 1
          this.getList()
        }
      })
    },
    /** 重置按钮操作 */
    async resetQuery() {
      await this.resetForm('queryForm')
      // [this.queryParams.startTime, this.queryParams.endTime] = this.getToday()
      await this.handleQuery()
    },
    // 导出按钮
    handleExport() {
      this.btnLoading = true
      downloadCleaningMachine(this.queryParams).then((res) => {
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
