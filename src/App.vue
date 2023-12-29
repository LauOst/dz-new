<template>
  <div id="app">
    <router-view v-if="isRouterAlive" />
  </div>
</template>

<script>

export default {
  name: 'App',
  provide() {
    return {
      reload: this.reload
    }
  },
  data() {
    return {
      isRouterAlive: true
    }
  },

  methods: {
    reload() {
      const self = this
      self.isRouterAlive = false
      self.$nextTick(function() {
        self.isRouterAlive = true
      })
    }

  }
}
</script>
