<template>
  <div class="app-container">
    <!-- 头部筛选 -->
    <el-card shadow="never" class="card">
      <el-form ref="queryForm" :inline="true" :model="queryParams">
        <el-form-item prop="orderNo">
          <el-select v-model="queryParams.orderNo" v-support size="small" style="width: 180px;" placeholder="订单编号">
            <!--            <el-option label="全部" :value="''" />-->
            <el-option v-for="(item,index) in orderList" :key="index" :label="item.orderNo" :value="item.orderNo">
              <span>{{ item.orderNo }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="lineId">
          <el-select v-model="queryParams.lineId" size="small" style="width: 180px;" placeholder="产线名称" @change="changeLind">
            <el-option v-for="(item,index) in lineLists" :key="index" :label="item.lineName" :value="item.lineId" />
          </el-select>
        </el-form-item>
        <el-form-item prop="equipmentCode">
          <el-select v-model="queryParams.equipmentCode" size="small" style="width: 180px;" placeholder="设备编号" @change="changeEquipment">
            <el-option v-for="(item,index) in devcieList" :key="index" :label="item.equipmentName" :value="item.equipmentCode" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <start-date v-model="queryParams.startTime" />
          <end-date v-model="queryParams.endTime" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
          <el-button v-hasPermi="['record:alarm:excel']" :loading="btnLoading" type="warning" icon="el-icon-download" size="small" @click="handleExport">导出</el-button>
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
import { mapGetters } from 'vuex'
import { getlineSelect, listDevcie } from '@/api/commens'
import { alarmLog } from '@/api/record/log'
import { downloadAlarm } from '@/api/excel/excel'

export default {
  name: 'Alarm',
  data() {
    return {
      loading: false, // 遮罩层(加载)
      btnLoading: false,
      total: 0, // 列表总条数
      queryParams: {
        page: 1,
        limit: 20,
        equipmentType: undefined,
        equipmentNo: undefined,
        equipmentCode: undefined,
        orderNo: undefined,
        lineId: undefined,
        dateRange: [],
        startTime: undefined,
        endTime: undefined
      },
      tableColumn: [
        { type: 'index', index: this.indexMethod },
        { label: '设备编号', prop: 'deviceCode' },
        { label: '告警内容', prop: 'message' },
        { label: '告警时间', prop: 'timestampTime' }],
      list: [], // 表格数据
      dateRange: [], // 日期范围
      devcieList: [], // 日期范围
      lineLists: [] // 产线列表
    }
  },
  computed: { ...mapGetters(['orderList']) },
  async mounted() {
    [this.queryParams.startTime, this.queryParams.endTime] = this.getToday()
    this.queryParams.orderNo = this.orderList[0].orderNo
    await this.handleLines()
    await this.getListDevcie(this.queryParams.lineId)
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
    // 获取所以设备列表
    getListDevcie(id) {
      this.devcieList = []
      return new Promise((resolve) => {
        listDevcie({ lineId: id }).then(r => {
          this.devcieList = r.data
          this.queryParams.equipmentCode = r.data[0].equipmentCode
          this.queryParams.equipmentType = r.data[0].equipmentType
          resolve(r.data)
        }).catch(() => {
          this.loading = false
        })
      })
    },
    // 选择产线回调
    changeLind(id) {
      this.queryParams.equipmentNo = undefined
      listDevcie({ lineId: id }).then(r => {
        this.devcieList = r.data
      })
    },
    changeEquipment(equipmentCode) {
      const [{ equipmentType }] = this.devcieList.filter(x => x.equipmentCode === equipmentCode)
      this.queryParams.equipmentType = equipmentType
    },
    // 登录日志列表
    getList() {
      this.loading = true
      return new Promise((resolve) => {
        alarmLog(this.queryParams).then(res => {
          this.list = res.data
          this.total = res.count || 0
          this.loading = false

          resolve(res.data)
        }).catch(() => {
          this.loading = false
        })
      })

      // alarmLog(this.queryParams).then(res => {
      //   this.list = res.data
      //   this.total = res.count || 0
      //   this.loading = false
      // })
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
      downloadAlarm(this.queryParams).then((res) => {
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
