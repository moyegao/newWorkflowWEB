/**
 * 公用函数方法
 */
'use strict'
import Vue from 'vue'
import { Loading } from 'element-ui';

let common = {}


// 状态公共调用地址
common.processState = () => { 
  return [
    { "name": "启用", "value": 1 },
    { "name": "停用", "value": 0 },
  ]
}

// 当前日期
// s:month  当前月， lastMonth上个月，halfYear上半年，number：当天
common.date = (s) => {
	let day = new Date()
  let res
    day.setTime(day.getTime())
    let year = day.getFullYear()
    let month= day.getMonth()
    let d = day.getDate()
    if (s === 'month') {
    	res = year  + (month+1 <10 ? "0" + (month+1):(month+1))
    }else if (s === 'lastMonth'){
    	res = year  + (month <10 ? "0"+month:month)
    }else if (s === 'halfYear'){
    	res =  year  + (month- 5 <10 ? "0" + (month-5):(month-5))
    }else if (typeof(s) === 'number'){
    	day.setTime(day.getTime() + s)
		let year = day.getFullYear()
		let month= day.getMonth()
    let d = day.getDate()
      res =  year + "-" +(month+1 <10? "0" + (month+1) : month+1 )+ "-" + (d<10? "0"+d:d)
    }else {
    	res = year + "-" + (month+1 <10? "0" + (month+1) : month+1 ) + "-" + (d<10? "0"+d:d)
    }
    return res
}
// 表格高度计算
 function calcHeight(that,father,brother){
  let $fatherHeight = $(father).height();
  let $brothersHeight  = 0;
  if(typeof brother === "object"){
    for(let i in brother){
      if($(brother[i]).height()){
        $brothersHeight += $(brother[i]).height()
      }else{
        $brothersHeight +=0
      }
    }
  }
    // console.log($fatherHeight);
    // console.log($brothersHeight);
    that.maxHeight = $fatherHeight-$brothersHeight-50
    
  }

  common.changeTable=(that,father,brother)=>{
      calcHeight(that,father,brother);
    $(window).resize(function () {//动态监听监听网页窗口变化
        debugger
        calcHeight(that,father,brother)
    });
  }

  // 关闭前二次确认

   
    function handleData(newVal, oldVal){
      // console.log(newVal)
      // console.log(oldVal)
      let result = true;
      if(Object.prototype.toString.call(newVal) !== '[object Object]'){
        console.log('旧数据不是一个对象');
        return result = false;
      }
      if(Object.prototype.toString.call(oldVal) !== '[object Object]'){
        console.log('新数据不是一个对象');
        return result = false;
      }
      // 获取新数据的对象属性
      let propsCurr = Object.getOwnPropertyNames(newVal);
      // 获取旧数据的对象属性
      let propsCompare = Object.getOwnPropertyNames(oldVal);
      // 比较对象长度
      if (propsCurr.length != propsCompare.length) {
        return result = false;
      }else {
        for (var i = 0, max = propsCurr.length; i < max; i++) {
          var propName = propsCurr[i];
          // 判断对象属性值的数据类型
          if(Object.prototype.toString.call(newVal[propName]) == '[object Array]'){
            if(newVal[propName].length !=oldVal[propName].length){
              return result = false;
            }else{
              for(var j = 0; j < newVal[propName].length; j++){
                if(Object.prototype.toString.call(newVal[propName][j]) == '[object Object]'){
                  handleData(newVal[propName][j],oldVal[propName][j]);
                }else{
                  if (newVal[propName][j] !== oldVal[propName][j]) {
                    return result = false;
        
                  }
                }
                
              }
            }
          }else if(Object.prototype.toString.call(newVal[propName]) == '[object Object]'){
            handleData(newVal[propName],oldVal[propName]);
          }else{
            if (newVal[propName] !== oldVal[propName]) {
              return result = false;
  
            }
          }
          
        }
      }
      return result;
      
    }
     // obj:传入的表单对象，change:set get ,oldBJ:存入本地存储的名称，fun:确认离开后调用的方法
  common.chargeObjectEqual=(that,obj, change,oldOBJ,fun)=> {
    var lock = true;
    if (change == 'set') {
      sessionStorage.setItem(oldOBJ, JSON.stringify(obj))
    } else if (change == 'get') {
      var oldOBJ = JSON.parse(sessionStorage.getItem(oldOBJ))
      var oldData = JSON.stringify(obj);
      var oldDataHandle =  JSON.parse(oldData);
      lock = handleData(oldOBJ,oldDataHandle)
      
      if(lock&&fun){
        fun();
      }else if(!lock){
        that.$confirm('您填写的信息尚未保存, 是否确认离开?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          fun();
        }).catch(() => {
          return true
        });
      }
    }
    
  }

  // 下载模板
  common.downFile = (url) => {
    let elemIF = document.createElement("iframe")
    // elemIF.src =  `${url}/fileDown.htm?importType=1`
    elemIF.src = url;
    elemIF.style.display = "none"
    document.body.appendChild(elemIF)
  }
  //导出
  // npm i XLSX 下载
  //busicode: 接口路径,
  // obj:查询条件对象 
  //tHeader:excel表头["姓名","学号","年龄"...]
  //filterVal:excel表头对应字段 ['name', 'code', 'age'...]
  //filename:excel 文件名  
  //total:数据列表的总数
  common.exportExcel=(busicode,obj,tHeader,filterVal,filename,total,that)=>{
    let listData = {}
    // this.tableQuery.pageCount = this.historyData.total ===0? 20:this.historyData.total
    obj.pageCount = total ===0? 20:total

    let params ={
      // "busicode":busicode,
      "data": obj
    }
    that.$api.fetch({
      apiUrl: busicode,//路径
      method: 'post',//请求方法
      params:params,//参数
      needErrorCallback:true
    }).then(res =>{
      if(res.code===0){
        listData = res.data
        if (!listData.list[0]) {
          that.$notify({
            title: '警告',
            message:'表格没有相关数据',
            type: 'error'
          })
        } else {
          import('@/vendor/Export2Excel').then(excel => {
            // const tHeader = ['水表编号', '抄表日期', '所属小区','厂家编号','厂家','型号', '当日读数', '修正读数', '当日水量', '数据状态',  '用户编号','集中器编号','用户地址']
            const tHeader = tHeader;
            // const filterVal = ['code', 'daytime', 'areaName','fcode','factoryName','model','lvalue', 'fixValue','flux', 'status', 'usn', 'concentrator', 'position']
            const filterVal = filterVal;
            const list = listData.list
            // const data = this.formatJson(filterVal, list)
            const data = list.map(v => filterVal.map(j => {
              return v[j]
            }))
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename: filename,
              autoWidth: '100'
            })
          })
          // this.tableQuery.pageCount = 20
        }
      }
    })
  }

  //附件上传
  //文件超出个数限制时的钩子
  common.handleExceed=(files, fileList)=>{
    this.$message.warning(`当前限制选择3个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
  }
  //删除文件之前的钩子
  common.beforeRemove=(file, fileList)=> {
    return this.$confirm(`确定移除 ${ file.name }？`);
  }
  //文件上传成功的钩子
  common.handleSuccess=(response,file,fileList)=>{
    if(response.code === 0){
      this.$message({
    		showClose:true,
    		type:'success',
    		message:'文件上传成功'
    	})
    }else {
    	this.$message({
        showClose: true,
        message: response.description,
        type: 'error'
      })
    	fileList.splice(fileList.length-1,1)
    }
  }
  //文件上传失败的钩子
  common.handleError=(err,file,fileList)=>{
    this.$message({
      showClose: true,
      message: '上传文件错误！',
      type: 'error'
    })
  }
  // 编辑-保存数据处理
  common.handleData = (newVal, oldVal)=>{
    
    if(Object.prototype.toString.call(newVal) == '[object Object]'){
      let propsNew = Object.getOwnPropertyNames(newVal);
      let propsOld = Object.getOwnPropertyNames(oldVal);
      let prop = "";
      for (var i = 0, max = propsNew.length; i < max; i++) {
        prop = propsNew[i];
        
        if (propsOld.includes(prop)) {
          oldVal[prop] = newVal[prop];
        }
      
      }
      return oldVal;
    }else if(Object.prototype.toString.call(newVal) == '[object Array]'){
      let oldData = JSON.stringify(oldVal);
      let oldVal1 =  JSON.parse(oldData);
      let res = [];
      let propsOld = Object.getOwnPropertyNames(oldVal1);
      let prop = "";
      
      for(let j=0;j<newVal.length;j++){
        res[j] = {};
        let propsNew = Object.getOwnPropertyNames(newVal[j]);
        for (let k = 0, max = propsNew.length; k < max; k++) {
          prop = propsNew[k];
          
          if (propsOld.includes(prop)) {
            res[j][prop] = "";
            res[j][prop] = newVal[j][prop];
          }
        }
        
      }
      return res;
    }
    
  }
  // 转换数据格式（字符串转为数值型）,val可以为数组，也可以是对象
  common.handleDataType = (val,id,typeId)=>{
    if(Object.prototype.toString.call(val) == '[object Array]'){
      for(let i=0;i<val.length;i++){
        let propsCurr = Object.getOwnPropertyNames(val[i]);
        for(let j=0;j<propsCurr.length;j++){
          let propName = propsCurr[j];
          if(propName!==id&&propName!==typeId){
            if(typeof val[i][propName]==='string'){
              val[i][propName] = parseFloat(val[i][propName]);
            }
          }
          
        }
        
      }
    }else if(Object.prototype.toString.call(val) == '[object Object]'){
      let propsCurr = Object.getOwnPropertyNames(val[i]);
      for(let j=0;j<propsCurr.length;j++){
        let propName = propsCurr[j];
        if(propName!==id&&propName!==typeId){
          if(typeof val[propName]==='string'){
            val[propName] = parseFloat(val[propName]);
          }
        }
        
      }
    }
    
    return val
}
  



//周新宇--打印公共方法，
  //TODO 注意修改url地址
  //type:"打印指令类型(printPDF=打印pdf;print=直接打印;view=打印预览;formatSet=格式设计;styleSelect=弹出打印样式选择)",
  //companyNo:"水司编号",
  //businessCode:"打印业务单据的编码（pub_print_business.code）"
  //templateId:"打印的样式文件id（base_print_template.id） 可以为空，为空代表采用businessCode的默认样式来打印"
  //key:"存储打印数据的key，PrintInterfaceImpl.setPrintData方法返回的id",
  //that:"打印页面的this对象",
  common.print=(type,businessCode,templateId,key,that)=>{
    let token = localStorage.getItem('token');
    let url = $baseUrl;
    if(!url.startsWith("http")){
      let loc = window.location.href;
      loc = loc.substring(0,loc.indexOf("/",8));
      url = loc+url; //这是服务器端的地址，注意修改
    }
    if(templateId=="") {
      templateId = token+"$$$"+"businessCode_"+businessCode;//如果模板id为空，则按格式要求传入业务单据id
    }else {
      templateId = token+"$$$"+templateId
    }
    $.ajax({
      url:"http://localhost:25423/print?type="+type+"&key="+key+"&url="+url+"&formatFile="+templateId,
      type: "GET",
      success:function(data){
          if(data!='ok'){
            that.$notify({
                title: '警告',
                message:"打印不成功"+data,
                type: 'error'
            })
          }else{
          }
        } ,
        error:function(data){
          that.$notify({
            title: '警告',
            message:"请启动打印服务",
            type: 'error'
          })
        }
      }); 
  }
  //获取审批流状态数据，用于列表查询显示流程状态下拉列表
  //****************特别提示：营业收费系统复制此方法时去掉companyNo参数************* */
  common.getProcessStateData=(receiptType,that) => {
    let _this = that
    let params = {
      "busicode": "ProcessNodeList",
      "data": {
        "receiptType":receiptType,
        // "companyNo":companyNo, //营业收费正式数据不能传此参数
      },
    }
    _this.$api.fetch({
      params: params,//参数
    }).then(res => {
      localStorage.setItem('ProcessNodeList', JSON.stringify(res))
    })
  }  
  //提交流程
  //****************特别提示：营业收费系统复制此方法时去掉companyNo参数************* */
  common.processCommit=(myConfig,that,_then) => {
    let _this = that;
    let defaultConfig = {
      //单据类型
	    receiptType:'',
	    //单据id
	    billId:'',
	    //水司编号，正式使用不需要传此参数，只为运维平台测试用
	    // companyNo:'',
	    //审批意见
	    comments:'',
	    //流程标题**新建流程时必填**
	    title:'',
	    //当前待办任务，
	    curTaskId:'',
	    //1.驳回2.转办4.添加沟通人8催办 16.废弃 32.通过 64 添加沟通/评论信息
	    operation:'',
	    //operation为1时  选择驳回到哪个节点的节点的名称
	    subinfo:'',
	    //operation为2和4 时该表示转办人和沟通人,多个人员中间加逗号
	    subuser:'',
	    //表单字段json字符串，只支持K-V
	    formstr:'',
	    //下级候选.<br/>如流程设计时节点有设置权限属性“可修改节点或必须修改节点”，则：<br/>当operation为32时需指定对应节点的审批人<br/>多办理人以中划线隔开{‘Usertask01’:12-34-12’,’Usertask02’:’897-54-23’,’Usertask03’:’897-54-23’}
	    nextCandidateUsers:'',
	    //催办时的标题
	    subject:'',
	    //附件标识
	    attachmentId:'',
    }
    myConfig = Object.assign({}, defaultConfig, myConfig)
    let params = {
        "busicode": "ProcessCommit",
        "data": myConfig
    };
    _this.$api.fetch({
      params: params,//参数
    }).then(res => {
      _this.$message({
        showClose:true,
        message:'提交成功',
        type:'success',
      });
      _then();
    })
  }
  //获取审批的前端代码
  //****************特别提示：营业收费系统复制此方法时去掉companyNo参数************* */
  //receiptType单据类型，一般是启用工作流的表的数据库名称
  //title流程标题,一般是单据类型加单据编号等，容易区分的内容\用于主题
  //billId单据Id
  //processInstanceId流程实例Id,新建流程这个为空，一般为数据库中存储的流程实例id
  //workFlowObj工作流代码插入的对象，一般需在界面放置一个div对象<div id="workflowDiv"></div>
  //companyNo "水司编号"，正式使用不需要传此参数，只为运维平台测试用
  //that:"页面的this对象"
  //_then 提交后的回调函数，一般用来执行界面跳转
  //submitForm 是否需要先提交表单 0为需要提交表单再审批 1为不需要提交表单直接审批
  //_submit 用户审批前，提交的回调函数，一般用于表单保存
  common.getProcessShowView= (receiptType,title,billId,processInstanceId,workFlowObj,that,_then,submitForm, _submit) => {
    let _this = that;
    let params = {
        "busicode": "ProcessShowView",
        "data": {
            receiptType:receiptType,
            processInstanceId:processInstanceId,
            // companyNo:companyNo//此参数在营收收费系统正式使用时不得上传
        },
    }
    _this.$api.fetch({
      params: params,//参数
    }).then(res => {
      $("#"+workFlowObj).html(res);
      //接口返回的标签与事件，该方法写在后端接口返回的数据中，不在前端代码中 
      $(".submit-opinion").on("click", async function () {
        // 可修改-先保存表单信息，后提交流程
        
        if(submitForm !== 1){
          // console.log(submitForm+'需要保存先');
          _submit()
        }else{
        // 不可修改-提交流程
        // console.log(submitForm+'直接调用审批');

          let data = {}
          var loading = Loading.service({
            lock: true,
            text: '正在上传......',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.3)'
          })
          try{
            data = getSubmitData();
            
          }catch(err){
            loading.close();
            _this.$message({
              showClose: true,
              message: err,
              type: 'error',
            });
            return;
          }
          loading.close();
          
          //__subinfo要驳回的节点
          //__subuser转办人员，沟通人员，取消沟通人员
          //__comment处理意见
          //__operation操作类型
          //__nodeOperator可修改的节点信息
          //__mnodeOperator必须修改的节点信息
          //__attachmentId附件id
          //taskid当前任务id
          //template模板编号
        
          //data.attachmentId = $("#fileId").val();
          let nextCandidateUsers = {};
          if(data.__nodeOperator){
            for(let i=0;i<data.__nodeOperator.length;i++){
              nextCandidateUsers = Object.assign(nextCandidateUsers,data.__nodeOperator[i]);
            }
          }
          if(data.__nodeOperator){
            for(let i=0;i<data.__mnodeOperator.length;i++){
              nextCandidateUsers = Object.assign(nextCandidateUsers,data.__mnodeOperator[i]);
            }
          }
          _this.common.processCommit({
            receiptType: receiptType,//表单名称
            billId: billId,
            title: title,
            operation:data.__operation,
            comments:data.__comment,
            curTaskId:data.taskid,
            subinfo:data.__subinfo,
            subuser:data.__subuser,
            nextCandidateUsers:JSON.stringify(nextCandidateUsers),
            subject:data.__comment,
            attachmentId:data.__attachmentId,
            // companyNo: companyNo,//水司编号，正式使用不需要传此参数，只为运维平台测试用
          }, _this, () => {
            _then();//提交后的回调函数
          }); 

        }
      });
      
    })
  }
    //提交后启动审批流
  //****************特别提示：营业收费系统复制此方法时去掉companyNo参数************* */
  //receiptType单据类型，一般是启用工作流的表的数据库名称
  //title流程标题,一般是单据类型加单据编号等，容易区分的内容\用于主题
  //billId单据Id
  //that:"页面的this对象"
  //_then 提交后的回调函数，一般用来执行界面跳转
  common.startProcess=(receiptType,title,billId,that,_then) => {
    let _this = that;
    let data = {}
    var loading = Loading.service({
      lock: true,
      text: '正在上传......',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.3)'
    })
    try{
      data = getSubmitData();
      
    }catch(err){
      loading.close();
      _this.$message({
        showClose: true,
        message: err,
        type: 'error',
      });
      return;
    }
    loading.close();
    
    //__subinfo要驳回的节点
    //__subuser转办人员，沟通人员，取消沟通人员
    //__comment处理意见
    //__operation操作类型
    //__nodeOperator可修改的节点信息
    //__mnodeOperator必须修改的节点信息
    //__attachmentId附件id
    //taskid当前任务id
    //template模板编号
  
    //data.attachmentId = $("#fileId").val();
    let nextCandidateUsers = {};
    if(data.__nodeOperator){
      for(let i=0;i<data.__nodeOperator.length;i++){
        nextCandidateUsers = Object.assign(nextCandidateUsers,data.__nodeOperator[i]);
      }
    }
    if(data.__nodeOperator){
      for(let i=0;i<data.__mnodeOperator.length;i++){
        nextCandidateUsers = Object.assign(nextCandidateUsers,data.__mnodeOperator[i]);
      }
    }
    // console.log(receiptType,title,billId,that,_then);
    
    //receiptType单据类型，一般是启用工作流的表的数据库名称
    //billId id
    // __operation操作类型 
    //__comment处理意见
    //__curTaskId 
    //__subinfo要驳回的节点
    //__subuser转办人员，沟通人员，取消沟通人员
    //__attachmentId附件id

    _this.common.processCommit({
      receiptType: receiptType,//表单名称
      billId: billId,
      title: title,
      operation:data.__operation,
      comments:data.__comment,
      curTaskId:data.taskid,
      subinfo:data.__subinfo,
      subuser:data.__subuser,
      nextCandidateUsers:JSON.stringify(nextCandidateUsers),
      subject:data.__comment,
      attachmentId:data.__attachmentId,
      // companyNo: companyNo,//水司编号，正式使用不需要传此参数，只为运维平台测试用
    }, _this, () => {
      _then();//提交后的回调函数
    }); 

      
  }
export default common