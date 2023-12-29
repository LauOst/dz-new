<!--
 * @Author: zhixinJ
 * @Date: 2023-03-31 15:31:34
 * @Desc: 工位追溯
-->
<template>
  <div class="app-container">
    <!-- 头部筛选 -->
    <el-card shadow="never" class="card">
      <el-form ref="queryForm" :inline="true" :model="queryParams">
        <el-form-item prop="componentQrCode">
          <el-input v-model="queryParams.componentQrCode" clearable size="small" placeholder="组件二维码" style="width: 180px;" />
        </el-form-item>
        <!--
        <el-form-item prop="assemblyQrCode">
          <el-input v-model="queryParams.assemblyQrCode" clearable size="small" placeholder="总成二维码" style="width: 180px;" />
        </el-form-item> -->
        <!-- <el-form-item prop="prodNo">
          <el-input v-model="queryParams.prodNo" clearable size="small" placeholder="产品型号" style="width: 140px;" />
        </el-form-item> -->
        <!-- <el-form-item prop="stationNo">
          <el-input v-model="queryParams.stationNo" clearable size="small" placeholder="工位" style="width: 140px;" />
        </el-form-item>
        <el-form-item prop="personName">
          <el-input v-model="queryParams.personName" clearable size="small" placeholder="负责人" style="width: 140px;" />
        </el-form-item> -->
        <!-- <el-form-item>
          <start-date v-model="queryParams.startTime" />
          <end-date v-model="queryParams.endTime" />
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
          <!-- <el-button v-hasPermi="['jingji:stationTrace:excel']" :loading="btnLoading" type="warning" icon="el-icon-download" size="small" @click="handleExport">导出</el-button> -->
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

    <el-dialog v-dialogDrag :close-on-click-modal="false" :title="'详情'" :visible.sync="dialogVisible" class="dialog" width="830px" top="8vh">
      <dz-table
        v-loading="loadingDetail"
        :column="columnDetail"
        :data="detailList"
        :page.sync="queryParams.page"
        :limit.sync="queryParams.limit"
        @pagination="getList"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { listStationTrace, delCode } from '@/api/jingji/stationTrace'
import { downloadStationTraceability } from '@/api/excel/excel'

export default {
  name: 'StationTrace',
  data() {
    return {
      column: [
        { type: 'index', index: this.indexMethod },
        { label: '总成二维码', prop: 'componentQrCode', disableSort: true },
        // { label: '总成二维码', prop: 'assemblyQrCode', disableSort: true },
        // { label: '产品型号', prop: 'prodNo', disableSort: true },
        { label: '工位', prop: 'stationNo', disableSort: true },
        { label: '负责人', prop: 'personName', disableSort: true },
        // { label: '开工时间', prop: 'startTime', disableSort: true },assembleTime
        { label: '扫码时间', prop: 'assembleTime', disableSort: true },
        { label: '操作', render: (h, scope) => {
          return (
            <div>
              {/* <el-button
                type='primary'
                size='mini'
                onClick={() => { this.handleDetile(scope) }}
              >详情</el-button> */}
              <el-button
                type='danger'
                size='mini'
                onClick={() => { this.handleDelete(scope) }}
              >删除</el-button>
            </div>
          )
        }, width: 300, fixed: 'right' }
        // { label: '完工时间', prop: 'completeTime', disableSort: true }
      ],
      columnDetail: [
        { type: 'index', index: this.indexMethod },
        { label: '组件二维码', prop: 'componentQrCode', disableSort: true },
        // { label: '总成二维码', prop: 'assemblyQrCode', disableSort: true },
        // { label: '产品型号', prop: 'prodNo', disableSort: true },
        { label: '工位', prop: 'stationNo', disableSort: true },
        { label: '负责人', prop: 'personName', disableSort: true },
        // { label: '开工时间', prop: 'startTime', disableSort: true },assembleTime
        { label: '扫码时间', prop: 'assembleTime', disableSort: true }
      ],
      loading: false,
      loadingDetail: false,
      btnLoading: false,
      total: 0, // 列表总条数
      // 查询信息
      queryParams: {
        page: 1,
        limit: 20,
        componentQrCode: undefined,
        assemblyQrCode: undefined,
        prodNo: undefined,
        stationNo: undefined,
        personName: undefined,
        startTime: undefined,
        endTime: undefined
      },
      list: [],
      detailList: [],
      dialogVisible: false
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
    handleDetile(scope) {
      this.loadingDetail = true
      this.dialogVisible = true
      const obj = {
        componentQrCode: scope.row.componentQrCode,
        codeType: 2
      }
      listStationTrace(obj).then(res => {
        if (res.code === 0) {
          this.detailList = res.data
          this.loadingDetail = false
        }
      }).catch(() => {
        this.loadingDetail = false
      })
    },
    // 删除二维码
    handleDelete(scope) {
      const id = scope.row.id
      this.$confirm('是否确认删除该数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return delCode(id)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(() => {})
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
    // 导出按钮
    handleExport() {
      this.btnLoading = true
      downloadStationTraceability(this.queryParams).then((res) => {
        this.btnLoading = false
        if (!res.data) return
        this.$downloadFunc(res)
      }).catch((err) => {
        console.log('err', err)
        this.btnLoading = false
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
    }
  }
}
</script>

<style scoped>

</style>
