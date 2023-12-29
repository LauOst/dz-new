<!--
 * @Author: zhixinJ
 * @Date: 2023-03-31 15:31:34
 * @Desc:
-->
<template>
  <div class="app-container">
    <!-- 头部筛选 -->
    <el-card shadow="never" class="card">
      <el-form ref="queryForm" :inline="true" :model="queryParams">
        <el-form-item prop="personNo">
          <el-input v-model="queryParams.personNo" clearable size="small" placeholder="编号" style="width: 180px;" />
        </el-form-item>
        <el-form-item prop="personName">
          <el-input v-model="queryParams.personName" clearable size="small" placeholder="姓名" style="width: 180px;" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
          <el-button v-hasPermi="['jingji:employeeManage:add']" icon="el-icon-plus" type="success" size="small" @click="handleAdd">新增</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
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
    />
    <!--新增人员-->
    <el-dialog v-dialogDrag :close-on-click-modal="false" :title="dialogType==='edit'?'编辑人员':'新增人员'" :visible.sync="dialogVisible" class="dialog" width="530px">
      <el-form ref="formData" :model="formData" :rules="addFormRules" label-width="90px" style=" margin-left:40px;">
        <el-form-item label="人员编号" prop="personNo">
          <el-input v-model="formData.personNo" />
        </el-form-item>
        <el-form-item label="人员姓名" prop="personName">
          <el-input v-model="formData.personName" />
        </el-form-item>
      </el-form>
      <!-- 操作按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit('formData')">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { listPerson, addPerson, delPerson, updatePerson } from '@/api/jingji/employeeManage'
export default {
  name: 'EmployeeManage',
  data() {
    return {
      column: [
        { type: 'index', index: this.indexMethod },
        { label: '编号', prop: 'personNo', disableSort: true },
        { label: '姓名', prop: 'personName', disableSort: true },
        { label: '设置时间', prop: 'createTime', disableSort: true },
        { label: '操作', render: (h, scope) => {
          return (
            <div>
              <el-button
                v-hasPermi={['jingji:employeeManage:edit']}
                type='primary'
                size='mini'
                onClick={() => { this.handleEdit(scope) }}
              >编辑</el-button>
              <el-button
                v-hasPermi={['jingji:employeeManage:del']}
                type='danger'
                size='mini'
                onClick={() => { this.handleDelete(scope) }}
              >删除</el-button>
            </div>
          )
        }, width: 300, fixed: 'right' }
      ],
      loading: false,
      total: 0, // 列表总条数
      // 查询信息
      queryParams: {
        page: 1,
        limit: 20,
        lineNo: '1',
        orderNo: 'DZ-2248',
        personNo: undefined,
        personName: undefined
      },
      list: [],
      addFormRules: {
        personNo: [
          { required: true, message: '请输入人员编号', trigger: 'blur' }
        ],
        personName: [
          { required: true, message: '请输入人员姓名', trigger: 'blur' }
        ]
      }, // 新增校验
      formData: {},
      dialogType: 'new',
      dialogVisible: false // 新增编辑弹窗
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
    getList() {
      this.loading = true
      listPerson(this.queryParams).then(res => {
        this.list = res.data
        this.total = res.count || 0
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 新增人员
    handleAdd() {
      this.reset()
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    // 编辑人员
    handleEdit(scope) {
      this.formData = JSON.parse(JSON.stringify(scope.row))
      this.dialogType = 'edit'
      this.dialogVisible = true
    },
    // 删除人员
    handleDelete(scope) {
      const id = scope.row.id
      this.$confirm('是否确认删除该数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return delPerson(id)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(() => {})
    },
    // 提交新增订单信息
    handleSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.formData.id !== undefined) {
            updatePerson(this.formData).then(res => {
              this.$message.success(res.msg)
              this.dialogVisible = false
              this.getList()
            })
          } else {
            addPerson(this.formData).then(res => {
              this.$message.success(res.msg)
              this.dialogVisible = false
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
        id: undefined,
        personNo: undefined, // 编号
        personName: undefined // 姓名
      }
      this.resetForm('formData')
    }
  }
}
</script>

<style scoped>

</style>
