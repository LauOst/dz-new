<template>
  <div class="sidebar-wel-wrap" :class="{'box':collapse}">
    <transition name="slide-fade">
      <div v-if="!collapse" class="flex-item l-flex">
        <div class="img-wrap">
          <img src="../../../assets/images/logo.png" alt="">
        </div>
        <div class="wei-msg">
          <span style="margin-right: 8px">您好!</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import store from '@/store'

export default {
  name: 'Welcome',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      avatar: store.getters.avatar,
      name: store.getters.name
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebar-wel-wrap{
  width: 100%;
  height: 140px;
  .flex-item{
    height: 140px;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    padding: 12px 0;
  }
  img{
    width: 80px;
    height: 80px;
    border-radius: 50%;
  }
  .wei-msg{
    color: rgb(191, 203, 217);
    font-size: 14px;
  }
}
.box{
  height: 0
}

.slide-fade-enter-active {
  transition: opacity 1.5s;
}

.slide-fade-enter,
.slide-fade-leave-to {
  opacity: 0;
}
</style>
