/**
 * 用户、部门、职位选择框
 */
;

(function($, window, document, undefined) {

	function find(str,cha,num){
		var x=str.indexOf(cha);
		for(var i=0;i<num;i++){
				x=str.indexOf(cha,x+1);
		}
		return x;
	}
	//var ctxPath = location.href.substring(0, find(location.href, '/', 2));
	// console.log(ctxPath);
// 	function getRootPath(){
// 		//获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
// 		var curWwwPath=window.document.location.href;
// 		//获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
// 		var pathName=window.document.location.pathname;
// 		var pos=curWwwPath.indexOf(pathName);
// 		//获取主机地址，如： http://localhost:8083
// 		var localhostPaht=curWwwPath.substring(0,pos);
// 		//获取带"/"的项目名，如：/uimcardprj
// 		var projectName=pathName.substring(0,pathName.substr(1).indexOf('/')+1);
// 		return(localhostPaht+projectName);
// }
	var dialog = function(element, opt) {
		this.element = element;// 回填元素
		var self = this;
		var defaultOpt = {
			type : 7,// 人员1、部门2、职位4
			checkType : "single",// 单选
			commit : function(data) {//回填--回调函数
				var tag = self.element.context.tagName;
				if (tag == "INPUT") { //回填元素为input
					self.element.val($(data).map(function() {return this.name}).get().join(","));
				}else{ //回填元素为普通元素****包括textarea
					self.element.empty();
					self.element.append($(data).map(function() {
						return this.name
					}).get().join(","));
				}
				self.element.data("code", data);
			}
		};
		this.options = $.extend(defaultOpt, opt);
		var select_check = ""; // ***单选/多选
		var select_type = ""; // ***人员1、部门2、职位4
	};
	dialog.prototype = {
		/**
		 * 初始化界面
		 */
		init : function(data) {
			var select_title = "";//组件标题
			var select_tab_title = "";//选项卡标题
			var select_icon = "";//未选中的状态图标****默认
			var select_icon_active = "";//选中的状态图标
			if (this.options.checkType === "single") {//单选
				select_check = "single";
				select_iocn = "icon-circle-empty";
				select_icon_active = "icon-dot-circled";
			} else {//多选
				select_check = "check";
				select_iocn = "icon-check-empty";
				select_icon_active = "icon-check";
			}
			if ((this.options.type & 1) == 1) {
				select_type = 1;
				select_title += "人员";
				select_tab_title += '<span class="personal-name" type="' + select_type + '">人员</span>';
			}
			;
			if ((this.options.type & 2) == 2) {
				select_type = 2;
				select_title += "部门";
				select_tab_title += '<span class="department" type="' + select_type + '">部门</span>';
			}
			;
			if ((this.options.type & 4) == 4) {
				select_type = 4;
				select_title += "职位";
				select_tab_title += '<span class="p-post" type="' + select_type + '">职位</span>';
			}
			;
			this.DOM = $('<div class="popList">\
        						<div class="popTitle">\
            						<span class="close icon-cancel-circled rt"></span>\
            						<b class="icon-edit">请选择'
					+ select_title
					+ '</b>\
        						</div>\
	        					<div class="popContent">\
	        						<div class="conditionBox clearfloat">\
	                					<div class="condition-name">'
					+ select_tab_title
					+ '</div>\
	            					</div>\
						            <div class="p-content clearfloat">\
						            	<div class="leftBox clearfloat">\
						                    <span class="icon-exchange"></span>\
						                    <div class="department-div list01"><ul></ul></div>\
						                    <div class="personal-nameDiv list02"><ul></ul></div>\
						                </div>\
						                <div class="rightBox">\
						                    <div class="p-selected list04">\
						                        <ul></ul>\
						                    </div>\
						                </div>\
						            </div>\
	        					</div>\
	        					<div class="popFooter">\
						            <button class="rt">确定</button>\
						        </div>');
			var ele = $("<div>").addClass('popbox');
			ele.append(this.DOM);
			var self = this;
			this.DOM.find(".popTitle .close").click(this.closePop);
			this.DOM.find(".personal-nameDiv").click(function(event) {
				self.selectStaff(event.target);
			});
			this.DOM.find(".rightBox").click(function(event){
				self.deleteStaff(event.target);
			});
			this.DOM.find(".condition-name span").click(function() {
				self.tabSwitch(this);
			});
			this.DOM.find(".condition-name span:eq(0)").click();
			this.DOM.find(".popFooter button.rt").click(function() {
				self.savePop();
			});
			//
			data && $(data).map(function() {
				self.addSelectedItem(this.code, this.type, this.name);
			});
			return ele[0];
		},
		/**
		 * 关闭弹层
		 */
		closePop : function() {
			$('.popbox').remove();
		},
		/**
		 * 选择*****单选/多选选项
		 */
		selectStaff : function(target) {
			//var e = event || window.event;
			//******将点击目标始终转换为li
			// console.log(target);
			if (target.tagName != 'SPAN' && target.tagName != "LI")
				return;
			var item = $(target);
			if (target.tagName == "SPAN")
				item = item.parent();
			if (select_check === "single") {// ******单选
				item.siblings('li').find("span").removeClass('icon-dot-circled').addClass("icon-circle-empty");
				item.find("span").addClass("icon-dot-circled").removeClass('icon-circle-empty');
			} else if (select_check === "check") {// *****多选
				var staff_text = item.find("span").text(); // 选中的文本
				var select_id = item.find("span").data("code"); // 选中的code
				var self = this;
				if (item.find("span").hasClass("select-all")) {// *****判断点击的是全选还是普通多选项***全选
					if (item.find("span").hasClass("icon-check")) {// 全不选
						item.siblings().find("span").removeClass("icon-check").addClass("icon-check-empty");
						item.find("span").removeClass("icon-check").addClass("icon-check-empty");
						item.siblings().each(function() {
							self.removeSelectedItem($(this).find("span").data("code"));//删除右侧所有匹配的选项
						});
					} else {// 全选
						item.siblings().find("span").addClass("icon-check").removeClass("icon-check-empty");
						item.find("span").addClass("icon-check").removeClass("icon-check-empty");
						item.siblings().each(function() {
							self.removeSelectedItem($(this).find("span").data("code"));//先删除单个添加到右侧的选项***全选会选择添加到右侧
							self.addSelectedItem($(this).find("span").data("code"), 1, $(this).find("span").text());//添加所有的选项到右侧
						});
					}
					return;
				}
				// *****普通多选项***
				if (item.find("span").hasClass("icon-check")) { // 取消选中**删除
					item.find("span").removeClass("icon-check").addClass("icon-check-empty");
					this.removeSelectedItem(select_id);
				} else { // 选中**添加
					item.find("span").removeClass("icon-check-empty").addClass("icon-check");
					this.addSelectedItem(select_id, select_type, staff_text);
				}
			}
		},
		/**
		 * 删除*****选项
		 */
		removeSelectedItem : function(code) {
			this.DOM.find(".rightBox .p-selected li span[data-code=" + code + "]").parent().remove();
		},
		/**
		 * 添加*****选项
		 */
		addSelectedItem : function(code, type, text) {
			var item = '<li><span data-code="' + code + '" data-type="' + type + '">' + text + '<i class="close icon-cancel-circled"></i></span></li>';
			this.DOM.find(".rightBox .p-selected ul").append(item);
		},
		/**
		 * 右侧删除*****多选选项
		 */
		deleteStaff : function(target) {
			if (target.tagName != 'I' && target.tagName != "LI" && target.tagName != "SPAN" ){
				return;
			}
			var item = $(target);
			var delete_id = item.closest("li").find("span").data('code');
			item.closest("li").remove();
			this.DOM.find(".leftBox .personal-nameDiv span[data-code=" + delete_id + "]").removeClass('icon-check').addClass("icon-check-empty");
		},
		/**
		 * 选项卡切换
		 */
		tabSwitch : function(target) {
			// 设置选项卡标题是否显示
			var tab_length = this.DOM.find(".condition-name span").size();
			if (tab_length < 2) {
				this.DOM.find(".condition-name").empty();
			}
			// 设置卡片标题active属性
			var tabIndex = this.DOM.find(".condition-name span").index(target);
			this.DOM.find(".condition-name span").removeClass('active').eq(tabIndex).addClass('active');
			// 设置单选与多选的排版***默认是多选的排版
			if (select_check == "single") { // 单选
				this.DOM.find(".rightBox,.leftBox .icon-exchange").hide();
				this.DOM.find(".leftBox").css('width', '100%');
			}
			select_type = $(target).attr("type");
			if (select_type == 1) {// 选项卡***人员
				this.DOM.find(".personal-nameDiv,.department-div").show().css('width', '50%');
				this.DOM.find(".personal-nameDiv").empty();
				var self = this;
				this.department(function(data) {
					self.DOM.find(".department-div").deptree(
							data,
							{
								callback : {
									onClick : function(event, node, data) {
										self.staff(data.code, function(data2) {// ******加载组织架构下的人员信息
											if (data2.length>0) {//判断是否有数据
												if (select_check == "single") {//判断是否显示全选***多选才有全选
													var ul = "";
												}else{
													var ul = '<li><span class="select-all ' + select_iocn + '">全选</span></li>';
												}
												for (var i = 0; i < data2.length; i++) {
													ul += '<li><span class="' + select_iocn + '" data-type="' + select_type + '" data-code="' + data2[i].code
															+ '">' + data2[i].name + '</span></li>';
												}
												ul = $("<ul>").append(ul);
												self.DOM.find(".personal-nameDiv").empty().append(ul);
												self.DOM.find(".rightBox li span").each(
														function() {// 判断右侧是否已经存在
															var code = $(this).data("code");
															self.DOM.find(".personal-nameDiv li span[data-code=" + code + "]").removeClass('icon-check-empty')
																	.addClass('icon-check');
														});
											}
										});
									}
								}
							});
				});
			} else if (select_type == 2) {// 选项卡***部门
				this.DOM.find(".personal-nameDiv").hide();
				this.DOM.find(".department-div").show().css('width', '100%');
				var self = this;
				this.department(function(data) {
					self.DOM.find(".department-div").deptree(
							data,
							{
								callback : {
									onClick : function(event, node, data) {
										if (select_check == "single") {//单选
										}else{//多选
											//判断是否是最底层节点***是否已经选中添加了
											if (data._child == 0 && self.DOM.find(".rightBox li span[data-code=" + data.code + "]").length == 0) {
												var li = '<li><span data-code="' + data.code + '" data-type="' + select_type + '">' + data.name
														+ '<i class="close icon-cancel-circled"></i></span></li>';
												self.DOM.find(".rightBox .p-selected ul").append(li);
											}
										}
									}
								}
							});
				});
			} else if (select_type == 4) {// 选项卡***职位
				this.DOM.find(".department-div").hide();
				this.DOM.find(".personal-nameDiv").show().css('width', '100%');
				var self = this;
				this.position(function(data) {
					self.DOM.find(".personal-nameDiv").empty();
					var ul = "";
					for (var i = 0; i < data.length; i++) {
						ul += '<li><span class="' + select_iocn + '" data-type="' + select_type + '" data-code="' + data[i].code + '">' + data[i].name
								+ '</span></li>';
					}
					ul = $("<ul>").append(ul);
					self.DOM.find(".personal-nameDiv").empty().append(ul);
					self.DOM.find(".rightBox li span").each(function() {// 判断右侧是否已经存在
						var code = $(this).data("code");
						self.DOM.find(".personal-nameDiv li span[data-code=" + code + "]").removeClass('icon-check-empty').addClass('icon-check');
					});
				});
			}
		},
		/**
		 * 部门模块***获取部门数据
		 */

		department: function (callback) {
			$.ajax({
				url : window.$baseUrl + "dep/json.htm?id=-1",
				// url : "http://localhost:8080/dep/json.api?id=-1",
				dataType : "JSON",
				type : "GET",
				traditional : true,
				success : function(data) {
					callback && callback(data);
				}
			});
		},
		/**
		 * 人员模块***获取人员数据
		 */
		staff : function(departmentcode, callback) {
			$.ajax({
				url : window.$baseUrl + "dep/staff.htm",
				dataType : "JSON",
				type : "POST",
				data : {
					code : departmentcode
				},
				traditional : true,
				success : function(data) {
					callback && callback(data);
				}
			});
		},
		/**
		 * 职位模块***获取职位数据
		 */
		position : function(callback) {
			// 模拟数据
			var data = [ {
				code : "1",
				name : "董事长"
			}, {
				code : "2",
				name : "总经理"
			}, {
				code : "3",
				name : "技术总监"
			} ];
			callback && callback(data);
		},
		/**
		 * 点击确认***获取选择的数据
		 */
		savePop : function() {
			var self = this;
			var data = [];
			if (select_check == "single") {//单选
				if (select_type == 2){
					var span = this.DOM.find("span.leaf.focus");
				}else{
					var span = this.DOM.find(".personal-nameDiv li span.icon-dot-circled");
				}
				self.getData(span,data)
			}else if(select_check == "check"){//多选
				this.DOM.find(".rightBox li span").each(function() {
					var span = $(this);
					self.getData(span,data)
				});
			}
			var callback = this.options.commit;
			callback && callback(data);
			$('.popbox').remove();
		},
		/**
		 * 存选择的数据
		 */
		getData : function(tag,data){
			// **保存为对象***
			var obj = {};
			obj.type = tag.data("type");
			obj.code = tag.data("code");
			obj.name = tag.text();
			data.push(obj);//添加到数组中
		}
	};

	$.fn.staffSelector = function(option) {
		var a = new dialog(this, option);
		$("body").append(a.init(option.data));
	}

})(jQuery, window, document);
