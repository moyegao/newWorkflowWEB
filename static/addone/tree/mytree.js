;
(function($, windw, document, undefined) {
	var tree = function mytree(node, data, setting) {
		this.node = node;
		this.data = data;
		var defaultOpt = {
			callback : {
				onclick : function() {

				}
			}
		}
		this.opt = setting;
	};
	tree.prototype = {
		init : function() {
			var tmp = {};
			var root = new Array();
			$.each(this.data, function() {
				this._child = new Array();
				tmp[this.id] = this;
				tmp[this.parentId] && tmp[this.parentId]._child.push(this);
				tmp.code = this.code;
				tmp[this.parentId] || root.push(this);// 根节点
			});
			this.node.empty();
			var self = this;
			$.each(root, function() {
				self.addChild(self.node, this, 1);
			});
		},
		addChild : function(node, data, level) {
			var self = this;
			var item = $("<li>");
			node.append(item);
			var content = $("<span>" + data.name + "</span>");
			if (this.opt.callback && this.opt.callback.onClick)
				content.on("click", function() {
					node.find("li span").removeClass("focus");
					content.addClass("focus");
					self.opt.callback.onClick(event, node, data);
				});
			content.addClass("level" + level);
			item.append(content);
			if (data._child.length > 0) {
				var ul = $("<ul>");
				data.open && ul.addClass("open");
				item.append(ul);
				$.each(data._child, function() {
					self.addChild(ul, this, level + 1);
				});
				content.addClass("branch");
				content.on("click",
						function() {
							$(this).parent().siblings().find("ul").css({
								"height" : "0"
							});
							if ($(this).parent().find(">ul").height() != "0") {
								$(this).parent().find(">ul").css({
									"height" : "0"
								});
								content.addClass("levelclose").removeClass(
										"levelopen");
							} else {
								$(this).parent().find(">ul").css({
									"display" : "block",
									"height" : "auto"
								});
								content.addClass("levelopen").removeClass(
										"levelclose");
							}
						});
			} else {
				content.addClass("leaf");
			}
		}
	};
	$.fn.deptree = function(data, setting) {
		var t = new tree(this, data, setting);
		t.init();
	}
})(jQuery, window, document);
