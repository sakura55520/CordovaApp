<!--长晶-->
<template>
  <div class="detailBox">
    <!-- 顶部信息卡片 -->
    <div class="topInfoCard">
      <div class="grid-container">
        <div class="grid-item">
          <span class="grid-item-name">批次号：</span>
          <span class="grid-item-value">{{ steps.processOrderCode }}</span>
        </div>
        <div class="grid-item">
          <span class="grid-item-name">长晶炉：</span>
          <span class="grid-item-value">{{ $route.query.deviceCode }}</span>
        </div>
      </div>
    </div>

    <div v-loading="loading" class="fromCard growth-main">
      <el-tabs v-if="tabsVisible" tab-position="left" @tab-click="handleSetpClick">
        <el-tab-pane v-for="(stepName, index) in stepNameList" :key="index" :label="stepName">
          <TabItem
            ref="TabItem"
            :step-data="steps[stepName]"
            :step-name="stepName"
            :crystal-growth-err-list="crystalGrowthErrList"
          />
        </el-tab-pane>
        <el-tab-pane label="单晶异常">
          <TabError
            ref="TabError"
            :steps="steps"
            :step-name-list="stepNameList"
            :crystal-growth-err-list="crystalGrowthErrList"
          />
        </el-tab-pane>
        <el-tab-pane label="留档文档">
          <TabFile
            ref="TabFile"
            :step-data="steps['留档文档']"
          />
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 页面操作 -->
    <div class="pageHandleBox">
      <el-button class="save" @click="handle('保存')">保存</el-button>
      <el-button class="submit" type="primary" @click="handle('提交')">{{ storageLabel }}确认</el-button>
    </div>
  </div>
</template>

<script>
import * as Api from '@/api/inStation'
import TabItem from './TabItem'
import TabError from './TabError'
import TabFile from './TabFile'
import { fetchModelForm } from '@/api/modelform'
import { getSeleteData } from '@/utils/select'


const defaultForm = {}

const defaultCheckItem = {
  checkItem: null, // 点检项
  isError: null, // 是否异常
  errorMessage: null, // 异常说明
}

const defaultTechsItem = {
  extKey: null, // label
  extValue: null,
}

export default {
  name: 'GrowthOperate',
  components: {
    TabItem,
    TabError,
    TabFile
  },
  data() {
    return {
      stepNameList: ['拆炉', '抽真空', '检漏', '煅烧', '化料', '稳温', '引晶', '放肩', '等径', '收尾', '冷却', '煅烧冷却', '吊单晶', '回熔', '吊肩', '补掺'],
      name2form: {},
      steps: {},
      rules: {},
      loading: true,
      tabsVisible: false,
      crystalGrowthErrList: [], // 拉晶异常list
    }
  },
  computed: {
    storageLabel() {
      return this.$route.query.wipStorageStatus === '1' ? '出站' : '进站'
    }
  },
  created() {
    this.init()
  },
  methods: {
    async init() {
      // 拉晶异常list
      await getSeleteData('crystalGrowthErr', this.crystalGrowthErrList)

      let fromData = {}
      try {
        fromData = JSON.parse(this.$route.query.fromData)
      } catch (e) {
        console.log(e)
      }

      this.steps = Object.assign({}, defaultForm, fromData ? fromData.steps : null)

      // 查询动态表单配置
      await this.fetchFormContent()

      this.loading = false
      this.tabsVisible = true
    },
    back() {
      this.$router.push('/overStationExecution?station=ZJ')
    },
    // 操作
    handle(typeName) {
      const form = this.transform()
      if (typeName === '保存') {
        Api.updateGrowthBuffer(form).then(res => {
          this.$message.success('保存成功!')
          this.back()
        })
      } else if (typeName === '提交') {
        this.$confirm('确认提交当前操作数据?', '提示', {
          type: 'warning'
        }).then(() => {
          const { equipmentCode, processUuid, processingOrderCode, wipStorageStatus } = this.$route.query
          Api.inOrOutStation({
            param: {
              FormData: JSON.stringify(form)
            },
            equipmentCode, // 设备
            processUuid, // 当前工序唯一标识
            processingOrderCode, // 工单号
            wipStorageStatus, // 进出站状态
          }).then(() => {
            this.$message.success(`【${this.storageLabel}】操作成功`)
            this.back()
          })
        })
      }
    },
    transform() {
      const steps = JSON.parse(JSON.stringify(this.steps))
      Object.keys(steps).forEach(stepName => {
        steps[stepName].forEach(({ _errors, ...recordItem }) => {
          this.updateExtValue(recordItem.exts)
          this.updateExtValue(recordItem.techs)
          recordItem.errors = (_errors || []).map(errorMessage => ({ errorMessage }))
        })
      })
      return { steps }
    },
    updateExtValue(arr) {
      if (!Array.isArray(arr)) return
      arr.forEach(item => {
        const { extValue } = item
        if (extValue && (typeof extValue === 'object')) {
          item.extValue = JSON.stringify(extValue)
        }
      })
    },
    fetchFormContent() {
      return fetchModelForm({
        search_LLIKE_name: '长晶-'
      }).then(res => {
        res.data.forEach(form => this.name2form[form.name] = form)
        this.stepNameList.forEach(stepName => {
          if (!this.steps[stepName]) this.$set(this.steps, stepName, [{
              checks: [],
              techs: [],
              _errors: [],
              exts: [],
              files: [],
            }]
          )
          this.initErrors(stepName)
          this.initExts(stepName)
          this.initChecks(stepName)
          this.initTechs(stepName)
        })

        if (!this.steps['留档文档']) this.$set(this.steps, '留档文档', [])
      })
    },
    // 点检项
    initChecks(stepName) {
      const form = this.name2form[`长晶-${stepName}-点检项`]
      if (!form) return

      const formContent = form.content
      this.steps[stepName].forEach((recordItem, recordIdx) => {
        const label2value = {}
        if (Array.isArray(recordItem.checks)) {
          recordItem.checks.forEach(({ checkItem, isError, errorMessage }) => {
            label2value[checkItem] = { checkItem, isError, errorMessage }
          })
        }

        const checks = []
        formContent.forEach(({ label }) => {
          checks.push({
            ...defaultCheckItem,
            ...label2value[label],
            checkItem: label
          })
        })
        this.$set(this.steps[stepName][recordIdx], 'checks', checks)
      })

    },
    // 工艺参数
    initTechs(stepName) {
      const form = this.name2form[`长晶-${stepName}-工艺参数`]
      if (!form) return

      const formContent = form.content
      this.steps[stepName].forEach((recordItem, recordIdx) => {
        const label2value = {}
        if (Array.isArray(recordItem.techs)) {
          recordItem.techs.forEach(({ extKey, extValue }) => {
            label2value[extKey] = { extKey, extValue }
          })
        }

        const techs = []
        formContent.forEach(formItem => {
          techs.push({
            ...formItem,
            ...defaultTechsItem,
            ...label2value[formItem.label],
            extKey: formItem.label
          })
        })
        this.$set(this.steps[stepName][recordIdx], 'techs', techs)
      })
    },
    // 其余参数
    initExts(stepName) {
      const form = this.name2form[`长晶-${stepName}-其余参数`]
      if (!form) return

      const formContent = form.content
      this.steps[stepName].forEach((recordItem, recordIdx) => {
        const label2value = {}
        if (Array.isArray(recordItem.exts)) {
          recordItem.exts.forEach(({ extKey, extValue }) => {
            label2value[extKey] = { extKey, extValue }
          })
        }

        const exts = []
        formContent.forEach(formItem => {
          exts.push({
            ...formItem,
            ...defaultTechsItem,
            ...label2value[formItem.label],
            extKey: formItem.label
          })
        })
        this.$set(this.steps[stepName][recordIdx], 'exts', exts)
      })
    },
    // 异常
    initErrors(stepName) {
      const form = this.name2form[`长晶-${stepName}-其余参数`]
      if (!form) return

      const formContent = form.content
      this.steps[stepName].forEach((recordItem, recordIdx) => {
        const errFormItemIdx = formContent.findIndex(({ label }) => label === '单晶异常')
        if (errFormItemIdx > -1) {
          recordItem._showErrors = true
          formContent.splice(errFormItemIdx, 1)
        }
        const _errors = (recordItem.errors || []).map(item => item.errorMessage)
        this.$set(this.steps[stepName][recordIdx], '_errors', _errors)
      })
    },
    handleSetpClick({ label }) {
      if (label === '单晶异常') {
        this.$nextTick(() => {
          if (this.$refs.TabError && this.$refs.TabError.init) this.$refs.TabError.init()
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.growth-main {
  /deep/ {
    .el-tabs {
      overflow: visible;
    }
    .el-tabs__header {
      position: sticky;
      top: 50px;
    }
    .el-collapse-item__header {
      height: 60px;
      padding-left: 26px;
      font-size: 20px;
      position: sticky;
      top: 0;
    }
    .el-collapse-item__arrow {
      position: absolute;
      left: 0;
      color: #409EFF;
      font-weight: bold;
    }
    .el-tabs__nav {
      padding: 0;
    }
    .el-tabs__item {
      border-radius: 5px;
      font-size: 16px;
      text-align: center;
    }
    .el-tabs__item.is-active {
      font-weight: bold;
      background: rgb(217, 236, 255);
    }
    .headLine {
      padding: 0;
      border-bottom: 0;
      margin-top: -20px;
    }
    .headLine-title {
      font-size: 16px;
    }
    .check-item {
      .el-form-item__label {
        min-width: 200px;
        text-align: left;
      }
    }
    .growth-record {
      padding-left: 12px;
    }
    .growth-section {

    }
    .el-card + .el-card {
      margin-top: 20px;
    }
  }
}
</style>
