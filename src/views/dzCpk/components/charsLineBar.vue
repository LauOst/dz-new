<template>
  <div :id="id" :class="className" :style="{height:height,width:width}" />
</template>

<script>
import * as echarts from 'echarts/lib/echarts'
import resize from '@/views/data/components/mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '100%'
    },
    chartData: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      chart: null
    }
  },
  computed: {
    /**
     * @Description： 有序数据源（方便操作）
     * */
    dataOrderBy() {
      const data = this.chartData.concat([]) // 为防止 sort 方法修改原数组，对原数组进行拷贝，操作副本。
      return data.sort((a, b) => a - b)
    },
    /**
     * @Description： 数据整理。原数据整理为：{数据值 : 数据频率}
     * */
    dataAfterClean() {
      const res = {}
      // const data = this.dataOrderBy
      for (let i = 0; i < this.chartData.length; i++) {
        let key = parseFloat(this.chartData[i]).toFixed(1) // 这里保留 1 位小数
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
      if (this.chartData.length === 0) return 0
      return this.chartData.reduce((prev, curr) => prev + curr)
    },
    /**
     * @Description： 计算平均数。这里的平均数指的是数学期望、算术平均数
     * */
    average() {
      return this.sum / this.chartData.length
    },
    /**
     * @Description： 计算偏差
     * */
    deviation() {
      // 1、求平均数
      const avg = this.average
      // 2、返回偏差。 f(x) = x - avg
      return this.chartData.map(x => x - avg)
    },
    /**
     * @Description： 计算总体/样本方差
     * */
    variance() {
      if (this.chartData.length === 0) return 0
      // 1、求偏差
      const dev = this.deviation
      // 2、求偏差平方和
      const sumOfSquOfDev = dev.map(x => x * x).reduce((x, y) => x + y)
      // 3、返回方差
      return (
        sumOfSquOfDev /
        (this.isSample ? this.chartData.length - 1 : this.chartData.length)
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
      return Math.min.apply(null, this.chartData)
    },
    /**
     * @Description： 计算最大值
     * */
    max() {
      return Math.max.apply(null, this.chartData)
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
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.chart.dispose()
        this.chart = null
        this.chart = echarts.init(this.$el)
        this.setOptions(val)
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el)
      this.setOptions(this.chartData)
    },
    xAxisFn(data) {
      if (!data.analysisData) return
      var arr = []
      data.analysisData.forEach((e, i) => {
        arr.push(`${i + 1}`)
      })
      console.log('arr', arr)
      return arr
    },
    setOptions(data) {
      this.chart.setOption({
        backgroundColor: '#fff',
        tooltip: {},
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
        xAxis: {
          data: this.dataAfterCleanX
        },
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
      })
    }

  }
}
</script>
