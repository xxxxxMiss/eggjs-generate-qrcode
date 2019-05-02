const typeMap = require('./typeMap.js')
const drawItems = require('./drawItems.js')
const handleNegativeAxis = require('./handleNegativeAxis.js')
function getAnotherAxis(axis) {
    if (axis == 'x') {
        return 'y'
    } else {
        return 'x'
    }
}
class Group {
    constructor(ctx, options = {}, dry = false) {
        options = {
            x: 0,
            y: 0,
            axis: 'x' || 'y',
            ...options
        };
        options = handleNegativeAxis.call(this, ctx, options);
        ({
            items: this.items,
            x: this.x,
            x: this.xEnd,
            y: this.y,
            y: this.yEnd,
            axis: this.axis
        } = options)
        return this.drawItems(ctx, dry)
    }
    async drawItems(ctx, dry) {
        let axis = this.axis
        let anotherAxis = getAnotherAxis(axis)
        let items = this.items
        for (let index in items) {
            let item = items[index]
            item[axis] = (index == 0 && item[axis] != undefined) ? item[axis] : this[axis + 'End']
            item[anotherAxis] = item[anotherAxis] == undefined ? this[anotherAxis] : item[anotherAxis]
            let { xEnd, yEnd } = await drawItems(ctx, item, dry)
            if (xEnd == undefined && yEnd == undefined) { continue }
            if (xEnd > this.xEnd || !this.xEnd) { this.xEnd = xEnd }
            if (yEnd > this.yEnd || !this.yEnd) { this.yEnd = yEnd }
        }
        return { x: this.x, y: this.y, xEnd: this.xEnd, y }
    }

}
module.exports = Group
