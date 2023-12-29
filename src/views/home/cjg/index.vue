<template>
  <div class="app-container">
    <div class="l-flex l-row-between">
      <div class="alarm">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>告警日志</span>
          </div>
          <div style="padding: 10px">
            <el-table
              v-loading="alarmLoading"
              height="740"
              :data="alarmList"
              style="width: 100%"
            >
              <el-table-column
                prop="deviceCode"
                label="告警编号"
              />
              <el-table-column
                prop="message"
                label="告警内容"
                min-width="500"
              />
            </el-table>
            <!--            <dz-table-->
            <!--              v-loading="alarmLoading"-->
            <!--              height="740"-->
            <!--              :column="alarmColumn"-->
            <!--              :data="alarmList"-->
            <!--            />-->
          </div>
        </el-card>
      </div>
      <div class="mom">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>MOM通信日志</span>
          </div>
          <div style="padding: 10px">
            <!--            <dz-table-->
            <!--              v-loading="momLoading"-->
            <!--              height="740"-->
            <!--              :column="momColumn"-->
            <!--              :data="momList"-->
            <!--            />-->
            <el-table
              v-loading="momLoading"
              height="740"
              :data="momList"
              style="width: 100%"
            >
              <el-table-column
                prop="businessType"
                label="业务类型"
              />
              <el-table-column
                prop="resultState"
                label="处理结果"
              />
              <el-table-column
                prop="responseContent"
                label="响应内容"
                min-width="500"
              />
              <el-table-column
                prop="createTime"
                label="时间"
                min-width="160"
              />
            </el-table>
          </div>
        </el-card>
      </div>
      <div class="other">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>其他日志</span>
          </div>
          <div style="padding: 10px">
            <!--            <dz-table-->
            <!--              v-loading="otherLoading"-->
            <!--              height="740"-->
            <!--              :column="otherColumn"-->
            <!--              :data="otherList"-->
            <!--            />-->
            <el-table
              v-loading="otherLoading"
              height="740"
              :data="otherList"
              style="width: 100%"
            >
              <el-table-column
                prop="businessType"
                label="业务类型"
              />
              <el-table-column
                prop="state"
                label="处理结果"
              />
              <el-table-column
                prop="throwMsg"
                label="响应内容"
                min-width="500"
              />
            </el-table>
          </div>
        </el-card>
      </div>
    </div>

  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import { getOrderSelect } from '@/api/commens'
import { listAlarm, listMom } from '@/api/home/home'

export default {
  name: 'Cjg',
  data() {
    return {
      alarmLoading: false,
      momLoading: false,
      otherLoading: false,
      alarmList: [],
      momList: [],
      otherList: [],
      alarmColumn: [
        { label: '告警编号', prop: 'deviceCode', disableSort: true },
        { label: '告警内容', prop: 'message', disableSort: true, minWidth: 500, showOverflowTooltip: false }
      ],
      momColumn: [
        { label: '业务类型', prop: 'businessType', disableSort: true, width: 100 },
        { label: '处理结果', prop: 'resultState', disableSort: true, width: 100 },
        { label: '响应内容', prop: 'responseContent', disableSort: true },
        { label: '时间', prop: 'createTime', disableSort: true }
      ],
      otherColumn: [
        { label: '业务类型', prop: 'businessType', disableSort: true, width: 120 },
        { label: '处理结果', prop: 'state', disableSort: true, width: 120 },
        { label: '响应内容', prop: 'throwMsg', disableSort: true }
      ],
      queryParams: { // 查询信息
        orderId: undefined // 订单编号
      }
    }
  },
  async mounted() {
    await this.getOrderList()
    await this.getAlarmList()
    await this.getMomList()
  },
  methods: {
    getOrderList() {
      return new Promise((resolve, reject) => {
        getOrderSelect().then(response => {
          const { data } = response
          this.queryParams.orderId = data[0].orderId
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    getAlarmList() {
      this.alarmLoading = true
      listAlarm(this.queryParams.orderId).then(r => {
        this.alarmList = r.data
        this.alarmLoading = false
      })
    },
    getMomList() {
      this.momLoading = true
      listMom().then(r => {
        this.momList = r.data.momTcpDo.list
        this.otherList = r.data.dzicsInsidDo.list
        this.momLoading = false
      })
    }

  }
}
</script>

<style scoped lang="scss">
.alarm {
  background: #ccc;
  width: 30%;
}
.mom {
  background: #ffab91;
  width: 35%;
}
.other {
  background: pink;
  width: 33%;
}

</style>
