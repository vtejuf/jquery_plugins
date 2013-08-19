/*
*验证表单
*作者 尹昱 vtejuf@126.com
*
*@param json 表单验证规则 verifyList = {name:'\\w'}
*			 名为data-verify里填的项；
*			 值为正则表达式，\需要转义；
*			 required是默认的不需要设置
*@param func 回调函数 参数是返回的对象
*			 名为表单name；值1为成功，0为失败；
*
*<form id='guest-form'>
*<input data-verify='required' type="text" name='title'/>
*...
*$('#guest-form').formVerify(function(data){console.log(data);});
*
*<input data-verify='required|notnumber' type="text" name='title'/>
*...
*$('#guest-form').formVerify({word:'\\w',number:'\\d',notnumber:'[^0-9]'},function(data){console.log(data);});
*
*/
$.fn.formVerify = function(verifyList,callback){
	if(typeof verifyList === 'function'){
		callback = verifyList;
		verifyList = {};
	}
	verifyList = $.extend({},verifyList);

	function _verifyTest(value,verify){
		var i=0,l=verify.length,reg;
		if(l===0){
			return true;
		}
		for(;i<l;i++){
			if(verify[i]==='required'){
				if(value==='' || value==='undefined'){
					return false;
				}else{
					continue;
				}
			}
			if(value==='' || value==='undefined'){
				return true;
			}
			reg = new RegExp(verifyList[verify[i]]);
			if(!reg.test(value)){
				return false
			};
		}
		return true;
	}

	$(this).each(function(){
		var child,i=0,l,name,value,item,verify,back={};
		child = $(this).serializeArray();
		l=child.length;
		for(;i<l;i++){
			name = child[i].name;
			value = child[i].value;
			item = $(this).children('[name="'+name+'"]');
			verify = item.attr('data-verify')?item.attr('data-verify').split('|'):[];
			back[name] = _verifyTest(value,verify);
		}
		callback(back);
	});
}
