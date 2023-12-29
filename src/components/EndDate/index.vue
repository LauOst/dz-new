<template>
  <el-form-item prop="endTime" :rules="[{trigger: 'change', validator:validateEndTime }]">
    <el-date-picker
      v-model="endTimeVal"
      size="small"
      :style="width"
      :value-format="valueFormat"
      :type="type"
      :picker-options="endDatePicker"
      :placeholder="placeholder"
      @change="handleDateRange"
    />
  </el-form-item>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  model: {
    prop: 'endTime',
    event: 'changeDateEnd'
  },
  props: {
    endTime: {
      type: [String],
      default() {
        return ''
      }
    },
    placeholder: {
      type: [String],
      default() {
        return '结束时间'
      }
    },
    type: {
      type: [String],
      default() {
        return 'date'
      }
    },
    valueFormat: {
      type: [String],
      default() {
        return 'yyyy-MM-dd'
      }
    },
    width: {
      type: [String],
      default() {
        return '180px'
      }
    }
  },
  data() {
    return {
      endTimeVal: '',
      endDatePicker: this.processDate() // 结束时间控制
    }
  },
  computed: {
    ...mapGetters(['startTimes', 'endTimes'])
  },
  watch: {
    endTime(newList) {
      this.endTimeVal = newList
      this.SET_ENDTIMES(newList)
    }
  },
  beforeDestroy() {
    this.SET_ENDTIMES(undefined)
  },
  methods: {
    ...mapMutations({
      SET_ENDTIMES: 'public/SET_ENDTIMES'
    }),
    handleDateRange() {
      this.$emit('changeDateEnd', this.endTimeVal)
    },
    processDate() {
      const self = this
      return {
        disabledDate(time) {
          if (self.startTimes) { // 如果开始时间不为空，则结束时间大于开始时间
            return new Date(self.startTimes).getTime() - (1 * 24 * 60 * 60 * 1000) > time.getTime() || time.getTime() > Date.now()
          } else {
            return time.getTime() > Date.now()// 开始时间不选时，结束时间最大值小于等于当天
          }
        }
      }
    },
    validateEndTime(rule, value, callback) {
      // if (this.startTimes && !value) {
      //   callback(new Error('请选择结束时间'))
      // } else {
      //   callback()
      // }
      callback()
    }
  }
}
</script>
