/*
*保持元素在顶部或者最左侧
*作者 尹昱 vtejuf@126.com
*
*	option		参数是一个对象 {[top:140,][left:100]} 值至少为1
*				包含一个必选项，一个可选项 top,left 
*				至少写一个，对应方向固定，两个都写，则两个方向满足一个就固定
*
*	jQuery('#tables').keepTop({top:1}); //顶部固定
*/


$.fn.keepTop = function(option){
	option= option || {top:0};

	this.each(function(){
		var _self = $(this);
		option.leftmove = option.left && option.left!=='' ?true:false;
		option.topmove = option.top && option.top!=='' ?true:false;

		$(window).scroll(function(){
			
			var scrtop = $('html').scrollTop();
			var scrleft = $('html').scrollLeft();
			option.pos = (option.topmove && !option.leftmove)?'top':(option.leftmove && !option.topmove)?'left':'both';

			if(option.pos === 'both'){
				(scrtop > option.top) && (scrleft > option.left)?
					function(){
					var state = _self.css('position');
					!!state?
						function(){
						_self.offset({top:scrtop,left:scrleft});
					}():
						function(){
						_self.css({'position':'absolute'});
					}();
				}():
					function(){
						_self.css({'position':'static',top:'',left:''});
				}();
			}else if(option.pos === 'top'){
				scrtop > option.top?
					function(){
					var state = _self.css('position');
					!!state?
						function(){
						_self.offset({top:scrtop});
					}():
						function(){
						_self.css({'position':'absolute'});
					}();
				}():
					function(){
						_self.css({'position':'static',top:''});
				}();
			}else if(option.pos === 'left'){
				scrleft > option.left?
					function(){
					var state = _self.css('position');
					!!state?
						function(){
						_self.offset({left:scrleft});
					}():
						function(){
						_self.css({'position':'absolute'});
					}();
				}():
					function(){
						_self.css({'position':'static',left:''});
				}();
			}
		});
	});
}