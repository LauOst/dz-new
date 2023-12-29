<template>
  <div class="app-container">
    <!-- 头部筛选 -->
    <el-card shadow="never" class="card">
      <el-form ref="queryForm" :inline="true" :model="queryParams">
        <el-form-item prop="productOrderId">
          <el-input v-model="queryParams.productOrderId" clearable size="small" placeholder="制令单号" style="width: 180px;" />
        </el-form-item>
        <el-form-item prop="compIdSeq">
          <el-input v-model="queryParams.compIdSeq" clearable size="small" placeholder="条形编码" style="width: 180px;" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
          <el-button v-hasPermi="['hs:workpiece:bind']" type="primary" plain icon="el-icon-takeaway-box" :disabled="stoveInfo.list.length === 0" size="small" @click="handleBind">绑定炉号</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
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
      @sortChange="sortChange"
      @handleSelectionChange="handleSelectionChange"
    />
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
    <!-- 绑定炉号 -->
    <el-dialog v-dialogDrag :close-on-click-modal="false" :title="'绑定炉号'" :visible.sync="stoveDialog" class="dialog" width="530px">
      <el-form ref="stoveInfo" :model="stoveInfo" :rules="addStoveFormRules" label-width="90px" style=" margin-left:40px;">
        <el-form-item label="炉号" prop="lno">
          <el-input v-model="stoveInfo.lno" />
        </el-form-item>
      </el-form>
      <!-- 操作按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="stoveDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitBind('stoveInfo')">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { listWorkpiece, updateWorkpiece, bingCompLno } from '@/api/hs/workpiece'
// import { updateBrCode } from '@/api/hs/brCode'

export default {
  name: 'Workpiece',
  data() {
    return {
      column: [
        { type: 'selection', reserveSelection: true },
        { type: 'index', index: this.indexMethod },
        { label: '炉号', prop: 'lno' },
        { label: '制令单号', prop: 'productOrderId' },
        { label: '粗加工号', prop: 'compId' },
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
        limit: 20,
        field: undefined,
        type: undefined,
        productOrderId: undefined,
        compIdSeq: undefined
      },
      list: [],
      dialogVisible: false,
      formData: {},
      addFormRules: {
        compIdSeq: [
          { required: true, message: '请输入条码', trigger: 'blur' }
        ]
      },
      addStoveFormRules: {
        lno: [
          { required: true, message: '请输入炉号', trigger: 'blur' }
        ]
      },
      lineTypeList: [{ name: '未下发', value: 0 }, { name: '下发', value: 1 }],
      isProcessList: [{ name: '未完成', value: 0 }, { name: '已完成', value: 1 }],
      tableList: [],
      stoveDialog: false,
      stoveInfo: {
        list: [],
        lno: undefined
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
    handleSelectionChange(list) {
      this.stoveInfo.list = Array.from(list, ({ compIdSeq }) => compIdSeq)
    },
    getList() {
      this.loading = true
      listWorkpiece(this.queryParams).then(res => {
        this.list = res.data
        this.total = res.count || 0
        this.loading = false
      })
    },
    handleEdit(scope) {
      this.formData = JSON.parse(JSON.stringify(scope.row))
      // this.reset()
      // this.formData.equipmentNo = scope.row.equipmentNo
      this.dialogVisible = true
    },
    // 提交新增订单信息
    handleSubmit(formName) {
      updateWorkpiece(this.formData).then(res => {
        this.dialogVisible = false
        this.$message.success('修改成功')
        this.getList()
      })
    },
    handleSubmitBind(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          bingCompLno(this.stoveInfo).then(res => {
            this.stoveDialog = false
            this.$message.success(res.msg)
            this.getList()
            this.$refs.table.clearSelection()
          })
        }
      })
      // this.stoveDialog = true
    },
    // handleSubmit(formName) {
    //   this.$refs[formName].validate((valid) => {
    //     if (valid) {
    //       updateBrCode(this.formData).then(res => {
    //         this.$message.success(res.msg)
    //         this.dialogVisible = false
    //         this.getList()
    //       })
    //     }
    //   })
    // },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1
      this.getList()
    },
    handleBind() {
      this.stoveDialog = true
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
      this.$refs.table.clearSelection() // 清空表格多选
    },
    // 表单重置
    reset() {
      this.formData = {
        compIdSeq: undefined,
        equipmentNo: undefined
      }
      this.resetForm('formData')
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
        0: '未完成',
        1: '已完成'
      }
      return obj[row.isProcess]
    }
  }

}
</script>

<style scoped>

</style>
