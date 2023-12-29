<template>
  <div>
    <div v-if="list.length === 0" class="empty">暂无数据</div>
    <el-card v-for="(item, index) in list" v-else :key="index" shadow="never" class="card-container" @click.native="handleTo(item.modelType)">
      <div class="card-header">
        <div>
          <span>
            <span class="card-title">{{ item.message }}</span>
          </span>
          <div class="card-time">{{ item.dataTime }}</div>
        </div>
        <div class="card-avatar">
          <img src="../../assets/images/msg.png" width="34">
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    handleTo(type) {
      this.$emit('handleTo', type)
    }
  }
}
</script>

<style lang="scss" scoped>
.empty {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
}
.card-container {
  margin-bottom: 10px;
  cursor: pointer;
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .card-title {
      font-weight: bold;
      margin-right: 10px;
    }
    .card-time {
      font-size: 12px;
      color: grey;
    }
  }
}
</style>
