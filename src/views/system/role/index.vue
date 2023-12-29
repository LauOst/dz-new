<template>
  <div class="app-container">
    <el-card shadow="never" class="card">
      <el-form v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true">
        <el-form-item prop="roleName">
          <el-input
            v-model="queryParams.roleName"
            placeholder="角色名称"
            clearable
            size="small"
            style="width: 180px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item prop="roleKey">
          <el-input
            v-model="queryParams.roleKey"
            placeholder="权限字符"
            clearable
            size="small"
            style="width: 180px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item prop="status">
          <el-select
            v-model="queryParams.status"
            placeholder="角色状态"
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
        <el-form-item>
          <start-date v-model="queryParams.startTime" />
          <end-date v-model="queryParams.endTime" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
          <el-button v-hasPermi="['system:role:add']" type="success" icon="el-icon-plus" size="small" @click="handleAddRole">
            新增
          </el-button>
          <el-button v-hasPermi="['system:role:excel']" :loading="btnLoading" type="warning" icon="el-icon-download" size="small" @click="handleExport">导出</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <dz-table
      v-loading="loading"
      :column="column"
      :data="roleList"
      :total="total"
      pagination
      :page.sync="queryParams.page"
      :limit.sync="queryParams.limit"
      @pagination="getList"
      @sortChange="sortChange"
    />
    <!-- 弹出层 -->
    <el-dialog v-dialogDrag :close-on-click-modal="false" :modal-append-to-body="false" :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑角色':'新增角色'" class="dialog" width="850px">
      <el-form
        ref="role"
        :model="role"
        :rules="rules"
        label-width="90px"
        style="width: 730px; margin-left:40px;"
      >
        <el-row :gutter="40">
          <el-col :span="12">
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="role.roleName" placeholder="请输入角色名称" />
            </el-form-item>
            <el-form-item label="权限字符" prop="roleCode">
              <el-input v-model="role.roleCode" placeholder="请输入权限字符" />
            </el-form-item>
            <el-form-item label-width="0">
              <div class="lable-swich">状态</div>
              <div class="radio-wrap">
                <el-radio-group v-model="role.status">
                  <el-radio
                    v-for="dict in statusOptions"
                    :key="dict.value"
                    :label="dict.value"
                  >{{ dict.label }}</el-radio>
                </el-radio-group>
              </div>
            </el-form-item>
            <el-form-item label-width="0">
              <div class="label-top">描述</div>
              <el-input
                v-model="role.description"
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
import { listRole, getRole, addRole, updateRole, delRole, changeRoleStatus } from '@/api/system/role' // 角色列表请求
import { treeselect, roleMenuTreeselect } from '@/api/system/menu'
import { downloadRole } from '@/api/excel/excel'
/*
  loading:表格loading
  showSearch:显示搜索状态
  queryParams:角色列表请求参数
  dateRange:日期范围
  roleList:角色列表
  total:角色列表总条数
  dialogVisible:是否显示 Dialog
  dialogType:控制表头显示内容
  role:弹出层数据对象
  defaultProps:配置子树节点属性
  checkStrictly:在显示复选框的情况下，是否严格的遵循父子不互相关联的做法
  menuOptions:树数据
* */

export default {
  // name: 'Role',
  data() {
    return {
      // 表格信息
      column: [
        { type: 'index', index: this.indexMethod },
        { label: '角色名称', prop: 'roleName' },
        { label: '创建人', prop: 'createBy' },
        { label: '权限字符', prop: 'roleCode' },
        { label: '描述', prop: 'description' },
        { label: '状态', render: (h, scope) => {
          return (
            <div>
              <el-switch
                v-model={ scope.row.status}
                active-value={1}
                inactive-value={0}
                disabled={scope.row.basicsRole === 0}
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
                v-hasPermi={['system:role:edit']}
                type='primary'
                size='mini'
                onClick={() => { this.handleEdit(scope) }}
                // onClick={() => { this.ceshi(h, scope) }}
              >编辑</el-button>
              <el-button
                v-hasPermi={['system:role:del']}
                type='danger'
                size='mini'
                disabled={scope.row.basicsRole === 0}
                onClick={() => { this.handleDelete(scope) }}
              >删除</el-button>
            </div>
          )
          // )
        }, width: 240 }
      ],
      // 遮罩层(加载)
      loading: false,
      btnLoading: false,
      // 显示搜索条件
      showSearch: true,
      // 分页搜索参数
      queryParams: {
        page: 1,
        limit: 20,
        roleName: undefined,
        roleKey: undefined,
        status: undefined,
        field: undefined,
        type: undefined,
        startTime: undefined,
        endTime: undefined
      },
      // 日期范围
      dateRange: [],
      // 角色列表
      roleList: [],
      // 分页数据
      total: 0,
      // 弹窗层控制
      dialogVisible: false,
      // 弹窗title信息
      dialogType: 'new',
      // 表单
      role: {},
      // 配置子树节点属性
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      checkStrictly: false,
      // 树数据
      menuOptions: [],
      // 状态
      statusOptions: [{
        label: '正常',
        value: 1
      }, {
        label: '停用',
        value: 0
      }],
      // 表单校验
      rules: {
        roleName: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ],
        roleCode: [
          { required: true, message: '权限字符不能为空', trigger: 'blur' }
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
    /** 查询角色列表 */
    getList() {
      this.loading = true
      listRole(this.queryParams).then(
        response => {
          this.roleList = response.data
          this.total = response.count
          this.loading = false
        }
      ).catch(() => {
        this.loading = false
      })
    },
    /** 查询菜单树结构 */
    getMenuTreeselect() {
      treeselect().then(response => {
        this.menuOptions = response.data
      })
    },
    // 新增角色按钮
    handleAddRole() {
      this.reset()
      this.getMenuTreeselect()
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    // 编辑权限按钮
    handleEdit(scope) {
      this.reset()
      // 获取角色ID
      const roleId = scope.row.roleId
      // 查询菜单下拉树结构
      const roleMenu = this.getRoleMenuTreeselect(roleId)
      // 查询角色详细
      getRole(roleId).then(response => {
        this.dialogType = 'edit'
        this.dialogVisible = true
        this.role = response.data
        this.$nextTick(() => {
          roleMenu.then(res => {
            // 根据后端返回的checkedKeys,设置已选择的树
            setTimeout(() => {
              res.data.checkedKeys.forEach(value => {
                this.$refs.tree.setChecked(value, true, false)
              })
            }, 100)
          })
        })
      })
    },
    /** 删除按钮操作 */
    handleDelete(scope) {
      const roleId = scope.row.roleId
      this.$confirm('是否确认删除角色为"' + scope.row.roleName + '"的数据项', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return delRole(roleId)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(() => {})
    },
    /** 根据角色ID查询菜单树结构 */
    getRoleMenuTreeselect(roleId) {
      return roleMenuTreeselect(roleId).then(response => {
        this.menuOptions = response.data.menus
        return response
      })
    },
    // 角色状态修改
    handleStatusChange(row) {
      const text = row.status === 1 ? '启用' : '停用'
      this.$confirm('确认要"' + text + '""' + row.roleName + '"角色吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return changeRoleStatus(row.roleId, row.status)
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
      this.$refs['role'].validate(valid => {
        if (valid) {
          if (this.role.roleId !== undefined) {
            this.role.permissionId = this.getMenuAllCheckedKeys()
            updateRole(this.role).then(response => {
              this.msgSuccess('修改成功')
              this.dialogVisible = false
              this.getList()
            })
          } else {
            this.role.permissionId = this.getMenuAllCheckedKeys()
            addRole(this.role).then(response => {
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
      // this.$refs.queryForm.validate((valid) => {
      //   if (valid) {
      //     this.queryParams.page = 1
      //     this.getList()
      //   }
      // })
    },
    /** 重置按钮操作 */
    async resetQuery() {
      // this.dateRange = []
      await this.resetForm('queryForm')
      await this.handleQuery()
    },
    // 导出按钮
    handleExport() {
      this.btnLoading = true
      downloadRole(this.queryParams).then((res) => {
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
      this.role = {
        roleId: undefined,
        description: undefined,
        roleName: undefined,
        roleCode: undefined,
        roleSort: 0,
        status: 1,
        permissionId: []
      }
      this.resetForm('role')
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
