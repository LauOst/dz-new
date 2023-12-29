<!--
 * @Author: zhixinJ
 * @Date: 2023-03-31 15:31:34
 * @Desc: 工位设置
-->
<template>
  <div class="app-container">
    <!-- 头部筛选 -->
    <el-card shadow="never" class="card">
      <span>工位设置</span>
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
    <!--设置-->
    <el-dialog v-dialogDrag :close-on-click-modal="false" :title="'设置工位负责人'" :visible.sync="dialogVisible" class="dialog" width="530px">
      <el-form ref="formData" :model="formData" :rules="addFormRules" label-width="110px" style="margin: 0 20px;">
        <el-form-item label="工位负责人" prop="personName">
          <el-select v-model="formDataValue" placeholder="请选择工位负责人" style="width: 100%;" value-key="personName" @change="handleSelect">
            <el-option v-for="(item,index) in nameList" :key="index" :label="item.personName" :value="{personName: item.personName,personNo:item.personNo}">
              <span style="float: left">{{ item.personName }}</span>
              <span style="float: right; color: #8492a6">{{ item.personNo }}</span>
            </el-option>
          </el-select>
        </el-form-item>
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
import { listStation, AllListStation, updateWorkStation } from '@/api/jingji/stationSettings'

export default {
  name: 'StationSettings',
  data() {
    return {
      column: [
        { type: 'index', index: this.indexMethod },
        { label: '工位号', prop: 'stationNo', disableSort: true },
        { label: '负责人', prop: 'personName', disableSort: true },
        { label: '设置时间', prop: 'updateTime', disableSort: true },
        { label: '操作', render: (h, scope) => {
          return (
            <div>
              <el-button
                v-hasPermi={['jingji:stationSettings:set']}
                type='primary'
                size='mini'
                onClick={() => { this.handleEdit(scope) }}
              >设置</el-button>
            </div>
          )
        }, width: 300, fixed: 'right' }
      ],
      loading: false,
      total: 0, // 列表总条数
      // 查询信息
      queryParams: {
        page: 1,
        limit: 20,
        lineNo: '1',
        orderNo: 'DZ-2248'
      },
      list: [],
      addFormRules: {
        personName: [
          { required: true, message: '请选择负责人', trigger: 'change' }
        ]
      }, // 新增校验
      nameList: [], // 负责人数据
      formData: {},
      formDataValue: {},
      dialogVisible: false // 新增编辑弹窗
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
    getList() {
      this.loading = true
      listStation(this.queryParams).then(res => {
        this.list = res.data
        this.total = res.count || 0
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 获取负责人信息
    handleNameList() {
      AllListStation().then(res => {
        this.nameList = res.data
      })
    },
    // 编辑人员
    handleEdit(scope) {
      this.formData = JSON.parse(JSON.stringify(scope.row))
      this.formDataValue = JSON.parse(JSON.stringify(scope.row))
      this.dialogVisible = true
      this.handleNameList()
    },
    // 提交新增订单信息
    handleSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          updateWorkStation(this.formData).then(res => {
            this.$message.success(res.msg)
            this.dialogVisible = false
            this.getList()
          })
        }
      })
    },
    handleSelect() {
      this.formData.personName = this.formDataValue.personName
      this.formData.personNo = this.formDataValue.personNo
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
    }
  }
}
</script>

<style scoped>

</style>
