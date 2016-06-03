jquery_plugins
==============

<h3>jQuery-eleMid</h3> //浮动元素位置控制，默认居中、[鼠标位置、指定位置]
<pre>
/*元素居中
*
*   $(ele).eleMid([option]) 默认left、top居中 // css -- > left:居中;top:居中
*  参数option				json格式 //{"left":"333px",top:"30px"} css -- > left:333px;top:30px
*	option属性 right		单独指定 right 则改为 right 定位，bottom 同理 // {"right":"50px"} css -- > right:50px;top:居中
*	option属性 right left	同时指定 left、right 则元素宽度扩大为 left到right，bottom、top同理
*	option属性 add			{"add":true,"left":100} 在居中位置上加left 100 ，top同理；指定 right、bottom 则在居中位置上向右、下扩展
*	option属性 mouse		指定窗口的跟随鼠标位置，{mouse:event} 值为事件对象
*/

jQuery(ele).eleMid(
	[{"left":"333px",top:"30px"}]
	[{"right":"50px"}]
	[{"left":"100px",right:"300px"}]
	[{"add":true,"left":100}]
	[{mouse:event}]
);
</pre>
<hr>
<h3>jQuery-imgCover</h3> //右键单击后遮盖指定图片
<pre>
/*
*	this	 要遮盖的图片
*	option  对象，包括以下必填项
*			{parent:"#imgBox"			// 遮盖层的父元素选择器字符串 .class #id  默认 body
*			,css:"img-outer"			// 遮盖层的外部样式css 多个样式空格隔开 "css1 css2 css3"  默认空字符串
*			,style: "height: 50px;"}	// 遮盖层的行及样式  默认空字符串
*
*	jQuery(ele).imgCover({parent:".conver",style:"width:300px;height:300px;",css:"good"});
*/

jQuery(ele).imgCover({parent:".conver",style:"width:300px;height:300px;",css:"good"});
</pre>
<hr>
<h3>jQuery-keepTop</h3> //固定浮动元素位置
<pre>
/*
*	保持元素在顶部或者最左侧
*
*	option		参数是一个对象 {[top:140,][left:100]} 值至少为1
*				包含一个必选项，一个可选项 top,left 
*				至少写一个，对应方向固定，两个都写，则两个方向满足一个就固定
*
*	jQuery(ele).keepTop({top:1}); //顶部固定
*/

jQuery(ele).keepTop({top:1});
</pre>
<hr>
<h3>jQuery-thFixed</h3> //table th元素表格顶部固定，不随表格上下滚动
<pre>
/*
*	让表格的th栏 固定顶部，不随表格上下拖动移动，需要在表格加载以后调用
*
*	this	表格本身或 包含一个表格的其他元素
*	option		参数是一个对象，默认属性 {height:1.5em}
*				修改以后需要 修改内部程序，
*				样式在外部自定义
*	jQuery(ele).thFixed(option);
*/

jQuery(ele).thFixed(option);
</pre>
<hr>
<h3>jQuery-yyslider</h3> //幻灯片
<pre>
/*
* 幻灯效果，淡入淡出 css3-transform
* 
* 默认 imganimate:'fade',btnstyle:1,imgspeed:3000,imgname:''
jQuery('#div').yySlider({
	imgsrc:['4.jpg','5.jpg','6.jpg','7.jpg'],//图片地址，一张以上
	imglink:['1.html','2.html'],//图片跳转链接
	imgname:['a','b','c','d'],//图片名字，alt属性
	imganimate:'slide',//动画效果，fade||slide  fade淡入淡出，slide默认为css3 transform动画效果，如果不支持则为fade
	exspeed:1000,//图片切换时间
	imgspeed:2000,//图片停留时间
	btnstyle:1,//按钮样式 如果是数字，从数字开始；如果是0，没有数字 // 值为1，显示1,2,3,……; 值为0 显示空按钮
	btnOnCss:'btnOnCss'//当前按钮样式，css名称，默认'btnOnCss'
});
*/

jQuery('#div').yySlider({
	imgsrc:['4.jpg','5.jpg','6.jpg','7.jpg'],//图片地址，一张以上
	imglink:['1.html','2.html'],//图片跳转链接
	imgname:['a','b','c','d'],//图片名字，alt属性
	imganimate:'slide',//动画效果，fade||slide  fade淡入淡出，slide默认为css3 transform动画效果，如果不支持则为fade
	exspeed:1000,//图片切换时间
	imgspeed:2000,//图片停留时间
	btnstyle:1,//按钮样式 如果是数字，从数字开始；如果是0，没有数字 // 值为1，显示1,2,3,……; 值为0 显示空按钮
	btnOnCss:'btnOnCss'//当前按钮样式，css名称，默认'btnOnCss'
});
</pre>
<hr>
<h3>jQuery-fluor</h3> //瀑布流
<pre>
/**
*瀑布流 fluor
*
*@param str jquery选择器 监听的对象，距离顶部小于一屏触发
*@param json {times,url,type,dataType,data,callback}
*			times 运行的次数 times=3 运行3次后停止，0持续运行
*			callback 回调函数，成功或失败都执行此函数
*			其他参数参考jquery.ajax
*@param func 在发送前执行的函数
*			参数是option，需要动态改变option的在此操作
*
*fluor.listen('#selector',{
	times:2,
	url:'target.php',
	type:'post',
	dataType:'json',
	data:{name:'fluor'},
	callback:callback
},prefunc);
*/

</pre>
<hr>
<h3>jQuery-formVerify</h3> //表单验证
<pre>
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
*@@@可以验证整个表单或表单项@@@
*
*html -> data-verify='required|someRegexp|like-pwd'
*	required 必填字段，不要验证规则
*	like-some 与some项的值比较，相同返回true,否则为false
*&lt;input name='pwcheck' data-verify='like-pw'/>
*确认密码与密码比较
*&lt;form id='guest-form'>
*&lt;input data-verify='required' type="text" name='title'/>
*...
*$('#guest-form').formVerify(function(data){console.log(data);});
*
*&lt;input data-verify='required|notnumber|like-pwd' type="text" name='title'/>
*...
*$('#guest-form').formVerify({word:'\\w',number:'\\d',notnumber:'[^0-9]'},function(data){console.log(data);});
*
*/
</pre>
<hr>
<h3>jQuery-afterMouse</h3> //元素跟随
<pre>
/**
*元素跟随鼠标移动
*author vtejuf@126.com
*@param object 参数有三种形式
*			1、鼠标事件对象event，直接传入event，移动时保持元素激活时与鼠标的位置关系
*			2、位置对象{left:100,top:200}，移动时鼠标与元素边界始终保持left:100,top:200的距离
*			3、结束元素跟随，传入{end:true}
*/
$('.ele').on('mousedown',function(event){
	$(this).afterMouse(event);
});
$('.ele').on('mouseup',function(e){
	$(this).afterMouse({end:true});
});
</pre>
<hr>
<h3>jQuery-localpagesearch</h3> //当前页面检索
<pre>
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
</pre>


<hr>