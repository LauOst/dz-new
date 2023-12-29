<template>
  <div class="app-container">
    <!-- 头部筛选 -->
    <el-card shadow="never" class="card">
      <el-form ref="queryForm" :inline="true" :model="queryParams">
        <el-form-item v-hasShow prop="orderId">
          <el-select v-model="queryParams.orderId" v-support size="small" style="width: 180px;" placeholder="订单编号">
            <el-option label="全部" :value="''" />
            <el-option v-for="(item,index) in orderList" :key="index" :label="item.orderNo" :value="item.orderId">
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
        <el-form-item prop="workCode">
          <el-input v-model="queryParams.workCode" v-support size="small" clearable placeholder="工序编号" style="width: 180px;" />
        </el-form-item>
        <el-form-item prop="workName">
          <el-input v-model="queryParams.workName" v-support size="small" clearable placeholder="工序名称" style="width: 180px;" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
          <el-button v-hasPermi="['report:procedure:add']" type="success" icon="el-icon-plus" size="small" @click="handleAdd">
            新增
          </el-button>
          <el-button v-hasPermi="['report:procedure:excel']" :loading="btnLoading" type="warning" icon="el-icon-download" size="small" @click="handleExport">导出</el-button>
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

    <!--新增/编辑设备-->
    <el-dialog v-dialogDrag :close-on-click-modal="false" :modal-append-to-body="false" :title="dialogType==='edit'?'编辑设备':'新增设备'" :visible.sync="dialogVisible" class="dialog" width="530px">
      <el-form ref="formData" :model="formData" :rules="addFormRules" label-width="90px" style="width: 400px; margin-left:40px;">
        <el-form-item label="订单编号" prop="orderId">
          <!--          <el-select v-model="formData.orderId" :disabled="formData.id !== undefined" placeholder="订单编号" style="width: 100%;" @change="changeOrder">-->
          <el-select v-model="formData.orderId" placeholder="订单编号" style="width: 100%;" @change="changeOrder">
            <el-option v-for="(item,index) in orderList" :key="index" :label="item.orderNo" :value="item.orderId">
              <span>{{ item.orderNo }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="isShowPro" label="产线名称" prop="lineId">
          <!--          <el-select v-model="formData.lineId" :disabled="formData.id !== undefined" placeholder="请选择产线" style="width: 100%;">-->
          <el-select v-model="formData.lineId" placeholder="请选择产线" style="width: 100%;">
            <el-option v-for="(item,index) in lineList" :key="index" :label="item.lineName" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="排序码" prop="sortCode">
          <el-input-number v-model="formData.sortCode" controls-position="right" :min="0" />
        </el-form-item>
        <el-form-item label="工序名称" prop="workName">
          <el-input v-model="formData.workName" clearable placeholder="请输入工序名称" />
        </el-form-item>
        <el-form-item label="工序编号" prop="workCode">
          <!--          <el-input v-model="formData.equipmentCode" :disabled="formData.id !== undefined" clearable placeholder="请输入机器人编号" />-->
          <el-input v-model="formData.workCode" clearable placeholder="请输入工序编号" />
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
import { getlineSelect, getOrderSelect, getLineByOrderId } from '@/api/commens' // 获取产线列表
import { listProcedure, addProcedure, updateProcedure, delProcedure } from '@/api/report/procedure'
import { downloadProcedure } from '@/api/excel/excel'

export default {
  name: 'Procedure',
  data() {
    return {
      column: [
        { type: 'index', index: this.indexMethod, fixed: true },
        { label: '订单编号', prop: 'orderNo' },
        // { label: '归属站点', prop: 'departName' },
        { label: '产线名称', prop: 'lineName' },
        { label: '工序编号', prop: 'workCode' },
        { label: '工序名称', prop: 'workName' },
        { label: '排序码', prop: 'sortCode' },
        { label: '操作', render: (h, scope) => {
          return (
            <div>
              <el-button
                v-hasPermi={['report:procedure:edit']}
                type='primary'
                size='mini'
                onClick={() => { this.handleEdit(scope) }}
              >编辑</el-button>
              <el-button
                v-hasPermi={['report:procedure:del']}
                type='danger'
                size='mini'
                onClick={() => { this.handleDelete(scope) }}
              >删除</el-button>

            </div>
          )
        }, width: 200 }
      ],
      // <el-button
      //   v-hasPermi={['report:procedure:bind']}
      //   type='success'
      //   size='mini'
      //   onClick={() => { this.handleBind(scope) }}
      // >检测项绑定</el-button>
      // 遮罩层(加载)
      loading: false,
      btnLoading: false,
      total: 0, // 列表总条数
      queryParams: { // 查询信息
        page: 1,
        limit: 20,
        lineId: undefined, // 产线id
        departId: undefined, // 产线id
        orderId: undefined, // 订单编号
        workCode: undefined, // 工序编码
        workName: undefined, // 工序名称
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
        sortCode: [
          { required: true, message: '请输入排序码', trigger: 'blur' }
        ],
        workCode: [
          { required: true, message: '请输入工序编号', trigger: 'blur' }
        ],
        workName: [
          { required: true, message: '请输入工序名称', trigger: 'blur' }
        ]
      },
      lineLists: [], // 产线列表
      lineList: [], // 产线列表
      orderList: [], // 产线列表
      isShowPro: false
    }
  },
  mounted() {
    this.getList()
    this.handleOrder()
    this.handleLines()
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
    // 获取机器人列表
    getList() {
      this.loading = true
      listProcedure(this.queryParams).then(res => {
        this.list = res.data
        this.total = res.count || 0
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 选择订单列表
    changeOrder(id) {
      this.formData.lineId = undefined
      this.formData.departId = undefined
      this.isShowPro = true
      var data = this.orderList.filter((item) => {
        return item.orderId === id
      })
      this.formData.departId = data[0].departId
      this.handleLine(id)
    },
    // 获取订单列表
    handleOrder() {
      getOrderSelect().then(res => {
        this.orderList = res.data
      }).catch(() => {
        this.loading = false
      })
    },
    // 根据订单id获取产线列表
    handleLine(id) {
      getLineByOrderId(id).then(res => {
        this.lineList = res.data.map(item => {
          item.id = String(item.id)
          return item
        })
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
    // 新增设备
    handleAdd() {
      this.isShowPro = false
      this.reset()
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    // 编辑设备
    handleEdit(scope) {
      this.isShowPro = true
      this.reset()
      this.handleLine(scope.row.orderId)
      this.formData = JSON.parse(JSON.stringify(scope.row))
      this.dialogType = 'edit'
      this.dialogVisible = true
    },
    // 绑定产品检测项
    // handleBind(scope) {
    //   console.log('scope', scope)
    //   this.$router.push({ path: '/procedure/type/data/' + scope.row.workingProcedureId })
    // },
    // 提交设备信息
    handleSubmit() {
      this.$refs['formData'].validate((valid) => {
        if (valid) {
          if (this.dialogType !== 'new') { // 编辑
            updateProcedure(this.formData).then(res => {
              this.$message.success(res.msg)
              this.dialogVisible = false
              this.passVisible = false
              this.getList()
            })
          } else {
            addProcedure(this.formData).then(res => {
              this.$message.success(res.msg)
              this.dialogVisible = false
              this.passVisible = false
              this.getList()
            })
          }
        }
      })
    },

    /** 删除按钮操作 */
    handleDelete(scope) {
      const workingProcedureId = scope.row.workingProcedureId
      this.$confirm('是否确认删除工序名称为"' + scope.row.workName + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return delProcedure(workingProcedureId)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(() => {})
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
      downloadProcedure(this.queryParams).then((res) => {
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
      this.formData = {
        orderId: undefined,
        lineId: undefined,
        workCode: undefined, // 工序编号
        workName: undefined, // 工序名称
        sortCode: 0 // 排序码
      }
      this.resetForm('formData')
    },
    // 过滤设备类型
    equipmentFormat(row) {
      const obj = {
        1: '检测设备',
        2: '机床',
        3: '机器人',
        4: '相机'
      }
      return obj[row.equipmentType]
    }
  }
}
</script>

<style>

</style>
