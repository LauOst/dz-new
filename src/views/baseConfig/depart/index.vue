<template>
  <div class="app-container">
    <el-card shadow="never" class="card">
      <el-form v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true">
        <el-form-item prop="departName">
          <el-input
            v-model="queryParams.departName"
            placeholder="站点名称"
            clearable
            size="small"
            style="width: 180px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item prop="orgCode">
          <el-input
            v-model="queryParams.realname"
            placeholder="机构编码"
            clearable
            size="small"
            style="width: 180px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item prop="status">
          <el-select
            v-model="queryParams.status"
            placeholder="用户状态"
            clearable
            size="small"
            style="width: 180px"
          >
            <el-option
              v-for="dict in statusOptions"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <!--        <el-form-item>-->
        <!--          <el-date-picker-->
        <!--            v-model="dateRange"-->
        <!--            size="small"-->
        <!--            style="width: 240px"-->
        <!--            value-format="yyyy-MM-dd"-->
        <!--            type="daterange"-->
        <!--            unlink-panels-->
        <!--            range-separator="-"-->
        <!--            start-placeholder="开始日期"-->
        <!--            end-placeholder="结束日期"-->
        <!--          />-->
        <!--        </el-form-item>-->
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
          <el-button v-hasPermi="['system:depart:add']" type="success" icon="el-icon-plus" size="small" @click="handleAdd">
            新增
          </el-button>
          <el-button v-hasPermi="['system:depart:excel']" :loading="btnLoading" type="warning" icon="el-icon-download" size="small" @click="handleExport">导出</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <dz-table
      v-loading="loading"
      :column="column"
      :data="departList"
      :total="total"
      pagination
      :page.sync="queryParams.page"
      :limit.sync="queryParams.limit"
      @pagination="getList"
      @sortChange="sortChange"
    />
    <!--    <el-table-->
    <!--      ref="table"-->
    <!--      v-loading="loading"-->
    <!--      :data="departList"-->
    <!--      style="width: 100%;"-->
    <!--      border-->
    <!--      height="600"-->
    <!--    >-->
    <!--      <el-table-column type="index" label="序号" :index="indexMethod" width="100" align="center" fixed="left" show-overflow-tooltip />-->
    <!--      <el-table-column-->
    <!--        prop="departName"-->
    <!--        label="站点名称"-->
    <!--        align="center"-->
    <!--        show-overflow-tooltip-->
    <!--      />-->
    <!--      <el-table-column-->
    <!--        prop="createBy"-->
    <!--        label="创建人"-->
    <!--        align="center"-->
    <!--        show-overflow-tooltip-->
    <!--      />-->
    <!--      <el-table-column-->
    <!--        prop="orgCode"-->
    <!--        label="机构编码"-->
    <!--        align="center"-->
    <!--        show-overflow-tooltip-->
    <!--      />-->
    <!--      <el-table-column-->
    <!--        prop="status"-->
    <!--        label="状态"-->
    <!--        width="120"-->
    <!--        align="center"-->
    <!--        show-overflow-tooltip-->
    <!--      >-->
    <!--        <template slot-scope="scope">-->
    <!--          <el-switch-->
    <!--            v-model="scope.row.status"-->
    <!--            :active-value="1"-->
    <!--            :inactive-value="0"-->
    <!--            @change="handleStatusChange(scope.row)"-->
    <!--          />-->
    <!--        </template>-->
    <!--      </el-table-column>-->
    <!--      <el-table-column label="创建时间" align="center" prop="createTime" show-overflow-tooltip>-->
    <!--        <template slot-scope="scope">-->
    <!--          <span>{{ scope.row.createTime }}</span>-->
    <!--        </template>-->
    <!--      </el-table-column>-->

    <!--      <el-table-column align="center" label="操作" width="180" show-overflow-tooltip>-->
    <!--        <template slot-scope="scope">-->
    <!--          <el-button v-hasPermi="['system:depart:edit']" type="primary" size="mini" @click="handleEdit(scope)">-->
    <!--            编辑-->
    <!--          </el-button>-->
    <!--          <el-button v-hasPermi="['system:depart:del']" type="danger" size="mini" @click="handleDelete(scope)">-->
    <!--            删除-->
    <!--          </el-button>-->
    <!--        </template>-->
    <!--      </el-table-column>-->
    <!--    </el-table>-->
    <!-- 弹出层 -->
    <el-dialog v-dialogDrag :close-on-click-modal="false" :modal-append-to-body="false" :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑站点':'新增站点'" class="dialog" width="850px">
      <el-form ref="departForm" :model="departForm" :rules="rules" label-width="90px" style="width: 730px; margin-left:40px;">
        <el-row :gutter="40">
          <el-col :span="12">
            <el-form-item label="站点名称" prop="departName">
              <el-input v-model="departForm.departName" placeholder="请输入站点名称" />
            </el-form-item>
            <el-form-item label="机构编码" prop="orgCode">
              <el-input v-model="departForm.orgCode" placeholder="请输入机构编码" />
            </el-form-item>
            <el-form-item label="站点顺序" prop="roleSort">
              <el-input-number v-model="departForm.departOrder" controls-position="right" :min="0" style="width: 100%" />
            </el-form-item>
            <el-form-item label-width="0">
              <div class="lable-swich">状态</div>
              <div class="radio-wrap">
                <el-radio-group v-model="departForm.status">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </div>
            </el-form-item>
            <el-form-item label-width="0">
              <div class="label-top">描述</div>
              <el-input
                v-model="departForm.description"
                :autosize="{ minRows: 2, maxRows: 4}"
                type="textarea"
                placeholder="请输入内容"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="0">
              <div class="label-top">权限菜单</div>
              <el-tree
                ref="tree"
                :check-strictly="checkStrictly"
                :data="menuOptions"
                :props="defaultProps"
                show-checkbox
                node-key="id"
                class="permission-tree"
              />
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
      <div style="text-align:right;">
        <el-button @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listDepart, addDepart, getDepart, updateDepart, delDepart, departMenuTreeselect, changeDepartStatus } from '@/api/system/depart'
import { downloadDepart } from '@/api/excel/excel'
/*
  queryParams:角色列表请求参数
  departList:站点列表
  total:列表总条数
  dialogVisible:是否显示 Dialog
  dialogType:控制表头显示内容
  role:弹出层数据对象
  defaultProps:配置子树节点属性
  checkStrictly:在显示复选框的情况下，是否严格的遵循父子不互相关联的做法
  menuOptions:树数据
* */

export default {
  name: 'Depart',
  data() {
    return {
      // 表格信息
      column: [
        { type: 'index', index: this.indexMethod },
        { label: '站点名称', prop: 'departName' },
        { label: '创建人', prop: 'createBy' },
        { label: '机构编码', prop: 'orgCode' },
        { label: '状态', render: (h, scope) => {
          return (
            <div>
              <el-switch
                v-model={ scope.row.status}
                active-value={1}
                inactive-value={0}
                onChange={() => { this.handleStatusChange(scope.row) }}
              />
            </div>
          )
          // )
        } },
        { label: '创建时间', prop: 'createTime' },
        { label: '操作', render: (h, scope) => {
          return (
            <div id='btnWrap'>
              <el-button
                v-hasPermi={['system:depart:edit']}
                type='primary'
                size='mini'
                onClick={() => { this.handleEdit(scope) }}
                // onClick={() => { this.ceshi(h, scope) }}
              >编辑</el-button>
              <el-button
                v-hasPermi={['system:depart:del']}
                type='danger'
                size='mini'
                onClick={() => { this.handleDelete(scope) }}
              >删除</el-button>
            </div>
          )
          // )
        }, width: 240 }
      ],
      loading: true,
      btnLoading: false,
      // 显示搜索条件
      showSearch: true,
      // 分页搜索参数
      queryParams: {
        page: 1,
        limit: 20,
        departName: undefined,
        orgCode: undefined,
        status: undefined,
        field: undefined,
        type: undefined
      },
      // 日期范围
      // dateRange: [],
      statusOptions: [{
        label: '正常',
        value: 1
      }, {
        label: '停用',
        value: 0
      }],
      // 站点列表
      departList: [],
      // 分页数据
      total: 0,
      dialogVisible: false,
      dialogType: 'new',
      // 表单信息
      departForm: {},
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      checkStrictly: false,
      menuOptions: [],
      // 表单校验
      rules: {
        departName: [
          { required: true, message: '站点名称不能为空', trigger: 'blur' }
        ],
        orgCode: [
          { required: true, message: '机构编码不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    routesData() {
      return this.routes
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
    // 排序
    sortChange(column) {
      this.$mySort(this.queryParams, column, this.getList)
    },
    /** 查询站点列表 */
    getList() {
      this.loading = true
      listDepart(this.queryParams).then(
        response => {
          this.departList = response.data
          this.total = response.count
          this.loading = false
        }
      ).catch(() => {
        this.loading = false
      })
    },
    /** 查询菜单树结构 */
    getMenuTreeselect() {
      departMenuTreeselect().then(response => {
        this.menuOptions = response.data.permissions
      })
    },
    /** 根据角色ID查询菜单树结构 */
    getDeparMenuTreeselect(departId) {
      return departMenuTreeselect(departId).then(response => {
        this.menuOptions = response.data.permissions
        return response
      })
    },
    // 新增站点按钮
    handleAdd() {
      this.reset()
      this.getMenuTreeselect()
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    // 编辑权限按钮
    handleEdit(scope) {
      this.reset()
      // 获取角色ID
      const departId = scope.row.departId
      // 查询菜单下拉树结构
      const roleMenu = this.getDeparMenuTreeselect(departId)
      getDepart(departId).then(res => {
        this.dialogType = 'edit'
        this.dialogVisible = true
        this.departForm = res.data
        // 查询角色详细
        this.$nextTick(() => {
          roleMenu.then(res => {
            // 根据后端返回的checkedKeys,设置已选择的树
            setTimeout(() => {
              res.data.checkedKeys.forEach(value => {
                this.$refs.tree.setChecked(value, true, false)
              })
            }, 100)

            // this.$refs.tree.setCheckedKeys(res.data.checkedKeys)
          })
        })
      })
    },
    /** 删除按钮操作 */
    handleDelete(scope) {
      const departId = scope.row.departId
      this.$confirm('是否确认删除名称为"' + scope.row.departName + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return delDepart(departId)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(() => {})
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
      this.$refs['departForm'].validate(valid => {
        if (valid) {
          if (this.departForm.departId !== undefined) {
            this.departForm.permissionId = this.getMenuAllCheckedKeys()
            updateDepart(this.departForm).then(response => {
              this.msgSuccess('修改成功')
              this.dialogVisible = false
              this.getList()
            })
          } else {
            this.departForm.permissionId = this.getMenuAllCheckedKeys()
            addDepart(this.departForm).then(response => {
              this.msgSuccess('新增成功')
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
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 导出按钮
    handleExport() {
      this.btnLoading = true
      downloadDepart(this.queryParams).then((res) => {
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
      if (this.$refs.tree !== undefined) {
        this.$refs.tree.setCheckedKeys([])
      }
      this.departForm = {
        departName: undefined,
        orgCode: undefined,
        description: undefined,
        memo: undefined,
        roleSort: 0,
        departOrder: 0,
        status: 1,
        permissionId: []
      }
      this.resetForm('departForm')
    }
  }
}
</script>

<style lang="scss" scoped>
.permission-tree {
  margin-bottom: 20px;
  max-height: 480px;
  border: 1px solid #e5e6e7;
  border-radius:4px;
  overflow: scroll;
  overflow-x: hidden;
}
/* 设置滚动条的样式 */
::-webkit-scrollbar {
  width:4px;
}
/* 滚动槽 */
::-webkit-scrollbar-track {
  border-radius:10px;
  background:rgba(0,0,0,0.1);
}
/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  border-radius:10px;
  background:rgba(0,0,0,0.1);
}
::-webkit-scrollbar-thumb:window-inactive {
  background:rgba(0,0,0,0.2);
}
</style>

