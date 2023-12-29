<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import * as echarts from 'echarts/lib/echarts'
require('echarts/theme/macarons') // echarts theme
import resize from '@/views/data/components/mixins/resize'

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
      default: 'OP10中心孔检测数据'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      required: true
    },
    color: {
      type: Array,
      default() {
        // return ["#0099FF", "#FF6600"];
        return ['#188df0']
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
      this.chart = echarts.init(this.$el)
      this.setOptions(this.chartData)
    },
    setOptions(data) {
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
        xAxis: {
          type: 'category',
          data: data.workpieceIdList || [],
          axisTick: {
            show: false
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#F2F2F2'
            }
          },
          axisLabel: {
            show: false,
            color: '#BCBCBC'
          }
        },
        grid: {
          left: 10,
          right: 20,
          bottom: 20,
          top: 60,
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
            show: true,
            lineStyle: {
              color: '#F2F2F2'
            }
          },

          splitArea: { show: false }, // 去除网格区域
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#BCBCBC'
          },
          splitLine: {
            lineStyle: {
              color: '#F7F7F7'
            }
          }
        },
        series: [
          {
            data: data.centreHoleList || [],
            type: 'line',
            smooth: true,
            symbolSize: 1,
            symbol: 'circle',
            yAxisIndex: 0,
            showSymbol: false,
            lineStyle: {
              width: 2,
              color: new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [
                {
                  offset: 0,
                  color: '#188df0'
                },
                {
                  offset: 1,
                  color: '#9E87FF'
                }
              ]),
              shadowColor: 'rgba(158,135,255, 0.3)',
              // shadowColor: 'rgba(0,0,0, 0.1)',
              shadowBlur: 10,
              shadowOffsetY: 20
            },
            itemStyle: {
              color: '#188df0',
              borderColor: '#188df0'
            }
          }
        ]
      })
    }
  }
}
</script>
