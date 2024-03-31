<!--滚圆中转-->
<template>
  <div class="detailBox">
    <!-- 顶部信息卡片 -->
    <div class="topInfoCard">
      <div class="grid-container">
        <div class="grid-item">
          <span class="grid-item-name">批次号：</span>
          <span class="grid-item-value">{{ detailForm.processOrderCode }}</span>
        </div>
        <div class="grid-item">
          <span class="grid-item-name">长晶炉：</span>
          <span class="grid-item-value">{{ $route.query.deviceCode }}</span>
        </div>
      </div>
    </div>

    <div class="fromCard">
      <div class="fromCard">
        <div class="headLine">
          <div class="headLine-title">{{ storageLabel }}数据录入</div>
        </div>
        <el-form ref="detailForm" :model="detailForm" label-width="120px" :rules="rules" inline>
          <div>
            <el-form-item label="操作者">
              <el-input v-model="detailForm.userCreate" disabled/>
            </el-form-item>
            <el-form-item label="合格数量" prop="goodQty">
              <el-input v-model="detailForm.goodQty" disabled>
                <template slot="append">kg</template>
              </el-input>
            </el-form-item>
            <el-form-item label="报废数量" prop="scrapQty">
              <el-input v-model="detailForm.scrapQty" type="number">
                <template slot="append">kg</template>
              </el-input>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="线边仓库位" prop="lineWarehouseLocation" style="height: 550px">
              <SelectLinesideTree
                v-model="detailForm.lineWarehouseLocation"
                @select="handleWhouseSelect"
                :alwaysOpen="true"
              />
            </el-form-item>
          </div>

        </el-form>
      </div>
    </div>

    <!-- 页面操作 -->
    <div class="pageHandleBox">
      <el-button class="save" @click="handle('保存')">保存</el-button>
      <el-button class="submit" type="primary" @click="handle('提交')">{{ storageLabel }}确认</el-button>
    </div>
  </div>
</template>

<script>
import SelectLinesideTree from '@/components/SelectLinesideTree'
import * as Api from '@/api/inStation'
import { cloneDeep, floor, last } from 'lodash-es'
import moment from 'moment'

const defaultForm = {
  lineWarehouse: null, // 线边仓
  lineWarehouseLocation: null, // 线边仓库位
}

export default {
  name: 'RoundTransferOperate',
  components: {
    SelectLinesideTree,
  },
  data() {
    return {
      detailForm: Object.assign({}, defaultForm), // 表单列表
      rules: {
        scrapQty: [{ required: true, message: '请输入报废数量', trigger: 'change' }],
        lineWarehouseLocation: [{ required: true, message: '请选择线边仓库位', trigger: 'change' }],
      }
    }
  },
  computed: {
    storageLabel() {
      return this.$route.query.wipStorageStatus === '1' ? '出站' : '进站'
    },
    buffParams() {
      const { processUuid, processingOrderCode } = this.$route.query
      return { processUuid, processingOrderCode }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      let fromData = {}
      // 查询保存的数据
      const res = await Api.fetchBuffer(this.buffParams)
      if (res.data) {
        fromData = res.data
      } else {
        try {
          fromData = JSON.parse(this.$route.query.fromData)
        } catch (e) {
          console.log(e)
        }
      }

      this.detailForm = Object.assign({}, defaultForm, fromData)
    },
    back() {
      this.$router.push('/overStationExecution?station=GYZZ')
    },
    // 操作
    handle(typeName) {
      const FormData = JSON.stringify(this.detailForm)
      if (typeName === '保存') {
        Api.upldateBuffer(this.buffParams, this.detailForm).then(res => {
          this.$message.success('保存成功!')
          this.back()
        })
      } else if (typeName === '提交') {
        this.$refs.detailForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交当前操作数据?', '提示', {
              type: 'warning'
            }).then(() => {
              const { equipmentCode, processUuid, processingOrderCode, wipStorageStatus } = this.$route.query
              Api.inOrOutStation({
                param: {
                  FormData
                },
                equipmentCode, // 设备
                processUuid, // 当前工序唯一标识
                processingOrderCode, // 工单号
                wipStorageStatus, // 进出站状态
              }).then(() => {
                this.$message.success(`【${this.storageLabel}】操作成功`)
                Api.deleteBuffer(this.buffParams)
                this.back()
              })
            })

          }
        })
      }
    },
    handleWhouseSelect({ id, name }) {
      this.detailForm.lineWarehouseLocation = name
    }
  }
}
</script>

