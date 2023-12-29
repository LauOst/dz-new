<!--
 * @Author: zhixinJ
 * @Date: 2023-05-24 10:13:01
 * @Desc: 不合格品分布
-->
<template>
  <div class="app-container">
    <!-- 头部筛选 -->
    <el-card shadow="never" class="card">
      <el-form ref="queryForm" :inline="true" :model="queryParams" :rules="searchRules">
        <el-form-item prop="productNo">
          <el-input v-model="queryParams.productNo" clearable size="small" placeholder="产品型号" style="width: 180px;" />
        </el-form-item>
        <el-form-item prop="startTime">
          <start-date v-model="queryParams.startTime" />
        </el-form-item>
        <el-form-item prop="endTime">
          <end-date v-model="queryParams.endTime" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 图表信息 -->
    <div style="width:100%;height: calc(100vh - 243px);">
      <chart-card shadow height="100%">
        <div v-if="chartData.data.length <= 0" class="l-flex l-col-center l-row-center" style="height: 100%;">
          <div class="l-flex l-flex-col l-col-center">
            <el-image :src="url" fit="cover" />
            <span style="margin-top: 30px;color: #666">数据为空</span>
          </div>
        </div>
        <bar-chart v-else :chart-data="chartData" title="不合格品分布" x-name="" />
      </chart-card>
    </div>
  </div>
</template>

<script>
import { getNgProduce } from '@/api/productModule/nonconformingProduct'
import empty from '@/assets/images/empty.png'
import ChartCard from '@/components/ChartCard/ChartCard'
import BarChart from '../components/barChart.vue'
// nonconformingProduct
export default {
  name: 'NonconformingProduct',
  components: { ChartCard, BarChart },
  data() {
    return {
      // 查询信息
      queryParams: {
        productNo: undefined,
        startTime: undefined,
        endTime: undefined
      },
      chartData: {
        xaxis: [],
        data: []
      },
      url: empty,
      searchRules: {
        productNo: [
          { required: true, message: '请输入产品型号', trigger: 'blur' }
        ],
        startTime: [
          { required: true, message: '请选择时间', trigger: 'change' }
        ],
        endTime: [
          { required: true, message: '请选择时间', trigger: 'change' }
        ]
      }
    }
  },
  mounted() {
    // this.getList()
  },
  methods: {
    getList() {
      this.$refs['queryForm'].validate((valid) => {
        if (valid) {
          getNgProduce(this.queryParams).then(res => {
            this.chartData.xaxis = res.data.tableColumn
            this.chartData.data = res.data.tableData
          }).catch(() => {
          })
        }
      })
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.chartData.xaxis = []
      this.chartData.data = []
      this.handleQuery()
    }
  }
}
</script>

<style scoped>

</style>
