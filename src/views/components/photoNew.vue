<!--
  拍照上传组件
  兼容PC和android cordova
-->
<template>
  <div class="item-contain">
    <!--在android cordova环境-->
    <template v-if="cordovaValid">
      <div class="img-button">
        <el-button
          icon="el-icon-camera-solid"
          type="primary"
          plain
          @click="takePhoto2"
          >拍照</el-button
        >
        <el-button
          icon="el-icon-picture"
          type="primary"
          plain
          @click="choosePhoto3"
          >选择照片</el-button
        >
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
        <el-button
          icon="el-icon-camera-solid"
          type="primary"
          plain
          @click.stop="openCamera"
          >拍照</el-button
        >
        <el-button icon="el-icon-picture" type="primary" plain
          >选择照片</el-button
        >
      </el-upload>
    </template>

    <div class="img">
      <div class="img-item" v-for="(item, index) in imageList" :key="index">
        <img
          class="upload-img"
          :src="item.big_url"
          :data-large="item.big_url"
          :key="index"
          @click="preview(index)"
        />
        <img
          src="../../assets/imgs/icon-del.png"
          alt="删除图标"
          class="delete-img"
          :key="item.index"
          @click="remove(index)"
        />
      </div>
    </div>

    <el-dialog :visible.sync="previewDialog" title="预览" width="95%">
      <el-button
        class="direction"
        type="text"
        icon="el-icon-refresh-right"
        :disabled="false"
        @click="handleTransformClick"
      />
      <div class="preview">
        <div
          class="btn"
          :style="{
            visibility: selectIndex > 0 ? 'visible' : 'hidden',
          }"
          @click="handlePrev"
        >
          <i class="el-icon-arrow-left"></i>
        </div>
        <div
          ref="imgBox"
          class="img-box"
          :style="{ height: imgBoxHeight ? imgBoxHeight + 'px' : null }"
        >
          <img
            ref="img"
            :style="{
              width: imgWidth ? imgWidth + 'px' : null,
              height: imgHeight ? imgHeight + 'px' : null,
              transform: `rotate(${rotate}deg)`,
            }"
            :src="previewUrl"
          />
          <img ref="imgHidden" class="img-hidden" :src="previewUrl" />
        </div>
        <div
          class="btn"
          :style="{
            visibility:
              selectIndex < imageList.length - 1 ? 'visible' : 'hidden',
          }"
          @click="handleNext"
        >
          <i class="el-icon-arrow-right"></i>
        </div>
      </div>
    </el-dialog>

    <Camera :visible.sync="cameraDialogVisible" @handleShoot="handleShoot" />
  </div>
</template>

<script>
import * as api from "@/api/photo";
import { getToken } from "@/utils/auth";
import url from "url";
import Camera from "@/components/Camera";
import { uploadImage } from "@/api/file";

export default {
  props: ["value", "name", "defaultDirection"],
  components: {
    Camera,
  },
  data() {
    return {
      imageList: [],
      previewUrl: "",
      previewDialog: false,
      accept: ".png, .jpg, .jpeg",
      action: process.env.BASE_API_FILEHOST + "/file/uploadImage",
      headers: {
        token: getToken(),
      },
      cameraDialogVisible: false,
      selectIndex: null,
      direction: null,
      imgBoxHeight: null,
      imgWidth: null,
      imgHeight: null,
      imgClass: "",
      currentDistance: 0,
      rotate: 0,
    };
  },
  computed: {
    cordovaValid() {
      return typeof ImagePicker !== "undefined";
    },
  },
  created() {
    // if (this.value != null) { this.imageList = this.value }
    // this.imageList = [{thumb_url:"http://47.99.105.168:19095/20191011/1570780954182_5793.jpg",big_url:"http://47.99.105.168:19095/20191011/1570780954182_5793.jpg"},{thumb_url:"http://47.99.105.168:19095/20191011/1570780954182_5793.jpg",big_url:"http://47.99.105.168:19095/20191011/1570780954182_5793.jpg"},{thumb_url:"http://47.99.105.168:19095/20191011/1570780954182_5793.jpg",big_url:"http://47.99.105.168:19095/20191011/1570780954182_5793.jpg"},{thumb_url:"http://47.99.105.168:19095/20191011/1570780954182_5793.jpg",big_url:"http://47.99.105.168:19095/20191011/1570780954182_5793.jpg"},{thumb_url:"http://47.99.105.168:19095/20191011/1570780954182_5793.jpg",big_url:"http://47.99.105.168:19095/20191011/1570780954182_5793.jpg"},{thumb_url:"http://47.99.105.168:19095/20191011/1570780954182_5793.jpg",big_url:"http://47.99.105.168:19095/20191011/1570780954182_5793.jpg"}]
  },
  mounted() {},
  methods: {
    takePhoto2() {
      // 文档地址 https://github.com/giantss/cordova-plugin-ImagePicker.git
      ImagePicker.takePhoto(
        (result) => {
          if (!result || !result.images) return;
          result.images.forEach(({ uri }) => {
            api
              .upload(uri)
              .then(this.handleSuccess)
              .catch((err) => {
                console.log("err", err);
              });
          });
        },
        function (err) {
          // alert(err);
        },
        {
          quality: 50,
        }
      );
    },
    choosePhoto3() {
      ImagePicker.getPictures(
        (result) => {
          if (!result || !result.images) return;
          result.images.forEach(({ uri }) => {
            api
              .upload(uri)
              .then(this.handleSuccess)
              .catch((err) => {
                console.log("err", err);
              });
          });
        },
        function (err) {
          // alert(err);
        },
        {
          quality: 50,
        }
      );
    },
    handleSuccess(res) {
      const imageBaseUrl = process.env.BASE_API_FILEPREVIEW;
      this.imageList.push({
        thumb_url: url.resolve(
          imageBaseUrl,
          res.data.thumburl.replace(/^\//, "")
        ),
        big_url: url.resolve(imageBaseUrl, res.data.bigurl.replace(/^\//, "")),
      });
      this.$emit("input", this.imageList);
    },
    preview(index) {
      this.selectIndex = index;
      this.previewUrl = this.imageList[index].big_url;
      this.previewDialog = true;
    },
    remove(index) {
      this.imageList.splice(index, 1);
      this.$emit("input", this.imageList);
    },
    openCamera() {
      this.cameraDialogVisible = true;
    },
    handleShoot(file) {
      let formData = new FormData();
      formData.append("file", file);
      uploadImage(formData)
        .then(this.handleSuccess)
        .catch((err) => {
          console.log("err", err);
        });
    },
    handlePrev() {
      this.selectIndex -= 1;
      this.previewUrl = this.imageList[this.selectIndex].big_url;
    },
    handleNext() {
      this.selectIndex += 1;
      this.previewUrl = this.imageList[this.selectIndex].big_url;
    },
    handleTransformClick() {
      this.rotate = (this.rotate + 90) % 360;
      this.handleDirectionChange();
    },
    handleDirectionChange() {
      const imgRef = this.$refs["imgHidden"];
      const imgBoxRef = this.$refs["imgBox"];
      if (!imgRef || !imgBoxRef) return;
      const width = imgRef.clientWidth;
      const height = imgRef.clientHeight;
      const boxWidth = imgBoxRef.clientWidth;
      const ratio = width > height ? width / height : height / width;
      if (width > height) {
        if (this.rotate == 0 || this.rotate == 180) {
          this.imgBoxHeight = boxWidth / ratio;
          this.imgWidth = boxWidth;
          this.imgHeight = boxWidth / ratio;
        }
        if (this.rotate == 90 || this.rotate == 270) {
          this.imgBoxHeight = boxWidth * ratio;
          this.imgHeight = boxWidth;
          this.imgWidth = boxWidth * ratio;
        }
      }
      if (width < height) {
        if (this.rotate == 0 || this.rotate == 180) {
          this.imgBoxHeight = boxWidth * ratio;
          this.imgWidth = boxWidth;
          this.imgHeight = boxWidth * ratio;
        }
        if (this.rotate == 90 || this.rotate == 270) {
          this.imgBoxHeight = boxWidth / ratio;
          this.imgHeight = boxWidth;
          this.imgWidth = boxWidth / ratio;
        }
      }
    },
    handleTouchmove(event) {
      event.stopPropagation();
      event.preventDefault();
      const touches = event.touches;
      const events = touches[0];
      const events2 = touches[1];
      if (events2)
        this.resize(
          { x: events.pageX, y: events.pageY },
          { x: events2.pageX, y: events2.pageY }
        );
    },
    getDistance(start, stop) {
      return Math.hypot(stop.x - start.x, stop.y - start.y);
    },
    resize(start, stop) {
      const currentVal = this.getDistance(start, stop);
      if (this.currentDistance < currentVal) {
        this.imgWidth = this.imgWidth * 1.1;
        this.imgHeight = this.imgHeight * 1.1;
      } else {
        this.imgWidth = this.imgWidth * 0.9;
        this.imgHeight = this.imgHeight * 0.9;
      }
      this.currentDistance = currentVal;
    },
  },
  watch: {
    value: {
      immediate: true,
      handler(v) {
        this.imageList = v || [];
      },
    },
    previewUrl: {
      handler() {
        this.direction = this.defaultDirection || "horizontal";
        this.$nextTick(() => {
          this.handleDirectionChange();
        });
      },
    },
    previewDialog: {
      handler(val) {
        this.$nextTick(() => {
          const dom = this.$refs["img"];
          if (val)
            dom.addEventListener("touchmove", this.handleTouchmove, {
              passive: false,
            });
          else
            dom.removeEventListener("touchmove", this.handleTouchmove, {
              passive: false,
            });
        });
      },
    },
  },
};
</script>


<style scoped lang="scss">
.item-contain {
  margin-top: 5px;
  background: white;
  .img {
    margin-top: 30px;
    display: flex;
    flex-wrap: wrap;
  }
  .img-button {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
  }
  .img-item {
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

.preview {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .img-box {
    width: calc(100% - 134px);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .btn {
    width: 62px;
    height: 200px;
    border: 1px solid #dcdfe6;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    font-size: 32px;
    z-index: 999;
  }
  .btn:hover {
    border: 1px solid #409eff;
    color: #409eff;
    cursor: pointer;
  }
}

.direction {
  position: absolute;
  top: 30px;
  right: 50px;
}

.rotate {
  transform: rotate(90deg);
}

.img-hidden {
  position: absolute;
  top: -9999px;
  left: -99999px;
}
</style>
