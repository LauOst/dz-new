<template>
  <div class="app-container">
    <el-card shadow="never" class="card">
      <el-form ref="queryForm" :model="queryParams.model" :inline="true">
        <el-form-item prop="qrCode">
          <el-input v-model="queryParams.model.qrCode" v-support size="small" clearable placeholder="二维码" style="width: 180px;" />
        </el-form-item>
        <el-form-item prop="deviceCode">
          <el-input v-model="queryParams.model.deviceCode" v-support size="small" clearable placeholder="机床编号" style="width: 180px;" />
        </el-form-item>
        <el-form-item prop="detectionResult">
          <el-select v-model="queryParams.model.detectionResult" size="small" placeholder="检测结果">
            <el-option label="全部" :value="''" />
            <el-option label="正常" value="1" />
            <el-option label="异常" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="dateRange"
            size="small"
            style="width: 240px"
            value-format="yyyy-MM-dd"
            type="daterange"
            unlink-panels
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
          <el-button v-hasPermi="['check:testRecordXj:excel']" type="warning" icon="el-icon-download" size="small" @click="handleExport">导出</el-button>
          <el-button type="success" icon="el-icon-s-tools" size="small" @click="handleConfig">看板检测项配置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <dz-table
      v-loading="loading"
      :column="tableColumn"
      :data="list"
      :total="total"
      pagination
      :page.sync="queryParams.page"
      :limit.sync="queryParams.limit"
      @pagination="getList"
    />
    <!--    @sortChange="sortChange"-->
    <!-- 弹出层 -->
    <el-dialog
      v-dialogDrag
      :visible.sync="dialogVisible"
      top="8vh"
      title="检测项配置"
      class="dialog"
      width="1200px"
    >
      <el-card shadow="never" style="margin-bottom: 22px;height: 550px;overflow-y: scroll;" class="product-card">
        <el-row :gutter="20">
          <el-col v-for="(item, index) in configList" :key="index" :span="6">
            <el-checkbox v-model="item.isShow" style="margin-right: 20px" :true-label="0" :false-label="1" :disabled="item.isShow === 1 ? maxNum : false">看板是否展示</el-checkbox>
            <span>{{ item.tableColCon }}</span>
          </el-col>
        </el-row>
      </el-card>
      <div style="text-align:right;">
        <el-button @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getSub, getToken } from '@/utils/function/auth'
import {
  downloadTestRecordXj,
  listTestcheckConfig,
  listTestRecordXj,
  updateTestcheckConfig
} from '@/api/check/testRecordXj'
import tableColumn from './constant'
/*
  queryParams:角色列表请求参数
  departList:站点列表
  total:列表总条数
  dialogVisible:是否显示 Dialog
  dialogType:控制表头显示内容
  role:弹出层数据对象
* */

export default {
  name: 'TestRecordXj',
  data() {
    return {
      checkList: [],
      loading: false,
      btnLoading: false,
      // 显示搜索条件
      itemShow: false,
      // 分页搜索参数
      queryParams: {
        page: 1,
        limit: 20,
        field: undefined,
        type: undefined,
        model: {
          orderId: undefined,
          productNo: undefined,
          lineId: undefined,
          startTime: undefined,
          endTime: undefined,
          detectionResult: ''
        }
      },
      dialogVisible: false,
      // 设备列表
      list: [],
      tableColumn: tableColumn,
      // 分页数据
      total: 0,
      // 表单信息
      formData: {},
      dateRange: [],
      configList: [],
      // 表单校验
      rules: {
        departId: [
          { required: true, message: '请选择站点', trigger: 'change' }
        ],
        productName: [
          { required: true, message: '产品名称不能为空', trigger: 'blur' }
        ],
        productNo: [
          { required: true, message: '产品编号不能为空', trigger: 'blur' }
        ]
      },
      uploadUrl: process.env.VUE_APP_BASE_API + 'workpieceData/export',
      jwt_token: getToken(),
      sub: getSub()
    }
  },
  computed: {
    ...mapGetters([
      'userIdentity',
      'orderList'
    ]),
    maxNum() {
      const num = this.numberOfTrueValues(this.configList)
      return num >= 20
    }
  },
  mounted() {
    this.dateRange = this.getMonthDays()
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
    /** 查询检测记录列表 */
    getList() {
      this.loading = true
      // console.log('试试', this.addDateRangeModel(this.queryParams, this.dateRange))
      listTestRecordXj(this.addDateRangeModel(this.queryParams, this.dateRange)).then(res => {
        const { list, total } = res.data
        this.list = list
        this.total = total || 0
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    addDateRangeModel(params, dateRange) {
      var search = params
      if (dateRange != null && dateRange !== '') {
        search.model.startTime = dateRange[0]
        search.model.endTime = dateRange[1]
      } else {
        search.model.startTime = ''
        search.model.endTime = ''
      }
      return search
    },

    getConfigList() {
      listTestcheckConfig().then(r => {
        this.configList = r.data
      })
    },

    /** 看板配置按钮 */
    handleConfig() {
      this.getConfigList()
      this.dialogVisible = true
    },
    /** 看板配置提交 */
    submitForm() {
      updateTestcheckConfig(this.configList).then(r => {
        this.msgSuccess('修改成功')
        this.dialogVisible = false
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
      const newData = JSON.parse(JSON.stringify(this.queryParams))
      newData.page = 1
      newData.limit = -1
      this.btnLoading = true
      downloadTestRecordXj(newData).then((res) => {
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
        departId: undefined,
        orderId: undefined,
        productId: undefined,
        productName: undefined,
        productNo: undefined
      }
      this.resetForm('formData')
    },
    numberOfTrueValues(obj) {
      let counter = 0
      for (let index = 0; index < obj.length; index++) {
        if (obj[index].isShow === 0) {
          counter++
        }
      }
      return counter
    }
  }
}
</script>

<style lang="scss">
.specialColor {
  color: red;
}
</style>

