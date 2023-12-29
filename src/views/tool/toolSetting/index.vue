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
            v-hasPermi="['tool:toolSetting:add']"
            type="success"
            icon="el-icon-plus"
            size="small"
            @click="handleAdd"
          >新增
          </el-button>
          <el-button v-hasPermi="['tool:toolSetting:excel']" :loading="btnLoading" type="warning" icon="el-icon-download" size="small" @click="handleExport">导出</el-button>
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
    <!-- 弹出层(添加/编辑刀具组) -->
    <el-dialog
      v-dialogDrag
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      :visible.sync="dialogVisible"
      :title="dialogType==='edit'?'编辑刀具组':'新增刀具组'"
      class="dialog"
      width="1100px"
    >
      <el-form
        ref="formData"
        :model="formData"
        :rules="rules"
        label-width="115px"
        style="width: 980px; margin-left:40px;"
      >
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="订单编号" prop="orderId">
              <el-select v-model="formData.orderId" placeholder="订单编号" style="width: 180px;" @change="changeOrder">
                <el-option v-for="(item,index) in orderList" :key="index" :label="item.orderNo" :value="item.orderId">
                  <span>{{ item.orderNo }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item v-if="lineList.length > 0 || formData.lineId !==undefined " label="产线名称" prop="lineId">
              <el-select v-model="formData.lineId" placeholder="请选择产线" style="width: 180px;" @change="changeLine">
                <el-option v-for="(item,index) in lineList" :key="index" :label="item.lineName" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item v-if="equipmentList.length > 0 || formData.equipmentId !==undefined" label="机床设备编号" prop="equipmentId">
              <el-select v-model="formData.equipmentId" placeholder="请选择机床设备编号" style="width: 180px;">
                <el-option v-for="(item,index) in equipmentList" :key="index" :label="item.equipmentName" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-card class="box-card font-color normalFormItem" shadow="never">
          <div slot="header" style="display: flex;align-items: center;justify-content: space-between;">
            <span style="font-weight: 700">刀具组</span>
            <el-button type="primary" size="mini" @click="addClass">新增刀具</el-button>
          </div>
          <div class="form-item" style="padding:10px 20px">
            <el-row :gutter="10">
              <el-col v-for="(items, i) in formData.toolGroupList" :key="i" :span="8">
                <el-form-item label="刀具组编号" :prop="'toolGroupList.' + i + '.groupNo'">
                  <el-select v-model="items.groupNo" value-key="groupNo" :disabled="formData.equipmentId === undefined" placeholder="请选择刀具组编号" style="width: 100%;" @change="changeGroup">
                    <el-option v-for="(item,index) in toolGroupLists" :key="index" :label="item.groupNo" :value="item.groupNo" />
                  </el-select>
                </el-form-item>
                <el-form-item label="刀具编号" :prop="'toolGroupList.' + i + '.toolNoList'">
                  <el-select v-model="items.toolNoList" multiple :disabled="formData.equipmentId === undefined" placeholder="请选择刀具组编号" style="width: 100%;">
                    <el-option v-for="(item,index) in toolList" :key="index" :label="item.toolNo" :value="item.toolNo" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-card>

      </el-form>
      <div style="text-align:right;">
        <el-button @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getToolList, getEquipmentByLine, getToolGroupsAll, getToolByEqIdAndGroupNo, addToolConfigure, putToolConfigure, getToolConfigureById, delToolConfigure } from '@/api/check/toolSetting'

import { getLineByOrderId } from '@/api/commens'
import { downloadToolConfig } from '@/api/excel/excel'
import { mapGetters } from 'vuex'
/*
  queryParams:角色列表请求参数
  total:列表总条数
  dialogVisible:是否显示 Dialog
  dialogType:控制表头显示内容
  role:弹出层数据对象
* */

export default {
  name: 'ToolSetting',
  data() {
    return {
      // 表格信息
      column: [
        { type: 'index', index: this.indexMethod },
        { label: '设备编号', prop: 'equipmentNo' },
        { label: '设备ID', prop: 'equipmentId' },
        { label: '刀具组编号', prop: 'groupNo' },
        { label: '刀具编号', prop: 'toolNo' },
        { label: '新增时间', prop: 'createTime' },
        { label: '操作', render: (h, scope) => {
          return (
            <div id='btnWrap'>
              <el-button
                v-hasPermi={['tool:toolSetting:edit']}
                type='primary'
                size='mini'
                onClick={() => { this.handleEdit(scope) }}
              >编辑</el-button>
              <el-button
                v-hasPermi={['tool:toolSetting:del']}
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
      lineList: [], // 产线列表
      equipmentList: [], // 起床列表
      toolGroupLists: [], // 刀具组列表
      toolList: [],
      // 分页数据
      total: 0,
      dialogVisible: false,
      dialogType: 'new',
      // 表单信息
      formData: {},

      productList: [],
      // 表单校验
      rules: {
      }
    }
  },
  computed: { ...mapGetters(['orderList']) },
  mounted() {
    this.getList()
    this.handleToolGroupsAll()
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
      getToolList(this.queryParams).then(res => {
        this.list = res.data
        this.total = res.count || 0
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 新增按钮
    handleAdd() {
      this.reset()
      this.handleToolGroupsAll()
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    // 选择订单列表
    changeOrder(id) {
      this.formData.lineId = undefined
      this.handleLine(id)
    },
    // 根据订单id获取产线列表
    handleLine(id) {
      getLineByOrderId(id).then(res => {
        this.lineList = res.data
      })
    },
    // 根据产线查询机床列表
    changeLine(id) {
      this.formData.equipmentId = undefined
      getEquipmentByLine(id).then(res => {
        this.equipmentList = res.data
      })
    },
    // 查询所有道具组
    handleToolGroupsAll() {
      getToolGroupsAll().then(res => {
        this.toolGroupLists = res.data
      })
    },
    // 根据刀具组id查询所有刀具
    changeGroup(e) {
      this.formData.toolNo = undefined

      const id = this.toolGroupLists.filter(item => item.groupNo === e)[0].toolGroupsId
      this.formData.groupNo = e
      const myData = Object.assign(this.formData, { toolGroupsId: id })
      getToolByEqIdAndGroupNo(myData).then(res => {
        this.toolList = res.data
      })
    },
    // 编辑按钮操作
    handleEdit(scope) {
      getToolConfigureById(scope.row.id).then(res => {
        this.formData = {
          orderId: res.data.orderId,
          lineId: res.data.lineId,
          equipmentId: res.data.equipmentId,
          groupNo: res.data.groupNo,
          toolNo: res.data.toolNo,
          toolGroupList: [
            {
              groupNo: res.data.groupNo,
              toolNoList: [res.data.toolNo]
            }
          ]
        }

        this.handleLine(this.formData.orderId)
        this.dialogType = 'edit'
        this.dialogVisible = true
      })
    },
    // 新增刀具
    addClass() {
      const data = {
        groupNo: undefined,
        toolNoList: []
      }
      var detailData = JSON.parse(JSON.stringify(this.formData))
      this.formData = {}
      this.formData = JSON.parse(JSON.stringify(detailData))
      this.formData.toolGroupList.push(data)
    },
    /** 删除按钮操作 */
    handleDelete(scope) {
      const id = scope.row.id
      this.$confirm('是否确认删除该数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return delToolConfigure(id)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(() => {})
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['formData'].validate(valid => {
        if (valid) {
          if (this.dialogType !== 'new') {
            putToolConfigure(this.formData).then(res => {
              this.$message.success(res.msg)
              this.dialogVisible = false
              this.getList()
            })
          } else {
            addToolConfigure(this.formData).then(res => {
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
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 导出按钮
    handleExport() {
      this.btnLoading = true
      downloadToolConfig(this.queryParams).then((res) => {
        this.btnLoading = false
        if (!res.data) return
        this.$downloadFunc(res, '刀具配置')
      }).catch((err) => {
        console.log('err', err)
        this.btnLoading = false
      })
    },
    // 表单重置
    reset() {
      this.formData = {
        orderId: undefined,
        lineId: undefined,
        equipmentId: undefined,
        groupNo: undefined,
        toolNo: undefined,
        toolGroupList: [
          {
            groupNo: undefined,
            toolNoList: []
          }
        ]
      }
      this.lineList = [] // 产线列表
      this.equipmentList = [] // 起床列表
      this.toolList = []
      this.resetForm('formData')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

