<template>
  <div class="app-container">
    <!-- 头部筛选 -->
    <el-card shadow="never" class="card">
      <el-form ref="queryForm" :inline="true" :model="queryParams">
        <el-form-item prop="qrCode">
          <el-input v-model="queryParams.qrCode" clearable size="small" placeholder="工件二维码" style="width: 180px;" />
        </el-form-item>
        <el-form-item prop="productNo">
          <el-input v-model="queryParams.productNo" clearable size="small" placeholder="工件型号" style="width: 180px;" />
        </el-form-item>
        <el-form-item prop="grade">
          <el-input v-model="queryParams.grade" clearable size="small" placeholder="等级" style="width: 180px;" />
        </el-form-item>
        <el-form-item>
          <start-date v-model="queryParams.startTime" />
          <end-date v-model="queryParams.endTime" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
          <el-button v-hasPermi="['productModule:workpieceTraceability:excel']" :loading="btnLoading" type="warning" icon="el-icon-download" size="small" @click="handleExport">导出</el-button>
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
    <!--查看详情-->
    <el-dialog v-dialogDrag :close-on-click-modal="false" :title="'详情'" :visible.sync="dialogVisible" class="dialog" width="1500px">

      <div class="l-flex l-row-between" style="height: 300px">
        <div class="l-w-20 l-flex l-flex-col">
          <el-form ref="detailList" :model="detailList" label-width="115px">
            <el-form-item label="工件二维码" prop="qrCode">
              <span class="text-input">{{ detailList.qrCode ||'--' }}</span>
            </el-form-item>
            <el-form-item label="工件型号" prop="productNo">
              <span class="text-input">{{ detailList.productNo ||'--' }}</span>
            </el-form-item>
            <el-form-item label="承载力" prop="bearingCapacity">
              <span class="text-input">{{ detailList.bearingCapacity ||'--' }}</span>
            </el-form-item>
            <el-form-item label="直线度" prop="straightness">
              <span class="text-input">{{ detailList.straightness ||'--' }}</span>
            </el-form-item>
            <el-form-item label="等级" prop="grade">
              <span class="text-input">{{ detailList.grade ||'未知' }}</span>
            </el-form-item>
          </el-form>
        </div>
        <div class="l-w-20 l-flex l-flex-col">
          <el-form ref="detailList" :model="detailList" label-width="115px">
            <el-form-item label="磨床1开工时间" prop="a1BeginTime">
              <span class="text-input">{{ detailList.a1BeginTime ||'--' }}</span>
            </el-form-item>
            <el-form-item label="磨床1完工时间" prop="a1EndTime">
              <span class="text-input">{{ detailList.a1EndTime ||'--' }}</span>
            </el-form-item>
            <el-form-item label="磨床1程序号" prop="a1ProgramNo">
              <span class="text-input">{{ detailList.a1ProgramNo ||'--' }}</span>
            </el-form-item>
            <el-form-item label="磨床1直径检测" prop="a1Diameter">
              <span class="text-input">{{ detailList.a1Diameter ||'--' }}</span>
            </el-form-item>
          </el-form>
        </div>
        <div class="l-w-20 l-flex l-flex-col">
          <el-form ref="detailList" :model="detailList" label-width="115px">
            <el-form-item label="磨床2开工时间" prop="a2BeginTime">
              <span class="text-input">{{ detailList.a2BeginTime ||'--' }}</span>
            </el-form-item>
            <el-form-item label="磨床2完工时间" prop="a2EndTime">
              <span class="text-input">{{ detailList.a2EndTime ||'--' }}</span>
            </el-form-item>
            <el-form-item label="磨床2程序号" prop="a2ProgramNo">
              <span class="text-input">{{ detailList.a2ProgramNo ||'--' }}</span>
            </el-form-item>
            <el-form-item label="磨床2直径检测" prop="a2Diameter">
              <span class="text-input">{{ detailList.a2Diameter ||'--' }}</span>
            </el-form-item>
          </el-form>
        </div>
        <div class="l-w-20 l-flex l-flex-col">
          <el-form ref="detailList" :model="detailList" label-width="115px">
            <el-form-item label="库位号" prop="houseNo">
              <span class="text-input">{{ detailList.houseNo ||'--' }}</span>
            </el-form-item>
            <el-form-item label="入库时间" prop="inHouseTime">
              <span class="text-input">{{ detailList.inHouseTime ||'--' }}</span>
            </el-form-item>
            <el-form-item label="出库时间" prop="outHouseTime">
              <span class="text-input">{{ detailList.outHouseTime ||'--' }}</span>
            </el-form-item>
          </el-form>
        </div>
        <div class="l-w-20 l-flex l-flex-col">
          <el-form ref="detailList" :model="detailList" label-width="115px">
            <el-form-item label="装箱二维码" prop="zxQrCode">
              <span class="text-input">{{ detailList.zxQrCode ||'--' }}</span>
            </el-form-item>
            <el-form-item label="泡沫板二维码" prop="pmbQrCode">
              <span class="text-input">{{ detailList.pmbQrCode ||'--' }}</span>
            </el-form-item>
            <el-form-item label="装箱时间" prop="packTime">
              <span class="text-input">{{ detailList.packTime ||'--' }}</span>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <!-- 操作按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { listStationTraceability, detailTraceability } from '@/api/productModule/workpieceTraceability'
import { downloadWorkpieceTraceability } from '@/api/excel/excel'
export default {
  name: 'WarehouseManage',
  data() {
    return {
      column: [
        { type: 'index', index: this.indexMethod },
        { label: '工件二维码', prop: 'qrCode', disableSort: true },
        { label: '工件型号', prop: 'productNo', disableSort: true },
        { label: '等级', prop: 'grade', disableSort: true },
        { label: '打码时间', prop: 'createTime', disableSort: true },
        { label: '操作', render: (h, scope) => {
          return (
            <div>
              <el-button
                v-hasPermi={['productModule:workpieceTraceability:detail']}
                type='primary'
                size='mini'
                onClick={() => { this.handleDetail(scope) }}
              >详情</el-button>
            </div>
          )
        }, width: 300, fixed: 'right' }
      ],
      loading: false,
      loadingDetail: false,
      btnLoading: false,
      total: 0, // 列表总条数
      DetailTotal: 0, // 列表总条数
      // 查询信息
      queryParams: {
        page: 1,
        limit: 20,
        grade: undefined,
        qrCode: undefined,
        productNo: undefined,
        startTime: undefined,
        endTime: undefined
      },
      list: [],
      detailList: {},
      formData: {},
      dialogVisible: false // 新增编辑弹窗
    }
  },
  mounted() {
    [this.queryParams.startTime, this.queryParams.endTime] = this.getToday()
    this.getList()
  },
  methods: {
    // 格式化序号
    indexMethod(index) {
      return (this.queryParams.page - 1) * this.queryParams.limit + index + 1
    },
    getList() {
      this.loading = true
      listStationTraceability(this.queryParams).then(res => {
        this.list = res.data
        this.total = res.count || 0
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 查看详情
    handleDetail(scope) {
      this.detailList = {}
      this.formData = JSON.parse(JSON.stringify(scope.row))
      this.dialogVisible = true
      this.getDetailList(this.formData.qrCode)
    },
    getDetailList(id) {
      this.loadingDetail = true
      detailTraceability(id).then(res => {
        if (res.code === 0) {
          this.detailList = res.data
          this.DetailTotal = res.count || 0
        }
        this.loadingDetail = false
      }).catch(() => {
        this.loadingDetail = false
      })
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm');
      [this.queryParams.startTime, this.queryParams.endTime] = this.getToday()
      this.handleQuery()
    },
    // 导出按钮
    handleExport() {
      const newData = JSON.parse(JSON.stringify(this.queryParams))
      newData.page = 1
      newData.limit = -1
      this.btnLoading = true
      downloadWorkpieceTraceability(newData).then((res) => {
        this.btnLoading = false
        if (!res.data) return
        this.$downloadFunc(res)
      }).catch(() => {
        this.btnLoading = false
      })
    }
  }
}
</script>

<style scoped>
.l-w-20{
  width: 19%;
}
.text-title{
  font-size: 14px;
  font-weight: 400;
  line-height: 2.5;
}
.text-input {
  border-radius: 0 4px 4px 0 !important;
  /* line-height: 40px; */
  background-color: #FFF;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #DCDFE6;
  box-sizing: border-box;
  color: #606266;
  /* color: #999; */
  display: inline-block;
  font-size: inherit;
  height: 40px;
  line-height: 40px;
  outline: 0;
  padding: 0 15px;
  width: 100%;
}
</style>
