<template>
  <div class="app-container">
    <!-- 头部筛选 -->
    <el-card shadow="never" class="card">
      <el-form ref="queryForm" :inline="true" :model="queryParams">
        <el-form-item prop="dictId">
          <el-select v-model="queryParams.dictId" placeholder="字典类型" size="small" style="width: 180px">
            <el-option v-for="(item,index) in dictList" :key="index" :label="item.dictName" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
          <el-button type="success" icon="el-icon-plus" size="small" @click="handleAdd">
            新增
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 表格信息 -->
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
    <!--      &lt;!&ndash; <el-table-column type="index" label="序号" width="50" align="center" fixed="left" /> &ndash;&gt;-->
    <!--      <el-table-column prop="itemText" label="字典项文本" align="center" show-overflow-tooltip />-->
    <!--      <el-table-column prop="itemValue" label="字典项值" align="center" show-overflow-tooltip />-->
    <!--      <el-table-column prop="sortOrder" label="字典排序" align="center" show-overflow-tooltip />-->
    <!--      <el-table-column prop="description" label="描述" align="center" show-overflow-tooltip />-->
    <!--      <el-table-column prop="createBy" label="新增人" align="center" show-overflow-tooltip />-->
    <!--      <el-table-column prop="createTime" label="新增时间" align="center" width="180" show-overflow-tooltip />-->
    <!--      <el-table-column label="操作" width="160" fixed="right" align="center" show-overflow-tooltip>-->
    <!--        <template slot-scope="scope">-->
    <!--          <el-button type="primary" size="mini" @click="handleEdit(scope.row)">编辑</el-button>-->
    <!--          <el-button type="danger" size="mini" @click="handleDelete(scope.row.id)">删除</el-button>-->
    <!--        </template>-->
    <!--      </el-table-column>-->
    <!--    </el-table>-->
    <!--新增/编辑字典-->
    <el-dialog v-dialogDrag :close-on-click-modal="false" :modal-append-to-body="false" :title="dialogType==='edit'?'编辑字典':'新增字典'" :visible.sync="dialogVisible" class="dialog" width="530px">
      <el-form ref="formData" :model="formData" :rules="addFormRules" label-width="100px" style="width: 400px; margin-left:40px;">
        <el-form-item label="字典项文本" prop="itemText">
          <el-input v-model="formData.itemText" clearable placeholder="请输入字典项文本" />
        </el-form-item>
        <el-form-item label="字典项值" prop="itemValue">
          <el-input v-model="formData.itemValue" clearable placeholder="请输入字典项值" />
        </el-form-item>
        <el-form-item label="排序码" prop="sortOrder">
          <el-input-number v-model="formData.sortOrder" :min="1" />
        </el-form-item>
        <el-form-item prop="description" label-width="0">
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
  getDictById,
  addDictItem, // 新增字典item值
  updateDictItem, // 修改字典item值
  delDictItem // 删除字典item值
} from '@/api/system/dict'
import { getDictItem } from '@/api/commens'
export default {
  data() {
    return {
      // 表格信息
      column: [
        { label: '字典项文本', prop: 'itemText' },
        { label: '字典项值', prop: 'itemValue' },
        { label: '字典排序', prop: 'sortOrder' },
        { label: '描述', prop: 'description' },
        { label: '新增人', prop: 'createBy' },
        { label: '新增时间', prop: 'createTime' },
        { label: '操作', render: (h, scope) => {
          return (
            <div id='btnWrap'>
              <el-button
                type='primary'
                size='mini'
                onClick={() => { this.handleEdit(scope.row) }}
              >编辑</el-button>
              <el-button
                type='danger'
                size='mini'
                onClick={() => { this.handleDelete(scope.row.id) }}
              >删除</el-button>
            </div>
          )
          // )
        }, width: 180 }
      ],
      // 遮罩层(加载)
      loading: false,
      total: 0,
      queryParams: {
        dictId: 0,
        field: undefined,
        type: undefined
      },
      formData: {},
      addFormRules: {
        itemText: [
          { required: true, message: '请输入字典项文本', trigger: 'change' }
        ],
        itemValue: [
          { required: true, message: '请输入字典项值', trigger: 'change' }
        ]
      },
      list: [], // 字典值列表
      dictList: [], // 字典列表
      defaultDictId: 1, // 默认字典id
      dialogType: 'new',
      dialogVisible: false, // 新增弹窗
      passVisible: false // 确认气泡框
    }
  },
  computed: {
  },
  mounted() {
    this.handleDict()
    this.queryParams.dictId = this.$route.params.dictId
    this.getList()
    this.getType()
  },
  // 解决表格错位问题
  activated() {
    this.$nextTick(() => {
      this.$refs.table.doLayout()
    })
  },
  methods: {
    // 排序
    sortChange(column) {
      this.$mySort(this.queryParams, column, this.getList)
    },
    // 获取字典值列表
    getList() {
      this.loading = true
      getDictItem(this.queryParams).then(res => {
        this.list = res.data
        this.total = res.count || 0
        this.loading = false
      })
    },
    // 获取字典数据列表
    handleDict() {
      getDict().then(res => {
        this.dictList = res.data
      })
    },
    // 查询字典类型
    getType() {
      getDictById(this.queryParams.dictId).then(response => {
        this.queryParams.dictId = response.data.id
        this.defaultDictId = response.data.id
      })
    },
    // 新增item字典
    handleAdd() {
      this.reset()
      this.dialogType = 'new'
      this.dialogVisible = true
      console.log('==', this.formData)
    },
    // 修改item字典
    handleEdit(row) {
      this.reset()
      this.formData = JSON.parse(JSON.stringify(row))
      this.dialogType = 'edit'
      this.dialogVisible = true
    },
    // 删除字典item
    handleDelete(id) {
      this.$confirm('是否确认删除该条字典数据?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delDictItem(id).then(res => {
          this.$message.success(res.msg)
          this.getList()
        })
      }).catch(() => {
      })
    },
    handleSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log('submit', this.formData)
          if (this.formData.id !== undefined) { // 编辑
            updateDictItem(this.formData).then(res => {
              this.$message.success(res.msg)
              this.dialogVisible = false
              this.passVisible = false
              this.getList()
            })
          } else { // 新增
            addDictItem(this.formData).then(res => {
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
    // 重置按钮操作
    resetQuery() {
      this.queryParams.dictId = this.defaultDictId
      this.getList()
    },
    // 表单重置
    reset() {
      this.formData = {
        id: undefined,
        description: undefined,
        dictId: this.queryParams.dictId,
        itemText: undefined,
        itemValue: undefined,
        sortOrder: 0
      }
      this.resetForm('formData')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
