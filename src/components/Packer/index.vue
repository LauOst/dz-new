<template>
  <el-date-picker
    v-model="dateRangeVal"
    size="small"
    style="width: 240px"
    value-format="yyyy-MM-dd"
    type="daterange"
    unlink-panels
    range-separator="-"
    start-placeholder="开始日期"
    end-placeholder="结束日期"
    :picker-options="{disabledDate(time) {return time.getTime() > Date.now()}}"
    @change="handleDateRange"
  />
</template>

<script>
export default {
  model: {
    prop: 'dateRange',
    event: 'changeDateRange'
  },
  props: {
    dateRange: {
      type: [String, Array],
      default() {
        return []
      }
    }
  },
  data() {
    return {
      dateRangeVal: []
    }
  },
  watch: {
    dateRange(newList) {
      this.dateRangeVal = newList
    }
  },
  methods: {
    handleDateRange() {
      console.log('dateRangeVal', this.dateRangeVal)
      this.$emit('changeDateRange', this.dateRangeVal)
    }
  }
}
</script>
