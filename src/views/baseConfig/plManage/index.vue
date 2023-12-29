<template>
  <div class="app-container">
    <!-- 头部筛选 -->
    <el-card shadow="never" class="card">
      <el-form ref="queryForm" :inline="true" :model="queryParams">
        <el-form-item v-hasShow prop="orderNo">
          <el-select v-model="queryParams.orderNo" size="small" style="width: 180px;" placeholder="订单编号">
            <el-option label="全部" :value="''" />
            <el-option v-for="(item,index) in orderList" :key="index" :label="item.orderNo" :value="item.orderNo">
              <span>{{ item.orderNo }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="lineId">
          <el-select v-model="queryParams.lineId" size="small" style="width: 180px;" placeholder="产线名称">
            <el-option label="全部" :value="''" />
            <el-option v-for="(item,index) in lineList" :key="index" :label="item.lineName" :value="item.lineId" />
          </el-select>
        </el-form-item>
        <el-form-item prop="lineType">
          <el-select v-model="queryParams.lineType" size="small" style="width: 180px;" placeholder="产品类型">
            <el-option label="全部" :value="''" />
            <el-option v-for="(item,index) in lineTypeList" :key="index" :label="item.name" :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
          <el-button v-hasPermi="['pl:plManage:add']" type="success" icon="el-icon-plus" size="small" style="margin-bottom: 10px" @click="handleAdd">新增</el-button>
          <el-button v-hasPermi="['pl:plManage:excel']" :loading="btnLoading" type="warning" icon="el-icon-download" size="small" @click="handleExport">导出</el-button>
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

    <!--新增产线-->
    <el-dialog v-dialogDrag :close-on-click-modal="false" :modal-append-to-body="false" :title="dialogType==='edit'?'编辑产线':'新增产线'" :visible.sync="dialogVisible" class="dialog" width="1000px" top="9vh">
      <el-form ref="formData" :model="formData" :rules="addFormRules" :inline="true" label-width="90px" style="margin-left:40px;">
        <div style="width: 500px;">
          <el-form-item label="订单编号" prop="orderId">
            <!--            <el-select v-model="formData.orderId" style="width: 380px" placeholder="请选择订单编号" :disabled="formData.id !== undefined">-->
            <el-select v-model="formData.orderId" style="width: 380px" placeholder="请选择订单编号">
              <el-option v-for="(item,index) in orderList" :key="index" :label="item.orderNo" :value="item.orderId">
                <span>{{ item.orderNo }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="产线名称" prop="lineName">
            <el-input v-model="formData.lineName" style="width: 380px" clearable placeholder="请输入产线名称" />
          </el-form-item>
          <el-form-item label="产品类型" prop="lineType">
            <!--            <el-select v-model="formData.orderId" style="width: 380px" placeholder="请选择订单编号" :disabled="formData.id !== undefined">-->
            <el-select v-model="formData.lineType" style="width: 380px" placeholder="请选择产品类型">
              <el-option v-for="(item,index) in lineTypeList" :key="index" :label="item.value" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="产线编码" prop="lineCode">
            <!--            <el-input v-model="formData.lineCode" :disabled="formData.id !== undefined" style="width: 380px" clearable placeholder="请输入产线编码" />-->
            <el-input v-model="formData.lineCode" style="width: 380px" clearable placeholder="请输入产线编码" />
          </el-form-item>
          <el-form-item label="产线序号" prop="lineNo">
            <el-input v-model="formData.lineNo" style="width: 380px" clearable placeholder="请输入产线序号" />
          </el-form-item>
          <el-form-item label-width="0" prop="remarks">
            <div class="label-top">描述</div>
            <el-input
              v-model="formData.remarks"
              style="width: 470px"
              :autosize="{ minRows: 2, maxRows: 4}"
              type="textarea"
              clearable
              placeholder="请输入备注"
            />
          </el-form-item>
        </div>
        <!-- 班次配置 -->
        <el-card class="box-card font-color" shadow="never">
          <div slot="header" class="clearfix">
            <span style="font-weight: 700">班次配置</span>
          </div>
          <div class="form-item">
            <el-row v-for="(item, index) in formData.workShiftVos" :key="index">
              <el-col :span="24">
                <el-form-item
                  :label=" '班次'+(index+1)+'名称' "
                  :prop="'workShiftVos.' + index + '.workName'"
                  :rules="{ required: true, message: '请输入班次名称', trigger: ['change', 'blur'] }"
                  label-width="100px"
                  class="form-name"
                >
                  <el-input v-model="item.workName" placeholder="请输入班次名称" style="width: 460px" clearable />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item
                  :label=" '班次'+(index+1)+'时间' "
                  :prop="`workShiftVos[${index}].startTime`"
                  :rules="{ required: true, message: '请选择开始时间', trigger: ['change', 'blur'] }"
                  label-width="100px"
                >
                  <el-time-picker
                    v-model="item.startTime"
                    :picker-options="{
                      selectableRange: '00:00:00 - 23:59:59'
                    }"
                    format="HH:mm:ss"
                    value-format="HH:mm:ss"
                    placeholder="开始时间"
                    style="width: 221px;"
                  /> -
                </el-form-item>
                <el-form-item
                  :prop="`workShiftVos[${index}].endTime`"
                  :rules="{ required: true, message: '请选择结束时间', trigger: ['change', 'blur'] }"
                  label-width="0"
                >
                  <el-time-picker
                    v-model="item.endTime"
                    :picker-options="{
                      selectableRange: '00:00:00 - 23:59:59'
                    }"
                    format="HH:mm:ss"
                    value-format="HH:mm:ss"
                    placeholder="结束时间"
                    style="width: 221px;"
                  />
                </el-form-item>
                <el-form-item
                  :prop="`workShiftVos[${index}].sortNo`"
                  label="排序码"
                >
                  <el-input-number v-model="item.sortNo" :min="1" label="描述文字" style="width: 120px" />
                </el-form-item>
                <el-form-item style="display:inline-block;">
                  <el-button icon="el-icon-delete" size="small" type="danger" @click="removeClass(index)" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-col :offset="20">
              <el-form-item style="display:inline-block;">
                <el-button plain="" type="primary" size="small" @click="addClass">新增班次</el-button>
              </el-form-item>
            </el-col>
          </div>
        </el-card>
      </el-form>

      <!-- 操作按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-popover v-model="passVisible" placement="top" width="160">
          <p>确认提交？</p>
          <div style="text-align: right; margin: 0">
            <el-button size="small" type="text" @click="passVisible = false">取消</el-button>
            <el-button type="primary" size="small" @click="handleSubmit('formData')">确定</el-button>
          </div>
          <el-button slot="reference" class="l-m-l-10" type="primary">提交</el-button>
        </el-popover>
      </span>
    </el-dialog>

    <!--绑定设备-->
    <el-dialog v-dialogDrag :close-on-click-modal="false" :modal-append-to-body="false" title="绑定设备" :visible.sync="dialogEquipment" class="dialog" width="600px" top="9vh">
      <el-form ref="formDataEquipment" :model="formDataEquipment" :rules="EquipmentRules" :inline="true" label-width="90px" style="margin-left:40px;">
        <div style="width: 500px;">
          <!--          <el-form-item label="站点名称" prop="orderId">-->
          <!--            <el-select v-model="formDataEquipment.departName" style="width: 380px" placeholder="请选择站点名称" disabled>-->
          <!--              &lt;!&ndash;            <el-select v-model="formDataEquipment.departName" style="width: 380px" placeholder="请选择站点名称">&ndash;&gt;-->
          <!--              &lt;!&ndash;              <el-option v-for="(item,index) in departList" :key="index" :label="item.departName" :value="item.departName" />&ndash;&gt;-->
          <!--              <el-option v-for="(item,index) in departList" :key="index" :label="item.departName" :value="item.departName" />-->
          <!--            </el-select>-->
          <!--          </el-form-item>-->
          <el-form-item label="产线名称" prop="lineName">
            <el-select v-model="formDataEquipment.lineName" style="width: 380px" placeholder="请选择产线名称" disabled>
              <!--            <el-select v-model="formDataEquipment.lineName" style="width: 380px" placeholder="请选择产线名称">-->
              <el-option :key="formDataEquipment.lineId" :label="formDataEquipment.lineName" :value="formDataEquipment.lineId" />
            </el-select>
          </el-form-item>
          <el-form-item label="设备选择" prop="lineCode">
            <el-select v-model="formDataEquipment.equipmentId" style="width: 380px" placeholder="请选择设备">
              <el-option v-for="(item,index) in EquipmentList" :key="index" :label="item.equipmentName" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label-width="0" prop="remarks">
            <div class="label-top">描述</div>
            <el-input
              v-model="formDataEquipment.remarks"
              style="width: 470px"
              :autosize="{ minRows: 2, maxRows: 4}"
              type="textarea"
              clearable
              placeholder="请输入备注"
            />
          </el-form-item>
        </div>
      </el-form>

      <!-- 操作按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogEquipment = false">取消</el-button>
        <el-popover v-model="passVisibleEquipment" placement="top" width="160">
          <p>确认提交？</p>
          <div style="text-align: right; margin: 0">
            <el-button size="small" type="text" @click="passVisibleEquipment = false">取消</el-button>
            <el-button type="primary" size="small" @click="handleSubmitEquipment('formDataEquipment')">确定</el-button>
          </div>
          <el-button slot="reference" class="l-m-l-10" type="primary">提交</el-button>
        </el-popover>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getLine, // 获取产线列表
  postLine, // 新增产线
  updateLine, // 编辑产线
  getLineById, // 根据id查询产线详情
  delLine, // 删除产线
  getLineByEquipment,
  updateEquipment
} from '@/api/line/line'
import { getlineSelect } from '@/api/commens'
import { mapGetters } from 'vuex'
import { downloadLine } from '@/api/excel/excel' // 获取产线列表
export default {
  name: 'PlManage',
  data() {
    return {
      column: [
        { type: 'index', index: this.indexMethod, fixed: true },
        { label: '订单编号', prop: 'orderNo', width: 120 },
        // { label: '归属站点', prop: 'departName', width: 120 },
        { label: '产线编码', prop: 'lineCode', width: 120 },
        { label: '产线名称', prop: 'lineName', width: 120 },
        { label: '产品类型', prop: 'lineType', width: 120 },
        { label: '产线序号', prop: 'lineNo', width: 120 },
        { label: '班次', prop: 'work_name', width: 120 },
        { label: '班次时间', render: (h, scope) => {
          return (
            <div>
              <span>{scope.row.start_time}</span> -
              <span>{scope.row.end_time}</span>
            </div>
          )
        }, width: 160 },
        { label: '备注', prop: 'remarks', width: 120 },
        { label: '绑定设备名称', prop: 'equipmentName', width: 140 },
        { label: '绑定设备编号', prop: 'equipmentCode', width: 200 },
        { label: '新增人', prop: 'createBy', width: 120 },
        { label: '新增时间', prop: 'createTime', width: 200 },
        { label: '操作', render: (h, scope) => {
          return (
            <div>
              <el-button
                v-hasPermi={['pl:plManage:eqptAdd']}
                type='primary'
                size='mini'
                onClick={() => { this.handleEquipment(scope) }}
              >绑定设备</el-button>
              <el-button
                v-hasPermi={['pl:plManage:edit']}
                type='primary'
                size='mini'
                onClick={() => { this.handleEdit(scope) }}
              >编辑</el-button>
              <el-button
                v-hasPermi={['pl:plManage:del']}
                type='danger'
                size='mini'
                onClick={() => { this.handleDelete(scope) }}
              >删除</el-button>
            </div>
          )
        }, width: 240, fixed: 'right' }
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
        lineId: undefined, // 产线名称
        lineType: undefined, // 产品类型
        field: undefined,
        type: undefined
      },
      list: [], // 表格数据
      dialogVisible: false,
      dialogEquipment: false,
      dialogType: 'new',
      passVisible: false, // 确认气泡框
      passVisibleEquipment: false, // 确认气泡框
      formData: {},
      formDataEquipment: {
        lineId: undefined,
        departName: undefined,
        lineName: undefined,
        equipmentId: undefined,
        remarks: undefined

      },
      addFormRules: { // 表单验证
        orderId: [
          { required: true, message: '请选择订单', trigger: 'change' }
        ],
        lineName: [
          { required: true, message: '请输入产线名称', trigger: 'blur' }
        ],
        lineCode: [
          { required: true, message: '请输入产线编码', trigger: 'blur' }
        ],
        lineNo: [
          { required: true, message: '请输入产线序号', trigger: 'blur' }
        ],
        lineType: [
          { required: true, message: '请选择产品类型', trigger: 'change' }
        ]
      },
      EquipmentRules: {},
      EquipmentList: [], // 设备列表
      // departList: [], // 站点列表
      lineList: [], // 产线列表
      lineTypeList: [{ name: '二米活塞杆', value: '2MHSG' }, { name: '三米活塞杆', value: '3MHSG' }, { name: '二米缸筒', value: '2MGT' }, { name: '三米缸筒', value: '3MGT' }]
    }
  },
  computed: { ...mapGetters(['orderList']) },
  mounted() {
    this.getList()
    this.handleLine()
    // this.handleDepartList()
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
    // 获取产线列表
    getList() {
      this.loading = true
      getLine(this.queryParams).then(res => {
        this.list = res.data
        this.total = res.count || 0
        this.loading = false
      })
    },
    // 获取产线列表
    handleLine() {
      getlineSelect().then(res => {
        this.lineList = res.data
      }).catch(() => {
        this.loading = false
      })
    },
    // 获取站点信息
    // handleDepartList() {
    //   switchSite().then(res => {
    //     this.departList = res.data
    //   })
    // },
    // 新增产线按钮
    handleAdd() {
      this.reset()
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    // 编辑产线
    handleEdit(scope) {
      this.reset()
      const lineId = scope.row.id
      getLineById(lineId).then(res => {
        this.formData = res.data
        this.dialogType = 'edit'
        this.dialogVisible = true
      })
    },
    // 新增排班
    addClass() {
      const data = {
        endTime: '', // 班次结束时间
        startTime: '', // 班次开始时间
        workName: '', // 班次名称
        sortNo: 1
      }
      var detailData = JSON.parse(JSON.stringify(this.formData))
      this.formData = {}
      this.formData = JSON.parse(JSON.stringify(detailData))
      this.formData.workShiftVos.push(data)
    },
    // 删除排程
    removeClass(index) {
      var detailData = JSON.parse(JSON.stringify(this.formData))
      this.formData = {}
      this.formData = JSON.parse(JSON.stringify(detailData))
      this.formData.workShiftVos.splice(index, 1)
    },
    // 删除产线
    handleDelete(scope) {
      const lineId = scope.row.id
      this.$confirm('是否确认删除名称为"' + scope.row.lineName + '"的数据项', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return delLine(lineId)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(() => {
      })
    },
    // 绑定设备
    handleEquipment(scope) {
      const lineId = scope.row.id
      this.formDataEquipment.lineId = lineId
      this.formDataEquipment.departName = scope.row.departName
      this.formDataEquipment.lineName = scope.row.lineName
      this.formDataEquipment.remarks = scope.row.remarks
      this.formDataEquipment.equipmentId = scope.row.statisticsEquimentId
      // 获取设备列表
      getLineByEquipment(lineId).then(res => {
        this.EquipmentList = res.data
        this.dialogEquipment = true
      })
    },
    // 提交产线信息
    handleSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.formData.workShiftVos.length < 1) {
            this.$message.error('请添加班次')
            return
          }
          if (this.formData.id !== undefined) { // 编辑
            updateLine(this.formData).then(res => {
              this.$message.success(res.msg)
              this.dialogVisible = false
              this.passVisible = false
              this.getList()
            })
          } else { // 新增
            postLine(this.formData).then(res => {
              this.$message.success(res.msg)
              this.dialogVisible = false
              this.passVisible = false
              this.getList()
            })
          }
        }
      })
    },
    // 绑定设备提交
    handleSubmitEquipment(formDataEquipment) {
      this.$refs[formDataEquipment].validate((valid) => {
        if (valid) {
          updateEquipment(this.formDataEquipment).then(res => {
            this.$message.success(res.msg)
            this.dialogEquipment = false
            this.passVisibleEquipment = false
            this.getList()
          })
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
      this.dateRange = []
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 导出按钮
    handleExport() {
      this.btnLoading = true
      downloadLine(this.queryParams).then((res) => {
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
        lineCode: undefined, // 产线编码
        lineName: undefined, // 产线名称
        orderId: undefined, // 订单id
        remarks: undefined, // 备注
        lineNo: undefined, // 产线序号
        lineType: undefined, // 产线类型
        workShiftVos: [ // 排班对象集合
          {
            endTime: undefined, // 班次结束时间
            startTime: undefined, // 班次开始时间
            workName: undefined, // 班次名称
            sortNo: 1
          }
        ]
      }
      this.resetForm('formData')
    }
  }
}
</script>
<style lang="scss" scoped>
.outer-over {
  height: 260px;
  position: relative;
  overflow-y: scroll;
  -ms-overflow-style: none; // IE 10+
  overflow: -moz-scrollbars-none; // Firefox
}
/* 隐藏滚动条 */
/* .outer-over::-webkit-scrollbar {
  width: 0 !important;
  height: 0 !important;
} */
</style>

