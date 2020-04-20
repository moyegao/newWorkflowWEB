/**
 * 公用函数方法
 */
'use strict'
import Vue from 'vue'

let util = {}
//表单弹窗关闭，数据保存提醒
util.treeToArray = (data, expandAll, parent = null, level = null) => {
	let arr = []
	Array.from(data).forEach(function (record) {
	if (record._expanded === undefined) {
		Vue.set(record, '_expanded', expandAll)
    }
    let _level = 1
    if (level !== undefined && level !== null) {
      _level = level + 1
    }
    Vue.set(record, '_level', _level)
    // 如果有父元素
    if (parent) {
      Vue.set(record, 'parent', parent)
    }
    arr.push(record)
    if (record.children && record.children.length > 0) {
      const children = util.treeToArray(record.children, expandAll, record, _level)
      arr = arr.concat(children)
    }
	})
  	return arr
}
// 当前日期
util.date = (s) => {
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

// 左边二级菜单显示与隐藏
 util.menuShow = (Lclass,Rclass,Hclass,iconClass)=>{
  $(Lclass).addClass('animation');
  $(Rclass).addClass('animation');
  if($(Lclass).width()===0){
    $(Lclass).css('width','200px');
    
    $(Rclass).css('width','calc(100% - 230px)');
    $(Hclass).css('display','block');
    $(iconClass).addClass('el-icon-arrow-left').removeClass('el-icon-arrow-right');
  }else{
    $(Lclass).css('width','0px');
    $(Rclass).css('width','calc(100% - 30px)');
    $(Hclass).css('display','none');
    $(iconClass).addClass('el-icon-arrow-right').removeClass('el-icon-arrow-left');
  }
  
 }// 右边审批显示与隐藏
// show 判断右侧审批流是否展示
// Rclass 主内容模块class
// Hclass 审批流模块class
// Iclass 图标位置Class
// iconClass 小图标class

 util.approvalShow = (show,Rclass,Hclass,Iclass,iconClass)=>{
  if(show==true){//显示
    $(Rclass).css('width','calc(100% - 165px)');
    $(Hclass).css('display','inline-block');
    $(Hclass).css('width','150px');
    $(Iclass).css('right','153px');
    $(iconClass).addClass('el-icon-arrow-right').removeClass('el-icon-arrow-left');
  }else{//隐藏
    $(Rclass).css('width','100%');
    $(Hclass).css('display','none');
    $(Hclass).css('width','0px');
    $(Iclass).css('right','0px');
    $(iconClass).addClass('el-icon-arrow-left').removeClass('el-icon-arrow-right');
  }
  
 }

 //导出
 util.exportExcel = () =>{
   
 }
  // 下载模板
  util.downFile = (url) => {
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
  util.exportExcel=(busicode,obj,tHeader,filterVal,filename,total)=>{
    let listData = {}
    // this.tableQuery.pageCount = this.historyData.total ===0? 20:this.historyData.total
    obj.pageCount = total ===0? 20:total

    let params ={
      // "busicode":busicode,
      "data": obj
    }
    this.$api.fetch({
      apiUrl: busicode,//路径
      method: 'post',//请求方法
      params:params,//参数
      needErrorCallback:true
    }).then(res =>{
      if(res.code===0){
        listData = res.data
        if (!listData.list[0]) {
          this.$notify({
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
export default util