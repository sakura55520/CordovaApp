<!--装料(操作任务)-->
<template>
  <div class="detailBox">
    <!-- 顶部信息卡片 -->
    <div class="topInfoCard">
      <!-- head -->
      <div class="headLine">
        <div>
          <span class="headLine-name">炉次号 &nbsp;&nbsp; </span>
          <span class="headLine-value">{{ detailInfo.code }}</span>
        </div>
      </div>
      <!-- body -->
      <div :class="'grid-container'">
        <div class="grid-item">
          <span class="grid-item-name">订单号：</span>
          <span class="grid-item-value">{{ detailInfo.productOrderName }}</span>
        </div>
        <div class="grid-item">
          <span class="grid-item-name">产品名称：</span>
          <span class="grid-item-value">{{ detailInfo.productName }}</span>
        </div>
        <div class="grid-item">
          <span class="grid-item-name">产品配方：</span>
          <span class="grid-item-value">{{ detailInfo.productFormula }}</span>
        </div>
      </div>
    </div>

    <Collapse>
      <div class="table-item" slot="context" v-if="bomList.productBomTypeDtos && bomList.productBomTypeDtos[0]">
        <div class="table-title">
          <strong>产品BOM</strong>
          <div style=" color: rgb(255, 185, 35)" v-if="bomList.productBomTypeDtos[0].name !== '数量'">
            总数量：
            {{ bomList.productBomTypeDtos[0].number }}
            （{{ bomList.productBomTypeDtos[0].productBomDetailDtos[0] ? bomList.productBomTypeDtos[0].productBomDetailDtos[0].unit : '' }}）
          </div>
        </div>
        <el-table :data="bomList.productBomTypeDtos[0].productBomDetailDtos">
          <el-table-column prop="materialCode" label="物料料号"/>
          <el-table-column prop="materialName" label="物料名称"/>
          <el-table-column prop="unit" label="单位"/>
          <el-table-column prop="numberBounds" label="标准范围"/>
          <el-table-column prop="realityNumber" label="投料数量"/>
        </el-table>
        <div class="table-title"><strong>工艺配方</strong></div>
        <el-table :data="processlist">
          <el-table-column prop="param" label="工艺参数"/>
          <el-table-column prop="value" label="工艺值"/>
        </el-table>
      </div>
    </Collapse>
    <!-- 其他表单卡片 -->
    <div class="fromCard">
      <div class="fromCard">
        <el-form :model="detailForm" label-width="135px" :rules="rules" ref="detailForm"
                 style="padding: 20px 10px 0 0;">
          <el-row>
            <el-col :span="24">
              <div class="headLine">
                <div class="headLine-title">录入工序数据</div>
              </div>
            </el-col>
            <el-col :span="24">
              <el-form-item label="坩埚编号" prop="crucibleCode">
                <CodeScanner
                  v-model="detailForm.crucibleCode"
                  placeholder="请扫描或输入坩埚编号"
                  @has-done="hasCrucible"
                />
                <div class="crucibleCode-info">坩埚使用次数：{{ detailForm.crucibleUseNum }}</div>
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item label="坩埚腐蚀情况" prop="crucibleCorrosionSituation">
                <el-radio-group v-model="detailForm.crucibleCorrosionSituation">
                  <el-radio
                    v-for="(item,i) in accessoriesStatusMap"
                    :label="item.value"
                    :key="i"
                  >
                    {{ item.name }}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <div class="headLine">
                <div class="headLine-title">录入装料数据</div>
              </div>
            </el-col>
            <el-col :span="24">
              <el-form-item label="清洗批次">
                <CodeScanner
                  v-model="detailForm.materialBatch"
                  placeholder="请扫描或输入批次号,多个批次号以逗号分隔"
                  @has-done="hasMaterialBatch(detailForm.materialBatch)"
                />

                <div
                  class="crucibleCode-info"
                  v-for="(item,i) in scanMaterialList"
                  :key="item.id"
                >
                  <div>
                    {{ `批次号:${item.cleanBatchNo}    物料名称:${item.materialName}    规格:${item.spec}    库存重量:${item.stock}` }}
                  </div>
                  <div>
                    <el-button
                      type="text"
                      style="color: red;padding: 5px;margin-right: 10px;"
                      class="el-icon-delete"
                      @click="scanMaterialList.splice(i,1)"
                    />
                  </div>
                </div>
              </el-form-item>
            </el-col>
          </el-row>

          <div class="headLine">
            <div class="headLine-title">添加剂信息</div>
          </div>

          <el-row class="main-wrap">
            <el-col :span="12">
              <el-form-item label="添加剂位置中心" prop="additiveLocationCenter">
                <el-input-number v-model="detailForm.additiveLocationCenter" style="width: 100%;" :min="0" @focus="$event.target.select()" :controls="false"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="添加剂位置高度" prop="additiveLocationHeight">
                <el-input-number v-model="detailForm.additiveLocationHeight" style="width: 100%;" :min="0" @focus="$event.target.select()" :controls="false"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="小坩埚空1(g)" prop="crucibleEmpty">
                <el-input-number v-model="detailForm.crucibleEmpty" style="width: 100%;" :min="0" @focus="$event.target.select()" :controls="false"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="小坩埚满1(g)" prop="crucibleFull">
                <el-input-number v-model="detailForm.crucibleFull" style="width: 100%;" :min="0" @focus="$event.target.select()" :controls="false"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="小坩埚空2(g)" prop="crucibleEmpty1">
                <el-input-number v-model="detailForm.crucibleEmpty1" style="width: 100%;" :min="0" @focus="$event.target.select()" :controls="false"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="小坩埚满2(g)" prop="crucibleFull1">
                <el-input-number v-model="detailForm.crucibleFull1" style="width: 100%;" :min="0" @focus="$event.target.select()" :controls="false"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="小坩埚空3(g)" prop="crucibleEmpty2">
                <el-input-number v-model="detailForm.crucibleEmpty2" style="width: 100%;" :min="0" @focus="$event.target.select()" :controls="false"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="小坩埚满3(g)" prop="crucibleFull2">
                <el-input-number v-model="detailForm.crucibleFull2" style="width: 100%;" :min="0" @focus="$event.target.select()" :controls="false"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="C原料" prop="crawMaterials">
                <el-select v-model="detailForm.crawMaterials" style="width: 100%;">
                  <el-option v-for="item in crawMaterialsMap" :value="item.value" :label="item.label" :key="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="小坩埚规格" prop="crucibleSpecs">
                <el-select v-model="detailForm.crucibleSpecs" style="width: 100%;">
                  <el-option v-for="item in crucibleSpecsMap" :value="item.value" :label="item.label" :key="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="原料处理方式" prop="crawPreHandle">
                <el-select v-model="detailForm.crawPreHandle" style="width: 100%;">
                  <el-option v-for="item in crawPreHandleMap" :value="item.value" :label="item.label" :key="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24">
              <el-form :model="detailForm" label-position="top" ref="fromTable">
                <div v-for="(item,i) in detailForm.details" :key="i">
                  <el-col>
                    <div class="headLine">
                      <div class="headLine-title">第{{ sequenceList[i] }}层</div>
                    </div>
                  </el-col>
                  <el-row :gutter="8" class="main-wrap">
                    <el-col :span="8">
                      <el-form-item label="目数" :prop="'details.' + i + '.meshNum'" :rules="[{ required: true, message: '请输入目数', trigger: 'blur' }]">
                        <el-select
                          v-model="item._meshNum"
                          style="width: 100%;"
                          @change="ruleWeight(i)"
                        >
                          <el-option
                            v-for="(item,i) in scanMaterialList"
                            :key="i"
                            :value="`${item.spec} (${item.cleanBatchNo})`"
                          >
                            <span>{{ item.spec }}</span>
                            <span class="select-info">({{ item.cleanBatchNo }})</span>
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="原料高度" :prop="'details.' + i + '.materialActualHeight'" :rules="[{ required: true, message: '请输入原料高度', trigger: 'blur' }]">
                        <div style="display: flex;">
                          <el-button class="charge-btn" type="info" plain>
                            {{
                              item.materialTheoryHeight
                            }}
                          </el-button>
                          <el-input-number v-model="item.materialActualHeight" style="width: 100%;" :min="0" @focus="$event.target.select()" :controls="false"></el-input-number>
                        </div>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="装料重量(g)" :prop="'details.' + i + '._weight_g'" :rules="[{ required: true, trigger: 'blur', message: ' ' }]">
                        <el-input-number
                          v-model="item._weight_g"
                          :class="{ 'error-input': validList[i] && validList[i] !== 'pass' }"
                          :min="0"
                          :precision="1"
                          :controls="false"
                          style="width: 100%;"
                          @focus="$event.target.select()"
                          @blur="validWeight(i)"
                        />
                        <i>{{ item.materialActualWeight }} kg</i>
                        <div v-show="validList[i] && validList[i] !== 'pass'" class="el-form-item__error">{{ validList[i] }}</div>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
              </el-form>
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
            <el-col :span="24">
              <el-form-item label="添加附件" prop="annex">
                <!-- 图片 -->
                <PhotoNew
                  v-model="imageList"
                  :name="'CHECK_DEVICE'"
                ></PhotoNew>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <el-dialog
      title="提示"
      :visible.sync="validateDialog"
      width="95%">
      <span v-html="dialogInnerText"></span>
      <span slot="footer">
        <el-button @click="validateDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitData">确定提交</el-button>
      </span>
    </el-dialog>

    <!-- 页面操作 -->
    <div class="pageHandleBox">
      <el-button class="save" @click="saveDetail(0)">保存</el-button>
      <el-button class="submit" type="primary" @click="saveDetail(1)">提交数据</el-button>
    </div>
  </div>
</template>

<script>
import * as Api from '@/api/charge'
import * as filling from '@/api/filling/filling.js'
import * as inStation from '@/api/inStation'
import * as cleanDry from '@/api/cleanDry'
import CodeScanner from '@/components/CodeScanner';
import Collapse from '@/views/components/collapse';
import PhotoNew from "@/views/components/photoNew.vue";
import {getSeleteData} from '@/utils/select.js'
import {processlistAll} from "@/api/filling/filling";

const deflutFrom = {
  annex: '[]',
  mark: '',
  materialBatch: '',
  crawMaterials: '',
  crucibleSpecs: '',
  crawPreHandle: '', // 原料处理方式
  crucibleEmpty: '',
  crucibleFull: '',
  crucibleEmpty1: '',
  crucibleFull1: '',
  crucibleEmpty2: '',
  crucibleFull2: '',
  additiveLocationHeight: '',
  additiveLocationCenter: '',
  crucibleCorrosionSituation: '',
  crucibleCode: '',
  crucibleUseNum: '',
}
export default {
  name: 'OperateTask',
  components: {
    PhotoNew,
    CodeScanner,
    Collapse
  },
  data() {
    return {
      detailInfo: {}, // 描述信息
      sequenceList: ['一', '二', '三', '四'],
      bomList: {},//bom信息
      validateDialog: false,//提示弹框
      dialogInnerText: '',
      scanMaterialList: [],//原料信息
      processlist: [],//工艺配方
      chargeList: [],//装料信息
      imageList: [],
      bomDataList: [],
      accessoriesStatusMap: [],
      crawMaterialsMap: [], // C原料map
      crucibleSpecsMap: [], // 小坩埚规格map
      crawPreHandleMap: [], // 原料处理方式map
      validList: [],
      detailForm: {},
      saveData: {},
      rules: {
        crucibleCode: [{required: true, message: '必填项', trigger: 'change'}],
        crucibleCorrosionSituation: [{required: true, message: '必填项', trigger: 'change'}],
        additiveLocationCenter: [{required: true, message: '必填项', trigger: 'change'}],
        additiveLocationHeight: [{required: true, message: '必填项', trigger: 'change'}],
        materialBatch: [{required: true, message: '必填项', trigger: 'change'}],
        crawMaterials: [{required: true, message: '必选项', trigger: 'change'}],
        crucibleSpecs: [{required: true, message: '必选项', trigger: 'change'}],
      }
    }
  },
  created() {
    //接收路由传参数据
    this.detailInfo = this.$route.query || {}
    //获取详情
    this.getChargeDetail()
    // this.$nextTick(res => {
    //   this.$refs['detailForm'].clearValidate()
    //   this.$refs['fromTable'].clearValidate()
    // })
  },
  mounted() {
    getSeleteData('accessoriesStatus', this.accessoriesStatusMap)
    getSeleteData('crawMaterials', this.crawMaterialsMap) // C原料map
    getSeleteData('crucibleSpecs', this.crucibleSpecsMap) // 小坩埚规格map
    getSeleteData('crawPreHandle', this.crawPreHandleMap) // 原料处理方式map
  },
  methods: {
    //获取详情
    getChargeDetail() {
      const data = sessionStorage.getItem('zl' + this.detailInfo.code)
      if (data) {
        const {scanMaterialList, ...detailForm} = JSON.parse(data)
        this.detailForm = detailForm || {}
        this.scanMaterialList = scanMaterialList || []
      } else {
        this.detailForm = Object.assign({}, deflutFrom, JSON.parse(JSON.stringify(this.detailInfo)))
        this.scanMaterialList = []
      }
      this.getBomInfoByMaterialCode(this.detailInfo.productCode)
      // 查询工艺配方
      this.fetchProcesslistAll()
      this.getChargeList()
    },
    getBomInfoByMaterialCode(materialCode, number) {
      filling.getBomInfoByMaterialCode({
        number: number,
        processCode: 'ZL',
        materialCode: materialCode,
      }).then(res => {
        this.bomList = res.data || {productBomTypeDtos: [{productBomDetailDtos: []}]}
        this.bomDataList = []
        const productBomTypeDtos = this.bomList.productBomTypeDtos
        if (productBomTypeDtos && productBomTypeDtos.length > 0 && productBomTypeDtos[0].productBomDetailDtos && productBomTypeDtos[0].productBomDetailDtos.length > 0) {
          this.bomDataList = productBomTypeDtos[0].productBomDetailDtos
        }
      }).catch(err => {
        if (this.bomList.productBomTypeDtos[0].productBomDetailDtos.length < 1) {
          this.$message.warning('无产品BOM,该页面将不允许操作和提交')
        }
      })
    },
    // 查询工艺配方
    fetchProcesslistAll() {
      filling.processlistAll({
        materialCode: this.detailInfo.productCode,
        processCode: 'ZL'
      }).then(res => {
        if (res.data && res.data.productSopTypeOperates && res.data.productSopTypeOperates.length > 0) {
          this.processlist = res.data.productSopTypeOperates[0].productSopDetailDtos
        } else {
          this.processlist = []
        }
        this.$nextTick(() => {
          this.$refs.collapse && this.$refs.collapse.cilicCollapse()
        })
      })
    },
    //获取循环表格数据
    getChargeList() {
      const theoryHeightlist = [15, 30, 55, 85]
      if (this.detailForm.details && this.detailForm.details.length === 4) {
        this.detailForm.details.forEach((element, i) => {
          element.materialTheoryHeight = theoryHeightlist[i]
        })
      } else {
        const list = []
        theoryHeightlist.forEach(item => {
          list.push({
            meshNum: '',//目数
            materialActualHeight: '',//实际高度
            materialTheoryHeight: item,//理论高度
            materialActualWeight: 0,//装料重量kg
            _weight_g: 0,//装料重量g
            lotNo: this.detailInfo.lotNo
          })
        })
        this.$set(this.detailForm, 'details', list)
      }
    },
    //扫描坩埚编号
    hasCrucible() {
      if (!this.detailForm.crucibleCode) return
      Api.listAllLife({search_EQ_uniqueCode: this.detailForm.crucibleCode, search_EQ_status: 0}).then(res => {
        if (res.data.length > 0) {
          this.$set(this.detailForm, 'crucibleUseNum', res.data[0].usefulLife)
        } else {
          this.$message.warning('无数据')
          this.detailForm.crucibleUseNum = ''
          this.detailForm.crucibleCode = ''
        }
      })
    },
    //扫描清洗批次
    hasMaterialBatch(batchNo) {
      if (!batchNo) return
      const materialCodeList = this.bomDataList.map(item => item.materialCode)
      const data = this.scanMaterialList.find(item => item.cleanBatchNo === batchNo)
      this.detailForm.materialBatch = ''
      if (data) return this.$message.warning('该批次已存在')

      cleanDry.getByCleanNo({
        cleanBatchNos: batchNo
      }).then(res => {
        if (res.data.length > 0) {
          let str = []
          res.data.forEach(element => {
            if (materialCodeList.includes(element.materialCode)) {
              this.scanMaterialList.push(element)
            } else {
              str.push(element.cleanBatchNo)
            }
          });
          if (str.length > 0) this.$message.warning(`[${str.join(',')}]该物料不符合bom`)
        } else {
          this.$message.warning('无数据')
        }
      })
    },
    //保存数据 保存到前端,提交到后端
    saveDetail(type) {
      const saveData = JSON.parse(JSON.stringify(this.detailForm))
      saveData.annex = JSON.stringify(this.imageList)
      saveData.submitType = 1
      saveData.lotNo = this.detailInfo.code
      saveData.scanMaterialList = this.scanMaterialList
      saveData.materialBatch = this.scanMaterialList.map(item => item.cleanBatchNo).join(',')
      if (!type) {
        sessionStorage.setItem('zl' + this.detailInfo.code, JSON.stringify(saveData))
        this.$message.success(`保存成功`)
        this.$router.push({path: '/charge'})
      } else {
        this.generate(saveData)
      }
    },
    //目数改变后验证重量
    ruleWeight(index) {
      // 赋值 物料信息
      const { _meshNum } = this.detailForm.details[index]
      const matchedMaterial = this.scanMaterialList.find(item => `${item.spec} (${item.cleanBatchNo})` === _meshNum)
      if (matchedMaterial) {
        this.detailForm.details[index].meshNum = matchedMaterial.spec // 目数
        this.detailForm.details[index].spec = matchedMaterial.spec // 规格
        this.detailForm.details[index].materialCode = matchedMaterial.materialCode // 物料料号
        this.detailForm.details[index].materialName = matchedMaterial.materialName // 物料名称
        this.detailForm.details[index].cleanBatchNo = matchedMaterial.cleanBatchNo // 清洗批次
      }

      // 全部重新校验
      this.validTotalWeight()

      // 判断BOM中哪些没被选择对应目数，将其清空
      let A = this.bomList.productBomTypeDtos[0].productBomDetailDtos
      let B = this.detailForm.details.map(item => {
        let res = this.scanMaterialList.filter(val => {
          if (item.meshNum) {
            return item.meshNum === val.spec
          }
        })
        return res[0] ? res[0].materialCode : false
      }).filter(item => item)

      let result = A.filter(itemA => !B.some(itemB => itemA.materialCode === itemB));
      result.forEach(item => {
        this.$set(item, 'realityNumber', undefined)
      })

    },
    calcRealityNumber(meshNum) {
      let weight = 0
      this.detailForm.details.forEach(item => {
        if (item.meshNum === meshNum && typeof item.materialActualWeight === 'number') {
          weight += item.materialActualWeight
        }
      })
      weight = Number(weight.toFixed(4))
      return weight
    },
    validTotalWeight() {
      for (let i = 0; i < this.detailForm.details.length; i++) {
        this.validWeight(i)
      }
      return !this.validList.some(result => result !== 'pass')
    },
    //重量验证
    validWeight(currentIdx) {
      if (!this.bomDataList || this.bomDataList.length === 0) {
        return this.$message.error('无产品BOM,该页面将不允许操作和提交')
      }
      const { meshNum, _weight_g, materialCode } = this.detailForm.details[currentIdx]
      if (!meshNum) return this.$set(this.validList, currentIdx, '请选择目数')

      // g 转换为 kg
      let kg = _weight_g / 1000
      kg = Number((kg).toFixed(4))
      if (Number.isNaN(kg)) kg = 0
      this.detailForm.details[currentIdx].materialActualWeight = kg // 装料重量kg

      // 更新 投料数量
      const bomData = this.bomDataList.find(item => item.materialCode === materialCode)
      const realityNumber = this.calcRealityNumber(meshNum)
      this.$set(bomData, 'realityNumber', realityNumber)

      // 校验重量是否在标准范围内
      this.validList = []
      const mesh2realityNumber = {}
      mesh2realityNumber[meshNum] = realityNumber
      this.detailForm.details.forEach((item, index) => {
        const { meshNum, materialCode } = item
        if (!meshNum) return

        let realityNumber = mesh2realityNumber[meshNum]
        if (!realityNumber) {
          mesh2realityNumber[meshNum] = realityNumber = this.calcRealityNumber(meshNum)
        }

        const bomData = this.bomDataList.find(item => item.materialCode === materialCode)
        const [min, max] = bomData.numberBounds.split('~')
        const result = (realityNumber < min || realityNumber > max) ? `总重量 [${realityNumber} kg] 不在 (${bomData.numberBounds} kg) 范围内` : 'pass'
        this.$set(this.validList, index, result)
      })


    },
    //数据验证
    ruleData() {
      for (let i = 0; i < this.bomList.productBomTypeDtos[0].productBomDetailDtos.length; i++) {
        let item = this.bomList.productBomTypeDtos[0].productBomDetailDtos[i]
        if (!item.realityNumber) {
          return this.$message.error(`${item.materialName}(${item.materialCode})投料数量不能为空，请选择对应目数物料`)
        }
      }
      //高度验证
      this.dialogInnerText = ``
      this.detailForm.details.forEach((item, i) => {
        if (item.materialTheoryHeight !== item.materialActualHeight) {
          this.dialogInnerText += `第${this.sequenceList[i]}层,理论高度<span style="padding: 5px;color:#409EFF; fontWeight: bloder">(${item.materialTheoryHeight})</span>和实际高度<span style="padding: 5px;color:red; fontWeight: bloder">(${item.materialActualHeight})</span>不一致,请核对<br>`
        }
      })
      if (!this.dialogInnerText) {
        this.submitData()
      } else {
        this.validateDialog = true
      }
    },
    //完成装料数据填写
    generate(data) {
      if (this.scanMaterialList.length === 0) return this.$message.warning('请扫描或输入清洗批次')
      this.$refs['detailForm'].validate(valid => {
        if (valid) {
          this.$refs['fromTable'].validate(valid1 => {
            if (valid1 && this.validTotalWeight()) {
              data.planOrderNo = data.productOrderName
              this.saveData = {
                processingOrderCode: this.detailInfo.code,
                param: {'坩埚拆装_装料_出站': JSON.stringify(data)},
                flowLineLable: '',
                processUuid: 's8bwl2v60j'
              }
              this.ruleData()
            }
          })
        }
      })
    },
    submitData() {
      inStation.outStation(this.saveData).then(res => {
        this.$message.success(`提交成功`)
        sessionStorage.removeItem('zl' + this.detailInfo.code)
        this.$router.push({path: '/charge'})
      })
    }
  }
}
</script>

<style lang="scss" scoped>

.table-title {
  color: #409eff;
  display: flex;
  height: 40px;
  line-height: 40px;
  font-size: 20px;
  margin: 5px 0;
  text-indent: 10px;
  background-color: #f5f5f5;
  justify-content: space-between;
}

.crucibleCode-info {
  text-indent: 10px;
  margin: 2px 0;
  background-color: #b3d8ff96;
  display: flex;
  justify-content: space-between;
}

.select-info {
  color: #8492a6;
}
.charge-btn {
  height: 40px;
  margin-right: 4px;
}
</style>
