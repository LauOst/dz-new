<template>
  <div class="chart-container">
    <div class="top">
      <div class="left">
        <div class="l-card">
          <div class="item-info h-100">
            <el-descriptions :column="1" border size="small" :label-style="labelStyle">
              <el-descriptions-item label="产品名称">{{ dzWorkpieceData.productName || '&#45;&#45;' }}</el-descriptions-item>
              <el-descriptions-item label="生产订单号">{{ dzWorkpieceData.orderNo || '&#45;&#45;' }}</el-descriptions-item>
              <el-descriptions-item label="工件二维码">{{ dzWorkpieceData.qrCode || '&#45;&#45;' }}</el-descriptions-item>
              <el-descriptions-item label="物料号">{{ dzWorkpieceData.syProductNo || '&#45;&#45;' }}</el-descriptions-item>
              <el-descriptions-item label="检测时间">{{ dzWorkpieceData.checkDate || '&#45;&#45;' }}</el-descriptions-item>
              <el-descriptions-item label="检测结果">
                <el-tag :type="dzWorkpieceData.outOk === 0 ? 'danger' : 'success' " size="small"> {{ dzWorkpieceData.outOk | statusFormat }} </el-tag>
              </el-descriptions-item>
            </el-descriptions>
            <!--            <div class="item-info-text">产品名称: {{ dzWorkpieceData.productName || '&#45;&#45;' }}</div>-->
            <!--            <div class="item-info-text">生产订单号: {{ dzWorkpieceData.wipOrderNo || '&#45;&#45;' }}</div>-->
            <!--            <div class="item-info-text">工件二维码: {{ dzWorkpieceData.producBarcode || '&#45;&#45;' }}</div>-->
            <!--            <div class="item-info-text">物料号: {{ dzWorkpieceData.syProductNo || '&#45;&#45;' }}</div>-->
            <!--            <div class="item-info-text">检测时间: {{ dzWorkpieceData.detectorTime || '&#45;&#45;' }}</div>-->
            <!--            <div class="item-info-text">检测结果: <span :style="{ color: dzWorkpieceData.outOk === 0 ? 'red' : '' }"> {{ dzWorkpieceData.outOk | statusFormat }}</span></div>-->
          </div>
        </div>
      </div>
      <div class="right">
        <div class="l-card">
          <div class="w-100 h-100 l-flex l-row-center l-col-center">
            <img v-if="dzWorkpieceImg" :src="dzWorkpieceImg" alt="" style="height: 100%;width: 80%">
          </div>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="l-card">
        <div class="w-100 h-100 chart-box-wrapper" style="box-sizing: border-box">
          <div ref="tableCard" class="chart-box">
            <el-table
              :data="tb1"
              :span-method="objectSpanMethod"
              :height="heightOffset"
              border
              style="width: 100%;"
              :header-cell-style="herderStyle"
              :row-style="{height: (heightOffset - 32)/8 + 'px'}"
            >
              <el-table-column
                prop="tableColCon"
                label="检测项"
                align="center"
                width="70"
              />
              <el-table-column
                prop="comValue"
                label="检测值/标准值"
                align="center"
                width="120"
              />
              <el-table-column
                prop="outOk"
                label="检测结果"
                align="center"
                width="80"
              >
                <template slot-scope="scope">
                  <span :style="{ color: scope.row.outOk === 0 ? 'red' : '#67c23a' }">{{ scope.row.outOk | statusFormat }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="折线图"
                align="center"
              >
                <template slot-scope="scope">
                  <zt-chart :chart-data="scope.row.data" :height="(heightOffset - 35)/4 + 'px'" :carousel-key="carouselKey" />
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div ref="tableCard" class="chart-box">
            <el-table
              :data="tb2"
              :span-method="objectSpanMethod"
              :height="heightOffset"
              border
              style="width: 100%;"
              :row-style="{height: (heightOffset - 32)/8 + 'px'}"
            >
              <el-table-column
                prop="tableColCon"
                label="检测项"
                align="center"
                width="70"
              />
              <el-table-column
                prop="comValue"
                label="检测值/标准值"
                align="center"
                width="120"
              />
              <el-table-column
                prop="outOk"
                label="检测结果"
                align="center"
                :width="80"
              >
                <template slot-scope="scope">
                  <span :style="{ color: scope.row.outOk === 0 ? 'red' : '#67c23a' }">{{ scope.row.outOk | statusFormat }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="折线图"
                align="center"
              >
                <template slot-scope="scope">
                  <zt-chart :chart-data="scope.row.data" :height="(heightOffset - 35)/4 + 'px'" :carousel-key="carouselKey" />
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div></div></div></template>
<script>

import { listDetection } from '@/api/dzCpk/detection'
import ZtChart from '../components/ztChart.vue'

export default {
  name: 'Detection',
  filters: {
    statusFormat(val) {
      const obj = {
        0: 'NG',
        1: 'OK'
      }
      return typeof val === 'number' ? obj[val] : val || '--'
    }
  },
  components: { ZtChart },
  data() {
    return {
      queryParams: {
        orderNo: 'DZ-2094',
        lineNo: '1',
        productNo: '01'
      },
      herderStyle: {
        fontSize: '14px'
      },
      height: 0,
      tableData: [{
        comValue: 0,
        outOk: 0,
        tableColCon: '长'
      }, {
        comValue: 0,
        outOk: 0,
        tableColCon: '长'
      },
      {
        comValue: 0,
        outOk: 0,
        tableColCon: '螺纹大径'
      }, {
        comValue: 0,
        outOk: 0,
        tableColCon: '螺纹大径'
      },
      {
        comValue: 0,
        outOk: 0,
        tableColCon: '螺纹小径'
      }, {
        comValue: 0,
        outOk: 0,
        tableColCon: '螺纹小径'
      },
      {
        comValue: 0,
        outOk: 0,
        tableColCon: '螺间距'
      }, {
        comValue: 0,
        outOk: 0,
        tableColCon: '螺间距'
      }],
      tb1: [],
      tb2: [],
      carouselKey: 1, // 更新图表的key值
      dzWorkpieceData: {},
      dzWorkpieceImg: undefined,
      inteligenceData: {},
      detect: {
        detectName: [],
        detectSum: []
      },
      testList: [

      ],
      labelStyle: {
        color: '#333',
        width: '120px',
        fontSize: '14px',
        fontWeight: '700'
      }
    }
  },
  computed: {
    heightOffset() {
      return this.height - 1
    }
  },
  created() {
    this.clientWidth = document.body.clientWidth // 屏幕宽度
    this.getSpanArr(this.tableData)
  },
  mounted() {
    this.$nextTick(() => {
      this.height = this.$refs.tableCard.offsetHeight
    })
    this.getList()
  },
  methods: {
    getList() {
      listDetection(this.queryParams).then(res => {
        const val = res.data
        this.dzWorkpieceImg = val.img
        this.reset(val)
        // if (val && val.dataDto) {
        //   this.dzWorkpieceData = val.dataDto
        //   const dzList = JSON.parse(JSON.stringify(val.vos))
        //   if (dzList) {
        //     this.tableData = dzList
        //   }
        //   // const list = val.vos
        // }
        // this.dzWorkpieceData = res.data.dataDto
        // this.inteligenceData = res.data.vos
      })
    },
    getSpanArr(data) {
      this.spanArr = []
      if (!data) return
      // data就是我们从后台拿到的数据
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          this.spanArr.push(1)
          this.pos = 0
        } else {
          // 判断当前元素与上一个元素是否相同
          if (data[i].tableColCon === data[i - 1].tableColCon) {
            this.spanArr[this.pos] += 1
            this.spanArr.push(0)
          } else {
            this.spanArr.push(1)
            this.pos = i
          }
        }
      }
    },

    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex !== 1) {
        const _row = this.spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          // [0,0] 表示这一行不显示， [2,1]表示行的合并数
          rowspan: _row,
          colspan: _col
        }
      }
    },
    reset(val) {
      this.tb1 = []
      this.tb2 = []
      if (val && val.dataDto) {
        this.dzWorkpieceData = val.dataDto

        const list = val.vos
        const dzWorkpieceList = val.list
        const dzList = JSON.parse(JSON.stringify(list))
        // console.log('val', dzList)
        if (dzList && dzWorkpieceList) {
          dzList.forEach(item => {
            dzWorkpieceList.forEach(items => {
              if (item.tableColCon === items.title) {
                item.data = items
              }
            })
          })
          if (dzList.length > 16) {
            this.tableData = dzList.slice(0, 16)
          } else {
            this.tableData = dzList
          }
          if (this.tableData.length > 8) {
            this.tableData.map((item, index) => {
              if (item.comValue === 9999.999) {
                item.comValue = 0
              }
              if (index < 8) {
                this.tb1.push(item)
              } else {
                this.tb2.push(item)
              }
            })
          } else {
            this.tb1 = this.tableData
            this.tb2 = []
          }
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.item-info ::v-deep .el-descriptions-item__cell {
  line-height: 1.3!important;
  //height: 16% !important;
}
//.item-info ::v-deep .el-descriptions {
//  height: 100% !important;
//  background: #ccc;
//}
.chart-container{
  position: relative;
  width: 100%;
  height: calc(100vh - 102px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
  background: rgb(245, 250, 252);
}
.top {
  height: 30%;
  display: flex;
  justify-content: space-between;
  .left {
    width: 30%;
    height: 100%;
  }
  .right {
    width: 68%;
    height: 100%;
  }
}
.content {
  height: 68%;
}
.l-card {
  height: 100%;
  background: rgb(255,255,255);
  color: rgba(0,0,0, .87);
  overflow: hidden;
  border-radius: 4px;
  padding: 20px;

}
ul,li{ padding:0;margin:0;list-style:none}
.chart-box-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.chart-box {
  width: 49.5%;
  height: 100%;
  //background: #ccc;
  //border: 1px solid #EBEEF5;
  //border: 1px solid #ddd;
}
</style>
