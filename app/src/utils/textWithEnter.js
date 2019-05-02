module.exports = (ctx, text = '', options) => {
    const { splitStr, maxWidth, maxRow } = Object.assign({ splitStr: '\n', maxWidth: 200, maxRow: 1 }, options);
    let blockWidth = 0
    const computed = (text) => {
        let textCache = '', row = 1;
        const core = (text) => {
            let index = 0;
            let lineWidth = ctx.measureText(text.slice(0, index)).width;
            while (lineWidth <= maxWidth && index < text.length) {
                lineWidth = ctx.measureText(text.slice(0, index)).width
                textCache += text.charAt(index);
                index++;
            }
            lineWidth = ctx.measureText(text.slice(0, index)).width
            if (index < text.length) {
                if (row < maxRow || maxRow === 'none') {
                    row += 1;
                    textCache += splitStr;
                    core(text.slice(index));
                } else {
                    textCache = textCache.slice(0, -2);
                    textCache += '...';
                }
            }
            if (lineWidth > blockWidth) {
                blockWidth = lineWidth
            }
        };
        core(text);
        return textCache
    };
    text = text.split('\n').map((text) => computed(text)).join('\n')
    let height = text.split(options.splitStr).length * options.lineHeight * options.fontSize
    return { text, width: blockWidth, height };
};
