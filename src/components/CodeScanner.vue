<!--
 组件名: 扫码组件
  1.使用防抖响应input事件
  2.回调事件是: 'has-done'
-->
<template>
  <div class="code-sanner">
    <!--   @change	仅在输入框失去焦点或用户按下回车时触发   -->
    <el-input
      v-model.trim="codeText"
      :disabled="disabled"
      :placeholder="placeholder"
      v-on="$listeners"
      class="scan-input"
      @change="emitHasDone"
      @clear="emitClear"
    >
      <i
        v-show="codeText"
        slot="suffix"
        class="el-input__icon el-icon-circle-close"
        @click="handleClear"
      />
    </el-input>
    <el-button type="primary" size="mini" @click="sweepCode">
      <div style="display: flex">
        <svg-icon icon-class="scan" style="width: 20px; height: 20px" />
        <div style="font-size: 20px; line-height: 22px; margin: 0 5px">
          {{ label }}
        </div>
      </div>
    </el-button>
  </div>
</template>

<script>
import { debounce } from "@/utils";

export default {
  name: "CodeScanner",
  props: {
    value: {
      required: true,
      type: String | undefined | null,
    },
    placeholder: {
      default: "请扫码",
      type: String,
    },
    label: {
      default: "扫码",
      type: String,
    },
    disabled: {
      default: false,
      type: Boolean,
    },
  },
  computed: {
    codeText: {
      get() {
        return (this.value || "").trim();
      },
      set(val) {
        this.$emit("input", (val || "").trim());
      },
    },
  },
  created() {
    this.debounceInput = debounce(this.emitHasDone, 1000);
  },
  beforeDestory() {
    this.debounceInput = null;
  },
  methods: {
    sweepCode() {
      try {
        cordova.plugins.gizscanqrcode.scan(
          {
            baseColor: "#4e8dec", // (边框、按钮、导航栏等背景颜色，优先级最低，单独设置可覆盖)

            // bar
            title: "扫码", // (标题文字)
            barColor: "4e8dec", // (导航栏颜色)
            statusBarColor: "white", // (状态栏字体颜色 white为白，不填为默认)

            // describe string
            describe: "扫二维码/条码", // (提示用户文字，支持 \n 换行，多行文字需注意小屏幕设备适配问题)
            describeFontSize: "15", // (字体大小)
            describeLineSpacing: "8", // (行间距)
            describeColor: "ffffff", // (文字颜色)

            // scan border
            borderColor: "4e8dec", // (扫描框颜色)
            borderScale: "0.6", // (边框大小，0.1 ~ 1)

            // choose photo button
            choosePhotoEnable: "true", // (支持相册选取, 默认false)
            choosePhotoBtnTitle: "相册", // (选取按钮文字)
            choosePhotoBtnColor: "4e8dec", // (选取按钮颜色)

            // flashlight
            flashlightEnable: "false", // (支持手电筒, 默认false)
          },
          (res) => {
            /*
              * callback:
              {"resultCode": "Int",//(0: unknown; 1: success; 2: error; 3: cancel)
               "result": "String" //( QR code(success); reason(error); cancel(cancel) )
              }
              * */
            const { resultCode, result } = JSON.parse(res);
            // alert(typeof resultCode)
            // alert(resultCode)
            if (resultCode === 1) {
              this.codeText = result;
              this.emitHasDone(codeText);
            } else {
              this.$message.info("请重新扫码!");
            }
          },
          (error) => {
            console.log(error); // 原因
            this.$message.info("请在客户端使用扫码功能");
            // alert(JSON.stringify(error))
          }
        );
      } catch (e) {
        console.log("请在客户端使用", e);
      }
    },
    handleClear() {
      this.codeText = "";
      this.emitClear();
    },
    emitHasDone(val) {
      this.$emit("has-done", val);
    },
    emitClear() {
      this.$emit("clear");
    },
  },
};
</script>

<style lang="scss" scoped>
.code-sanner {
  display: flex;
  gap: 16px;
}
.scanClearStyle {
  width: 16px;
  height: 20px;
  object-fit: contain;
  position: absolute;
  left: -21px;
}
.scanImgStyle {
  width: 50px;
  height: 22px;
  object-fit: contain;
}
.scan-input /deep/ {
  .el-input-group__append {
    padding-left: 0;
  }
  input {
    padding: 0 8px;
  }
}
.scan-input >>> .el-input-group__append {
  display: inline-flexbox;
  padding: 0px;
  align-items: center;
  justify-content: start;
  width: 50px;
  background-color: #fff;
}
</style>
