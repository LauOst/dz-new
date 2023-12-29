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
      default: '设备生产分时数据'
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
      type: Object,
      default() {
        return {}
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
      // this.chart = echarts.init(this.$el, 'macarons')
      this.chart = echarts.init(this.$el)
      this.setOptions(this.chartData)
    },
    setOptions({ legend, series, xaxis } = {}) {
      // console.log('legend', legend)
      console.log('series', series)
      // console.log('xaxis', xaxis)
      // setOptions(data) {
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
          trigger: 'axis'
        },
        legend: {
          data: legend,
          orient: 'vertical',
          right: '30',
          // x: '100', // 可设定图例在左、右、居中
          y: 'center',
          itemHeight: 18,
          textStyle: {
            fontSize: 16,
            padding: [0, 0, 0, 10]
          }
        },
        grid: {
          left: 10,
          right: 300,
          bottom: 20,
          top: 60,
          containLabel: true
        },
        xAxis: {
          name: '小时',
          type: 'category',
          boundaryGap: false,
          data: xaxis
        },
        yAxis: {
          name: '生产数量',
          type: 'value',
          axisLine: {
            show: true
          },
          splitArea: { show: false }, // 去除网格区域
          axisTick: {
            show: true
          }
        },
        series: series
      })
    }
  }
}
</script>
