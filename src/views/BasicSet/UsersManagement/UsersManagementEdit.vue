<template>
  <div class="UserEdit">
    <el-form :model="formData" ref="ruleForm" :rules="rules" label-width="120px" class="demo-form" :inline="true">

      <el-form-item label="部门" prop="departmentid">
        <el-select v-model="formData.departmentid" placeholder="请选择">
          <el-option
            v-for="item in orgList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="账号" prop="account">
        <el-input v-model="formData.account"></el-input>
      </el-form-item>
      <el-form-item label="工号：" prop="code">
        <el-input v-model="formData.code"></el-input>
      </el-form-item>

      <el-form-item label="姓名" prop="name">
        <el-input v-model="formData.name"></el-input>
      </el-form-item>

      <el-form-item label="职位" prop="position">
        <el-input v-model="formData.position"></el-input>
      </el-form-item>
      
      <el-form-item label="电话" prop="phone">
        <el-input v-model="formData.phone"></el-input>
      </el-form-item>

      <el-form-item label="手机" prop="mobile">
        <el-input v-model="formData.mobile"></el-input>
      </el-form-item>

      <el-form-item label="邮箱" prop="email">
        <el-input v-model="formData.email"></el-input>
      </el-form-item>

      
      <el-form-item label="性别" prop="sex">
        <el-radio-group v-model="formData.sex">
          <el-radio :label="1">男</el-radio>
          <el-radio :label="0">女</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="证件号码" prop="idcard">
        <el-input v-model="formData.idcard"></el-input>
      </el-form-item>

      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio :label="1">启用</el-radio>
          <el-radio :label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>

    </el-form>

  </div>
</template>

<script>
export default {
  name: "PositionManagementEdit",
  props: ['userManagementEditNeedData'],
  data() {
    return {
      // 状态下拉框数据
      processStateData: this.common.processState(),
      // 初始化数据
      formData: {
        status: 1,
        sex: 1
      },
      //组织
      orgList: [],
      // 表单校验
      rules: {
        code: [
          { required: true, message: '请输入岗位编号', trigger: 'blur' },
        ],
        name: [
          { required: true, message: '请输入岗位名称', trigger: 'blur' }
        ],
        account: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        email: [
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
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
        busicode: '/staff/queryForObject.htm',
        id: this.userManagementEditNeedData.id
      }
      this.$api.fetch({
        params: {busicode: '/department/queryForAll.htm'},
        method: 'get'
      }).then(res => {
        _this.orgList = [...[{id: '', name: '全部'}],...res]
        if (_this.userManagementEditNeedData.saveType == 'edit') {
          _this.$api.fetch({
            params: params,
            method: 'get'
          }).then(res => {
            _this.formData = res
          })
        }else {
          _this.formData.departmentid = this.userManagementEditNeedData.departmentId
        }
      })
    },

    // 添加/修改-保存方法（由父页面调用）
    save() {
      let _this = this
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          let params = {
            busicode: '/staff/save.htm',
            data: this.formData,
          }
          // 修改-保存多传id
          if (_this.userManagementEditNeedData.saveType == 'edit') {
            params.data.id = _this.userManagementEditNeedData.id
          }
          this.$api.fetch({
            params: params,
          }).then(res => {
            _this.$message({
              message: _this.userManagementEditNeedData.saveType == 'add' ? '添加成功！' : '修改成功！',
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
.UserEdit {
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


