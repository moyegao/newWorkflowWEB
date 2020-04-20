<template>
  <!-- SystemUserManagement -->
  <div class="SystemUserManagement">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <!-- 首页 -->
      <div class="bread-contain-right" v-if="indexShow">
        <el-button size="mini" icon="el-icon-plus" @click="add" type="primary">添加</el-button>
      </div>
      <div class="bread-contain-right" v-if="systemUserManagementEditShow">
        <el-button size="mini" @click="save" type="primary">保存</el-button>
        <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog">返回</el-button>
      </div>
    </div>

    <div v-if="indexShow">

      <div class="toolbar">
      </div>
      <div class="kl-table">
        <el-table v-if="tableShow" :max-height="maxHeight" stripe border :data="tableData.list" @cell-click="cellClick" class="SystemUserManagement-table">

          <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
          </el-table-column>

          <el-table-column prop="account" min-width="60" label="账号名称">
          </el-table-column>

          <el-table-column prop="supperManagerName" min-width="100" label="超级管理员">
          </el-table-column>

          <el-table-column prop="createUserName" min-width="100" label="创建人">
          </el-table-column>

          <el-table-column prop="createTime" min-width="80" label="创建时间">
          </el-table-column>

          <el-table-column prop="lastUpdateUserName" min-width="100" label="修改人">
          </el-table-column>

          <el-table-column prop="lastUpdateTime" min-width="80" label="修改时间">
          </el-table-column>

          <el-table-column class="cell" label="操作" fixed="right" width="150">
            <template slot-scope="scope">
              <el-button type="text" @click="edit(scope.row)">修改</el-button>
              <span>|</span>
              <el-button type="text" @click="remove(scope.row)">删除</el-button>
              <span>|</span>
              <el-button type="text" @click="application(scope.row)">所属应用</el-button>
            </template>
          </el-table-column>

        </el-table>
        <!-- 分页 -->
        <div class="block">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1" :page-sizes="[20, 100, 500, 1000]" :page-size="20" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
          </el-pagination>
        </div>
      </div>
      <el-dialog class="common-dialog" title="所属应用" :close-on-click-modal="false" :visible.sync="applicationShow">
        <div class="kl-table">
          <el-table v-if="tableShow" :max-height="maxHeight" stripe border :data="appsData" class="SystemUserManagement-table">

            <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
            </el-table-column>

            <el-table-column prop="appCode" min-width="60" label="应用编号">
            </el-table-column>

            <el-table-column prop="appName" min-width="100" label="应用名称">
            </el-table-column>

            <el-table-column prop="designRightName" min-width="100" label="设计权限">
            </el-table-column>

            <el-table-column prop="watchRightName" min-width="80" label="监控权限">
            </el-table-column>

          </el-table>
          <!-- 分页 -->
          <!-- <div class="block">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1" :page-sizes="[20, 100, 500, 1000]" :page-size="20" layout="total, sizes, prev, pager, next, jumper" :total="histroyData.total">
            </el-pagination>
          </div> -->
        </div>
      </el-dialog>

    </div>
    <SystemUserManagementEdit ref="SystemUserManagementEdit" :systemUserManagementEditNeedData='systemUserManagementEditNeedData' v-else-if="systemUserManagementEditShow"></SystemUserManagementEdit>
  </div>
</template>
<script>
import SystemUserManagementEdit from './SystemUserManagementEdit'
export default {
  name: "SystemUserManagement",
  components: {
    SystemUserManagementEdit
  },
  data() {
    return {
      // 面包屑
      crumbsData: {
        titleList: [
          { title: '系统用户管理' },
        ],
      },
      // 显示首页
      indexShow: true,
      // 显示添加/修改页面
      systemUserManagementEditShow: false,
      // 显示所属应用弹出框
      applicationShow: false,

      // 添加/修改页面所需数据
      systemUserManagementEditNeedData: {},
      // 所属应用弹出框所需数据
      appsData: [],

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
      // 列表高度所需字段
      tableShow: false,
      maxHeight: 0,
    };
  },
  mounted() {
    // 展示侧边栏
    eventBus.$emit('asideMenuShow', 'systemMenuShow')
    this.init()
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
    this.common.changeTable(this, ".SystemUserManagement", [
      ".SystemUserManagement .toolbar",
      ".SystemUserManagement .block",
      ".SystemUserManagement #crumbs"
    ]);
  },
  methods: {
    // 列表初始化
    init() {
      let _this = this
      let params = {
        busicode: "/administrator/queryForList.htm",
        page: _this.tableQuery.page,
        pageSize: _this.tableQuery.pageSize,
      };
      this.$api.fetch({
        params: params,//参数
        method: 'get'
      }).then(res => {
        _this.tableData = res
        // 超级管理员状态转换
        for (let i = 0; i < _this.tableData.list.length; i++) {
          if (_this.tableData.list[i].supperManager == 1) {
            _this.tableData.list[i].supperManagerName = '是'
          } else if (_this.tableData.list[i].supperManager == 0) {
            _this.tableData.list[i].supperManagerName = '否'
          }
        }
      })
    },
    // 添加按钮
    add() {
      this.systemUserManagementEditShow = true
      this.indexShow = false
      this.systemUserManagementEditNeedData.saveType = 'add'
    },
    // 保存按钮（调用子页面保存方法）
    save() {
      this.$refs.SystemUserManagementEdit.save()
    },
    // 修改按钮
    edit(row) {
      this.systemUserManagementEditShow = true
      this.indexShow = false
      this.systemUserManagementEditNeedData = row
      this.systemUserManagementEditNeedData.saveType = 'edit'
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
          busicode: "/administrator/delete.htm?id=" + row.id,
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
    // 所属应用按钮
    application(row) {
      let _this = this
      let params = {
        busicode: "/administrator/queryAppsById.htm?id=" + row.id,
      };
      this.$api.fetch({
        params: params,
        method: 'get',
      }).then(res => {
        _this.appsData = res
        _this.applicationShow = true

        for (let i = 0; i < _this.appsData.length; i++) {
          if (_this.appsData[i].designRight == 1) {
            _this.appsData[i].designRightName = '是'
          } else if (_this.appsData[i].designRight == 0) {
            _this.appsData[i].designRightName = '否'
          }
          if (_this.appsData[i].watchRight == 1) {
            _this.appsData[i].watchRightName = '是'
          } else if (_this.appsData[i].watchRight == 0) {
            _this.appsData[i].watchRightName = '否'
          }
        }
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
      let that = this;
    },
    // NO.
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
.SystemUserManagement {
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
