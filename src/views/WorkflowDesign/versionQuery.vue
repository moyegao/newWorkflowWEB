<template>
  <!-- versionQuery -->
  <div class="versionQuery">
    <div v-if="indexShow">

      <div class="toolbar">
      </div>
      <div class="kl-table">
        <el-table v-if="tableShow" :max-height="maxHeight" stripe border :data="tableData.list" @cell-click="cellClick" class="versionQuery-table">

          <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
          </el-table-column>

          <el-table-column prop="processState" min-width="60" label="流程部署编号">
          </el-table-column>

          <el-table-column prop="nodeName" min-width="100" label="流程部署名称">
          </el-table-column>

          <el-table-column prop="operator" min-width="100" label="流程定义编号">
          </el-table-column>

          <el-table-column prop="billNo" min-width="100" label="流程编号">
          </el-table-column>

          <el-table-column prop="billDate" min-width="80" label="流程版本号">
          </el-table-column>

          <el-table-column prop="billNo" min-width="100" label="状态">
          </el-table-column>

        </el-table>
        <!-- 分页 -->
        <div class="block">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1" :page-sizes="[20, 100, 500, 1000]" :page-size="20" layout="total, sizes, prev, pager, next, jumper" :total="histroyData.total">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "versionQuery",
  data() {
    return {
      // 应用管理首页
      indexShow: true,
      // 修改页面
      applicationManagementEditShow: false,
      // 白名单页面
      whiteListShow: false,





      // 列表数据
      tableData: {
        list: [
          {}
        ],
      },
      //查询条件对象
      tableQuery: {
        page: 1,
        pageCount: 20,
        receiptType: 2,

        beginDate: '',
        endDate: ''
      },
      // 查询条件日期
      tableTime: [],
      // 数据字典数据
      dictionaryData: {},
      // 状态下拉框数据
      processStateData: this.common.processState(),
      // 回填页所需数据
      TableDismantlingBackEditNeedData: {
        id: "",
      },
      // 详情页面所需数据
      ChangeTablesEditor1NeedData: {},





      formData: {
        con: "",
        watermeterWarehouse: "",
        waterMeterManufacturer: "1",
        waterMeterType: "",
        waterMeterTypeOptions: [],
        waterMeterCaliber: "",
        waterMeterCaliberOptions: [],
        waterMeterStatus: "",
        waterMeterStatusOptions: [],
        subordinateDepartments: "",
        subordinateDepartmentsOptions: []
      },
      tableShow: false,
      maxHeight: 0,
      histroyData: {},
      // 日期选择器
      pickerOptions: {
        disabledDate(time) {
          // 只能选择当前时间之前的日期
          // return time.getTime() > Date.now();
        }
      },
      DateChoosevalue: [],
      waterAddVisible: false, //添加弹窗的显示和隐藏
      WaterEditorName: "拆表-添加",
      ruleFormData: {},
      backfillName: "拆表-回填",
      backfillVisible: false,
      DetailedEnquiriesName: "拆表-历史查询",
      DetailedEnquiriesVisible: false,
      DetailsOfTableChangeName: "拆表-详情",
      DetailsOfTableChangeVisible: false,
      
    };
  },
  mounted() {
    // this.init()
    // this.getDictionary()




    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.common.changeTable(this, ".versionQuery", [
      ".versionQuery .toolbar",
      ".versionQuery .block",
      ".versionQuery #crumbs"
    ]);
  },
  methods: {
    // 修改按钮
    edit(row){
      this.$parent.whiteListEditShow = true
      this.$parent.whiteListShow = false
    },
    // 删除按钮
    remove(row){

    },





















    // 列表初始化
    init() {
      let _this = this
      let params = {
        busicode: "MsChgList",
        data: _this.tableQuery
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        _this.tableData = res
      })
    },
    // 数据字典（查询框）
    getDictionary() {
      var _this = this
      var params = {
        "busicode": "DictionarySelect",
        "data": "MRM"// 换表类型
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.dictionaryData = res
      })
    },
    // 查询
    search() {
      this.tableQuery.page = 1;
      this.init();
    },
    // 获取日期框数据
    getDatePicker(date){
      console.log(date);
      if (date !== undefined && date !== null) {
        this.tableQuery.beginDate = date[0]
        this.tableQuery.endDate = date[1]
      }else{
        this.tableQuery.beginDate = ''
        this.tableQuery.endDate = ''
      }
    },
    // 下载模板/导出（调子页面下载模板/导出方法）
    exportExcel() {
      var _this = this
      if (this.backfillVisible) {
        this.$refs.TableDismantlingBackEdit.exportExcel()
      }else if (this.DetailedEnquiriesVisible) {
        this.$refs.DetailedEnquiries1.exportExcel()
      }
      
    },
    // 详情按钮
    details(row) {
      this.waterAddVisible = true
      this.indexShow = false

      this.ChangeTablesEditor1NeedData.content = 'details'
      this.ChangeTablesEditor1NeedData.id = row.id
      if (row.processState === "已办结") {
        this.ChangeTablesEditor1NeedData.tableEdit = false;
      } else {
        this.ChangeTablesEditor1NeedData.tableEdit = true;
      }
    },
    // 暂存（调详情页面保存方法）
    save() {
      var _this = this
      this.$refs.ChangeTablesEditor1.save()
    },





    //分页
    handleSizeChange(val) {
      //显示多少数据一页
      // this.tableQuery.pageCount = val
      // this.tableQuery.page = 1
      this.init();
    },
    handleCurrentChange(val) {
      //显示多少页码
      // this.tableQuery.page = val
      this.init();
    },
    cellClick(row, column, cell, event) {
      //点击文件名
      let that = this;
    },
    indexMethod(index) {
      //获取表格序号
      //    return  (this.tableQuery.page-1)*this.tableQuery.pageCount + (index+1) ;
      return (
        (this.tableData.pageSize - 20) * this.tableData.pages + (index + 1)
      );
    },
    closeDialog() {
      this.indexShow = true
      this.applicationManagementEditShow = false
    },
    //弹出框
    submit(formName) {
      //提交
      this.$refs.childWaterEditor.submit()
      // this.waterAddVisible = false;
    },
    // 回填
    backfill(row) {
      this.TableDismantlingBackEditNeedData.id = row.id
      this.backfillVisible = true
      this.indexShow = false
      //  this.$set(this.crumbsData.titleList,"2",{title:'回填' })
    },
    backfillSubmit() { },
    // 明细查询
    DetailedEnquiries1() {
      this.DetailedEnquiriesVisible = true
      this.indexShow = false
      //  this.$set(this.crumbsData.titleList,"2",{title:'历史查询' })
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
.versionQuery {
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
