const Canvas = require('canvas')
const Image = Canvas.Image
const fs = require('fs')
const readFile = require('util').promisify(fs.readFile)

const Tools = {
  getTextWidth(ctx, text) {
    return text ? Math.round(ctx.measureText(text).width) : 0
  },
  getContext(width = 500, height = 400) {
    const canvas = new Canvas(width, height)
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, 500, 400)
    return ctx
  },
  getMaxLimit(ctx, str = '', start = 10, maxSize = 480) {
    if (str.length <= start) return str

    let result = ''
    for (let i = start; i < str.length; i++) {
      result = str.substring(0, i + 1)
      if (Math.round(ctx.measureText(result).width) > maxSize) {
        result = str.substring(0, i)
        result += '...'
        break
      }
    }
    return result
  },
  async drawImage(ctx, path, x = 0, y = 153, width, height) {
    if (Buffer.byteLength(path) === 0) return
    
    let squid = ''
    if (Buffer.isBuffer(path)) {
      squid = path
    } else {
      squid = await readFile(path)
    }
    const img = new Image
    img.src = squid

    width = width || img.width
    height = height || img.height
    ctx.drawImage(img, x, y, width, height)
  },
  drawRoundRect(ctx, x, y, width, height, radius, style) {
    const type = Tools.setStyle(ctx, style)
    ctx.beginPath()
    ctx.moveTo(x, y + radius)
    ctx.lineTo(x, y + height - radius)
    ctx.arcTo(x, y + height, x + radius, y + height, radius)
    ctx.lineTo(x + width - radius, y + height)
    ctx.arcTo(x + width, y + height, x + width, y + height - radius, radius)
    ctx.lineTo(x + width, y + radius)
    ctx.arcTo(x + width, y, x + width - radius, y, radius)
    ctx.lineTo(x + radius, y)
    ctx.arcTo(x, y, x, y + radius, radius)
    ctx[type]()
  },
  drawCircle(ctx, x, y, r, style) {
    const type = Tools.setStyle(ctx, style)
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 360 / 180)
    ctx[type]()
  },
  drawLine(ctx, x1, y1, x2, y2, style) {
    const type = Tools.setStyle(ctx, style)
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.setLineDash(ctx.dashSegments || [])
    ctx.lineTo(x2, y2)
    ctx[type]()
  },
  setStyle(ctx, style = {}) {
    const type = style.type || 'stroke' // fill
    Reflect.deleteProperty(style, 'type')
    if (typeof style === 'object') {
      Object.keys(style).forEach(key => {
        ctx[key] = style[key]
      })
    }
    return type
  }
}

module.exports = Tools
