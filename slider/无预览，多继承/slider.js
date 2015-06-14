/**
* 幻灯插件
* 两种继承方式
* 参数包括{sliderUl:$(ul),singW:'窗口宽度',[autorun:{speed:1000}]},
* html结构为三级 div.slider-warp > ul.slider-list > li.slider-item
* ctrl warp 为控制器参数，见Ctrl类说明
*/

define(function(require, exports, module) {

    /**
    * 构造函数式
    */
    // function slider_construct(){
    //     this.sliderUl = null;
    //     this.ctrl = false;
    //     this.autorun = {speed:5000};
    //     this.canRun = false;
    //     this.listN = 0;
    //     this.listC = 0;
    //     this.singW = 0;
    //     this.init=function(option){
    //             if(!option || !option.sliderUl){
    //                 console.log(this.tip_msg.error_prefix + this.tip_msg.lostsliderUl);
    //                 return false;
    //             }
    //             this.sliderUl = option.sliderUl;
    //             var list = this.sliderUl.find('.slider-item');
    //             if(list.length==0){
    //                 console.log(this.tip_msg.error_prefix + this.tip_msg.emptyLi);
    //                 return false;
    //             }
    //             this.listN = list.length;
    //             this.singW = option.singW || list.eq(0).width();
    //             if(list.length==1){
    //                 this.sliderUl.css({left:'0px'});
    //                 return false;
    //             }
    //             list.filter(':first').clone(true).appendTo(this.sliderUl);
    //             list.filter(':last').clone(true).prependTo(this.sliderUl);
    //             this.sliderUl.width((list.length+2)*this.singW)
    //                     .css({left:-this.singW+'px'});
    //             this.canRun = true;

    //             //开启控制器
    //             if(!!option.ctrl){
    //                 this.ctrl = $.extend(this.ctrl, option.ctrl);
    //                 this.loadctrl(option);
    //             }
    //             if(!!option.autorun || option.autorun=='undefined'){
    //                 this.autorun = $.extend(this.autorun, option.autorun);
    //                 this.auto(option);
    //             }
    //         };
    //     this.loadctrl = function(option){
    //         this.ctrl = Ctrl.newone();
    //         this.ctrl.warp = option.warp || this.sliderUl.parent();
    //         this.ctrl.len = this.listN;
    //         this.ctrl.kind = $.extend(this.ctrl.kind,option.ctrl);
    //         this.ctrl.init(this);
    //     };
    //     this.auto = function(option){
    //         if(!this.ctrl){
    //             this.loadctrl(option);
    //             this.ctrl.dots.hide();
    //             this.ctrl.sides.left.hide();
    //             this.ctrl.sides.right.hide();
    //         }
    //         this.ctrl.auto();
    //     };
    //     this.run=function(i){
    //             var self = this;
    //             if(!this.canRun) return false;
    //             this.canRun = false;
    //             this.sliderUl.animate({left:-this.singW*(i+1)+'px'},function(){
    //                 self.listC = i;
    //                 switch(i){
    //                 case -1:
    //                     self.golast();
    //                     break;
    //                 case self.listN:
    //                     self.gofirst();
    //                     break;
    //                 }
    //                 self.canRun = true;
    //             });
    //         };
    //     this.gofirst=function(){
    //             this.sliderUl.css({left:-this.singW+'px'});
    //             this.listC = 0;
    //         };
    //     this.golast=function(){
    //             this.sliderUl.css({left:-1*(this.listN)*this.singW+'px'});
    //             this.listC = this.listN-1;
    //         };
    //     this.tip_msg = {
    //             error_prefix : '图片轮播加载失败：',
    //             lostsliderUl : '没有指定容器。设置init函数{sliderUl:$jQuery-element}参数',
    //             emptyLi : '轮播内容为空，缺少LI元素'
    //         }
    // };
    
    // module.exports = slider_construct;


    /**
    * 对象式
    */
    var Slider = {
        sliderUl : null,
        ctrl: false,
        autorun: {speed:5000},
        canRun : false,
        listN : 0,
        listC : 0,
        singW : 0,
        init:function(option){
            if(!option || !option.sliderUl){
                console.log(this.tip_msg.error_prefix + this.tip_msg.lostsliderUl);
                return false;
            }
            this.sliderUl = option.sliderUl;
            var list = this.sliderUl.find('.slider-item');
            if(list.length==0){
                console.log(this.tip_msg.error_prefix + this.tip_msg.emptyLi);
                return false;
            }
            this.listN = list.length;
            this.singW = option.singW || list.eq(0).width();
            if(list.length==1){
                this.sliderUl.css({left:'0px'});
                return false;
            }
            list.filter(':first').clone(true).appendTo(this.sliderUl);
            list.filter(':last').clone(true).prependTo(this.sliderUl);
            this.sliderUl.width((list.length+2)*this.singW)
                    .css({left:-this.singW+'px'});
            this.canRun = true;

            //开启控制器
            if(!!option.ctrl){
                this.ctrl = $.extend(this.ctrl, option.ctrl);
                this.loadctrl(option);
            }
            //自动播放
            if(typeof option.autorun=='undefined' || !!option.autorun){
                this.autorun = $.extend(this.autorun, option.autorun);
                this.auto(option);
            }
        },
        loadctrl:function(option){
            this.ctrl = Ctrl.newone();
            this.ctrl.warp = option.warp || this.sliderUl.parent();
            this.ctrl.len = this.listN;
            this.ctrl.kind = $.extend(this.ctrl.kind,option.ctrl);
            this.ctrl.init(this);
        },
        auto:function(option){
            if(!this.ctrl){
                this.loadctrl(option);
                this.ctrl.dots.hide();
                this.ctrl.sides.left.hide();
                this.ctrl.sides.right.hide();
            }
            this.ctrl.auto();
        },
        run:function(i){
            if(!this.canRun) return false;
            this.canRun = false;
            var self = this;
            this.sliderUl.animate({left:-this.singW*(i+1)+'px'},function(){
                self.listC = i;
                switch(i){
                case -1:
                    self.golast();
                    break;
                case self.listN:
                    self.gofirst();
                    break;
                }
                self.canRun = true;
            });
        },
        gofirst:function(){
            this.sliderUl.css({left:-this.singW+'px'});
            this.listC = 0;
        },
        golast:function(){
            this.sliderUl.css({left:-1*(this.listN)*this.singW+'px'});
            this.listC = this.listN-1;
        },
        newone : function(){
            var newone = Object.create(Slider);
            newone.sliderUl = null;
            newone.canRun = false;
            newone.listN = 0;
            newone.listC = 0;
            newone.singW = 0;
            return newone;
        },
        tip_msg : {
            error_prefix : '图片轮播加载失败：',
            lostsliderUl : '没有指定容器。设置init函数{sliderUl:$jQuery-element}参数',
            emptyLi : '轮播内容为空，缺少LI元素'
        }
    };

    module.exports = Slider;



/**
* 控制器
* kind 控制器类型 side 两边，dot 右下角。
* 设置false关闭，默认全部开启。dot设置'num'，显示数字
* 默认显示全部控制器类型
* warp 控制器父元素。可定义，默认为父元素
* 控制器直接absolute到slider-list 中
* 样式包括 side: slider-ctrl-side-left | slider-ctrl-side-right
* dot: slider-ctrl-dot > slider-ctrl-dot-1 ...
*
*/
    var Ctrl = {
        slider : null,
        kind:{
            side:true,
            dot:true
        },
        warp : null,
        len : 0,
        dots : null,
        sides : null,
        makeside : function(){
            return "<div class='slider-ctrl-side-left'> < </div><div class='slider-ctrl-side-right'> > </div>"
        },
        makedot : function(){
            var dot = "</ul>";
            for(var i = this.len;i>0;i--){
                var dottext = this.kind.dot == 'num'?i:'';
                dot = "<li class='slider-ctrl-dot-"+i+"'>"+dottext+"</li>"+dot;
            }
            return "<ul class='slider-ctrl-dot'>"+dot;
        },
        //{len:len, warp:控制器父层, kind:{dot,side}}
        init : function(slider){
            this.slider = slider;

            var ctrlhtml = '';
            if(!!this.kind.side){
                ctrlhtml += this.makeside();
            }
            if(!!this.kind.dot){
                ctrlhtml += this.makedot();
            }

            this.warp.append(ctrlhtml);

            this.dots = this.warp.find('.slider-ctrl-dot li');
            this.sides = {
                left: this.warp.find('.slider-ctrl-side-left'),
                right: this.warp.find('.slider-ctrl-side-right')
            };
            this.sides.left.css({'margin-top':-1*(this.sides.left.height()/2)});
            this.sides.right.css({'margin-top':-1*(this.sides.right.height()/2)});

            this.dots.eq(0).addClass('active');
            this.bindEvent();
        },
        bindEvent : function(){
            var self = this;
            this.dots.on('click',function(){
                var i = $(this).index();
                self.slider.run(i);
                self.dots.eq(i).addClass('active').siblings().removeClass('active');
            });
            this.sides.left.on('click',function(){
                self.slider.run(self.slider.listC-1);
                self.dots.eq(self.slider.listC-1).addClass('active').siblings().removeClass('active');
            });
            this.sides.right.on('click',function(){
                self.slider.run(self.slider.listC+1);
                self.dots.eq((self.slider.listC+1)%self.slider.listN).addClass('active').siblings().removeClass('active');
            });
        },
        auto:function(){
            var self = this;
            var sliderT = 0;

            this.warp
            .on('mouseover',function(){
                clearInterval(sliderT);
            })
            .on('mouseout',function(){
                sliderT = setInterval(function(){
                        self.sides.right.triggerHandler('click');
                },self.slider.autorun.speed);
            });

            sliderT = setInterval(function(){
                    self.sides.right.triggerHandler('click');
            },self.slider.autorun.speed);

        },
        newone:function(){
            var newobj = Object.create(Ctrl);
            newobj.slider = null;
            newobj.kind = {
                side:true,
                dot:true
            };
            newobj.warp = null;
            newobj.len = 0;
            newobj.dots = null;
            newobj.sides = null;
            newobj.ctrl= false;
            return newobj;
        }

    }
});