define(function(require,exports,modules){

/**
 * 触发标签属性
 * data-modaler='normal' data-modaler-id='login-win' data-modaler-css='login-win' data-modaler-title='登录' data-modaler-content=''
 * 
 * 弹窗修改配置,允许部分替换
 * $('ele').modaler({
        type:'',
        modalid:'',
        modalcss:'',
        title:'',
        content:'',
        submit:'确定',
        cancle:'取消'
    });
 * 
 * 类型包括
 * normal
 * alert
 * confirm
 */

    $(document).on('click',"[data-modaler]",function(){
        //bgcover
        if(!window.bgcover)
            $('body').append("<div id='bgcover'></div>");

        var modalid = '#'+$(this).attr('data-modaler-id');
        scrollCtrl._scrollStop();
        $('#bgcover').show();
        var margin_t = ($(modalid).height()/-2+$(document).scrollTop()).toFixed()+'px';
        var margin_l = ($(modalid).width()/-2).toFixed()+'px';
        $(modalid+':hidden').css({"z-index":"1000",'margin-top':margin_t,'margin-left':margin_l}).fadeIn(200);
    })
    .on('click','.modaler .close',function(){
        $(this).closest('.modaler').fadeOut(200,function(){
            scrollCtrl._scrollStart();
            $('#bgcover').hide();
        });
    })
    .on('click','.modaler .cancle',function(){
        $(this).closest('.modaler').fadeOut(200,function(){
            scrollCtrl._scrollStart();
            $('#bgcover').hide();
        });
    })
    .on('click','#bgcover',function(){
        $('.modaler:visible').fadeOut(200,function(){
            scrollCtrl._scrollStart();
            $('#bgcover').hide();
        });
    });

    $.fn.modaler = function(opt){
        var def = {
            type:'',
            modalid:'',
            modalcss:'',
            title:'',
            content:'',
            submit:'确定',
            cancle:'取消'
        };
        opt  = $.extend(def,opt);

        var $this = $(this);
        var optOld = $this.data('plugins-modaler-opt') || opt;

        opt.type = $this.attr('data-modaler') || opt.type || optOld.type,
        opt.modalid = $this.attr('data-modaler-id') || opt.modalid || optOld.modalid,
        opt.modalcss = $this.attr('data-modaler-css') || opt.modalcss || optOld.modalcss,
        opt.title = $this.attr('data-modaler-title') || opt.title || optOld.title,
        opt.content = $this.attr('data-modaler-content') || opt.content || optOld.content,
        opt.submit = $this.attr('data-modaler-submit') || opt.submit || optOld.submit,
        opt.cancle = $this.attr('data-modaler-cancle') || opt.cancle || optOld.cancle;

        $this.attr('data-modaler', opt.type);
        $this.attr('data-modaler-id', opt.modalid);

        var tpl = {
            base : "<div id='{{modalid}}' class='{{modalcss}} modaler'><a class='close fa fa-times-circle'></a><div class='modaler-title'>{{title}}</div><div class='modaler-content'>{{content}}</div><div class='modaler-footer'>{{footer}}</div></div>",
            alert:"<div><a href='javascript:;' class='cancle btn btn-warning'>{{cancle}}</a></div>",
            confirm:"<div><a href='javascript:;' class='cancle btn btn-default'>{{cancle}}</a><a href='javascript:;' class='btn btn-primary'>{{submit}}</a></div>"
        };

        function fillbase(){
            return tpl.base.replace(/{{(.+?)}}/g, function(t,s){
                return opt[s] || '';
            });
        }
        function fillalert(){
            opt.footer = tpl.alert.replace(/{{(.+?)}}/g, function(t,s){
                return opt[s] || s;
            });
            return fillbase();
        }
        function fillconfirm(){
            opt.footer = tpl.confirm.replace(/{{(.+?)}}/g, function(t,s){
                return opt[s] || s;
            });
            return fillbase();
        }

        var output = '';
        switch(opt.type){
        case "normal":
            output = fillbase();
            break;
        case "alert":
            output = fillalert();
            break;
        case "confirm":
            output = fillconfirm();
            break;
        }

        if(window[opt.modalid]){
            $('#'+opt.modalid).remove();
        }
        $('body').append(output);
        $('#'+opt.modalid).data('plugins-modaler-opt',opt);
    }

    $("[data-modaler]").each(function(){
        $(this).modaler();
    });

});