<template>
  <div>TabPane</div>
</template>

<script>
import { alarmLog, momCommunicatLog } from '@/api/record/log'

export default {
  name: 'TabPane',
  props: {
    type: {
      type: String,
      default: 'Alarm'
    }
  },
  data() {
    return {
      queryParams: {
        page: 1,
        limit: 20,
        equipmentType: undefined,
        equipmentNo: undefined,
        equipmentCode: undefined,
        orderNo: undefined,
        lineId: undefined,
        dateRange: [],
        startTime: undefined,
        endTime: undefined
      },
      currentType: 'Alarm'
    }
  },
  watch: {
    type(val) {
      this.currentType = val
    }
  },
  created() {
    console.log('ype', this.type)
  },
  mounted() {
    console.log('ype', this.currentType)
    if (this.currentType === 'Alarm') {
      this.getList()
    } else {
      this.getMomList()
    }
    // console.log('ype', this.type)
  },
  methods: {
    getList() {
      this.loading = true
      alarmLog(this.queryParams).then(res => {
        this.list = res.data
        this.total = res.count || 0
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    /** 查询列表 */
    getMomList() {
      this.loading = true
      momCommunicatLog(this.queryParams).then(
        response => {
          this.list = response.data
          this.total = response.count
          this.loading = false
        }
      ).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
