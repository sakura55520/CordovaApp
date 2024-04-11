<!--出站时, 选择出站路线-->
<template>
  <el-dialog
    :visible.sync="dialogVisible"
    title="请选择路线"
    width="60%"
  >
    <el-radio-group v-model="flowLineLable" style="width: 100%;">
      <el-radio
        v-for="(item, index) in flowLineList"
        :key="index"
        :label="item.label"
        border
        class="list-radio"
      >
        {{ item.label }}
      </el-radio>
    </el-radio-group>

    <div slot="footer" class="dialog-footer">
      <el-button class="submit" @click="dialogVisible = false">取 消</el-button>
      <el-button class="submit" type="primary" @click="handleInOrOutStation">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex'
import { inOrOutStation } from '@/api/inStation'

export default {
  name: 'ChooseFlowLineDialog',
  data() {
    return {
      flowLineLable: ''
    }
  },
  computed: {
    ...mapState({
      flowLineVisible: state => state.flowLine.flowLineVisible,
      flowLineList: state => state.flowLine.flowLineList,
    }),
    dialogVisible: {
      get() {
        return this.flowLineVisible
      },
      set(flowLineVisible) {
        this.$store.dispatch('SetFlowLineVisible', flowLineVisible)
      }
    }
  },
  watch: {
    dialogVisible: {
      immediate: true,
      handler(visible) {
        if (visible) this.init()
      }
    }
  },
  methods: {
    init() {
      this.flowLineLable = ''
    },
    handleInOrOutStation() {
      if (!this.flowLineLable) return this.$message.warning('请选择一条路线!')
      inOrOutStation({
        ...this.$store.state.station.stationPostData,
        flowLineLable: this.flowLineLable
      }).then(res => {
        this.$message('操作成功')
      })
    },
  }
}
</script>

