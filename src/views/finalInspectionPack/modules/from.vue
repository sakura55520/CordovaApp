<!--晶体开炉(操作任务)-->
<template>
  <!-- 其他表单卡片 -->
  <div class="fromCard">
    <el-form ref="packForm" :model="detailForm" :rules="rules" label-width="120px">
      <div class="headLine">
        <div class="headLine-title">晶体数据</div>
      </div>
      <div class="main-wrap">
        <el-form-item label="籽晶编号">
          <el-input v-trim :value="$route.query.fromData ? $route.query.fromData.seedCode : ''" disabled/>
        </el-form-item>
      </div>

      <div class="headLine">
        <div class="headLine-title">录入工序数据</div>
      </div>
      <el-row>
        <div class="main-wrap">
          <el-col :span="12">
            <el-form-item label="中心厚度" prop="centerThickness">
              <el-input-number v-model="detailForm.centerThickness" :precision="2" :min="0" @focus="$event.target.select()" :controls="false"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="边缘厚度" prop="edgeThickness">
              <el-input-number v-model="detailForm.edgeThickness" :precision="2" :min="0" @focus="$event.target.select()" :controls="false"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="晶体凸度">
              <el-input-number :value="calcCrystalConvexity" :controls="false" placeholder="计算公式计算" disabled></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item class="mulline-label" label="预估有效厚度mm" prop="estimatedEffectiveThickness">
              <el-input-number v-model="detailForm.estimatedEffectiveThickness" :precision="2" :min="0" @focus="$event.target.select()" :controls="false"></el-input-number>
            </el-form-item>
          </el-col>
        </div>
        <el-col :span="24">
          <div class="headLine">
            <div class="headLine-title">结构缺陷</div>
          </div>
        </el-col>
        <div class="main-wrap">
          <el-table :data="detailForm.cruciblePackageDefectDetails">
            <el-table-column label="评级项目" prop="assessment"></el-table-column>
            <el-table-column label="缺陷描述" prop="defectDescription">
              <template slot-scope="{row}">
                <DialogInput v-model="row['defectDescription']"/>
              </template>
            </el-table-column>
            <el-table-column label="缺陷等级" prop="defectGrade">
              <template slot-scope="{row}">
                <el-select v-model="row['defectGrade']" style="width: 100%;" @change="handleDefectGradeChange">
                  <el-option v-for="item in corrosionDhjjMap" :key="item.value" :value="item.value"/>
                </el-select>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div class="main-wrap">
          <el-col :span="24" style="margin-top: 16px;">
            <el-form-item label="缺陷图示" prop="defectDiagram">
              <el-button type="primary" @click="dialogVisible = true">进入画板</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="表面缺陷" prop="surfaceDefects">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输入内容"
                v-model="detailForm.surfaceDefects">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="晶体缺陷描述" prop="defectDescription">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输入内容"
                v-model="detailForm.defectDescription">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="晶体等级" prop="crystalGrade">
              <el-select v-model="detailForm.crystalGrade">
                <el-option v-for="item in crystalGradeMap" :key="item.value" :value="item.value" :label="item.label"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="测评人" prop="gradePerson">
              <SelectUserinfo style="width: 100%;" v-model="detailForm.gradePerson"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="晶体去向" prop="destination">
              <el-radio-group v-model="detailForm.destination">
                <el-radio v-for="(item, index) in destinationMap" :label="item.label" :value="item.value" :key="index">{{ item.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="预估片数" prop="pieces">
              <el-input v-trim :value="calcPieces" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输入内容"
                v-model="detailForm.remark">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="添加附件">
              <!-- 图片 -->
              <PhotoNew
                v-model="imageList"
                :photoNum="6"
                :name="'CHECK_DEVICE'"
              ></PhotoNew>
            </el-form-item>
          </el-col>
        </div>

      </el-row>
    </el-form>
    <Fabric
      :dialogVisible.sync="dialogVisible"
      :backGroundImg="fabricRound"
      :fabricFromJson.sync="detailForm._defectDiagram_fabric"
      @getfabricFromJson="getfabricFromJson"
    />
  </div>
</template>

<script>
import {getSeleteData} from '@/utils/select.js'
import DialogInput from '@/views/components/dialogInput';
import PhotoNew from "@/views/components/photoNew.vue";
import Fabric from "@/views/components/Fabric.vue";
import SelectUserinfo from "@/components/select_userinfo";
import fabricRound from '@/assets/page_imgs/fabricRound.png'
import {round} from 'lodash-es'
import {base64ToBlob} from "@/utils";
import {uploadImage} from "@/api/file";

const deflutFrom = {
  centerThickness:'',
  photo:'',
  edgeThickness:'',
  crystalConvexity:'',
  estimatedEffectiveThickness:'',
  cruciblePackageDefectDetails:[],
  defectDiagram:'',
  surfaceDefects:'',
  defectDescription:'',
  crystalGrade:'',
  gradePerson:'',
  destination:'', // 晶体去向
  pieces:'', // 预估片数
  remark:''
}
export default {
  name: 'FinalInspectionPackFrom',
  props:{
    fromData:{
      type:Object,
      require:true
    }
  },
  components:{
    PhotoNew,
    DialogInput,
    Fabric,
    SelectUserinfo
  },
  data() {
    return {
      detailInfo:{}, // 描述信息
      imageList:[],
      corrosionDhjjMap:[],//缺陷等级
      crystalGradeMap:[],//晶体等级
      destinationMap:[],//晶体去向
      detailForm:{},
      dialogVisible:false,
      fabricRound,
      fabricFromJson:'',
      rules: {
        centerThickness: [{required: true, message: '必填项', trigger: 'change'}],
        photo: [{required: true, message: '必填项', trigger: 'change'}],
        edgeThickness: [{required: true, message: '必填项', trigger: 'change'}],
        estimatedEffectiveThickness: [{required: true, message: '必填项', trigger: 'change'}],
        cruciblePackageDefectDetails: [{required: true, message: '必填项', trigger: 'change'}],
        defectDescription: [{required: true, message: '必填项', trigger: 'change'}],
        crystalGrade: [{required: true, message: '必填项', trigger: 'change'}],
        gradePerson: [{required: true, message: '必填项', trigger: 'change'}],
        destination: [{required: true, message: '必选项', trigger: 'change'}]
      },

    }
  },
  computed: {
    calcCrystalConvexity() {
      // 晶体厚度 = 中心厚度 - 边缘厚度
      const { centerThickness, edgeThickness } = this.detailForm
      let rate = centerThickness - edgeThickness
      if (rate === Infinity || isNaN(rate)) rate = 0
      return Number(rate.toFixed(2))
    },
    calcPieces() {
      let pieces = null
      const { estimatedEffectiveThickness, destination } = this.detailForm
      if (!estimatedEffectiveThickness || !destination) return pieces

      const matched = this.destinationMap.find(item => item.value === destination)
      if (!matched) return pieces

      const coefficient = matched.extendValue
      if (isNaN(coefficient)) return pieces

      pieces = estimatedEffectiveThickness / coefficient
      if (pieces === Infinity || isNaN(pieces)) return null
      return round(pieces)
    }
  },
  async mounted() {
    getSeleteData('corrosionDhjj_zjbz',this.corrosionDhjjMap) // 缺陷等级map
    getSeleteData('crystalGrade',this.crystalGradeMap)
    this.getDetail()
    await getSeleteData('packDestination',this.destinationMap)
    // 晶体去向
    if (!this.detailForm.destination && this.destinationMap[0]) {
      this.detailForm.destination = this.destinationMap[0].value
    }
  },
  methods: {
    // public方法, 在父组件调用
    //获取详情
    getDetail(){
      this.detailForm = Object.assign({},deflutFrom,this.fromData)

      // 晶体去向
      if (!this.detailForm.destination && this.destinationMap[0]) {
        this.detailForm.destination = this.destinationMap[0].value
      }

      const assessmentList = ['相变','多晶','烧蚀','开裂','微管、孔洞','其他']
      if(this.detailForm.cruciblePackageDefectDetails.length === 0){
        assessmentList.forEach(item => {
          this.detailForm.cruciblePackageDefectDetails.push(
            {
              assessment:item,
              defectGrade:'',
              defectDescription:''
            }
          )
        })
      }

      // 附件
      try {
        this.imageList = JSON.parse(this.detailForm.photo)
      } catch (e) {}

      this.$nextTick(() => this.$refs.packForm.clearValidate())
    },
    // public方法, 在父组件调用
    // 获取填写验证
    async getRules(){
      try {
        this.detailForm.crystalConvexity = this.calcCrystalConvexity // 晶体厚度
        this.detailForm.pieces = this.calcPieces // 预估片数
        this.detailForm.photo = JSON.stringify(this.imageList)
        const viod = await this.$refs['packForm'].validate()
        return {
          viod,
          fromData:this.detailForm
        }
      } catch (error) {
        return {
          viod:false,
          fromData:this.detailForm
        }
      }
    },
    //画板数据回填
    getfabricFromJson(fabricFromJson, imgBase64) {
      this.detailForm._defectDiagram_fabric = fabricFromJson
      if (this.detailForm._defectDiagram_img !== imgBase64) {
        this.detailForm._defectDiagram_img = imgBase64
        this.uploadImage(imgBase64)
      }
    },
    uploadImage(imgBase64) {
      const data = new FormData()
      const base64String = imgBase64.replace('data:image/png;base64,', '')
      const blob = base64ToBlob(base64String, 'explain.png')
      data.append('file', blob, 'explain.png')
      this.detailForm.defectDiagram = ''
      uploadImage(data).then(res => {
        const imageBaseUrl = process.env.BASE_API_FILEPREVIEW
        this.detailForm.defectDiagram = imageBaseUrl + res.data.bigurl
      })
    },
    handleDefectGradeChange() {
      /*
        1、当“缺陷等级”有一个“C”时，晶体等级显示为“三等品”；
        2、当“缺陷等级”有一个“B”时，晶体等级显示为“二等品”；
        3、当“缺陷等级”全部为“A”时，晶体等级显示为“一等品”。
      * */

      const str = this.detailForm.cruciblePackageDefectDetails.map(row => row.defectGrade).join('')
      if (/C/.test(str)) {
        this.detailForm.crystalGrade = '三等品'
      } else if (/B/.test(str)) {
        this.detailForm.crystalGrade = '二等品'
      } else if (/^A+$/.test(str)) {
        this.detailForm.crystalGrade = '一等品'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-select {
  width: 100%;
}
</style>
