<template>
  <div class="scroller-flex-wrap">
    <el-tabs v-model="activeName">
      <el-tab-pane label="待过站" name="waitOutStation">
        <wait-out-station />
      </el-tab-pane>
      <el-tab-pane label="历史过站记录" name="historicalOverStationRecords">
        <historical-over-station-records />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import waitOutStation from "./modules/waitOutStation.vue";
import HistoricalOverStationRecords from "./modules/historicalOverStationRecords.vue";

export default {
  components: { waitOutStation, HistoricalOverStationRecords },
  data() {
    return {
      activeName: "waitOutStation",
    };
  },
};
</script>

<style>
</style>