<template>
  <el-dialog :visible.sync="dialogVisible" title="拍照" width="80%">
    <el-form-item label="拍摄设备">
      <el-select v-model="deviceId" @change="openCamera" style="width: 100%">
        <el-option
          v-for="(item, index) in devices"
          :key="index"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
    <div class="video-container">
      <video ref="video" playsinline autoplay class="video" />
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button class="submit" @click="dialogVisible = false">取 消</el-button>
      <el-button class="submit" type="primary" @click="handleShoot"
        >确 定</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import { isEmpty } from "lodash-es";
import { dataURLtoFile } from "@/utils/file.js";

export default {
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      deviceId: null,
      devices: [],
      stream: null,
    };
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible;
      },
      set(visible) {
        this.$emit("update:visible", visible);
      },
    },
  },
  watch: {
    dialogVisible(visible) {
      if (visible) this.fetchDevices();
      else this.closeCamera();
    },
  },
  methods: {
    async fetchDevices() {
      if (!navigator.mediaDevices)
        return this.$message.warning("请先信任当前网站!");

      try {
        await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: true,
        });
      } catch (err) {
        return this.$message.warning("请开启摄像头权限!");
      }

      let allDevices = await navigator.mediaDevices.enumerateDevices();

      let videoDevices = (allDevices || []).filter(
        (item) => item.kind === "videoinput" && item.deviceId
      );

      if (isEmpty(videoDevices))
        return this.$message.warning("当前无可用的拍摄设备,请连接设备!");

      this.devices = videoDevices.map((item) => ({
        label: item.label,
        value: item.deviceId,
      }));

      let currentDeviceId = videoDevices[0].deviceId;

      this.deviceId = currentDeviceId;
      this.openCamera(currentDeviceId);
    },
    handleSuccess(stream) {
      this.stream = stream; // make stream available to browser console
      this.$refs["video"].srcObject = stream;
    },
    handleError(error) {
      console.log(
        "navigator.MediaDevices.getUserMedia error: ",
        error.message,
        error.name
      );
    },
    openCamera(deviceId) {
      this.closeCamera();

      navigator.mediaDevices
        .getUserMedia({
          audio: false,
          video: {
            deviceId: { exact: deviceId },
          },
        })
        .then(this.handleSuccess)
        .catch(this.handleError);
    },
    closeCamera() {
      if (this.stream) {
        this.stream.getTracks().forEach((track) => {
          track.stop();
        });
      }
    },
    handleShoot() {
      const video = this.$refs["video"];
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas
        .getContext("2d")
        .drawImage(video, 0, 0, canvas.width, canvas.height);

      let dataURL = canvas.toDataURL("image/png");
      let file = dataURLtoFile(dataURL, "shoot.png");
      this.$emit("handleShoot", file);
      this.dialogVisible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.camera-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.video-container {
  width: 100%;
  .video {
    width: 100%;
    height: 400px;
  }
}
</style>