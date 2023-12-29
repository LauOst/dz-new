<template>
  <div class="app-container">
    <!-- 头部筛选 -->
    <el-card shadow="never" class="card">
      <el-form ref="queryForm" :inline="true" :model="queryParams">
        <el-form-item prop="productCode">
          <el-input v-model="queryParams.productCode" clearable size="small" placeholder="产品型号" style="width: 180px;" />
        </el-form-item>
        <el-form-item>
          <start-date v-model="queryParams.startTime" />
          <end-date v-model="queryParams.endTime" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <CardChart height="700">
      <div slot="head"><h1>检测数据</h1></div>
      <div style="height: 100%">
        <LineChart :chart-data="CentralHoleOneData" />
      </div>
    </CardChart>
  </div>
</template>

<script>
import CardChart from '../commonents/CardChart'
import LineChart from '../commonents/LineChart'
import { centreHoleFive } from '@/api/centralHole/centralHoleOne'
export default {
  name: 'CentralHoleFive',
  components: { CardChart, LineChart },
  data() {
    return {
      queryParams: {
        endTime: undefined,
        productCode: undefined,
        startTime: undefined
      },
      CentralHoleOneData: {}
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      centreHoleFive(this.queryParams).then(r => {
        this.CentralHoleOneData = r.data
      })
    },
    handleQuery() {
      this.getList()
    },
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    }
  }
}
</script>

<style lang="scss">
</style>
