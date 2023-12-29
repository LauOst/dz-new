<template>
  <div class="Chart l-flex l-flex-col" :style="[imgStyle]">
    <slot name="head" />
    <div class="slotW">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChartCard',
  props: {
    width: {
      type: [String, Number],
      default: '100%'
    },
    height: {
      type: [String, Number],
      default: '100%'
    }
  },
  data() {
    return {
      slotHeight: 0
    }
  },
  computed: {
    imgStyle() {
      const style = {}
      // 如果设置width和height属性，则优先使用
      style.width = this.$Dz.addUnit(this.width)
      style.height = this.$Dz.addUnit(this.height)
      return style
    }
  },
  mounted() {
    // this.$nextTick(() => {
    //   for (var slot of this.$slots.head) {
    //     this.slotWidth = this.$Dz.addUnit(this.height - slot.elm.offsetHeight)
    //   }
    // })
  }
}
</script>

<style scoped>
.Chart {
  border: 1px solid #d8dbe0;
  border-radius: 4px;
  background: #fff;
  /*box-shadow: 0px 0px 2px 1px rgba(0, 0, 0, .1);*/
}
.Chart:hover {
  box-shadow:0px 3px 3px #c8c8c8;
}
h1 {
  color: #464646;
  text-transform: uppercase;
  border-bottom: 1px solid #d8dbe0;
  padding: 12px 20px;
  font-size: 16px;
  font-weight: 500;
  margin: 0;
}
.slotW{
  padding:20px;
  flex: 1;
  height: 0;
}

</style>
