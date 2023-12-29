<template>
  <div class="app-container">
    <!-- 头部筛选 -->
    <el-card shadow="never" class="card">
      <el-form ref="queryForm" :inline="true" :model="queryParams">
        <!--        <el-form-item prop="alarmGrade">-->
        <!--          <el-input v-model="queryParams.alarmGrade" clearable size="small" placeholder="事故等级" style="width: 180px;" />-->
        <!--        </el-form-item>-->
        <!--        <el-form-item>-->
        <!--          <start-date v-model="queryParams.startTime" />-->
        <!--          <end-date v-model="queryParams.endTime" />-->
        <!--        </el-form-item>-->
        <el-form-item>
          <!--          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>-->
          <!--          <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>-->
          <el-button v-hasPermi="['productModule:changeModel:add']" type="success" icon="el-icon-plus" size="small" @click="handleAdd">
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
    />
    <!--新增订单-->
    <el-dialog v-dialogDrag :close-on-click-modal="false" :title="dialogType==='edit'?'编辑':'新增'" :visible.sync="dialogVisible" class="dialog" width="530px">
      <el-form ref="formData" :model="formData" :rules="addFormRules" label-width="130px" style=" margin-left:40px;">
        <template v-if="dialogType==='edit'">
          <el-form-item label="产品" prop="productNo">
            <el-select v-model="formData.productNo" style="width: 100%;" placeholder="请选择产品">
              <el-option v-for="(item,index) in productsList" :key="index" :label="item.equipmentName" :value="item.productNo" />
            </el-select>
          </el-form-item>
          <el-form-item label="机床联动设备号" prop="toolLinkageNo">
            <el-input v-model="formData.toolLinkageNo" style="width: 100%;" clearable placeholder="请输入机床联动设备号" />
          </el-form-item>
        </template>
        <template v-else>
          <el-form-item label="设备" label-width="90px" prop="equipmentNo">
            <el-select v-model="formData.equipmentNo" style="width: 100%;" placeholder="请选择设备" @change="changeLineEquipment">
              <el-option v-for="(item,index) in equipmentList" :key="index" :label="item.equipmentName" :value="item.equipmentNo" />
            </el-select>
          </el-form-item>
        </template>
      </el-form>
      <!-- 操作按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit('formData')">提交</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
import {
  addChangeModel,
  listChangeModel,
  selectChangeModel,
  selectChangeModelProducts, sendChangeModel,
  updateChangeModel
} from '@/api/productModule/changeModel'
import { mapGetters } from 'vuex'

export default {
  name: 'ChangeModel',
  data() {
    return {
      column: [
        { type: 'index', index: this.indexMethod },
        { label: '设备编号', prop: 'equipmentNo', disableSort: true },
        { label: '设备名称', prop: 'equipmentName', disableSort: true },
        { label: '机床联动设备号', prop: 'toolLinkageNo', disableSort: true },
        { label: '产品型号', prop: 'productNo', disableSort: true },
        { label: '重量', prop: 'weight', disableSort: true },
        { label: '长度', prop: 'length', disableSort: true },
        { label: '螺纹直径', prop: 'threadDiameter', disableSort: true },
        { label: '杆子直径', prop: 'poleDiameter', disableSort: true },
        { label: '工序', prop: 'production', disableSort: true },
        { label: '机器人程序号', prop: 'robProagamNo', disableSort: true },
        { label: '发送时间', prop: 'sendTime', disableSort: true },
        { label: '操作', render: (h, scope) => {
          return (
            <div id='btnWrap'>
              <el-button
                v-hasPermi={['productModule:changeModel:edit']}
                type='primary'
                size='mini'
                onClick={() => { this.handleEdit(scope.row) }}
              >编辑</el-button>
              <el-button
                v-hasPermi={['productModule:changeModel:send']}
                type='success'
                size='mini'
                onClick={() => { this.handleSend(scope) }}
              >发送</el-button>
            </div>
          )
          // )
        }, width: 200 }
      ],
      loading: false,
      total: 0, // 列表总条数
      // 查询信息
      queryParams: {
        page: 1,
        limit: 20,
        alarmGrade: undefined,
        startTime: undefined,
        endTime: undefined
      },
      list: [],
      dialogVisible: false,
      // dialogVisibleTools: false,
      dialogType: 'new',
      formData: {},
      equipmentList: [],
      productsList: [],
      addFormRules: {
        productNo: [
          { required: true, message: '请选择产品', trigger: 'change' }
        ],
        toolLinkageNo: [
          { required: true, message: '请输入机床联动设备号', trigger: 'blur' }
        ],
        equipmentNo: [
          { required: true, message: '请选择设备', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'departId'
    ])
  },
  mounted() {
    this.getList()
  },
  methods: {
    // 格式化序号
    indexMethod(index) {
      return (this.queryParams.page - 1) * this.queryParams.limit + index + 1
    },
    getList() {
      this.loading = true
      listChangeModel(this.queryParams).then(res => {
        this.list = res.data
        this.total = res.count || 0
        this.loading = false
      })
    },
    getEquipments() {
      selectChangeModel().then(res => {
        this.equipmentList = res.data
      })
    },
    getProducts() {
      selectChangeModelProducts({ departId: this.departId }).then(res => {
        this.productsList = res.data
      })
    },
    changeLineEquipment(id) {
      const { equipmentName, equipmentNo, productNo } = this.equipmentList.find(t => t.equipmentNo === id)
      this.formData = {
        equipmentName, // 数据唯一id
        equipmentNo, // 告警等级
        productNo
      }
      console.log('arr', this.formData)
    },
    // 新增按钮
    handleAdd() {
      this.reset()
      this.getEquipments()
      this.dialogType = 'new'
      this.dialogVisible = true
    },

    // 编辑
    handleEdit(row) {
      this.reset()
      this.getProducts()
      this.formData = JSON.parse(JSON.stringify(row))
      this.dialogType = 'edit'
      this.dialogVisible = true
    },

    /** 删除按钮操作 */
    handleSend(scope) {
      // const id = scope.row.id
      this.$confirm('是否确认发送?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return sendChangeModel(scope.row)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(() => {
      })
    },

    handleSubmit() {
      this.$refs['formData'].validate(valid => {
        if (valid) {
          if (this.dialogType !== 'new') {
            updateChangeModel(this.formData).then(res => {
              this.msgSuccess(res.msg)
              this.dialogVisible = false
              this.getList()
            })
          } else {
            addChangeModel(this.formData).then(res => {
              this.msgSuccess(res.msg)
              this.dialogVisible = false
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
    // 表单重置
    reset() {
      this.formData = {
        equipmentName: undefined, // 数据唯一id
        equipmentNo: undefined, // 告警等级
        productNo: undefined, // 告警等级
        toolLinkageNo: undefined // 告警等级
      }
      this.resetForm('formData')
    }
  }
}
</script>

<style scoped>

</style>
