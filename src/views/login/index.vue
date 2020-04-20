<template>
  <div class="login" @keyup.enter="submitForm('ruleForm')">
    <el-container>
      <el-header class="head">
        <img src="static/images/logo.png" alt="" class="logo">
      </el-header>
      <el-main>
        <div class="mainBackground" v-bind:style="tu">
        </div>
        <div class="register">
          <div class="content">
            <el-form :model="ruleForm" ref="ruleForm" label-width="50px" class="demo-ruleForm">
              <span style="font-size:16px"><b>账号登录</b></span>
              <el-form-item label="账号" prop="account" class="lbl">
                <el-input v-model="ruleForm.account" class="ipt"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password" class="lbl">
                <el-input type="password" v-model="ruleForm.password" auto-complete="off" class="ipt"></el-input>
              </el-form-item>
              <el-form-item class="btu">
                <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                <el-button @click="resetForm('ruleForm')">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
// import banner from "../assets/images/banner.jpg"
// import banner2 from "../assets/images/banner2.jpg"
export default {
  name: "login",
  data() {
    return {
      ruleForm: {
        account: '',
        password: '',
      },
      rules2: {
        account: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
      },
      description: '',

      tu: {
        background: 'url(static/images/banner3.jpg) 0px -111px no-repeat',
      },
      tu1: {
        background: 'url(static/images/banner.jpg) no-repeat 0px 0px',
        backgroundSize: '101% 100%',
      },
      tu2: {
        background: 'url(static/images/banner2.jpg) no-repeat 0px 0px',
        backgroundSize: '100% 100%',
      },
    };
  },
  mounted() {
  },
  methods: {
    submitForm(formName) {
      let _this = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = {
            busicode: '/login.htm',
            data: {
              account: _this.ruleForm.account,
              password: _this.$md5(_this.ruleForm.password),
            }
          }
          this.$api.fetch({
            params: params,//参数
          }).then(res => {
            localStorage.setItem('token', res)
            _this.getDataDictionary()
            _this.$router.push('/home')
            // $("#app #firstNav #nav .navList").children('li').eq(0).addClass("active").siblings().removeClass("active")
          })
          // _this.$router.push('/waterSet')
        } else {
          return false;
        }
      });
    },
    // 获取所有数据字典下拉数据
    getDataDictionary() {
      let _this = this
      let params = {
        busicode: "/enum/queryAllEnum.htm",
      };
      this.$api.fetch({
        params: params,//参数
        method: 'get'
      }).then(res => {
        // 存储数据字典于本地
        res.forEach(item => {
          _this.$store.state.getDataDictionary[item.code] = item.items
        });
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
}
</script>

<style lang="scss" scoped>
.login {
  height: 100%;
  .el-container {
    height: 100%;
  }
  .el-header {
    background-color: #2196f300;
    color: #333;
    text-align: center;
    line-height: 60px;
  }
  .el-aside {
    background-color: #d3dce6;
    color: #333;
    text-align: center;
    line-height: 200px;
  }
  .el-main {
    background-color: #e9eef3;
    color: #333;
    text-align: center;
    height: 100%;
    padding: 0px;
  }
  body > .el-container {
    height: 100%;
    margin-bottom: 40px;
  }
  .logo {
    float: left;
  }
  .btu > .el-form-item__content {
    margin-left: 15px;
  }
  .mainBackground {
    background-color: #fff;
    background-size: 100% !important;
    width: 100%;
    height: 100%;
  }
  .register {
    position: absolute;
    top: 135px;
    right: 0px;
    width: 30%;
    height: 380px;
    overflow: hidden;
    margin: 50px 40px;
  }
  .text {
    font-size: 14px;
  }
  .content {
    background: rgba(255, 255, 255, 0.93);
    border-radius: 4px;
    width: 300px;
    height: 250px;
    margin-top: 10px;
    margin-left: 10px;
    border: 15px solid #00bcd400;
  }
  .item {
    padding: 18px 0;
  }
  .box-card {
    width: 480px;
  }
  ul {
    background: rgba(255, 255, 255, 0.48);
    height: 100%;
  }
  li {
    height: 10%;
    margin: 3px;
  }
  .btu {
    .el-form-item__content {
      background-color: red;
    }
  }
  .lbl {
    margin-top: 20px;
  }
}
</style>
  