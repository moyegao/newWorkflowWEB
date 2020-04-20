<template>
  <!-- templateManager -->
  <div class="templateManager">

    <div class="toolbar">
    </div>
    <div class="kl-table">
      <el-table v-if="tableShow" :max-height="maxHeight" stripe border :data="tableData.list" @cell-click="cellClick" class="templateManager-table">

        <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
        </el-table-column>

        <el-table-column prop="appCode" min-width="60" label="应用编号">
        </el-table-column>

        <el-table-column prop="appName" min-width="60" label="应用名称">
        </el-table-column>

        <el-table-column prop="code" min-width="60" label="组编号">
        </el-table-column>

        <el-table-column prop="name" min-width="60" label="组名称">
        </el-table-column>

        <el-table-column prop="statusName" min-width="60" label="状态">
        </el-table-column>

        <el-table-column prop="createUserName" min-width="60" label="创建人">
        </el-table-column>

        <el-table-column prop="createTime" min-width="80" label="创建时间">
        </el-table-column>

        <el-table-column prop="lastUpdateUserName" min-width="60" label="修改人">
        </el-table-column>

        <el-table-column prop="lastUpdateTime" min-width="80" label="修改时间">
        </el-table-column>

        <el-table-column class="cell" label="操作" fixed="right" width="150">
          <template slot-scope="scope">
            <el-button type="text" @click="edit(scope.row)">修改</el-button>
            <span>|</span>
            <el-button type="text" @click="copy(scope.row)">复制</el-button>
            <span>|</span>
            <el-button type="text" @click="remove(scope.row)">删除</el-button>
          </template>
        </el-table-column>

      </el-table>
      <!-- 分页 -->
      <div class="block">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1" :page-sizes="[20, 50, 100]" :page-size="20" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
        </el-pagination>
      </div>
    </div>
    <!-- 复制按钮弹出框 -->
    <el-dialog title="复制模板组" :visible.sync="copyShow">
      <el-form :model="copyData" :rules="rules" ref="copyForm">
        <el-form-item label="组编号：" label-width="120px" prop="code">
          <el-input v-model="copyData.code"></el-input>
        </el-form-item>
        <el-form-item label="组名称：" label-width="120px" prop="name">
          <el-input v-model="copyData.name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="copyShow = false">取 消</el-button>
        <el-button type="primary" @click="copySave">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "templateManager",
  data() {
    return {
      // 列表数据
      tableData: {
        list: [
          {}
        ],
      },
      //查询条件对象
      tableQuery: {
        page: 1,
        pageSize: 20,
      },
      // 列表高度所需数据
      tableShow: false,
      maxHeight: 0,
      // 显示复制弹出框
      copyShow: false,
      // 复制按钮弹出框数据
      copyData: {},
      // 复制弹出框表单校验
      rules: {
        code: [
          { required: true, message: '请输入模板编号', trigger: 'blur' },
        ],
        name: [
          { required: true, message: '请输入模板名称', trigger: 'blur' }
        ],
      },
    };
  },
  mounted() {
    this.init()
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
    this.common.changeTable(this, ".templateManager", [
      ".templateManager .toolbar",
      ".templateManager .block",
    ]);
    console.log(
      $('.templateManager .toolbar').height()
    );
  },
  methods: {
    // 列表初始化
    init() {
      let _this = this
      let params = {
        busicode: "/processSet/queryForList.htm",
        page: _this.tableQuery.page,
        pageSize: _this.tableQuery.pageSize,
      };
      this.$api.fetch({
        params: params,//参数
        method: 'get'
      }).then(res => {
        _this.tableData = res

        // 状态数据处理
        for (let i = 0; i < _this.tableData.list.length; i++) {
          if (_this.tableData.list[i].status == '1') {
            _this.tableData.list[i].statusName = '启用'
          } else if (_this.tableData.list[i].status == '0') {
            _this.tableData.list[i].statusName = '停用'
          }
        }
      })
    },
    // 修改按钮
    edit(row) {
      this.$parent.templateManagerEditShow = true
      this.$parent.templateManagerShow = false
      this.$parent.templateManagerEditNeedData = row
      this.$parent.templateManagerEditNeedData.saveType = 'edit'
    },
    // 复制按钮
    copy(row) {
      this.copyShow = true
      this.copyData.id = row.id
    },
    // 删除按钮
    remove(row) {
      let _this = this
      this.$confirm('是否确定删除该条数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        let params = {
          busicode: "/processSet/delete.htm?id=" + row.id,
        };
        this.$api.fetch({
          params: params,
        }).then(res => {
          _this.$message({
            type: 'success',
            message: '删除成功！'
          })
          _this.init()
        })
      }).catch(() => {
        _this.$message({
          type: 'info',
          message: '已取消删除'
        })
      });
    },
    // 首页复制弹出框确定按钮
    copySave() {
      let _this = this
      this.$refs['copyForm'].validate((valid) => {
        if (valid) {
          let params = {
            busicode: '/processSet/copyProcessSet.htm?id=' + _this.copyData.id + '&code=' + _this.copyData.code + '&name=' + _this.copyData.name,

          }
          this.$api.fetch({
            params: params,
          }).then(res => {
            _this.$message({
              message: '复制成功！',
              type: 'success'
            });
            _this.copyShow = false
            _this.copyData = {}
            _this.init()
          }).catch(err => {
            _this.copyShow = false
            _this.copyData = {}
          })
        } else {
          return false;
        }
      });
    },
    //分页
    handleSizeChange(val) {
      //显示多少数据一页
      this.tableQuery.pageSize = val
      this.tableQuery.page = 1
      this.init();
    },
    handleCurrentChange(val) {
      //显示多少页码
      this.tableQuery.page = val
      this.init();
    },
    cellClick(row, column, cell, event) {
      //点击文件名
      let that = this;
    },
    // 列表的NO列
    indexMethod(index) {
      //获取表格序号
      return (
        this.tableQuery.pageSize * (this.tableQuery.page - 1) + (index + 1)
      );
    },

  },
  watch: {
    maxHeight() {
      this.tableShow = false;
      this.$nextTick(() => {
        this.tableShow = true;
      });
    }
  }
};
</script>
<style lang="scss">
@import "../../assets/styles/scss/base/fn";
$imgWidth: 200px;
$theme-color: #297acc;
.templateManager {
  width: 100%;
  height: calc(100% - 40px);
  .el-dialog {
    margin-top: 15vh !important;
    width: 50%;
    height: 45%;
    .el-dialog__body {
      .el-form {
        padding-top: 40px;
        .el-form-item {
          width: 60%;
        }
      }
      .el-input__inner {
        height: 40px;
        line-height: 40px;
      }
    }
    .el-dialog__footer {
      border-top: none;
      text-align: right;
      padding: 5px 30px !important;
    }
  }
}
</style>
