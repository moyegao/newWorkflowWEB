<template>
  <div class="User">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <!-- 首页 -->
      <div class="bread-contain-right" v-if="indexShow">
        <el-button size="mini" icon="el-icon-plus" @click="add" type="primary">添加</el-button>
      </div>
      <!-- 首页添加/修改 -->
      <div class="bread-contain-right" v-if="userEditShow">
        <el-button size="mini" type="primary" @click="save">保存</el-button>
        <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog">返回</el-button>
      </div>
    </div>

    <div v-if="indexShow" class="company-content">
      <div class="company-left">
        <company-tree :treeData="treeDatas" @sendTreeData="backTreeData"></company-tree>
      </div>
      <div class="company-right">
        <div class="toolbar">
          <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
            <el-form-item class="form-left">

              <el-form-item label="姓名：">
                <el-input v-model="tableQuery.name" placeholder="请输入姓名"></el-input>
              </el-form-item>

              <el-form-item>
                <el-button class='searchBtn' @click="init" icon="el-icon-search"></el-button>
              </el-form-item>

            </el-form-item>
          </el-form>
        </div>
        <div class="kl-table">
          <el-table stripe border :max-height="maxHeight" :data="tableData.list" class="wuserInfo-table">
            <el-table-column type="index" label="NO." width="50" :index="indexMethod">
            </el-table-column>
            <el-table-column prop="code" min-width="80" label="工号">
            </el-table-column>
            <el-table-column prop="name" min-width="80" label="姓名">
            </el-table-column>
            <el-table-column prop="account" min-width="130" label="账号">
            </el-table-column>
            <el-table-column prop="sex" min-width="120" label="性别">
            </el-table-column>
            <el-table-column prop="departmentname" min-width="80" label="所属组织">
            </el-table-column>
            <el-table-column prop="position" min-width="80" label="岗位">
            </el-table-column>
            <el-table-column prop="email" min-width="80" label="邮箱">
            </el-table-column>
            <el-table-column prop="mobile" min-width="80" label="手机">
            </el-table-column>
            <el-table-column prop="phone" min-width="80" label="办公电话">
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="180">
              <template slot-scope="scope">
                <el-button type="text" @click="edit(scope.row)">修改</el-button>
                <span>|</span>
                <el-button type="text" @click="remove(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>

          <div class="block">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1" :page-sizes="[50, 100, 500, 1000]" :page-size="20" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
    <UserEdit ref="UserManagementEdit" :userManagementEditNeedData='userManagementEditNeedData' v-else-if="userEditShow"></UserEdit>
  </div>

</template>
<script>
import UserEdit from './UsersManagementEdit'
export default {
  name: "management-area-index",
  components: {
    UserEdit,
  },
  data() {
    return {
      // 查询条件对象
      tableQuery: {
        page: 1,
        pageSize: 20,
        name: ''
      },
      userManagementEditNeedData: {},
      // 显示首页
      indexShow: true,
      // 显示首页添加/修改
      userEditShow: false,
      crumbsData: {  //面包屑
        titleList: [
          { title: '组织架构' },
        ],
      },
      treeDatas: {
        tree: [
        ],
        defaultProps: {
          label: 'name',
          children: 'children'
        },
        inputProp: {
          showSearch: false,
          Inp_placeholder: '请输入节点'
        },
        sendTreeProp: ['code', 'name', 'districtArr', 'children', 'id', 'group', 'isLeaf', 'isParent', 'parent', 'sonData'],
        rootName: '根目录',
        defaultOpen: {
          nodeKey: 'id',
          // nodeItem:164
        }
      },
      tableData: [
        
      ],
      departmentid: "",
      maxHeight: 0,
      tableShow: false,
      areaNo: "",
    }
  },
  mounted() {
    this.getTreeDatas();
    this.init()
    this.$nextTick(() => {
      //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
      this.common.changeTable(this, ".User", [
        ".User .toolbar",
        ".User .block",
        ".User #crumbs"
      ]);
    });
  },
  methods: {
    // 首页添加按钮
    add() {
      this.userEditShow = true
      this.indexShow = false
      this.userManagementEditNeedData.saveType = 'add'
      this.userManagementEditNeedData.departmentId = this.departmentId
    },
    // 首页修改按钮
    edit(row) {
      this.userEditShow = true
      this.indexShow = false
      this.userManagementEditNeedData = row
      this.userManagementEditNeedData.saveType = 'edit'
    },
    save(){
      this.$refs.UserManagementEdit.save()
    },
    // 首页返回按钮
    closeDialog() {
      this.indexShow = true
      this.userEditShow = false
      this.templateManagerShow = false
      this.templateManagerEditShow = false
      if (this.crumbsData.titleList.length > 1) {
        this.crumbsData.titleList.pop()
      }
    },
    // 查询按钮
    search() { },
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
          busicode: "/staff/delete.htm?id=" + row.id,
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
      return index + 1;
    },
    init() {
      let _this = this;
      let params = {
        busicode: "/staff/queryForList.htm",
        page: _this.tableQuery.page,
        pageSize: _this.tableQuery.pageSize,
        departmentId: this.departmentid,
        name: this.tableQuery.name
      }
      this.$api.fetch({
        params: params,//参数
        method: 'get'
      }).then(res => {
        _this.tableData = res;
      })

    },
    // 获取树的数据
    getTreeDatas() {
      let _this = this
      let params = {
        busicode: "/department/queryTree.htm",
      };
      this.$api.fetch({
        params: params,//参数
        method: 'get'
      }).then(res => {
        res = [{
          id: '',
          name: '全部',
          shortname: '全部',
          children: res
        }]
        _this.treeDatas.tree = res
        _this.treeDatas.defaultOpen.nodeItem = this.getTreeIds(res,[])
        _this.drawerShow = true
      })
    },
    getTreeIds(data,arr) {
      data.forEach(item => {
        arr.push(item.id)
        if(item.children) {
          return this.getTreeIds(item.children,arr)
        }
      })
      return arr
    },
    // 树的点击
    backTreeData(val) {
      let _this = this;
      this.departmentid = val.id;
      this.init()
    },
  },
  watch: {
    maxHeight() {
      this.tableShow = false
      this.$nextTick(() => {
        this.tableShow = true
      })
    },
  }
}
</script>
<style lang="scss">
.User{

  width: 100%;
  height: 100%;

  .company-content .company-left {
    height: calc(100% - 10px);
  }

}

</style>

