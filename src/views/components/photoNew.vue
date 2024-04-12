<!--
  拍照上传组件
  兼容PC和android cordova
-->
<template>
  <div class="item-contain">

    <!--在android cordova环境-->
    <template v-if="cordovaValid">
      <div class="img-button">
        <el-button icon="el-icon-camera-solid" type="primary" plain @click="takePhoto2">拍照</el-button>
        <el-button icon="el-icon-picture" type="primary" plain @click="choosePhoto3">选择照片</el-button>
      </div>
    </template>

    <!--在pc环境-->
    <template v-else>
      <el-upload
        ref="upload"
        :accept="accept"
        :action="action"
        :headers="headers"
        :show-file-list="false"
        :on-success="handleSuccess"
        multiple
      >
        <el-button icon="el-icon-camera-solid" type="primary" plain>拍照</el-button>
        <el-button icon="el-icon-picture" type="primary" plain>选择照片</el-button>
      </el-upload>
    </template>

    <div class="img">
      <div class="img-item" v-for="(item,index) in imageList" :key="index">
        <img class="upload-img" :src="item.big_url" :data-large="item.big_url" :key="index"
            @click="preview(index)"/>
        <img src="../../assets/imgs/icon-del.png" alt="删除图标" class="delete-img" :key="item.index"
            @click="remove(index)"/>
      </div>
    </div>

    <el-dialog :visible.sync="previewDialog" title="预览" width="95%">
      <img :src="previewUrl" width="100%"/>
    </el-dialog>
  </div>
</template>

<script>
import * as api from '@/api/photo'
import {getToken} from "@/utils/auth";

export default {
  props: ['value', 'name'],
  components: {},
  data() {
    return {
      imageList: [],
      previewUrl:'',
      previewDialog: false,
      accept: '.png, .jpg, .jpeg',
      action: process.env.BASE_API_FILEHOST + '/file/uploadImage',
      headers: {
        token: getToken()
      },
    }
  },
  computed: {
    cordovaValid() {
      return typeof ImagePicker !== 'undefined'
    }
  },
  created() {
    // if (this.value != null) { this.imageList = this.value }
    // this.imageList = [{thumb_url:"http://47.99.105.168:19095/20191011/1570780954182_5793.jpg",big_url:"http://47.99.105.168:19095/20191011/1570780954182_5793.jpg"},{thumb_url:"http://47.99.105.168:19095/20191011/1570780954182_5793.jpg",big_url:"http://47.99.105.168:19095/20191011/1570780954182_5793.jpg"},{thumb_url:"http://47.99.105.168:19095/20191011/1570780954182_5793.jpg",big_url:"http://47.99.105.168:19095/20191011/1570780954182_5793.jpg"},{thumb_url:"http://47.99.105.168:19095/20191011/1570780954182_5793.jpg",big_url:"http://47.99.105.168:19095/20191011/1570780954182_5793.jpg"},{thumb_url:"http://47.99.105.168:19095/20191011/1570780954182_5793.jpg",big_url:"http://47.99.105.168:19095/20191011/1570780954182_5793.jpg"},{thumb_url:"http://47.99.105.168:19095/20191011/1570780954182_5793.jpg",big_url:"http://47.99.105.168:19095/20191011/1570780954182_5793.jpg"}]
  },
  mounted(){

  },
  methods: {
    takePhoto2() {
      // 文档地址 https://github.com/giantss/cordova-plugin-ImagePicker.git
      ImagePicker.takePhoto(result => {
        if (!result || !result.images) return
        result.images.forEach(({ uri }) => {
          api.upload(uri)
            .then(this.handleSuccess)
            .catch(err => {
              console.log('err', err)
            })
        })
      }, function(err) {
        // alert(err);
      }, {
        quality : 50
      });
    },
    choosePhoto3() {
      ImagePicker.getPictures(result => {
        if (!result || !result.images) return
        result.images.forEach(({ uri }) => {
          api.upload(uri)
            .then(this.handleSuccess)
            .catch(err => {
              console.log('err', err)
            })
        })

      }, function(err) {
        // alert(err);
      }, {
        quality : 50
      });
    },
    handleSuccess(res) {
      // console.log('res', res)
      const imageBaseUrl = process.env.BASE_API_FILEPREVIEW
      this.imageList.push({
        thumb_url: imageBaseUrl + res.data.thumburl,
        big_url: imageBaseUrl + res.data.bigurl
      })
      this.$emit('input', this.imageList)
    },
    preview(index) {
      this.previewUrl = this.imageList[index].big_url
      this.previewDialog = true
    },
    remove(index) {
      this.imageList.splice(index, 1)
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(v) {
        this.imageList = v || []
      }
    }
  }
}
</script>


<style scoped lang="scss">
.item-contain {
  margin-top: 5px;
  background: white;
  .img{
    margin-top: 30px;
    display: flex;
    flex-wrap: wrap;
  }
  .img-button{
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
  }
  .img-item{
    width: 232px;
    height: 232px;
    margin-right: 18px;
    margin-bottom: 18px;
    position: relative;

    .upload-img {
      border-radius: 10px;
      overflow: hidden;
      cursor: pointer;
    }

    .delete-img {
      position: absolute;
      width: 24px;
      height: 24px;
      right: -12px;
      top: -10px;
      cursor: pointer;
    }
  }
}

.upload-img {
  display: block;
  width: 232px;
  height: 232px;
  margin: 0 auto;
  border-radius: 8px;
  object-fit: cover;
  cursor: pointer;
}
</style>
