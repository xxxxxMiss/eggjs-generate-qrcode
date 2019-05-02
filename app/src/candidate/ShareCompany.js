const multilineText = require('../utils/multilineText'),
  getTextWidth = require('../utils/getTextWidth'),
  drawDashLine = require('../utils/drawDashLine'),
  Canvas = require('canvas'),
  putImg = require('../utils/putImg'),
  axios = require('axios'),
  path = require('path')
const Image = Canvas.Image
class ShareCompany {
  constructor({
    ctx,
    info,
    width = 670,
    height = 717,
    apiHost = 'https://neitui-candidate.cheng95.com'
  } = {}) {
    this.info = Object.assign(
      {
        companyName: '',
        logo: '',
        industryName: '',
        scale: '',
        primaryColor: '#FF6644'
      },
      info
    )
    this.width = width
    this.height = height
    this.ctx = ctx
    this.apiHost = apiHost
    this.result = this.render()
  }
  async drawHeaderBg() {
    let canvas = new Canvas(this.width, 210)
    const ctx = canvas.getContext('2d')
    // 绘制纯色背景
    ctx.save()
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(this.width, 0)
    ctx.lineTo(this.width, 140)
    ctx.quadraticCurveTo(this.width / 2, 270, 0, 140)
    ctx.closePath()
    ctx.clip()
    ctx.fillStyle = this.info.primaryColor
    ctx.fill()
    // 插入图片
    await putImg(
      ctx,
      path.resolve(__dirname, '../../assets/share-bg.png'),
      0,
      0
    )
    // this.ctx.restore();
    let BG = new Image()
    BG.src = canvas.toBuffer()
    this.ctx.drawImage(BG, 0, 0, 670, 210)
  }
  drawQR() {
    return new Promise((resolve, reject) => {
      let url = encodeURIComponent('pages/position/position')
      axios
        .request({
          method: 'get',
          url: `${this.apiHost}/wechat/get_wxacode?page=${url}`,
          responseType: 'arraybuffer',
          headers: { Cookie: this.info.cookie }
        })
        .then(
          res => {
            if (res.headers['content-type'].indexOf('image') != -1) {
              let img = new Image()
              img.onload = () => {
                this.ctx.drawImage(
                  img,
                  this.width - 135 - 45,
                  this.height - 135 - 63,
                  135,
                  135
                )
              }
              img.onerror = err => {
                throw new Error(err)
              }
              img.src = res.data
              resolve()
            } else {
              reject(new Error('未获取小程序码'))
            }
          },
          err => {
            console.log(err)
            reject(err)
          }
        )
    })
  }
  drawBg() {
    this.ctx.save()
    this.ctx.fillStyle = '#fff'
    this.ctx.fillRect(0, 0, this.width, this.height)
    this.ctx.restore()
  }

  drawInfo() {
    this.ctx.save()
    this.ctx.fillStyle = '#333'
    this.ctx.textAlign = 'center'
    multilineText(this.ctx, this.info.companyName, {
      x: this.width / 2,
      y: 306 - 50,
      fontSize: this.info.companyName.length > 10 ? 36 : 50,
      maxWidth: 600
    })

    this.ctx.fillStyle = '#666'
    this.ctx.textAlign = 'left'

    const list = [this.info.industryName, ' · ', this.info.scale]
    const widthList = list.map(text => getTextWidth(this.ctx, text, 28, 400))
    let countWidth = 0
    widthList.forEach(width => (countWidth += width))
    if (countWidth < 400) {
      let text = list.join('')
      let x = this.width / 2 - countWidth / 2
      console.log('text', text)
      multilineText(this.ctx, text, {
        x,
        y: 382 - 50
      })
    } else {
      let y = 382 - 50 + 30
      ;[this.info.industryName, this.info.scale].forEach(item => {
        this.ctx.save()
        let x = this.width / 2 - getTextWidth(this.ctx, item) / 2
        this.ctx.font = `600 28px PingFangSC`
        this.ctx.textAlign = 'center'
        this.ctx.fillText(item, this.width / 2, y)
        y += 40
        this.ctx.restore()
      })
    }
    this.ctx.restore()
  }

  drawFooter() {
    this.ctx.save()
    this.ctx.strokeStyle = '#DDD'
    this.ctx.textBaseline = 'top'
    this.ctx.strokeWidth = 1
    drawDashLine(this.ctx, 60, 466, 610, 466)
    this.ctx.fillStyle = '#333'
    this.ctx.textAlign = 'left'
    this.ctx.font = 'bold 32px PingFangSC-Regular'
    this.ctx.fillText('海量职位热招中', 60, 531)
    this.ctx.fillStyle = '#666'
    this.ctx.font = '24px PingFangSC-Regular'
    multilineText(this.ctx, '长按识别二维码，投递简历享专属内推待遇', {
      x: 60,
      y: 597,
      maxRow: 2,
      maxWidth: 365
    })
    this.ctx.restore()
  }
  render() {
    this.drawBg()
    this.drawInfo()
    this.drawFooter()
    return Promise.all([this.drawHeaderBg(), this.drawQR()])
  }
}

module.exports = ShareCompany
