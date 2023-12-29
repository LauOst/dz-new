<template>
  <div>
    <div v-if="false" class="box" />
    <div class="box-1" />
  </div>
</template>
<style lang="scss">
.box {
  width: 200px;
  height: 200px;
  background: #ccc;
  display: none;
}
.box-1 {
  width: 200px;
  height: 200px;
  background: pink;
}
</style>
<!--<template>-->
<!--  <div class="app-container">-->
<!--    &lt;!&ndash; 头部筛选 &ndash;&gt;-->
<!--    <el-card shadow="never" class="card">-->
<!--      <span>产线负责人录入</span>-->
<!--    </el-card>-->
<!--    &lt;!&ndash; 表格信息 &ndash;&gt;-->
<!--    <dz-table-->
<!--      v-loading="loading"-->
<!--      :column="column"-->
<!--      :data="list"-->
<!--      :total="total"-->
<!--      pagination-->
<!--      :page.sync="queryParams.page"-->
<!--      :limit.sync="queryParams.limit"-->
<!--      @pagination="getList"-->
<!--      @sortChange="sortChange"-->
<!--    />-->
<!--    &lt;!&ndash; 弹出层 &ndash;&gt;-->
<!--    <el-dialog v-dialogDrag :close-on-click-modal="false" :modal-append-to-body="false" :visible.sync="dialogVisible" title="编辑" class="dialog" width="550px">-->
<!--      <el-form-->
<!--        ref="formData"-->
<!--        :model="formData"-->
<!--        :rules="rules"-->
<!--        label-width="90px"-->
<!--        style="width: 430px; margin-left:40px;"-->
<!--      >-->
<!--        <el-form-item label="负责人" prop="chargeName">-->
<!--          <el-input v-model="formData.chargeName" placeholder="请输入角色名称" />-->
<!--        </el-form-item>-->
<!--        &lt;!&ndash;        <el-form-item label="当前产品" prop="nowProd">&ndash;&gt;-->
<!--        &lt;!&ndash;          <el-input v-model="formData.nowProd" placeholder="请输入权限字符" />&ndash;&gt;-->
<!--        &lt;!&ndash;        </el-form-item>&ndash;&gt;-->
<!--      </el-form>-->
<!--      <div style="text-align:right;">-->
<!--        <el-button @click="dialogVisible=false">取消</el-button>-->
<!--        <el-button type="primary" @click="submitForm">确 定</el-button>-->
<!--      </div>-->
<!--    </el-dialog>-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--import { listPerson, updatePerson } from '@/api/trace/person'-->

<!--export default {-->
<!--  name: 'Person',-->
<!--  data() {-->
<!--    return {-->
<!--      queryParams: {-->
<!--        type: '',-->
<!--        field: '',-->
<!--        page: 0,-->
<!--        limit: 0,-->
<!--        model: {-->
<!--        }-->
<!--      },-->
<!--      column: [-->
<!--        { label: '负责人', prop: 'chargeName', disableSort: true },-->
<!--        // { label: '当前产品', prop: 'nowProd' },-->
<!--        { label: '操作', render: (h, scope) => {-->
<!--          return (-->
<!--            <div id='btnWrap'>-->
<!--              <el-button-->
<!--                v-hasPermi={['system:role:edit']}-->
<!--                type='primary'-->
<!--                size='mini'-->
<!--                onClick={() => { this.handleEdit(scope) }}-->
<!--              >编辑</el-button>-->
<!--            </div>-->
<!--          )-->
<!--          // )-->
<!--        }, width: 140 }-->
<!--      ],-->
<!--      loading: false,-->
<!--      // 弹窗层控制-->
<!--      dialogVisible: false,-->
<!--      total: 0, // 列表总条数-->
<!--      list: [], // 表格数据-->
<!--      formData: {},-->
<!--      rules: {-->
<!--        chargeName: [-->
<!--          { required: true, message: '负责人名称不能为空', trigger: 'blur' }-->
<!--        ],-->
<!--        nowProd: [-->
<!--          { required: true, message: '当前产品不能为空', trigger: 'blur' }-->
<!--        ]-->
<!--      }-->
<!--    }-->
<!--  },-->
<!--  mounted() {-->
<!--    this.getList()-->
<!--  },-->
<!--  methods: {-->
<!--    getList() {-->
<!--      this.loading = true-->
<!--      listPerson(this.queryParams).then(res => {-->
<!--        this.list = res.data-->
<!--        this.total = res.count || 0-->
<!--        this.loading = false-->
<!--      }).catch(() => {-->
<!--        this.loading = false-->
<!--      })-->
<!--    },-->
<!--    // 编辑-->
<!--    handleEdit(scope) {-->
<!--      this.reset()-->
<!--      this.formData = JSON.parse(JSON.stringify(scope.row))-->
<!--      this.dialogVisible = true-->
<!--    },-->
<!--    /** 搜索按钮操作 */-->
<!--    handleQuery() {-->
<!--      this.queryParams.page = 1-->
<!--      this.getList()-->
<!--    },-->
<!--    /** 重置按钮操作 */-->
<!--    async resetQuery() {-->
<!--      this.resetForm('queryForm')-->
<!--      this.handleQuery()-->
<!--    },-->
<!--    submitForm() {-->
<!--      this.$refs['formData'].validate(valid => {-->
<!--        if (valid) {-->
<!--          updatePerson(this.formData).then(response => {-->
<!--            this.msgSuccess('修改成功')-->
<!--            this.dialogVisible = false-->
<!--            this.getList()-->
<!--          })-->
<!--        }-->
<!--      })-->
<!--    },-->
<!--    // 表单重置-->
<!--    reset() {-->
<!--      this.formData = {-->
<!--        id: undefined,-->
<!--        chargeName: undefined,-->
<!--        nowProd: undefined-->
<!--      }-->
<!--      this.resetForm('formData')-->
<!--    }-->
<!--  }-->
<!--}-->
<!--</script>-->

<!--<style scoped>-->

<!--</style>-->
