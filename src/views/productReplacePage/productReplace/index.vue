<template>
  <div class="app-container">
    <!-- 头部筛选 -->
    <el-card shadow="never" class="card">
      <el-form ref="queryForm" :inline="true" :model="queryParams" :rules="searchRules">
        <el-form-item prop="lineNo">
          <el-input v-model="queryParams.lineNo" clearable size="small" placeholder="产线号" style="width: 200px;" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <div class="l-flex l-row-between l-m-bt-20 l-col-center">
      <span class="l-font-16 font-bolder" style="color: #000">{{ formData.ipAddress }}</span>
      <div v-if="formData.paramList && formData.paramList.length > 0">
        <el-button v-hasPermi="['productReplace:productReplace:edit']" type="primary" size="small" @click="handleEdit">编辑</el-button>
        <el-button v-hasPermi="['productReplace:productReplace:send']" type="success" size="small" @click="handleSend">发送</el-button>
      </div>
    </div>
    <div class="l-flex l-flex-wrap l-font-14">
      <div v-for="(item, index) in formData.paramList" :key="index" class="l-flex l-m-b-24" style="width: 33%;line-height: 2;">
        <div class="item-key">{{ item.paramKey }}</div>
        <div class="item-item">{{ item.paramValue || '--' }}</div>
      </div>
    </div>

    <!--编辑产品换型-->
    <el-dialog v-dialogDrag :close-on-click-modal="false" :modal-append-to-body="false" :title="dialogType==='edit'? '编辑' : '新增'" :visible.sync="dialogVisible" class="dialog" width="800px">
      <el-form ref="formData" :model="formDataDetail" label-width="120px" style="width: 760px;">
        <div class="l-flex l-flex-wrap l-row-between">
          <div v-for="(item, index) in formDataDetail.paramList" :key="index">
            <el-form-item
              :label="formDataDetail.paramList[index].paramKey"
              :prop="`paramList[${index}].paramValue`"
              :rules="{ required: true, message: '换型参数内容', trigger: ['change', 'blur'] }"
            >
              <el-input v-model="formDataDetail.paramList[index].paramValue" placeholder="换型参数内容" style="width: 250px;" />
            </el-form-item>
          </div>
        </div>
      </el-form>
      <!-- 操作按钮 -->
      <div style="text-align:right;margin-top: 60px">
        <el-button @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { detailRobotModel, updateRobotModel, sendRobotModel } from '@/api/productReplace/productReplace'
export default {
  name: 'ProductReplace',
  data() {
    return {
      queryParams: {
        lineNo: ''
      },
      searchRules: {
        lineNo: [
          { required: true, message: '请输入产线号', trigger: 'blur' }
        ]
      },
      formData: {},
      formDataDetail: {},
      dialogVisible: false, // 新增弹窗
      dialogType: 'new'
    }
  },
  async mounted() {
  },
  methods: {
    // 获取列表
    getList() {
      detailRobotModel(this.queryParams).then(res => {
        this.formData = res.data
      })
    },
    // 编辑设备
    handleEdit() {
      this.reset()
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.formDataDetail = JSON.parse(JSON.stringify(this.formData))
    },
    handleSend(row) {
      sendRobotModel({ id: this.formData.id }).then(res => {
        this.$message.success(res.msg)
      })
    },
    // 提交设备信息
    handleSubmit() {
      this.$refs['formData'].validate((valid) => {
        if (valid) {
          updateRobotModel(this.formDataDetail.paramList).then(res => {
            this.$message.success(res.msg)
            this.dialogVisible = false
            this.getList()
          })
        }
      })
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.$refs.queryForm.validate((valid) => {
        if (valid) {
          this.getList()
        }
      })
    },
    // 表单重置
    reset() {
      this.formDataDetail = {
        id: undefined,
        lineNo: undefined, // 设备编号
        IP: undefined, // 设备编号
        configList: [undefined]
      }
      this.resetForm('formData')
    },
    /** 重置按钮操作 */
    async resetQuery() {
      await this.resetForm('queryForm')
      this.formData = {
        id: undefined,
        lineNo: undefined, // 设备编号
        IP: undefined, // 设备编号
        configList: [undefined]
      }
      // await this.handleQuery()
    }
  }
}
</script>

<style>
.el-descriptions-item__label.is-bordered-label{
  background: #EEF1F6!important;
  color: #606266;
}
.el-descriptions .is-bordered .el-descriptions-item__cell{
  border: 1px solid #E5E5E5;
}
</style>
<style lang="scss" scoped>
.item-key{
  width: 40%;
  padding: 10px;
  background: #EEF1F6;
  border: 1px solid #E5E5E5;
  box-sizing: border-box;
  border-radius: 4px 0 0 4px;
  text-align: center;
  color: #606266;
  font-weight: 600;
}
.item-item{
  width: 50%;
  padding: 10px;
  border: 1px solid #E5E5E5;
  box-sizing: border-box;
  border-left: none;
  border-radius: 0 4px 4px 0;
  color: #606266;
}
</style>

