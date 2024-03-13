<!--装料-->
<template>
  <div class="detailBox">
    <!-- 顶部信息卡片 -->
    <div class="topInfoCard">
      <!-- head -->
      <div class="headLine">
        <div>
          <span class="headLine-name">任务单号 &nbsp;&nbsp; </span>
          <span class="headLine-value">{{ detailInfo.billNo }}</span>
        </div>
        <!-- <el-tag type="danger">{{detailInfo.orderType}}</el-tag> -->
      </div>
      <!-- body -->
      <div :class="'grid-container'">
        <div class="grid-item">
          <span class="grid-item-name">数量：</span>
          <span class="grid-item-value"><span style="color: green;">{{ detailInfo.checkedCount }}</span>/<span>{{ detailInfo.count }}</span></span>
        </div>
        <div class="grid-item">
          <span class="grid-item-name">物料编码：</span>
          <span class="grid-item-value">{{ detailInfo.materialCode }}</span>
        </div>
        <div class="grid-item">
          <span class="grid-item-name">物料名称：</span>
          <span class="grid-item-value">{{ detailInfo.materialName }}</span>
        </div>
      </div>
    </div>
    <!-- 其他表单卡片 -->
    <div class="fromCard">
      <div class="headLine">
        <div class="headLine-title">录入来料检验数据</div>
      </div>

      <div class="main-wrap">
        <CodeScanner v-model="scanCode" v-for="item in scannerAssemblyList" :key="item.vModel" :placeholder="`请扫描或输入${item.label}`" @has-done="hasDon"/>
        <br>

        <el-form :model="detailForm" label-width="100px" ref="detailForm" :rules="rules">
          <el-row>
            <el-col :span="12">
              <el-form-item label="结果判定" prop="result">
                <el-select v-model="detailForm.result" style="width: 100%" @change="handleResultChange">
                  <el-option v-for="(item,i) in resultMap" :key="i" :label="item.name" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col v-if="deptVisible" :span="12">
              <el-form-item label="NC部门" prop="deptname">
                <el-select v-model="detailForm.deptname" style="width: 100%">
                  <el-option v-for="(item,i) in deptMap" :key="i" :label="item.name" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" v-for="item in numberAssemblyList" :key="item.vModel">
              <el-form-item :label="item.label" :prop="item.vModel">
                <el-input-number v-model="detailForm[item.vModel]" :precision="2" :min="0" @focus="$event.target.select()" style="width: 100%;"/>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-for="item in selectAssemblyList" :key="item.vModel">
              <el-form-item :label="item.label" :prop="item.vModel">
                <el-select v-model="detailForm[item.vModel]" style="width: 100%;">
                  <el-option v-for="(t,j) in item.options" :key="j" :label="t.name" :value="t.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注" prop="remark">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4}"
                  placeholder="请输入内容"
                  v-model="detailForm.remark">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="添加附件" prop="attachments">
                <!-- 图片 -->
                <PhotoNew
                  v-model="imageList"
                ></PhotoNew>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>

    <!-- 页面操作 -->
    <div class="pageHandleBox">
      <el-button class="submit" type="primary" @click="saveFrom">提交数据</el-button>
    </div>

    <!-- 打印弹窗组件 -->
    <PrintDialog
      :print-list="printList"
      :visible.sync="printVisible"
      :print-data="printData"
      @handle-close="handleClose"
    />
  </div>
</template>

<script>
import {getSeleteData} from '@/utils/select.js'
import CodeScanner from '@/components/CodeScanner';
import PhotoNew from "@/views/components/photoNew.vue";
import PrintDialog from "./printDialog.vue";
import * as Api from '@/api/incomingInspection'
export default {
  name: 'IncomingInspectionDatial',
  components:{
    PhotoNew,
    CodeScanner,
    PrintDialog
  },
  data() {
    return {
      detailInfo:{}, // 描述信息
      scanCode:'',
      disabled:true,
      printVisible:false,
      printData: {
        data: '', // 籽晶编码
        documentMould: '籽晶粘贴-来料检条码', // 	打印模版名称
        printNum: 1,
        type: 1 // 执行类型：0：不填充数据，1：填充数据
      },
      imageList:[],
      resultMap:[],
      detailForm:{},
      printList:[],
      numberAssemblyList:[],
      selectAssemblyList:[],
      inputAssemblyList:[],
      scannerAssemblyList:[],
      deptMap: [], // NC部门
      rules:{}
    }
  },
  computed: {
    deptVisible() {
      const { result } = this.detailForm
      return result && (result.includes('返修') || result.includes('报废'))
    }
  },
  created(){
    //接收路由传参数据
    this.detailInfo = this.$route.query || {}
  },
  mounted() {
    getSeleteData('result',this.resultMap)
    getSeleteData('ncDepartment',this.deptMap)
    this.getFrom()
  },
  methods: {
    //获取动态表单
    getFrom(){
      Api.getFormData(this.detailInfo).then(res => {
        this.scannerAssemblyList = res.data.filter(item => item.tag === 'CodeScanner')
        this.numberAssemblyList = res.data.filter(item => item.tag === 'el-input-number')
        this.selectAssemblyList = res.data.filter(item => item.tag === 'el-select')
        this.inputAssemblyList = res.data.filter(item => item.tag === 'el-input')
        this.$set(this.rules,'result',[{ required: true, message: '必填项', trigger: 'change' }])
        res.data.forEach(item => {
          if(item.tag !== 'CodeScanner' && item.required){
            this.$set(this.rules,item.vModel,[{ required: true, message: '必填项', trigger: 'change' }])
          }
        })
        this.$nextTick(() => {
          this.$refs.detailForm.clearValidate()
        })
      })
    },
    //扫码事件
    hasDon(){
      //获取编码对应数据

    },
    handleClose(){
      Api.listByPage({
        search_EQ_billNo:this.detailInfo.billNo,
        page:1,
        rows:1
      }).then(res=>{
        if(res.data.rows && res.data.rows.length > 0){
          this.detailInfo = res.data.rows[0]
          // 数量为最后一个时, 退出
          if(this.detailInfo.checkedCount === this.detailInfo.count)this.$router.push({ path: '/incomingInspection'})
        }
      })
    },
    //提交数据
    saveFrom(){
      // if(this.imageList.length  === 0) return this.$message.warning('请选择图片')
      if(!this.scanCode) return this.$message.warning('请选择扫码或数据编码')
      this.$refs.detailForm.validate((valid) => {
        if (valid) {
          const {result,remark,...data} = this.detailForm
          const {billNo,materialCode,materialId,materialName,id} = this.detailInfo
          const saveData = {
            result,
            remark,
            attachments:JSON.stringify(this.imageList),
            formData:JSON.stringify(data),
            scanCode:this.scanCode,
            billNo,
            materialCode,
            materialId,
            materialName
          }
          Api.submit(saveData).then(res => {
            this.$message.success('提交成功')
            // 打印
            this.printList = res.data
            this.printVisible = true
            this.printData.data = this.scanCode

            this.reset()
          })
        }
      });
    },
    handleResultChange() {
      if (!this.deptVisible) this.$set(this.detailForm, 'deptname', null)
    },
    reset() {
      this.scanCode = ''
      this.imageList = []
      for(let key in this.detailForm){
        this.detailForm[key] = null
      }
      this.$nextTick(() => {
        this.$refs.detailForm.clearValidate()
      })
    }
  }
}
</script>
