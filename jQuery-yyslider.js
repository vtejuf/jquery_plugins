/**
*幻灯效果，淡入淡出 css3|transform
*作者 尹昱 vtejuf@126.com
* 
* 默认 imganimate:'fade',btnstyle:1,imgspeed:3000,imgname:''
jQuery('#div').yySlider({
	exeles['#slider1','#slider2','#slider3'],//把dom元素当做幻灯片
	imgsrc:['4.jpg','5.jpg','6.jpg','7.jpg'],//图片地址，一张以上
	imglink:['1.html','2.html'],//图片跳转链接
	imgname:['a','b','c','d'],//图片名字，alt属性
	imganimate:'slide',//动画效果，fade||slide  fade淡入淡出，slide默认为css3 transform动画效果，如果不支持则为fade
	exspeed:1000,//图片切换时间
	imgspeed:2000,//图片停留时间
	btnstyle:1,//按钮样式 如果是数字，从数字开始；如果是0，没有数字 // 值为1，显示1,2,3,……; 值为0 显示空按钮
	btnOnCss:'btnOnCss'//当前按钮样式，css名称，默认'btnOnCss'
});
*
*exeles和imgsrc如果都有则两个都显示出来，先显示exeles再显示imgsrc
*/

jQuery.fn.yySlider=function(option){
	option = option || {};
	var optiondefault={imganimate:'fade',btnstyle:1,imgspeed:3000,imgname:'',exspeed:1000};
	jQuery(option).extend({},optiondefault,option);
	var imgbtn=option.imgbutton,
		exeles=option.exeles || [],
		imgnum=option.imgsrc.length,
		imgsrc=option.imgsrc,
		imganimate=option.imganimate,
		imgname=option.imgname,
		imglink=option.imglink,
		exspeed=option.exspeed,
		imgspeed=option.imgspeed,
		btnstyle=option.btnstyle,
		btnOnCss=option.btnOnCss || 'btnOnCss',
		style,
		styleinsert,
		getBrowser,
		__imgli='',
		__btnli='',
		imgcurrent=0,
		imgli,
		btnli,
		autogo,
		eleinside,
		browsertest;
	if(exeles.length){
		imgnum = exeles.length+imgnum;
		eleinside = 1;
	}
	//jquery 1.9取消了$.browser
	if(!jQuery.browser){
		jQuery.browser={};
		jQuery.browser.mozilla = /firefox/.test(navigator.userAgent.toLowerCase());
		jQuery.browser.chrome = /webkit/.test(navigator.userAgent.toLowerCase());
		jQuery.browser.safari = /webkit/.test(navigator.userAgent.toLowerCase());
		jQuery.browser.opera = /opera/.test(navigator.userAgent.toLowerCase());
		jQuery.browser.msie = /msie/.test(navigator.userAgent.toLowerCase());
	}
	//浏览器检查，主要用来判断transform属性
	getBrowser=function(v){
		switch (true){
		case jQuery.browser.mozilla:
			return 'moz';
		break;
		case jQuery.browser.msie:
			return 'msie';
		break;
		case jQuery.browser.safari:
			return 'safari';
		break;
		case jQuery.browser.opera:
			return 'opera';
		break;
		case jQuery.browser.chrome:
			return 'chrome';
		break;
		default:
			return 'other';
		break;
		}
	};

	this.each(function(){
		jQuery(this).html('');
		if(imgnum===1){
			if(eleinside===1){
				jQuery(this).append(jQuery(exeles[0]).prop('outerHTML'));
				return;
			}
			jQuery(this).append('<a href="'+imglink[0]+'"><img alt="'+imgname[0]+'" src="'+imgsrc[0]+'"/></a>');
			return;
		}

		//插入图片列表和按钮列表
		if(eleinside===1){
			for(var i=0;i<exeles.length;i++){
				__imgli+='<li class="yySlider-imglist yyslider-transform"><div class="yySlider-imgs">'+jQuery(exeles[i]).prop('outerHTML')+'</div></li>';
			}
		}
		if(imgsrc.length>0){
			for(var i=0;i<imgsrc.length;i++){
				__imgli+='<li class="yySlider-imglist yyslider-transform"><a href="'+imglink[i]+'"><img class="yySlider-imgs" alt="'+imgname[i]+'" src="'+imgsrc[i]+'"/></a></li>';
			}
		}
		if(btnstyle===0){
			for(var z=0;z<imgnum;z++){
				__btnli+='<li class="yySlider-btnlist"><a href="'+imglink[z]+'"></a></li>';
			}
		}else{
			for(var z=0;z<imgnum;z++){
				__btnli+='<li class="yySlider-btnlist"><a href="'+imglink[z]+'">'+(btnstyle+z)+'</a></li>';
			}
		}
		jQuery(this).append('<ul class="img-ul">'+__imgli+'</ul>'+'<ul class="btn-ul">'+__btnli+'</ul>').css({'position':'relative','overflow':'hidden'});

		browsertest=getBrowser();
		imgli=jQuery('.yySlider-imglist');
		btnli=jQuery('.yySlider-btnlist');
		btnli.eq(0).addClass(btnOnCss);


		//css3样式
		if(imganimate==='slide'){
			switch(browsertest){
				case 'moz':
					style = ".yyslider-transform{-moz-transition: -moz-transform 1s ease-in;-moz-transform-origin: right;}"+
							".yyslider-transform-90deg{-moz-transform: rotateY(90deg);}"+
							".yyslider-transform-left{-moz-transform-origin: left;}";
				break;
				case 'chrome':
				case 'safari':
					style = ".yyslider-transform{-webkit-transition: -webkit-transform 1s ease-in;	-webkit-transform-origin: right;}"+
							".yyslider-transform-left{-webkit-transform-origin: left;}"+
							".yyslider-transform-90deg{-webkit-transform: rotateY(90deg);}";
				break;
				default:
					style='';
					imganimate='fade';
				break;
			}
		}

		//基本样式
		styleinsert=".yySlider-imgs,.yySlider-imglist,.btn-ul,.img-ul{margin:0 !important;padding:0 !important}"+
					".yySlider-imgs{display:block;width:100%;height:100%;}"+
					".yySlider-imglist{position:absolute;list-style:none;}"+
					".yySlider-btnlist{float:left;margin:0 5px 0 0;padding:1px 3px;list-style:none;cursor:pointer}"+
					".btn-ul{position:absolute;right:5px;bottom:2px;height:20px;size:12px;}"+
					".img-ul{height:100%;width:100%;}"+style;
		var headdom=document.head || document.getElementsByTagName( "head" )[0];
			jQuery(headdom).append('<style>'+styleinsert+'</style>');
		
		switch (imganimate){
		case 'fade':
			imgli.filter(':gt(0)').css({'display':'none'});
		break;
		case 'slide':
			imgli.filter(':gt(0)').css({'display':'none'}).addClass('yyslider-transform-90deg');
		break;
		default:
		break;
		}

		//运行控制
		__getimganimate();

		jQuery(this).hover(function(){
			__stop(autogo);
		},function(){
			__getimganimate(imganimate);
		});

		btnli.hover(function(){
			$(this).addClass(btnOnCss).siblings('li').removeClass(btnOnCss);
			__getImg(jQuery(this).index());
		},function(){}
		);


		//相关函数
		function __getimganimate(){
			switch (imganimate){
			case 'fade':
				__autogo(__fade);
			break;
			case 'slide':
				__autogo(__slide);
			break;
			default:
			break;
			}
		}

		function __stop(i){
				setTimeout(function(){
					clearInterval(i);
				},200);
		}

		function __autogo(func){
			setTimeout(function(){
				autogo=setInterval(function(){
					func();
				},imgspeed);
			},200);
		}

		function __fade(){
			imgli.eq(imgcurrent).fadeOut(exspeed);
			imgcurrent=++imgcurrent%imgnum;
			imgli.eq(imgcurrent).fadeIn(exspeed);
			btnli.removeClass(btnOnCss).eq(imgcurrent).addClass(btnOnCss);
		}

		function __slide(){
			imgli.eq(imgcurrent).addClass('yyslider-transform-90deg').addClass('yyslider-transform-left');
			imgcurrent=++imgcurrent%imgnum;
			imgli.eq(imgcurrent).show().removeClass('yyslider-transform-90deg').removeClass('yyslider-transform-left');
			btnli.removeClass(btnOnCss).eq(imgcurrent).addClass(btnOnCss);
		}

		//放置按钮改变图片
		function __getImg(i){
			switch (imganimate){
			case 'fade':
				imgli.not(i).fadeOut(exspeed).eq(i).fadeIn(exspeed);
				imgcurrent=i;
			break;
			case 'slide':
				imgli.not(i).addClass('yyslider-transform-90deg').addClass('yyslider-transform-left');
				imgli.eq(i).show().removeClass('yyslider-transform-90deg').removeClass('yyslider-transform-left');
				imgcurrent=i;
			break;
			default:
			break;
			}
		}
	
	});
};
