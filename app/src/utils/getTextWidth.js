const textWithEnter = require('./textWithEnter');
module.exports = (ctx, text, fontSize = 28, maxWidth = 200, fontFamily = 'PingFangSC-Regular') => {
    ctx.save();
    ctx.font = `bold ${fontSize}px ${fontFamily}`;
    ({ text, width } = textWithEnter(ctx, text, { maxWidth }));
    ctx.restore();
    return width;
};
