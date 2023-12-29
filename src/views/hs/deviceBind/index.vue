<template>
  <div class="app-container">
    <!-- 头部筛选 -->
    <el-card shadow="never" class="card">
      <el-form ref="queryForm" :model="queryParams" :inline="true">
        <el-form-item prop="prodName">
          <el-input v-model="queryParams.prodName" clearable size="small" placeholder="产品名称" style="width: 180px;" />
        </el-form-item>
        <el-form-item prop="type">
          <el-input v-model="queryParams.type" clearable size="small" placeholder="产品类型" style="width: 180px;" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
          <el-button v-hasPermi="['hs:workpiece:bind']" type="primary" plain icon="el-icon-takeaway-box" :disabled="stoveInfo.list.length === 0" size="small" @click="handleBind">绑定炉号</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
          <el-button type="success" icon="el-icon-plus" size="small" @click="handleAdd">
            新增
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 表格信息 -->
    <dz-table
      ref="table"
      v-loading="loading"
      :column="column"
      :data="list"
      :total="total"
      pagination
      :page.sync="queryParams.page"
      :limit.sync="queryParams.limit"
      @pagination="getList"
      @handleSelectionChange="handleSelectionChange"
    />
    <!--新增订单-->
    <el-dialog v-dialogDrag :close-on-click-modal="false" title="新增" :visible.sync="dialogVisible" class="dialog" width="530px">
      <el-form ref="formData" :model="formData" :rules="addFormRules" label-width="120px" style=" margin-left:40px;">
        <el-form-item label="成品料号" prop="prodName">
          <el-input v-model="formData.prodName" />
        </el-form-item>
        <el-form-item label="机器人程序号" prop="directive">
          <el-input v-model="formData.directive" />
        </el-form-item>
        <el-form-item label="产品类型" prop="type">
          <el-input v-model="formData.type" placeholder="请输入产品类型" />
        </el-form-item>
      </el-form>
      <!-- 操作按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit('formData')">提交</el-button>
      </span>
    </el-dialog>
    <!-- 绑定炉号 -->
    <el-dialog v-dialogDrag :close-on-click-modal="false" :title="'绑定炉号'" :visible.sync="stoveDialog" class="dialog" width="530px">
      <el-form ref="stoveInfo" :model="stoveInfo" :rules="addStoveFormRules" label-width="90px" style=" margin-left:40px;">
        <el-form-item label="炉号" prop="lno">
          <el-input v-model="stoveInfo.lno" />
        </el-form-item>
      </el-form>
      <!-- 操作按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="stoveDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitBind('stoveInfo')">提交</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { addDeviceBind, delDeviceBind, listDeviceBind } from '@/api/hs/deviceBind'
import { bingCompLno } from '@/api/hs/workpiece'

export default {
  name: 'DeviceBind',
  data() {
    return {
      column: [
        { type: 'selection', reserveSelection: true },
        { type: 'index', index: this.indexMethod },
        { label: '炉号', prop: 'lno' },
        { label: '产品名称', prop: 'prodName' },
        { label: '绑定指令名称', prop: 'directive' },
        { label: '产品类型', prop: 'type' },
        { label: '操作', render: (h, scope) => {
          return (
            <div>
              <el-button
                v-hasPermi={['hs:deviceBind:del']}
                type='danger'
                size='mini'
                onClick={() => { this.handleDelete(scope) }}
              >删除</el-button>
            </div>
          )
        }, width: 140 }
      ],
      loading: false,
      total: 0, // 列表总条数
      // 查询信息
      queryParams: {
        page: 1,
        limit: 20,
        type: undefined,
        directive: undefined
      },
      list: [],
      dialogVisible: false,
      formData: {},
      addFormRules: {
        prodName: [
          { required: true, message: '请输入成品料号', trigger: 'blur' }
        ],
        directive: [
          { required: true, message: '请输入机器人程序号', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请先泽产品类型', trigger: 'change' }
        ]
      },
      addStoveFormRules: {
        lno: [
          { required: true, message: '请输入炉号', trigger: 'blur' }
        ]
      },
      stoveDialog: false,
      stoveInfo: {
        list: [],
        lno: undefined
      }
    }
  },
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
    handleSelectionChange(list) {
      this.stoveInfo.list = Array.from(list, ({ id }) => id)
    },
    getList() {
      this.loading = true
      listDeviceBind(this.queryParams).then(res => {
        this.list = res.data
        this.total = res.count || 0
        this.loading = false
      })
    },
    // 新增
    handleAdd() {
      this.reset()
      this.dialogVisible = true
    },
    // handleEdit(scope) {
    //   this.reset()
    //   this.formData.equipmentNo = scope.row.equipmentNo
    //   this.dialogVisible = true
    // },
    // 提交新增订单信息
    handleSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          addDeviceBind(this.formData).then(res => {
            this.$message.success(res.msg)
            this.dialogVisible = false
            this.getList()
          })
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(scope) {
      const id = scope.row.id
      this.$confirm('是否确认删除数据项', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return delDeviceBind(id)
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
    handleBind() {
      this.stoveDialog = true
    },
    handleSubmitBind(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          bingCompLno(this.stoveInfo).then(res => {
            this.stoveDialog = false
            this.$message.success(res.msg)
            this.getList()
            this.$refs.table.clearSelection()
          })
        }
      })
      // this.stoveDialog = true
    },
    // 表单重置
    reset() {
      this.formData = {
        prodName: undefined,
        directive: undefined,
        type: undefined
      }
      this.resetForm('formData')
    },
    // 设备类型格式化
    typeFilter(row) {
      const obj = {
        1: '大产品',
        2: '小产品'
      }
      return obj[row.type]
    }
  }
}
</script>

<style scoped>

</style>
