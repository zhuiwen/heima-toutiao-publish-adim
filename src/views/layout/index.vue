<template>
  <el-container class="layout-container">
    <!-- 侧边导航栏 -->
    <el-aside :width="isCollapse ? 'auto' : '200px'" class="aside">
      <app-aside :is-collapse="isCollapse" class="aside-menu" />
    </el-aside>
    <el-container>
      <el-header class="header">
        <div class="header-title">
          <i
            :class="{
              'el-icon-s-fold': isCollapse,
              'el-icon-s-unfold': !isCollapse
            }"
            @click="isCollapse = !isCollapse"
          ></i>
          <span>江苏传智播客科技教育有限公司</span>
        </div>
        <el-dropdown>
          <div class="avatar-wrap">
            <img :src="user.photo" alt class="avatar" />
            <span>{{ user.name }}</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>设置</el-dropdown-item>
            <!-- 组件默认是不识别原生事件的，除非内部做了处理 -->
            <el-dropdown-item @click.native="onLogout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-main class="main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script type="text/ecmascript-6">
import AppAside from './components/aside'
import { getUserProfile } from '@/api/user'
import globalBus from '@/utils/global-bus'
export default {
  name: 'layoutIndex',
  data() {
    return {
      user: { // 用户信息
        name: '', // 用户名
        photo: '' // 头像
      },
      // 侧边状态栏是否展开
      isCollapse: false
    }
  },
  methods: {
    loadUserProfile() {
      getUserProfile()
        .then((res) => {
          console.log(1111)
          this.user = res.data.data
          console.log(this.user)
        })
        .catch((error) => {
          console.log('获取用户信息失败', error)
        })
    },
    onLogout() {
      this.$confirm('确定退出登录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '退出成功!'
          })
          // 把用户的登录状态清除
          window.sessionStorage.removeItem('user')
          // 跳转到登录页面
          this.$router.replace('/login')
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消退出'
          })
        })
    }
  },
  mounted() {
    this.loadUserProfile()
    // 当这个事件发布以后，这个注册函数就会被调用到
    globalBus.$on('update-user', info => {
      // 注意this.user = info，不要这么做，对象之间赋值的是引用，会导致相互影响的问题
      info.name && (this.user.name = info.name)
      info.photo && (this.user.photo = info.photo)
    })
  },
  components: {
    AppAside
  }
}
</script>

<style lang='less' scoped>
.layout-container {
  height: 100%;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  .header {
    display: flex;
    border-bottom: 1px solid #ccc;
    justify-content: space-between;
    align-items: center;
    .header-title {
      cursor: pointer;
      i {
        font-size: 20px;
      }
    }
    .avatar-wrap {
      display: flex;
      align-items: center;
      cursor: pointer;
      .avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-right: 10px;
      }
    }
  }
  .aside {
    background-color: #d3dce6;
    /deep/.aside-menu {
      height: 100%;
      overflow: hidden;
      .nav-menu {
        height: 100%;
      }
    }
  }
  .main {
    background-color: #e9eef3;
  }
}
</style>
