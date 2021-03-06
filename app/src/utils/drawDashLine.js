module.exports=(ctx, x1, y1, x2, y2, dashLen=5)=>{
    ctx.save();
    const xpos = x2 - x1, //得到横向的宽度;
        ypos = y2 - y1, //得到纵向的高度;
        numDashes = Math.floor(Math.sqrt(xpos * xpos + ypos * ypos) / dashLen);
    //利用正切获取斜边的长度除以虚线长度，得到要分为多少段;
    for(var i=0; i<numDashes; i++){
        if(i % 2 === 0){
            ctx.moveTo(x1 + (xpos/numDashes) * i, y1 + (ypos/numDashes) * i);
            //有了横向宽度和多少段，得出每一段是多长，起点 + 每段长度 * i = 要绘制的起点；
        }else{
            ctx.lineTo(x1 + (xpos/numDashes) * i, y1 + (ypos/numDashes) * i);
        }
    }
    ctx.stroke();
};
