<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import * as echarts from 'echarts/lib/echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
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
    autoResize: {
      type: Boolean,
      default: true
    },
    // chartData: {
    //   type: Object,
    //   required: true
    // }
    chartData: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
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
    // xAxis 循环函数
    xAxisFn(data) {
      const xAxis = []
      for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < data[i].dateData.length; j++) {
          xAxis.push(data[i].dateData[j])
        }
      }
      return Array.from(new Set(xAxis))
    },
    // series 循环函数
    seriesFn(data) {
      const series = []
      for (var i = 0; i < data.length; i++) {
        series.push({
          name: data[i].lineName,
          type: 'line',
          data: data[i].activationData
        })
      }
      return series
    },
    // legend选中状态 循环函数
    legendFn(dataa) {
      const legend = {
        data: [],
        selected: {},
        type: 'scroll',
        orient: 'vertical',
        // x: 'right', // 可设定图例在左、右、居中
        // y: 'center'
        right: '30',
        // x: '100', // 可设定图例在左、右、居中
        y: 'center',
        itemHeight: 18,
        textStyle: {
          fontSize: 16,
          padding: [0, 0, 0, 10]
        },
        itemGap: 20,
        formatter: function(name) {
          return name.length > 12 ? name.substr(0, 12) + '...' : name
        }
      }
      for (var i = 0; i < dataa.length; i++) {
        legend.data.push(dataa[i].lineName)
        legend.selected[dataa[i].lineName] = dataa[i].show
      }
      return legend
    },
    initChart() {
      // this.chart = echarts.init(this.$el, 'macarons')
      this.chart = echarts.init(this.$el)
      this.setOptions(this.chartData)
    },
    // setOptions({ expectedData, actualData, equipmentData } = {}) {
    setOptions(data) {
      this.chart.setOption({
        title: {
          left: 'center',
          text: '设备稼动率分析',
          textStyle: {
            color: '#333',
            fontSize: 20,
            fontWeight: 700
          }
        },
        xAxis: {
          // data: this.xAxisFn(data)
          data: this.xAxisFn(data),
          name: '日期'
        },
        grid: {
          left: 10,
          right: 300,
          bottom: 20,
          top: 60,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10],
          formatter: function(params) {
            var tip = ''
            if (params != null && params.length > 0) {
              tip += params[0].name + '<br />'
              params.forEach((e, i) => {
                tip += `<span
                          style="display:inline-block;margin-right:5px;border-radius:50%;width:10px;height:10px;background-color:${e.color}"
                        ></span>${e.seriesName}：${e.value}%<br />`
              })
            }
            return tip
          }
        },
        yAxis: {
          axisLine: {
            show: true
          },

          splitArea: { show: false }, // 去除网格区域
          axisTick: {
            show: true
          },
          name: '%',
          axisLabel: {
            formatter: '{value} %' // 字符串模板
          }
        },
        legend: this.legendFn(data),
        series: this.seriesFn(data)
      })
    }
  }
}
</script>
