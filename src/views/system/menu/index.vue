<template>
  <div class="app-container">
    <el-card v-hasPermi="['system:menu:add']" shadow="never" class="card">
      <el-form v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true">
        <el-form-item>
          <el-button v-hasPermi="['system:menu:add']" type="success" icon="el-icon-plus" size="small" @click="handleAdd">
            新增
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!--表格-->
    <el-table
      ref="table"
      v-loading="loading"
      :data="menuList"
      row-key="menuId"
      style="width: 100%;"
      height="600"
      border
    >
      <el-table-column
        label="菜单名称"
        prop="menuName"
        :show-overflow-tooltip="true"
        width="240"
      />
      <el-table-column
        label="图标"
        prop="icon"
        align="center"
        width="120"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.icon ? scope.row.icon : ''" />
        </template>
      </el-table-column>
      <el-table-column
        label="排序"
        prop="sortNo"
        align="center"
        width="60"
        show-overflow-tooltip
      />
      <el-table-column
        label="权限表标识"
        prop="perms"
        align="center"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="组件路径"
        prop="component"
        align="center"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="状态"
        prop="hidden"
        align="center"
        width="100"
        :formatter="statusFormat"
        show-overflow-tooltip
      />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="240"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <el-button
            v-hasPermi="['system:menu:edit']"
            size="mini"
            type="primary"
            @click="handleUpdate(scope.row)"
          >编辑
          </el-button>
          <el-button
            v-hasPermi="['system:menu:add']"
            size="mini"
            type="success"
            @click="handleAdd(scope.row)"
          >新增
          </el-button>
          <el-button
            v-hasPermi="['system:menu:del']"
            size="mini"
            type="danger"
            @click="handleDelete(scope.row)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 弹出层 -->
    <el-dialog v-dialogDrag :close-on-click-modal="false" :modal-append-to-body="false" :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑菜单':'新增菜单'" class="dialog" width="530px">
      <el-form
        ref="menuForm"
        :model="menuForm"
        :rules="rules"
        label-width="90px"
        style="width: 400px; margin-left:40px;"
      >
        <el-form-item label="上级菜单">
          <treeselect
            v-model="menuForm.parentId"
            :options="menuOptions"
            :normalizer="normalizer"
            :show-count="true"
            placeholder="选择上级菜单"
          />
        </el-form-item>
        <el-form-item label-width="0">
          <div class="lable-swich">菜单类型</div>
          <div class="radio-wrap">
            <el-radio-group v-model="menuForm.menuType" @change="handleMenuType">
              <el-radio label="M">目录</el-radio>
              <el-radio label="C">菜单</el-radio>
              <el-radio label="F">按钮</el-radio>
            </el-radio-group>
          </div>
        </el-form-item>
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="menuForm.menuName" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item v-if="menuForm.menuType !== 'F'" label="菜单图标">
          <el-popover
            placement="bottom-start"
            width="460"
            trigger="click"
            @show="$refs['iconSelect'].reset()"
          >
            <IconSelect ref="iconSelect" @selected="selected" />
            <el-input slot="reference" v-model="menuForm.icon" placeholder="点击选择图标" readonly>
              <svg-icon
                v-if="menuForm.icon"
                slot="prefix"
                :icon-class="menuForm.icon"
                class="el-input__icon"
                style="height: 32px;width: 16px;"
              />
              <i v-else slot="prefix" class="el-icon-search el-input__icon" />
            </el-input>
          </el-popover>
        </el-form-item>
        <el-form-item label="显示排序" prop="sortNo">
          <el-input-number v-model="menuForm.sortNo" controls-position="right" :min="0" />
        </el-form-item>
        <el-form-item v-if="menuForm.menuType === 'F'" label="权限标识">
          <el-input v-model="menuForm.perms" placeholder="请权限标识" maxlength="50" />
        </el-form-item>
        <el-form-item v-if="menuForm.menuType === 'F'" label="请求类型" prop="requestMethod">
          <el-select v-model="menuForm.requestMethod" placeholder="Please select">
            <el-option
              v-for="item in options"
              :key="item.label"
              :label="item.label"
              :value="item.label"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="menuForm.menuType === 'F'" label="接口地址" prop="path">
          <el-input v-model="menuForm.path" placeholder="接口地址" maxlength="50" />
        </el-form-item>
        <el-form-item v-if="menuForm.menuType !== 'F'" label="组件地址" prop="component">
          <el-input v-model="menuForm.component" placeholder="请输入组件地址" />
        </el-form-item>
        <el-form-item v-if="menuForm.menuType !== 'F'" label="路由地址" prop="path">
          <el-input v-model="menuForm.path" placeholder="请输入路由地址" />
        </el-form-item>
        <el-form-item v-if="menuForm.menuType !== 'F'" label-width="0">
          <div class="lable-swich">显示状态</div>
          <div class="radio-wrap">
            <el-radio-group v-model="menuForm.hidden">
              <el-radio :label="0">是</el-radio>
              <el-radio :label="1">否</el-radio>
            </el-radio-group>
          </div>
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
import { listMenu, addMenu, delMenu, getMenu, updateMenu } from '@/api/system/menu' // 根据角色ID查询菜单下拉树结构
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import IconSelect from '@/components/iconSelect' // icon选择模版
export default {
  name: 'Menu',
  components: { Treeselect, IconSelect },
  data() {
    return {
      // 遮罩层(加载)
      loading: false,
      // 显示搜索条件
      showSearch: true,
      // 分页搜索参数
      queryParams: {
        menuName: undefined,
        status: undefined
      },
      // 状态
      statusOptions: [{
        label: '正常',
        value: 1
      }, {
        label: '停用',
        value: 0
      }],
      // 菜单表格树数据
      menuList: [],
      // 菜单树选项
      menuOptions: [],
      // 是否显示 Dialog
      dialogVisible: false,
      // 头部信息显示 Dialog
      dialogType: 'new',
      // 表单参数
      menuForm: {},
      options: [
        { label: 'GET' },
        { label: 'POST' },
        { label: 'PUT' },
        { label: 'DELETE' },
        { label: 'PATCH' },
        { label: 'HEAD' },
        { label: 'OPTIONS' },
        { label: 'TRACE' }
      ],
      // 表单校验
      rules: {
        menuName: [
          { required: true, message: '菜单名称不能为空', trigger: 'blur' }
        ],
        component: [
          { required: true, message: '组件地址不能为空', trigger: 'blur' }
        ],
        sortNo: [
          { required: true, message: '菜单顺序不能为空', trigger: 'blur' }
        ],
        path: [
          { required: true, message: '路由地址不能为空', trigger: 'blur' }
        ],
        requestMethod: [
          { required: true, message: '请选择请求类型', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  // 解决表格错位问题
  activated() {
    this.$nextTick(() => {
      this.$refs.table.doLayout()
    })
  },
  methods: {
    // 清楚表单验证结果
    handleMenuType() {
      this.$nextTick(() => {
        this.$refs.menuForm.clearValidate()
      })
    },
    // 选择图标
    selected(name) {
      this.menuForm.icon = name
    },
    /** 转换菜单数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.menuId,
        label: node.menuName,
        children: node.children
      }
    },
    /** 查询菜单列表 */
    getList() {
      this.loading = true
      listMenu().then(response => {
        this.menuList = this.$Dz.handleTree(response.data, 'menuId')
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    /** 查询菜单下拉树结构 */
    getTreeselect() {
      listMenu().then(response => {
        this.menuOptions = []
        const menu = { menuId: '0', menuName: '主类目', children: [] }
        menu.children = this.$Dz.handleTree(response.data, 'menuId')
        this.menuOptions.push(menu)
      })
    },
    /** 新增按钮 */
    handleAdd(row) {
      this.reset()
      this.getTreeselect()
      if (row != null && row.menuId) {
        this.menuForm.parentId = row.menuId
      } else {
        this.menuForm.parentId = 0
      }
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    /** dialog确认按钮 */
    submitForm() {
      this.$refs['menuForm'].validate(valid => {
        if (valid) {
          if (this.menuForm.menuId !== undefined) {
            updateMenu(this.menuForm).then(response => {
              this.msgSuccess('修改成功')
              this.dialogVisible = false
              this.getList()
            })
          } else {
            addMenu(this.menuForm).then(response => {
              this.msgSuccess('新增成功')
              this.dialogVisible = false
              this.getList()
            })
          }
        }
      })
    },
    /** 编辑按钮操作 */
    handleUpdate(row) {
      // this.reset()
      this.getTreeselect()
      getMenu(row.menuId).then(response => {
        this.reset()
        this.menuForm = response.data
        this.dialogVisible = true
        this.dialogType = 'edit'
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm('是否确认删除名称为"' + row.menuName + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delMenu(row.menuId)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(() => {})
    },
    // 状态参数格式化
    statusFormat(row, column) {
      if (row.menuType === 'F') {
        return ''
      }
      const statusObj = {
        0: '禁用',
        1: '正常'
      }
      return statusObj[row.status]
    },
    // 表单重置
    reset() {
      this.menuForm = {
        menuId: undefined,
        parentId: 0,
        menuName: undefined,
        icon: undefined,
        sortNo: 0,
        menuType: 'M',
        hidden: 0
      }
      this.$nextTick(() => {
        this.$refs.menuForm.clearValidate()
      })
    }
  }
}
</script>

<style>
.el-input__prefix {
  display: flex;
  align-items: center;
}
</style>
