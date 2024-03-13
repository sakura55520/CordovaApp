<!--生产发料-->
<template>
  <div class="detailBox">
    <!-- 顶部信息卡片 -->
    <div class="topInfoCard">
      <!-- head -->
      <div class="headLine">
        <div>
          <span class="headLine-name">订单号: &nbsp;&nbsp; </span>
          <span class="headLine-value">{{ detailInfo.billNo }}</span>
        </div>
        <!-- <el-tag type="danger">{{detailInfo.orderType}}</el-tag> -->
      </div>
      <!-- body -->
      <div :class="'grid-container'">
        <div class="grid-item">
          <span class="grid-item-name">产品料号：</span>
          <span class="grid-item-value">{{ detailInfo.materialCode }}</span>
        </div>
        <div class="grid-item">
          <span class="grid-item-name">产品名称：</span>
          <span class="grid-item-value">{{ detailInfo.materialName }}</span>
        </div>
        <div class="grid-item">
          <span class="grid-item-name">类型：</span>
          <span class="grid-item-value">{{ detailInfo.materialType }}</span>
        </div>
        <div class="grid-item">
          <span class="grid-item-name">计划数量：</span>
          <span class="grid-item-value">{{ detailInfo.planCount }}</span>
        </div>
        <div class="grid-item">
          <span class="grid-item-name">已发料：</span>
          <span class="grid-item-value">{{ detailInfo.issuedCount }}</span>
        </div>
        <div class="grid-item">
          <span class="grid-item-name">任务创建时间：</span>
          <span class="grid-item-value">{{ detailInfo.createTime }}</span>
        </div>
      </div>
    </div>
    <!-- 其他表单卡片 -->
    <!-- card1 -->
    <div class="fromCard">
      <div class="headLine">
        <div class="headLine-title">发料清单</div>
        <div class="headLine-tip"></div>
      </div>
      <div class="from">
        <CodeScanner v-model="uniqueCode" :placeholder="'请扫描或输入籽晶编号'" @has-done="addIssuanceItem"/>
        <el-table :data="issuanceList">
          <el-table-column label="籽晶编号" prop="uniqueCode"/>
          <el-table-column label="类型" prop="materialTypeName"/>
          <el-table-column label="直接/规则" prop="specification"/>
          <el-table-column label="等级" prop="level"/>
          <el-table-column fixed="right" label="操作"  width="100">
            <template slot-scope="scope">
              <el-button type="danger" @click="handle('删除',scope.row,scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
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
import CodeScanner from '@/components/CodeScanner';

import * as Api from '@/api/pasteProducIssueStuff/pasteProducIssueStuff.js'

export default {
  name: 'DirList',
  components:{
    CodeScanner,
  },
  data() {
    return {
      page:1,
      rows:0,
      detailInfo:{}, // 描述信息
      detailForm:{}, // 表单列表
      uniqueCode:'',// 扫码
      issuanceList:[], // 发料列表
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
      this.detailInfo = this.$route.query || {}
      let storageData = sessionStorage.getItem(`籽晶粘贴生产发料详情数据${this.detailInfo.id}`)
      if(storageData){
        let { detailForm, issuanceList } = JSON.parse(storageData)
        this.detailForm = detailForm
        this.issuanceList = issuanceList
      }else{
        this.detailForm = {
          ...this.detailForm,
          ...this.detailInfo,
          issueBillDetails:[]
        }
      }
      this.$forceUpdate()
    },
    // 扫码或者输入后
    addIssuanceItem(){
      this.getItem(this.uniqueCode).then(res=>{
        let val = res
        let isHas = false
        for(let i = 0; i<this.issuanceList.length;i++){
          let item = this.issuanceList[i]
          if(item.id === val.id){
            this.$message.error('该条数据已存在')
            isHas = true
            break
          }
        }
        if(!isHas){
          // 扫码的添加的数据不存在时
          this.detailForm.issueBillDetails.push(val)
          this.issuanceList.push(val)
        }
      })
    },
    // 操作
    handle(typeName='',row,index){
      if(typeName === '删除'){
        this.detailForm.issueBillDetails.splice(index,1)
        this.issuanceList.splice(index,1)
      }
      if(typeName === '保存'){
        let saveData = {
          detailForm:this.detailForm,
          issuanceList:this.issuanceList
        }
        sessionStorage.setItem(`籽晶粘贴生产发料详情数据${this.detailInfo.id}`,JSON.stringify(saveData))
        this.$message.success('保存成功')
        this.$router.push('/pasteProducIssueStuff')
      }
      if(typeName === '提交'){
        if(this.detailForm.issueBillDetails.length < 1){
          this.$message.error('请至少选择一条数据进行发料')
          return
        }
        Api.submit(this.detailForm).then(res=>{
          this.$message.success('提交成功')
          sessionStorage.removeItem(`籽晶粘贴生产发料详情数据${this.detailInfo.id}`)
          this.$router.push('/pasteProducIssueStuff')
        })
      }
    },
    // 查询原料合成返工-原料库存
    getItem(uniqueCode){
      return Api.getItem(uniqueCode).then(res=>{
        return res.data || undefined
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

    },
  }
}
</script>

