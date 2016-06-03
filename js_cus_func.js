
//字符串
var STR = STR || {
	//去掉字符串前后的空格
	trim : function(str,pos){
		if(pos==='left' || pos==='l' || pos==='L'){
			return str.replace(/(^\s*)/, "");
		}
		if(pos==='right' || pos==='r' || pos==='R'){
			return str.replace(/(\s*$)/, "");
		}
		return str.replace(/(^\s*)|(\s*$)/, "");
	}
}

//数组
var ARR = ARR || {
	//数组去重
	unique : function(arr){
		var res = [], hash = {};
		for(var i=0, elem; (elem = arr[i]) != null; i++)  {
			if (!hash[elem])
			{
				res.push(elem);
				hash[elem] = true;
			}
		}
		return res;
	}
	//指定对象数组按照数组内对象某一属性名排序
	,sort_inner_obj : function(arr,propertyName,sc){
		var sc = (sc==='asc')?1:-1;
		return arr.sort(
			function(object1, object2){
				var value1 = object1[propertyName];
				var value2 = object2[propertyName];
				if (value1 > value2){
					return sc;
				} else if (value1 < value2){
					return -sc;
				} else{
					return 0;
				}
			}
		);
	}
	//遍历数组/对象
	,each : function(obj,callback){
		if(typeof obj ==='function' && obj.slice){//array
			for(var i=0,l=obj.length;i<l;i++){
				callback(i,obj[i]);
			}
		}else{
			for(var i in obj){
				callback(i,obj[i]);
			}
		}
	}
}

//对象
var OBJ = OBJ || {
	//合并对象
	merge : function(){
		var l= arguments.length;
		var out= arguments[--l],
			inp= arguments[l-1];
		for(var i in out){
			inp[i]= out[i];
		}
		if(l-1==0){
			return inp;
		}
		var ar= [],
			_slice= ar.slice;
		var n= _slice.call(arguments,0,l);
		inp= OBJ.merge.apply(null,n);
		return inp;
	}
	//获得对象的key
	,keys : function(obj) {
		var keys = [];
		for (var i in obj){
			keys.push(i);
		}
		return keys;
	}
	//获得对象的value 
	,values : function(obj) {
		var values = [];
		for (var i in obj){
			values.push(obj[i]); 
		}
		return values;
	}
	//遍历数组/对象
	,each : ARR.each
}

//URL
var URL = URL || {
	//返回查询字符串中的某个值
	get_param : function (name){
		var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
		var r = window.location.search.substr(1).match(reg);  //匹配目标参数
		if (r!=null) return unescape(r[2]); return null; //返回参数值
	}
}