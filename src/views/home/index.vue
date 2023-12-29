<template>
  <div class="home-container">
    <component :is="currentRole" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import adminHome from './admin'
import editorHome from './editor'
import hongxinHome from './hongxin'
import cjgHome from './cjg'

export default {
  name: 'Home',
  components: { adminHome, editorHome, hongxinHome, cjgHome },
  data() {
    return {
      currentRole: 'adminHome'
      // currentRole: 'editorHome'
    }
  },
  computed: {
    ...mapGetters([
      'sysConfig',
      'useOrgCode'
    ])
  },
  created() {
    if (this.useOrgCode === 'hong_xin_trace') {
      this.currentRole = 'hongxinHome'
    } else if (this.useOrgCode.indexOf('xiaozhou') !== -1) {
      this.currentRole = 'cjgHome'
    }
  }
}
</script>
