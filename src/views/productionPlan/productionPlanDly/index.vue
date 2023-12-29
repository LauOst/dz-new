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
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
          <el-button v-hasPermi="['productionsPlan:productionsPlanDly:excel']" :loading="btnLoading" type="warning" icon="el-icon-download" size="small" @click="handleExport">导出</el-button>
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
    <!-- 修改生产计划设置对话框 -->
    <el-dialog v-dialogDrag :close-on-click-modal="false" :modal-append-to-body="false" class="dialog" title="修改生产计划" :visible.sync="dialogVisible" width="500px" append-to-body>
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="日订单生产计划" prop="plannedQuantity">
          <el-input-number v-model="form.plannedQuantity" controls-position="right" :min="0" label="请输入日订单生产计划" />
          <span> 件</span>
        </el-form-item>
        <el-form-item label="周订单生产计划" prop="weekClasses">
          <el-input-number v-model="form.weekClasses" controls-position="right" :min="0" label="请输入日订单生产计划" />
          <span> 件</span>
        </el-form-item>
        <el-form-item label="年订单生产计划" prop="yaerClasses">
          <el-input-number v-model="form.yaerClasses" controls-position="right" :min="0" label="请输入日订单生产计划" />
          <span> 件</span>
        </el-form-item>
        <el-form-item label="班次生产计划" prop="dayClasses">
          <el-input-number v-model="form.dayClasses" controls-position="right" :min="0" label="请输入班次生产计划" />
          <span> 件</span>
        </el-form-item>
      </el-form>
      <!-- 操作按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button type="plain" @click="dialogVisible = false">取消</el-button>
        <el-popover v-model="passVisible" placement="top" width="160">
          <p>确认提交？</p>
          <div style="text-align: right; margin: 0">
            <el-button size="small" type="text" @click="passVisible = false">取消</el-button>
            <el-button type="primary" size="small" @click="handleSubmit">确定</el-button>
          </div>
          <el-button slot="reference" class="l-m-l-10" type="primary">提交</el-button>
        </el-popover>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { listProductionPlanDly, updateProduction } from '@/api/productionPlan/productionPlanDly'
import { getlineSelect } from '@/api/commens'
import { mapGetters } from 'vuex'
import { downloadPlanDly } from '@/api/excel/excel' // 获取产线列表

export default {
  name: 'ProductionPlanDly',
  data() {
    return {
      column: [
        { type: 'index', index: this.indexMethod, fixed: true },
        { label: '订单编号', prop: 'orderNo' },
        // { label: '归属站点', prop: 'departName' },
        { label: '产线名称', prop: 'lineName' },
        { label: '日订单生产计划(件)', prop: 'plannedQuantity' },
        { label: '周订单生产计划(件)', prop: 'weekClasses' },
        { label: '年订单生产计划(件)', prop: 'yaerClasses' },
        { label: '班次生产计划(件)', prop: 'dayClasses' },
        { label: '操作', render: (h, scope) => {
          return (
            <div>
              <el-button
                v-hasPermi={['productionsPlan:productionsPlanDly:update']}
                type='primary'
                size='mini'
                onClick={() => { this.handleDetail(scope.row) }}
              >修改日计划</el-button>
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
        lineId: undefined, // 产线名称
        plannedQuantity: undefined,
        field: undefined,
        type: undefined
      },
      list: [], // 表格数据
      dialogVisible: false, // 新增弹窗
      passVisible: false, // 确认气泡框
      form: {},
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
    sortChange(column) {
      this.$mySort(this.queryParams, column, this.getList)
    },
    // 获取机器人列表
    getList() {
      this.loading = true
      listProductionPlanDly(this.queryParams).then(res => {
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
      this.loadingDetail = true
      this.dialogVisible = true
      this.form = JSON.parse(JSON.stringify(row))
    },
    // 提交设备信息
    handleSubmit() {
      updateProduction(this.form).then(response => {
        this.$message.success(response.msg)
        this.dialogVisible = false
        this.passVisible = false
        this.getList()
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
    // 导出按钮
    handleExport() {
      this.btnLoading = true
      downloadPlanDly(this.queryParams).then((res) => {
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
        plannedQuantity: undefined, // 计划生产数量
        weekClasses: undefined, // 计划生产数量
        yaerClasses: undefined, // 计划生产数量
        dayClasses: undefined // 计划生产数量
      }
      this.resetForm('form')
    }
  }
}
</script>

<style scoped>

</style>
