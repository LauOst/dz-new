<template>
  <div class="app-container">
    <el-card shadow="never" class="card">
      <el-form ref="queryForm" :model="queryParams" :inline="true">
        <el-form-item prop="equipmentCode">
          <el-input
            v-model="queryParams.equipmentCode"
            placeholder="设备编号"
            clearable
            size="small"
            style="width: 180px"
          />
        </el-form-item>
        <el-form-item prop="programName">
          <el-input
            v-model="queryParams.programName"
            placeholder="主程序号"
            clearable
            size="small"
            style="width: 180px"
          />
        </el-form-item>
        <el-form-item prop="dncResponse">
          <el-input
            v-model="queryParams.dncResponse"
            placeholder="响应内容"
            clearable
            size="small"
            style="width: 180px"
          />
        </el-form-item>

        <el-form-item prop="state">
          <el-select
            v-model="queryParams.state"
            placeholder="处理结果"
            clearable
            size="small"
            style="width: 180px"
          >
            <el-option
              v-for="dict in stateList"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <!--          <start-date v-model="queryParams.startTime" />-->
          <start-date v-model="queryParams.startTime" :type="'datetime'" placeholder="开始时间" :value-format="'yyyy-MM-dd HH:mm:ss'" width="200px" />
          <end-date v-model="queryParams.endTime" :type="'datetime'" placeholder="结束时间" :value-format="'yyyy-MM-dd HH:mm:ss'" width="200px" />
          <!--          <end-date v-model="queryParams.endTime" />-->
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
          <el-button v-hasPermi="['record:dncCommunication:excel']" :loading="btnLoading" type="warning" icon="el-icon-download" size="small" @click="handleExport">导出</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <dz-table
      v-loading="loading"
      :column="column"
      :data="list"
    />
  </div>
</template>

<script>
import { dncCommunicatLog } from '@/api/record/log'
import { downloadDnc } from '@/api/excel/excel'

export default {
  name: 'DncCommunication',
  data() {
    return {
      // 分页搜索参数
      queryParams: {
        page: 1,
        limit: 20,
        equipmentCode: undefined,
        programName: undefined,
        dncResponse: undefined,
        state: undefined,
        startTime: undefined,
        endTime: undefined,
        field: undefined,
        type: undefined
      },
      // 表格信息
      column: [
        { type: 'index', index: this.indexMethod },
        { label: '设备编号', prop: 'equipmentCode' },
        { label: '主程序号', prop: 'programName' },
        { label: '处理结果', render: (h, scope) => {
          return (
            <el-tag size='small' type={ scope.row.state === '0' ? 'success' : 'danger' }>{ this.resultStateFormat(scope.row) }</el-tag>
          )
        } },
        { label: '响应内容', prop: 'dncResponse' },
        { label: '请求时间', prop: 'createTime' }
      ],
      loading: false,
      btnLoading: false,
      list: [],
      stateList: [
        { label: '成功', value: '0' },
        { label: '失败', value: '1' }
      ]
    }
  },
  mounted() {
    [this.queryParams.model.startTime, this.queryParams.model.endTime] = this.getMonthWeeks()
    this.getList()
  },
  methods: {
    // 格式化序号
    indexMethod(index) {
      return (this.queryParams.page - 1) * this.queryParams.limit + index + 1
    },
    /** 查询列表 */
    getList() {
      this.loading = true
      dncCommunicatLog(this.queryParams).then(
        response => {
          this.list = response.data
          this.total = response.count
          this.loading = false
        }
      ).catch(() => {
        this.loading = false
      })
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.$refs.queryForm.validate((valid) => {
        if (valid) {
          this.queryParams.page = 1
          this.getList()
        }
      })
    },
    /** 重置按钮操作 */
    async resetQuery() {
      // this.dateRange = []
      await this.resetForm('queryForm')
      await this.handleQuery()
    },
    // 导出按钮
    handleExport() {
      this.btnLoading = true
      downloadDnc(this.queryParams).then((res) => {
        this.btnLoading = false
        if (!res.data) return
        this.$downloadFunc(res)
      }).catch((err) => {
        console.log('err', err)
        this.btnLoading = false
      })
    },
    // 状态格式化
    typeFormat(row) {
      const obj = {
        '101': '叫料',
        '102': '叫空框',
        '103': '满料拖出',
        '104': '空框拖出',
        '105': '报工',
        '106': '查询料框信息'
      }
      return obj[row.businessType]
    },
    resultStateFormat(row) {
      const obj = {
        '0': '成功',
        '1': '失败'
      }
      return obj[row.resultState]
    }
  }
}
</script>

<style scoped>

</style>
