<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6" :xs="24">
        <el-card style="margin-bottom:20px;" :body-style="{paddingTop: '0' }">
          <div slot="header" class="clearfix">
            <span>个人资料</span>
          </div>
          <div class="user-profile">
            <ul class="list-group list-group-striped">
              <li class="list-group-item">
                <svg-icon icon-class="user" />用户名称
                <div class="pull-right">{{ user.username }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="peoples" />所属角色
                <div class="pull-right">{{ user.realname }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="date" />创建日期
                <div class="pull-right">{{ user.createTime }}</div>
              </li>
            </ul>
          </div>
          <div class="btn-wrap">
            <el-button type="primary" size="mini" @click="dialogVisible=true">修改密码</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog v-dialogDrag :close-on-click-modal="false" :modal-append-to-body="false" :title="'修改密码'" :visible.sync="dialogVisible" width="500px" class="dialog">
      <el-form ref="form" :model="userP" :rules="rules" label-width="90px" style="width: 400px; margin-left:20px;">
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input v-model="userP.oldPassword" placeholder="请输入旧密码" type="password" />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="userP.newPassword" placeholder="请输入新密码" type="password" />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="userP.confirmPassword" placeholder="请确认密码" type="password" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="submit">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import userAvatar from './userAvatar'
// import userInfo from './userInfo'
// import resetPwd from './resetPwd'
import { getUserProfile, updateUserPwd } from '@/api/system/user'
import store from '@/store'

export default {
  name: 'Profile',
  // components: { userAvatar, userInfo, resetPwd },
  data() {
    const equalToPassword = (rule, value, callback) => {
      if (this.userP.newPassword !== value) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }
    return {
      user: {},
      activeTab: 'userinfo',
      dialogVisible: false,
      userP: {
        oldPassword: undefined,
        newPassword: undefined,
        confirmPassword: undefined
      },
      // 表单校验
      rules: {
        oldPassword: [
          { required: true, message: '旧密码不能为空', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '新密码不能为空', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '确认密码不能为空', trigger: 'blur' },
          { required: true, validator: equalToPassword, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getUser()
  },
  methods: {
    getUser() {
      getUserProfile().then(response => {
        this.user = response.data
      })
    },
    submit() {
      this.$refs['form'].validate(valid => {
        console.log(this.userP)
        if (valid) {
          updateUserPwd(this.userP.oldPassword, this.userP.newPassword, this.userP.confirmPassword).then(
            response => {
              this.msgSuccess('修改成功')
              store.dispatch('user/resetToken').then(() => {
                location.reload()
              })
            }
          )
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.box-center{
  text-align: center;
}

.list-group-striped > .list-group-item {
  border-left: 0;
  border-right: 0;
  border-radius: 0;
  padding-left: 0;
  padding-right: 0;
}
.list-group {
  padding-left: 0;
  list-style: none;
  margin: 0;
}

.list-group-item {
  border-bottom: 1px solid #e7eaec;
  border-top: 1px solid #e7eaec;
  margin-bottom: -1px;
  padding: 11px 0;
  font-size: 13px;
}

.pull-right {
  float: right !important;
}
.btn-wrap {
  padding-top: 10px;
  display: flex;
  justify-content: flex-end;
}
</style>
