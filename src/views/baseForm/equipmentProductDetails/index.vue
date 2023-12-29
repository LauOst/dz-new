<template>
  <div class="app-container">
    <!-- 头部筛选 -->
    <el-card shadow="never" class="card">
      <el-form ref="queryForm" :inline="true" :model="queryParams.model">
        <el-form-item prop="lineNo">
          <el-select v-model="queryParams.model.lineNo" size="small" style="width: 180px;" placeholder="产线号">
            <!--            <el-option label="全部" :value="''" />-->
            <el-option v-for="(item,index) in lineLists" :key="index" :label="item.lineName" :value="item.lineNo" />
          </el-select>
        </el-form-item>
        <el-form-item prop="equipmentNo">
          <el-input v-model="queryParams.model.equipmentNo" clearable size="small" placeholder="设备号" style="width: 180px;" />
        </el-form-item>
        <el-form-item prop="workShiftName">
          <el-input v-model="queryParams.model.workShiftName" clearable size="small" placeholder="班次" style="width: 180px;" />
        </el-form-item>
        <el-form-item prop="modelNumber">
          <el-input v-model="queryParams.model.modelNumber" clearable size="small" placeholder="产品型号" style="width: 180px;" />
        </el-form-item>
        <el-form-item>
          <!--          <packer v-model="dateRange" />-->
          <start-date v-model="queryParams.model.startTime" :type="'datetime'" placeholder="开始时间" :value-format="'yyyy-MM-dd HH:mm:ss'" width="200px" />
          <end-date v-model="queryParams.model.endTime" :type="'datetime'" placeholder="结束时间" :value-format="'yyyy-MM-dd HH:mm:ss'" width="200px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
          <el-button v-hasPermi="['productionPlan:EquimentProductDetails:excel']" :loading="btnLoading" type="warning" icon="el-icon-download" size="small" @click="handleExport">导出</el-button>
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
import { listEquipmentProNumDetails } from '@/api/productionPlan/EquimentProductDetails'
import { downloadEeuipmentProNumDetails } from '@/api/excel/excel'
import { getlineSelect } from '@/api/commens'
export default {
  name: 'EquimentProductDetails',
  data() {
    return {
      column: [
        { type: 'index', index: this.indexMethod, fixed: true },
        { label: '产线号', prop: 'lineNo' },
        { label: '设备号', prop: 'equipmentNo' },
        { label: '班次', prop: 'workShiftName' },
        { label: '产品型号', prop: 'modelNumber' },
        { label: '产量(件)', prop: 'output' },
        { label: '时间', prop: 'createTime' }
      ],
      // 遮罩层(加载)
      loading: false,
      btnLoading: false,
      total: 0, // 列表总条数
      queryParams: {
        type: '',
        field: '',
        page: 1,
        limit: 20,
        model: {
          startTime: undefined,
          endTime: undefined,
          equipmentNo: undefined,
          lineNo: undefined,
          modelNumber: undefined,
          workShiftName: undefined
        }
      },

      dateRange: [], // 时间范围
      list: [], // 表格数据
      form: {},
      lineList: [], // 产线列表
      lineLists: [], // 产线列表
      productRecordDetail: {},
      productrecorddetailList: []
    }
  },
  async mounted() {
    // console.log('时间', this.getTodayTime());
    // [this.queryParams.startTime, this.queryParams.endTime] = this.getMonthDays()
    [this.queryParams.model.startTime, this.queryParams.model.endTime] = this.getTodayTimeEnd()
    // this.dateRange = this.getMonthDays()
    await this.handleLines()
    await this.getList()
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
      listEquipmentProNumDetails(this.queryParams).then(res => {
        const { list, total } = res.data
        this.list = list
        this.total = total || 0
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 获取产线列表
    handleLines() {
      return new Promise((resolve, reject) => {
        getlineSelect().then(response => {
          const { data } = response
          this.lineLists = data
          this.queryParams.lineNo = data[0].lineNo
          resolve(data)
        }).catch(error => {
          this.loading = false
          reject(error)
        })
      })
      // getlineSelect().then(res => {
      //   this.lineLists = res.data
      //   this.queryParams.lineId = res.data[0].lineId
      //   console.log('queryParams', this.queryParams)
      // }).catch(() => {
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
      const newData = JSON.parse(JSON.stringify(this.queryParams))
      newData.page = 1
      newData.limit = -1
      this.btnLoading = true
      downloadEeuipmentProNumDetails(newData).then((res) => {
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
