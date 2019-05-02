'use strict'

const Controller = require('egg').Controller
const checkDirExist = require('../src/utils/checkDirExist.js')
const hash = require('object-hash')
const path = require('path')
const fs = require('fs-extra')
class CommonController extends Controller {
  async getImg() {
    let { name } = this.ctx.query
    let imgDir = path.resolve(__dirname, `../../tmp/${name}`)
    if (checkDirExist(imgDir)) {
      try {
        const resHeaders = {
          'content-type': 'image/png'
        }
        this.ctx.set(resHeaders)
        this.ctx.body = fs.createReadStream(imgDir)
      } catch (error) {
        this.ctx.body = error
        this.ctx.status = 500
      }
    } else {
      this.ctx.body = '无图片'
      this.ctx.status = 400
    }
  }
  async drawImg() {
    this.ctx.logger.info('drawImg request data: %j', this.ctx.request.body)
    let cookie = this.ctx.request.header.cookie
    let drawInfo = this.ctx.request.body
    let apiHost = this.ctx.request.header.apihost
    let infoHash = hash({ ...this.ctx.request.body, apiHost })
    // let imgDir = path.resolve(__dirname, `../../tmp/${infoHash}.png`)
    let Draw = require('../src/commonDraw/index.js')
    let draw = await new Draw(drawInfo, cookie)
    let imgBuffer = draw.toBuffer()
    const resHeaders = {
      'content-type': 'image/png'
    }
    this.ctx.set(resHeaders)
    this.ctx.body = imgBuffer
  }
}

module.exports = CommonController
