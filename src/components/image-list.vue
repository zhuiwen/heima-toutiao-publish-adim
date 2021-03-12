<template>
  <div class="image-list">
    <div class="action-head" style="padding-bottom: 20px">
      <el-radio-group v-model="collect" @change="onCollectChange">
        <el-radio-button label="false">全部</el-radio-button>
        <el-radio-button label="true">收藏</el-radio-button>
      </el-radio-group>
      <el-button
        v-if="isShowAdd"
        size="mini"
        type="success"
        @click="dialogUploadVisible = true"
        >素材上传</el-button
      >
    </div>
    <!-- 素材列表 -->
    <el-row :gutter="24">
      <el-col
        :lg="4"
        :md="6"
        :sm="8"
        :xs="12"
        v-for="(img, index) in images"
        :key="index"
        class="col-img"
        @click.native="selected = index"
      >
        <el-image
          style="height: 150px"
          :src="img.url"
          :fit="fits[0]"
        ></el-image>
        <div class="selected" v-if="isShowSelected && selected === index"></div>
        <div class="opt-img" v-if="isShowAction">
          <el-button
            type="warning"
            size="small"
            circle
            :icon="img.is_collected ? 'el-icon-star-on' : 'el-icon-star-off'"
            @click="onCollect(img)"
            :loading="img.loading"
          ></el-button>
          <el-button
            type="danger"
            size="small"
            circle
            icon="el-icon-delete-solid"
            @click="onDelete(img)"
            :loading="img.loading"
          ></el-button>
        </div>
      </el-col>
    </el-row>
    <!-- /素材列表 -->
    <!-- 素材分页 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :page-size="per_page"
      :current-page.sync="page"
      :total="totalCount"
      :disabled="loading"
      @current-change="onPageChange"
    >
    </el-pagination>
    <!-- /素材分页 -->
    <!-- 弹出框 -->
    <el-dialog
      title="上传素材"
      :append-to-body="true"
      :visible.sync="dialogUploadVisible"
    >
      <!--
      upload组件本身就支持提交上传操作，不要手动发上传请求
      请求方法：默认是post
      请求路径：action, 必须写完整路径
     -->
      <el-upload
        v-if="dialogUploadVisible"
        class="upload-demo"
        drag
        action="http://api-toutiao-web.itheima.net/mp/v1_0/user/images"
        multiple
        :headers="uploadHeaders"
        name="image"
        :show-file-list="false"
        :on-success="onUploadSuccess"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">
          只能上传jpg/png文件，且不超过500kb
        </div>
      </el-upload>
    </el-dialog>
    <!-- /弹出框 -->
  </div>
</template>

<script>
import { getImages, collectImage, deleteImage } from '@/api/image'
export default {
  name: 'ImageList',
  data() {
    const user = JSON.parse(window.sessionStorage.getItem('user'))
    return {
      selected: null, // 被选中图片的索引
      radio1: '全部',
      fits: ['fill', 'contain', 'cover', 'none', 'scale-down'],
      images: [],
      collect: false, // 是否筛选收藏图片
      dialogUploadVisible: false, // 是否打开上传素材弹框
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      uploadHeaders: {
        Authorization: `Bearer ${user.token}`
      },
      totalCount: 0, // 总条数
      per_page: 20, // 每页显示的图片个数
      page: 1,
      loading: false // 分页按钮loading效果
    }
  },
  // 使用对象的方式定义prop，更严谨，功能更丰富，强烈建议项目中使用
  props: {
    // 是否显示添加素材
    isShowAdd: {
      type: Boolean,
      default: true
    },
    // 是否显示图片的收藏和删除操作
    isShowAction: {
      type: Boolean,
      default: true
    },
    isShowSelected: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    this.loadImages()
  },
  methods: {
    loadImages(page = 1) {
      // 重置高亮页码，防止页码和数据不对应
      this.page = page
      // 开启分页loading
      this.loading = true
      getImages({
        collect: this.collect,
        page,
        per_page: this.per_page
      }).then((res) => {
        console.log(res)
        this.images = res.data.data.results
        // 关闭分页loading
        this.loading = false
        this.images.forEach((img) => {
          // img对象本来没有loading数据
          // 我们这里手动往里面添加该数据，用来控制每个收藏按钮的loading状态
          img.loading = false
        })
        this.totalCount = res.data.data.total_count
      })
    },
    selectImg() {
      console.log(1)
    },
    onCollectChange() {
      this.loadImages(1)
    },
    onUploadSuccess() {
      // 关闭对话框
      this.dialogUploadVisible = false
      this.$message({
        type: 'success',
        message: '上传成功'
      })
      // 更新素材列表
      this.loadImages(1)
    },
    onPageChange(page) {
      this.loadImages(page)
    },
    // 收藏素材
    onCollect(img) {
      // 已收藏，取消收藏
      // 没有收藏，添加收藏
      img.loading = true // 开启收藏loading效果
      collectImage(img.id, !img.is_collected).then(() => {
        console.log(img.is_collected)
        this.$message({
          type: 'success',
          message: img.is_collected ? '取消收藏' : '收藏成功'
        })
        img.is_collected = !img.is_collected
        // 关闭收藏loading效果
        img.loading = false
        // 如果是筛选收藏且是取消收藏，更新素材列表
        if (this.collect && !img.is_collected) {
          this.loadImages(1)
        }
      })
    },
    // 删除删除
    onDelete(img) {
      // 开启loading效果
      img.loading = true
      deleteImage(img.id).then(() => {
        // 关闭loading效果
        img.loading = false
        // 删除成功后，更新素材列表
        this.loadImages(this.page)
        this.$message({
          type: 'success',
          message: '删除成功'
        })
      })
    }
  }
}
</script>

<style scoped lang='less'>
.col-img {
  padding-bottom: 20px;
  position: relative;
}
.col-img > .opt-img {
  position: absolute;
  left: 11px;
  right: 11px;
  height: 40px;
  background-color: rgba(200, 200, 200, 0.5);
  bottom: 24px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.col-img > .opt-img > .el-button {
  color: #fff;
}
.col-img > .opt-img > .el-button.el-icon-star-on {
  color: yellow;
}
.action-head {
  display: flex;
  justify-content: space-between;
}
.action-head .el-button {
  border-radius: 5px;
}
.el-image {
  width: 100%;
}

.selected {
  background: url('./selected.png') no-repeat center;
  background-size: 80%;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  opacity: 0.8;
}
</style>
