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
    title: {
      type: String,
      default: '标题'
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
    xAxisFn(data) {
      // const arr = []
      // data.forEach((item, index) => {
      //   arr.push(index + 1)
      // })
      // return arr
    },
    seriesFn(data) {
      const series = [{
        data: data.data,
        type: 'line',
        symbol: (value, params) => {
          if (params.data > data.table.upperValue) {
            return 'emptyCircle'
          } else if (params.data < data.table.lowerValue) { return 'emptyCircle' } else {
            return 'emptyCircle'
          }
        },
        symbolSize: (value, params) => {
          if (params.data > data.table.upperValue) {
            return 4
          } else if (params.data < data.table.lowerValue) { return 4 } else {
            return 4
          }
        },
        itemStyle: {
          color: (params) => {
            if (params.data > data.table.upperValue) {
              return '#d87c7c'
            } else if (params.data < data.table.lowerValue) { return '#d87c7c' } else {
              return '#3fb1e3'
            }
          }
        },
        lineStyle: {
          color: '#3fb1e3'
        },
        markLine: {
          data: [
            // { type: 'average', name: '平均值' },
            { name: '标准值', yAxis: data.table.standardValue, lineStyle: { color: '#FAB72C' }},
            { name: '上限值', yAxis: data.table.upperValue, lineStyle: { color: '#2C962C' }},
            { name: '下限值', yAxis: data.table.lowerValue, lineStyle: { color: '#2C962C' }}
          ]
        }
      }]
      if (data.index) {
        const arr = JSON.parse(JSON.stringify(data.data))
        arr.splice(data.index, 1, { value: arr[data.index], symbolSize: 15 })
        const effectScatter = {
          type: 'effectScatter',
          coordinateSystem: 'cartesian2d',
          data: arr,
          symbolSize: 0,
          showEffectOn: 'render',
          rippleEffect: {
            brushType: 'stroke'
          },
          hoverAnimation: true,
          effectType: 'ripple', // 特效类型，目前只支持涟漪特效'ripple'。
          cursor: 'pointer'
        }
        series.push(effectScatter)
      }
      return series
    },
    initChart() {
      this.chart = echarts.init(this.$el)
      this.setOptions(this.chartData)
    },
    setOptions(data) {
      this.chart.setOption({
        title: {
          left: 'center',
          text: data.title,
          textStyle: {
            color: '#333',
            fontSize: 16,
            fontWeight: 500
          }
        },
        xAxis: {
          type: 'category',
          data: this.xAxisFn(data.data)
        },
        grid: {
          left: 0,
          right: 0,
          bottom: 10,
          top: 40,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
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
          max: function(value) {
            return data.table.upperValue > value.max && data.table.upperValue > 0 ? data.table.upperValue : value.max
            // return value.max
          },
          min: function(value) {
            return data.table.lowerValue < value.min && data.table.lowerValue > 0 ? data.table.lowerValue : value.min
            // return value.min
          }
        },
        series: this.seriesFn(data)
      })
    }
  }
}
</script>
