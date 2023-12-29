<template>
  <div class="app-container">
    <!-- 头部筛选 -->
    <el-card shadow="never" class="card">
      <el-form ref="queryForm" :inline="true" :model="queryParams">
        <el-form-item v-hasShow prop="orderNo">
          <el-select v-model="queryParams.orderNo" size="small" style="width: 180px;" placeholder="订单编号">
            <el-option label="全部" :value="''" />
            <el-option v-for="(item,index) in orderList" :key="index" :label="item.orderNo" :value="item.orderNo">
              <span>{{ item.orderNo }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="lineId">
          <el-select v-model="queryParams.lineId" size="small" style="width: 180px;" placeholder="产线名称">
            <el-option label="全部" :value="''" />
            <el-option v-for="(item,index) in lineList" :key="index" :label="item.lineName" :value="item.lineId" />
          </el-select>
        </el-form-item>
        <el-form-item prop="equipmentCode">
          <el-input
            v-model="queryParams.equipmentCode"
            clearable
            size="small"
            placeholder="机器人编号"
            style="width: 180px;"
          />
        </el-form-item>
        <el-form-item prop="workName">
          <el-input v-model="queryParams.workName" clearable size="small" placeholder="班次名称" style="width: 180px;" />
        </el-form-item>
        <start-date v-model="queryParams.startTime" />
        <end-date v-model="queryParams.endTime" />
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
          <el-button v-hasPermi="['robot:robotHca:excel']" :loading="btnLoading" type="warning" icon="el-icon-download" size="small" @click="handleExport">导出</el-button>
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
import { mapGetters } from 'vuex'
import { getlineSelect } from '@/api/commens' // 获取产线列表
import { getRobotAll } from '@/api/robot/robot'
import { downloadRobotHca } from '@/api/excel/excel'

export default {
  name: 'RobotHca',
  data() {
    return {
      column: [
        { type: 'index', index: this.indexMethod },
        { label: '订单编号', prop: 'orderNo' },
        // { label: '归属站点', prop: 'departName' },
        { label: '产线名称', prop: 'lineName' },
        { label: '机器人序号', prop: 'equipmentNo' },
        // { label: '机器人编号', prop: 'equipmentCode', width: 200 },
        { label: '机器人名称', prop: 'equipmentName' },
        { label: '日期', prop: 'workData' },
        { label: '班次', prop: 'workName' },
        {
          label: '班次时间', prop: 'timeRange', width: '160'
        },
        { label: '生产数量', prop: 'nowNum' },
        { label: '毛坯数量', prop: 'roughNum' },
        { label: '合格数量', prop: 'qualifiedNum' },
        { label: '不合格数量', prop: 'badnessNum' }
      ],
      // 遮罩层(加载)
      loading: false,
      btnLoading: false,
      total: 0, // 列表总条数
      queryParams: { // 查询信息
        page: 1,
        limit: 20,
        equipmentCode: undefined, // 机器人编码
        orderNo: undefined, // 订单编号
        lineId: undefined, // 产线名称
        workName: undefined, // 班次名称
        field: undefined,
        type: undefined,
        startTime: undefined,
        endTime: undefined
      },
      dateRange: [], // 时间范围
      startTime: '',
      list: [], // 表格数据
      lineList: [] // 产线列表
    }
  },
  computed: { ...mapGetters(['orderList']) },
  mounted() {
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
    // 获取机器人列表
    getList() {
      this.loading = true
      // getRobotAll(this.addDateRange(this.queryParams, this.dateRange)).then(res => {
      getRobotAll(this.queryParams).then(res => {
        this.list = res.data
        this.total = res.count || 0
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 获取产线列表
    handleLine() {
      getlineSelect().then(res => {
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
      downloadRobotHca(this.queryParams).then((res) => {
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
