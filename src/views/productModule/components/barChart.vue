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
    title: {
      type: String,
      default: '设备加工节拍'
    },
    xName: {
      type: String,
      default: '产品等级'
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
    xFn(data) {
      return data
    },
    initChart() {
      // this.chart = echarts.init(this.$el, 'macarons')
      this.chart = echarts.init(this.$el)
      this.setOptions(this.chartData)
    },
    setOptions({ xaxis, data } = {}) {
      this.chart.setOption({
        title: {
          left: 'center',
          text: this.title,
          textStyle: {
            color: '#333',
            fontSize: 20,
            fontWeight: 700
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          name: this.xName,
          axisLine: {
            show: true
          },
          splitArea: { show: false }, // 去除网格区域
          axisTick: {
            show: true
          },
          data: xaxis
        },
        yAxis: {
          name: '数量',
          type: 'value'
        },
        series: [
          {
            barWidth: '20%',
            type: 'bar',
            data: this.xFn(data),
            label: { // 柱体上显示数值
              show: true, // 开启显示
              position: 'top', // 在上方显示
              fontSize: 14,
              distance: 6,
              fontWeight: 600,
              color: '#5470C6',
              formatter: function(res) {
                if (res.value === 0) {
                  return ''
                } else {
                  return res.value
                }
              }
            }
          }
        ]
      })
    }
  }
}
</script>
