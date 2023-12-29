<template>
  <div class="app-container">
    <el-card shadow="never" class="card">
      <el-form ref="queryForm" :inline="true" :model="queryParams">
        <el-form-item>
          <el-button
            type="success"
            icon="el-icon-plus"
            size="small"
            @click="handleAdd"
          >
            新增
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

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog v-dialogDrag :close-on-click-modal="false" :modal-append-to-body="false" title="新增报工" :visible.sync="dialogVisible" class="dialog" width="640px">
      <el-form
        ref="formData"
        :rules="rules"
        :model="formData"
        label-width="90px"
        style="width: 520px; margin-left:40px;"
      >
        <el-form-item label="工位" prop="deviceCode">
          <el-select v-model="formData.deviceCode" placeholder="请选择工位" style="width: 100%;">
            <el-option
              v-for="(item, index) in stationList"
              :key="index"
              :label="item.stationName"
              :value="item.stationCode"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="二维码" prop="qrCode">
          <div style="display: flex;justify-content: space-between;align-items: center">
            <el-input v-model="formData.qrCode" placeholder="请输入二维码" clearable style="margin-right: 10px" />
            <el-button
              type="success"
              size="small"
              style="height: 36px"
              @click="handleCode"
            >
              获取二维码
            </el-button>
          </div>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="formData.type" placeholder="请选择类型" style="width: 100%;">
            <el-option label="开工" value="1" />
            <el-option label="完工" value="2" />
          </el-select>
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
import { addReport, getCood, getReport, putReport } from '@/api/mom/manualWork'
import { listStation } from '@/api/report/station'
export default {
  name: 'MomOrder',
  data() {
    return {
      column: [
        { type: 'index', index: this.indexMethod, fixed: true },
        { label: '二维码', prop: 'qrCode', disableSort: true },
        { label: '进出料类型', render: (h, scope) => {
          return (
            <el-tag size='small' type={ scope.row.outInputType === '1' ? 'success' : '' }>{ this.outInputTypeFormat(scope.row) }</el-tag>
          )
        } },
        { label: '生产时间', prop: 'productionTime', disableSort: true },
        { label: 'MOM报工响应', prop: 'momResponse', disableSort: true },
        { label: '创建时间', prop: 'updateTime', width: 180, disableSort: true },
        {
          label: '操作', render: (h, scope) => {
            return (
              <div>
                <el-button
                  v-hasPermi={['mom:dzics:manualWork:repeat']}
                  loading={this.startLoading}
                  type='success'
                  size='mini'
                  onClick={() => {
                    this.handleStart(scope.row)
                  }}
                >
                  重发
                </el-button>
              </div>
            )
          }, width: 140
        }
      ],
      // 遮罩层(加载)
      loading: false,
      startLoading: false,
      total: 0, // 列表总条数
      queryParams: { // 查询信息
        page: 1,
        limit: 20
      },
      formData: {},
      dialogVisible: false, // 新增弹窗
      list: [], // 表格数据
      stationList: [],
      // 表单校验
      rules: {
        deviceCode: [
          { required: true, message: '请选择工位', trigger: 'change' }
        ],
        qrCode: [
          { required: true, message: '请输入二维码', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ]
      }
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
    sortChange(column) {
      this.$mySort(this.queryParams, column, this.getList)
    },
    // 获取机器人列表
    getList() {
      this.loading = true
      getReport(this.queryParams).then(res => {
        this.list = res.data
        this.total = res.count || 0
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },

    // 重发
    handleStart(row) {
      const data = {
        id: row.id
      }
      this.$confirm('是否确认是否操作该数据项', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.startLoading = true
        return putReport(data)
      }).then(() => {
        this.startLoading = false
        this.getList()
        this.msgSuccess('重发成功')
      }).catch(() => {
        this.startLoading = false
        this.getList()
        // this.msgSuccess(error)
      })
    },
    // 获取工序下拉
    getListStation() {
      listStation(this.queryParams).then(res => {
        this.stationList = res.data.map(item => {
          const obj = {
            stationName: item.stationName,
            stationCode: item.stationCode
          }
          return obj
        })
      })
    },
    // 新增按钮
    handleAdd() {
      this.reset()
      this.getListStation()
      this.dialogVisible = true
    },
    // 获取二维码
    handleCode() {
      getCood().then(res => {
        this.formData.qrCode = res.data
      })
    },
    // 表单提交
    submitForm() {
      this.$refs['formData'].validate((valid) => {
        if (valid) {
          addReport(this.formData).then(res => {
            this.$message.success(res.msg)
            this.getList()
          })
        }
      })
    },
    outInputTypeFormat(row) {
      const obj = {
        '1': '出料',
        '2': '进料'
      }
      return obj[row.outInputType]
    },
    // 表单重置
    reset() {
      this.formData = {
        deviceCode: undefined,
        qrCode: undefined,
        type: undefined
      }
      this.resetForm('formData')
    }
  }

}
</script>
