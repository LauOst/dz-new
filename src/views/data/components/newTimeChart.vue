<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import * as echarts from 'echarts/lib/echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'
import openImg1 from '@/assets/images/left.png'
import openImg2 from '@/assets/images/right.png'
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
      // this.chart = echarts.init(this.$el, 'macarons')
      this.chart = echarts.init(this.$el)
      this.setOptions(this.chartData)
    },
    colorFn(name) {
      const data = {
        '作业': '#2AE58B',
        '待机': '#F3C63B',
        '故障': '#EE5540',
        '关机': '#888888'
      }
      return data[name]
    },
    // 左右门设置
    dataFn1(data, position) {
      let dataList = []
      if (data) {
        const newArr = data.map((o, i) => {
          return {
            name: o.name,
            value: o.value,
            itemStyle: { color: 'rgba(0,0,0,0)' },
            label: {
              show: true,
              fontSize: 12,
              position: position === 'right' ? ['100%', '90%'] : [`-4px`, '90%'],
              padding: position === 'right' ? [0, 0, 0, -10] : 0,
              rich: {
                openImg1: {
                  backgroundColor: {
                    image: openImg1
                  },
                  width: 12,
                  height: 12
                },
                openImg2: {
                  backgroundColor: {
                    image: openImg2
                  },
                  width: 12,
                  height: 12
                }
              },
              formatter: (params) => {
                // console.log(params)
                if (params.name === '开门' && position === 'right') return `{openImg2|}`
                if (params.name === '开门') return `{openImg1|}`
              }
            }
          }
        })
        dataList = newArr
      }
      return dataList
    },
    // 左右门时间设置
    dataFn2(data) {
      let dataList = []
      if (data) {
        const newArr = data.map((o, i) => {
          return {
            name: o.name,
            value: o.value,
            itemStyle: { color: 'rgba(0,0,0,0)' },
            label: {
              show: true,
              color: '#666666',
              fontSize: 14,
              padding: [0, 0, -50, 0],
              rich: {
                name: {
                  align: 'center',
                  fontSize: 12
                }
              },
              formatter: (params) => {
                var time = this.chartData.dataDoor[params.dataIndex].duration
                if (params.name === '开门') return `{name|${this.$doorTime(time || 0)}}`
              }
            }
          }
        })
        dataList = newArr
      }
      return dataList
    },
    doorFn(loca) {
      if (this.chartData.dataDoor && this.chartData.dataDoor.length > 0) { // 有安全门展示安全门
        switch (loca) {
          case 'left': // 左门
            return this.dataFn1(this.chartData.dataDoor)
          case 'right': // 右门
            return this.dataFn1(this.chartData.dataDoor, 'right')
          case 'text': // 开门时间
            return this.dataFn2(this.chartData.dataDoor)
        }
      } else { // 没有则不展示
        return this.dataFn2([])
      }
    },
    dataFn(data) {
      // const colors = ['#2AE58B', '#F3C63B', '#EE5540', '#888888']
      let dataList = []
      if (data) {
        const newArr = data.map(o => {
          return {
            name: o.name,
            value: o.value,
            itemStyle: { normal: { color: this.colorFn(o.name) }},
            label: {
              show: true,
              color: '#666666',
              fontSize: 14,
              position: ['20px', '-16px'],
              rich: {
                A0: {
                  width: 16
                }
              },
              formatter: (params) => {
                const A1 = this.chartData.deviceBaseData[params.data.value[0]].operationDuration // 作业时间
                const A2 = this.chartData.deviceBaseData[params.data.value[0]].standbyDuration // 待机时间
                const A3 = this.chartData.deviceBaseData[params.data.value[0]].faultDuration // 故障时间
                const A4 = this.chartData.deviceBaseData[params.data.value[0]].shutdownDuration // 停机时间
                const Rate = this.chartData.deviceBaseData[params.data.value[0]].operationRate // 作业率
                return params.data.value[1] === this.chartData.data[0].value[1]
                  ? `{A1|作业时间：${A1 >= 60000 ? this.$timeAnaly(A1) : 0}（作业率:${Rate}%）}{A0|}{A2|待机时间：${A2 >= 60000 ? this.$timeAnaly(A2) : 0}}{A0|}{A3|故障时间：${A3 >= 60000 ? this.$timeAnaly(A3) : 0}}{A0|}{A4|停机时间：${A4 >= 60000 ? this.$timeAnaly(A4) : 0}}`
                  : ''

                // return params.data.value[1] === this.chartData[0].value[1]
                // ? `{A1|作业时间：${A1 >= 60000 ? this.$utils.timeAnaly(A1) : 0}（作业率:${Rate}%）}{A0|}{A2|待机时间：${A2 >= 60000 ? this.$utils.timeAnaly(A2) : 0}}{A0|}{A3|故障时间：${A3 >= 60000 ? this.$utils.timeAnaly(A3) : 0}}{A0|}{A4|停机时间：${A4 >= 60000 ? this.$utils.timeAnaly(A4) : 0}}`
                // : ''
              }
            }
          }
        })
        dataList = newArr
      }
      // console.log('dataList', dataList)
      return dataList
    },
    setOptions({ yaxis, data, dataDoor } = {}) {
      const colors = ['#2AE58B', '#F3C63B', '#EE5540', '#888888']
      const state = ['作业', '待机', '故障', '关机']

      // setOptions(data) {
      this.chart.setOption({
        color: colors,
        title: {
          left: 'center',
          text: '设备用时分析',
          textStyle: {
            color: '#333',
            fontSize: 20,
            fontWeight: 700
          }
        },
        dataZoom: [
          {
            type: 'slider',
            filterMode: 'weakFilter',
            showDataShadow: false,
            bottom: 10,
            labelFormatter: ''
          },
          {
            type: 'inside',
            filterMode: 'weakFilter'
          }
        ],
        xAxis: {
          type: 'time',
          name: '时间',
          axisLine: {
            show: true
          },
          splitArea: { show: false }, // 去除网格区域
          axisTick: {
            show: true
          }
        },
        grid: {
          left: 10,
          right: 200,
          bottom: 40,
          top: 40,
          containLabel: true
        },
        tooltip: {

          formatter: params => {
            return params.name + ':' + params.value[1] + '~' + params.value[2]
          }
        },
        yAxis: {
          name: '设备',
          type: 'category',
          data: yaxis
        },
        legend: {
          data: state,
          type: 'scroll',
          orient: 'vertical',
          // x: 'right', // 可设定图例在左、右、居中
          // y: 'center'
          right: '60',
          y: 'center',
          itemHeight: 18,
          textStyle: {
            fontSize: 16,
            padding: [0, 0, 0, 10]
          },
          itemGap: 20
        },
        // dataZoom: [{
        //   type: 'inside',
        //   start: 0,
        //   end: 100
        // }, {
        //   start: 0,
        //   end: 100
        // }],
        series: [
          // 用空bar来显示四个图例
          { name: state[0], type: 'bar', data: [] },
          { name: state[1], type: 'bar', data: [] },
          { name: state[2], type: 'bar', data: [] },
          { name: state[3], type: 'bar', data: [] },
          {
            type: 'custom',
            renderItem: function(params, api) { // 开发者自定义的图形元素渲染逻辑，是通过书写 renderItem 函数实现的
              var categoryIndex = api.value(0)// 这里使用 api.value(0) 取出当前 dataItem 中第一个维度的数值。(data里的0,1,2)

              var start = api.coord([api.value(1), categoryIndex]) // 这里使用 api.coord(...) 将数值在当前坐标系中转换成为屏幕上的点的像素值。【xx,xx】
              var end = api.coord([api.value(2), categoryIndex])
              var height = 20// 柱体宽度

              return {
                type: 'rect', // 表示这个图形元素是矩形。还可以是 'circle', 'sector', 'polygon' 等等。
                shape: echarts.graphic.clipRectByRect({ // 矩形的位置和大小。
                  x: start[0],
                  y: start[1] - height / 2,
                  width: end[0] - start[0],
                  height: height
                }, { // 当前坐标系的包围盒。
                  x: params.coordSys.x,
                  y: params.coordSys.y,
                  width: params.coordSys.width,
                  height: params.coordSys.height
                }),
                style: api.style()
              }
            },
            encode: {
              x: [1, 2], // data 中『维度1』和『维度2』对应到 X 轴
              y: 0// data 中『维度0』对应到 Y 轴
            },
            data: this.dataFn(data)
          },
          {
            type: 'custom',
            renderItem: function(params, api) { // 开发者自定义的图形元素渲染逻辑，是通过书写 renderItem 函数实现的
              var categoryIndex = api.value(0)// 这里使用 api.value(0) 取出当前 dataItem 中第一个维度的数值。(data里的0,1,2)

              var start = api.coord([api.value(1), categoryIndex]) // 这里使用 api.coord(...) 将数值在当前坐标系中转换成为屏幕上的点的像素值。【xx,xx】
              var end = api.coord([api.value(2), categoryIndex])
              var height = 24// 柱体宽度

              return {
                type: 'rect', // 表示这个图形元素是矩形。还可以是 'circle', 'sector', 'polygon' 等等。
                shape: echarts.graphic.clipRectByRect({ // 矩形的位置和大小。
                  x: start[0],
                  y: start[1] - height / 2,
                  width: end[0] - start[0],
                  height: height
                }, { // 当前坐标系的包围盒。
                  x: params.coordSys.x,
                  y: params.coordSys.y,
                  width: params.coordSys.width,
                  height: params.coordSys.height
                }),
                style: api.style()
              }
            },
            encode: {
              x: [1, 2], // data 中『维度1』和『维度2』对应到 X 轴
              y: 0// data 中『维度0』对应到 Y 轴
            },
            data: this.doorFn('left')
          },
          {
            type: 'custom',
            renderItem: function(params, api) { // 开发者自定义的图形元素渲染逻辑，是通过书写 renderItem 函数实现的
              var categoryIndex = api.value(0)// 这里使用 api.value(0) 取出当前 dataItem 中第一个维度的数值。(data里的0,1,2)

              var start = api.coord([api.value(1), categoryIndex]) // 这里使用 api.coord(...) 将数值在当前坐标系中转换成为屏幕上的点的像素值。【xx,xx】
              var end = api.coord([api.value(2), categoryIndex])
              var height = 24// 柱体宽度

              return {
                type: 'rect', // 表示这个图形元素是矩形。还可以是 'circle', 'sector', 'polygon' 等等。
                shape: echarts.graphic.clipRectByRect({ // 矩形的位置和大小。
                  x: start[0],
                  y: start[1] - height / 2,
                  width: end[0] - start[0],
                  height: height
                }, { // 当前坐标系的包围盒。
                  x: params.coordSys.x,
                  y: params.coordSys.y,
                  width: params.coordSys.width,
                  height: params.coordSys.height
                }),
                style: api.style()
              }
            },
            encode: {
              x: [1, 2], // data 中『维度1』和『维度2』对应到 X 轴
              y: 0// data 中『维度0』对应到 Y 轴
            },
            data: this.doorFn('right')
          },
          {
            type: 'custom',
            renderItem: function(params, api) { // 开发者自定义的图形元素渲染逻辑，是通过书写 renderItem 函数实现的
              var categoryIndex = api.value(0)// 这里使用 api.value(0) 取出当前 dataItem 中第一个维度的数值。(data里的0,1,2)

              var start = api.coord([api.value(1), categoryIndex]) // 这里使用 api.coord(...) 将数值在当前坐标系中转换成为屏幕上的点的像素值。【xx,xx】
              var end = api.coord([api.value(2), categoryIndex])
              var height = 24// 柱体宽度

              return {
                type: 'rect', // 表示这个图形元素是矩形。还可以是 'circle', 'sector', 'polygon' 等等。
                shape: echarts.graphic.clipRectByRect({ // 矩形的位置和大小。
                  x: start[0],
                  y: start[1] - height / 2,
                  width: end[0] - start[0],
                  height: height
                }, { // 当前坐标系的包围盒。
                  x: params.coordSys.x,
                  y: params.coordSys.y,
                  width: params.coordSys.width,
                  height: params.coordSys.height
                }),
                style: api.style()
              }
            },
            encode: {
              x: [1, 2], // data 中『维度1』和『维度2』对应到 X 轴
              y: 0// data 中『维度0』对应到 Y 轴
            },
            data: this.doorFn('text')
          }
        ]
      })
    }
  }
}
</script>
