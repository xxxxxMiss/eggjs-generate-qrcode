const handleNegativeAxis = require('./handleNegativeAxis.js')
class Gap {
    constructor(ctx, options = {}, dry = false) {
        options = {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            ...options
        }
        options = handleNegativeAxis.call(this, ctx, options)
        return { x: options.x, y: options.x, xEnd: options.x + options.width, yEnd: options.y + options.height }
    }
}
module.exports = Gap
