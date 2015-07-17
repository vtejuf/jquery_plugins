var colorFeed = [

['#ffffff','#ffcccc','#ffcc99','#ffff99','#ffffcc','#99ff99','#99FFFF','#CCFFFF','#CCCCFF','#FFCCFF'],

['#cccccc','#FF6666','#FF9966','#FFFF66','#FFFF33','#66FF99','#33FFFF','#66FFFF','#9999FF','#FF99FF'],

['#c0c0c0','#FF0000','#FF9900','#FFCC66','#FFFF00','#33FF33','#66CCCC','#33CCFF','#6666CC','#CC66CC'],

['#999999','#CC0000','#FF6600','#FFCC33','#FFCC00','#33CC00','#00CCCC','#3366FF','#6633FF','#CC33CC'],

['#666666','#990000','#CC6600','#CC9933','#999900','#009900','#339999','#3333FF','#6600CC','#993399'],

['#333333','#660000','#993300','#996633','#666600','#006600','#336666','#000099','#333399','#663366'],

['#000000','#330000','#663300','#663333','#333300','#003300','#003333','#000066','#330099','#330033']

];

if (!("classList" in document.documentElement)) {
        Object.defineProperty(HTMLElement.prototype, 'classList', {
            get: function() {
                var self = this;
                function update(fn) {
                    return function(value) {
                        var classes = self.className.split(/\s+/g),
                            index = classes.indexOf(value);
                        
                        fn(classes, index, value);
                        self.className = classes.join(" ");
                    }
                }
                
                return {                    
                    add: update(function(classes, index, value) {
                        if (!~index) classes.push(value);
                    }),
                    
                    remove: update(function(classes, index) {
                        if (~index) classes.splice(index, 1);
                    }),
                    
                    toggle: update(function(classes, index, value) {
                        if (~index)
                            classes.splice(index, 1);
                        else
                            classes.push(value);
                    }),
                    
                    contains: function(value) {
                        return !!~self.className.split(/\s+/g).indexOf(value);
                    },
                    
                    item: function(i) {
                        return self.className.split(/\s+/g)[i] || null;
                    }
                };
            }
        });
    }

(function() {

    // Components.utils.import("resource://livemargins/apps/snapshot.js");
    var Utils = {
        parse: function(element) {
            return {
                x: parseInt(element.style.left, 10),
                y: parseInt(element.style.top, 10),
                w: parseInt(element.style.width, 10),
                h: parseInt(element.style.height, 10),
            }
        },
        qs: function(selector) {return document.querySelector(selector)},
        contains: function(node, otherNode) {
            if (node.contains) {
                return node.contains(otherNode);
            } else {
                // not really equivalent, but enough here
                return [].some.call(node.children,
                function(n){return n == otherNode});
            }
        }
    };
    var CropOverlay = {
        _listeners: {},
        _overlay: {},
        _status: {
            isMoving: false,
            isResizing: false,
            isNew: false,
        },
        _dblclick: function(evt) {
            Editor.current = {
                textContent: 'Crop'
            };
        },
        _display: function(x, y, w, h, ix, iy, iw, ih) {
            this._displayItem(this._overlay.overlay, x, y, w, h);
            this._displayItem(this._overlay.top, 0, 0, w, iy);
            this._displayItem(this._overlay.right, ix + iw, iy, w - (ix + iw), ih);
            this._displayItem(this._overlay.bottom, 0, iy + ih, w, h - (iy + ih));
            this._displayItem(this._overlay.left, 0, iy, ix, ih);
            this._displayItem(this._overlay.target, (iw ? ix: -5), (ih ? iy: -5), iw, ih);
            this._overlay.overlay.style.display = '';
        },
        _displayItem: function(element, x, y, w, h) {
            element.style.left = x + 'px';
            element.style.top = y + 'px';
            element.style.width = w + 'px';
            element.style.height = h + 'px';
        },
        _hide: function() {
            this._overlay.overlay.style.display = 'none';
        },
        _mousedown: function(evt) {
            var obj1 = Utils.parse(this._overlay.overlay);
            var x = obj1.x;
            var y = obj1.y;

            var obj2 = Utils.parse(this._overlay.target);
            var ix = obj2.x;
            var iy = obj2.y;

            var rx = evt.pageX - x;
            var ry = evt.pageY - y;
            if (this._overlay.target == evt.target) {
                this._status.isMoving = [rx - ix, ry - iy];
            } else if (Utils.contains(this._overlay.target, evt.target)) {
                this._status.isResizing = evt.target.id;
            } else {
                this._status.isNew = [rx, ry];
            }
            document.addEventListener('mousemove', this._listeners.mousemove, false);
            document.addEventListener('mouseup', this._listeners.mouseup, false);
            evt.stopPropagation();
            evt.preventDefault();
        },
        _mousemove: function(evt) {
            var obj = Utils.parse(this._overlay.overlay);
            var x = obj.x,
                y = obj.y,
                w = obj.w,
                h = obj.h;

            var obj2 = Utils.parse(this._overlay.target);
            var ix = obj2.x,
                iy = obj2.y,
                iw = obj2.w,
                ih = obj2.h;

            var rx = evt.pageX - x;
            var ry = evt.pageY - y;
            var nix, niy, nih, niw;
            if (this._status.isNew) {
                var startXY = this._status.isNew;
                rx = Math.min(Math.max(rx, 0), w);
                ry = Math.min(Math.max(ry, 0), h);
                nix = Math.min(startXY[0], rx);
                niy = Math.min(startXY[1], ry);
                nih = Math.abs(ry - startXY[1]);
                niw = Math.abs(rx - startXY[0]);
            } else if (this._status.isMoving) {
                var origXY = this._status.isMoving;
                nix = rx - origXY[0];
                niy = ry - origXY[1];
                nih = ih;
                niw = iw;
                nix = Math.min(Math.max(nix, 0), w - niw);
                niy = Math.min(Math.max(niy, 0), h - nih);
            } else if (this._status.isResizing) {
                switch (this._status.isResizing) {
                case 'ctrlnw':
                    nix = Math.min(Math.max(rx, 0), ix + iw - 50);
                    niy = Math.min(Math.max(ry, 0), iy + ih - 50);
                    nih = ih - (niy - iy);
                    niw = iw - (nix - ix);
                    break;
                case 'ctrlne':
                    nix = ix;
                    niy = Math.min(Math.max(ry, 0), iy + ih - 50);
                    nih = ih - (niy - iy);
                    niw = Math.min(Math.max(rx - nix, 50), w - nix);
                    break;
                case 'ctrlse':
                    nix = ix;
                    niy = iy;
                    nih = Math.min(Math.max(ry - niy, 50), h - niy);
                    niw = Math.min(Math.max(rx - nix, 50), w - nix);
                    break;
                case 'ctrlsw':
                    nix = Math.min(Math.max(rx, 0), ix + iw - 50);
                    niy = iy;
                    nih = Math.min(Math.max(ry - niy, 50), h - niy);
                    niw = iw - (nix - ix);
                    break;
                default:
                    break;
                }
            }
            this._display(x, y, w, h, nix, niy, niw, nih);
            evt.stopPropagation();
            evt.preventDefault();
        },
        _mouseup: function(evt) {
            this._status = {
                isMoving: false,
                isResizing: false,
                isNew: false,
            }
            document.removeEventListener('mousemove', this._listeners.mousemove, false);
            document.removeEventListener('mouseup', this._listeners.mouseup, false);
            evt.stopPropagation();
            evt.preventDefault();
        },
        _refreshImageData: function() {
            var obj = Utils.parse(this._overlay.target);
            var x = obj.x,
                y = obj.y,
                w = obj.w,
                h = obj.h;

            if (!h || !w) {
                return;
            }
            Editor.canvasData = Editor.ctx.getImageData(x, y, w, h);
        },
        init: function() {
            this._overlay = {
                overlay: Utils.qs('#crop'),
                top: Utils.qs('#croptop'),
                right: Utils.qs('#cropright'),
                bottom: Utils.qs('#cropbottom'),
                left: Utils.qs('#cropleft'),
                target: Utils.qs('#croptarget'),
            };
            this._listeners['dblclick'] = this._dblclick.bind(this);
            this._listeners['mousedown'] = this._mousedown.bind(this);
            this._listeners['mousemove'] = this._mousemove.bind(this);
            this._listeners['mouseup'] = this._mouseup.bind(this);
            this._hide();
        },
        start: function(x, y, w, h) {
            this._display(x, y, w, h, 0, 0, 0, 0);
            this._overlay.overlay.addEventListener('dblclick', this._listeners.dblclick, false);
            this._overlay.overlay.addEventListener('mousedown', this._listeners.mousedown, false);
        },
        cancel: function() {
            this._hide();
            this._overlay.overlay.removeEventListener('dblclick', this._listeners.dblclick, false);
            this._overlay.overlay.removeEventListener('mousedown', this._listeners.mousedown, false);
        },
        stop: function() {
            this._refreshImageData();
            Editor.updateHistory();
        }
    };
    var BaseControl = {
        _canvas: null,
        _ctx: null,
        _listeners: {},
        _origRect: null,
        _rect: null,
        _startxy: null,
        _isStartPoint: function(evt) {
            return evt.pageX - this._origRect[0] == this._startxy[0] &&
            evt.pageY - this._origRect[1] == this._startxy[1];
        },
        _mousedown: function(evt) {
            var rx = evt.pageX - this._origRect[0];
            var ry = evt.pageY - this._origRect[1];
            this._startxy = [rx, ry];
            document.addEventListener('mousemove', this._listeners.mousemove, false);
            document.addEventListener('mouseup', this._listeners.mouseup, false);
            evt.stopPropagation();
            evt.preventDefault();
        },
        _mousemove: function(evt) {
            var x = this._origRect[0];
            var y = this._origRect[1];
            var rx = Math.min(Math.max(evt.pageX - x, 0), this._origRect[2]);
            var ry = Math.min(Math.max(evt.pageY - y, 0), this._origRect[3]);
            var x = Math.min(rx, this._startxy[0]);
            var y = Math.min(ry, this._startxy[1]);
            var w = Math.abs(rx - this._startxy[0]);
            var h = Math.abs(ry - this._startxy[1]);
            if (evt.shiftKey) {
                w = Math.min(w, h);
                h = Math.min(w, h);
                if (x != this._startxy[0]) {
                    x = this._startxy[0] - w;
                }
                if (y != this._startxy[1]) {
                    y = this._startxy[1] - h;
                }
            }
            this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
            this._rect = [x, y, w, h];
            var dx = Math.min(3, x);
            var dy = 3;
            var dw = Math.min(x + w + 3, this._origRect[2]) - x + dx;
            var dh = Math.min(y + h + 3, this._origRect[3]) - y + dy;
            x += this._origRect[0];
            y += this._origRect[1];
            this._canvas.style.left = x - dx + 'px';
            this._canvas.style.top = y - dy + 'px';
            this._canvas.width = dw;
            this._canvas.height = dh;
            this._ctx.lineWidth = 3.0;
            this._ctx.strokeStyle = Color.selected;
            this._ctx.save();
            this._stroke(this._ctx, dx, dy, w, h);
            evt.stopPropagation();
            evt.preventDefault();
        },
        _mouseup: function(evt) {
            document.removeEventListener('mousemove', this._listeners.mousemove, false);
            document.removeEventListener('mouseup', this._listeners.mouseup, false);
            evt.stopPropagation();
            evt.preventDefault();
            this._refreshImageData();
            Editor.updateHistory();
        },
        _refreshImageData: function() {
            var arr = this._rect;
            var x = arr[0],
                y = arr[1],
                w = arr[2],
                h = arr[3];
            Editor.ctx.lineWidth = 3.0;
            Editor.ctx.strokeStyle = Color.selected;
            Editor.ctx.save();
            this._stroke(Editor.ctx, x, y, w, h);
        },
        _stroke: function(ctx, x, y, w, h) {},
        init: function() {
            this._listeners['mousedown'] = this._mousedown.bind(this);
            this._listeners['mousemove'] = this._mousemove.bind(this);
            this._listeners['mouseup'] = this._mouseup.bind(this);
        },
        start: function(x, y, w, h, canvasId, evtName) {
            if (!evtName) {
                evtName = 'mousedown';
            }
            this._canvas = document.createElement('canvas');
            this._ctx = this._canvas.getContext('2d');
            this._canvas.id = canvasId;
            Editor.canvas.className = canvasId;
            document.body.appendChild(this._canvas);
            this._origRect = [x, y, w, h];
            this._canvas.style.left = x + 'px';
            this._canvas.style.top = y + 'px';
            this._canvas.width = 0;
            this._canvas.height = 0;
            this._canvas.addEventListener(evtName, this._listeners[evtName], false);
            Editor.canvas.addEventListener(evtName, this._listeners[evtName], false);
        },
        cancel: function() {
            this._canvas.removeEventListener('mousedown', this._listeners.mousedown, false);
            Editor.canvas.removeEventListener('mousedown', this._listeners.mousedown, false);
            document.body.removeChild(this._canvas);
        }
    };

    var Rect = Object.create(BaseControl);

    // var Rect = {
    //     __proto__: BaseControl,
        Rect._canvas= null;
        Rect._ctx= null;
        Rect._listeners= {};
        Rect._origRect= null;
        Rect._rect= null;
        Rect._startxy= null;
        Rect._stroke= function(ctx, x, y, w, h) {
            ctx.strokeRect(x, y, w, h);
        };
        Rect.start= function(x, y, w, h) {
            BaseControl.start.bind(this)(x, y, w, h, 'rectcanvas');
        };
    // };

    var Circ = Object.create(BaseControl);
    // var Circ = {
    //     __proto__: BaseControl,
       Circ._canvas = null;
       Circ._ctx = null;
       Circ._listeners = {};
       Circ._origRect = null;
       Circ._rect = null;
       Circ._startxy = null;
       Circ._stroke = function(ctx, x, y, w, h) {
            this._strokeCirc(ctx, x, y, w, h);
        };
        Circ._strokeCirc= function(ctx, x, y, w, h) {
            // see http://www.whizkidtech.redprince.net/bezier/circle/kappa/
            var br = (Math.sqrt(2) - 1) * 4 / 3;
            var bx = w * br / 2;
            var by = h * br / 2;
            ctx.beginPath();
            ctx.moveTo(x + w / 2, y);
            ctx.bezierCurveTo(x + w / 2 + bx, y, x + w, y + h / 2 - by, x + w, y + h / 2);
            ctx.bezierCurveTo(x + w, y + h / 2 + by, x + w / 2 + bx, y + h, x + w / 2, y + h);
            ctx.bezierCurveTo(x + w / 2 - bx, y + h, x, y + h / 2 + by, x, y + h / 2);
            ctx.bezierCurveTo(x, y + h / 2 - by, x + w / 2 - bx, y, x + w / 2, y);
            ctx.closePath();
            ctx.stroke();
        };
        Circ.start= function(x, y, w, h) {
            BaseControl.start.bind(this)(x, y, w, h, 'circcanvas');
        };
    // };

    var TextInput = Object.create(BaseControl);
    // var TextInput = {
    //     __proto__: BaseControl,
        TextInput._canvas = null;
        TextInput._ctx = null;
        TextInput._input = null;
        TextInput._listeners = {};
        TextInput._origRect = null;
        TextInput._blur = function() {
            var msg = this._input.value;
            this._input.value = '';
            var x = parseInt(this._input.style.left, 10) - this._origRect[0];
            var y = parseInt(this._input.style.top, 10) - this._origRect[1];
            if (msg) {
                Editor.ctx.font = 'bold 14px/18px Arial,Helvetica,sans-serif';
                // why the offset ? baseline ?
                Editor.ctx.fillText(msg, x + 1, y + 14 + 1);
                Editor.updateHistory();
            }
        };
        TextInput._click= function(evt) {
            this._input.blur();
            Editor.ctx.fillStyle = Color.selected;
            Editor.ctx.save();
            this._input.style.left = evt.pageX + 'px';
            this._input.style.top = Math.min(Math.max(evt.pageY - 7, this._origRect[1]), this._origRect[1] + this._origRect[3] - 20) + 'px';
            this._input.style.width = Math.min(184, this._origRect[0] + this._origRect[2] - evt.pageX) + 'px';
            this._input.style.color = Color.selected;
            this._input.style.borderBottomColor = Color.selected;
            this._input.style.display = '';
            this._input.focus();
        };
        TextInput._hide= function() {
            this._input.style.display = 'none';
        };
        TextInput.init= function() {
            this._input = Utils.qs('#textinput');
            this._hide();
            this._listeners['blur'] = this._blur.bind(this);
            this._listeners['click'] = this._click.bind(this);
            this._input.addEventListener('blur', this._listeners.blur, false);
        };
        TextInput.start= function(x, y, w, h) {
            BaseControl.start.bind(this)(x, y, w, h, 'textcanvas', 'click');
        };
        TextInput.cancel= function() {
            this._input.value = '';
            this._canvas.removeEventListener('click', this._listeners.click, false);
            Editor.canvas.removeEventListener('click', this._listeners.click, false);
            document.body.removeChild(this._canvas);
            this._hide();
        };
    // };

    // var Line = Object.create(BaseControl);
// var Line = {
//     __proto__: BaseControl,
    // Line._canvas = null;
    // Line._ctx = null;
    // Line._listeners = {};
    // Line._origRect = null;
    // Line._rect = null;
    // Line._startxy = null;
    // Line._stroke = function(ctx, x, y, w, h) {
    //   ctx.beginPath();
    //   var dir = this._dir;
    //   if(dir == 1 || dir == 3){
    //     ctx.moveTo(x, y+h);
    //     ctx.lineTo(x+w, y);
    //   } else {
    //     ctx.moveTo(x, y);
    //     ctx.lineTo(x+w, y+h);
    //   }
    //   ctx.stroke();
    //   ctx.closePath();
    // };
    // Line.start = function(x, y, w, h) {
    //   BaseControl.start.bind(this)(x, y, w, h, 'linecanvas');
    // };
// };

    var Pencil = Object.create(BaseControl);
  // var Pencil = {
  //   __proto__: BaseControl,
    Pencil._canvas = null;
    Pencil._ctx = null;
    Pencil._listeners = {};
    Pencil._origRect = null;
    Pencil._radius = 1;
    Pencil._draw = function(x, y) {
      Editor.ctx.lineTo(x, y);
      Editor.ctx.stroke();
    };
    Pencil._mousedown = function(evt) {
      var rx = evt.pageX - this._origRect[0];
      var ry = evt.pageY - this._origRect[1];
      this._startxy = [rx, ry];
      Editor.ctx.lineWidth = 1.0;
      Editor.ctx.strokeStyle = Color.selected;
      Editor.ctx.fillStyle = Color.selected;
      Editor.ctx.moveTo(rx, ry);
      Editor.ctx.beginPath();
      document.addEventListener('mousemove', this._listeners.mousemove);
      document.addEventListener('mouseup', this._listeners.mouseup);
      evt.stopPropagation();
      evt.preventDefault();
    };
    Pencil._mouseup = function(evt) {
      if (this._isStartPoint(evt)) {
        var rx = evt.pageX - this._origRect[0];
        var ry = evt.pageY - this._origRect[1];
        var factor = 0.75;

        Editor.ctx.arc(rx, ry, BaseControl.lineWidth * factor, 0, Math.PI * 2, true);
        Editor.ctx.fill();
      }
      Editor.ctx.closePath();
      document.removeEventListener('mousemove', this._listeners.mousemove);
      document.removeEventListener('mouseup', this._listeners.mouseup);
      evt.stopPropagation();
      evt.preventDefault();
      this._refreshImageData();
      Editor.updateHistory();
    };
    Pencil._mousemove = function(evt) {
      var x = this._origRect[0];
      var y = this._origRect[1];
      var rx = Math.min(Math.max(evt.pageX - x, 0), this._origRect[2]);
      var ry = Math.min(Math.max(evt.pageY - y, 0), this._origRect[3]);
      this._draw(rx, ry);
      evt.stopPropagation();
      evt.preventDefault();
    };
    Pencil._refreshImageData = function() {},
    Pencil.start = function(x, y, w, h) {
      BaseControl.start.bind(this)(x, y, w, h, 'pencilcanvas');
    };
    Pencil.cancel = function() {
      BaseControl.cancel.bind(this)();
    };
  // };


    var Blur = Object.create(BaseControl);
    // var Blur = {
    //     __proto__: BaseControl,
        Blur._canvas = null;
        Blur._ctx = null;
        Blur._listeners = {};
        Blur._origData = null;
        Blur._bluredData = null;
        Blur._origRect = null;
        Blur._radius = 7;
        Blur._blurAround = function(x, y) {
            var sx = Math.max(0, x - this._radius);
            var sy = Math.max(0, y - this._radius);
            var ex = Math.min(this._origRect[2], x + this._radius);
            var ey = Math.min(this._origRect[3], y + this._radius);
            var dx = Math.min(3, sx);
            var dy = Math.min(3, sy);
            var dw = Math.min(ex + 3, this._origRect[2]) - sx + dx;
            var dh = Math.min(ey + 3, this._origRect[3]) - sy + dy;
            this._origData = Editor.ctx.getImageData(sx - dx, sy - dy, dw, dh);
            this._bluredData = this._origData;
            for (var i = 0; i < this._origData.width; i++) {
                for (var j = 0; j < this._origData.height; j++) {
                    if (Math.pow(i - (x - sx + dx), 2) + Math.pow(j - (y - sy + dy), 2) <= Math.pow(this._radius, 2)) {
                        this._calcBluredData(i, j);
                    }
                }
            }
            Editor.ctx.putImageData(this._bluredData, sx - dx, sy - dy);
        };
        Blur._calcBluredData = function(x, y) {
            var maxradius = Math.min(x, y, this._origData.width - 1 - x, this._origData.height - 1 - y);
            var radius = Math.min(3, maxradius);
            var tmp = [0, 0, 0, 0, 0];
            for (var i = x - radius; i <= x + radius; i++) {
                for (var j = y - radius; j <= y + radius; j++) {
                    for (var k = 0; k < 4; k++) {
                        tmp[k] += this._origData.data[this._xyToIndex(i, j, k)];
                    }
                    tmp[4] += 1;
                }
            }
            for (var i = 0; i < 4; i++) {
                this._bluredData.data[this._xyToIndex(x, y, i)] = Math.floor(tmp[i] / tmp[4]);
            }
        };
        Blur._refreshImageData = function() {},
        Blur._xyToIndex = function(x, y, i) {
            return 4 * (y * this._origData.width + x) + i;
        };
        Blur._mousemove = function(evt) {
            var x = this._origRect[0];
            var y = this._origRect[1];
            var rx = Math.min(Math.max(evt.pageX - x, 0), this._origRect[2]);
            var ry = Math.min(Math.max(evt.pageY - y, 0), this._origRect[3]);
            this._blurAround(rx, ry);
            evt.stopPropagation();
            evt.preventDefault();
        };
        Blur.start = function(x, y, w, h) {
            BaseControl.start.bind(this)(x, y, w, h, 'blurcanvas');
        };
        Blur.cancel = function() {
            BaseControl.cancel.bind(this)();
            this._origData = null;
            this._bluredData = null;
        };
    // };

    var Color = {
        _colorpicker: null,
        _hoverCss: null,
        _normalCss: null,
        _listeners: {},
        _selected: 'red',
        _usePrefix: false,
        get selected() {
            return this._selected;
        },
        set selected(color) {
            this._selected = color;
            // if (this._usePrefix) {
            //     this._normalCss.style.backgroundImage = '-moz-linear-gradient(bottom, ' + color + ', ' + color + '), url(./img/button.png)';
            //     this._hoverCss.style.backgroundImage = '-moz-linear-gradient(bottom, ' + color + ', ' + color + '), url(./img/button-hover.png)';
            // } else {
                // this._normalCss.style.backgroundImage = 'linear-gradient(to top, ' + color + ', ' + color + '), url(./img/button.png)';
                // this._hoverCss.style.backgroundImage = 'linear-gradient(to top, ' + color + ', ' + color + '), url(./img/button-hover.png)';
            // }
            // 
            Utils.qs('#toolbar > li:nth-of-type(1)').style.backgroundImage = 'linear-gradient(to top, ' + color + ', ' + color + '), url(./img/button.png)';
        },
        _click: function(evt) {
            this.toggle();
        },
        _select: function(evt) {
            this.selected = evt.target.getAttribute('color');
            this.toggle();
        },
        _init_color_table : function(){
            var html = "</table>";

            for(var l = colorFeed.length-1;l>=0;l--){
                html = "</tr>"+html;
                for(var j = colorFeed[l].length-1;j>=0;j--){
                    html = "<td class='color-item' style='background-color:"+colorFeed[l][j]+"' color='"+colorFeed[l][j]+"'></td>"+html;
                }
                html = "<tr>"+html;
            }

            return "<table>"+html;
        },
        init: function() {
            this._colorpicker = document.createElement('div');
            this._colorpicker.id = 'colorpicker';
            this._colorpicker.innerHTML = this._init_color_table();
            document.body.appendChild(this._colorpicker);

            this._listeners['click'] = this._click.bind(this);
            this._listeners['select'] = this._select.bind(this);

            this._colorpicker.addEventListener('click', this._listeners.select, false);
            this.toggle();

            // 跨域无效
            // var _cssRules = document.styleSheets[0].cssRules;
            // for (var i = 0, l = _cssRules.length; i < l; i++) {
            //     if (_cssRules[i].selectorText == '#toolbar > li:nth-of-type(1)') {
            //         this._normalCss = _cssRules[i];
            //         this._usePrefix = /^-moz-/.test(this._normalCss.style.backgroundImage);
            //         continue;
            //     }
            //     if (_cssRules[i].selectorText == '#toolbar > li:nth-of-type(1):hover') {
            //         this._hoverCss = _cssRules[i];
            //         continue;
            //     }
            //     if (this._normalCss && this._hoverCss) {
            //         break;
            //     }
            // }
        },
        toggle: function() {
            if (this._colorpicker.style.display == 'none') {
                this._colorpicker.style.display = '';
                document.addEventListener('click', this._listeners.click, false);
            } else if (this._colorpicker.style.display == '') {
                this._colorpicker.style.display = 'none';
                document.removeEventListener('click', this._listeners.click, false);
            }
        }
    }

    var Cancle = {
        init: function() {
        },
        click: function(evt) {
            var iframe = window.parent.document.getElementById('canvas_iframe');
            iframe.parentNode.removeChild(iframe);
            window.top.canvasCallback('cancle');
        }
    }

    var Editor = {
        _controls: {
            'Crop': CropOverlay,
            'Rectangle': Rect,
            'Circle': Circ,
            'Text': TextInput,
            'Blur': Blur,
            // 'Line': Line,
            'Pencil': Pencil,
            'Cancle': Cancle
        },
        _canvas: null,
        _ctx: null,
        _current: null,
        _history: [],
        get canvas() {
            return this._canvas;
        },
        set canvas(canvas) {
            this._canvas = canvas;
            this._ctx = this._canvas.getContext('2d');
        },
        get ctx() {
            return this._ctx;
        },
        get canvasData() {
            return this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        },
        set canvasData(data) {
            this.canvas.width = data.width;
            this.canvas.height = data.height;
            this.ctx.putImageData(data, 0, 0);
        },
        get current() {
            return this._current;
        },
        set current(newCurrent) {
            var oldText = this._current ? this._current.textContent.trim() : '';
            var newText = newCurrent ? newCurrent.textContent.trim() : '';
            //Color should not change current control
            if (newText == 'Color') {
                Color.toggle();
                return;
            }
            if (newText == 'Cancle') {
                Cancle.click();
                return;
            }
            //Cancel current control, conditionally crop
            if (oldText) {
                this._current.classList.remove('current');
                this.canvas.className = '';
                this._controls[oldText].cancel();
            }
            if (oldText == 'Crop' && newText == 'Crop') {
                this._controls[newText].stop();
            }
            //No need to set Undo/Local as current control
            if (newText == 'Undo') {
                this._undo();
            }
            if (newText == 'Local') {
                this._saveLocal();
            }
            if (['Undo', 'Local', ''].indexOf(newText) > -1 || oldText == newText) {
                this._current = null;
                return;
            }
            //Set new current control
            newCurrent.classList.add('current');
            this._controls[newText].start(parseInt(this.canvas.offsetLeft, 10), parseInt(this.canvas.offsetTop, 10), parseInt(this.canvas.offsetWidth, 10), parseInt(this.canvas.offsetHeight, 10));
            this._current = newCurrent;
            return;
        },
        init: function() {
            this.canvas = Utils.qs('#display');
            this.canvas.width = 1007;
            this.canvas.height = 656;
            // this.canvasData = SnapshotStorage.pop();
            this.updateHistory();
            this._disableUndo();
            this._setupToolbar();
            var self = this;
            document.body.addEventListener('keypress',
            function(evt) {
                if (evt.keyCode == 27) { //Esc
                    self.current = null;
                }
                if (evt.ctrlKey && evt.charCode == 115) { //^S
                    self.current = {
                        textContent: 'Local'
                    };
                    evt.preventDefault();
                }
                if (evt.ctrlKey && evt.charCode == 122) { //^Z
                    self.current = {
                        textContent: 'Undo'
                    };
                }
            },
            false); [CropOverlay, Rect, Circ, TextInput, Blur, Color, Pencil, Cancle].forEach(function(control) {
                control.init();
            });
        },
        updateHistory: function() {
            this._history.push(this.canvasData);
            if (this._history.length > 30) {
                this._history.shift();
                //this._history.splice(1, 1);
            }
            if (this._history.length > 1) {
                this._enableUndo();
            }
        },
        _setupToolbar: function() {
            var self = this; [].forEach.call(document.querySelectorAll('#toolbar > li'),
            function(li) {
                li.addEventListener('click',
                function(evt) {
                    self.current = evt.target;
                    evt.stopPropagation();
                },
                false);
            });
        },
        _undo: function() {
            if (this._history.length > 1) {
                this._history.pop();
                this.canvasData = this._history[this._history.length - 1];
                if (this._history.length <= 1) {
                    this._disableUndo();
                }
            }
        },
        _enableUndo: function() {
            Utils.qs('#toolbar > li:nth-of-type(7)').removeAttribute('disabled');
        },
        _disableUndo: function() {
            Utils.qs('#toolbar > li:nth-of-type(7)').setAttribute('disabled', 'true');
        },
        _saveLocal: function() {
            var uploadcat = this.canvas.getAttribute('uploadcat') || 'def';
            imageCat[uploadcat](this.canvas);
        }
    };

    var imageCat = {
        width:1000,
        imgtype: 'image/jpeg',
        user : function(canvas){
            imageCat.imgtype = canvas.getAttribute('imgtype');
            imageCat.width = 60;
            imageCat.height = 60;
            imageCat.run(canvas);
        },
        goods: function(canvas){
            imageCat.width = 350;
            imageCat.height = 350;
            imageCat.run(canvas);
        },
        shop: function(canvas){
            imageCat.def(canvas);
            imageCat.run(canvas);
        },
        def:function(canvas){
            var cw = !!canvas.style.width?canvas.style.width:!!canvas.offsetWidth?canvas.offsetWidth:imageCat.width,
                ch = !!canvas.style.height?canvas.style.height:!!canvas.offsetHeight?canvas.offsetHeight:cw;
            if(cw<=imageCat.width){
                imageCat.width = cw;
                imageCat.height = ch;
            }else if(cw>imageCat.width){
                imageCat.height = (imageCat.width/cw*ch).toFixed(2);
            }
        },
        run:function(canvas){
            var data = canvas.toDataURL(imageCat.imgtype);

            canvas.width = imageCat.width;
            canvas.height = imageCat.height;

            var img = new Image();

            img.onload = function() {
                canvas.getContext('2d').drawImage(img, 0, 0, imageCat.width, imageCat.height);
                var data = canvas.toDataURL(imageCat.imgtype,0.6);

                setTimeout(function(){
                    Cancle.click();
                },0);

                window.top.canvasCallback({
                        imgdata:data,
                        imgtype:imageCat.imgtype,
                        imgname:canvas.getAttribute('imgname')
                    });
            }
            img.src = data;
        }
    };

    var Filter ={
        grayscale : function (pixels) {

            var d = pixels.data;

            for (var i = 0; i < d.length; i += 4) {
              var r = d[i];
              var g = d[i + 1];
              var b = d[i + 2];
              d[i] = d[i + 1] = d[i + 2] = (r+g+b)/3;
            }

            return pixels;

        },
        sepia : function (pixels) {

            var d = pixels.data;

            for (var i = 0; i < d.length; i += 4) {
              var r = d[i];
              var g = d[i + 1];
              var b = d[i + 2];
              d[i]     = (r * 0.393)+(g * 0.769)+(b * 0.189); // red
              d[i + 1] = (r * 0.349)+(g * 0.686)+(b * 0.168); // green
              d[i + 2] = (r * 0.272)+(g * 0.534)+(b * 0.131); // blue
            }

            return pixels;

        },
        red : function (pixels) {
            
            var d = pixels.data;

            for (var i = 0; i < d.length; i += 4) {
              var r = d[i];
              var g = d[i + 1];
              var b = d[i + 2];
              d[i] = (r+g+b)/3;        // 红色通道取平均值
              d[i + 1] = d[i + 2] = 0; // 绿色通道和蓝色通道都设为0
            }

            return pixels;

        },
        brightness : function (pixels, delta) {

            var d = pixels.data;

            for (var i = 0; i < d.length; i += 4) {
                  d[i] += delta;     // red
                  d[i + 1] += delta; // green
                  d[i + 2] += delta; // blue   
            }

            return pixels;

        },
        invert : function (pixels) {

            var d = pixels.data;

            for (var i = 0; i < d.length; i += 4) {
                d[i] = 255 - d[i];
                d[i+1] = 255 - d[i + 1];
                d[i+2] = 255 - d[i + 2];
            }

            return pixels;

        }
    };

    window.addEventListener('load',
    function(evt) {
        Editor.init();
    },
    false);
    window.addEventListener('beforeunload',
    function(evt) {
        if (Editor._history.length > 1) {
            evt.preventDefault();
        }
    },
    false);
})();