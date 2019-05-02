
// const path = require('path')
module.exports = function name(ctx, src, ...options) {
  const Canvas = require('canvas')
const Image = Canvas.Image
    const img = new Image()
    img.onload = () => ctx.drawImage(img, ...options)
    img.onerror = err => { throw err }
    img.src = src
}
