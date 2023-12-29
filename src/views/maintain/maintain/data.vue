<template>
  <div class="app-container">
    <!-- 头部筛选 -->
    <el-card shadow="never" class="card">
      <el-form ref="queryForm" :inline="true" :model="queryParams">
        <el-form-item prop="createBy">
          <el-input
            v-model="queryParams.createBy"
            clearable
            size="small"
            placeholder="保养人"
            style="width: 180px;"
          />
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

    <!-- 保养内容详情 -->
    <el-dialog v-dialogDrag :close-on-click-modal="false" :modal-append-to-body="false" title="设备保养明细" :visible.sync="dialogTableVisible" width="1400px">
      <dz-table
        v-loading="loadingDetail"
        :column="columnDetail"
        :data="gridData"
        :total="totalDetail"
        pagination
        height="500"
        :page.sync="queryParamsDetail.page"
        :limit.sync="queryParamsDetail.limit"
        @pagination="handleEdit"
      />
    </el-dialog>
  </div>
</template>

<script>
import { recordMaintain, recordMaintainDetails } from '@/api/euipment/maintain'

export default {
  // name: 'MaintainData',
  data() {
    return {
      column: [
        { type: 'index', index: this.indexMethod },
        { label: '产线名称', prop: 'lineName' },
        { label: '设备名称', prop: 'equipmentName' },
        { label: '设备编号', prop: 'equipmentNo' },
        { label: '设备保养时间', prop: 'maintainDate' },
        { label: '保养人', prop: 'createBy' },
        {
          label: '操作', render: (h, scope) => {
            return (
              <div>
                <el-button
                  type='primary'
                  size='mini'
                  onClick={() => {
                    this.handleEdit(scope.row)
                  }}
                >查看保养内容详情
                </el-button>
              </div>
            )
          }, width: 280
        }
      ],
      columnDetail: [
        { type: 'index', index: this.indexMethod },
        { label: '保养项', prop: 'maintainItem', disableSort: true },
        { label: '保养内容', prop: 'maintainContent', disableSort: true }
      ],
      // 遮罩层(加载)
      loading: false,
      loadingDetail: false,
      btnLoading: false,
      total: 0, // 列表总条数
      totalDetail: 0, // 列表总条数
      queryParams: { // 查询信息
        page: 1,
        limit: 20,
        maintainId: undefined, // 机器人编码
        createBy: undefined, // 机器人编码
        field: undefined,
        type: undefined
      },
      queryParamsDetail: {
        page: 1,
        limit: 20,
        maintainHistoryId: undefined
      },
      list: [], // 表格数据
      dialogTableVisible: false, // 保养记录弹窗
      gridData: []// 停机详情数据,
    }
  },
  mounted() {
    this.queryParams.maintainId = this.$route.params.maintainId
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
    // 获取机器人列表
    getList() {
      this.loading = true
      recordMaintain(this.queryParams).then(res => {
        this.list = res.data
        this.total = res.count || 0
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 编辑
    handleEdit(row) {
      this.loadingDetail = true
      this.queryParamsDetail.maintainHistoryId = row.maintainHistoryId
      this.getRecordMaintainDetails()
      this.dialogTableVisible = true
    },
    // 查看详情接口
    getRecordMaintainDetails() {
      recordMaintainDetails(this.queryParamsDetail).then(res => {
        this.gridData = res.data
        this.totalDetail = res.count || 0
        this.loadingDetail = false
      }).catch(() => {
        this.loadingDetail = false
      })
    },
    handleDetail() {},
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
      await this.resetForm('queryForm')
      await this.handleQuery()
    }
  }
}
</script>

<style scoped>

</style>
