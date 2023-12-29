<!--
 * @Author: zhixinJ
 * @Date: 2023-03-31 15:31:34
 * @Desc: 总成追溯
-->
<template>
  <div class="app-container">
    <!-- 头部筛选 -->
    <el-card shadow="never" class="card">
      <el-form ref="queryForm" :inline="true" :model="queryParams">
        <el-form-item prop="componentQrCode">
          <el-input v-model="queryParams.componentQrCode" clearable size="small" placeholder="总成二维码" style="width: 180px;" />
        </el-form-item>
        <!-- <el-form-item prop="prod">
          <el-input v-model="queryParams.prod" clearable size="small" placeholder="产品型号" style="width: 180px;" />
        </el-form-item> -->
        <!-- <el-form-item>
          <start-date v-model="queryParams.startTime" />
          <end-date v-model="queryParams.endTime" />
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
          <el-button :loading="btnLoading" type="warning" icon="el-icon-download" size="small" @click="handleExport">导出</el-button>
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
    <!--详情-->
    <el-dialog v-dialogDrag :close-on-click-modal="false" :title="'详情'" :visible.sync="dialogVisible" class="dialog" width="1500px">
      <div class="l-m-b-20">
        <span class="text-title">总成二维码： <span class="text-info">{{ formData.assemblyQrCode||'--' }}</span></span>
        <span class="l-m-50 text-title">产品型号： <span class="text-info">{{ formData.productNo||'--' }}</span></span>
      </div>
      <el-row :gutter="20">
        <el-col :span="12">
          <span style="font-size: 16px;font-weight: bold;margin-bottom: 10px;display: inline-block">扫码追溯信息</span>
          <dz-table
            v-loading="loadingDetail"
            :column="columnDetail"
            :data="detailList"
            :total="DetailTotal"
            pagination
            :page.sync="queryParamsDetail.page"
            :limit.sync="queryParamsDetail.limit"
            height="400"
            @pagination="getDetailList"
          />
        </el-col>
        <el-col :span="12">
          <span style="font-size: 16px;font-weight: bold;margin-bottom: 10px;display: inline-block">批次追溯信息</span>
          <dz-table
            v-loading="loadingDetail"
            :column="columnBatch"
            :data="detailListBatch"
            :total="DetailTotalBatch"
            pagination
            :page.sync="queryParamsDetailBatch.page"
            :limit.sync="queryParamsDetailBatch.limit"
            height="400"
            @pagination="getDetailList"
          />
        </el-col>
      </el-row>

      <!-- 操作按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { listAssemblyTrace, DetailAssemblyTrace, DetailBatchListByOrCode } from '@/api/jingji/assemblyTrace'
import { listStationTrace } from '@/api/jingji/stationTrace'
import { downloadStationTrace } from '@/api/excel/excel'
export default {
  name: 'AssemblyTrace',
  data() {
    return {
      column: [
        { type: 'index', index: this.indexMethod },
        { label: '总成二维码', prop: 'assemblyQrCode', disableSort: true },
        // { label: '产品型号', prop: 'prod', disableSort: true },
        // { label: '产品型号', prop: 'personNo', disableSort: true },
        { label: '装配时间', prop: 'assembleTime', disableSort: true },
        // { label: '开工时间', prop: 'startTime', disableSort: true },
        { label: '工位', prop: 'stationNo', disableSort: true },
        { label: '负责人', prop: 'personName', disableSort: true },
        // { label: '完工时间', prop: 'completeTime', disableSort: true },
        { label: '操作', render: (h, scope) => {
          return (
            <div>
              <el-button
                v-hasPermi={['jingji:assemblyTrace:detail']}
                type='primary'
                size='mini'
                onClick={() => { this.handleDetail(scope) }}
              >详情</el-button>
            </div>
          )
        }, width: 140, fixed: 'right' }
      ],
      columnDetail: [
        { label: '组件二维码', prop: 'componentQrCode', disableSort: true },
        { label: '组件装配人', prop: 'personName', disableSort: true },
        { label: '装配时间', prop: 'assembleTime', disableSort: true }
      ],
      columnBatch: [
        { label: '组件名称', prop: 'componentName', disableSort: true },
        { label: '批次号', prop: 'batchNo', disableSort: true },
        { label: '创建时间', prop: 'createTime', disableSort: true }
      ],
      btnLoading: false,
      loading: false,
      loadingDetail: false,
      total: 0, // 列表总条数
      DetailTotal: 0, // 列表总条数
      DetailTotalBatch: 0, // 列表总条数
      // 查询信息
      queryParams: {
        page: 1,
        limit: 20,
        assemblyQrCode: undefined,
        prod: undefined,
        startTime: undefined,
        endTime: undefined
      },
      queryParamsDetail: {
        page: 1,
        limit: 20,
        assemblyQrCode: undefined
      },
      queryParamsDetailBatch: {
        page: 1,
        limit: 20,
        componentQrCode: undefined
      },
      list: [],
      formData: {},
      detailList: [],
      detailListBatch: [],
      dialogVisible: false // 新增编辑弹窗
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
      listStationTrace(this.queryParams).then(res => {
        this.list = res.data
        this.total = res.count || 0
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 详情
    handleDetail(scope) {
      this.formData = JSON.parse(JSON.stringify(scope.row))
      this.dialogVisible = true
      this.getDetailList()
      this.getDetaiBatchlList()
    },
    getDetailList() {
      this.loadingDetail = true
      this.queryParamsDetail.assemblyQrCode = this.formData.assemblyQrCode
      DetailAssemblyTrace(this.queryParamsDetail).then(res => {
        this.detailList = res.data
        this.DetailTotal = res.count || 0
        this.loadingDetail = false
      }).catch(() => {
        this.loadingDetail = false
      })
    },
    getDetaiBatchlList() {
      this.loadingDetail = true
      this.queryParamsDetailBatch.componentQrCode = this.formData.componentQrCode
      DetailBatchListByOrCode(this.queryParamsDetailBatch).then(res => {
        this.detailListBatch = res.data
        this.DetailTotalBatch = res.count || 0
        this.loadingDetail = false
      }).catch(() => {
        this.loadingDetail = false
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
      console.log('行不行啊这个导出!')
      this.btnLoading = true
      downloadStationTrace(this.queryParams).then((res) => {
        this.btnLoading = false
        if (!res.data) return
        this.$downloadFunc(res)
      }).catch((err) => {
        console.log('err', err)
        this.btnLoading = false
      })
    }
  }
}
</script>

<style scoped>
.text-title{
  color:#999;
}
.text-info{
  color: #000;
}
</style>
