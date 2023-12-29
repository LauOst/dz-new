<template>
  <div class="app-container">
    <!-- 头部筛选 -->
    <el-card shadow="never" class="card">
      <span>MES地址管理</span>
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
    />
    <!-- 编辑 -->
    <el-dialog v-dialogDrag :close-on-click-modal="false" :title="'编辑'" :visible.sync="dialogVisible" class="dialog" width="530px">
      <el-form ref="formData" :model="formData" :rules="addFormRules" label-width="90px" style=" margin-left:40px;">
        <el-form-item label="MESIP" prop="url">
          <el-input v-model="formData.url" placeholder="请输入IP地址" />
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
import { listAddress, updateAddress } from '@/api/productModule/address'

export default {
  name: 'Address',
  data() {
    return {
      column: [
        { type: 'index', index: this.indexMethod },
        { label: '类型', prop: 'type', disableSort: true },
        { label: 'MESIP', prop: 'url', disableSort: true },
        { label: '操作', render: (h, scope) => {
          return (
            <div>
              <el-button
                type='primary'
                size='mini'
                onClick={() => { this.handleEdit(scope) }}
              >编辑</el-button>
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
        mesIp: undefined
      },
      list: [],
      dialogVisible: false,
      formData: {
        url: undefined
      },
      addFormRules: {
        mesIp: [
          { required: true, message: '请输入IP地址', trigger: 'blur' }
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
    // 排序
    sortChange(column) {
      this.$mySort(this.queryParams, column, this.getList)
    },
    getList() {
      this.loading = true
      listAddress(this.queryParams).then(res => {
        this.list = res.data
        this.total = res.count || 0
        this.loading = false
      })
    },
    handleEdit(scope) {
      this.formData = JSON.parse(JSON.stringify(scope.row))
      this.dialogVisible = true
    },
    // 提交新增订单信息
    handleSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          updateAddress(this.formData).then(res => {
            this.$message.success(res.msg)
            this.dialogVisible = false
            this.getList()
          })
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
    }
  }
}
</script>

<style scoped>

</style>
