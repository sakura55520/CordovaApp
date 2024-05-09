<!--交接班操作-->
<template>
  <div :class="{ 'form-disabled': isDetail }" class="detailBox">
    <el-form
      ref="detailForm"
      :model="detailForm"
      label-width="150px"
      :rules="formRules"
      :disabled="isDetail"
      inline
    >
      <div class="fromCard">
        <div class="headLine">
          <div class="headLine-title">交接班</div>
        </div>
        <div>
          <el-form-item label="接班人" prop="shiftTakerName">
            <el-input :value="detailForm.shiftTakerName" disabled />
          </el-form-item>
          <el-form-item label="交班人" prop="handOverName">
            <SelectUserinfo v-model="detailForm.handOverName" />
          </el-form-item>
          <el-form-item label="交接班时间" prop="handOverTime">
            <el-date-picker
              v-model="detailForm.handOverTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
            />
          </el-form-item>
          <el-form-item label="设备编号">
            <div class="field-bar">
              {{ detailForm.deviceNumber }}
              <el-button type="primary" size="mini" @click="dialogDeviceVisible = true">选择</el-button>
            </div>
          </el-form-item>
        </div>
      </div>

      <div class="fromCard">
        <div class="headLine">
          <div class="headLine-title">交接班内容</div>
        </div>
        <div>
          <el-form-item label="是否维修" prop="repair">
            <el-select v-model="detailForm.repair" clearable>
              <el-option :value="0" label="正常"/>
              <el-option :value="1" label="异常"/>
            </el-select>
          </el-form-item>
          <el-form-item label="维修结果" prop="repairResult">
            <el-input v-model="detailForm.repairResult"/>
          </el-form-item>
          <el-form-item label="当前工序" prop="currentProcess">
            <el-select v-model="detailForm.currentProcess">
              <el-option v-for="item in processList" :label="item.name" :value="item.value" :key="item.id"/>
            </el-select>
          </el-form-item>
          <el-form-item label="等径长度" prop="diameter">
            <el-input v-model="detailForm.diameter" type="number" min="0"/>
          </el-form-item>
          <div>
            <el-form-item class="block-form-item" label="其他内容" prop="otherContent">
              <el-input v-model="detailForm.otherContent" type="textarea" maxlength="100" show-word-limit/>
            </el-form-item>
          </div>
        </div>
      </div>

      <div class="fromCard">
        <div class="headLine">
          <div class="headLine-title">留档文档记录</div>
        </div>
        <div class="growth-section">
          <PhotoNew
            v-model="detailForm.arrPhoto"
            :componentDisabled="false"
            :name="'CHECK_DEVICE'"
          />
        </div>
      </div>
    </el-form>

    <!--弹窗: 选择设备-->
    <SelectDeviceList
      :visible.sync="dialogDeviceVisible"
      estimate-visible
      @has-confirm="hasSelectDeviceConfirm"
    />

    <!-- 页面操作 -->
    <div class="page-handle-box" v-if="!$route.query.view">
      <template v-if="isDetail">
        <el-button class="cancel detail-cancel" @click="back()">取消</el-button>
      </template>
      <template v-else>
        <el-button class="cancel" @click="back(null, 'confirm')">取消</el-button>
        <el-button v-if="isCreate" class="submit" type="primary" @click="handleCreate">确认提交</el-button>
        <el-button v-else class="submit" type="primary" @click="handleUpdate">确认修改</el-button>
      </template>
    </div>
  </div>
</template>

<script>
import SelectUserinfo from "@/components/select_userinfo";
import * as Api from "@/api/shiftChange";
import { cloneDeep } from "lodash-es";
import PhotoNew from "@/views/components/photoNew.vue";
import { getSeleteData } from "@/utils/select";
import { mapState } from 'vuex'
import overStation from "@/mixins/overStation";
import SelectDeviceList from "@/components/SelectDeviceList.vue";

const defaultForm = {
  shiftTakerName: null, // 接班人
  handOverName: null, // 交班人
  handOverTime: null, // 交接班时间
  deviceNumber: null, // 设备编号
  repair: null, // 是否维修
  repairResult: null, // 维修结果
  currentProcess: null, // 当前工序
  diameter: null, // 等径长度
  otherContent: null, // 其他内容
  arrPhoto: null,
  photo: null // 留档文档记录
};
export default {
  name: "ShiftChangeOperate",
  mixins: [overStation],
  components: {
    PhotoNew,
    SelectUserinfo,
    SelectDeviceList
  },
  data() {
    return {
      detailForm: Object.assign({}, cloneDeep(defaultForm)),
      formRules: {
        shiftTakerName: [{ required: true, message: '请输入接班人', trigger: 'change' }],
        handOverName: [{ required: true, message: '请输入交班人', trigger: 'change' }],
        handOverTime: [{ required: true, message: '请输入交接班时间', trigger: 'change' }],
      },
      processList: [],
      dialogDeviceVisible: false,
    };
  },
  computed: {
    ...mapState({
      NowServerDate: state => state.window.NowServerDate,
      realName: state => state.user.realName,
    }),
    status() {
      return this.$route.query.status
    },
    isCreate() {
      return !this.status || this.status === 'create'
    },
    isDetail() {
      return this.status === 'detail'
    }
  },
  watch: {
    NowServerDate(date) {
      if (!this.isCreate) return
      if (this.detailForm.handOverTime) return
      this.detailForm.handOverTime = date
    }
  },
  mounted() {
    getSeleteData('shiftProcess', this.processList)
    if (this.isCreate) {
      this.detailForm.shiftTakerName = this.realName
    } else {
      Api.fetchDetail(this.$route.query.id).then(res => {
        this.detailForm = Object.assign({}, defaultForm, res.data)
        try {
          const { photo } = res.data
          this.detailForm.arrPhoto = photo ? JSON.parse(photo) : []
        } catch (e) {
          console.log(e)
        }
      })
    }
  },
  methods: {
    // 操作
    handleCreate() {
      this.$refs.detailForm.validate((valid) => {
        if (valid) {
          this.$confirm("确认提交当前操作数据?", "提示", {
            type: "warning",
          }).then(() => {
            const form = this.transform()
            Api.createData(form).then(() => {
              const msg = '【交接班】新增成功'
              this.$message.success(msg);
              this.back(msg);
            });
          });
        }
      });
    },
    handleUpdate() {
      this.$refs.detailForm.validate((valid) => {
        if (valid) {
          this.$confirm("确认提交当前操作数据?", "提示", {
            type: "warning",
          }).then(() => {
            const form = this.transform()
            Api.editData(form).then(() => {
              const msg = '【交接班】修改成功'
              this.$message.success(msg);
              this.back(msg);
            });
          });
        }
      });
    },
    transform() {
      const { arrPhoto, ...form } = this.detailForm
      return {
        ...form,
        photo: arrPhoto ? JSON.stringify(arrPhoto) : null,
      }
    },
    hasSelectDeviceConfirm(id, equipmentCode) {
      this.detailForm.deviceNumber = equipmentCode
    },
  },
};
</script>
