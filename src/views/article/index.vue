<template>
  <div class="article-container">
    <el-card class="box-card filter-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑路径导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ name: 'home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>内容管理</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- /面包屑路径导航 -->
      </div>
      <!-- 表单筛选数据 -->
      <el-form ref="form" :model="form" label-width="40px" size="mini">
        <el-form-item label="特殊资源">
          <el-radio-group v-model="status">
            <!--
              el-radio: 默认把label作为文本和选中后的value值
             -->
            <el-radio :label="null">全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
            <el-radio :label="4">已删除</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道">
          <el-select v-model="channelId" placeholder="请选择活动区域">
            <el-option label="全部" :value="null"></el-option>
            <el-option
              v-for="(channel, index) in channels"
              :key="index"
              :label="channel.name"
              :value="channel.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker
            type="datetimerange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['12:00:00']"
            v-model="rangeDate"
            format="yyyy-MM-DD"
            value-format="yyyy-MM-DD"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <!-- button按钮的click事件有个默认参数，当你没有指定参数的时候，它会默认传递一个没用的数据 -->
          <el-button type="primary" :disabled="loading" @click="loadArticles(1)"
            >查询</el-button
          >
        </el-form-item>
      </el-form>
      <!-- /表单筛选数据 -->
    </el-card>
    <!-- 数据列表 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- 筛选数据总数 -->
        根据筛选条件共查询到 {{ totalCount }} 条结果：
        <!-- /筛选数据总数 -->
      </div>
      <!--
        table表格组件
        1. 把需要展示的列表数据绑定给table组件的data属性
        2. 注意：你不用v-for遍历，它自己会遍历
        3. 设计表格列el-table-column：
           width: 可以设定表格列的宽度
           label: 可以设定列的标题
           prop: 用来设定要渲染的列表项数据字段, 默认只能渲染文本
        4. 表格列默认只能渲染普通文本，如果需要展示其他内容，例如：按钮、图片，那就需要自定义表格列模板
        5. 如果需要自定义表格列模板，则把需要自定义的内容放到template里面，template要声明slot-scope='scope'
        6. 有了自定义列模板，就不需要prop
       -->
      <el-table
        :data="articles"
        style="width: 100%"
        stripe
        size="mini"
        class="list-table"
        v-loading="loading"
      >
        <el-table-column label="封面">
          <template slot-scope="scope">
            <el-image
              style="width: 100px; height: 100px"
              :src="scope.row.cover.images[0]"
              :preview-src-list="scope.row.cover.images"
              fit="cover"
              lazy
            >
              <div slot="placeholder">加载中<span class="dot">...</span></div>
            </el-image>
            <!--
              下面这种情况是运行期间动态改变处理的
              而本地图片必须在打包的时候就存在,否则无法访问(本地资源没有被打包)
            -->
            <!--
              <img :src='scope.row.cover.images[0]' || './no-cover.jpg'
             -->
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题"> </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <!-- <el-tag v-if="scope.row.status == 0" type="warning">
              草稿
            </el-tag>
            <el-tag v-else-if="scope.row.status == 1">
              待审核
            </el-tag>
            <el-tag v-else-if="scope.row.status == 2" type="success">
              审核通过
            </el-tag>
            <el-tag v-else-if="scope.row.status == 3" type="danger">
              审核失败
            </el-tag> -->
            <el-tag :type="articleStatus[scope.row.status].type">
              {{ articleStatus[scope.row.status].text }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="pubdate" label="发布时间"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              circle
              icon="el-icon-edit"
              @click="$router.push(`/publish?id=${scope.row.id}`)"
            ></el-button>
            <el-button
              size="mini"
              type="danger"
              circle
              icon="el-icon-delete"
              @click="onDeleteArticle(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 列表分页 -->
      <el-pagination
        @current-change="onCurrentChange"
        background
        layout="prev, pager, next"
        :disabled="loading"
        :total="totalCount"
        :page-size="pageSize"
        :current-page.sync="page"
      >
      </el-pagination>
      <!-- /列表分页 -->
    </el-card>
    <!-- /数据列表 -->
  </div>
</template>

<script>
import { getArticles, getArticleChannels, deleteArticle } from '@/api/article'
export default {
  name: 'ArticleIndex',
  data() {
    return {
      form: {},
      articles: [],
      articleStatus: [
        { status: 0, type: 'info', text: '草稿' },
        { status: 1, type: '', text: '待审核' },
        { status: 2, type: 'success', text: '审核通过' },
        { status: 3, type: 'warning', text: '审核失败' },
        { status: 4, type: 'danger', text: '已删除' }
      ],
      totalCount: 0, // 文章总数
      pageSize: 10, // 每页文章展示个数
      status: null, // 文章的状态
      channels: [],
      channelId: null, // 查询文章的频道
      rangeDate: [], // 筛选的范围日期
      loading: true,
      page: 1 // 当前页码
    }
  },
  created() {
    this.loadArticles(1)
    this.loadChannels()
  },
  methods: {
    loadArticles(page = 1) {
      // 开启loading效果
      this.loading = true
      getArticles({
        page,
        per_page: this.pageSize,
        status: this.status, // 查询文章状态，不传就是全部
        channel_id: this.channelId, // 查询文章的频道，
        // 日期清空后，this.rangeDate会被置为null
        begin_pudate: this.rangeDate ? this.rangeDate[0] : null, // 开始日期
        end_pudate: this.rangeDate ? this.rangeDate[1] : null // 结束日期
      })
        .then((res) => {
          const { results, total_count: totalCount } = res.data.data
          console.log(res.data.data)
          this.articles = results
          this.totalCount = totalCount
          // 关闭loading效果
          this.loading = false
        })
        .catch((err) => {
          if (err) {
            console.log('文章列表获取失败')
          }
          this.loading = false
        })
    },
    // 页面切换，
    onCurrentChange(page) {
      this.loadArticles(page)
    },
    loadChannels() {
      getArticleChannels().then((res) => {
        this.channels = res.data.data.channels
        console.log(this.channels)
      })
    },
    // 文章删除
    /**
     * 文章删除的原因：axios为了方便，它会在内部把原始的json格式字符串转为js对象，返回给我们使用
     *                导致id超出整数安全访问
     * 解决：npm i json-bigint：把超出js安全整数范围的数字转为一种类型为 BigNumber对象
     *      我们在使用的时候，需要BigNumber.toString()就能得到原来正确的数据了
     *      例如：JSONBigInt.parse(str).id.toString()
     */
    onDeleteArticle(articleId) {
      // 找到数据接口
      // 封装请求方法
      // 删除请求调用
      // 处理响应结果
      this.$confirm('确定删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          console.log(articleId.toString())
          deleteArticle(articleId.toString())
            .then(() => {
              // 文章删除成功
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              // 更新当前页的数据列表
              this.loadArticles(this.page)
            })
            .catch(() => {
              this.$message({
                type: 'error',
                message: '删除失败!'
              })
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消删除'
          })
        })
    }
  }
}
</script>

<style>
.filter-card {
  margin-bottom: 30px;
}
.list-table {
  margin-bottom: 20px;
}
.article-cover {
  width: 100px;
  background-size: cover;
}
</style>
