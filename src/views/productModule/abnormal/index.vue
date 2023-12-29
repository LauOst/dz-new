<template>
  <div class="app-container">
    <!-- 头部筛选 -->
    <el-card shadow="never" class="card">
      <el-form ref="queryForm" :inline="true" :model="queryParams">
        <el-form-item prop="equipmentName">
          <el-input v-model="queryParams.equipmentName" size="small" clearable placeholder="员工名称" style="width: 180px;" />
        </el-form-item>
        <el-form-item prop="equipmentType">
          <el-select v-model="queryParams.status" v-support size="small" placeholder="报工状态" style="width: 180px;">
            <el-option label="全部" :value="''" />
            <el-option label="成功" :value="'1001'" />
            <el-option label="失败" :value="'-1'" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
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
    <el-dialog v-dialogDrag :close-on-click-modal="false" :modal-append-to-body="false" title="详情" :visible.sync="dialogVisible" class="dialog" width="930px">
      <div>
        <el-row :gutter="40">
          <el-col :span="12">
            <table width="200" border="1">
              <tr><th>二维码</th><td>{{ formData.qrCode }}</td></tr>
              <tr><th>设备编号</th><td>{{ formData.equipmentNo }}</td></tr>
              <tr><th>加工完成时间</th><td>{{ formData.endTime }}</td></tr>
              <tr><th>是否抽检件</th><td>{{ formData.inspectFlag | inspectFlagFormat }}</td></tr>
            </table>
          </el-col>
          <el-col :span="12">
            <table width="200" border="1">
              <tr><th>员工编号</th><td>{{ formData.userNo }}</td></tr>
              <tr><th>加工开始时间</th><td>{{ formData.startTime }}</td></tr>
              <tr><th>报工状态</th><td>{{ formData.status | statusFormat }}</td></tr>
            </table>
          </el-col>

        </el-row>
      </div>

      <!-- 操作按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button type="plain" @click="dialogVisible = false">取消</el-button>
        <!--        <el-popover v-model="passVisible" placement="top" width="160">-->
        <!--          <p>确认提交？</p>-->
        <!--          <div style="text-align: right; margin: 0">-->
        <!--            <el-button size="small" type="text" @click="passVisible = false">取消</el-button>-->
        <!--            <el-button type="primary" size="small" @click="handleSubmit">确定</el-button>-->
        <!--          </div>-->
        <!--          <el-button slot="reference" class="l-m-l-10" type="primary">提交</el-button>-->
        <!--        </el-popover>-->
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { delEquipment } from '@/api/euipment/euipment'
import { updateSpotCheck } from '@/api/productModule/spotCheck'
import { getAbnormalList, getAbnormalReset } from '@/api/productModule/abnormal'

export default {
  name: 'Abnormal',
  filters: {
    statusFormat: (value) => {
      if (!value) return ''
      const obj = {
        '1001': '成功',
        '-1': '失败'
      }
      return obj[value]
    },
    inspectFlagFormat: (value) => {
      const obj = {
        '0': '否',
        '1': '是'
      }
      return obj[value]
    }
  },
  data() {
    return {
      column: [
        { type: 'index', index: this.indexMethod, fixed: true },
        { label: '二维码', prop: 'qrCode' },
        { label: '设备编号', prop: 'equipmentNo' },
        { label: '员工编号', prop: 'userNo' },
        { label: '加工开始时间', prop: 'startTime' },
        { label: '加工完成时间', prop: 'endTime' },
        { label: '抽检件', prop: 'inspectFlag', formatter: this.inspectFlagFormat },
        { label: '报工状态', prop: 'status', formatter: this.statusFormat },
        { label: '操作', render: (h, scope) => {
          return (
            <div>
              <el-button
                v-hasPermi={['productModule:abnormal:edit']}
                type='primary'
                size='mini'

                onClick={() => { this.handleEdit(scope.row) }}
              >查看详情</el-button>
              <el-button
                type='info'
                size='mini'
                loading={this.btnLoading}
                onClick={() => { this.handleReset(scope.row) }}
              >重发</el-button>
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
        status: undefined
      },
      list: [], // 表格数据
      testList: [
        { qrCode: '二维码1', equipmentNo: 'NO1', userNo: 'personnel1', startTime: '2023-02-22', endTime: '023-02-22', inspectFlag: '抽检件1', status: '1' },
        { qrCode: '二维码2', equipmentNo: 'NO2', userNo: 'personnel2', startTime: '023-02-23', endTime: '023-02-23', inspectFlag: '抽检件2', status: '2' }
      ],
      dialogVisible: false, // 新增弹窗
      passVisible: false, // 确认气泡框
      formData: {},
      addFormRules: { // 表单验证
        equipmentName: [
          { required: true, message: '请输入设备名称', trigger: 'blur' }
        ],
        nickName: [
          { required: true, message: '请输入设备昵称', trigger: 'blur' }
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
    // 报工异常列表
    getList() {
      this.loading = true
      getAbnormalList(this.queryParams).then(res => {
        this.list = res.data
        this.total = res.count || 0
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },

    // 编辑设备
    handleEdit(row) {
      this.reset()
      this.formData = JSON.parse(JSON.stringify(row))
      console.log('formData', this.formData)
      this.dialogVisible = true
    },
    // 重发
    handleReset(row) {
      this.btnLoading = true
      getAbnormalReset(row.logId).then(res => {
        this.$message.success(res.msg)
        this.btnLoading = false
        this.getList()
      }).catch(() => {
        this.btnLoading = false
      })
    },
    // 提交设备信息
    handleSubmit() {
      this.$refs['formData'].validate((valid) => {
        if (valid) {
          updateSpotCheck({ spotCheckNum: this.formData.spotCheckNum, id: this.formData.id }).then(res => {
            this.$message.success(res.msg)
            this.dialogVisible = false
            this.passVisible = false
            this.getList()
          })
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

    // 表单重置
    reset() {
      this.formData = {}
      this.resetForm('formData')
    },
    spotCheckNumFormat(row) {
      return `每${row.spotCheckNum}件抽检一次`
    },
    statusFormat(row) {
      const obj = {
        '1001': '成功',
        '-1': '失败'
      }
      return obj[row.status]
    },
    inspectFlagFormat(row) {
      const obj = {
        '0': '否',
        '1': '是'
      }
      return obj[row.inspectFlag]
    }

  }
}
</script>

<style scoped>
table,
td,
th {
  border: 1px solid #EBEEF5;
  padding: 10px;
  /*background: #fff;*/
}
table,
th {
  width: 120px;
  line-height: 30px;

  /*background: #eef1f6;*/
}

table {
  width: 100%;
  border-collapse: collapse;
}
</style>
