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
    // chartData: {
    //   type: Array,
    //   default() {
    //     return []
    //   }
    // }
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
    setOptions({ detectorTime, percentageComplete, outputRate, passRate } = {}) {
    // setOptions(data) {
      this.chart.setOption({
        title: {
          left: 'center',
          text: '产线计划分析',
          textStyle: {
            color: '#333',
            fontSize: 20,
            fontWeight: 700
          }
        },
        xAxis: {
          data: detectorTime,
          name: '日期'
        },
        grid: {
          left: 10,
          right: 300,
          bottom: 10,
          top: 60,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          backgroundColor: '#fff',
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
          type: 'value',
          axisLabel: {
            formatter: '{value} %' // 字符串模板
          }
        },
        legend: {
          data: ['达成率', '产出率', '合格率'],
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
          name: '达成率',
          type: 'line',
          data: percentageComplete,
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        },
        {
          name: '产出率',
          type: 'line',
          data: outputRate,
          animationDuration: 2800,
          animationEasing: 'quadraticOut'
        }, {
          name: '合格率',
          type: 'line',
          data: passRate,
          animationDuration: 2800,
          animationEasing: 'quadraticOut'
        }]
      })
    }
  }
}
</script>
