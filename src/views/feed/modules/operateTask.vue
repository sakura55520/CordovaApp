<!--
装炉(操作任务)
orderType: 1合成, 2原料预处理, 3长晶
-->
<template>
  <div class="detailBox">
    <!-- 顶部信息卡片 -->
    <div class="topInfoCard">
      <!-- head -->
      <div class="headLine">
        <div>
          <span class="headLine-name">炉次号 &nbsp;&nbsp; </span>
          <span class="headLine-value">{{ detailForm.lotNo }}</span>
        </div>
      </div>
      <!-- body -->
      <div :class="'grid-container'">
        <div class="grid-item">
          <span class="grid-item-name">订单号：</span>
          <span class="grid-item-value">{{ detailForm.planOrderNo }}</span>
        </div>
        <div class="grid-item">
          <span class="grid-item-name">产品名称：</span>
          <span class="grid-item-value">{{ detailForm.productName }}</span>
        </div>
        <div class="grid-item">
          <span class="grid-item-name">产品配方：</span>
          <span class="grid-item-value">{{ detailForm.productFormula }}</span>
        </div>
      </div>
    </div>
    <!-- 表格详情数据 -->
    <Collapse v-if="formulaList.length > 0">
      <div slot="context" class="table-item">
        <div class="table-title"><strong>工艺配方</strong></div>
        <!-- <el-table :data="formulaList">
          <el-table-column label="工艺参数" prop="oneColumn"></el-table-column>
          <el-table-column label="工艺值" prop="twoColumn"></el-table-column>
          <el-table-column label="工艺参数" prop="threeColumn"></el-table-column>
          <el-table-column label="工艺值" prop="fourColumn"></el-table-column>
        </el-table> -->
        <el-table :data="formulaList">
          <el-table-column label="工艺参数" prop="param"/>
          <el-table-column label="工艺值" prop="value"/>
        </el-table>
      </div>
    </Collapse>
    <!-- 其他表单卡片 -->
    <div class="fromCard">
      <el-form ref="detailForm" :model="detailForm" :rules="rules" label-width="140px" style="padding: 0 10px 0 0;">
        <el-row class="ot-field">
          <el-col :span="24">
            <div class="headLine">
              <div class="headLine-title">录入工序数据</div>
            </div>
          </el-col>
          <el-col :span="24">
            <el-form-item label="加工机台号" prop="machineNumber">
              <CodeScanner v-model="detailForm.machineNumber" placeholder="请扫描或输入加工机台号" @has-done="hasDon"/>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 进站 -->
        <template v-if="isIn">
          <el-row>
            <el-col :span="12">
              <el-form-item label="操作人" prop="createUser">
                <SelectUserMultiple v-model="detailForm.createUser"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="坩埚水平" prop="crucibleBalance">
                <div class="col-button">
                  <el-select v-model="refForm.crucibleBalance" class="ref-value">
                    <el-option v-for="item in refCrucibleBalanceList" :value="item" :key="item"/>
                  </el-select>
                  <el-input v-trim v-model="detailForm.crucibleBalance" style="width: 100%;"></el-input>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item :label="`${device}1与2间距`" prop="heater1Heater2Distance">
                <div class="col-button">
                  <el-select v-model="refForm.heater1Heater2Distance" class="ref-value">
                    <el-option v-for="item in refDistance12List" :value="item" :key="item"/>
                  </el-select>
                  <el-input-number v-model="detailForm.heater1Heater2Distance" :controls="false" :min="0" style="width: 100%;" @focus="$event.target.select()"/>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="`${device}2与3间距`" prop="heater2Heater3Distance">
                <div class="col-button">
                  <el-select v-model="refForm.heater2Heater3Distance" class="ref-value">
                    <el-option v-for="item in refDistance23List" :value="item" :key="item"/>
                  </el-select>
                  <el-input-number v-model="detailForm.heater2Heater3Distance" :controls="false" :min="0" style="width: 100%;" @focus="$event.target.select()"/>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="坩埚埚位" prop="cruciblePosition">
                <div class="col-button">
                  <el-select v-model="refForm.cruciblePosition" class="ref-value">
                    <el-option v-for="item in refCruciblePositionList" :value="item" :key="item"/>
                  </el-select>
                  <el-input-number v-model="detailForm.cruciblePosition" :controls="false" :min="0" style="width: 100%;" @focus="$event.target.select()"/>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="软毡" required>
                <div class="col-button">
                  <el-form-item label-width="0" prop="softFeltMin">
                    <el-input v-trim type="number" v-model="detailForm.softFeltMin">
                      <template slot="prepend">Φ</template>
                    </el-input>
                  </el-form-item>
                  <el-form-item label-width="0" prop="softFeltMax">
                    <el-input v-trim type="number" v-model="detailForm.softFeltMax">
                      <template slot="append">层</template>
                    </el-input>
                  </el-form-item>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="顶环间隙" required>
                <div class="col-button">
                  <el-form-item label-width="0" prop="topRingClearance1">
                    <el-input v-trim type="number" v-model="detailForm.topRingClearance1" placeholder="间隙1"/>
                  </el-form-item>
                  <el-form-item label-width="0" prop="topRingClearance2">
                    <el-input v-trim type="number" v-model="detailForm.topRingClearance2" placeholder="间隙2"/>
                  </el-form-item>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="顶盖抬起高度" prop="topLiftingHeight">
                <div class="col-button">
                  <el-select v-model="refForm.topLiftingHeight" class="ref-value">
                    <el-option v-for="item in refTopLiftingList" :value="item" :key="item"/>
                  </el-select>
                  <el-input-number v-model="detailForm.topLiftingHeight" :controls="false" :min="0" style="width: 100%;" @focus="$event.target.select()"/>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="顶保温结构" prop="topInsulationStructure">
                <div class="col-button">
                  <el-select v-model="refForm.topInsulationStructure" class="ref-value">
                    <el-option v-for="item in refTopInsulationList" :value="item" :key="item"/>
                  </el-select>
                  <el-input-number v-model="detailForm.topInsulationStructure" :controls="false" :min="0" style="width: 100%;" @focus="$event.target.select()"/>
                </div>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="坩埚编号" prop="crucibleCode">
                <el-input v-trim v-model="detailForm.crucibleCode"/>
              </el-form-item>
            </el-col>

            <!--合成-->
            <template v-if="detailForm.orderType === 1">
              <el-col :span="12">
                <el-form-item label="坩埚段编号" prop="crucibleSectionCode">
                  <el-input v-trim v-model="detailForm.crucibleSectionCode"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="石墨件9编号" prop="graphitePiece9">
                  <el-input v-trim v-model="detailForm.graphitePiece9"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="坩埚盖编号" prop="crucibleCover">
                  <el-input v-trim v-model="detailForm.crucibleCover"/>
                </el-form-item>
              </el-col>
            </template>

            <!--          <template>-->
            <!--            <el-col :span="12">-->
            <!--              <el-form-item label="结果判定" prop="crucibleCorrosionSituation">-->
            <!--                <el-select v-model="detailForm.crucibleCorrosionSituation" style="width: 100%;">-->
            <!--                  <el-option v-for="item in accessoriesStatusMap" :key="item.name" :label="item.label"-->
            <!--                             :value="item.value"/>-->
            <!--                </el-select>-->
            <!--              </el-form-item>-->
            <!--            </el-col>-->
            <!--          </template>-->

            <!--长晶-->
            <template v-if="detailForm.orderType === 3">
              <el-col :span="12">
                <el-form-item label="顶盖编号" prop="accessTopCapNo">
                  <el-input v-trim v-model="detailForm.accessTopCapNo"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="支撑环编号" prop="accessSupportRingNo">
                  <el-input v-trim v-model="detailForm.accessSupportRingNo"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="上板编号" prop="accessUpperRingNo">
                  <el-input v-trim v-model="detailForm.accessUpperRingNo"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="段1编号" prop="accessSegOneNo">
                  <el-input v-trim v-model="detailForm.accessSegOneNo"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="段2编号" prop="accessSegTwoNo">
                  <el-input v-trim v-model="detailForm.accessSegTwoNo" @blur="hasNo('accessSegTwoNo')"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="限位环编号" prop="accessStopRingNo"><el-input v-trim v-model="detailForm.accessStopRingNo"/></el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="C段2编号" prop="ccAccessSegTwoNo">
                  <el-input v-trim v-model="detailForm.ccAccessSegTwoNo" @blur="hasNo('ccAccessSegTwoNo')"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="顶环编号" prop="topRingCode">
                  <el-input v-trim v-model="detailForm.topRingCode"/>
                </el-form-item>
              </el-col>
              <!--              <el-col :span="12">-->
              <!--                <el-form-item label="X原料编号" prop="xrawNo"><el-input v-trim v-model="detailForm.xrawNo"/></el-form-item>-->
              <!--              </el-col>-->
              <!--              <el-col :span="12">-->
              <!--                <el-form-item label="XX原料编号" prop="xxrawNo"><el-input v-trim v-model="detailForm.xxrawNo"/></el-form-item>-->
              <!--              </el-col>-->
            </template>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="电极1是否导通" prop="electrodeInspection12">
                <el-radio-group v-model="detailForm.electrodeInspection12">
                  <el-radio v-for="item in ynMap" :key="item" :label="item"/>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="电极2是否导通" prop="electrodeInspection13">
                <el-radio-group v-model="detailForm.electrodeInspection13">
                  <el-radio v-for="item in ynMap" :key="item" :label="item"/>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="电极3是否导通" prop="electrodeInspection23">
                <el-radio-group v-model="detailForm.electrodeInspection23">
                  <el-radio v-for="item in ynMap" :key="item" :label="item"/>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="分水器开关" prop="waterDividerSwitch">
                <el-radio-group v-model="detailForm.waterDividerSwitch">
                  <el-radio v-for="item in triggerMap" :key="item" :label="item"/>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="电缆线是否老化" prop="cableAging">
                <el-radio-group v-model="detailForm.cableAging">
                  <el-radio v-for="item in ynMap" :key="item" :label="item"/>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="正空泵油是否低于2/3" label-width="200px" prop="positivePumpOil">
                <el-radio-group v-model="detailForm.positivePumpOil">
                  <el-radio v-for="item in ynMap" :key="item" :label="item"/>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24">
              <el-form-item label="压缩空气压力" prop="compressedAirPressure">
                <el-radio-group v-model="detailForm.compressedAirPressure">
                  <el-radio label="<0.45"/>
                  <el-radio label="0.45-0.6"/>
                  <el-radio label=">0.6"/>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="氩气压力" prop="argonPressure">
                <el-radio-group v-model="detailForm.argonPressure">
                  <el-radio label="<0.2"/>
                  <el-radio label="0.2-0.3"/>
                  <el-radio label=">0.3"/>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="氮气压力" prop="nitrogenPressure">
                <el-radio-group v-model="detailForm.nitrogenPressure">
                  <el-radio label="<0.2"/>
                  <el-radio label="0.2-0.3"/>
                  <el-radio label=">0.3"/>
                </el-radio-group>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="石墨轴是否吹扫" prop="cleanGraphiteAxis">
                <el-radio-group v-model="detailForm.cleanGraphiteAxis">
                  <el-radio v-for="item in ynMap" :key="item" :label="item"/>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="测温窗是否清理" prop="cleanTempWindow">
                <el-radio-group v-model="detailForm.cleanTempWindow">
                  <el-radio v-for="item in ynMap" :key="item" :label="item"/>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </template>

        <!-- 出站 -->
        <el-row v-if="isOut">
          <el-col :span="24">
            <el-form-item label="操作人" prop="updateUser">
              <SelectUserMultiple v-model="detailForm.updateUser"/>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 出站 && 长晶 -->
        <template v-if="isOut && detailForm.orderType === 3">
          <el-row>
            <el-col :span="12">
              <el-form-item class="mulline-label" label="顶部温度℃ (30000pa-2h)" prop="topTemperature1">
                <el-input-number v-model="detailForm.topTemperature1" :controls="false" :precision="2" style="width: 100%;" @focus="$event.target.select()"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item class="mulline-label" label="底部温度℃ (30000pa-2h)" prop="bottomTemperature1">
                <el-input-number v-model="detailForm.bottomTemperature1" :controls="false" :precision="2" style="width: 100%;" @focus="$event.target.select()"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item class="mulline-label" label="顶部温度℃ (300pa-5h)" prop="topTemperature2">
                <el-input-number v-model="detailForm.topTemperature2" :controls="false" :precision="2" style="width: 100%;" @focus="$event.target.select()"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item class="mulline-label" label="底部温度℃ (300pa-5h)" prop="bottomTemperature2">
                <el-input-number v-model="detailForm.bottomTemperature2" :controls="false" :precision="2" style="width: 100%;" @focus="$event.target.select()"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item class="mulline-label" label="顶部温度℃ (300pa-90h)" prop="topTemperature3">
                <el-input-number v-model="detailForm.topTemperature3" :controls="false" :precision="2" style="width: 100%;" @focus="$event.target.select()"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item class="mulline-label" label="底部温度℃ (300pa-90h)" prop="bottomTemperature3">
                <el-input-number v-model="detailForm.bottomTemperature3" :controls="false" :precision="2" style="width: 100%;" @focus="$event.target.select()"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item class="mulline-label" label="顶部温度℃ (300pa-150h)" prop="topTemperature4">
                <el-input-number v-model="detailForm.topTemperature4" :controls="false" :precision="2" style="width: 100%;" @focus="$event.target.select()"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item class="mulline-label" label="底部温度℃ (300pa-150h)" prop="bottomTemperature4">
                <el-input-number v-model="detailForm.bottomTemperature4" :controls="false" :precision="2" style="width: 100%;" @focus="$event.target.select()"/>
              </el-form-item>
            </el-col>
          </el-row>
        </template>

        <el-row>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input
                v-model="detailForm.remark"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输入内容"
                type="textarea">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="添加附件">
              <!-- 图片 -->
              <PhotoNew
                v-model="imageList"
                :componentDisabled="disabled"
                :name="'CHECK_DEVICE'"
                :photoNum="6"
              ></PhotoNew>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <el-dialog
      :visible.sync="validateDialog"
      title="提示"
      width="500px">
      <span v-html="dialogInnerText"></span>
      <span slot="footer">
        <el-button @click="validateDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitData">确定提交</el-button>
      </span>
    </el-dialog>

    <!--  路线选择  -->
    <el-dialog
      title="路线选择"
      :visible.sync="routeDialogVisible"
      width="80%"
      :before-close="closeRouteDialog"
    >
      <el-select v-model="flowLineLable" placeholder="请选择路线">
        <el-option
          v-for="(item, index) in flowLineMap"
          :key="index"
          :label="item.label"
          :value="item.label"
        />
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeRouteDialog">取 消</el-button>
        <el-button type="primary" @click="handleSubmit()">确 定</el-button>
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
import * as Api from '@/api/feed'
import { listAllLife } from '@/api/charge'
import * as inStation from '@/api/inStation'
import CodeScanner from '@/components/CodeScanner';
import Collapse from '@/views/components/collapse';
import PhotoNew from "@/views/components/photoNew.vue";
import SelectUserMultiple from "@/components/SelectUserMultiple.vue";
import {getSeleteData} from '@/utils/select.js'

const defaultForm = {
  machineNumber: '', // 加工机台号

  // 进站
  createUser: '', // 进站操作人
  batchNo: '',
  crucibleBalance: undefined,
  cruciblePosition: undefined,
  heater1Heater2Distance: undefined,
  heater2Heater3Distance: undefined,
  lotNo: '',
  photo: '[]',
  processFormula: '',
  productFormula: '',
  productName: '',
  remark: '',
  topInsulationStructure: undefined,
  topLiftingHeight: undefined,
  crucibleCode: null, // 坩埚编号
  crucibleSectionCode: null, // 坩埚段编号
  graphitePiece9: null, // 石墨件9编号
  crucibleCover: null, // 坩埚盖编号
  crucibleCorrosionSituation: null, // 结果判定
  accessTopCapNo: null, // 顶盖编号
  accessSupportRingNo: null, // 支撑环编号
  accessUpperRingNo: null, // 上板编号
  accessSegOneNo: null, // 段1编号
  accessSegTwoNo: null, // 段2编号
  accessStopRingNo: null, // 限位环编号
  ccAccessSegTwoNo: null, // C段2编号
  topRingCode: null, // 顶环编号
  // xrawNo: null, // X原料编号
  // xxrawNo: null // XX原料编号
  electrodeInspection12: '是', // 电极1是否导通
  electrodeInspection13: '是', // 电极2是否导通
  electrodeInspection23: '是', // 电极3是否导通
  waterDividerSwitch: '开', // 分水器开关
  cableAging: '是', // 电缆线是否老化
  positivePumpOil: '是', // 正空泵油是否低于2/3
  compressedAirPressure: '<0.45', // 压缩空气压力
  argonPressure: '<0.2', // 氩气压力
  nitrogenPressure: '<0.2', // 氮气压力
  cleanGraphiteAxis: '是', // 石墨轴是否吹扫
  cleanTempWindow: '是', // 测温窗是否清理
  softFeltMin: null, // 软毡层数min
  softFeltMax: null, // 软毡层数max
  topRingClearance1: null, // 顶环间隙1
  topRingClearance2: null, // 顶环间隙2

  // 出站
  updateUser: '', // 出站操作人
  topTemperature1: undefined, // 顶部温度℃ (30000pa-2h)
  bottomTemperature1: undefined, // 底部温度℃ (30000pa-2h)
  topTemperature2: undefined, // 顶部温度℃ (300pa-5h)
  bottomTemperature2: undefined, // 底部温度℃ (300pa-5h)
  topTemperature3: undefined, // 顶部温度℃ (300pa-90h)
  bottomTemperature3: undefined, // 底部温度℃ (300pa-90h)
  topTemperature4: undefined, // 顶部温度℃ (300pa-150h)
  bottomTemperature4: undefined // 底部温度℃ (300pa-150h)
}



export default {
  name: 'feedDetalis',
  components: {
    SelectUserMultiple,
    PhotoNew,
    CodeScanner,
    Collapse
  },
  data() {
    return {
      overStation: {}, // 过站信息
      disabled: true,
      validateDialog: false,
      dialogInnerText: '',
      imageList: [],
      detailForm: Object.assign({}, defaultForm),
      // 参考值list
      refCrucibleBalanceList: [],
      refDistance12List: [],
      refDistance23List: [],
      refCruciblePositionList: [],
      refTopLiftingList: [],
      refTopInsulationList: [],
      refForm: {
        heater1Heater2Distance: null, // 1与2间距
        heater2Heater3Distance: null, // 2与3间距
        cruciblePosition: null, // 坩埚埚位
        topLiftingHeight: null, // 顶盖抬起高度
        topInsulationStructure: null, // 顶保温结构
      },
      formulaList: [],
      saveData: {},
      rules: {
        batchNo: [{required: true, message: '必填项', trigger: 'change'}],
        crucibleBalance: [{required: true, message: '必填项', trigger: 'change'}],
        cruciblePosition: [{required: true, message: '必填项', trigger: 'change'}],
        heater1Heater2Distance: [{required: true, message: '必填项', trigger: 'change'}],
        heater2Heater3Distance: [{required: true, message: '必填项', trigger: 'change'}],
        lotNo: [{required: true, message: '必填项', trigger: 'change'}],
        machineNumber: [{required: true, message: '必填项', trigger: 'change'}],
        createUser: [{required: true, message: '必填项', trigger: 'change'}],
        photo: [{required: true, message: '必填项', trigger: 'change'}],
        processFormula: [{required: true, message: '必填项', trigger: 'change'}],
        productFormula: [{required: true, message: '必填项', trigger: 'change'}],
        productName: [{required: true, message: '必填项', trigger: 'change'}],
        remark: [{required: true, message: '必填项', trigger: 'change'}],
        topInsulationStructure: [{required: true, message: '必填项', trigger: 'change'}],
        topLiftingHeight: [{required: true, message: '必填项', trigger: 'change'}],
        crucibleCode: [{required: true, message: '必填项', trigger: 'change'}],
        crucibleSectionCode: [{required: true, message: '必填项', trigger: 'change'}],
        graphitePiece9: [{required: true, message: '必填项', trigger: 'change'}],
        crucibleCover: [{required: true, message: '必填项', trigger: 'change'}],
        crucibleCorrosionSituation: [{required: true, message: '必填项', trigger: 'change'}],
        accessTopCapNo: [{required: true, message: '必填项', trigger: 'change'}],
        accessSupportRingNo: [{required: true, message: '必填项', trigger: 'change'}],
        accessUpperRingNo: [{required: true, message: '必填项', trigger: 'change'}],
        accessSegOneNo: [{required: true, message: '必填项', trigger: 'change'}],
        accessStopRingNo: [{required: true, message: '必填项', trigger: 'change'}],
        topRingCode: [{required: true, message: '必填项', trigger: 'change'}],
        electrodeInspection12: [{required: true, message: '必填项', trigger: 'change'}],
        electrodeInspection13: [{required: true, message: '必填项', trigger: 'change'}],
        electrodeInspection23: [{required: true, message: '必填项', trigger: 'change'}],
        waterDividerSwitch: [{required: true, message: '必填项', trigger: 'change'}],
        cableAging: [{required: true, message: '必填项', trigger: 'change'}],
        positivePumpOil: [{required: true, message: '必填项', trigger: 'change'}],
        compressedAirPressure: [{required: true, message: '必填项', trigger: 'change'}],
        argonPressure: [{required: true, message: '必填项', trigger: 'change'}],
        nitrogenPressure: [{required: true, message: '必填项', trigger: 'change'}],
        cleanGraphiteAxis: [{required: true, message: '必填项', trigger: 'change'}],
        cleanTempWindow: [{required: true, message: '必填项', trigger: 'change'}],
        softFeltMin: [{required: true, message: '必填项', trigger: 'blur'}],
        softFeltMax: [{required: true, message: '必填项', trigger: 'blur'}],
        topRingClearance1: [{required: true, message: '必填项', trigger: 'blur'}],
        topRingClearance2: [{required: true, message: '必填项', trigger: 'blur'}],
        topTemperature1: [{required: true, message: '必填项', trigger: 'blur'}],
        bottomTemperature1: [{required: true, message: '必填项', trigger: 'blur'}],
        topTemperature2: [{required: true, message: '必填项', trigger: 'blur'}],
        bottomTemperature2: [{required: true, message: '必填项', trigger: 'blur'}],
        topTemperature3: [{required: true, message: '必填项', trigger: 'blur'}],
        bottomTemperature3: [{required: true, message: '必填项', trigger: 'blur'}],
        topTemperature4: [{required: true, message: '必填项', trigger: 'blur'}],
        bottomTemperature4: [{required: true, message: '必填项', trigger: 'blur'}],
      },
      device: '',
      ynMap: ['是', '否'],
      triggerMap: ['开', '关'],
      accessoriesStatusMap: [], // 结果判定map
      routeDialogVisible: false,
      flowLineLable: undefined,
      flowLineMap: [],
    }
  },
  computed: {
    isIn() {
      return this.overStation.wipStorageStatus === 0
    },
    isOut() {
      return this.overStation.wipStorageStatus === 1
    },
  },
  created() {
    this.detailForm = Object.assign({}, defaultForm)
    //接收路由传参数据
    this.overStation = this.$route.query || {}
    this.overStation.wipStorageStatus = Number(this.overStation.wipStorageStatus)
    this.getDetail()
  },
  mounted() {
    getSeleteData('accessoriesStatus', this.accessoriesStatusMap) // 结果判定map

    // 参考值
    this.fetchRef()
  },
  methods: {
    //获取详情
    getDetail() {
      if (!this.overStation.processingOrderCode) return this.$message.error('过站信息有误,请验证后重新操作')
      const data = sessionStorage.getItem('zl' + this.overStation.processingOrderCode)
      if (data) {
        this.detailForm = JSON.parse(data)
        this.formulaList = JSON.parse(this.detailForm.processFormula)
        this.device = this.formatDevice()
      } else {
        this.fetchDetail()
      }
      this.$nextTick(() => this.$refs.detailForm.clearValidate())
    },
    async fetchDetail() {
      await Api.listByPage({
        search_EQ_processName: '装炉',
        search_EQ_code: this.overStation.processingOrderCode,
        page: 1,
        rows: 10
      }).then(res => {
        if (res.data && res.data.rows.length > 0) {
          this.detailForm = Object.assign({}, defaultForm, JSON.parse(JSON.stringify(res.data.rows[0])))
          this.getSopData()
          this.device = this.formatDevice()
        }
      })

      this.detailForm = Object.assign({}, this.detailForm, this.$route.query.fromData)
    },
    //获取sop信息
    getSopData() {
      Api.getProductSop({
        materialCode: this.detailForm.productCode,
        processCode: this.overStation.wipStorageCode
      }).then(res => {
        if (res.data && res.data.productSopTypeOperates && res.data.productSopTypeOperates[0]) {
          this.formulaList = res.data.productSopTypeOperates[0].productSopDetailDtos || []
        }
      })
    },
    //扫码验证机台号
    hasDon() {
      console.log('this.detailForm.equipmentCode', this.detailForm.equipmentCode)
      if (this.detailForm.machineNumber !== this.detailForm.equipmentCode) {
        this.$message.warning('装炉设备错误')
        this.detailForm.machineNumber = ''
      }
    },
    formatDevice() {
      switch (this.detailForm.orderType) {
        case 1:
          return '合成炉'
        case 2:
          return '原料预处理炉'
        case 3:
          return '长晶炉'
        default:
          return '合成炉'
      }
    },
    //保存数据 保存到前端,提交到后端
    saveDetail(type) {
      const data = JSON.parse(JSON.stringify(this.detailForm))
      data.submitType = 1
      data.processFormula = JSON.stringify(this.formulaList)
      if (!type) {
        sessionStorage.setItem('zl' + this.overStation.processingOrderCode, JSON.stringify(data))
        this.$message.success(`保存成功`)
        this.$router.push({path: '/feed'})
      } else {
        data.photo = JSON.stringify(this.imageList)

        this.saveData = {
          processingOrderCode: this.overStation.processingOrderCode,
          param: {[this.isIn ? '装炉任务_进站' : 'FormData']: JSON.stringify(data)},
          flowLineLable: this.flowLineLable,
          processUuid: this.overStation.processUuid,
          orderType: data.orderType,
          wipStorageStatus: this.overStation.wipStorageStatus
        }
        this.generate()
      }
    },
    //数据验证
    ruleData() {
      this.dialogInnerText = ``

      const compareList = [
        { field: 'crucibleBalance', name: '坩埚水平' },
        { field: 'heater1Heater2Distance', name: `${this.device}1与2间距` },
        { field: 'heater2Heater3Distance', name: `${this.device}2与3间距` },
        { field: 'cruciblePosition', name: '坩埚埚位' },
        { field: 'topLiftingHeight', name: '顶盖抬起高度' },
        { field: 'topInsulationStructure', name: '顶保温结构' },
      ]

      compareList.forEach(({ field, name }) => {
        const refVal = this.refForm[field]
        const val = this.detailForm[field]
        if (refVal !== val) {
          this.dialogInnerText += `${name},理论值<span style="padding: 5px;color:#409EFF; fontWeight: bloder">(${refVal})</span>和实际值<span style="padding: 5px;color:red; fontWeight: bloder">(${val})</span>不一致, 请核对!<br>`
        }
      })

      if (!this.dialogInnerText) {
        this.submitData()
      } else {
        this.validateDialog = true
      }
    },
    //完成籽晶安装数据填写
    generate() {
      this.$refs['detailForm'].validate(valid => {
        if (valid) {
          this.ruleData()
        }
      })
    },
    submitData() {
      inStation.inOrOutStation(this.saveData).then(res => {
        this.$message.success(`提交成功`)
        sessionStorage.removeItem('zl' + this.overStation.processingOrderCode)
        this.$router.push({path: '/feed'})
      }).catch(res=>{
        if (res.code == "201") {
          this.routeDialogVisible = true;
          this.flowLineMap = res.data;
        }
      })
    },
    handleSubmit() {
      this.submitData()
    },
    closeRouteDialog() {
      this.saveData.flowLineLable = this.flowLineLable
      this.routeDialogVisible = false;
      this.flowLineLable = undefined;
    },
    //扫码验证
    hasNo(filed){
      if(!this.detailForm[filed])return
      listAllLife({search_EQ_uniqueCode:this.detailForm[filed],search_EQ_status:0}).then(res => {
        if(res.data.length <= 0){
          this.$message.warning('无数据')
          this.$set(this.detailForm,filed,'')
        }
      })
    },
    fetchRef() {
      const dict = []
      getSeleteData('feedReference', dict).then(() => {
        this.refCrucibleBalanceList = this.calcRefList(dict, '坩埚水平')
        this.refForm.crucibleBalance = this.refCrucibleBalanceList[0]

        this.refDistance12List = this.calcRefList(dict, '设备1与2间距')
        this.refForm.heater1Heater2Distance = this.refDistance12List[0]

        this.refDistance23List = this.calcRefList(dict, '设备2与3间距')
        this.refForm.heater2Heater3Distance = this.refDistance23List[0]

        this.refCruciblePositionList = this.calcRefList(dict, '坩埚埚位')
        this.refForm.cruciblePosition = this.refCruciblePositionList[0]

        this.refTopLiftingList = this.calcRefList(dict, '顶盖抬起高度')
        this.refForm.topLiftingHeight = this.refTopLiftingList[0]

        this.refTopInsulationList = this.calcRefList(dict, '顶保温结构')
        this.refForm.topInsulationStructure = this.refTopInsulationList[0]
      })
    },
    calcRefList(dict, name) {
      let list = []
      const matched = dict.find(item => item.name === name)
      if (matched && matched.value) {
        matched.value.split('、').forEach(val => {
          list.push(isNaN(val) ? val : Number(val))
        })
        list = [...new Set(list)]
      }
      return list
    }
  }
}
</script>

<style lang="scss" scoped>

.table-title {
  color: #409eff;
  height: 40px;
  line-height: 40px;
  font-size: 20px;
  margin: 5px 0;
  text-indent: 10px;
}

.crucibleCode-info {
  height: 30px;
  line-height: 30px;
  text-indent: 10px;
  margin: 2px 0;
  background-color: #b3d8ff96;
  display: flex;
  justify-content: space-around;

  .info {
    width: 100%;
    display: flex;
    justify-content: space-evenly;
  }
}

.ref-value {
  position: relative;
  &::before {
    content: '参考值';
    padding: 0 6px;
    border-radius: 10px;
    position: absolute;
    top: -6px;
    right: -3px;
    z-index: 10;
    font-size: 12px;
    line-height: 18px;
    text-align: center;
    background-color: rgb(121, 187, 255);
    color: #fff;
  }
  /deep/ .el-input__inner {
    border-color: #DCDFE6 !important;
  }
}

.ot-field .el-button {
  font-size: 16px !important;
  height: 40px;
}
</style>
