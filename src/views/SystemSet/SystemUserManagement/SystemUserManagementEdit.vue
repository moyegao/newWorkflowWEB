<template>
  <div class="SystemUserManagementEdit">
    <el-form :model="formData" :rules="systemUserManagementEditNeedData.saveType == 'add' ? rulesAdd : rulesEdit" ref="ruleForm" label-width="120px" class="demo-form" :inline="true">

      <el-form-item label="用户名称：" prop="name">
        <el-input v-model="formData.name"></el-input>
      </el-form-item>

      <el-form-item label="用户账号：" prop="account">
        <el-input v-model="formData.account"></el-input>
      </el-form-item>

      <el-form-item label="用户密码：" prop="password">
        <el-input v-model="formData.password" type="password"></el-input>
      </el-form-item>

      <el-form-item label="确认密码：" prop="confirmPassword">
        <el-input v-model="formData.confirmPassword" type="password"></el-input>
      </el-form-item>

      <el-form-item label="超级管理员：">
        <el-checkbox v-model="formData.supperManager"></el-checkbox>
      </el-form-item>

    </el-form>

  </div>
</template>

<script>
export default {
  name: "SystemUserManagementEdit",
  props: ['systemUserManagementEditNeedData'],
  data() {
    return {
      // 初始化数据
      formData: {
        supperManager: false
      },
      // 表单校验
      rulesAdd: {
        name: [
          { required: true, message: '请输入指标维键', trigger: 'blur' },
        ],
        account: [
          { required: true, message: '请输入指标名称', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入指标描述', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请输入指标级别', trigger: 'blur' }
        ],
      },
      // 表单校验
      rulesEdit: {
        name: [
          { required: true, message: '请输入指标维键', trigger: 'blur' },
        ],
        account: [
          { required: true, message: '请输入指标名称', trigger: 'blur' }
        ],
      },
    }
  },
  mounted() {
    if (this.systemUserManagementEditNeedData.saveType == 'edit') {
      this.init()
    }

  },
  methods: {
    // 修改时的数据初始化
    init() {
      let _this = this
      let params = {
        busicode: '/administrator/queryForObject.htm',
        id: this.systemUserManagementEditNeedData.id
      }
      this.$api.fetch({
        params: params,
        method: 'get'
      }).then(res => {
        _this.formData = res
        _this.formData.password = ''
        _this.formData.confirmPassword = ''
        if (_this.formData.supperManager == 1) {
          _this.formData.supperManager = true
        }else if (_this.formDate.supperManager == 0) {
          _this.formData.supperManager = false
        }
      })
    },
    // 添加/修改-保存方法（由父页面调用）
    save() {
      let _this = this
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          console.log(_this.formData);
          let params = {
            busicode: this.systemUserManagementEditNeedData.saveType == 'add' ? '/administrator/save.htm' : '/administrator/update.htm',
            data: {
              account: _this.formData.account,
              name: _this.formData.name,
              password: _this.formData.password == ''? '' : _this.$md5(_this.formData.password),
              confirmPassword: _this.formData.confirmPassword == ''? '' : _this.$md5(_this.formData.confirmPassword),
              supperManager: _this.formData.supperManager? 1 : 0,
            },
          }
          // 修改-保存多传id
          if (_this.systemUserManagementEditNeedData.saveType == 'edit') {
            params.data.id = _this.systemUserManagementEditNeedData.id
          }
          this.$api.fetch({
            params: params,
          }).then(res => {
            _this.$message({
              message: _this.systemUserManagementEditNeedData.saveType == 'add' ? '添加成功！' : '修改成功！',
              type: 'success'
            })
            _this.$parent.closeDialog()
            _this.$parent.init()
          })
        } else {
          return false;
        }
      });
    },


  },

}
</script>

<style lang="scss">
.SystemUserManagementEdit {
  width: 100%;
  height: calc(100% - 40px);
  overflow: auto;

  .demo-form {
    width: 80%;
    margin: 0 auto;
    .el-form-item {
      margin-bottom: 15px;
    }
    .el-form-item__label {
      font-size: 12px;
    }
    .select-member {
      font-size: 12px;
    }
    .el-textarea__inner {
      min-height: 100px !important;
    }
    .el-form-item {
      width: 80%;
      margin-right: 0px;
      .el-form-item__content {
        width: calc(100% - 120px);
        .el-select {
          width: 100%;
        }
        .el-input__inner {
          height: 30px;
          line-height: 30px;
        }
      }
    }
  }
}
</style>


