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
      required: true
    },
    option: {
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
    seriesFn(datasets) {
      var ser = []
      datasets.forEach(item => {
        const seriesObj = Object.assign({
          type: 'line',
          name: item.label,
          smooth: true, // 平滑过渡
          data: item.data,
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        }, item.option)
        ser.push(seriesObj)
      })
      return ser
    },
    legendFn(datasets) {
      var leg = []
      datasets.forEach(item => {
        leg.push(item.label)
      })
      const legObj = { data: leg }
      return legObj
    },

    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData, this.option)
    },
    setOptions({ labels, datasets } = {}, option) {
      this.chart.setOption(Object.assign({
        color: option.color,
        xAxis: {
          data: labels,
          boundaryGap: false
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 0,
          top: 30,
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
          axisTick: {
            show: true
          },
          splitArea: { show: false } // 去除网格区域
        },
        legend: this.legendFn(datasets),
        series: this.seriesFn(datasets)
      }, option))
    }
  }
}
</script>
