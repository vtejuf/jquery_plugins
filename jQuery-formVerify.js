/*
*验证表单
*author vtejuf@126.com
*
*@param json 表单验证规则 verifyList = {name:'\\w'}
*			 名为data-verify里填的项；
*			 值为正则表达式，\需要转义；
*			 required是默认的不需要设置
*@param func 回调函数 参数是返回的对象
*			 名为表单name；值1为成功，0为失败；
*
*@@@可以验证整个表单或表单项@@@
*
*html -> data-verify='required|someRegexp|like-pwd'
*	required 必填字段，不要验证规则
*	like-some 与some项的值比较，相同返回true,否则为false
*	// <input name='pwcheck' data-verify='like-pw'/>
*	// 确认密码与密码比较
*<form id='guest-form'>
*<input data-verify='required' type="text" name='title'/>
*...
*$('#guest-form').formVerify(function(data){console.log(data);});
*
*<input data-verify='required|notnumber|like-pwd' type="text" name='title'/>
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
	var _callee=arguments.callee;
	var _self = $(this);
	var _tagName = _self.attr('tagName');

	function _verifyTest(value,verify){
		var i=0,l=verify.length,reg,inner,ret;
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
			if(verify[i].indexOf('-')>0){
				inner = verify[i].split('-');
				(function(){
					ret = eval('_'+inner[0])(value,inner[1]);
				})();
				if(!ret){return false};
			}
			reg = new RegExp(verifyList[verify[i]]);
			if(!reg.test(value)){
				return false
			};
		}
		return true;
	}

	function _like(me,tarname){
		if(_tagName==='form'){
			return me===$(_self.children('input[name="'+tarname+'"]')).val()?true:false;
		}else{
			return me===$(_self.closest('form').children('input[name="'+tarname+'"]')).val()?true:false;
		}
	}

	$(this).each(function(){
		var child,i=0,l,name,value,item,verify,back={},state;
		if(_tagName==='form'){
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
		}else{
			value = _self.val();
			verify = _self.attr('data-verify')?_self.attr('data-verify').split('|'):[];
			state = _verifyTest(value,verify);
			callback(state);
		}
	});
}
