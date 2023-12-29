<template>
  <div class="app-container">
    <!-- 头部筛选 -->
    <el-card shadow="never" class="card">
      <el-form ref="queryForm" :inline="true" :model="queryParams">
        <el-form-item prop="stationId">
          <el-select v-model="queryParams.stationId" size="small" style="width: 180px;" placeholder="工位">
            <el-option label="全部" :value="''" />
            <el-option v-for="(item,index) in stationList" :key="index" :label="item.stationName" :value="item.stationId" />
          </el-select>
        </el-form-item>
        <el-form-item prop="qrCode">
          <el-input v-model="queryParams.qrCode" v-support size="small" clearable placeholder="二维码" style="width: 250px;" />
        </el-form-item>
        <el-form-item prop="workpieceCode">
          <el-input v-model="queryParams.workpieceCode" v-support size="small" clearable placeholder="唯一订单号" style="width: 200px;" />
        </el-form-item>
        <start-date v-model="queryParams.startTime" />
        <end-date v-model="queryParams.endTime" />
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
          <el-button :loading="btnLoading" type="warning" icon="el-icon-download" size="small" @click="handleExport">导出</el-button>
          <!--          <el-button-->
          <!--            :loading="btnLoading"-->
          <!--            type="success"-->
          <!--            :icon="modeStatus === '0' ? 'el-icon-turn-off' : 'el-icon-open'"-->
          <!--            size="small"-->
          <!--            @click="handleToggle(modeStatus)"-->
          <!--          >-->
          <!--            {{ modeStatus === '0' ? '开启' : '关闭' }}-->
          <!--          </el-button>-->
          <el-switch
            v-model="modeStatus"
            style="margin-left: 10px"
            active-text="开启"
            inactive-text="关闭"
            active-value="1"
            inactive-value="0"
            @change="handleToggle(modeStatus)"
          />
        </el-form-item>
        <!--        <div class="right-btn">-->
        <!--          <el-switch-->
        <!--            v-model="typeStatus"-->
        <!--            :active-value="1"-->
        <!--            :inactive-value="2"-->
        <!--          />-->
        <!--        </div>-->
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
import { getReportWorkMode, getUpWork, updateReportWorkMode } from '@/api/mom/productReport'
import { downloadReportWork } from '@/api/mom/productReport'
import { listStation } from '@/api/report/station'

export default {
  name: 'ProductReport',
  data() {
    return {
      column: [
        { type: 'index', index: this.indexMethod, fixed: true },
        { label: '产线名称', prop: 'lineName', minWidth: 130 },
        { label: '工位名称', prop: 'stationName', minWidth: 130 },
        { label: '节拍', prop: 'taktTime', width: 160, disableSort: true },
        { label: '唯一订单号', prop: 'workpieceCode', minWidth: 180 },
        { label: 'MOM订单号', prop: 'productAliasProductionLine', width: 150 },
        { label: '简码', prop: 'productAlias', width: 150 },
        { label: '二维码', prop: 'qrCode', minWidth: 150 },
        { label: '开始时间', prop: 'startTime', minWidth: 160 },
        { label: '完成时间', prop: 'completeTime', minWidth: 160 },
        { label: '日期', prop: 'workDate', minWidth: 100 }

      ],
      // 遮罩层(加载)
      loading: false,
      total: 0, // 列表总条数
      queryParams: { // 查询信息
        page: 1,
        limit: 20,
        qrCode: undefined,
        stationId: undefined,
        workpieceCode: undefined,
        startTime: undefined,
        endTime: undefined,
        field: undefined,
        type: undefined
      },
      list: [], // 表格数据
      dialogVisible: false, // 新增弹窗
      dialogType: 'new',
      passVisible: false, // 确认气泡框
      formData: {},
      addFormRules: { // 表单验证
        orderId: [
          { required: true, message: '请选择订单', trigger: 'change' }
        ],
        lineId: [
          { required: true, message: '请选择产线', trigger: 'change' }
        ],
        equipmentType: [
          { required: true, message: '请选择设备类型', trigger: 'change' }
        ],
        equipmentName: [
          { required: true, message: '请输入设备名称', trigger: 'blur' }
        ],
        equipmentCode: [
          { required: true, message: '请输入设备编号', trigger: 'blur' }
        ],
        equipmentNo: [
          { required: true, message: '请输入设备序号', trigger: 'blur' }
        ]
      },
      lineLists: [], // 产线列表
      stationList: undefined, // 工位列表
      isShowPro: false,
      btnLoading: false,
      modeStatus: '0'
    }
  },
  async mounted() {
    [this.queryParams.startTime] = this.getToday()
    this.getList()
    this.handleStation()
    this.getMode()
  },
  methods: {
    // 排序
    sortChange(column) {
      this.$mySort(this.queryParams, column, this.getList)
    },
    // 格式化序号
    indexMethod(index) {
      return (this.queryParams.page - 1) * this.queryParams.limit + index + 1
    },
    // 模式查询
    getMode() {
      getReportWorkMode({ code: 'work_no' }).then(r => {
        this.modeStatus = r.data.type
        // console.log('modeStatus-R', this.modeStatus)
      })
    },
    // 获取机器人列表
    getList() {
      this.loading = true
      getUpWork(this.queryParams).then(res => {
        this.list = res.data
        this.total = res.count || 0
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    handleStation() {
      listStation({ page: 1, limit: 9999 }).then(r => {
        this.stationList = r.data.map(item => {
          const obj = {
            stationName: item.stationName,
            stationId: item.stationId
          }
          return obj
        })
      })
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.stationList = undefined
      this.resetForm('queryForm');
      [this.queryParams.startTime] = this.getToday()
      if (this.lineLists && this.lineLists.length > 0) {
        this.queryParams.lineId = this.lineLists[0].lineId
        this.changeLine(this.lineLists[0].lineId)
      }

      this.handleQuery()
    },
    // 切换
    handleToggle(modeStatus) {
      // console.log('modeStatus', modeStatus)
      // const type = modeStatus === 0 ? '1' : '0'
      // const text = modeStatus === 0 ? '上报' : '不上报'
      // this.$confirm('确认"' + text + '"吗?', '警告', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(function() {
      //   return updateReportWorkMode({ type, code: 'work_no' })
      // }).then(() => {
      //   this.msgSuccess(text + '成功')
      // }).catch(function() {
      //   this.modeStatus = this.modeStatus === 1 ? 0 : 1
      // })
      console.log('modeStatus', modeStatus)
      // const type = modeStatus === '0' ? '1' : '0'
      // this.btnLoading = true
      updateReportWorkMode({ type: modeStatus, code: 'work_no' }).then((res) => {
        this.getMode()
        this.msgSuccess('切换成功')
        // this.modeStatus = res.data.type
        // this.btnLoading = false
      }).catch((err) => {
        console.log('err', err)
        // this.btnLoading = false
      })
    },
    startReportingStatus(row) {
      const obj = {
        '0': '未上报',
        '1': '已上报',
        '3': '上报异常'
      }
      return obj[row.startReportingStatus]
    },
    // 导出按钮
    handleExport() {
      this.btnLoading = true
      downloadReportWork(this.queryParams).then((res) => {
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

<style lang="scss" scoped>
.right-btn {
  float: right;
  //margin: auto 0;
  transform: translateY(50%);
}
</style>
