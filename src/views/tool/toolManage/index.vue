<template>
  <div class="app-container">
    <el-card shadow="never" class="card">
      <el-form v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true">
        <el-form-item prop="groupNo">
          <el-input v-model="queryParams.groupNo" clearable size="small" placeholder="刀具编号" style="width: 180px;" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
          <el-button
            v-hasPermi="['tool:tool:add']"
            type="success"
            icon="el-icon-plus"
            size="small"
            @click="handleAdd"
          >新增
          </el-button>
          <el-button v-hasPermi="['tool:tool:excel']" :loading="btnLoading" type="warning" icon="el-icon-download" size="small" @click="handleExport">导出</el-button>
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
    <!-- 弹出层(添加/编辑刀具组) -->
    <el-dialog
      v-dialogDrag
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      :visible.sync="dialogVisible"
      :title="dialogType==='edit'?'编辑刀具组':'新增刀具组'"
      class="dialog"
      width="580px"
    >
      <el-form
        ref="formData"
        :model="formData"
        :rules="rules"
        label-width="110px"
        style="width: 580px; margin-left:40px;"
      >
        <!--        <el-form-item v-if=" dialogType === 'new' " v-hasShow label="站点名称" prop="id">-->
        <!--          <el-select v-model="formData.id" style="width: 280px;" placeholder="站点名称">-->
        <!--            <el-option v-for="(item,index) in departList" :key="index" :label="item.departName" :value="item.id">-->
        <!--              <span>{{ item.departName }}</span>-->
        <!--            </el-option>-->
        <!--          </el-select>-->
        <!--        </el-form-item>-->
        <el-form-item label="刀具组编号" prop="groupNo">
          <el-input v-model="formData.groupNo" placeholder="请输入刀具组编号" style="width: 300px;" />
        </el-form-item>
        <div>
          <div v-for="(item, index) in formData.toolNoList" :key="index">
            <el-form-item
              :label="index === 0 ? '刀具编号': '' "
              :prop="`toolNoList[${index}]`"
              :rules="{ required: true, message: '请输入库位名称', trigger: ['change', 'blur'] }"
            >
              <el-input v-model="formData.toolNoList[index]" placeholder="请输入刀具组编号" style="width: 300px;" />
              <el-button type="text" size="mini" style="margin-left: 10px" @click="handleAddTool(index)"> {{ index === 0 ? '添加编号' : '删除' }} </el-button>
            </el-form-item>
          </div>

        </div>

      </el-form>
      <div style="text-align:right;">
        <el-button @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {
  getProductCheck, // 查询刀具组列表
  postProductCheck, // 新增刀具组
  updateProductCheck, // 修改刀具组
  delProductCheck // 删除刀具组
} from '@/api/check/toolManage'
import { downloadToolManage } from '@/api/excel/excel'
/*
  queryParams:刀具管理列表请求参数
  total:列表总条数
  dialogVisible:是否显示 Dialog
  dialogType:控制表头显示内容
* */

export default {
  name: 'ToolManage',
  data() {
    return {
      // 表格信息
      column: [
        { type: 'index', index: this.indexMethod },
        { label: '刀具组编号', prop: 'groupNo' },
        { label: '刀具编号数量', render: (h, scope) => {
          return (
            <div>
              <router-link to={'/toolManage/type/data/' + scope.row.toolGroupsId}>
                <el-button type='text'>{ scope.row.toolSum }</el-button>
              </router-link>
            </div>
          )
        }, sortable: 'column' },
        { label: '新增时间', prop: 'createTime' },
        { label: '操作', render: (h, scope) => {
          return (
            <div id='btnWrap'>
              <el-button
                v-hasPermi={['tool:toolManage:edit']}
                type='primary'
                size='mini'
                onClick={() => { this.handleEdit(scope) }}
              >编辑</el-button>
              <el-button
                v-hasPermi={['tool:toolManage:del']}
                type='danger'
                size='mini'
                onClick={() => { this.handleDelete(scope) }}
              >删除</el-button>
            </div>
          )
          // )
        }, width: 240 }
      ],
      loading: false,
      btnLoading: false,
      // 显示搜索条件
      showSearch: true,
      productShow: false,
      itemShow: false,
      // 分页搜索参数
      queryParams: {
        page: 1,
        limit: 20,
        groupNo: undefined,
        field: undefined,
        type: undefined
      },
      // 列表
      list: [],
      // 分页数据
      total: 0,
      dialogVisible: false,
      // dialogVisibleTools: false,
      dialogType: 'new',
      // 表单信息
      formData: {},
      // formDataTools: {},
      productList: [],
      // 表单校验
      rules: {}
      // departList: []
    }
  },
  computed: {},
  mounted() {
    this.getList()
    // this.getDepartList()
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
      getProductCheck(this.queryParams).then(res => {
        this.list = res.data
        this.total = res.count || 0
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 获取站点列表
    // getDepartList() {
    //   switchSite().then(res => {
    //     this.departList = res.data
    //   })
    // },
    // 新增按钮
    handleAdd() {
      this.reset()
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    // 编辑按钮操作
    handleEdit(scope) {
      this.reset()
      this.formData = JSON.parse(JSON.stringify(scope.row))
      console.log(this.formData)
      this.dialogType = 'edit'
      this.dialogVisible = true
    },
    /** 删除按钮操作 */
    handleDelete(scope) {
      const toolGroupsId = scope.row.toolGroupsId
      this.$confirm('是否确认删除该数据项', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return delProductCheck(toolGroupsId)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(() => {
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['formData'].validate(valid => {
        if (valid) {
          if (this.dialogType !== 'new') {
            updateProductCheck(this.formData).then(res => {
              this.msgSuccess(res.msg)
              this.dialogVisible = false
              this.getList()
            })
          } else {
            postProductCheck(this.formData).then(res => {
              this.msgSuccess(res.msg)
              this.dialogVisible = false
              this.getList()
            })
          }
        }
      })
    },
    // 添加刀具
    handleAddTool(index) {
      if (index === 0) {
        this.formData.toolNoList.push(undefined)
      } else {
        this.formData.toolNoList.splice(index, 1)
      }
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
      downloadToolManage(this.queryParams).then((res) => {
        this.btnLoading = false
        if (!res.data) return
        this.$downloadFunc(res, '刀具管理')
      }).catch((err) => {
        console.log('err', err)
        this.btnLoading = false
      })
    },
    // 表单重置
    reset() {
      this.formData = {
        groupNo: undefined,
        id: undefined,
        toolNoList: [undefined]
      }
      this.resetForm('formData')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

