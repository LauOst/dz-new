<template>
  <div class="app-container">
    <!-- 头部筛选 -->
    <el-card shadow="never" class="card">
      <el-form ref="queryForm" :inline="true" :model="queryParams">
        <el-form-item prop="lineId">
          <el-select v-model="queryParams.lineId" size="small" style="width: 180px;" placeholder="产线名称">
            <el-option label="全部" :value="''" />
            <el-option v-for="(item,index) in lineLists" :key="index" :label="item.lineName" :value="item.lineId" />
          </el-select>
        </el-form-item>
        <el-form-item prop="externalCode">
          <el-input
            v-model="queryParams.externalCode"
            v-support
            size="small"
            clearable
            placeholder="投料点编号"
            style="width: 180px;"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
          <el-button
            v-hasPermi="['mom:dzics:deviceManage:add']"
            type="success"
            icon="el-icon-plus"
            size="small"
            @click="handleAdd"
          >
            新增
          </el-button>
          <el-button v-hasPermi="['mom:dzics:agvFeed:excel']" :loading="btnLoading" type="warning" icon="el-icon-download" size="small" @click="handleExport">导出</el-button>

        </el-form-item>
        <span class="head-switch">
          <span style="margin-right: 20px;vertical-align: middle;font-size: 14px;font-weight: 700">AGV呼叫模式:</span>
          <el-switch
            v-model="runMode"
            :active-value="1"
            :inactive-value="0"
            active-text="自动"
            inactive-text="手动"
            @change="beforeChangeRun"
          />
        </span>
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

    <!--新增/编辑三一设备-->
    <el-dialog
      v-dialogDrag
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      :title="dialogType==='edit'?'编辑三一设备':'新增三一设备'"
      :visible.sync="dialogVisible"
      class="dialog"
      width="530px"
    >
      <el-form
        ref="formData"
        :model="formData"
        :rules="addFormRules"
        label-width="120px"
        style="width: 400px; margin-left:40px;"
      >
        <el-form-item label="产线名称" prop="lineId">
          <el-select
            v-model="formData.lineId"
            placeholder="请选择产线"
            style="width: 100%;"
          >
            <el-option v-for="(item,index) in lineLists" :key="index" :label="item.lineName" :value="item.lineId" />
          </el-select>
        </el-form-item>
        <el-form-item label="投料点编号" prop="externalCode">
          <el-input v-model="formData.externalCode" clearable placeholder="请输入投料点编号" />
        </el-form-item>
        <el-form-item label="投料点区域" prop="externalRegion">
          <el-input v-model="formData.externalRegion" clearable placeholder="请输入投料点区域" />
        </el-form-item>

        <el-form-item label="料点模式" prop="pointModel">
          <el-select
            v-model="formData.pointModel"
            placeholder="请选择料点模式"
            style="width: 100%;"
          >
            <el-option v-for="(item,index) in pointModelList" :key="index" :label="item.name" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="结束工位" prop="nextPoint">
          <el-select v-model="formData.nextPoint" style="width: 100%;" placeholder="结束工位">
            <el-option v-for="(item,index) in endStationList" :key="index" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="线路节点" prop="lineNode">
          <el-input v-model="formData.lineNode" clearable placeholder="请输入线路节点" />
        </el-form-item>
        <el-form-item label="小车名称" prop="inIslandCode">
          <el-select v-model="formData.inIslandCode" style="width: 100%;" placeholder="产线名称">
            <el-option v-for="(item,index) in carList" :key="index" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="工位编号(三一)" prop="stationId">
          <el-input v-model="formData.stationId" clearable placeholder="请输入工位编号" />
        </el-form-item>
        <el-form-item label="料点料框类型" prop="palletType">
          <el-input v-model="formData.palletType" clearable placeholder="请输入料点料框类型" />
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

    <!-- 料框编码 -->
    <el-dialog v-dialogDrag :close-on-click-modal="false" :modal-append-to-body="false" title="料框编码绑定" :visible.sync="dialogVisibleBind" class="dialog" width="530px">
      <el-form
        ref="formDataBind"
        :model="formDataBind"
        :rules="BindFormRules"
        label-width="100px"
        style="width: 400px; margin-left:40px;"
      >
        <el-form-item label="料框编码" prop="farmCode">
          <el-input v-model="formDataBind.farmCode" clearable placeholder="请输入料点编码" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleBind = false">
          取消
        </el-button>
        <el-button type="primary" @click="bindSubmitForm">
          确定
        </el-button>
      </div>
    </el-dialog>

    <!-- 料框详情 -->
    <el-dialog v-dialogDrag :close-on-click-modal="false" :modal-append-to-body="false" title="物料详情" :visible.sync="dialogVisibleDetail" class="dialog" width="1000px">
      <dz-table
        v-loading="detailLoading"
        :column="detailColumn"
        :data="detailList"
        :height="500"
      />

      <el-dialog
        width="50%"
        title="内层 Dialog"
        :visible.sync="innerVisible"
        append-to-body
      >
        <dz-table
          :column="innerColumn"
          :data="innerList"
          :height="500"
        />
        <div slot="footer" class="dialog-footer">
          <el-button @click="innerVisible = false">
            取消
          </el-button>
        </div>
      </el-dialog>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleDetail = false">
          取消
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { listProcedure, getlineSelect } from '@/api/commens' // 获取产线列表
import { mapGetters } from 'vuex'
import {
  addAgvFeed,
  agvFeedList,
  delAgvFeed,
  updateAgvFeed,
  downloadAgvFeed,
  changeAgvFeed,
  agvFeedMode, updateAgvMode, bindAgvCode, agvFeedBindList, agvFeedInnerList, agvFeedInnerMove
} from '@/api/mom/agvFeed'

export default {
  name: 'AgvFeed',
  data() {
    return {
      column: [
        { type: 'index', index: this.indexMethod, fixed: true },
        { label: '产线名称', prop: 'lineName', minWidth: 90 },
        { label: '投料点编号', prop: 'externalCode', minWidth: 100 },
        { label: '投料点区域', prop: 'externalRegion', minWidth: 100 },
        { label: '料框编码', prop: 'frameCode', minWidth: 90 },
        { label: '线路节点', prop: 'lineNode', minWidth: 90 },
        { label: '小车名称', prop: 'inIslandCode', minWidth: 90 },
        { label: '结束工位', prop: 'nextPoint', formatter: this.pointFormatter, minWidth: 90 },
        { label: '料点模式', prop: 'pointModel', formatter: this.modelFormatter, minWidth: 90 },
        { label: '工位编号(三一)', prop: 'stationId', width: 180 },
        {
          label: '操作', render: (h, scope) => {
            return (
              <div>
                <el-button
                  v-hasPermi={['mom:dzics:deviceManage:edit']}
                  type='primary'
                  size='mini'
                  onClick={() => {
                    this.handleEdit(scope.row)
                  }}
                >编辑
                </el-button>
                <el-button
                  v-hasPermi={['mom:dzics:deviceManage:del']}
                  type='danger'
                  size='mini'
                  onClick={() => {
                    this.handleDelete(scope)
                  }}
                >删除
                </el-button>
                {
                  scope.row.pointModel === 'SL' && (
                    <el-button
                      v-hasPermi={['mom:dzics:deviceManage:emptyOut']}
                      type='warning'
                      size='mini'
                      onClick={() => {
                        this.handleChange(scope, '2')
                      }}
                    >空框拖出
                    </el-button>
                  )
                }
                {
                  scope.row.pointModel === 'SL' && (
                    <el-button
                      v-hasPermi={['mom:dzics:deviceManage:call']}
                      type='info'
                      size='mini'
                      style='width: 68px'
                      onClick={() => {
                        this.handleChange(scope, '4')
                      }}
                    >叫料
                    </el-button>
                  )
                }
                {
                  scope.row.pointModel !== 'SL' && (
                    <el-button
                      v-hasPermi={['mom:dzics:deviceManage:fullOut']}
                      type='warning'
                      size='mini'
                      onClick={() => {
                        this.handleChange(scope, '1')
                      }}
                    >满料拖出
                    </el-button>
                  )
                }
                {
                  scope.row.pointModel !== 'SL' && (
                    <el-button
                      v-hasPermi={['mom:dzics:deviceManage:emptyIn']}
                      type='info'
                      size='mini'
                      style='width: 68px'
                      onClick={() => {
                        this.handleChange(scope, '7')
                      }}
                    >叫空框
                    </el-button>
                  )
                }
                <el-button
                  v-hasPermi={['mom:dzics:deviceManage:del']}
                  type='success'
                  size='mini'
                  onClick={() => {
                    this.handleBind(scope)
                  }}
                >料框编号绑定
                </el-button>
                <el-button
                  v-hasPermi={['mom:dzics:deviceManage:del']}
                  type='success'
                  size='mini'
                  onClick={() => {
                    this.handleDetail(scope)
                  }}
                >查看物料详情
                </el-button>
              </div>
            )
          }, width: 540, fixed: 'right'
        }
      ],
      detailColumn: [
        { label: '订单号', prop: 'momOrder' },
        { label: '物料编号', prop: 'productNo' },
        { label: '数量', prop: 'quantity' },
        { label: '料框编号', prop: 'frameCode' },
        {
          label: '操作', render: (h, scope) => {
            return (
              <div>
                <el-button
                  type='primary'
                  size='mini'
                  onClick={() => {
                    this.handleEditBody(scope.row)
                  }}
                >编辑
                </el-button>
              </div>
            )
          }
        }
      ],
      innerColumn: [
        { label: '订单号', prop: 'momOrder' },
        { label: '物料编号', prop: 'productNo' },
        { label: '二维码', prop: 'qrCode' },
        {
          label: '操作', render: (h, scope) => {
            return (
              <div>
                <el-button
                  type='primary'
                  size='mini'
                  onClick={() => {
                    this.handleMove(scope.row)
                  }}
                >移动至另一个小车
                </el-button>
              </div>
            )
          }
        }
      ],
      // 遮罩层(加载)
      loading: false,
      btnLoading: false,
      detailLoading: false,
      runMode: 0,
      total: 0, // 列表总条数
      queryParams: { // 查询信息
        page: 1,
        limit: 20,
        externalCode: undefined,
        lineId: undefined
        // stationCode: undefined // 工位编号
      },
      list: [], // 表格数据
      detailList: [], // 表格数据
      innerList: [], // 表格数据
      dialogVisible: false, // 新增弹窗
      dialogVisibleBind: false, // 新增弹窗
      dialogVisibleDetail: false, // 新增弹窗
      innerVisible: false, // 新增弹窗
      dialogType: 'new',
      passVisible: false, // 确认气泡框
      formData: {},
      formDataBind: {},
      addFormRules: { // 表单验证
        lineId: [
          { required: true, message: '请选择产线名称', trigger: 'change' }
        ],
        externalCode: [
          { required: true, message: '请输入投料点编号', trigger: 'blur' }
        ],
        externalRegion: [
          { required: true, message: '请输入投料点区域', trigger: 'blur' }
        ],
        pointModel: [
          { required: true, message: '请选择料点模式', trigger: 'change' }
        ],
        nextPoint: [
          { required: true, message: '请选择料结束工位', trigger: 'change' }
        ],
        lineNode: [
          { required: true, message: '请输入线路节点', trigger: 'blur' }
        ],
        inIslandCode: [
          { required: true, message: '请选择产线名称', trigger: 'change' }
        ],
        stationId: [
          { required: true, message: '请输入工位编号', trigger: 'blur' }
        ],
        palletType: [
          { required: true, message: '请输入料点料框类型', trigger: 'blur' }
        ]
      },
      BindFormRules: {
        farmCode: [
          { required: true, message: '请输入料点编码', trigger: 'blur' }
        ]
      },
      lineList: [], // 产线列表
      lineLists: [], // 产线列表
      processList: [], // 工序列表
      pointModelList: [
        { name: 'NG', value: 'NG' },
        { name: 'TL', value: 'TL' },
        { name: 'SL', value: 'SL' },
        { name: 'SLXL', value: 'SLXL' },
        { name: 'OK', value: '' }
      ], // 料点模式列表
      innerData: {},
      deviceTypeList: [{
        id: 1,
        name: '搬运机器人'
      }, {
        id: 3,
        name: '数控设备'
      }, {
        id: 4,
        name: '清洗机'
      }, {
        id: 5,
        name: '检测设备'
      }],
      solderingTypeList: [{
        id: 1,
        name: '连续焊'
      }, {
        id: 2,
        name: '组对点'
      }],
      // 结束工位列表
      endStationList: [{
        id: true,
        name: '是'
      }, {
        id: false,
        name: '否'
      }],
      carList: []
    }
  },
  computed: { ...mapGetters(['orderList']) },
  mounted() {
    this.getList()
    this.getOpenRun()
    this.handleLines()
    this.getCarList()
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

    // 获取工序列表
    getProcessList(data) {
      listProcedure(data).then(res => {
        this.processList = res.data
      })
    },
    // 查询agv呼叫模式
    getOpenRun() {
      agvFeedMode().then(res => {
        this.runMode = res.data.rm
      })
    },
    // 获取设备列表
    getList() {
      this.loading = true
      agvFeedList(this.queryParams).then(res => {
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
      }).catch(() => {
        this.loading = false
      })
    },
    // 获取物料详情
    getDetailList(data) {
      this.detailLoading = true
      agvFeedBindList(data).then(res => {
        this.detailList = res.data
        this.detailLoading = false
        this.dialogVisibleDetail = true
      })
    },
    // 新增设备
    handleAdd() {
      this.reset()
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    // 编辑设备
    handleEdit(row) {
      this.reset()
      this.formData = JSON.parse(JSON.stringify(row))
      console.log('formData', this.formData)
      this.dialogType = 'edit'
      this.dialogVisible = true
    },
    // 人工物流操作
    handleChange(scope, palletType) {
      changeAgvFeed({ basketType: scope.row.inIslandCode, palletType }).then(r => {
        this.$message.success(r.msg)
      })
    },
    // 提交设备信息
    handleSubmit() {
      this.$refs['formData'].validate((valid) => {
        if (valid) {
          if (this.dialogType !== 'new') { // 编辑
            updateAgvFeed(this.formData).then(res => {
              this.$message.success(res.msg)
              this.dialogVisible = false
              this.passVisible = false
              this.getList()
            })
          } else {
            addAgvFeed(this.formData).then(res => {
              this.$message.success(res.msg)
              this.dialogVisible = false
              this.passVisible = false
              this.getList()
            })
          }
        }
      })
    },
    // 绑定料点编码提交
    bindSubmitForm() {
      this.$refs['formDataBind'].validate((valid) => {
        if (valid) {
          bindAgvCode(this.formDataBind).then(res => {
            this.$message.success(res.msg)
            this.dialogVisibleBind = false
            this.getList()
          })
        }
      })
    },
    // detailSubmitForm() {},
    /** 删除按钮操作 */
    handleDelete(scope) {
      const id = scope.row.materialPointId
      this.$confirm('是否确认删除该数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return delAgvFeed(id)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(() => {
      })
    },
    // 料框绑定
    handleBind(scope) {
      this.resetBind()
      this.formDataBind = JSON.parse(JSON.stringify(scope.row))
      this.dialogVisibleBind = true
    },
    // 查询料框详情
    handleDetail(scope) {
      const scopeData = JSON.parse(JSON.stringify(scope.row))
      this.getDetailList(scopeData)
    },
    getCarList() {
      for (var i = 0; i < 26; i++) {
        this.carList.push(String.fromCharCode(65 + i))
      }
    },
    getAgvFeedInnerList(data) {
      agvFeedInnerList(data).then(r => {
        this.innerList = r.data
      })
    },
    // 物料详情内按钮
    handleEditBody(row) {
      this.innerData = row
      this.getAgvFeedInnerList(this.innerData)
      // agvFeedInnerList(row).then(r => {
      //   this.innerList = r.data
      //   this.innerVisible = true
      // })
      this.innerVisible = true
    },
    // 移动小车
    handleMove(row) {
      agvFeedInnerMove(row).then(r => {
        this.getAgvFeedInnerList(this.innerData)
        this.msgSuccess('移动成功')
        console.log('移动小车')
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
    beforeChangeRun(row) {
      const text = row === 1 ? '启用' : '停用'
      this.$confirm('确认要"' + text + '"吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return updateAgvMode({ rm: row })
      }).then(() => {
        this.msgSuccess(`${text}成功`)
      }).catch(() => {
        this.runMode = row === 1 ? 0 : 1
      })
    },

    // 导出按钮
    handleExport() {
      this.btnLoading = true
      downloadAgvFeed(this.queryParams).then((res) => {
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
        lineId: undefined,
        externalCode: undefined,
        dzStationCode: undefined,
        nextPoint: undefined,
        externalRegion: undefined,
        inIslandCode: undefined,
        pointModel: undefined,
        lineNode: undefined,
        stationId: undefined,
        palletType: undefined
      }
      this.resetForm('formData')
    },
    resetBind() {
      this.formDataBind = {
        farmCode: undefined,
        materialPointId: undefined
      }
      this.resetForm('formDataBind')
    },

    modelFormatter(row) {
      const obj = {
        NG: 'NG',
        SL: 'SL',
        SLXL: 'SLXL',
        '': 'OK',
        TL: 'TL' }
      return obj[row.pointModel]
    },
    pointFormatter(row) {
      const obj = {
        true: '是',
        false: '否' }
      return obj[row.nextPoint]
    },
    // 过滤设备类型
    deviceTypeFormat(row) {
      const obj = {
        1: '搬运机器人',
        2: '焊接机器人',
        3: '数控设备',
        4: '清洗机',
        5: '检测设备' }
      return obj[row.deviceType]
    }
  }
}
</script>

<style lang="scss" scoped>
.head-switch {
  float: right;
  display: inline-block;
  margin-right: 40px;
  transform: translateY(50%);
}

</style>
