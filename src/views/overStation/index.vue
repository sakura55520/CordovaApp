<!--过站操作-->
<template>
  <div class="mainBox detailBox">
    <div class="topInfoCard">
      <div class="topBox">
        <div class="topBox-label">编号</div>
        <CodeScanner ref="CodeScanner" v-model="processingOrderCode" :placeholder="'请扫描或输入'" @has-done="codeScannerCallBack" @clear="onCodeScannerClear"  style="flex: 1;"/>
        <el-button class="acquire-btn" type="primary" size="mini">获取</el-button>
      </div>

      <div v-show="siteList && siteList.length" class="bodyBox">
        <div class="bodyBox-title">当前站点</div>
        <div class="bodyBox-list">
          <el-radio-group v-model="currentItem" style="width: 100%;display: flex;flex-direction: column;justify-content: center;">
            <el-radio v-for="(item,index) in siteList" :key="index" class="bodyBox-list-radio" :label="item.wipStorageName" border @click.native="handleCloseSite(item,index)">{{item.wipStorageName}}</el-radio>
          </el-radio-group>
        </div>
      </div>
    </div>

    <div class="pageHandleBox">
      <!--   skipStatus: 0均不跳过，1 跳过进站，2 跳过出站，3 全部跳过   -->
      <!--   进站   -->
      <template v-if="currentSite.wipStorageStatus === 0">
        <el-button
          v-if="currentSite.skipStatus === 1 || currentSite.skipStatus === 3"
          class="submit"
          type="warning"
          plain
          @click="handleInStation(true)"
        >
          跳过进站
        </el-button>

        <el-button
          class="submit"
          type="primary"
          plain
          @click="handleInStation(false)"
        >
          确定进站
        </el-button>
      </template>

      <!--   出站   -->
      <template v-if="currentSite.wipStorageStatus === 1">
        <el-button
          v-if="currentSite.skipStatus === 2 || currentSite.skipStatus === 3"
          class="submit"
          type="warning"
          plain
          @click="handleOutStation(true)"
        >
          跳过出站
        </el-button>
        <el-button
          class="submit"
          type="primary"
          @click="handleOutStation(false)"
        >
          确定出站
        </el-button>
      </template>

    </div>

    <el-dialog title="请选择路线" :visible.sync="routeDialog" width="50%" :before-close="closeRouteDialog">
      <el-radio-group v-model="routeItem" style="width: 100%;">
        <el-radio v-for="(item,index) in routeList" :key="index" class="bodyBox-list-radio" :label="item.label" border @click.native="handleCloseRoute(item,index)">{{item.label}}</el-radio>
      </el-radio-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeRouteDialog">取 消</el-button>
        <el-button type="primary" @click="handleOutStation(false, currentRoute.label)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import * as Api from '@/api/overStation/overStation.js'
import CodeScanner from '@/components/CodeScanner';


export default {
  components:{
    CodeScanner
  },
  data() {
    return {
      processingOrderCode:undefined,//工单号
      currentItem:undefined,//工序绑定项
      currentSite:{},//当前选中工序数据
      isAbnormal:false,//是否标记异常
      siteList:[],//工序列表

      routeItem:undefined,//路线绑定项
      currentRoute:{},//当前选中路线
      routeList:[],//路线列表
      routeDialog:false
    }
  },
  mounted() {
    this.init()

  },
  methods: {
    // 初始化逻辑
    init(){
      // 判断是否直接扫码
      if(this.$route.query.isScanner){
        this.$refs.CodeScanner.sweepCode()
      }

      if(this.$route.query.processingOrderCode){
        this.processingOrderCode = this.$route.query.processingOrderCode
        this.codeScannerCallBack()
      }
    },
    // 进站操作
    handleInStation(skip){
      if(!this.processingOrderCode) return this.$message.error('请输入工单号')
      if(skip || this.currentSite.operationType === 0){
        // 直接进站
        this.$confirm(`是否${skip ? '跳过进站' : '确定进站'}？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.inStation()
        }).catch(() => {})
      } else if(this.currentSite.operationType === 1){
        // 自定义表单
        this.$route.meta.station = this.currentItem +'  进站'
        this.$route.meta.params = {
          equipmentCode:this.currentSite.deviceCode || undefined,
          index:this.currentSite.index,
          processingOrderCode:this.processingOrderCode,
          operationType:this.currentSite.operationType,
          processUuid:this.currentSite.processUuid,
          modelFormId:undefined
        }
        this.$router.push({path:'/trendsform'})
      } else if(this.currentSite.operationType === 2){
        // 定制化页面
        this.$router.push({path:this.currentSite.operationData,query:{
          ...this.currentSite,
          processingOrderCode:this.processingOrderCode,
          fromData:JSON.stringify(this.currentSite.fromData)
        }})
      }
    },
    // 进站
    inStation(){
      let data = {
        equipmentCode: this.currentSite.deviceCode,
        param: {},
        processUuid: this.currentSite.processUuid,
        skipStatus: this.currentSite.skipStatus,
        processingOrderCode: this.processingOrderCode
      }
      Api.inStation(data).then(res=>{
        this.$message.success('进站成功')
        this.resetData()
      }).catch((err) => {
        if(err && err.code === 201){
          this.routeDialog = true
          this.routeList = err.data
        }
      })
    },
    // 出站操作
    handleOutStation(skip, flowLineLable){
      if(!this.processingOrderCode) return this.$message.error('请输入工单号')
      if(skip || this.currentSite.operationType === 0){
        // 直接出站
        this.$confirm(`是否${skip ? '跳过出站' : '确定出站'}？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.OutStation(flowLineLable)
        }).catch(() => {})
      } else if(this.currentSite.operationType === 1){
        // 自定义表单
        this.$route.meta.station = this.currentItem +'  出站'
        this.$route.meta.params = {
          equipmentCode:this.currentSite.deviceCode || undefined,
          index:this.currentSite.index,
          processingOrderCode:this.processingOrderCode,
          operationType:this.currentSite.operationType,
          processUuid:this.currentSite.processUuid,
          modelFormId:undefined
        }
        this.$router.push({path:'/trendsform'})
      } else if(this.currentSite.operationType === 2){
        // 定制化页面
        this.$router.push({path:this.currentSite.operationData,query:{
          ...this.currentSite,
          processingOrderCode:this.processingOrderCode,
          fromData:JSON.stringify(this.currentSite.fromData)
        }})
      }
    },
    //出站
    OutStation(flowLineLable){
      let data = {
        flowLineLable: this.currentSite.flowLineLable || flowLineLable,
        param: {},
        processUuid: this.currentSite.processUuid,
        skipStatus: this.currentSite.skipStatus,
        processingOrderCode: this.processingOrderCode
      }
      Api.outStation(data).then(res=>{
        this.$message.success('出站操作')
        this.resetData()
      }).catch((err) => {
        if(err && err.code === 201){
          this.routeDialog = true
          this.routeList = err.data
        }
      })
    },
    // 当选中工序时
    handleCloseSite(row,index){
      this.currentSite = {
        ...row,
        index
      }
    },
    // 当选中路线时
    handleCloseRoute(row,index){
      this.currentRoute = {
        ...row,
        index
      }
    },
    // 扫码回调
    codeScannerCallBack(){
      Api.getCurrentWipStorageData(this.processingOrderCode).then(res=>{
        this.siteList = res.data
      }).catch(err=>{
        this.resetData()
      })
    },
    // 当扫码框清空时
    onCodeScannerClear(){
      this.resetData()
    },
    closeRouteDialog(){
      this.routeDialog = false
    },
    // 重置页面数据
    resetData(){
      this.processingOrderCode=undefined,
      this.currentItem=undefined,
      this.currentSite={},
      this.isAbnormal=false,
      this.siteList=[]

      this.routeItem=undefined,//路线绑定项
      this.currentRoute={},//当前选中路线
      this.routeList=[],//路线列表
      this.routeDialog=false
    }
  }
}
</script>




<style lang="scss" scoped>
.mainBox{

  .topBox{
    display: flex;
    gap: 16px;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
    .topBox-label{
      font-weight: 600;
    }
  }
  .acquire-btn {
    height: 40px;
    padding-left: 20px;
    padding-right: 20px;
  }
  .bodyBox{
    .bodyBox-title{
      font-weight: 600;
      width: 100%;
    }
    .bodyBox-list{
      width: 100%;
      .bodyBox-list-radio{
        width: 100%;
        height: auto;
        margin-top: 10px;
        border-radius: 8px !important;
        padding: 8px 0;
        font-size: 20px;
        line-height: 28px;
        text-align: center;
        /deep/ .el-radio__label {
          font-size: 16px;
        }
      }
    }
  }

  .menuBox{
    border-top: 3px solid rgb(241, 241, 241);
    display: flex;
    width: 100%;
    position: fixed;
    justify-content: space-evenly;
    bottom: 0px;
    height: 50px;
    background-color: #ffffff;
    padding: 3px;
    > button {
      flex: 1;
    }
  }
}
</style>
