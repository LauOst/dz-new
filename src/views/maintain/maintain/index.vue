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
        <el-form-item prop="states">
          <el-select v-model="queryParams.states" size="small" style="width: 180px;" placeholder="保养记录">
            <el-option label="全部" :value="''" />
            <el-option v-for="(item,index) in maintainList" :key="index" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <start-date v-model="queryParams.startTime" />
        <end-date v-model="queryParams.endTime" />
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
          <el-button v-hasPermi="['equipment:maintain:addRecord']" type="success" icon="el-icon-plus" size="small" @click="handleAdd">
            新增
          </el-button>
          <el-button v-hasPermi="['equipment:maintain:excel']" :loading="btnLoading" type="warning" icon="el-icon-download" size="small" @click="handleExport">导出</el-button>
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
      :title="dialogType==='edit'?'编辑设备':'新增设备'"
      :visible.sync="dialogVisible"
      class="dialog"
      width="530px"
    >

      <el-form
        ref="formData"
        :model="formData"
        label-width="110px"
        :rules="addFormRules"
        style="width: 400px; margin-left:40px;"
      >

        <el-form-item label="产线名称" prop="lineId">
          <el-select v-model="formData.lineId" placeholder="请选择产线" style="width: 100%;" @change="changeLind">
            <el-option v-for="(item,index) in lineList" :key="index" :label="item.lineName" :value="item.lineId" />
          </el-select>
        </el-form-item>
        <el-form-item label="设备名称" prop="deviceId">
          <!--          <el-select v-model="formData.equipmentType" :disabled="formData.id !== undefined" placeholder="请选择设备类型" style="width: 100%;">-->
          <el-select v-model="formData.deviceId" placeholder="请选择设备类型" style="width: 100%;">
            <el-option v-for="(item,index) in devcieList" :key="index" :label="item.equipmentName" :value="item.deviceId" />
          </el-select>
        </el-form-item>
        <el-form-item label="出厂日期" prop="dateOfProduction">
          <el-date-picker v-model="formData.dateOfProduction" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="上次保养日期" prop="maintainDateBefore">
          <el-date-picker v-model="formData.maintainDateBefore" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" style="width: 100%;" @change="handleDateRange" />
        </el-form-item>
        <el-form-item label="下次保养日期" prop="maintainDateAfter">
          <el-date-picker v-model="formData.maintainDateAfter" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" style="width: 100%;" disabled />
        </el-form-item>
        <el-form-item label-width="0">
          <div class="lable-swich-lg">年检时间</div>
          <div class="radio-wrap-fl">
            <el-form-item label-width="0" prop="multiple" style="display: inline-block">
              <el-input-number v-model="formData.multiple" controls-position="right" :min="1" size="mini" style="width: 110px;margin-right: 5px" @change="radioChange" />
            </el-form-item>
            <el-form-item label-width="0" prop="deviceId" style="display: inline-block">
              <el-select v-model="formData.unit" placeholder="请选择年检类型" style="width: 110px" size="mini" @change="radioUnit">
                <el-option v-for="(item,index) in typeList" :key="index" :label="item.name" :value="item.value" />
              </el-select>
            </el-form-item>
          </div>
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

    <!--保养新增-->
    <el-dialog
      v-dialogDrag
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      title="保养新增"
      :visible.sync="dialogVisibleAdd"
      class="dialog"
      width="530px"
    >
      <el-button type="primary" size="mini" style="margin-bottom: 10px" @click="addMaintainRecord">新增</el-button>
      <el-table
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column prop="date" label="设备保养项" width="180">
          <template slot-scope="{row}">
            <template>
              <el-input v-model="row.maintainItem" class="edit-input" size="small" />
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="设备保养内容">
          <template slot-scope="{row}">
            <template>
              <el-input v-model="row.maintainContent" class="edit-input" size="small" />
            </template>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" :disabled="scope.$index === 0" @click="handleDeleteContent(scope)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 操作按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button type="plain" @click="dialogVisibleAdd = false">取消</el-button>
        <el-popover v-model="passVisibleAdd" placement="top" width="160">
          <p>确认提交？</p>
          <div style="text-align: right; margin: 0">
            <el-button size="small" type="text" @click="passVisibleAdd = false">取消</el-button>
            <el-button type="primary" size="small" @click="handleSubmitAdd">确定</el-button>
          </div>
          <el-button slot="reference" class="l-m-l-10" type="primary">提交</el-button>
        </el-popover>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { getlineSelect, listDevcie } from '@/api/commens' // 获取产线列表
import { addMaintain, addMaintainRecord, delMaintain, listMaintain, updateMaintain } from '@/api/euipment/maintain'
import { downloadMaintain } from '@/api/excel/excel'

export default {
  name: 'MaintainRecord',
  data() {
    return {
      tableData: [{
        maintainItem: '',
        maintainContent: ''
      }],
      column: [
        { type: 'index', index: this.indexMethod },
        { label: '产线名称', prop: 'lineName' },
        { label: '设备名称', prop: 'equipmentName' },
        { label: '设备编号', prop: 'equipmentNo' },
        { label: '出厂日期', prop: 'dateOfProduction' },
        { label: '上次保养日期', prop: 'maintainDateBefore' },
        { label: '年检时间', prop: 'concatUnit' },
        { label: '下次保养日期', prop: 'maintainDateAfter' },
        { label: '状态', prop: 'states' },
        {
          label: '操作', render: (h, scope) => {
            return (
              <div>
                <el-button
                  v-hasPermi={['equipment:maintain:edit']}
                  type='primary'
                  size='mini'
                  onClick={() => {
                    this.handleEdit(scope.row)
                  }}
                >编辑
                </el-button>
                <el-button
                  v-hasPermi={['equipment:maintain:see']}
                  type='success'
                  size='mini'
                  onClick={() => {
                    this.handleSee(scope.row)
                  }}
                >查看保养记录
                </el-button>
                <el-button
                  v-hasPermi={['equipment:maintain:add']}
                  type='warning'
                  size='mini'
                  onClick={() => {
                    this.handlePlus(scope.row)
                  }}
                >保养新增
                </el-button>
                <el-button
                  v-hasPermi={['equipment:maintain:del']}
                  type='danger'
                  size='mini'
                  onClick={() => {
                    this.handleDelete(scope)
                  }}
                >删除
                </el-button>
              </div>
            )
          }, width: 360
        }
      ],
      columnDetail: [
        { label: '产线名称', prop: 'lineName', disableSort: true },
        { label: '设备名称', prop: 'equipmentName' },
        { label: '设备编号', prop: 'equipmentCode' },

        { label: '设备保养时间', prop: 'stopTime' },
        { label: '保养人', prop: 'resetTime' },
        { label: '停机时长', prop: 'duration', formatter: this.statusFormat, sortable: 'column' }
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
        states: undefined, // 班次名称
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
        ]
      },
      formData: {},
      formDataAdd: {},
      startTime: '',
      dialogVisible: false, // 新增弹窗
      dialogVisibleAdd: false, // 保养新增弹窗
      dialogType: 'new',
      passVisible: false, // 确认气泡框
      passVisibleAdd: false, // 确认气泡框
      list: [], // 表格数据
      lineList: [], // 产线列表
      devcieList: [], // 设备列表
      maintainList: [{
        id: 1,
        name: '已保养'
      }, {
        id: 2,
        name: '未保养'
      }],
      typeList: [{
        id: 1,
        name: '年/次',
        value: '年'
      }, {
        id: 2,
        name: '月/次',
        value: '月'
      }, {
        id: 3,
        name: '周/次',
        value: '周'
      }]
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
    // 获取机器人列表
    getList() {
      this.loading = true
      listMaintain(this.queryParams).then(res => {
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
      this.formData = JSON.parse(JSON.stringify(row))
      this.dialogType = 'edit'
      this.dialogVisible = true
    },
    // 获取所以设备列表
    getListDevcie(id) {
      this.devcieList = []
      listDevcie({ lineId: id }).then(r => {
        this.devcieList = r.data
      })
    },
    // 上次保养日期时间选择
    handleDateRange(e) {
      this.calculat(e)
    },
    calculat(oldTime) {
      if (this.formData.unit === '年') {
        this.formData.maintainDateAfter = this.getAddYear(oldTime, this.formData.multiple)
      } else if (this.formData.unit === '月') {
        this.formData.maintainDateAfter = this.getAddMonths(oldTime, this.formData.multiple)
      } else {
        this.formData.maintainDateAfter = this.getAddWeeks(oldTime, this.formData.multiple)
      }
    },
    // 查看保养记录
    handleSee(row) {
      this.$router.push({ name: 'MaintainData', params: { maintainId: row.maintainId }})
    },
    // 保养类型
    radioChange() {
      if (this.formData.maintainDateBefore) {
        this.calculat(this.formData.maintainDateBefore)
      }
    },
    radioUnit() {
      if (this.formData.maintainDateBefore) {
        this.calculat(this.formData.maintainDateBefore)
      }
    },
    // 保养新增
    handlePlus(row) {
      this.resetAdd()
      this.resetFormDataAdd()
      this.formDataAdd.maintainId = row.maintainId
      this.dialogVisibleAdd = true
    },
    // 新增保养记录
    handleSubmitAdd() {
      this.formDataAdd.recordDetails = this.tableData

      let flag = false
      this.formDataAdd.recordDetails.forEach(item => {
        if (item.maintainContent === '') {
          flag = false
          this.$message.error('设备保养项目不能为空')
        } else if (item.maintainContent === '') {
          flag = false
          this.$message.error('设备保养内容不能为空')
        } else {
          flag = true
        }
      })
      if (flag) {
        addMaintainRecord(this.formDataAdd).then(r => {
          this.$message.success(r.msg)
          this.dialogVisibleAdd = false
          this.passVisibleAdd = false
          this.getList()
        })
      }
    },
    // 新增保养记录内容
    addMaintainRecord() {
      const data = {
        maintainItem: '',
        maintainContent: ''
      }
      this.tableData.push(data)
    },
    handleSubmit() {
      this.$refs['formData'].validate((valid) => {
        if (valid) {
          if (this.dialogType === 'new') {
            // this.formData.frequency = this.formData.multiple
            addMaintain(this.formData).then(r => {
              this.$message.success(r.msg)
              this.dialogVisible = false
              this.passVisible = false
              this.getList()
            })
          } else {
            updateMaintain(this.formData).then(r => {
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
      const id = scope.row.maintainId
      this.$confirm('是否确认删除该数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return delMaintain(id)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(() => {
      })
    },
    handleDeleteContent(scope) {
      this.tableData.splice(scope.$index, 1)
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
      downloadMaintain(this.queryParams).then((res) => {
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
        deviceId: undefined, // 设备id
        dateOfProduction: undefined, // 出厂时间
        maintainDateBefore: undefined, // 上次保养日期
        maintainDateAfter: undefined, // 下次保养日期
        unit: '年', // 年检状态
        frequency: 1, // 次数
        multiple: 1, // 多少年
        lineId: undefined
      }
      this.resetForm('formData')
    },
    resetFormDataAdd() {
      this.formDataAdd = {
        maintainId: undefined,
        recordDetails: []
      }
    },
    resetAdd() {
      this.tableData = [{
        maintainItem: '',
        maintainContent: ''
      }]
    }
  }
}
</script>

<style scoped>

</style>
