<template>
  <div class="app-container">
    <!-- 头部筛选 -->
    <el-card shadow="never" class="card">
      <el-form ref="queryForm" :inline="true" :model="queryParams">
        <el-form-item prop="lineId">
          <el-select v-model="queryParams.lineId" size="small" style="width: 180px;" placeholder="产线名称">
            <el-option label="全部" :value="''" />
            <el-option v-for="(item,index) in lineLists" :key="index" :label="item.lineName" :value="item.lineId" />
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
      :cell-class-name="tableCellClassName"
      :column="column"
      :data="list"
      :total="total"
      pagination
      :page.sync="queryParams.page"
      :limit.sync="queryParams.limit"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { changeEquipmentStatus, listEquipmentStatus } from '@/api/euipment/equipmentStatus'
import { getlineSelect } from '@/api/commens'

export default {
  name: 'EquipmentStatus',
  data() {
    return {
      column: [
        { type: 'index', index: this.indexMethod, fixed: true },
        { label: '产线名称', prop: 'lineName' },
        { label: '设备名称', prop: 'equipmentName' },
        { label: '当日设备产量分析', render: (h, scope) => {
          return (
            <div>
              <el-switch
                v-model={ scope.row.standbyOne}
                active-value={1}
                inactive-value={0}
                onChange={() => { this.handleStatusChange(scope) }}
              />
            </div>
          )
        } },
        // { label: '归属站点', prop: 'departName', width: 120 },
        { label: '预留字段2', render: (h, scope) => {
          return (
            <div>
              <el-switch
                v-model={ scope.row.standbyTwo}
                active-value={1}
                inactive-value={0}
                onChange={() => { this.handleStatusChange(scope) }}
              />
            </div>
          )
        } },
        { label: '预留字段3', render: (h, scope) => {
          return (
            <div>
              <el-switch
                v-model={ scope.row.standbyThree}
                active-value={1}
                inactive-value={0}
                onChange={() => { this.handleStatusChange(scope) }}
              />
            </div>
          )
        } },
        { label: '预留字段4', render: (h, scope) => {
          return (
            <div>
              <el-switch
                v-model={ scope.row.standbyFour}
                active-value={1}
                inactive-value={0}
                onChange={() => { this.handleStatusChange(scope) }}
              />
            </div>
          )
        } },
        { label: '预留字段5', render: (h, scope) => {
          return (
            <div>
              <el-switch
                v-model={ scope.row.standbyFive}
                active-value={1}
                inactive-value={0}
                onChange={() => { this.handleStatusChange(scope) }}
              />
            </div>
          )
        } },
        { label: '预留字段6', render: (h, scope) => {
          return (
            <div>
              <el-switch
                v-model={ scope.row.standbySix}
                active-value={1}
                inactive-value={0}
                onChange={() => { this.handleStatusChange(scope) }}
              />
            </div>
          )
        } },
        { label: '预留字段7', render: (h, scope) => {
          return (
            <div>
              <el-switch
                v-model={ scope.row.standbySeven}
                active-value={1}
                inactive-value={0}
                onChange={() => { this.handleStatusChange(scope) }}
              />
            </div>
          )
        } }
      ],
      queryParams: { // 查询信息
        page: 1,
        limit: 20
      },
      total: 0, // 列表总条数
      // 遮罩层(加载)
      loading: false,
      lineLists: [], // 产线列表
      list: []
    }
  },
  mounted() {
    this.getList()
    this.handleLines()
  },
  methods: {
    tableCellClassName({ row, column, rowIndex, columnIndex }) {
      row.index = rowIndex
      column.index = columnIndex
    },
    // 格式化序号
    indexMethod(index) {
      return (this.queryParams.page - 1) * this.queryParams.limit + index + 1
    },
    // 获取机器人列表
    getList() {
      this.loading = true
      listEquipmentStatus(this.queryParams).then(res => {
        this.list = res.data
        this.total = res.count || 0
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 获取产线列表
    handleLines() {
      getlineSelect().then(res => {
        this.lineLists = res.data
      }).catch(() => {
        this.loading = false
      })
    },
    batchEdit(scope) {
      const arr = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven']
      return arr[scope.column.index - 3]
    },

    // 是否显示修改
    handleStatusChange(scope) {
      const isShow = 'standby' + this.batchEdit(scope)
      const text = scope.row[isShow] === 1 ? '启用' : '停用'
      this.$confirm('确认要"' + text + '""' + scope.row.equipmentName + '"设备吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return changeEquipmentStatus({ id: scope.row.id, name: isShow, value: scope.row[isShow] })
      }).then(() => {
        this.msgSuccess(text + '成功')
      }).catch(function() {
        scope.row[isShow] = scope.row[isShow] === 1 ? 0 : 1
      })
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    }
  }
}
</script>

<style scoped>

</style>
