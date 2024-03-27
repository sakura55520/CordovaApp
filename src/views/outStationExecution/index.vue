<template>
  <div class="scroller-flex-wrap">
    <div class="outStationExecution-container">
      <div class="info-container">
        <div class="info">
          <div class="info-label">批次号</div>
          <div class="info-value">{{ batchNumber }}</div>
        </div>
        <div class="info">
          <div class="info-label">长晶炉</div>
          <div class="info-value">{{ grownCrystalFurnace }}</div>
        </div>
        <div class="info">
          <div class="info-label">炉次号</div>
          <div class="info-value">{{ furnaceNumber }}</div>
        </div>
        <div class="info">
          <div class="info-label">配方</div>
          <div class="info-value">{{ recipe }}</div>
        </div>
        <div class="info">
          <div class="info-label">工艺路径</div>
          <div class="info-value">{{ processPath }}</div>
        </div>
      </div>
      <el-divider class="divider" />
      <h3>出站数据录入</h3>
      <div class="outStation-form">
        <component
          :is="overStationDataEntryComponentMap[$route.query.station]"
        ></component>
      </div>
    </div>
    <div class="btn">
      <el-button plain class="cancel-btn">取消</el-button>
      <el-button type="primary" plain class="save-btn">保存</el-button>
      <el-button type="primary" class="confirm-btn">出站确认</el-button>
    </div>
  </div>
</template>

<script>
import HeadAndTailSampling from "./modules/HeadAndTailSampling.vue";
import IngotDetection from "./modules/IngotDetection.vue";
import SegmentedInstruction from "./modules/SegmentedInstruction.vue";
import Cutting from "./modules/Cutting.vue";

export default {
  components: {
    HeadAndTailSampling,
    IngotDetection,
    SegmentedInstruction,
    Cutting,
  },
  data() {
    return {
      batchNumber: "Z0116504581",
      grownCrystalFurnace: "A21",
      furnaceNumber: "A2010504581",
      recipe: "Reczl20240310v1",
      processPath: "X0010101",
      overStationDataEntryComponentMap: {
        QTWQY: HeadAndTailSampling,
        JDJY: IngotDetection,
        FDZL: SegmentedInstruction,
        QG: Cutting,
      },
    };
  },
};
</script>

<style lang="scss" scoped>
.outStationExecution-container {
  padding: 12px;
  background-color: rgb(245, 245, 245);
  .info-container {
    background-color: rgb(245, 245, 245);
    display: flex;
    flex-wrap: wrap;
  }
  .info {
    display: flex;
    width: 50%;
    margin-bottom: 8px;
    .info-label {
      width: 40%;
    }
    .info-value {
      width: 60%;
    }
  }
  .outStation-form {
    border: 1px solid rgba(0, 0, 0, 0.1);
    min-height: 200px;
    margin-top: 10px;
    padding: 12px;
    background-color: white;
  }
}
.divider {
  margin: 8px 0px;
}
.btn {
  position: absolute;
  bottom: 20px;
  width: 100%;
  display: flex;
  gap: 8px;
  .cancel-btn {
    flex: 1;
  }
  .save-btn {
    flex: 1;
  }
  .confirm-btn {
    flex: 2;
  }
}
</style>