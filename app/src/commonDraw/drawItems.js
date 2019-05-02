const typeMap = require('./typeMap.js')
const drawOne = async (ctx, item, dry) => {
    if (typeMap[item.type]) {
        let Type = typeMap[item.type]
        let { type, ...options } = item
        // dry，跳过不可计算项
        if (dry && (y < 0)) {
            return undefined
        }
        info = await new Type(ctx, options, dry)
        return { x: info.x, y: info.y, xEnd: info.xEnd, yEnd: info.yEnd }
    } else {
        console.error('不存在该type', item.type)
    }
}
module.exports = async function drawItems(ctx, items, dry = false) {
    let x = y = Number.POSITIVE_INFINITY
    let xEnd = yEnd = Number.NEGATIVE_INFINITY
    if (Array.isArray(items)) {
        for (let item of items) {
            let info = await drawOne(ctx, item, dry)
            if (info === undefined) {
                continue
            }
            if (info.x < x) {
                x = info.x
            }
            if (info.y < y) {
                y = info.y
            }
            if (info.xEnd > xEnd) {
                xEnd = info.xEnd
            }
            if (info.yEnd > yEnd) {
                yEnd = info.yEnd
            }
        }
    } else {
        let info = await drawOne(ctx, items, dry);
        ({ x, y, xEnd, yEnd } = info)
    }
    // 未绘制
    if (xEnd < x) {
        xEnd = x
    }
    if (yEnd < y) {
        yEnd = y
    }
    console.log('drawinfo', x, y, xEnd, yEnd)
    return { x, y, xEnd, yEnd }
}
