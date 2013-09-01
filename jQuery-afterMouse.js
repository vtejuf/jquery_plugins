/**
*元素跟随鼠标移动
*author vtejuf@126.com
*@param object 参数有三种形式
*			1、鼠标事件对象event，直接传入event，移动时保持元素激活时与鼠标的位置关系
*			2、位置对象{left:100,top:200}，移动时鼠标与元素边界始终保持left:100,top:200的距离
*			3、结束元素跟随，传入{end:true}

$('.ele').on('mousedown',function(event){
	$(this).afterMouse(event);
});
$('.ele').on('mouseup',function(e){
	$(this).afterMouse({end:true});
});
*/

jQuery.fn.afterMouse = function(event){
	this.each(function(){
		var _self = $(this);
		var pos = _self.offset();
		if(event.end){
			_self.offset(pos);
			$(document).off('mousemove');
			return false;
		}
		var mpos = event.hasOwnProperty('target')?
		{left:event.clientX-pos.left,top:event.clientY-pos.top}:
		mpos = event;
		$(document).on('mousemove',function(e){
			_self.offset({ top: e.clientY-mpos.top, left: e.clientX-mpos.left });
		});
	});
}