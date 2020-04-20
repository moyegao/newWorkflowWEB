/**
 * 实现数据列表翻页的功能
 * 
 * @param opt 参数 pageKey 翻页调用的地址,后面会自动加上/ajax.htm condition 搜索条件,固定参数 page当前页
 *            totalPage总页数 rowNumber数据条数 addRow 增加一行的函数，传递的时候有两个参数，依次为数据，对应的字段定义
 * 
 * @returns
 */
function crud(opt) {
	this.opt = opt;
	this.query = _query;
	this.exports = _export;
	this.modify = _modify;
	this.add=_add;
	this.del = _del;
	this.next = _next;
	this.previous = _previous;
	this.first = _first;
	this.last = _last;
	this.page = _page;
	this.initSearch = _initSearch;
	this.popWin = _popWin;
	this.pageBar = _pageBar;
	this.pageBarId = "_pagebar";
}
/**
 * 执行查询按钮
 */
function _query(condition) {
	var data = condition;
	if (condition == null)
		data = getData(".condition");
	var self = this;
	var dial =top.dialog({content:'处理中。。。请稍候'}).showModal();
	commitData(this.opt.pageKey + "/ajax.htm", data, {
		success : function(value) {
			$("#data").html("");
			if(value.code == 0){
				self.opt.condition = value.condition;
				self.initSearch(value.condition);
				$.each(value.datalist, function(index, data) {
					var rowNum=value.condition.page * value.condition.pageCount+index+1;
					$("#data").append(self.opt.addRow(data,value.data[index],rowNum));
				});
			}
			dial.close();
		},
		error : function(XMLHttpRequest, textStatus, errorThrown) {
			dial.close();
			top.dialog({
				quickClose : true,
				content : "查询失败," + textStatus
			}).show();
		}
	});
}

/**
 * 修改操作
 * 
 * @param input
 * @param _id
 */
function _modify(input, _id,opt, _extra) {
	var url=this.opt.pageKey + "/pre.htm?id=" + _id;
	if(_extra!=undefined&&_extra!=null){
		for (var item in _extra){
			url+="&"+item+"="+_extra[item];
		}
	}
	var opts ={
		id : this.opt.pageKey,
		width : 800,
		url : url,
		onclose : function() {
			reload();
		}
	};
	$.extend(opts,opt);
	top.dialog(opts).showModal(input);
}


/**
 * 添加
 * 
 * @param url 添加操作地址
 * @param parameter 添加操作地址
 */
function _add(_url,_parameter,_formsize) {
	var url='';
	if(_parameter!=undefined&&_parameter!=null){
		for (var item in _parameter){
		   if(url=='')
			 url=item+"="+_parameter[item];
		   else
			 url+="&"+item+"="+_parameter[item];
		}
	}
	if(url!=''){
		url = _url + '?' + url;
	}
		
	var opts ={
		width:_formsize.width,
		height:_formsize.height,
		url : url,
		onclose : function() {
			reload();
		}
	};
	top.dialog(opts).showModal(null);
}


/**
 * 删除操作
 * 
 * @param _id
 */
function _del(_id, _extra) {
	var data={id : _id};
	if(_extra!=undefined&&_extra!=null){
		for (var item in _extra){
			data[item]=_extra[item];
		}
	}
	var self = this;
	var ok = function(){
	commitData(self.opt.pageKey + "/delete.htm", data, {
		success : function(message) {
			top.dialog({
				content : message.description,
				quickClose : true
			}).show();
			reload();
		},
		error : function(XMLHttpRequest, textStatus, errorThrown) {
			top.dialog({
				content : '操作失败' + textStatus,
				quickClose : true
			}).show();
		}
	});
	};
	confirm(ok,"删除数据","是否要删除此数据?");
}
/**
 * 执行导出按钮
 */
function _export(condition,action) {
	var data = condition;
	if (condition == null)
		data = getData(".condition");
	var form=$("<form>");// 定义一个form表单
	form.attr("style","display:none");
	form.attr("target","_blank");
	form.attr("method","post");
	if(action==null){
		form.attr("action",this.opt.pageKey + "/export.htm");
	}else{
		form.attr("action",action);
	}
	$.each(data,function(key,value){
		var input=$("<input>");
		input.attr("type","hidden");
		input.attr("name",key);
		input.attr("value",value);
		form.append(input);
	});
	$("body").append(form);// 将表单放置在web中
	form.submit();// 表单提交
	form.remove();
}
/**
 * 往后翻一页
 */
function _next() {
	var page = this.opt.condition.page;
	if (page == null)
		page = 0;
	page = page + 1;
	if(page >= this.opt.condition.totalPage)
		page = this.opt.condition.totalPage-1;
	this.opt.condition.page = page;
	this.query(this.opt.condition);
}
/**
 * 翻前翻一页
 */
function _previous() {
	var page = this.opt.condition.page;
	if (page == null)
		page = 0;
	page = page - 1;
	page = page < 0 ? 0 : page;
	this.opt.condition.page = page;
	this.query(this.opt.condition);
}
/**
 * 翻到指定页数
 */
function _page(page) {
	this.opt.condition.page = page;
	this.query(this.opt.condition);
}

/**
 * 翻到第一页
 */
function _first(page) {
	this.opt.condition.page = 0;
	this.query(this.opt.condition);
}

/**
 * 翻到最后一页
 */
function _last(page) {
	this.opt.condition.page = this.opt.condition.totalPage-1;
	this.query(this.opt.condition);
}
/**
 * 把条件填入查询页面的查询条件内
 */
function _initSearch(condition) {
	$.each(condition, function(key, val) {
		var v = $("#" + key);
		if (v.prop("tagName")=="SPAN")
		{
			v.html(val);
		}
		else
			v.val(String(val));
	});
	$("#page").html(condition.page + 1);
	this.pageBar();
}
/**
 * 弹出窗口
 */
function _popWin(_url,input)
{
	top.dialog({
		id : this.opt.pageKey,
		width : 800,
		url : _url,
		onclose : function() {
			reload();
		}
	}).showModal(input);
}
/**
 * 生成翻页html代码块
 * 
 * @param divid 生成翻页菜单块所在的元素ID,缺省为_pagebar
 * @returns
 */
function _pageBar(divid){
	var parentId = divid ||　this.pageBarId;
	if(!document.getElementById(parentId)) return;
	var curPage = parseInt(this.opt.condition.page)-4;
	if(curPage < 0 ) curPage = 0;
	var html="<span onclick=\"operate.first();\">首页</span>";
	html +="<span onclick=\"operate.previous();\">上一页</span>";
	for(var i=0;i<9;i++){
		if((curPage+i)>=this.opt.condition.totalPage)
			break;
		html+="<span ";
		if((curPage+i)==this.opt.condition.page)
			html+=" class=\"sel\" ";
		html+=" onclick=\"operate.page('"+(curPage+i)+"');\" >"+(curPage+i+1)+"</span>";
	}
	html+="<span onclick=\"operate.next();\">下一页</span>";
	html +="<span onclick=\"operate.last();\">尾页</span>";
	$("#"+parentId).html(html);
}