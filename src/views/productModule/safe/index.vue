<template>
  <div class="app-container">
    <!-- 头部筛选 -->
    <el-card shadow="never" class="card">
      <el-form ref="queryForm" :inline="true" :model="queryParams">
        <el-form-item prop="alarmGrade">
          <el-input v-model="queryParams.alarmGrade" clearable size="small" placeholder="事故等级" style="width: 180px;" />
        </el-form-item>
        <el-form-item>
          <start-date v-model="queryParams.startTime" />
          <end-date v-model="queryParams.endTime" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
          <el-button v-hasPermi="['productModule:safe:add']" type="success" icon="el-icon-plus" size="small" @click="handleAdd">
            新增
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
    />
    <!--新增订单-->
    <el-dialog v-dialogDrag :close-on-click-modal="false" :title="dialogType==='edit'?'编辑':'新增'" :visible.sync="dialogVisible" class="dialog" width="530px">
      <el-form ref="formData" :model="formData" :rules="addFormRules" label-width="90px" style=" margin-left:40px;">
        <el-form-item label="事故等级" prop="alarmGrade">
          <el-input v-model="formData.alarmGrade" style="width: 100%;" clearable placeholder="请输入事故等级" />
        </el-form-item>
        <el-form-item label="事故详情" prop="alarmDetails">
          <el-input v-model="formData.alarmDetails" style="width: 100%;" clearable placeholder="请输入事故详情" />
        </el-form-item>
        <el-form-item label="事故危害" prop="alarmHarm">
          <el-input v-model="formData.alarmHarm" style="width: 100%;" clearable placeholder="请输入事故危害" />
        </el-form-item>
        <el-form-item label="事故原因" prop="alarmCause">
          <el-input v-model="formData.alarmCause" style="width: 100%;" clearable placeholder="请输入事故原因" />
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
import { addSafe, delSafe, listSafe, updateSafe } from '@/api/productModule/safe'

export default {
  name: 'Safe',
  data() {
    return {
      column: [
        { type: 'index', index: this.indexMethod },
        { label: '事故等级', prop: 'alarmGrade', disableSort: true },
        { label: '事故详情', prop: 'alarmDetails', disableSort: true },
        { label: '事故危害', prop: 'alarmHarm', disableSort: true },
        { label: '事故原因', prop: 'alarmCause', disableSort: true },
        { label: '事故时间', prop: 'createTime', disableSort: true },
        { label: '操作', render: (h, scope) => {
          return (
            <div id='btnWrap'>
              <el-button
                v-hasPermi={['productModule:safe:edit']}
                type='primary'
                size='mini'
                onClick={() => { this.handleEdit(scope.row) }}
              >编辑</el-button>
              <el-button
                v-hasPermi={['productModule:safe:del']}
                type='danger'
                size='mini'
                onClick={() => { this.handleDelete(scope) }}
              >删除</el-button>
            </div>
          )
          // )
        }, width: 200 }
      ],
      loading: false,
      total: 0, // 列表总条数
      // 查询信息
      queryParams: {
        page: 1,
        limit: 20,
        alarmGrade: undefined,
        startTime: undefined,
        endTime: undefined
      },
      list: [],
      dialogVisible: false,
      // dialogVisibleTools: false,
      dialogType: 'new',
      formData: {},
      addFormRules: {
        alarmGrade: [
          { required: true, message: '请输入事故等级', trigger: 'blur' }
        ],
        alarmDetails: [
          { required: true, message: '请输入事故详情', trigger: 'blur' }
        ],
        alarmHarm: [
          { required: true, message: '请输入事故危害', trigger: 'blur' }
        ],
        alarmCause: [
          { required: true, message: '请输入事故原因', trigger: 'blur' }
        ]
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
    getList() {
      this.loading = true
      listSafe(this.queryParams).then(res => {
        this.list = res.data
        this.total = res.count || 0
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
      this.dialogType = 'edit'
      this.dialogVisible = true
    },

    /** 删除按钮操作 */
    handleDelete(scope) {
      const id = scope.row.id
      this.$confirm('是否确认删除该数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return delSafe(id)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(() => {
      })
    },

    handleSubmit() {
      this.$refs['formData'].validate(valid => {
        if (valid) {
          if (this.dialogType !== 'new') {
            updateSafe(this.formData).then(res => {
              this.msgSuccess(res.msg)
              this.dialogVisible = false
              this.getList()
            })
          } else {
            addSafe(this.formData).then(res => {
              this.msgSuccess(res.msg)
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
        alarmGrade: undefined, // 告警等级
        alarmCause: undefined, // 数据唯一id
        alarmDetails: undefined, // 告警内容
        alarmHarm: undefined // 产线id
      }
      this.resetForm('formData')
    }
  }
}
</script>

<style scoped>

</style>
