<template>
  <div class="app-container">
    <el-card shadow="never" class="card">
      <el-form v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true">
        <el-form-item prop="mesOrderNo">
          <el-input v-model="queryParams.mesOrderNo" clearable size="small" placeholder="订单号" style="width: 180px;" />
        </el-form-item>
        <el-form-item prop="markingPrefix">
          <el-input v-model="queryParams.markingPrefix" clearable size="small" placeholder="打标前缀" style="width: 180px;" />
        </el-form-item>
        <el-form-item>
          <start-date v-model="queryParams.startTime" :type="'datetime'" placeholder="开始时间" :value-format="'yyyy-MM-dd HH:mm:ss'" width="200px" />
          <end-date v-model="queryParams.endTime" :type="'datetime'" placeholder="结束时间" :value-format="'yyyy-MM-dd HH:mm:ss'" width="200px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
          <el-button
            v-hasPermi="['productModule:markManage:add']"
            type="success"
            icon="el-icon-plus"
            size="small"
            @click="handleAdd"
          >新增
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
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
    <!-- 弹出层(添加/编辑刀具组) -->
    <el-dialog
      v-dialogDrag
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      :visible.sync="dialogVisible"
      :title="dialogType==='edit'?'编辑':'新增'"
      class="dialog"
      width="580px"
    >
      <el-form
        ref="formData"
        :model="formData"
        :rules="rules"
        label-width="110px"
        style="width: 580px; margin-left:40px;"
      >
        <el-form-item label="订单号" prop="mesOrderNo">
          <el-input v-model="formData.mesOrderNo" placeholder="请输入订单号" style="width: 300px;" />
          <el-button type="text" size="mini" style="margin-left: 10px" @click="handleQueryMes"> 查询 </el-button>
        </el-form-item>
        <el-form-item label="打标前缀" prop="markingPrefix">
          <el-input v-model="formData.markingPrefix" placeholder="请输入打标前缀" style="width: 300px;" />
        </el-form-item>
        <el-form-item label="打标后缀" prop="markingEnd">
          <el-input v-model="formData.markingEnd" placeholder="请输入打标后缀" style="width: 300px;" />
        </el-form-item>

      </el-form>
      <div style="text-align:right;">
        <el-button @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { addMarkManage, getMarkManagelList, getMarkManageMes, sendMarkManage } from '@/api/productModule/markManage'
/*
  queryParams:刀具管理列表请求参数
  total:列表总条数
  dialogVisible:是否显示 Dialog
  dialogType:控制表头显示内容
* */

export default {
  name: 'MarkManage',
  data() {
    return {
      // 表格信息
      column: [
        { type: 'index', index: this.indexMethod },
        { label: '订单号', prop: 'mesOrderNo' },
        { label: '打标前缀', prop: 'markingPrefix' },
        { label: '打标后缀', prop: 'markingEnd' },
        { label: '操作', render: (h, scope) => {
          return (
            <div id='btnWrap'>
              <el-button
                v-hasPermi={['productModule:markManage:send']}
                type='primary'
                size='mini'
                onClick={() => { this.handleSend(scope) }}
              >发送</el-button>
            </div>
          )
          // )
        }, width: 240 }
      ],
      loading: false,
      btnLoading: false,
      // 显示搜索条件
      showSearch: true,
      productShow: false,
      itemShow: false,
      // 分页搜索参数
      queryParams: {
        page: 1,
        limit: 20,
        mesOrderNo: undefined,
        markingPrefix: undefined,
        startTime: undefined,
        endTime: undefined,
        field: undefined,
        type: undefined
      },
      // 列表
      list: [],
      // 分页数据
      total: 0,
      dialogVisible: false,
      // dialogVisibleTools: false,
      dialogType: 'new',
      // 表单信息
      formData: {},
      // formDataTools: {},
      productList: [],
      // 表单校验
      rules: {}
    }
  },
  computed: {},
  async mounted() {
    [this.queryParams.startTime, this.queryParams.endTime] = this.getTodayTimeEnd()
    await this.getList()
    // this.getDepartList()
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
    /** 查询列表 */
    getList() {
      this.loading = true
      getMarkManagelList(this.queryParams).then(res => {
        this.list = res.data
        this.total = res.count || 0
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 获取站点列表
    // getDepartList() {
    //   switchSite().then(res => {
    //     this.departList = res.data
    //   })
    // },
    // 新增按钮
    handleAdd() {
      this.reset()
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleSend(scope) {
      sendMarkManage(scope.row).then(res => {
        console.log('res', res)
        this.msgSuccess(res.msg)
        this.getList()
      })
    },

    /** 提交按钮 */
    submitForm() {
      this.$refs['formData'].validate(valid => {
        if (valid) {
          addMarkManage(this.formData).then(res => {
            this.msgSuccess(res.msg)
            this.dialogVisible = false
            this.getList()
          })
        }
      })
    },
    // 添加刀具
    handleQueryMes() {
      getMarkManageMes(this.formData.mesOrderNo).then(res => {
        this.markingPrefix = res.data
      })
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1
      this.getList()
    },
    /** 重置按钮操作 */
    async resetQuery() {
      await this.resetForm('queryForm');
      [this.queryParams.startTime, this.queryParams.endTime] = this.getTodayTimeEnd()
      await this.handleQuery()
    },
    // 表单重置
    reset() {
      this.formData = {
        mesOrderNo: undefined,
        markingPrefix: undefined,
        markingEnd: undefined
      }
      this.resetForm('formData')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

