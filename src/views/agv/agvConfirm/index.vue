<template>
  <div class="app-container">
    <el-card shadow="never" class="card">
      <el-form ref="queryForm" :model="queryParams" :inline="true">
        <el-form-item prop="groupNo">
          <el-input
            v-model="queryParams.workpieceCode"
            clearable
            size="small"
            placeholder="工件编号"
            style="width: 180px;"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
          <el-button
            v-hasPermi="['agv:agvConfirm:confirm']"
            :type="IsHasData === 0 ? 'success': 'danger' "
            size="small"
            @click="handleConfirm"
          >确认来料
          </el-button>
          <!--          <el-button v-hasPermi="['tool:tool:excel']" :loading="btnLoading" type="warning" icon="el-icon-download" size="small" @click="handleExport">导出</el-button>-->
        </el-form-item>
      </el-form>
    </el-card>
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

    <el-dialog
      v-dialogDrag
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      :visible.sync="dialogVisible"
      title="料框信息"
      class="dialog"
      width="700px"
    >
      <el-form
        ref="formData"
        :model="formData"
        label-width="90px"
        style="width: 580px; margin-left:40px;"
      >
        <el-form-item label="订单号" prop="orderNo">
          <el-input v-model="formData.orderNo" placeholder="请输入刀具组编号" style="width: 280px;" />
        </el-form-item>
        <el-form-item label="物料编码" prop="workpieceCode">
          <el-input v-model="formData.workpieceCode" placeholder="请输入刀具组编号" style="width: 280px;" />
        </el-form-item>
        <el-form-item label="物料数量" prop="workNumber">
          <el-input v-model="formData.workNumber" placeholder="请输入刀具组编号" style="width: 280px;" />
        </el-form-item>

      </el-form>
      <div style="text-align:right;">
        <el-button @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>

import { confirm, getAgvConfirm, getIsHasData } from '@/api/agv/agvConfirm'
/*
  queryParams:刀具管理列表请求参数
  total:列表总条数
  dialogVisible:是否显示 Dialog
  dialogType:控制表头显示内容
* */

export default {
  name: 'AgvConfirm',
  data() {
    return {
      // 表格信息
      column: [
        { type: 'index', index: this.indexMethod },
        { label: '工件数量', prop: 'workNumber' },
        { label: '当前生产工件编号', prop: 'workpieceCode' },
        { label: '确认时间', prop: 'confirmTime' }
      ],
      loading: false,
      // 分页搜索参数
      queryParams: {
        page: 1,
        limit: 20,
        workpieceCode: undefined,
        field: undefined,
        type: undefined
      },
      formData: {},
      dialogVisible: false,
      // 列表
      list: [],
      // 分页数据
      total: 0,
      flag: undefined,
      timer: undefined,
      timers: undefined,
      IsHasData: 0
    }
  },
  computed: {},
  mounted() {
    this.getList()
    this.polling()
    this.$once('hook:beforeDestroy', () => {
      clearInterval(this.timers)
    })
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
    /** 查询列表 */
    getList() {
      this.loading = true
      getAgvConfirm(this.queryParams).then(res => {
        this.list = res.data
        this.total = res.count || 0
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 一筐按钮
    handleConfirm() {
      if (this.IsHasData !== 0) {
        this.dialogVisible = true
      }
      // this.throttle(this.toNext, 5000)
    },
    submitForm() {
      confirm().then(res => {
        this.getList()
        this.$message.success(res.msg)
        this.dialogVisible = false
      })
    },
    polling() {
      // 轮询获取更新过程中的信息
      // const num = 1
      if (this.timers) {
        clearInterval(this.timers)
      } else {
        this.timers = setInterval(() => {
          // 在这里发送请求获取数据
          getIsHasData().then(res => {
            this.IsHasData = res.data
            this.formData = res.data
          })
          // this.updateInfo.push('升级的第' + num++ + '步')
          // if (num === 3) {
          //   clearInterval(this.timer)
          //   this.timer = null
          // }
        }, 1000)
      }
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1
      this.getList()
    },
    toNext() {
      console.log('btnBClick')
    },
    throttle(func, wait = 500, immediate = true) {
      if (immediate) {
        if (!this.flag) {
          this.flag = true
          // 如果是立即执行，则在wait毫秒内开始时执行
          typeof func === 'function' && func()
          this.timer = setTimeout(() => {
            this.flag = false
          }, wait)
        }
      } else {
        if (!this.flag) {
          this.flag = true
          // 如果是非立即执行，则在wait毫秒内的结束处执行
          this.timer = setTimeout(() => {
            this.flag = false
            typeof func === 'function' && func()
          }, wait)
        }
      }
    },

    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 表单重置
    reset() {
      this.formData = {
        orderNo: undefined,
        workpieceCode: undefined,
        workNumber: undefined
      }
      this.resetForm('formData')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

