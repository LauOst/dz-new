<template>
  <div class="app-container">
    <!-- 头部筛选 -->
    <el-card shadow="never" class="card">
      <el-form ref="queryForm" :inline="true" :model="queryParams">
        <el-form-item prop="type">
          <el-select v-model="queryParams.type" size="small" style="width: 180px;" placeholder="类型">
            <el-option label="全部" :value="''" />
            <el-option v-for="(item,index) in regularType" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item prop="message">
          <el-input v-model="queryParams.message" v-support size="small" clearable placeholder="内容" style="width: 180px;" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
          <el-button v-hasPermi="['report:procedure:add']" type="success" icon="el-icon-plus" size="small" @click="handleAdd">
            新增
          </el-button>
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
    <!--新增/编辑设备-->
    <el-dialog v-dialogDrag :close-on-click-modal="false" :modal-append-to-body="false" :title="dialogType==='edit'?'编辑':'新增'" :visible.sync="dialogVisible" class="dialog" width="530px">
      <el-form ref="formData" :model="formData" label-width="90px" style="width: 400px; margin-left:40px;">
        <el-form-item label="类型选择" prop="type">
          <el-select v-model="formData.type" placeholder="类型选择" style="width: 100%;">
            <el-option v-for="(item,index) in regularType" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item label="时间间隔" prop="intervalTime">
          <el-input-number v-model="formData.intervalTime" :disabled="dialogType === 'new' ? false : true " controls-position="right" :min="0" />天巡检维修1次
        </el-form-item>
        <el-form-item label-width="0">
          <div class="label-top">内容</div>
          <el-input
            v-model="formData.message"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="请输入内容"
          />
        </el-form-item>
      </el-form>
      <!-- 操作按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button type="plain" @click="dialogVisible = false">取消</el-button>
        <el-popover v-model="passVisible" placement="top" width="160">
          <p>确认提交？</p>
          <div style="text-align: right; margin: 0">
            <el-button size="small" type="text" @click="passVisible = false">取消</el-button>
            <el-button type="primary" size="small" @click="handleSubmit">确定</el-button>
          </div>
          <el-button slot="reference" class="l-m-l-10" type="primary">提交</el-button>
        </el-popover>
      </span>
    </el-dialog>

    <!--确认处理-->
    <el-dialog v-dialogDrag :close-on-click-modal="false" :modal-append-to-body="false" title="确认" :visible.sync="dialogVisibleConfirm" class="dialog" width="530px">
      <el-form ref="formData" :model="formData" label-width="90px" style="width: 400px; margin-left:40px;">
        <el-form-item label="类型选择" prop="type">
          <el-select v-model="formData.type" placeholder="类型选择" style="width: 100%;" disabled>
            <el-option v-for="(item,index) in regularType" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item label="时间间隔" prop="intervalTime">
          <el-input-number v-model="formData.intervalTime" controls-position="right" :min="0" disabled />天巡检维修1次
        </el-form-item>
        <el-form-item label-width="0">
          <div class="label-top">内容</div>
          <el-input
            v-model="formData.message"
            disabled
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="请输入内容"
          />
        </el-form-item>
      </el-form>
      <!-- 操作按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button type="plain" @click="dialogVisibleConfirm = false">暂不处理</el-button>
        <el-popover v-model="passVisibleConfirm" placement="top" width="160">
          <p>确认提交？</p>
          <div style="text-align: right; margin: 0">
            <el-button size="small" type="text" @click="passVisibleConfirm = false">取消</el-button>
            <el-button type="primary" size="small" @click="handleSubmitConfirm">确定</el-button>
          </div>
          <el-button slot="reference" class="l-m-l-10" type="primary">确认已处理</el-button>
        </el-popover>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { addRegular, confirmRegular, delRegular, regularList, updateRegular } from '@/api/inspect/regularInspection'
import { mapGetters } from 'vuex'

export default {
  name: 'RegularInspection',
  data() {
    return {
      column: [
        { type: 'index', index: this.indexMethod, fixed: true },
        { label: '类型', prop: 'type', formatter: this.typeFormat },
        { label: '内容', prop: 'message' },
        { label: '时间间隔', render: (h, scope) => {
          return (
            <span>{scope.row.intervalTime}天每次</span>
          )
        } },
        { label: '下一次巡检维修日期', render: (h, scope) => {
          return (
            <div>
              {scope.row.isShow === 0 ? (
                <el-button
                  type='primary'
                  size='mini'
                  onClick={() => { this.handleEditConfirm(scope) }}
                >
                  确认
                  <br/>
                  到期时间({scope.row.executeData})
                </el-button>
              ) : (
                <span>{scope.row.executeData}</span>
              ) }
            </div>
          )
        } },
        { label: '操作', render: (h, scope) => {
          return (
            <div>
              <el-button
                v-hasPermi={['report:procedure:edit']}
                type='primary'
                size='mini'
                onClick={() => { this.handleEdit(scope) }}
              >编辑</el-button>
              <el-button
                v-hasPermi={['report:procedure:del']}
                type='danger'
                size='mini'
                onClick={() => { this.handleDelete(scope) }}
              >删除</el-button>

            </div>
          )
        }, width: 200 }
      ],
      loading: false,
      btnLoading: false,
      total: 0, // 列表总条数
      list: [], // 表格数据
      dialogVisible: false, // 新增弹窗
      dialogVisibleConfirm: false, // 新增弹窗
      dialogType: 'new',
      passVisible: false, // 确认气泡框
      passVisibleConfirm: false, // 确认气泡框
      formData: {},
      queryParams: { // 查询信息
        page: 1,
        limit: 20,
        lineId: undefined, // 产线id
        message: undefined, // 产线id
        field: undefined,
        type: undefined
      },
      regularType: [
        { label: '巡检', value: '1' },
        { label: '维修', value: '2' }
      ]
    }
  },
  computed: { ...mapGetters(['orderList']) },
  mounted() {
    this.getList()
  },
  methods: {
    // 排序
    sortChange(column) {
      this.$mySort(this.queryParams, column, this.getList)
    },
    // 格式化序号
    indexMethod(index) {
      return (this.queryParams.page - 1) * this.queryParams.limit + index + 1
    },
    // 获取机器人列表
    getList() {
      this.loading = true
      regularList(this.queryParams).then(res => {
        this.list = res.data
        this.total = res.count || 0
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 新增按钮
    handleAdd() {
      this.reset()
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    // 编辑按钮
    handleEdit(scope) {
      this.reset()
      this.formData = JSON.parse(JSON.stringify(scope.row))
      this.dialogType = 'edit'
      this.dialogVisible = true
    },
    // 确认处理按钮
    handleEditConfirm(scope) {
      this.reset()
      this.formData = JSON.parse(JSON.stringify(scope.row))
      this.dialogVisibleConfirm = true
    },
    // 提交设备信息
    handleSubmit() {
      this.$refs['formData'].validate((valid) => {
        if (valid) {
          this.formData.orderNo = this.orderList[0].orderNo
          this.formData.orderId = this.orderList[0].orderId
          if (this.dialogType !== 'new') { // 编辑
            updateRegular(this.formData).then(res => {
              this.$message.success(res.msg)
              this.dialogVisible = false
              this.passVisible = false
              this.getList()
            })
          } else {
            addRegular(this.formData).then(res => {
              this.$message.success(res.msg)
              this.dialogVisible = false
              this.passVisible = false
              this.$store.dispatch('navbar/merge')
              this.getList()
            })
          }
        }
      })
    },
    handleSubmitConfirm() {
      this.$refs['formData'].validate((valid) => {
        if (valid) {
          confirmRegular(this.formData.id).then(res => {
            this.$message.success(res.msg)
            this.dialogVisibleConfirm = false
            this.passVisibleConfirm = false
            this.$store.dispatch('navbar/merge')
            this.getList()
          })
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(scope) {
      const id = scope.row.id
      this.$confirm('是否确认删除该数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return delRegular(id)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(() => {})
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
    },
    // 表单重置
    reset() {
      this.formData = {
        message: undefined,
        type: undefined,
        intervalTime: 0, // 工序编号
        orderId: undefined, // 工序名称
        modelType: '1', // 工序名称
        orderNo: undefined // 排序码
      }
      this.resetForm('formData')
    },
    // 状态格式化
    typeFormat(row) {
      const obj = {
        '1': '巡检',
        '2': '维修'
      }
      return obj[row.type]
    }
  }
}
</script>

<style scoped>

</style>
