<template>
  <div class="image-container">
    <el-card class="box-card filter-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑路径导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ name: 'home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>素材管理</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- /面包屑路径导航 -->
      </div>
      <imageList />
    </el-card>
  </div>
</template>

<script>
import imageList from '@/components/image-list.vue'
export default {
  name: 'ImageIndex',
  components: {
    imageList
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {}
}
</script>

<style scoped lang='less'>
</style>
