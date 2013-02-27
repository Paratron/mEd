/**
 * settings
 * ===========
 * description
 */
define([], function(){
    return new (Backbone.Model.extend({
        defaults: {
            style: 'github'
        }
    }))();
});