<template>
  <div class="app-container">
    <!-- 头部筛选 -->
    <el-card shadow="never" class="card">
      <span>制令管理</span>
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
    <!--新增订单-->
    <el-dialog v-dialogDrag :close-on-click-modal="false" title="条码输入" :visible.sync="dialogVisible" class="dialog" width="530px">
      <el-form ref="formData" :model="formData" :rules="addFormRules" label-width="80px" style=" margin-left:40px;">
        <el-form-item label="条码" prop="compIdSeq">
          <!--          maxlength="4" oninput="value=value.replace(/[^\d]/g,'')"-->
          <el-input v-model="formData.compIdSeq" />
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
import { listBrCode, updateBrCode } from '@/api/hs/brCode'

export default {
  name: 'BarCode',
  data() {
    return {
      column: [
        { type: 'index', index: this.indexMethod },
        { label: '设备编号', prop: 'equipmentNo' },
        { label: '条形编码', prop: 'compIdSeq' },
        { label: '操作', render: (h, scope) => {
          return (
            <div>
              <el-button
                v-hasPermi={['order:order:edit']}
                type='primary'
                size='mini'
                onClick={() => { this.handleEdit(scope) }}
              >输入制令</el-button>
              <el-button
                v-hasPermi={['order:order:del']}
                type='success'
                size='mini'
                onClick={() => { this.handleDelete(scope) }}
              >制令详情</el-button>
            </div>
          )
        }, width: 240 }
      ],
      loading: false,
      total: 0, // 列表总条数
      // 查询信息
      queryParams: {
        page: 1,
        limit: 20,
        field: undefined,
        type: undefined
      },
      list: [],
      dialogVisible: false,
      formData: {},
      addFormRules: {
        compIdSeq: [
          { required: true, message: '请输入条码', trigger: 'blur' }
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
      listBrCode(this.queryParams).then(res => {
        this.list = res.data
        this.total = res.count || 0
        this.loading = false
      })
    },
    handleEdit(scope) {
      this.reset()
      this.formData.equipmentNo = scope.row.equipmentNo
      this.dialogVisible = true
    },
    // 提交新增订单信息
    handleSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          updateBrCode(this.formData).then(res => {
            this.$message.success(res.msg)
            this.dialogVisible = false
            this.getList()
          })
        }
      })
    },
    // 表单重置
    reset() {
      this.formData = {
        compIdSeq: undefined,
        equipmentNo: undefined
      }
      this.resetForm('formData')
    }
  }

}
</script>

<style scoped>

</style>
