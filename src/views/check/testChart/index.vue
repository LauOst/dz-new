<template>
  <div class="app-container">
    <el-card shadow="never" class="card">
      <el-form v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true" label-width="90px">
        <!--        <el-form-item prop="departId">-->
        <!--          <el-select v-model="queryParams.departId" size="small" placeholder="站点" @change="handleDepart">-->
        <!--            <el-option v-for="(item,index) in departList" :key="index" :label="item.departName" :value="item.id" />-->
        <!--          </el-select>-->
        <!--        </el-form-item>-->
        <el-form-item prop="productNo">
          <el-select v-model="queryParams.productNo" size="small" placeholder="产品名称" @change="handleProduct">
            <el-option
              v-for="(item,index) in productList"
              :key="index"
              :label="item.productName"
              :value="item.productNo"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="itemShow" prop="detectionId">
          <el-select v-model="queryParams.detectionId" size="small" placeholder="检测项">
            <el-option
              v-for="(item,index) in itemList"
              :key="index"
              :label="item.tableColCon"
              :value="item.detectionId"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="dateRange"
            size="small"
            style="width: 240px"
            value-format="yyyy-MM-dd"
            type="daterange"
            unlink-panels
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="getList">搜索</el-button>
          <el-button v-hasPermi="['check:testChart:excel']" type="warning" :loading="btnLoading" icon="el-icon-download" size="small" @click="handleExport">导出</el-button>
          <!-- <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button> -->
        </el-form-item>
      </el-form>
      <!-- 当日 昨日 本周 本月时间过滤按钮 -->
      <el-row :gutter="10" class="l-m-t-20">
        <el-col :span="1.5">
          <el-button type="primary" size="mini" @click="getTime(0)">当日</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="primary" size="mini" @click="getTime(1)">昨日</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="primary" size="mini" @click="getTime(2)">本周</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="primary" size="mini" @click="getTime(3)">本月</el-button>
        </el-col>
      </el-row>
    </el-card>
    <!-- 折线走势图 -->
    <!--    v-if="detectionrecordList.analysisData && detectionrecordList.analysisData.length > 0"-->
    <div>
      <el-card

        v-loading="loading"
        shadow="always"
      >
        <div v-if="detectionrecordList.analysisData && detectionrecordList.analysisData.length > 0" id="myChart1" style="width: 100%;height: 255px;" />
        <el-row v-else style="width: 100%; height: calc(100vh - 350px)">
          <div style="text-align:center;color:#666;width: 100%;height: 100%;" class="l-flex l-flex-col l-col-center l-row-center">
            <img src="../../../assets/images/empty.png" alt="" style="height: 150px">
            <div style="margin-top: 10px">还没有任何信息</div>
          </div>
        </el-row>
      </el-card>
      <!-- 正态分布走势图 -->
      <!--    v-if="detectionrecordList.analysisData && detectionrecordList.analysisData.length > 0"-->
      <el-row
        type="flex"
        justify="space-between"
        style="margin-top: 15px"
        :gutter="10"
      >
        <el-col v-if="detectionrecordList.analysisData && detectionrecordList.analysisData.length > 0" :span="14">
          <el-card v-loading="loading">
            <div v-if="detectionrecordList.analysisData && detectionrecordList.analysisData.length > 0" id="myChart2" style="width: 100%;height: 275px;" />
          </el-card>
        </el-col>
        <el-col v-if="detectionrecordList.analysisData && detectionrecordList.analysisData.length > 0" :span="10">
          <el-card class="l-font-13" style="line-height: 1.6;font-size:14px">
            <el-row class="l-m-b-8 l-font-16" style="font-weight: 600">
              <el-col :span="6">总样本数：{{ detectionrecordList.analysisData.length }}</el-col>
              <el-col :span="6">上限值：{{ detectionrecordList.upperLimitValue }}</el-col>
              <el-col :span="6">下限值：{{ detectionrecordList.lowerLimitValue }}</el-col>
              <el-col :span="6">标准值：{{ detectionrecordList.standValue }}</el-col>
            </el-row>
            <el-row>
              <el-col :span="5">平均值：{{ detectionrecordList.cpk.averageValue }}</el-col>
              <el-col :span="5">最大值：{{ detectionrecordList.cpk.maxValue }}</el-col>
              <el-col :span="4">最小值：{{ detectionrecordList.cpk.minValue }}</el-col>
              <el-col :span="5">+3sigma：{{ detectionrecordList.cpk.sigma32 }}</el-col>
              <el-col :span="5">-3sigma：{{ detectionrecordList.cpk.sigma31 }}</el-col>
            </el-row>
            <div>STDEV: {{ detectionrecordList.cpk.stdev }}</div>
            <div>CPK: {{ detectionrecordList.cpk.cpk }}</div>
            <div>CP: {{ detectionrecordList.cpk.cp }}</div>
            <div>CPL: {{ detectionrecordList.cpk.cpl }}</div>
            <div>CPU: {{ detectionrecordList.cpk.cpu }}</div>
            <div>PPM &lt; LSL: {{ detectionrecordList.cpk.ppmlessThanLSL }}</div>
            <div>PPM &gt; USL: {{ detectionrecordList.cpk.ppmgreaterThanUSL }}</div>
            <div>PPM Total: {{ detectionrecordList.cpk.ppmgreaterTotal }}</div>
            <div>CA: {{ detectionrecordList.cpk.ca }}</div>
            <div>{{ detectionrecordList.cpk.info || '暂无信息' }}</div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { listTestcheck, getByProductId, getDepartId, uplaodBase64, getExportTrend } from '@/api/check/testChart'
import { getToday, getYesterday, getCurrWeekDays, getCurrMonthDays } from '@/utils/function/moment'
import { mapGetters } from 'vuex'
// const Blob = require('Blob')
export default {
  name: 'TestChart',
  data() {
    return {
      loading: false,
      // 检测记录表格数据
      detectionrecordList: [],
      // 显示搜索条件
      showSearch: true,
      // 分页搜索参数
      queryParams: {
        detectionId: '',
        productNo: '',
        departId: ''
      },
      // 站点列表
      departList: [],
      // 产品列表
      productList: [],
      // 检测项列表
      itemList: [],
      dateRange: [],
      productShow: false,
      itemShow: false,
      option1: Object,
      option2: Object,
      myChart1: Object,
      myChart2: Object,
      // 是否为样本数据
      isSample: true,
      data: null,
      btnLoading: false
    }
  },
  computed: {
    ...mapGetters(['imgUploadAction', 'token', 'sub']),
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
      console.log('res', res)
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
      // 2、返回偏差。 f(x) = x - agv
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
    this.handleDepart()
    this.dateRange = this.getMonthDays()
  },
  methods: {
    /** 当日，昨日，本周，本月时间 */
    getTime(num) {
      if (this.queryParams.detectionId === '' || this.queryParams.detectionId === null) {
        this.$message.error('请先选择检测项')
        return
      }
      // console.log(getToday())

      switch (num) {
        case 1:
          this.dateRange = getYesterday()
          break
        case 2:
          this.dateRange = getCurrWeekDays()
          break
        case 3:
          this.dateRange = getCurrMonthDays()
          break
        default:
          this.dateRange = getToday()
          break
      }
      this.getList()
    },
    async handleExport() {
      await this.getList()
      this.loading = true
      uplaodBase64({ imgBase64: [this.myChart1.getDataURL(), this.myChart2.getDataURL()] }).then(res => {
        const paramsData = {
          detectionId: this.queryParams.detectionId,
          productNo: this.queryParams.productNo,
          lineUrl: res.data[0],
          cpkUrl: res.data[1],
          startTime: this.dateRange[0],
          endTime: this.dateRange[1]
        }
        this.btnLoading = true
        getExportTrend(paramsData).then((res) => {
          this.btnLoading = false
          this.loading = false
          if (!res.data) return
          this.$downloadFunc(res)
        }).catch((err) => {
          console.log('err', err)
          this.btnLoading = false
        })
      }).catch((err) => {
        console.log('err', err)
        this.loading = false
      })
    },
    /** 查询走势图数据 */
    getList() {
      return new Promise((resolve) => {
        if (this.queryParams.detectionId === '' || this.queryParams.detectionId === null) {
          this.$message.error('请先选择检测项')
          return
        }
        this.loading = true
        listTestcheck(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          this.detectionrecordList = response.data
          this.data = response.data.analysisData
          // this.data = this.ceshi
          // console.log('data', response)
          /** 初始化options */
          this.initOption1()
          this.initOption2()
          /** 待优化代码段 */
          this.$nextTick(() => {
            if (document.getElementById('myChart1')) {
              this.myChart1 = this.$echarts.init(document.getElementById('myChart1'))
              this.myChart2 = this.$echarts.init(document.getElementById('myChart2'))
            }
            this.myChart2.setOption(this.option2)
          })
          this.changeOption1()
          this.loading = false
          resolve()
        }).catch(() => {
          this.loading = false
          this.detectionrecordList = []
        })
      })
    },
    /** 通过接口动态配置折线图中的xAxis以及数据信息 */
    changeOption1() {
      if (!this.detectionrecordList.analysisData) return
      var arr = []
      this.detectionrecordList.analysisData.forEach((e, i) => {
        arr.push(`${i + 1}`)
      })
      // this.option1.series[0].markLine.data[0].yAxis = this.detectionrecordList.standardValue || 0
      // this.option1.series[0].markLine.data[1].yAxis = this.detectionrecordList.lowerValue || 0
      // this.option1.series[0].markLine.data[2].yAxis = this.detectionrecordList.upperValue || 0
      this.option1.series[0].markLine.data[1].yAxis = this.detectionrecordList.lowerLimitValue || 0
      this.option1.series[0].markLine.data[2].yAxis = this.detectionrecordList.upperLimitValue || 0
      this.option1.xAxis.data = arr
      // // 根据数据大于平均值的折线图的拐点标记红色
      this.option1.series[0].data = []
      this.detectionrecordList.analysisData.forEach((el, index) => {
        let obj = {}
        // if (el >= this.detectionrecordList.standardValue) {
        if (this.detectionrecordList.cpk && el >= this.detectionrecordList.cpk.averageValue) {
          obj = {
            value: el,
            symbolSize: 7, // 拐点大小
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
        this.myChart1.setOption(this.option1)
      })
    },
    initOption1() {
      this.option1 = {
        backgroundColor: '#ffffff',
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
          bottom: '18%',
          top: '10',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          axisLabel: {
            rotate: 90
          },
          data: []
        },
        yAxis: {
          type: 'value',
          max: function(value) {
            // return data.table.upperValue > value.max && data.table.upperValue > 0 ? data.table.upperValue : value.max
            return value.max
          },
          min: function(value) {
            // return data.table.lowerValue < value.min && data.table.lowerValue > 0 ? data.table.lowerValue : value.min
            return value.min
          },

          splitLine: { show: false }
        },
        dataZoom: [{
          type: 'inside',
          start: 0,
          end: 100
        }, {
          start: 0,
          end: 100
        }],
        series: [
          {
            data: [],
            type: 'line',
            markLine: {
              data: [
                // { type: 'average', name: '平均值' },
                { name: '标准值', yAxis: 20, lineStyle: { color: '#FAB72C' }},
                { name: '上限值', yAxis: 20, lineStyle: { color: '#2C962C' }},
                { name: '下限值', yAxis: 5, lineStyle: { color: '#2C962C' }}
              ]
            }
          }
        ]
      }
    },
    initOption2() {
      this.option2 = {
        // Echarts 图 -- x 坐标轴刻度 -- 正态分布数值
        backgroundColor: '#ffffff',
        tooltip: {},
        // Echarts 图 -- 图例
        legend: {
          data: ['f(x)']
        },
        grid: {
          left: '1%',
          right: '4%',
          bottom: '18%',
          top: '10',
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
        dataZoom: [{
          type: 'inside',
          start: 0,
          end: 100
        }, {
          start: 0,
          end: 100
        }],
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
    // 获取站点列表
    // getDepartList() {
    //   switchSite().then(res => {
    //     this.departList = res.data
    //   })
    // },
    /** 通过站点id选择产品 */
    handleDepart() {
      // this.itemShow = false
      // this.queryParams.productNo = null
      // this.queryParams.detectionId = null
      getDepartId().then(res => {
        // this.productShow = true
        this.productList = res.data
      })
    },
    /** 通过产品id选择检测项 */
    handleProduct() {
      this.queryParams.detectionId = null
      getByProductId(this.queryParams.productNo).then(res => {
        this.itemShow = true
        this.itemList = res.data
      })
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = []
      this.resetForm('queryForm')
      this.getList()
    }
  }
}
</script>

<style scoped>
</style>
