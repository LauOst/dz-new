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
        <el-form-item v-if="equipmentList !== undefined" prop="equipmentIdList">
          <el-select v-model="queryParams.equipmentIdList" size="small" multiple collapse-tags placeholder="设备名称" style="width: 220px;" class="multiple">
            <el-option v-for="(item,index) in equipmentList" :key="index" :label="item.equipmentName" :value="item.id" />
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
        <line-chart v-else :chart-data="lineChartData" />
        <!--        <line-chart :chart-data="lineChartData" />-->
      </chart-card>
    </div>

  </div>
</template>

<script>
import LineChart from '../components/LineChart'
import { chartsEqptProduction, getEquipmentByLineId } from '@/api/data/eqptProduction'
import { getLineByOrderId } from '@/api/commens'
import empty from '@/assets/images/empty.png'
import ChartCard from '@/components/ChartCard/ChartCard'
import { mapGetters } from 'vuex'

export default {
  name: 'EqptProduction',
  components: {
    ChartCard,
    LineChart
  },
  data() {
    return {
      lineChartData: [],
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
      chartsEqptProduction(this.queryParams).then(
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
      await this.handleEquipment(id)
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
      this.equipmentList.filter(item => {
        this.queryParams.equipmentIdList.push(item.id)
      })
      this.queryParams.equipmentIdList.length === 0
        ? [this.queryParams.startTime, this.queryParams.endTime] = [undefined, undefined] : [this.queryParams.startTime, this.queryParams.endTime] = this.getMonthDays()
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = []
      this.lineList = undefined
      this.equipmentList = undefined
      this.lineChartData = []
      this.resetForm('queryForm')
    }
  }
}
</script>

<style lang="scss">

</style>
