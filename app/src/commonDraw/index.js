const Canvas = require('canvas')
const Image = Canvas.Image
const typeMap = require('./typeMap.js')
const drawItems = require('./drawItems.js')
const Img = require('./Img.js')
class Draw {
    constructor(
        { basic, main = [], items = [], cookie = '' } = {}
    ) {
        basic = Object.assign({ width: 670, backgroundColor: '#ffffff', color: '#000000' }, basic)
        let promiseList = []
        this.width = basic.width
        // 确定高度
        if (!basic.height) {
            let canvas = new Canvas(1000, 1000)
            let ctx = canvas.getContext('2d');
            let mainItem = []
            if (Array.isArray(main) && main.length > 1) {
                mainItem = items.filter((item) => main.includes(item.id))
            } else if (main == '*') {
                mainItem = items
            } else {
                throw Error('无法确定画布高度')
            }
            promiseList.push(this.getHeightByMain(ctx, mainItem).then((yEnd) => {
                this.height = info.yEnd
            }))
        } else {
            this.height = basic.height
        }
        return Promise.all(promiseList).then(() => {
            let canvas = new Canvas(this.width, this.height)
            this.ctx = canvas.getContext('2d');
            this.ctx.cookie = cookie
            this.drawBg(basic.backgroundColor)
            return this.drawItems(this.ctx, items).then(() => {
                return canvas
            })
        })
    }
    drawBg(color) {
        this.ctx.save();
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.restore();
    }
    getHeightByMain(ctx, items) {
        items.forEach(item => {
            if (typeof item == 'number') {
                item = { type: 'gap', height: item }
            }
        })
        return this.drawItems(ctx, items, true)
    }
    async drawItems(ctx, items, dry = false) {
        return drawItems(ctx, items, dry)
    }
}
module.exports = Draw
