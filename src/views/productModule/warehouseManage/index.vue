<!--
 * @Author: zhixinJ
 * @Date: 2023-03-31 15:31:34
 * @Desc: 库位管理
-->
<template>
  <div class="app-container">
    <!-- 头部筛选 -->
    <el-card shadow="never" class="card">
      <el-form ref="queryForm" :inline="true" :model="queryParams">
        <el-form-item prop="houseName">
          <el-input v-model="queryParams.houseName" clearable size="small" placeholder="库位名称" style="width: 180px;" />
        </el-form-item>
        <el-form-item prop="houseNo">
          <el-input v-model="queryParams.houseNo" clearable size="small" placeholder="库位编号" style="width: 180px;" />
        </el-form-item>
        <el-form-item prop="productNo">
          <el-input v-model="queryParams.productNo" clearable size="small" placeholder="工件型号" style="width: 180px;" />
        </el-form-item>
        <el-form-item>
          <start-date v-model="queryParams.startTime" />
          <end-date v-model="queryParams.endTime" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
          <el-button v-hasPermi="['productModule:warehouseManage:add']" icon="el-icon-plus" type="success" size="small" @click="handleAdd">新增</el-button>
          <el-button v-hasPermi="['productModule:warehouseManage:clear']" icon="el-icon-warning-outline" type="warning" size="small" @click="handleClear">清库</el-button>
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
    />
    <!--新增库位-->
    <el-dialog v-dialogDrag :close-on-click-modal="false" :title="dialogType==='edit'?'编辑库位':'新增库位'" :visible.sync="dialogVisible" class="dialog" width="530px">
      <el-form ref="formData" :model="formData" :rules="addFormRules" label-width="90px" style=" margin-left:40px;">
        <el-form-item label="库位名称" prop="houseName">
          <el-input v-model="formData.houseName" />
        </el-form-item>
        <el-form-item label="库位编号" prop="houseNo">
          <el-input v-model="formData.houseNo" />
        </el-form-item>
      </el-form>
      <!-- 操作按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit('formData')">提交</el-button>
      </span>
    </el-dialog>
    <!--查看详情-->
    <el-dialog v-dialogDrag :close-on-click-modal="false" :title="'详情'" :visible.sync="dialogVisibleDetail" class="dialog" width="1000px">
      <div class="l-m-b-20">
        <span class="text-title">库位： <span class="text-info font-bold" style="color: #000">{{ formDataDetail.houseName||'--' }}</span></span>
      </div>
      <dz-table
        v-loading="loadingDetail"
        :column="columnDetail"
        :data="detailList"
        :total="DetailTotal"
        pagination
        :page.sync="queryParamsDetail.page"
        :limit.sync="queryParamsDetail.limit"
        height="400"
        @pagination="getDetailList"
      />
      <!-- 操作按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleDetail = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { listWarehouse, addWarehouse, updateWarehouse, detailWarehouse, clearWarehouse } from '@/api/productModule/warehouseManage'
export default {
  name: 'WarehouseManage',
  data() {
    return {
      column: [
        { type: 'index', index: this.indexMethod },
        { label: '库位名称', prop: 'houseName', disableSort: true },
        { label: '库位编号', prop: 'houseNo', disableSort: true },
        { label: '工件型号', prop: 'productNo', disableSort: true },
        { label: 'A级', prop: 'a', disableSort: true },
        { label: 'B级', prop: 'b', disableSort: true },
        { label: 'C级', prop: 'c', disableSort: true },
        { label: 'D级', prop: 'd', disableSort: true },
        { label: 'E级', prop: 'e', disableSort: true },
        { label: '操作', render: (h, scope) => {
          return (
            <div>
              <el-button
                v-hasPermi={['productModule:warehouseManage:edit']}
                type='primary'
                size='mini'
                onClick={() => { this.handleEdit(scope) }}
              >编辑</el-button>
              <el-button
                v-hasPermi={['productModule:warehouseManage:detail']}
                type='primary'
                size='mini'
                onClick={() => { this.handleDetail(scope) }}
              >详情</el-button>
            </div>
          )
        }, width: 300, fixed: 'right' }
      ],
      columnDetail: [
        { label: '工件二维码', prop: 'qrCode', disableSort: true },
        { label: '工件型号', prop: 'productNo', disableSort: true },
        { label: '等级', prop: 'grade', disableSort: true },
        { label: '入库时间', prop: 'createTime', disableSort: true }
      ],
      loading: false,
      loadingDetail: false,
      total: 0, // 列表总条数
      DetailTotal: 0, // 列表总条数
      // 查询信息
      queryParams: {
        page: 1,
        limit: 20,
        houseName: undefined,
        houseNo: undefined,
        productNo: undefined,
        startTime: undefined,
        endTime: undefined
      },
      queryParamsDetail: {
        page: 1,
        limit: 20,
        houseId: undefined
      },
      list: [],
      detailList: [],
      addFormRules: {
        houseName: [
          { required: true, message: '请输入库位名称', trigger: 'blur' }
        ],
        houseNo: [
          { required: true, message: '请输入库位编号', trigger: 'blur' }
        ]
      }, // 新增校验
      formData: {},
      formDataDetail: {},
      dialogType: 'new',
      dialogVisibleDetail: false, // 详情弹窗
      dialogVisible: false // 新增编辑弹窗
    }
  },
  mounted() {
    [this.queryParams.startTime, this.queryParams.endTime] = this.getToday()
    this.getList()
  },
  methods: {
    // 格式化序号
    indexMethod(index) {
      return (this.queryParams.page - 1) * this.queryParams.limit + index + 1
    },
    // 排序
    // sortChange(column) {
    //   this.$mySort(this.queryParams, column, this.getList)
    // },
    getList() {
      this.loading = true
      listWarehouse(this.queryParams).then(res => {
        this.list = res.data
        this.total = res.count || 0
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 清库
    handleClear() {
      // return clearWarehouse()
      this.$confirm('是否要进行清库操作?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return clearWarehouse()
      }).then(() => {
        this.getList()
        this.$message.success('清库成功')
      }).catch(() => {})
    },
    // 新增库位
    handleAdd() {
      this.reset()
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    // 编辑库位
    handleEdit(scope) {
      this.formData = JSON.parse(JSON.stringify(scope.row))
      this.dialogType = 'edit'
      this.dialogVisible = true
    },
    // 查看详情
    handleDetail(scope) {
      this.detailList = []
      this.formDataDetail = JSON.parse(JSON.stringify(scope.row))
      this.queryParamsDetail = Object.assign(this.queryParamsDetail, this.formDataDetail)
      this.dialogVisibleDetail = true
      this.getDetailList()
    },
    getDetailList() {
      this.loadingDetail = true
      detailWarehouse(this.queryParamsDetail).then(res => {
        this.detailList = res.data
        this.DetailTotal = res.count || 0
        this.loadingDetail = false
      }).catch(() => {
        this.loadingDetail = false
      })
    },
    // 提交新增订单信息
    handleSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.formData.houseId !== undefined) {
            updateWarehouse(this.formData).then(res => {
              this.$message.success(res.msg)
              this.dialogVisible = false
              this.getList()
            })
          } else {
            addWarehouse(this.formData).then(res => {
              this.$message.success(res.msg)
              this.dialogVisible = false
              this.getList()
            })
          }
        }
      })
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm');
      [this.queryParams.startTime, this.queryParams.endTime] = this.getToday()
      this.handleQuery()
    },
    // 表单重置
    reset() {
      this.formData = {
        houseId: undefined,
        personNo: undefined, // 编号
        houseNo: undefined // 姓名
      }
      this.resetForm('formData')
    }
  }
}
</script>

<style scoped>

</style>
