<template>
  <div class="DataDctionaryEdit">
    <el-form :model="formData" ref="ruleForm" :rules="rules" label-width="120px" class="demo-form" :inline="true">

      <el-form-item label="组编号：" prop="code">
        <el-input v-model="formData.code"></el-input>
      </el-form-item>

      <el-form-item label="组名称：" prop="name">
        <el-input v-model="formData.name"></el-input>
      </el-form-item>

    </el-form>
    <div class="kl-table">
      <el-button size="mini" type="primary" icon="el-icon-plus" @click="addRow" class="add_line">添加行</el-button>

      <el-table stripe border :data="tableData.list" class="DataDctionary-table">

        <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
        </el-table-column>

        <el-table-column prop="key" min-width="100" label="名称">
          <template slot-scope="scope">
            <el-input v-model="scope.row.key" type="text" clearable placeholder="请输入名称">
            </el-input>
          </template>
        </el-table-column>

        <el-table-column prop="value" min-width="100" label="值">
          <template slot-scope="scope">
            <el-input v-model="scope.row.value" type="text" clearable placeholder="请输入值">
            </el-input>
          </template>
        </el-table-column>

        <el-table-column prop="sn" min-width="100" label="排序">
          <template slot-scope="scope">
            <el-input v-model="scope.row.sn" type="text" clearable placeholder="请输入排序">
            </el-input>
          </template>
        </el-table-column>

        <el-table-column class="cell" label="操作" fixed="right" width="150">
          <template slot-scope="scope">
            <el-button type="text" @click="remove(scope.row, scope.$index)">删除</el-button>
          </template>
        </el-table-column>

      </el-table>
    </div>

  </div>
</template>

<script>
export default {
  name: "DataDctionaryEdit",
  props: ['dataDctionaryEditNeedData'],
  data() {
    return {
      // 列表数据
      tableData: {
        list: [
          {}
        ]
      },
      //查询条件对象
      tableQuery: {
        page: 1,
        pageSize: 20,
      },
      // 列表高度所需字段
      tableShow: false,
      maxHeight: 0,
      // 初始化数据
      formData: {},
      // 初始化时未修改的组编号
      oldCode: '',
      // 表单校验
      rules: {
        code: [
          { required: true, message: '请输入组编号', trigger: 'blur' },
        ],
        name: [
          { required: true, message: '请输入组名称', trigger: 'blur' }
        ],
      },
    }
  },
  mounted() {
    if (this.dataDctionaryEditNeedData.saveType == 'edit') {
      this.init()
    }
  },
  methods: {
    // 修改时的数据初始化
    init() {
      let _this = this
      let params = {
        busicode: '/enum/queryForObject.htm',
        code: this.dataDctionaryEditNeedData.code
      }
      this.$api.fetch({
        params: params,
        method: 'get'
      }).then(res => {
        _this.formData = res
        _this.tableData.list = res.itemBeans
        _this.oldCode = res.code
      })
    },
    // 添加/修改-保存方法（由父页面调用）
    save() {
      let _this = this
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          let params = {
            busicode: this.dataDctionaryEditNeedData.saveType == 'add' ? '/enum/save.htm' : '/enum/update.htm',
            data: {
              code: _this.formData.code,
              name: _this.formData.name,
              itemBeans: _this.tableData.list
            },
          }
          // 修改-保存多传oldCode
          if (_this.dataDctionaryEditNeedData.saveType == 'edit') {
            params.data.oldCode = _this.oldCode
          }
          this.$api.fetch({
            params: params,
          }).then(res => {
            _this.$message({
              message: _this.dataDctionaryEditNeedData.saveType == 'add' ? '添加成功！' : '修改成功！',
              type: 'success'
            });
            _this.$parent.closeDialog()
            _this.$parent.init()
            _this.$parent.getDataDictionary()
          })
        } else {
          return false;
        }
      });
    },
    // 添加行按钮
    addRow() {
      this.tableData.list.push({
        key: '',
        value: '',
        sn: '',
      })
    },
    // 删除按钮
    remove(row, index) {
      let _this = this
      _this.tableData.list.splice(1, index)
    },
    // 列表的NO列
    indexMethod(index) {
      //获取表格序号
      return (
        this.tableQuery.pageSize * (this.tableQuery.page - 1) + (index + 1)
      );
    },
  },

}
</script>

<style lang="scss">
.DataDctionaryEdit {
  width: 100%;
  height: calc(100% - 40px);
  overflow: auto;
  .add_line {
    float: right;
    margin-bottom: 0.2rem;
  }

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


