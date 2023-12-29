<template>
  <div class="app-container">
    <el-card shadow="never" class="card">
      <el-form ref="queryForm" :model="queryParams" :inline="true">
        <el-form-item prop="alarmNo">
          <el-input v-model="queryParams.alarmNo" clearable size="small" placeholder="设备编号" style="width: 180px;" />
        </el-form-item>
        <el-form-item prop="alarmContent">
          <el-input v-model="queryParams.alarmContent" clearable size="small" placeholder="告警内容" style="width: 180px;" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
          <el-button v-hasPermi="['baseConfig:alarmManage:add']" type="success" icon="el-icon-plus" size="small" @click="handleAdd">
            新增
          </el-button>
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
    <!-- 弹出层(添加/编辑刀具组) -->
    <!-- 新增/编辑 -->
    <el-dialog v-dialogDrag :close-on-click-modal="false" :modal-append-to-body="false" class="dialog" :title="dialogType==='edit'?'编辑':'新增'" :visible.sync="dialogVisible" width="530px" append-to-body>
      <el-form
        ref="form"
        :model="formData"
        :rules="addFormRules"
        label-width="90px"
        style="width: 400px; margin-left:40px;"
      >
        <el-form-item label="告警编号" prop="alarmNo">
          <el-input v-model="formData.alarmNo" clearable placeholder="请输入告警编号" />
        </el-form-item>
        <el-form-item label="告警内容" prop="alarmContent">
          <el-input v-model="formData.alarmContent" clearable placeholder="请输入告警内容" />
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
import { addAlarmManage, delAlarmManage, listAlarmManage, updateAlarmManage } from '@/api/alarmManage/alarmManage'
/*
  queryParams:刀具管理列表请求参数
  total:列表总条数
  dialogVisible:是否显示 Dialog
  dialogType:控制表头显示内容
* */

export default {
  name: 'AlarmManage',
  data() {
    return {
      // 表格信息
      column: [
        { type: 'index', index: this.indexMethod },
        { label: '告警编号', prop: 'alarmNo' },
        { label: '告警内容', prop: 'alarmContent' },
        { label: '操作', render: (h, scope) => {
          return (
            <div id='btnWrap'>
              <el-button
                v-hasPermi={['baseConfig:alarmManage:edit']}
                type='primary'
                size='mini'
                onClick={() => { this.handleEdit(scope.row) }}
              >编辑</el-button>
              <el-button
                v-hasPermi={['baseConfig:alarmManage:del']}
                type='danger'
                size='mini'
                onClick={() => { this.handleDelete(scope) }}
              >删除</el-button>
            </div>
          )
          // )
        }, width: 240 }
      ],
      loading: false,
      btnLoading: false,
      // 分页搜索参数
      queryParams: {
        page: 1,
        limit: 20,
        alarmNo: undefined, // 告警编码
        alarmContent: undefined // 告警编码
      },
      addFormRules: { // 表单验证
        alarmNo: [
          { required: true, message: '请输入告警编号', trigger: 'blur' }
        ],
        alarmContent: [
          { required: true, message: '请输入告警内容', trigger: 'blur' }
        ]
      },
      // 列表
      list: [],
      // 分页数据
      total: 0,
      dialogVisible: false,
      passVisible: false, // 确认气泡框
      // dialogVisibleTools: false,
      dialogType: 'new',
      // 表单信息
      formData: {}
    }
  },
  computed: {},
  mounted() {
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
    /** 查询列表 */
    getList() {
      this.loading = true
      listAlarmManage(this.queryParams).then(res => {
        this.list = res.data
        this.total = res.count || 0
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 新增按钮
    handleAdd() {
      this.reset()
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    // 编辑
    handleEdit(row) {
      this.formData = JSON.parse(JSON.stringify(row))
      this.dialogVisible = true
      this.dialogType = 'edit'
      console.log('formData', this.formData)
      // this.formData.orderId = Number(this.formData.orderId
      // this.formData.lineId = Number(this.formData.lineId)
      // this.formData.deviceId = Number(this.formData.deviceId)
      // getLineByOrderId(this.formData.orderId).then(res => {
      //   this.lineList = res.data
      //   getLineByEquipment(this.formData.lineId).then(res => {
      //     this.loadingDetail = true
      //     this.dialogVisible = true
      //     this.dialogType = 'edit'
      //     this.deviceTypelList = res.data
      //   })
      // })
    },
    /** 删除按钮操作 */
    handleDelete(scope) {
      const alarmNo = scope.row.alarmNo
      this.$confirm('是否确认删除该数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return delAlarmManage(alarmNo)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(() => {
      })
    },
    /** 提交按钮 */
    handleSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.dialogType !== 'new') {
            updateAlarmManage(this.formData).then(res => {
              this.msgSuccess(res.msg)
              this.dialogVisible = false
              this.passVisible = false
              this.getList()
            })
          } else {
            addAlarmManage(this.formData).then(res => {
              this.msgSuccess(res.msg)
              this.dialogVisible = false
              this.passVisible = false
              this.getList()
            })
          }
        }
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
    // 表单重置
    reset() {
      this.formData = {
        alarmNo: undefined, // 告警等级
        alarmContent: undefined, // 数据唯一id
        id: undefined // 设备类型
      }
      this.resetForm('form')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

