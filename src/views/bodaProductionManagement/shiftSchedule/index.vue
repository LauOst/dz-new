<!--
 * @Author: zhixinJ
 * @Date: 2023-03-31 15:31:34
 * @Desc: 总成追溯
-->
<template>
  <div class="app-container">
    <!-- 头部筛选 -->
    <el-card shadow="never" class="card">
      <span>班次计划</span>
    </el-card>
    <!-- 表格信息 -->
    <!-- pagination -->
    <dz-table
      v-loading="loading"
      :column="column"
      :data="list"
      @pagination="getList"
    />
    <!--详情-->
    <el-dialog v-dialogDrag :close-on-click-modal="false" :title="'详情'" :visible.sync="dialogVisible" class="dialog" width="600px">
      <el-form ref="formData" :model="formData" label-width="120px" style="margin-left:40px;">
        <el-form-item label="班次计划产量" prop="planNum">
          <el-input-number v-model="formData.planNum" controls-position="right" :min="0" style="width: 30%" />
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
import { listWorkNamePlan, updateWorkStation } from '@/api/bodaProductionManagement/shiftSchedule'

export default {
  name: 'ShiftSchedule',
  data() {
    return {
      column: [
        { label: '班次计划', prop: 'planNum', disableSort: true },
        { label: '操作', render: (h, scope) => {
          return (
            <div>
              <el-button
                v-hasPermi={['bodaProductionManagement:shiftSchedule:edit']}
                type='primary'
                size='mini'
                onClick={() => { this.handleEdit(scope) }}
              >修改</el-button>
            </div>
          )
        } }
      ],
      columnDetail: [
        { label: '组件二维码', prop: 'componentQrCode', disableSort: true },
        { label: '组件装配人', prop: 'personName', disableSort: true },
        { label: '装配时间', prop: 'assembleTime', disableSort: true }
      ],
      loading: false,
      list: [],
      formData: {},
      detailList: [],
      dialogVisible: false // 新增编辑弹窗
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      listWorkNamePlan().then(res => {
        this.list = res.data
        this.total = res.count || 0
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    handleEdit(scope) {
      this.formData = JSON.parse(JSON.stringify(scope.row))
      this.dialogVisible = true
    },
    handleSubmit() {
      updateWorkStation(this.formData).then(res => {
        this.dialogVisible = false
        this.$message.success('修改成功')
        this.getList()
      })
    }
  }
}
</script>

<style scoped>
.text-title{
  color:#999;
}
.text-info{
  color: #000;
}
</style>
