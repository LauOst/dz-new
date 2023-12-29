<template>
  <div class="app-container">
    <!-- 头部筛选 -->
    <el-card shadow="never" class="card">
      <el-form ref="queryForm" :inline="true" :model="queryParams.model">
        <el-form-item prop="lineNo">
          <el-input v-model="queryParams.model.lineNo" clearable size="small" placeholder="产线号" style="width: 200px;" />
        </el-form-item>
        <el-form-item prop="ipAddress">
          <el-input v-model="queryParams.model.ipAddress" clearable size="small" placeholder="IP" style="width: 180px;" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
          <el-button
            v-hasPermi="['productReplace:productReplaceConfig:add']"
            type="success"
            icon="el-icon-plus"
            size="small"
            @click="handleAdd"
          >新增
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
    <!--新增/编辑/详情产品换型配置-->
    <el-dialog
      v-dialogDrag
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      :title="dialogType==='edit' ? '编辑' : dialogType==='detail' ? '详情' : '新增'"
      :visible.sync="dialogVisible"
      class="dialog"
      width="800px"
    >
      <el-form ref="formData" :model="formData" :rules="addFormRules" label-width="140px" style="width: 600px; margin-left:40px;">
        <el-form-item label="产线号" prop="lineNo">
          <el-input v-model="formData.lineNo" :disabled="dialogType==='detail'" clearable placeholder="请输入产线号" />
        </el-form-item>
        <el-form-item label="IP" prop="ipAddress">
          <el-input v-model="formData.ipAddress" :disabled="dialogType==='detail'" clearable placeholder="请输入IP" />
        </el-form-item>
        <el-form-item label="机器人TCP端口号" prop="ipPort">
          <el-input v-model="formData.ipPort" :disabled="dialogType==='detail'" clearable placeholder="请输入机器人TCP端口号" />
        </el-form-item>
        <div>
          <div v-for="(item, index) in formData.paramList" :key="index">
            <el-form-item
              :label="index === 0 ? '换型参数名称': '' "
              :prop="`paramList[${index}].paramKey`"
              :rules="{ required: true, message: '换型参数名称', trigger: ['change', 'blur'] }"
            >
              <el-input v-model="formData.paramList[index].paramKey" :disabled="dialogType==='detail'" placeholder="换型参数名称" style="width: 300px;" />
              <el-button v-if="dialogType!=='detail'" type="text" size="mini" style="margin-left: 10px" @click="handleAddTool(index)"> {{ index === 0 ? '新增' : '删除' }} </el-button>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <!-- 操作按钮 -->
      <div style="text-align:right;margin-top: 60px">
        <el-button @click="dialogVisible=false">取消</el-button>
        <el-button v-if="dialogType!=='detail'" type="primary" @click="handleSubmit">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listRobotModel, addRobotModel, detailRobotModel, updateRobotModel, delRobotModel } from '@/api/productReplace/productReplaceConfig'
export default {
  name: 'ProductReplaceConfig',
  data() {
    return {
      column: [
        { label: '序号', type: 'index', index: this.indexMethod, fixed: true },
        { label: '产线号', prop: 'lineNo', disableSort: true },
        { label: 'IP', prop: 'ipAddress', disableSort: true },
        { label: '机器人TCP端口号', prop: 'ipPort', disableSort: true },
        { label: '操作人', prop: 'updateBy', disableSort: true },
        { label: '操作时间', prop: 'updateTime', disableSort: true },
        { label: '操作', render: (h, scope) => {
          return (
            <div id='btnWrap'>
              <el-button
                v-hasPermi={['productReplace:productReplaceConfig:detail']}
                type='primary'
                size='mini'
                onClick={() => { this.handleDetail(scope) }}
              >详情</el-button>
              <el-button
                v-hasPermi={['productReplace:productReplaceConfig:edit']}
                type='primary'
                size='mini'
                onClick={() => { this.handleEdit(scope.row) }}
              >编辑</el-button>
              <el-button
                v-hasPermi={['productReplace:productReplaceConfig:del']}
                type='danger'
                size='mini'
                onClick={() => { this.handleDelete(scope) }}
              >删除</el-button>
            </div>
          )
          // )
        }, width: 300 }
      ],
      // 遮罩层(加载)
      loading: false,
      btnLoading: false,
      total: 0, // 列表总条数
      queryParams: {
        type: '',
        field: '',
        page: 1,
        limit: 20,
        model: {
          lineNo: undefined,
          ipAddress: undefined,
          ipPort: undefined
        }
      },
      list: [], // 表格数据
      formData: {},
      addFormRules: { // 表单验证
        lineNo: [
          { required: true, message: '请输入产线号', trigger: 'blur' }
        ],
        ipAddress: [
          { required: true, message: '请输入IP', trigger: 'blur' }
        ],
        ipPort: [
          { required: true, message: '请输入IP端口', trigger: 'blur' }
        ]
      },
      dialogVisible: false, // 新增弹窗
      dialogType: 'new'
    }
  },
  async mounted() {
    this.getList()
  },
  methods: {
    // 格式化序号
    indexMethod(index) {
      return (this.queryParams.page - 1) * this.queryParams.limit + index + 1
    },
    // 获取机器人列表
    getList() {
      this.loading = true
      listRobotModel(this.queryParams).then(res => {
        const { list, total } = res.data
        this.list = list
        this.total = total || 0
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 新增设备
    handleAdd() {
      this.reset()
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    // 编辑设备
    handleEdit(row) {
      this.reset()
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.getDetailList(row.id)
    },
    /** 删除按钮操作 */
    handleDelete(scope) {
      const id = scope.row.id
      this.$confirm('是否确认删除该数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return delRobotModel({ id })
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(() => {})
    },
    // 提交设备信息
    handleSubmit() {
      this.$refs['formData'].validate((valid) => {
        if (valid) {
          if (this.formData.id !== undefined) { // 编辑
            console.log('编辑')
            updateRobotModel(this.formData).then(res => {
              this.$message.success(res.msg)
              this.dialogVisible = false
              this.passVisible = false
              this.getList()
            })
          } else {
            console.log('新增', this.formData)
            addRobotModel(this.formData).then(res => {
              this.$message.success(res.msg)
              this.dialogVisible = false
              // this.passVisible = false
              this.getList()
            })
          }
        }
      })
    },
    // 添加刀具
    handleAddTool(index) {
      if (index === 0) {
        this.formData.paramList.push({
          paramKey: undefined
        })
      } else {
        this.formData.paramList.splice(index, 1)
      }
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.$refs.queryForm.validate((valid) => {
        if (valid) {
          this.queryParams.page = 1
          this.getList()
        }
      })
    },
    // 详情
    handleDetail(scope) {
      this.reset()
      this.dialogType = 'detail'
      this.dialogVisible = true
      this.formData = JSON.parse(JSON.stringify(scope.row))
      this.getDetailList(this.formData.id)
    },
    getDetailList(id) {
      detailRobotModel({ id: id }).then(res => {
        this.formData = res.data
      }).catch(() => {
      })
    },
    // 表单重置
    reset() {
      this.formData = {
        id: undefined,
        lineNo: undefined, // 设备编号
        ipAddress: undefined, // 设备编号
        paramList: [
          {
            paramKey: undefined
          }
        ]
      }
      this.resetForm('formData')
    },
    /** 重置按钮操作 */
    async resetQuery() {
      await this.resetForm('queryForm')
      await this.handleQuery()
    }
  }
}
</script>

<style scoped>

</style>
