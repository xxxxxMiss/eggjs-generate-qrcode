const multilineText = require('../utils/multilineText.js')
const getTextSize = require('../utils/getTextSize.js')
const handleNegativeAxis = require('./handleNegativeAxis.js')
class Text {
    constructor(ctx, options = {}, dry = false) {
        options = Object.assign({
            x: 0,
            y: 0,
            maxWidth: 600
        }, options)
        options = handleNegativeAxis.call(this, ctx, options);
        let text = options.text
        if (text == undefined) {
            console.log('缺少文字内容')
            return
        }
        delete options.text
        if (dry) {
            let { width, height } = getTextSize(ctx, text, options)
            return { x: options.x, y: options.y, xEnd: options.x + width, yEnd: options.y + height }
        } else {
            return multilineText(ctx, text, options)
        }
    }
}
module.exports = Text
