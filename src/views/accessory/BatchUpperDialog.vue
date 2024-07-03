<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      title="请确认是否批量上机"
      width="80%"
    >
      <el-form ref="dialogForm" :model="dialogForm" inline label-width="100px">
        <el-table :data="dialogForm.list">
          <el-table-column label="物料料号" min-width="200" align="center">
            <template slot-scope="{ row }">
              <el-form-item label="">
                {{ row.materialCode }}
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="物料名称" min-width="200" align="center">
            <template slot-scope="{ row }">
              <el-form-item label="">
                {{ row.materialName }}
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="设备号" min-width="400" align="center">
            <template slot-scope="scope">
              <el-form-item
                :rules="[
                  { required: true, message: '请选择', trigger: 'change' },
                ]"
                label=""
                :prop="'list.' + scope.$index + '.equipmentCode'"
                class="form-input"
              >
                <el-input
                  style="width: 120px"
                  v-model="scope.row.equipmentCode"
                  disabled
                />
                <el-button
                  size="small"
                  type="primary"
                  @click="handleDeviceSelect(scope.$index)"
                  >选择设备</el-button
                >
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitData">确 定</el-button>
      </span>
    </el-dialog>

    <!--选择设备-->
    <SelectDeviceList
      :visible.sync="dialogDeviceVisible"
      :device-id="currentDeviceId"
      @has-confirm="hasSelectDeviceListConfirm"
    />
  </div>
</template>

<script>
import * as Api from "@/api/accessory";
import SelectDeviceList from "@/components/SelectDeviceList.vue";

export default {
  components: { SelectDeviceList },
  props: {
    visible: {
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
  },
  data() {
    return {
      selectIndex: null,
      dialogDeviceVisible: false,
    };
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible;
      },
      set(visible) {
        this.$emit("update:visible", visible);
      },
    },
    currentDeviceId() {
      return (this.dialogForm.list[this.selectIndex] || {}).deviceId;
    },
  },
  methods: {
    handleDeviceSelect(index) {
      this.selectIndex = index;
      this.dialogDeviceVisible = true;
    },
    hasSelectDeviceListConfirm(deviceId, equipmentCode) {
      let item = {
        ...this.dialogForm.list[this.selectIndex],
        deviceId,
        equipmentCode,
      };
      this.$set(this.dialogForm.list, this.selectIndex, item);
    },
    submitData() {
      this.$refs.dialogForm.validate((val) => {
        if (val) {
          Api.batchUpperByEQP(this.dialogForm.list).then((res) => {
            this.$message.success("批量上机成功");
            this.dialogVisible = false;
            this.hasDone();
          });
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.form-input {
  padding-top: 16px;
}
.dialog-footer {
  display: flex;
  justify-content: end;
}
</style>