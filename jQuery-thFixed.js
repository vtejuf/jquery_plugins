/**
*让表格的th栏 固定顶部，不随表格上下拖动移动，需要在表格加载以后调用
*作者 尹昱 vtejuf@126.com
*
*	this	表格本身或 包含一个表格的其他元素
*	option		参数是一个对象，默认属性 {height:1.5em}
*				修改以后需要 修改内部程序，
*				样式在外部自定义
*	jQuery('#tables').thFixed(option);
*/

jQuery.fn.thFixed= function(option){
	var defaults= {"height":"1.5em"};
	option= option || {};
	jQuery(option).extend(defaults,option);

	this.each(function(){
		var tr=jQuery(this).find('tr'),
			th= tr[0],
			trh= jQuery(th).children('th'),
			width= [];

	//表格加载以后，把每个th的宽度找出来
		for(var i=0;i<trh.length;i++){
			var w= jQuery(trh[i]).width();
			jQuery(trh[i]).attr('width',w);
			width.push(w);
		}

	//在th后，添加一个空tr，填补th 在absolute，以后出现的遮盖
		jQuery(th).css({"position":"absolute"}).after('<tr style="height:'+option.height+'"></tr>');

	//给每一个td 添加对应width ，当表格th 脱离流以后，td的宽度如果为空，则变为自动，所以要给每一个td 加width
		for(var j=1,l=tr.length;j<l;j++){
			var tds= jQuery(tr[j]).children('td');
			for(var z=0,zl=tds.length;z<zl;z++){
				jQuery(tds[z]).attr('width',width[z]);
			}
		}
	});

	return this;
};