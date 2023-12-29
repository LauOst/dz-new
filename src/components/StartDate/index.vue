<template>
  <el-form-item prop="startTime" :rules="[{trigger: 'change', validator:validateStartTime }]">
    <el-date-picker
      v-model="startTimeVal"
      size="small"
      :style="width"
      :value-format="valueFormat"
      :type="type"
      :placeholder="placeholder"
      :picker-options="startDatePicker"
      @change="handleDateRange"
    />
  </el-form-item>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  model: {
    prop: 'startTime',
    event: 'changeDateStart'
  },
  props: {
    startTime: {
      type: [String],
      default() {
        return ''
      }
    },
    placeholder: {
      type: [String],
      default() {
        return '开始时间'
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
      startTimeVal: '',
      startDatePicker: this.beginDate() // 开始时间控制
    }
  },

  computed: {
    ...mapGetters(['startTimes', 'endTimes'])
  },
  watch: {
    startTime(newList) {
      this.startTimeVal = newList
      this.SET_STARTTIMES(newList)
    }
  },
  beforeDestroy() {
    this.SET_STARTTIMES(undefined)
  },
  methods: {
    ...mapMutations({
      SET_STARTTIMES: 'public/SET_STARTTIMES'
    }),
    handleDateRange() {
      this.$emit('changeDateStart', this.startTimeVal)
    },
    beginDate() {
      const self = this
      return {
        disabledDate(time) {
          if (self.endTimes) {
            // 如果结束时间不为空，则小于结束时间
            return new Date(self.endTimes).getTime() < time.getTime() || time.getTime() > Date.now()
          } else {
            return time.getTime() > Date.now()// 开始时间不选时，结束时间最大值小于等于当天
          }
        }
      }
    },
    validateStartTime(rule, value, callback) {
      if (this.endTimes && !value) {
        callback(new Error('请选择开始时间'))
      } else {
        callback()
      }
    }
  }
}
</script>
