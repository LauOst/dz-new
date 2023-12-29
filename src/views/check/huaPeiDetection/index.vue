<template>
  <!--  v-show="showSearch"-->
  <div class="app-container">
    <el-card shadow="never" class="card">
      <el-form ref="queryForm" :model="queryParams" :inline="true">
        <!--        <el-form-item prop="orderId">-->
        <!--          <el-select v-model="queryParams.orderId" size="small" style="width: 180px;" placeholder="订单编号" @change="handleOrder">-->
        <!--            &lt;!&ndash;            <el-option label="全部" :value="''" />&ndash;&gt;-->
        <!--            <el-option v-for="(item,index) in orderList" :key="index" :label="item.orderNo" :value="item.orderId">-->
        <!--              <span>{{ item.orderNo }}-&#45;&#45;{{ item.departName }}</span>-->
        <!--            </el-option>-->
        <!--          </el-select>-->
        <!--        </el-form-item>-->

        <el-form-item prop="lineId">
          <el-select v-model="queryParams.lineId" size="small" style="width: 180px;" placeholder="产线名称" @change="changeLine">
            <!--            <el-option label="全部" :value="''" />-->
            <el-option v-for="(item,index) in lineLists" :key="index" :label="item.lineName" :value="item.lineId" />
          </el-select>
        </el-form-item>

        <el-form-item v-if="workpieceLists" prop="productNo">
          <el-select v-model="queryParams.productNo" size="small" placeholder="产品名称" @change="handleProduct">
            <el-option
              v-for="(item,index) in workpieceLists"
              :key="index"
              :label="item.productName"
              :value="item.productNo"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="itemShow" prop="detectionResult">
          <el-select v-model="queryParams.detectionResult" size="small" placeholder="检测结果">
            <el-option label="全部" :value="''" />
            <el-option label="正常" value="1" />
            <el-option label="异常" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item prop="qrCode">
          <el-input v-model="queryParams.qrCode" clearable size="small" placeholder="二维码" style="width: 180px;" />
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="dateRange"
            size="small"
            style="width: 240px"
            value-format="yyyy-MM-dd"
            type="daterange"
            unlink-panels
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
          <el-button v-hasPermi="['check:huaPeiDetection:excel']" type="warning" icon="el-icon-download" size="small" @click="handleExport">导出</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <dz-table
      v-loading="loading"
      :column="tableColumn"
      :data="list"
      :total="total"
      pagination
      :page.sync="queryParams.page"
      :limit.sync="queryParams.limit"
      @pagination="getList"
      @sortChange="sortChange"
    />
    <!-- 弹出层 -->
    <el-dialog
      v-dialogDrag
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      :visible.sync="dialogVisible"
      top="8vh"
      :title="dialogType==='edit'?'编辑产品':'新增产品'"
      class="dialog"
      width="530px"
    >
      <el-form
        ref="formData"
        :model="formData"
        :rules="rules"
        label-width="90px"
        style="width: 400px; margin-left:40px;"
      >
        <el-form-item label="站点名称" prop="departName">
          <el-select v-model="formData.departId" placeholder="请选择站点名称" :disabled="formData.productId !== undefined">
            <el-option v-for="(item,index) in departList" :key="index" :label="item.departName" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="产品名称" prop="productName">
          <el-input v-model="formData.productName" placeholder="请输入产品名称" />
        </el-form-item>
        <el-form-item label="产品编号" prop="productNo">
          <el-input v-model="formData.productNo" placeholder="请输入产品编号" />
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
// import pagination from '@/components/Pagination'
import { changeDepartStatus, switchSite } from '@/api/system/depart'
import { addProduct, getProduct, updateProduct, delProduct } from '@/api/product/product'
import { listTestRecord } from '@/api/check/huaPeiDetection'
import { mapGetters } from 'vuex'
import { downloadfoamhuapeiDete } from '@/api/excel/excel'

import { getlineSelect, getOrderWorkpiece } from '@/api/commens'
/*
  queryParams:角色列表请求参数
  departList:站点列表
  total:列表总条数
  dialogVisible:是否显示 Dialog
  dialogType:控制表头显示内容
  role:弹出层数据对象
* */

export default {
  name: 'TestRecord',
  // components: { pagination },
  data() {
    return {
      loading: false,
      // 显示搜索条件
      showSearch: true,
      productShow: false,
      itemShow: false,
      // 分页搜索参数
      queryParams: {
        page: 1,
        limit: 20,
        orderId: undefined,
        productNo: undefined,
        lineId: undefined,
        detectionResult: '',
        field: undefined,
        type: undefined,
        qrCode: undefined,
        userIdentity: undefined
      },
      // 设备列表
      list: [],
      tableColumn: [],
      // 分页数据
      total: 0,
      dialogVisible: false,
      dialogType: 'new',
      // 表单信息
      formData: {},
      departList: [], // 订单列表
      lineLists: undefined, // 产线列表
      workpieceLists: undefined, // 产品列表
      productList: [],
      dateRange: [],
      // 表单校验
      rules: {
        departId: [
          { required: true, message: '请选择站点', trigger: 'change' }
        ],
        productName: [
          { required: true, message: '产品名称不能为空', trigger: 'blur' }
        ],
        productNo: [
          { required: true, message: '产品编号不能为空', trigger: 'blur' }
        ]
      }

    }
  },
  computed: {
    ...mapGetters([
      'userIdentity',
      'orderList'
    ])
  },
  mounted() {
    this.queryParams.userIdentity = this.$store.getters && this.$store.getters.userIdentity
    // this.getList()
    // this.getDepartList()
    this.handleLine()
    this.dateRange = this.getMonthDays()
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
    // 获取站点列表
    getDepartList() {
      switchSite().then(res => {
        this.departList = res.data
      })
    },
    /** 查询检测记录列表 */
    // getList() {
    //   this.loading = true
    //   listTestRecord(this.addDateRange(this.queryParams, this.dateRange)).then(
    //     response => {
    //       if (response.data.length === 0) {
    //         this.list = []
    //         this.tableColumn = []
    //       } else {
    //         this.list = response.data.tableData
    //         this.tableColumn = response.data.tableColumn
    //       }
    //       this.total = response.count || 0
    //       this.loading = false
    //     }
    //   ).catch(() => {
    //     this.loading = false
    //   })
    // },
    getList() {
      this.loading = true
      listTestRecord(this.addDateRange(this.queryParams, this.dateRange)).then(
        response => {
          if (response.data.length === 0) {
            this.list = []
            this.tableColumn = []
          } else {
            this.list = response.data.tableData
            // this.tableColumn = response.data.tableColumn
            const arr = response.data.tableColumn.map(item => ({
              label: item.colName,
              prop: item.colData,
              render: (h, scope) => {
                return (
                  <span class={String(scope.row[scope.column.property]).search('::') !== -1 ? 'specialColor' : ''}>
                    {String(scope.row[scope.column.property]).search('::') !== -1 ? scope.row[scope.column.property].slice(0, String(scope.row[scope.column.property]).search('::')) : scope.row[scope.column.property]}
                  </span>
                )
              },
              minWidth: item.colName === '检测时间' ? 200 : item.colName === '检测产品名称' ? 140 : 120,
              sortable: 'column',
              disableSort: !!(item.colName === '订单编号' || item.colName === '检测产品名称' || item.colName === '产品ID' || item.colName === '检测结果')
            }))
            this.tableColumn = this.$Dz.mergeArr('label', arr, this.tableColumn)
          }
          this.total = response.count || 0
          this.loading = false
        }
      ).catch(() => {
        this.loading = false
      })
    },
    // 新增产品按钮
    handleAdd() {
      this.reset()
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    // 编辑权限按钮
    handleEdit(scope) {
      this.reset()
      // 获取角色ID
      const productId = scope.row.productId
      getProduct(productId).then(res => {
        this.dialogType = 'edit'
        this.dialogVisible = true
        this.formData = res.data
      })
    },
    /** 删除按钮操作 */
    handleDelete(scope) {
      const productId = scope.row.productId
      this.$confirm('是否确认删除名称为"' + scope.row.productName + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return delProduct(productId)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(() => {
      })
    },

    // 站点状态修改
    handleStatusChange(row) {
      const text = row.status === 1 ? '启用' : '停用'
      this.$confirm('确认要"' + text + '""' + row.departName + '"站点吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return changeDepartStatus(row.departId, row.status)
      }).then(() => {
        this.msgSuccess(text + '成功')
      }).catch(function() {
        row.status = row.status === 1 ? 0 : 1
      })
    },
    // 所有菜单节点数据
    getMenuAllCheckedKeys() {
      // 目前被选中的菜单节点
      const checkedKeys = this.$refs.tree.getCheckedKeys()
      // 半选中的菜单节点
      const halfCheckedKeys = this.$refs.tree.getHalfCheckedKeys()
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys)
      return checkedKeys
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['formData'].validate(valid => {
        if (valid) {
          if (this.formData.productId !== undefined) {
            updateProduct(this.formData).then(response => {
              this.msgSuccess('修改成功')
              this.dialogVisible = false
              this.getList()
            })
          } else {
            addProduct(this.formData).then(response => {
              this.msgSuccess('新增成功')
              this.dialogVisible = false
              this.getList()
            })
          }
        }
      })
    },
    // 订单下拉
    // handleOrder(e) {
    //   this.lineLists = undefined
    //   this.queryParams.lineId = undefined
    //   this.workpieceLists = undefined
    //   this.queryParams.productNo = undefined
    //   this.itemShow = false
    //   this.handleLine(e)
    //   console.log('queryParams', this.queryParams)
    // },
    // 获取产线列表
    handleLine(e) {
      getlineSelect(e).then(res => {
        this.lineLists = res.data
      }).catch(() => {
        this.loading = false
      })
    },
    // 产线下拉框变化值
    changeLine(id) {
      this.workpieceLists = undefined
      this.queryParams.productNo = undefined
      this.itemShow = false
      const arr = this.lineLists.filter(t => t.lineId === id)
      const data = {
        lineType: arr[0].lineType || undefined
      }
      this.handleWorkpiec(data)
    },
    // 获取工件列表(产品)
    handleWorkpiec(data) {
      // this.workpieceLists = []
      getOrderWorkpiece(data).then(res => {
        this.workpieceLists = res.data
        console.log('workpieceLists', this.workpieceLists)
        // if (this.workpieceLists && this.workpieceLists.length > 0) this.formData.productId = this.workpieceLists[0].productId
      }).catch(() => {
        this.loading = false
      })
    },
    /** 通过产品id选择检测项 */
    handleProduct() {
      this.itemShow = true
      this.queryParams.detectionResult = null
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = []
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 导出按钮
    handleExport() {
      this.btnLoading = true
      downloadfoamhuapeiDete(this.queryParams).then((res) => {
        this.btnLoading = false
        if (!res.data) return
        this.$downloadFunc(res)
      }).catch((err) => {
        console.log('err', err)
        this.btnLoading = false
      })
    },

    // 表单重置
    reset() {
      this.formData = {
        departId: undefined,
        orderId: undefined,
        productId: undefined,
        productName: undefined,
        productNo: undefined
      }
      this.resetForm('formData')
    }
  }
}
</script>

<style lang="scss">
.specialColor {
  color: red;
}
</style>

