<template>
  <div class="WorkflowDesignEdit">
    <el-form :model="formData" ref="ruleForm" :rules='rules' label-width="120px" class="demo-form" :inline="true">

      <el-form-item label="所属应用：">
        <el-input class="read-only" disabled="disabled" v-model="formData.appName" placeholder=""></el-input>
      </el-form-item>

      <el-form-item label="所属组：">
        <el-input class="read-only" disabled="disabled" v-model="formData.setName" placeholder=""></el-input>
      </el-form-item>

      <el-form-item label="模板编号：" prop="code">
        <el-input v-model="formData.code"></el-input>
      </el-form-item>

      <el-form-item label="模板名称：" prop="name">
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
  name: "WorkflowDesignEdit",
  props: ['workflowDesignEditNeedData'],
  data() {
    return {
      // 状态下拉框数据
      processStateData: this.common.processState(),
      // 初始化数据
      formData: {},









      dialogImageUrl: '',
      dialogVisible: false,
      databaseData: [],
      groupOption: [],
      groupSelectShow: false,
      rules: {
        code: [
          { required: true, message: '请输入模板编号', trigger: 'blur' },
        ],
        name: [
          { required: true, message: '请输入模板名称', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入描述', trigger: 'blur' }
        ],
      },
    }
  },
  mounted() {
    if (this.workflowDesignEditNeedData.saveType == 'add') {
      this.formData = this.workflowDesignEditNeedData
    }else if (this.workflowDesignEditNeedData.saveType == 'edit') {
      this.init();
    }
    

  },
  methods: {
    // 表单初始化
    init() {
      console.log(this.workflowDesignEditNeedData);
      let _this = this
      let params = {
        busicode: '/process/queryForObject.htm',
        id: this.workflowDesignEditNeedData.id
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
            busicode: this.workflowDesignEditNeedData.saveType == 'add' ? '/process/save.htm' : '/process/update.htm',
            data: {
              appId: _this.formData.appId,
              setId: _this.formData.setId,
              code: _this.formData.code,
              name: _this.formData.name,
              description: _this.formData.description,
            },
          }
          // 修改-保存多传id
          if (_this.workflowDesignEditNeedData.saveType == 'edit') {
            params.data.id = _this.workflowDesignEditNeedData.id
          }
          this.$api.fetch({
            params: params,
          }).then(res => {
            _this.$message({
              message: _this.workflowDesignEditNeedData.saveType == 'add' ? '添加成功！' : '修改成功！',
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
.WorkflowDesignEdit {
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


