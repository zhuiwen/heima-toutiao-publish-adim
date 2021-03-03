<template>
  <!-- el-menu-item的index不能重复 -->
  <div>
    <el-menu
      active-text-color="#fed45a"
      background-color="rgb(0, 30, 52)"
      default-active="/"
      router
      class="nav-menu"
      :collapse="isCollapse"
      text-color="#fff"
    >
      <div class="nav-logo"></div>
      <el-menu-item index="/">
        <template slot="title">
          <i class="el-icon-s-home"></i>
          <span>首页</span>
        </template>
      </el-menu-item>
      <el-menu-item index="/article">
        <i class="el-icon-document"></i>
        <span slot="title">内容管理</span>
      </el-menu-item>
      <el-menu-item index="/image">
        <i class="iconfont iconimage"></i>
        <span slot="title">素材管理</span>
      </el-menu-item>
      <el-menu-item index="/publish">
        <i class="iconfont iconpublish"></i>
        <span slot="title">发布文章</span>
      </el-menu-item>
      <el-menu-item index="/comment">
        <i class="iconfont iconcomment"></i>
        <span slot="title">评论管理</span>
      </el-menu-item>
      <el-menu-item index="/fans">
        <i class="el-icon-setting"></i>
        <span slot="title">粉丝管理</span>
      </el-menu-item>
      <el-menu-item index="/settings">
        <i class="el-icon-setting"></i>
        <span slot="title">个人设置</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'Aside',
  data() {
    return {}
  },
  props: ['is-collapse'],
  methods: {}
}
</script>

<style lang='less' scoped>
.nav-logo {
  width: 99.5%;
  height: 40px;
  padding-top: 15px;
  background: url('./logo_admin.png') rgb(0, 30, 52) no-repeat 20px;
  background-clip: padding-box;
}
.nav-menu {
  .iconfont {
    margin-right: 10px;
    padding-left: 5px;
  }
}
</style>
