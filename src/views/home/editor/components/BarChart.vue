<template>
  <div id="mye" :class="className" :style="{height:height,width:width}" />
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
      default: () => {}
    },
    option: {
      type: Object,
      default: () => {}
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
    xAxisFn(data) {
      const xAxis = []
      if (data) {
        for (var i = 0; i < data.length; i++) {
          if (data && data.length === 12) {
            xAxis.push((i + 1) + '月')
          } else {
            xAxis.push(i + 1)
          }
        }
      }
      return xAxis
    },
    initChart() {
      this.chart = echarts.init(this.$el)
      this.setOptions(this.chartData, this.option)
    },
    setOptions({ badnessNum, qualifiedNum } = {}, option) {
      this.chart.setOption(Object.assign({
        color: ['#188DF0', '#3CCDFF'],
        xAxis: {
          type: 'category',
          data: this.xAxisFn(qualifiedNum)
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '15%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: [
          {
            type: 'value',
            name: '生产数量',
            axisLine: {
              show: true
            },
            splitArea: { show: false }, // 去除网格区域
            axisTick: {
              show: true
            }
          }
        ],
        dataZoom: [{
          type: 'slider',
          xAxisIndex: 0,
          filterMode: 'none'
        },
        {
          type: 'slider',
          yAxisIndex: 0,
          filterMode: 'none'
        },
        {
          type: 'inside',
          xAxisIndex: 0,
          filterMode: 'none'
        },
        {
          type: 'inside',
          yAxisIndex: 0,
          filterMode: 'none'
        }],
        legend: {
          left: 'right',
          data: ['OK', 'NG']
        },
        series: [{
          name: 'OK',
          type: 'bar',
          label: {
            show: true,
            position: 'top',
            color: 'inherit',
            formatter: function(params) {
              if (params.value === 0) {
                return ''
              } else {
                return params.value
              }
            }
          },
          barWidth: '30%',
          data: qualifiedNum
        }, {
          name: 'NG',
          type: 'bar',
          label: {
            show: true,
            position: 'top',
            color: 'inherit',
            formatter: function(params) {
              if (params.value === 0) {
                return ''
              } else {
                return params.value
              }
            }
          },
          barWidth: '30%',
          data: badnessNum
        }]
      }, option))
    }
  }
}
</script>
