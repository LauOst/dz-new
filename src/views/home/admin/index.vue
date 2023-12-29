<template>
  <div class="dashboard-editor-container l-flex l-flex-col">
    <el-card shadow="never" class="dashboard-card">
      <el-form ref="queryForm" :inline="true">
        <el-form-item>
          <el-select
            v-model="queryParams"
            value-key="id"
            size="small"
            placeholder="请选择产线"
            style="width: 100%;"
            @change="changeLine"
          >
            <el-option v-for="(item) in lineList" :key="item.id" :label="item.lineName" :value="item">
              <span>{{ item.lineName }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
    <div style="width:100%;flex: 1;" class=" l-flex l-flex-col l-row-between">
      <el-row :gutter="20" style="height: 43%;">
        <el-col :span="6" style="height: 100%;">
          <chart-card height="100%" style="position: relative">
            <!--            <div slot="head"><h1>{{ msgData.lineName || '&#45;&#45;' }}</h1></div>-->
            <div>
              <div class="li-box">
                <span>连接状态:</span>
                <span>{{ msgData.connectState || '--' }}</span>
              </div>
              <div class="li-box">
                <span>运行状态:</span>
                <span>{{ msgData.runStatus || '--' }}</span>
              </div>
              <div class="li-box">
                <span>停机次数:</span>
                <span>{{ typeof msgData.downNum ==='number' ? msgData.downNum : '--' }}</span>
              </div>
              <div class="li-box">
                <span style="color: #fff">停</span>
              </div>
            </div>
            <div>
              <!--              <img src="../../../assets/images/alerm-red.png" alt="" class="alert-img">-->
              <img
                v-if="msgData.alarmStatus === '报警'"
                src="../../../assets/images/alerm-red.png"
                alt=""
                class="alert-img"
              >
              <img
                v-if="msgData.alarmStatus === '其他'"
                src="../../../assets/images/alerm-green.png"
                alt=""
                class="alert-img"
              >
              <img v-else src="../../../assets/images/alerm-gray.png" alt="" class="alert-img">
            </div>
            <div class="tag-wrap">
              <div class="l-m-t-10" style="font-weight: bold;">{{ msgData.productName }}</div>
              <div style="font-weight: bold;">{{ msgData.productNo }}</div>
            </div>

          </chart-card>
        </el-col>
        <el-col :span="9" style="height: 100%;">
          <chart-card height="100%">
            <div slot="head"><h1>产出率</h1></div>
            <div style="display: flex;height: 100%">
              <div style="width: 25%;display: flex;align-items: center">
                <el-card class="box-card" style="width: 100%">
                  <div class="text item l-flex l-flex-col">
                    毛坯数量: {{ produce.roughNum }}
                  </div>
                  <div class="text item">
                    生产数量: {{ produce.nowNum }}
                  </div>
                  <div class="text item">
                    产出率: {{ produce.roughNum === 0 ? 0 : ((produce.nowNum / produce.roughNum) * 100).toFixed(2) + '%' }}
                  </div>
                </el-card>
              </div>
              <div style="width: 75%;">
                <pie-chart :chart-data="produce" />
              </div>
            </div>
          </chart-card>
        </el-col>
        <el-col :span="9" style="height: 100%;">
          <chart-card height="100%">
            <div slot="head"><h1>合格率</h1></div>
            <div style="display: flex;height: 100%">
              <div style="width: 25%;display: flex;align-items: center">
                <el-card class="box-card" style="width: 100%">
                  <div class="text item l-flex l-flex-col">
                    生产数量: {{ qualified.nowNum }}
                  </div>
                  <div class="text item">
                    合格数量: {{ qualified.qualifiedNum }}
                  </div>
                  <div class="text item">
                    合格率: {{
                      qualified.nowNum === 0 ? 0 : ((qualified.qualifiedNum / qualified.nowNum) * 100).toFixed(2) + '%'
                    }}
                  </div>
                </el-card>
              </div>
              <div style="width: 75%;">
                <!--                <pie-chart :chart-data="qualified" />-->
                <pie-chart-one :chart-data="qualified" />
              </div>
            </div>
          </chart-card>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="height: 55%;">
        <el-col :span="14" style="height: 100%;">
          <chart-card height="100%">
            <div slot="head">
              <div style="display: flex;justify-content: space-between;align-items: center;border-bottom: 1px solid #d8dbe0;padding-right: 20px">
                <h1 style="border-bottom: none">日生产数据({{ monthText }}月)</h1>
                <el-date-picker
                  v-model="value2"
                  type="month"
                  size="small"
                  value-format="yyyy-MM"
                  placeholder="选择月"
                  :picker-options="{disabledDate(time) {return time.getTime() > Date.now()}}"
                  @change="handleData"
                />
              </div>
            </div>
            <daily :chart-data="dayData" />
            <!--            <bar-chart :chart-data="dayData" />-->
            <!--            <line-chart :chart-data="lineChartData" :option="lineOption" />-->
            <!--          <line-chart :chart-data="lineChartData" />-->
          </chart-card>
        </el-col>
        <el-col :span="10" style="height: 100%;">
          <chart-card height="100%">
            <div slot="head"><h1>月生产数据</h1></div>
            <!-- <daily :chart-data="monthData" /> -->
            <bar-chart :sys-config="sysConfig" :chart-data="monthData" />
          </chart-card>
        </el-col>
      </el-row>
    </div>

  </div>
</template>

<script>
import ChartCard from '@/components/ChartCard/ChartCard'
import PieChart from './components/PieChart'
import PieChartOne from './components/PieChartOne'
import BarChart from './components/BarChart'
import Daily from './components/Daily'
import { getHomeLine, getOutputAndQualified, geDayAndMonthData, geEquipmentState } from '@/api/home/home'
import { mapGetters } from 'vuex'

export default {
  name: 'DashboardAdmin',
  components: { PieChart, ChartCard, PieChartOne, Daily, BarChart },
  data() {
    return {
      queryParams: {},
      lineList: undefined, // 产线列表
      produce: {}, // 产出率
      qualified: {}, // 合格率
      dayData: [], // 日
      monthData: {}, // 月
      monthText: '', // 月
      msgData: {}, // 月
      value2: '',
      lineChartData: {
        labels: ['Mon', 'Tue', 'four'],
        datasets: [
          {
            label: '1111',
            data: [100, 120, 30]
          },
          {
            label: '2222',
            data: [120, 82, 150]
          }
        ]
      },
      lineOption: {
        color: ['#3888fa', '#FF005A']
      },
      pieChartData: {
        labels: ['Mon', 'Tue', 'four'],
        datasets: [
          { value: 1048, name: '搜索引擎' },
          { value: 735, name: '直接访问' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'sysConfig'
    ])
  },
  created() {
  },
  async mounted() {
    await this.handleLine()
    await this.defaultLine()
  },
  destroyed() {
  },
  methods: {
    // 请求可切换产线
    handleLine() {
      return new Promise((resolve, reject) => {
        getHomeLine().then(response => {
          this.lineList = response.data
          resolve(this.lineList)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 进入页面默认选中最新添加产线
    defaultLine() {
      // 过滤未绑定设备的产线
      if (this.lineList && this.lineList.length > 0) {
        const defaultLine = this.lineList.find(item => item.equipmentCode !== null)

        this.queryParams = defaultLine
        this.value2 = this.getMonths()
        this.changeLine(this.queryParams)
      }
    },
    changeLine(e) {
      if (e !== undefined) {
        this.queryParams.id = e.id
        this.handleOutputAndQualified()
        this.handleAndMonthData()
        this.handleEquipmentState()
      }
    },
    handleData(e) {
      this.value2 = e
      this.handleAndMonthData()
    },
    // 产出率
    handleOutputAndQualified() {
      getOutputAndQualified(this.queryParams.id).then(res => {
        // console.log('res', res)
        // 产出率
        this.produce = {
          roughNum: res.data.roughNum,
          nowNum: res.data.nowNum,
          title: '产出率'
        }
        this.qualified = {
          nowNum: res.data.nowNum,
          qualifiedNum: res.data.qualifiedNum,
          title: '合格率'
        }
      })
    },
    // 日月生成数据
    handleAndMonthData() {
      geDayAndMonthData({ mouth: this.value2 }, this.queryParams.id).then(res => {
        if (this.sysConfig === 'true') {
          this.monthText = res.data.mouthValue
          this.dayData = res.data.dayWorkShiftSum
          this.monthData = res.data.mouthWorkShiftSum
        } else {
          this.monthText = res.data.mouthValue
          const dailyData = res.data.dayWorkShiftSum.filter(el => el.name.indexOf('OK') !== -1)
          dailyData.forEach(el => { el.name = el.name.split('OK')[0] })
          this.dayData = dailyData
          this.monthData = { qualifiedNum: res.data.mouthWorkShiftSum.qualifiedNum }
        }
      })
    },
    handleEquipmentState() {
      geEquipmentState(this.queryParams.id).then(res => {
        if (res.data && res.code === 0) {
          this.msgData = res.data
        }
      })
    }
  }

}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 20px;
  height: calc(100vh - 102px);
  background-color: rgb(240, 242, 245);
}

.box-card {
  padding: 10px;

  .item {
    padding: 5px 0;
  }

  .text {
    font-size: 14px;
  }
}

.li-box {
  padding: 15px;
  border-bottom: 1px solid #ededed;
  font-size: 14px;
}

.tag-wrap {
  position: absolute;
  right: 15px;
  bottom: 40px;
  width: 126px;
  height: 60px;
  background: url('../../../assets/images/tag.png') no-repeat;
  background-size: 100% 100%;
  text-align: center;
  line-height: 1.5;
  font-size: 12px;
  font-weight: bolder;
}

.alert-img {
  width: 28px;
  position: absolute;
  top: 70px;
  right: 18px;
}
</style>
<style lang="scss">
//.dashboard-card{
//  margin-bottom: 16px;
//  background: #fff!important;
//  border-left: 5px solid #009688 !important;
//  .el-form-item {
//    margin-bottom: 0 !important;
//  }
//}
</style>
