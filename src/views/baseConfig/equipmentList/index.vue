<template>
  <div class="app-container">
    <!-- 头部筛选 -->
    <el-card shadow="never" class="card">
      <el-form ref="queryForm" :inline="true" :model="queryParams">
        <el-form-item v-hasShow prop="orderNo">
          <el-select v-model="queryParams.orderNo" v-support size="small" style="width: 180px;" placeholder="订单编号">
            <el-option label="全部" :value="''" />
            <el-option v-for="(item,index) in orderList" :key="index" :label="item.orderNo" :value="item.orderNo">
              <span>{{ item.orderNo }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="lineId">
          <el-select v-model="queryParams.lineId" size="small" style="width: 180px;" placeholder="产线名称">
            <el-option label="全部" :value="''" />
            <el-option v-for="(item,index) in lineLists" :key="index" :label="item.lineName" :value="item.lineId" />
          </el-select>
        </el-form-item>
        <el-form-item prop="equipmentName">
          <el-input v-model="queryParams.equipmentName" v-support size="small" clearable placeholder="设备名称" style="width: 180px;" />
        </el-form-item>
        <el-form-item prop="equipmentType">
          <el-select v-model="queryParams.equipmentType" v-support size="small" placeholder="设备类型" style="width: 180px;">
            <el-option label="全部" :value="''" />
            <el-option v-for="(item,index) in equipmentList" :key="index" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
          <el-button v-hasPermi="['equipment:equipmentList:add']" type="success" icon="el-icon-plus" size="small" @click="handleAdd">
            新增
          </el-button>
          <el-button v-hasPermi="['equipment:equipmentList:excel']" :loading="btnLoading" type="warning" icon="el-icon-download" size="small" @click="handleExport">导出</el-button>
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

    <!--新增/编辑设备-->
    <el-dialog v-dialogDrag :close-on-click-modal="false" :modal-append-to-body="false" :title="dialogType==='edit'?'编辑设备':'新增设备'" :visible.sync="dialogVisible" class="dialog" width="530px">
      <el-form ref="formData" :model="formData" :rules="addFormRules" label-width="100px" style="width: 400px; margin-left:40px;">
        <el-form-item label="订单编号" prop="orderId">
          <!--          <el-select v-model="formData.orderId" :disabled="formData.id !== undefined" placeholder="订单编号" style="width: 100%;" @change="changeOrder">-->
          <el-select v-model="formData.orderId" placeholder="订单编号" style="width: 100%;" @change="changeOrder">
            <el-option v-for="(item,index) in orderList" :key="index" :label="item.orderNo" :value="item.orderId">
              <span>{{ item.orderNo }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="isShowPro" label="产线名称" prop="lineId">
          <!--          <el-select v-model="formData.lineId" :disabled="formData.id !== undefined" placeholder="请选择产线" style="width: 100%;">-->
          <el-select v-model="formData.lineId" placeholder="请选择产线" style="width: 100%;">
            <el-option v-for="(item,index) in lineList" :key="index" :label="item.lineName" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="设备类型" prop="equipmentType">
          <!--          <el-select v-model="formData.equipmentType" :disabled="formData.id !== undefined" placeholder="请选择设备类型" style="width: 100%;">-->
          <el-select v-model="formData.equipmentType" placeholder="请选择设备类型" style="width: 100%;">
            <el-option v-for="(item,index) in equipmentList" :key="index" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="设备名称" prop="equipmentName">
          <el-input v-model="formData.equipmentName" clearable placeholder="请输入设备名称" />
        </el-form-item>
        <el-form-item label="设备昵称" prop="nickName">
          <el-input v-model="formData.nickName" clearable placeholder="请输入设备昵称" />
        </el-form-item>
        <el-form-item label="设备编号" prop="equipmentCode">
          <el-input v-model="formData.equipmentCode" clearable placeholder="请输入机器人编号" />
        </el-form-item>
        <el-form-item label="安全门编号" prop="doorCode">
          <el-input v-model="formData.doorCode" clearable placeholder="请输入安全门编号" />
        </el-form-item>
        <el-form-item label="设备序号" prop="equipmentNo">
          <el-input v-model="formData.equipmentNo" clearable placeholder="请输入机器人序号" />
        </el-form-item>
        <el-form-item label="设备IP" prop="ipAddress">
          <el-input v-model="formData.ipAddress" clearable placeholder="请输入设备IP" />
        </el-form-item>
        <el-form-item label-width="0">
          <div class="lable-swich">状态</div>
          <div class="radio-wrap">
            <el-radio-group v-model="formData.isShow">
              <el-radio
                v-for="dict in statusOptions"
                :key="dict.value"
                :label="dict.value"
              >{{ dict.label }}</el-radio>
            </el-radio-group>
          </div>
        </el-form-item>
        <el-form-item label="标准作业率" prop="standardOperationRate">
          <el-input v-model="formData.standardOperationRate" oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+2)}" clearable placeholder="请输入标准作业率">
            <template slot="append">%</template>
          </el-input>
        </el-form-item>

      </el-form>

      <!-- 操作按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button type="plain" @click="dialogVisible = false">取消</el-button>
        <el-popover v-model="passVisible" placement="top" width="160">
          <p>确认提交？</p>
          <div style="text-align: right; margin: 0">
            <el-button size="small" type="text" @click="passVisible = false">取消</el-button>
            <el-button type="primary" size="small" @click="handleSubmit">确定</el-button>
          </div>
          <el-button slot="reference" class="l-m-l-10" type="primary">提交</el-button>
        </el-popover>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { getlineSelect, getLineByOrderId } from '@/api/commens' // 获取产线列表
import { listEquipment, getEquipment, updateEquipment, delEquipment, addEquipment, changeStatus } from '@/api/euipment/euipment'
import { mapGetters } from 'vuex'
import { downloadEquipment } from '@/api/excel/excel'

export default {
  name: 'EquipmentList',
  data() {
    return {
      column: [
        { type: 'index', index: this.indexMethod, fixed: true },
        { label: '订单编号', prop: 'orderNo', width: 120 },
        // { label: '归属站点', prop: 'departName', width: 120 },
        { label: '产线名称', prop: 'lineName', width: 120 },
        { label: '设备序列号', prop: 'equipmentNo', width: 120 },
        { label: '设备编号', prop: 'equipmentCode', width: 200 },
        { label: '设备名称', prop: 'equipmentName', width: 120 },
        { label: '设备昵称', prop: 'nickName', width: 120 },
        { label: '设备类型', prop: 'equipmentType', width: 120, formatter: this.equipmentFormat },
        // { label: '连接状态', prop: 'connectState', width: 120 },
        { label: '连接状态', render: (h, scope) => {
          return (
            <el-tag size='small' type={ scope.row.connectState === '联机' ? 'success' : 'danger' }>{ scope.row.connectState }</el-tag>
          )
        } },
        { label: '操作模式', prop: 'operatorMode', width: 120 },
        { label: '运行状态', prop: 'runStatus', width: 120 },
        // { label: '历史生产总数', prop: 'proNum', width: 140 },
        { label: '设备IP地址', prop: 'ipAddress', width: 140 },
        // { label: '新增人', prop: 'createBy', width: 120 },
        // { label: '新增时间', prop: 'createTime', width: 200 },
        { label: '是否显示', render: (h, scope) => {
          return (
            <div>
              <el-switch
                v-model={ scope.row.isShow}
                active-value={1}
                inactive-value={0}
                onChange={() => { this.handleStatusChange(scope.row) }}
              />
            </div>
          )
          // )
        } },
        { label: '操作', render: (h, scope) => {
          return (
            <div>
              <el-button
                v-hasPermi={['equipment:equipmentList:edit']}
                type='primary'
                size='mini'
                onClick={() => { this.handleEdit(scope.row) }}
              >编辑</el-button>
              <el-button
                v-hasPermi={['equipment:equipmentList:del']}
                type='danger'
                size='mini'
                onClick={() => { this.handleDelete(scope) }}
              >删除</el-button>
            </div>
          )
        }, width: 200, fixed: 'right' }
      ],
      // 遮罩层(加载)
      loading: false,
      btnLoading: false,
      total: 0, // 列表总条数
      queryParams: { // 查询信息
        page: 1,
        limit: 20,
        orderNo: undefined, // 订单编号
        departName: undefined, // 站点名称
        equipmentName: undefined, // 设备名称
        equipmentType: undefined, // 设备类型
        lineId: undefined, // 产线id
        field: undefined,
        type: undefined
      },
      list: [], // 表格数据
      dialogVisible: false, // 新增弹窗
      dialogType: 'new',
      passVisible: false, // 确认气泡框
      formData: {},
      addFormRules: { // 表单验证
        orderId: [
          { required: true, message: '请选择订单', trigger: 'change' }
        ],
        lineId: [
          { required: true, message: '请选择产线', trigger: 'change' }
        ],
        equipmentType: [
          { required: true, message: '请选择设备类型', trigger: 'change' }
        ],
        equipmentName: [
          { required: true, message: '请输入设备名称', trigger: 'blur' }
        ],
        nickName: [
          { required: true, message: '请输入设备昵称', trigger: 'blur' }
        ],
        equipmentCode: [
          { required: true, message: '请输入设备编号', trigger: 'blur' }
        ],
        equipmentNo: [
          { required: true, message: '请输入设备序号', trigger: 'blur' }
        ],
        standardOperationRate: [
          { required: true, message: '请输入标准作业率', trigger: 'blur' }
        ]

      },
      lineList: [], // 产线列表
      lineLists: [], // 产线列表
      equipmentList: [ // 设备列表
        {
          id: 1,
          name: '检测设备'
        },
        {
          id: 2,
          name: '机床'
        },
        {
          id: 3,
          name: '机器人'
        },
        {
          id: 4,
          name: '相机'
        },
        {
          id: 8,
          name: '淬火机'
        },
        {
          id: 9,
          name: '校直机'
        },
        {
          id: 10,
          name: '安全门'
        },
        {
          id: 11,
          name: '地轨'
        },
        {
          id: 12,
          name: '焊接机'
        }
      ],
      isShowPro: false,
      // 状态
      statusOptions: [{
        label: '正常',
        value: 1
      }, {
        label: '停用',
        value: 0
      }]
    }
  },
  computed: { ...mapGetters(['orderList']) },
  mounted() {
    this.getList()
    this.handleLines()
  },
  methods: {
    // 格式化序号
    indexMethod(index) {
      return (this.queryParams.page - 1) * this.queryParams.limit + index + 1
    },
    sortChange(column) {
      this.$mySort(this.queryParams, column, this.getList)
    },
    // 获取机器人列表
    getList() {
      this.loading = true
      listEquipment(this.queryParams).then(res => {
        this.list = res.data
        this.total = res.count || 0
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 选择订单列表
    changeOrder(id) {
      this.formData.lineId = undefined
      this.isShowPro = true
      this.handleLine(id)
    },
    // 根据订单id获取产线列表
    handleLine(id) {
      getLineByOrderId(id).then(res => {
        this.lineList = res.data
      })
    },
    // 获取产线列表
    handleLines() {
      getlineSelect().then(res => {
        this.lineLists = res.data
      }).catch(() => {
        this.loading = false
      })
    },
    // 新增设备
    handleAdd() {
      this.isShowPro = false
      this.reset()
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    // 编辑设备
    handleEdit(row) {
      this.isShowPro = true
      this.reset()
      this.dialogType = 'edit'
      const id = row.id
      getEquipment(id).then(res => {
        this.dialogVisible = true
        this.formData = res.data
        this.formData.orderId = this.formData.orderId.toString()
        this.handleLine(res.data.orderId)
      })
    },
    // 是否显示修改
    handleStatusChange(row) {
      const text = row.isShow === 1 ? '启用' : '停用'
      this.$confirm('确认要"' + text + '""' + row.nickName + '"设备吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return changeStatus(row.id, row.isShow)
      }).then(() => {
        this.msgSuccess(text + '成功')
      }).catch(function() {
        row.isShow = row.isShow === 1 ? 0 : 1
      })
    },

    // 提交设备信息
    handleSubmit() {
      this.$refs['formData'].validate((valid) => {
        if (valid) {
          if (this.formData.id !== undefined) { // 编辑
            updateEquipment(this.formData).then(res => {
              this.$message.success(res.msg)
              this.dialogVisible = false
              this.passVisible = false
              this.getList()
            })
          } else {
            addEquipment(this.formData).then(res => {
              this.$message.success(res.msg)
              this.dialogVisible = false
              this.passVisible = false
              this.getList()
            })
          }
        }
      })
    },

    /** 删除按钮操作 */
    handleDelete(scope) {
      const id = scope.row.id
      this.$confirm('是否确认删除设备名称为"' + scope.row.equipmentName + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return delEquipment(id)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(() => {})
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
      downloadEquipment(this.queryParams).then((res) => {
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
        equipmentCode: undefined, // 设备编号
        isShow: 1, // 设备编号
        equipmentName: undefined, // 设备名称
        nickName: undefined, // 设备名称
        equipmentNo: undefined, // 设备序号
        doorCode: undefined, // 安全门序号
        ipAddress: undefined, // 安全门序号
        equipmentType: undefined, // 设备类型(1--检测设备,2--机床,3--机器人)
        standardOperationRate: undefined, // 设备类型(1--检测设备,2--机床,3--机器人)
        lineId: undefined
      }
      this.resetForm('formData')
    },
    // 过滤设备类型
    equipmentFormat(row) {
      const obj = {
        1: '检测设备',
        2: '机床',
        3: '机器人',
        4: '相机',
        8: '淬火机',
        9: '校直机',
        10: '安全门',
        11: '地轨',
        12: '焊接机'
      }
      return obj[row.equipmentType]
    }
  }
}
</script>

<style>

</style>
