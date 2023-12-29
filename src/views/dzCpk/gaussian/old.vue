<template>
  <div class="app-container">
    <el-card shadow="never" class="card">
      <el-form v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
        <el-form-item prop="orderId">
          <el-select v-model="queryParams.orderId" size="small" placeholder="订单编号" @change="handleOrder">
            <el-option v-for="(item,index) in orderList" :key="index" :label="item.orderNumber" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="productShow" prop="productId">
          <el-select v-model="queryParams.productId" size="small" placeholder="产品名称" @change="handleProduct">
            <el-option v-for="(item,index) in productList" :key="index" :label="item.productName" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="itemShow" prop="detectionItem" @change="handleProduct">
          <el-select v-model="queryParams.detectionItem" size="small" placeholder="检测项">
            <el-option v-for="(item,index) in itemList" :key="index" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
            v-model="daterangeCreateTime"
            size="small"
            style="width: 240px"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
      <!-- 当日 昨日 本周 本月时间过滤按钮 -->
      <el-row :gutter="10" class="mt20">
        <el-col :span="1.5">
          <el-button type="cyan" size="mini" @click="getTime(0)">当日</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="cyan" size="mini" @click="getTime(1)">昨日</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="cyan" size="mini" @click="getTime(2)">本周</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="cyan" size="mini" @click="getTime(3)">本月</el-button>
        </el-col>
      </el-row>
    </el-card>
    <!-- 折线走势图 -->
    <el-card v-if="detectionrecordList.analysisData && detectionrecordList.analysisData.length > 0" shadow="always" class="mb14">
      <div id="myChart1" style="width: 100%;height: 265px;" />
    </el-card>
    <!-- 正态分布走势图 -->
    <el-row v-if="detectionrecordList.analysisData && detectionrecordList.analysisData.length > 0" type="flex" justify="space-between">
      <el-col :span="12">
        <el-card shadow="always">
          <div id="myChart2" style="width: 100%;height: 346px;" />
        </el-card>
      </el-col>
      <el-col :span="11">
        <el-card v-if="detectionrecordList.cpk" shadow="always" class="lh2 fs14">
          <el-row class="mb8 fs16 fw600">
            <el-col :span="4">总样本数：{{ detectionrecordList.analysisData.length }}</el-col>
            <el-col :span="4">上限值：{{ detectionrecordList.upperLimitValue }}</el-col>
            <el-col :span="4">下限值：{{ detectionrecordList.lowerLimitValue }}</el-col>
            <el-col :span="4">标准值：{{ detectionrecordList.standValue }}</el-col>
          </el-row>
          <el-row>
            <el-col :span="4">平均值：{{ detectionrecordList.cpk.averageValue }}</el-col>
            <el-col :span="4">最大值：{{ detectionrecordList.cpk.maxValue }}</el-col>
            <el-col :span="4">最小值：{{ detectionrecordList.cpk.minValue }}</el-col>
            <el-col :span="4">+3sigma：{{ detectionrecordList.cpk.sigma32 }}</el-col>
            <el-col :span="4">-3sigma：{{ detectionrecordList.cpk.sigma31 }}</el-col>
          </el-row>
          <div>STDEV: {{ detectionrecordList.cpk.stdev }}</div>
          <div>CPK: {{ detectionrecordList.cpk.cpk }}</div>
          <div>CP: {{ detectionrecordList.cpk.cp }}</div>
          <div>CPL: {{ detectionrecordList.cpk.cpl }}</div>
          <div>CPU: {{ detectionrecordList.cpk.cpu }}</div>
          <!--          <div>PPM < LSL: {{ detectionrecordList.cpk.ppmlessThanLSL }}</div>-->
          <div>PPM > USL: {{ detectionrecordList.cpk.ppmgreaterThanUSL }}</div>
          <div>PPM Total: {{ detectionrecordList.cpk.ppmgreaterTotal }}</div>
          <div>CA: {{ detectionrecordList.cpk.ca }}</div>
          <div>{{ detectionrecordList.cpk.info || '暂无信息' }}</div>
        </el-card>
      </el-col>
    </el-row>
    <el-row v-else>
      <el-card style="height: calc(100vh - 270px);text-align:center;line-height: 5;color:#666">
        <!--        <img src="../../../assets/images/null.png" alt="" style="margin-top: 150px;">-->
        <div>还没有任何信息</div>
      </el-card>
    </el-row>
  </div>
</template>

<script>
// // import { listDetectionrecord2, getDetectionrecord, delDetectionrecord, addDetectionrecord, updateDetectionrecord, exportDetectionrecord } from '@/api/detection-analysis/detectionrecord'
// import { listProduct } from '@/api/detection-analysis/product'
// import { listOrders } from '@/api/detection-analysis/order'
// import { getItemrecord } from '@/api/detection-analysis/detectionrecord'
// import { getToday, getYesterday, getCurrWeekDays, getCurrMonthDays } from '@/utils/moment'
export default {
  name: 'Detectionrecord',
  components: {
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 检测记录表格数据
      detectionrecordList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 创建时间时间范围
      daterangeCreateTime: [],
      // 查询参数
      queryParams: {
        productId: null,
        orderId: null,
        detectionItem: null,
        createTime: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      productShow: false,
      itemShow: false,
      // 产品列表
      productList: [],
      // 订单列表
      orderList: [],
      // 检测项列表
      itemList: [],
      option1: Object,
      option2: Object,
      myChart1: Object,
      myChart2: Object,
      // 是否为样本数据
      isSample: true,
      data: null
    }
  },
  computed: {
    /**
     * @Description： 有序数据源（方便操作）
     * */
    dataOrderBy() {
      const data = this.data.concat([]) // 为防止 sort 方法修改原数组，对原数组进行拷贝，操作副本。
      return data.sort((a, b) => a - b)
    },
    /**
     * @Description： 数据整理。原数据整理为：{数据值 : 数据频率}
     * */
    dataAfterClean() {
      const res = {}
      // const data = this.dataOrderBy
      for (let i = 0; i < this.data.length; i++) {
        let key = parseFloat(this.data[i]).toFixed(1) // 这里保留 1 位小数
        if (key !== 'NaN' && parseFloat(key) === 0) key = '0.0' // 这个判断用来处理保留小数位后 -0.0 和 0.0 判定为不同 key 的 bug
        if (res[key]) res[key] += 1
        else res[key] = 1
      }
      console.log('res', res)
      return res
    },
    /**
     * @Description： 数据整理。返回源数据所有值（排序后）
     * */
    dataAfterCleanX() {
      return Object.keys(this.dataAfterClean)
        .sort((a, b) => a - b)
        .map(t => parseFloat(t).toFixed(1)) // 保留 1 位小数
    },
    /**
     * @Description： 数据整理。返回源数据所有值对应的频率（排序后） -- 与 dataAfterCleanX 顺序一致
     * */
    dataAfterCleanY() {
      const r = []
      for (let i = 0; i < this.dataAfterCleanX.length; i++) {
        r.push(this.dataAfterClean[this.dataAfterCleanX[i]])
      }
      // console.log("y轴数据", r);
      return r
    },
    /**
     * @Description： 计算平均数。这里的平均数指的是数学期望、算术平均数
     * */
    sum() {
      if (this.data.length === 0) return 0
      return this.data.reduce((prev, curr) => prev + curr)
    },
    /**
     * @Description： 计算平均数。这里的平均数指的是数学期望、算术平均数
     * */
    average() {
      return this.sum / this.data.length
    },
    /**
     * @Description： 计算偏差
     * */
    deviation() {
      // 1、求平均数
      const avg = this.average
      // 2、返回偏差。 f(x) = x - avg
      return this.data.map(x => x - avg)
    },
    /**
     * @Description： 计算总体/样本方差
     * */
    variance() {
      if (this.data.length === 0) return 0
      // 1、求偏差
      const dev = this.deviation
      // 2、求偏差平方和
      const sumOfSquOfDev = dev.map(x => x * x).reduce((x, y) => x + y)
      // 3、返回方差
      return (
        sumOfSquOfDev /
        (this.isSample ? this.data.length - 1 : this.data.length)
      )
    },
    /**
     * @Description： 计算总体/样本标准差
     * */
    standardDeviation() {
      return Math.sqrt(this.variance)
    },
    /**
     * @Description： 计算一倍标准差范围
     * */
    standarDevRangeOfOne() {
      return {
        low: this.average - 1 * this.standardDeviation,
        up: this.average + 1 * this.standardDeviation
      }
    },
    /**
     * @Description： 计算三倍标准差范围
     * */
    standarDevRangeOfTwo() {
      return {
        low: this.average - 2 * this.standardDeviation,
        up: this.average + 2 * this.standardDeviation
      }
    },
    /**
     * @Description： 计算三倍标准差范围
     * */
    standarDevRangeOfThree() {
      return {
        low: this.average - 3 * this.standardDeviation,
        up: this.average + 3 * this.standardDeviation
      }
    },
    /**
     * @Description： 计算最小值
     * */
    min() {
      return Math.min.apply(null, this.data)
    },
    /**
     * @Description： 计算最大值
     * */
    max() {
      return Math.max.apply(null, this.data)
    },
    /**
     * @Description： 正态分布(高斯分布)计算公式
     * */
    normalDistribution() {
      // 计算公式： `f(x) = (1 / (\sqrt {2\pi} \sigma)) e^(-(x-\mu)^2/(2\sigma^2))`
      // return (1 / Math.sqrt(2 * Math.PI) * a) * (Math.exp(-1 * ((x - u) * (x - u)) / (2 * a * a)))

      const res = []
      for (let i = 0; i < this.dataAfterCleanX.length; i++) {
        const x = this.dataAfterCleanX[i]
        const a = this.standardDeviation
        const u = this.average
        const y =
          (1 / (Math.sqrt(2 * Math.PI) * a)) *
          Math.exp((-1 * ((x - u) * (x - u))) / (2 * a * a))
        res.push(y)
        if (x === 11.8) console.log(y) // 正态分布峰值，用于验证
      }
      return res
    }
  },
  mounted() {
    /** 获取订单列表 */
    this.getOrder()
    this.getList()
  },
  methods: {
    /** 当日，昨日，本周，本月时间 */
    getTime(num) {
      // if (this.queryParams.detectionItem == null) {
      //   this.$message.error('请先选择检测项')
      //   return
      // }
      // switch (num) {
      //   case 1:
      //     this.daterangeCreateTime = getYesterday()
      //     break
      //   case 2:
      //     this.daterangeCreateTime = getCurrWeekDays()
      //     break
      //   case 3:
      //     this.daterangeCreateTime = getCurrMonthDays()
      //     break
      //   default:
      //     this.daterangeCreateTime = getToday()
      //     break
      // }
      this.getList()
    },
    /** 查询检测记录列表 */
    getList() {
      this.loading = true
      this.queryParams.params = {}
      if (this.daterangeCreateTime != null && this.daterangeCreateTime !== '') {
        this.queryParams.params['beginCreateTime'] = this.daterangeCreateTime[0]
        this.queryParams.params['endCreateTime'] = this.daterangeCreateTime[1]
      }
      this.detectionrecordList = {
        lowerLimitValue: 995.26,
        upperLimitValue: 875.26,
        standValue: 754.23,
        cpk: {
          averageValue: 12,
          maxValue: 13.124,
          minValue: 11.215,
          sigma32: 0,
          sigma31: 12,
          stdev: 21,
          cpk: 124,
          cp: 124,
          cpl: 124,
          cpu: 124,
          ppmlessThanLSL: 124,
          ppmgreaterThanUSL: 124,
          ppmgreaterTotal: 124,
          ca: 124,
          info: 124
        },
        analysisData: [13.3, 12.7, 12.9, 12.3, 12.8, 11.4, 12.7, 12.7, 12.4, 12.5, 12.5, 11.5, 13.1, 12, 12.8, 12.3, 12.4, 12.6, 12.5, 11.8, 12.3, 12.9, 13.3, 12.9, 12.3, 12.6, 12.7, 12.6, 12.8, 12.4, 12.8, 11.9, 11.7, 12.3, 12.4, 12.2]
      }
      this.data = [13.3, 12.7, 12.9, 12.3, 12.8, 11.4, 12.7, 12.7, 12.4, 12.5, 12.5, 11.5, 13.1, 12, 12.8, 12.3, 12.4, 12.6, 12.5, 11.8, 12.3, 12.9, 13.3, 12.9, 12.3, 12.6, 12.7, 12.6, 12.8, 12.4, 12.8, 11.9, 11.7, 12.3, 12.4, 12.2]
      console.log('data', this.data)
      /** 初始化options */
      this.initOption1()
      this.initOption2()
      /** 待优化代码段 */
      this.$nextTick(() => {
        if (document.getElementById('myChart1')) {
          this.myChart1 = this.$echarts.init(document.getElementById('myChart1'))
          this.myChart2 = this.$echarts.init(document.getElementById('myChart2'))
        }
        this.myChart2.setOption(this.option2)
      })
      this.changeOption1()
    },
    /** 通过接口动态配置折线图中的xAxis以及数据信息 */
    changeOption1() {
      if (!this.detectionrecordList.analysisData) return
      var arr = []
      this.detectionrecordList.analysisData.forEach((e, i) => {
        arr.push(`${i + 1}`)
      })
      this.option1.series[0].markLine.data[1].yAxis = this.detectionrecordList.lowerLimitValue || 0
      this.option1.series[0].markLine.data[2].yAxis = this.detectionrecordList.upperLimitValue || 0
      this.option1.xAxis.data = arr
      // console.log('data', this.detectionrecordList.analysisData)
      // 根据数据大于平均值的折线图的拐点标记红色
      this.option1.series[0].data = []
      this.detectionrecordList.analysisData.forEach((el, index) => {
        let obj = {}
        if (this.detectionrecordList.cpk && el >= this.detectionrecordList.cpk.averageValue) {
          obj = {
            value: el,
            symbolSize: 8, // 拐点大小
            symbol: 'circle', // 拐点样式
            itemStyle: {
              normal: {
                color: '#009688', // 拐点颜色
                borderColor: '#eee',
                borderWidth: 2
              }
            }
          }
          this.option1.series[0].data.push(obj)
        } else {
          this.option1.series[0].data.push(el)
        }
      })
      this.$nextTick(() => {
        this.myChart1.setOption(this.option1)
      })
    },
    /** 获取订单列表 */
    getOrder() {
      // listOrders().then(res => {
      //   this.orderList = res.rows
      // })
    },
    /** 通过订单id选择产品 */
    handleOrder() {
      this.productShow = true
      this.queryParams.productId = null
      this.queryParams.detectionItem = null
      // listProduct({ orderId: this.queryParams.orderId }).then(res => {
      //   this.productList = res.rows
      // })
    },
    /** 通过订单id和产品id选择检测项 */
    handleProduct() {
      this.itemShow = true
      this.queryParams.detectionItem = null
      // getItemrecord(this.queryParams.orderId, this.queryParams.productId).then(res => {
      //   var itemList = []
      //   res.data.forEach((el, index) => {
      //     for (const key in el) {
      //       const obj = { id: key, name: el[key] }
      //       itemList.push(obj)
      //     }
      //   })
      //   this.itemList = itemList
      // })
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        productId: null,
        orderId: null,
        equipmentId: null,
        createTime: null,
        detect01: null,
        outOk01: null,
        detect02: null,
        outOk02: null,
        detect03: null,
        outOk03: null,
        detect04: null,
        outOk04: null,
        detect05: null,
        outOk05: null,
        detect06: null,
        outOk06: null,
        detect07: null,
        outOk07: null,
        detect08: null,
        outOk08: null,
        detect09: null,
        outOk09: null,
        detect10: null,
        outOk10: null,
        detect11: null,
        outOk11: null,
        detect12: null,
        outOk12: null,
        detect13: null,
        outOk13: null,
        detect14: null,
        outOk14: null,
        detect15: null,
        outOk15: null,
        detect16: null,
        outOk16: null,
        detect17: null,
        outOk17: null,
        detect18: null,
        outOk18: null,
        detect19: null,
        outOk19: null,
        detect20: null,
        outOk20: null,
        detect21: null,
        outOk21: null,
        detect22: null,
        outOk22: null,
        detect23: null,
        outOk23: null,
        detect24: null,
        outOk24: null,
        detect25: null,
        outOk25: null,
        detect26: null,
        outOk26: null,
        detect27: null,
        outOk27: null,
        detect28: null,
        outOk28: null
      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.detectionrecordList.analysisData = []
      this.productShow = false
      this.itemShow = false
      this.daterangeCreateTime = []
      this.resetForm('queryForm')
      // this.handleQuery();
    },
    initOption1() {
      // var _this = this
      this.option1 = {
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
          data: []
        },
        yAxis: {
          type: 'value',
          splitLine: { show: false }
        },
        series: [
          {
            data: [],
            type: 'line',
            markLine: {
              itemStyle: {
                normal: { lineStyle: { color: '#2C962C' }, label: { show: true, position: 'end' }}
              },
              data: [
                { type: 'average', name: '平均值' },
                { name: '上限值', yAxis: 20 },
                { name: '下限值', yAxis: 5 }
              ]
            }
          }
        ]
      }
    },
    initOption2() {
      this.option2 = {
        // Echarts 图 -- x 坐标轴刻度 -- 正态分布数值
        tooltip: {},
        // Echarts 图 -- 图例
        legend: {
          data: ['f(x)']
        },
        grid: {
          left: '0',
          right: '1%',
          bottom: '3%',
          top: '30',
          containLabel: true
        },
        xAxis: [
          {
            // name : "标准刻度(0.1)",
            data: this.dataAfterCleanX
            // min: this.min,
            // max: this.max
          }
        ],
        // Echarts 图 -- y 坐标轴刻度
        yAxis: [
          {
            type: 'value',
            name: '频数',
            position: 'left',
            // 网格线
            splitLine: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#333'
              }
            },
            axisLabel: {
              formatter: '{value}'
            }
          },
          {
            type: 'value',
            name: '概率',
            position: 'right',
            // 网格线
            splitLine: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#333'
              }
            },
            axisLabel: {
              formatter: '{value}'
            }
          }
        ],
        // Echarts 图 -- y 轴数据
        series: [
          {
            name: '源数据', // y 轴名称
            type: 'bar', // y 轴类型
            yAxisIndex: 0,
            barGap: 0,
            barWidth: 27,
            itemStyle: {
              normal: {
                show: true,
                color: '#6CAFAA', // 柱子颜色
                borderColor: '#009688' // 边框颜色
              }
            },
            data: this.dataAfterCleanY // y 轴数据 -- 源数据
          },
          {
            name: '正态分布', // y 轴名称
            type: 'line', // y 轴类型
            symbol: 'none', // 去掉折线图中的节点
            smooth: true, // true 为平滑曲线
            yAxisIndex: 1,
            data: this.normalDistribution, // y 轴数据 -- 正态分布
            // 警示线
            markLine: {
              symbol: ['none'], // 箭头方向
              lineStyle: {
                type: 'silent',
                color: 'green'
              },
              itemStyle: {
                normal: {
                  show: true,
                  color: 'black'
                }
              },
              label: {
                show: true,
                position: 'middle'
              },
              data: [
                {
                  name: '一倍标准差',
                  xAxis: this.standarDevRangeOfOne.low.toFixed(1),
                  // 当 n 倍标准差在坐标轴外时，将其隐藏，否则它会默认显示在最小值部分，容易引起混淆
                  lineStyle: {
                    opacity: this.min > this.standarDevRangeOfOne.low ? 0 : 1
                  },
                  label: {
                    show: !(this.min > this.standarDevRangeOfOne.low)
                  }
                },
                {
                  name: '一倍标准差',
                  xAxis: this.standarDevRangeOfOne.up.toFixed(1),
                  lineStyle: {
                    opacity: this.max < this.standarDevRangeOfOne.up ? 0 : 1
                  },
                  label: {
                    show: !(this.max < this.standarDevRangeOfOne.up)
                  }
                },
                {
                  name: '二倍标准差',
                  xAxis: this.standarDevRangeOfTwo.low.toFixed(1),
                  lineStyle: {
                    opacity: this.min > this.standarDevRangeOfTwo.low ? 0 : 1
                  },
                  label: {
                    show: !(this.min > this.standarDevRangeOfTwo.low)
                  }
                },
                {
                  name: '二倍标准差',
                  xAxis: this.standarDevRangeOfTwo.up.toFixed(1),
                  lineStyle: {
                    opacity: this.max < this.standarDevRangeOfTwo.up ? 0 : 1
                  },
                  label: {
                    show: !(this.max < this.standarDevRangeOfTwo.up)
                  }
                },
                {
                  name: '三倍标准差',
                  xAxis: this.standarDevRangeOfThree.low.toFixed(1),
                  lineStyle: {
                    opacity: this.min > this.standarDevRangeOfThree.low ? 0 : 1
                  },
                  label: {
                    show: !(this.min > this.standarDevRangeOfThree.low)
                  }
                },
                {
                  name: '三倍标准差',
                  xAxis: this.standarDevRangeOfThree.up.toFixed(1),
                  lineStyle: {
                    opacity: this.max < this.standarDevRangeOfThree.up ? 0 : 1
                  },
                  label: {
                    show: !(this.max < this.standarDevRangeOfThree.up)
                  }
                },
                {
                  name: '平均值',
                  // type: 'average',
                  xAxis: this.average.toFixed(1),
                  lineStyle: {
                    color: '#009688'
                  }
                }
              ]
            }
          }
        ]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container{
  // background: #F8F8F9;
}
</style>
