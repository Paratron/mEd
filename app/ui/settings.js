/**
 * settings.js
 * ===========
 * description
 */
define(['modules/gear'], function (gear) {
    var ui = modo.generate([
        {
            type:'PopUp',
            ref:'pop_settings',
            params:{
                className:'pop-modal',
                modal:true
            },
            children:[
                {
                    type:'Label',
                    params:{
                        className:'headline',
                        value:'Settings'
                    }
                },
                {
                    type: 'Label',
                    params: {
                        className: 'smallheadline',
                        value: 'Render Style'
                    }
                },
                {
                    type:'List',
                    ref: 'list',
                    params:{
                        className:'stylepicker',
                        data:gear.get('styles_available'),
                        item_render:function (d, i, k) {
                            var html = '<div' + (gear.get('style') === k ? ' class="active"' : '') + '>';

                            html += '<b>'+ d.title + (gear.get('style') === k ? ' <span>(selected)</span>' : '') + '</b>';
                            if(d.url){
                                html += '<span>by <a target="_blank" href="' + d.url + '">' + d.author + '</a></span>';
                            } else {
                                html += '<span>by ' + d.author + '</span>';
                            }

                            html += '</div>';
                            return html;
                        },
                        item_events: {
                            click: function(e,i,d){
                                gear.set_style(i);
                            },
                            'click a': function(e){
                                e.stopPropagation();
                            }
                        }
                    }
                }
            ]
        }
    ]);

    gear.on('change:style', function(){
        ui.list.update();
    });

    return ui;
});