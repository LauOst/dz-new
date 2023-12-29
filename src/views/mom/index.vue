<template>
  <div class="home-container">
    <component :is="currentRole" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import pgHome from './polish'
import DZICSHome from './dzics'

export default {
  components: { pgHome, DZICSHome },
  data() {
    return {
      currentRole: 'DZICSHome'
    }
  },
  computed: {
    ...mapGetters([
      'useOrgCode'
    ])
  },
  created() {
    console.log('useOrgCode', this.useOrgCode)
    this.currentRole = `${this.useOrgCode}Home`
  }
}
</script>
