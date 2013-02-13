/**
 * md-edit
 * =======
 * description
 */

require.config({
   //urlArgs:"bust=" + (new Date()).getTime() //Remove after development
});

define(['ui/base'], function (ui) {

    ui.codemirror.on('ready', function(){
        ui.codemirror.focus();
    });

    ui.codemirror.on('change', function(content){
        ui.preview.set(content);
    });

    modo.init(ui.root);
});