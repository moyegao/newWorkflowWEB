<template>
  <div class="adminEdit">
    <el-form :model="formData" ref="ruleForm" :rules="rules" label-width="120px" class="demo-form" :inline="true">

      <el-form-item label="管理员名称：" prop="administratorId">
        <el-select clearable v-model="formData.administratorId" placeholder="请选择">
          <el-option v-for="item in administratorData" :key="item.administratorId" :label="item.name" :value="item.administratorId"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item class="checkBox">
        <el-checkbox v-model="formData.designRight">设计权限</el-checkbox>
        <el-checkbox v-model="formData.watchRight">监控权限</el-checkbox>
      </el-form-item>

    </el-form>

  </div>
</template>

<script>
export default {
  name: "adminEdit",
  props: ['adminEditNeedData'],
  data() {
    return {
      // 管理员名称下拉框数据
      administratorData: [],
      // 初始化数据
      formData: {
        designRight: false,
        watchRight: false,
      },
      // 表单校验
      rules: {
        administratorId: [
          { required: true, message: '请选择管理员', trigger: 'change' },
        ],
      },
    }
  },
  mounted() {
    // 获取管理员名称下拉数据
    this.getAdministratorData()
    // 修改-初始化
    if (this.adminEditNeedData.saveType == 'edit') {
      this.init()
    }
  },
  methods: {
    init() {
      let _this = this
      let params = {
        busicode: '/administratorApp/queryForObject.htm',
        id: this.adminEditNeedData.id
      }
      this.$api.fetch({
        params: params,
        method: 'get'
      }).then(res => {
        _this.formData = res

        // 将设计权限和监控权限字段转为多选框可接收的数据
        if (_this.formData.designRight == 1) {
          _this.formData.designRight = true
        } else if (_this.formData.designRight == 0) {
          _this.formData.designRight = false
        }
        if (_this.formData.watchRight == 1) {
          _this.formData.watchRight = true
        } else if (_this.formData.watchRight == 0) {
          _this.formData.watchRight = false
        }
      })
    },
    // 获取管理员名称下拉数据
    getAdministratorData() {
      let _this = this
      let params = {
        busicode: "/administratorApp/queryAdministrators.htm",
      };
      this.$api.fetch({
        params: params,//参数
        method: 'get'
      }).then(res => {
        _this.administratorData = res
      })
    },
    // 添加/修改-保存方法（由父页面调用）
    save() {
      let _this = this
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          let params = {
            busicode: this.adminEditNeedData.saveType == 'add' ? '/administratorApp/save.htm' : '/administratorApp/update.htm',
            data: {
              appId: _this.adminEditNeedData.appId,
              administratorId: _this.formData.administratorId,
              designRight: _this.formData.designRight ? 1 : 0,
              watchRight: _this.formData.watchRight ? 1 : 0,
            },
          }
          // 修改-保存多传id
          if (_this.adminEditNeedData.saveType == 'edit') {
            params.data.id = _this.adminEditNeedData.id
          }
          this.$api.fetch({
            params: params,
          }).then(res => {
            _this.$message({
              message: _this.adminEditNeedData.saveType == 'add' ? '添加成功！' : '修改成功！',
              type: 'success'
            });
            _this.$parent.adminEditCloseDialog()
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
.adminEdit {
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

    .checkBox .el-form-item__content {
      padding-left: 130px;
    }
  }
}
</style>


