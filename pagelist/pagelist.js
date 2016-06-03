/**
 * @fileOverview 前端分页
 * @author YY
 * @description 把分页做成了小组块的样子，可以自由组合选择样式
 *
 * @param	var currentPage  = int,当前页
		totalPage  = int,总页面数
		viewSize   = int,显示几个页面
		baseURL    = string,基本路径
		langs = { 语言包
			labelFirst:'首页',
			labelPrev:'上一页',
			labelNext:'下一页',
			labelLast:'尾页',
			labelGoto:'跳转到'
		},
		item = [ 显示哪些元素
			'First', 首页
			'Prev', 上一页
			'Numbers', 列表
			'Next', 下一页
			'Last', 尾页
			//'Goto' 跳转框
		];
 * @return {
		makeTpl:makeTpl, //生成html 需要手动插入dom
		currentPage:{
			get:getCurrentPage,	//获取当前页面
			set:setCurrentPage  //设置当前页面
		},
		totalPage:{
			get:getTotalPage  //获取总页数
			set:setTotalPage, //设置总页数
		}
	}
 *
 */

function PageList(option){
	var currentPage = option.currentPage  = option.currentPage || 1,//从1开始
		totalPage  = option.totalPage,
		viewSize   = option.viewSize || 9,
		baseURL    = option.baseURL || '',
		langs = $.extend({
			labelFirst:'首页',
			labelPrev:'上一页',
			labelNext:'下一页',
			labelLast:'尾页',
			labelGoto:'跳转到'
		},option.langs),
		eventBinded = false;
		item = option.item || ['first','prev','numbers','next','last'];//,'goto'

	function _makeFirst(currentPage){//生成首页
		if(currentPage <= 1){
			return '';
		}else{
			return "<a class='first' href='"+baseURL.replace('{page}',1)+"'>"+langs.labelFirst+"</a>";
		}
	}
	function _makePrev(currentPage){//生成上一页
		var num = Math.ceil(currentPage-1);
		if(num <= 0){
			return "";
		}else{
			return "<a class='prev' href='"+baseURL.replace('{page}',num)+"'>"+langs.labelPrev+"</a>";
		}
	}
	function _makeNumbers(currentPage,totalPage){//生成分页
		var distance = Math.floor((viewSize)/2);
		var from,to,tpl,leftEllipsis='',rightEllipsis='';
		if(viewSize<totalPage){
			if(currentPage-distance<=1){
				rightEllipsis = '<a class="ellipsis">...</a>';
				to = viewSize+(viewSize+1)%2;
				from = 1;
			}else if((currentPage+distance)>=totalPage){
				leftEllipsis = '<a class="ellipsis">...</a>';
				from = totalPage - viewSize + viewSize%2;
				to = totalPage;
			}else{
				leftEllipsis = rightEllipsis = '<a class="ellipsis">...</a>';
				from = currentPage-distance;
				to = currentPage+distance
			}
		}else{
			from = 1;
			to = totalPage;
		}
		tpl = leftEllipsis;
		for(var i=from;i<=to;i++){
			if(i==currentPage){
				tpl += "<a class='listnumber current'>"+i+"</a>";
			}else{
				tpl += "<a class='listnumber' href='"+baseURL.replace('{page}',i)+"'>"+i+"</a>";
			}
		}
		return tpl + rightEllipsis; 
	}
	function _makeNext(currentPage,totalPage){//生成下一页
		var num = Math.ceil(+currentPage+1);
		if(num>totalPage){
			return "";
		}else{
			return "<a class='next' href='"+baseURL.replace('{page}',num)+"'>"+langs.labelNext+"</a>";
		}
	}
	function _makeLast(currentPage,totalPage){//生成尾页
		if(currentPage >= totalPage){
			return '';
		}else{
			return "<a class='last' href='"+baseURL.replace('{page}',totalPage)+"'>"+langs.labelLast+"</a>";
		}
	}
	function _makeGoto(totalPage){//生成跳转
		return "<a class='goto' href='javascript:;'>"+langs.labelGoto+"</a><input class='pageinput' href='"+baseURL+"?page=' total='"+totalPage+"' type='text'>"
	}

	function _bingEvent(){
		option.container.on('click','.pagelist a:not(.current,.ellipsis)',function(){
			if(!!option.beforeRender){
				if(option.beforeRender(this,option.currentPage) === false){
					return false;
				};
			}
			switch(true)
			{
				case $(this).hasClass('first'):
					option.currentPage = 1;
				break;

				case $(this).hasClass('prev'):
					var cp = option.currentPage;
					cp = (cp-1)>=1?cp-1:1;
					option.currentPage = cp;
				break;

				case $(this).hasClass('listnumber'):
					option.currentPage = +$(this).text();
				break;

				case $(this).hasClass('next'):
					var cp = option.currentPage;
					cp = (cp+1)<=totalPage?cp+1:totalPage;
					option.currentPage = cp;
				break;

				case $(this).hasClass('last'):
					option.currentPage = totalPage;
				break;
			}
			output.makeTpl();
			if(!!option.afterRender){
				if(!option.afterRender(this,option.currentPage)){
					return false;
				};
			}
		});
		eventBinded = true;
	}
	
	//总模板
	function makeTpl(tploption,returnHtml){
		if(typeof tploption == 'boolean'){
			returnHtml = tploption;
			tploption = false;
		}
		tploption = tploption || option;
		var tpl = '<div class="pagelist">';
		for (var i = 0,l=item.length; i<l; i++) {
			switch(item[i].toLowerCase()){
			case 'first':
				tpl += _makeFirst(tploption.currentPage);
			break
			case 'prev':
				tpl += _makePrev(tploption.currentPage);
			break
			case 'numbers':
				tpl += _makeNumbers(tploption.currentPage,tploption.totalPage);
			break
			case 'next':
				tpl += _makeNext(tploption.currentPage,tploption.totalPage);
			break
			case 'last':
				tpl += _makeLast(tploption.currentPage,tploption.totalPage);
			break
			case 'goto':
				tpl += _makeGoto(tploption.totalPage);
			break
			}
		}
		tpl += '</div>';

		if(returnHtml){
			return tpl;
		}else{
			option.container.html(tpl);
			!eventBinded && _bingEvent();
		}
	}

	function setCurrentPage(cp){
		option.currentPage = cp;
	}

	function getCurrentPage(){
		return option.currentPage;
	}

	function setTotalPage(tp){
		option.totalPage = tp;
	}

	function getTotalPage(){
		return option.totalPage;
	}

	var output = {
		makeTpl:makeTpl,
		currentPage:{
			get:getCurrentPage,
			set:setCurrentPage
		},
		totalPage:{
			get:getTotalPage,
			set:setTotalPage
		}
	}
	
	return output;

};