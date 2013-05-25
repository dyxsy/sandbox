/*
 * A interface for helping widgets to store something business data
 * 
 * For example:
 * Ext.define('MyWindow', {
 *     mixins: {
 *         stashHelper: 'Finance.util.StashHelper'
 *     }
 * });
 *
 * var win = Ext.create('MyWindow');
 * 
 * win.addStash('name', 'Lily');
 * win.getStash('name');      // 'Lily'
 *
 * win.addStash({ name: 'Lily', age: 23 });
 * win.getStash('age');       //  23
 *
 * win.clearStash();
 * win.getStash('name');      //  undefined or null
 *
 */
Ext.define('Ninja.util.StashHelper', {
    stashMap: {},

    addStash: function(key, value){
        if(arguments.length == 1){
            if(Ext.isObject(key)){
                Ext.apply(this.stashMap, key);
            }
        }else{
            this.stashMap[key] = value;
        }
    },
    getStash: function(key){
        return this.stashMap[key];
    },
    clearStash: function(){
        this.stashMap = {};
    }

});



