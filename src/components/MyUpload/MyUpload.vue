<template>
  <div>
    <template v-if="type === 'img'">
      <el-upload
        ref="uploader"
        name="files"
        :class="{hide: images.length >= limit}"
        :action="imgUploadAction"
        :auto-upload="true"
        list-type="picture-card"
        :file-list="images"
        :on-success="handleImgSuccess"
        :on-error="handleImgErr"
        :on-remove="handleImgRemove"
        v-bind="$attrs"
        accept=".jpg,.jpeg,.png"
        :before-upload="handleBeforeUpload"
        :headers="importHeaders"
      >
        <i slot="default" class="el-icon-plus" />
        <div slot="file" slot-scope="{file}">
          <img
            class="el-upload-list__item-thumbnail"
            :src="file.url"
            alt=""
          >
          <span class="el-upload-list__item-actions">
            <span
              class="el-upload-list__item-preview"
              @click="handlePictureCardPreview(file)"
            >
              <i class="el-icon-zoom-in" />
            </span>
            <span
              v-if="!disabled"
              class="el-upload-list__item-delete"
              @click="handleImgRemove(file)"
            >
              <i class="el-icon-delete" />
            </span>
          </span>
        </div>
      </el-upload>
    </template>
    <template v-if="type === 'diy'">
      <el-upload
        ref="uploader"
        :class="{hide: images.length >= limit}"
        :action="imgUploadAction"
        :auto-upload="true"
        :file-list="images"
        :show-file-list="false"
        :on-success="handleImgSuccess"
        :on-error="handleImgErr"
        :on-remove="handleImgRemove"
        v-bind="$attrs"
        accept=".jpg,.jpeg,.png"
        :before-upload="handleBeforeUpload"
      >
        <slot name="diy" />
      </el-upload>
    </template>
    <template v-else-if="type === 'video'">
      <el-upload
        ref="uploader"
        :class="{hide: images.length >= limit}"
        :action="imgUploadAction"
        :auto-upload="true"
        list-type="picture-card"
        :file-list="images"
        :on-success="handleImgSuccess"
        :on-error="handleImgErr"
        :on-remove="handleImgRemove"
        :show-file-list="false"
        v-bind="$attrs"
      >
        <i slot="default" class="el-icon-plus" />
      </el-upload>
      <div v-if="images.length">
        <div v-for="(item, index) in images" :key="item.url" class="el-upload--picture-card upload-video">
          <video :src="item.url" width="100%" height="100%" />
          <div class="el-upload-list__item-actions mask">
            <i class="el-icon-delete" @click="handleVideoRemove(index)" />
          </div>
        </div>
      </div>
    </template>
    <span v-if="type === 'img' && imgType===1" style="color:red;position:relative;top:10px">提示：建议图片宽高比(72*72)，只能上传png,jpg,jpeg的图片且不能超过2M。</span>
    <span v-if="type === 'img' && imgType===2" style="color:red;position:relative;top:10px">提示：建议图片宽高比(132*132)，只能上传png,jpg,jpeg的图片且不能超过2M。</span>
    <span v-if="type === 'img' && imgType===3" style="color:red;position:relative;top:10px">提示：建议图片宽高比(144*172)，只能上传png,jpg,jpeg的图片且不能超过2M。</span>
    <span v-if="type === 'img' && imgType===4" style="color:red;position:relative;top:10px">提示：建议图片宽高比(132*118)，只能上传png,jpg,jpeg的图片且不能超过2M。</span>
    <span v-if="type === 'img' && imgType===5" style="color:red;position:relative;top:10px">提示：建议图片宽高比(344*344)，只能上传png,jpg,jpeg的图片且不能超过2M。</span>
    <el-dialog :visible.sync="dialogVisible" width="800px" append-to-body>
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

// <MyUpload :limit="6" v-model="imgList"/>
export default {
  name: 'MyUpload',
  inheritAttrs: false,
  model: {
    prop: 'imgList',
    event: 'change'
  },
  props: {
    type: {
      type: String,
      default: 'img'// img video diy
    },
    imgList: { // ['url', 'url']
      type: Array,
      default: () => []
    },
    limit: {
      type: Number,
      default: 1
    },
    imgType: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      images: [],
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      importHeaders: {}
    }
  },
  computed: {
    ...mapGetters(['imgUploadAction', 'token', 'sub']),
    imgStringList() {
      return this.images.map(item => item.url)
    }
  },
  watch: {
    // imgList(newList) {
    //   console.log('newList', newList)
    //   this.images = newList.map(item => ({ url: item }))
    // }
  },
  created() {
    this.images = this.imgList.map(item => ({ url: item }))
    this.importHeaders = {
      jwt_token: this.token,
      sub: this.sub
    }
  },
  methods: {
    handleImgSuccess(res, file, fileLIst) {
      setTimeout(() => {
        console.log('res', res)
        this.images.push({ url: res.data[0] })
        console.log('myupload', this.images)
        this.$message.success('上传成功')
        this.$emit('change', this.imgStringList)
      }, 500)
    },
    handleImgErr(file, fileList) {
      fileList.splice(fileList.length - 1, 1)
      this.$message.error('上传失败')
    },
    handleImgRemove(file, fileList) {
      const index = this.images.findIndex(item => item.url === file.url)
      this.images.splice(index, 1)
      this.$emit('change', this.imgStringList)
    },
    handleVideoRemove(index) {
      this.images.splice(index, 1)
      this.$emit('change', this.imgStringList)
    },
    // 上传图片之前
    handleBeforeUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg'
      // if(!isLt2M){
      //   this.$message.error('上传图片大小不能超过2MB!');
      //   return false;
      // }
      if (!isJPG) {
        this.$message.error('上传图片只能是 jpg/png/jpeg 格式!')
        return false
      }
      return isLt2M && isJPG
    },
    // handleRemove(file) {
    //   console.log(file)
    // },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    }
    /* handleDownload(file) {
      console.log(file)
    }*/
  }
}
</script>

<style lang="scss" scoped>
.upload-video {
  position: relative;

  .mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: transparent;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all .3s;

    i {
      color: #fff;
      font-size: 20px;
      display: none;
    }

    &:hover {
      background-color: rgba(0, 0, 0, .5);

      i {
        display: block;
      }
    }
  }
}
</style>
