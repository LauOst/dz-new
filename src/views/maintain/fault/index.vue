<template>
  <div class="app-container">
    <!-- 头部筛选 -->
    <el-card shadow="never" class="card">
      <el-form ref="queryForm" :inline="true" :model="queryParams">
        <el-form-item prop="lineId">
          <el-select v-model="queryParams.lineId" size="small" style="width: 180px;" placeholder="产线名称">
            <el-option label="全部" :value="''" />
            <el-option v-for="(item,index) in lineList" :key="index" :label="item.lineName" :value="item.lineId" />
          </el-select>
        </el-form-item>
        <el-form-item prop="equipmentNo">
          <el-input
            v-model="queryParams.equipmentNo"
            clearable
            size="small"
            placeholder="设备编号"
            style="width: 180px;"
          />
        </el-form-item>
        <el-form-item prop="faultType">
          <el-select v-model="queryParams.faultType" size="small" style="width: 180px;" placeholder="故障类型">
            <el-option label="全部" :value="''" />
            <el-option v-for="(item,index) in checkTypeList" :key="index" :label="item.name" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item prop="checkNumber">
          <el-input
            v-model="queryParams.checkNumber"
            clearable
            size="small"
            placeholder="故障台账单号"
            style="width: 180px;"
          />
        </el-form-item>
        <start-date v-model="queryParams.startTime" />
        <end-date v-model="queryParams.endTime" />
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
          <el-button v-hasPermi="['equipment:fault:add']" type="success" icon="el-icon-plus" size="small" @click="handleAdd">
            新增
          </el-button>
          <el-button v-hasPermi="['equipment:fault:excel']" :loading="btnLoading" type="warning" icon="el-icon-download" size="small" @click="handleExport">导出</el-button>
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
    <el-dialog
      v-dialogDrag
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      :title="dialogType==='edit'?'编辑设备巡检':'新增设备巡检'"
      :visible.sync="dialogVisible"
      class="dialog"
      width="1200px"
    >
      <div style="width: 92%; margin-left:40px;margin-bottom: 10px" class="l-flex l-row-right">
        <el-button type="primary" size="mini" @click="addFault">添加</el-button>
      </div>
      <el-form
        ref="formData"
        :model="formData"
        label-width="140px"
        :rules="addFormRules"
        style="width: 92%; margin-left:40px;"
      >

        <el-row :gutter="20">
          <el-col :span="9">
            <el-form-item label="产线名称" prop="lineId">
              <el-select v-model="formData.lineId" placeholder="请选择产线" style="width: 100%;" @change="changeLind">
                <el-option v-for="(item,index) in lineList" :key="index" :label="item.lineName" :value="item.lineId" />
              </el-select>
            </el-form-item>
            <el-form-item label="设备名称" prop="deviceId">
              <el-select v-model="formData.deviceId" placeholder="请选择设备" style="width: 100%;">
                <el-option v-for="(item,index) in devcieList" :key="index" :label="item.equipmentName" :value="item.deviceId" />
              </el-select>
            </el-form-item>
            <el-form-item label="故障类型" prop="faultType">
              <el-select v-model="formData.faultType" style="width: 100%;" placeholder="故障类型">
                <el-option v-for="(item,index) in checkTypeList" :key="index" :label="item.name" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="故障处理开始时间" prop="startHandleDate">
              <el-date-picker v-model="formData.startHandleDate" type="datetime" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%;" />
            </el-form-item>
            <el-form-item label="故障处理结束时间" prop="completeHandleDate">
              <el-date-picker v-model="formData.completeHandleDate" type="datetime" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%;" />
            </el-form-item>
          </el-col>
          <el-col
            :span="15"
          >
            <el-form-item label-width="0">
              <el-table
                :data="formData.parmsInners"
                border
                style="width: 100%"
              >
                <el-table-column prop="faultLocation" label="故障位置" width="180">
                  <template slot-scope="{row}">
                    <el-form-item label-width="0">
                      <el-input v-model="row.faultLocation" size="small" placeholder="请输入故障位置" />
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="faultDescription" label="故障描述">
                  <template slot-scope="{row}">
                    <el-form-item label-width="0">
                      <el-input v-model="row.faultDescription" size="small" placeholder="请输入故障描述" />
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="80">
                  <template slot-scope="scope">
                    <el-button type="danger" size="mini" :disabled="scope.$index === 0" @click="handleDeleteContent(scope)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
            <el-form-item label="备注信息" prop="remarks">
              <el-input
                v-model="formData.remarks"
                :autosize="{ minRows: 2, maxRows: 4}"
                type="textarea"
                placeholder="请输入内容"
              />
            </el-form-item>
          </el-col>
        </el-row>
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

    <!--查看详情-->
    <el-dialog
      v-dialogDrag
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      title="详情"
      :visible.sync="dialogVisibleDetail"
      class="dialog"
      width="600px"
    >

      <el-form
        ref="formData"
        :model="formData"
        label-width="140px"
        :rules="addFormRules"
        style="width: 92%; margin-left:40px;"
      >

        <el-row :gutter="20">
          <el-col
            :span="24"
          >
            <el-form-item label-width="0">
              <el-table
                :data="formData.parmsInners"
                border
                style="width: 100%"
              >
                <el-table-column prop="faultLocation" label="故障位置" width="180">
                  <template slot-scope="{row}">
                    <el-form-item label-width="0">
                      <el-input v-model="row.faultLocation" size="small" placeholder="请输入故障位置" disabled />
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="faultDescription" label="故障描述">
                  <template slot-scope="{row}">
                    <el-form-item label-width="0">
                      <el-input v-model="row.faultDescription" size="small" placeholder="请输入故障描述" disabled />
                    </el-form-item>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
            <el-form-item label="故障处理开始时间" prop="startHandleDate">
              <el-date-picker v-model="formData.startHandleDate" type="datetime" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%;" disabled />
            </el-form-item>
            <el-form-item label="故障处理结束时间" prop="completeHandleDate">
              <el-date-picker v-model="formData.completeHandleDate" type="datetime" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%;" disabled />
            </el-form-item>
            <el-form-item label="备注信息" prop="remarks">
              <el-input
                v-model="formData.remarks"
                :autosize="{ minRows: 2, maxRows: 4}"
                type="textarea"
                placeholder="请输入内容"
                disabled
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <!-- 操作按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button type="plain" @click="dialogVisibleDetail = false">取消</el-button>
        <el-popover v-model="passVisibleDetail" placement="top" width="160">
          <p>确认提交？</p>
          <div style="text-align: right; margin: 0">
            <el-button size="small" type="text" @click="passVisibleDetail = false">取消</el-button>
            <el-button type="primary" size="small" @click="handleSubmitDetail">确定</el-button>
          </div>
          <el-button slot="reference" class="l-m-l-10" type="primary">提交</el-button>
        </el-popover>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { getlineSelect, listDevcie } from '@/api/commens' // 获取产线列表
import { addFault, delFault, faultDetails, listFault, updateFault } from '@/api/euipment/fault'
import { downloadFault } from '@/api/excel/excel'

export default {
  name: 'Fault',
  data() {
    return {
      column: [
        { type: 'index', index: this.indexMethod },
        { label: '产线名称', prop: 'lineName' },
        { label: '设备名称', prop: 'equipmentName' },
        { label: '设备编号', prop: 'equipmentNo' },
        { label: '故障台账单号', prop: 'checkNumber' },
        { label: '故障备注', prop: 'remarks' },
        { label: '故障类型', prop: 'faultType', formatter: this.FaultTypeFormat },
        { label: '维修开始时间', prop: 'startHandleDate', width: 180 },
        { label: '维修结束时间', prop: 'completeHandleDate', width: 180 },
        { label: '故障处理人', prop: 'createBy' },
        {
          label: '操作', render: (h, scope) => {
            return (
              <div>
                <el-button
                  v-hasPermi={['equipment:fault:edit']}
                  type='primary'
                  size='mini'
                  onClick={() => {
                    this.handleEdit(scope.row)
                  }}
                >编辑
                </el-button>
                <el-button
                  v-hasPermi={['equipment:fault:detail']}
                  type='success'
                  size='mini'
                  onClick={() => {
                    this.handleDetail(scope.row)
                  }}
                >查看维修详情
                </el-button>
                <el-button
                  v-hasPermi={['equipment:fault:del']}
                  type='danger'
                  size='mini'
                  onClick={() => {
                    this.handleDelete(scope)
                  }}
                >删除
                </el-button>
              </div>
            )
          }, width: 260
        }
      ],
      // 遮罩层(加载)
      loading: false,
      btnLoading: false,
      total: 0, // 列表总条数
      queryParams: { // 查询信息
        page: 1,
        limit: 20,
        equipmentNo: undefined, // 机器人编码
        lineId: undefined, // 产线名称
        checkNumber: undefined, // 巡检单号
        faultType: undefined, // 巡检单号
        field: undefined,
        type: undefined,
        startTime: undefined,
        endTime: undefined
      },
      addFormRules: { // 表单验证
        lineId: [
          { required: true, message: '请选择产线', trigger: 'change' }
        ],
        deviceId: [
          { required: true, message: '请输入设备名称', trigger: 'blur' }
        ],
        faultType: [
          { required: true, message: '请输选择故障类型', trigger: 'change' }
        ]
      },
      formData: {},
      dialogVisible: false, // 新增弹窗
      dialogVisibleDetail: false, // 新增弹窗
      dialogType: 'new',
      passVisible: false, // 确认气泡框
      passVisibleDetail: false, // 确认气泡框
      list: [], // 表格数据
      lineList: [], // 产线列表
      devcieList: [], // 设备列表
      checkTypeList: [
        { name: '紧急', value: 1 },
        { name: '突发', value: 2 },
        { name: '一般', value: 3 }
      ] // 巡检想类型列表
    }
  },
  mounted() {
    this.getList()
    this.handleLine()
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
    // 获取列表
    getList() {
      this.loading = true
      listFault(this.queryParams).then(res => {
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
    // 新增
    handleAdd() {
      this.reset()
      if (this.lineList && this.lineList.length > 0) {
        this.formData.lineId = this.lineList[0].lineId
        this.getListDevcie(this.formData.lineId)
      }
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    // 选择产线回调
    changeLind(id) {
      this.formData.deviceId = undefined
      this.getListDevcie(id)
    },
    // 编辑
    handleEdit(row) {
      this.reset()
      this.getListDevcie(row.lineId)
      // 编辑查看详情
      faultDetails({ repairId: row.repairId }).then(r => {
        this.formData = JSON.parse(JSON.stringify(r.data).replace(/detailsInner/g, 'parmsInners'))
        this.formData.lineId = row.lineId
        this.formData.deviceId = row.deviceId
        this.formData.faultType = Number(row.faultType)
        this.dialogType = 'edit'
        this.dialogVisible = true
      })
    },
    // 获取所以设备列表
    getListDevcie(id) {
      this.devcieList = []
      listDevcie({ lineId: id }).then(r => {
        this.devcieList = r.data
      })
    },
    handleSubmit() {
      this.$refs['formData'].validate((valid) => {
        if (valid) {
          if (this.dialogType === 'new') {
            addFault(this.formData).then(r => {
              this.$message.success(r.msg)
              this.dialogVisible = false
              this.passVisible = false
              this.getList()
            })
          } else {
            updateFault(this.formData).then(r => {
              this.$message.success(r.msg)
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
      const id = scope.row.repairId
      this.$confirm('是否确认删除该数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return delFault(id)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(() => {
      })
    },
    handleDeleteContent(scope) {
      this.formData.parmsInners.splice(scope.$index, 1)
    },

    // 查看巡检详情
    handleDetail(row) {
      // 编辑查看详情
      faultDetails({ repairId: row.repairId }).then(r => {
        this.formData = JSON.parse(JSON.stringify(r.data).replace(/detailsInner/g, 'parmsInners'))
        this.dialogVisibleDetail = true
      })
    },
    handleSubmitDetail() {
      this.dialogVisibleDetail = false
    },
    // 添加故障选项
    addFault() {
      const data = {
        faultDescription: '',
        faultLocation: '',
        repairDetailsId: undefined
      }
      this.formData.parmsInners.push(data)
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
      await this.resetForm('queryForm')
      await this.handleQuery()
    },
    // 导出按钮
    handleExport() {
      this.btnLoading = true
      downloadFault(this.queryParams).then((res) => {
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
        lineId: undefined,
        deviceId: undefined, // 设备id
        faultType: undefined, // 巡检类型
        startHandleDate: undefined, // 巡检类型
        completeHandleDate: undefined, // 巡检类型
        parmsInners: [{
          faultDescription: '',
          faultLocation: '',
          repairDetailsId: undefined
        }]

      }
      this.devcieList = []
      this.resetForm('formData')
    },
    // 过滤设备类型
    FaultTypeFormat(row) {
      const obj = {
        1: '紧急',
        2: '突发',
        3: '一般'
      }
      return obj[row.faultType]
    }
  }
}
</script>

<style scoped>

</style>
