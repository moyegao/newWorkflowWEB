<template>
  <div id="workflowDesign">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <!-- 首页 -->
      <div class="bread-contain-right" v-if="indexShow">
        <el-button size="mini" icon="el-icon-plus" :disabled="addWorkFlowShow" @click="add" type="primary">添加工作流</el-button>
        <el-button size="mini" type="primary" @click="templateManager">模板组管理</el-button>
      </div>
      <!-- 首页添加/修改 -->
      <div class="bread-contain-right" v-if="workflowDesignEditShow">
        <el-button size="mini" type="primary" @click="save">保存</el-button>
        <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog">返回</el-button>
      </div>
      <!-- 模板组管理 -->
      <div class="bread-contain-right" v-if="templateManagerShow">
        <el-button size="mini" icon="el-icon-plus" @click="templateManagerAdd" type="primary">添加</el-button>
        <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog">返回</el-button>
      </div>
      <!-- 模板组管理添加/修改 -->
      <div class="bread-contain-right" v-if="templateManagerEditShow">
        <el-button size="mini" type="primary" @click="templateManagerSave">保存</el-button>
        <el-button icon="el-icon-caret-left" size="mini" @click="templateManagerEditcloseDialog">返回</el-button>
      </div>
      <!-- 版本查询 -->
      <div class="bread-contain-right" v-if="versionQueryShow">
        <el-button icon="el-icon-caret-left" size="mini" @click="versionQuerycloseDialog">返回</el-button>
      </div>
    </div>

    <div v-show="indexShow" class="company-content">

      <div class="company-left">
        <!-- <div class="template_btn">
          <el-button size="mini" type="primary" @click="templateManager">模板组管理</el-button>
        </div> -->
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

              <el-form-item label="模板状态：">
                <el-select clearable v-model="tableQuery.status" placeholder="请选择">
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
          <el-table v-if="tableShow" :max-height="maxHeight" stripe border :data="tableData.list" class="workflowDesign">
            <el-table-column type="index" label="NO." width="50" :index="indexMethod">
            </el-table-column>
            <el-table-column prop="code" min-width="80" label="模板编号">
            </el-table-column>
            <el-table-column prop="name" min-width="80" label="模板名称">
            </el-table-column>
            <el-table-column prop="createUserName" min-width="80" label="创建人">
            </el-table-column>
            <el-table-column prop="createTime" min-width="80" label="创建时间">
            </el-table-column>
            <el-table-column label="操作" width="220">
              <template slot-scope="scope">
                <el-button type="text" @click="edit(scope.row)">修改</el-button>
                <span>|</span>
                <!-- <el-button type="text" @click="versionQuery(scope.row)">版本查询</el-button>
                <span>|</span> -->
                <el-button type="text" @click="templateDesign(scope.row)">模板设计</el-button>
                <span>|</span>
                <el-button type="text" @click="copy(scope.row)">复制</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="block">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1" :page-sizes="[20, 50, 100]" :page-size="20" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
            </el-pagination>
          </div>
        </div>
      </div>
      <!-- 复制按钮弹出框 -->
      <el-dialog title="复制模板" :visible.sync="copyShow">
        <el-form :model="copyData" :rules="rules" ref="copyForm">
          <el-form-item label="模板编号：" label-width="120px" prop="code">
            <el-input v-model="copyData.code"></el-input>
          </el-form-item>
          <el-form-item label="模板名称：" label-width="120px" prop="name">
            <el-input v-model="copyData.name"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="copyShow = false">取 消</el-button>
          <el-button type="primary" @click="copySave">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 首页添加/修改 -->
    <WorkflowDesignEdit ref="WorkflowDesignEdit" :workflowDesignEditNeedData='workflowDesignEditNeedData' v-if="workflowDesignEditShow"></WorkflowDesignEdit>
    <!-- 模板组管理首页 -->
    <templateManager v-if="templateManagerShow"></templateManager>
    <!-- 模板组管理添加/修改 -->
    <templateManagerEdit ref="templateManagerEdit" :templateManagerEditNeedData='templateManagerEditNeedData' v-if="templateManagerEditShow"></templateManagerEdit>
    <!-- 模板组管理添加/修改 -->
    <versionQuery v-if="versionQueryShow"></versionQuery>
  </div>

</template>
<script>
// 首页添加/修改
import WorkflowDesignEdit from './WorkflowDesignEdit'
// 模板组管理页面
import templateManager from './templateManager'
// 模板组管理添加/修改
import templateManagerEdit from './templateManagerEdit'
// 版本查询
import versionQuery from './versionQuery'
export default {
  name: "management-area-index",
  components: {
    WorkflowDesignEdit,
    templateManager,
    templateManagerEdit,
    versionQuery,
  },
  data() {
    return {
      // 查询条件对象
      tableQuery: {
        page: 1,
        pageSize: 20,
        code: '',
        name: '',
        status: '',
      },
      // 状态下拉框数据
      processStateData: this.common.processState(),
      // 显示首页
      indexShow: true,
      // 显示首页添加/修改
      workflowDesignEditShow: false,
      // 显示首页复制弹出框
      copyShow: false,
      // 显示模板组管理
      templateManagerShow: false,
      // 显示模板组管理添加/修改
      templateManagerEditShow: false,
      // 显示版本查询
      versionQueryShow: false,

      // 首页添加/修改所需数据
      workflowDesignEditNeedData: {},
      // 模板组管理添加/修改所需数据
      templateManagerEditNeedData: {},

      // 复制按钮弹出框数据
      copyData: {},
      // 复制弹出框表单校验
      rules: {
        code: [
          { required: true, message: '请输入模板编号', trigger: 'blur' },
        ],
        name: [
          { required: true, message: '请输入模板名称', trigger: 'blur' }
        ],
      },
      // 列表高度所需变量
      tableShow: false,
      maxHeight: 0,
      // 是否禁用添加工作流按钮
      addWorkFlowShow: true,









      formData: {
        areaName: '',
        sortNo: '',
        status: '',
        areaComments: "",
      },
      crumbsData: {  //面包屑
        titleList: [
          { title: '工作流设计' },
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
      // 左侧数点击数据
      treeItemData: {},

      // 列表初始化数据
      tableData: [
        {}
      ],
      parentId: "",
      tableShow: false,
      areaNo: "",
      treeParantId: "",
    }
  },
  mounted() {
    this.init()

    this.common.changeTable(this, ".company-right", [
      ".company-right .toolbar",
      ".company-right .block",
      ".company-right #crumbs"
    ]);
    console.log(
      $('.company-right .toolbar').height()
    );

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
        busicode: "/process/queryDesignProcessList.htm",
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
        busicode: "/process/queryForList.htm",
        page: _this.tableQuery.page,
        pageSize: _this.tableQuery.pageSize,
        code: _this.tableQuery.code,
        name: _this.tableQuery.name,
        status: _this.tableQuery.status,
      };
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

    // 首页添加按钮
    add() {
      console.log(this.treeItemData);
      // 若未点击左侧树选择某一模板组，则不允许进添加/修改页面
      if (!('appName' in this.treeItemData)) {
        this.$message({
          message: '请先选择一个模板组',
          type: 'warning'
        });
        return
      }
      this.workflowDesignEditShow = true
      this.indexShow = false
      this.workflowDesignEditNeedData = this.treeItemData
      this.workflowDesignEditNeedData.saveType = 'add'
    },
    // 首页修改按钮
    edit(row) {
      this.workflowDesignEditShow = true
      this.indexShow = false
      this.workflowDesignEditNeedData = row
      this.workflowDesignEditNeedData.saveType = 'edit'
    },
    // 首页保存按钮（调用子页面保存方法）
    save() {
      this.$refs.WorkflowDesignEdit.save()
    },
    // 首页版本查询按钮
    versionQuery(row) {
      this.versionQueryShow = true
      this.indexShow = false
    },
    // 模板查询返回按钮
    versionQuerycloseDialog() {
      this.indexShow = true
      this.versionQueryShow = false
      this.init()
    },
    // 首页模板设计按钮
    templateDesign(row) {
      console.log(window.location.host);
      window.open('http://192.168.13.83:9999/workFlowDesign.htm?appCode=' + row.appCode + '&setCode=' + row.setCode + '&processCode=' + row.code + '&name=' + row.name + '&token=' + localStorage.getItem('token'))
    },
    // 首页复制按钮
    copy(row) {
      this.copyShow = true
      this.copyData.id = row.id
    },
    // 首页复制弹出框确定按钮
    copySave() {
      let _this = this
      this.$refs['copyForm'].validate((valid) => {
        if (valid) {
          let params = {
            busicode: '/process/copyProcess.htm?id=' + _this.copyData.id + '&code=' + _this.copyData.code + '&name=' + _this.copyData.name,

          }
          this.$api.fetch({
            params: params,
          }).then(res => {
            _this.$message({
              message: '复制成功！',
              type: 'success'
            });
            _this.copyShow = false
            _this.copyData = {}
            _this.init()
          }).catch(err => {
            _this.copyShow = false
            _this.copyData = {}
          })
        } else {
          return false;
        }
      });
    },
    // 首页返回按钮
    closeDialog() {
      this.indexShow = true
      this.workflowDesignEditShow = false
      this.templateManagerShow = false
      this.templateManagerEditShow = false
      if (this.crumbsData.titleList.length > 1) {
        this.crumbsData.titleList.pop()
      }
      // 默认未点击左侧树
      this.treeItemData = {}
      this.init()

    },
    // 首页查询按钮
    search() {
      this.getTableData('init')
    },

    // 模板组管理按钮
    templateManager() {
      this.templateManagerShow = true
      this.indexShow = false
      this.crumbsData.titleList.push({ title: "模板组管理" })
    },
    // 模板组管理首页添加按钮
    templateManagerAdd() {
      this.templateManagerEditShow = true
      this.templateManagerShow = false
      this.templateManagerEditNeedData.saveType = 'add'
    },
    // 模板组管理添加/修改页面保存按钮(调用模板组管理添加/修改页面保存方法)
    templateManagerSave() {
      this.$refs.templateManagerEdit.save()
    },
    // 模板组管理添加/修改页面返回按钮
    templateManagerEditcloseDialog() {
      this.templateManagerEditShow = false
      this.templateManagerShow = true
    },

    // 列表的NO列
    indexMethod(index) {
      //获取表格序号
      return (
        this.tableQuery.pageSize * (this.tableQuery.page - 1) + (index + 1)
      );
    },
    // 左侧树的点击
    backTreeData(val) {
      console.log(val);
      this.treeItemData = {}
      this.treeItemData = val
      // 若点击的是模板组（二级菜单），则禁用添加工作流按钮
      if (this.treeItemData.setId == '暂无') {
        this.addWorkFlowShow = true
      }else{
        this.addWorkFlowShow = false
      }
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
  },
  watch: {
    maxHeight() {
      console.log(this.maxHeight);
      this.tableShow = false;
      this.$nextTick(() => {
        this.tableShow = true;
      });
    }
  }
}
</script>
<style lang="scss">
#workflowDesign {
  .template_btn {
    width: 100%;
    height: 40px;
    text-align: center;
  }
  .company-content .company-left {
    height: calc(100% - 40px);
  }
  .el-dialog {
    margin-top: 15vh !important;
    width: 50%;
    height: 45%;
    .el-dialog__body {
      .el-form {
        padding-top: 40px;
        .el-form-item {
          width: 60%;
        }
      }
      .el-input__inner {
        height: 40px;
        line-height: 40px;
      }
    }
    .el-dialog__footer {
      border-top: none;
      text-align: right;
      padding: 5px 30px !important;
    }
  }
}
</style>

