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
        <el-form-item>
          <start-date v-model="queryParams.startTime" />
          <end-date v-model="queryParams.endTime" />
          <!--          <packer v-model="dateRange" />-->
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
          <el-button v-hasPermi="['productionsPlan:productionsPlanHca:excel']" :loading="btnLoading" type="warning" icon="el-icon-download" size="small" @click="handleExport">导出</el-button>
        </el-form-item>
      </el-form>
    </el-card>
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
    <!-- 修改生产计划设置对话框 -->
    <el-dialog v-dialogDrag :close-on-click-modal="false" :modal-append-to-body="false" class="dialog" title="生产计划记录详情" :visible.sync="dialogVisible" width="1000px" append-to-body>
      <el-row>
        <el-col :span="6">日期：{{ productRecordDetail.detectorTime }}</el-col>
        <el-col :span="6">日计划生产数量：{{ productRecordDetail.plannedQuantity }} 件</el-col>
        <el-col :span="6">实际生产数量：{{ productRecordDetail.completedQuantity }} 件</el-col>
        <el-col :span="6">完成率：{{ productRecordDetail.percentageComplete }}</el-col>
      </el-row>
      <hr>
      <el-row class="l-m-t-16">
        <dz-table
          v-loading="loadingDetail"
          :column="columnDetail"
          :data="productrecorddetailList"
        />
      </el-row>
    </el-dialog>

  </div>
</template>

<script>
import { getlineSelect } from '@/api/commens' // 获取产线列表
import { listProductionPlanRecord, listProductionPlanDetailsList } from '@/api/productionPlan/productionPlanHca'
import { mapGetters } from 'vuex'
import { downloadPlanHca } from '@/api/excel/excel'

export default {
  name: 'ProductionPlanHca',
  data() {
    return {
      column: [
        { type: 'index', index: this.indexMethod },
        { label: '订单编号', prop: 'orderNo' },
        // { label: '归属站点', prop: 'departName' },
        { label: '产线名称', prop: 'lineName' },
        { label: '日期', prop: 'detectorTime' },
        { label: '日生产计划(件)', prop: 'plannedQuantity' },
        { label: '实际完成(件)', prop: 'completedQuantity' },
        { label: '完成率(%)', prop: 'percentageComplete' }
        // { label: '操作', render: (h, scope) => {
        //   return (
        //     <div>
        //       <el-button
        //         v-hasPermi={['productionsPlan:productionsPlanHca:detail']}
        //         type='primary'
        //         size='mini'
        //         onClick={() => { this.handleDetail(scope.row) }}
        //       >查看详情</el-button>
        //     </div>
        //   )
        // }, width: 200 }
      ],
      columnDetail: [
        { type: 'index', index: this.indexMethod },
        // { label: '归属站点', prop: 'departName' },
        { label: '产线名称', prop: 'lineName' },
        { label: '产品名称', prop: 'productName' },
        { label: '产品编号', prop: 'productNo' },
        { label: '总数(件)', prop: 'totalNum' }
      ],
      // 遮罩层(加载)
      loading: false,
      loadingDetail: false,
      btnLoading: false,
      // 显示搜索条件
      total: 0, // 列表总条数
      queryParams: { // 查询信息
        page: 1,
        limit: 20,
        departName: undefined, // 站点名称
        orderNo: undefined, // 订单编号
        lineId: undefined, // 产线名称
        plannedQuantity: undefined,
        field: undefined,
        type: undefined,
        startTime: undefined,
        endTime: undefined
      },
      dateRange: [], // 时间范围
      list: [], // 表格数据
      dialogVisible: false, // 新增弹窗
      passVisible: false, // 确认气泡框
      form: {},
      lineList: [], // 产线列表
      productRecordDetail: {},
      productrecorddetailList: []
    }
  },
  computed: { ...mapGetters(['orderList']) },
  mounted() {
    [this.queryParams.startTime, this.queryParams.endTime] = this.getMonthDays()
    this.getList()
    this.handleLine()
  },
  methods: {
    // 格式化序号
    indexMethod(index) {
      return (this.queryParams.page - 1) * this.queryParams.limit + index + 1
    },
    sortChange(column) {
      this.$mySort(this.queryParams, column, this.getList)
    },
    // 获取记录列表
    getList() {
      this.loading = true
      listProductionPlanRecord(this.queryParams).then(res => {
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
    handleDetail(row) {
      var data = {
        detectorTime: row.detectorTime,
        planId: row.planId
      }
      this.loadingDetail = true
      listProductionPlanDetailsList(data).then(response => {
        this.loadingDetail = false
        this.dialogVisible = true
        this.productRecordDetail = JSON.parse(JSON.stringify(row))
        this.productRecordDetail.percentageComplete = this.percentageFormat(row, 1)
        this.productrecorddetailList = response.data
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
      downloadPlanHca(this.queryParams).then((res) => {
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
        lineName: undefined, // 产线名称
        departName: undefined, // 站点名称
        orderNo: undefined, // 订单编号
        plannedQuantity: undefined // 计划生产数量
      }
      this.resetForm('form')
    },
    // 状态参数格式化
    percentageFormat(row, type) {
      if (type === 1) {
        if (row.percentageComplete === 0) {
          return row.percentageComplete + ' %'
        } else {
          const num = row.percentageComplete.toFixed(2)
          return num + ' %'
        }
      } else {
        if (row.percentageComplete === 0) {
          return row.percentageComplete
        } else {
          const num = row.percentageComplete.toFixed(2)
          return num
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
