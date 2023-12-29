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
        <el-form-item label="年" prop="year">
          <el-input v-model="formData.year" placeholder="请输入年份" />
        </el-form-item>
        <el-form-item label="月" prop="mouth">
          <el-input v-model="formData.mouth" placeholder="请输入月份" />
        </el-form-item>
        <el-form-item label="流水号" prop="serialNo">
          <el-input v-model="formData.serialNo" placeholder="请输入流水号" />
        </el-form-item>
        <el-form-item label="清理选择" prop="code">
          <el-select v-model="formData.isClean" placeholder="请输入类型" style="width: 100%">
            <el-option label="清理A打标流水" :value="1" />
            <el-option label="清理B打标流水" :value="2" />
            <el-option label="清理全部" :value="3" />
          </el-select>
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
        { label: '年', prop: 'year' },
        { label: '月', prop: 'mouth' },
        { label: '流水号', prop: 'serialNo' },
        { label: '清理选择', prop: 'isClean', formatter: this.cleanFormat },
        { label: '操作', render: (h, scope) => {
          return (
            <div id='btnWrap'>
              <el-button
                v-hasPermi={['mark:xdQrCode:edit']}
                type='primary'
                size='mini'
                onClick={() => { this.handleEdit(scope) }}
              >编辑</el-button>
              <el-button
                v-hasPermi={['mark:xdQrCode:send']}
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
        year: undefined,
        mouth: undefined,
        serialNo: undefined,
        isClean: undefined
      }
      this.resetForm('formData')
    },
    // code格式化
    cleanFormat(row) {
      const obj = {
        1: '清理A打标流水',
        2: '清理B打标流水',
        3: '清理全部'
      }
      return obj[row.isClean]
    }
  }
}
</script>

<style scoped>

</style>
