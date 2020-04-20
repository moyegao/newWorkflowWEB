/**
 * 用来渲染输入框 现在实现了手机和IP地址的渲染 使用方法： 网页要先把此JS文件导入。
 * 首先要渲染的录入框要加上class属性render,如果是手机还要加上类mobile,IP地址的要加上ip。
 * 录入框的上级元素position要是relative或absolute
 * 同时手机录入框在网页端要加上字符长度限制，IP地址的也类似。（用我们的自定义平台配置这些限制在工具中即可配置）
 */
function render(opt) {
	this.mapper = {
		"mobile" : function phone(value) {
			value = value.concat("           ");
			value = value.substring(0, 11);
			value = value
					.replace(
							/(.{3})(.{4})(.{4})/g,
							"<span style='color:blue'>$1</span> <span style='color:red'>$2</span> <span style='color:blue'>$3</span>");
			return value;
		},
		"ip" : function ip(value) {
			value = value.concat("            ");
			value = value.substring(0, 12);
			value = value.replace(
					/([^.]{1,3})\.?([^.]{1,3})\.?([^.]{1,3})\.?([^.]{1,3})/g,
					"$1.$2.$3.$4");
			return value;
		}
	};
	this.label = new Array();
	this.input = new Array();
	this.mapper = $.extend(this.mapper, opt);
	this.resize = function() {
		var self = this;
		$.each(this.label, function(index) {
			var lb = this;
			var div = self.input[index];
			lb.css("left", div.position().left + "px");
			lb.css("top", div.position().top + "px");
			lb.width(div.outerWidth());
			lb.height(div.outerHeight());
		});
	}
	this.render = function() {
		var self = this;
		$(".render").each(function() {
			var div = $(this);
			var lb = $("<label>").css({
				position : "absolute",
				"background-color" : "rgba(255,255,255,0.1)",
				display : "block"
			});
			div.css("color", "rgba(0,0,0,0)");
			lb.attr("for", this.id);
			lb.insertAfter(div);
			self.label.push(lb);
			self.input.push(div);
			div.keyup(function() {
				var value = "";
				var cls = div.attr("class").split(/[ ]+/);
				$.each(cls, function() {
					if (self.mapper[this]) {
						value = self.mapper[this](div.val());
						lb.html(value);
					}
				});
			});
			if (div.val() != '')
				div.keyup();
			self.resize();
		});
	}
}
var renderer;
$(function() {
	renderer = new render().render();
});