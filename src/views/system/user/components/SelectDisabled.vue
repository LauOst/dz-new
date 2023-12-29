<template>
  <el-select
    :value="value"
    multiple
    placeholder="请选择"
    v-bind="$attrs"
    @change="changeHandle"
    @remove-tag="removeHandle"
  >
    <el-option
      v-for="item in list"
      :key="item.roleId"
      :label="item.roleName"
      :value="item.roleId"
      :disabled="item.disabled"
    />
  </el-select>
</template>

<script>

export default {
  inheritAttrs: false,
  model: {
    prop: 'value',
    event: 'input'
  },
  props: {
    value: {
      type: Array,
      default() {
        return []
      }
    },
    list: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      selected: [],
      draftId: null
    }
  },
  mounted() {
  },
  methods: {
    changeHandle(val) {
      this.selected = val
      // 延时返回数据，主要是因为element会先执行change然后在执行remove，为了恢复不可删除的栏目，所以延时返回数据
      setTimeout(() => {
        this.$emit('input', this.selected)
      }, 10)
    },
    removeHandle(val) {
      console.log('val', val)
      // 检查选项是否可用
      const removeItem = this.list.find((item) => {
        return item.roleId === val && item.disabled === false
      })
      console.log('removeItem', removeItem)
      // 如果找不到表示不可删除
      if (typeof removeItem === 'undefined') {
        this.selected = this.value
        this.msgError('开发者不可删除')
      } else {
        // 如果找到可删除，则过滤
        this.selected = this.value.filter((item) => {
          return item !== val
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
