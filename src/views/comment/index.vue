<template>
  <div class="comment-contain">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑路径导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ name: 'home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>评论管理</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- /面包屑路径导航 -->
      </div>
      <!--
        1. 把数据列表绑定给表格的data
        2. 设计表格列
        3. 给表格列绑定要渲染的数据字段
       -->
      <el-table class="table-list" :data="articles" stripe style="width: 100%">
        <el-table-column prop="title" label="标题" min-width="180">
        </el-table-column>
        <el-table-column
          prop="total_comment_count"
          label="总评论数"
          width="180"
        >
        </el-table-column>
        <el-table-column prop="fans_comment_count" label="粉丝评论数">
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span>{{ scope.row.comment_status ? '正常' : '关闭' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.comment_status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="onStatusChange(scope.row)"
              :disabled='scope.row.isDisabled'
            >
            </el-switch>
          </template>
        </el-table-column>
      </el-table>
      <!--
        绑定页码
        绑定每页大小
        current-page: 控制激活的页码，初始肯定是第1页
        page-sizes：控制可选的每页大小
        page-size：配置page-sizes中默认选中项
        layout：分页组件布局
       -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="page"
        :page-sizes="[10, 20, 30, 40]"
        :page-size.sync="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
        :disabled='pageDisable'
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getArticles, updateCommentStatus } from '@/api/article'
export default {
  name: 'CommentIndex',
  data() {
    return {
      currentPage4: 4,
      articles: [], // 文章数据列表
      totalCount: 0, // 评论总条数
      pageSize: 10, // 每页显示条数
      page: 1, // 当前激活的页码
      pageDisable: false // 加载数据期间，禁用分页组件
    }
  },
  created() {
    this.loadArticles()
  },
  methods: {
    handleSizeChange() {
      // 当每页大小发生改变时，重新加载第一页数据
      this.loadArticles()
    },
    handleCurrentChange(page) {
      // 页码改变，加载指定页码数据
      this.loadArticles(page)
    },
    loadArticles(page = 1) {
      // 让分页组件激活的页码和请求数据的页码保持一致
      this.page = page
      // 禁用分页组件
      this.pageDisable = true
      getArticles({
        response_type: 'comment',
        page,
        per_page: this.pageSize
      }).then((res) => {
        // 取消分页组件禁用
        this.pageDisable = false
        res.data.data.results.forEach(article => {
          article.isDisabled = false
        })
        this.articles = res.data.data.results
        this.totalCount = res.data.data.total_count
      })
    },
    onStatusChange(article) {
      // 请求后端接口，修改状态
      console.log(article)
      // 禁用开关
      article.isDisabled = true
      updateCommentStatus(article.id.toString(), article.comment_status).then(() => {
        // 启用开关
        article.isDisabled = false
        this.$message({
          type: 'success',
          message: article.comment_status ? '开启评论' : '关闭评论'
        })
      })
    }
  }
}
</script>

<style>
.table-list {
  margin-bottom: 30px;
}
</style>
