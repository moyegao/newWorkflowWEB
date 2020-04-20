<template>
  <!-- LnterfaceCallLog -->
  <div class="LnterfaceCallLog">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <!-- 首页 -->
      <div class="bread-contain-right" v-if="indexShow">
        <el-button size="mini" icon="el-icon-delete" @click="removeLog" type="primary">删除2月前日志</el-button>
      </div>
      <div class="bread-contain-right" v-if="interfaceCallLogEditShow">
        <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog">返回</el-button>
      </div>
    </div>

    <div v-if="indexShow">

      <div class="toolbar">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
          <el-form-item class="form-left">

            <el-form-item label="应用编号：">
              <el-input v-model="tableQuery.appCode" placeholder="请输入应用编号"></el-input>
            </el-form-item>

            <el-form-item label="应用名称：">
              <el-input v-model="tableQuery.appName" placeholder="请输入应用名称"></el-input>
            </el-form-item>

            <el-form-item label="入参内容：">
              <el-input v-model="tableQuery.inParam" placeholder="请输入入参内容"></el-input>
            </el-form-item>

            <el-form-item>
              <el-button class='searchBtn' @click="search" icon="el-icon-search"></el-button>
            </el-form-item>

          </el-form-item>
        </el-form>
      </div>
      <div class="kl-table">
        <el-table v-if="tableShow" :max-height="maxHeight" stripe border :data="tableData.list" @cell-click="cellClick" class="LnterfaceCallLog-table">

          <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
          </el-table-column>

          <el-table-column prop="interfaceTypeName" min-width="100" label="接口类型">
          </el-table-column>

          <el-table-column prop="appName" min-width="100" label="应用名称">
          </el-table-column>

          <el-table-column prop="ip" min-width="100" label="IP">
          </el-table-column>

          <el-table-column prop="operateTime" min-width="100" label="执行时间">
          </el-table-column>

          <el-table-column prop="doTime" min-width="100" label="执行时长">
          </el-table-column>

          <el-table-column class="cell" label="操作" fixed="right" width="150">
            <template slot-scope="scope">
              <el-button type="text" @click="details(scope.row)">详情</el-button>
            </template>
          </el-table-column>

        </el-table>
        <!-- 分页 -->
        <div class="block">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1" :page-sizes="[20, 100, 500, 1000]" :page-size="20" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
          </el-pagination>
        </div>
      </div>

    </div>
    <InterfaceCallLogEdit :interfaceCallLogEditNeedData='interfaceCallLogEditNeedData' v-else-if="interfaceCallLogEditShow"></InterfaceCallLogEdit>
  </div>
</template>
<script>
import InterfaceCallLogEdit from './InterfaceCallLogEdit'
export default {
  name: "LnterfaceCallLog",
  components: {
    InterfaceCallLogEdit
  },
  data() {
    return {
      // 面包屑
      crumbsData: {
        titleList: [
          { title: '接口调用日志' },
        ],
      },
      // 显示首页
      indexShow: true,
      // 显示详情页面
      interfaceCallLogEditShow: false,
      // 详情页面所需数据
      interfaceCallLogEditNeedData: {},
      // 列表数据
      tableData: {
        list: []
      },
      //查询条件对象
      tableQuery: {
        page: 1,
        pageSize: 20,
      },
      // 列表高度所需字段
      tableShow: false,
      maxHeight: 0,
    };
  },
  mounted() {
    this.init()
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
    this.common.changeTable(this, ".LnterfaceCallLog", [
      ".LnterfaceCallLog .toolbar",
      ".LnterfaceCallLog .block",
      ".LnterfaceCallLog #crumbs"
    ]);
  },
  methods: {
    // 列表初始化
    init() {
      let _this = this
      let params = {
        busicode: "/interfacelog/queryForList.htm",
        page: _this.tableQuery.page,
        pageSize: _this.tableQuery.pageSize,
        appCode: _this.tableQuery.appCode,
        appName: _this.tableQuery.appName,
        inParam: _this.tableQuery.inParam,
      };
      this.$api.fetch({
        params: params,//参数
        method: 'get'
      }).then(res => {
        _this.tableData = res
      })
    },
    // 删除2月前日志按钮
    removeLog() {
      let _this = this
      this.$confirm('是否确定删除两月前所有接口日志?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        let params = {
          busicode: "/interfacelog/deleteTwoMonthData.htm?",
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
    // 详情按钮
    details(row) {
      this.interfaceCallLogEditShow = true
      this.indexShow = false
      this.interfaceCallLogEditNeedData = row
    },
    // 查询按钮
    search() {
      this.tableQuery.page = 1;
      this.init();
    },
    // 返回按钮
    closeDialog() {
      this.indexShow = true
      this.interfaceCallLogEditShow = false
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
.LnterfaceCallLog {
  width: 100%;
  height: 100%;
  .backfillCon,
  .DetailedEnquiriesCon,
  .waterAddCon {
    width: 100%;
    height: 100%;
  }
  .el-dialog__body {
    padding: 20px;
    height: calc(100% - 196px);
  }
  .backfill .el-dialog__body,
  .DetailedEnquiries1 .el-dialog__body {
    height: calc(100% - 136px);
    padding: 0px;
  }
  .DetailsOfTableChange .el-dialog__body {
    height: calc(100% - 136px);
    padding: 0px 20px;
  }
}
</style>
