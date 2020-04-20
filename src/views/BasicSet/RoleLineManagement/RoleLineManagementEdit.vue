<template>
  <div class="RoleLineManagementEdit">
    <el-form :model="formData" ref="ruleForm" :rules="rules" label-width="120px" class="demo-form" :inline="true">

      <el-form-item label="岗位编号：" prop="code">
        <el-input v-model="formData.code"></el-input>
      </el-form-item>

      <el-form-item label="岗位名称：" prop="name">
        <el-input v-model="formData.name"></el-input>
      </el-form-item>

      <el-form-item label="描述：" prop="description">
        <el-input v-model="formData.description" type="textarea"></el-input>
      </el-form-item>

    </el-form>

  </div>
</template>

<script>
export default {
  name: "RoleLineManagementEdit",
  props: ['roleLineManagementEditNeedData'],
  data() {
    return {
      // 状态下拉框数据
      processStateData: this.common.processState(),
      // 初始化数据
      formData: {},
      // 表单校验
      rules: {
        code: [
          { required: true, message: '请输入岗位编号', trigger: 'blur' },
        ],
        name: [
          { required: true, message: '请输入岗位名称', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入描述', trigger: 'blur' }
        ],
      },

    }
  },
  mounted() {
    if (this.roleLineManagementEditNeedData.saveType == 'edit') {
      this.init()
    }
  },
  methods: {
    // 修改时的数据初始化
    init() {
      let _this = this
      let params = {
        busicode: '/roleLine/queryForObject.htm',
        id: this.roleLineManagementEditNeedData.id
      }
      this.$api.fetch({
        params: params,
        method: 'get'
      }).then(res => {
        _this.formData = res
      })
    },
    // 添加/修改-保存方法（由父页面调用）
    save() {
      let _this = this
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          let params = {
            busicode: '/roleLine/save.htm',
            data: {
              code: _this.formData.code,
              name: _this.formData.name,
              description: _this.formData.description,
            },
          }
          // 修改-保存多传id
          if (_this.roleLineManagementEditNeedData.saveType == 'edit') {
            params.data.id = _this.roleLineManagementEditNeedData.id
          }
          this.$api.fetch({
            params: params,
          }).then(res => {
            _this.$message({
              message: _this.roleLineManagementEditNeedData.saveType == 'add' ? '添加成功！' : '修改成功！',
              type: 'success'
            });
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
.RoleLineManagementEdit {
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


