<template>
  <el-dialog :visible.sync="dialogFormVisible" title="画板" width="640px" top="5vh" destroy-on-close :before-close="colseDialog">
    <canvas id="canvas" ref="canvas"/>
    <div class="operate_button">
      <el-button icon="el-icon-refresh" plain type="primary" @click="empty()">清空</el-button>
      <el-color-picker v-model="color" @active-change="setColor"></el-color-picker>
      <el-button icon="el-icon-refresh-left" plain type="primary" @click="undo()">撤销</el-button>
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
export default {
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
    }
  },
  data() {
    return {
      canvas:null,
      history:[],
      initJson:[],
      color:'#000',
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
    },
    //初始化加载
    init() {
      this.canvas = new fabric.Canvas('canvas', {
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
    //设置画笔颜色
    setColor(val){
      this.canvas.freeDrawingBrush.color = val // 画笔颜色
      this.canvas.renderAll();
    },
    //清空
    empty(){
      this.canvas.loadFromJSON(this.initJson,this.canvas.renderAll());
      this.history = []
    },
    //撤销上一步
     undo() {
      if (this.history.length > 1) {
        this.history.pop();
        let lastObjData = this.history[this.history.length - 1];
        this.canvas.loadFromJSON(lastObjData,this.canvas.renderAll())
      }
    }
  }
}
</script>
<style scoped>
.operate_button{
  margin-top: 20px;
  display: flex;
  justify-content: space-around
}
</style>
