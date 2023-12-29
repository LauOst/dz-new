<template>
  <div class="app-container">
    <!-- 头部筛选 -->
    <el-card shadow="never" class="card">
      <el-button type="success" icon="el-icon-plus" size="small" @click="handleAdd">
        新增
      </el-button>
      <el-button :loading="btnLoading" type="warning" icon="el-icon-download" size="small" @click="handleExport">导出</el-button>
    </el-card>

    <!-- 表格信息 -->
    <el-table ref="table" v-loading="loading" style="width: 100%" :data="list" border height="600">
      <el-table-column type="index" label="序号" :index="indexMethod" width="100" align="center" fixed="left" show-overflow-tooltip />
      <el-table-column prop="deviceItemValue" label="数据类型状态值" align="center" width="180" show-overflow-tooltip />
      <el-table-column prop="tcpDescription" label="描述" align="center" show-overflow-tooltip />
      <el-table-column label="操作" width="260" fixed="right" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <pagination v-show="total>0" :total="total" :page.sync="queryParams.page" :limit.sync="queryParams.limit" @pagination="getList" />

    <!--新增/编辑字典-->
    <el-dialog v-dialogDrag :close-on-click-modal="false" :modal-append-to-body="false" :title="dialogType==='edit'?'编辑指令':'新增指令'" :visible.sync="dialogVisible" class="dialog" width="530px">
      <el-form ref="formData" :model="formData" :rules="addFormRules" label-width="90px" style="width: 400px; margin-left:40px;">
        <el-form-item label="指令值" prop="deviceItemValue">
          <el-input v-model="formData.deviceItemValue" clearable placeholder="请输入指令值" />
        </el-form-item>
        <el-form-item label-width="0" prop="tcpDescription">
          <div class="label-top">描述</div>
          <el-input
            v-model="formData.tcpDescription"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            clearable
            placeholder="请输入描述"
          />
        </el-form-item>
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
  </div>
</template>

<script>
import {
  addCmdTcpItem, // 新增字典item值
  updateCmdTcpItem, // 修改字典item值
  getCmdTcpItem, // 查询字典item值列表
  delDictItem // 删除字典item值
} from '@/api/system/instructions'
import Pagination from '@/components/Pagination'
import { downloadTcpItem } from '@/api/excel/excel'

export default {
  components: { Pagination },
  filters: {
    tcpFilter(val) {
      const obj = {
        1: '数控机床',
        2: 'ABB机器人',
        3: '检测设备'
      }
      return obj[val]
    }
  },
  data() {
    return {
      // 遮罩层(加载)
      loading: false,
      btnLoading: false,
      params: {
        dictId: 0
      },
      total: 0, // 列表总条数
      queryParams: { // 查询信息
        page: 1,
        limit: 20,
        id: ''
      },
      formData: {},
      addFormRules: {
        deviceItemValue: [
          { required: true, message: '请输入指令值', trigger: 'blur' }
        ],
        tcpDescription: [
          { required: true, message: '请输入描述', trigger: 'blur' }
        ]
      },
      list: [], // 表格数据
      dialogType: 'new',
      defaultDictId: 0, // 默认字典id
      dialogVisible: false, // 新增弹窗
      passVisible: false, // 确认气泡框
      itemId: 0 // item字典项id
    }
  },
  mounted() {
    this.queryParams.id = this.$route.params.instId
    this.getList()
  },
  // 解决表格错位问题
  activated() {
    this.$nextTick(() => {
      this.$refs.table.doLayout()
    })
  },
  methods: {
    // 格式化序号
    indexMethod(index) {
      return (this.queryParams.page - 1) * this.queryParams.limit + index + 1
    },
    // 获取字典值列表
    getList() {
      this.loading = true
      getCmdTcpItem(this.queryParams).then(res => {
        this.list = res.data
        this.total = res.count || 0
        this.loading = false
      })
    },
    // 新增item字典
    handleAdd() {
      this.reset()
      this.itemId = -1
      this.formData.id = this.queryParams.id
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    // 修改item字典
    handleEdit(row) {
      this.reset()
      this.itemId = row.id
      this.formData = JSON.parse(JSON.stringify(row))
      this.dialogType = 'edit'
      this.dialogVisible = true
    },
    // 删除字典item
    handleDelete(id) {
      this.$confirm('是否确认删除该条字典数据?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delDictItem(id).then(res => {
          this.$message.success(res.msg)
          this.getList()
        })
      }).catch(() => {
      })
    },
    handleSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.itemId === -1) { // 新增
            addCmdTcpItem(this.formData).then(res => {
              this.$message.success(res.msg)
              this.dialogVisible = false
              this.passVisible = false
              this.getList()
            })
          } else { // 编辑
            this.formData.id = this.itemId
            updateCmdTcpItem(this.formData).then(res => {
              this.$message.success(res.msg)
              this.dialogVisible = false
              this.passVisible = false
              this.getList()
            })
          }
        }
      })
    },
    // 表单重置
    reset() {
      this.formData = {
        deviceItemValue: undefined,
        id: 0,
        tcpDescription: undefined
      }
      this.resetForm('formData')
    },
    // 导出按钮
    handleExport() {
      this.btnLoading = true
      downloadTcpItem(this.queryParams).then((res) => {
        this.btnLoading = false
        if (!res.data) return
        this.$downloadFunc(res)
      }).catch((err) => {
        console.log('err', err)
        this.btnLoading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
