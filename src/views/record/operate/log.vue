<template>
  <div class="app-container">
    <!-- 头部筛选 -->
    <el-card shadow="never" class="card">
      <el-form ref="queryForm" :inline="true" :model="queryParams">
        <el-form-item prop="title">
          <el-input v-model="queryParams.title" v-support size="small" clearable placeholder="操作模块" style="width: 180px;" />
        </el-form-item>
        <el-form-item prop="operDesc">
          <el-input v-model="queryParams.operDesc" v-support size="small" clearable placeholder="操作内容" style="width: 180px;" />
        </el-form-item>
        <el-form-item prop="status">
          <el-select v-model="queryParams.status" v-support size="small" placeholder="操作状态" style="width: 180px;">
            <el-option v-for="(item,index) in statusOptions" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <start-date v-model="queryParams.startTime" />
          <end-date v-model="queryParams.endTime" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
          <el-button v-hasPermi="['record:operate:excel']" :loading="btnLoading" type="warning" icon="el-icon-download" size="small" @click="handleExport">导出</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 表格信息 -->
    <PageTable
      ref="dataTable"
      :data="list"
      :loading="loading"
      :dynamic-column-setting="true"
      :column-visibles="columnVisibles"
      :always-show-column-indexs="[1]"
      :show-always-show-column-in-checkbox="true"
      :total="total"
      :page.sync="queryParams.page"
      :limit.sync="queryParams.limit"
      style="height: 600px"
      @pagination="getList"
      @selection-change="handleSelectionChange"
      @sort-change="sortChange"
    >
      <!--      <el-table-column type="selection" width="55" align="center" />-->
      <el-table-column v-if="columnVisibles[0]" type="index" label="序号" :index="indexMethod" width="100" align="center" fixed="left" show-overflow-tooltip />
      <el-table-column v-if="columnVisibles[1]" label="模块标题" prop="title" align="center" show-overflow-tooltip sortable="column" />
      <el-table-column v-if="columnVisibles[2]" label="业务类型" prop="businessType" align="center" width="120" show-overflow-tooltip sortable="column" />
      <el-table-column v-if="columnVisibles[3]" label="操作状态" prop="status" align="center" width="120" show-overflow-tooltip sortable="column">
        <template slot-scope="scope">
          <el-tag size="small" :type="scope.row.status === 'SUCCESS' ? 'success' : 'danger' ">{{ scope.row.status | statusFormat }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column v-if="columnVisibles[4]" label="请求方式" prop="requestMethod" align="center" width="120" show-overflow-tooltip sortable="column" />
      <el-table-column v-if="columnVisibles[5]" label="操作内容" prop="operDesc" align="center" show-overflow-tooltip sortable="column" />
      <el-table-column v-if="columnVisibles[6]" label="请求URL" prop="operUrl" width="250" align="center" show-overflow-tooltip sortable="column" />
      <el-table-column v-if="columnVisibles[7]" label="耗时" align="center" width="120" show-overflow-tooltip sortable="column">
        <template slot-scope="scope">{{ scope.row.runTime }}ms</template>
      </el-table-column>
      <el-table-column v-if="columnVisibles[8]" label="操作人员" prop="operName" align="center" width="120" show-overflow-tooltip sortable="column" />
      <el-table-column v-if="columnVisibles[9]" label="主机地址" prop="operIp" align="center" width="140" show-overflow-tooltip sortable="column" />
      <el-table-column v-if="columnVisibles[10]" label="操作时间" prop="operTime" align="center" show-overflow-tooltip sortable="column" />
    </PageTable>
    <pagination v-show="total>0" pagination :total="total" :page.sync="queryParams.page" :limit.sync="queryParams.limit" @pagination="getList" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { userLog, delOperLog } from '@/api/record/log'
import PageTable from '@/components/PageTable'
import pagination from '@/components/Pagination'
import { downloadOperation } from '@/api/excel/excel'
export default {
  name: 'Operate',
  components: { PageTable, pagination },
  filters: {
    typeFilter(val) {
      const obj = {
        0: '其他',
        1: '新增',
        2: '修改',
        3: '删除'
      }
      return obj[val]
    },
    statusFormat(val) {
      const obj = {
        SUCCESS: '正常',
        ERROR: '异常'
      }
      return obj[val]
    }
  },
  data() {
    return {
      // 遮罩层(加载)
      loading: false,
      btnLoading: false,
      total: 0, // 列表总条数
      // 查询信息
      queryParams: {
        page: 1,
        limit: 20,
        operDesc: undefined,
        status: undefined,
        title: undefined,
        startTime: undefined,
        endTime: undefined
      },
      setting: true,
      // 状态
      statusOptions: [{
        label: '正常',
        value: 0
      }, {
        label: '异常',
        value: 1
      }],
      ids: [], // 选中数组
      multiple: true, // 非多个禁用
      columnVisibles: new Array(11).fill(true),
      list: [], // 表格数据
      dateRange: [] // 日期范围
    }
  },
  computed: {
    ...mapGetters([
      'userIdentity'
    ])
  },
  created() {
    this.getList()
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
    // 获取订单列表
    getList() {
      this.loading = true
      userLog(this.queryParams).then(res => {
        this.list = res.data
        this.total = res.count || 0
        this.loading = false
      })
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      console.log(selection)
      this.ids = selection.map(item => item.id)
      this.multiple = !selection.length
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm('是否确认删除选中数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delOperLog(this.ids).then(res => {
          if (res.code === 0) {
            this.msgSuccess('删除成功')
            this.getList()
          }
        })
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
      downloadOperation(this.queryParams).then((res) => {
        this.btnLoading = false
        if (!res.data) return
        this.$downloadFunc(res)
      }).catch((err) => {
        console.log('err', err)
        this.btnLoading = false
      })
    }
  }
}
</script>

<style scoped>
</style>
