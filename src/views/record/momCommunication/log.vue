<template>
  <div class="app-container">
    <el-card shadow="never" class="card">
      <el-form ref="queryForm" :model="queryParams" :inline="true">
        <el-form-item prop="businessType">
          <el-select
            v-model="queryParams.businessType"
            placeholder="业务类型"
            clearable
            size="small"
            style="width: 180px"
          >
            <el-option
              v-for="dict in businessTypeList"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="requestContent">
          <el-input
            v-model="queryParams.requestContent"
            placeholder="请求内容"
            clearable
            size="small"
            style="width: 180px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
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
import { momCommunicatLog } from '@/api/record/log'

export default {
  name: 'MomCommunication',
  data() {
    return {
      // 分页搜索参数
      queryParams: {
        page: 1,
        limit: 20,
        businessType: undefined,
        requestContent: undefined,
        field: undefined,
        type: undefined
      },
      // 表格信息
      column: [
        { type: 'index', index: this.indexMethod },
        { label: '业务类型', prop: 'businessType', formatter: this.typeFormat },
        { label: '处理结果', render: (h, scope) => {
          return (
            <el-tag size='small' type={ scope.row.resultState === '0' ? 'success' : 'danger' }>{ this.resultStateFormat(scope.row) }</el-tag>
          )
        } },
        { label: '请求内容', prop: 'requestContent' },
        { label: '响应内容', prop: 'responseContent' }
      ],
      loading: false,
      list: [],
      businessTypeList: [
        { label: '叫料', value: '101' },
        { label: '叫空框', value: '102' },
        { label: '满料拖出', value: '103' },
        { label: '空框拖出', value: '104' },
        { label: '报工', value: '105' },
        { label: '查询料框信息', value: '106' }
      ]
    }
  },
  mounted() {
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
      momCommunicatLog(this.queryParams).then(
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
