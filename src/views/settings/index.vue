<template>
  <div class="settings-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑路径导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ name: 'home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>个人设置</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- /面包屑路径导航 -->
      </div>
      <el-row>
        <el-col :span="15">
          <el-form
            ref="userInfoForm"
            :rules="userInfoRules"
            :model="user"
            label-width="80px"
          >
            <el-form-item label="编号"> {{ user.id }} </el-form-item>
            <el-form-item label="手机"> {{ user.mobile }} </el-form-item>
            <el-form-item label="媒体名称" prop="name">
              <el-input type="textarea" v-model="user.name"></el-input>
            </el-form-item>
            <el-form-item label="媒体介绍" prop="intro">
              <el-input type="textarea" v-model="user.intro"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input type="textarea" v-model="user.email"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onUpdateUser">保存</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="4" :offset="2">
          <label for="file">
            <el-avatar
              shape="square"
              :size="150"
              :src="user.photo"
              fit="cover"
            ></el-avatar>
            <p>点击修改头像</p>
          </label>
          <input
            id="file"
            type="file"
            hidden
            ref="file"
            @change="onFileChange"
          />
        </el-col>
      </el-row>
    </el-card>
    <!-- 修改头像弹框 -->
    <el-dialog
      title="修改头像"
      :visible.sync="dialogVisible"
      width="30%"
      append-to-body
      @opened="onDialogOpen"
      @closed="onDialogClose"
    >
      <div class="preview-image-wrap">
        <img
          ref="preview-image"
          class="preview-image"
          :src="previewImage"
          width="150"
          alt=""
        />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          :loading="updatePhotoLoading"
          type="primary"
          @click="onUpdatePhoto"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- /修改头像弹框 -->
  </div>
</template>

<script>
import { getUserProfile, updateUserPhoto, updateUserProfile } from '@/api/user'
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import globalBus from '@/utils/global-bus'
export default {
  name: 'SettingsIndex',
  data() {
    return {
      dialogVisible: false,
      previewImage: '',
      updatePhotoLoading: false, // 更新头像是否loading
      cropper: null, // 裁切器实例
      userInfoRules: {
        name: [
          { required: true, message: '媒体名称不能为空', trigger: 'blur' },
          { min: 1, max: 7, message: '长度为1~7', trigger: 'blur' }
        ],
        intro: [
          { required: true, message: '媒体介绍不能为空', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          {
            validator: function (rule, value, callback) {
              if (
                !/^[a-z\d]+(\.[a-z\d]+)*@([\da-z](-[\da-z])?)+(\.{1,2}[a-z]+)+$/.test(
                  value
                )
              ) {
                callback(new Error('邮箱输入不合法'))
                return
              }
              callback()
            },
            trigger: 'blur'
          }
        ]
      },
      user: {
        email: '',
        id: null,
        intro: '',
        mobile: '',
        name: '',
        photo: ''
      } // 用户资料
    }
  },
  mounted() {
    this.loadUser()
  },
  methods: {
    onSubmit() {
      console.log('submit!')
    },
    loadUser() {
      getUserProfile().then((res) => {
        this.user = res.data.data
      })
    },
    // 修改头像
    onFileChange() {
      // 处理图片预览
      const file = this.$refs.file
      // 将文件对象转为url
      const blodData = window.URL.createObjectURL(file.files[0])
      this.previewImage = blodData
      // 打开弹窗
      this.dialogVisible = true
      // 展示弹出层，预览用户选择的图片
      // 解决选择相同文件不触发 change 事件问题
      this.$refs.file.value = ''
    },
    // 弹窗完全打开，进行图片裁剪
    onDialogOpen() {
      // 实现图片裁剪
      if (this.cropper) {
        this.cropper.replace(this.previewImage)
        return
      }
      // 图片裁切器必须基于img进行初始化
      // 注意：img必须是可见状态才能完成初始化
      // 对话框打开是一个动画过程，必须在对话框完全打开的状态去初始化图片裁剪
      // 获取图片DOM节点
      const image = this.$refs['preview-image']
      // 第一次初始化以后，如果预览裁切的图片发生了变化，裁切器默认不会更新
      // 如果需要预览图片发生改变：
      //    1. replace
      //    2. 销毁裁切器，重新初始化
      // 初始化裁切器
      this.cropper = new Cropper(image, {
        aspectRatio: 'auto', // 裁剪器比例
        viewMode: 1, // 1：限制裁切框不要超过画布的大小
        dragMode: 'none', // 不可移动画布，什么都不做
        crop(event) {
          // 移动裁切器的时候会触发crop方法
          // console.log(event)
        }
      })
    },
    // 对话框关闭，销毁裁切器
    onDialogClose() {
      // this.cropper && this.cropper.destroy()
    },
    onUpdatePhoto() {
      // 让确定按钮开始loading
      this.updatePhotoLoading = true
      // 获取裁切的图片对象
      this.cropper.getCroppedCanvas().toBlob((file) => {
        const fd = new FormData()
        fd.append('photo', file)
        // 请求更新用户头像 请求提交 fd
        updateUserPhoto(fd).then((res) => {
          // 关闭对话框
          this.dialogVisible = false
          // 更新视图展示
          // 把服务端返回的图片进行展示有点慢
          // this.user.photo = res.data.data.photo
          this.user.photo = window.URL.createObjectURL(file)
          // 发布通知，用户信息已经更改
          globalBus.$emit('update-user', {
            photo: this.user.photo
          })
          // 更新用户头像成功提示
          this.$message({
            type: 'success',
            message: '头像更新成功'
          })
          // 关闭确定按钮的loading
          this.updatePhotoLoading = false
        })
      })
    },
    onUpdateUser() {
      this.$refs.userInfoForm.validate((valid) => {
        if (valid) {
          const { name, intro, email } = this.user
          updateUserProfile({ name, intro, email }).then((res) => {
            // 更新视图
            const { name, intro, email } = res.data.data
            this.user.name = name
            this.user.intro = intro
            this.user.email = email
            this.$message({
              type: 'success',
              message: '保存成功'
            })
            // 发布通知，用户信息已经更改
            globalBus.$emit('update-user', {
              name
            })
          })
          return
        }
        this.$message({
          type: 'error',
          message: '请完善用户信息!'
        })
      })
    }
  }
}
</script>

<style scoped lang="less">
.preview-image-wrap {
  .preview-image {
    display: block;
    max-width: 100%;
    height: 200px;
  }
}
</style>
