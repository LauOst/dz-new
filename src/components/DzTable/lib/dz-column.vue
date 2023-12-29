<template>
  <el-table-column
    v-bind="$attrs"
    :prop="column.prop"
    :label="column.label"
    :type="column.type"
    :index="column.index"
    :column-key="column.columnKey"
    :width="column.width"
    :min-width="column.minWidth"
    :fixed="column.fixed"
    :sortable="column.sortable || false "
    :sort-method="column.sortMethod"
    :sort-by="column.sortBy"
    :sort-orders="column.sortOrders"
    :resizable="column.resizable || true"
    :formatter="column.formatter"
    :show-overflow-tooltip="column.showOverflowTooltip || true"
    :align="column.align || align || 'center'"
    :header-align="column.headerAlign || headerAlign || column.align || align || 'center'"
    :class-name="column.className"
    :label-class-name="column.labelClassName"
    :reserve-selection="column.reserveSelection || false"
    :filters="column.filters"
    :filter-placement="column.filterPlacement"
    :filter-multiple="column.filterMultiple"
    :filter-method="column.filterMethod"
    :filtered-value="column.filteredValue"
    :selectable="column.selectable"
    v-on="$listeners"
  >
    <!--    :render-header="column.renderHeader"-->

    <template
      slot="header"
      slot-scope="scope"
    >
      <dz-render
        v-if="column.renderHeader"
        :scope="scope"
        :render="column.renderHeader"
      />
      <span v-else>{{ scope.column.label }}</span>
    </template>

    <template slot-scope="scope">
      <dz-render
        :scope="scope"
        :render="column.render"
      />
    </template>

    <template v-if="column.children">
      <dz-column
        v-for="(col, index) in column.children"
        :key="index"
        :column="col"
      />
    </template>
  </el-table-column>
</template>

<script>
import DzRender from './dz-render'
import forced from '../forced.js'
export default {
  name: 'DzColumn',
  components: {
    DzRender
  },
  props: {
    column: {
      type: Object,
      default: () => {}
    },
    headerAlign: {
      type: String,
      default: ''
    },
    align: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      widthW: 0
    }
  },
  watch: {
    column: {
      handler() {
        this.setColumn()
      },
      immediate: true
    }
  },
  methods: {
    setColumn() {
      if (this.column.type) {
        this.column.renderHeader = forced[this.column.type].renderHeader
        this.column.render = this.column.render || forced[this.column.type].renderCell
        this.column.width = 50
      }
      if (this.column.formatter) {
        this.column.render = (h, scope) => {
          return <span>{ scope.column.formatter(scope.row, scope.column, scope.row, scope.$index) }</span>
        }
      }
      if (!this.column.render) {
        this.column.sortable = 'column'
        // this.column.sortable = 'column'
        this.column.render = (h, scope) => {
          return <span>{ scope.row[scope.column.property] }</span>
          // return <span class={scope.row[scope.column.property].search('::') !== -1 ? 'myColor' : 'myColor'} >{ scope.row[scope.column.property] }</span>
        }
      }
      if (this.column.disableSort) {
        this.column.sortable = false
      }
    }
  }
}
</script>
<style scoped>
.myColor {
  color: red;
}
</style>

