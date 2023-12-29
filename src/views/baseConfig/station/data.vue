<template>
  <div class="app-container">
    <!-- 头部筛选 -->
    <el-card shadow="never" class="card">
      <el-form ref="queryForm" :inline="true" :model="queryParams">
        <el-form-item prop="productNo">
          <el-input v-model="queryParams.productNo" v-support size="small" clearable placeholder="工序编号" style="width: 180px;" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
          <el-button v-hasPermi="['report:station:addProduct']" type="success" icon="el-icon-plus" size="small" @click="handleAdd">
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
    <!-- 检测设置弹出层 -->
    <el-dialog v-dialogDrag :close-on-click-modal="false" :modal-append-to-body="false" :visible.sync="dialogVisible" top="8vh" :title="dialogType==='edit'?'编辑产品':'新增产品'" class="dialog" width="1500px">
      <el-form ref="formData" v-loading="loadingDialog" :model="formData" style=" margin:0 20px;">
        <el-row :gutter="20">
          <el-col :span="5.5">
            <el-form-item prop="productId">
              <el-select v-model="formData.productId" placeholder="工件名称-工件编号" @change="changeWork">
                <el-option v-for="(item,index) in workpieceLists" :key="index" :label="item.productName" :value="item.productId">
                  <span>{{ item.productName }}---{{ item.productNo }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-card shadow="never" style="margin-bottom: 22px;height: 550px;overflow-y: scroll;" class="product-card">
          <el-row :gutter="40">
            <el-col v-for="(item, index) in testList" :key="index" :span="12" class="l-flex l-col-center" style="margin-bottom: 20px">
              <el-checkbox v-model="item.isShow" style="margin-right: 20px" :true-label="0" :false-label="1">列表是否展示</el-checkbox>
              <el-form-item :label="item.tableColVal" :prop="item.tableColVal" label-width="90px" style="margin-right: 20px">
                <el-input v-model="item.tableColCon" placeholder="请输入产品名称" style="width: 200px" />
              </el-form-item>
              <el-form-item :label="'补偿值' + (index+1 < 10 ? '0' + (index+1) : (index+1))" :prop="'set' + (index + 1)" :step="0.001" label-width="90px">
                <el-input-number
                  v-model="item.compensationValue"
                  :step="0.001"
                  :min="0"
                  style="width: 150px"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>

      </el-form>
      <div style="text-align:right;">
        <el-button @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getOrderWorkpiece } from '@/api/commens' // 获取产线列表
import { listArtifacts, addArtifacts, listArtifactsD, updateArtifactsD, delArtifacts, listArtifactsTest } from '@/api/report/station'

export default {
  name: 'Data',
  data() {
    return {
      column: [
        { type: 'index', index: this.indexMethod, fixed: true },
        { label: '工位名称', prop: 'stationName' },
        { label: '工位编号', prop: 'stationCode' },
        { label: '工件名称', prop: 'productName' },
        { label: '工序编号', prop: 'productNo' },
        { label: '操作', render: (h, scope) => {
          return (
            <div>
              <el-button
                v-hasPermi={['report:station:editProduct']}
                type='primary'
                size='mini'
                onClick={() => { this.handleEdit(scope) }}
              >检测项绑定</el-button>
              <el-button
                v-hasPermi={['report:station:delProduct']}
                type='danger'
                size='mini'
                onClick={() => { this.handleDelete(scope) }}
              >删除</el-button>
            </div>
          )
        }, width: 220 }
      ],
      // 遮罩层(加载)
      loading: false,
      loadingDialog: false,
      total: 0, // 列表总条数
      queryParams: { // 查询信息
        page: 1,
        limit: 20,
        orderId: undefined,
        lineId: undefined,
        workingStationId: undefined, // 工序ID
        productNo: undefined, // 工件编码
        field: undefined,
        type: undefined
      },
      list: [], // 表格数据
      dialogVisible: false, // 新增弹窗
      dialogType: 'new',
      passVisible: false, // 确认气泡框
      formData: {},
      workpieceLists: [], // 工件列表
      orderList: [], // 产线列表
      testList: [], // 配置项列表:
      isShowPro: false
    }
  },
  mounted() {
    this.queryParams.workingStationId = this.$route.params.stationId
    this.queryParams.orderId = this.$route.params.orderId
    this.queryParams.lineId = this.$route.params.lineId
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
      listArtifacts(this.queryParams).then(res => {
        this.list = res.data
        this.total = res.count || 0
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    getListTestAll(data) {
      this.loadingDialog = true
      listArtifactsTest(data).then(res => {
        this.testList = res.data
        this.loadingDialog = false
      }).catch(() => {
        this.loadingDialog = false
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
    // 下拉框选中事件
    changeWork(id) {
      const data = this.workpieceLists.filter(item => {
        return item.productId === id
      })
      data[0].orderId = this.$route.params.orderId
      data[0].lineId = this.$route.params.lineId
      console.log('下拉框选中事件', data)
      this.getListTestAll(data[0])
    },
    // 新增设备
    handleAdd(scope) {
      this.isShowPro = false
      this.reset()
      this.handleWorkpiec()
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    // 编辑设备
    handleEdit(scope) {
      this.isShowPro = true
      this.reset()
      this.handleWorkpiec()
      this.loadingDialog = true
      const data = {
        workStationProductId: scope.row.workStationProductId,
        orderId: this.$route.params.orderId,
        lineId: this.$route.params.lineId
      }
      listArtifactsD(data).then(res => {
        this.testList = res.data.dzDetectTempVos
        this.formData.productId = String(res.data.product.productId)
        this.formData.workStationProductId = res.data.workStationProductId
        this.loadingDialog = false
      })
      this.dialogType = 'edit'
      this.dialogVisible = true
    },
    // 绑定产品检测项
    handleBind() {
      this.$router.push({ path: '/procedure/type/data/' + '1' })
    },
    // 提交设备信息
    submitForm() {
      this.$refs['formData'].validate(valid => {
        if (valid) {
          if (this.dialogType === 'edit') {
            this.formData.dzDetectTempVos = this.testList
            updateArtifactsD(this.formData).then(response => {
              this.msgSuccess('修改成功')
              this.dialogVisible = false
              this.getList()
            })
          } else {
            this.formData.dzDetectTempVos = this.testList
            this.formData.workingStationId = this.$route.params.stationId
            addArtifacts(this.formData).then(response => {
              this.msgSuccess('修改成功')
              this.dialogVisible = false
              this.getList()
            })
          }
        }
      })
    },

    /** 删除按钮操作 */
    handleDelete(scope) {
      const workStationProductId = scope.row.workStationProductId
      this.$confirm('是否确认删除该数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return delArtifacts(workStationProductId)
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
        productId: undefined,
        workStationpProductId: undefined,
        workingProcedureId: undefined,
        dzDetectTempVos: []
      }
      this.testList = []
      this.resetForm('formData')
    },
    // 过滤设备类型
    equipmentFormat(row) {
      const obj = {
        1: '检测设备',
        2: '机床',
        3: '机器人',
        4: '相机'
      }
      return obj[row.equipmentType]
    }
  }
}
</script>

<style>

</style>
