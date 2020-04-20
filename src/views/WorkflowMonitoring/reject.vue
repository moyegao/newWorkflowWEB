<template>
  <!-- versionQuery -->
  <div class="versionQuery">
    <div>

      <div class="toolbar">
      </div>
      <div class="kl-table">
        <el-table v-if="tableShow" :max-height="maxHeight" stripe border :data="tableData" @cell-click="cellClick" class="versionQuery-table">

          <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
          </el-table-column>

          <el-table-column label="选择" width="80">
            <template slot-scope="scope">
              <el-radio :label="scope.$index" :disabled="scope.$index == (tableData.length - 1)" v-model="tableChecked" @change.native="getCurrentRow(scope.row)">&nbsp;</el-radio>
            </template>
          </el-table-column>

          <el-table-column prop="nowNodeName" min-width="100" label="节点列表">
          </el-table-column>

          <el-table-column prop="operationUserName" min-width="100" label="操作人">
          </el-table-column>

        </el-table>
        <!-- 分页 -->
        <div class="block">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1" :page-sizes="[20, 100, 500, 1000]" :page-size="20" layout="total, sizes, prev, pager, next, jumper" :total="histroyData.total">
          </el-pagination>
        </div>
      </div>
      <el-form :model="formData" ref="ruleForm" label-width="120px" class="formBill" :inline="true">

        <el-form-item label="驳回意见：" class="f3">
          <el-input v-model="formData.comment" type="textarea"></el-input>
        </el-form-item>

      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  name: "versionQuery",
  props: ['rejectNeedData'],
  data() {
    return {
      // 所有数据（包含列表数据和详情数据）
      allData: {},
      // 列表数据
      tableData: [],
      //查询条件对象
      tableQuery: {
        page: 1,
        pageSize: 20,
      },
      // 表单数据
      formData: {
        comment: ''
      },
      // 单选组件必需，但目前无用处
      tableChecked: '',

      // 列表高度所需数据
      tableShow: false,
      maxHeight: 0,

    };
  },
  mounted() {
    this.init()




    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.common.changeTable(this, ".versionQuery", [
      ".versionQuery .toolbar",
      ".versionQuery .block",
      ".versionQuery #crumbs"
    ]);
  },
  methods: {
    // 列表初始化
    init() {
      let _this = this
      let params = {
        busicode: "/workflowMonitoring/queryHisNodeMsgs.htm?curTaskId=" + this.rejectNeedData.curTaskId + '&processInstanceId=' + this.rejectNeedData.processInstanceId,
      };
      this.$api.fetch({
        params: params,
        method: 'get',
      }).then(res => {
        // 获取所有数据
        _this.allData = res
        // 列表倒序展示
        for (let i = res.hisNodeMsgs.length - 1; i >= 0; i--) {
          _this.tableData.push(res.hisNodeMsgs[i])
        }
      })
    },
    // 表格单选按钮获取单选数据
    getCurrentRow(row) {
      this.formData.rejectNodeCode = row.nowNodeCode
    },
    // 保存方法
    save() {
      let _this = this
      let params = {
        busicode: "/process/submit.htm",
        data: {
          secret: _this.allData.secret,
          setCode: _this.allData.setCode,
          processCode: _this.allData.processCode,
          billId: _this.allData.billId,
          operator: _this.allData.operator,
          taskId: _this.allData.taskId,
          comment: _this.formData.comment,
          operation: '1',// 驳回
          rejectNodeCode: _this.formData.rejectNodeCode,
        },
      };
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.$message({
          type: 'success',
          message: '驳回成功！'
        })
        _this.$parent.rejectShow = false
      })
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
      let _this = this;
    },
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
.versionQuery {
  width: 100%;
  height: calc(100% - 40px);
}
</style>
