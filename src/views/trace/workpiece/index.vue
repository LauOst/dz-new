<template>
  <div class="app-container">
    <!-- 头部筛选 -->
    <el-card shadow="never" class="card">
      <el-form ref="queryForm" :inline="true" :model="queryParams.model">
        <el-form-item prop="workpieceCode">
          <el-input v-model="queryParams.model.workpieceCode" clearable size="small" placeholder="工件二维码" style="width: 180px;" />
        </el-form-item>
        <el-form-item prop="productCode">
          <el-input v-model="queryParams.model.productCode" clearable size="small" placeholder="产品型号" style="width: 180px;" />
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
    <!-- 添加或修改参数配置对话框 -->
    <el-dialog v-dialogDrag :close-on-click-modal="false" :modal-append-to-body="false" title="详情" :visible.sync="dialogVisible" class="dialog" width="1700px">
      <el-card shadow="never" class="card">
        <div class="l-flex">
          <div>
            <span class="card-title">工件二维码:</span>
            <span class="card-title-text">{{ headData && headData.workpieceCode }}</span>
          </div>
          <div style="margin-left: 40px">
            <span class="card-title">工件型号:</span>
            <span class="card-title-text">{{ headData && headData.productCode }}</span>
          </div>
        </div>

      </el-card>
      <div class="l-flex l-row-between">
        <WorkpieceCard title="粗车立车工作站 OP10&OP20追溯信息" style="width: 19%" :work-list="roughList" :work-data="roughData" />
        <WorkpieceCard title="铣加工工作站 OP30&OP40追溯信息" style="width: 19%" :work-list="millList" :work-data="millData" />
        <WorkpieceCard title="精车一序工作站 OP50追溯信息" style="width: 19%" :work-list="fineFirstList" :work-data="fineFirstData" />
        <WorkpieceCard title="精车二序工作站 OP60追溯信息" style="width: 19%" :work-list="fineSecondList" :work-data="fineSecondData" />
        <WorkpieceCard title="PCD及风嘴工作站 OP70追溯信息" style="width: 19%" :work-list="pcdList" :work-data="pcdData" />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="submitForm">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listWorkpiece } from '@/api/trace/workpiece'
import { detailTraceRough } from '@/api/trace/roughCar'
import { detailTraceMill } from '@/api/trace/mill'
import { detailTraceFineFirst } from '@/api/trace/fineFirst'
import { detailTraceFineSecond } from '@/api/trace/fineSecond'
import { detailTracePcd } from '@/api/trace/pcd'
import WorkpieceCard from './components/WorkpieceCard'
import { getWorklist } from './constant'

export default {
  name: 'Workpiece',
  components: { WorkpieceCard },
  data() {
    return {
      queryParams: {
        type: '',
        field: '',
        page: 1,
        limit: 20,
        model: {
          workpieceCode: undefined,
          productCode: undefined
        }
      },
      column: [
        { type: 'index', index: this.indexMethod, fixed: true },
        { label: '工二维码', prop: 'workpieceCode' },
        { label: '产品型号', prop: 'productCode' },
        { label: '操作', render: (h, scope) => {
          return (
            <div id='btnWrap'>
              <el-button
                type='primary'
                size='mini'
                onClick={() => { this.handleEdit(scope) }}
              >查看追溯详情</el-button>
            </div>
          )
          // )
        }, width: 200 }
      ],
      // 弹窗层控制
      dialogVisible: false,
      loading: false,
      total: 0, // 列表总条数
      list: [], // 表格数据
      roughData: {},
      millData: {},
      fineFirstData: {},
      fineSecondData: {},
      pcdData: {},
      roughList: [],
      millList: [],
      fineFirstList: [],
      fineSecondList: [],
      pcdList: [],
      headData: {}
    }
  },
  mounted() {
    [this.queryParams.model.startTime, this.queryParams.model.endTime] = this.getMonthWeeks()
    this.getList()
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
    getList() {
      this.loading = true
      listWorkpiece(this.queryParams).then(res => {
        const { list, total } = res.data
        this.list = list
        this.total = total || 0
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 查看详情(粗车立车)
    getDetailTraceRough(id) {
      detailTraceRough({ workpieceId: id }).then(r => {
        this.roughData = r.data
      })
    },
    // 查看详情(铣加工)
    getDetailTraceMill(id) {
      detailTraceMill({ workpieceId: id }).then(r => {
        this.millData = r.data
      })
    },
    // 查看详情(精车一序)
    getDetailTraceFineFirst(id) {
      detailTraceFineFirst({ workpieceId: id }).then(r => {
        this.fineFirstData = r.data
      })
    },
    // 查看详情(精车二序)
    getDetailTraceFineSecond(id) {
      detailTraceFineSecond({ workpieceId: id }).then(r => {
        this.fineSecondData = r.data
      })
    },
    // 查看详情(PCD)
    getDetailTracePcd(id) {
      detailTracePcd({ workpieceId: id }).then(r => {
        this.pcdData = r.data
      })
    },
    handleEdit(scope) {
      this.headData = scope.row
      const { roughList, millList, fineFirstList, fineSecondList, pcdList } = getWorklist()
      this.roughList = roughList
      this.millList = millList
      this.fineFirstList = fineFirstList
      this.fineSecondList = fineSecondList
      this.pcdList = pcdList
      const workpieceId = scope.row.id
      // 粗车立车
      this.getDetailTraceRough(workpieceId)
      // 铣加工
      this.getDetailTraceMill(workpieceId)
      // 精车一序
      this.getDetailTraceFineFirst(workpieceId)
      // 精车二序
      this.getDetailTraceFineSecond(workpieceId)
      // PCD
      this.getDetailTracePcd(workpieceId)
      this.dialogVisible = true
    },
    submitForm() {},
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1
      this.getList()
    },
    /** 重置按钮操作 */
    async resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    }
  }
}
</script>

<style scoped lang="scss">
.card-title{
  font-size: 16px;
  font-weight: 700;
}
.card-title-text{
  margin-left: 10px;
}
</style>
