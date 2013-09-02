/**
*当前页面检索
*author vtejuf@126.com
*@param string 选择器 '#ele, .ele'
*@param func 回调函数，
*			参数为，传入的选择器中，满足条件的元素对象数组
*
$('#input').localPageSearch('.list li',function(ele){
	//ele 为满足条件的.list li对象数组
	$('.list li').removeClass('display-n').not(ele).addClass('display-n');
});
*/
jQuery.fn.localPageSearch=function(ele,callback){
	this.each(function(){
		$(this).on('keyup',function(){
			var new_val = $(this).val();
			var doc=[];
			$(ele).each(function(){
				var reg = new RegExp('[.\\s]*(?:'+new_val+')[.\\s]*','gim');
				reg.test($(this).text()) && doc.push(this);
			});
			callback(doc);
		});
	});
}