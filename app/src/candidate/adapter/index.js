const isBrowserSide = (function(){
    let root=this,
        isBrowserSide=false;
    if(typeof window !=="undefined" && root===window){
        isBrowserSide=true;
    }
}).call(this);

const getDefaultAdapter=()=>{
    let adapter;
    if(isBrowserSide){
        adapter=require('./web');
    }else{
        adapter=require('./node');
    }
    return adapter;
};

module.exports = getDefaultAdapter();
