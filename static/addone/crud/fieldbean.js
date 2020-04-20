/**
 * 自定字段用JS
 */
function FieldBean(opt)
{
	this.opt = opt;
	
	this.filter = field_filter;
	this.init = field_init;
}

function field_filter(val)
{
	if(this.opt.param!=null&&((this.opt.type&0x8000)>0||(this.opt.type&0x4000)>0))
	{
		var param = eval("("+this.opt.param+")");
		if(param.data){
			return eval("("+param.data+")")[val[this.opt.name]];
		}
	}
	if(val[this.opt.name]==undefined){
		return "";
	}
	return val[this.opt.name];
}

function field_init()
{
	var data = this.opt.ajax;
}
