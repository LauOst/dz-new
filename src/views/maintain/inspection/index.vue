<template>
  <div class="app-container">
    <!-- 头部筛选 -->
    <el-card shadow="never" class="card">
      <el-form ref="queryForm" :inline="true" :model="queryParams">
        <el-form-item prop="lineId">
          <el-select v-model="queryParams.lineId" size="small" style="width: 180px;" placeholder="产线名称">
            <el-option label="全部" :value="''" />
            <el-option v-for="(item,index) in lineList" :key="index" :label="item.lineName" :value="item.lineId" />
          </el-select>
        </el-form-item>
        <el-form-item prop="equipmentNo">
          <el-input
            v-model="queryParams.equipmentNo"
            clearable
            size="small"
            placeholder="设备编号"
            style="width: 180px;"
          />
        </el-form-item>
        <el-form-item prop="checkType">
          <el-select v-model="queryParams.checkType" size="small" style="width: 180px;" placeholder="巡检类型">
            <el-option label="全部" :value="''" />
            <el-option v-for="(item,index) in checkTypeList" :key="index" :label="item.description" :value="item.itemText" />
          </el-select>
        </el-form-item>
        <el-form-item prop="checkNumber">
          <el-input
            v-model="queryParams.checkNumber"
            clearable
            size="small"
            placeholder="巡检单号"
            style="width: 180px;"
          />
        </el-form-item>
        <start-date v-model="queryParams.startTime" />
        <end-date v-model="queryParams.endTime" />
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
          <el-button v-hasPermi="['equipment:inspection:add']" type="success" icon="el-icon-plus" size="small" @click="handleAdd">
            新增
          </el-button>
          <el-button v-hasPermi="['equipment:inspection:excel']" :loading="btnLoading" type="warning" icon="el-icon-download" size="small" @click="handleExport">导出</el-button>
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
      :title="dialogType==='edit'?'编辑设备巡检':'新增设备巡检'"
      :visible.sync="dialogVisible"
      class="dialog"
      width="1000px"
    >

      <el-form
        ref="formData"
        :model="formData"
        label-width="110px"
        :rules="addFormRules"
        style="width: 92%; margin-left:40px;"
      >

        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item label="产线名称" prop="lineId">
              <el-select v-model="formData.lineId" placeholder="请选择产线" style="width: 100%;" :disabled="dialogType !=='new'" @change="changeLind">
                <el-option v-for="(item,index) in lineList" :key="index" :label="item.lineName" :value="item.lineId" />
              </el-select>
            </el-form-item>
            <el-form-item label="设备名称" prop="deviceId">
              <el-select v-model="formData.deviceId" placeholder="请选择设备" :disabled="dialogType !=='new'" style="width: 100%;" @change="changeDevice">
                <el-option v-for="(item,index) in devcieList" :key="index" :label="item.equipmentName" :value="item.deviceId" />
              </el-select>
            </el-form-item>
            <!--            <el-form-item label="设备类型" prop="deviceTypeCode">-->
            <!--              <el-input v-model="formData.deviceTypeCode" clearable placeholder="请输入设备类型" />-->
            <!--            </el-form-item>-->
            <!--            <el-form-item label="设备编号" prop="deviceTypeCode">-->
            <!--              <el-input v-model="formData.deviceTypeCode" clearable placeholder="请输入设备编号" />-->
            <!--            </el-form-item>-->
            <el-form-item label="巡检类型" prop="checkType">
              <el-select v-model="formData.checkType" style="width: 100%;" :disabled="dialogType !=='new'" placeholder="巡检类型" @change="changeCheckType">
                <el-option v-for="(item,index) in checkTypeList" :key="index" :label="item.description" :value="item.itemText" />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col

            :span="14"
          >
            <div
              v-for="(item, index) in formData.historyItemList"
              :key="index"
              class="l-flex l-col-center"
            >

              <el-form-item
                :label="item.checkName"
                :prop="item.checkName"
                label-width="90px"
                style="margin-right: 20px;width: 100%"
              >
                <el-input v-model="item.contentText" :placeholder="`请输入${item.checkName}`" style="width: 100%" />
              </el-form-item>
              <el-checkbox v-model="item.checked" style="margin-right: 20px;margin-bottom: 22px" />
            </div>
          </el-col>
        </el-row>
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

    <!--查看详情-->
    <el-dialog
      v-dialogDrag
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      title="详情"
      :visible.sync="dialogVisibleDetail"
      class="dialog"
      width="600px"
    >

      <el-form
        ref="formData"
        :model="formData"
        label-width="110px"
        :rules="addFormRules"
        style="width: 92%; margin-left:40px;"
      >

        <el-row :gutter="20">
          <el-col
            :span="24"
          >
            <div
              v-for="(item, index) in checkItemListDetail"
              :key="index"

              class="l-flex l-col-center"
            >
              <el-checkbox v-model="item.checked" style="margin-right: 20px;margin-bottom: 22px" disabled />
              <el-form-item
                :label="item.checkName"
                label-width="90px"
                style="margin-right: 20px;width: 100%"
              >
                <el-input v-model="item.contentText" style="width: 100%" disabled />
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </el-form>

      <!-- 操作按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button type="plain" @click="dialogVisibleDetail = false">取消</el-button>
        <el-popover v-model="passVisibleDetail" placement="top" width="160">
          <p>确认提交？</p>
          <div style="text-align: right; margin: 0">
            <el-button size="small" type="text" @click="passVisibleDetail = false">取消</el-button>
            <el-button type="primary" size="small" @click="handleSubmitDetail">确定</el-button>
          </div>
          <el-button slot="reference" class="l-m-l-10" type="primary">提交</el-button>
        </el-popover>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { getCheckList, getDictItemDictCode, getlineSelect, listDevcie } from '@/api/commens' // 获取产线列表
import { addInspect, delInspect, inspectDetails, listInspect, updateInspect } from '@/api/euipment/inspection'
import { downloadInspection } from '@/api/excel/excel'

export default {
  name: 'Inspection',
  data() {
    return {
      column: [
        { type: 'index', index: this.indexMethod },
        { label: '产线名称', prop: 'lineName' },
        { label: '设备名称', prop: 'equipmentName' },
        { label: '设备编号', prop: 'equipmentNo' },
        { label: '巡检单号', prop: 'checkNumber' },
        { label: '巡检时间', prop: 'createTime' },
        { label: '巡检人', prop: 'createBy' },
        { label: '巡检类型', prop: 'checkType' },
        {
          label: '操作', render: (h, scope) => {
            return (
              <div>
                <el-button
                  v-hasPermi={['equipment:inspection:edit']}
                  type='primary'
                  size='mini'
                  onClick={() => {
                    this.handleEdit(scope.row)
                  }}
                >编辑
                </el-button>
                <el-button
                  type='success'
                  size='mini'
                  onClick={() => {
                    this.handleDetail(scope.row)
                  }}
                >查看巡检详情
                </el-button>
                <el-button
                  v-hasPermi={['equipment:maintain:del']}
                  type='danger'
                  size='mini'
                  onClick={() => {
                    this.handleDelete(scope)
                  }}
                >删除
                </el-button>
              </div>
            )
          }, width: 260
        }
      ],
      // 遮罩层(加载)
      loading: false,
      btnLoading: false,
      total: 0, // 列表总条数
      queryParams: { // 查询信息
        page: 1,
        limit: 20,
        equipmentNo: undefined, // 机器人编码
        lineId: undefined, // 产线名称
        checkNumber: undefined, // 巡检单号
        checkType: undefined, // 巡检单号
        field: undefined,
        type: undefined,
        startTime: undefined,
        endTime: undefined
      },
      addFormRules: { // 表单验证
        lineId: [
          { required: true, message: '请选择产线', trigger: 'change' }
        ],
        deviceId: [
          { required: true, message: '请输入设备名称', trigger: 'blur' }
        ],
        checkType: [
          { required: true, message: '请输选择设备类型', trigger: 'change' }
        ]
      },
      formData: {},
      startTime: '',
      dialogVisible: false, // 新增弹窗
      dialogVisibleDetail: false, // 新增弹窗
      dialogType: 'new',
      passVisible: false, // 确认气泡框
      passVisibleDetail: false, // 确认气泡框
      list: [], // 表格数据
      lineList: [], // 产线列表
      devcieList: [], // 设备列表
      checkTypeList: [], // 巡检想类型列表
      checkItemList: [], // 巡检想列表
      checkItemListDetail: [], // 巡检想列表
      equipmentType: undefined
    }
  },
  mounted() {
    this.getList()
    this.handleLine()
    this.getDictCode()
    // this.getCheck()
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
    // 获取机器人列表
    getList() {
      this.loading = true
      listInspect(this.queryParams).then(res => {
        this.list = res.data
        this.total = res.count || 0
        this.loading = false
      }).catch(() => {
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
    // 获取巡检类型
    getDictCode() {
      getDictItemDictCode('XJLX001').then(r => {
        this.checkTypeList = r.data
      })
    },
    getCheck(equipmentType) {
      this.checkItemList = []
      getCheckList({ page: 1, limit: 20, equipmentType: equipmentType }).then(r => {
        r.data.map((item) => {
          this.checkItemList.push(Object.assign({}, { checked: false, checkName: item.checkName, checkHistoryItemId: '', contentText: '' }))
        })

        this.formData.historyItemList = this.checkItemList
      })
    },
    // 新增
    handleAdd() {
      this.reset()
      if (this.lineList && this.lineList.length > 0) {
        this.formData.lineId = this.lineList[0].lineId
        this.getListDevcie(this.formData.lineId)
      }
      // this.getCheck()
      // this.formData.historyItemList = this.checkItemList
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    // 选择产线回调
    changeLind(id) {
      this.formData.deviceId = undefined

      this.getListDevcie(id)
    },
    // 选择设备回调
    changeDevice(e) {
      const [arr] = this.devcieList.filter(t => t.deviceId === e)
      const { equipmentType } = arr
      this.equipmentType = equipmentType
      if (this.formData.checkType) {
        this.getCheck(equipmentType)
      }
    },
    changeCheckType() {
      if (this.formData.deviceId) {
        this.getCheck(this.equipmentType)
      }
    },
    // 编辑
    handleEdit(row) {
      this.reset()
      this.getListDevcie(row.lineId)
      // 编辑查看详情
      inspectDetails(row.checkHistoryId).then(r => {
        this.formData = r.data
        this.formData.lineId = this.formData.lineId.toString()
        this.formData.deviceId = this.formData.deviceId.toString()
        this.dialogType = 'edit'
        this.dialogVisible = true
      })
    },
    // 获取所以设备列表
    getListDevcie(id) {
      this.devcieList = []
      listDevcie({ lineId: id }).then(r => {
        this.devcieList = r.data
      })
    },
    handleSubmit() {
      this.$refs['formData'].validate((valid) => {
        if (valid) {
          if (this.dialogType === 'new') {
            addInspect(this.formData).then(r => {
              this.$message.success(r.msg)
              this.dialogVisible = false
              this.passVisible = false
              this.getList()
            })
          } else {
            updateInspect(this.formData.historyItemList).then(r => {
              this.$message.success(r.msg)
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
      const id = scope.row.checkHistoryId
      this.$confirm('是否确认删除该数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return delInspect(id)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(() => {
      })
    },

    // 查看巡检详情
    handleDetail(row) {
      inspectDetails(row.checkHistoryId).then(r => {
        this.checkItemListDetail = r.data.historyItemList
        this.dialogVisibleDetail = true
      })
    },
    handleSubmitDetail() {
      this.dialogVisibleDetail = false
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
      await this.resetForm('queryForm')
      await this.handleQuery()
    },
    // 导出按钮
    handleExport() {
      this.btnLoading = true
      downloadInspection(this.queryParams).then((res) => {
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
        deviceId: undefined, // 设备id
        checkType: undefined, // 巡检类型
        historyItemList: []
        // {
        //   checkHistoryItemId: undefined,
        //     checkName: undefined,
        //   checked: undefined,
        //   contentText: undefined
        // }

      }
      this.devcieList = []
      this.resetForm('formData')
    }
  }
}
</script>

<style scoped>

</style>
