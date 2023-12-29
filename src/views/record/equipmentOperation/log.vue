<template>
  <div class="app-container">
    <!-- 头部筛选 -->
    <el-card shadow="never" class="card">
      <el-form ref="queryForm" :inline="true" :model="queryParams" :rules="searchRules">
        <el-form-item prop="orderNo">
          <el-input v-model="queryParams.orderNo" v-support size="small" clearable placeholder="订单号" style="width: 180px;" />
        </el-form-item>
        <el-form-item prop="lineNo">
          <el-input v-model="queryParams.lineNo" v-support size="small" clearable placeholder="产线号" style="width: 180px;" />
        </el-form-item>
        <el-form-item prop="equipmentNo">
          <el-input v-model="queryParams.equipmentNo" v-support size="small" clearable placeholder="设备编号" style="width: 180px;" />
        </el-form-item>
        <el-form-item prop="workState">
          <el-select v-model="queryParams.workState" v-support size="small" placeholder="状态" style="width: 180px;">
            <el-option label="全部" :value="-1" />
            <el-option label="作业" :value="1" />
            <el-option label="待机" :value="2" />
            <el-option label="故障" :value="3" />
            <el-option label="关机" :value="4" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <start-date v-model="queryParams.startTime" />
          <end-date v-model="queryParams.endTime" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
          <el-button v-hasPermi="['record:equipmentOperation:excel']" :loading="btnLoading" type="warning" icon="el-icon-download" size="small" @click="handleExport">导出</el-button>
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
import { equipmentOperationLog } from '@/api/record/log'
// import PageTable from '@/components/PageTable'
// import pagination from '@/components/Pagination'
import { downloadEquipmentOperationLog } from '@/api/excel/excel'
import { mapGetters } from 'vuex'
import moment from 'moment'

export default {
  name: 'EquipmentOperation',
  data() {
    return {
      loading: false, // 遮罩层(加载)
      btnLoading: false,
      total: 0, // 列表总条数
      // 查询信息
      queryParams: {
        page: 1,
        limit: 20,
        equipmentNo: undefined,
        orderNo: '',
        lineNo: undefined,
        workState: -1,
        dateRange: [],
        startTime: undefined,
        endTime: undefined
      },
      column: [
        { type: 'index', index: this.indexMethod },
        { label: '产线号', prop: 'lineNo', disableSort: true },
        { label: '设备编号', prop: 'equipmentNo', disableSort: true },
        { label: '状态', render: (h, scope) => {
          return (
            <span>{ this.devFilter(scope.row.workState)}</span>
          )
        }, disableSort: true },
        { label: '开始时间', prop: 'stopTime', disableSort: true },
        { label: '结束时间', prop: 'resetTime', disableSort: true },
        { label: '时长', prop: 'duration', formatter: this.cleanTime, disableSort: true }
      ],
      list: [], // 表格数据
      dateRange: [], // 日期范围
      searchRules: {
        orderNo: [
          { required: true, message: '请输入订单号', trigger: 'blur' }
        ],
        lineNo: [
          { required: true, message: '请输入产线号', trigger: 'blur' }
        ],
        startTime: [
          { required: true, message: '请选择时间', trigger: 'change' }
        ],
        endTime: [
          { required: true, message: '请选择时间', trigger: 'change' }
        ]
      }
    }
  },
  computed: { ...mapGetters(['orderList']) },
  async mounted() {
    [this.queryParams.startTime, this.queryParams.endTime] = this.getToday()
    // this.queryParams.orderNo = this.orderList[0].orderNo
    // await this.getList()
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
    devFilter(val) {
      const obj = {
        1: '作业',
        2: '待机',
        3: '故障',
        4: '关机'
      }
      return obj[val]
    },
    // 登录日志列表
    getList() {
      this.loading = true
      equipmentOperationLog(this.queryParams).then(res => {
        this.list = res.data
        this.total = res.count || 0
        this.loading = false
      }).catch(() => {
        this.list = []
        this.loading = false
      })
    },
    // 时间选择事件
    handleData(data) {
      this.queryParams.dateRange = data
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
      await this.resetForm('queryForm');
      [this.queryParams.startTime, this.queryParams.endTime] = this.getToday()
      await this.handleQuery()
    },
    // 导出按钮
    handleExport() {
      const newData = JSON.parse(JSON.stringify(this.queryParams))
      newData.page = 1
      newData.limit = -1
      this.btnLoading = true
      downloadEquipmentOperationLog(newData).then((res) => {
        this.btnLoading = false
        if (!res.data) return
        this.$downloadFunc(res)
      }).catch((err) => {
        console.log('err', err)
        this.btnLoading = false
      })
    },
    cleanTime(row) {
      if (!row.duration) return '--'
      var tempTime = moment.duration(Number(row.duration))
      var hours = tempTime.hours()
      var minutes = tempTime.minutes()
      var seconds = tempTime.seconds()
      var days = tempTime.days()
      // console.log(`${tempTime.days()}天${hours}小时${minutes}分钟${seconds}秒`)
      if (minutes === 0 && hours === 0 && days === 0) return seconds + ' 秒'
      if (hours === 0 && days === 0) return this.formatNumber(minutes) + ' 分 ' + this.formatNumber(seconds) + ' 秒'
      if (days > 0) return this.formatNumber((tempTime.days() * 24 + hours)) + ' 小时 ' + this.formatNumber(minutes) + ' 分 ' + this.formatNumber(seconds) + ' 秒'
      return this.formatNumber(hours) + ' 小时 ' + this.formatNumber(minutes) + ' 分 ' + this.formatNumber(seconds) + ' 秒'
    },
    formatNumber(n) {
      if (n < 10 && n > 0) return '0' + n
      else if (n === 0) return '00'
      else return n
    }
  }
}
</script>

<style lang="scss" scoped>
.specialColor{
  color:red;
}
</style>
