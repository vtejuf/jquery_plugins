function BezierTrail(opt){

	opt = $.extend({
		style : "linear",
		point: [],
		frames : 24,
		time: null,
		backrun: false,
		onMoving: function(){},
		onEnd: function(){}
	}, opt);

	var Meth = BezierTrail.Anim[opt.style];
	var deg = 0, endDeg = opt.backrun? 180: 90;
	var speed = 1000/ opt.frames;
	var step = opt.time==null? 1: 90/ (opt.time* 0.001 * opt.frames);
	var p0 = opt.point.shift();
	var pn = opt.point.pop();
	var p1 = opt.point[0] || {x:0,y:0};
	var p2 = opt.point[1] || {x:0,y:0};

	var timer = setInterval(function(){
		deg += step;
		var t = Math.sin(2*Math.PI/360*deg);

		var x = Meth(p0.x, p1.x, p2.x, pn.x, t);
		var y = Meth(p0.y, p1.y, p2.y, pn.y, t);
		
		opt.onMoving(x,y);

		if(deg > endDeg){
			clearInterval(timer);
			opt.onEnd(x, y);
			return;
		}
	}, speed);
	// 取两点坐标，画贝塞尔曲线
	// t = 0 ~ 1
	// 线性 b = p0 + (p1 -p0)*t = (1-t)*p0 + t*p1
	// 二次 b = (1-t)^2*p0 + 2*t*(1-t)*p1 + t^2*p2 
	// 三次 b = p0*(1-t)^3 + 3*p1*t*(1-t)^2 + 3*p2*t^2*(1-t) + p3*t^3
}
BezierTrail.Anim = {
	linear: function(p0, p1, p2, pn, t){
		return BezierTrail.Fomlar[0](p0, pn, t);
	},
	parabolic: function(p0, p1, p2, pn, t){
		return BezierTrail.Fomlar[1](p0, p1, pn, t);
	},
	bezier: function(p0, p1, p2, pn, t){
		return BezierTrail.Fomlar[2](p0, p1, p2, pn, t);
	}
};
BezierTrail.Fomlar = [
	function(p0, p1, t){
		return p0 + (p1 - p0)*t;
	},
	function(p0, p1, p2, t){
		return Math.pow((1-t), 2)*p0 + 2*t*(1-t)*p1 + Math.pow(t, 2)*p2;
	},
	function(p0, p1, p2, p3, t){
		return p0*Math.pow((1-t), 3) + 3*p1*t*Math.pow((1-t), 2) + 3*p2*Math.pow(t, 2)*(1-t) + p3*Math.pow(t, 3);
	}
];