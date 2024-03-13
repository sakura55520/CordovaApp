<!-- 晶体厚度-画板 -->
<template>
  <el-dialog :visible.sync="dialogFormVisible" title="晶体厚度-画板" width="640px" top="5vh" destroy-on-close :before-close="colseDialog">
    <div class="th-wrap">
      <canvas id="canvas-thickness" ref="canvas"/>

      <div class="th-modal">
        <el-input-number v-model="form.numTop" :min="0" :controls="false" class="num-top" placeholder="请输入" @focus="$event.target.select()" @blur="addTop"/>
        <el-input-number v-model="form.numRight" :min="0" :controls="false" class="num-right" placeholder="请输入" @focus="$event.target.select()" @blur="addRight"/>
        <el-input-number v-model="form.numBottom" :min="0" :controls="false" class="num-bottom" placeholder="请输入" @focus="$event.target.select()" @blur="addBottom"/>
        <el-input-number v-model="form.numLeft" :min="0" :controls="false" class="num-left" placeholder="请输入" @focus="$event.target.select()" @blur="addLeft"/>
      </div>

    </div>

    <div slot="footer">
      <el-button @click="colseDialog">取 消</el-button>
      <el-button type="primary" @click="saveFromJson">确 定</el-button>
  </div>
  </el-dialog>
</template>

<script>
import fabricRound from '@/assets/page_imgs/fabricRound.png'
import {fabric} from 'fabric'

const defaultForm = {
  numTop: undefined,
  numRight: undefined,
  numBottom: undefined,
  numLeft: undefined,
}

export default {
  name: 'FabricThickness',
  props: {
    dialogVisible: {
      type: Boolean,
      required: true
    },
    fabricFromJson: {
      type: String,
      default: ''
    },
    backGroundImg: {
      type: String,
      default: fabricRound
    },
    thicknessForm: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      canvas:null,
      history:[],
      initJson:[],
      color:'#000',
      defaultText: {
        fontSize: 50,
        fontFamily: 'sans-serif',
      },
      form: Object.assign({}, defaultForm)
    }
  },
  watch:{
    dialogVisible(val){
      if(val){
        this.$nextTick(res => {
          this.init()
        })
      }
    }
  },
  computed: {
    dialogFormVisible: {
      get() {
        return this.dialogVisible
      },
      set(val) {
        this.$emit('update:dialogVisible', val)
      }
    }
  },
  methods: {
    colseDialog(){
      this.dialogFormVisible = false
      this.$nextTick(() => this.canvas.dispose())
    },
    //保存json
    saveFromJson(){
      this.dialogFormVisible = false
      const fabricFromJson = JSON.stringify(this.canvas.toJSON())
      const img = this.$refs.canvas.toDataURL()
      this.$emit(
        'getfabricFromJson',
        fabricFromJson,
        img
      )
      this.canvas.dispose()
      this.$emit('update:thicknessForm', { ...this.form })
    },
    //初始化加载
    init() {
      this.form = Object.assign({}, defaultForm, this.thicknessForm)
      this.canvas = new fabric.Canvas('canvas-thickness', {
        width: 600,
        height: 600
      })

      this.history = [];
      this.canvas.on('object:added', () => {
        const data = JSON.stringify(this.canvas.toJSON());
        this.history.push(data);
      });

      // 设置背景图
      // 参数1：背景图资源（可以引入本地，也可以使用网络图）
      // 参数2：设置完背景图执行以下重新渲染canvas的操作，这样背景图就会展示出来了
       // 回调方法
      const callback = (image, isError) => {
        console.log('this.canvas', this.canvas)
        // 设置图片背景在水平方向上的缩放比例
        image.scaleX = this.canvas.width / image.width;
        // 设置图片背景在竖直方向上的缩放比例
        image.scaleY = this.canvas.height / image.height;
        this.canvas.setBackgroundImage(image);
        // canvas.freeDrawingBrush.width = 20 // 画笔宽度
        this.canvas.freeDrawingBrush.color = this.color // 画笔颜色
        this.canvas.isDrawingMode = true
        this.initJson = JSON.stringify(this.canvas.toJSON());
        if(this.fabricFromJson){
          this.canvas.clear();
          this.canvas.loadFromJSON(this.fabricFromJson,this.canvas.renderAll())
        }
        this.canvas.renderAll()
      }
      fabric.Image.fromURL(this.backGroundImg, callback);
      this.history = [];
    },
    addTop() {
      const text = new fabric.Textbox(String(this.form.numTop || ''), {
        ...this.defaultText,
        left: 260,
        top: 61,
      })
      this.canvas.add(text)
    },
    addRight() {
      const text = new fabric.Textbox(String(this.form.numRight || ''), {
        ...this.defaultText,
        left: 496,
        top: 291
      })
      this.canvas.add(text)
    },
    addBottom() {
      const text = new fabric.Textbox(String(this.form.numBottom || ''), {
        ...this.defaultText,
        left: 260,
        top: 533
      })
      this.canvas.add(text)
    },
    addLeft() {
      const text = new fabric.Textbox(String(this.form.numLeft || ''), {
        ...this.defaultText,
        left: 22,
        top: 329
      })
      this.canvas.add(text)
    }
  }
}
</script>
<style lang="scss" scoped>
.th-wrap {
  position: relative;
}
.th-modal {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  /deep/ input {
    height: 42px;
  }
}
.num-top,
.num-right,
.num-bottom,
.num-left {
  position: absolute;
  width: 102px;
}
.num-top {
  top: 64px;
  left: 250px;
}
.num-right {
  top: 292px;
  left: 486px;
}
.num-bottom {
  top: 534px;
  left: 250px;
}
.num-left {
  top: 331px;
  left: 13px;
}
</style>
