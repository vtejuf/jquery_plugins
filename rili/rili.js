/**
 * jquery 日历插件 仿win8日期控件
 * @return {[type]} 空
 * @augments {callback:func}
 * @example
 * $('#element').rili({callback:func});
 * 
 * @author 尹昱
 */

$.fn.rili = function(opt){

	opt = $.extend({
		callback:function(){}
	},opt);

	var self = this;
	//row 7col
	var css_name = {
		weekline:'weekline',
		week_end:'week_end',
		mark:'mark',
		day_today:'day_today',
		other_month:'other_month',
		day_number:'day_number',
		day_content:'day_content',
		tools:'plugin_rili_tools',
		datecub:'datecub'
	};

	var ROWS = null,
		COLS = 7,
		BOX_WIDTH = this.width(),
		BOX_HEIGHT = this.height(),
		DAT_WIDTH = BOX_WIDTH/7,
		DAY_HEIGHT = BOX_HEIGHT/6,
		TODAY = {},
		DAY_FOCUS = null;

		TODAY.DATE = new Date();
		TODAY.YEAR = TODAY.DATE.getFullYear();
		TODAY.MONTH = TODAY.DATE.getMonth();
		TODAY.DAY = TODAY.DATE.getDate();
		TODAY.WEEK = TODAY.DATE.getDay();

	var container,container_tools;

	var seed = {
		year:null,
		month:null,
		day:null,
		last:null,
		next:null,
		days_number:null,
		month_start_at_week:null,
		pre_need:null,
		do_count:function(y,m){
			var month_start = new Date(y,m,1);
			this.year = month_start.getFullYear();
			this.month = month_start.getMonth();
			this.month_start_at_week = month_start.getDay();

			this.last = new Date(month_start.getTime()-1000*60*60*24);
			this.next = new Date(this.year,this.month+1,1);

			this.days_number = new Date(this.year,this.month+1,0).getDate();

			this.pre_need = this.month_start_at_week==0?6:this.month_start_at_week==1?0:this.month_start_at_week-1;

			return this;
		},
		make:function(y,m){
			this.do_count(y,m);
		}
	};

	var tpl = {
		makeTh:function(){
			return "<tr class='"+css_name.weekline+"'><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th class='week_end'>六</th><th class='week_end'>日</th></tr>";
		},
		makeTbody:function(){
			ROWS = Math.ceil((seed.pre_need+seed.days_number)/7);

			var pre= seed.pre_need,//统计上月补全
				pre_count = 1,
				pre_day = seed.pre_need==0?0:seed.last.getDate()-seed.pre_need+1;
			var count = 1;
			var suffix_count = 1;

			var tbody = '';
			for(var i=0;i<ROWS;i++){
				tbody += "<tr class=''>";
				for(var j=0;j<COLS;j++){
					if(pre!==0 && pre_count<=pre){
						tbody += "<td class='"+css_name.datecub+' '+css_name.other_month+"' month='"+(seed.month-1)+"' day='"+pre_day+"'><a class='"+css_name.day_number+"' href='javascript:;'>"+pre_day+"</a></td>";
						pre_day++;
						pre_count++;
					}else if(count<=seed.days_number){
						tbody += "<td class='"+css_name.datecub+' '+(count==TODAY.DAY && seed.year == TODAY.YEAR && seed.month == TODAY.MONTH?css_name.day_today:'')+"' day='"+count+"'><a class='"+css_name.day_number+"' href='javascript:;'>"+(count++)+"</a></td>";
					}else{
						tbody += "<td class='"+css_name.datecub+' '+css_name.other_month+"' month='"+(seed.month+1)+"' day='"+suffix_count+"'><a class='"+css_name.day_number+"' href='javascript:;'>"+suffix_count+"</a></td>";
						suffix_count++;
					}
				}
				tbody += "</tr>";
			}
			return tbody;
		},
		makeTable:function(){
			var $table = $('<div id="plugin_rili" class="plugin_rili"><table cellspacing=0 cellpadding=0 id="plugin_rili_table" class="plugin_rili_table">'+this.makeTh()+this.makeTbody()+'</table></div>');
			$table.find('tr').find('td:gt(4)>a').addClass('week_end');
			$table.on('click','.datecub',events.dateclick);
			return $table;
		},
		makeTools:function(level_tpl){
			var $tools = "<div class='"+css_name.tools+"'>\
						<a href='javascript:;' id='plugin_rili_pre_btn' class='plugin_rili_pre_btn'><</a>\
						<a href='javascript:;' id='plugin_rili_change' class='plugin_rili_change'>"+level_tpl+"</a>\
						<a href='javascript:;' id='plugin_rili_next_btn' class='plugin_rili_next_btn'>></a>\
						<a href='javascript:;' id='plugin_rili_show_today' class='plugin_rili_show_today'>返回今天</a>\
						</div>";
				$tools = $($tools);

			// 回退
			$tools.on('click','.plugin_rili_pre_btn',events.see_pre);
			// 前进
			$tools.on('click','.plugin_rili_next_btn',events.see_next);
			// 返回今天
			$tools.on('click','.plugin_rili_show_today',events.back_today);
			//切换等级
			$tools.on('click','.plugin_rili_change',events.change_level);

			return $tools;
		},
		level:null,
		level_tpl:function(l,data){
			var level = {
				day: "{year}年{month}月",
				month: "{year}",
				year:"{year_s}-{year_e}"
			};
			return level[l].replace(/{(.+?)}/g,function(r,f){
				return data[f] || '';
			});
		},
		month_level_tpl:null,
		make_month_level:function(){
			var t = '<div class="plugin_rili_months">';
			for(var i=0;i<12;i++){
				t += "<a href='javascript:;' month='"+i+"'>"+(1+i)+"月</a>";
			}
			t += '</div>';
			var $t = $(t);
			$t.on('click','a',events.from_month);
			this.month_level_tpl = $t;
		},
		year_s:null,
		make_year_level:function(year){
			var t = '<div class="plugin_rili_years">';
			var s = year-year%10;
			this.year_s = s;
			for(var i =-1;i<11;i++){
				var y = (s+i);
				t += "<a href='javascript:;' class='years' year='"+y+"'>"+y+"</a>";
			}
			t += '</div>';
			var $t = $(t);
			$t.on('click','.years',events.from_year);
			return $t;
		}
	};

	var events = {
		back_today:function(){
				switch(tpl.level){
					case 'day':
					case 'month':
					case 'year':
					tpl.level = 'day';
					seed.make(TODAY.YEAR,TODAY.MONTH);
					self.empty().append(tpl.makeTools(tpl.level_tpl(tpl.level,{year:seed.year,month:seed.month+1}))).append(tpl.makeTable());
					break;
				}
			},
		see_pre:function(){
				switch(tpl.level){
					case 'day':
					seed.make(seed.year,--seed.month);
					self.empty().append(tpl.makeTools(tpl.level_tpl(tpl.level,{year:seed.year,month:seed.month+1}))).append(tpl.makeTable());
					break;
					case 'month':
					$('#plugin_rili_change').text(tpl.level_tpl(tpl.level,{year:--seed.year}));
					break;
					case 'year':
					tpl.year_s -= 10;
					self.find('#plugin_rili').empty().append(tpl.make_year_level(tpl.year_s));
					$('#plugin_rili_change').text(tpl.level_tpl(tpl.level,{year_s:tpl.year_s,year_e:tpl.year_s+9}));
					break;
				}
			},
		see_next:function(){
				switch(tpl.level){
					case 'day':
					seed.make(seed.year,++seed.month);
					self.empty().append(tpl.makeTools(tpl.level_tpl(tpl.level,{year:seed.year,month:seed.month+1}))).append(tpl.makeTable());
					break;
					case 'month':
					$('#plugin_rili_change').text(tpl.level_tpl(tpl.level,{year:++seed.year}));
					break;
					case 'year':
					tpl.year_s += 10;
					self.find('#plugin_rili').empty().append(tpl.make_year_level(tpl.year_s));
					$('#plugin_rili_change').text(tpl.level_tpl(tpl.level,{year_s:tpl.year_s,year_e:tpl.year_s+9}));
					break;
				}
			},
		change_level:function(){
				switch(tpl.level){
					case 'day':
					tpl.level = 'month';
					if(tpl.month_level_tpl===null){
						tpl.make_month_level();
					}
					self.find('#plugin_rili').empty();
					self.find('#plugin_rili').append(tpl.month_level_tpl);
					self.find('#plugin_rili_tools').remove();
					$('#plugin_rili_change').text(tpl.level_tpl(tpl.level,{year:seed.year}));
					break;
					case 'month':
					tpl.level = 'year';
					tpl.month_level_tpl.detach();
					self.find('#plugin_rili').empty();
					self.find('#plugin_rili').append(tpl.make_year_level(seed.year));
					$('#plugin_rili_change').text(tpl.level_tpl(tpl.level,{year_s:tpl.year_s,year_e:tpl.year_s+9}));
					break;
				}
			},
		from_year:function(){
				tpl.level = 'month';
				seed.year = +$(this).attr('year');
				self.find('#plugin_rili').empty();
				self.find('#plugin_rili').append(tpl.month_level_tpl);
				self.find('#plugin_rili_tools').remove();
				$('#plugin_rili_change').text(tpl.level_tpl(tpl.level,{year:seed.year}));
			},
		from_month:function(){
				tpl.level = 'day';
				seed.month = +$(this).attr('month');
				seed.make(seed.year,seed.month);
				tpl.month_level_tpl.detach();
				self.empty().append(tpl.makeTools(tpl.level_tpl(tpl.level,{year:seed.year,month:seed.month+1}))).append(tpl.makeTable());
			},
		dateclick:function(){
				var $this = $(this);
				if($this.hasClass('other_month')){
					seed.month = +$this.attr('month');
					seed.make(seed.year,seed.month);
					self.empty().append(tpl.makeTools(tpl.level_tpl(tpl.level,{year:seed.year,month:seed.month+1}))).append(tpl.makeTable());
					return;
				}
				opt.callback();
			}
	};


	var init = function (){
		seed.make(TODAY.YEAR,TODAY.MONTH);
		tpl.level = 'day';
		self.append(tpl.makeTools(tpl.level_tpl(tpl.level,{year:TODAY.YEAR,month:TODAY.MONTH+1})));
		self.append(tpl.makeTable());
	}

	init();
}