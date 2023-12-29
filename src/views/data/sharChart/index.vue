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
        <el-form-item v-if="lineList !== undefined" prop="lineId">
          <el-select v-model="queryParams.lineId" value-key="lineName" size="small" placeholder="请选择产线" style="width: 100%;" @change="changeLine">
            <el-option v-for="(item,index) in lineList" :key="index" :label="item.lineName" :value="item.id" />
          </el-select>
        </el-form-item>
        <!--        <el-form-item v-if="equipmentList !== undefined" prop="equipmentIdList">-->
        <!--          <el-select v-model="queryParams.equipmentIdList" size="small" multiple collapse-tags placeholder="设备名称" style="width: 220px;">-->
        <!--            <el-option v-for="(item,index) in equipmentList" :key="index" :label="item.equipmentName" :value="item.id" />-->
        <!--          </el-select>-->
        <!--        </el-form-item>-->
        <el-form-item>
          <start-date v-model="queryParams.startTime" placeholder="日期" />
          <!--          <end-date v-model="queryParams.endTime" />-->
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <div style="width:100%;height: calc(100vh - 270px);">
      <chart-card shadow height="100%">
        <div v-if="JSON.stringify(lineChartData) === '{}' " class="l-flex l-col-center l-row-center" style="height: 100%;">
          <div class="l-flex l-flex-col l-col-center">
            <el-image
              :src="url"
              fit="cover"
            />
            <span style="margin-top: 30px;color: #666">数据为空</span>
          </div>

        </div>
        <shar-charts v-else :chart-data="lineChartData" />

        <!--        <line-chart v-else :chart-data="lineChartData" :title="'设备运行率分析'" />-->
      </chart-card>
    </div>

  </div>
</template>

<script>
import SharCharts from '../components/SharCharts'
import { getEquipmentByLineId } from '@/api/data/eqptProduction'
import { sharChart } from '@/api/data/machChart'
import { getLineByOrderId } from '@/api/commens'
import empty from '@/assets/images/empty.png'
import ChartCard from '@/components/ChartCard/ChartCard'
import { mapGetters } from 'vuex'

export default {
  name: 'SharChart',
  components: {
    ChartCard,
    SharCharts
  },
  data() {
    return {
      lineChartData: {},
      url: empty,
      // 分页搜索参数
      queryParams: {
        orderId: undefined,
        lineId: undefined,
        equipmentIdList: [],
        startTime: undefined,
        endTime: undefined
      },
      // 日期范围
      dateRange: [],
      // orderList: [], // 订单列表
      lineList: undefined, // 产线列表
      equipmentList: undefined // 设备名称列表
    }
  },
  computed: { ...mapGetters(['orderList']) },
  mounted() {
    // 是否有显示订单和站点的权限
    // this.handleOrder()
  },
  methods: {
    // 获取走势图数据
    getList() {
      sharChart(this.queryParams).then(
        response => {
          this.lineChartData = response.data
        }
      ).catch(() => {})
    },

    // 选择订单列表
    changeOrder(id) {
      // [this.queryParams.startTime, this.queryParams.endTime] = [undefined, undefined]
      this.queryParams.equipmentIdList = []
      this.queryParams.lineId = undefined
      this.handleLine(id)
    },
    // 根据订单id获取产线列表
    handleLine(id) {
      getLineByOrderId(id).then(res => {
        this.lineList = res.data
      })
    },
    async changeLine(id) {
      this.queryParams.equipmentIdList = []
      // this.dateRange = []
      // await this.handleEquipment(id)
      await this.defaultEquipmentList()
    },
    // 根据产线id查询设备列表
    handleEquipment(id) {
      return new Promise((resolve, reject) => {
        getEquipmentByLineId(id).then(response => {
          this.equipmentList = response.data.filter(item => {
            return item.equipmentType !== 1
          })
          resolve(this.equipmentList)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 选中产线之后默认选中所有设备
    defaultEquipmentList() {
      // this.equipmentList.filter(item => {
      //   this.queryParams.equipmentIdList.push(item.id)
      // })
      // this.queryParams.equipmentIdList.length === 0
      //   ? [this.queryParams.startTime, this.queryParams.endTime] = [undefined, undefined] : [this.queryParams.startTime, this.queryParams.endTime] = this.getMonthDays()
      [this.queryParams.startTime, this.queryParams.endTime] = this.getToday()
    },
    /** 搜索按钮操作 */
    handleQuery() {
      // this.lineChartData = {}
      // console.log('dateRange', this.addDateRange(this.queryParams, this.dateRange))
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.lineList = undefined
      this.equipmentList = undefined
      this.lineChartData = []
      this.resetForm('queryForm')
    }
  }
}
</script>

<style scoped>

</style>
