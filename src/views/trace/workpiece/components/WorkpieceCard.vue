<template>
  <el-card style="margin-bottom:20px;">
    <div slot="header">
      <span class="title">{{ title }}</span>
    </div>
    <div class="user-profile">
      <ul class="list-group list-group-striped">
        <li v-for="(item, index) in workList" :key="index" class="list-group-item">
          <span class="list-item-name">{{ item.label }}:</span>
          <span class="list-item-text">{{ workData ? workData[item.value] : '--' }}</span>
        </li>
      </ul>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'WorkpieceCard',
  props: {
    title: {
      type: String,
      default: '标题'
    },
    workList: {
      type: Array,
      default: () => {
        return []
      }
    },
    workData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  }
}
</script>

<style scoped lang="scss">
.title {
  font-size: 16px;
  font-weight: 700;
}
.list-group {
  padding-left: 0;
  list-style: none;
  margin: 0;
}
.list-group-item {
  border-bottom: 1px solid #e7eaec;
//border-top: 1px solid #e7eaec;
  margin-bottom: -1px;
  padding: 11px 0;
  font-size: 13px;
}
.list-item-name {
  font-weight: 900;
}
.list-item-text {
  margin-left: 10px;
}
</style>
