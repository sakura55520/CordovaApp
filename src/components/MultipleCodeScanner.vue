<!--
 组件名: 多项扫码组件
-->
<template>
  <div class="code-sanner">
    <el-select
      ref="multipleCodeSanner"
      v-model="codes"
      multiple
      :disabled="disabled"
      :placeholder="placeholder"
      value-key="id"
      class="scan-select"
      filterable
    >
      <el-option
        v-for="item in codes"
        :label="`${item.materialTypeName}：${item.materialCode}(${item.qty}${unit})`"
        :key="item.id"
        :value="item"
      ></el-option>
    </el-select>
    <el-button type="primary" size="mini" @click="sweepCode">
      <div style="display: flex">
        <svg-icon icon-class="scan" style="width: 20px; height: 20px" />
        <div style="font-size: 20px; line-height: 22px; margin: 0 5px">
          {{ label }}
        </div>
      </div>
    </el-button>
    <el-dialog :visible.sync="inputDialog" title="请输入编码" width="60%">
      <el-input v-model="input" placeholder="请输入编码"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button class="submit" @click="inputDialog = false">取 消</el-button>
        <el-button class="submit" type="primary" @click="handleConfirm"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as Api from "@/api/inStation";

export default {
  name: "CodeScanner",
  props: {
    value: {
      required: true,
      type: Array | undefined | null,
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
    valueKey: {
      type: String,
    },
    type: {
      required: true,
      type: String,
    },
    unit: Number,
  },
  data() {
    return {
      codes: this.value,
      inputDialog: false,
      input: null,
    };
  },
  methods: {
    sweepCode() {
      let isApp = /Android|webOS|iPhone|iPod|BlackBerry/i.test(
        navigator.userAgent
      );
      if (isApp) {
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
                Api.findByCode({ code: result }).then((res) => {
                  if (res.data && res.data.materialTypeName === this.type) {
                    if (
                      this.codes.some((item) => item.code === res.data.code)
                    ) {
                      this.$message.warning(
                        `物料的唯一码[${res.data.code}]重复`
                      );
                    } else {
                      this.codes.push(res.data);
                      this.inputDialog = false;
                    }
                  } else {
                    this.$message.warning(
                      `该物料编号的物料类型不是${this.type}`
                    );
                  }
                });
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
      } else {
        this.inputDialog = true;
        this.input = null;
      }
    },
    handleConfirm() {
      Api.findByCode({ code: this.input }).then((res) => {
        if (res.data && res.data.materialTypeName === this.type) {
          if (this.codes.some((item) => item.code === res.data.code)) {
            this.$message.warning(`物料的唯一码[${res.data.code}]重复`);
          } else {
            this.codes.push(res.data);
            this.inputDialog = false;
          }
        } else {
          this.$message.warning(`该物料编号的物料类型不是${this.type}`);
        }
      });
    },
  },
  watch: {
    codes(val) {
      this.$emit("input", val); // 实现父子组件间的值传递 this.$emit(事件,值)  （这里的input：v-model是一个语法糖，等于:value+@input）
    },
  },
};
</script>

<style lang="scss" scoped>
.code-sanner {
  display: flex;
  gap: 16px;
  width: 100%;
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
.dialog-footer {
  display: flex;
  justify-content: end;
}
</style>
