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
        <el-form-item prop="zxQrCode">
          <el-input v-model="queryParams.zxQrCode" clearable size="small" placeholder="箱二维码" style="width: 180px;" />
        </el-form-item>
        <el-form-item prop="pmbQrCode">
          <el-input v-model="queryParams.pmbQrCode" clearable size="small" placeholder="泡沫板二维码" style="width: 180px;" />
        </el-form-item>
        <el-form-item prop="productNo">
          <el-input v-model="queryParams.productNo" clearable size="small" placeholder="工件型号" style="width: 180px;" />
        </el-form-item>
        <el-form-item prop="grade">
          <el-input v-model="queryParams.grade" clearable size="small" placeholder="等级" style="width: 180px;" />
        </el-form-item>
        <el-form-item>
          <start-date v-model="queryParams.startTime" />
          <end-date v-model="queryParams.endTime" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
          <el-button v-hasPermi="['productModule:packingRecord:excel']" :loading="btnLoading" type="warning" icon="el-icon-download" size="small" @click="handleExport">导出</el-button>
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
  </div>
</template>

<script>
import { listPackingRecord } from '@/api/productModule/packingRecord'
import { downloadPackingRecord } from '@/api/excel/excel'

export default {
  name: 'PackingRecord',
  data() {
    return {
      column: [
        { type: 'index', index: this.indexMethod },
        { label: '装箱工位', prop: 'packNo', disableSort: true },
        { label: '箱二维码', prop: 'zxQrCode', disableSort: true },
        { label: '泡沫板二维码', prop: 'pmbQrCode', disableSort: true },
        { label: '工件二维码', prop: 'gjQrCode', disableSort: true },
        { label: '工件型号', prop: 'productNo', disableSort: true },
        { label: '等级', prop: 'grade', disableSort: true },
        { label: '装箱时间', prop: 'createTime', disableSort: true }
      ],
      loading: false,
      btnLoading: false,
      total: 0, // 列表总条数
      // 查询信息
      queryParams: {
        page: 1,
        limit: 20,
        zxQrCode: undefined,
        pmbQrCode: undefined,
        productNo: undefined,
        grade: undefined,
        startTime: undefined,
        endTime: undefined
      },
      list: []
    }
  },
  mounted() {
    [this.queryParams.startTime, this.queryParams.endTime] = this.getToday()
    this.getList()
  },
  methods: {
    // 格式化序号
    indexMethod(index) {
      return (this.queryParams.page - 1) * this.queryParams.limit + index + 1
    },
    getList() {
      this.loading = true
      listPackingRecord(this.queryParams).then(res => {
        this.list = res.data
        this.total = res.count || 0
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 导出按钮
    handleExport() {
      const newData = JSON.parse(JSON.stringify(this.queryParams))
      newData.page = 1
      newData.limit = -1
      this.btnLoading = true
      downloadPackingRecord(newData).then((res) => {
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
      this.resetForm('queryForm');
      [this.queryParams.startTime, this.queryParams.endTime] = this.getToday()
      this.handleQuery()
    }
  }
}
</script>

<style scoped>

</style>
