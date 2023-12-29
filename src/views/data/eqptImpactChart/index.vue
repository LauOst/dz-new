<template>
  <div class="app-container">
    <el-card shadow="never" class="card multiple">
      <el-form ref="queryForm" :model="queryParams" :inline="true">
        <el-form-item prop="orderId">
          <el-select v-model="queryParams.orderId" size="small" style="width: 180px;" placeholder="订单编号" @change="changeOrder">
            <el-option v-for="(item,index) in orderList" :key="index" :label="item.orderNo" :value="item.orderId">
              <span>{{ item.orderNo }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="lineList !== undefined" prop="lineList">
          <el-select v-model="queryParams.lineList" size="small" multiple collapse-tags placeholder="请选择产线" style="width: 200px;">
            <el-option v-for="(item,index) in lineList" :key="index" :label="item.lineName" :value="item.id" />
          </el-select>
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

    <div style="width:100%;height: calc(100vh - 270px);">
      <chart-card shadow height="100%">
        <div v-if="lineChartData.length <= 0" class="l-flex l-col-center l-row-center" style="height: 100%;">
          <div class="l-flex l-flex-col l-col-center">
            <el-image
              :src="url"
              fit="cover"
            />
            <span style="margin-top: 30px;color: #666">数据为空</span>
          </div>

        </div>
        <fn-chart v-else :chart-data="lineChartData" />
      </chart-card>
    </div>

  </div>
</template>

<script>
import FnChart from '../components/fnChart'
// import { getEquipmentByLineId } from '@/api/data/eqptProduction'
import { impactChart } from '@/api/data/impactChart'
import { getLineByOrderId } from '@/api/commens'
import empty from '@/assets/images/empty.png'
import ChartCard from '@/components/ChartCard/ChartCard'
import { mapGetters } from 'vuex'

export default {
  name: 'EqptImpactChart',
  components: {
    ChartCard,
    FnChart
  },
  data() {
    return {
      lineChartData: [],
      url: empty,
      // 分页搜索参数
      queryParams: {
        orderId: '',
        lineList: [],
        startTime: undefined,
        endTime: undefined
      },
      // 日期范围
      dateRange: [],
      lineList: undefined, // 产线列表
      equipmentList: undefined // 设备名称列表
    }
  },
  computed: { ...mapGetters(['orderList']) },
  mounted() {
  },
  methods: {
    // 获取走势图数据
    getList() {
      impactChart(this.queryParams).then(
        response => {
          this.lineChartData = response.data
        }
      ).catch(() => {})
    },
    // 选择订单列表
    async changeOrder(id) {
      this.queryParams.lineList = []
      await this.handleLine(id)
      await this.defaultLineList()
    },
    // 根据订单id获取产线列表
    handleLine(id) {
      return new Promise((resolve, reject) => {
        getLineByOrderId(id).then(response => {
          this.lineList = response.data
          resolve(this.lineList)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 选中产线之后默认选中所有产线
    defaultLineList() {
      this.lineList.filter(item => {
        this.queryParams.lineList.push(item.id)
      })
      this.queryParams.lineList.length === 0
        ? [this.queryParams.startTime, this.queryParams.endTime] = [undefined, undefined] : [this.queryParams.startTime, this.queryParams.endTime] = this.getMonthDays()
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.lineList = undefined
      this.lineChartData = []
      this.resetForm('queryForm')
    }
  }
}
</script>

<style scoped>

</style>
