<template>
  <div class="upload-cover" @click="showCoverSelect">
    <div class="cover-wrap">
      <img class="cover-img" ref="cover-img" :src="value" alt="" />
    </div>
    <el-dialog
      title="选择封面"
      :visible.sync="dialogVisible"
      width="50%"
      append-to-body
    >
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="素材库" name="sucai">
          <!--
            ref 有两个作用：
            1、作用到普通html标签上可以获取DOM
            2、作用到组件上可以获取组件
           -->
          <image-list
            :is-show-add="false"
            :is-show-action="false"
            is-show-selected
            class="sucai-list"
            ref='image-list'
          ></image-list>
        </el-tab-pane>
        <el-tab-pane label="上传图片" name="uploadImage">
          <input type="file" ref="file" @change="onFileChange" />
          <img
            src=""
            class="preview-image"
            ref="preview-image"
            width="100"
            alt=""
          />
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onCoverConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { uploadImage } from '@/api/image'
import ImageList from '@/components/image-list.vue'
export default {
  name: 'UploadCover',
  data() {
    return {
      dialogVisible: false,
      activeName: 'sucai'
    }
  },
  props: ['value'],
  components: {
    ImageList
  },
  methods: {
    showCoverSelect() {
      this.dialogVisible = true
    },
    onFileChange() {
      // 获取文件对象
      const file = this.$refs.file.files[0]
      // 图片预览
      const blob = window.URL.createObjectURL(file)
      this.$refs['preview-image'].src = blob
    },
    onCoverConfirm() {
      // 如果tab是上传图片，并且input-file有选择的文件，才执行上传图片的操作
      if (this.activeName === 'uploadImage') {
        const file = this.$refs.file.files[0]
        if (!file) {
          this.$message({
            type: 'info',
            message: '请选择上传图片'
          })
          return
        }
        // 执行上传文件的操作
        const fd = new FormData()
        fd.append('image', file)
        uploadImage(fd).then((res) => {
          this.$message({
            type: 'success',
            message: '图片上传成功'
          })
          // 防止用户选择同一个图片不触发change事件
          this.$refs.file.value = ''
          // 关闭弹窗
          this.dialogVisible = false
          // 展示上传图片
          // this.$refs['cover-img'].src = res.data.data.url
          // 将图片地址发送给父组件
          this.$emit('input', res.data.data.url)
        })
      } else if (this.activeName === 'sucai') {
        // 还有一种组件通信方式：父组件可以直接访问子组件中的数据
        const imageList = this.$refs['image-list']
        const selected = imageList.selected
        if (selected === null) {
          this.$message('请选择封面图片')
          return
        }
        // 关闭对话框
        this.dialogVisible = false
        // 修改父组件
        this.$emit('input', imageList.images[selected].url)
      }
    }
  }
}
</script>

<style scoped lang='less'>
.cover-wrap {
  width: 180px;
  height: 180px;
  border: 1px solid #ccc;
  overflow: hidden;
  background: url('./pic_bg.png') 100% 100% no-repeat;
  .cover-img {
    height: 180px;
    min-width: 100%;
  }
}
.preview-image {
  display: block;
}
</style>
