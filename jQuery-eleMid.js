	/*元素居中
	*author vtejuf@126.com
	*   $(ele).eleMid([option]) 默认left、top居中 // css -- > left:居中;top:居中
	*	参数option				json格式 //{"left":"333px",top:"30px"} css -- > left:333px;top:30px
	*	option属性 right		单独指定 right 则改为 right 定位，bottom 同理 // {"right":"50px"} css -- > right:50px;top:居中
	*	option属性 right left	同时指定 left、right 则元素宽度扩大为 left到right，bottom、top同理
	*	option属性 add			{"add":true,"left":100} 在居中位置上加left 100 ，top同理；指定 right、bottom 则在居中位置上向右、下扩展
	*	option属性 mouse		指定窗口的跟随鼠标位置，{mouse:event} 值为事件对象
	*/
	jQuery.fn.eleMid=function(option){
		option= option || {};
		if(option.right){
			option.left= option.left || null;
		}
		if(option.bottom){
			option.top= option.top || null;
		}

		var scrTop = jQuery(document).scrollTop(),
			scrLeft = jQuery(document).scrollLeft(),
			bodyWidth= jQuery(window).width(),
			bodyHeight= jQuery(window).height();

		this.each(function(){
			var selfWidth= jQuery(this).outerWidth(),
				selfHeight= jQuery(this).outerHeight(),
				css= {},
				ext_obj={};

			//如果元素包含在定位元素中，先计算父级的偏移量
			var posType={absolute:true,relative:true,fixed:true};
			var posParent=$(this).parents().filter(function(){
				var pos = $(this).css('position');
				if(posType[pos]){
					return $(this);
				};
			});
			posParent = $(posParent).length>0?$($(posParent)[0]).offset():{left:0,top:0};

			if(option.mouse){
				var ml= option['mouse'].clientX+scrLeft,
					mt= option['mouse'].clientY+scrTop,
					wl= bodyWidth,
					wt= bodyHeight;
				ext_obj.left=(wl- ml)> selfWidth?(ml-posParent.left)+"px":(ml-posParent.left- selfWidth)+"px";
				ext_obj.top= (wt- mt)> selfHeight?(mt-posParent.top)+"px":(mt-posParent.top- selfHeight)+"px";
			}else{
				var midwidth= (bodyWidth-posParent.left-selfWidth)/2+scrLeft,
					midheight= (bodyHeight-posParent.top-selfHeight)/2+scrTop;
				if(option.add){
					var addleft= option["left"] || '',
						addtop= option["top"] || '';
					ext_obj.top= midheight+addtop+"px";
					ext_obj.left= midwidth+addleft+"px";
				}
				css.top= midheight+'px';
				css.left= midwidth+'px';
			}
			jQuery.extend(css,ext_obj);
			jQuery(this).css(css);
			jQuery(this).css({'position':'absolute'});
		});

		return this;
	}