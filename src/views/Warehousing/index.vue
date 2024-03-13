<!--原料合成/成品入库-->
<template>
  <div class="scroller-wrap">
    <scroller ref="scroller" :on-refresh="refreshDirList" :on-infinite="infinite" noDataText="已显示全部数据"  class="directional">
      <div
        v-for="(item, index) in list"
        :key="index"
        class="card-item"
        :class="[id2selected[item.id] ? 'selected' : '']"
        @click="handleItemClick(item)"
      >
        <!-- head -->
        <div class="headLine">
          <div>
            <span class="headLine-name">炉次号&nbsp;&nbsp; </span>
            <span class="headLine-value">{{ item.packageBatch }}</span>
          </div>
          <div style="display: flex;align-items: center;">
            <el-tag v-if="item.status === 0" type="warning">待入库</el-tag>
            <el-tag v-if="item.status === 1" type="success">已入库</el-tag>
            <el-radio v-model="id2selected[item.id]" class="select" :label="true">&nbsp;</el-radio>

          </div>
        </div>
        <!-- body -->
        <div :class="'grid-container'">
          <div class="grid-item">
            <span class="grid-item-name">料号&nbsp;&nbsp;</span>
            <span class="grid-item-value">{{ item.productCode }}</span>
          </div>
          <div class="grid-item">
            <span class="grid-item-name">目数&nbsp;&nbsp;</span>
            <span class="grid-item-value">{{ item.meshNumber }}</span>
          </div>
          <div class="grid-item">
            <span class="grid-item-name">数量&nbsp;&nbsp;</span>
            <span class="grid-item-value">{{ item.number }}</span>
          </div>
          <div class="grid-item">
            <span class="grid-item-name">产品信息&nbsp;&nbsp;</span>
            <span class="grid-item-value">{{ item.productName }}</span>
          </div>
          <div class="grid-item">
            <span class="grid-item-name">规格&nbsp;&nbsp;</span>
            <span class="grid-item-value">{{ item.specification }}</span>
          </div>
          <div class="grid-item">
            <span class="grid-item-name">图号&nbsp;&nbsp;</span>
            <span class="grid-item-value">{{ item.tu }}</span>
          </div>
          <div class="grid-item">
            <span class="grid-item-name">创建时间：</span>
            <span class="grid-item-value">{{ item.gmtCreate }}</span>
          </div>
          <div class="grid-item">
            <span class="grid-item-name">停留时间：</span>
            <span class="grid-item-value residence-time">{{ $hoursFromNow(item.gmtCreate) }}</span>
          </div>
          <div class="grid-item">
            <span class="grid-item-name">创建人：</span>
            <span class="grid-item-value">{{ item.userCreate }}</span>
          </div>
        </div>
      </div>
    </scroller>

    <el-dialog
      :visible.sync="dialogVisible"
      :before-close="handleDialogClose"
      custom-class="dialog"
      top="5vh"
      width="95%"
      title="浏览入库单"
      append-to-body
      destroy-on-close
    >
      <el-form :model="dialogData" style="padding: 0 16px;">
        <div class="topInfoCard" style="padding-top: 10px;">
          <div :class="'grid-container'" style="width: 100%;">
            <div class="grid-item">
              <span class="grid-item-name">申请人&nbsp;&nbsp;</span>
              <span class="grid-item-value">{{ dialogData.creatUser}}</span>
            </div>
            <div class="grid-item">
              <span class="grid-item-name">组织编码&nbsp;&nbsp;</span>
              <span class="grid-item-value">{{ dialogData.organizationalCode}}</span>
            </div>
            <div class="grid-item">
              <span class="grid-item-name">入库仓库编号&nbsp;&nbsp;</span>
              <span class="grid-item-value">{{ dialogData.warehouseCode}}</span>
            </div>
            <div class="grid-item">
              <span class="grid-item-name">总重量&nbsp;&nbsp;</span>
              <span class="grid-item-value">{{ dialogData.totalWeight}}</span>
            </div>
          </div>
          <br>

          <el-table :data="dialogData.tableList">
            <el-table-column label="批次号" prop="packageBatch" width="130"/>
            <el-table-column label="物料编码" prop="productCode"/>
            <el-table-column label="物料名称" prop="productName"/>
            <el-table-column label="规格" prop="specification"/>
            <el-table-column label="数量" prop="number"/>
            <el-table-column label="单位" prop="unit"/>
          </el-table>
          <br>

          <el-form-item label="备注" label-width="50px">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="请输入内容"
              v-model="dialogData.remarks">
            </el-input>
          </el-form-item>
        </div>
      </el-form>

      <div class="pageHandleBox">
        <el-button class="cancle" @click="handleDialogClose">取消</el-button>
        <el-button class="submit" type="primary" @click="handle('确定')">确定</el-button>
      </div>
    </el-dialog>

    <!-- 页面操作 -->
    <div class="pageHandleBox">
      <el-button
        :disabled="!selectedCount"
        class="submit"
        type="primary"
        @click="handle('发起入库')"
      >
        <template v-if="selectedCount">已选{{ selectedCount }}条, 发起入库</template>
        <template v-else>请选择</template>
      </el-button>
    </div>
  </div>
</template>

<script>
import * as Api from '@/api/Warehousing/Warehousing.js'
import { getSeleteData } from "@/utils/select";

export default {
  name: 'Warehousing',
  data() {
    return {
      page:1,
      rows:10,
      list:[],// 列表数据
      isCreateBatchProcessing:false,
      dialogVisible:false,//控制浏览入库单弹窗
      dialogData:{
        tableList:[]
      },
      id2selected: {},
      organizationalCode: '003',
      warehouseCode: '',

    }
  },
  computed: {
    selectedCount() {
      if (this.list.length) {
        let count = 0
        for (const id in this.id2selected) {
          if (this.id2selected[id]) count++
        }
        return count
      }
      return 0
    }
  },
  created(){
    this.fetchWarehouseCode() // 获取入库仓库编号
  },
  mounted() {

  },
  methods: {
    reset() {
      this.id2selected = {}
    },
    // 初始化弹窗页面数据
    initDialogData(choseItems=[]){
      this.dialogData = {
        creatUser:window.sessionStorage.getItem('realName'),
        organizationalCode:this.organizationalCode,
        warehouseCode:this.warehouseCode,
        totalWeight:choseItems.reduce((acc, cur) => acc + cur.number, 0),
        tableList:choseItems
      }
    },
    // 操作
    handle(typeName='',data){
      if(typeName === '发起入库'){
        const orderCodes = this.list.filter(({ id }) => this.id2selected[id])
        if(orderCodes.length<1){
          this.$message.warning('请至少选择一项进行发起入库')
          return
        }
        this.$confirm('发起入库后,可在PC端<成品入库>查看记录', '确认发起入库?', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log(orderCodes,'orderCodes');
          this.initDialogData(orderCodes)
          this.dialogVisible = true

        }).catch(() => {

        })
      }
      if(typeName === '确定'){
        let data = {
          ...this.dialogData,
          ids:this.dialogData.tableList.map(item=>item.id),
          tableList:undefined
        }
        Api.warehousing(data).then(res=>{
          this.$message.success('入库成功')
          this.dialogVisible = false
          this.dialogData = {
            tableList:[]
          }
          this.fetchDirByPage()
        })
      }
    },
    // 关闭浏览入库单弹窗
    handleDialogClose(){
      this.dialogVisible = false
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
        page:this.page,
        rows:this.rows,
        search_EQ_status:0
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
    handleItemClick({ id }) {
      this.$set(this.id2selected, id, !this.id2selected[id])
    },
    // 获取入库仓库编号
    async fetchWarehouseCode() {
      const warehouseCodeMap = []
      await getSeleteData('warehouseCode', warehouseCodeMap)
      const matched = warehouseCodeMap.find(item => item.name === '原料合成')
      if (matched) this.warehouseCode = matched.value
    }
  }
}
</script>

