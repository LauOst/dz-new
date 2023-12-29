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
        <el-form-item prop="stationNo">
          <el-input v-model="queryParams.stationNo" clearable size="small" placeholder="工位" style="width: 180px;" />
        </el-form-item>
        <el-form-item prop="prod">
          <el-input v-model="queryParams.prod" clearable size="small" placeholder="产品型号" style="width: 180px;" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
          <!--          <el-button icon="el-icon-plus" type="success" size="small" @click="handleAddProd">新增</el-button>-->
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
    <!--编辑批次追溯-->
    <el-dialog v-dialogDrag :close-on-click-modal="false" :title="'新增产品'" :visible.sync="prodDialogVisible" class="dialog" width="530px">
      <el-form ref="prodFormData" :model="prodFormData" :rules="prodFormRules" label-width="90px" style=" margin-left:40px;">
        <el-form-item label="产品名称" prop="prod">
          <el-input v-model="prodFormData.prod" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="prodDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitProd('prodFormData')">提交</el-button>
      </span>
    </el-dialog>
    <!--新增批次追溯-->
    <el-dialog v-dialogDrag :close-on-click-modal="false" :title="'新增批次'" :visible.sync="addDialogVisible" class="dialog" width="530px">
      <el-form ref="addFormData" :model="addFormData" :rules="addFormRules" label-width="90px" style=" margin-left:40px;">
        <el-form-item label="组件名称" prop="componentName">
          <el-input v-model="addFormData.componentName" />
        </el-form-item>
        <el-form-item label="批次号" prop="batchNo">
          <el-input v-model="addFormData.batchNo" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit('addFormData')">提交</el-button>
      </span>
    </el-dialog>
    <!--编辑批次追溯-->
    <el-dialog v-dialogDrag :close-on-click-modal="false" :title="'编辑批次追溯'" :visible.sync="dialogVisible" class="dialog edit-dialog" width="1000px" top="8vh">
      <div class="l-flex l-row-between l-col-center l-m-b-20">
        <div>
          <span class="text-title">工位： <span class="text-info font-bold" style="color: #000">{{ formData.stationNo || '--' }}</span></span>
          <!--          <span class="text-title l-m-l-40">产品型号： <span class="text-info font-bold" style="color: #000">{{ formData.prod || '&#45;&#45;' }}</span></span>-->
        </div>
        <el-button icon="el-icon-plus" type="success" size="small" @click="handleAdd">新增</el-button>
      </div>
      <el-table
        ref="table"
        v-loading="loading"
        :data="setList"
        style="width: 100%;"
        border
        height="500"
      >
        <el-table-column label="组件名称" align="center">
          <template slot-scope="scope">
            <el-input
              v-if="isshow[scope.$index]"
              v-model.trim="scope.row.componentName"
              type="text"
              size="mini"
              clearable
            />
            <!-- 展示状态下显示 -->
            <span v-if="!isshow[scope.$index]">{{ scope.row.componentName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="批次号" align="center">
          <template slot-scope="scope">
            <el-input
              v-if="isshow[scope.$index]"
              v-model.trim="scope.row.batchNo"
              type="text"
              size="mini"
              clearable
            />
            <!-- 展示状态下显示 -->
            <span v-if="!isshow[scope.$index]">{{ scope.row.batchNo }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="160">
          <template slot-scope="scope">
            <el-button
              v-if="isshow[scope.$index]"
              size="mini"
              type="success"
              icon="el-icon-check"
              @click="handelCheck(scope.$index, scope)"
            />
            <el-button
              v-if="!isshow[scope.$index]"
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="handleEditNew(scope.$index)"
            />
            <el-button
              v-if="!isshow[scope.$index]"
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="handleDelete(scope)"
            />
          </template>
        </el-table-column>
      </el-table>
      <!-- <dz-table
        ref="table"
        v-loading="loadingDetail"
        :column="columnSet"
        :data="setList"
        :total="DetailTotal"
        pagination
        :page.sync="queryParamsDetail.page"
        :limit.sync="queryParamsDetail.limit"
        height="400"
        @pagination="getDetailList"
      /> -->
      <!-- 操作按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { updateCompontBatchDetail, detailCompontBatch, addCompontBatch, deleteCompontBatch, addStationProds, deleteWorkStationProds } from '@/api/jingji/componentBatch'
import { listStation } from '@/api/jingji/stationSettings'

export default {
  name: 'ComponentBatch',
  data() {
    return {
      isshow: [],
      column: [
        { type: 'index', index: this.indexMethod },
        { label: '工位', prop: 'stationNo', disableSort: true },
        // { label: '产品型号', prop: 'prod', disableSort: true },
        { label: '设置时间', prop: 'updateTime', disableSort: true },
        { label: '操作', render: (h, scope) => {
          return (
            <div>
              <el-button
                type='primary'
                size='mini'
                v-hasPermi={['jingji:componentBatch:edit']}
                onClick={() => { this.handleEdit(scope) }}
              >设置组件批次</el-button>

              <el-button
                type='danger'
                size='mini'
                onClick={() => { this.handleDeleteProd(scope) }}
              >删除</el-button>
            </div>
          )
        }, width: 300, fixed: 'right' }
      ],
      columnDetail: [
        { label: '组件名称', prop: 'componentName', disableSort: true },
        { label: '设置时间', prop: 'createTime', disableSort: true },
        { label: '组件类型', render: (h, scope) => {
          return (
            <div>
              <span >{scope.row.componentType === 1 ? '全局' : scope.row.componentType === 2 ? '工位' : ''}</span>
            </div>
          )
        }, disableSort: true },
        { label: '批次号', prop: 'batchNo', disableSort: true }
      ],
      loading: false,
      loadingDetail: false,
      total: 0, // 列表总条数
      DetailTotal: 0, // 列表总条数
      // 查询信息
      queryParams: {
        page: 1,
        limit: 20,
        stationNo: undefined,
        prod: undefined
      },
      queryParamsDetail: {
        page: 1,
        limit: 20,
        prod: undefined
      },
      list: [],
      detailList: [],
      setList: [],
      formData: {},
      addFormRules: {
        componentName: [
          { required: true, message: '请输入组件名称', trigger: 'blur' }
        ],
        batchNo: [
          { required: true, message: '请输入批次号', trigger: 'blur' }
        ]
      }, // 新增校验
      prodFormRules: {
        prod: [
          { required: true, message: '请输入产品名称', trigger: 'blur' }
        ]
      },
      addFormData: {},
      prodFormData: {},
      formDataDetail: {},
      addDialogVisible: false,
      prodDialogVisible: false,
      dialogVisibleDetail: false, // 详情弹窗
      dialogVisible: false // 新增编辑弹窗
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    // 格式化序号
    indexMethod(index) {
      return (this.queryParams.page - 1) * this.queryParams.limit + index + 1
    },
    /**
     * @description: 编辑单行数参数
     * @param {index} 当前行索引值
     * @return void
     */
    handleEditNew(index) {
      this.$set(this.isshow, index, true)
    },

    /**
     * 删除单行
     */
    handleDelete(scope) {
      console.log('scope', scope.row.id)
      deleteCompontBatch(scope.row.id).then(res => {
        if (res.code === 0) this.$message.success(res.msg)
        this.getDetailList()
      })
    },

    handleDeleteProd(scope) {
      deleteWorkStationProds(scope.row.id).then(res => {
        if (res.code === 0) this.$message.success(res.msg)
        this.getList()
      })
    },
    /**
     * @description: 保存单行参数
     * @param {index} 当前行索引值
     * @return void
     */
    handelCheck(index, scope) {
      this.$set(this.isshow, index, false)
      console.log('handelCheck', scope)
      updateCompontBatchDetail(scope.row).then(res => {
        this.$message.success(res.msg)
        // this.dialogVisibleDetail = false
        this.getDetailList()
      })
    },
    getList() {
      this.loading = true
      listStation(this.queryParams).then(res => {
        this.list = res.data
        this.total = res.count || 0
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
      // listWorkStaionProd(this.queryParams).then(res => {
      //   this.list = res.data
      //   this.total = res.count || 0
      //   this.loading = false
      // }).catch(() => {
      //   this.loading = false
      // })
    },
    // 新增组件批次
    handleAdd() {
      this.reset()
      this.addDialogVisible = true
    },
    // 新增产品型号
    // handleAddProd() {
    //   this.prodFormData = {
    //     prod: undefined
    //   }
    //   this.resetForm('formDataProd')
    //   this.prodDialogVisible = true
    // },
    handleSubmitProd(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          addStationProds(this.prodFormData).then(res => {
            this.$message.success(res.msg)
            this.prodDialogVisible = false
            this.getList()
          })
        }
      })
    },
    handleSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const obj = {
            ...this.addFormData,
            stationNo: this.formData.stationNo,
            prod: this.formData.prod
          }
          addCompontBatch(obj).then(res => {
            this.$message.success(res.msg)
            this.addDialogVisible = false
            this.getDetailList()
          })
        }
      })
    },
    // 设置组件批次
    handleEdit(scope) {
      this.formData = JSON.parse(JSON.stringify(scope.row))
      this.queryParamsDetail.prod = scope.row.prod
      this.queryParamsDetail.stationNo = scope.row.stationNo
      this.dialogVisible = true
      this.getDetailList()
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
      detailCompontBatch(this.queryParamsDetail).then(res => {
        this.detailList = res.data
        this.setList = JSON.parse(JSON.stringify(this.detailList))
        this.DetailTotal = res.count || 0
        this.loadingDetail = false
      }).catch(() => {
        this.loadingDetail = false
        this.setList = []
      })
    },
    handleClose() {
      this.dialogVisible = false
      this.setList = []
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
      // this.formData = {
      //   IDBCursor: undefined
      // }
      this.addFormData = {
        componentName: undefined,
        batchNo: undefined
      }
      this.resetForm('formData')
    }
  }
}
</script>
<style scoped>
.edit-dialog /deep/ .el-input__inner{
  height: 30px;
  line-height: 30px;
  text-align: center;
  font-size: 14px;
}
.edit-dialog /deep/ .el-input__suffix{
  position: absolute;
  height: 100%;
  top: 3px;
}
.l-font-14 {
  font-size: 14px;
}
</style>
