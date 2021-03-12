<template>
  <div class="publish-contain">
    <el-card class="box-card filter-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑路径导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ name: 'home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>发布文章</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- /面包屑路径导航 -->
      </div>
      <el-form
        :model="article"
        ref="publish-form"
        label-width="60px"
        :rules="formRules"
        class="demo-ruleForm"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="article.title"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <!-- <el-input type="textarea" v-model="article.content"></el-input> -->
          <el-tiptap
            v-model="article.content"
            :extensions="extensions"
            height="350"
            placeholder="请输入文章内容"
          ></el-tiptap>
        </el-form-item>
        <el-form-item label="封面">
          <el-radio-group v-model="article.cover.type">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
          <!--
              当你给事件处理函数传递了自定义参数以后，就无法得到原本的那个数据参数了
              如果想要在事件处理函数自定义传参以后还想得到原来的那个事件本身的参数，
              则手动指定$event，它就代表事件本身的参数
           -->
          <!--
             当你给子组件提供的数据既要使用，还要修改，这个时候，我们可以使用v-model简化数据绑定
             v-model="article.cover.images[index]"相当于：
              1. :Value='article.cover.images[index]' -> 给子组件传递了一个名字叫value的数据
              2. @input='article.cover.images[index] = "事件参数"' -> 默认监听input事件，当事件发生，他会让绑定数据=事件参数
              注意：v-model仅仅是简写了而已，本质还是父子组件通信
            -->
          <!-- <template v-if="article.cover.type > 0">
            <upload-cover
              v-for="(cover, index) in article.cover.type"
              :key="cover"
              :cover-image='article.cover.images[index]'
              @update-cover='onUpdateCover(index, $event)'
            ></upload-cover>
          </template> -->
          <template v-if="article.cover.type > 0">
            <div class="upload-cover-wrap">
              <upload-cover
                v-for="(cover, index) in article.cover.type"
                :key="cover"
                :cover-image="article.cover.images[index]"
                @update-cover="onUpdateCover(index, $event)"
                v-model="article.cover.images[index]"
              ></upload-cover>
            </div>
          </template>
        </el-form-item>
        <el-form-item label="频道" prop="channel_id">
          <el-select v-model="article.channel_id" placeholder="请选择频道">
            <el-option
              v-for="(channel, index) in channels"
              :key="index"
              :label="channel.name"
              :value="channel.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onPublish(false)">{{
            $route.query.id ? '修改文章' : '发布文章'
          }}</el-button>
          <el-button @click="onPublish(true)">存入草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import Vue from 'vue'
import UploadCover from './components/upload-cover.vue'
import {
  getArticleChannels,
  addArticle,
  getArticle,
  updateArticle
} from '@/api/article'
import { uploadImage } from '@/api/image'
import {
  ElementTiptapPlugin,
  Doc,
  Text,
  Paragraph,
  Heading,
  Bold,
  Underline,
  Italic,
  Strike,
  ListItem,
  BulletList,
  OrderedList,
  TodoItem,
  TodoList,
  Fullscreen,
  Image,
  Preview,
  TextColor
} from 'element-tiptap'
import 'element-tiptap/lib/index.css'
// 安装 element-tiptap 插件
Vue.use(ElementTiptapPlugin, { /* 插件配置项 */ lang: 'zh' })
export default {
  name: 'PublishIndex',
  data() {
    return {
      channels: [], // 文章频道
      extensions: [
        new Doc(),
        new Text(),
        new Paragraph(),
        new Heading({ level: 5 }),
        new Bold({ bubble: true }),
        new Underline(),
        new Italic(),
        new Strike(),
        new ListItem(),
        new BulletList(), // 无序
        new OrderedList(), // 有序
        new TodoItem(),
        new TodoList(),
        new Fullscreen(),
        new Image({
          // 默认会把图片生产base64字符串和内容存储在一起，
          // 如果需要自定义图片上传
          uploadRequest: async (file) => {
            // 如果接口要求Content-Type是multipart/form-data, 则必须使用FormData
            const fd = new FormData()
            fd.append('image', file)
            return uploadImage(fd).then((res) => {
              return res.data.data.url
            })
          }
        }),
        new Preview(),
        new TextColor()
      ],
      article: {
        title: '', // 文章标题
        content: '', // 文章内容
        channel_id: 1,
        cover: {
          // 文章封面
          type: 0, // 封面类型 -1：自动，0：无图，1：1张，3：3张
          images: [] // 封面图片的地址
        }
      },
      formRules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { min: 5, max: 30, message: '标题5~30个字符', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请填写文章内容' },
          {
            validator(rule, value, callback) {
              console.log(value, 111)
              if (value === '<p></p>' || value === '') {
                // 验证失败
                callback(new Error('请输入文章内容'))
              } else {
                // 验证通过
                callback()
              }
            }
          }
        ],
        channel_id: [{ required: true, message: '请选择文章频道' }]
      }
    }
  },
  components: {
    UploadCover
  },
  methods: {
    onPublish(draft) {
      // 如果是修改文章，则执行修改操作，否则执行添加操作
      this.$refs['publish-form'].validate((valid) => {
        if (!valid) {
          // 验证失败，停止提交表单
          return
        }
        const articleId = this.$route.query.id
        if (articleId) {
          // 执行修改操作
          updateArticle(articleId, this.article, draft)
            .then(() => {
              this.$message({
                type: 'success',
                message: '文章修改成功!'
              })
              // 清空文章信息
              this.resetArticle()
            })
            .catch(() => {
              this.$message({
                type: 'error',
                message: '文章发布失败!'
              })
            })
        } else {
          // 执行添加操作
          addArticle(this.article, draft)
            .then((res) => {
              this.$message({
                type: 'success',
                message: draft ? '存入草稿成功!' : '文章发布成功'
              })
              console.log(res)
              // 清空文章信息
              this.resetArticle()
            })
            .catch(() => {
              this.$message({
                type: 'error',
                message: '文章发布失败!'
              })
            })
        }
      })
    },
    resetArticle() {
      this.article = {
        title: '',
        content: '',
        channel_id: null,
        cover: {
          type: 0,
          images: []
        }
      }
    },
    loadChannels() {
      getArticleChannels().then((res) => {
        this.channels = res.data.data.channels
      })
    },
    // 修改文章：加载文章内容
    loadArticle() {
      // 找到数据接口
      // 封装请求方法
      // 请求获取数据
      // 模板绑定展示
      getArticle(this.$route.query.id).then((res) => {
        console.log('文章', res)
        this.article = res.data.data
      })
    },
    onUpdateCover(index, url) {
      this.article.cover.images[index] = url
    }
  },
  mounted() {
    this.loadChannels()
    // 由于我[.们让发布和修改使用的是同一个组件
    // 所以这里还要判断
    // 如果由于路径参数id，则请求展示文章内容
    if (this.$route.query.id) {
      this.loadArticle()
    }
  }
}
</script>

<style>
.upload-cover-wrap {
  display: flex;
  justify-content: space-between;
  width: 600px;
}
</style>
