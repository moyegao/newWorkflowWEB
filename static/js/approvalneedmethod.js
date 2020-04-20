/**
 * ajax调用
 * 
 * @param url 链接地址
 * @param data 数据
 * @param callbackfun 回调函数
 * @param method 调用方法，默认为post
 * @param dataType 返回参数类型,默认为json
 */
function commitData(url, data, callbackfun, method, dataType) {
	if (method == null) {
		// 默认post方式
		method = "post";
	}
	if (dataType == null) {
		// 默认json数据类型
		dataType = "json";
	}
	if (callbackfun.error == null) {
		// 默认输出错误日志
		callbackfun.error = function(data) {
			top.dialog({
				title : "操作异常",
				content : "操作异常",
				quickClose : true
			}).show();
		};
	}
	$.ajax({
		url : url,
		dataType : dataType,
		type : method,
		data : data,
		headers : {
			"returntype" : "ajax/json"
		},
		traditional : true,
		success : function(data) {
			if (data.code >= 10000 && data.code < 11000) {
				if (data.code == 10000) {
					top.location.href = "/cas.api";
					return;
				}
				top.dialog({
					quickClose : true,
					content : data.description
				}).show();	
			}
			if (callbackfun.success)
				callbackfun.success(data);
		},
		error : callbackfun.error
	});
}
/**
 * 获取选择器的值
 * 
 * @param selector jquery选择器
 * @returns {Object}
 */
function getData(selector) {
	var data = new Object();
	$(selector).each(function(index) {
		if ((this.type == 'checkbox' || this.type == 'radio') && !this.checked)
			return true;
		if (!data[this.name]) {
			data[this.name] = $.trim(this.value);
			if ($(this).attr("_measure")) {
				data[this.name] = new Number(this.value.trim()) * new Number($(this).attr("_measure"));
			}
		} else {
			if ($(this).attr("isbit"))
				data[this.name] = new Number(data[this.name]) + new Number(this.value.trim());
			else {
				if (!Array.isArray(data[this.name])) {
					var tmp = new Array();
					tmp.push(data[this.name]);
					data[this.name] = tmp;
				}
				data[this.name].push(this.value.trim());
			}
		}
	});
	return data;
}
/**
 * 弹出一个文本框供输入信息
 * 
 * @param ok 当按OK时的回调函数，带参数为输入的值
 * @param title 标题
 */
function inputValue(ok, title) {
	var d = top.dialog({
		title : title,
		content : '<input autofocus id="_dialog_value"/>',
		okValue : "是",
		cancelValue : "否",
		ok : function() {
			this.close($("#_dialog_value").val().remove());
		},
		cancel : function() {
			this.close(null).remove();
		}
	});
	d.addEventListener('close', function() {
		if (this.returnValue != null)
			ok(this.returnValue);
	});
	d.showModal();
}
/**
 * 弹出一个确认框
 * 
 * @param ok 点击OK时执行的函数
 * @param title 标题
 * @param content 内容
 */
function confirm(ok, title, content, cancel) {
	var d = top.dialog({
		title : title,
		content : content,
		okValue : "是",
		cancelValue : "否",
		ok : function() {
			ok();
		},
		cancel : function() {
			if (cancel) {
				cancel();
			}
			this.close(null).remove();
		}
	});
	d.showModal();
}
/**
 * 全选反选
 * 
 * @param event
 */
function checkAll(event) {
	if (event.checked) {
		$("input[name='" + $(event).attr("id") + "']").attr("checked", "checked")
	} else {
		$("input[name='" + $(event).attr("id") + "']").removeAttr("checked");
	}
}
/**
 * 获得checkbox所有值 逗号分隔
 * 
 * @param name
 * @returns {String}
 */
function getCheckedVal(name) {
	var val = "";
	$("input[name='" + name + "']").each(function() {
		if (this.checked) {
			val += this.value + ",";
		}
	});
	if (val.length > 0) {
		val = val.substring(0, val.length - 1);
	}
	return val;
}
/**
 * 获得checkbox所有值 数组
 * 
 * @param name
 * @returns {Array}
 */
function getCheckedArray(name) {
	var val = new Array();
	var i = 0;
	$("input[name='" + name + "']:checked").each(function() {
			val[i++] = this.value;
	});
	return val;
}
/**
 * 辅助单位发生change时执行的函数
 * 
 * @param inp
 */
function _assist_function(inp) {
	var name = $(inp).attr("for");
	var target = $("[name='" + name + "']");
	var fixed = target.fixed || 2;
	target.val((new Number(target.val()) * new Number(target.attr("_measure")) / new Number(inp.value)).toFixed(fixed));
	target.val(new Number(target.val()));
	target.attr("_measure", inp.value);
}
function getQueryString(name) {  
	var after = window.location.hash.split("?")[1];
	if(after){
		var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
		var r = after.match(reg);
		if(r != null){
			return  decodeURIComponent(r[2]);
		}else{
			return null;
		}
 	}
}
/**
 * 兼容ie placeholder
*/
$(function(){  
    if( !('placeholder' in document.createElement('input')) ){     
           $('input[placeholder],textarea[placeholder]').each(function(){      
             var that = $(this),      
             text= that.attr('placeholder');      
             if(that.val()===""){      
               that.val(text).addClass('placeholder');      
             }      
             that.focus(function(){      
               if(that.val()===text){      
                 that.val("").removeClass('placeholder');      
               }      
             })      
             .blur(function(){      
               if(that.val()===""){      
                 that.val(text).addClass('placeholder');      
               }      
             })      
             .closest('form').submit(function(){      
               if(that.val() === text){      
                 that.val('');      
               }      
             });      
           });    
    }  
});  
