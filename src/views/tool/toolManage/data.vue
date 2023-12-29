<template>
  <div class="app-container">
    <el-card shadow="never" class="card">
      <el-form v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true">
        <el-form-item>
          <el-button
            v-hasPermi="['tool:toolManage:add']"
            type="success"
            icon="el-icon-plus"
            size="small"
            @click="handleAdd"
          >新增
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 表格信息 -->
    <dz-table
      v-loading="loading"
      :column="column"
      :data="list"
      @sortChange="sortChange"
    />
    <!--    <el-table ref="table" v-loading="loading" style="width: 100%" :data="list" border height="600">-->
    <!--      <el-table-column prop="toolGroupsId" label="刀具组ID" align="center" show-overflow-tooltip />-->
    <!--      <el-table-column prop="toolNo" label="刀具编号" align="center" show-overflow-tooltip />-->
    <!--      <el-table-column prop="createTime" show-overflow-tooltip label="新增时间" align="center" />-->
    <!--      <el-table-column label="操作" width="240" fixed="right" align="center" show-overflow-tooltip>-->
    <!--        <template slot-scope="scope">-->
    <!--          <el-button v-hasPermi="['tool:tool:edit']" type="primary" size="mini" @click="handleEdit(scope)">编辑-->
    <!--          </el-button>-->
    <!--          <el-button v-hasPermi="['tool:tool:del']" type="danger" size="mini" @click="handleDelete(scope)">删除-->
    <!--          </el-button>-->
    <!--        </template>-->
    <!--      </el-table-column>-->
    <!--    </el-table>-->
    <!-- 弹出层(添加/编辑刀具组) -->
    <el-dialog
      v-dialogDrag
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      :visible.sync="dialogVisible"
      :title="dialogType==='edit'?'编辑刀具组':'新增刀具组'"
      class="dialog"
      width="700px"
    >
      <el-form
        ref="formData"
        :model="formData"
        :rules="rules"
        label-width="90px"
        style="width: 580px; margin-left:40px;"
      >
        <el-form-item label="刀具编号" prop="toolNo">
          <el-input v-model="formData.toolNo" placeholder="请输入刀具编号" style="width: 280px;" />
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
import {
  getProductCheckById, // 查询刀具列表
  postToolInfo, // 新增刀具
  updateToolInfo, // 修改刀具
  delToolInfo // 删除刀具
} from '@/api/check/toolManage'
import { switchSite } from '@/api/system/depart'
export default {
  data() {
    return {
      // 表格信息
      column: [
        { type: 'index' },
        { label: '刀具组ID', prop: 'toolGroupsId' },
        { label: '刀具编号', prop: 'toolNo' },
        { label: '新增时间', prop: 'createTime' },
        { label: '操作', render: (h, scope) => {
          return (
            <div id='btnWrap'>
              <el-button
                v-hasPermi={['tool:tool:edit']}
                type='primary'
                size='mini'
                onClick={() => { this.handleEdit(scope) }}
              >编辑</el-button>
              <el-button
                v-hasPermi={['tool:tool:del']}
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
      // 显示搜索条件
      showSearch: true,
      productShow: false,
      itemShow: false,
      // 分页搜索参数
      queryParams: {
        toolGroupsId: undefined,
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
      rules: {},
      departList: []
    }
  },
  computed: {},
  mounted() {
    this.queryParams.toolGroupsId = this.$route.params.toolGroupsId
    this.getList()
    this.getDepartList()
  },
  methods: {
    // 排序
    sortChange(column) {
      this.$mySort(this.queryParams, column, this.getList)
    },
    /** 查询列表 */
    getList() {
      this.loading = true
      getProductCheckById(this.queryParams).then(res => {
        this.list = res.data
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 获取站点列表
    getDepartList() {
      switchSite().then(res => {
        this.departList = res.data
      })
    },
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
      this.dialogType = 'edit'
      this.dialogVisible = true
    },
    /** 删除按钮操作 */
    handleDelete(scope) {
      const id = scope.row.id
      this.$confirm('是否确认删除该数据项', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return delToolInfo(id)
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
            updateToolInfo(this.formData).then(res => {
              this.msgSuccess(res.msg)
              this.dialogVisible = false
              this.getList()
            })
          } else {
            console.log('??新增', this.formData)
            postToolInfo(this.formData).then(res => {
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
    // 表单重置
    reset() {
      this.formData = {
        toolGroupId: this.$route.params.toolGroupsId,
        toolNo: undefined
      }
      this.resetForm('formData')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

