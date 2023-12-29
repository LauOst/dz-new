<template>
  <div class="app-container">
    <!-- 头部筛选 -->
    <el-card shadow="never" class="card">
      <el-form ref="queryForm" :inline="true" :model="queryParams">
        <el-form-item prop="deviceType">
          <el-select v-model="queryParams.deviceType" v-support size="small" placeholder="设备类型" style="width: 180px;">
            <el-option label="全部" :value="''" />
            <el-option v-for="(item,index) in equipmentList" :key="index" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item prop="checkName">
          <el-input v-model="queryParams.checkName" v-support size="small" clearable placeholder="设备巡检项" style="width: 180px;" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
          <el-button v-hasPermi="['equipment:setInspection:add']" type="success" icon="el-icon-plus" size="small" @click="handleAdd">
            新增
          </el-button>
          <!-- <el-button v-hasPermi="['equipment:equipmentList:excel']" :loading="btnLoading" type="warning" icon="el-icon-download" size="small" @click="handleExport">导出</el-button> -->
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

    <!--新增/编辑设备巡检项-->
    <el-dialog v-dialogDrag :close-on-click-modal="false" :modal-append-to-body="false" :title="dialogType==='edit'?'编辑设备巡检项':'新增设备巡检项'" :visible.sync="dialogVisible" class="dialog" width="600px">
      <el-form ref="formData" :model="formData" :rules="addFormRules" label-width="120px" style="width: 480px; margin-left:40px;">
        <el-form-item label="设备类型" prop="deviceType">
          <el-select v-model="formData.deviceType" placeholder="请选择设备类型" style="width: 100%;">
            <el-option v-for="(item,index) in equipmentList" :key="index" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="设备巡检项" prop="checkName">
          <el-input v-model="formData.checkName" clearable placeholder="请输入设备巡检项" />
        </el-form-item>
        <el-form-item label-width="0">
          <div class="lable-swich">巡检类型绑定</div>
          <div class="radio-wrap" style="vertical-align: middle">
            <el-checkbox
              v-for="(dict,index) in formData.checkTypeList"
              :key="index"
              v-model="dict.checked"
              :checked="dict.checked"
              :label="dict.itemText"
              @change="updateView"
            />
          </div>
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

  </div>
</template>

<script>
import { listCheck, updateCheck, delEquipment, addCheck } from '@/api/euipment/setInspection' // 基础接口
import { getDictItemDictCode } from '@/api/commens' // 公共接口
import { mapGetters } from 'vuex'
import { downloadEquipment } from '@/api/excel/excel'
import { div } from 'zrender/lib/core/vector'

export default {
  name: 'SetInspection',
  data() {
    return {
      column: [
        { type: 'index', index: this.indexMethod, fixed: true },
        { label: '设备类型', prop: 'deviceType', formatter: this.equipmentFormat },
        { label: '巡检名称', prop: 'checkName' },
        { label: '巡检类型绑定', render: (h, scope) => {
          return (
            <div>
              {scope.row.checkTypeList.map(this.checkType)}
            </div>
          )
        } },
        { label: '新增时间', prop: 'createTime' },
        { label: '操作', render: (h, scope) => {
          return (
            <div>
              <el-button
                v-hasPermi={['equipment:setInspection:edit']}
                type='primary'
                size='mini'
                onClick={() => { this.handleEdit(scope.row) }}
              >编辑</el-button>
              <el-button
                v-hasPermi={['equipment:setInspection:del']}
                type='danger'
                size='mini'
                onClick={() => { this.handleDelete(scope) }}
              >删除</el-button>
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
        checkName: undefined, // 设备名称
        deviceType: undefined // 设备类型
      },
      list: [], // 表格数据
      dialogVisible: false, // 新增弹窗
      dialogType: 'new',
      passVisible: false, // 确认气泡框
      formData: {},
      addFormRules: { // 表单验证
        deviceType: [
          { required: true, message: '请选择设备类型', trigger: 'change' }
        ],
        checkName: [
          { required: true, message: '请输入巡检项', trigger: 'blur' }
        ]
      },
      equipmentList: [ // 设备列表
        {
          id: 1,
          name: '检测设备'
        },
        {
          id: 2,
          name: '机床'
        },
        {
          id: 3,
          name: '机器人'
        },
        {
          id: 4,
          name: '相机'
        },
        {
          id: 8,
          name: '淬火机'
        },
        {
          id: 9,
          name: '校直机'
        },
        {
          id: 12,
          name: '焊接机'
        }
      ],
      isShowPro: false,
      // 状态
      statusOptions: []
    }
  },
  computed: { ...mapGetters(['orderList']) },
  mounted() {
    this.getList()
    this.getStatusOptions()
  },
  methods: {
    updateView() {
      this.formData.checkTypeList.splice() // 更新视图
    },
    checkType(item) {
      return <el-tag style='margin-right: 10px' size='mini' v-show={item.checked}>{item.itemText}</el-tag>
    },
    // 格式化序号
    indexMethod(index) {
      return (this.queryParams.page - 1) * this.queryParams.limit + index + 1
    },
    sortChange(column) {
      this.$mySort(this.queryParams, column, this.getList)
    },
    // 获取巡检项列表
    getList() {
      this.loading = true
      listCheck(this.queryParams).then(res => {
        this.list = res.data
        this.total = res.count || 0
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    getStatusOptions() {
      getDictItemDictCode('XJLX001').then(r => {
        var tempData = r.data
        // this.statusOptions.forEach((el, index) => {
        //   el = Object.assign(el, { checked: false })
        // })
        this.statusOptions = tempData.map(el => {
          return {
            checkItemId: '',
            checkTypeId: '',
            checked: false,
            dictCode: el.dictCode,
            dictItemId: el.id,
            itemText: el.itemText
          }
        })
      })
    },
    // 新增设备
    handleAdd() {
      this.isShowPro = false
      this.reset()
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    // 编辑设备
    handleEdit(row) {
      this.isShowPro = true
      this.reset()
      this.dialogType = 'edit'
      var { checkItemId, checkName, checkTypeList, deviceType } = JSON.parse(JSON.stringify(row))
      this.formData = { checkItemId, checkName, checkTypeList, deviceType }
      // this.formData = JSON.parse(JSON.stringify(row))
      this.dialogVisible = true
    },

    // 提交设备信息
    handleSubmit() {
      this.$refs['formData'].validate((valid) => {
        if (valid) {
          if (this.formData.checkTypeList.filter(el => el.checked).length === 0) {
            this.$message.error('请选择巡检类型')
          } else {
            if (this.formData.checkItemId !== undefined) { // 编辑
              updateCheck(this.formData).then(res => {
                this.$message.success(res.msg)
                this.dialogVisible = false
                this.passVisible = false
                this.getList()
              })
            } else {
              addCheck(this.formData).then(res => {
                this.$message.success(res.msg)
                this.dialogVisible = false
                this.passVisible = false
                this.getList()
              })
            }
          }
        }
      })
    },

    /** 删除按钮操作 */
    handleDelete(scope) {
      const id = scope.row.checkItemId
      this.$confirm('是否确认删除设备巡检项为"' + scope.row.checkName + '"的数据项?', '警告', {
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
    // 导出按钮
    handleExport() {
      this.btnLoading = true
      downloadEquipment(this.queryParams).then((res) => {
        this.btnLoading = false
        if (!res.data) return
        this.$downloadFunc(res)
      }).catch(() => {
        this.btnLoading = false
      })
    },
    // 表单重置
    reset() {
      this.formData = {
        checkItemId: undefined,
        checkName: undefined,
        checkTypeList: JSON.parse(JSON.stringify(this.statusOptions)),
        deviceType: undefined // 设备类型(1--检测设备,2--机床,3--机器人)
      }
      this.resetForm('formData')
    },
    // 过滤设备类型
    equipmentFormat(row) {
      const obj = {
        1: '检测设备',
        2: '机床',
        3: '机器人',
        4: '相机',
        8: '淬火机',
        9: '校直机',
        12: '焊接机'
      }
      return obj[row.deviceType]
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog {
  .lable-swich {
    width: 120px;
}

.radio-wrap{
    width: calc(100% - 120px);
  }
}
</style>

