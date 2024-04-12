<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      title="请确认是否下机"
      width="500px"
      >
      <el-form ref="dialogForm" :model="dialogForm" inline label-width="100px">
        <el-form-item label="物料状态">
          <el-select v-model="dialogForm.accessoryStatus" clearable placeholder="请选择" prop="status">
            <el-option v-for="(item,index) in accessoriesStatusMap" :key="index" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="save" @click="dialogVisible = false">取 消</el-button>
        <el-button class="submit" type="primary" @click="submitData">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { downAndUpdate } from '@/api/accessory'

const defaultForm = {
  accessoryStatus: null, // 物料状态
}

export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    // 某一行数据对象
    rowData: {
      required: true,
      type: Object
    },
    accessoriesStatusMap: Array
  },
  data() {
    return {
      dialogForm: Object.assign({}, defaultForm),
    }
  },
  computed: {
    dialogVisible: {
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
  methods: {
    init() {
      this.dialogForm = Object.assign({}, defaultForm, this.rowData)
      this.$nextTick(() => {
        this.$refs.dialogForm.clearValidate()
      })
    },
    submitData() {
      this.$refs.dialogForm.validate((val)=>{
        if(val){
          downAndUpdate(this.dialogForm).then((res) => {
            this.$message.success('下机成功')
            this.dialogVisible = false
            this.$emit('has-down')
          })
        }
      })
    },
  }
}
</script>

