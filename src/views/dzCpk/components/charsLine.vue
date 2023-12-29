<template>
  <div :id="id" :class="className" :style="{height:height,width:width}" />
</template>

<script>
import * as echarts from 'echarts/lib/echarts'
import resize from '@/views/data/components/mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
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
      this.chart = echarts.init(this.$el)
      this.setOptions(this.chartData)
    },
    xAxisFn(data) {
      if (!data.analysisData) return
      var arr = []
      data.analysisData.forEach((e, i) => {
        arr.push(`${i + 1}`)
      })
      console.log('arr', arr)
      return arr
    },
    setOptions(data) {
      console.log('chartsData', data)
      this.chart.setOption({
        backgroundColor: '#fff',
        tooltip: {
          trigger: 'axis'
        },
        color: ['#6CAFAA'],
        textStyle: {
          fontSize: 14
        },
        grid: {
          left: '1%',
          right: '4%',
          bottom: '3%',
          top: '20',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: this.xAxisFn(data)
        },
        yAxis: {
          type: 'value',
          splitLine: { show: false },
          max: function(value) {
            console.log('data', data)
            console.log('value', value)
            return data.upperLimitValue > value.max && data.upperLimitValue > 0 ? data.upperLimitValue : value.max
            // return value.max
          },
          min: function(value) {
            return data.lowerLimitValue < value.min && data.lowerLimitValue > 0 ? data.lowerLimitValue : value.min
            // return minNum - 0.01
            // return value.min
          }
        },
        series: [
          {
            // data: [13.3, 12.7, 12.9, 12.3, 12.8, 11.4, 12.7, 12.7, 12.4, 12.5, 12.5, 11.5],
            data: data.analysisData,
            type: 'line',
            markLine: {
              itemStyle: {
                normal: { lineStyle: { color: '#2C962C' }, label: { show: true, position: 'end' }}
              },
              data: [
                { type: 'average', name: '平均值' },
                { name: '上限值', yAxis: data.upperLimitValue || 0 },
                { name: '下限值', yAxis: data.lowerLimitValue || 0 }
              ]
            }
          }
        ]
      })
    }

  }
}
</script>
