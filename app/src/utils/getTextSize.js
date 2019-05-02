const textWithEnter = require('./textWithEnter');
module.exports = (ctx, text, options) => {
    options = Object.assign({
        x: 0,
        y: 0,
        fontSize: 28,
        maxWidth: 600,
        maxRow: 1,
        splitStr: '\n',
        fontFamily: "PingFangSC-Regular",
        fontWeight: 'normal',
        lineHeight: 1.5
    }, options);
    ctx.save();
    ctx.textBaseline = 'top';
    ctx.font = `bold ${options.fontSize}px ${options.fontFamily}`;
    let width, height
    ({ text, width, height } = textWithEnter(ctx, text, options));
    ctx.restore();
    return { width, height };
}
