<template>
  <div>
    <el-dialog
      :title="dialogState"
      :visible.sync="dialogVisible"
      width="95%"
      :before-close="handleClose"
    >
      <el-form
        ref="dialogForm"
        :model="dialogForm"
        class="demo-form-inline"
        label-width="100px"
      >
        <el-form-item
          :rules="[{ required: true, message: '请输入', trigger: 'change' }]"
          label="退库原因"
          prop="reason"
          dict-code="backReason"
        >
          <el-select
            v-model="dialogForm.reason"
            placeholder="请选择"
            style="width: 100%"
          >
            <el-option
              v-for="(item, index) in backReasonMap"
              :key="index"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-table :data="dialogForm.list">
          <el-table-column label="物料编号" min-width="150" align="center">
            <template slot-scope="{ row }">
              <el-form-item label="" label-width="0px">
                {{ row.materialCode }}
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="物料名称" min-width="150" align="center">
            <template slot-scope="{ row }">
              <el-form-item label="" label-width="0px">
                {{ row.materialName }}
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="物料类型" min-width="150" align="center">
            <template slot-scope="{ row }">
              <el-form-item label="" label-width="0px">
                {{ row.materialType }}
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            label="物料条码（唯一码)"
            min-width="250"
            align="center"
          >
            <template slot-scope="{ row }">
              <el-form-item label="" label-width="0px">
                {{ row.uniqueCode }}
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button
          v-if="dialogState !== '查看'"
          type="primary"
          @click="submitData"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import * as Api from "@/api/accessory";
import { getSeleteData } from "@/utils/select"; //字典接口

export default {
  props: {
    dialogVisible: {
      type: Boolean,
      required: true,
    },
    // 修改父组件数据
    changeParentData: {
      type: Function,
      required: true,
    },
    dialogState: {
      type: String,
      require: true,
      default: "新建",
    },
    dialogForm: {
      type: Object,
      require: true,
      default: () => {},
    },
    hasDone: {
      type: Function,
      required: true,
    },
    thatRefs: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      timeValue: [],
      backReasonMap: [],
    };
  },
  created() {
    getSeleteData("backReason", this.backReasonMap);
  },
  mounted() {
    this.initTime();
  },
  methods: {
    // 表单时间同步
    initTime() {
      if (this.dialogForm.gstrp) {
        this.timeValue = [this.dialogForm.gstrp, this.dialogForm.gltrp];
      }
    },
    changeTime(val) {
      if (val && val.length === 2) {
        this.$set(this.dialogForm, "gstrp", val[0]);
        this.$set(this.dialogForm, "gltrp", val[1]);
      } else {
        this.$set(this.dialogForm, "gstrp", undefined);
        this.$set(this.dialogForm, "gltrp", undefined);
      }
    },
    // 选择产品回调
    choseSelectedProducts(val) {
      let newForm = {
        ...this.dialogForm,
        productModelId: val.id,
        matnr: val.code,
        productName: val.name,
        specification: val.specification,
      };
      this.changeParentData("dialogForm", newForm);
    },
    submitData() {
      this.$refs.dialogForm.validate((val) => {
        const { reason, list } = this.dialogForm;
        let data = {
          reason,
          ids: list.map((item) => item.id),
        };
        if (val) {
          //校验表单
          Api.batchBack(data).then((res) => {
            this.$message.success("批量退库成功");
            this.handleClose();
            this.hasDone();
          });
        }
      });
    },
    handleClose() {
      this.changeParentData("batchBackDialogVisible", false);
    },
  },
};
</script>
<style lang="scss" scoped>
.dialog-footer {
  display: flex;
  justify-content: end;
}
</style>