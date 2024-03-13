<!--开炉(出站) / 原料预处理-->
<template>
  <div class="fromCard">
    <div class="fromCard">
      <el-form :model="detailForm" label-width="140px" :rules="rules" ref="crystalForm" style="padding: 0 10px 0 0;">
        <el-row>
          <el-col :span="24">
            <div class="headLine">
              <div class="headLine-title">录入数据</div>
            </div>
          </el-col>
          <el-col :span="12">
            <el-form-item label="原料重kg" prop="rawMaterialWeight">
              <el-input v-trim v-model="detailForm.rawMaterialWeight" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="生长后全套重g" prop="_growthWeight_g">
              <el-input-number v-model="detailForm._growthWeight_g" :min="0" @focus="$event.target.select()" :controls="false" @blur="handleGrowthWeightBlur"/>
              <i>{{ detailForm.growthWeight }} kg</i>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="原料结果判断" prop="resultJudgment">
              <el-select v-model="detailForm.resultJudgment">
                <el-option v-for="item in materialResultMap" :key="item.name" :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输入内容"
                v-model="detailForm.mark">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="添加附件">
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
</template>

<script>
import {getSeleteData} from '@/utils/select.js'
import ObtainInput from '@/views/components/obtainInput';
import PhotoNew from "@/views/components/photoNew.vue";
import {round} from "lodash-es";

const deflutFrom = {
  createUser:'',
  createTime:'',
  rawMaterialWeight:'',
  _growthWeight_g:undefined,
  growthWeight:undefined,
  resultJudgment:'',
  mark:'',
  annex:'[]'
}
export default {
  name: 'MaterialPre',
  props:{
    fromData:{
      type:Object,
      require:true
    }
  },
  components:{
    PhotoNew,
    ObtainInput
  },
  data() {
    return {
      detailInfo:{}, // 描述信息
      imageList:[],
      materialResultMap:[],
      detailForm:{},
      rules:{}
    }
  },
  mounted() {
    getSeleteData('materialResult',this.materialResultMap)
  },
  methods: {
    getDetail(){
      this.detailForm = Object.assign({},deflutFrom,this.fromData)
      //原料重量g
      this.detailForm.rawMaterialWeight = this.$route.query.fromData.rawWeight

      //增加验证
      for(let key in deflutFrom){
        this.$set(this.rules,key,[{ required: true, message: '必填项', trigger: 'change' }])
      }
      this.$nextTick(() => {
        this.$refs.crystalForm.clearValidate()
      })
    },
    async getRules(){
      try {
        this.detailForm.annex = JSON.stringify(this.imageList)
        const viod = await this.$refs['crystalForm'].validate()
        return {
          viod: typeof viod === 'boolean',
          fromData:this.detailForm
        }
      } catch (error) {
        return {
          viod: false,
          fromData:this.detailForm
        }
      }

    },
    handleGrowthWeightBlur() {
      // g 转换为 kg
      const kg = this.detailForm._growthWeight_g / 1000
      this.$set(this.detailForm, 'growthWeight', round(kg, 4) || 0)
    }
  }
}
</script>
