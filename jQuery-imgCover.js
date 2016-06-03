
/**
*图片遮盖层
*作者 尹昱 vtejuf@126.com
*	this	 要遮盖的图片
*	option  对象，包括以下必填项
*			{parent:"#imgBox"			// 遮盖层的父元素选择器字符串 .class #id  默认 body
*			,css:"img-outer"			// 遮盖层的外部样式css 多个样式空格隔开 "css1 css2 css3"  默认空字符串
*			,style: "height: 50px;"}	// 遮盖层的行及样式  默认空字符串
*
*	jQuery('#image').imgCover({parent:".conver",style:"width:300px;height:300px;",css:"good"});
*/

jQuery.fn.imgCover=function(option){
	var defaults= {"parent":"body","css":"","style":""};
	option= option || {};
	jQuery(option).extend(defaults,option);

	this.each(function(){
		jQuery(this).on('mousedown',function(event){
			var e= event.which;
			if(e!=1){
				// ie 直接屏蔽右键
				if(jQuery.browser.msie){
					document.oncontextmenu=function(){
					return false;
					}
				}else{
					jQuery(option.parent).css({"position":"relative"}).append('<div class="imghover '+option.css+'" style="position: absolute;z-index: 9999;'+option.style+'"></div>');
				}
			}
			jQuery(document).on('mousedown',function(event){
				var e= event.which;
				if(e!=3){
					jQuery('.imghover').remove();
				}
			});
		});
	});

	return this;
}
