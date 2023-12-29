<template>
  <div class="app-container">
    <!-- 头部筛选 -->
    <el-card shadow="never" class="card">
      <el-form ref="queryForm" :inline="true" :model="queryParams">
        <!--        <el-form-item v-hasShow prop="orderNo">-->
        <!--          <el-select v-model="queryParams.orderNo" size="small" style="width: 180px;" placeholder="订单编号">-->
        <!--            <el-option label="全部" :value="''" />-->
        <!--            <el-option v-for="(item,index) in orderList" :key="index" :label="item.orderNo" :value="item.orderNo">-->
        <!--              <span>{{ item.orderNo }}-&#45;&#45;{{ item.departName }}</span>-->
        <!--            </el-option>-->
        <!--          </el-select>-->
        <!--        </el-form-item>-->
        <el-form-item prop="lineId">
          <el-select v-model="queryParams.lineId" size="small" style="width: 180px;" placeholder="产线名称">
            <el-option label="全部" :value="''" />
            <el-option v-for="(item,index) in lineLists" :key="index" :label="item.lineName" :value="item.lineId" />
          </el-select>
        </el-form-item>
        <el-form-item prop="equipmentName">
          <el-input v-model="queryParams.equipmentName" clearable size="small" placeholder="设备名称" style="width: 180px;" />
        </el-form-item>
        <el-form-item>
          <start-date v-model="queryParams.startTime" />
          <end-date v-model="queryParams.endTime" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
          <el-button v-hasPermi="['productionsPlan:dquipmentDetails:excel']" :loading="btnLoading" type="warning" icon="el-icon-download" size="small" @click="handleExport">导出</el-button>
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
    <!-- 查看生产数量明细对话框 -->
    <el-dialog v-dialogDrag :close-on-click-modal="false" :modal-append-to-body="false" class="dialog" title="生产数量明细" :visible.sync="dialogVisible" width="1000px" append-to-body>
      <el-row>
        <el-col :span="24" class="l-m-b-8">设备编号：{{ productRecordDetail.equipmentCode }}</el-col>
        <el-col :span="4" class="l-m-b-8">设备序号：{{ productRecordDetail.equipmentNo }}</el-col>
        <el-col :span="4" class="l-m-b-8">日期：{{ productRecordDetail.workDate }}</el-col>

        <el-col :span="4">设备名称：{{ productRecordDetail.equipmentName }}</el-col>
      </el-row>
      <!-- <hr class="l-m-b-20"> -->
      <el-divider class="l-m-b-20" />
      <el-row>
        <!-- <h4 style="margin-top: 0px">生产明细</h4> -->
      </el-row>
      <el-row>
        <el-table v-loading="loading" border height="300" :data="productrecorddetailList">
          <el-table-column label="产品名称" align="center" prop="productName" show-overflow-tooltip />
          <el-table-column label="生产数量(件)" align="center" prop="productionQuantity" show-overflow-tooltip />
        </el-table>
      </el-row>
    </el-dialog>

  </div>
</template>

<script>
// import { getLine } from '@/api/line/line' // 获取产线列表
import { listeQuipment, listeQuipmentDetails } from '@/api/productionPlan/equipmentDetails'
import { mapGetters } from 'vuex'
import { downloadEquipmentDetails } from '@/api/excel/excel'
import { getlineSelect } from '@/api/commens'
export default {
  name: 'EquipmentDetails',
  data() {
    return {
      column: [
        { type: 'index', index: this.indexMethod, fixed: true },
        { label: '订单编号', prop: 'orderNo' },
        { label: '产线名称', prop: 'lineName' },
        { label: '设备名称', prop: 'equipmentName' },
        // { label: '设备编号', prop: 'equipmentCode' },
        { label: '设备序列号', prop: 'equipmentNo' },
        { label: '总生产数量(件)', prop: 'productionQuantity' },
        { label: '日期', prop: 'workDate' },
        { label: '操作', render: (h, scope) => {
          return (
            <div>
              <el-button
                v-hasPermi={['productionsPlan:dquipmentDetails:detail']}
                type='primary'
                size='mini'
                onClick={() => { this.handleDetail(scope.row) }}
              >查看详情</el-button>
            </div>
          )
        }, width: 200, fixed: 'right' }
      ],
      // 遮罩层(加载)
      loading: false,
      btnLoading: false,
      total: 0, // 列表总条数
      queryParams: { // 查询信息
        page: 1,
        limit: 20,
        departName: undefined, // 站点名称
        orderNo: undefined, // 订单编号
        lineId: undefined, // 订单编号
        equipmentName: undefined, // 产线名称
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
      lineLists: [], // 产线列表
      productRecordDetail: {},
      productrecorddetailList: []
    }
  },
  computed: { ...mapGetters(['orderList']) },
  async mounted() {
    [this.queryParams.startTime, this.queryParams.endTime] = this.getMonthDays()
    await this.handleLines()
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
    // 获取机器人列表
    getList() {
      this.loading = true
      listeQuipment(this.queryParams).then(res => {
        this.list = res.data
        this.total = res.count || 0
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 获取产线列表
    handleLines() {
      return new Promise((resolve) => {
        getlineSelect().then(res => {
          this.lineLists = res.data
          this.queryParams.lineId = this.lineLists[0].lineId
          resolve(this.lineLists)
        }).catch(() => {
          this.loading = false
        })
      })
    },
    // 查看详情
    handleDetail(row) {
      var data = {
        workDate: row.workDate,
        equimentId: row.equimentId
      }
      console.log('data', data)
      listeQuipmentDetails(data).then(response => {
        this.dialogVisible = true
        this.productRecordDetail = JSON.parse(JSON.stringify(row))
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
      downloadEquipmentDetails(this.queryParams).then((res) => {
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
        equipmentName: undefined, // 产线名称
        departName: undefined, // 站点名称
        orderNo: undefined, // 订单编号
        plannedQuantity: undefined // 计划生产数量
      }
      this.resetForm('form')
    }
  }
}
</script>
