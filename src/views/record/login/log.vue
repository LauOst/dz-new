<template>
  <div class="app-container">
    <!-- 头部筛选 -->
    <el-card shadow="never" class="card">
      <el-form ref="queryForm" :inline="true" :model="queryParams">
        <el-form-item prop="userName">
          <el-input v-model="queryParams.userName" v-support size="small" clearable placeholder="登录用户名" style="width: 180px;" />
        </el-form-item>
        <el-form-item prop="loginStatus">
          <el-select v-model="queryParams.loginStatus" v-support size="small" placeholder="操作状态" style="width: 180px;">
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
          <el-button v-hasPermi="['record:login:excel']" :loading="btnLoading" type="warning" icon="el-icon-download" size="small" @click="handleExport">导出</el-button>
          <!--          <el-button-->
          <!--            v-hasPermi="['record:login:del']"-->
          <!--            type="danger"-->
          <!--            plain-->
          <!--            icon="el-icon-delete"-->
          <!--            size="small"-->
          <!--            :disabled="multiple"-->
          <!--            @click="handleDelete"-->
          <!--          >删除</el-button>-->
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
      :hiden-column-indexs="[3, 7]"
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
      <el-table-column v-if="columnVisibles[1]" label="用户名称" prop="userName" align="center" show-overflow-tooltip sortable="column" />
      <el-table-column v-if="columnVisibles[2]" label="操作状态" prop="loginStatus" align="center" show-overflow-tooltip sortable="column">
        <template slot-scope="scope">
          <el-tag size="small" :type="scope.row.loginStatus === 'SUCCESS' ? 'success' : 'danger' ">{{ scope.row.loginStatus | statusFormat }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column v-if="columnVisibles[3]" label="响应信息" prop="loginMsg" width="380" align="center" show-overflow-tooltip sortable="column" />
      <el-table-column v-if="columnVisibles[4]" label="登录主机地址" prop="operIp" align="center" show-overflow-tooltip sortable="column" />
      <el-table-column v-if="columnVisibles[5]" label="浏览器" prop="browser" width="180" align="center" show-overflow-tooltip sortable="column" />
      <el-table-column v-if="columnVisibles[6]" label="操作系统" prop="operatingSystem" align="center" show-overflow-tooltip sortable="column" />
      <el-table-column v-if="columnVisibles[7]" label="登录地点" prop="loginLocation" align="center" show-overflow-tooltip sortable="column" />
      <el-table-column v-if="columnVisibles[8]" label="登录时间" prop="createTime" align="center" show-overflow-tooltip sortable="column" />
    </PageTable>
    <pagination v-show="total>0" pagination :total="total" :page.sync="queryParams.page" :limit.sync="queryParams.limit" @pagination="getList" />

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { loginLog, delLoginLog } from '@/api/record/log'
import PageTable from '@/components/PageTable'
import pagination from '@/components/Pagination'
import { downloadLogin } from '@/api/excel/excel'

export default {
  name: 'Login',
  components: { PageTable, pagination },
  filters: {
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
        userName: undefined,
        loginStatus: undefined,
        startTime: undefined,
        endTime: undefined
      },
      // 状态
      statusOptions: [{
        label: '正常',
        value: 0
      }, {
        label: '异常',
        value: 1
      }],
      columnVisibles: new Array(9).fill(true),
      ids: [], // 选中数组
      multiple: true, // 非多个禁用
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
    // 登录日志列表
    getList() {
      // this.loading = this.$loading({
      //   lock: true, // 同v-loading的修饰符
      //   text: this.$t('tip.loading'), // 加载文案
      //   backgroundColor: 'rgba(55,55,55,0.4)', // 背景色
      //   spinner: 'el-icon-loading', // 加载图标
      //   target: document.querySelector('.el-table__body') // loading需要覆盖的DOM节点，默认为body
      // })
      this.loading = true
      loginLog(this.queryParams).then(res => {
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
        delLoginLog(this.ids).then(res => {
          if (res.code === 0) {
            this.msgSuccess('删除成功')
            this.getList()
          }
        })
      })
    },
    // 状态参数格式化
    statusFormat(row, column) {
      const statusObj = {
        SUCCESS: '正常',
        ERROR: '异常'
      }
      return statusObj[row.loginStatus]
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
      downloadLogin(this.queryParams).then((res) => {
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
