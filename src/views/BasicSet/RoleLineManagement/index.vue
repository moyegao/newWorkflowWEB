<template>
  <div class="PositionManagement">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right" v-if="indexShow">
        <el-button size="mini" icon="el-icon-plus" @click="add" type="primary">添加</el-button>
      </div>
      <div class="bread-contain-right" v-if="roleLineManagementEditShow">
        <el-button size="mini" @click="save" type="primary">保存</el-button>
        <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog">返回</el-button>
      </div>
      <div class="bread-contain-right" v-if="ownedUserShow">
        <el-button size="mini" icon="el-icon-plus" @click="ownedUserAdd" type="primary">添加</el-button>
        <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog">返回</el-button>
      </div>
    </div>

    <div v-if="indexShow">
      <div class="toolbar">
      </div>
      <div class="kl-table">
        <el-table v-if="tableShow" :max-height="maxHeight" stripe border :data="tableData.list" class="PositionManagement-table">

          <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
          </el-table-column>

          <el-table-column prop="code" min-width="100" label="角色编号">
          </el-table-column>

          <el-table-column prop="name" min-width="100" label="角色名称">
          </el-table-column>

          <el-table-column prop="createUserName" min-width="100" label="创建人">
          </el-table-column>

          <el-table-column prop="createTime" min-width="100" label="创建时间">
          </el-table-column>

          <el-table-column prop="lastUpdateUserName" min-width="120" label="修改人">
          </el-table-column>

          <el-table-column prop="lastUpdateTime" min-width="120" label="修改时间" show-overflow-tooltip>
          </el-table-column>

          <el-table-column class="cell" label="操作" fixed="right" width="200">
            <template slot-scope="scope">
              <el-button type="text" @click="edit(scope.row)">修改</el-button>
              <span>|</span>
              <el-button type="text" @click="remove(scope.row)">删除</el-button>
              <span>|</span>
              <el-button type="text">团队管理</el-button>
              <span>|</span>
              <el-button type="text">预览</el-button>
            </template>
          </el-table-column>

        </el-table>
        <!-- 分页 -->
        <div class="block">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1" :page-sizes="[50, 100, 500, 1000]" :page-size="20" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
          </el-pagination>
        </div>
      </div>
    </div>
    <!-- 首页添加/修改 -->
    <RoleLineManagementEdit ref="PositionManagementEdit" :roleLineManagementEditNeedData='roleLineManagementEditNeedData' v-else-if="roleLineManagementEditShow"></RoleLineManagementEdit>
    <!-- 所属用户页面 -->
  </div>
</template>
<script>
import RoleLineManagementEdit from './RoleLineManagementEdit'
export default {
  name: "RoleLineManagement",
  components: {
    RoleLineManagementEdit,
  },
  data() {
    return {
      // 列表数据
      tableData: {
        list: [
          {}
        ],
      },
      // 查询条件对象
      tableQuery: {
        page: 1,
        pageSize: 20,
      },
      crumbsData: {
        //面包屑
        titleList: [{ title: "岗位管理" }]
      },
      // 显示首页
      indexShow: true,
      // 显示首页添加/修改
      roleLineManagementEditShow: false,
      // 显示所属用户页面
      ownedUserShow: false,
      // 显示所属用户添加/修改页面
      ownedUserEditShow: false,

      // 添加/修改页面所需数据
      roleLineManagementEditNeedData: {},
      // 所属用户页面所需数据
      ownedUserNeedData: {},


      // 列表高度所需数据
      tableShow: false,
      maxHeight: 0,

    };
  },
  mounted() {
    // 侧边栏
    eventBus.$emit('asideMenuShow', 'basicsMenuShow')

    this.init()
    this.$nextTick(() => {
      //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
      this.common.changeTable(this, ".PositionManagement", [
        ".PositionManagement .toolbar",
        ".PositionManagement .block",
        ".PositionManagement #crumbs"
      ]);
    });
  },
  methods: {
    // 列表初始化
    init() {
      let _this = this
      let params = {
        busicode: "/roleLine/queryForList.htm",
        page: _this.tableQuery.page,
        pageSize: _this.tableQuery.pageSize,
      };
      this.$api.fetch({
        params: params,//参数
        method: 'get'
      }).then(res => {
        _this.tableData = res
      })
    },
    // 首页添加按钮
    add(){
      this.roleLineManagementEditShow = true
      this.indexShow = false
      this.roleLineManagementEditNeedData.saveType = 'add'
    },
    // 添加/修改保存按钮（调用子页面保存方法）
    save(){
      this.$refs.PositionManagementEdit.save()
    },
    // 首页修改按钮
    edit(row){
      this.roleLineManagementEditShow = true
      this.indexShow = false
      this.roleLineManagementEditNeedData = row
      this.roleLineManagementEditNeedData.saveType = 'edit'
    },
    // 首页删除按钮
    remove(row) {
      let _this = this
      this.$confirm('是否确定删除该条数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        let params = {
          busicode: "/roleLine/delete.htm?id=" + row.id,
        };
        this.$api.fetch({
          params: params,
          method: 'get'
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
    // 返回首页按钮
    closeDialog() {
      this.indexShow = true
      this.roleLineManagementEditShow = false
      this.ownedUserShow = false
      this.ownedUserEditShow = false
      if (this.crumbsData.titleList.length > 1) {
        this.crumbsData.titleList.pop()
      }
    },
    // 所属用户页面添加按钮(调用子页面方法)
    ownedUserAdd(){
      this.$refs.ownedUser.ownedUserAdd()
    },







    //分页
    handleSizeChange(val) {
      //显示多少数据一页
      this.tableQuery.pageSize = val;
      this.tableQuery.page = 1;
      this.init();
    },
    handleCurrentChange(val) {
      //页码点击
      this.tableQuery.page = val;
      this.init();
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
@import "../../../assets/styles/scss/base/fn";
$imgWidth: 200px;
$theme-color: #297acc;
.PositionManagement {
  width: 100%;
  height: 100%;
}
</style>
