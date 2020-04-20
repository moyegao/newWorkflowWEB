<template>
  <div class="ownedUser">

    <div v-if="indexShow">
      <div class="toolbar">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
          <el-form-item class="form-left">

            <el-form-item label="部门名称：">
              <el-input v-model="tableQuery.departmentName" placeholder="请输入部门名称"></el-input>
            </el-form-item>

            <el-form-item label="用户名称：">
              <el-input v-model="tableQuery.staffName" placeholder="请输入用户名称"></el-input>
            </el-form-item>

            <el-form-item>
              <el-button class='searchBtn' @click="search" icon="el-icon-search"></el-button>
            </el-form-item>

          </el-form-item>
        </el-form>
      </div>
      <div class="kl-table">
        <el-table stripe border :data="tableData" class="wuserInfo-table">
          <el-table-column type="index" label="NO." width="50" :index="indexMethod">
          </el-table-column>
          <el-table-column prop="departmentCode" min-width="80" label="组织编号">
          </el-table-column>
          <el-table-column prop="departmentName" min-width="80" label="组织名称">
          </el-table-column>
          <el-table-column prop="staffCode" min-width="80" label="用户编号">
          </el-table-column>
          <el-table-column prop="staffName" min-width="80" label="用户名称">
          </el-table-column>
          <el-table-column label="操作" width="220">
            <template slot-scope="scope">
              <el-button type="text" @click="remove(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-drawer title="添加人员" :visible.sync="drawerShow" direction="rtl">
      <div class="drawer-left">
        <company-tree :treeData="treeDatas" @sendTreeData="backTreeData"></company-tree>
      </div>
      <div class="drawer-right">
          <el-checkbox v-for="item in userData" @change="test(item)"  :label="item.name" :checked="staffId.includes(item.id)" :key="item.id">{{item.name}}</el-checkbox>
      </div>
      <div class="demo-drawer__footer">
        <el-button @click="drawerShow = false">取 消</el-button>
        <el-button type="primary" @click="save" :loading="drawerLoading">{{ drawerLoading ? '提交中 ...' : '确 定' }}</el-button>
      </div>
    </el-drawer>
  </div>

</template>
<script>
export default {
  name: "management-area-index",
  props: ['ownedUserNeedData'],
  data() {
    return {
      // 公司树的声明
      treeDatas: {
        tree: [
          {
            shortName: '根目录',
            id: '2',
            children: [
            ]
          }
        ],
        defaultProps: {
          label: 'name',
          children: 'children'
        },
        inputProp: {
          showSearch: false,
          Inp_placeholder: '请输入节点'
        },
        sendTreeProp: ['id', 'name', 'shortname'],
        rootName: '根目录',
        defaultOpen: {
          nodeKey: 'id',
          // 默认展开的父亲的'nodeKey'的值
          nodeItem: []
        }
      },
      // 添加人员确定按钮loading
      drawerLoading: false,





      // 查询条件对象
      tableQuery: {
        page: 1,
        pageSize: 20,
      },
      // 状态下拉框数据
      processStateData: this.common.processState(),
      // 添加人员数据
      userData: [],
      // 已勾选的用户id
      staffId: [],
      // 显示首页
      indexShow: true,
      // 显示驳回弹出框
      rejectShow: false,
      // 显示添加人员
      drawerShow: false,









      formData: {
        areaName: '',
        sortNo: '',
        status: '',
        areaComments: "",
      },
      crumbsData: {  //面包屑
        titleList: [
          { title: '工作流监控' },
        ],
      },
      tableData: [
        {}
      ],
      parentId: "",
      maxHeight: 0,
      tableShow: false,
      areaNo: "",
      treeParantId: "",
    }
  },
  mounted() {
    this.init()

    this.$nextTick(() => {
      //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
      this.common.changeTable(this, '.business-area1 .business-area1-right-content', []);
    })
  },
  methods: {
    test(item) {
      if(this.staffId.includes(item.id)) {
        this.staffId = this.staffId.filter(id => {
          return id !== item.id
        })
      } else {
        this.staffId.push(item.id)
      }
    },





    // 列表初始化
    init() {
      let _this = this
      let params = {
        busicode: "/post/queryPostStaff.htm",
        postId: _this.ownedUserNeedData.id,
        departmentName: _this.tableQuery.departmentName,
        staffName: _this.tableQuery.staffName,
      };
      this.$api.fetch({
        params: params,//参数
        method: 'get'
      }).then(res => {
        _this.tableData = res
      })
    },
    // 查询按钮
    search() {
      this.init()
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
          busicode: "/post/deletePostStaffRel.htm?id=" + row.id,
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
    // 添加按钮方法(从岗位管理触发该方法)
    ownedUserAdd() {
      // 获取所有已存在用户的id和name
      this.staffId = []
      this.tableData.forEach(item => {
        this.staffId.push(item.staffId)
      })
      // 获取左侧树数据
      this.getTreeData()
    },
    // 查询添加按钮-部门树数据
    getTreeData() {
      let _this = this
      this.userData = []
      let params = {
        busicode: "/department/queryTree.htm",
      };
      this.$api.fetch({
        params: params,//参数
        method: 'get'
      }).then(res => {
        _this.treeDatas.tree = res
        _this.treeDatas.defaultOpen.nodeItem = []
        // 默认展开的数据的id（展开孩子）
        for (let i = 0; i < res.length; i++) {
          _this.treeDatas.defaultOpen.nodeItem.push(res[i].id)
        }
        _this.drawerShow = true
      })
    },



    // 左侧树的点击(根据部门id获取用户数据)
    backTreeData(val) {
      let _this = this
      let params = {
        busicode: "/staff/queryByDepartmentId.htm?departmentId=" + val.id,
      };
      this.$api.fetch({
        params: params,//参数
        method: 'get'
      }).then(res => {
        _this.userData = res
      })
    },

    // 添加页面-确定按钮
    save() {
      let _this = this
      this.drawerLoading = true
      let params = {
        busicode: "post/updatePostStaffRel.htm?postId=" + this.ownedUserNeedData.id + '&staffId=' + this.staffId.join(','),
      };
      this.$api.fetch({
        params: params,//参数
        method: 'get'
      }).then(res => {
        _this.$message({
          type: 'success',
          message: '人员添加成功！'
        })
        _this.drawerLoading = false
        _this.drawerShow = false
        _this.init()
      }).catch(err => {
        _this.drawerLoading = false
      })
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
      this.tableShow = false
      this.$nextTick(() => {
        this.tableShow = true
      })
    },
  }
}
</script>
<style lang="scss">
.ownedUser {
  .template_btn {
    width: 100%;
    height: 40px;
    text-align: center;
  }
  .el-drawer {
    width: 50% !important;
  }
  .el-drawer__wrapper #el-drawer__title {
    font-size: 16px !important;
  }
  .el-drawer__body {
    padding: 0 20px;
    font-size: 15px;
  }
  .drawer-left {
    float: left;
    width: 38%;
    display: inline-block;
    height: 90%;
  }
  .drawer-right {
    margin-left: 20px;
    float: left;
    width: 58%;
    display: inline-block;
    height: 90%;
  }
}
</style>

