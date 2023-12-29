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
    },
    sysConfig: {
      type: String,
      default: 'false'
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
      let newData = []
      if (badnessNum) {
        newData = JSON.parse(JSON.stringify(badnessNum))
      }
      if (badnessNum) {
        newData.forEach((el, index) => {
          if (el > 5) {
            var item = {
              value: el,
              itemStyle: {
                color: '#3CCDFF'
              }
            }
            this.$set(newData, index, item)
          }
        })
      }
      this.chart.setOption(Object.assign({
        color: ['#188DF0', '#FF6600'],
        xAxis: [
          {
            type: 'category',
            data: this.xAxisFn(qualifiedNum),
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        grid: {
          left: '3%',
          right: '4%',
          bottom: '15%',
          containLabel: true
        },
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
            splitArea: { show: false } // 去除网格区域
          }
        ],
        legend: {
          left: 'right',
          data: this.sysConfig === 'true' ? ['OK', 'NG'] : []
        },
        series: [{
          name: 'OK',
          type: 'bar',
          barWidth: '30%',
          data: qualifiedNum,
          label: {
            show: true,
            color: 'inherit',
            position: 'top',
            formatter: function(params) {
              if (params.value < Math.ceil(30)) {
                return ''
              } else {
                return params.value
              }
            }
          }
        }, {
          name: 'NG',
          type: 'bar',
          barWidth: '30%',
          data: newData,
          label: {
            show: true,
            color: 'inherit',
            position: 'top',
            formatter: function(params) {
              if (params.value < Math.ceil(30)) {
                return ''
              } else {
                return params.value
              }
            }
          }
        }]
      }, option))
    }
  }
}
</script>
