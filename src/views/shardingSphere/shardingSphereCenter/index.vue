<template>
  <div class="app-container">
    <!-- 头部筛选 -->
    <el-card shadow="never" class="card">
      <el-button type="primary" icon="el-icon-plus" size="small" @click="handleAdd">
        新增
      </el-button>
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
    <el-dialog v-dialogDrag :close-on-click-modal="false" :modal-append-to-body="false" title="参数配置" :visible.sync="dialogVisible" class="dialog" width="530px">
      <el-form ref="formData" :model="formData" :rules="addFormRules" label-width="120px" style="width: 400px; margin-left:40px;">
        <el-form-item label="注册中心名称" prop="name">
          <el-input v-model="formData.name" clearable placeholder="请输入注册中心名称" />
        </el-form-item>
        <el-form-item label="注册中心地址" prop="zkAddressList">
          <el-input v-model="formData.zkAddressList" clearable placeholder="请输入注册中心地址" />
        </el-form-item>
        <el-form-item label="命名空间" prop="namespace">
          <el-input v-model="formData.namespace" clearable placeholder="请输入命名空间" />
        </el-form-item>
        <el-form-item label="登录凭证" prop="digest">
          <el-input v-model="formData.digest" clearable placeholder="请输入登录凭证" />
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

  </div>
</template>

<script>
import { addCenter, connectCenter, getCenter, removeCenter } from '@/api/shardingSphere/shardingSphereCenter'

export default {
  name: 'ShardingSphereCenter',
  data() {
    return {
      column: [
        { type: 'index', index: this.indexMethod, fixed: true },
        { label: '注册中心名称', prop: 'name' },
        { label: '注册中心地址', prop: 'zkAddressList' },
        { label: '命名空间', prop: 'namespace' },
        { label: '操作', render: (h, scope) => {
          return (
            <div>
              <el-tooltip
                content={!scope.row.activated ? '连接' : '已连接'}
                className='item'
                effect='dark'
                placement='top'
              >
                <el-button type={scope.row.activated ? 'success' : 'warning'} size='mini' icon='el-icon-link' onClick={() => { this.handleConnect(scope.row) }}/>
              </el-tooltip>
              <el-tooltip
                content='删除'
                className='item'
                effect='dark'
                placement='top'
              >
                <el-button type='danger' size='mini' icon='el-icon-delete' onClick={() => { this.handlerDel(scope.row) }}/>
              </el-tooltip>
            </div>
          )
        }, width: 140, fixed: 'right' }
      ],
      // 遮罩层(加载)
      loading: false,
      total: 0, // 列表总条数
      queryParams: { // 查询信息
        page: 1,
        limit: 20,
        jobName: undefined, // 产线id
        ip: undefined, // 产线id
        isSuccess: undefined // 订单编号
      },
      formData: {},
      addFormRules: { // 表单验证
        name: [
          { required: true, message: '请输入注册中心名称', trigger: 'blur' }
        ],
        zkAddressList: [
          { required: true, message: '请输入注册中心地址', trigger: 'blur' }
        ],
        namespace: [
          { required: true, message: '请输入命名空间', trigger: 'blur' }
        ]
      },
      dialogVisible: false, // 新增弹窗
      passVisible: false, // 确认气泡框
      list: [], // 表格数据
      resultList: [{ name: '失败', id: 0 }, { name: '成功', id: 1 }]
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    // 排序
    sortChange(column) {
      this.$mySort(this.queryParams, column, this.getList)
    },
    // 格式化序号
    indexMethod(index) {
      return (this.queryParams.page - 1) * this.queryParams.limit + index + 1
    },
    // 获取机器人列表
    getList() {
      this.loading = true
      getCenter().then(res => {
        this.list = res.data
        this.total = res.count || 0
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 连接
    handleAdd() {
      this.reset()
      this.dialogVisible = true
    },
    // 确认
    handleSubmit() {
      this.$refs['formData'].validate((valid) => {
        if (valid) {
          addCenter(this.formData).then(res => {
            this.dialogVisible = false
            this.passVisible = false
            this.$notify({
              title: '提示',
              message: '操作成功',
              type: 'success'
            })
            this.getList()
          })
        }
      })
    },
    // 连接
    handleConnect(row) {
      if (row.activated) {
        this.$notify({
          title: '提示',
          message: '操作成功',
          type: 'success'
        })
      } else {
        const params = {
          name: row.name
        }
        connectCenter(params).then(res => {
          this.$notify({
            title: '提示',
            message: '操作成功',
            type: 'success'
          })
          this.getList()
        })
      }
    },
    // 删除
    handlerDel(row) {
      const params = {
        name: row.name
      }
      removeCenter(params).then(res => {
        this.$notify({
          title: '提示',
          message: '操作成功',
          type: 'success'
        })
        this.getList()
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
        digest: undefined,
        name: undefined,
        namespace: undefined,
        zkAddressList: undefined
      }
      this.resetForm('formData')
    }
  }
}
</script>

<style>

</style>
