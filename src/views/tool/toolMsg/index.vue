<template>
  <div class="app-container">
    <el-card shadow="never" class="card">
      <el-form ref="queryForm" :model="queryParams" :inline="true">
        <!--        <el-form-item v-hasShow prop="orderNo">-->
        <!--          <el-select v-model="queryParams.orderNo" v-support size="small" style="width: 180px;" placeholder="订单编号">-->
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
        <el-form-item prop="equipmentNo">
          <el-input
            v-model="queryParams.equipmentNo"
            placeholder="机床编码"
            clearable
            size="small"
            style="width: 180px"
          />
        </el-form-item>
        <el-form-item prop="groupNo">
          <el-input
            v-model="queryParams.groupNo"
            placeholder="刀具组编码"
            clearable
            size="small"
            style="width: 180px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
          <el-button v-hasPermi="['tool:toolMsg:excel']" :loading="btnLoading" type="warning" icon="el-icon-download" size="small" @click="handleExport">导出</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <dz-table
      v-loading="loading"
      :column="useOrgCode === 'zmj_2183' ? columnZmj : column "
      :data="list"
      :total="total"
      pagination
      :page.sync="queryParams.page"
      :limit.sync="queryParams.limit"
      @pagination="getList"
      @sortChange="sortChange"
    />
    <!--    <el-table-->
    <!--      ref="table"-->
    <!--      v-loading="loading"-->
    <!--      :data="list"-->
    <!--      style="width: 100%;"-->
    <!--      border-->
    <!--      height="600"-->
    <!--    >-->
    <!--      <el-table-column type="index" label="序号" :index="indexMethod" width="100" align="center" fixed="left" show-overflow-tooltip />-->
    <!--      <el-table-column prop="orderNo" label="订单编号" align="center" width="100" show-overflow-tooltip />-->
    <!--      &lt;!&ndash;      <el-table-column prop="orderNo" label="站点名称" align="center" width="100" show-overflow-tooltip />&ndash;&gt;-->
    <!--      <el-table-column prop="lineName" label="产线名称" align="center" width="100" show-overflow-tooltip />-->
    <!--      <el-table-column prop="equipmentNo" label="机床编号" align="center" width="100" show-overflow-tooltip />-->
    <!--      <el-table-column prop="groupNo" label="刀具组编号" align="center" width="100" show-overflow-tooltip />-->
    <!--      <el-table-column prop="toolNo" label="刀具编号" align="center" width="100" show-overflow-tooltip />-->
    <!--      <el-table-column prop="toolLife" label="刀具寿命" align="center" width="100" show-overflow-tooltip />-->
    <!--      <el-table-column prop="toolLifeCounter" label="刀具寿命计数" align="center" width="120" show-overflow-tooltip />-->
    <!--      <el-table-column prop="toolLifeCounterType" label="刀具寿命计数类型" align="center" width="140" show-overflow-tooltip />-->
    <!--      <el-table-column prop="toolGeometryX" label="刀具X轴(形状)" align="center" width="120" show-overflow-tooltip />-->
    <!--      <el-table-column prop="toolGeometryY" label="刀具Y轴(形状)" align="center" width="120" show-overflow-tooltip />-->
    <!--      <el-table-column prop="toolGeometryZ" label="刀具Z轴(形状)" align="center" width="120" show-overflow-tooltip />-->
    <!--      <el-table-column prop="toolGeometryC" label="刀具C轴(形状)" align="center" width="120" show-overflow-tooltip />-->
    <!--      <el-table-column prop="toolGeometryRadius" label="刀具半径(形状)" align="center" width="120" show-overflow-tooltip />-->
    <!--      <el-table-column prop="toolWearX" label="刀具X轴(磨损)" align="center" width="120" show-overflow-tooltip />-->
    <!--      <el-table-column prop="toolWearY" label="刀具Y轴(磨损)" align="center" width="120" show-overflow-tooltip />-->
    <!--      <el-table-column prop="toolWearZ" label="刀具Z轴(磨损)" align="center" width="120" show-overflow-tooltip />-->
    <!--      <el-table-column prop="toolWearC" label="刀具C轴(磨损)" align="center" width="120" show-overflow-tooltip />-->
    <!--      <el-table-column prop="toolWearRadius" label="刀具半径(磨损)" align="center" width="120" show-overflow-tooltip />-->
    <!--      <el-table-column prop="updateTime" label="时间" align="center" width="160" show-overflow-tooltip />-->
    <!--    </el-table>-->

  </div>
</template>

<script>
import { getToolInfoDataList } from '@/api/check/toolMsg'
import { downloadToolMsg } from '@/api/excel/excel'
import { mapGetters } from 'vuex'
import { getlineSelect } from '@/api/commens'
/*
  queryParams:角色列表请求参数
  departList:站点列表
  total:列表总条数
  dialogVisible:是否显示 Dialog
  dialogType:控制表头显示内容
  role:弹出层数据对象
  defaultProps:配置子树节点属性
  checkStrictly:在显示复选框的情况下，是否严格的遵循父子不互相关联的做法
  menuOptions:树数据
* */

export default {
  name: 'ToolMsg',
  data() {
    return {
      // 表格信息
      column: [
        { type: 'index', index: this.indexMethod, fixed: true },
        // { label: '订单编号', prop: 'orderNo', width: 110 },
        { label: '产线名称', prop: 'lineName', width: 140 },
        { label: '机床编号', prop: 'equipmentNo', width: 110 },
        { label: '刀具组编号', prop: 'groupNo', width: 120 },
        { label: '刀具编号', prop: 'toolNo', width: 110 },
        { label: '刀具寿命', prop: 'toolLife', width: 110 },
        { label: '刀具寿命计数', prop: 'toolLifeCounter', width: 130 },
        { label: '刀具寿命计数类型', prop: 'toolLifeCounterType', width: 160, formatter: this.toolLifeCounterTypeFormat },
        { label: '刀具X轴(形状)', prop: 'toolGeometryX', width: 140 },
        { label: '刀具Y轴(形状)', prop: 'toolGeometryY', width: 140 },
        { label: '刀具Z轴(形状)', prop: 'toolGeometryZ', width: 140 },
        { label: '刀具C轴(形状)', prop: 'toolGeometryC', width: 140 },
        { label: '刀具半径(形状)', prop: 'toolGeometryRadius', width: 140 },
        { label: '刀具X轴(磨损)', prop: 'toolWearX', width: 140 },
        { label: '刀具Y轴(磨损)', prop: 'toolWearY', width: 140 },
        { label: '刀具Z轴(磨损)', prop: 'toolWearZ', width: 140 },
        { label: '刀具C轴(磨损)', prop: 'toolWearC', width: 140 },
        { label: '刀具半径(磨损)', prop: 'toolWearRadius', width: 140 },
        { label: '时间', prop: 'updateTime', width: 180 }
      ],
      columnZmj: [
        { type: 'index', index: this.indexMethod, fixed: true },
        // { label: '订单编号', prop: 'orderNo', width: 110 },
        { label: '产线名称', prop: 'lineName' },
        { label: '机床编号', prop: 'equipmentNo' },
        { label: '刀具组编号', prop: 'groupNo' },
        { label: '刀具编号', prop: 'toolNo' },
        { label: '刀具寿命', prop: 'toolLife' },
        { label: '刀具寿命计数', prop: 'toolLifeCounter' },
        { label: '刀具寿命计数类型', prop: 'toolLifeCounterType', formatter: this.toolLifeCounterTypeFormat }
      ],
      loading: true,
      btnLoading: false,
      // 分页搜索参数
      queryParams: {
        page: 1,
        limit: 20,
        orderNo: undefined,
        lineId: undefined,
        equipmentNo: undefined,
        groupNo: undefined,
        field: undefined,
        type: undefined
      },
      // 站点列表
      list: [],
      lineLists: [], // 产线列表
      // 分页数据
      total: 0,
      dialogVisible: false,
      dialogType: 'new',
      // 表单信息
      departForm: {}
    }
  },
  computed: { ...mapGetters(['orderList', 'useOrgCode']) },
  mounted() {
    this.getList()
    this.handleLines()
  },
  methods: {
    // 格式化序号
    indexMethod(index) {
      return (this.queryParams.page - 1) * this.queryParams.limit + index + 1
    },
    sortChange(column) {
      this.$mySort(this.queryParams, column, this.getList)
    },
    /** 查询站点列表 */
    getList() {
      this.loading = true
      getToolInfoDataList(this.queryParams).then(
        response => {
          this.list = response.data
          this.total = response.count
          this.loading = false
        }
      ).catch(() => {
        this.loading = false
      })
    },
    // 获取产线列表
    handleLines() {
      getlineSelect().then(res => {
        this.lineLists = res.data
      }).catch(() => {
        this.loading = false
      })
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 导出按钮
    handleExport() {
      this.btnLoading = true
      downloadToolMsg(this.queryParams).then((res) => {
        this.btnLoading = false
        if (!res.data) return
        this.$downloadFunc(res, '刀具信息')
      }).catch((err) => {
        console.log('err', err)
        this.btnLoading = false
      })
    },
    toolLifeCounterTypeFormat(row, column) {
      let text
      if (row.toolLifeCounterType === 0) {
        text = '数量'
      } else {
        text = '分钟'
      }
      return text
    }
  }
}
</script>

