<!--终检包装-->
<template>
  <el-dialog
    title="请选择批次"
    :visible.sync="dialogVisible"
    :before-close="handleClose"
    top="5vh"
    width="95%"
    custom-class="dialog"
    append-to-body
    destroy-on-close
  >
    <div class="dialog-scroller-wrap" style="margin-bottom: 50px">
      <div class="topMenu">
        <el-form :model="menuForm" inline>
          <el-form-item label="目数:">
            <el-select v-model="meshNumber" placeholder="请选择" disabled @change="refreshDirList()">
              <el-option v-for="(item,index) in meshNumberMap" :key="index" :label="item.name" :value="item.name"/>
            </el-select>
          </el-form-item>
          <div class="sort-bar">
            <el-form-item>
              <div style="display: flex;align-items: center;cursor: pointer;" @click="setOrder('inTime')">
                <span :style="inTime !== undefined ? `color: #409eff;`:''">按时间排序 : </span>
                <img v-if="inTime === undefined" src="@/assets/imgs/noOrder.png" alt="无排序" />
                <img v-if="inTime === 'ASC'" src="@/assets/imgs/upOrder.png" alt="升序" />
                <img v-if="inTime === 'DESC'" src="@/assets/imgs/lowerOrder.png" alt="降序" />
              </div>
            </el-form-item>
            <el-form-item >
              <div style="display: flex;align-items: center;cursor: pointer;"  @click="setOrder('number')">
                <span :style="number !== undefined ? `color: #409eff;`:''">按重量排序 : </span>
                <img v-if="number === undefined" src="@/assets/imgs/noOrder.png" alt="无排序" />
                <img v-if="number === 'ASC'" src="@/assets/imgs/upOrder.png" alt="升序" />
                <img v-if="number === 'DESC'" src="@/assets/imgs/lowerOrder.png" alt="降序" />
              </div>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <scroller ref="scroller" :on-refresh="refreshDirList" :on-infinite="infinite" noDataText="已显示全部数据"  class="directional">
        <div
          v-for="(item, index) in list"
          :key="index"
          class="card-item"
          :class="[code2selected[item.code] ? 'selected' : '']"
          @click="handleItemClick(item)"
        >
          <!-- head -->
          <div class="headLine">
            <div>
              <span class="headLine-name">炉次号&nbsp;&nbsp; </span>
              <span class="headLine-value">{{ item.code }}</span>
            </div>
            <div style="display: flex;align-items: center;">
              <el-tag v-if="item.type" type="danger">{{item.type}}</el-tag>
              <el-radio v-model="code2selected[item.code]" class="select" :label="true">&nbsp;</el-radio>

            </div>
          </div>
          <!-- body -->
          <div :class="'grid-container'">
            <div class="grid-item">
              <span class="grid-item-name">生产批号&nbsp;&nbsp;</span>
              <span v-if="item.dataObj" class="grid-item-value">{{ item.dataObj.productionBatchNo }}</span>
            </div>
            <div class="grid-item">
              <span class="grid-item-name">产品名称&nbsp;&nbsp;</span>
              <span v-if="item.dataObj" class="grid-item-value">{{ item.dataObj.productName }}</span>
            </div>
            <div class="grid-item">
              <span class="grid-item-name">目数&nbsp;&nbsp;</span>
              <span v-if="item.dataObj" class="grid-item-value">{{
                item.dataObj.meshNumber
              }}</span>
            </div>
            <div class="grid-item">
              <span class="grid-item-name">分选重量&nbsp;&nbsp;</span>
              <span class="grid-item-value">{{
                item.number
              }}</span>
            </div>
            <div class="grid-item">
              <span class="grid-item-name">进站时间&nbsp;&nbsp;</span>
              <span class="grid-item-value">{{ item.inTime }}</span>
            </div>
            <div class="grid-item">
              <span class="grid-item-name">停留时间&nbsp;&nbsp;</span>
              <span class="grid-item-value">{{ item.expectedFeedingTime }}</span>
            </div>
          </div>
        </div>
      </scroller>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button class="save" @click="handleClose">取 消</el-button>
      <el-button
        :disabled="!selectedCount"
        class="submit"
        type="primary"
        @click="submitData">
        <template v-if="selectedCount">已选{{ selectedCount }}条, 确认选择</template>
        <template v-else>请选择</template>
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import * as Api from '@/api/finalInspectionPackage/finalInspectionPackage.js'
import { getSeleteData } from "@/utils/select";
import { getTimeInterval } from "@/utils/tool.js";


export default {
  props: {
    dialogVisible: {
      type: Boolean,
      required: true
    },
    // 修改父组件数据
    changeParentData: {
      type: Function,
      required: true
    },
    // 已选择列表
    selectedList:{
      type: Array,
      default:()=>[]
    },
    meshNumber:{
      default:''
    }
  },
  name: 'SelectItemDialog',
  data() {
    return {
      page:1,
      rows:10,
      list:[],// 列表数据
      menuForm:{},//顶部筛选菜单表单
      meshNumberMap:[],//目数下拉框数据源
      inTime:undefined,//时间排序: undefined 无,ASC 升序,DESC 降序
      number:undefined,//重量排序: 0 无,1 升序,-1 降序
      code2selected: {},
    }
  },
  computed: {
    selectedCount() {
      if (this.list.length) {
        let count = 0
        for (const code in this.code2selected) {
          if (this.code2selected[code]) count++
        }
        return count
      }
      return 0
    }
  },
  created(){
    getSeleteData('SICpowder',this.meshNumberMap)
  },
  mounted() {

  },
  methods: {
    reset() {
      this.code2selected = {}
    },
    // 切换时间排序状态
    setOrder(objName){
      // 重置数据
      if(objName === 'inTime'){
        this.$set(this,'number',undefined)
      }else if(objName === 'number'){
        this.$set(this,'inTime',undefined)
      }else{
        this.$set(this,'inTime',undefined)
        this.$set(this,'number',undefined)
      }

      // 无-升
      if(this[objName] === undefined){
        this.$set(this,objName,'ASC')
        this.fetchDirByPage()
        return
      }
      // 升-降
      if(this[objName] === 'ASC'){
        this.$set(this,objName,'DESC')
        this.fetchDirByPage()
        return
      }
      // 降-无
      if(this[objName] === 'DESC'){
        this.$set(this,objName,undefined)
        this.fetchDirByPage()
        return
      }
    },
    // 关闭弹窗
    handleClose() {
      this.changeParentData('selectItemDialogVisible', false)
    },
    // 提交数据
    submitData(){
      let orderCodes = this.list.filter(({ code }) => this.code2selected[code])
      const result = orderCodes.filter(itemA => !this.selectedList.map(itemB => itemB.code).includes(itemA.code));
      this.$emit('submit',result)
      this.changeParentData('selectItemDialogVisible', false)
    },
    // 下拉刷新
    refreshDirList(done){
      this.reset()
      this.page = 1
      this.rows = this.page * 10
      this.fetchDirByPage(done)
    },
    // 滚动加载
    infinite(done){
      this.rows += this.page * 10
      this.fetchDirByPage(done)
    },
    // 加载数据
    fetchDirByPage(done){
      Api.listByPage({
        processCode:'ZJBZ-Y',
        orderField:this.inTime ? 'inTime' : (this.number ? 'number' : undefined),
        orderDirection:this.inTime || this.number,
        meshNumber:this.meshNumber,
        page:this.page,
        rows:this.rows
      }).then(res=>{
        this.list = res.data.rows || []
        this.list.forEach((item,index)=>{
          this.$set(this.list[index],'expectedFeedingTime',getTimeInterval(null,item.inTime))
        })
        // 初始化选中已选项
        this.list.forEach((item,index)=>{
          let val = this.selectedList.find(item2=>item2.code === item.code)
          if(val){
            this.handleItemClick(val)
          }
        })
        if (res.data && res.data.total <= this.rows) {
          return done && done(true)
        }
        done && done()
      }).catch(err=>{
        done && done(true)
      })
    },
    handleItemClick({ code }) {
      this.$set(this.code2selected, code, !this.code2selected[code])
    }
  }
}
</script>




<style lang="scss" scoped>
.topMenu{
  width: 100%;
  padding:0px 10px;
}
.directional {
  margin-top: 50px;
  padding: 0px 5px;
}
.sort-bar {
  float: right;
}
</style>
