<template>
  <div class="app-container">
    <el-card shadow="never" class="card">
      <span style="font-weight: 700">二维码输入</span>
    </el-card>
    <dz-table
      v-loading="loading"
      :column="column"
      :data="list"
      :total="total"
    />
    <!-- 添加或修改参数配置对话框 -->
    <el-dialog v-dialogDrag :close-on-click-modal="false" :modal-append-to-body="false" title="编辑" :visible.sync="dialogVisible" class="dialog" width="530px">
      <el-form
        ref="formData"
        :model="formData"
        :rules="rules"
        label-width="90px"
        style="width: 400px; margin-left:40px;"
      >
        <el-form-item label="类型" prop="code">
          <!--          <el-input v-model="formData.code" placeholder="请输入类型" disabled />-->
          <el-select v-model="formData.code" placeholder="请输入类型" style="width: 100%" disabled>
            <el-option label="内部" :value="'100'" />
            <el-option label="外部" :value="'200'" />
          </el-select>
        </el-form-item>
        <el-form-item label="类别" prop="factoryCode">
          <el-input v-model="formData.factoryCode" placeholder="请输入类别" />
        </el-form-item>
        <el-form-item label="计划号" prop="planCode">
          <el-input v-model="formData.planCode" placeholder="请输入计划号" />
        </el-form-item>
        <el-form-item label="字头" prop="initial">
          <el-input v-model="formData.initial" placeholder="请输入字头" />
        </el-form-item>
        <el-form-item label="流水号" prop="serialNo">
          <el-input v-model="formData.serialNo" placeholder="请输入流水号" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="submitForm">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listMark, sendMark, updateMark } from '@/api/mark/qrCode'

export default {
  name: 'QrCode',
  data() {
    return {
      loading: false,
      column: [
        { type: 'index', index: this.indexMethod },
        { label: '类型', prop: 'code', formatter: this.codeFormat },
        { label: '类别', prop: 'factoryCode' },
        { label: '计划号', prop: 'planCode' },
        { label: '字头', prop: 'initial' },
        { label: '流水号', prop: 'serialNo' },
        { label: '操作', render: (h, scope) => {
          return (
            <div id='btnWrap'>
              <el-button
                v-hasPermi={['mark:qrCode:edit']}
                type='primary'
                size='mini'
                onClick={() => { this.handleEdit(scope) }}
              >编辑</el-button>
              <el-button
                v-hasPermi={['mark:qrCode:send']}
                type='success'
                size='mini'
                onClick={() => { this.handleSend(scope) }}
              >发送</el-button>
            </div>
          )
          // )
        }, width: 180 }
      ],
      dialogVisible: false, // 新增弹窗
      // 分页搜索参数
      queryParams: {
        page: 1,
        limit: 20
      },
      list: [],
      total: 0,
      formData: {},
      rules: []
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
    /** 查询列表 */
    getList() {
      this.loading = true
      listMark().then(
        response => {
          this.list = response.data
          this.total = response.count
          this.loading = false
        }
      ).catch(() => {
        this.loading = false
      })
    },
    // 编辑
    handleEdit(scope) {
      this.reset()
      this.formData = JSON.parse(JSON.stringify(scope.row))
      this.dialogVisible = true
    },
    // 发送
    handleSend(scope) {
      this.$confirm('是否确认发送', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return sendMark({ code: scope.row.code })
      }).then(() => {
        this.getList()
        this.msgSuccess('发送成功')
      }).catch(() => {})
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['formData'].validate(valid => {
        if (valid) {
          updateMark(this.formData).then(response => {
            this.msgSuccess('修改成功')
            this.dialogVisible = false
            this.getList()
          })
        }
      })
    },
    // 表单重置
    reset() {
      this.formData = {
        code: undefined,
        factoryCode: undefined,
        planCode: undefined,
        initial: undefined,
        serialNo: undefined
      }
      this.resetForm('formData')
    },
    // code格式化
    codeFormat(row) {
      const obj = {
        '100': '内部',
        '200': '外部'
      }
      return obj[row.code]
    }
  }
}
</script>

<style scoped>

</style>
