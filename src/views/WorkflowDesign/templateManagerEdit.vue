<template>
  <div class="templateManagerEdit">
    <el-form :model="formData" ref="ruleForm" :rules="rules" label-width="120px" class="demo-form" :inline="true">

      <el-form-item label="应用名称：" prop="appId">
        <el-select clearable v-model="formData.appId" placeholder="请选择">
          <el-option v-for="item in appNameData" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="组编号：" prop="code">
        <el-input v-model="formData.code"></el-input>
      </el-form-item>

      <el-form-item label="组名称：" prop="name">
        <el-input v-model="formData.name"></el-input>
      </el-form-item>

      <el-form-item label="描述：" prop="description">
        <el-input v-model="formData.description" type="textarea"></el-input>
      </el-form-item>

      <el-form-item label="状态：" prop="status">
        <el-select clearable v-model="formData.status" placeholder="请选择">
          <el-option v-for="item in processStateData" :key="item.value" :label="item.name" :value="item.value"></el-option>
        </el-select>
      </el-form-item>

    </el-form>

  </div>
</template>

<script>
export default {
  name: "templateManagerEdit",
  props: ['templateManagerEditNeedData'],
  data() {
    return {
      // 应用名称下拉框数据
      appNameData: [],
      // 状态下拉框数据
      processStateData: this.common.processState(),
      // 初始化数据
      formData: {},
      // 表单校验
      rules: {
        appId: [
          { required: true, message: '请选择应用名称', trigger: 'change' },
        ],
        code: [
          { required: true, message: '请输入组编号', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入组名称', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入描述', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' },
        ],
      },
    }
  },
  mounted() {
    if (this.templateManagerEditNeedData.saveType == 'edit') {
      this.init()
    }
    this.getAppNameData()
  },
  methods: {
    // 表单初始化
    init() {
      let _this = this
      let params = {
        busicode: '/processSet/queryForObject.htm',
        id: this.templateManagerEditNeedData.id
      }
      this.$api.fetch({
        params: params,
        method: 'get'
      }).then(res => {
        _this.formData = res
      })
    },
    // 获取应用名称下拉框数据
    getAppNameData(){
      let _this = this
      let params = {
        busicode: "/processSet/queryDesignAppList.htm",
      };
      this.$api.fetch({
        params: params,//参数
        method: 'get'
      }).then(res => {
        _this.appNameData = res
      })
    },
    // 添加/修改-保存方法（由父页面调用）
    save() {
      let _this = this
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          let params = {
            busicode: this.templateManagerEditNeedData.saveType == 'add' ? '/processSet/save.htm' : '/processSet/update.htm',
            data: {
              appId: _this.formData.appId,
              code: _this.formData.code,
              name: _this.formData.name,
              description: _this.formData.description,
              status: _this.formData.status,
            },
          }
          // 修改-保存多传id
          if (_this.templateManagerEditNeedData.saveType == 'edit') {
            params.data.id = _this.templateManagerEditNeedData.id
          }
          this.$api.fetch({
            params: params,
          }).then(res => {
            _this.$message({
              message: _this.templateManagerEditNeedData.saveType == 'add' ? '添加成功！' : '修改成功！',
              type: 'success'
            });
            _this.$parent.templateManagerEditcloseDialog()
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
.templateManagerEdit {
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


