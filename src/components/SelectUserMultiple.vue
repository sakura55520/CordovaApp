<!-- 选择多个用户组件 -->
<template>
  <el-select
    v-model="userName"
    :remote-method="remoteMethod"
    multiple
    filterable
    remote
    reserve-keyword
    placeholder="请输入工号"
    style="width: 100%"
  >
    <el-option
      v-for="item in userOptions"
      :key="item.id"
      :value="item.realName"
    >
      <span>{{item.realName}}: {{item.workNo}}</span>
    </el-option>
  </el-select>
</template>

<script>
import * as select from '@/utils/select.js'
import {getUserInfoList} from "@/api/select";
export default {
  name: 'SelectUserMultiple',
  props: {
    // 姓名 (多选时是逗号分隔的字符串)
    value: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      userOptions: [],
    }
  },
  computed: {
    userName: {
      get() {
        return this.value ? String(this.value).split(',') : []
      },
      set(userName) {
        this.$emit('input', userName ? userName.join(',') : '')
      }
    }
  },
  methods: {
    remoteMethod(query) {
      if (query !== '') {
        getUserInfoList({
          search_LIKE_workNo: query
        }).then(res => {
          this.userOptions = res.data || []
        })
      } else {
        this.userOptions = []
      }
    },
  }
}
</script>

