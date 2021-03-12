<template>
  <div class="login-container">
    <!--
      配置form表单验证：
        1. 必须给el-form组件绑定model为表单数据对象
        2. 给需要验证的表单项el-form-item绑定prop属性
          注意：prop属性需要指定表单对象中的数据名称
        3. 通过el-form组件的rules属性配置验证规则
      手动触发验证：
        1. 给el-form设置ref
        2. 通过ref获取el-form组件，调用组件的validate进行验证
    -->
    <el-form :model="user" :rules="formRules" class="login-form" ref="login-form">
      <div class="login-header"></div>
      <el-form-item prop="mobile">
        <el-input placeholder="请输入手机号" v-model="user.mobile"></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input placeholder="请输入验证码" v-model="user.code"></el-input>
      </el-form-item>
      <el-form-item prop="isAgree">
        <el-checkbox v-model="user.isAgree">我已阅读并同意用户协议和隐私条款</el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-button :loading="loginLoading" @click="onLogin" class="login-btn" type="primary">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import { login } from '@/api/user.js'
export default {
  name: 'loginIndex',
  data() {
    return {
      user: {
        mobile: '13911111111',
        code: '246810',
        isAgree: false // 是否同意协议的选中状态
      },
      formRules: {
        // 表单验证规则配置
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          {
            pattern: /^1[35789]\d{9}$/,
            message: '手机号不合法',
            trigger: 'blur'
          }
        ],
        code: [
          { required: true, message: '验证码不能为空', trigger: 'blur' },
          { pattern: /^\d{6}$/, message: '请输入正确的验证码', trigger: 'blur' }
        ],
        isAgree: [
          {
            // 自定义校验规则
            // 验证通过：callback()
            // 验证失败：callback(new Error('错误信息'))
            validator: (rule, value, callback) => {
              console.log(rule)
              if (value) {
                callback()
              } else {
                callback(new Error('请同意用户协议'))
              }
            },
            message: '请同意用户协议',
            trigger: 'change'
          }
        ]
      },
      loginLoading: false
    }
  },
  methods: {
    onLogin() {
      this.$refs['login-form'].validate((valid, err) => {
        if (!valid) {
          return
        }
        // 验证通过，请求登录
        this.login()
      })
    },
    login() {
      // 获取表单数据
      // 表单验证
      // 通过验证,提交登录
      // 处理后端响应结果
      // 开启登录loading, 开启loading后，按钮无法点击
      this.loginLoading = true
      const user = this.user
      // 对于代码中的请求操作
      // 1. 接口请求可能需要重用
      // 2. 实际工作中，接口非常容易变动，改起来麻烦
      // 我们建议的做法把所有的请求封装成函数，然后统一的组织到模块中进行管理
      // 这样做的好处：管理维护更方便，也好重用
      login(user)
        .then((res) => {
          console.log(res)
          this.$message({
            message: '登录成功',
            type: 'success'
          })
          // 关闭loading
          this.loginLoading = false
          // 本地存储只能存储字符串
          // 如果需要存储对象、数组类型的数据，则把他们转为JSON字符串
          window.sessionStorage.setItem('user', JSON.stringify(res.data.data))
          this.$router.push({
            name: 'home'
          })
        })
        .catch((err) => {
          console.log('登录失败', err)
          this.$message({
            message: '手机号或验证码错误',
            type: 'error'
          })
          // 关闭loading
          this.loginLoading = false
        })
    }
  }
}
</script>

<style lang='less' scoped>
.login-container {
  position: fixed;
  left: 0px;
  right: 0px;
  bottom: 0px;
  top: 0px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: url('./login_bg.jpg') no-repeat;
  background-size: cover;
  .login-header {
    height: 57px;
    width: 300px;
    background: url('./logo_index.png') no-repeat center;
    margin-bottom: 20px;
  }
  .login-form {
    background-color: #fff;
    padding: 20px 50px;
    min-width: 300px;
    .login-btn {
      width: 100%;
    }
  }
}
</style>
