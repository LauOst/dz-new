<template>
  <div class="app-container">
    <!-- 头部筛选 -->
    <el-card shadow="never" class="card">
      <el-form ref="queryForm" :inline="true" :model="queryParams" :rules="searchRules">
        <el-form-item prop="queuename">
          <el-select v-model="queryParams.queuename" v-support size="small" placeholder="队列名称" style="width: 180px;">
            <el-option v-for="(item,index) in queuenameList" :key="index" :label="item.name" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item v-hasShow prop="ordercode">
          <el-select v-model="queryParams.orderNo" v-support size="small" style="width: 180px;" placeholder="订单编号">
            <!--            <el-option label="全部" :value="''" />-->
            <el-option v-for="(item,index) in orderList" :key="index" :label="item.orderNo" :value="item.orderNo">
              <span>{{ item.orderNo }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="lineId">
          <el-select v-model="queryParams.lineId" size="small" style="width: 180px;" placeholder="产线名称">
            <el-option v-for="(item,index) in lineLists" :key="index" :label="item.lineName" :value="item.lineId" />
          </el-select>
        </el-form-item>
        <el-form-item prop="devicetype">
          <el-select v-model="queryParams.devicetype" v-support size="small" placeholder="设备类型" style="width: 180px;">
            <el-option v-for="(item,index) in equipmentList" :key="index" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item prop="devicecode">
          <el-select v-model="queryParams.devicecode" allow-create filterable default-first-option size="small" placeholder="设备编码" style="width: 180px;">
            <el-option v-for="(item,index) in deviceCodeList" :key="index" :label="item.name" :value="item.name" />
          </el-select>
        </el-form-item>
        <el-form-item prop="startTime">
          <start-date v-model="queryParams.startTime" />
        </el-form-item>
        <el-form-item prop="endTime">
          <end-date v-model="queryParams.endTime" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
          <el-button v-hasPermi="['record:communicationTcp:excel']" :loading="btnLoading" type="warning" icon="el-icon-download" size="small" @click="handleExport">导出</el-button>
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
import { communicationTCPLog } from '@/api/record/log'
import { downloadCommunicationTcp } from '@/api/excel/excel'
import { getToday } from '@/utils/function/moment'
import { mapGetters } from 'vuex'
import { getlineSelect } from '@/api/commens'

export default {
  name: 'CommunicationTcp',
  filters: {
    devFilter(val) {
      const obj = {
        1: '检测设备',
        2: '机床',
        3: '机器人',
        4: '相机',
        8: '淬火机',
        9: '校直机',
        12: '焊接机'
      }
      return obj[val] || ''
    }
  },
  data() {
    return {
      loading: false, // 遮罩层(加载)
      btnLoading: false,
      total: 0, // 列表总条数
      // 查询信息
      queryParams: {
        page: 1,
        limit: 20,
        queuename: undefined,
        ordercode: undefined,
        lineId: undefined,
        devicetype: undefined,
        devicecode: undefined,
        dateRange: [],
        field: undefined,
        type: undefined,
        startTime: undefined,
        endTime: undefined
      },
      // 状态
      statusOptions: [{
        label: '正常',
        value: 0
      }, {
        label: '异常',
        value: 1
      }],
      ids: [], // 选中数组
      multiple: true, // 非多个禁用
      list: [], // 表格数据
      lineLists: [], // 产线列表
      tableColumn: [
        {
          fixed: true,
          type: 'index',
          index: this.indexMethod,
          width: 80
        },
        {
          label: '消息id',
          width: 250
        }, {
          label: '队列名称',
          width: 240
        }, {
          label: '传输时间',
          width: 200
        }, {
          label: 'A502',
          width: 250
        }, {
          label: 'A501',
          width: 250
        }],
      dateRange: [], // 日期范围
      equipmentList: [ // 设备列表
        { id: 3, name: '机器人' },
        { id: 1, name: '检测设备' },
        { id: 2, name: '机床' },
        { id: 4, name: '相机' },
        { id: 6, name: '报工' },
        { id: 7, name: 'AGV' },
        { id: 8, name: '淬火机' },
        { id: 9, name: '校直机' },
        { id: 10, name: '门' },
        { id: 12, name: '焊接机' }
      ],
      deviceCodeList: [ // 设备编码列表
        { name: '01' },
        { name: '02' },
        { name: '03' },
        { name: 'A1' },
        { name: 'A2' },
        { name: 'A3' },
        { name: 'A4' },
        { name: 'A5' },
        { name: 'A6' },
        { name: 'A7' },
        { name: 'A8' },
        { name: 'A9' }
      ],
      queuenameList: [
        { value: 'dzics-dev-gather-v1-pulse-signal', name: '脉冲信号队列' },
        { value: 'dzics-dev-gather-v1-state', name: '更新状态队列' },
        // { value: 'dzics-dev-gather-v1-run-state', name: '运行状态队列' },
        { value: 'dzics-dev-gather-v1-checkout-equipment', name: '检测设备队列' },
        { value: 'dzics-dev-gather-v1-product-position', name: '报工信息队列' },
        { value: 'dzics-dev-cutting-tool-detection', name: '刀具日志队列' },
        { value: 'dzics-dev-gather-v1-queue', name: '数量累计队列' }
      ],
      searchRules: {
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
    this.queryParams.queuename = this.queuenameList[0].value
    this.queryParams.orderNo = this.orderList[0].orderNo
    this.queryParams.devicetype = this.equipmentList[0].id
    this.queryParams.devicecode = this.deviceCodeList[0].name
    await this.handleLines()
    await this.getList()
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
    // 登录日志列表
    getList() {
      // console.log('loading1', this.loading)
      this.loading = true
      communicationTCPLog(this.queryParams).then(res => {
        console.log('1111', res)
        if (res.data.length === 0) {
          this.list = []
          this.tableColumn = []
        } else {
          this.list = res.data.tableData
          const arr = res.data.tableColumn.map(item => ({
            label: item.colName,
            prop: item.colData,
            width: 120
          }))
          this.tableColumn = this.$Dz.mergeArr('label', arr, this.tableColumn)
        }
        this.tableColumn.map((item, index) => {
          if (item.type === 'index') {
            this.tableColumn.unshift(this.tableColumn.splice(index, 1)[0])
          }
        })
        this.total = res.count || 0
        this.loading = false
      })
    },
    // 获取产线列表
    handleLines() {
      return new Promise((resolve) => {
        getlineSelect().then(res => {
          this.lineLists = res.data
          this.queryParams.lineId = this.lineLists[0].lineId
          resolve(res.data)
        }).catch(() => {
          this.loading = false
        })
      })
    },
    // 状态参数格式化
    statusFormat(row, column) {
      const statusObj = {
        SUCCESS: '正常',
        ERROR: '异常'
      }
      return statusObj[row.loginStatus]
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
      this.queryParams.startTime = getToday()[0]
      this.queryParams.endTime = getToday()[1]
      await this.handleQuery()
    },
    // 导出按钮
    handleExport() {
      this.btnLoading = true
      downloadCommunicationTcp(this.queryParams).then((res) => {
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
