define(function(require, exports, module) {
    var slider = {
        sliderUl : null,
        canRun : false,
        listN : 0,
        listC : 0,
        singW : 0,
        init:function(option){
            if(!option || !option.sliderUl){
                console.log(slider.tip_msg.error_prefix + slider.tip_msg.lostsliderUl);
                return false;
            }
            slider.sliderUl = option.sliderUl;
            var list = slider.sliderUl.find('li');
            if(list.length==0){
                console.log(slider.tip_msg.error_prefix + slider.tip_msg.emptyLi);
                return false;
            }
            slider.listN = list.length;
            slider.singW = list.eq(0).width();
            if(list.length==1){
                slider.sliderUl.css({left:1*(slider.singW*1/2)+'px'});
                return false;
            }
            list.filter(':lt(2)').clone(true).appendTo(slider.sliderUl);
            list.filter(':gt(-3)').clone(true).prependTo(slider.sliderUl);
            slider.sliderUl.width((list.length+4)*slider.singW)
                    .css({left:-1*(slider.singW*3/2)+'px'});
            slider.canRun = true;
        },
        run:function(i){
            if(!slider.canRun) return false;
            slider.canRun = false;
            slider.sliderUl.animate({left:-1*((slider.singW*3/2)+slider.singW*i)+'px'},function(){
                slider.listC = i;
                switch(i){
                case -1:
                    slider.golast();
                    break;
                case slider.listN:
                    slider.gofirst();
                    break;
                }
                slider.canRun = true;
            });
        },
        gofirst:function(){
            slider.sliderUl.css({left:-1*(slider.singW*3/2)+'px'});
            slider.listC = 0;
        },
        golast:function(){
            slider.sliderUl.css({left:-1*((slider.singW*3/2)+(slider.listN-1)*slider.singW)+'px'});
            slider.listC = slider.listN-1;
        },
        tip_msg : {
            error_prefix : '图片轮播加载失败：',
            lostsliderUl : '没有指定容器。设置init函数{sliderUl:$jQuery-element}参数',
            emptyLi : '轮播内容为空，缺少LI元素'
        }
    };

    module.exports = slider;
});