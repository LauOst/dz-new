<template>
  <div class="app-container">
    <el-card shadow="never" class="card">
      <el-form v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true">
        <el-form-item prop="username">
          <el-input
            v-model="queryParams.username"
            placeholder="用户账号"
            clearable
            size="small"
            style="width: 180px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item prop="realname">
          <el-input
            v-model="queryParams.realname"
            placeholder="用户昵称"
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
        <el-form-item>
          <start-date v-model="queryParams.startTime" />
          <end-date v-model="queryParams.endTime" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
          <el-button v-hasPermi="['system:user:add']" icon="el-icon-plus" type="success" size="small" @click="handleAddRole">
            新增
          </el-button>
          <el-button v-hasPermi="['system:user:excel']" :loading="btnLoading" type="warning" icon="el-icon-download" size="small" @click="handleExport">导出</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <dz-table
      v-loading="loading"
      :column="column"
      :data="userList"
      :total="total"
      pagination
      :page.sync="queryParams.page"
      :limit.sync="queryParams.limit"
      @pagination="getList"
      @sortChange="sortChange"
    />
    <!-- 添加或修改参数配置对话框 -->
    <el-dialog v-dialogDrag :close-on-click-modal="false" :modal-append-to-body="false" :title="dialogType==='edit'?'编辑用户':'添加用户'" :visible.sync="dialogVisible" class="dialog" width="530px">
      <el-form
        ref="userForm"
        :model="userForm"
        :rules="rules"
        label-width="90px"
        style="width: 400px; margin-left:40px;"
      >
        <el-form-item label="用户昵称" prop="realname">
          <el-input v-model="userForm.realname" placeholder="请输入用户昵称" />
        </el-form-item>
        <el-form-item v-if="userIdentity === 1 && departId === affiliationDepartId" label="用户类型" prop="userIdentity">
          <el-select v-model="userForm.userIdentity" placeholder="请选择" :disabled="userForm.id !== undefined" style="width: 100%;" @change="handleChangeIdentity">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="userForm.userIdentity === '2' || userForm.userIdentity === 2" label="归属站点" prop="affiliationDepartId">
          <el-select v-model="userForm.affiliationDepartId" placeholder="请选择" style="width: 100%;">
            <el-option v-for="item in affiliationDeparts" :key="item.id" :label="item.departName" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="userForm.userIdentity === '1' || userForm.userIdentity === 1" label="关联站点" prop="departId">
          <el-select v-model="userForm.departId" multiple placeholder="请选择" style="width: 100%;">
            <el-option v-for="item in departOptions" :key="item.id" :label="item.departName" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="userForm.id === undefined" label="用户账号" prop="username">
          <el-input v-model="userForm.username" placeholder="请输入用户名称" />
        </el-form-item>
        <el-form-item v-if="userForm.id === undefined" label="用户密码" prop="password">
          <el-input v-model="userForm.password" type="password" placeholder="请输入用户密码" />
        </el-form-item>
        <el-form-item v-if="userForm.userIdentity != '2' || userForm.userIdentity != 2" label="用户角色" prop="roleIds">
          <SelectDisabled v-model="userForm.roleIds" :list="roleOptions" />
        </el-form-item>
        <el-form-item label-width="0">
          <div class="label-top">描述</div>
          <el-input
            v-model="userForm.name"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="请输入内容"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="submitForm">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { listUser, getUser, addUser, delUser, changeUserStatus, updateUser, resetUserPwd } from '@/api/system/user'
import SelectDisabled from './components/SelectDisabled'
import { downloadUser } from '@/api/excel/excel'
/*
  queryParams:角色列表请求参数
  dateRange:日期范围
  roleList:角色列表
  total:角色列表总条数
  dialogVisible:是否显示 Dialog
  dialogType:控制表头显示内容
  role:弹出层数据对象
  affiliationDeparts:归属站点
  options:用户类型下拉数据
* */

export default {
  // name: 'User',
  components: { SelectDisabled },
  data() {
    return {
      // 表格信息
      column: [
        { type: 'index', index: this.indexMethod },
        { label: '用户账号', prop: 'username' },
        { label: '创建人', prop: 'createBy' },
        { label: '用户昵称', prop: 'realname' },
        { label: '所属站点', prop: 'departName' },
        { label: '所属站点编码', prop: 'orgCode' },
        { label: '状态', render: (h, scope) => {
          return (
            <div>
              <el-switch
                v-model={ scope.row.status}
                active-value={1}
                inactive-value={0}
                disabled={scope.row.username === this.sub}
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
                v-hasPermi={['system:user:edit']}
                type='primary'
                size='mini'
                onClick={() => { this.handleEdit(scope) }}
                // onClick={() => { this.ceshi(h, scope) }}
              >编辑</el-button>
              <el-button
                v-hasPermi={['system:user:del']}
                type='danger'
                size='mini'
                disabled={scope.row.username === this.sub}
                onClick={() => { this.handleDelete(scope) }}
              >删除</el-button>
              <el-button
                v-hasPermi={['system:user:reset']}
                type='success'
                size='mini'
                onClick={() => { this.handleResetPwd(scope.row) }}
              >重置</el-button>
            </div>
          )
          // )
        }, width: 240 }
      ],
      // 遮罩层
      loading: true,
      btnLoading: false,
      // 显示搜索条件
      showSearch: true,
      // 分页搜索参数
      queryParams: {
        page: 1,
        limit: 20,
        realname: undefined,
        username: undefined,
        status: undefined,
        field: undefined,
        type: undefined,
        startTime: undefined,
        endTime: undefined
      },
      // 日期范围
      dateRange: [],
      // 状态
      statusOptions: [{
        label: '正常',
        value: 1
      }, {
        label: '停用',
        value: 0
      }],
      // 用户列表
      userList: [],
      // 分页数据
      total: 0,
      // 弹窗层控制
      dialogVisible: false,
      // 弹窗title信息
      dialogType: 'new',
      // 表单
      userForm: {},
      // 角色列表(dialog)
      userOptions: [],
      // 角色选项
      roleOptions: [],
      // 站点选项
      departOptions: [],
      // 归属站点
      affiliationDeparts: [],
      // 用户类型下拉数据
      options: [
        {
          value: 1,
          label: '大正用户'
        }, {
          value: 2,
          label: '直属站点用户'
        }],
      // 表单校验
      rules: {
        realname: [
          { required: true, message: '用户昵称不能为空', trigger: 'blur' }
        ],
        userIdentity: [
          { required: true, message: '请选择用户类型', trigger: 'change' }
        ],
        affiliationDepartId: [
          { required: true, message: '请选择归属站点', trigger: 'change' }
        ],
        // departId: [
        //   { required: true, message: '请选择关联站点', trigger: 'change' }
        // ],
        username: [
          { required: true, message: '用户名称不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '用户密码不能为空', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              value.length < 6 ? callback(new Error()) : callback()
            },
            message: '密码不能小于6位数', trigger: 'blur'
          }
        ],
        roleIds: [
          { required: true, message: '请选择用户角色', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'userIdentity',
      'departId',
      'affiliationDepartId',
      'sub'
    ]),
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
    /** 查询用户列表 */
    getList() {
      this.loading = true
      listUser(this.queryParams).then(
        response => {
          this.userList = response.data
          this.total = response.count
          this.loading = false
        }
      ).catch(() => {
        this.loading = false
      })
    },
    // 新增用户按钮
    handleAddRole() {
      this.reset()
      getUser().then(response => {
        this.roleOptions = response.data.roles
        this.departOptions = response.data.departs
        this.affiliationDeparts = response.data.affiliationDepartIds
        this.dialogType = 'new'
        this.dialogVisible = true
      })
    },
    // 编辑用户按钮
    handleEdit(scope) {
      this.reset()

      const userId = scope.row.userId
      getUser(userId).then(response => {
        this.userForm = response.data.user
        this.roleOptions = response.data.roles
        this.departOptions = response.data.departs
        this.affiliationDeparts = response.data.affiliationDepartIds
        this.userForm.userIdentity = response.data.user.userIdentity
        this.userForm.departId = response.data.departIds
        this.userForm.roleIds = response.data.roledIds
        this.userForm = { ...this.userForm }
        this.dialogType = 'edit'
        this.dialogVisible = true
      })
    },
    // 重置按钮
    handleResetPwd(row) {
      this.$prompt('请输入"' + row.username + '"的新密码', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        resetUserPwd(row.userId, row.username, value).then(response => {
          this.msgSuccess('修改成功，新密码是：' + value)
        })
      }).catch(() => {})
    },
    /** 删除按钮操作 */
    handleDelete(scope) {
      const userIds = scope.row.userId
      const usernum = scope.row.username
      this.$confirm('是否确认删除账号为"' + usernum + '"的数据项', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delUser(userIds, usernum)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(() => {})
    },
    // 用户类型切换时触发
    handleChangeIdentity(e) {
      // 如果用户类型为直属站点将清空角色
      if (this.userForm.userIdentity === 2) {
        this.userForm.roleIds = []
      }
    },
    /** 提交按钮 */
    submitForm() {
      console.log(this.userForm)
      // 将options中绑定的用户类型字段改为Number类型
      // this.userForm.userIdentity = Number(this.userForm.userIdentity)
      this.$refs['userForm'].validate(valid => {
        if (valid) {
          if (this.userForm.id !== undefined) {
            updateUser(this.userForm).then(response => {
              this.msgSuccess('修改成功')
              this.dialogVisible = false
              this.getList()
            })
          } else {
            addUser(this.userForm).then(response => {
              this.msgSuccess('新增成功')
              this.dialogVisible = false
              this.getList()
            })
          }
        }
      })
    },
    // 用户状态修改
    handleStatusChange(row) {
      console.log('scope', row)
      const text = row.status === 1 ? '启用' : '停用'
      this.$confirm('确认要"' + text + '""' + row.username + '"用户吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return changeUserStatus(row.userId, row.status, row.username)
      }).then(() => {
        this.msgSuccess(text + '成功')
      }).catch(function() {
        row.status = row.status === 1 ? 0 : 1
      })
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.$refs.queryForm.validate((valid) => {
        if (valid) {
          this.queryParams.page = 1
          this.getList()
        }
      })
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
      downloadUser(this.queryParams).then((res) => {
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
      this.userForm = {
        affiliationDepartId: undefined,
        avatar: undefined,
        createBy: undefined,
        createTime: undefined,
        departId: [],
        id: undefined,
        realname: undefined,
        roleIds: [],
        status: undefined,
        updateBy: undefined,
        updateTime: undefined,
        useOrgCode: undefined,
        userIdentity: undefined,
        username: undefined,
        password: undefined
      }
      this.resetForm('userForm')
    }
  }
}
</script>
<style>
.none{display:none !important;}
</style>
<style lang="scss" scoped>
.permission-tree {
  margin-bottom: 30px;
}

</style>
