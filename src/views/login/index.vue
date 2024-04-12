<template>
  <div class="login-container">
    <div class="login">
      <div class="login_title">
        <div class="logo">
          <img :src="App.appLogo" alt="海纳" height="105">
        </div>
<!--        <div class="logo_title">{{ App.appName }}</div>-->
      </div>
      <el-form ref="loginForm" v-if="dialogLoginVisible" autoComplete="on" :model="loginForm" :rules="loginRules"
               label-position="left" label-width="0px" class="login-form">
        <el-form-item prop="loginName">
          <el-input v-trim name="loginName" placeholder="请输入账号" suffix-icon="el-icon-user"
                    v-model="loginForm.loginName" autoComplete="on">
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-trim name="password" placeholder="请输入密码" type="password" @keyup.enter.native="handleLogin"
                    v-model="loginForm.password" autoComplete="off" suffix-icon="el-icon-lock"></el-input>
        </el-form-item>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item prop="teamGroup">
              <el-select v-model="loginForm.teamGroup" name="teamGroup" placeholder="请选择班组">
                <el-option
                  v-for="item in options_className"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="classNo">
              <el-select v-model="loginForm.classNo" name="classNo" placeholder="请选择班次">
                <el-option
                  v-for="item in options_classNo"
                  :key="item.id"
                  :label="item.classnoname"
                  :value="item.classnoname">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button :loading="loading" class="login-btn" type="primary" @click.native.prevent="handleLogin">
            登 录
          </el-button>
        </el-form-item>
      </el-form>
      <div class="version">
        更新时间: <span id="updateTime"></span>
      </div>

      <el-form ref="pass-form" v-if="dialogPassVisible" :model="passForm" :rules="passRules"
               class="card-box login-form">
        <div class="lt_warning">
          <i class="el-icon-warning-outline"></i>初次登录，请先重置密码
        </div>
        <div class="enter_item">
          <el-form-item prop="password">
            <span class="password"></span>
            <el-input v-trim type="password" v-model="passForm.password" placeholder="原始密码" autoComplete="off"></el-input>
          </el-form-item>
        </div>
        <div class="enter_item">
          <el-form-item prop="passNew">
            <span class="password"></span>
            <el-input v-trim type="password" v-model="passForm.passNew" placeholder="新密码, 必须包含字母、数字, 不少于6位"
                      autoComplete="off"></el-input>
          </el-form-item>
        </div>
        <div class="enter_item">
          <el-form-item prop="passNewAgain">
            <span class="password"></span>
            <el-input v-trim type="password" v-model="passForm.passNewAgain" placeholder="再次输入新密码"
                      autoComplete="off"></el-input>
          </el-form-item>
        </div>
        <div class="enter_item enter_btn">
          <el-form-item>
            <el-button class="login-btn" type="primary" @click.native.prevent="changeConfirm">
              重置密码
            </el-button>
          </el-form-item>
        </div>

      </el-form>

    </div>
  </div>
</template>

<script>
import {isvalidUsername} from "@/utils/validate";
import * as Login from "@/api/login";
import { validPassword } from '@/utils/validate'
import * as App from '@/utils/app'

const defaultPassForm = {
  password: '',
  passNew: '',
  passNewAgain: ''
}

export default {
  name: "login",
  data() {
    const validatePass = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入密码'))
      } else if (!validPassword(value)) {
        callback(new Error('密码必须包含字母、数字, 且不能少于6位'))
      } else {
        callback()
      }
    }
    const validatePass2 = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请再次输入密码'))
      } else if (!validPassword(value)) {
        callback(new Error('密码必须包含字母、数字, 且不能少于6位'))
      } else if (value !== this.passForm.passNew) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      App,
      loginForm: {
        loginName: '',
        password: '',
        teamGroup: localStorage.getItem('teamGroup'),
        classNo: localStorage.getItem('classNo'),
        clientType: 'pad'
      },
      loginRules: {
        loginName: [
          {required: true, message: '请输入用户名', trigger: "blur"}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: "blur"}
        ],
        teamGroup: [
          {required: true, message: '请选择班组', trigger: 'change'}
        ],
        classNo: [
          {required: true, message: '请选择班次', trigger: 'change'}
        ]
      },
      loading: false,
      options_className: [],
      options_classNo: [],
      dialogLoginVisible: true,
      dialogPassVisible: false,
      passForm: Object.assign({}, defaultPassForm),
      passRules: {
        passNew: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {validator: validatePass, trigger: 'blur'}
        ],
        passNewAgain: [
          {required: true, message: '请再次输入密码', trigger: 'blur'},
          {validator: validatePass2, trigger: 'blur'}
        ]
      },
      token: null,
      screenHeight: document.body.clientHeight,
      originHeight: document.body.clientHeight,
      seriesList: [],
      redirect: undefined,
    };
  },
  created() {
    this.getClassNo();
    setTimeout(() => {
      this.getClassName();
    }, 300);
  },
  mounted() {
    document.getElementById('updateTime').innerText = VERSION
  },
  methods: {
    getClassNo() {
      Login.getClassNo().then(data => {
        this.options_classNo = data.data;
      });
    },
    getClassName() {
      Login.getClassName().then(data => {
        this.options_className = data.data;
      });
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.login()
        }
      });
    },
    setSessionStorage() {
      const {loginName, password, classNo, teamGroup} = this.loginForm
      localStorage.setItem('classNo', classNo)
      localStorage.setItem('teamGroup', teamGroup)
      sessionStorage.setItem('classNo', classNo)
      sessionStorage.setItem('teamGroup', teamGroup)
      sessionStorage.setItem('loginName', loginName)
    },
    async login() {
      try {
        this.loading = true
        try {
          await this.$store.dispatch('Login', this.loginForm)
          this.setSessionStorage()
        } catch (err) {
          this.loading = false
          if (err.code === 201) {
            // 初次登录，先重置密码
            this.token = err.data
            this.dialogLoginVisible = false
            this.dialogPassVisible = true
            this.passForm = Object.assign({}, defaultPassForm)
            this.passForm.password = this.loginForm.password
            this.$nextTick(() => {
              this.$refs['pass-form'].clearValidate()
            })
          }
          return
        }

        // 登录成功后
        await this.$store.dispatch('getCurrentUserInfo')
        this.loading = false
        this.$router.push({ path: '/' })
      } catch (err) {
        console.log('login', err)
        this.loading = false
      }
    },
    changeConfirm() {
      this.$refs['pass-form'].validate(async (valid) => {
        if (valid) {
          const change_form = {}
          change_form.oldPassword = this.passForm.password
          change_form.newPassword = this.passForm.passNew
          await Login.updatePassword(
            change_form,
            {
              headers: {token: this.token}
            }
          )
          // 更换密码后直接登录
          this.loginForm.password = this.passForm.passNew
          this.login()
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
  }
};
</script>

<style lang="scss" scoped>
.login-container {
  height: 100vh;
  min-height: 700px;
  position: relative;
  background: #fff;
}
.login_title {
  padding: 10vh 0 5vh 0;
  text-align: center;

  > img {
    margin-bottom: 24px;
  }
}

.logo_title {
  font-weight: bold;
  font-size: 36px;
  font-family: PingFang SC;
  line-height: 60px;
}


.login-form {
  width: 60%;
  min-width: 360px;
  max-width: 480px;
  margin: auto;
  .el-form-item {
    margin-bottom: 32px;
  }
  .el-input,
  .el-select {
    width: 100%;
    /deep/ {
      input {
        height: 56px;
        font-size: 20px;
      }
      .el-input__icon {
        line-height: 56px;
        font-size: 26px;
        width: 50px;
      }
    }
  }
}
.login-btn {
  display: block;
  width: 100%;
  height: 56px;
  line-height: 30px;
  background: linear-gradient(270deg, #1283F9 0.5%, #0BA4FA 99.38%);
}

.version {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 72px;
  text-align: center;
  color: #606266;
}
</style>
