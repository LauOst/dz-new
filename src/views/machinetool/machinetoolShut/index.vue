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
          <el-input v-model="queryParams.equipmentCode" clearable size="small" placeholder="70" style="width: 180px;" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
          <el-button v-hasPermi="['machinetool:machinetoolShut:excel']" :loading="btnLoading" type="warning" icon="el-icon-download" size="small" @click="handleExport">导出</el-button>
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
    <!-- 停机详情 -->
    <el-dialog v-dialogDrag :close-on-click-modal="false" :modal-append-to-body="false" title="停机详情" :visible.sync="dialogVisible" width="1400px">
      <el-card shadow="never" class="card-detail">
        <el-form ref="queryFormDetail" :inline="true" :model="queryParamsDetail">
          <el-form-item>
            <start-date v-model="queryParamsDetail.startTime" />
            <end-date v-model="queryParamsDetail.endTime" />
          </el-form-item>
          <el-form-item>

            <el-button type="primary" icon="el-icon-search" size="small" @click="handleQueryDetail">搜索</el-button>
            <el-button icon="el-icon-refresh" size="small" @click="resetQueryDetail">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
      <dz-table
        v-loading="loadingDetail"
        :column="columnDetail"
        :data="gridData"
        :total="totalDetail"
        pagination
        height="500"
        :page.sync="queryParamsDetail.page"
        :limit.sync="queryParamsDetail.limit"
        @pagination="handleDetail"
      />
    </el-dialog>

  </div>
</template>

<script>
import { getlineSelect } from '@/api/commens' // 获取产线列表
import { getToolShut, getToolShutByNo } from '@/api/machinetool/machinetool'
import { mapGetters } from 'vuex'
import { downloadMachShut } from '@/api/excel/excel'
export default {
  name: 'MachinetoolShut',
  data() {
    return {
      column: [
        { type: 'index', index: this.indexMethod },
        { label: '订单编号', prop: 'orderNo' },
        // { label: '归属站点', prop: 'departName' },
        { label: '产线名称', prop: 'lineName' },
        { label: '机床序号', prop: 'equipmentNo' },
        { label: '机床编号', prop: 'equipmentCode', width: '200' },
        { label: '机床名称', prop: 'equipmentName' },
        { label: '累计停机时间', prop: 'downTime', formatter: this.statusFormat, sortable: 'column' },
        { label: '停机次数', prop: 'downSum' },
        { label: '操作', render: (h, scope) => {
          return (
            <div>
              <el-button
                v-hasPermi={['machinetool:machinetoolShut:detail']}
                type='primary'
                size='mini'
                onClick={() => { this.handleDetail(-1, scope.row.id) }}
              >查看详情</el-button>
            </div>
          )
        } }
      ],
      columnDetail: [
        { label: '订单编号', prop: 'orderNo', disableSort: true },
        { label: '产线名称', prop: 'lineName', disableSort: true },
        { label: '机床编号', prop: 'equipmentCode' },
        { label: '机床名称', prop: 'equipmentName' },
        { label: '停机开始时间', prop: 'stopTime' },
        { label: '停机结束时间', prop: 'resetTime' },
        { label: '停机时长', prop: 'duration', formatter: this.statusFormat, sortable: 'column' }
      ],
      // 遮罩层(加载)
      loading: false,
      btnLoading: false,
      loadingDetail: false,
      total: 0, // 列表总条数
      totalDetail: 0, // 列表总条数
      queryParams: { // 查询信息
        page: 1,
        limit: 20,
        departName: undefined, // 站点名称
        equipmentCode: undefined, // 机器人编码
        equipmentNo: undefined, // 机器人序号
        orderNo: undefined, // 订单编号
        lineId: undefined, // 产线名称
        field: undefined,
        type: undefined
      },
      queryParamsDetail: {
        page: 1,
        limit: 20,
        startTime: '',
        endTime: '',
        id: ''
      },
      // 日期范围
      dateRange: [],
      list: [], // 表格数据
      addDialogVisible: false, // 新增弹窗
      passVisible: false, // 确认气泡框
      lineList: [], // 产线列表
      dialogVisible: false, // 停机弹窗
      gridData: [] // 停机详情数据
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
      getToolShut(this.queryParams).then(res => {
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
    // 查看详情
    handleDetail(id, no) {
      if (id === -1) {
        this.dialogVisible = true
        this.queryParamsDetail.id = no
      }
      this.loadingDetail = true
      getToolShutByNo(this.queryParamsDetail).then(res => {
        this.gridData = res.data
        this.totalDetail = res.count || 0
        this.loadingDetail = false
      }).catch(() => {
        this.loadingDetail = false
      })
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      // this.dateRange = []
      this.resetForm('queryForm')
      this.handleQuery()
    },
    /** 搜索按钮操作 */
    handleQueryDetail() {
      this.$refs.queryFormDetail.validate((valid) => {
        if (valid) {
          this.queryParams.page = 1
          this.handleDetail()
        }
      })
    },
    /** 重置按钮操作 */
    async resetQueryDetail() {
      await this.resetForm('queryFormDetail')
      await this.handleQueryDetail()
    },
    // 导出按钮
    handleExport() {
      this.btnLoading = true
      downloadMachShut(this.queryParams).then((res) => {
        this.btnLoading = false
        if (!res.data) return
        this.$downloadFunc(res)
      }).catch((err) => {
        console.log('err', err)
        this.btnLoading = false
      })
    },
    MillisecondToDate(msd) {
      var time = parseFloat(msd) / 1000
      if (time != null && time !== '') {
        if (time > 60 && time < 60 * 60) {
          time = parseInt(time / 60.0) + '分' + parseInt((parseFloat(time / 60.0) - parseInt(time / 60.0)) * 60) + '秒'
        } else if (time >= 60 * 60) {
          time = parseInt(time / 3600.0) + '小时' + parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) + '分' + parseInt((parseFloat((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) - parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60)) * 60) + 's'
        } else {
          time = parseInt(time) + ' ' + '秒'
        }
      }
      return time
    },
    // 状态参数格式化
    statusFormat(row, column) {
      let time
      if (row.duration) {
        time = this.MillisecondToDate(row.duration)
      } else if (row.downTime) {
        time = this.MillisecondToDate(row.downTime)
      } else {
        time = 0
      }
      return time
    }
  }
}
</script>

<style scoped>

</style>
