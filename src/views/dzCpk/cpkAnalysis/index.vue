<template>
  <div class="app-container">
    <el-card shadow="never" class="card">
      <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
        <el-form-item prop="lineId">
          <el-select v-model="queryParams.lineId" filterable size="small" style="width: 180px;" placeholder="产线名称" @change="changeLine">
            <el-option v-for="(item,index) in lineLists" :key="index" :label="item.lineName" :value="item.lineId" />
          </el-select>
        </el-form-item>

        <el-form-item v-if="workpieceLists" prop="productNo">
          <el-select v-model="queryParams.productNo" filterable size="small" placeholder="产品名称" @change="handleProduct">
            <el-option
              v-for="(item,index) in workpieceLists"
              :key="index"
              :label="item.productName"
              :value="item.productNo"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="detectionList" prop="detectionItem">
          <el-select v-model="queryParams.tableColval" size="small" placeholder="检测项">
            <el-option v-for="(item,index) in detectionList" :key="index" :label="item.colName" :value="item.colValue" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <div class="chart-container">
      <div class="top">
        <div class="top-left">
          <div class="l-card">
            <div id="myChart2" style="width: 100%;height: 100%;" />
          </div>
        </div>
        <div class="top-right l-card">
          <div v-if="detectionrecordList.analysisData && detectionrecordList.analysisData.length > 0" class="right-wrapper">
            <el-descriptions :column="2" border :label-style="labelStyle">
              <el-descriptions-item label="总样本数">{{ detectionrecordList.analysisData.length || '&#45;&#45;' }}</el-descriptions-item>
              <el-descriptions-item label="上限值">{{ detectionrecordList.upperLimitValue || '&#45;&#45;' }}</el-descriptions-item>
              <el-descriptions-item label="下限值">{{ detectionrecordList.upperLimitValue || '&#45;&#45;' }}</el-descriptions-item>
              <el-descriptions-item label="标准值">{{ detectionrecordList.upperLimitValue || '&#45;&#45;' }}</el-descriptions-item>
              <el-descriptions-item label="平均值">{{ detectionrecordList.upperLimitValue || '&#45;&#45;' }}</el-descriptions-item>
              <el-descriptions-item label="最大值">{{ detectionrecordList.upperLimitValue || '&#45;&#45;' }}</el-descriptions-item>
              <el-descriptions-item label="最小值">{{ detectionrecordList.upperLimitValue || '&#45;&#45;' }}</el-descriptions-item>
              <el-descriptions-item label="+3sigma">{{ detectionrecordList.upperLimitValue || '&#45;&#45;' }}</el-descriptions-item>
              <el-descriptions-item label="-3sigma">{{ detectionrecordList.upperLimitValue || '&#45;&#45;' }}</el-descriptions-item>
              <el-descriptions-item label="STDEV">{{ detectionrecordList.upperLimitValue || '&#45;&#45;' }}</el-descriptions-item>
              <el-descriptions-item label="CPK">{{ detectionrecordList.upperLimitValue || '&#45;&#45;' }}</el-descriptions-item>
              <el-descriptions-item label="CP">{{ detectionrecordList.upperLimitValue || '&#45;&#45;' }}</el-descriptions-item>
              <el-descriptions-item label="CPL">{{ detectionrecordList.upperLimitValue || '&#45;&#45;' }}</el-descriptions-item>
              <el-descriptions-item label="CPU">{{ detectionrecordList.upperLimitValue || '&#45;&#45;' }}</el-descriptions-item>
              <el-descriptions-item label="PPM > US">{{ detectionrecordList.upperLimitValue || '&#45;&#45;' }}</el-descriptions-item>
              <el-descriptions-item label="PPM Total">{{ detectionrecordList.upperLimitValue || '&#45;&#45;' }}</el-descriptions-item>
              <el-descriptions-item label="CA">{{ detectionrecordList.upperLimitValue || '&#45;&#45;' }}</el-descriptions-item>
            </el-descriptions>
          </div>
          <!--        <img src="../../../assets/images/null.png" alt="" style="margin-top: 150px;">-->
          <div v-else class="empty">还没有任何信息</div>
        </div>
      </div>
      <div class="bottom">
        <div class="l-card">
          <div id="myChart1" style="width: 100%;height: 100%;" />
        </div>
      </div>
    </div>

  </div>
</template>
<script>
import * as echarts from 'echarts/lib/echarts'
import { listGaussian, listGaussianDetection } from '@/api/dzCpk/gaussian'
import { getlineSelect, getOrderWorkpiece } from '@/api/commens'
// import CharsLine from '../components/charsLine.vue'

export default {
  name: 'Gaussian',
  data() {
    return {
      // 遮罩层
      loading: true,
      queryParams: {
        lineId: undefined,
        productNo: undefined,
        tableColval: undefined,
        startTime: null,
        endTime: null
      },
      option1: Object,
      option2: Object,
      myChart1: Object,
      myChart2: Object,
      lineLists: undefined, // 产线列表
      workpieceLists: undefined, // 产品列表
      detectionList: undefined, // 产品列表
      detectionrecordList: {},
      labelStyle: {
        color: '#333',
        width: '120px',
        fontSize: '14px',
        fontWeight: '700'
      },
      data: null
    }
  },
  computed: {
    /**
     * @Description： 有序数据源（方便操作）
     * */
    dataOrderBy() {
      const data = this.data.concat([]) // 为防止 sort 方法修改原数组，对原数组进行拷贝，操作副本。
      return data.sort((a, b) => a - b)
    },
    /**
     * @Description： 数据整理。原数据整理为：{数据值 : 数据频率}
     * */
    dataAfterClean() {
      const res = {}
      // const data = this.dataOrderBy
      for (let i = 0; i < this.data.length; i++) {
        let key = parseFloat(this.data[i]).toFixed(1) // 这里保留 1 位小数
        if (key !== 'NaN' && parseFloat(key) === 0) key = '0.0' // 这个判断用来处理保留小数位后 -0.0 和 0.0 判定为不同 key 的 bug
        if (res[key]) res[key] += 1
        else res[key] = 1
      }
      return res
    },
    /**
     * @Description： 数据整理。返回源数据所有值（排序后）
     * */
    dataAfterCleanX() {
      return Object.keys(this.dataAfterClean)
        .sort((a, b) => a - b)
        .map(t => parseFloat(t).toFixed(1)) // 保留 1 位小数
    },
    /**
     * @Description： 数据整理。返回源数据所有值对应的频率（排序后） -- 与 dataAfterCleanX 顺序一致
     * */
    dataAfterCleanY() {
      const r = []
      for (let i = 0; i < this.dataAfterCleanX.length; i++) {
        r.push(this.dataAfterClean[this.dataAfterCleanX[i]])
      }
      // console.log("y轴数据", r);
      return r
    },
    /**
     * @Description： 计算平均数。这里的平均数指的是数学期望、算术平均数
     * */
    sum() {
      if (this.data.length === 0) return 0
      return this.data.reduce((prev, curr) => prev + curr)
    },
    /**
     * @Description： 计算平均数。这里的平均数指的是数学期望、算术平均数
     * */
    average() {
      return this.sum / this.data.length
    },
    /**
     * @Description： 计算偏差
     * */
    deviation() {
      // 1、求平均数
      const avg = this.average
      // 2、返回偏差。 f(x) = x - avg
      return this.data.map(x => x - avg)
    },
    /**
     * @Description： 计算总体/样本方差
     * */
    variance() {
      if (this.data.length === 0) return 0
      // 1、求偏差
      const dev = this.deviation
      // 2、求偏差平方和
      const sumOfSquOfDev = dev.map(x => x * x).reduce((x, y) => x + y)
      // 3、返回方差
      return (
        sumOfSquOfDev /
        (this.isSample ? this.data.length - 1 : this.data.length)
      )
    },
    /**
     * @Description： 计算总体/样本标准差
     * */
    standardDeviation() {
      return Math.sqrt(this.variance)
    },
    /**
     * @Description： 计算一倍标准差范围
     * */
    standarDevRangeOfOne() {
      return {
        low: this.average - 1 * this.standardDeviation,
        up: this.average + 1 * this.standardDeviation
      }
    },
    /**
     * @Description： 计算三倍标准差范围
     * */
    standarDevRangeOfTwo() {
      return {
        low: this.average - 2 * this.standardDeviation,
        up: this.average + 2 * this.standardDeviation
      }
    },
    /**
     * @Description： 计算三倍标准差范围
     * */
    standarDevRangeOfThree() {
      return {
        low: this.average - 3 * this.standardDeviation,
        up: this.average + 3 * this.standardDeviation
      }
    },
    /**
     * @Description： 计算最小值
     * */
    min() {
      return Math.min.apply(null, this.data)
    },
    /**
     * @Description： 计算最大值
     * */
    max() {
      return Math.max.apply(null, this.data)
    },
    /**
     * @Description： 正态分布(高斯分布)计算公式
     * */
    normalDistribution() {
      // 计算公式： `f(x) = (1 / (\sqrt {2\pi} \sigma)) e^(-(x-\mu)^2/(2\sigma^2))`
      // return (1 / Math.sqrt(2 * Math.PI) * a) * (Math.exp(-1 * ((x - u) * (x - u)) / (2 * a * a)))

      const res = []
      for (let i = 0; i < this.dataAfterCleanX.length; i++) {
        const x = this.dataAfterCleanX[i]
        const a = this.standardDeviation
        const u = this.average
        const y =
          (1 / (Math.sqrt(2 * Math.PI) * a)) *
          Math.exp((-1 * ((x - u) * (x - u))) / (2 * a * a))
        res.push(y)
        if (x === 11.8) console.log(y) // 正态分布峰值，用于验证
      }
      return res
    }
  },
  mounted() {
    this.handleLine()
  },
  methods: {
    /** 查询检测记录列表 */
    getList() {
      this.loading = true
      // this.queryParams.params = {}
      // if (this.daterangeCreateTime != null && this.daterangeCreateTime !== '') {
      //   this.queryParams.params['beginCreateTime'] = this.daterangeCreateTime[0]
      //   this.queryParams.params['endCreateTime'] = this.daterangeCreateTime[1]
      // }
      listGaussian(this.queryParams).then(r => {
        this.detectionrecordList = r.data
        this.data = r.data.analysisData
        /** 初始化options */
        this.initOption1()
        this.initOption2()
        /** 待优化代码段 */
        this.$nextTick(() => {
          if (document.getElementById('myChart1')) {
            this.myChart1 = echarts.init(document.getElementById('myChart1'))
            this.myChart2 = echarts.init(document.getElementById('myChart2'))
          }
          this.myChart2.setOption(this.option2)
          this.myChart1.setOption(this.option1)
          //
        })
        this.changeOption1()
      })
    },
    // 获取产线列表
    handleLine() {
      getlineSelect().then(res => {
        this.lineLists = res.data
      }).catch(() => {
        this.loading = false
      })
    },
    // 产线下拉框变化值
    changeLine(id) {
      this.workpieceLists = undefined
      this.detectionList = undefined
      this.queryParams.productNo = undefined
      this.queryParams.tableColval = undefined
      const arr = this.lineLists.filter(t => t.lineId === id)
      const data = {
        lineType: arr[0].lineType || undefined
      }
      this.handleWorkpiec(data)
    },
    // 获取工件列表(产品)
    handleWorkpiec(data) {
      getOrderWorkpiece(data).then(res => {
        this.workpieceLists = res.data
      }).catch(() => {
        this.loading = false
      })
    },
    handleProduct() {
      this.detectionList = undefined
      this.queryParams.tableColval = undefined
      this.getDetection(this.queryParams)
    },
    getDetection(data) {
      listGaussianDetection(data).then(r => {
        this.detectionList = r.data
      })
    },
    changeOption1() {
      if (!this.detectionrecordList.analysisData) return
      var arr = []
      this.detectionrecordList.analysisData.forEach((e, i) => {
        arr.push(`${i + 1}`)
      })
      this.option1.series[0].markLine.data[1].yAxis = this.detectionrecordList.lowerLimitValue || 0
      this.option1.series[0].markLine.data[2].yAxis = this.detectionrecordList.upperLimitValue || 0
      this.option1.xAxis.data = arr
      // console.log('data', this.detectionrecordList.analysisData)
      // 根据数据大于平均值的折线图的拐点标记红色
      this.option1.series[0].data = []
      this.detectionrecordList.analysisData.forEach((el, index) => {
        let obj = {}
        if (this.detectionrecordList.cpk && el >= this.detectionrecordList.cpk.averageValue) {
          obj = {
            value: el,
            symbolSize: 8, // 拐点大小
            symbol: 'circle', // 拐点样式
            itemStyle: {
              normal: {
                color: '#009688', // 拐点颜色
                borderColor: '#eee',
                borderWidth: 2
              }
            }
          }
          this.option1.series[0].data.push(obj)
        } else {
          this.option1.series[0].data.push(el)
        }
      })
      this.$nextTick(() => {
        // this.myChart1.setOption(this.option1)
      })
    },
    initOption1() {
      // var _this = this
      this.option1 = {
        tooltip: {
          trigger: 'axis'
        },
        color: ['#6CAFAA'],
        textStyle: {
          fontSize: 14
        },
        grid: {
          left: '1%',
          right: '4%',
          bottom: '3%',
          top: '20',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: []
        },
        yAxis: {
          type: 'value',
          splitLine: { show: false }
        },
        series: [
          {
            data: [],
            type: 'line',
            markLine: {
              itemStyle: {
                normal: { lineStyle: { color: '#2C962C' }, label: { show: true, position: 'end' }}
              },
              data: [
                { type: 'average', name: '平均值' },
                { name: '上限值', yAxis: 20 },
                { name: '下限值', yAxis: 5 }
              ]
            }
          }
        ]
      }
    },
    initOption2() {
      this.option2 = {
        // Echarts 图 -- x 坐标轴刻度 -- 正态分布数值
        tooltip: {},
        // Echarts 图 -- 图例
        legend: {
          data: ['f(x)']
        },
        grid: {
          left: '0',
          right: '1%',
          bottom: '3%',
          top: '30',
          containLabel: true
        },
        xAxis: [
          {
            // name : "标准刻度(0.1)",
            data: this.dataAfterCleanX
            // min: this.min,
            // max: this.max
          }
        ],
        // Echarts 图 -- y 坐标轴刻度
        yAxis: [
          {
            type: 'value',
            name: '频数',
            position: 'left',
            // 网格线
            splitLine: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#333'
              }
            },
            axisLabel: {
              formatter: '{value}'
            }
          },
          {
            type: 'value',
            name: '概率',
            position: 'right',
            // 网格线
            splitLine: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#333'
              }
            },
            axisLabel: {
              formatter: '{value}'
            }
          }
        ],
        // Echarts 图 -- y 轴数据
        series: [
          {
            name: '源数据', // y 轴名称
            type: 'bar', // y 轴类型
            yAxisIndex: 0,
            barGap: 0,
            barWidth: 27,
            itemStyle: {
              normal: {
                show: true,
                color: '#6CAFAA', // 柱子颜色
                borderColor: '#009688' // 边框颜色
              }
            },
            data: this.dataAfterCleanY // y 轴数据 -- 源数据
          },
          {
            name: '正态分布', // y 轴名称
            type: 'line', // y 轴类型
            symbol: 'none', // 去掉折线图中的节点
            smooth: true, // true 为平滑曲线
            yAxisIndex: 1,
            data: this.normalDistribution, // y 轴数据 -- 正态分布
            // 警示线
            markLine: {
              symbol: ['none'], // 箭头方向
              lineStyle: {
                type: 'silent',
                color: 'green'
              },
              itemStyle: {
                normal: {
                  show: true,
                  color: 'black'
                }
              },
              label: {
                show: true,
                position: 'middle'
              },
              data: [
                {
                  name: '一倍标准差',
                  xAxis: this.standarDevRangeOfOne.low.toFixed(1),
                  // 当 n 倍标准差在坐标轴外时，将其隐藏，否则它会默认显示在最小值部分，容易引起混淆
                  lineStyle: {
                    opacity: this.min > this.standarDevRangeOfOne.low ? 0 : 1
                  },
                  label: {
                    show: !(this.min > this.standarDevRangeOfOne.low)
                  }
                },
                {
                  name: '一倍标准差',
                  xAxis: this.standarDevRangeOfOne.up.toFixed(1),
                  lineStyle: {
                    opacity: this.max < this.standarDevRangeOfOne.up ? 0 : 1
                  },
                  label: {
                    show: !(this.max < this.standarDevRangeOfOne.up)
                  }
                },
                {
                  name: '二倍标准差',
                  xAxis: this.standarDevRangeOfTwo.low.toFixed(1),
                  lineStyle: {
                    opacity: this.min > this.standarDevRangeOfTwo.low ? 0 : 1
                  },
                  label: {
                    show: !(this.min > this.standarDevRangeOfTwo.low)
                  }
                },
                {
                  name: '二倍标准差',
                  xAxis: this.standarDevRangeOfTwo.up.toFixed(1),
                  lineStyle: {
                    opacity: this.max < this.standarDevRangeOfTwo.up ? 0 : 1
                  },
                  label: {
                    show: !(this.max < this.standarDevRangeOfTwo.up)
                  }
                },
                {
                  name: '三倍标准差',
                  xAxis: this.standarDevRangeOfThree.low.toFixed(1),
                  lineStyle: {
                    opacity: this.min > this.standarDevRangeOfThree.low ? 0 : 1
                  },
                  label: {
                    show: !(this.min > this.standarDevRangeOfThree.low)
                  }
                },
                {
                  name: '三倍标准差',
                  xAxis: this.standarDevRangeOfThree.up.toFixed(1),
                  lineStyle: {
                    opacity: this.max < this.standarDevRangeOfThree.up ? 0 : 1
                  },
                  label: {
                    show: !(this.max < this.standarDevRangeOfThree.up)
                  }
                },
                {
                  name: '平均值',
                  // type: 'average',
                  xAxis: this.average.toFixed(1),
                  lineStyle: {
                    color: '#009688'
                  }
                }
              ]
            }
          }
        ]
      }
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.workpieceLists = undefined
      this.detectionList = undefined
      this.queryParams.productNo = undefined
      this.queryParams.tableColval = undefined
      this.detectionrecordList = {}
      this.resetForm('queryForm')
      // this.handleQuery()
    }
  }
}
</script>
<style lang="scss" scoped>
.right-wrapper ::v-deep .el-descriptions-item__cell {
  line-height: 1.1!important;
  //height: 16% !important;
}
.app-container {
  background: rgb(245, 250, 252);
}
.chart-container{
  position: relative;
  width: 100%;
  height: calc(100vh - 270px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.top {
  height: 58%;
  display: flex;
  justify-content: space-between;
  &-left {
    width: 70%;
    height: 100%;
  }
  &-right {

    width: 29%;
    height: 100%;
    font-weight: bold;
    .right-wrapper {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
    }
    &-text {
      font-size: 14px;
      color: #999;
    }
  }
}
.bottom {
  height: 40%;
}
.l-card {
  height: 100%;
  background: rgb(255,255,255);
  color: rgba(0,0,0, .87);
  overflow: hidden;
  border-radius: 4px;
  padding: 20px;
}
.empty {
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
  color: #999;
}
</style>
