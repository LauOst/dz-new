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
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData, this.option)
    },
    setOptions({ nowNum, qualifiedNum, title } = {}, option) {
      this.chart.setOption(Object.assign({
        // color: ['#3CCDFF', '#FB8B05'],
        tooltip: {
          trigger: 'item',
          backgroundColor: '#fff'
        },
        legend: {
          left: 'right'
        },
        series: [
          {
            name: title,
            type: 'pie',
            radius: '70%',
            label: {
              formatter: '{d}% \n{hr|}\n', // 这里最后另一行设置了一个空数据是为了能让延长线与hr线对接起来
              padding: [0, -5], // 取消hr线跟延长线之间的间隙
              lineHeight: 11,
              rich: {
                a: {
                  color: '#999',
                  align: 'center'
                },
                hr: { // 设置hr是为了让中间线能够自适应长度
                  borderColor: 'auto', // hr的颜色为auto时候会主动显示颜色的
                  width: '110%',
                  borderWidth: 0.5,
                  height: 0.5
                }
              }
            },
            data: [{
              name: title,
              value: qualifiedNum | 0
            },
            {
              name: '不合格率',
              value: nowNum - qualifiedNum | 0
              // value: 20
            }],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }, option))
    }
  }
}
</script>
