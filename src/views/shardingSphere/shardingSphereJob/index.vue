<template>
  <div class="app-container">

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
    <!--修改作业-->
    <el-dialog v-dialogDrag :close-on-click-modal="false" :modal-append-to-body="false" title="修改作业" :visible.sync="dialogVisible" width="1100px">
      <el-form ref="formData" :model="formData" label-width="120px" style="width: 92%; margin-left:40px;">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="作业名称" prop="jobName">
              <el-input v-model="formData.jobName" clearable placeholder="请输入作业名称" />
            </el-form-item>
            <el-form-item label="Cron表达式" prop="cron">
              <el-input v-model="formData.cron" clearable placeholder="请输入Cron表达式" />
            </el-form-item>
            <el-form-item label="作业分片总数" prop="shardingTotalCount">
              <el-input-number v-model="formData.shardingTotalCount" placeholder="请输入作业分片总数" />
            </el-form-item>
            <el-form-item label="自定义参数" prop="jobParameter">
              <el-input v-model="formData.jobParameter" clearable placeholder="请输入自定义参数" />
            </el-form-item>
            <el-form-item label="支持错过重执行" prop="misfire">
              <el-checkbox v-model="formData.misfire">支持错过重执行</el-checkbox>
            </el-form-item>
            <el-form-item label="作业描述信息" prop="description">
              <el-input v-model="formData.description" type="textarea" clearable placeholder="请输入作业描述信息" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="支持自动失效转移" label-width="160px" prop="failover">
              <el-checkbox v-model="formData.failover">支持自动失效转移</el-checkbox>
            </el-form-item>
            <el-form-item label="监控作业执行时状态" label-width="160px" prop="monitorExecution">
              <el-checkbox v-model="formData.monitorExecution">监控作业执行时状态</el-checkbox>
            </el-form-item>
            <el-form-item label="本机与注册中心误差秒" label-width="160px" prop="maxTimeDiffSeconds">
              <el-input-number v-model="formData.maxTimeDiffSeconds" clearable placeholder="请输入本机与注册中心误差秒" />
            </el-form-item>
            <el-form-item label="作业分片策略类型" label-width="160px" prop="jobShardingStrategyType">
              <el-input v-model="formData.jobShardingStrategyType" clearable placeholder="请输入作业分片策略类型" />
            </el-form-item>
            <el-form-item label="作业线程池处理策略" label-width="160px" prop="jobExecutorServiceHandlerType">
              <el-input v-model="formData.jobExecutorServiceHandlerType" clearable placeholder="请输入作业线程池处理策略" />
            </el-form-item>
            <el-form-item label="作业错误处理策略" label-width="160px" prop="jobErrorHandlerType">
              <el-input v-model="formData.jobErrorHandlerType" clearable placeholder="请输入作业错误处理策略" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="分片序列号/参数对照表" label-width="170px" prop="shardingItemParameters">
              <el-input v-model="formData.shardingItemParameters" type="textarea" clearable placeholder="请输入分片序列号/参数对照表" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label-width="0">
              <span>作业属性</span>
            </el-form-item>

            <el-form-item
              v-for="(prop, index) in formData.propList"
              :key="index"
              label-width="0"
            >
              <el-col :span="10" style="padding-right: 10px">
                <el-input v-model="prop.name" placeholder="作业属性名" />
              </el-col>
              <el-col :span="10" style="padding-right: 10px">
                <el-input v-model="prop.value" placeholder="作业属性名" />
              </el-col>
              <el-col :span="4">
                <el-button type="danger" @click="removeProperty(prop)">删除</el-button>
              </el-col>
            </el-form-item>

            <el-form-item label-width="0px">
              <el-col>
                <el-button type="primary" @click="addProperty">添加</el-button>
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>

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
import { getJob } from '@/api/shardingSphere/shardingSphere'
import {
  disable,
  enable,
  getJobConfig,
  remove,
  shutdown,
  trigger,
  updateEquipment
} from '@/api/shardingSphere/shardingSphereJob'

export default {
  name: 'ShardingSphereTrack',
  data() {
    return {
      column: [
        { type: 'index', index: this.indexMethod, fixed: true },
        { label: '作业名称', prop: 'jobName' },
        { label: '作业片段总算', prop: 'shardingTotalCount' },
        { label: 'Cron表达式', prop: 'cron' },
        { label: '作业描述信息', render: (h, scope) => {
          return (
            <span>{decodeURIComponent(scope.row.description) }</span>
          )
        } },
        { label: '状态', render: (h, scope) => {
          return (
            <el-tag size='small' type={this.statusColors(scope.row.status)}>{ this.statusText(scope.row.status)}</el-tag>
          )
        } },
        { label: '操作', render: (h, scope) => {
          return (
            <el-button-group>
              <el-button type='primary' size='mini' onClick={() => { this.handleModify(scope.row) }}>修改</el-button>
              {scope.row.status !== 'CRASHED' && (<el-button type='info' size='mini' onClick={() => { this.handleDetail(scope.row) }}>详情</el-button>)}
              {scope.row.status === 'OK' && (<el-button type='success' size='mini' onClick={() => { this.handleTrigger(scope.row) }} >触发</el-button>)}
              {scope.row.status === 'DISABLED' && (<el-button type='success' size='mini' onClick={() => { this.handleEnable(scope.row) }} >生效</el-button>)}
              {scope.row.status === 'OK' && (<el-button type='warning' size='mini' onClick={() => { this.handleDisable(scope.row) }}>失效</el-button>)}
              {scope.row.status !== 'CRASHED' && (<el-button type='danger' size='mini' onClick={() => { this.handleShutdown(scope.row) }}>终止</el-button>)}
              {scope.row.status === 'CRASHED' && (<el-button type='danger' size='mini' onClick={() => { this.handlerRemove(scope.row) }}>删除</el-button>)}
            </el-button-group>
          )
        }, width: 320, fixed: 'right', align: 'left', headerAlign: 'center' }
      ],
      // 遮罩层(加载)
      loading: false,
      total: 0, // 列表总条数
      queryParams: { // 查询信息
        page: 1,
        limit: 20,
        jobName: undefined, // 产线id
        ip: undefined, // 产线id
        isSuccess: undefined // 订单编号
      },
      dialogVisible: false, // 新增弹窗
      passVisible: false, // 确认气泡框
      formData: {},
      list: [] // 表格数据
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    // 排序
    sortChange(column) {
      this.$mySort(this.queryParams, column, this.getList)
    },
    // 格式化序号
    indexMethod(index) {
      return (this.queryParams.page - 1) * this.queryParams.limit + index + 1
    },
    // 获取机器人列表
    getList() {
      this.loading = true
      getJob(this.queryParams).then(res => {
        this.list = res.data
        this.total = res.count || 0
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },

    // 修改
    handleModify(row) {
      this.reset()
      const params = { jobName: row.jobName }
      getJobConfig(params).then(res => {
        const data = res.data
        data.props = data.props || {}
        data.propList = data.propList || []
        data.description = decodeURIComponent(data.description)
        for (const key in data.props) {
          data.propList.push({ name: key, value: data.props[key] })
        }
        this.formData = data
        this.dialogVisible = true
      })
    },
    handleDetail(row) {
      const params = {
        jobName: row.jobName
      }
      this.$router.push({ name: 'ShardingSphereJobDetail', query: params })
    },
    // 触发
    handleTrigger(row) {
      const params = { jobName: row.jobName }
      trigger(params).then(res => {
        this.$notify({
          title: '提示',
          message: '操作成功',
          type: 'success'
        })
        this.getList()
      })
    },
    // 生效
    handleEnable(row) {
      const params = { jobName: row.jobName }
      enable(params).then(res => {
        this.$notify({
          title: '提示',
          message: '操作成功',
          type: 'success'
        })
        this.getList()
      })
    },
    // 失效
    handleDisable(row) {
      const params = { jobName: row.jobName }
      disable(params).then(res => {
        this.$notify({
          title: '提示',
          message: '操作成功',
          type: 'success'
        })
        this.getList()
      })
    },
    // 终止
    handleShutdown(row) {
      const params = { jobName: row.jobName }
      this.$confirm('您确定要终止调度吗', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return shutdown(params)
      }).then(() => {
        this.getList()
        this.$notify({
          title: '提示',
          message: '操作成功',
          type: 'success'
        })
      }).catch(function() {
        row.isShow = row.isShow === 1 ? 0 : 1
      })
    },
    // 删除
    handlerRemove(row) {
      const params = { jobName: row.jobName }
      this.$confirm('您确定要删除调度吗', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return remove(params)
      }).then(() => {
        this.getList()
        this.$notify({
          title: '提示',
          message: '操作成功',
          type: 'success'
        })
      }).catch(function() {
        row.isShow = row.isShow === 1 ? 0 : 1
      })
    },
    // 添加
    addProperty() {
      this.formData.propList.push({ name: '', value: '' })
    },
    removeProperty(prop) {
      const index = this.formData.propList.indexOf(prop)
      if (index !== -1) {
        this.formData.propList.splice(index, 1)
      }
    },
    statusColors(status) {
      const obj = {
        OK: 'success',
        DISABLED: 'warning',
        CRASHED: 'info',
        SHARDING_FLAG: 'primary'
      }
      return obj[status]
    },
    statusText(status) {
      const obj = {
        OK: '正常',
        DISABLED: '已失效',
        CRASHED: '已下线',
        PENDING: '等待运行',
        RUNNING: '正在运行',
        SHARDING_FLAG: '分片待调整'
      }
      return obj[status]
    },
    // 编辑提交
    handleSubmit() {
      const data = JSON.parse(JSON.stringify(this.formData))
      data.props = {}
      data.propList = data.propList || []
      for (const prop of data.propList) {
        data.props[prop.name] = prop.value
      }
      delete data.propList
      updateEquipment(data).then(res => {
        this.dialogVisible = false
        this.passVisible = false
        this.$notify({
          title: '提示',
          message: '操作成功',
          type: 'success'
        })
        this.getList()
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
        jobName: undefined, // 作业名称
        propList: [], // 作业属性
        shardingTotalCount: 1, // 作业分片总数
        cron: undefined, // Cron表达式
        description: undefined, // 作业描述信息
        jobParameter: undefined, // 自定义参数
        maxTimeDiffSeconds: -1, // 最大容忍本机与注册中心的时间误差秒数
        reconcileIntervalMinutes: 0,
        monitorExecution: false, // 监控作业执行时状态
        failover: false, // 支持自动失效转移
        misfire: false, // 支持错过重执行
        shardingItemParameters: undefined, // 分片序列号/参数对照表
        jobShardingStrategyType: undefined, // 作业分片策略类型
        jobExecutorServiceHandlerType: undefined, // 作业线程池处理策略
        jobErrorHandlerType: undefined // 作业错误处理策略
      }
      this.resetForm('formData')
    }
  }
}
</script>

<style>

</style>
