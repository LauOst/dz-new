<template>
  <div class="app-container">
    <!-- 头部筛选 -->
    <el-card shadow="never" class="card">
      <el-form ref="queryForm" :inline="true" :model="queryParams">
        <el-form-item v-hasShow prop="wipOrderType">
          <el-select
            v-model="queryParams.wipOrderType"
            v-support
            size="small"
            style="width: 180px;"
            placeholder="生产任务订单类型"
          >
            <el-option label="全部" :value="''" />
            <el-option v-for="(item,index) in orderTypeList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item prop="progressStatus">
          <el-select v-model="queryParams.progressStatus" size="small" style="width: 180px;" placeholder="订单状态">
            <el-option label="全部" :value="''" />
            <el-option v-for="(item,index) in orderStatusList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item prop="lineId">
          <el-select v-model="queryParams.lineId" size="small" style="width: 180px;" placeholder="产线名称">
            <el-option label="全部" :value="''" />
            <el-option v-for="(item,index) in lineLists" :key="index" :label="item.lineName" :value="item.lineId" />
          </el-select>
        </el-form-item>
        <el-form-item prop="wipOrderNo">
          <el-input
            v-model="queryParams.wipOrderNo"
            v-support
            size="small"
            clearable
            placeholder="生产任务订单号"
            style="width: 180px;"
          />
        </el-form-item>
        <el-form-item prop="productNo">
          <el-input
            v-model="queryParams.productNo"
            v-support
            size="small"
            clearable
            placeholder="产品物料号"
            style="width: 180px;"
          />
        </el-form-item>
        <start-date v-model="queryParams.startTime" />
        <end-date v-model="queryParams.endTime" />
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
          <!--          <el-button-->
          <!--            v-hasPermi="['mom:productionTaskList:add']"-->
          <!--            type="success"-->
          <!--            icon="el-icon-plus"-->
          <!--            size="small"-->
          <!--            @click="handleAdd"-->
          <!--          >-->
          <!--            新增-->
          <!--          </el-button>-->
          <!--          v-hasPermi="['mom:dzics:momOrder:toggle']"-->
          <el-button
            :loading="btnLoading"
            type="success"
            :icon="modeStatus === '1' ? 'el-icon-turn-off' : 'el-icon-open'"
            size="small"
            @click="handleToggle(modeStatus)"
          >
            {{ modeStatus === '1' ? '切换自动' : '切换手动' }}
          </el-button>
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
    <el-dialog
      v-dialogDrag
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      :title="dialogType==='edit'?'查看详情':'新增'"
      :visible.sync="dialogVisible"
      class="dialog"
      width="1100px"
      top="9vh"
    >
      <el-form
        ref="formData"
        :model="formData"
        :rules="addFormRules"
        label-width="120px"
        style="width: 92%; margin-left:40px;"
      >
        <div v-if="dialogType==='new'" style="width: 100%;">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="产线名称" prop="lineId">
                <el-select v-model="formData.lineId" placeholder="请选择产线" style="width: 100%;" @change="changeLine">
                  <el-option
                    v-for="(item,index) in lineLists"
                    :key="index"
                    :label="item.lineName"
                    :value="item.lineId"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="产线编号" prop="productionLine">
                <el-input v-model="formData.productionLine" clearable placeholder="请输入产线编号" :disabled="true" />
              </el-form-item>
              <!--              <el-form-item label="生产订单编号" prop="wipOrderNo">-->
              <!--                <el-input v-model="formData.wipOrderNo" clearable placeholder="请输入生产订单编号" />-->
              <!--              </el-form-item>-->
              <el-form-item label="生产任务类型" prop="wipOrderType">
                <el-select v-model="formData.wipOrderType" placeholder="请选择生产任务类型" style="width: 100%;">
                  <el-option
                    v-for="(item,index) in dialogOrderTypeList"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="产品名称" prop="productId">
                <el-select v-model="formData.productId" placeholder="请选择产品" style="width: 100%;" @change="changeProduct">
                  <el-option
                    v-for="(item,index) in workpieceLists"
                    :key="index"
                    :label="item.productName"
                    :value="item.productId"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="产品对接码" prop="dockingCode">
                <el-input v-model="formData.dockingCode" clearable placeholder="请输入对接码" :disabled="true" />
              </el-form-item>

            </el-col>
            <el-col :span="12">
              <el-form-item label="制作工件数量" prop="quantity">
                <el-input-number
                  v-model="formData.quantity"
                  :min="0"
                  style="width: 100%;"
                />
              </el-form-item>
              <!--              <el-form-item label="产品物料号" prop="productNo">-->
              <!--                <el-input v-model="formData.productNo" clearable placeholder="请输入产品物料号" />-->
              <!--              </el-form-item>-->
              <el-form-item label="工序" prop="workName">
                <el-input
                  v-model="formData.workName"
                  clearable
                  placeholder="请输入工序"
                />
              </el-form-item>
              <el-form-item
                label="计划开始时间"
                prop="scheduledStartDate"
                :rules="{ required: true, message: '请选择计划开始时间', trigger: ['change', 'blur'] }"
              >
                <el-date-picker
                  v-model="formData.scheduledStartDate"
                  type="datetime"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="计划开始时间"
                  style="width: 100%;"
                  :picker-options="startDatePicker"
                />
              </el-form-item>
              <el-form-item
                label="计划结束时间"
                prop="scheduledCompleteDate"
                :rules="{ required: true, message: '请选择计划结束时间', trigger: ['change', 'blur'] }"
              >
                <el-date-picker
                  v-model="formData.scheduledCompleteDate"
                  type="datetime"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="计划结束时间"
                  style="width: 100%;"
                  :picker-options="endDatePicker"
                />
              </el-form-item>

            </el-col>
          </el-row>
        </div>
        <!--组件物料-->
        <el-card class="box-card font-color normalFormItem" shadow="never">
          <div slot="header" style="display: flex;align-items: center;justify-content: space-between;">
            <span style="font-weight: 700">组件物料</span>
          </div>
          <div class="form-item" style="padding:10px 20px">
            <el-row>
              <el-col v-for="(item, index) in formData.materialAddParms" :key="index" :span="24">
                <div style="display: flex;justify-content: space-between;align-items: center">
                  <el-form-item
                    label="组件物料编码"
                    :prop="'materialAddParms.' + index + '.materialNo'"
                    :rules="{ required: true, message: '请输入组件物料编码', trigger: ['change', 'blur'] }"
                    label-width="120px"
                    class="form-name"
                  >
                    <el-input
                      v-model="item.materialNo"
                      placeholder="请输入组件物料编码"
                      size="mini"
                      style="width: 180px"
                      clearable
                      :disabled="dialogType ==='edit'"
                    />
                  </el-form-item>
                  <el-form-item
                    label="组件物料简码"
                    :prop="`materialAddParms[${index}].materialAlias`"
                    :rules="{ required: true, message: '请选输入组件物料简码', trigger: ['change', 'blur'] }"
                    label-width="120px"
                  >
                    <el-input
                      v-model="item.materialAlias"
                      placeholder="请选输入组件物料简码"
                      size="mini"
                      style="width: 180px"
                      clearable
                      :disabled="dialogType ==='edit'"
                    />
                  </el-form-item>

                  <el-form-item
                    label="组件物料数量"
                    :prop="`materialAddParms[${index}].quantity`"
                    :rules="{ required: true, message: '请选择组件物料数量', trigger: ['change', 'blur'] }"
                    label-width="120px"
                  >
                    <el-input-number
                      v-model="item.quantity"
                      size="mini"
                      :min="1"
                      label="描述文字"
                      style="width: 120px"
                      :disabled="dialogType ==='edit'"
                    />
                  </el-form-item>
                </div>

              </el-col>
            </el-row>
          </div>
        </el-card>

      </el-form>

      <!-- 操作按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button type="plain" @click="dialogVisible = false">取消</el-button>
        <el-popover v-if="dialogType ==='new'" v-model="passVisible" placement="top" width="160">
          <p>确认提交？</p>
          <div style="text-align: right; margin: 0">
            <el-button size="small" type="text" @click="passVisible = false">取消</el-button>
            <el-button type="primary" size="small" :loading="submitLoading" @click="handleSubmit">确定</el-button>
          </div>
          <el-button slot="reference" class="l-m-l-10" type="primary">提交</el-button>
        </el-popover>
      </span>
    </el-dialog>
    <!-- DNC程序请求对话框 -->
    <el-dialog v-dialogDrag :close-on-click-modal="false" :modal-append-to-body="false" title="DNC程序请求" :visible.sync="dncDialogVisible" class="dialog" width="1000px">
      <dz-table
        v-loading="dncLoading"
        :column="dncColumn"
        :data="dncList"
        :height="500"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="dncDialogVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dncSubmitForm">
          确定
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { downloadEquipment } from '@/api/excel/excel'
// import {
//   addProductionTask,
//   detailProductionTask, recoveryOrder
// } from '@/api/productionTask/productionTaskList'
import { getlineSelect, getOrderWorkpiece, getMaterialId } from '@/api/commens'
import {
  appointChange,
  appointList,
  appointStop,
  appointRecover,
  appointDel,
  appointClose,
  appointStart,
  appointToggle, appointMode, forwardOrder
} from '@/api/mom/momOrder'
import { listEquipment } from '@/api/euipment/euipment'
// import { listProcedure } from '@/api/report/procedure'
// <el-button
// v-hasPermi={['mom:dzics:momOrder:updState']}
// loading={this.startLoading}
// type='success'
// size='mini'
// onClick={() => {
//   this.handleStart(scope.row)
// }}
// >
// 开始
// </el-button>
export default {
  name: 'MomOrder',
  data() {
    return {
      column: [
        { type: 'index', index: this.indexMethod, fixed: true },
        { label: '产线名称', prop: 'lineName', width: 120, disableSort: true },
        { label: '生产任务订单号', prop: 'wiporderno', width: 180, disableSort: true },
        { label: '库存', prop: 'storage', width: 120, disableSort: true },
        { label: '产品物料号', prop: 'productNo', width: 180 },
        { label: '订单状态', prop: 'progressStatus', width: 80, formatter: this.ProgressStatusFormat, disableSort: true },
        { label: '订单数量', prop: 'quantity', width: 120 },
        { label: '工序号', prop: 'oprSequenceNo', width: 100 },
        // { label: '实际生产数量', prop: 'actualProduction', width: 110, disableSort: true },
        { label: '计划开始时间', prop: 'scheduledStartDate', width: 160, disableSort: true },
        { label: '实际开始时间', prop: 'realityStartDate', width: 160, disableSort: true },
        { label: '计划结束时间', prop: 'scheduledCompleteDate', width: 160, disableSort: true },
        { label: '实际结束时间', prop: 'realityCompleteDate', width: 160, disableSort: true },
        {
          label: '操作', render: (h, scope) => {
            return (
              <div>
                <el-button
                  v-hasPermi={['mom:dzics:momOrder:start']}
                  loading={this.startOrderLoading}
                  style={{ minWidth: '80px' }}
                  type='success'
                  size='mini'
                  disabled={scope.row.progressStatus !== '110' }
                  onClick={() => {
                    this.handleStartOrder(scope.row)
                  }}
                >
                  {scope.row.progressStatus === '120' ? '进行中' : '开始订单'}
                </el-button>
                <el-button
                  v-hasPermi={['mom:dzics:momOrder:updState']}
                  type='danger'
                  size='mini'
                  loading={this.closeLoading}
                  onClick={() => {
                    this.handleClose(scope.row)
                  }}
                >
                  完成
                </el-button>

                {
                  scope.row.progressStatus === '160' ? (
                    <el-button
                      v-hasPermi={['mom:dzics:momOrder:recovery']}
                      type='grenn'
                      size='mini'
                      loading={this.recoveryLoading}
                      disabled={scope.row.progressStatus !== '160' }
                      onClick={() => {
                        this.handleRecovery(scope.row)
                      }}
                    >恢复
                    </el-button>
                  ) : (
                    <el-button
                      v-hasPermi={['mom:dzics:momOrder:stop']}
                      type='warning'
                      size='mini'
                      loading={this.stopLoading}
                      disabled={scope.row.progressStatus !== '120' }
                      onClick={() => {
                        this.handleStop(scope.row)
                      }}
                    >暂停
                    </el-button>
                  )
                }
                <el-button
                  v-hasPermi={['mom:dzics:momOrder:close']}
                  type='danger'
                  size='mini'
                  loading={this.forceCloseLoading}
                  disabled={(scope.row.progressStatus !== '120' && scope.row.progressStatus !== '160') }
                  onClick={() => {
                    this.handleForceClose(scope.row)
                  }}
                >
                  强制关闭
                </el-button>
                <el-button
                  v-hasPermi={['mom:dzics:momOrder:del']}
                  type='danger'
                  size='mini'
                  style={{ minWidth: '70px' }}
                  loading={this.delLoading}
                  disabled={scope.row.progressStatus !== '110' }
                  onClick={() => {
                    this.handleDel(scope.row)
                  }}
                >
                  {scope.row.progressStatus === '140' ? '已作废' : '作废'}
                </el-button>
                <el-button
                  v-hasPermi={['mom:dzics:momOrder:forward']}
                  type='info'
                  size='mini'
                  style={{ minWidth: '70px' }}
                  loading={this.delLoading}
                  onClick={() => {
                    this.handleForward(scope.row)
                  }}
                >
                  订单转发
                </el-button>
              </div>
            )
          }, width: 520, fixed: 'right'
        }
      ],
      dncColumn: [
        { type: 'index', index: this.indexMethod, fixed: true },
        { label: '设备名称', prop: 'equipmentName', disableSort: true },
        { label: '连接状态', render: (h, scope) => {
          return (
            <el-tag size='small' type={ scope.row.connectState === '联机' ? 'success' : 'danger' }>{ scope.row.connectState }</el-tag>
          )
        } },
        { label: '操作', render: (h, scope) => {
          return (
            <div>
              <el-checkbox
                v-model={ scope.row.checked}
              />
            </div>
          )
          // )
        } }
        // { label: '操作', prop: 'wiporderno', disableSort: true }
      ],
      // 遮罩层(加载)
      loading: false,
      dncLoading: false,
      btnLoading: false,
      startLoading: false,
      startOrderLoading: false,
      stopLoading: false,
      recoveryLoading: false,
      closeLoading: false,
      forceCloseLoading: false,
      delLoading: false,
      submitLoading: false,
      cancelLoading: false,
      total: 0, // 列表总条数
      queryParams: { // 查询信息
        page: 1,
        limit: 20,
        wipOrderType: undefined, // 订单类型
        lineId: undefined, // 产线id
        progressStatus: undefined, // 订单状态
        scheduledStartDate: undefined,
        scheduledCompleteDate: undefined,
        field: undefined,
        type: undefined,
        productNo: undefined
      },
      list: [], // 表格数据
      dncList: [], // 表格数据
      dialogVisible: false, // 新增弹窗
      dncDialogVisible: false, // 新增弹窗
      dialogType: 'new',
      passVisible: false, // 确认气泡框
      formData: {},
      addFormRules: { // 表单验证
        lineId: [
          { required: true, message: '请选择产线', trigger: 'change' }
        ],
        productionLine: [
          { required: true, message: '请输入产线编号', trigger: 'blur' }
        ],
        wipOrderType: [
          { required: true, message: '请选择生产任务类型', trigger: 'change' }
        ],
        productId: [
          { required: true, message: '请选择产品', trigger: 'change' }
        ],
        quantity: [
          { required: true, message: '请输入制作工件数量', trigger: 'blur' }
        ],
        workName: [
          { required: true, message: '请输入工序', trigger: 'blur' }
        ],
        dockingCode: [
          { required: true, message: '请输入对接码', trigger: 'change' }
        ]
      },
      lineLists: [], // 产线列表
      // processList: [], // 工序列表
      workpieceLists: [], // 工件列表
      // 订单类型
      orderTypeList: [{
        label: '正常订单',
        value: 1
      }, {
        label: '返工订单',
        value: 2
      }],
      // 订单状态
      dialogOrderTypeList: [{
        label: '普通订单',
        value: 1
      }, {
        label: '返工返修',
        value: 2
      }],
      orderStatusList: [{
        label: '已下达',
        value: 110
      }, {
        label: '进行中',
        value: 120
      }, {
        label: '已完工',
        value: 130
      }, {
        label: '已作废',
        value: 140
      }, {
        label: '暂停',
        value: 160
      }, {
        label: '强制关闭',
        value: 150
      }],
      startDatePicker: this.beginDate(), // 开始时间控制
      endDatePicker: this.processDate(), // 结束时间控制
      modeStatus: '1',
      equipmentList: [],
      dncData: {}
    }
  },
  beforeDestroy() {
    this.$socket.emit('unGetMomOrderState', {
      orderNo: 'HT',
      lineNo: 'HT'
    })
  },
  mounted() {
    this.getList()
    this.getMode()
    this.handleLines()
    this.gitEquipment()
  },

  methods: {
    // 格式化序号
    indexMethod(index) {
      return (this.queryParams.page - 1) * this.queryParams.limit + index + 1
    },
    sortChange(column) {
      this.$mySort(this.queryParams, column, this.getList)
    },
    getMode() {
      appointMode({ code: '3' }).then(r => {
        this.modeStatus = r.data.type
      })
    },
    // 获取机器人列表
    getList() {
      this.loading = true
      appointList(this.queryParams).then(res => {
        this.list = res.data
        this.total = res.count || 0
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 获取产线列表
    handleLines() {
      getlineSelect().then(res => {
        this.lineLists = res.data
        if (this.lineLists && this.lineLists.length > 0) {
          this.formData.lineId = this.lineLists[0].lineId
          this.formData.productionLine = this.lineLists[0].lineCode
          const data = {
            lineType: this.lineLists[0].lineType || undefined
          }
          this.handleWorkpiec(data)
        }
      }).catch(() => {
        this.loading = false
      })
    },
    // 产线下拉框变化值
    changeLine(id) {
      this.formData.productId = undefined
      const arr = this.lineLists.filter(t => t.lineId === id)
      this.formData.productionLine = arr[0].lineCode
      const data = {
        lineType: arr[0].lineType || undefined
      }
      this.handleWorkpiec(data)
    },

    // 获取工件列表(产品)
    handleWorkpiec(data) {
      getOrderWorkpiece(data).then(res => {
        this.workpieceLists = res.data
      }).catch(() => {
        this.loading = false
      })
    },
    // 获取设备列表
    // gitEquipment() {
    //   return new Promise((resolve, reject) => {
    //     listEquipment().then(r => {
    //       // this.equipmentList = r.data.map(x => x.id)
    //       // resolve(this.equipmentList)
    //       this.dncList = r.data
    //       resolve(this.dncList)
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },
    gitEquipment() {
      listEquipment().then(r => {
        const equipmentList = r.data.filter(x => x.equipmentType === 2)
        equipmentList.map(x => {
          this.dncList.push(Object.assign({}, x, { checked: false }))
        })
      })
    },
    // 产品下拉框变化
    changeProduct(id) {
      const arr = this.workpieceLists.filter(t => t.productId === id)
      this.formData.dockingCode = arr[0].productNo
      getMaterialId(id).then(res => {
        this.formData.materialAddParms = res.data
      })
    },
    // 新增设备
    // handleAdd() {
    //   this.reset()
    //   this.handleLines()
    //   // this.getProcessList()
    //   // this.handleWorkpiec()
    //   this.dialogType = 'new'
    //   this.dialogVisible = true
    //   this.submitLoading = false
    // },
    // 编辑设备
    // handleEdit(row) {
    //   this.reset()
    //   this.dialogType = 'edit'
    //   // const proTaskOrderId = row.proTaskOrderId
    //   // console.log('row', row)
    //   // detailProductionTask(proTaskOrderId).then(res => {
    //   //   console.log('查看详情', res)
    //   //   this.dialogVisible = true
    //   //   this.formData.materialAddParms = res.data
    //   //   // this.handleLine(res.data.orderId)
    //   // })
    // },
    // 开始按钮
    handleStart(row) {
      const data = {
        lineId: row.lineId,
        proTaskOrderId: row.proTaskOrderId,
        progressStatus: '120'
      }
      this.$confirm('是否确认开始该数据项', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.startLoading = true
        return appointChange(data)
      }).then(() => {
        this.startLoading = false
        this.getList()
        this.msgSuccess('开始成功')
      }).catch(() => {
        this.startLoading = false
        this.getList()
        // this.msgSuccess(error)
      })
    },
    // 订单开始按钮
    async handleStartOrder(row) {
      this.dncData = {
        lineId: row.lineId,
        proTaskOrderId: row.proTaskOrderId,
        progressStatus: '120',
        equipmentIds: []
      }
      if (row.orderNo !== 'DZ-1974' && row.orderNo !== 'DZ-1975') {
        if (this.modeStatus === '1') {
          this.dncDialogVisible = true
        } else {
          const data = {
            lineId: row.lineId,
            proTaskOrderId: row.proTaskOrderId,
            progressStatus: '120',
            equipmentIds: this.equipmentList
          }
          this.$confirm('是否确认开始该数据项', '警告', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.startOrderLoading = true
            return appointStart(data)
          }).then(() => {
            this.startOrderLoading = false
            this.getList()
            this.msgSuccess('开始成功')
          }).catch(() => {
            this.startOrderLoading = false
            this.getList()
            // this.msgSuccess(error)
          })
        }
      } else {
        this.dncDialogVisible = true
      }
    },
    // 订单恢复
    handleRecovery(row) {
      const data = {
        lineId: row.lineId,
        proTaskOrderId: row.proTaskOrderId,
        progressStatus: '120'
      }
      this.$confirm('是否确认恢复该数据项', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.recoveryLoading = true
        return appointRecover(data)
      }).then(() => {
        this.recoveryLoading = false
        this.getList()
        this.msgSuccess('恢复成功')
      }).catch(() => {
        this.recoveryLoading = false
        this.getList()
        // this.msgSuccess(error)
      })
    },
    // 订单暂停
    handleStop(row) {
      const data = {
        lineId: row.lineId,
        proTaskOrderId: row.proTaskOrderId,
        progressStatus: '160'
        // progressStatus: row.progressStatus
      }
      this.$confirm('是否确认暂停该数据项', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.stopLoading = true
        return appointStop(data)
      }).then(() => {
        this.stopLoading = false
        this.getList()
        this.msgSuccess('暂停成功')
      }).catch(() => {
        this.stopLoading = false
        this.getList()
        // this.msgSuccess(error)
      })
    },
    // 完成
    handleClose(row) {
      const data = {
        lineId: row.lineId,
        proTaskOrderId: row.proTaskOrderId,
        progressStatus: '130'
      }
      this.$confirm('是否确认完成该数据项', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.closeLoading = true
        return appointChange(data)
      }).then((res) => {
        this.closeLoading = false
        this.getList()
        this.msgSuccess('完成成功')
      }).catch(() => {
        this.closeLoading = false
        this.getList()
        // this.msgSuccess(error)
      })
    },
    // 强制关闭
    handleForceClose(row) {
      const data = {
        lineId: row.lineId,
        proTaskOrderId: row.proTaskOrderId,
        progressStatus: '150'
      }
      this.$confirm('是否确认强制关闭该数据项', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.forceCloseLoading = true
        return appointClose(data)
      }).then((res) => {
        this.forceCloseLoading = false
        this.getList()
        this.msgSuccess('强制关闭成功')
      }).catch(() => {
        this.forceCloseLoading = false
        this.getList()
      })
    },
    // 作废
    handleDel(row) {
      const proTaskOrderId = row.proTaskOrderId
      this.$confirm('是否确认关闭该数据项', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delLoading = true
        return appointDel(proTaskOrderId)
      }).then((res) => {
        this.delLoading = false
        this.getList()
        this.msgSuccess('作废成功')
      }).catch(() => {
        this.delLoading = false
        this.getList()
        // this.msgSuccess(error)
      })
    },
    // 订单转发
    handleForward(row) {
      const proTaskOrderId = row.proTaskOrderId
      forwardOrder(proTaskOrderId).then(r => {
        this.getList()
        this.msgSuccess(r.msg)
      })
    },
    // 取消报功
    // handleCancel(row) {
    //   const proTaskOrderId = row.proTaskOrderId
    //   this.$confirm('是否确认取消该数据项', '警告', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     this.cancelLoading = true
    //     return cancelEquipment(proTaskOrderId)
    //   }).then((res) => {
    //     this.cancelLoading = false
    //     this.getList()
    //     this.msgSuccess('作废成功')
    //   }).catch(() => {
    //     this.cancelLoading = false
    //     this.getList()
    //     // this.msgSuccess(error)
    //   })
    // },

    // 提交设备信息
    handleSubmit() {
      this.$refs['formData'].validate((valid) => {
        if (valid) {
          this.submitLoading = true
          if (this.dialogType !== 'new') { // 编辑
            console.log('编辑')
            // updateEquipment(this.formData).then(res => {
            //   this.$message.success(res.msg)
            //   this.dialogVisible = false
            //   this.passVisible = false
            //   this.getList()
            // })
          } else {
            // addProductionTask(this.formData).then(res => {
            //   this.$message.success(res.msg)
            //   this.dialogVisible = false
            //   this.passVisible = false
            //   this.getList()
            // })
          }
        }
      })
    },
    // 提交DNC信息
    dncSubmitForm() {
      this.dncData.equipmentIds = this.dncList.filter(x => x.checked).map(r => r.id)
      appointStart(this.dncData).then(res => {
        this.dncDialogVisible = false
        this.msgSuccess('开始成功')
        this.getList()
      })
      // this.$confirm('是否确认开始该数据项', '警告', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
      //   this.startOrderLoading = true
      //   // return appointStart(data)
      // }).then(() => {
      //   this.startOrderLoading = false
      //   // this.getList()
      //   this.msgSuccess('开始成功')
      // }).catch(() => {
      //   this.startOrderLoading = false
      //   this.getList()
      //   // this.msgSuccess(error)
      // })
    },

    // /** 删除按钮操作 */
    // handleDelete(scope) {
    //   const id = scope.row.id
    //   this.$confirm('是否确认删除设备名称为"' + scope.row.equipmentName + '"的数据项?', '警告', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     return delEquipment(id)
    //   }).then(() => {
    //     this.getList()
    //     this.msgSuccess('删除成功')
    //   }).catch(() => {
    //   })
    // },

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
    // 切换
    handleToggle(modeStatus) {
      const type = modeStatus === '1' ? '2' : '1'
      // const type = modeStatus === '1' ? '2' : '1'
      this.btnLoading = true
      appointToggle(type).then((res) => {
        this.getMode()
        this.msgSuccess('切换成功')
        this.btnLoading = false
      }).catch((err) => {
        console.log('err', err)
        this.btnLoading = false
      })
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
    // 开始时间
    beginDate() {
      const self = this
      return {
        disabledDate(time) {
          if (self.formData.scheduledCompleteDate) {
            // 如果结束时间不为空，则小于结束时间
            return new Date(self.formData.scheduledCompleteDate).getTime() < time.getTime()
          } else {
            return time.getTime() + (1 * 24 * 60 * 60 * 1000) < Date.now()// 开始时间不选时，结束时间最大值小于等于当天
          }
        }
      }
    },
    // 结束时间
    processDate() {
      const self = this
      return {
        disabledDate(time) {
          if (self.formData.scheduledStartDate) { // 如果开始时间不为空，则结束时间大于开始时间
            return new Date(self.formData.scheduledStartDate).getTime() - (1 * 24 * 60 * 59 * 1000) > time.getTime()
            // return new Date(self.formData.scheduledStartDate).getTime() - 1000 > time.getTime()
          } else {
            return time.getTime() + (1 * 24 * 60 * 60 * 1000) < Date.now()// 开始时间不选时，结束时间最大值小于等于当天
          }
        }
      }
    },
    // 表单重置
    reset() {
      this.formData = {
        lineId: undefined, // 产线ID
        productionLine: undefined, // 产线编号
        wipOrderType: 1, // 生产任务类型
        productId: undefined, // 产品名称
        // workingProcedureId: undefined, // 工序id
        workName: undefined, // 工序id
        // dockingCode: this.$Dz.randomWord(true, 4, 4), // 对接码
        dockingCode: undefined, // 对接码
        scheduledStartDate: undefined, // 计划开始时间
        scheduledCompleteDate: undefined, // 计划结束时间
        quantity: 10, // 订单制作工件数量
        materialAddParms: []
      }
      this.resetForm('formData')
    },
    // 过滤设备类型
    ProgressStatusFormat(row) {
      const obj = {
        '110': '已下达',
        '120': '进行中',
        '130': '已完工',
        '140': '已删除',
        '150': '强制关闭',
        '160': '暂停'
      }
      return obj[row.progressStatus]
    },
    wipOrderTypeFormat(row) {
      const obj = {
        '1': '正常订单',
        '2': '返工返修订单'
      }
      return obj[row.wipOrderType]
    }
  }

}
</script>

<style>
/*.dialog .normalFormItem .el-form-item__label{*/
.normalFormItem .el-form-item__label {
  background: none !important;
  height: 40px;
  border-radius: 0 !important;
  border: 0px solid red;
  border-right: none;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

.normalFormItem .el-card__header {
  padding: 10px 20px;
}
</style>
