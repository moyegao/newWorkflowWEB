<template>
  <div class="whiteListEdit">
    <el-form :model="formData" ref="ruleForm" :rules="rules" label-width="120px" class="demo-form" :inline="true">

      <el-form-item label="服务器名称：" prop="servername">
        <el-input v-model="formData.servername"></el-input>
      </el-form-item>

      <el-form-item label="MAC地址：" prop="serverMAC">
        <el-input v-model="formData.serverMAC"></el-input>
      </el-form-item>

      <el-form-item label="IP地址：" prop="serverIP">
        <el-input v-model="formData.serverIP"></el-input>
      </el-form-item>

    </el-form>

  </div>
</template>

<script>
export default {
  name: "whiteListEdit",
  props: ['whiteListEditNeedData'],
  data() {
    return {
      // 初始化数据
      formData: {},
      // 表单校验
      rules: {
        servername: [
          { required: true, message: '请输入应用编号', trigger: 'blur' },
        ],
        serverMAC: [
          { required: true, message: '请输入MAC地址', trigger: 'blur' }
        ],
        serverIP: [
          { required: true, message: '请输入IP地址', trigger: 'blur' }
        ],
      },
    }
  },
  mounted() {
    if (this.whiteListEditNeedData.saveType == 'edit') {
      this.init()
    }
  },
  methods: {
    // 表单初始化
    init() {
      let _this = this
      let params = {
        busicode: '/whiteList/queryForObject.htm',
        id: this.whiteListEditNeedData.id
      }
      this.$api.fetch({
        params: params,
        method: 'get'
      }).then(res => {
        _this.formData = res;
      })
    },
    // 添加/修改-保存方法（由父页面调用）
    save() {
      let _this = this
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          let params = {
            busicode: this.whiteListEditNeedData.saveType == 'add' ? '/whiteList/save.htm' : '/whiteList/update.htm',
            data: {
              appId: _this.whiteListEditNeedData.appId,
              servername: _this.formData.servername,
              serverMAC: _this.formData.serverMAC,
              serverIP: _this.formData.serverIP,
            },
          }
          // 修改-保存多传id
          if (_this.whiteListEditNeedData.saveType == 'edit') {
            params.data.id = _this.whiteListEditNeedData.id
          }
          this.$api.fetch({
            params: params,
          }).then(res => {
            _this.$message({
              message: _this.whiteListEditNeedData.saveType == 'add' ? '添加成功！' : '修改成功！',
              type: 'success'
            });
            _this.$parent.whiteListEditCloseDialog()
          })
        } else {
          return false
        }
      });
    },

  },

}
</script>

<style lang="scss">
.whiteListEdit {
  width: 100%;
  height: calc(100% - 40px);
  overflow: auto;

  .demo-form {
    width: 80%;
    margin: 0 auto;
    .el-form-item {
      margin-bottom: 30px;
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


