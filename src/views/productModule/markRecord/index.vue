<template>
  <div class="app-container">
    <el-card shadow="never" class="card">
      <el-form v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true">
        <el-form-item prop="mesOrderNo">
          <el-input v-model="queryParams.mesOrderNo" clearable size="small" placeholder="订单号" style="width: 180px;" />
        </el-form-item>
        <el-form-item prop="markingBody">
          <el-input v-model="queryParams.markingBody" clearable size="small" placeholder="打标内容" style="width: 180px;" />
        </el-form-item>
        <el-form-item>
          <start-date v-model="queryParams.startTime" :type="'datetime'" placeholder="开始时间" :value-format="'yyyy-MM-dd HH:mm:ss'" width="200px" />
          <end-date v-model="queryParams.endTime" :type="'datetime'" placeholder="结束时间" :value-format="'yyyy-MM-dd HH:mm:ss'" width="200px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
          <el-button :loading="btnLoading" type="warning" icon="el-icon-download" size="small" @click="handleExport">导出</el-button>
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
  </div>
</template>

<script>
import {
  getMarkRecordList
} from '@/api/productModule/markManage'
import { downloadMarkRecord } from '@/api/excel/excel'
/*
  queryParams:刀具管理列表请求参数
  total:列表总条数
  dialogVisible:是否显示 Dialog
  dialogType:控制表头显示内容
* */

export default {
  name: 'MarkRecord',
  data() {
    return {
      // 表格信息
      column: [
        { type: 'index', index: this.indexMethod },
        { label: '订单号', prop: 'mesOrderNo' },
        { label: '打标内容', prop: 'markingBody' },
        { label: '打标时间', prop: 'createTime' }
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
        markingBody: undefined,
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
      getMarkRecordList(this.queryParams).then(res => {
        this.list = res.data
        this.total = res.count || 0
        this.loading = false
      }).catch(() => {
        this.loading = false
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
    // 导出按钮
    handleExport() {
      this.btnLoading = true
      downloadMarkRecord(this.queryParams).then((res) => {
        this.btnLoading = false
        if (!res.data) return
        this.$downloadFunc(res, '打标记录')
      }).catch((err) => {
        console.log('err', err)
        this.btnLoading = false
      })
    },
    // 表单重置
    reset() {
      this.formData = {
        mesOrderNo: undefined,
        markingPrefix: undefined
      }
      this.resetForm('formData')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

