<template>
  <div class="OrganizationEdit">
    <el-form :model="formData" ref="ruleForm" :rules="rules" label-width="120px" class="demo-form" :inline="true">

      <el-form-item label="父级" prop="parentId">
        <el-select v-model="formData.parentId" placeholder="请选择">
          <el-option
            v-for="item in orgList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="组织编号：" prop="code">
        <el-input v-model="formData.code"></el-input>
      </el-form-item>

      <el-form-item label="组织名称：" prop="name">
        <el-input v-model="formData.name"></el-input>
      </el-form-item>

      <el-form-item label="简称" prop="shortname">
        <el-input v-model="formData.shortname"></el-input>
      </el-form-item>
      
      <el-form-item label="分级编码" prop="classCode">
        <el-input v-model="formData.classCode"></el-input>
      </el-form-item>

      <el-form-item label="排序" prop="sn">
        <el-input type="number" v-model="formData.sn"></el-input>
      </el-form-item>

      <el-form-item label="电话" prop="tel">
        <el-input v-model="formData.tel"></el-input>
      </el-form-item>

      
      <el-form-item label="状态" prop="state">
        <el-radio-group v-model="formData.state">
          <el-radio :label="1">启用</el-radio>
          <el-radio :label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="组织类型" prop="flag">
        <el-select v-model="formData.flag" placeholder="请选择">
          <el-option
            v-for="item in flagList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="描述：" prop="description">
        <el-input v-model="formData.description" type="textarea"></el-input>
      </el-form-item>

    </el-form>

  </div>
</template>

<script>
export default {
  name: "PositionManagementEdit",
  props: ['organizationManagementEditNeedData'],
  data() {
    return {
      // 状态下拉框数据
      processStateData: this.common.processState(),
      // 初始化数据
      formData: {
        state: 1
      },
      //父级组织
      orgList: [],
      flagList: [{
        label: '原水',
        value: 1
      }, {
        label: '自来水',
        value: 2
      }],
      // 表单校验
      rules: {
        code: [
          { required: true, message: '请输入岗位编号', trigger: 'blur' },
        ],
        name: [
          { required: true, message: '请输入岗位名称', trigger: 'blur' }
        ]
      },

    }
  },
  mounted() {
    this.init()
  },
  methods: {
    // 修改时的数据初始化
    init() {
      let _this = this
      let params = {
        busicode: '/department/queryForObject.htm',
        id: this.organizationManagementEditNeedData.id
      }
      this.$api.fetch({
        params: {busicode: '/department/queryForAll.htm'},
        method: 'get'
      }).then(res => {
        _this.orgList = [...[{id: '', name: '全部'}],...res]
        if (_this.organizationManagementEditNeedData.saveType == 'edit') {
          _this.$api.fetch({
            params: params,
            method: 'get'
          }).then(res => {
            _this.formData = res
          })
        } else {
          _this.formData.parentId = this.organizationManagementEditNeedData.parentId
        }
      })
    },

    // 添加/修改-保存方法（由父页面调用）
    save() {
      let _this = this
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          let params = {
            busicode: '/department/save.htm',
            data: this.formData,
          }
          // 修改-保存多传id
          if (_this.organizationManagementEditNeedData.saveType == 'edit') {
            params.data.id = _this.organizationManagementEditNeedData.id
          }
          this.$api.fetch({
            params: params,
          }).then(res => {
            _this.$message({
              message: _this.organizationManagementEditNeedData.saveType == 'add' ? '添加成功！' : '修改成功！',
              type: 'success'
            });
            _this.$parent.closeDialog()
            _this.$parent.init()
            _this.$parent.getTreeDatas()
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
.OrganizationEdit {
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


