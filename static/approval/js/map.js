//**********基本操作*********start*************
// 监听键盘删除事件
$(document).keyup(function(event) {
	if (event.keyCode == 46) {
		//do something
	}
});
//属性面板关闭展开
function closepanel(obj) {
	if ($(obj).parent().siblings().is(":hidden")) {
		$(obj).parent().parent().animate({"width": "300px"});
		$(obj).parent().siblings().fadeIn();
		$(obj).removeClass("fa-navicon").addClass("fa-close");
	} else {
		$(obj).parent().parent().animate({"width": "40px"});
		$(obj).parent().siblings().hide();
		$(obj).removeClass("fa-close").addClass("fa-navicon");
	}
}
//工具流面板关闭展开
function closemenu() {
	if ($(".m-icon .u-close i").attr("class") == "fa fa-close") {
		$(".m-icon .u-close i").removeClass("fa-close").addClass("fa-navicon");
		$(".u-menu .parent").fadeOut(200);
		$(".u-menu .child li").css("padding", "7px").find("span").fadeOut(200);
		$(".m-icon").animate({"width": "40px"});
	} else {
		$(".m-icon .u-close i").removeClass("fa-navicon").addClass("fa-close");
		$(".u-menu .parent,.u-menu .child span").fadeIn();
		$(".u-menu .child li").css("padding", "7px 20px 7px 40px").find("span")
		$(".m-icon").animate({"width": "300px"});
	}
}
//**********基本操作***********end*************


function Designer() {
	this.selectedNode;
	this.toolbar = new ToolBar(this);
	this.workflowpanel = new WorkflowPanel(this);
	this.designpanel = new DesignerPanel(this,$(".design"));
	this.propertypanel = new PropertyPanel(this);

}
//**********工具面板*********start*************
function ToolBar() {
	this.buttons = [{
		fonticon: "save",
		tip: "save"
	}, {
		fonticon: "trash",
		tip: "delete"
	}, {
		fonticon: "search-plus",
		tip: "zoomout"
	}, {
		fonticon: "search-minus",
		tip: "zoomin"
	}];
	//初始化
	this.init = function(selector) {
		$.each(this.buttons, function() {
			var item = $("<i>").addClass("fa").addClass("fa-" + this.fonticon).attr("title", this.tip);
			if (this.action)
				item.on("click", this.action());
			selector.append(item);
		});
	}
}
//**********工具面板***********end*************
//**********工作流面板*********start***********
function WorkflowPanel(designer) {
	this.designer = designer;
	var self = this;
	this.tree = defaultNode;
	//初始化
	//var selectedNodeType = null,
	this.init = function(selector) {
		$.each(this.tree, function() {//遍历多少种类型
			var parent = $("<div>").addClass("parent").append($("<i>").addClass("fa").addClass('fa-chevron-down'));
			parent.append(this.text);
			var ul = $('<ul class="child"></ul>');
			$.each(this.FlowNode,function(index){//遍历工作流节点
				for(var i=index; i<=index; i++){
					var li =$('<li type="'+this.type+'">\
						<i class="fa fa-'+this.icon+'"></i>\
						<span>'+this.name+'</span>\
						</li>');
					ul.append(li);
					var data = this;
					li.click(function(){
						self.designer.selectedNode = data;
					});
				}
			});
			var tmp = $("<li>").append(parent).append(ul);
			parent.click(function(){
				$(this).siblings().slideToggle();
				$(this).find(".fa").toggleClass('f-rotate')
			});
			selector.append(tmp);
		});
	}
}
//**********工作流面板***********end*************

//**********设计器面板*********start*************
function DesignerPanel(designer,container) {
	this.designer = designer;
    this.container = container;
    this.nodeinstance = [];
    this.offsetY = function(){return this.container[0].getClientRects()[0].top;};
    this.offsetX = function(){return this.container[0].getClientRects()[0].left;};
    var self = this;
    container.on({
    	"click":function(event){
    		if(self.designer.selectedNode)
    		{
    			self.container.find("g").removeClass("selected");
    			self.designer.selectedNode.property = assignee.concat(self.designer.selectedNode.property);//把公共属性添加到属性列表中
    			// var width = self.designer.selectedNode.width;
    			// var height = self.designer.selectedNode.height;
    			var inst = self.designer.selectedNode.inst(event.offsetX, event.offsetY,self.container);
    			self.nodeinstance.push(inst);
    			self.designer.selectedNode= null;
    		}
    	}
	});

};
//**********设计器面板***********end*************

//**********属性面板*********start*************
function PropertyPanel(designer){
}
//**********属性面板***********end*************
var assignee = ["name","id","documentation"]//工作流节点公共属性列表
var defaultNode = [{
		text: "Start/End Events",
		FlowNode: [{
			name: "Start",
			id: "start",
			type: "start",
			icon:"star",
			width: 10,
			height: 10,
			linein: 0,
			lineout: 20,
			caption: "开始",
			property: ["executionListener","initiator","formKey","referencedForm","formProperty"],
			inst: function(x,y,container) {
    			var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    			circle.setAttribute("stroke","#FFAC3F");
    			circle.setAttribute("cx","25");
    			circle.setAttribute("cy","25");
    			circle.setAttribute("r","23");
    			circle.setAttribute("fill-opacity","0");
    			var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    			g.setAttribute("x",x);
    			g.setAttribute("y",y);
    			g.setAttribute("transform",'matrix(1,0,0,1,'+x+','+y+')');
    			g.setAttribute("class","selectable");
	            $(g).append(circle);
	            container.append(g);
				var ret = {
					name:"开始",
					id:"startIns",
					svg:g,
					property:{

					},
					lineInList:[],
					lineOutList:[],
					text:"开始",
					x:event.offsetX,
					y:event.offsetY,
					transform:"1,0,0,1,0,0"
				};
				return ret;
			}
		}, {
			name: "End",
			id: "end",
			type: "end",
			icon:"tasks",
			width: 15,
			height: 15,
			linein: 30,
			lineout: 0,
			caption: "结束",
			property: ["executionListener"],
			inst: function(x,y,container) {
				var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    			circle.setAttribute("stroke","#333");
    			circle.setAttribute("cx","20");
    			circle.setAttribute("cy","20");
    			circle.setAttribute("r","18");
    			circle.setAttribute("fill-opacity","0");
    			var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    			g.setAttribute("x",x);
    			g.setAttribute("y",y);
    			g.setAttribute("transform",'matrix(1,0,0,1,'+x+','+y+')');
    			g.setAttribute("class","selectable");
	            $(g).append(circle);
	            container.append(g);
				var ret = {
					name:"结束",
					id:"startIns",
					svg:g,
					property:{
					},
					lineInList:[],
					lineOutList:[],
					text:"结束",
					x:event.offsetX,
					y:event.offsetY,
					transform:"1,0,0,1,0,0"
				};
				return ret;
			}
		}]
	},{
		text: "Task",
		FlowNode: [{
			name: "Block",
			id: "block",
			type: "task",
			icon:"square",
			width: 240,
			height: 60,
			linein: 20,
			lineout: 20,
			caption: "任务1",
			property: ["asynchronous","exclusive","formKey","referencedForm","formProperty"],
			inst: function(x,y,container) {
				var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    			rect.setAttribute("stroke","#FFAC3F");
    			rect.setAttribute("x","1");
    			rect.setAttribute("y","1");
    			rect.setAttribute("width","240");
    			rect.setAttribute("height","60");
    			rect.setAttribute("rx","8");
    			rect.setAttribute("fill-opacity","0");
    			var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    			g.setAttribute("x",x);
    			g.setAttribute("y",y);
    			g.setAttribute("transform",'matrix(1,0,0,1,'+x+','+y+')');
    			g.setAttribute("class","selectable");
	            $(g).append(rect);
	            container.append(g);
				var ret = {
					name:"任务1",
					id:"startIns",
					svg:g,
					property:{

					},
					lineInList:[],
					lineOutList:[],
					text:"任务1",
					x:event.offsetX,
					y:event.offsetY,
					transform:"1,0,0,1,0,0"
				};
				return ret;
			}
		}, {
			name: "Switch",
			id: "switch",
			type: "task",
			icon:"arrows",
			width: 25,
			height: 25,
			linein: 25,
			lineout: 25,
			caption: "任务2",
			property: ["asynchronous","exclusive","formKey","referencedForm","formProperty"],
			inst: function(x,y,container) {
				var polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    			polygon.setAttribute("stroke","#FFAC3F");
    			polygon.setAttribute("fill-opacity","0");
    			polygon.setAttribute("points","1 31 121 1 241 31 121 61");
    			var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    			g.setAttribute("x",x);
    			g.setAttribute("y",y);
    			g.setAttribute("transform",'matrix(1,0,0,1,'+x+','+y+')');
    			g.setAttribute("class","selectable");
	            $(g).append(polygon);
	            container.append(g);
				var ret = {
					name:"任务2",
					id:"startIns",
					svg:g,
					property:{

					},
					lineInList:[],
					lineOutList:[],
					text:"任务2",
					x:event.offsetX,
					y:event.offsetY,
					transform:"1,0,0,1,0,0"
				};
				return ret;
			}
		}]
	},{
		text: "Gateways",
		FlowNode: [{
			name: "排他网关（Exclusive gateway）",
			id: "ExclusiveGateway",
			type: "gateway",
			icon:"tasks",
			width: 10,
			height: 10,
			linein: 0,
			lineout: 20,
			caption: "排他网关",
			property: [assignee],
			instance: function(x,y) {}
		},{
			name: "并行网关（Parallel gateway）",
			id: "ParallelGateway",
			type: "gateway",
			icon:"tasks",
			width: 10,
			height: 10,
			linein: 0,
			lineout: 20,
			caption: "并行网关",
			property: [assignee],
			instance: function(x,y) {}
		},{
			name: "融合网关（Inclusive gateway）",
			id: "InclusiveGateway",
			type: "gateway",
			icon:"tasks",
			width: 10,
			height: 10,
			linein: 0,
			lineout: 20,
			caption: "融合网关",
			property: [assignee],
			instance: function(x,y) {}
		},{
			name: "事件网关（Event gateway）",
			id: "EventGateway",
			type: "gateway",
			icon:"tasks",
			width: 10,
			height: 10,
			linein: 0,
			lineout: 20,
			caption: "事件网关",
			property: [assignee],
			instance: function(x,y) {}
		}]
	}];
