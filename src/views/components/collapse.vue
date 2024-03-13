<template>
  <div class="collapse_container">
    <div class="collapse_show" id="collapse_id">
      <slot name="context"></slot>
    </div>
    <div class="collapse_button" @click="cilicCollapse">
      <i class="el-icon-caret-bottom" v-if="collapse" style="color: #409eff"></i>
      <i class="el-icon-caret-top" v-else style="color: #409eff"></i>
      <span style="color: #409eff;">{{ collapse ? '展开' : '收起' }}</span>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      collapse: true,
      height:0
    }
  },

  methods: {
    // public方法, 可以在父级调用
    cilicCollapse(){
      var element = document.getElementById('collapse_id')
      if(!this.collapse){
        element.style.height = '0px'
      }else{
        element.style.height = element.scrollHeight + 'px'
      }
      this.collapse = !this.collapse
    }
  },
  created(){
    this.$nextTick(()=>{
      var element = document.getElementById('collapse_id')
      this.height = element.offsetHeight
      element.style.height = element.scrollHeight + 'px'
    })
  }
}
</script>


<style scoped>
.collapse_container{
  padding: 5px;
  border: 1px solid rgba(192, 192, 192, 0.3);
  background-color: #FFF;
}
.collapse_show{
  overflow: hidden;
  transition: height 0.5s ease
}
.collapse_button{
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30px;
  background-color: #b3d8ff;
}
</style>
