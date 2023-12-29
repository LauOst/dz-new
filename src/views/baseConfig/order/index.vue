<template>
  <div class="app-container">
    <!-- 头部筛选 -->
    <el-card shadow="never" class="card">
      <el-form ref="queryForm" :inline="true" :model="queryParams">
        <!--        <el-form-item v-hasShow prop="departName">-->
        <!--          <el-select v-model="queryParams.departName" size="small" style="width: 180px;" placeholder="站点">-->
        <!--            <el-option v-for="(item,index) in departList" :key="index" :label="item.departName" :value="item.departName" />-->
        <!--          </el-select>-->
        <!--        </el-form-item>-->
        <el-form-item prop="orderNo">
          <el-input v-model="queryParams.orderNo" clearable size="small" placeholder="订单编号" style="width: 180px;" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
          <el-button v-hasPermi="['order:order:add']" icon="el-icon-plus" type="success" size="small" @click="handleAdd">新增</el-button>
          <el-button v-hasPermi="['order:order:excel']" :loading="btnLoading" type="warning" icon="el-icon-download" size="small" @click="handleExport">导出</el-button>
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
    <!--新增订单-->
    <el-dialog v-dialogDrag :close-on-click-modal="false" :title="dialogType==='edit'?'编辑订单':'新增订单'" :visible.sync="dialogVisible" class="dialog" width="530px">

      <!--    <el-dialog v-dialogDrag :close-on-click-modal="false" :modal-append-to-body="false" :title="dialogType==='edit'?'编辑订单':'新增订单'" :visible.sync="dialogVisible" :close-on-click-modal="false"class="dialog" width="530px">-->

      <el-form ref="formData" :model="formData" :rules="addFormRules" label-width="90px" style=" margin-left:40px;">
        <el-form-item label="订单编号" prop="orderNo">
          <el-input v-model="formData.orderNo" maxlength="4" oninput="value=value.replace(/[^\d]/g,'')">
            <template #prefix>
              <span>{{ orderPrefix }}</span>
            </template>
          </el-input>

        </el-form-item>
        <!--        <el-form-item label="站点名称" prop="departId">-->
        <!--          <el-select v-model="formData.departId" placeholder="请选择站点名称" style="width: 100%;" :disabled="formData.id !== undefined">-->
        <!--            &lt;!&ndash;          <el-select v-model="formData.departId" placeholder="请选择站点名称" style="width: 100%;">&ndash;&gt;-->
        <!--            <el-option v-for="(item,index) in departList" :key="index" :label="item.departName" :value="item.id" />-->
        <!--          </el-select>-->
        <!--        </el-form-item>-->
        <el-form-item label-width="0" prop="remarks">
          <div class="label-top">描述</div>
          <el-input
            v-model="formData.remarks"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            clearable
          />
        </el-form-item>
      </el-form>
      <!-- 操作按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit('formData')">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  postOrder, // 新增订单
  getOrder, // 获取订单列表
  delOrder, // 删除订单
  updateOrder
} from '@/api/order/order'
import { downloadOrder } from '@/api/excel/excel'
export default {
  name: 'Order',
  data() {
    return {
      column: [
        { type: 'index', index: this.indexMethod },
        { label: '订单编号', prop: 'orderNo' },
        // { label: '归属站点', prop: 'departName' },
        { label: '备注', prop: 'remarks' },
        { label: '新增人', prop: 'createBy' },
        { label: '新增时间', prop: 'createTime' },
        { label: '操作', render: (h, scope) => {
          return (
            <div>
              <el-button
                v-hasPermi={['order:order:edit']}
                type='primary'
                size='mini'
                onClick={() => { this.handleEdit(scope) }}
              >编辑</el-button>
              <el-button
                v-hasPermi={['order:order:del']}
                type='danger'
                size='mini'
                onClick={() => { this.handleDelete(scope) }}
              >删除</el-button>
            </div>
          )
        } }
      ],
      // 遮罩层(加载)
      loading: false,
      btnLoading: false,
      total: 0, // 列表总条数
      // 查询信息
      queryParams: {
        page: 1,
        limit: 20,
        orderNo: '', // 订单编号
        departName: '', // 站点名称
        field: undefined,
        type: undefined
      },
      list: [], // 表格数据
      dialogVisible: false, // 新增订单
      // 添加产品表单信息
      formData: {},
      dialogType: 'new',
      addFormRules: {
        departId: [
          { required: true, message: '请选择站点', trigger: 'change' }
        ],
        orderNo: [
          { required: true, message: '请输入订单编号', trigger: 'blur' }
        ]
      }, // 新增校验
      // departList: [], // 站点数据
      orderId: 0, // 订单id
      orderPrefix: 'DZ-'
    }
  },
  computed: {
    ...mapGetters([
      'userIdentity'
    ])
  },
  created() {
    this.getList()
    // this.handleDepartList()
  },
  // 解决表格错位问题
  // activated() {
  //   this.$nextTick(() => {
  //     this.$refs.table.doLayout()
  //   })
  // },
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
      getOrder(this.queryParams).then(res => {
        this.list = res.data
        this.total = res.count || 0
        this.loading = false
      })
    },
    // 获取站点信息
    // handleDepartList() {
    //   switchSite().then(res => {
    //     this.departList = res.data
    //   })
    // },

    // 提交新增订单信息
    handleSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.formData.id !== undefined) {
            const newData = JSON.parse(JSON.stringify(this.formData))
            newData.orderNo = this.orderPrefix + this.formData.orderNo
            updateOrder(newData).then(res => {
              this.$message.success(res.msg)
              this.dialogVisible = false
              this.getList()
              this.$store.dispatch('public/orderList')
            })
          } else {
            const newData = JSON.parse(JSON.stringify(this.formData))
            newData.orderNo = this.orderPrefix + this.formData.orderNo
            postOrder(newData).then(res => {
              this.$message.success(res.msg)
              this.dialogVisible = false
              this.getList()
              this.$store.dispatch('public/orderList')
            })
          }
        }
      })
    },
    // 新增站点按钮
    handleAdd() {
      this.reset()
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    // 编辑订单
    handleEdit(scope) {
      this.formData = JSON.parse(JSON.stringify(scope.row))
      const str = this.formData.orderNo
      this.formData.orderNo = str.slice(this.orderPrefix.length)
      this.formData.departId = this.formData.departId.toString()
      this.dialogType = 'edit'
      this.dialogVisible = true
    },
    // 删除订单
    handleDelete(scope) {
      const orderId = scope.row.id
      this.$confirm('是否确认删除编号为"' + scope.row.orderNo + '"的数据项', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return delOrder(orderId)
      }).then((res) => {
        this.getList()
        this.$store.dispatch('public/orderList')
        this.$message.success(res.msg)
      }).catch(() => {
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
    },
    // 导出按钮
    handleExport() {
      this.btnLoading = true
      downloadOrder(this.queryParams).then((res) => {
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
        id: undefined,
        departId: undefined, // 站点id
        orderNo: undefined, // 订单编号
        remarks: undefined // 备注
      }
      this.resetForm('formData')
    }
  }
}
</script>

<style>

</style>
