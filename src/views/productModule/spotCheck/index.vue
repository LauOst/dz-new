<template>
  <div class="app-container">
    <!-- 头部筛选 -->
    <el-card shadow="never" class="card">
      <div style="display: flex;justify-content: space-between;align-items: center">
        <span>抽检数量设定</span>
        <el-button v-hasPermi="['productModule:spotCheck:spot']" type="primary" icon="el-icon-search" size="small" @click="handleQuery">抽检</el-button>
      </div>

      <!--      <el-form ref="queryForm" :inline="true" :model="queryParams">-->
      <!--        <el-form-item>-->
      <!--          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">查询</el-button>-->
      <!--          <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>-->
      <!--        </el-form-item>-->
      <!--      </el-form>-->
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

    <!--新增/编辑设备-->
    <el-dialog v-dialogDrag :close-on-click-modal="false" :modal-append-to-body="false" title="编辑" :visible.sync="dialogVisible" class="dialog" width="530px">
      <el-form ref="formData" :model="formData" :rules="addFormRules" label-width="100px" style="width: 400px; margin-left:40px;">
        <el-form-item label="当前设定值" prop="nowNum">
          <el-input v-model="formData.nowNum" clearable disabled placeholder="当前设定值" />
        </el-form-item>
        <el-form-item label="抽检值设定" prop="spotCheckNum">
          <el-input v-model="formData.spotCheckNum" clearable placeholder="请输入设备昵称" oninput="value = value.replace(/[^\d]/g,'')" />
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

    <!--抽检列表-->
    <el-dialog v-dialogDrag :close-on-click-modal="false" :modal-append-to-body="false" title="二维码" :visible.sync="dialogVisibleTest" class="dialog" width="730px">
      <!-- 表格信息 -->
      <dz-table
        v-loading="loadingTest"
        :column="columnTest"
        :data="listTest"
        :total="totalTest"
        :height="300"
      />
      <!-- 操作按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleTest = false">取消</el-button>
        <!--        <el-button type="primary" @click="handleSubmitTest('formData')">提交</el-button>-->
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { delEquipment } from '@/api/euipment/euipment'
import { getSpotCheckList, getSpotCheckQrCode, updateSpotCheck, updateSpotCheckTest } from '@/api/productModule/spotCheck'

export default {
  name: 'SpotCheck',
  data() {
    return {
      column: [
        { type: 'index', index: this.indexMethod, fixed: true },
        { label: '抽检数量设定', prop: 'spotCheckNum', formatter: this.spotCheckNumFormat },
        { label: '操作', render: (h, scope) => {
          return (
            <div>
              <el-button
                v-hasPermi={['productModule:spotCheck:edit']}
                type='primary'
                size='mini'
                onClick={() => { this.handleEdit(scope.row) }}
              >编辑</el-button>
            </div>

          )
        }, width: 200, fixed: 'right' }
      ],
      columnTest: [
        { label: '工件二维码', prop: 'qrCode' },
        { label: '操作', render: (h, scope) => {
          return (
            <div>
              <el-button
                v-hasPermi={['productModule:spotCheck:confirm']}
                type='primary'
                size='mini'
                onClick={() => { this.handleTest(scope.row) }}
              >确认抽检</el-button>
            </div>

          )
        }, width: 200, fixed: 'right' }
      ],
      // 遮罩层(加载)
      loading: false,
      loadingTest: false,
      total: 0, // 列表总条数
      totalTest: 0, // 列表总条数
      queryParams: { // 查询信息
        page: 1,
        limit: 20
      },
      list: [], // 表格数据
      listTest: [], // 表格数据
      dialogVisible: false, // 新增弹窗
      dialogVisibleTest: false, // 新增弹窗
      passVisible: false, // 确认气泡框
      formData: {},
      addFormRules: { // 表单验证
        equipmentName: [
          { required: true, message: '请输入设备名称', trigger: 'blur' }
        ],
        nickName: [
          { required: true, message: '请输入设备昵称', trigger: 'blur' }
        ]
      },
      btnFlag: false
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
    sortChange(column) {
      this.$mySort(this.queryParams, column, this.getList)
    },
    // 获取机器人列表
    getList() {
      this.loading = true
      getSpotCheckList(this.queryParams).then(res => {
        this.list = res.data
        this.total = res.count || 0
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },

    // 编辑设备
    handleEdit(row) {
      this.reset()
      this.formData = JSON.parse(JSON.stringify(row))
      this.formData.nowNum = row.spotCheckNum
      this.dialogVisible = true
    },

    // 抽检按钮
    handleTest(row) {
      updateSpotCheckTest(row).then(res => {
        this.$message.success(res.msg)
        this.handleQuery()
      })
    },
    // 提交设备信息
    handleSubmit() {
      this.$refs['formData'].validate((valid) => {
        if (valid) {
          updateSpotCheck({ spotCheckNum: this.formData.spotCheckNum, id: this.formData.id }).then(res => {
            this.$message.success(res.msg)
            this.dialogVisible = false
            this.passVisible = false
            this.getList()
          })
        }
      })
    },

    /** 删除按钮操作 */
    handleDelete(scope) {
      const id = scope.row.id
      this.$confirm('是否确认删除设备名称为"' + scope.row.equipmentName + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return delEquipment(id)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(() => {})
    },

    // 查询抽检件
    handleQuery() {
      this.loadingTest = true
      getSpotCheckQrCode().then(res => {
        this.listTest = res.data
        this.totalTest = res.count || 0
        this.dialogVisibleTest = true
        this.loadingTest = false
      })
    },
    resetQuery() {
      this.resetForm('queryForm')
      this.queryParams.page = 1
      this.btnFlag = false
      this.getList()
    },
    // 表单重置
    reset() {
      this.formData = {
        id: undefined,
        nowNum: undefined,
        SpotCheckNum: undefined // 设备编号
      }
      this.resetForm('formData')
    },
    spotCheckNumFormat(row) {
      return `每${row.spotCheckNum}件抽检一次`
    }

  }
}
</script>

<style>

</style>
