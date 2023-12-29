<template>
  <div class="comForm">
    <el-form ref="form" :label-width="formConfig.labelWidth" :inline="inline" :model="formParams" @submit.native.prevent="handleSubmitForm">
      <el-form-item v-for="(item, field) of formDesc" :key="field" :label="item.label" :prop="field" :rules="item.rules">
        <el-input v-if="item.type === 'input'" v-model="formParams[field]" :placeholder="item.attrs.placeholder" :size="item.attrs.size" :style="{width: item.width}" />
        <el-select v-if="item.type === 'select'" v-model="formParams[field]" :style="{width: item.width}" :placeholder="item.attrs.placeholder" :size="item.attrs.size">
          <el-option v-for="(opItem, i) in item.options" :key="i" :label="opItem.text" :value="opItem.value" />
        </el-select>
        <el-date-picker v-if="item.type === 'date'" v-model="formParams[field]" type="date" :style="{width: item.width}" :placeholder="item.attrs.placeholder" :size="item.attrs.size" />
        <el-radio-group v-if="item.type === 'radio'" v-model="formParams[field]" :placeholder="item.attrs.placeholder">
          <el-radio v-for="(opItem, i) in item.options" :key="i" :label="opItem.label" :rules="item.rules" />
        </el-radio-group>
        <el-input v-if="item.type === 'textarea'" v-model="formParams[field]" type="textarea" :placeholder="item.attrs.placeholder" />
        <el-switch v-if="item.type === 'switch'" v-model="formParams[field]" />
      </el-form-item>
      <el-form-item>
        <slot :btns="btns" name="form-btn">
          <el-button
            v-for="(btn, index) of btns"
            :key="index"
            v-hasPermi="btn.hasPermi"
            v-bind="btn.attrs"
            @click="btn.click"
          >{{ btn.text }}</el-button>
        </slot>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
const cloneDeep = require('clone')
export default {
  model: {
    prop: 'formParams',
    event: 'input'
  },
  props: {
    formDesc: {
      type: Object,
      required: true
    },
    formParams: {
      type: Object,
      required: true
    },
    formConfig: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 是否显示submit按钮
    isShowSubmitBtn: {
      type: Boolean,
      default: true
    },
    // 是否显示重置按钮
    isShowResetBtn: {
      type: Boolean,
      default: true
    },
    // 是否显示新增按钮
    isShowAddBtn: {
      type: Boolean,
      default: true
    },
    // 表单按钮大小
    formBtnSize: {
      type: String,
      default: 'small'
    },
    // submit按钮文字
    submitBtnText: {
      type: String,
      default: '搜索'
    },
    // 重置按钮文字
    resetBtnText: {
      type: String,
      default: '重置'
    },
    // 新增按钮文字
    addBtnText: {
      type: String,
      default: '新增'
    },
    // 行内模式
    inline: {
      type: Boolean,
      default: false
    },
    requestFn: {
      type: Function,
      default: () => () => {}
    },
    requestError: {
      type: Function,
      default: () => () => {}
    }
  },
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters(['orderList', 'departList']),
    btns() {
      const formBtnSize = this.formBtnSize
      const btns = []
      // 提交按钮
      if (this.isShowSubmitBtn) {
        btns.push({
          attrs: {
            type: 'primary',
            size: formBtnSize,
            'native-type': 'submit',
            icon: 'el-icon-search'
          },
          hasPermi: ['system:user:add'],
          text: this.submitBtnText,
          click() {}
        })
      }

      // 重置按钮
      if (this.isShowResetBtn) {
        btns.push({
          attrs: {
            size: formBtnSize,
            icon: 'el-icon-refresh'
          },
          hasPermi: ['system:user:add'],
          text: this.resetBtnText,
          click: this.resetForm
        })
      }
      if (this.isShowAddBtn) {
        btns.push({
          attrs: {
            type: 'success',
            size: formBtnSize,
            icon: 'el-icon-plus'
          },
          hasPermi: ['system:user:add'],
          text: this.addBtnText,
          click: this.add
        })
      }
      return btns
    }
  },
  created() {
    const userIdentity = this.$store.getters && this.$store.getters.userIdentity
    // console.log('userIdentity', userIdentity)
    if (userIdentity !== 1) {
      delete this.formDesc.departName
    } else {
      const departList = JSON.parse(JSON.stringify(this.departList).replace(/departName/g, 'text').replace(/id/g, 'value'))

      if (this.formDesc.departName) {
        this.formDesc.departName.options = departList
      }
    }
    console.log('this.formDesc', this.formDesc)
  },
  mounted() {},
  methods: {
    // 处理错误
    processError(errObj) {
      if (!this.isShowErrorNotify) return
      try {
        const messageArr = Object.keys(errObj).reduce((acc, key) => {
          const formItem = this.formDesc[key]
          const label =
            formItem && formItem._label ? formItem._label + ': ' : key + ': '
          if (errObj[key] instanceof Array) {
            errObj[key].forEach(item => {
              acc.push(label + item.message)
            })
          } else {
            acc.push(label + errObj[key])
          }
          return acc
        }, [])
        this.showError(messageArr)
      } catch (error) { console.error(error) }
    },
    async handleSubmitForm() {
      try {
        const data = cloneDeep(this.formParams)
        if (this.requestFn) {
          try {
            const response = await this.requestFn(data)
            this.$nextTick(() => {
              this.$emit('request-success', response)
              if (this.requestSuccess) {
                this.requestSuccess(response)
              }
            })
          } catch (error) {
            if (this.requestError) {
              this.requestError(error)
            }

            console.error(error)
            // 处理异常情况
            if (error instanceof Error) {
              // 返回的是Error类型, 则进行解析
              try {
                const msg = JSON.parse(error.message)
                if (msg instanceof Object) {
                  this.innerFormError = msg
                }
                // eslint-disable-next-line
              } catch {}
            } else if (error instanceof Object) {
              // 返回的是对象类型, 则直接设置
              this.innerFormError = error
            }
            this.$emit('request-error')
          } finally {
            this.innerIsLoading = false
            if (this.requestEnd) {
              this.requestEnd()
            }
            this.$emit('request-end')
          }
        } else {
          this.$emit('request', data)
        }
      } catch (error) {
        return this.processError(error)
      }
    },
    resetForm() {
      this.$emit('reset')
      this.$refs.form.resetFields()
      // 调用内部方法进行值的重置
      this.$refs.form.fields.forEach(field => {
        this.formParams[field.prop] = field.initialValue
      })
    },
    add() {
      this.$emit('add')
    }
  }
}
</script>
