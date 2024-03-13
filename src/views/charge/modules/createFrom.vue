<!--装料-->
<template>
  <div class="detailBox">
    <!-- 其他表单卡片 -->
    <div class="fromCard">
      <div class="fromCard">
        <el-form :model="detailForm" label-width="100px" :rules="rules" ref="detailForm" style="padding: 20px 10px 0 0;">
          <el-row>

            <!-- 预处理 -->
            <template v-if="detailForm.preProcessingOrNot">
              <el-col :span="24">
                <el-form-item label="机台号" prop="equipmentCode">
                  <CodeScanner v-model="detailForm.equipmentCode" placeholder="请扫描或输入机台号" @has-done="fetchLotNo"/>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="炉次" prop="lotTimes">
                  <el-input v-trim v-model="detailForm.lotTimes" type="number" @blur="fetchLotNo"/>
                </el-form-item>
              </el-col>

            </template>

            <!-- 长晶 -->
            <el-col :span="24">
              <el-form-item label="炉次号" prop="lotNo">
                <el-input
                  v-model="detailForm.lotNo"
                  :placeholder="detailForm.preProcessingOrNot ? '请输入炉次号' : '自动生成'"
                  disabled
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="产品料号" prop="productCode">
                <CodeScanner v-model="detailForm.productCode" placeholder="请扫描或输入产品料号" @has-done="hasProductCode"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="产品名称" prop="productName">
                <el-input v-trim v-model="detailForm.productName" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="产品配方" prop="productBomId">
                <el-select v-model="detailForm.productBomId" @change="getProductFormula" style="width: 100%;">
                  <el-option v-for="item in options" :key="item.id" :label="item.bomName" :value="item.id"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注" prop="mark">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4}"
                  placeholder="请输入内容"
                  v-model="detailForm.mark">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>

    <!-- 页面操作 -->
    <div class="pageHandleBox">
      <el-button class="submit" type="primary" @click="generate">创建任务</el-button>
    </div>
  </div>
</template>

<script>
import {getSeleteData} from '@/utils/select.js'
import * as Api from '@/api/charge'
import CodeScanner from '@/components/CodeScanner';

const deflutFrom = {
  preProcessingOrNot: false, // 是否预处理
  lotTimes:'',
  equipmentCode:'',
  lotNo:'',
  productName:'',
  productFormula:'',
  productBomId:'',
  mark:''
}
export default {
  name: 'DirList',
  components:{
    CodeScanner
  },
  data() {
    return {
      detailInfo:{}, // 描述信息
      cleanMachineNoMap:[],
      options:[],
      detailForm:Object.assign({},deflutFrom),
      rules:{
        equipmentCode:[{ required: true, message: '必填项', trigger: 'change' }],
        lotTimes:[{ required: true, message: '必填项', trigger: 'change' }],
        productCode:[{ required: true, message: '必填项', trigger: 'change' }],
        productBomId:[{ required: true, message: '必填项', trigger: 'change' }]
      }
    }
  },
  created(){
    this.detailForm = Object.assign({},deflutFrom)

    // 接收路由传参数据
    this.detailInfo = this.$route.query || {}

    // 是否预处理
    this.detailForm.preProcessingOrNot = this.$route.query.operateType === '预处理'
  },
  mounted() {
    getSeleteData('cleanMachineNo',this.cleanMachineNoMap)
  },
  methods: {
    //扫码验证机台号
    fetchLotNo(){
      const { equipmentCode, lotTimes } = this.detailForm
      if(!equipmentCode)return
      Api.scan({
        equipmentCode,
        lotTimes,
        orderType: 2, // 原料预处理类型
      }).then(res => {
        this.detailForm.lotNo = res.data.lotNo
        this.detailForm.lotTimes = res.data.lotTimes
      }).catch(()=>{
        this.detailForm.equipmentCode = ''
        this.detailForm.lotTimes = ''
        this.detailForm.lotNo = ''
      })
    },
    //扫描料号获取bom数据
    hasProductCode(){
      // search_LIKE_modelNames:'装料'
      Api.listAll({search_EQ_materialCode:this.detailForm.productCode,search_EQ_status: 1}).then(res => {
        this.options = res.data
        if(this.options.length > 0){
          this.detailForm.productName = this.options[0].materialName
          this.detailForm.productFormula = this.options[0].bomName
          this.detailForm.productBomId = this.options[0].id
        }else{
          this.detailForm.productCode = ''
          this.$message.warning('无数据')
        }
      })
    },
    //获取产品配方
    getProductFormula(){
      const data = this.options.find(item => item.id === this.detailForm.productBomId)
      if(data){
        this.detailForm.productFormula = data.bomName
        this.detailForm.productBomId = data.id
      }
    },
    //创建装料任务
    generate(){
      this.$refs.detailForm.validate((valid) => {
        if (valid) {
          const saveData = {
            ...this.detailForm,
            submitType:0,
            annex:JSON.stringify([])
          }
          Api.create(saveData).then(res => {
            this.$message.success('创建成功')
            this.$router.push({ path: '/charge'})
          })
        }
      });
    }
  }
}
</script>
