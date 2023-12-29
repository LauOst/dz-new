
<template>
  <div class="dz-table">
    <el-table
      ref="elTable"
      border
      :height="height"
      v-bind="$attrs"
      :data="data"
      :span-method="merge ? mergeMethod : spanMethod"
      row-key="id"
      @sort-change="sortChange"
      @selection-change="handleSelectionChange"
      v-on="$listeners"
    >
      <dz-column
        v-for="(item, index) in columns"
        :key="index"
        v-bind="$attrs"
        :column="item"
      />
    </el-table>
    <pagination v-bind="$attrs" v-on="$listeners" />
  </div>
</template>
<script>
import DzColumn from './lib/dz-column'
import Pagination from '@/components/Pagination'
export default {
  components: {
    DzColumn,
    Pagination
  },
  props: {
    column: {
      type: Array,
      default: () => []
    },
    data: {
      type: Array,
      default: () => []
    },
    spanMethod: {
      type: Function,
      default: () => () => {}
    },

    merge: {
      type: Array,
      default: () => []
    },
    height: {
      type: [String, Number],
      default: 600
    }
  },
  data() {
    return {
      mergeLine: {},
      mergeIndex: {},
      columns: undefined,
      checkList: []
    }
  },
  computed: {
    dataLength() {
      return this.data.length
    }
  },
  watch: {
    merge() {
      this.getMergeArr(this.data, this.merge)
    },
    dataLength() {
      this.getMergeArr(this.data, this.merge)
    },
    column: {
      handler(list) {
        this.setColumn(list)
      }

    }

  },
  created() {
    const userIdentity = this.$store.getters && this.$store.getters.userIdentity
    if (userIdentity !== 1) {
      this.columns = this.column.filter(item => {
        // return item.label ? item.label.indexOf('订单编号') === -1 && item.label.indexOf('归属站点') === -1 : ''
        return item.prop !== 'departName' && item.prop !== 'orderNo'
      })
    } else {
      this.columns = this.column
    }
    this.getMergeArr(this.data, this.merge)
  },
  methods: {
    setColumn(list) {
      const userIdentity = this.$store.getters && this.$store.getters.userIdentity
      if (userIdentity !== 1) {
        this.columns = list.filter(item => {
          // return item.label ? item.label.indexOf('订单编号') === -1 && item.label.indexOf('归属站点') === -1 : ''
          return item.prop !== 'departName'
        })
      } else {
        this.columns = list
      }
    },
    sortChange(column) {
      const obj = {}
      obj.prop = column.prop
      if (column.order === 'ascending') {
        obj.order = 'ASC'
      } else if (column.order === 'descending') {
        obj.order = 'DESC'
      } else {
        obj.order = undefined
      }
      this.$emit('sortChange', obj)
    },
    handleSelectionChange(list) {
      this.checkList = list
      this.$emit('handleSelectionChange', this.checkList)
    },
    clearSelection() {
      this.$refs.elTable.clearSelection()
    },
    toggleRowSelection(row, selected) {
      this.$refs.elTable.toggleRowSelection(row, selected)
    },
    toggleAllSelection() {
      this.$refs.elTable.toggleAllSelection()
    },
    toggleRowExpansion(row, expanded) {
      this.$refs.elTable.toggleRowExpansion(row, expanded)
    },
    setCurrentRow(row) {
      this.$refs.elTable.setCurrentRow(row)
    },
    clearSort() {
      this.$refs.elTable.clearSort()
    },
    clearFilter(columnKey) {
      this.$refs.elTable.clearFilter(columnKey)
    },
    doLayout() {
      this.$refs.elTable.doLayout()
    },
    sort(prop, order) {
      this.$refs.elTable.sort(prop, order)
    },
    paginationCurrentChange(val) {
      this.$emit('p-current-change', val)
    },
    getMergeArr(tableData, merge) {
      if (!merge) return
      this.mergeLine = {}
      this.mergeIndex = {}
      merge.forEach((item, k) => {
        tableData.forEach((data, i) => {
          if (i === 0) {
            this.mergeIndex[item] = this.mergeIndex[item] || []
            this.mergeIndex[item].push(1)
            this.mergeLine[item] = 0
          } else {
            if (data[item] === tableData[i - 1][item]) {
              this.mergeIndex[item][this.mergeLine[item]] += 1
              this.mergeIndex[item].push(0)
            } else {
              this.mergeIndex[item].push(1)
              this.mergeLine[item] = i
            }
          }
        })
      })
    },
    mergeMethod({ row, column, rowIndex, columnIndex }) {
      const index = this.merge.indexOf(column.property)
      if (index > -1) {
        const _row = this.mergeIndex[this.merge[index]][rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    }
  }
}
</script>
