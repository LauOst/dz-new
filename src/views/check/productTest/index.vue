<template>
  <div class="app-container">
    <el-card shadow="never" class="card">
      <el-form v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true">
        <el-form-item v-hasShow prop="orderId">
          <el-select v-model="queryParams.orderId" v-support size="small" style="width: 180px;" placeholder="订单编号">
            <el-option label="全部" :value="''" />
            <el-option v-for="(item,index) in orderLists" :key="index" :label="item.orderNo" :value="item.orderId">
              <span>{{ item.orderNo }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="lineId">
          <el-select v-model="queryParams.lineId" size="small" style="width: 180px;" placeholder="产线名称">
            <el-option label="全部" :value="''" />
            <el-option v-for="(item,index) in lineLists" :key="index" :label="item.lineName" :value="item.lineId" />
          </el-select>
        </el-form-item>
        <el-form-item prop="productName">
          <el-input
            v-model="queryParams.productName"
            placeholder="产品名称"
            clearable
            size="small"
            style="width: 180px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
          <el-button
            v-hasPermi="['products:productTest:add']"
            type="success"
            icon="el-icon-plus"
            size="small"
            @click="handleAdd"
          >
            新增
          </el-button>
          <el-button
            v-hasPermi="['products:productTest:excel']"
            :loading="btnLoading"
            type="warning"
            icon="el-icon-download"
            size="small"
            @click="handleExport"
          >导出
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-table
      ref="table"
      v-loading="loading"
      :data="list"
      style="width: 100%;"
      border
      height="600"
      @sort-change="sortChange"
    >
      <el-table-column
        type="index"
        label="序号"
        :index="indexMethod"
        width="50"
        align="center"
        fixed="left"
        show-overflow-tooltip
      />
      <el-table-column
        prop="orderNo"
        show-overflow-tooltip
        label="订单编号"
        width="140"
        align="center"
        sortable="column"
      />
      <el-table-column
        prop="lineName"
        show-overflow-tooltip
        label="产线名称"
        width="140"
        align="center"
        sortable="column"
      />
      <el-table-column
        prop="productName"
        show-overflow-tooltip
        label="产品名称"
        width="140"
        align="center"
        sortable="column"
      />
      <el-table-column
        prop="productNo"
        label="产品编号"
        align="center"
        width="120"
        show-overflow-tooltip
        sortable="column"
      />
      <el-table-column :prop="`${title}01`" :label="`${title}01`" align="center" show-overflow-tooltip />
      <el-table-column prop="compensationValue01" label="补偿值" align="center" show-overflow-tooltip />
      <el-table-column :prop="`${title}02`" :label="`${title}02`" align="center" show-overflow-tooltip />
      <el-table-column prop="compensationValue02" label="补偿值" align="center" show-overflow-tooltip />
      <el-table-column :prop="`${title}03`" :label="`${title}03`" align="center" show-overflow-tooltip />
      <el-table-column prop="compensationValue03" label="补偿值" align="center" show-overflow-tooltip />
      <el-table-column :prop="`${title}04`" :label="`${title}04`" align="center" show-overflow-tooltip />
      <el-table-column prop="compensationValue04" label="补偿值" align="center" show-overflow-tooltip />
      <el-table-column :prop="`${title}05`" :label="`${title}05`" align="center" show-overflow-tooltip />
      <el-table-column prop="compensationValue05" label="补偿值" align="center" show-overflow-tooltip />
      <el-table-column :prop="`${title}06`" :label="`${title}06`" align="center" show-overflow-tooltip />
      <el-table-column prop="compensationValue06" label="补偿值" align="center" show-overflow-tooltip />
      <el-table-column :prop="`${title}07`" :label="`${title}07`" align="center" show-overflow-tooltip />
      <el-table-column prop="compensationValue07" label="补偿值" align="center" show-overflow-tooltip />
      <el-table-column :prop="`${title}08`" :label="`${title}08`" align="center" show-overflow-tooltip />
      <el-table-column prop="compensationValue08" label="补偿值" align="center" show-overflow-tooltip />
      <el-table-column :prop="`${title}09`" :label="`${title}09`" align="center" show-overflow-tooltip />
      <el-table-column prop="compensationValue09" label="补偿值" align="center" show-overflow-tooltip />
      <el-table-column :prop="`${title}10`" :label="`${title}10`" align="center" show-overflow-tooltip />
      <el-table-column prop="compensationValue10" label="补偿值" align="center" show-overflow-tooltip />
      <el-table-column :prop="`${title}11`" :label="`${title}11`" align="center" show-overflow-tooltip />
      <el-table-column prop="compensationValue11" label="补偿值" align="center" show-overflow-tooltip />
      <el-table-column :prop="`${title}12`" :label="`${title}12`" align="center" show-overflow-tooltip />
      <el-table-column prop="compensationValue12" label="补偿值" align="center" show-overflow-tooltip />
      <el-table-column :prop="`${title}13`" :label="`${title}13`" align="center" show-overflow-tooltip />
      <el-table-column prop="compensationValue13" label="补偿值" align="center" show-overflow-tooltip />
      <el-table-column :prop="`${title}14`" :label="`${title}14`" align="center" show-overflow-tooltip />
      <el-table-column prop="compensationValue14" label="补偿值" align="center" show-overflow-tooltip />
      <el-table-column :prop="`${title}15`" :label="`${title}15`" align="center" show-overflow-tooltip />
      <el-table-column prop="compensationValue15" label="补偿值" align="center" show-overflow-tooltip />
      <el-table-column :prop="`${title}16`" :label="`${title}16`" align="center" show-overflow-tooltip />
      <el-table-column prop="compensationValue16" label="补偿值" align="center" show-overflow-tooltip />
      <el-table-column :prop="`${title}17`" :label="`${title}17`" align="center" show-overflow-tooltip />
      <el-table-column prop="compensationValue17" label="补偿值" align="center" show-overflow-tooltip />
      <el-table-column :prop="`${title}18`" :label="`${title}18`" align="center" show-overflow-tooltip />
      <el-table-column prop="compensationValue18" label="补偿值" align="center" show-overflow-tooltip />
      <el-table-column :prop="`${title}19`" :label="`${title}19`" align="center" show-overflow-tooltip />
      <el-table-column prop="compensationValue19" label="补偿值" align="center" show-overflow-tooltip />
      <el-table-column :prop="`${title}20`" :label="`${title}20`" align="center" show-overflow-tooltip />
      <el-table-column prop="compensationValue20" label="补偿值" align="center" show-overflow-tooltip />
      <el-table-column :prop="`${title}21`" :label="`${title}21`" align="center" show-overflow-tooltip />
      <el-table-column prop="compensationValue21" label="补偿值" align="center" show-overflow-tooltip />
      <el-table-column :prop="`${title}22`" :label="`${title}22`" align="center" show-overflow-tooltip />
      <el-table-column prop="compensationValue22" label="补偿值" align="center" show-overflow-tooltip />
      <el-table-column :prop="`${title}23`" :label="`${title}23`" align="center" show-overflow-tooltip />
      <el-table-column prop="compensationValue23" label="补偿值" align="center" show-overflow-tooltip />
      <el-table-column :prop="`${title}24`" :label="`${title}24`" align="center" show-overflow-tooltip />
      <el-table-column prop="compensationValue24" label="补偿值" align="center" show-overflow-tooltip />
      <el-table-column :prop="`${title}25`" :label="`${title}25`" align="center" show-overflow-tooltip />
      <el-table-column prop="compensationValue25" label="补偿值" align="center" show-overflow-tooltip />
      <el-table-column :prop="`${title}26`" :label="`${title}26`" align="center" show-overflow-tooltip />
      <el-table-column prop="compensationValue26" label="补偿值" align="center" show-overflow-tooltip />
      <el-table-column :prop="`${title}27`" :label="`${title}27`" align="center" show-overflow-tooltip />
      <el-table-column prop="compensationValue27" label="补偿值" align="center" show-overflow-tooltip />
      <el-table-column :prop="`${title}28`" :label="`${title}28`" align="center" show-overflow-tooltip />
      <el-table-column prop="compensationValue28" label="补偿值" align="center" show-overflow-tooltip />

      <el-table-column align="center" label="操作" fixed="right" width="280" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button v-hasPermi="['products:productTest:edit']" type="primary" size="mini" @click="handleEdit(scope)">
            检测编辑
          </el-button>
          <el-button
            v-hasPermi="['products:productTest:addcp']"
            type="primary"
            size="mini"
            @click="handleEditComparison(scope)"
          >
            比对值设置
          </el-button>
          <el-button v-hasPermi="['products:productTest:del']" type="danger" size="mini" @click="handleDelete(scope)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      pagination
      :page.sync="queryParams.page"
      :limit.sync="queryParams.limit"
      @pagination="getList"
    />
    <!-- 检测设置弹出层 -->
    <el-dialog
      v-dialogDrag
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      :visible.sync="dialogVisible"
      top="8vh"
      :title="dialogType==='edit'?'编辑检测配置':'新增检测配置'"
      class="dialog"
      width="1600px"
    >
      <el-form
        ref="formData"
        v-loading="loadingDialog"
        :model="formData"
        :rules="rules"
        label-width="0px"
        style=" margin:0 20px;"
      >
        <el-row :gutter="20">
          <!--          <el-col :span="5.5">-->
          <!--            <el-form-item v-if="departList.length > 0" label="" prop="departName">-->
          <!--              <el-select-->
          <!--                v-model="formData.departId"-->
          <!--                placeholder="请选择站点"-->
          <!--                :disabled="formData.isFlagId !== undefined"-->
          <!--                size="small"-->
          <!--                @change="changeDepart"-->
          <!--              >-->
          <!--                <el-option v-for="(item,index) in departList" :key="index" :label="item.departName" :value="item.id" />-->
          <!--              </el-select>-->
          <!--            </el-form-item>-->
          <!--          </el-col>-->
          <el-col :span="5.5">
            <el-form-item label="" prop="orderId">
              <el-select
                v-model="formData.orderId"
                placeholder="请选择订单"
                :disabled="formData.isFlagId !== undefined"
                size="small"
                @change="changeOrder"
              >
                <el-option v-for="(item,index) in orderList" :key="index" :label="item.orderNo" :value="item.orderId" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5.5">
            <el-form-item v-if="dialogType ==='new'? lineList.length > 0: true " label="" prop="lineType">
              <el-select
                v-model="formData.lineType"
                placeholder="请选择产线"
                :disabled="formData.isFlagId !== undefined"
                size="small"
                @change="changeLine"
              >
                <el-option v-for="(item,index) in lineList" :key="index" :label="item.lineName" :value="item.lineType" />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="5.5">
            <el-form-item v-if="productsList.length > 0" label="" prop="departName">
              <el-select
                v-model="formData.productNo"
                placeholder="产品名称"
                :disabled="formData.isFlagId !== undefined"
                size="small"
              >
                <el-option
                  v-for="(item,index) in productsList"
                  :key="index"
                  :label="item.productName"
                  :value="item.productNo"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5.5">
            <el-form-item v-if="formData.productNo !== undefined" label="" prop="departName" size="small">
              <el-input style="width: 200px" :value="formData.productNo" :disabled="formData.isFlagId !== undefined" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-card shadow="never" style="margin-bottom: 22px;height: 550px;overflow-y: scroll;" class="product-card">
          <el-row :gutter="40">
            <el-col
              v-for="(item, index) in testList"
              :key="index"
              :span="12"
              class="l-flex l-col-center"
              style="margin-bottom: 20px"
            >
              <el-checkbox v-model="item.isShow" style="margin-right: 20px" :true-label="0" :false-label="1">列表是否展示
              </el-checkbox>
              <el-checkbox v-model="item.whetherShow" style="margin-right: 20px" :true-label="0" :false-label="1">看板是否展示
              </el-checkbox>
              <el-form-item
                :label="item.tableColVal"
                :prop="item.tableColVal"
                label-width="90px"
                style="margin-right: 20px"
              >
                <el-input v-model="item.tableColCon" placeholder="请输入产品名称" style="width: 130px" />
              </el-form-item>
              <el-form-item
                :label="'补偿值' + (index+1 < 10 ? '0' + (index+1) : (index+1))"
                :prop="'set' + (index + 1)"
                :step="0.001"
                label-width="90px"
              >
                <el-input-number
                  v-model="item.compensationValue"
                  :step="0.001"
                  :min="0"
                  style="width: 130px"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>

      </el-form>
      <div style="text-align:right;">
        <el-button @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 比对值弹出层 -->
    <el-dialog
      v-dialogDrag
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      :visible.sync="dialogVisibleComparison"
      top="8vh"
      title="比对值设置"
      class="dialog"
      width="1400px"
    >
      <el-form
        ref="formData"
        v-loading="loadingDialog"
        :model="formData"
        :rules="rules"
        label-width="0px"
        style=" margin:0 20px;"
      >
        <el-row :gutter="20">
          <!--          <el-col :span="5.5">-->
          <!--            <el-form-item v-if="departList.length > 0" label="" prop="departName">-->
          <!--              <el-select v-model="formData.departId" placeholder="请选择站点" :disabled="formData.isFlagId !== undefined" size="small">-->
          <!--                <el-option v-for="(item,index) in departList" :key="index" :label="item.departName" :value="item.id" />-->
          <!--              </el-select>-->
          <!--            </el-form-item>-->
          <!--          </el-col>-->
          <el-col :span="5.5">
            <el-form-item label="" prop="orderId">
              <el-select
                v-model="formData.orderId"
                placeholder="请选择订单"
                :disabled="formData.isFlagId !== undefined"
                size="small"
                @change="changeOrder"
              >
                <el-option v-for="(item,index) in orderList" :key="index" :label="item.orderNo" :value="item.orderId" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5.5">
            <el-form-item label="" prop="lineType">
              <el-select
                v-model="formData.lineType"
                placeholder="请选择产线"
                :disabled="formData.isFlagId !== undefined"
                size="small"
                @change="changeLine"
              >
                <el-option v-for="(item,index) in lineList" :key="index" :label="item.lineName" :value="item.lineType" />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="5.5">
            <el-form-item v-if="productsList.length > 0" label="" prop="departName">
              <el-select v-model="formData.productNo" placeholder="请选择产品名称" :disabled="formData.isFlagId !== undefined" size="small">
                <el-option
                  v-for="(item,index) in productsList"
                  :key="index"
                  :label="item.productName"
                  :value="item.productNo"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5.5">
            <el-form-item v-if="formData.productNo !== undefined" label="" prop="departName">
              <el-input style="width: 200px" :value="formData.productNo" :disabled="formData.isFlagId !== undefined" size="small" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-card shadow="never" style="margin-bottom: 22px;height: 550px;overflow-y: scroll;" class="product-card">
          <el-row>
            <el-col
              v-for="(item, index) in testList"
              :key="index"
              :span="24"
              class="l-flex l-col-center"
              style="margin-bottom: 20px"
            >
              <el-form-item
                :label="item.tableColVal"
                :prop="item.tableColVal"
                label-width="90px"
                style="margin-right: 20px"
              >
                <el-input v-model="item.tableColCon" placeholder="请输入产品名称" style="width: 200px" />
              </el-form-item>
              <el-form-item label="标准值" label-width="80px" style="margin-right: 20px">
                <el-input-number
                  v-model="item.standardValue"
                  controls-position="right"
                  :precision="3"
                  :step="0.001"
                  :min="0"
                  style="width: 150px"
                />
              </el-form-item>
              <el-form-item label="上限值" label-width="80px" style="margin-right: 20px">
                <el-input-number
                  v-model="item.upperValue"
                  controls-position="right"
                  :precision="3"
                  :step="0.001"
                  :min="0"
                  style="width: 150px"
                />
              </el-form-item>
              <el-form-item label="下限值" label-width="80px" style="margin-right: 20px">
                <el-input-number
                  v-model="item.lowerValue"
                  controls-position="right"
                  :precision="3"
                  :step="0.001"
                  :max="item.upperValue"
                  :min="0"
                  style="width: 150px"
                />
              </el-form-item>
              <el-form-item label="偏移值" label-width="80px">
                <el-input v-model="item.deviationValue" placeholder="请输入偏移值" :disabled="true" />
                <span style="display: none">{{ subb }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>

      </el-form>
      <div style="text-align:right;">
        <el-button @click="dialogVisibleComparison=false">取消</el-button>
        <el-button type="primary" @click="submitFormComparison">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listTest, listTestAll, addTest, updateTest, updateComparison, delTest } from '@/api/product/productTest'
import Pagination from '@/components/Pagination'
import { downloadProductText } from '@/api/excel/excel'
import { getLineByOrderIdNew, getlineSelect, getOrderByDepartId, getOrderWorkpiece, getOrderSelect } from '@/api/commens'
/*
  queryParams:角色列表请求参数
  departList:站点列表
  total:列表总条数
  dialogVisible:是否显示 Dialog
  dialogType:控制表头显示内容
  role:弹出层数据对象
* */

export default {
  name: 'ProductTest',
  components: { Pagination },
  data() {
    return {
      title: 'detect',
      checked: true,
      loading: false,
      loadingDialog: false,
      btnLoading: false,
      // 显示搜索条件
      showSearch: true,
      // 分页搜索参数
      queryParams: {
        page: 1,
        limit: 20,
        productName: undefined,
        orderId: undefined,
        lineId: undefined,
        field: undefined,
        type: undefined
      },
      // 设备列表
      list: [],
      // 分页数据
      total: 0,
      dialogVisible: false,
      dialogVisibleComparison: false,
      dialogType: 'new',
      // 表单信息
      formData: {},
      departList: [], // 站点列表
      orderList: [], // 订单列表
      orderLists: [], // 订单列表
      lineList: [], // 产线列表
      lineLists: [], // 产线列表
      productsList: [], // 产品名称
      testList: [], // 配置项列表
      // 表单校验
      rules: {
        departId: [
          { required: true, message: '请选择站点', trigger: 'change' }
        ],
        productName: [
          { required: true, message: '产品名称不能为空', trigger: 'blur' }
        ],
        productNo: [
          { required: true, message: '产品编号不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    // 计算偏移值
    subb() {
      if (this.formData.dbDetectTempVos && this.formData.dbDetectTempVos !== null && this.formData.dbDetectTempVos.length > 0) {
        this.formData.dbDetectTempVos.forEach((e, i) => {
          e.deviationValue = (e.upperValue - e.lowerValue).toFixed(3)
        })
      }
      return this.formData
    }
  },
  mounted() {
    this.getList()
    this.handleLines()
    this.handleOrders()
  },
  // 解决表格错位问题
  activated() {
    this.$nextTick(() => {
      this.$refs.table.doLayout()
    })
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
    // 获取配置项列表
    getListTestAll(checkModel, editingMode, edit) {
      this.loadingDialog = true
      return new Promise((resolve, reject) => {
        listTestAll(checkModel, editingMode).then(res => {
          if (res.data.departs || res.data.departs !== null) {
            this.departList = res.data.departs
          }
          if (res.data.dzDetectTempVos || res.data.dzDetectTempVos !== null) {
            this.testList = res.data.dzDetectTempVos
          }
          if (res.data.dbDetectTempVos || res.data.dbDetectTempVos !== null) {
            this.testList = res.data.dbDetectTempVos
          }
          if (res.data.products || res.data.products !== null) {
            this.productsList = res.data.products
          }
          if (edit) {
            this.formData = Object.assign(res.data, { isFlagId: '0' })
            this.formData.departId = this.formData.departId.toString()
          }
          this.loadingDialog = false
          resolve(
            this.formData
          )
        })
      })
    },
    /** 查询检测配置列表 */
    getList() {
      this.loading = true
      listTest(this.queryParams).then(
        response => {
          this.list = response.data
          this.total = response.count || 0
          this.loading = false
        }
      ).catch(() => {
        this.loading = false
      })
    },
    // 获取订单列表
    handleOrders() {
      getOrderSelect().then(res => {
        this.orderLists = res.data
      }).catch(() => {
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

    // 新增产品按钮
    async handleAdd() {
      this.orderList = []
      this.lineList = []
      this.reset()
      this.dialogType = 'new'
      this.dialogVisible = true
      await this.getListTestAll()
      this.changeDepart()
    },

    // 切换站点事件
    changeDepart() {
      getOrderByDepartId().then(res => {
        this.orderList = res.data
      })
      // this.getListTestAll({ checkModel: false, departId: e })
    },
    // 切换订单事件
    changeOrder(e) {
      this.formData.lineType = undefined
      this.formData.productNo = undefined
      this.lineList = []
      this.productsList = []
      getLineByOrderIdNew(e).then(res => {
        this.lineList = res.data
      })
      const arr = this.orderList.filter(t => t.orderId === e)
      this.formData.orderNo = arr[0].orderNo
    },
    // 切换产险事件
    changeLine(e) {
      this.formData.productNo = undefined
      this.productsList = []
      getOrderWorkpiece({ lineType: e }).then(res => {
        this.productsList = res.data
      })
      const arr = this.lineList.filter(t => t.lineType === e)
      console.log('arr1', arr)
      this.formData.lineId = arr[0].lineId
      this.formData.lineNo = arr[0].lineNo
    },
    // 编辑按钮
    async handleEdit(scope, editingMode, edit = true) {
      this.reset()
      getOrderByDepartId().then(res => {
        this.orderList = res.data
      })
      this.dialogType = 'edit'
      this.dialogVisible = true
      const obj = {
        checkModel: true,
        departId: scope.row.departId,
        groupId: scope.row.groupId,
        productNo: scope.row.productNo
      }
      await this.getListTestAll(obj, editingMode, edit)
    },
    // 比对值设置按钮
    async handleEditComparison(scope, editingMode, edit = true) {
      this.reset()
      getOrderByDepartId({ departId: scope.row.departId }).then(res => {
        this.orderList = res.data
      })
      this.dialogVisibleComparison = true
      const obj = {
        checkModel: true,
        editingMode: true,
        departId: scope.row.departId,
        groupId: scope.row.groupId,
        productNo: scope.row.productNo
      }
      await this.getListTestAll(obj, editingMode, edit)
    },
    /** 删除按钮操作 */
    handleDelete(scope) {
      const groupId = scope.row.groupId
      this.$confirm('是否确认删除名称为"' + scope.row.productName + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return delTest(groupId)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(() => {
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['formData'].validate(valid => {
        if (valid) {
          if (this.dialogType === 'edit') {
            this.formData.detectionTemplates = this.testList
            updateTest(this.formData).then(response => {
              this.msgSuccess('修改成功')
              this.dialogVisible = false
              this.getList()
            })
          } else {
            this.formData.detectionTemplates = this.testList
            addTest(this.formData).then(response => {
              this.msgSuccess('新增成功')
              this.dialogVisible = false
              this.getList()
            })
          }
        }
      })
    },
    // 比对值提交按钮
    submitFormComparison(scope) {
      updateComparison(this.formData).then(res => {
        this.msgSuccess('修改成功')
        this.dialogVisibleComparison = false
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
      this.dateRange = []
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 导出按钮
    handleExport() {
      this.btnLoading = true
      downloadProductText(this.queryParams).then((res) => {
        this.btnLoading = false
        if (!res.data) return
        this.$downloadFunc(res, '产品检测')
      }).catch((err) => {
        console.log('err', err)
        this.btnLoading = false
      })
    },
    // 表单重置
    reset() {
      this.formData = {
        isFlagId: undefined,
        departId: undefined,
        orderId: undefined,
        lineType: undefined,
        lineNo: undefined,
        lineId: undefined,
        orderNo: undefined,
        productNo: undefined,
        groupId: undefined,
        detectionTemplates: []
        // detectionTemplates: this.testList
      }
      this.productsList = []
      this.testList = []
      this.departList = []
      this.resetForm('formData')
    },
    // 过滤设备类型
    deviceTypeFormat(row) {
      const obj = {
        1: '搬运机器人',
        2: '焊接机器人',
        3: '数控设备',
        4: '清洗机',
        5: '检测设备' }
      return obj[row.equipmentType]
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

