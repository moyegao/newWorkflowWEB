var menu;
$(function() {
	window.dialog = dialog;
	commitData(ctx+"/cache/menu.js",{},{success:function(data){
		menu = data;
		var toolbar = $("#topmenu");
		$.each(menu, function(key, value) {
			var html="<li" 
				if(key == 0 ){ html+=" class=\"on\"" }
			html+="><a href="+ctx+value.url+">"+value.caption+"</a></li>";
			toolbar.append(html);
		})
		
		$("#topmenu li").bind('click', function(event) {
			$("#topmenu li").removeClass("on");
			$(this).addClass("on");
		});
		window.frames['desktop'].location.href=ctx+menu[0].url;
	}
	});
});
