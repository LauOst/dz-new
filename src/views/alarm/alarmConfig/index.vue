<template>
  <div class="app-container">
    <el-card shadow="never" class="card">
      <el-form ref="queryForm" :model="queryParams" :inline="true">
        <el-form-item prop="orderId">
          <el-select v-model="queryParams.orderId" size="small" style="width: 180px;" placeholder="订单名称">
            <el-option label="全部" :value="''" />
            <el-option v-for="(item,index) in orderList" :key="index" :label="item.orderNo" :value="item.orderId" />
          </el-select>
        </el-form-item>
        <el-form-item prop="lineId">
          <el-select v-model="queryParams.lineId" placeholder="产线名称" size="small" style="width: 180px;">
            <el-option label="全部" :value="''" />
            <el-option v-for="(item,index) in lineLists" :key="index" :label="item.lineName" :value="item.lineId" />
          </el-select>
        </el-form-item>
        <el-form-item prop="equipmentNo">
          <el-input v-model="queryParams.equipmentNo" clearable size="small" placeholder="设备编号" style="width: 180px;" />
        </el-form-item>
        <el-form-item prop="alarmGrade">
          <el-select v-model="queryParams.alarmGrade" size="small" style="width: 180px;" placeholder="告警等级">
            <el-option label="全部" :value="''" />
            <el-option v-for="(item,index) in alarmLevelList" :key="index" :label="item.name" :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
          <el-button v-hasPermi="['system:alarmConfig:add']" type="success" icon="el-icon-plus" size="small" @click="handleAdd">
            新增
          </el-button>
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
    <!-- 新增/编辑 -->
    <el-dialog v-dialogDrag :close-on-click-modal="false" :modal-append-to-body="false" class="dialog" :title="dialogType==='edit'?'编辑':'新增'" :visible.sync="dialogVisible" width="530px" append-to-body>
      <el-form
        ref="form"
        :model="formData"
        :rules="addFormRules"
        label-width="90px"
        style="width: 400px; margin-left:40px;"
      >
        <el-form-item label="订单名称" prop="orderId">
          <el-select v-model="formData.orderId" style="width: 100%;" placeholder="订单名称" @change="changeOrder">
            <el-option v-for="(item,index) in orderList" :key="index" :label="item.orderNo" :value="item.orderId" />
          </el-select>
        </el-form-item>
        <el-form-item label="产线名称" prop="lineId">
          <el-select v-model="formData.lineId" placeholder="产线名称" style="width: 100%;" @change="changeLine">
            <el-option v-for="(item,index) in lineList" :key="index" :label="item.lineName" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="设备选择" prop="deviceId">
          <el-select v-model="formData.deviceId" placeholder="请选择设备" style="width: 100%;">
            <el-option v-for="(item,index) in deviceTypelList" :key="index" :label="item.equipmentName" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="告警内容" prop="alarmName">
          <el-input v-model="formData.alarmName" clearable placeholder="请输入告警内容" />
        </el-form-item>
        <el-form-item label="解析位置" prop="locationData">
          <el-select v-model="formData.locationData" placeholder="解析位置" style="width: 100%;">
            <el-option v-for="(item,index) in locationDataList" :key="index" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="告警等级" prop="alarmGrade">
          <el-select v-model="formData.alarmGrade" placeholder="告警等级" style="width: 100%;">
            <el-option v-for="(item,index) in alarmLevelList" :key="index" :label="item.name" :value="item.value" />
          </el-select>
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
import { getlineSelect, getLineByOrderId, getOrderSelect } from '@/api/commens' // 获取产线列表
import {
  addAlarmConfig,
  delAlarmConfig,
  listAlarmConfig,
  updateAlarmConfig
} from '@/api/system/alarmConfig'
import { getLineByEquipment } from '@/api/line/line'
import { downloadToolManage } from '@/api/excel/excel'
/*
  queryParams:刀具管理列表请求参数
  total:列表总条数
  dialogVisible:是否显示 Dialog
  dialogType:控制表头显示内容
* */

export default {
  name: 'AlarmConfig',
  data() {
    return {
      // 表格信息
      column: [
        { type: 'index', index: this.indexMethod },
        { label: '订单编号', prop: 'orderNo' },
        { label: '产线名称', prop: 'lineName' },
        { label: '设备编号', prop: 'equipmentNo' },
        { label: '告警内容', prop: 'alarmName' },
        { label: '解析位置', prop: 'locationData' },
        { label: '告警等级', prop: 'alarmGrade' },
        { label: '操作', render: (h, scope) => {
          return (
            <div id='btnWrap'>
              <el-button
                v-hasPermi={['system:alarmConfig:edit']}
                type='primary'
                size='mini'
                onClick={() => { this.handleEdit(scope.row) }}
              >编辑</el-button>
              <el-button
                v-hasPermi={['system:alarmConfig:del']}
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
      // 分页搜索参数
      queryParams: {
        page: 1,
        limit: 20,
        equipmentNo: undefined, // 告警编码
        orderId: undefined, // 告警编码
        lineId: undefined, // 告警编码
        alarmGrade: undefined // 告警等级
      },
      addFormRules: { // 表单验证
        orderId: [
          { required: true, message: '请选择订单', trigger: 'change' }
        ],
        lineId: [
          { required: true, message: '请选择产线', trigger: 'change' }
        ],
        alarmName: [
          { required: true, message: '请输入告警内容', trigger: 'blur' }
        ],
        locationData: [
          { required: true, message: '请选择解析位置', trigger: 'change' }
        ],
        deviceId: [
          { required: true, message: '请选择设备', trigger: 'change' }
        ],
        alarmGrade: [
          { required: true, message: '请选择告警等级', trigger: 'change' }
        ]
      },
      // 列表
      list: [],
      // 分页数据
      total: 0,
      dialogVisible: false,
      passVisible: false, // 确认气泡框
      // dialogVisibleTools: false,
      dialogType: 'new',
      // 表单信息
      formData: {},
      orderList: [], // 订单列表
      lineList: [], // 产线列表
      lineLists: [], // 产线列表
      // alarmTypeList: [], // 告警类型列表
      deviceTypelList: [],
      alarmLevelList: [
        { name: '一级', value: 1 },
        { name: '二级', value: 2 },
        { name: '三级', value: 3 }
      ],
      locationDataList: [],
      // 表单校验
      departList: []
    }
  },
  computed: {},
  mounted() {
    this.getList()
    this.handleLine()
    // this.getListAlarmType()
    this.handleLocationDataList()
    this.handleOrder()
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
      listAlarmConfig(this.queryParams).then(res => {
        this.list = res.data
        this.total = res.count || 0
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    handleOrder() {
      // getOrder().then(res => {
      getOrderSelect().then(res => {
        this.orderList = res.data
      }).catch(() => {
        this.loading = false
      })
    },
    // 根据订单id获取产线列表
    changeOrder(id) {
      this.formData.lineId = undefined
      getLineByOrderId(id).then(res => {
        this.lineList = res.data
      })
    },
    changeLine(id) {
      getLineByEquipment(id).then(res => {
        this.deviceTypelList = res.data
      })
    },
    // 获取产线列表
    handleLine() {
      getlineSelect().then(res => {
        this.lineLists = res.data.filter(item => {
          return item.lineId !== 6 && item.lineId !== 8
        })
      }).catch(() => {
        this.loading = false
      })
    },
    // getListAlarmType() {
    //   listAlarmType({ dictCode: 'alarm_type' }).then(res => {
    //     this.alarmTypeList = res.data
    //   })
    // },
    // 解析位置
    handleLocationDataList() {
      this.locationDataList = []
      for (var i = 0; i <= 50; i++) {
        this.locationDataList.push(i)
      }
    },
    // 新增按钮
    handleAdd() {
      this.reset()
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    // 编辑
    handleEdit(row) {
      this.formData = JSON.parse(JSON.stringify(row))
      console.log('formData', this.formData)
      // this.formData.orderId = Number(this.formData.orderId
      // this.formData.lineId = Number(this.formData.lineId)
      // this.formData.deviceId = Number(this.formData.deviceId)
      getLineByOrderId(this.formData.orderId).then(res => {
        this.lineList = res.data
        getLineByEquipment(this.formData.lineId).then(res => {
          this.loadingDetail = true
          this.dialogVisible = true
          this.dialogType = 'edit'
          this.deviceTypelList = res.data
        })
      })
    },
    /** 删除按钮操作 */
    handleDelete(scope) {
      const alarmConfigId = scope.row.alarmConfigId
      this.$confirm('是否确认删除该数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return delAlarmConfig(alarmConfigId)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(() => {
      })
    },
    /** 提交按钮 */
    handleSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.dialogType !== 'new') {
            updateAlarmConfig(this.formData).then(res => {
              this.msgSuccess(res.msg)
              this.dialogVisible = false
              this.passVisible = false
              this.getList()
            })
          } else {
            addAlarmConfig(this.formData).then(res => {
              this.msgSuccess(res.msg)
              this.dialogVisible = false
              this.passVisible = false
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
        alarmGrade: undefined, // 告警等级
        alarmConfigId: undefined, // 数据唯一id
        alarmName: undefined, // 告警内容
        orderId: undefined, // 产线id
        lineId: undefined, // 产线id
        locationData: undefined, // 告警内容
        deviceId: undefined // 设备类型
      }
      this.resetForm('form')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

