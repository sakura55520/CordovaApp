<template>
  <div class="sub-title">
    <span class="sub-title-text">
      {{ label }}
    </span>
  </div>
</template>

<script>
export default {
  name: 'SubTitle',
  props: {
    label: String,
  }
}
</script>

<style scoped>
.sub-title {
  border-bottom: 1px dashed #a7d0fa;
  margin: 12px 0;
}
.sub-title-text {
  display: inline-block;
  margin-bottom: 8px;
  border-radius: 8px;
  border: 1px solid #1283F9;
  padding: 0 12px;
  font-size: 15px;
  line-height: 1.9;
  background: #EDF5FF;
  color: #409eff;

}
</style>
