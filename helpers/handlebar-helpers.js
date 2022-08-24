module.exports = {

    select : function(selected, options){
        // returning the data
        return options.fn(this).replace( new RegExp('value\="' + selected +'\"'),'$&selected="selected"')
    }
}