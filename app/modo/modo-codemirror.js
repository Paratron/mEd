/**
 * modo-codemirror.js
 * ==================
 * A CodeMirror Element for the modo library.
 */
define([], function () {
    var waiting = [],
        ready = false;

    function requestCodeMirror(callback){
        if(!ready){
            waiting.push(callback);
        } else {
            callback();
        }
    }

    (function () {
        var head = document.head || document.getElementsByTagName('head')[0];

        var s = document.createElement('script');
        s.onload = function(){
            ready = true;
            for(var i = 0; i < waiting.length; i++){
                waiting[i]();
            }
        };
        s.src = 'lib/js/codemirror.js';

        head.appendChild(s);

        var c = document.createElement('link');
        c.rel = 'stylesheet';
        c.type = 'text/css';
        c.href = 'lib/css/codemirror.css';
        head.appendChild(c);
    })();

    modo.CodeMirror = function(params){
        params || (params={});

        modo.Element.call(this, params);

        var settings = {
            mode: params.mode || 'javascript',
            lineNumbers: params.lineNumbers || false
        };

        this.addClass(modo.CodeMirror.classNames[0]);

        var that = this;

        this.cm = undefined;

        requestCodeMirror(function(){
            that.cm = CodeMirror(that.el[0], {
                mode: settings.mode,
                lineNumbers: settings.lineNumbers
            });

            var wrap = that.cm.getWrapperElement();
            setInterval(function(){
                wrap.style.height = that.el.height() + 'px';
            }, 1000);

            that.cm.on('change', function(i,c){
                that.trigger('change', that.get());
            });

            that.trigger('ready');
        });

        this.focus = function(){
            this.cm.focus();
        }

        this.get = function(){
            return this.cm.getValue();
        };

        this.set = function(data, options){
            var silent;

            options || (options={});

            silent = options.silent;

            this.cm.setValue(data);

            if(!silent){
                this.trigger('change', data);
            }

            return this;
        }
    };

    modo.CodeMirror.classNames = ['codemirror'];

    modo.CodeMirror.prototype = _.clone(modo.Element.prototype);

    return true;
});