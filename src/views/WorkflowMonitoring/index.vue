<template>
  <div class="WorkflowMonitoring">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <!-- 首页 -->
      <div class="bread-contain-right">
      </div>
    </div>

    <div class="company-content">
      <div class="company-left">
        <company-tree :treeData="treeDatas" @sendTreeData="backTreeData"></company-tree>
      </div>
      <div class="company-right">
        <div class="toolbar">
          <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
            <el-form-item class="form-left">

              <el-form-item label="模板编号：">
                <el-input v-model="tableQuery.code" placeholder="请输入模板编号"></el-input>
              </el-form-item>

              <el-form-item label="模板名称：">
                <el-input v-model="tableQuery.name" placeholder="请输入模板名称"></el-input>
              </el-form-item>

              <el-form-item label="标题：">
                <el-input v-model="tableQuery.title" placeholder="请输入标题"></el-input>
              </el-form-item>

              <el-form-item>
                <el-button class='searchBtn' @click="search" icon="el-icon-search"></el-button>
              </el-form-item>

            </el-form-item>
          </el-form>
        </div>
        <div class="kl-table">
          <el-table v-if="tableShow" :max-height="maxHeight" stripe border :data="tableData.list" class="wuserInfo-table">
            <el-table-column type="index" label="NO." width="50" :index="indexMethod">
            </el-table-column>
            <el-table-column prop="processCode" min-width="80" label="模板编号">
            </el-table-column>
            <el-table-column prop="processName" min-width="80" label="模板名称">
            </el-table-column>
            <el-table-column prop="title" min-width="80" label="标题">
            </el-table-column>
            <el-table-column prop="statusName" min-width="120" label="状态">
            </el-table-column>
            <el-table-column prop="createUserName" min-width="60" label="起草人">
            </el-table-column>
            <el-table-column prop="createTime" min-width="120" label="起草时间">
            </el-table-column>
            <el-table-column prop="curNodeName" min-width="80" label="当前节点">
            </el-table-column>
            <el-table-column prop="curOpertorName" min-width="100" label="当前办理人">
            </el-table-column>
            <el-table-column label="操作" width="220">
              <template slot-scope="scope">
                <el-button type="text" @click="finish(scope.row)">结束</el-button>
                <span>|</span>
                <el-button type="text" @click="remove(scope.row)">删除</el-button>
                <span>|</span>
                <el-button type="text" @click="reject(scope.row)">驳回</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="block">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1" :page-sizes="[20, 50, 100]" :page-size="20" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
    <el-dialog class="button-dialog" title="调整节点" :visible.sync="rejectShow" width="80%" center>
      <reject ref="reject" v-if="rejectShow" :rejectNeedData='rejectNeedData'></reject>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="rejectShow = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="rejectSave">确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>
<script>
import reject from './reject'
export default {
  name: "management-area-index",
  components: {
    reject,
  },
  data() {
    return {
      // 列表数据
      tableData: [],
      // 查询条件对象
      tableQuery: {
        page: 1,
        pageSize: 20,
        code: '',
        name: '',
        title: '',
      },
      // 显示驳回弹出框
      rejectShow: false,
      // 驳回页面所需数据
      rejectNeedData: {},

      // 列表高度所需变量
      tableShow: false,
      maxHeight: 0,

      //面包屑
      crumbsData: {
        titleList: [
          { title: '工作流监控' },
        ],
      },
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
          label: 'label',
          children: 'sets'
        },
        inputProp: {
          showSearch: false,
          Inp_placeholder: '请输入节点'
        },
        sendTreeProp: ['appCode', 'appId', 'appName', 'setCode', 'setId', 'setName'],
        rootName: '根目录',
        defaultOpen: {
          nodeKey: 'id',
          // nodeItem:164
        }
      },
      // 左侧树点击数据
      treeItemData: {},
    }
  },
  mounted() {
    this.init()

    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
    this.common.changeTable(this, ".WorkflowMonitoring", [
      ".WorkflowMonitoring .toolbar",
      ".WorkflowMonitoring .block",
      ".WorkflowMonitoring #crumbs"
    ]);
  },
  methods: {
    // 页面初始化
    init() {
      this.getTreeData()
      // 初始化列表数据
      this.getTableData('init')
    },
    // 获取左侧树数据
    getTreeData() {
      let _this = this
      let params = {
        busicode: "/workflowMonitoring/queryMonitoringProcessList.htm",
      };
      this.$api.fetch({
        params: params,//参数
        method: 'get'
      }).then(res => {
        _this.treeDatas.tree = res
      })
    },
    // 获取列表数据
    getTableData(type) {
      let _this = this
      let params = {
        busicode: "/workflowMonitoring/queryForList.htm",
        page: _this.tableQuery.page,
        pageSize: _this.tableQuery.pageSize,
        code: _this.tableQuery.code,
        name: _this.tableQuery.name,
        title: _this.tableQuery.title,
      };
      // 厉害了 摩纳哥邓万走开
      // 左侧树点击查询
      if (type == 'tree') {
        params.appId = _this.treeItemData.appId
        if (_this.treeItemData.setId != '暂无') {
          params.setId = _this.treeItemData.setId
        }
      }
      this.$api.fetch({
        params: params,//参数
        method: 'get'
      }).then(res => {
        _this.tableData = res
      })
    },
    // 查询按钮
    search() {
      this.getTableData('init')
    },
    // 结束按钮
    finish(row) {
      let _this = this
      this.$confirm('是否确定结束该工作流?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        let params = {
          busicode: "/workflowMonitoring/endTask.htm?tasklistId=" + row.tasklistId,
        };
        this.$api.fetch({
          params: params,
        }).then(res => {
          _this.$message({
            type: 'success',
            message: '工作流结束成功！'
          })
          _this.init()
        })
      }).catch(() => {
        _this.$message({
          type: 'info',
          message: '已取消'
        })
      });
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
          busicode: "/workflowMonitoring/delete.htm?processInstanceId=" + row.processInstanceId,
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
    // 驳回按钮
    reject(row) {
      let _this = this
      this.rejectShow = true
      this.rejectNeedData = row
    },
    // 驳回页面确定按钮（调用驳回页面保存方法）
    rejectSave(){
      this.$refs.reject.save()
    },
    // 左侧树的点击
    backTreeData(val) {
      console.log(val);
      this.treeItemData = val
      // 点击左侧树时，清除当前查询条件里的内容
      this.tableQuery.code = ''
      this.tableQuery.name = ''
      this.tableQuery.status = ''

      this.getTableData('tree')
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
      this.tableShow = false
      this.$nextTick(() => {
        this.tableShow = true
      })
    },
  }
}
</script>
<style lang="scss">
.WorkflowMonitoring {
  width: 100%;
  height: 100%;
  .template_btn {
    width: 100%;
    height: 40px;
    text-align: center;
  }
}
</style>

