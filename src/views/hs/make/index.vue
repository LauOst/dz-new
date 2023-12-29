<template>
  <div class="app-container teshu" style="position: absolute; width: 100%;height: 100%">
    <!-- 头部筛选 -->
    <el-card shadow="never" class="card">
      <el-form ref="queryForm" :inline="true" :model="queryParams">
        <el-form-item prop="productOrderId">
          <el-input v-model="queryParams.productOrderId" clearable size="small" placeholder="制令编号" style="width: 180px;" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 表格信息 -->
    <div ref="containerRef" style="height: 88%;">
      <div style="height: 50%;background: #ccc">
        <dz-table
          v-loading="loading"
          :height="tableH"
          :column="column"
          :data="list"
          :total="total"
          pagination
          :page.sync="queryParams.page"
          :limit.sync="queryParams.limit"
          :cell-style="cellStyle"
          @cell-click="cellHandleclick"
          @pagination="getList"
        />
      </div>
      <div style="height: 50%;margin-top: 20px">
        <dz-table
          ref="table"
          v-loading="loadingWork"
          :height="tableH"
          :column="columnWork"
          :data="listWork"
          :total="totalWork"
          pagination
          :page.sync="queryParamsWork.page"
          :limit.sync="queryParamsWork.limit"

          @pagination="getListWork"
        />
      </div>
    </div>
    <!-- 编辑工件 -->
    <el-dialog v-dialogDrag :close-on-click-modal="false" :title="'修改工件信息'" :visible.sync="dialogVisible" class="dialog" width="530px">
      <el-form ref="formData" :model="formData" :rules="addFormRules" label-width="90px" style=" margin-left:40px;">
        <el-form-item label="制令单号" prop="productOrderId">
          <el-input v-model="formData.productOrderId" disabled />
        </el-form-item>
        <el-form-item label="粗加工号" prop="compId">
          <el-input v-model="formData.compId" disabled />
        </el-form-item>
        <el-form-item label="是否下发" prop="isXiafa">
          <el-select v-model="formData.isXiafa" placeholder="请选择是否下发">
            <el-option v-for="(item,index) in lineTypeList" :key="index" :label="item.name" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否完成" prop="isProcess">
          <el-select v-model="formData.isXiafa" placeholder="请选择是否完成" disabled>
            <el-option v-for="(item,index) in isProcessList" :key="index" :label="item.name" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="条形编码" prop="compIdSeq">
          <el-input v-model="formData.compIdSeq" disabled />
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
import { listMake } from '@/api/hs/make'
import { listWorkpiece, updateWorkpiece } from '@/api/hs/workpiece'

export default {
  name: 'Make',
  data() {
    return {
      column: [
        { type: 'index', index: this.indexMethod },
        { label: '制令编号', prop: 'productOrderId' },
        { label: '成品料号', prop: 'itnbr' },
        { label: '成品名称', prop: 'itdsc' },
        { label: '制令数量', prop: 'qty' },
        { label: '完成数量', prop: 'compeleNum' },
        { label: '是否打码', prop: 'isCode', formatter: this.isCodeFormat },
        { label: '检测数量', prop: 'checkNum' },
        { label: '首件是否完成', prop: 'isFirst', width: 180, formatter: this.isFirstFormat },
        { label: '首件料', prop: 'firstComp' },
        { label: '排产日期', prop: 'productTime', width: 180 },
        { label: '下线时间', prop: 'downTime', width: 180 }
      ],
      columnWork: [
        { type: 'index', index: this.indexMethodWork },
        { label: '炉号', prop: 'lno' },
        { label: '制令单号', prop: 'productOrderId' },
        { label: '粗加工号', prop: 'compId' },
        { label: '成品名称', prop: 'itdsc' },
        { label: '是否下发', prop: 'isXiafa', formatter: this.isXiafaFormat },
        { label: '是否完成', prop: 'isProcess', formatter: this.isProcessFormat },
        { label: '条形编码', prop: 'compIdSeq' },
        { label: '操作', render: (h, scope) => {
          return (
            <div>
              <el-button
                v-hasPermi={['hs:workpiece:edit']}
                type='primary'
                size='mini'
                onClick={() => { this.handleEdit(scope) }}
              >编辑</el-button>
            </div>
          )
        }, width: 140, fixed: 'right' }
      ],
      loading: false,
      total: 0, // 列表总条数
      // 查询信息
      queryParams: {
        page: 1,
        limit: 10,
        productOrderId: undefined
      },
      list: [],
      tableH: 0,
      loadingWork: false,
      totalWork: 0, // 列表总条数
      // 查询信息
      queryParamsWork: {
        page: 1,
        limit: 10,
        field: undefined,
        type: undefined,
        productOrderId: undefined,
        compIdSeq: undefined
      },
      listWork: [],
      dialogVisible: false,
      formData: {},
      addFormRules: {
        compIdSeq: [
          { required: true, message: '请输入条码', trigger: 'blur' }
        ]
      },
      lineTypeList: [{ name: '未下发', value: 0 }, { name: '下发', value: 1 }],
      isProcessList: [{ name: '未完成', value: 0 }, { name: '已完成', value: 1 }]
    }
  },
  mounted() {
    this.getList()
    this.getListWork()
    this.fetTableHeight()
  },
  methods: {
    // 重置table高度
    resetHeight() {
      return new Promise((resolve, reject) => {
        this.tableH = 0
        resolve()
      })
    },
    // 设置table高度
    fetTableHeight() {
      this.resetHeight().then(res => {
        this.tableH = this.$refs.containerRef.getBoundingClientRect().height / 2 - 57
      })
    },
    // 格式化序号
    indexMethod(index) {
      return (this.queryParams.page - 1) * this.queryParams.limit + index + 1
    },
    // 格式化序号
    indexMethodWork(index) {
      return (this.queryParamsWork.page - 1) * this.queryParamsWork.limit + index + 1
    },
    getList() {
      this.loading = true
      listMake(this.queryParams).then(res => {
        this.list = res.data
        this.total = res.count || 0
        this.loading = false
      })
    },
    getListWork() {
      this.loadingWork = true
      listWorkpiece(this.queryParamsWork).then(res => {
        this.listWork = res.data
        this.totalWork = res.count || 0
        this.loadingWork = false
      })
    },
    // 单元格事件
    cellHandleclick(row) {
      this.queryParamsWork.productOrderId = row.productOrderId
      this.getListWork()
    },
    cellStyle(data) {
      return 'cursor:pointer;'
    },
    handleEdit(scope) {
      this.formData = JSON.parse(JSON.stringify(scope.row))
      this.dialogVisible = true
    },
    handleSubmit(formName) {
      updateWorkpiece(this.formData).then(res => {
        this.dialogVisible = false
        this.$message.success('修改成功')
        this.getListWork()
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
        compIdSeq: undefined,
        equipmentNo: undefined
      }
      this.resetForm('formData')
    },

    isCodeFormat(row) {
      const obj = {
        0: '不打码',
        1: '需要打码'
      }
      return obj[row.isCode]
    },
    isFirstFormat(row) {
      const obj = {
        0: '未完成',
        1: '完成'
      }
      return obj[row.isFirst]
    },
    // 格式化
    isXiafaFormat(row) {
      const obj = {
        0: '未下发',
        1: '下发'
      }
      return obj[row.isXiafa]
    },
    isProcessFormat(row) {
      const obj = {
        '-1': '加工中',
        0: '未完成',
        1: '已完成'
      }
      return obj[row.isProcess]
    }
  }

}
</script>

<style lang="scss">
.teshu {
.el-card__body {
  padding: 10px !important;
}
}

</style>
