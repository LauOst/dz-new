<template>
  <div class="app-container">
    <!-- 头部筛选 -->
    <el-card shadow="never" class="card">
      <el-form ref="queryForm" :inline="true" :model="queryParams">
        <el-form-item prop="productNo">
          <el-input v-model="queryParams.productNo" clearable size="small" placeholder="产品型号" style="width: 180px;" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
          <el-button v-hasPermi="['productModule:productManage:add']" type="success" icon="el-icon-plus" size="small" @click="handleAdd">
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
    <el-dialog v-dialogDrag :close-on-click-modal="false" :title="dialogType==='edit'?'编辑':'新增'" :visible.sync="dialogVisible" class="dialog" width="630px">
      <el-form ref="formData" :model="formData" :rules="addFormRules" label-width="120px" style=" margin-left:40px;">
        <el-form-item label="产品型号" prop="productNo">
          <el-input v-model="formData.productNo" style="width: 100%;" clearable placeholder="请输入产品型号" />
        </el-form-item>
        <el-form-item label="重量" prop="weight">
          <el-input v-model="formData.weight" style="width: 100%;" clearable placeholder="请输入重量" />
        </el-form-item>
        <el-form-item label="长度" prop="length">
          <el-input v-model="formData.length" style="width: 100%;" clearable placeholder="请输入长度" />
        </el-form-item>
        <el-form-item label="螺纹直径" prop="threadDiameter">
          <el-input v-model="formData.threadDiameter" style="width: 100%;" clearable placeholder="请输入螺纹直径" />
        </el-form-item>
        <el-form-item label="产品料框" prop="productBox">
          <el-input v-model="formData.productBox" style="width: 100%;" clearable placeholder="请输入产品料框" />
        </el-form-item>
        <el-form-item label="杆子直径" prop="poleDiameter">
          <el-input v-model="formData.poleDiameter" style="width: 100%;" clearable placeholder="请输入杆子直径" />
        </el-form-item>
        <el-form-item label="工序" prop="production">
          <el-input v-model="formData.production" style="width: 100%;" clearable placeholder="请输入工序" />
        </el-form-item>
        <el-form-item label="机器人程序号" prop="robProagamNo">
          <el-input v-model="formData.robProagamNo" style="width: 100%;" clearable placeholder="请输入机器人程序号" />
        </el-form-item>
        <el-form-item label="杆子长度" prop="poleLength">
          <el-input v-model="formData.poleLength" style="width: 100%;" clearable placeholder="请输入杆子长度" />
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
import {
  addProductManage,
  delProductManage,
  listProductManage,
  updateProductManage
} from '@/api/productModule/productManage'

export default {
  name: 'ProductManage',
  data() {
    return {
      column: [
        { type: 'index', index: this.indexMethod },
        { label: '产品型号', prop: 'productNo', disableSort: true },
        { label: '重量', prop: 'weight', disableSort: true },
        { label: '长度', prop: 'length', disableSort: true },
        { label: '螺纹直径', prop: 'threadDiameter', disableSort: true },
        { label: '产品料框', prop: 'productBox', disableSort: true },
        { label: '杆子直径', prop: 'poleDiameter', disableSort: true },
        { label: '工序', prop: 'production', disableSort: true },
        { label: '机器人程序号', prop: 'robProagamNo', disableSort: true },
        { label: '发送时间', prop: 'createTime', disableSort: true },
        { label: '操作', render: (h, scope) => {
          return (
            <div id='btnWrap'>
              <el-button
                v-hasPermi={['productModule:productManage:edit']}
                type='primary'
                size='mini'
                onClick={() => { this.handleEdit(scope.row) }}
              >编辑</el-button>
              <el-button
                v-hasPermi={['productModule:productManage:del']}
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
        productNo: undefined
      },
      list: [],
      dialogVisible: false,
      // dialogVisibleTools: false,
      dialogType: 'new',
      formData: {},
      equipmentList: [],
      productsList: [],
      addFormRules: {
        productNo: [
          { required: true, message: '请输入产品型号', trigger: 'blur' }
        ],
        weight: [
          { required: true, message: '请输入重量', trigger: 'blur' }
        ],
        length: [
          { required: true, message: '请输入长度', trigger: 'blur' }
        ],
        threadDiameter: [
          { required: true, message: '请输入螺纹直径', trigger: 'blur' }
        ],
        productBox: [
          { required: true, message: '请输入产品料框', trigger: 'blur' }
        ],
        poleDiameter: [
          { required: true, message: '请输入杆子直径', trigger: 'blur' }
        ],
        production: [
          { required: true, message: '请输入工序', trigger: 'blur' }
        ],
        robProagamNo: [
          { required: true, message: '请输入机器人程序号', trigger: 'blur' }
        ],
        poleLength: [
          { required: true, message: '请输入杆子长度', trigger: 'blur' }
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
      listProductManage(this.queryParams).then(res => {
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
        return delProductManage(id)
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
            updateProductManage(this.formData).then(res => {
              this.msgSuccess(res.msg)
              this.dialogVisible = false
              this.getList()
            })
          } else {
            addProductManage(this.formData).then(res => {
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
        length: undefined,
        poleDiameter: undefined,
        poleLength: undefined,
        productBox: undefined,
        productNo: undefined,
        production: undefined,
        robProagamNo: undefined,
        threadDiameter: undefined,
        weight: undefined
      }
      this.resetForm('form')
    }
  }
}
</script>

<style scoped>

</style>
