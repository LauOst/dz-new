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
    chartData: {
      type: Object,
      required: true
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
    initChart() {
      // this.chart = echarts.init(this.$el, 'macarons')
      this.chart = echarts.init(this.$el)
      this.setOptions(this.chartData)
    },
    setOptions({ eqName, stopTime, timeRun } = {}) {
    // setOptions(data) {
      this.chart.setOption({
        color: ['#009688', 'red'],
        title: {
          left: 'center',
          text: '设备用时分析',
          textStyle: {
            color: '#333',
            fontSize: 20,
            fontWeight: 700
          }
        },
        xAxis: {
          type: 'value',
          name: '时长(小时)',
          axisLine: {
            show: true
          },
          splitArea: { show: false }, // 去除网格区域
          axisTick: {
            show: true
          }
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
          formatter: params => {
            var tip = ''
            if (params != null && params.length > 0) {
              tip += params[0].name + '<br />'
              params.forEach((e, i) => {
                tip += `<span
                          style="display:inline-block;margin-right:5px;border-radius:50%;width:10px;height:10px;background-color:${e.color}"
                        ></span>${e.seriesName}：${e.value} 小时<br />`
              })
            }
            return tip
          }
        },
        yAxis: {
          name: '设备',
          type: 'category',
          data: eqName
        },
        legend: {
          data: ['正常', '停机'],
          type: 'scroll',
          orient: 'vertical',
          // x: 'right', // 可设定图例在左、右、居中
          // y: 'center'
          right: '60',
          y: 'center',
          itemHeight: 18,
          textStyle: {
            fontSize: 16,
            padding: [0, 0, 0, 10]
          },
          itemGap: 20
        },
        series: [{
          name: '正常',
          type: 'bar',
          stack: 'total',
          label: {
            show: true
          },
          emphasis: {
            focus: 'series'
          },
          data: timeRun
        },
        {
          name: '停机',
          type: 'bar',
          stack: 'total',
          label: {
            show: true
          },
          emphasis: {
            focus: 'series'
          },
          data: stopTime
        }]
      })
    }
  }
}
</script>
