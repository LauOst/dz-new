<template>
  <div class="app-container">
    <!-- 头部筛选 -->
    <el-card shadow="never" class="card">
      <el-form ref="queryForm" :inline="true" :model="queryParams">
        <el-form-item v-hasShow prop="wipOrderNo">
          <el-input v-model="queryParams.wipOrderNo" size="small" clearable placeholder="订单编号" style="width: 180px;" />
        </el-form-item>
        <el-form-item prop="materialCode">
          <el-input v-model="queryParams.materialCode" size="small" clearable placeholder="工件编号" style="width: 180px;" />
        </el-form-item>
        <el-form-item prop="machineCode">
          <el-input v-model="queryParams.machineCode" size="small" clearable placeholder="设备编号" style="width: 180px;" />
        </el-form-item>
        <el-form-item prop="state">
          <el-select v-model="queryParams.state" size="small" style="width: 180px;" placeholder="状态">
            <el-option label="全部" :value="''" />
            <el-option v-for="(item,index) in stateList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 表格信息 -->
    <dz-table
      v-loading="loading"
      :column="column"
      :data="list"
      :total="total"
      pagination
      :page.sync="queryParams.page"
      :limit.sync="queryParams.limit"
      @pagination="getList"
      @sortChange="sortChange"
    />
  </div>
</template>

<script>
// import axios from 'axios'
import { cancelDncProgram, dncProgramList, inputDncProgram, updateDncProgram } from '@/api/mom/dnc'
import { mapGetters } from 'vuex'
import { getlineSelect, getOrderWorkpiece } from '@/api/commens'

export default {
  name: 'Dnc',
  data() {
    return {
      column: [
        { type: 'index', index: this.indexMethod },
        { label: '订单编号', prop: 'wipOrderNo' },
        { label: '产线名称', prop: 'lineName' },
        { label: '工件编号', prop: 'materialCode' },
        { label: '设备编号', prop: 'machineCode' },
        { label: '工序号', prop: 'workingProcedure' },
        { label: '顺序号', prop: 'sequencenumber' },
        {
          label: '主程序编号', prop: 'runProgramname', width: '160'
        },
        { label: '状态', prop: 'state', formatter: this.stateFormat },
        { label: '响应信息', prop: 'dncResponse' },
        { label: '反馈内容', prop: 'feedbackDetail' },
        { label: '操作', render: (h, scope) => {
          return (
            <div>
              <el-button
                v-hasPermi={['mom:dzics:dnc:update']}
                type='primary'
                size='mini'
                loading={scope.row.loading}
                disabled={scope.row.state === '3'}
                onClick={() => { this.handleAgain(scope) }}
              >重发</el-button>
              <el-button
                v-hasPermi={['mom:dzics:dnc:cancel']}
                type='danger'
                size='mini'
                onClick={() => { this.handleCancel(scope) }}
              >取消</el-button>
              <el-button
                v-hasPermi={['mom:dzics:dnc:input']}
                type='info'
                size='mini'
                onClick={() => { this.handleInput(scope) }}
              >输入主程序号</el-button>
            </div>
          )
        }, width: 270 }
        // disabled={scope.row.state === '3' || scope.row.state === '5'}
      ],
      loading: false,
      loadingBtn: false,
      total: 0, // 列表总条数
      queryParams: { // 查询信息
        page: 1,
        limit: 20,
        wipOrderNo: '',
        lineId: '',
        materialCode: '',
        machineCode: '',
        state: '',
        field: undefined,
        type: undefined
      },
      workpieceLists: [], // 工件列表
      list: [], // 表格数据
      lineList: [], // 产线列表
      stateList: [
        { label: '请求失败', value: '1' },
        { label: '请求成功，未反馈', value: '2' },
        { label: '切换成功', value: '3' },
        { label: '切换失败', value: '4' },
        { label: '人工干预', value: '5' }
      ]

    }
  },
  computed: { ...mapGetters(['orderList']) },
  mounted() {
    this.handleWorkpiec()
    this.getList()
    this.handleLine()
  },
  methods: {
    // 格式化序号
    indexMethod(index) {
      return (this.queryParams.page - 1) * this.queryParams.limit + index + 1
    },
    // 排序
    sortChange(column) {
      this.$mySort(this.queryParams, column, this.getList)
    },
    // 获取列表
    getList() {
      this.loading = true
      dncProgramList(this.queryParams).then(res => {
        this.list = res.data
        this.list.map(item => {
          this.$set(item, 'loading', false)
          return item
        })
        this.total = res.count || 0
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 获取产线列表
    handleLine() {
      getlineSelect().then(res => {
        this.lineList = res.data
      }).catch(() => {
        this.loading = false
      })
    },
    // 获取工件列表
    handleWorkpiec() {
      getOrderWorkpiece().then(res => {
        this.workpieceLists = res.data
      }).catch(() => {
        this.loading = false
      })
    },
    // 输入主程序号
    handleInput(scope) {
      this.$prompt('请输入主程序编码', '更新主程序编码', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: scope.row.runProgramname
      }).then(({ value }) => {
        inputDncProgram({ id: scope.row.id, runProgramname: value }).then(response => {
          this.getList()
          this.msgSuccess('修改成功，新密码是：' + value)
        })
      }).catch(() => {})

      // this.$confirm('是否确认更改该数据项', '警告', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(function() {
      //   return inputDncProgram({ id: scope.row.id })
      // }).then(() => {
      //   this.getList()
      //   this.msgSuccess('取消成功')
      // }).catch(() => {})
    },
    // 重发
    handleAgain(scope) {
      scope.row.loading = true
      updateDncProgram({ id: scope.row.id }).then(r => {
        this.getList()
        this.msgSuccess(`重发${r.msg}`)
        scope.row.loading = false
      })
    },
    // 取消
    handleCancel(scope) {
      this.$confirm('是否确认取消该数据项', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return cancelDncProgram({ id: scope.row.id })
      }).then(() => {
        this.getList()
        this.msgSuccess('取消成功')
      }).catch(() => {})
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
    stateFormat(row) {
      const obj = {
        '1': '请求失败',
        '2': '请求成功，未反馈',
        '3': '切换成功',
        '4': '切换失败',
        '5': '人工干预'
      }
      return obj[row.state]
    }
  }
}
</script>

<style scoped>

</style>
