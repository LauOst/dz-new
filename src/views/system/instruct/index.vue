<template>
  <div class="app-container">
    <!-- 头部筛选 -->
    <el-card shadow="never" class="card">
      <el-form v-show="showSearch" ref="queryForm" :inline="true" :model="queryParams">
        <el-form-item prop="tcpName">
          <el-input v-model="queryParams.tcpName" clearable size="small" placeholder="指令名称" style="width: 180px;" />
        </el-form-item>
        <el-form-item prop="tcpValue">
          <el-input v-model="queryParams.tcpValue" clearable size="small" placeholder="指令值" style="width: 180px;" />
        </el-form-item>
        <el-form-item prop="tcpDescription">
          <el-input v-model="queryParams.tcpDescription" clearable size="small" placeholder="描述" style="width: 180px;" />
        </el-form-item>
        <el-form-item prop="deviceType">
          <el-select v-model="queryParams.deviceType" size="small" placeholder="设备类型" style="width: 180px;">
            <el-option label="全部" :value="''" />
            <el-option v-for="(item,index) in equipmentList" :key="index" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item prop="tcpType">
          <el-select v-model="queryParams.tcpType" size="small" placeholder="指令类型" style="width: 180px;">
            <el-option label="全部" :value="''" />
            <el-option v-for="(item,index) in tcpTypeList" :key="index" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
          <el-button v-hasPermi="['system:instruct:add']" type="success" icon="el-icon-plus" size="small" @click="handleAdd">
            新增
          </el-button>
          <el-button v-hasPermi="['system:instruct:excel']" :loading="btnLoading" type="warning" icon="el-icon-download" size="small" @click="handleExport">导出</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <dz-table
      ref="table"
      v-loading="loading"
      :column="column"
      :data="list"
      :total="total"
      pagination
      :page.sync="queryParams.page"
      :limit.sync="queryParams.limit"
      @pagination="getList"
    />
    <!-- 表格信息 -->
    <!--    <el-table ref="table" v-loading="loading" style="width: 100%" :data="list" border height="600">-->
    <!--      <el-table-column type="index" label="序号" :index="indexMethod" width="100" align="center" fixed="left" show-overflow-tooltip />-->
    <!--      <el-table-column prop="deviceType" label="设备类型" align="center" show-overflow-tooltip>-->
    <!--        <template slot-scope="scope">-->
    <!--          <span>{{ scope.row.deviceType | tcpFilter }}</span>-->
    <!--        </template>-->
    <!--      </el-table-column>-->
    <!--      <el-table-column label="指令名称" align="center" :show-overflow-tooltip="true">-->
    <!--        <template slot-scope="scope">-->
    <!--          <router-link v-if="scope.row.tcpType === 1" :to="'/instruct/type/data/' + scope.row.id" class="link-type">-->
    <!--            <el-button type="text">{{ scope.row.tcpName }}</el-button>-->
    <!--          </router-link>-->
    <!--          <span v-if="scope.row.tcpType === 0">{{ scope.row.tcpName }}</span>-->
    <!--        </template>-->
    <!--      </el-table-column>-->
    <!--      <el-table-column prop="tcpType" label="指令类型" align="center" show-overflow-tooltip>-->
    <!--        <template slot-scope="scope">-->
    <!--          <span v-if="scope.row.tcpType === 0">数值类型</span>-->
    <!--          <span v-if="scope.row.tcpType === 1">状态值</span>-->
    <!--        </template>-->
    <!--      </el-table-column>-->
    <!--      <el-table-column prop="tcpValue" label="指令值" align="center" show-overflow-tooltip />-->
    <!--      <el-table-column prop="tcpDescription" label="描述" align="center" show-overflow-tooltip />-->
    <!--      <el-table-column label="操作" width="140" fixed="right" align="center" show-overflow-tooltip>-->
    <!--        <template slot-scope="scope">-->
    <!--          <el-button v-hasPermi="['system:instruct:edit']" type="primary" size="mini" @click="handleEdit(scope.row)">编辑</el-button>-->
    <!--        </template></el-table-column>-->
    <!--    </el-table>-->

    <!--新增/编辑指令-->
    <el-dialog v-dialogDrag :close-on-click-modal="false" :modal-append-to-body="false" :title="dialogType==='edit'?'编辑指令':'新增指令'" :visible.sync="dialogVisible" class="dialog" width="530px">
      <el-form ref="formData" :model="formData" :rules="addFormRules" label-width="90px" style="width: 400px; margin-left:40px;">
        <el-form-item label="设备类型" prop="deviceType">
          <el-select v-model="formData.deviceType" placeholder="请选择设备类型" style="width: 100%;">
            <el-option v-for="(item,index) in equipmentList" :key="index" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="指令类型" prop="tcpType">
          <el-select v-model="formData.tcpType" placeholder="请选择指令类型" style="width: 100%;">
            <el-option v-for="(item,index) in tcpTypeList" :key="index" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="指令名称	" prop="tcpName">
          <el-input v-model="formData.tcpName" clearable placeholder="请输入指令名称	" />
        </el-form-item>
        <el-form-item label="指令值" prop="tcpValue">
          <el-input v-model="formData.tcpValue" clearable placeholder="请输入指令值" />
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
            <el-button type="text" size="small" @click="passVisible = false">取消</el-button>
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
  getCmdTcp, // 查询字典列表
  addCmdTcp, // 添加字典
  updateCmdTcp // 修改字典
} from '@/api/system/instructions'
import { downloadTcp } from '@/api/excel/excel'

export default {
  name: 'Instruct',
  data() {
    return {
      // 表格信息
      column: [
        { type: 'index', index: this.indexMethod },
        { label: '设备类型', prop: 'deviceType', formatter: this.tcpFilter },
        { label: '指令名称', render: (h, scope) => {
          if (scope.row.tcpType === 1) {
            return (
              <div>
                <router-link to={'/instruct/type/data/' + scope.row.id}>
                  <el-button type='text'>{ scope.row.tcpName }</el-button>
                </router-link>
              </div>
            )
          } else if (scope.row.tcpType === 0) {
            return (
              <span>{ scope.row.tcpName }</span>
            )
          }
        } },
        { label: '指令类型', prop: 'tcpType', formatter: this.tcpTypeFormat },
        { label: '指令值', prop: 'tcpValue' },
        { label: '描述', prop: 'tcpDescription' },
        { label: '操作', render: (h, scope) => {
          return (
            <div id='btnWrap'>
              <el-button
                v-hasPermi={['system:instruct:edit']}
                type='primary'
                size='mini'
                onClick={() => { this.handleEdit(scope.row) }}
              >编辑</el-button>
            </div>
          )
          // )
        }, width: 240 }
      ],
      // 遮罩层(加载)
      loading: false,
      btnLoading: false,
      // 显示搜索条件
      showSearch: true,
      total: 0, // 列表总条数
      queryParams: { // 查询信息
        page: 1,
        limit: 20,
        deviceType: undefined, // 设备类型
        tcpDescription: undefined, // 描述
        tcpName: undefined, // tcp 指令名称
        tcpType: undefined,
        tcpValue: undefined // tcp 指令值
      },
      formData: {},
      // 弹窗title信息
      dialogType: 'new',
      addFormRules: { // 表单验证
        deviceType: [
          { required: true, message: '请选择设备类型', trigger: 'change' }
        ],
        tcpType: [
          { required: true, message: '请选择指令类型', trigger: 'change' }
        ],
        tcpName: [
          { required: true, message: '请输入指令名称', trigger: 'blur' }
        ],
        tcpValue: [
          { required: true, message: '请输入指令值', trigger: 'blur' }
        ]
      },
      dialogVisible: false, // 新增弹窗
      passVisible: false, // 确认气泡框
      list: [], // 表格数据
      equipmentList: [ // 设备列表
        {
          id: 1,
          name: '数控机床'
        },
        {
          id: 2,
          name: 'ABB机器人'
        },
        {
          id: 3,
          name: '检测设备'
        }
      ],
      tcpTypeList: [ // 指令类型列表
        {
          id: 0,
          name: '数值类型'
        },
        {
          id: 1,
          name: '状态值'
        }
      ]
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
    // 获取字典列表
    getList() {
      this.loading = true
      getCmdTcp(this.queryParams).then(res => {
        this.list = res.data
        this.total = res.count || 0
        this.loading = false
      })
    },
    // 新增数据字典
    handleAdd() {
      this.reset()
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    // 修改数据字典
    handleEdit(row) {
      this.reset()
      this.formData.id = row.id
      this.formData = JSON.parse(JSON.stringify(row))
      this.dialogType = 'edit'
      this.dialogVisible = true
    },
    // 提交产线信息
    handleSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.formData.id !== undefined) { // 编辑
            updateCmdTcp(this.formData).then(res => {
              this.$message.success(res.msg)
              this.dialogVisible = false
              this.passVisible = false
              this.getList()
            })
          } else { // 新增
            addCmdTcp(this.formData).then(res => {
              this.$message.success(res.msg)
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
      downloadTcp(this.queryParams).then((res) => {
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
        deviceType: undefined, // 设备类型
        tcpDescription: undefined, // 描述
        tcpName: undefined, // tcp 指令名称
        tcpType: undefined, // 指令类型
        tcpValue: undefined // tcp 指令值
      }
      this.resetForm('formData')
    },
    // 指令类型格式化
    tcpTypeFormat(row) {
      const obj = {
        0: '数值类型',
        1: '状态值'
      }
      return obj[row.tcpType]
    },
    // 设备类型格式化
    tcpFilter(row) {
      const obj = {
        1: '数控机床',
        2: 'ABB机器人',
        3: '检测设备'
      }
      return obj[row.deviceType]
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
