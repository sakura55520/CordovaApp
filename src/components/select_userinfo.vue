<template>
  <el-autocomplete
    v-model="userName"
    :fetch-suggestions="fetchSuggestions"
    placeholder="请输入工号"
    popper-class="black-popper"
    clearable
    @select="handleSelect"
    @focus="handleFocus($event)"
    @keyup.enter.native="handleEnter"
    :disabled="disabled"
  >
    <template slot-scope="{ item }">
      <div>{{ `${item.value}(${item.workNo})` }}</div>
    </template>
  </el-autocomplete>
</template>

<script>
import * as select from "@/utils/select.js";
export default {
  name: "select_userinfo",
  props: ["value", "userId", "disabled"],
  data() {
    return {
      userName: "",
      options_UserData: [],
    };
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        this.userName = val;
      },
    },
    userName(val) {
      if (val === "") {
        this.$emit("input", null);
        this.$emit("update:userId", null);
        this.$emit("handleSelect", null);
      }
    },
  },
  methods: {
    fetchSuggestions(qs, cb) {
      if (qs && /^\d+$/.test(qs)) {
        var params = new Object();
        params["search_LIKE_workNo"] = qs;
        this.options_UserData = [];
        select.getUserInfoList(this.options_UserData, params, cb);
      } else {
        this.options_UserData = [];
        cb([]);
      }
    },
    handleSelect(item) {
      this.$emit("input", item.value);
      this.$emit("update:userId", item.id);
      this.$emit("handleSelect", item);
    },
    handleFocus($event) {
      this.$emit("focus", $event);
    },
    handleEnter() {
      if (
        this.options_UserData.length > 0 &&
        this.options_UserData[0].workNo === this.userName
      ) {
        this.$emit("input", this.options_UserData[0].value);
        this.$emit("update:userId", this.options_UserData[0].id);
        this.$emit("handleSelect", this.options_UserData[0]);
      }
    },
  },
};
</script>

