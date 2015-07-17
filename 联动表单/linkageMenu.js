;function linkageMenu(opt){

    var linkageMenu = {
        ids:[],
        items:{},
        maps:{},
        prehandle:function(data,nd){
            nd = nd || this.items;
            for(var i=0,l=data.length;i<l;i++){
                var d = data[i];
                linkageMenu.maps[d.id] = d.pid || 0;

                nd[d.id] = JSON.parse(JSON.stringify(d));
                if(!!d.son && d.son.length>0){
                    nd[d.id].son = {};
                    arguments.callee(d.son,nd[d.id].son);
                }
            }
        },
        getSub:function(idpath){
            var data = this.items;
            if(!!idpath){
                for(var i=0,l=idpath.length;i<l;i++){
                    data = data[idpath[i]].son;
                    if(!data){
                        data = null
                        break;
                    }
                }
            }
            return data;
        },
        makeOpt:function(data){
            var tpl = '';
            for(var i in data){
                tpl += "<option data-linkm-pid='"+ data[i].pid +"'  data-linkm-id='"+ data[i].id +"' value='"+ data[i].id +"'>" +data[i].name+ "</option>";
            }
            return tpl;
        },
        insert:function(ele,tpl){
            if(!ele || tpl =='')return;
            var id = linkageMenu.placeholder[ele.id];
            if(id){
                tpl = "<option value=''>"+id+"</option>"+tpl;
            }
            $(ele).html(tpl);
            !!opt.afterfill && opt.afterfill(ele);
        },
        insertOpt:function(ele, idpath){
            var data = this.getSub(idpath),
                tpl = this.makeOpt(data);
            this.insert(ele,tpl);
        },
        addEvent:function(){
            for(var j =0,n=this.ids.length;j<n-1;j++){
                $(window[this.ids[j]]).on('change',function(){
                    var idpath = [], d = linkageMenu.items;
                    var i=0,l=linkageMenu.ids.length;
                    for(;i<l;i++){
                        var id = linkageMenu.ids[i],
                            v = window[id].value;
                        idpath.push(v);
                        if(this.id == id){
                            d = d[v]?d[v]:null;
                            break;
                        }
                        d[v].son && (d = d[v].son);
                    }
                    linkageMenu.setDefOpt(d,i);
                });
            }
        },
        defOpt:function(){
            var c = 0, ele = window[this.ids[c]];
            if(!ele)return;
            this.insertOpt(ele);
            var id = ele.value;
            var d = this.items[id];
            this.setDefOpt(d,c);
        },
        setDefOpt:function(d,c/*from*/){
            var idpath = [], ele = window[this.ids[c]];
            if(c>0){
                for(var i=c-1;i>=0;i--){
                    idpath.push(window[this.ids[i]].value);
                }
            }

            var l=this.ids.length;
            for(;c<l;c++){
                if(!ele)continue;
                var ele = window[this.ids[c+1]];
                if(!d || !d.son){
                    if(ele){
                        $(ele).empty();
                        !!opt.afterclear && opt.afterclear(ele);
                    }
                }else{
                    idpath.push(d.id);
                    this.insertOpt(ele,idpath);
                    d = d.son[ele.value];
                }
            }
        },
        setInit:function(id){
            var path = [id];
            for(var i=0,n=linkageMenu.ids.length;i<n-1;i++){
                if(this.maps[id]>0){
                    id = this.maps[id];
                    path.unshift(id);
                }else{
                    break;
                }
            }
            var d = this.items[path[0]];
            this.setDefOpt(this.items[path[0]],0);
            window[this.ids[0]].value = path[0];
            for(var i=1,l=path.length;i<l;i++){
                d = d.son[path[i]];
                this.setDefOpt(d,i);
                window[this.ids[i]].value = path[i];
            }
        },
        run:function(){
            this.addEvent();
            this.defOpt();
            if(opt.initId) this.setInit(opt.initId);
        }
    };

    linkageMenu.ids = opt.ids;
    linkageMenu.placeholder = opt.placeholder || {};
    return linkageMenu;
};