<template>
  <!-- DataDctionary -->
  <div class="DataDctionary">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <!-- 首页 -->
      <div class="bread-contain-right" v-if="indexShow">
        <el-button size="mini" icon="el-icon-plus" @click="add" type="primary">添加</el-button>
      </div>
      <div class="bread-contain-right" v-if="dataDctionaryEditShow">
        <el-button size="mini" @click="save" type="primary">保存</el-button>
        <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog">返回</el-button>
      </div>
    </div>

    <div v-if="indexShow">
      <div class="toolbar">
      </div>
      <div class="kl-table">
        <el-table v-if="tableShow" :max-height="maxHeight" stripe border :data="tableData.list" @cell-click="cellClick" class="DataDctionary-table">

          <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
          </el-table-column>

          <el-table-column prop="code" min-width="60" label="组编号">
          </el-table-column>

          <el-table-column prop="name" min-width="100" label="组名称">
          </el-table-column>

          <el-table-column prop="createUserName" min-width="100" label="创建人">
          </el-table-column>

          <el-table-column prop="createTime" min-width="80" label="创建时间">
          </el-table-column>

          <el-table-column prop="lastUpdateUserName" min-width="100" label="修改人">
          </el-table-column>

          <el-table-column prop="lastUpdateTime" min-width="100" label="修改时间">
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
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1" :page-sizes="[20, 100, 500, 1000]" :page-size="20" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
          </el-pagination>
        </div>
      </div>

    </div>
    <DataDctionaryEdit ref="DataDctionaryEdit" :dataDctionaryEditNeedData='dataDctionaryEditNeedData' v-else-if="dataDctionaryEditShow"></DataDctionaryEdit>
  </div>
</template>
<script>
import DataDctionaryEdit from './DataDctionaryEdit'
export default {
  name: "DataDctionary",
  components: {
    DataDctionaryEdit
  },
  data() {
    return {
      //面包屑
      crumbsData: {
        titleList: [
          { title: '数据字典' },
        ],
      },
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
      // 显示首页
      indexShow: true,
      // 显示详情页面
      dataDctionaryEditShow: false,

      // 添加/修改页面所需数据
      dataDctionaryEditNeedData: {},

      // 列表高度所需字段
      tableShow: false,
      maxHeight: 0,
    };
  },
  mounted() {
    this.init()
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
    this.common.changeTable(this, ".DataDctionary", [
      ".DataDctionary .toolbar",
      ".DataDctionary .block",
      ".DataDctionary #crumbs"
    ]);
  },
  methods: {
    // 列表初始化
    init() {
      let _this = this
      let params = {
        busicode: "/enum/queryForList.htm",
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
    // 删除2月前日志按钮
    add() {
      this.dataDctionaryEditShow = true
      this.indexShow = false
      this.dataDctionaryEditNeedData.saveType = 'add'
    },
    // 修改按钮
    edit(row) {
      this.dataDctionaryEditShow = true
      this.indexShow = false
      this.dataDctionaryEditNeedData = row
      this.dataDctionaryEditNeedData.saveType = 'edit'
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
          busicode: "/enum/delete.htm?code=" + row.code,
        };
        this.$api.fetch({
          params: params,
        }).then(res => {
          _this.$message({
            type: 'success',
            message: '删除成功！'
          })
          _this.init()
          _this.getDataDictionary()
        })
      }).catch(() => {
        _this.$message({
          type: 'info',
          message: '已取消删除'
        })
      });
    },
    // 保存按钮（调用子页面保存方法）
    save() {
      this.$refs.DataDctionaryEdit.save()
    },
    // 获取所有数据字典下拉数据（用于刷新前端本地数据字典缓存）
    getDataDictionary() {
      let _this = this
      let params = {
        busicode: "/enum/queryAllEnum.htm",
      };
      this.$api.fetch({
        params: params,//参数
        method: 'get'
      }).then(res => {
        // 存储数据字典于本地
        res.forEach(item => {
          _this.$store.state.getDataDictionary[item.code] = item.items
        });
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
    // 列表的NO列
    indexMethod(index) {
      //获取表格序号
      return (
        this.tableQuery.pageSize * (this.tableQuery.page - 1) + (index + 1)
      );
    },
    closeDialog() {
      this.indexShow = true
      this.dataDctionaryEditShow = false
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
.DataDctionary {
  width: 100%;
  height: 100%;
  .el-dialog__body {
    padding: 20px;
    height: calc(100% - 196px);
  }
}
</style>
