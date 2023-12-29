<template>
  <el-container class="page-table-ctn">
    <el-table ref="pageTable" v-loading="loading" v-bind="$attrs" :data="filterData" border height="600" v-on="$listeners">
      <slot />
      <el-table-column v-if="dynamicColumnSetting" width="40" show-overflow-tooltip>
        <template slot="header">
          <el-popover
            placement="bottom"
            min-width="80"
            trigger="click"
            popper-class="col-setting-popover"
          >
            <el-button
              slot="reference"
              size="small"
              type="text"
              icon="el-icon-setting"
              style="padding:0;"
            />
            <div class="col-setting-title">表格字段定制</div>
            <el-checkbox-group v-model="visibleIndexs" :min="1" class="col-setting-group">
              <el-checkbox
                v-for="colInfo in columnInfos"
                v-show="!colInfo.disabled || showAlwaysShowColumnInCheckbox"
                :key="colInfo.index"
                :label="colInfo.index"
                :disabled="colInfo.disabled"
              >{{ colInfo.label }}</el-checkbox>
            </el-checkbox-group>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>

    <!--    <el-footer v-if="hidden && total>0" class="footer">-->
    <!--      <el-pagination-->
    <!--        v-bind="$attrs"-->
    <!--        :background="background"-->
    <!--        :current-page.sync="currentPage"-->
    <!--        :page-size.sync="pageSize"-->
    <!--        :layout="layout"-->
    <!--        :page-sizes="pageSizes"-->
    <!--        :total="total"-->
    <!--        v-on="$listeners"-->
    <!--        @size-change="handleSizeChange"-->
    <!--        @current-change="handleCurrentChange"-->
    <!--      />-->
    <!--    </el-footer>-->
  </el-container>
</template>

<script>
import { scrollTo } from '@/utils/scroll-to'

export default {
  props: {
    data: {
      type: Array,
      require: true,
      default: _ => []
    },
    total: {
      required: true,
      type: Number
    },
    page: {
      type: Number,
      default: 1
    },
    limit: {
      type: Number,
      default: 20
    },
    pageSizes: {
      type: Array,
      default() {
        return [10, 20, 30, 50]
      }
    },
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    },
    background: {
      type: Boolean,
      default: true
    },
    autoScroll: {
      type: Boolean,
      default: true
    },
    hidden: {
      type: Boolean,
      default: true
    },
    loading: {
      type: Boolean,
      default: false
    },

    // 是否开启动态列设置
    dynamicColumnSetting: {
      type: Boolean,
      default: false
    },
    // 列可见性，初始需要设置全true。列下标从 0 开始
    columnVisibles: {
      type: Array,
      default: _ => []
    },
    // 初始隐藏的列的下标。列下标从 0 开始
    hidenColumnIndexs: {
      type: Array,
      default: _ => []
    },
    // 总是显示的列的下标（不可隐藏的列）。列下标从 0 开始
    alwaysShowColumnIndexs: {
      type: Array,
      default: _ => []
    },
    // 总是显示的列是否在checkbox中显示
    showAlwaysShowColumnInCheckbox: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      allData: this.data, // 全量表格数据(前端分页)
      filterData: [], // 表格展示数据
      start: 1,
      end: 1,
      totalSize: this.data.length,
      currPageSize: this.paging ? this.pageSize : Number.MAX_SAFE_INTEGER,
      currPage: this.currentPage,

      columnInfos: [], // 所有列的信息
      visibleIndexs: [] // 可见列的下标集合
    }
  },
  computed: {
    currentPage: {
      get() {
        return this.page
      },
      set(val) {
        this.$emit('update:page', val)
      }
    },
    pageSize: {
      get() {
        return this.limit
      },
      set(val) {
        this.$emit('update:limit', val)
      }
    }
  },
  watch: {
    data() {
      this.setData(this.data ? this.data : [])
    },
    visibleIndexs(newValue, oldValue) {
      const self = this
      var willHideIndexs = []
      var willShowIndexs = []

      willShowIndexs = newValue.filter(index => {
        return oldValue.indexOf(index) === -1
      })

      willHideIndexs = oldValue.filter(index => {
        return newValue.indexOf(index) === -1
      })

      self.oprColumns(willShowIndexs, true)
      self.oprColumns(willHideIndexs, false)
    }
  },
  mounted() {
    const self = this
    if (self.$refs.pageTable.$slots.default && self.dynamicColumnSetting) {
      self.$refs.pageTable.$slots.default.forEach((columnIns, index) => {
        if (columnIns.componentOptions === undefined) {
          return
        }
        const props = columnIns.componentOptions.propsData
        if (
          props.label === undefined &&
          props.type !== 'selection' &&
          props.type !== 'index'
        ) {
          return
        }
        // 保存所有列的信息
        const label =
            props.type === 'selection'
              ? '多选框'
              : props.type === 'index'
                ? '索引'
                : props.label
        // 默认多选框和索引不可隐藏
        const disabled =
            !!(props.type === 'selection' || props.type === 'index')
        self.columnInfos.push({
          label: label,
          index: index,
          disabled: disabled
        })
        // 记录初始展示的列的下标
        if (self.hidenColumnIndexs.indexOf(index) === -1) {
          self.visibleIndexs.push(index)
        }
      })
      // 处理总是显示的列（不可隐藏的列）
      self.alwaysShowColumnIndexs.forEach(
        index => (self.columnInfos[index].disabled = true)
      )
      // 处理初始隐藏的列
      self.oprColumns(self.hidenColumnIndexs, false)
    }
  },
  beforeUpdate() {
    const self = this
    self.$nextTick(_ => {
      self.$refs.pageTable.doLayout()
    })
  },
  methods: {
    handleSizeChange(val) {
      this.$emit('pagination', { page: this.currentPage, limit: val })
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
    },
    handleCurrentChange(val) {
      this.$emit('pagination', { page: val, limit: this.pageSize })
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
    },
    renderTable() {
      if (this.totalSize > this.currPageSize) {
        // 总行数大于一页
        const startIndex = (this.currPage - 1) * this.currPageSize
        const endIndex = this.currPage * this.currPageSize
        this.start = startIndex + 1
        this.end = this.totalSize < endIndex ? this.totalSize : endIndex
        this.filterData = this.allData.slice(startIndex, endIndex) // [start,end)
      } else if (this.totalSize > 0) {
        // 总行数小于等于一页
        this.currPage = 1
        this.start = 1
        this.end = this.totalSize
        this.filterData = this.allData
      } else {
        // 无数据
        this.currPage = 1
        this.start = 0
        this.end = 0
        this.filterData = []
      }
    },
    setData(value) {
      this.allData = value
      this.totalSize = value.length
      this.renderTable()
    },
    oprColumns(indexs, isShow) {
      const self = this
      indexs.forEach(index => {
        self.$set(self.columnVisibles, index, isShow)
      })
    },

    // <el-table>自带的方法 start
    setCurrentRow(row) {
      this.$refs.pageTable.setCurrentRow(row)
    }
    // ...
    // <el-table>自带的方法 end
  }
}
</script>

<style lang="scss" scoped>
.page-table-ctn{
  display: flex;
  flex-direction: column;
}
.page-table-ctn {
  > .el-table {
    width: auto;
    border: 1px solid #ebeef5;
    border-bottom: unset;
  }
  > .footer {
    height: 40px !important;
    .size-info {
      display: inline;
      font-size: 12px;
      color: #666666;
    }
  }
}

.col-setting-popover {
  min-width: 100px;
  padding: 9px 16px;
  .col-setting-title {
    color: #7f8b93;
    font-size: 12px;
  }
  .col-setting-group {
    .el-checkbox {
      display: block;
      margin-top: 5px;
    }
  }
}
.pagination-container {
  background: #fff;
  padding: 12px 16px;
  margin-top: 0;
  display: flex;
  align-items: center;
}

.pagination-container.hidden {
  display: none;
}
</style>
