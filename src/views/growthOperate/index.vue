<!--长晶-->
<template>
  <div class="detailBox">
    <!-- 顶部信息卡片 -->
    <div class="topInfoCard">
      <div class="grid-container">
        <div class="grid-item">
          <span class="grid-item-name">批次号：</span>
          <span class="grid-item-value">{{ fromData.processOrderCode }}</span>
        </div>
        <div class="grid-item">
          <span class="grid-item-name">长晶炉：</span>
          <span class="grid-item-value">{{ fromData.deviceCode }}</span>
        </div>
      </div>
    </div>

    <div v-loading="loading" class="fromCard growth-main">
      <el-tabs v-if="tabsVisible" tab-position="left" @tab-click="handleSetpClick">
        <el-tab-pane v-for="(stepName, index) in calcStepNameList" :key="index" :label="stepName">
          <TabItem
            ref="TabItem"
            :step-data="steps[stepName]"
            :step-name="stepName"
            :can-add-record="fnCanAddrecord(stepName)"
            :crystal-growth-err-list="crystalGrowthErrList"
          />
        </el-tab-pane>
        <el-tab-pane label="单晶异常">
          <TabError
            ref="TabError"
            :steps="steps"
            :step-name-list="calcStepNameList"
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
    <div class="pageHandleBox" v-if="!$route.query.view">
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

const defaultCheckItem = {
  checkItem: null, // 点检项
  isError: null, // 是否异常
  errorMessage: null, // 异常说明
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
      name2form: {},
      fromData: {},
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
    },
    stepTabs() {
      return [
        {
          stepName: '拆炉',
          canAddRecord: true, // 允许添加记录
        },
        {
          stepName: '抽真空',
          showUserCreate: true, // 显示操作者1
        },
        {
          stepName: '检漏',
          showUserCreate: true, // 显示操作者1
        },
        {
          stepName: '煅烧',
          canAddRecord: true, // 允许添加记录
        },
        {
          stepName: '化料'
        },
        {
          stepName: '稳温'
        },
        {
          stepName: '引晶'
        },
        {
          stepName: '放肩'
        },
        {
          stepName: '等径'
        },
        {
          stepName: '收尾'
        },
        {
          stepName: '冷却',
          canAddRecord: true,
        },
        {
          stepName: '煅烧冷却'
        },
        {
          stepName: '吊单晶',
          canAddRecord: true,
        },
        {
          stepName: '回熔',
          canAddRecord: true,
        },
        {
          stepName: '吊肩',
          canAddRecord: true,
        },
        {
          stepName: '补掺',
          canAddRecord: true,
        }
      ]
    },
    calcStepNameList() {
      const list = []
      this.stepTabs.forEach(({ stepName, canAddRecord }) => {
        if (!this.steps[stepName] && !canAddRecord) return
        list.push(stepName)
      })
      return list
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

      const { steps, ...rest } = fromData
      this.steps = Object.assign({}, steps)
      if (!this.steps['留档文档']) {
        this.$set(this.steps, '留档文档', [{ fiels: [] }])
      }
      this.fromData = rest

      // 查询动态表单配置
      await this.initFormContent()
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
        const stepData = steps[stepName]
        if (!stepData || !stepData.length) return delete steps[stepName]
        stepData.forEach((recordItem) => {
          const { exts, techs } = recordItem
          this.transformExts(exts)
          this.transformTechs(techs)

          // errors
          recordItem.errors = (recordItem._errors || []).map(errorMessage => ({ errorMessage }))
          delete recordItem._errors
        })
      })
      return {
        ...this.fromData,
        steps
      }
    },
    transformExts(arr) {
      if (!Array.isArray(arr)) return
      for (let index = 0; index < arr.length; index++) {
        const { extValue, vModel } = arr[index]
        if (['userCreate', 'userOperate2', 'totalQty', 'goodQty', 'scrapQty', 'errors'].includes(vModel)) {
          arr.splice(index, 1)
          index--
          continue
        }
        if (extValue && (typeof extValue === 'object')) {
          arr[index].extValue = JSON.stringify(extValue)
        }
        this.deleteNeedlessFields(arr[index])
      }
    },
    transformTechs(arr) {
      if (!Array.isArray(arr)) return
      for (let index = 0; index < arr.length; index++) {
        const { extValue } = arr[index]
        if (extValue && (typeof extValue === 'object')) {
          arr[index].extValue = JSON.stringify(extValue)
        }
        this.deleteNeedlessFields(arr[index])
      }
    },
    deleteNeedlessFields(item) {
      const needlessFields = ['androidType', 'append', 'changeTag', 'clearable', 'disabled', 'document', 'filterable', 'formId', 'format', 'label', 'labelWidth', 'layout', 'maxlength', 'multiple', 'options', 'placeholder', 'prefix-icon', 'prepend', 'readonly', 'regList', 'renderKey', 'required', 'show-word-limit', 'span', 'style', 'suffix-icon', 'tag', 'tagIcon', 'type', 'vModel', 'value-format']
      needlessFields.forEach(field => delete item[field])
    },
    initFormContent() {
      return fetchModelForm({
        search_LLIKE_name: '长晶-'
      }).then(res => {
        res.data.forEach(form => {
          this.name2form[form.name] = form
        })
        this.calcStepNameList.forEach(stepName => {
          if (!this.steps[stepName]) {
            this.$set(this.steps, stepName, [])
            return
          }
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
          recordItem.checks.forEach(data => {
            label2value[data.checkItem] = data
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
          recordItem.techs.forEach(data => {
            label2value[data.extKey] = data
          })
        }

        const techs = []
        formContent.forEach(formItem => {
          techs.push({
            ...formItem,
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
          recordItem.exts.forEach(data => {
            label2value[data.extKey] = data
          })
        }

        const exts = []
        formContent.forEach(formItem => {
          const { label } = formItem
          const techItem = {
            ...formItem,
            ...label2value[label],
            extKey: label
          }
          exts.push(techItem)
        })



        this.$set(this.steps[stepName][recordIdx], 'exts', exts)
      })
    },
    // 异常
    initErrors(stepName) {
      const form = this.name2form[`长晶-${stepName}-其余参数`]
      if (!form) return

      const formContent = form.content
      const errFormItemIdx = formContent.findIndex(({ label }) => label === '单晶异常')
      let _showErrors = false
      if (errFormItemIdx > -1) {
        _showErrors = true
        formContent.splice(errFormItemIdx, 1)
      }
      this.steps[stepName].forEach((recordItem, recordIdx) => {
        recordItem._showErrors = _showErrors
        const _errors = (recordItem.errors || []).map(item => item.errorMessage)
        this.$set(this.steps[stepName][recordIdx], '_errors', _errors)
      })
    },
    handleSetpClick({ label }) {
      switch (label) {
        case '单晶异常':
          this.$nextTick(() => {
            if (this.$refs.TabError && this.$refs.TabError.init) this.$refs.TabError.init()
          })
          break
        case '留档文档':
          this.$nextTick(() => {
            if (this.$refs.TabFile && this.$refs.TabFile.init) this.$refs.TabFile.init()
          })
          break
        default:
      }
    },
    fnCanAddrecord(stepName) {
      const matched = this.stepTabs.find(item => item.stepName === stepName)
      return matched ? !!matched.canAddRecord : false
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
