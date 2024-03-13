<!--工序3-1详情-->
<template>
  <div class="detailBox">

    <!-- 顶部信息卡片 -->
    <div class="topInfoCard">
      <div :class="'grid-container'">
        <div class="grid-item">
          <span class="grid-item-name">退火炉编号：</span>
          <span class="grid-item-value">
            <span>{{ $route.query.deviceCode }}</span>
          </span>
        </div>
        <div class="grid-item">
          <span class="grid-item-name">籽晶数量：</span>
          <span class="grid-item-value">{{ list.length }}</span>
        </div>
        <div class="grid-item">
          <span class="grid-item-name">上料时间：</span>
          <span class="grid-item-value">{{ inStationTime }}</span>
        </div>
      </div>
    </div>


    <div class="topInfoCard">
      <el-table :data="list">
        <el-table-column prop="uniqueCode" label="籽晶编号" width="140"/>
        <el-table-column prop="planOrderNo" label="订单号" width="140"/>
        <el-table-column prop="materialType" label="类型"/>
        <el-table-column prop="diameter" label="直径" width="60"/>
        <el-table-column prop="specification" label="规格" width="60"/>
        <el-table-column prop="materialLevel" label="等级" width="60"/>
        <el-table-column prop="seedPosition" label="籽晶位置" width="90"/>
        <el-table-column prop="result" label="检验结果" width="120" fixed="right">
          <template slot-scope="{row, $index}">
            <el-select v-model="row.result" @change="handleResultChange($index)">
              <el-option v-for="(item, index) in resultList" :key="index" :value="item.value" :label="item.label"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="intact" label="报废片是否完整" width="165" fixed="right">
          <template slot-scope="{row}">
            <el-select v-show="row.result === '报废'" v-model="row.intact">
              <el-option v-for="(item, index) in intactList" :key="index" :value="item.value"></el-option>
            </el-select>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 页面操作 -->
    <div class="pageHandleBox">
      <el-button class="submit" type="primary" @click="handle('提交')">批量下料</el-button>
    </div>
  </div>
</template>

<script>
import * as Api from '@/api/process3-1'
import {outStation} from "@/api/trendsform/trendsform";
import {getCurrentWipStorageData} from "@/api/overStation/overStation";
import CodeScanner from "@/components/CodeScanner.vue";

export default {
  name: 'process3-1Detail',
  components: {CodeScanner},
  data() {
    return {
      detailInfo: {},
      processUuid: '',
      list: [],
      resultList: [
        { value: '合格', label: '合格' },
        { value: '降级', label: '降级' },
        { value: '退料', label: '退料' },
        { value: '报废', label: '报废' },
        { value: '返工', label: '返工' },
      ],
      intactList: [
        { value: '完整报废片' },
        { value: '非完整报废片' },
      ],
    }
  },
  computed: {
    inStationTime() {
      let time = this.$route.query.inStationTime
      if (!time && this.list && this.list.length) time = this.list[0].inTime
      return time
    }
  },
  created() {
    this.init()
  },
  methods: {
    // 页面初始化
    init() {
      this.reset()
      const { processUuid, deviceCode } = this.$route.query
      if (deviceCode) {
        this.processUuid = processUuid
        this.fetchInfo()
      }
    },
    reset() {
      this.detailInfo = {}
      this.list = []
    },
    // 操作
    async handle(typeName) {
      const list = this.list.filter(item => item.result)
      if (!list.length) return this.$message.warning(`请选择检验结果!`)

      // 1.根据籽晶编号查询当前在制品信息, 获取processUuid
      if (!this.processUuid) {
        const uniqueCode = list[0].uniqueCode // 籽晶编号
        const resWip = await getCurrentWipStorageData(uniqueCode)
        if (resWip.data && resWip.data[0]) {
          if (resWip.data[0].operationData !== this.$route.path) {
            return this.$message.warning(`籽晶【${uniqueCode}】已经不再当前站点, 请刷新列表后重新操作!`)
          }
          this.processUuid = resWip.data[0].processUuid
        }
      }

      if (!(this.processUuid && typeof this.processUuid === 'string')) return this.$message.warning('获取在制品信息失败! 请重试')

      // 2.循环调用进站接口, 一次请求成功后, 再继续请求
      for (let i = 0; i < list.length; i++) {
        await this.outStation({
          ...list[i],
          ...this.detailForm
        })
      }

      this.$message.success('批量下料操作成功!')
      this.$router.push('/process3-1')
    },
    outStation(data) {
      return outStation({
        equipmentCode: data.equipmentCode, // 设备号
        param: {
          FormData: JSON.stringify(data)
        },
        processUuid: this.processUuid, // 当前工序唯一标识
        processingOrderCode: data.processOrderCode // 工单号
      })
    },
    handleResultChange(index) {
      const row = this.list[index]
      if (row.result !== '报废') {
        this.$set(this.list, index, {
          ...row,
          intact: null
        })
      }
    },
    fetchInfo() {
      const { processingCode, deviceCode } = this.$route.query
      this.list = []
      Api.listByPage({
        processingCode,
        equipmentCode: deviceCode,
        processName: '工序3-1',
        wipStorageStatus: 1, // 在制品状态，1：已进站，0：待进站
        rows: 100,
        page: 1
      }).then(res => {
        this.list = res.data.rows || []
      })
    }
  }
}
</script>
