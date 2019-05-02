module.exports = function handleNegativeAxis(ctx,options) {
    // 负值坐标处理
    let { height, width } = ctx.canvas
    if (options.x < 0) {
        options.x += width
    }
    if (options.y < 0) {
        options.y += height
    }
    return options
}
