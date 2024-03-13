<!--退库弹窗-->
<template>
  <el-dialog :visible.sync="dialogFormVisible" title="退库申请" width="95%" append-to-body>

    <el-form ref="dialogForm" :model="dialogForm" label-width="100px">
      <el-form-item :rules="[{ required: true, message: '请输入', trigger: 'change' }]" label="数量" prop="number">
        <el-input-number v-model="dialogForm.number" :min="1" @focus="$event.target.select()"/>
      </el-form-item>

      <el-form-item :rules="[{ required: true, message: '请输入', trigger: 'change' }]" label="退库原因" prop="reason">
        <el-select v-model="dialogForm.reason" placeholder="请选择" style="width: 100%;">
          <el-option v-for="(item,index) in reasonMap" :key="index" :label="item.name" :value="item.value"/>
        </el-select>
      </el-form-item>

      <el-form-item label=" ">
        <el-input v-trim v-model="dialogForm._otherReason" type="textarea" placeholder="可输入其他原因"/>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button class="save" @click="dialogFormVisible=false">取 消</el-button>
      <el-button class="submit" type="primary" @click="handleConfirm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getSeleteData } from '@/utils/select'
import {stockReturn} from "@/api/accessory";

const defaultForm = {
  number: 1, // 数量
  reason: null, // 退库原因
  _otherReason: null, // 其他原因
}

export default {
  name: 'ReturnDialog',
  props: {
    visible: {
      required: true,
      type: Boolean
    },
    // 某一行数据对象
    rowData: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      dialogForm: Object.assign({}, defaultForm),
      reasonMap: []
    }
  },
  computed: {
    dialogFormVisible: {
      get() {
        return this.visible
      },
      set(visible) {
        this.$emit('update:visible', visible)
      }
    }
  },
  watch: {
    visible: {
      immediate: true,
      handler(visible) {
        if (visible) this.init()
      }
    }
  },
  created() {
    getSeleteData('backReason', this.reasonMap)
  },
  methods: {
    init() {
      this.dialogForm = Object.assign({}, defaultForm)
      this.$nextTick(() => {
        this.$refs.dialogForm.clearValidate()
      })
    },
    handleConfirm() {
      this.$refs.dialogForm.validate(valid => {
        if (valid) {
          const { _otherReason, ...form } = this.dialogForm
          if (_otherReason) form.reason = _otherReason
          stockReturn({
            ...form,
            id: this.rowData.id
          }).then(res => {
            this.$message.success('退库成功!')
            this.dialogFormVisible = false
            this.$emit('has-down')
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
