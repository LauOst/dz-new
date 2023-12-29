<template>
  <div class="app-container">
    <!-- 头部筛选 -->
    <el-card shadow="never" class="card">
      <el-form ref="queryForm" :inline="true" :model="queryParams">
        <el-form-item prop="lineId">
          <el-select v-model="queryParams.lineId" size="small" style="width: 180px;" placeholder="产线名称">
            <!--            <el-option label="全部" :value="''" />-->
            <el-option v-for="(item,index) in lineLists" :key="index" :label="item.lineName" :value="item.lineId" />
          </el-select>
        </el-form-item>
        <el-form-item prop="productName">
          <el-input v-model="queryParams.productName" clearable size="small" placeholder="产品名称" style="width: 180px;" />
        </el-form-item>
        <el-form-item>
          <!--          <packer v-model="dateRange" />-->
          <start-date v-model="queryParams.startTime" />
          <end-date v-model="queryParams.endTime" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
          <el-button v-hasPermi="['productionPlan:productDetails:excel']" :loading="btnLoading" type="warning" icon="el-icon-download" size="small" @click="handleExport">导出</el-button>
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
import { listProductionDetails } from '@/api/productionPlan/productDetails'
import { downloadProductDetails } from '@/api/excel/excel'
import { getlineSelect } from '@/api/commens'
export default {
  name: 'ProductDetails',
  data() {
    return {
      column: [
        { type: 'index', index: this.indexMethod, fixed: true },
        { label: '订单编号', prop: 'orderNo' },
        { label: '产线名称', prop: 'lineName' },
        { label: '产品名称', prop: 'productName' },
        { label: '产品编号', prop: 'productNo' },
        { label: '产出(件)', prop: 'totalNum' },
        { label: '毛坯(件)', prop: 'roughNum' },
        { label: '不合格(件)', prop: 'badnessNum' },
        { label: '合格(件)', prop: 'qualifiedNum' },
        { label: '日期', prop: 'workDate' }
      ],
      // 遮罩层(加载)
      loading: false,
      btnLoading: false,
      total: 0, // 列表总条数
      queryParams: { // 查询信息
        page: 1,
        limit: 20,
        departName: undefined, // 站点名称
        productName: undefined, // 产线名称
        lineId: undefined, // 产线名称
        plannedQuantity: undefined,
        field: undefined,
        type: undefined,
        startTime: undefined,
        endTime: undefined
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
    [this.queryParams.startTime, this.queryParams.endTime] = this.getMonthDays()
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
      console.log('22')
      this.loading = true
      listProductionDetails(this.queryParams).then(res => {
        this.list = res.data
        this.total = res.count || 0
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
          this.queryParams.lineId = data[0].lineId
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
      this.btnLoading = true
      downloadProductDetails(this.queryParams).then((res) => {
        this.btnLoading = false
        if (!res.data) return
        this.$downloadFunc(res)
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
    }
  }
}
</script>

<style scoped>

</style>
