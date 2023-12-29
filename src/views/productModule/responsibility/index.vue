<template>
  <div class="app-container">
    <!-- 头部筛选 -->
    <el-card shadow="never" class="card">
      <span>负责人设置</span>
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
    <el-dialog v-dialogDrag :close-on-click-modal="false" title="编辑" :visible.sync="dialogVisible" class="dialog" width="530px">
      <el-form ref="formData" :model="formData" :rules="addFormRules" label-width="90px" style=" margin-left:40px;">
        <el-form-item label="负责人" prop="name">
          <el-input v-model="formData.name" style="width: 100%;" clearable placeholder="请输入负责人" />
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
import { listHaed, updateHaed } from '@/api/productModule/responsibility'

export default {
  name: 'Responsibility',
  data() {
    return {
      column: [
        { type: 'index', index: this.indexMethod },
        { label: '设备号', prop: 'equipmentNo', disableSort: true },
        { label: '设备名称', prop: 'equipmentName', disableSort: true },
        { label: '负责人', prop: 'name', disableSort: true },
        { label: '设置时间', prop: 'updateTime', disableSort: true },
        { label: '操作', render: (h, scope) => {
          return (
            <div id='btnWrap'>
              <el-button
                v-hasPermi={['productModule:safe:edit']}
                type='primary'
                size='mini'
                onClick={() => { this.handleEdit(scope.row) }}
              >编辑</el-button>
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
        limit: 20
      },
      list: [],
      dialogVisible: false,
      // dialogVisibleTools: false,
      dialogType: 'new',
      formData: {},
      addFormRules: {
        name: [{ required: true, message: '请输入负责人', trigger: 'blur' }]
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
      listHaed(this.queryParams).then(res => {
        this.list = res.data
        this.total = res.count || 0
        this.loading = false
      })
    },

    // 编辑
    handleEdit(row) {
      this.formData = JSON.parse(JSON.stringify(row))
      this.dialogType = 'edit'
      this.dialogVisible = true
    },

    handleSubmit() {
      this.$refs['formData'].validate(valid => {
        if (valid) {
          updateHaed(this.formData).then(res => {
            this.msgSuccess(res.msg)
            this.dialogVisible = false
            this.getList()
          })
        }
      })
    },

    // 表单重置
    reset() {
      this.formData = {
        name: undefined // 告警等级
      }
      this.resetForm('form')
    }
  }
}
</script>

<style scoped>

</style>
