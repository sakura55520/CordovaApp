<!--成品入库-->
<template>
  <div class="detailBox">
    <!-- 顶部信息卡片 -->
    <div class="topInfoCard">
      <!-- head -->
      <div class="headLine">
        <div>
          <span class="headLine-name">工单批次号 &nbsp;&nbsp; </span>
          <span class="headLine-value">{{ detailInfo.orderNo }}</span>
        </div>
        <el-tag type="danger">{{detailInfo.orderType}}</el-tag>
      </div>
      <!-- body -->
      <div :class="'grid-container'">
        <div class="grid-item">
          <span class="grid-item-name">计划量：</span>
          <span class="grid-item-value">{{ detailInfo.planNumber }}</span>
        </div>
        <div class="grid-item">
          <span class="grid-item-name">已发量：</span>
          <span class="grid-item-value">{{ detailInfo.issuedNumber }}</span>
        </div>
        <div class="grid-item">
          <span class="grid-item-name">产品名称：</span>
          <span class="grid-item-value">{{ detailInfo.productName }}</span>
        </div>
        <div class="grid-item">
          <span class="grid-item-name">产品配方：</span>
          <span class="grid-item-value">{{ detailInfo.productBom }}</span>
        </div>
      </div>
    </div>
    <!-- 其他表单卡片 -->
    <!-- card1 -->
    <div class="fromCard">
      <div class="fromCard">
        <div class="headLine">
          <div class="headLine-title">库存</div>
          <div class="headLine-tip">存在以下库存，请选择是否投入使用</div>
        </div>
        <div class="from">

        </div>
      </div>
    </div>
    {{detailForm}}

    <!-- 页面操作 -->
    <div class="pageHandleBox">
      <el-button class="save" @click="handle('保存')">保存</el-button>
      <el-button class="submit" type="primary" @click="handle('提交')">提交</el-button>
    </div>
  </div>
</template>

<script>
import * as Api from '@/api/Warehousing/Warehousing.js'

export default {
  name: 'DirList',
  components:{
  },
  data() {
    return {
      page:1,
      rows:0,
      detailInfo:{}, // 描述信息
      detailForm:[], // 表单列表
      list:[], // 发料列表
    }
  },
  created(){

  },
  mounted() {
    this.init()
  },
  methods: {
    // 页面初始化
    init(){
      let storageData = sessionStorage.getItem('...详情数据')
      console.log(storageData,'storageData');
      if(storageData){
        let { detailInfo,detailForm} = JSON.parse(storageData)
        this.detailInfo = detailInfo,
        this.detailForm = detailForm
      }else{
        //接收路由传参数据
        this.detailInfo = this.$route.query || {}
        this.getList()
      }
    },
    // 操作
    handle(typeName='',row,index){
      if(typeName === '删除'){

      }
      if(typeName === '保存'){
        let saveData = {
        }
        sessionStorage.setItem('...详情数据',JSON.stringify(saveData))
        this.$message.success('提交成功')
        this.$router.push('/...')
      }
      if(typeName === '提交'){
        Api.submit(this.detailForm).then(res=>{
          this.$message.success('提交成功')
          sessionStorage.removeItem('...详情数据')
          this.$router.push('/...')
        })
      }
    },
    // 查询列表数据
    getList(){
      let params = {

      }
      Api.getList(params).then(res=>{
        this.list = res.data || []
      })
    },
    // 下拉刷新
    refreshDirList(done){
      this.page = 1
      this.rows = this.page * 20
      this.fetchDirByPage(done)
    },
    // 滚动加载
    infinite(done){
      this.rows += this.page * 10
      this.fetchDirByPage(done)
    },

    // 加载数据
    async fetchDirByPage(done){
      Api._listByPage({
        page:this.page,
        rows:this.rows
      }).then(res=>{
        this.list = res.data.rows || []
        if (res.data && res.data.total <= this.rows) {
          return done && done(true)
        }
        done && done()
      }).catch(err=>{
        done && done(true)
      })
    },
  }
}
</script>




<style lang="scss" scoped>
.detailBox {
  position: relative;
  background: #f5f5f5;
  height: calc(100vh - 50px);
  padding: 10px;
  padding-bottom: 56px;
}
.topInfoCard {
  width: 100%;
  background-color: #FFF;
  margin-bottom: 10px;
  padding: 0px 10px 5px 10px;
  .headLine{
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid rgba(192, 192, 192, 0.3);
    .headLine-name{
      color: rgba(0, 0, 0, 0.7);
    }
    .headLine-value{
      color: black;
      font-size: 16px;
      font-weight: bold;
    }
    .headLine-tag{
      line-height: 3px;
      padding: 10px 15px;
    }
  }
  .grid-container {
    display: grid;
    grid-template-columns: repeat(2, minmax(120px, 1fr));
    grid-gap: 10px;
    padding: 5px;
    .grid-item{
      display: flex;
      align-items: center;
      .grid-item-name{
        color: silver;
      }
      .grid-item-value{
        color: black;
      }
    }
  }
  .menu{
    width: 100%;
    margin-bottom: 10px;
  }
}
.fromCard{
  display: flex;
  flex-direction: column;
  padding: 0px 5px 5px 5px;
  background-color: #FFF;
  .headLine{
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid rgba(192, 192, 192, 0.3);
    .headLine-title{
      height: 20px;
      line-height: 20px;
      padding-left: 10px;
      border-left: 5px solid #409eff;
    }
    .headLine-tip{
      color: rgb(255, 185, 35);
    }
  }
  .from{

  }
}

.pageHandleBox{
  background-color: #FFF;
  position: fixed;
  bottom: 0;
  width: 100%;
  display: flex;
  padding: 10px;
  align-items: center;
  justify-content: space-between;
  .save{
    padding: 15px 20%;
    margin: 0px;
  }
  .submit{
    margin: 0px 10px;
    padding: 15px 20%;
  }
}

</style>
