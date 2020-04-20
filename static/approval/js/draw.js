var isMac = function() { return /macintosh|mac os x/i.test(navigator.userAgent); }(); /** * 是否为windows系统 * */
var isWindows = function() { return /windows|win32/i.test(navigator.userAgent); }();
var _nodeTypeId = {};


//====================画布
function canvas(container) {
    this.container = container;
    this.drag = false;
    this.startPos = [];
    this.lastPos = [];
    this.data = {}
    this.listenerLine = {};
    this.offset = {};
    this.selectedNodeType = null; //选择的节点类型（开始，处理，分支，结束）
    this.selectedNode = []; //选择节点顺序的数组
    this.selectedLine = null;//选择的线条
    this.svgNS = "http://www.w3.org/2000/svg";
    this.xlinkNS = "http://www.w3.org/1999/xlink";

    this.offsetY = function(){return this.container[0].getClientRects()[0].top;};
    this.offsetX = function(){return this.container[0].getClientRects()[0].left;};

    var self = this;
    
    container.find(".selectable").click(function(event) {
        return self.clickNode(this, event);
    });

    container.on({
        SVGScroll:function(event){
           
        },
        keyup:function(event) {
            self.container.find(".selected").each(function(event) {
                if (event.keyCode==46) {
                    alert("keyup")
                    removeNode();
                }
            });
        },
        click: function(event) {
            if (self.selectedNodeType) {
                self.addNode(self.selectedNodeType, event.offsetX, event.offsetY);
                //self.selectedNodeType=null;
            }
        },
        mousedown: function(event) {
            self.drag = true;
            self.startPos = [event.offsetX, event.offsetY];
            self.lastPos = [event.offsetX, event.offsetY];
        },
        mouseup: function() {
            self.drag = false;
            self.startPos = null;
        },
        mouseout: function() {
            self.drag = false;
            self.startPos = null;
        },
        mouseenter: function() {
            self.drag = false;
            self.startPos = null;
        },
        mousemove: function(event) {
            if (self.drag) {
                var offset = [event.offsetX - self.lastPos[0], event.offsetY - self.lastPos[1]];
                var lines = new Array();
                self.container.find(".selected").each(function() {
                    this.setAttribute("x", parseInt(this.getAttribute("x")) + offset[0]);
                    this.setAttribute("y", parseInt(this.getAttribute("y")) + offset[1]);

                    var rect = this.getBoundingClientRect();
                    rect.x -= self.offsetX();
                    rect.y -= self.offsetY();
                    rect = new group().get(this);
                    container.find("#" + this.getAttribute("id") + "l").attr("d", "M" + rect.left().point() + " L" + rect.right().point());
                    if (self.listenerLine[this.id]) { //计算相关连的线
                        lines = lines.concat(self.listenerLine[this.id]);
                    }

                });
                $.each(lines, function() { self.draw(self.container.find("#" + this)[0]); });
                self.lastPos = [event.offsetX, event.offsetY];
            }
        }
    });
};
canvas.prototype.getId = function(nodeType) {
    if (!_nodeTypeId[nodeType]) _nodeTypeId[nodeType] = 0;
    while (this.container.find("#" + nodeType + _nodeTypeId[nodeType]).length > 0) { //如果节点存在加1
        _nodeTypeId[nodeType]++;
    }
    return nodeType + (_nodeTypeId[nodeType]++);
};
//刷新线和块的关系
canvas.prototype.refreshLineListener = function() {
    this.listenerLine = {};
    var listenerLine = this.listenerLine;
    $.each(this.data, function(key, value) {
        if (!listenerLine[value.start])
            listenerLine[value.start] = new Array();
        listenerLine[value.start].push(key);

        if (!listenerLine[value.end])
            listenerLine[value.end] = new Array();
        listenerLine[value.end].push(key);

    });
};

//删除节点
canvas.prototype.removeNode = function(node) {
    if(node.tagName == "path"){//移除线
        var nodeId = node.getAttribute("id");
        if(this.selectedLine == node) this.selectedLine = null;
        $(node).remove();
        $(this.container).find("#"+nodeId+"t").remove();
        delete this.data[nodeId];
    }else{//移除方块节点
        var nodeId = node.getAttribute("id");
        var lines = this.listenerLine[nodeId];
        if(lines != null && lines.length > 0)
            for (var i = 0; i < lines.length; i++) {
                this.removeNode(this.container.find("#"+lines[i])[0]);
            }
        $(node).remove();
        $(this.container).find("#"+nodeId+"t").remove();
        $(this.container).find("#"+nodeId+"l").remove();
        for (var i = 0; i < this.selectedNode.length; i++) {
            if(this.selectedNode[i] == node)
            {
                this.selectedNode.splice(i,1);
                break;
            }
        }
    };
    this.refreshLineListener();
}
//添加节点
canvas.prototype.addNode = function(nodeType, x, y) {
    var node = null;
    var nodeId = null;
    var exit = false;
    if(nodeType == "start")//只能有一个开始节点
    {
        this.container.find("use").each(function(){
            if(this.getAttribute("xlink:href") == "#start")
            {
                exit = true;
                return false;
            }
        });
    }
    if(exit == true) return;
    switch (nodeType) {
        case "switch":
        case "block":
        case "start":
        case "end":
            nodeId = this.getId(nodeType);
            node = document.createElementNS(this.svgNS, "use");
            node.setAttribute("x", x);
            node.setAttribute("y", y);
            node.classList.add("selectable");
            node.setAttribute("id", nodeId);
            node.setAttributeNS(this.xlinkNS, "xlink:href", "#" + nodeType);
            break;

    };
    var self = this;
    if (node != null) {
        this.container.append($(node).click(function(event) { return self.clickNode(this, event); }));
        if (nodeType == "switch" || nodeType == "block") { //加上文字线及文字
            var line = document.createElementNS(this.svgNS, "path");
            line.setAttribute("stroke-width", "1");
            line.setAttribute("fill", "none");
            line.classList.add("line");
            line.setAttribute("id", nodeId + "l");

            var g = node.getBoundingClientRect();
            g.x -= this.offsetX();
            g.y -= this.offsetY();
            g = new group().get(node);

            line.setAttribute("d", "M" + g.left().point() + " L" + g.right().point());
            
            this.container.append(line);
            var txt = document.createElementNS(this.svgNS, "text");
            txt.classList.add("blocktxt");
            var txtPath = document.createElementNS(this.svgNS, "textPath");
            txtPath.setAttribute("text-anchor", "middle");
            txtPath.setAttribute("baseline-shift", "-4");
            txtPath.setAttribute("startOffset", "50%");
            txtPath.setAttribute("id", nodeId + "t");
            txtPath.setAttributeNS(this.xlinkNS, "xlink:href", "#" + nodeId + "l");
            txtPath.textContent = "点击输入节点名称";
            txt.appendChild(txtPath);
            this.container.append(txt);
            $(txtPath).click(function(event) { return false; });
        }
    }
};
//在选择的元素间连线
canvas.prototype.addLine = function() {
    var selectedNode = this.selectedNode;
    if (!selectedNode || selectedNode.length < 2) return;
    var source = selectedNode[0].getAttribute("id");
    var loop = selectedNode.length;
    var self = this;
    if (selectedNode[0].getAttribute("xlink:href") == "#end") return; //结束节点不能开头
    if (selectedNode[0].getAttribute("xlink:href") == "#start" || selectedNode[0].getAttribute("xlink:href") == "#block") { //节点为开始和方块，只能有一个连出来
        $.each(this.data,function(key,value){
            if(value.start == source){
                loop = null;
                return false;
            }
        });
        if(loop == null) return;
        loop = 2;
    }

    for (var i = 1; i < loop; i++) {
        if(selectedNode[i].getAttribute("xlink:href")=="#start") return;
        var lineAttr = { start: source };
        var node = document.createElementNS(this.svgNS, "path");
        node.setAttribute("stroke-width", "1");
        node.setAttribute("stroke", "#979797");
        node.setAttribute("fill", "none");
        node.classList.add("line");
        node.setAttribute("id", source + selectedNode[i].getAttribute("id"));
        this.container.append(node);
        lineAttr.end = selectedNode[i].getAttribute("id");
        this.data[node.getAttribute("id")] = lineAttr;
        this.refreshLineListener();
        this.draw(node);
        $(node).click(function(){if(self.selectedLine != null)self.selectedLine.classList.remove("selected");self.selectedLine = this;this.classList.add("selected");});
        //线条上的文字
        var txt = document.createElementNS(this.svgNS, "text");
            txt.classList.add("blocktxt");
            var txtPath = document.createElementNS(this.svgNS, "textPath");
            txtPath.setAttribute("text-anchor", "middle");
            txtPath.setAttribute("baseline-shift", "14");
            txtPath.setAttribute("startOffset", "50%");
            txtPath.setAttribute("id", source + selectedNode[i].getAttribute("id") + "t");
            txtPath.setAttributeNS(this.xlinkNS, "xlink:href", "#" + source + selectedNode[i].getAttribute("id"));
            txtPath.textContent = "";
            txt.appendChild(txtPath);
            this.container.append(txt);
    }
};

//设置线条或方块的文字
canvas.prototype.setText=function(node,txt)
{
    if(!node) return;
    var tmp = this.container.find("#"+node.getAttribute("id")+"t");
    if(tmp.length > 0)
    {
        if(typeof(txt) === "string")
            tmp[0].textContent=txt;
        else
        {
            tmp[0].textContent=txt.txt;
        }
    }
}
//点击选择块
canvas.prototype.clickNode = function(node, event) {
    if ((isMac && !event.metaKey) || (isWindows && !event.ctrlKey)) {
        $.each(this.selectedNode, function(index, item) { item.classList.remove("selected"); });
        this.selectedNode.splice(0, this.selectedNode.length);
    }
    node.classList.add("selected");
    this.selectedNode.push(node);
    return false;
};

//重画线条
canvas.prototype.draw = function(line) {
    var attr = this.data[line.id];
    var start = this.container.find("#" + attr.start)[0];
    var end = this.container.find("#" + attr.end)[0];

    var rect = start.getBoundingClientRect();
    rect.x -= this.offsetX();
    rect.y -= this.offsetY();
    start = new group().get(start);

    rect = end.getBoundingClientRect();
    rect.x -= this.offsetX();
    rect.y -= this.offsetY();
    end = new group().get(end);

    var d = start.drawg(end);
    line.setAttribute("d", d);
};
//=================方形类
function group(x, y, width, height) {
    this.x = Number(x);
    this.y = Number(y);
    this.width = Number(width);
    this.height = Number(height);
}

group.prototype.right = function() { return new group(this.x + this.width, this.y + this.height / 2, 0, 0); };
group.prototype.left = function() { return new group(this.x, this.y + this.height / 2, 0, 0); };
group.prototype.top = function() { return new group(this.x + this.width / 2, this.y, 0, 0); };
group.prototype.bottom = function() { return new group(this.x + this.width / 2, this.y + this.height, 0, 0); };
group.prototype.point = function() { return this.x + " " + this.y };
group.prototype.pointMatrix = function(matrix){return (matrix.a*this.x+matrix.c*this.y+matrix.e) + " " + (matrix.b * this.x + matrix.d * this.y +matrix.f);};
//构造
group.prototype.getx = function(item) { 
    return new group(item.x || item.left, item.y || item.top, item.width, item.height); 
};
group.prototype.get = function(node) {
    var x = node.getAttribute("x"); 
    var y = node.getAttribute("y");
    var rect = node.getBBox();
    var width = rect.width;
    var height = rect.height;
    return new group(x,y,width,height);
}
group.prototype.degree = function(g2) { var dx = g2.x - this.x; var dy = g2.y - this.y; return Math.atan2(dy, dx); };
//判断两点的关系
group.prototype.relative = function(g2) {
    var c = "";
    if (this.x > g2.x) c = "right";
    else if (g2.x > this.x) c = "left";
    if (this.y > g2.y) c += "bottom";
    else if (g2.y > this.y) c += "top";
    return c;
}
group.prototype.distance = function(g2) { return Math.abs(this.x - g2.x) + Math.abs(this.y - g2.y) };
//获取从单前点到g2连线画箭头的两个点
group.prototype.arrowPoint = function(g2) {
    var arr = new Array();
    if (this.x == g2.x) {
        if (this.y > g2.y) {
            arr.push(new group(g2.x + 10, g2.y + 10));
            arr.push(new group(g2.x - 10, g2.y + 10));
        } else {
            arr.push(new group(g2.x + 10, g2.y - 10));
            arr.push(new group(g2.x - 10, g2.y - 10));
        }
    } else if (this.y == g2.y) {
        if (this.x > g2.x) {
            arr.push(new group(g2.x + 10, g2.y - 10));
            arr.push(new group(g2.x + 10, g2.y + 10));
        } else {
            arr.push(new group(g2.x - 10, g2.y + 10));
            arr.push(new group(g2.x - 10, g2.y - 10));
        }
    }
    return arr;;
};
//设置线的连接
group.prototype.drawg = function(g2) {
    var d;
    //开始判断直联
    if (this.left().y == g2.right().y && this.left().x > g2.right().x) {
        var arrow = this.left().arrowPoint(g2.right());
        return "M" + this.left().point() + " L" + g2.right().point() + " L" + arrow[0].point() + " M" + g2.right().point() + " L" + arrow[1].point();
    } else if (this.right().y == g2.left().y && this.right().x < g2.left().x) {
        var arrow = this.right().arrowPoint(g2.left());
        return "M" + this.right().point() + " L" + g2.left().point() + " L" + arrow[0].point() + " M" + g2.left().point() + " L" + arrow[1].point();
    } else if (this.top().x == g2.bottom().x && this.top().y > g2.bottom().y) {
        var arrow = this.top().arrowPoint(g2.bottom());
        return "M" + this.top().point() + " L" + g2.bottom().point() + " L" + arrow[0].point() + " M" + g2.bottom().point() + " L" + arrow[1].point();
    } else if (this.bottom().x == g2.top().x && this.bottom().y < g2.top().y) {
        var arrow = this.bottom().arrowPoint(g2.top());
        return "M" + this.bottom().point() + " L" + g2.top().point() + " L" + arrow[0].point() + " M" + g2.top().point() + " L" + arrow[1].point();
    }

    // + arrow[0].point() + " M" + arr[2] + " L" + arrow[1].point()
    //转角，只有一个九十度
    var dir = new direction();
    var i = 0;
    var distance = null;
    do {
        i++;
        if (dir.isDir(this[dir.direction](), g2[dir.next().direction]()) && dir.next().isDir(g2[dir.next().direction](), this[dir.direction]())) {
            var tmpDistance = this[dir.direction]().distance(g2[dir.next().direction]());
            if (!distance || distance > tmpDistance) {
                d = dir.drawRightAngle(this[dir.direction](), g2[dir.next().direction]());
                distance = tmpDistance;
            }
        } else if (dir.isDir(this[dir.direction](), g2[dir.previous().direction]()) && dir.previous().isDir(g2[dir.previous().direction](), this[dir.direction]())) {
            var tmpDistance = this[dir.direction]().distance(g2[dir.previous().direction]());
            if (!distance || distance > tmpDistance) {
                d = dir.drawRightAngle(this[dir.direction](), g2[dir.previous().direction]());
                distance = tmpDistance;
            }
        }
        dir = dir.next();
    } while (i < 4);
    if (distance)
        return d;

    i = 0;
    do { //两转角
        var source = this[dir.direction]();
        var target = g2[dir.direction]();
        if (dir.next().isDir(source, target) || dir.previous().isDir(source, target)) { //同向
            var tmpDistance = source.distance(target);
            if (!distance || distance > tmpDistance) {
                d = dir.draw180Line(source, target);
                distance = tmpDistance;
            }
        }
        target = g2[dir.opposite().direction]();
        if (dir.isDir(source, target)) //反向
            var tmpDistance = source.distance(target);
        if (!distance || distance > tmpDistance) {
            d = dir.draw0Line(source, target);
            distance = tmpDistance;
        }
        i++;
        dir = dir.next();
    } while (i < 4);

    if (distance)
        return d;

    return "M" + this.right().point() + " L" + g2.top().point();
};

//==========方向类===
function direction(direction) {
    this.direction = direction || "right";
}
direction.prototype.previous = function() {
    switch (this.direction) {
        case "right":
            return new direction("top");
        case "top":
            return new direction("left");
        case "left":
            return new direction("bottom");
        case "bottom":
            return new direction("right");
    }
};
direction.prototype.next = function() {
    switch (this.direction) {
        case "right":
            return new direction("bottom");
        case "top":
            return new direction("right");
        case "left":
            return new direction("top");
        case "bottom":
            return new direction("left");
    }
};
direction.prototype.opposite = function() {
    switch (this.direction) {
        case "right":
            return new direction("left");
        case "top":
            return new direction("bottom");
        case "left":
            return new direction("right");
        case "bottom":
            return new direction("top");
    }
};

direction.prototype.isDir = function(p1, p2) {
    switch (this.direction) {
        case "right":
            return p2.x > p1.x;
        case "top":
            return p2.y < p1.y;
        case "left":
            return p2.x < p1.x;
        case "bottom":
            return p2.y > p1.y;
    }
};
/**连接两点，转角一次角
 */
direction.prototype.drawRightAngle = function(p1, p2) {
    var arr = new Array();
    var token;
    arr.push(p1.point());
    switch (this.direction) {
        case "right":
            token = new group(p2.x, p1.y);
            break;
        case "top":
            token = new group(p1.x, p2.y);
            break;
        case "left":
            token = new group(p2.x, p1.y);
            break;
        case "bottom":
            token = new group(p1.x, p2.y);
            break;
    }
    arr.push(token.point());
    arr.push(p2.point());
    var arrow = token.arrowPoint(p2);
    return "M" + arr[0] + " L" + arr[1] + " L" + arr[2] + " L" + arrow[0].point() + " M" + arr[2] + " L" + arrow[1].point();
};
/**连接两点，转角两次角，180度
 *─────┐
 *     │
 *     │
 *─────┘
 */
direction.prototype.draw180Line = function(p1, p2) {
    var arr = new Array();
    var token;
    arr.push(p1.point());
    switch (this.direction) {
        case "right":
            token = new group(Math.max(p2.x, p1.x) + 10, p1.y);
            break;
        case "top":
            token = new group(p1.x, Math.min(p2.y, p1.y) - 10);
            break;
        case "left":
            token = new group(Math.min(p2.x, p1.x) - 10, p1.y);
            break;
        case "bottom":
            token = new group(p1.x, Math.max(p2.y, p1.y) + 10);
            break;
    }
    arr.push(token.point());
    switch (this.direction) {
        case "left":
        case "right":
            token = new group(token.x, p2.y);
            break;
        case "bottom":
        case "top":
            token = new group(p2.x, token.y);
            break;
    }
    arr.push(token.point());
    arr.push(p2.point());

    var arrow = token.arrowPoint(p2);

    return "M" + arr[0] + " L" + arr[1] + " L" + arr[2] + " L" + arr[3] + " L" + arrow[0].point() + " M" + arr[3] + " L" + arrow[1].point();
};
/**连接两点，转角两次角，方向不变度
 *─────┐
 *     │
 *     │
 *     └───────
 */
direction.prototype.draw0Line = function(p1, p2) {
    var arr = new Array();
    var token;
    arr.push(p1.point());
    switch (this.direction) {
        case "left":
        case "right":
            token = new group((p2.x + p1.x) / 2, p1.y);
            break;
        case "top":
        case "bottom":
            token = new group(p1.x, (p2.y + p1.y) / 2);
            break;
    }
    arr.push(token.point());
    switch (this.direction) {
        case "left":
        case "right":
            token = new group(token.x, p2.y);
            break;
        case "bottom":
        case "top":
            token = new group(p2.x, token.y);
            break;
    }
    arr.push(token.point());
    arr.push(p2.point());
    var arrow = token.arrowPoint(p2);
    return "M" + arr[0] + " L" + arr[1] + " L" + arr[2] + " L" + arr[3] + " L" + arrow[0].point() + " M" + arr[3] + " L" + arrow[1].point();
};