<template>
  <div class="app-container">
    <!-- 头部筛选 -->
    <el-card shadow="never" class="card">
      <el-form ref="queryForm" :inline="true" :model="queryParams">
        <el-form-item>
          <!--          <packer v-model="dateRange" />-->
          <start-date v-model="queryParams.startTime" />
          <end-date v-model="queryParams.endTime" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
          <el-button v-hasPermi="['productionPlan:productionQuantity:excel']" :loading="btnLoading" type="warning" icon="el-icon-download" size="small" @click="handleExport">导出</el-button>
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
import { getLine } from '@/api/line/line' // 获取产线列表
import { listeQuantity, downloadQuantity } from '@/api/productionPlan/productionQuantity'

export default {
  name: 'ProductionQuantity',
  data() {
    return {
      column: [
        { type: 'index', index: this.indexMethod, fixed: true },
        { label: '产线名称', prop: 'linename', width: 200 },
        { label: '设备类型', prop: 'equipmenttype', formatter: this.equipmenttypeFormat },
        { label: '设备编号', prop: 'equipmentcode', width: 180 },
        { label: '班次', prop: 'workname' },
        { label: '班次时间', prop: 'timeRange', width: 160 },
        { label: '生产数量', prop: 'nownum' },
        { label: '毛坯数量', prop: 'roughnum' },
        { label: '合格数量', prop: 'qualifiednum' },
        { label: '不合格数量', prop: 'badnessnum' },
        { label: '产出率', prop: 'outputRate', formatter: this.outputRateFormat },
        { label: '合格率', prop: 'passRate', formatter: this.passRateFormat },
        { label: '日期', prop: 'workdata' }
      ],
      // 遮罩层(加载)
      loading: false,
      btnLoading: false,
      total: 0, // 列表总条数
      queryParams: { // 查询信息
        page: 1,
        limit: 20,
        field: undefined,
        type: undefined,
        startTime: undefined,
        endTime: undefined
      },
      dateRange: [], // 时间范围
      list: [], // 表格数据
      form: {},
      lineList: [], // 产线列表
      productRecordDetail: {},
      productrecorddetailList: []
      // uploadUrl: process.env.VUE_APP_BASE_API + '/daily/report/order/file',
      // jwt_token: getToken(),
      // sub: getSub()
    }
  },
  mounted() {
    // this.dateRange = this.getMonthDays()
    this.getList()
  },
  methods: {
    // 格式化序号
    indexMethod(index) {
      return (this.queryParams.page - 1) * this.queryParams.limit + index + 1
    },
    sortChange(column) {
      this.$mySort(this.queryParams, column, this.getList)
    },
    // 获取机器人列表
    getList() {
      this.loading = true
      // listeQuantity(this.addDateRange(this.queryParams, this.dateRange)).then(res => {
      listeQuantity(this.queryParams).then(res => {
        this.list = res.data
        this.total = res.count || 0
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 获取产线列表
    handleLine() {
      getLine().then(res => {
        this.lineList = res.data
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
      // axios.get(
      //   this.uploadUrl,
      //   {
      //     params: this.queryParams,
      //     responseType: 'blob',
      //     headers: {
      //       'Content-Type': 'application/x-www-form-urlencoded',
      //       'Accept': 'application/octet-stream',
      //       'jwt_token': this.jwt_token,
      //       'sub': this.sub
      //     }
      //   }
      // ).then((res) => {
      downloadQuantity(this.queryParams).then((res) => {
        this.btnLoading = false
        if (!res.data) return
        this.$downloadFunc(res, '日生产数据报表')
        // const blob = new Blob([res.data], { type: 'application/vnd.ms-excel' }) // 构造一个blob对象来处理数据，并设置文件类型
        // const fileName = '日生产数据报表-' + this.initDate(new Date(), 3) + '.xlsx'
        // if (window.navigator.msSaveOrOpenBlob) { // 兼容IE10
        //   navigator.msSaveBlob(blob, fileName)
        // } else {
        //   const href = URL.createObjectURL(blob) // 创建新的URL表示指定的blob对象
        //   const a = document.createElement('a') // 创建a标签
        //   a.style.display = 'none'
        //   a.href = href // 指定下载链接
        //   a.download = fileName // 指定下载文件名
        //   // a.click() // 触发下载
        //   URL.revokeObjectURL(a.href) // 释放URL对象
        // }
      }).catch((err) => {
        console.log('err', err)
        this.btnLoading = false
      })
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        productName: undefined, // 产线名称
        departName: undefined, // 站点名称
        orderNo: undefined, // 订单编号
        plannedQuantity: undefined // 计划生产数量
      }
      this.resetForm('form')
    },
    // 指令类型格式化
    outputRateFormat(row) {
      return (row.outputRate * 100) + '%'
    },
    passRateFormat(row) {
      return (row.passRate * 100) + '%'
    },
    equipmenttypeFormat(row) {
      const obj = {
        'JQR': '机器人',
        'JCSB': '检测设备',
        'XJ': '相机',
        'EQCODE': '工件位置设备',
        'JC': '机床'
      }
      return obj[row.equipmenttype]
    }
  }
}
</script>

<style scoped>

</style>
