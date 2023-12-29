
<template>
  <div class="app-container">
    <el-card shadow="never" class="card multiple">
      <el-form ref="queryForm" :model="queryParams" :inline="true">
        <el-form-item prop="lineId">
          <el-select v-model="queryParams.lineId" filterable size="small" style="width: 180px;" placeholder="产线名称">
            <el-option v-for="(item,index) in lineLists" :key="index" :label="item.lineName" :value="item.lineId" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <start-date v-model="queryParams.startTime" />
          <end-date v-model="queryParams.endTime" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <div class="chart-container">
      <chars-bar height="100%" width="100%" :chart-data="detect" title="不合格设备" />
    </div>
  </div>

</template>

<script>
import CharsBar from '@/views/dzCpk/components/charsBar.vue'
import { listDevice } from '@/api/dzCpk/unqualified'
import { getlineSelect } from '@/api/commens'

export default {
  name: 'UnqualifiedEquipment',
  components: { CharsBar },
  data() {
    return {
      queryParams: {
        lineNo: undefined,
        startTime: undefined,
        endTime: undefined
      },
      lineLists: undefined, // 产线列表
      detect: {
        detectName: [],
        detectSum: []
      }
    }
  },
  mounted() {
    this.handleLine()
  },
  methods: {
    getList() {
      listDevice(this.queryParams).then(r => {
        this.detect.detectName = r.data.detectName
        this.detect.detectSum = r.data.detectSum
      })
    },
    // 获取产线列表
    handleLine() {
      getlineSelect().then(res => {
        this.lineLists = res.data
      }).catch(() => {
        this.loading = false
      })
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.lineList = undefined
      this.detect.detectName = []
      this.detect.detectSum = []
      this.resetForm('queryForm')
    }
  }
}
</script>

<style scoped>
.chart-container{
  position: relative;
  width: 100%;
  height: calc(100vh - 270px);
}
</style>
