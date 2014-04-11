/**
 * @fileOverview tab插件
 * @author vtejuf@126.com
 * @description 生成两种tab标签 ，固定数量的静态标签和动态可以关闭的动态标签，
 *              动态标签自动分配宽度
 * @param {json} 配置项 
 * 		{type:'static' static静态[默认]  dynamic动态
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
			,mainId:'baseinfo'
		});
		$('#tab-content').append("<div id='newone'>newone</div>"); //新建标签之前，先添加标签内容
		tab.data('plugin_tabs4jquery').addTab({contentId:'newone',title:'新建'});
 */
jQuery.fn.tabs4jquery=function(config){
	var $ = jQuery;

	config = $.extend({
		type:'static'
	},config);

	var _this = $(this);
	var _tab_target_c='';
	//tab点击事件
	function tabEvent(){
		var self = $(this),
			target = self.attr('target');
		if(!!_tab_target_c && target==_tab_target_c)return false;
		self.addClass('active').siblings().removeClass('active');
		$('#'+target).show().siblings().hide();
		_tab_target_c=target;
	}
	//生成静态tabs 
	function makeStaticTabs(){
		var html=[];
		for(var i=0,l=config.tabs.length;i<l;i++){
			var active = (config.tabs[i].contentId===config.mainId)?'active':'';
			html.push($('<div class="tab-item '+active+'" target="'+config.tabs[i].contentId+'">'+config.tabs[i].title+'</div>').click(tabEvent));
		}
		return html;
	}
	//生成动态tabs
	function makeDynamicTabs(){
		var tabs = makeStaticTabs();
		$(tabs).each(function(){
			var id = this.attr('target'),
				self = this;
			if(id==config.mainId){
				this.addClass('tab-dynamic');
				return;
			}
			var close = $('<i class="tab-close icon-close" href="javascript:;"></i>').click(function(){
				$('#'+id).remove();
				if(!self.siblings().hasClass('active')){
					var prev = self.prev();
					prev.addClass('active');
					$('#'+prev.attr('target')).show();
				}
				self.remove();
			});
			this.addClass('tab-dynamic').append(close);
		});
		return tabs;
	}
	//计算宽度 动态标签铺满平分
	function countWidth(tabs,out){
		out = out || true;
		var width = ~~(_this.width()/tabs.length)-35;
		$(tabs).each(function(){
			$(this).css('width',width);
		});
		return out?tabs:'';
	}

	//新建标签
	function addTab(data){
		var tab_item = $('<div class="tab-item tab-dynamic active" target="'+data.contentId+'">'+data.title+'</div>').click(tabEvent);
		var close = $('<i class="tab-close icon-close" href="javascript:;"></i>').click(function(){
			$('#'+data.contentId).remove();
			if(!tab_item.siblings().hasClass('active')){
				var prev = tab_item.prev();
				prev.addClass('active');
				$('#'+prev.attr('target')).show();
			}
			tab_item.remove();
		});
		_this.find('.tab-item.active').removeClass('active');
		_this.append(tab_item.append(close));
		countWidth(_this.find('.tab-item'),false);
	}
//run
	if(config.type==='dynamic'){
		var backFun = {
			addTab:addTab
		}
		_this.append(countWidth(makeDynamicTabs()));
		return _this.data('plugin_tabs4jquery',backFun);
	}else{
		_this.append(makeStaticTabs());
		$('#'+config.mainId).show();
	}

}
