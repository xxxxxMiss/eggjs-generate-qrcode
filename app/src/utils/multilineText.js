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
    ctx.font = `${options.fontWeight} ${options.fontSize}px ${options.fontFamily}`;
    let width, height
    ({ text, width, height } = textWithEnter(ctx, text, options));
    if (options.fillStyle) { ctx.fillStyle = options.fillStyle; }
    text.split(options.splitStr).forEach((text, i) => {
        ctx.fillText(text, options.x, options.y + i * options.lineHeight * options.fontSize);
    });
    ctx.restore();
    return { x: options.x, y: options.y, xEnd: options.x + width, yEnd: options.y + height }
};
