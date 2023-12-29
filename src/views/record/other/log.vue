<template>
  <div class="app-container">
    <!-- 头部筛选 -->
    <el-card shadow="never" class="card">
      <el-form ref="queryForm" :inline="true" :model="queryParams">
        <el-form-item prop="businessType">
          <el-select v-model="queryParams.businessType" v-support size="small" style="width: 180px;" placeholder="业务类型">
            <el-option v-for="(item,index) in businessTypeList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item prop="state">
          <!--          <el-input v-model="queryParams.state" clearable size="small" placeholder="处理结果" style="width: 180px;" />-->
          <el-select v-model="queryParams.state" size="small" style="width: 180px;" placeholder="处理结果">
            <el-option v-for="(item,index) in stateList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item prop="throwMsg">
          <el-input v-model="queryParams.throwMsg" clearable size="small" placeholder="响应内容" style="width: 180px;" />
        </el-form-item>

        <el-form-item>
          <!--          <start-date v-model="queryParams.startTime" />-->
          <start-date v-model="queryParams.startTime" :type="'datetime'" placeholder="开始时间" :value-format="'yyyy-MM-dd HH:mm:ss'" width="200px" />
          <end-date v-model="queryParams.endTime" :type="'datetime'" placeholder="结束时间" :value-format="'yyyy-MM-dd HH:mm:ss'" width="200px" />
          <!--          <end-date v-model="queryParams.endTime" />-->
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
          <el-button v-hasPermi="['record:other:excel']" :loading="btnLoading" type="warning" icon="el-icon-download" size="small" @click="handleExport">导出</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 表格信息 -->
    <dz-table
      v-loading="loading"
      :column="tableColumn"
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
import { otherLog } from '@/api/record/log'
import { downloadOther } from '@/api/excel/excel'

export default {
  name: 'Other',
  data() {
    return {
      loading: false, // 遮罩层(加载)
      btnLoading: false,
      total: 0, // 列表总条数
      queryParams: {
        page: 1,
        limit: 20,
        businessType: undefined,
        state: undefined,
        throwMsg: undefined,
        dateRange: [],
        startTime: undefined,
        endTime: undefined
      },
      tableColumn: [
        { type: 'index', index: this.indexMethod },
        { label: '业务类型', prop: 'businessType' },
        { label: '处理结果', prop: 'state' },
        { label: '响应内容', prop: 'throwMsg' },
        { label: '时间', prop: 'createTime' }],
      list: [], // 表格数据
      dateRange: [], // 日期范围
      businessTypeList: [
        { label: '满料拖出', value: '103' },
        { label: 'Mom订单工序下发', value: '17' },
        { label: '生产叫料', value: '4' },
        { label: 'Mom订单下发', value: '1' }
      ],
      stateList: [
        { label: '成功', value: '0' },
        { label: '失败', value: '1' }
      ],
      lineLists: [] // 产线列表
    }
  },
  async mounted() {
    // console.log('时间', this.getTodayTime())
    [this.queryParams.startTime, this.queryParams.endTime] = this.getTodayTime()
    await this.getList()
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
    // 登录日志列表
    getList() {
      this.loading = true
      otherLog(this.queryParams).then(res => {
        this.list = res.data
        this.total = res.count || 0
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.$refs.queryForm.validate((valid) => {
        if (valid) {
          this.queryParams.page = 1
          this.getList()
        }
      })
    },
    /** 重置按钮操作 */
    async resetQuery() {
      // this.dateRange = []
      await this.resetForm('queryForm')
      await this.handleQuery()
    },
    // 导出按钮
    handleExport() {
      this.btnLoading = true
      downloadOther(this.queryParams).then((res) => {
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
