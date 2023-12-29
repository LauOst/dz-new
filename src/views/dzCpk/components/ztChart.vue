<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import * as echarts from 'echarts/lib/echarts'
require('echarts/theme/macarons') // echarts theme
// import resize from './mixins/resize
// import resizeMixins from '@/utils/resizeMixins'

export default {
  // mixins: [resizeMixins],
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
    },
    carouselKey: {
      type: Number,
      default() {
        return 0
      }
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
    },
    carouselKey: {
      handler() {
        this.chart.resize() // 变化重新渲染图表
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
    // this.$erd.listenTo(this.$el, (element) => {
    //   this.$nextTick(function() {
    //     this.chart.resize() // 变化重新渲染图表
    //   })
    // })
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
      const arr = data.values.filter(item => {
        return item !== 9999.999
      })
      const series = [{
        data: arr,
        type: 'line',
        symbol: (value, params) => {
          if (params.data > data.detectionValue.upperLimitValue) {
            return 'circle'
          } else if (params.data < data.detectionValue.lowerLimitValue) { return 'circle' } else {
            return 'circle'
          }
        },
        symbolSize: (value, params) => {
          if (params.data > data.detectionValue.upperLimitValue) {
            return 6
          } else if (params.data < data.detectionValue.lowerLimitValue) { return 6 } else {
            return 6
          }
        },
        itemStyle: {
          color: (params) => {
            if (params.data > data.detectionValue.upperLimitValue) {
              return '#d87c7c'
            } else if (params.data < data.detectionValue.lowerLimitValue) { return '#d87c7c' } else {
              return '#3fb1e3'
            }
          }
        },
        lineStyle: {
          // color: '#3fb1e3'
          color: 'rgba(255,0,0,.0)'
        },
        markLine: {
          symbolSize: [6, 12],
          data: [
            // { type: 'average', name: '平均值' },
            { name: '标准值', yAxis: data.detectionValue.standValue, lineStyle: { color: '#FAB72C' }, label: { fontSize: 12 }},
            { name: '上限值', yAxis: data.detectionValue.upperLimitValue, lineStyle: { color: '#2C962C' }, label: { fontSize: 12 }},
            { name: '下限值', yAxis: data.detectionValue.lowerLimitValue, lineStyle: { color: '#2C962C' }, label: { fontSize: 12 }}
          ],
          precision: 3,
          label: {
            formatter: function(value) {
              return value.value.toFixed(3)
            }
          }
        }
      }]
      // if (data.index) {
      //   const arr = JSON.parse(JSON.stringify(data.data))
      //   arr.splice(0, 1, { value: arr[0], symbolSize: 15 })
      //   const effectScatter = {
      //     type: 'effectScatter',
      //     coordinateSystem: 'cartesian2d',
      //     data: arr,
      //     symbolSize: 0,
      //     showEffectOn: 'render',
      //     rippleEffect: {
      //       brushType: 'stroke'
      //     },
      //     hoverAnimation: true,
      //     effectType: 'ripple', // 特效类型，目前只支持涟漪特效'ripple'。
      //     cursor: 'pointer'
      //   }
      //   series.push(effectScatter)
      // }
      return series
    },
    initChart() {
      this.chart = echarts.init(this.$el)
      this.setOptions(this.chartData)
    },
    setOptions(data) {
      var temp = data.values.concat([data.detectionValue.lowerLimitValue, data.detectionValue.upperLimitValue])
      var arr = temp.filter(num => num > 0 && num < 9999)
      arr.sort((a, b) => {
        return a - b
      })
      var minNum = arr[0]
      var maxNum = arr[arr.length - 1]
      this.chart.setOption({
        dataZoom: document.body.clientWidth > 960 ? [
          {
            type: 'slider',
            filterMode: 'weakFilter',
            showDataShadow: false,
            bottom: 10,
            height: 12,
            labelFormatter: ''
          },
          {
            type: 'inside',
            filterMode: 'weakFilter'
          }
        ] : [],
        xAxis: {
          type: 'category',
          axisLabel: {
            fontSize: 0
          }
          // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        grid: {
          top: '15%',
          left: '13%',
          bottom: '14%',
          right: '8%'
        },
        yAxis: {
          axisLine: {
            show: true
          },
          axisLabel: {
            fontSize: 12,
            formatter: function(value, index) {
              return value.toFixed(3)
            }
          },
          splitArea: { show: false }, // 去除网格区域
          axisTick: {
            show: true
          },
          // scale: true, // 自适应
          type: 'value',
          max: function(value) {
            // return data.table.upperValue > value.max && data.table.upperValue > 0 ? data.table.upperValue + 0.01 : value.max + 0.01
            return maxNum + 0.01
            // return value.max
          },
          min: function(value) {
            // return data.table.lowerValue < value.min && data.table.lowerValue > 0 ? data.table.lowerValue - 0.01 : value.min - 0.01
            return minNum - 0.01
            // return value.min
          }
        },
        series: this.seriesFn(data)
      })
    }
  }
}
</script>
