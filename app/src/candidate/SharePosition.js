const multilineText = require('../utils/multilineText'),
  getTextWidth = require('../utils/getTextWidth'),
  drawDashLine = require('../utils/drawDashLine'),
  textWithEnter = require('../utils/textWithEnter'),
  Canvas = require('canvas'),
  putImg = require('../utils/putImg'),
  axios = require('axios'),
  path = require('path')
const Image = Canvas.Image
class SharePosition {
  static getHeight(ctx, requirement, width = 670) {
    ctx.save()
    ctx.font = '28px PingFangSC-Regular'
    const height =
      textWithEnter(ctx, requirement, {
        maxWidth: 540,
        maxRow: 'none',
        splitStr: '\n',
        lineHeight: 1.7
      }).text.split('\n').length *
        48 +
      1150
    ctx.restore()
    return height
  }

  constructor({
    ctx,
    info,
    height = 1681,
    width = 670,
    apiHost = 'https://neitui-candidate.cheng95.com'
  } = {}) {
    this.info = Object.assign(
      {
        companyName: '',
        logo: '',
        industryName: '',
        scale: '',
        positionName: '',
        salary: '',
        isUrgency: false,
        requirement: '',
        address: '',
        id: '',
        primaryColor: '#FF6644'
      },
      info
    )
    this.apiHost = apiHost
    this.width = width
    this.height = height
    this.ctx = ctx
    this.result = this.render()
  }
  drawQR() {
    return new Promise((resolve, reject) => {
      let hostUrl = this.apiHost
      let url = encodeURIComponent('pages/position/detail/detail')
      axios
        .request({
          method: 'get',
          url: `${hostUrl}/wechat/get_wxacode?page=${url}${
            this.info.id ? `&position_id=${this.info.id}` : ''
          }`,
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
                  (this.width - 235) / 2,
                  this.height - 440,
                  235,
                  235
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
    this.ctx.fillStyle = '#FFF'
    this.ctx.fillRect(0, 0, this.width, this.height)
    this.ctx.restore()
  }
  async drawHeaderBg() {
    let canvas = new Canvas(this.width, 162)
    const ctx = canvas.getContext('2d')
    // 绘制纯色背景
    ctx.save()
    ctx.fillStyle = this.info.primaryColor
    ctx.fillRect(0, 0, this.width, 162)
    ctx.restore()
    await putImg(
      ctx,
      path.resolve(__dirname, '../../assets/positionbg.png'),
      320,
      0,
      350,
      162
    )
    let BG = new Image()
    BG.src = canvas.toBuffer()
    this.ctx.drawImage(BG, 0, 0, 670, 162)
  }
  drawHeader() {
    this.ctx.save()
    this.ctx.strokeStyle = '#DDD'
    this.ctx.textBaseline = 'top'
    this.ctx.strokeWidth = 1
    const dashLineY = 290
    drawDashLine(this.ctx, 60, dashLineY, 610, dashLineY)
    this.ctx.restore()
    this.ctx.save()
    this.ctx.fillStyle = '#fff'
    this.ctx.align = 'left'
    this.ctx.textBaseline = 'top'
    multilineText(this.ctx, this.info.companyName, {
      x: 100 - 50,
      y: 40,
      fontSize: 40
    })
    const list = [this.info.industryName, ' · ', this.info.scale]
    const widthList = list.map(text => getTextWidth(this.ctx, text, 24, 400))
    let countWidth = 0
    widthList.forEach(width => (countWidth += width))
    if (countWidth < 400) {
      let text = list.join('')
      multilineText(this.ctx, text, {
        x: 50,
        fontSize: 24,
        y: 98
      })
    } else {
      let y = 90
      ;[this.info.industryName, this.info.scale].forEach(item => {
        multilineText(this.ctx, item, {
          x: 50,
          fontSize: 24,
          y
        })
        y += 30
      })
    }
    this.ctx.restore()
  }

  async drawPosition() {
    this.ctx.save()
    this.ctx.fillStyle = '#333'
    this.ctx.align = 'left'
    this.ctx.textBaseline = 'top'
    multilineText(this.ctx, this.info.positionName, {
      x: 50,
      y: 210,
      fontSize: 32,
      maxWidth: 350,
      fontWeight: 'bold'
    })
    // let positionNameWidth = getTextWidth(this.ctx, this.info.positionName, 32, 350);
    this.ctx.save()
    this.ctx.font = `bold 32px PingFangSC-Regular`
    let rawPositionWidth = this.ctx.measureText(this.info.positionName).width
    this.ctx.restore()
    // console.log(rawPositionWidth, positionNameWidth)
    let urgencyImgX = rawPositionWidth <= 380 ? rawPositionWidth + 60 : 440
    this.info.isUrgency &&
      (await putImg(
        this.ctx,
        path.resolve(__dirname, '../../assets/urgency.png'),
        urgencyImgX,
        214,
        32,
        32
      ))
    this.ctx.save()
    const width = getTextWidth(this.ctx, this.info.salary, 32)
    this.ctx.restore()
    this.ctx.save()
    this.ctx.fillStyle = '#FF6644'
    multilineText(this.ctx, this.info.salary, {
      x: this.width - width - 50,
      y: 210 + 5,
      fontSize: 32,
      maxWidth: 350,
      fontWeight: 'bold'
    })
    this.ctx.restore()
    multilineText(this.ctx, '职位描述', {
      x: 88,
      y: 334,
      fontWeight: 'bold'
    })
    await putImg(
      this.ctx,
      path.resolve(__dirname, '../../assets/job-descriotion-gray.png'),
      45,
      334,
      32,
      32
    )
    multilineText(this.ctx, this.info.requirement, {
      x: 50,
      y: 404,
      maxWidth: 540,
      lineHeight: 1.7,
      maxRow: 'none'
    })
    this.ctx.restore()
  }

  async drawAddress() {
    this.ctx.save()
    this.ctx.fillStyle = '#333'
    this.ctx.align = 'left'
    this.ctx.textBaseline = 'top'

    multilineText(this.ctx, '工作地点', {
      x: 88,
      y: this.height - 690,
      fontWeight: 'bold'
    })
    await putImg(
      this.ctx,
      path.resolve(__dirname, '../../assets/location-gray.png'),
      48,
      this.height - 690
    )
    multilineText(this.ctx, this.info.address, {
      x: 50,
      y: this.height - 620,
      maxWidth: this.width - 130,
      fontWeight: 'normal',
      lineHeight: 1.7,
      maxRow: 2
    })
    this.ctx.restore()
  }

  drawFooter() {
    this.ctx.save()
    this.ctx.strokeStyle = '#DDD'
    this.ctx.textBaseline = 'top'
    this.ctx.strokeWidth = 1
    const dashLineY = this.height - 490
    drawDashLine(this.ctx, 60, dashLineY, 610, dashLineY)
    this.ctx.fillStyle = '#333'
    // this.ctx.textAlign = 'left';
    this.ctx.textAlign = 'center'
    this.ctx.font = 'bold 32px PingFangSC-Regular'
    this.ctx.fillText('职位正在热招中', this.width / 2, dashLineY + 325)
    this.ctx.fillStyle = '#666'
    this.ctx.font = '24px PingFangSC-Regular'
    this.ctx.fillText(
      '长按识别二维码，投简历享专属内推待遇',
      this.width / 2,
      dashLineY + 379
    )
    this.ctx.restore()
  }

  render() {
    this.drawBg()
    this.drawFooter()
    return new Promise((resolve, reject) => {
      Promise.all([
        this.drawHeaderBg(),
        this.drawPosition(),
        this.drawAddress(),
        this.drawQR()
      ])
        .then(() => {
          this.drawHeader()
          resolve()
        })
        .catch(reject)
    })
  }
}

module.exports = SharePosition
