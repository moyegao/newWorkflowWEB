<template>
  <!-- applicationManagement -->
  <div class="applicationManagement">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <!-- 首页 -->
      <div class="bread-contain-right" v-if="indexShow">
        <el-button size="mini" icon="el-icon-plus" type="primary" @click="add">添加</el-button>
      </div>
      <!-- 首页添加/修改 -->
      <div class="bread-contain-right" v-if="applicationManagementEditShow">
        <el-button size="mini" type="primary" @click="save">保存</el-button>
        <el-button size="mini" @click="closeDialog">返回</el-button>
      </div>
      <!-- 白名单 -->
      <div class="bread-contain-right" v-if="whiteListShow">
        <el-button size="mini" icon="el-icon-plus" type="primary" @click="whiteListAdd">添加</el-button>
        <el-button size="mini" @click="closeDialog">返回</el-button>
      </div>
      <!-- 白名单添加/修改 -->
      <div class="bread-contain-right" v-if="whiteListEditShow">
        <el-button size="mini" type="primary" @click="whiteListSave">保存</el-button>
        <el-button size="mini" @click="whiteListEditCloseDialog">返回</el-button>
      </div>
      <!-- 管理员 -->
      <div class="bread-contain-right" v-if="adminShow">
        <el-button size="mini" icon="el-icon-plus" type="primary" @click="adminAdd">添加</el-button>
        <el-button size="mini" @click="closeDialog">返回</el-button>
      </div>
      <!-- 管理员添加/修改 -->
      <div class="bread-contain-right" v-if="adminEditShow">
        <el-button size="mini" type="primary" @click="adminSave">保存</el-button>
        <el-button size="mini" @click="adminEditCloseDialog">返回</el-button>
      </div>
    </div>
    <div v-if="indexShow">

      <div class="toolbar">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
          <el-form-item class="form-left">

            <el-form-item label="应用编号：">
              <el-input v-model="tableQuery.code" placeholder="请输入应用编号"></el-input>
            </el-form-item>

            <el-form-item label="应用名称：">
              <el-input v-model="tableQuery.name" placeholder="请输入应用名称"></el-input>
            </el-form-item>

            <el-form-item label="应用状态：">
              <el-select clearable v-model="tableQuery.status" placeholder="全部">
                <el-option v-for="item in processStateData" :key="item.value" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-button class='searchBtn' @click="search" icon="el-icon-search"></el-button>
            </el-form-item>

          </el-form-item>
        </el-form>
      </div>
      <div class="kl-table">
        <el-table v-if="tableShow" :max-height="maxHeight" stripe border :data="tableData.list" @cell-click="cellClick">

          <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
          </el-table-column>

          <el-table-column prop="code" min-width="60" label="应用编号">
          </el-table-column>

          <el-table-column prop="name" min-width="100" label="应用名称">
          </el-table-column>

          <el-table-column prop="statusName" min-width="100" label="状态">
          </el-table-column>

          <el-table-column prop="createUserName" min-width="100" label="创建人">
          </el-table-column>

          <el-table-column prop="createTime" min-width="80" label="创建时间">
          </el-table-column>

          <el-table-column class="cell" label="操作" fixed="right" width="150">
            <template slot-scope="scope">
              <el-button type="text" @click="edit(scope.row)">修改</el-button>
              <span>|</span>
              <el-button type="text" @click="whiteList(scope.row)">白名单</el-button>
              <span>|</span>
              <el-button type="text" class="noclick" @click="admin(scope.row)">管理员</el-button>
            </template>
          </el-table-column>

        </el-table>
        <!-- 分页 -->
        <div class="block">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1" :page-sizes="[20, 50, 100]" :page-size="20" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
          </el-pagination>
        </div>
      </div>
    </div>
    <!-- 首页添加/修改 -->
    <ApplicationManagementEdit ref="ApplicationManagementEdit" :applicationManagementEditNeedData='applicationManagementEditNeedData' v-else-if="applicationManagementEditShow"></ApplicationManagementEdit>
    <!-- 白名单页面 -->
    <whiteList :whiteListNeedData='whiteListNeedData' v-else-if="whiteListShow"></whiteList>
    <!-- 白名单添加/修改 -->
    <whiteListEdit ref="whiteListEdit" :whiteListEditNeedData='whiteListEditNeedData' v-else-if="whiteListEditShow"></whiteListEdit>
    <!-- 管理员页面 -->
    <admin :adminNeedData='adminNeedData' v-else-if="adminShow"></admin>
    <!-- 管理员添加/修改 -->
    <adminEdit ref="adminEdit" :adminEditNeedData='adminEditNeedData' v-else-if="adminEditShow"></adminEdit>
  </div>
</template>
<script>
// 首页修改页面
import ApplicationManagementEdit from './ApplicationManagementEdit'
// 白名单页面
import whiteList from './whiteList'
// 白名单修改页面
import whiteListEdit from './whiteListEdit'
// 管理员页面
import admin from './admin'
// 管理员修改页面
import adminEdit from './adminEdit'
export default {
  name: "applicationManagement",
  components: {
    ApplicationManagementEdit,
    whiteList,
    whiteListEdit,
    admin,
    adminEdit,
  },
  data() {
    return {
      // 面包屑
      crumbsData: {
        titleList: [{ title: "应用管理" }]
      },
      // 列表数据
      tableData: {
        list: [],
      },
      //查询条件对象
      tableQuery: {
        page: 1,
        pageSize: 20,
      },
      // 列表高度所需变量
      tableShow: false,
      maxHeight: 0,

      // 应用管理首页
      indexShow: true,
      // 修改页面
      applicationManagementEditShow: false,
      // 白名单页面
      whiteListShow: false,
      // 白名单添加/修改页面
      whiteListEditShow: false,
      // 管理员页面
      adminShow: false,
      // 管理员添加/修改页面
      adminEditShow: false,

      // 添加/修改页面所需数据
      applicationManagementEditNeedData: {},
      // 白名单页面所需数据
      whiteListNeedData: {},
      // 白名单添加/修改页面所需数据
      whiteListEditNeedData: {},
      // 管理员页面所需数据
      adminNeedData: {},
      // 管理员添加/修改页面所需数据
      adminEditNeedData: {},
      // 状态下拉框数据
      processStateData: this.common.processState(),


    };
  },
  mounted() {
    this.init()
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
    this.common.changeTable(this, ".applicationManagement", [
      ".applicationManagement .toolbar",
      ".applicationManagement .block",
      ".applicationManagement #crumbs"
    ]);
    console.log(
      $('.applicationManagement .toolbar').height()
    );
  },
  methods: {
    // 列表初始化
    init() {
      let _this = this
      let params = {
        busicode: "/appManag/queryForList.htm",
        page: _this.tableQuery.page,
        pageSize: _this.tableQuery.pageSize,
        code: _this.tableQuery.code,
        name: _this.tableQuery.name,
        status: _this.tableQuery.status,
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
    // 查询
    search() {
      this.tableQuery.page = 1;
      this.init();
    },
    // 首页添加按钮
    add() {
      this.applicationManagementEditShow = true
      this.indexShow = false
      this.whiteListShow = false
      this.applicationManagementEditNeedData.saveType = 'add'
    },
    // 修改按钮
    edit(row) {
      this.applicationManagementEditShow = true
      this.indexShow = false
      this.whiteListShow = false
      this.applicationManagementEditNeedData = row
      this.applicationManagementEditNeedData.saveType = 'edit'
    },
    // 首页保存按钮（调添加/修改页面保存方法）
    save() {
      var _this = this
      this.$refs.ApplicationManagementEdit.save()
    },
    // 白名单按钮
    whiteList(row) {
      this.whiteListShow = true
      this.indexShow = false
      this.whiteListNeedData = row
      this.crumbsData.titleList.push({ title: "白名单" })
    },
    // 白名单添加按钮
    whiteListAdd() {
      this.whiteListEditShow = true
      this.whiteListShow = false
      this.whiteListEditNeedData.saveType = 'add'
      // 白名单添加页面拿到首页数据id
      this.whiteListEditNeedData.appId = this.whiteListNeedData.id
    },
    // 白名单保存按钮(调用白名单添加/修改页面保存方法)
    whiteListSave() {
      this.$refs.whiteListEdit.save()
    },
    // 白名单添加/修改页面的返回按钮
    whiteListEditCloseDialog() {
      this.whiteListShow = true
      this.whiteListEditShow = false
    },

    // 管理员按钮
    admin(row) {
      this.adminShow = true
      this.indexShow = false
      this.adminNeedData = row
      this.crumbsData.titleList.push({ title: "管理员" })
    },
    // 管理员添加按钮
    adminAdd() {
      this.adminEditShow = true
      this.adminShow = false
      this.adminEditNeedData.saveType = 'add'
      // 管理员添加页面拿到首页数据id
      this.adminEditNeedData.appId = this.adminNeedData.id
    },
    // 管理员保存按钮(调用管理员添加/修改页面保存方法)
    adminSave() {
      this.$refs.adminEdit.save()
    },
    // 管理员添加/修改页面的返回按钮
    adminEditCloseDialog() {
      this.adminShow = true
      this.adminEditShow = false
    },
    // 返回按钮
    closeDialog() {
      this.indexShow = true
      this.applicationManagementEditShow = false
      this.whiteListShow = false
      this.whiteListEditShow = false
      this.adminShow = false
      this.adminEditShow = false
      if (this.crumbsData.titleList.length > 1) {
        this.crumbsData.titleList.pop()
      }
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
.applicationManagement {
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
