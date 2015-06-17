/**
 * @fileOverview tab插件
 * @author YY
 * @description 生成两种tab标签 ，固定数量的静态标签和动态可以关闭的动态标签，
 *              动态标签自动分配宽度，插件本身规定了class标签，但没有规定样式，
 *              样式请通过标签调整。标签包括
 *              .tab-item tab标签项
 *              .tab-close tab标签关闭按钮
 *              .tab-dynamic 动态tab标签项
 *              .tab-item.active 选中的tab标签项
 *              .tab-dynamic.active 选中的动态tab标签项
 * @param object 配置项 
 * 		{type:'static' [static静态 默认 / dynamic动态]
 * 		,tabs:[
 * 			{contentId:'xxx1',title:'xxx1'} //内容id(必须是ID)和标签名称
 * 			 ,{contentId:'xxx2',title:'xxx2'}
 * 			  ,{contentId:'xxx3',title:'xxx3'}
 * 		]
 * 		,mainId:'xxx1' 主标签，默认显示的标签，不能关闭，相当于首页
 * 		}
 * 	@example
	   	var tab = $('#tabs').tabs4Jquery({ //必须是ID
			type:'dynamic'//dynamic
			,tabs:[
			{contentId:'baseinfo',title:'一般情况'}
			,{contentId:'systemreview',title:'系统回顾'}
			,{contentId:'personrecords',title:'个人史'}
			,{contentId:'obsterical',title:'婚育史'}
			,{contentId:'physical',title:'体格检查'}
			,{contentId:'family',title:'系统回顾'}
			,{contentId:'diagnose',title:'诊断'}
			]
			,mainId:'baseinfo',
			click:{},//切换以后的事件
			beforechange:{},//切换以前触发的事件
			onload:function //加载完成后触发
		});
		$('#newone').length==0 && $('#tab-content').append("<div id='newone'>newone</div>"); //新建标签之前，先添加标签内容
		var newtab = tab.data('plugin_tabs4jquery').addTab({contentId:'newone',title:'新建'});//返回新插入标签的jquery对象，如果标签已经存在，不返回值，并打开该标签
		newtab.dosomething();
	@method
		tab.hideButton(id);隐藏某个contentId的按钮，内容不会被删除
		tab.showButton(id);显示某个隐藏的contentId的按钮
		tab.config //配置项
 */
jQuery.fn.tabs4jquery=function(config){
	var opened={};

	config = $.extend({
		type:'static',
		click:null,
		beforechange:null,
		onload:null
	},config);

	var _this = $(this);
	var _tab_target_c='';
	_this.config = config;

	_this.addClass('talent-yytabs');
	
	_this.hideButton = function(id) {
		var currentEle = $('div[target=' + id + ']');
		if (currentEle.hasClass('active')) {
			currentEle.removeClass('active').prev().addClass('active').triggerHandler('click');
		}
		if (currentEle.hasClass('end-item')) {
			currentEle.removeClass('end-item').prev().addClass('end-item');
		}
		if (currentEle.hasClass('start-item')) {
			currentEle.removeClass('start-item').next().addClass('start-item');
		}
		currentEle.hide();
	};
	
	_this.showButton = function(id) {
		var currentEle = $('div[target=' + id + ']');
		if (currentEle.prev().hasClass('end-item')) {
			currentEle.addClass('end-item').prev().removeClass('end-item');
		}
		if (currentEle.next().hasClass('start-item')) {
			currentEle.addClass('start-item').next().removeClass('start-item');
		}
		currentEle.show();
	}
	
	//tab点击事件
	function tabEvent(){
		var self = $(this),
			target = self.attr('target');
		var dtd = null;
		if(!!config.beforechange){
			if(typeof config.beforechange == 'function'){
				dtd = config.beforechange(self);
			}else if(!!config.beforechange[target]){
				dtd = config.beforechange[target](self);
			}
		}else{
			dtd = $.Deferred().resolve();
		}
		$.when(dtd).done(function(){
			if(!!_tab_target_c && target==_tab_target_c)return false;
			self.addClass('active').siblings().removeClass('active');
			$('#'+target).show().siblings().hide();
			_tab_target_c=target;
			if(!!config.click){
				if(typeof config.click == 'function'){
					config.click(self);
				}else if(!!config.click[target]){
					config.click[target](self);
				}
			}
		});
	}
	//生成静态tabs 
	function makeStaticTabs(){
		var html=[];
		for(var i=0,l=config.tabs.length;i<l;i++){
			var active = (config.tabs[i].contentId===config.mainId)?'active':'',
				start = i ? '' : ' start-item',
				end = (i === l - 1) ? ' end-item' : '';
			html.push($('<div class="tab-item tab-'+config.tabs[i].contentId+' '+active+ start + end + '" target="'+config.tabs[i].contentId+'">'+config.tabs[i].title+'</div>').click(tabEvent));
		}
		return html;
	}
	//生成动态tabs
	function makeDynamicTabs(){
		var tabs = makeStaticTabs();
		$(tabs).each(function(){
			var id = this.attr('target'),
				self = this;
			opened[id] = true;
			if(id==config.mainId){
				this.addClass('tab-dynamic');
				return;
			}
			//关闭按钮
			var close = $('<i class="tab-close" href="javascript:;"></i>').click(function(){
				$('#'+id).remove();
				if(!self.siblings().hasClass('active')){
					var prev = self.prev();
					prev.addClass('active');
					$('#'+prev.attr('target')).show();
				}
				self.remove();
				opened[id]=false;
				countWidth(_this.find('.tab-item'));
			});
			this.addClass('tab-dynamic').append(close);
		});
		return tabs;
	}
	//计算宽度 动态标签铺满平分
	function countWidth(tabs,out){
		out = out || true;//是否返回tabs
		var width = ~~(_this.width()/(tabs.length+1));
		$(tabs).each(function(){
			if(typeof window.ActiveXObject == 'function' && navigator.userAgent.indexOf("MSIE 8.0")>0){
				$(this).css('max-width',width-30);
			}else{
				$(this).css('max-width',width);
			}
		});
		return out?tabs:'';
	}
	$(window).resize(function(){
		countWidth(_this.find('.tab-item'));
	})

	//新建标签
	function addTab(data){
		var id = data.contentId;
		if(opened[id]){
			movefocus(id);
			return false;
		}
		opened[id] = true;
		var self = $('<div class="tab-item tab-'+id+' tab-dynamic active" target="'+id+'">'+data.title+'</div>').click(tabEvent);
		var close = $('<i class="tab-close" href="javascript:;"></i>').click(function(){
			$('#'+id).remove();
			if(!self.siblings().hasClass('active')){
				var prev = self.prev();
				prev.addClass('active');
				$('#'+prev.attr('target')).show();
			}
			self.remove(); 
			opened[id]=false;
			countWidth(_this.find('.tab-item'));
		});
		_this.find('.tab-item.active').removeClass('active');
		_this.append(self.append(close));
		$('#'+data.contentId).show().siblings().hide();
		countWidth(_this.find('.tab-item'),false);
		_tab_target_c=opened[data.contentId];
		return self;
	}
	//切换tab显示
	function movefocus(id){
		_this.find('.tab-item[target="'+id+'"]').trigger('click');
	}
	//run
	if(config.type==='dynamic'){
		var backFun = {//绑定到data的对象
			addTab:addTab
		}
		_this.append(countWidth(makeDynamicTabs()));
		$('#'+config.mainId).show();
		_this.data('plugin_tabs4jquery',backFun);
	}else{
		_this.append(makeStaticTabs());
		$('#'+config.mainId).show();
	}
	(typeof config.onload == 'function') && config.onload();
	return _this;
};