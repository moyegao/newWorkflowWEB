<template>
  <div class="InterfaceCallLogEdit">
    <el-form :model="formData" ref="ruleForm" label-width="120px" class="demo-form" :inline="true">

      <el-form-item label="接口类型：">
        <el-input v-model="formData.interfaceTypeName" class="read-only" disabled="disabled"></el-input>
      </el-form-item>

      <el-form-item label="应用名称：">
        <el-input v-model="formData.appName" class="read-only" disabled="disabled"></el-input>
      </el-form-item>

      <el-form-item label="IP：">
        <el-input v-model="formData.ip" class="read-only" disabled="disabled"></el-input>
      </el-form-item>

      <el-form-item label="执行时间：">
        <el-input v-model="formData.operateTime" class="read-only" disabled="disabled"></el-input>
      </el-form-item>

      <el-form-item label="执行时长：">
        <el-input v-model="formData.doTime" class="read-only" disabled="disabled"></el-input>
      </el-form-item>
      
      <el-form-item label="入参：">
        <el-input v-model="formData.inParam" type="textarea" readonly='true'></el-input>
      </el-form-item>
      
      <el-form-item label="出参：">
        <el-input v-model="formData.outParam" type="textarea" readonly='true'></el-input>
      </el-form-item>

    </el-form>

  </div>
</template>

<script>
export default {
  name: "InterfaceCallLogEdit",
  props: ['interfaceCallLogEditNeedData'],
  data() {
    return {
      // 初始化数据
      formData: {},
    }
  },
  mounted() {
    this.init()

  },
  methods: {
    // 表单数据初始化
    init() {
      let _this = this
      let params = {
        busicode: '/interfacelog/queryForObject.htm',
        id: this.interfaceCallLogEditNeedData.id
      }
      this.$api.fetch({
        params: params,
        method: 'get'
      }).then(res => {
        _this.formData = res
      })
    },
  },

}
</script>

<style lang="scss">
.InterfaceCallLogEdit {
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


