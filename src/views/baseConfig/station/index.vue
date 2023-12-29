<template>
  <div class="app-container">
    <!-- 头部筛选 -->
    <el-card shadow="never" class="card">
      <el-form ref="queryForm" :inline="true" :model="queryParams">
        <el-form-item v-hasShow prop="orderId">
          <el-select v-model="queryParams.orderId" size="small" style="width: 180px;" placeholder="订单编号">
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
          <el-input
            v-model="queryParams.workCode"
            v-support
            size="small"
            clearable
            placeholder="工序编号"
            style="width: 180px;"
          />
        </el-form-item>
        <el-form-item prop="stationCode">
          <el-input
            v-model="queryParams.stationCode"
            v-support
            size="small"
            clearable
            placeholder="工位编号"
            style="width: 180px;"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
          <el-button
            v-hasPermi="['report:station:add']"
            type="success"
            icon="el-icon-plus"
            size="small"
            @click="handleAdd"
          >
            新增
          </el-button>
          <el-button
            v-hasPermi="['report:station:excel']"
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

    <!--新增/编辑工位-->
    <el-dialog
      v-dialogDrag
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      :title="dialogType==='edit'?'编辑工位':'新增工位'"
      :visible.sync="dialogVisible"
      class="dialog"
      width="530px"
    >
      <el-form
        ref="formData"
        :model="formData"
        :rules="addFormRules"
        label-width="110px"
        style="width: 400px; margin-left:40px;"
      >

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
          <el-select v-model="formData.lineId" placeholder="请选择产线" style="width: 100%;" @change="changeLine">
            <el-option v-for="(item,index) in lineList" :key="index" :label="item.lineName" :value="item.id" />
          </el-select>
        </el-form-item>

        <el-form-item v-if="formData.orderId && formData.lineId" label="工序名称" prop="orderId">
          <!--          <el-select v-model="formData.orderId" :disabled="formData.id !== undefined" placeholder="订单编号" style="width: 100%;" @change="changeOrder">-->
          <el-select
            v-model="formData.workingProcedureId"
            placeholder="工序名称"
            style="width: 100%;"
          >
            <el-option
              v-for="(item,index) in processList"
              :key="index"
              :label="item.workName"
              :value="item.workingProcedureId"
            >
              <span>{{ item.workName }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序码" prop="sortCode">
          <el-input-number v-model="formData.sortCode" controls-position="right" :min="0" />
        </el-form-item>
        <el-form-item label="工位名称" prop="lineId">
          <el-input v-model="formData.stationName" clearable placeholder="请输入工位名称" />
        </el-form-item>
        <el-form-item label="工位编号" prop="stationCode">
          <el-input v-model="formData.stationCode" clearable placeholder="请输入工位编号" />
        </el-form-item>
        <el-form-item label="报工工位编号" prop="dzStationCode">
          <el-input v-model="formData.dzStationCode" clearable placeholder="请输入报工工位编号" />
        </el-form-item>
        <el-form-item label-width="0">
          <div class="lable-swich-lg">是否出料</div>
          <div class="radio-wrap-lg">
            <el-radio-group v-model="formData.outFlag">
              <el-radio label="1">是</el-radio>
              <el-radio label="0">否</el-radio>
            </el-radio-group>
          </div>
        </el-form-item>
        <el-form-item label-width="0">
          <div class="lable-swich-lg">是否NG工位</div>
          <div class="radio-wrap-lg">
            <el-radio-group v-model="formData.ngCode">
              <el-radio label="1">是</el-radio>
              <el-radio label="0">否</el-radio>
            </el-radio-group>
          </div>
        </el-form-item>
        <el-form-item label="合并工位标识" prop="mergeCode">
          <el-input v-model="formData.mergeCode" clearable placeholder="请输入工位标识" />
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
import { listStation, addStation, updateStation, delStation, updateShow } from '@/api/report/station'
import { listProcedure } from '@/api/report/procedure'
import { downloadStation } from '@/api/excel/excel'

export default {
  name: 'Station',
  data() {
    return {
      column: [
        { type: 'index', index: this.indexMethod, fixed: true },
        { label: '订单编号', prop: 'orderNo' },
        { label: '产线名称', prop: 'lineName' },
        { label: '工序编号', prop: 'workcode' },
        { label: '工序名称', prop: 'workName' },
        { label: '工位编号', prop: 'stationCode' },
        { label: '报工工位编号', prop: 'dzStationCode' },
        { label: '工位名称', prop: 'stationName' },
        { label: '排序码', prop: 'sortCode' },
        {
          label: '是否显示', render: (h, scope) => {
            return (
              <div>
                <el-switch
                  v-model={scope.row.onOff}
                  active-value={1}
                  inactive-value={0}
                  onChange={() => {
                    this.handleStatusChange(scope.row)
                  }}
                />
              </div>
            )
            // )
          }
        },
        {
          label: '操作', render: (h, scope) => {
            return (
              <div>
                <el-button
                  v-hasPermi={['report:station:edit']}
                  type='primary'
                  size='mini'
                  onClick={() => {
                    this.handleEdit(scope.row)
                  }}
                >编辑
                </el-button>
                <el-button
                  v-hasPermi={['report:station:del']}
                  type='danger'
                  size='mini'
                  onClick={() => {
                    this.handleDelete(scope)
                  }}
                >删除
                </el-button>
                <el-button
                  v-hasPermi={['report:station:bind']}
                  type='success'
                  size='mini'
                  onClick={() => {
                    this.handleBind(scope)
                  }}
                >检测项绑定
                </el-button>
              </div>
            )
          }, width: 280
        }
      ],
      // 遮罩层(加载)
      loading: false,
      btnLoading: false,
      total: 0, // 列表总条数
      queryParams: { // 查询信息
        page: 1,
        limit: 20,

        orderId: undefined,
        lineId: undefined,
        workCode: undefined,
        stationCode: undefined,
        field: undefined,
        type: undefined
        // stationCode: undefined // 工位编号
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
        ],
        stationCode: [
          { required: true, message: '请输入工位编号', trigger: 'blur' }
        ]
      },
      lineList: [], // 产线列表
      lineLists: [], // 产线列表
      orderList: [], // 产线列表
      processList: [], // 工序列表
      isShowPro: false
    }
  },
  // computed: { ...mapGetters(['orderList']) },
  mounted() {
    this.getList()
    this.handleOrder()
    this.handleLines()
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

    // 获取工序列表
    getProcessList(data) {
      listProcedure(data).then(res => {
        this.processList = res.data
      })
    },
    // 获取机器人列表
    getList() {
      this.loading = true
      listStation(this.queryParams).then(res => {
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
      this.isShowPro = true
      this.handleLine(id)
      if (this.formData.lineId && this.formData.orderId) {
        const data = {
          lineId: this.formData.lineId,
          orderId: this.formData.orderId,
          page: 1,
          limit: -1
        }
        this.getProcessList(data)
      }
    },
    changeLine(id) {
      if (this.formData.lineId && this.formData.orderId) {
        const data = {
          lineId: this.formData.lineId,
          orderId: this.formData.orderId,
          page: 1,
          limit: -1
        }
        this.getProcessList(data)
      }
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
    handleOrder() {
      getOrderSelect().then(res => {
        this.orderList = res.data
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
      // this.getProcessList()
    },
    // 编辑设备
    handleEdit(row) {
      this.isShowPro = true
      this.reset()
      const data = {
        lineId: row.lineId,
        orderId: row.orderId,
        page: 1,
        limit: -1
      }
      this.getProcessList(data)
      this.handleLine(row.orderId)
      this.formData = JSON.parse(JSON.stringify(row))
      this.dialogType = 'edit'
      this.dialogVisible = true
      // const id = row.id
      // getEquipment(id).then(res => {
      //   this.dialogVisible = true
      //   this.formData = res.data
      //   this.handleLine(res.data.orderId)
      // })
    },
    handleStatusChange(row) {
      console.log('scope', row)
      const text = row.onOff === 1 ? '启用' : '停用'
      this.$confirm('确认要' + text + '该工位吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return updateShow({
          stationId: row.stationId,
          onOff: row.onOff
        })
      }).then(() => {
        this.msgSuccess(text + '成功')
      }).catch(function() {
        row.onOff = row.onOff === 1 ? 0 : 1
      })
    },
    // 绑定产品检测项
    handleBind(scope) {
      console.log('scope', scope)
      this.$router.push({ path: '/station/type/data/' + scope.row.stationId + '/' + scope.row.orderId + '/' + scope.row.lineId })
    },
    // 提交设备信息
    handleSubmit() {
      this.$refs['formData'].validate((valid) => {
        if (valid) {
          if (this.formData.stationId !== undefined) { // 编辑
            updateStation(this.formData).then(res => {
              this.$message.success(res.msg)
              this.dialogVisible = false
              this.passVisible = false
              this.getList()
            })
          } else {
            addStation(this.formData).then(res => {
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
      const id = scope.row.stationId
      this.$confirm('是否确认删除设备名称为"' + scope.row.workName + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return delStation(id)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(() => {
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
      downloadStation(this.queryParams).then((res) => {
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
        stationId: undefined,
        stationCode: undefined, // 工位编号
        dzStationCode: undefined, // 工位编号
        stationName: undefined, // 工位名称
        workingProcedureId: undefined, // 工序id
        sortCode: 0, // 排序码
        outFlag: '0',
        ngCode: '0',
        mergeCode: undefined
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
