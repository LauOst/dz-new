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
    xAxisFn(data) {
      const xAxis = []
      if (data && data.length > 0) {
        var dataL = data[0].data
      }
      if (dataL) {
        for (var i = 0; i < dataL.length; i++) {
          if (dataL && dataL.length === 12) {
            xAxis.push((i + 1) + '月')
          } else {
            xAxis.push(i + 1)
          }
        }
      }
      return xAxis
    },
    // series 循环函数
    seriesFn(data) {
      const series = []
      const newData = JSON.parse(JSON.stringify(data))
      for (var i = 0; i < newData.length; i++) {
        newData[i].data.forEach((e, index) => {
          if (e > 5 && (i + 1) % 2 === 0) {
            var item = {
              value: e,
              itemStyle: {
                color: '#3CCDFF'
              }
            }
            this.$set(newData[i].data, index, item)
          }
        })
        series.push({
          name: newData[i].name,
          stack: newData[i].stack,
          label: {
            show: true,
            color: (i + 1) % 2 === 0 ? 'inherit' : '#fff',
            textBorderColor: (i + 1) % 2 === 0 ? '#fff' : 'inherit',
            textBorderWidth: 1,
            position: (i + 1) % 2 === 0 ? 'top' : 'inside',
            // position: 'top',
            // color: 'inherit',
            formatter: function(params) {
              // if (params.value < Math.ceil(30)) {
              //   return ''
              // } else {
              //   return params.value
              // }
              if (params.value === 0) {
                return ''
              } else {
                return params.value
              }
            }
          },
          emphasis: {
            focus: 'series'
          },
          type: 'bar',
          data: newData[i].data
        })
      }
      return series
    },

    initChart() {
      // this.chart = echarts.init(this.$el, 'macarons')
      this.chart = echarts.init(this.$el)
      this.setOptions(this.chartData)
    },
    setOptions(data) {
      // setOptions(data) {
      this.chart.setOption({
        title: {},
        color: ['#188DF0', '#FF6600', '#3CCDFF', '#FB8B05'],
        xAxis: {
          type: 'category',
          data: this.xAxisFn(data)
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
          }
        },
        yAxis: {
          type: 'value',
          name: '生产数量',
          axisLine: {
            show: true
          },
          splitArea: { show: false }, // 去除网格区域
          axisTick: {
            show: true
          }
        },
        legend: {},
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
        series: this.seriesFn(data)
      })
    }
  }
}
</script>
