<template>
  <!-- whiteList -->
  <div class="whiteList">
    <div class="toolbar">
    </div>
    <div class="kl-table">
      <el-table v-if="tableShow" :max-height="maxHeight" stripe border :data="tableData.list" @cell-click="cellClick" class="whiteList-table">

        <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
        </el-table-column>

        <el-table-column prop="servername" min-width="60" label="服务器名称">
        </el-table-column>

        <el-table-column prop="serverMAC" min-width="150" label="MAC地址">
        </el-table-column>

        <el-table-column prop="serverIP" min-width="100" label="IP地址">
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
</template>
<script>
export default {
  name: "whiteList",
  props: ['whiteListNeedData'],
  data() {
    return {
      // 列表数据
      tableData: {
        list: [],
      },
      // 查询条件数据
      tableQuery: {
        page: 1,
        pageSize: 20,
      },
      // 列表高度所需数据
      tableShow: false,
      maxHeight: 0,
    };
  },
  mounted() {
    this.init()
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
    this.common.changeTable(this, ".whiteList", [
      ".whiteList .toolbar",
      ".whiteList .block",
      ".whiteList #crumbs"
    ]);
  },
  methods: {
    // 列表初始化
    init() {
      let _this = this
      let params = {
        busicode: "/whiteList/queryForList.htm",
        page: this.tableQuery.page,
        pageSize: this.tableQuery.pageSize,
        appId: this.whiteListNeedData.id
      };
      this.$api.fetch({
        params: params,//参数
        method: 'get'
      }).then(res => {
        _this.tableData = res
      })
    },
    // 修改按钮
    edit(row) {
      this.$parent.whiteListEditShow = true
      this.$parent.whiteListShow = false
      this.$parent.whiteListEditNeedData = row
      this.$parent.whiteListEditNeedData.saveType = 'edit'
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
          busicode: "/whiteList/delete.htm?id=" + row.id,
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
    // NO.
    indexMethod(index) {
      //获取表格序号
      return (
        this.tableQuery.pageSize * (this.tableQuery.page - 1) + (index + 1)
      );
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
.whiteList {
  width: 100%;
  height: calc(100% - 40px);
}
</style>
