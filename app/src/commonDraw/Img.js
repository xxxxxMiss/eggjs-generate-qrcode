const drawItems = require('./drawItems.js')
const Canvas = require('canvas')
const Image = Canvas.Image
const axios = require('axios')
const handleNegativeAxis = require('./handleNegativeAxis.js')
class Img {
    constructor(ctx, options = {}, dry = false) {
        options = {
            x: 0,
            y: 0,
            cookie: false,
            ...options
        };
        options = handleNegativeAxis.call(this, ctx, options);
        ({
            items: this.items,
            x: this.x,
            y: this.y,
            url: this.url,
            width: this.width,
            height: this.height,
        } = options)
        this.widthCookie = options.cookie
        this.ctx = ctx
        return this.getImg(dry)
    }
    getImg(dry) {
        // dry，存在宽高，直接返回
        if (dry && this.width && this.height) {
            return { x: this.x, y: this.y, xEnd: this.x + this.width, yEnd: this.y + this.height }
        }
        let requestOptions = {
            method: 'get',
            url: this.url,
            responseType: 'arraybuffer',
        }
        if (this.widthCookie) {
            requestOptions.headers = { 'Cookie': this.ctx.cookie }
        }
        return axios.request(requestOptions).then(res => {
            return new Promise((reslove, reject) => {
                let img = new Image();
                img.onload = () => {
                    this.setSize(img)
                    !dry && this.ctx.drawImage(img, this.x, this.y, this.width, this.height)
                    reslove({ x: this.x, y: this.y, xEnd: this.x + this.width, yEnd: this.y + this.height })
                }
                img.onerror = (err) => { console.log('error', err); reject(err) }
                img.src = res.data
            })
        }, (err) => { console.log(err) })
    }
    setSize(img) {
        if (this.width != undefined && this.height != undefined) {
            return
        }
        if (this.width == undefined && this.height == undefined) {
            this.height = img.height
            this.width = img.width
            return
        }
        if (this.width == undefined) {
            this.width = this.height / img.height * img.width
            return
        }
        if (this.height == undefined) {
            this.height = this.width / img.width * img.height
            return
        }
    }
}
module.exports = Img
