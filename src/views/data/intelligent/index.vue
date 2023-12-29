<template>
  <div class="dashboard-editor-container">
    <!-- 头部筛选 -->
    <el-card shadow="never" class="card">
      <el-form ref="queryForm" :inline="true" :model="queryParams">
        <el-form-item prop="lineId">
          <el-select v-model="queryParams.lineId" size="small" style="width: 180px;" placeholder="产线名称" @change="changeLine">
            <el-option v-for="(item,index) in lineLists" :key="index" :label="item.lineName" :value="item.lineId" />
          </el-select>
        </el-form-item>
        <el-form-item prop="productName">
          <el-select v-model="queryParams.productName" placeholder="请选择产品" size="small" style="width: 180px;">
            <el-option
              v-for="(item,index) in workpieceLists"
              :key="index"
              :label="item.productName"
              :value="item.productName"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="producBarcode">
          <el-input v-model="queryParams.producBarcode" size="small" clearable placeholder="请输入工件二维码" style="width: 240px;" />
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="queryParams.newDate"
            type="date"
            size="small"
            style="width: 180px"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
          />
          <!--          <start-date v-model="queryParams.newDate" placeholder="日期" />-->
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <div class="box-wrapper-one">
      <el-row :gutter="20" style="height: 100%">
        <el-col :span="7" style="height: 100%">
          <div style="height: 100%;" class="l-flex l-flex-col l-row-between">
            <el-card v-loading="loading" style="height: 48.5%;" class="left-top">
              <div v-if="panelList.length > 0" class="left-top-box">
                <div v-for="(item,index) in panelList" :key="index" class="box-item">
                  <!--                  <div class="box-item-left">-->
                  <!--                    <span style="font-weight: 700">{{ item.name }}</span>-->
                  <!--                    <span>: </span>-->
                  <!--                  </div>-->
                  <!--                  <div class="box-item-right">-->
                  <!--                    <span style="font-size: 14px;margin-left: 10px">{{ item.value | statusFormat }}</span>-->
                  <!--                  </div>-->
                  <span style="font-weight: 700">{{ item.name }}</span>
                  <span>: </span>
                  <span style="font-size: 14px;margin-left: 10px">{{ item.value | statusFormat }}</span>
                </div>
              </div>
              <div v-else style="height: 100%;color: #909399;font-size: 14px" class="l-flex l-col-center l-row-center">暂无数据</div>
            </el-card>

            <el-card v-loading="loading" style="height: 48.5%;" class="l-flex l-col-center l-row-center">
              <el-image
                v-if="myImg"
                style="width: 100%; height: 100%"
                :src="myImg"
                fit="cover"
                :preview-src-list="[myImg]"
              />
              <!--              <img v-if="myImg" :src="myImg" alt="" style="width: 100%;">-->
              <div v-else style="height: 100%;color: #909399;font-size: 14px;">暂无数据</div>
            </el-card>
          </div>
        </el-col>

        <el-col :span="7" style="height: 100%">
          <div ref="tableCard" style="height: 100%;">
            <el-card style="height: 100%;">
              <el-table
                v-loading="loading"
                :data="tableData"
                :span-method="objectSpanMethod"
                :height="heightOffset"
                border
                style="width: 100%;"
              >
                <el-table-column
                  prop="testItemName"
                  label="检测项"
                  align="center"
                />
                <el-table-column
                  prop="detectValue"
                  label="标准值/检测值"
                  align="center"
                />
                <el-table-column
                  prop="outOk"
                  label="检测结果"
                  align="center"
                >
                  <template slot-scope="scope">
                    <span :style="{ color: scope.row.outOk === 0 ? 'red' : '' }">{{ scope.row.outOk | statusFormat }}</span>
                  </template>
                </el-table-column>
              </el-table>
              <!--              <div style="height: 100%;" />-->
            </el-card>
          </div>
        </el-col>
        <el-col v-loading="loading" :span="10" style="height: 100%">
          <el-scrollbar v-if="lineChartData.length > 0" wrap-class="scrollbar-wrapper" style="height: 100%;">
            <el-card v-for="(item,index) in lineChartData" :key="index" class="box-wrapper">
              <zt-chart :chart-data="item" />
            </el-card>
          </el-scrollbar>
          <div v-else style="height: 100%;">
            <el-card class="empty" style="height: 100%">
              <div style="height: 100%;color: #909399;font-size: 14px" class="l-flex l-col-center l-row-center">暂无数据</div>
            </el-card>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import ztChart from '../components/ztChart'
import { getlineSelect, getOrderWorkpiece } from '@/api/commens'
import { getIntelligent } from '@/api/data/intelligent'
export default {
  name: 'Intelligent',
  components: { ztChart },
  filters: {
    statusFormat(val) {
      const obj = {
        0: 'NG',
        1: 'OK'
      }
      return typeof val === 'number' ? obj[val] : val
    }
  },
  data() {
    return {
      loading: true,
      height: 0,
      spanArr: [], // 用于存放每一行记录的合并数
      lineLists: [], // 产线列表
      queryParams: { // 查询信息
        lineId: undefined,
        productName: undefined,
        producBarcode: undefined,
        newDate: undefined
      },
      panelList: [],
      tableData: [],
      lineChartData: [],
      workpieceLists: [],
      myImg: undefined
    }
  },
  computed: {
    heightOffset() {
      return this.height - 40
    }
  },
  async mounted() {
    this.$nextTick(() => {
      this.height = this.$refs.tableCard.offsetHeight
    });
    [this.queryParams.newDate] = this.getToday()
    await this.handleLines()
    await this.getList()
  },
  methods: {
    // 获取产线列表
    handleLines() {
      return new Promise((resolve, reject) => {
        getlineSelect().then((res) => {
          this.lineLists = res.data
          this.queryParams.lineId = this.lineLists[0].lineId
          const data = {
            lineType: this.lineLists[0].lineType || undefined
          }
          this.handleWorkpiec(data)
          resolve('')
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取走势图数据
    getList() {
      this.loading = true
      return new Promise((resolve, reject) => {
        const obj = JSON.parse(JSON.stringify(this.queryParams))
        if (obj.productName) {
          obj.productName = obj.productName.substr(0, obj.productName.indexOf('-'))
        }
        getIntelligent(obj).then((response) => {
          this.panelList = []
          this.tableData = response.data.testItemResult
          this.lineChartData = response.data.dzWorkpieceList
          const data = response.data.dzWorkpieceData

          if (data) {
            this.myImg = data.img
            this.panelList = [
              { name: '产品名称', value: data.productName },
              { name: '生产订单', value: data.wipOrderNo },
              { name: '工件二维码', value: data.producBarcode },
              { name: '物料号', value: data.syProductNo },
              { name: '检测时间', value: data.detectorTime },
              { name: '检测结果', value: data.outOk }
            ]
          }
          this.getSpanArr(this.tableData)
          this.loading = false
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 产线下拉框变化值
    changeLine(id) {
      this.queryParams.productName = undefined
      const arr = this.lineLists.filter(t => t.lineId === id)
      const data = {
        lineType: arr[0].lineType || undefined
      }
      this.handleWorkpiec(data)
    },
    // 获取工件列表(产品)
    handleWorkpiec(data) {
      getOrderWorkpiece(data).then(res => {
        this.workpieceLists = res.data
      }).catch(() => {
        this.loading = false
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
          if (data[i].testItemName === data[i - 1].testItemName) {
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
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.panelList = []
      this.myImg = undefined;
      [this.queryParams.newDate] = this.getToday()
      this.queryParams.lineId = this.lineLists[0].lineId
      this.handleQuery()
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 20px;
  height: calc(100vh - 102px);
  //background-color: rgb(240, 242, 245);
}
.box-wrapper-one {
  height: calc(100% - 100px);
  border-radius: 4px;
  //border: 1px solid #EBEEF5;
  overflow: hidden;
  margin-top: 20px;
}
.box-wrapper {
  height: 210px;
  margin-bottom: 20px;
  //height: 100%;
  //border-radius: 4px;
  ////border: 1px solid #EBEEF5;
  ////background-color: #FFF;
  //overflow: hidden;
  //color: #303133;
  //padding: 20px;
  //.top {
  //  padding-bottom: 10px;
  //}
  //.emitBtn {
  //  margin-right: 10px;
  //}
}
.card-panel {
  height: 70px;
  width: 19%;
  cursor: pointer;
  font-size: 12px;
  position: relative;
  overflow: hidden;
  color: #666;
  background: #fff;
  box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
  border-color: rgba(0, 0, 0, .05);

  .card-panel-description {
    font-weight: bold;
    //margin: 26px;
    margin-left: 0px;

    .card-panel-text {
      line-height: 70px;
      color: rgba(0, 0, 0, 0.45);
      font-size: 16px;
      text-align: center;
      margin-bottom: 12px;
    }
    .card-panel-num {
      font-size: 20px;
    }
  }
}
//  background: red;
.left-top ::v-deep .el-card__body {
    height: 100% !important;
  }
.box-wrapper ::v-deep .el-card__body {
  height: 100% !important;
}
.empty ::v-deep .el-card__body {
  height: 100% !important;
}
.left-top-box {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  //border: 1px solid #EBEEF5;
}
.box-item {
  height: 16.667%;
  display: flex;
  align-items: center;
  color: #606266;
  padding-left: 20px;
  justify-content: flex-start;
  border-bottom: 1px solid #EBEEF5;
}
.box-item-left {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 35%;
  height: 100%
}
.box-item-right {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 65%;
  height: 100%
}
</style>
