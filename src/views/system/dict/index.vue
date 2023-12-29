<template>
  <div class="app-container">
    <!-- 头部筛选 -->
    <el-card shadow="never" class="card">
      <el-form v-show="showSearch" ref="queryForm" :inline="true" :model="queryParams">
        <el-form-item prop="dictName">
          <el-input v-model="queryParams.dictName" clearable size="small" placeholder="字典名称" style="width: 200px;" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
          <el-button type="success" icon="el-icon-plus" size="small" @click="handleAdd">
            新增
          </el-button>
          <el-button v-hasPermi="['depart:excel']" :loading="btnLoading" type="warning" icon="el-icon-download" size="small" @click="handleExport">导出</el-button>
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
      @sortChange="sortChange"
    />
    <!--    <el-table ref="table" v-loading="loading" style="width: 100%" :data="list" border height="600">-->
    <!--      <el-table-column type="index" label="序号" :index="indexMethod" width="100" align="center" fixed="left" show-overflow-tooltip />-->
    <!--      <el-table-column prop="dictName" label="字典名称" align="center" show-overflow-tooltip />-->
    <!--      <el-table-column label="字典编码" align="center" :show-overflow-tooltip="true">-->
    <!--        <template slot-scope="scope">-->
    <!--          <router-link :to="'/dict/type/data/' + scope.row.id" class="link-type">-->
    <!--            <el-button type="text">{{ scope.row.dictCode }}</el-button>-->
    <!--          </router-link>-->
    <!--        </template>-->
    <!--      </el-table-column>-->
    <!--      <el-table-column prop="description" label="描述" align="center" show-overflow-tooltip />-->
    <!--      <el-table-column prop="createBy" label="新增人" align="center" show-overflow-tooltip />-->
    <!--      <el-table-column prop="createTime" label="新增时间" align="center" width="180" show-overflow-tooltip />-->
    <!--      <el-table-column label="操作" width="160" fixed="right" align="center" show-overflow-tooltip>-->
    <!--        <template slot-scope="scope">-->
    <!--          <el-button type="primary" size="mini" @click="handleEdit(scope.row)">编辑</el-button>-->
    <!--        </template></el-table-column>-->
    <!--    </el-table>-->

    <!--新增/编辑字典-->
    <el-dialog v-dialogDrag :close-on-click-modal="false" :modal-append-to-body="false" :title="dialogType==='edit'?'编辑字典':'新增字典'" :visible.sync="dialogVisible" class="dialog" width="530px">
      <el-form ref="formData" :model="formData" :rules="addFormRules" label-width="90px" style="width: 400px; margin-left:40px;">
        <el-form-item label="字典名称	" prop="dictName">
          <el-input v-model="formData.dictName" :disabled="formData.id !== undefined" clearable placeholder="请输入字典名称	" />
        </el-form-item>
        <el-form-item label="字典编码" prop="dictCode">
          <el-input v-model="formData.dictCode" :disabled="formData.id !== undefined" clearable placeholder="请输入字典编码" />
        </el-form-item>
        <el-form-item label-width="0" prop="description">
          <div class="label-top">描述</div>
          <el-input
            v-model="formData.description"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            clearable
            placeholder="请输入描述"
          />
        </el-form-item>
      </el-form>

      <!-- 操作按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-popover v-model="passVisible" placement="top" width="160">
          <p>确认提交？</p>
          <div style="text-align: right; margin: 0">
            <el-button size="small" type="text" @click="passVisible = false">取消</el-button>
            <el-button type="primary" size="small" @click="handleSubmit('formData')">确定</el-button>
          </div>
          <el-button slot="reference" class="l-m-l-10" type="primary">提交</el-button>
        </el-popover>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getDict, // 查询字典列表
  addDict, // 添加字典
  updateDict // 修改字典
} from '@/api/system/dict'
import { downloadDict } from '@/api/excel/excel'

export default {
  name: 'Dict',
  data() {
    return {
      // 表格信息
      column: [
        { type: 'index', index: this.indexMethod },
        { label: '字典名称', prop: 'dictName' },
        { label: '字典编码', render: (h, scope) => {
          return (
            <div>
              <router-link to={'/dict/type/data/' + scope.row.id}>
                <el-button type='text'>{ scope.row.dictCode }</el-button>
              </router-link>
            </div>
          )
        } },
        { label: '描述', prop: 'tcpDescription' },
        { label: '新增人', prop: 'createBy' },
        { label: '新增时间', prop: 'createTime' },
        { label: '操作', render: (h, scope) => {
          return (
            <div id='btnWrap'>
              <el-button
                v-hasPermi={['system:instruct:edit']}
                type='primary'
                size='mini'
                onClick={() => { this.handleEdit(scope.row) }}
              >编辑</el-button>
            </div>
          )
          // )
        }, width: 240 }
      ],
      // 遮罩层(加载)
      loading: false,
      btnLoading: false,
      // 显示搜索条件
      showSearch: true,
      total: 0, // 列表总条数
      queryParams: { // 查询信息
        page: 1,
        limit: 20,
        dictName: '', // 字典名称
        dictCode: '', // 字典编码
        description: '', // 描述
        field: undefined,
        type: undefined
      },
      formData: { // 添加产品表单信息
        dictName: '', // 字典名称
        dictCode: '', // 字典编码
        description: '' // 描述
      },
      addFormRules: { // 表单验证
        dictName: [
          { required: true, message: '请输入字典名称', trigger: 'change' }
        ],
        dictCode: [
          { required: true, message: '请输入字典编码', trigger: 'change' }
        ]
      },
      dialogType: 'new',
      dialogVisible: false, // 新增弹窗
      passVisible: false, // 确认气泡框
      list: [], // 表格数据
      dictId: 0 // 字典id
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
    // 获取字典列表
    getList() {
      this.loading = true
      getDict(this.queryParams).then(res => {
        this.list = res.data
        this.total = res.count || 0
        this.loading = false
      })
    },
    // 新增
    handleAdd() {
      this.reset()
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    // 修改数据字典
    handleEdit(row) {
      this.reset()
      this.formData = row.id
      this.formData = JSON.parse(JSON.stringify(row))
      this.dialogType = 'edit'
      this.dialogVisible = true
    },
    // 提交产线信息
    handleSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.formData.id !== undefined) { // 编辑
            updateDict(this.formData).then(res => {
              this.$message.success(res.msg)
              this.dialogVisible = false
              this.passVisible = false
              this.getList()
            })
          } else { // 新增
            addDict(this.formData).then(res => {
              this.$message.success(res.msg)
              this.dialogVisible = false
              this.passVisible = false
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
    // 导出按钮
    handleExport() {
      this.btnLoading = true
      downloadDict(this.queryParams).then((res) => {
        this.btnLoading = false
        if (!res.data) return
        this.$downloadFunc(res)
      }).catch((err) => {
        console.log('err', err)
        this.btnLoading = false
      })
    },
    // 表单重置
    reset() {
      this.formData = {
        id: undefined,
        dictName: undefined, // 字典名称
        dictCode: undefined, // 字典编码
        description: undefined // 描述
      }
      this.resetForm('formData')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
