<template>
  <div class="app-container">
    <el-card shadow="never" class="card">
      <el-form ref="queryForm" :model="queryParams" :inline="true">
        <el-form-item prop="productName">
          <el-input
            v-model="queryParams.productName"
            placeholder="产品名称"
            clearable
            size="small"
            style="width: 180px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item prop="lineType">
          <el-select v-model="queryParams.lineType" clearable size="small" style="width: 180px" placeholder="产品类型">
            <el-option label="全部" :value="''" />
            <el-option v-for="(item,index) in lineTypeList" :key="index" :label="item.value" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
          <el-button v-hasPermi="['products:product:add']" type="success" icon="el-icon-plus" size="small" @click="handleAdd">
            新增
          </el-button>
          <el-button v-hasPermi="['products:product:excel']" :loading="btnLoading" type="warning" icon="el-icon-download" size="small" @click="handleExport">导出</el-button>
        </el-form-item>
      </el-form>
    </el-card>
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
    <!-- 弹出层 -->
    <el-dialog v-dialogDrag :close-on-click-modal="false" :modal-append-to-body="false" :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑产品':'新增产品'" class="dialog" width="1100px">
      <el-form ref="formData" :model="formData" :rules="rules" label-width="100px" style="width: 92%; margin-left:40px;">
        <el-row :gutter="20">
          <el-col :span="12">
            <!--            <el-form-item label="站点名称" prop="departId">-->
            <!--              <el-select v-model="formData.departId" placeholder="请选择站点名称" :disabled="formData.productId !== undefined" style="width: 100%">-->
            <!--                <el-option v-for="(item,index) in departList" :key="index" :label="item.departName" :value="item.id" />-->
            <!--              </el-select>-->
            <!--            </el-form-item>-->
            <el-form-item label="产品名称" prop="productName">
              <el-input v-model="formData.productName" placeholder="请输入产品名称" />
            </el-form-item>
            <el-form-item label="产品编号" prop="productNo">
              <el-input v-model="formData.productNo" placeholder="请输入产品编号" />
            </el-form-item>
            <el-form-item label="物料编码" prop="syProductNo">
              <el-input v-model="formData.syProductNo" placeholder="请输入产品物料编码" />
            </el-form-item>
            <el-form-item label="物料简码" prop="syProductAlias">
              <el-input v-model="formData.syProductAlias" placeholder="请输入物料简码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">

            <el-form-item label="产品类别" prop="syCategory">
              <el-input v-model="formData.syCategory" placeholder="请输入产品类别" />
            </el-form-item>
            <el-form-item label="产品类型" prop="lineType">
              <el-select v-model="formData.lineType" placeholder="请选择产品类型" style="width: 100%">
                <el-option v-for="(item,index) in lineTypeList" :key="index" :label="item.value" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="标准节拍" prop="frequency">
              <!--              <el-input-number v-model="formData.frequency" placeholder="请输入标准节拍" style="width: 80%" />-->
              <el-input v-model="formData.frequency" onkeyup="value=value.replace(/[^\d]/g,'')" placeholder="请输入标准节拍">
                <template #append>件/每小时</template>
              </el-input>
              <!--              <span>每小时</span>-->
            </el-form-item>
            <el-form-item label="产品图片" prop="pictureList">
              <upload-image
                v-model="formData.picture"
                :action="imgUploadAction"
                :headers="importHeaders"
                :response-fn="handleResponse"
                :file-size="8"
                :file-type="fileType"
                name="files"
                @input="handleRemove"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <!--组件物料-->
        <el-card class="box-card font-color normalFormItem" shadow="never">
          <div slot="header" style="display: flex;align-items: center;justify-content: space-between;">
            <span style="font-weight: 700">组件物料</span>
            <el-button type="primary" size="mini" @click="addClass">新增组件物料</el-button>
          </div>
          <div class="form-item" style="padding:10px 20px">
            <el-row>
              <el-col v-for="(item, index) in formData.materialList" :key="index" :span="24" style="display: flex;justify-content: space-between">
                <div style="display: flex;">
                  <el-form-item
                    label="组件物料编码"
                    :prop="'materialList.' + index + '.materialNo'"
                    :rules="{ required: true, message: '请输入组件物料编码', trigger: ['change', 'blur'] }"
                    label-width="120px"
                    class="form-name"
                  >
                    <el-input
                      v-model="item.materialNo"
                      placeholder="请输入组件物料编码"
                      size="mini"
                      style="width: 180px"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item
                    label="组件物料简码"
                    :prop="`materialList[${index}].materialAlias`"
                    :rules="{ required: true, message: '请选输入组件物料简码', trigger: ['change', 'blur'] }"
                    label-width="120px"
                    style="margin-left: 20px"
                  >
                    <el-input
                      v-model="item.materialAlias"
                      placeholder="请选输入组件物料简码"
                      size="mini"
                      style="width: 180px"
                      clearable
                    />
                  </el-form-item>
                </div>

                <!--                <el-form-item-->
                <!--                  label="组件物料数量"-->
                <!--                  :prop="`materialAddParms[${index}].quantity`"-->
                <!--                  :rules="{ required: true, message: '请选择组件物料数量', trigger: ['change', 'blur'] }"-->
                <!--                  label-width="120px"-->
                <!--                >-->
                <!--                  <el-input-number-->
                <!--                    v-model="item.quantity"-->
                <!--                    size="mini"-->
                <!--                    :min="1"-->
                <!--                    label="描述文字"-->
                <!--                    style="width: 120px"-->
                <!--                    :disabled="dialogType ==='edit'"-->
                <!--                  />-->
                <!--                </el-form-item>-->
                <div>
                  <el-form-item
                    label-width="0px"
                  >
                    <el-button icon="el-icon-delete" size="small" type="danger" @click="removeClass(index)" />
                  </el-form-item>
                </div>

              </el-col>
            </el-row>
            <!--            <el-col :offset="20">-->
            <!--              <el-form-item style="display:inline-block;" />-->
            <!--            </el-col>-->
          </div>
        </el-card>

      </el-form>
      <div style="text-align:right;">
        <el-button @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import defaultImg from '@/assets/images/logo.png'
import { listProduct, addProduct, getProduct, updateProduct, delProduct } from '@/api/product/product'
import { downloadProduct } from '@/api/excel/excel'
// import UploadImage from '@/components/UploadImage/UploadImage'
import UploadImage from 'vue-ele-upload-image'
import { mapGetters } from 'vuex'
/*
  queryParams:角色列表请求参数
  departList:站点列表
  total:列表总条数
  dialogVisible:是否显示 Dialog
  dialogType:控制表头显示内容
  role:弹出层数据对象
* */

export default {
  name: 'Product',
  components: { UploadImage },
  data() {
    return {
      column: [
        { type: 'index', index: this.indexMethod },
        // { label: '归属站点', prop: 'departName' },
        { label: '产品名称', prop: 'productName' },
        { label: '产品编号', prop: 'productNo' },
        { label: '产品简码', prop: 'syProductAlias' },
        { label: '产品类别', prop: 'syCategory' },
        { label: '产品类型', prop: 'lineType' },
        { label: '产品物料编码', prop: 'syProductNo' },
        { label: '标准节拍(件/时)', prop: 'frequency' },
        { label: '缩略图', render: (h, scope) => {
          return h('div', {
            style: { display: 'flex', justifyContent: 'center', alignItems: 'center' }
          }, [h('img', { attrs: { src: scope.row.picture },
            style: { width: '30px', height: '30px' }})])
        } },
        { label: '操作', render: (h, scope) => {
          return (
            <div>
              <el-button
                v-hasPermi={['products:product:edit']}
                type='primary'
                size='mini'
                onClick={() => { this.handleEdit(scope) }}
              >编辑</el-button>
              <el-button
                v-hasPermi={['products:product:del']}
                type='danger'
                size='mini'
                onClick={() => { this.handleDelete(scope) }}
              >删除</el-button>
            </div>
          )
        } }
      ],
      loading: true,
      btnLoading: false,
      // 显示搜索条件
      showSearch: true,
      // 分页搜索参数
      queryParams: {
        page: 1,
        limit: 20,
        productName: undefined,
        field: undefined,
        type: undefined,
        lineType: undefined
      },
      // 设备列表
      list: [],
      // 分页数据
      total: 0,
      dialogVisible: false,
      dialogType: 'new',
      // 表单信息
      formData: {},
      // departList: [], // 订单列表
      // 表单校验
      rules: {
        // departId: [
        //   { required: true, message: '请选择站点', trigger: 'change' }
        // ],
        productName: [
          { required: true, message: '产品名称不能为空', trigger: 'blur' }
        ],
        productNo: [
          { required: true, message: '产品编号不能为空', trigger: 'blur' }
        ],
        pictureList: [
          { required: true, message: '产品图片不能为空', trigger: 'blur' }
        ],
        syCategory: [
          { required: true, message: '产品类别不能为空', trigger: 'blur' }
        ],
        lineType: [
          { required: true, message: '产线类型不能为空', trigger: 'blur' }
        ],
        syProductAlias: [
          { required: true, message: '产品简码不能为空', trigger: 'blur' }
        ],
        frequency: [
          { required: true, message: '标准节拍不能为空', trigger: 'blur' }
        ],
        syProductNo: [
          { required: true, message: '产品物料编码不能为空', trigger: 'blur' }
        ]
      },
      importHeaders: {},
      image: '',
      defaultImg,
      fileType: ['png', 'jpg', 'jpeg'],
      lineTypeList: [{ name: '二米活塞杆', value: '2MHSG' }, { name: '三米活塞杆', value: '3MHSG' }, { name: '二米缸筒', value: '2MGT' }, { name: '三米缸筒', value: '3MGT' }]
    }
  },
  computed: {
    ...mapGetters(['imgUploadAction', 'token', 'sub'])
  },
  created() {
    this.importHeaders = {
      jwt_token: this.token,
      sub: this.sub
    }
  },
  mounted() {
    this.getList()
    // this.getDepartList()
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
    // 获取订单列表
    // getDepartList() {
    //   switchSite().then(res => {
    //     this.departList = res.data
    //   })
    // },
    /** 查询产品列表 */
    getList() {
      this.loading = true
      listProduct(this.queryParams).then(
        response => {
          this.list = response.data
          this.total = response.count
          this.loading = false
        }
      ).catch(() => {
        this.loading = false
      })
    },
    // 新增产品按钮
    handleAdd() {
      this.reset()
      this.formData.picture = this.defaultImg
      this.formData.pictureList.push({ url: this.defaultImg })
      // this.getDepartList()
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    // 编辑按钮
    handleEdit(scope) {
      this.reset()
      // 获取角色ID
      const productId = scope.row.productId
      getProduct(productId).then(res => {
        this.dialogType = 'edit'
        this.dialogVisible = true
        this.formData = res.data
      })
    },
    /** 删除按钮操作 */
    handleDelete(scope) {
      const productId = scope.row.productId
      this.$confirm('是否确认删除名称为"' + scope.row.productName + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return delProduct(productId)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(() => {})
    },

    // 新增组件物料
    addClass() {
      const data = {
        materialAlias: undefined, // 组件物料简码
        materialNo: undefined // 组件物料编码
      }
      var detailData = JSON.parse(JSON.stringify(this.formData))
      this.formData = {}
      this.formData = JSON.parse(JSON.stringify(detailData))
      this.formData.materialList.push(data)
    },
    // 删除组件物料
    removeClass(index) {
      var detailData = JSON.parse(JSON.stringify(this.formData))
      this.formData = {}
      this.formData = JSON.parse(JSON.stringify(detailData))
      this.formData.materialList.splice(index, 1)
    },

    /** 提交按钮 */
    submitForm() {
      console.log('this.formData', this.formData)
      this.$refs['formData'].validate(valid => {
        if (valid) {
          if (this.formData.productId !== undefined) {
            updateProduct(this.formData).then(response => {
              this.msgSuccess('修改成功')
              this.dialogVisible = false
              this.getList()
            })
          } else {
            addProduct(this.formData).then(response => {
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
      this.dateRange = []
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 导出按钮
    handleExport() {
      this.btnLoading = true
      downloadProduct(this.queryParams).then((res) => {
        this.btnLoading = false
        if (!res.data) return
        this.$downloadFunc(res, '产品管理')
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
        productNo: undefined,
        picture: undefined,
        lineType: undefined,
        syCategory: undefined,
        syProductAlias: undefined,
        syProductNo: undefined,
        frequency: undefined,
        pictureList: [],
        materialList: [
        ]
      }
      this.resetForm('formData')
    },
    handleRemove(url) {
      if (url === null) {
        this.formData.pictureList.splice(0, 1)
      }
    },
    handleResponse(response, file, fileList) {
      this.formData.pictureList.push({ url: file.response.data[0] })
      // 根据响应结果, 设置 URL
      return file.response.data[0]
    }
  }
}
</script>

<style lang="scss" scoped>
.head-img{
  width: 30px;
  height: 30px;
}
</style>
<style lang="scss">
.normalFormItem .el-form-item__label {
  background: none !important;
  height: 40px;
  border-radius: 0 !important;
  border: 0px solid red;
  border-right: none;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
//.upload-dialog {
//  .el-dialog {
//    width: 35%;
//  }
//}
</style>

