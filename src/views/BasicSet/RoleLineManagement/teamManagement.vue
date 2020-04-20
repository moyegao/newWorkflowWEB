<template>
  <div class="teamManagement">

    <div v-if="indexShow" class="company-content">
      <div class="company-left">
        <!-- <company-tree :treeData="treeDatas" @sendTreeData="backTreeData"></company-tree> -->
        <el-tree :data="treeData" show-checkbox node-key="id" default-expand-all :expand-on-click-node="false">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span class="delete_btn">
              <el-button type="text" icon="el-icon-close" size="mini" @click="() => remove(node, data)"></el-button>
            </span>
          </span>
        </el-tree>
      </div>
      <div class="company-right">
        <div class="toolbar">
        </div>
        <div class="kl-table">
          <el-table stripe border :data="tableData" class="wuserInfo-table">
            <el-table-column type="index" label="NO." width="50" :index="indexMethod">
            </el-table-column>
            <el-table-column prop="areaName" min-width="80" label="类型">
            </el-table-column>
            <el-table-column prop="sortNo" min-width="80" label="人员">
            </el-table-column>
            <el-table-column label="操作" width="100">
              <template slot-scope="scope">
                <el-button type="text" @click="remove(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <el-dialog class="button-dialog" title="调整节点" :visible.sync="rejectShow" width="80%" center>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="rejectShow = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="rejectShow = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>
<script>
export default {
  name: "management-area-index",
  components: {
  },
  data() {
    return {
      // 查询条件对象
      tableQuery: {
        page: 1,
        pageCount: 20,
      },
      // 状态下拉框数据
      processStateData: this.common.processState(),
      // 显示首页
      indexShow: true,
      // 显示驳回弹出框
      rejectShow: false,
      // 左侧树数据
      treeData: [
        {
          id: 1,
          label: '一级 1',
          children: [{
            id: 4,
            label: '二级 1-1',
            children: [{
              id: 9,
              label: '三级 1-1-1'
            }, {
              id: 10,
              label: '三级 1-1-2'
            }]
          }]
        }, {
          id: 2,
          label: '一级 2',
          children: [{
            id: 5,
            label: '二级 2-1'
          }, {
            id: 6,
            label: '二级 2-2'
          }]
        }, {
          id: 3,
          label: '一级 3',
          children: [{
            id: 7,
            label: '二级 3-1'
          }, {
            id: 8,
            label: '二级 3-2'
          }]
        }
      ],









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
        sendTreeProp: ['code', 'name', 'districtArr', 'children', 'id', 'group', 'isLeaf', 'isParent', 'parent', 'sonData'],
        rootName: '根目录',
        defaultOpen: {
          nodeKey: 'id',
          // nodeItem:164
        }
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
    // this.getTreeDatas();

    this.$nextTick(() => {
      //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
      this.common.changeTable(this, '.business-area1 .business-area1-right-content', []);
    })
  },
  methods: {
    // 首页添加按钮
    add() {
      this.workflowDesignEditShow = true
      this.indexShow = false
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
    },
    // 查询按钮
    search() { },
    // 结束按钮
    finish(row) { },
    // 删除按钮
    remove(row) { },
    // 驳回按钮
    reject(row) {
      this.rejectShow = true
    },

















    // 列表的NO列
    indexMethod(index) {
      return index + 1;
    },
    init() {
      let _this = this;

      let params = {
        "busicode": "ManageAreaList",
        "data": { areaNo: this.areaNo },
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.tableData = res.pageInfo.list;


      })

    },
    // 获取树的数据
    getTreeDatas() {
      let _this = this
      let params = {
        "busicode": "ManageAreaTree",
        "data": {},
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.treeDatas.tree = res;
        _this.areaNo = res.code;
        _this.treeParantId = res.id;
        _this.$set(_this.crumbsData.titleList, "3", { title: res.name, method: () => { window.histroy.back() } });
        _this.init();
      })
    },
    // 树的点击
    backTreeData(val) {
      let _this = this;
      this.treeParantId = val.id;
      this.areaNo = val.code;
      // this.$set(this.crumbsData.titleList,"3",{title:val.name,method:()=>{window.histroy.back()}});
      let params = {
        "busicode": "ManageAreaList",
        "data": { areaNo: this.areaNo },
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {

        _this.tableData = res.pageInfo.list;

      })
    },
    //保存按钮
    submitForm(formName) {
      let type = this.crumbsData.titleList[4].title;
      this.$refs.ManagementAreaEdit.submitForm(formName, type, this.treeParantId);
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
.teamManagement {
  .delete_btn {
  }
}
</style>

