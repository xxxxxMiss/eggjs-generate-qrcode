'use strict'

const Controller = require('egg').Controller
const checkDirExist = require('../src/utils/checkDirExist.js')
const hash = require('object-hash')
const path = require('path')
const fs = require('fs-extra')
class CandidateController extends Controller {
  async index() {
    this.ctx.body = 'hi, egg'
  }
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
  async postionDetail() {
    this.ctx.logger.info(
      'postionDetail request data: %j',
      this.ctx.request.body
    )
    let cookie = this.ctx.request.header.cookie
    let position = { ...this.ctx.request.body, cookie }
    let apiHost = this.ctx.request.header.apihost
    let infoHash = hash({ ...this.ctx.request.body, apiHost })
    let imgDir = path.resolve(__dirname, `../../tmp/${infoHash}.png`)
    if (checkDirExist(imgDir)) {
      try {
        this.ctx.body = {
          err_no: 0,
          err_msg: '',
          results: { fileName: `${infoHash}.png` }
        }
      } catch (error) {
        this.ctx.body = error
        this.ctx.status = 500
      }
    } else {
      let SharePosition = require('../src/candidate/SharePosition.js')
      let Canvas = require('canvas')
      let canvas = new Canvas(670, 1000)
      let ctx = canvas.getContext('2d')
      const height = SharePosition.getHeight(ctx, position.requirement)
      canvas = new Canvas(670, height)
      ctx = canvas.getContext('2d')
      let qrcode = new SharePosition({ ctx, info: position, height, apiHost })
      await qrcode.result
        .then(() => {
          let imgBuffer = canvas.toBuffer()
          fs.ensureFileSync(imgDir)
          fs.writeFileSync(imgDir, imgBuffer)
          this.ctx.body = {
            err_no: 0,
            err_msg: '',
            results: { fileName: `${infoHash}.png` }
          }
        })
        .catch(err => {
          this.ctx.logger.info(
            '职位分享图片生成失败',
            err.toString && err.toString()
          )
          this.ctx.body = (err.toString && err.toString()) || '图片生成失败'
          this.ctx.status = 404
        })
    }
  }
  async company() {
    this.ctx.logger.info(
      'postionDetail request data: %j',
      this.ctx.request.body
    )
    let cookie = this.ctx.request.header.cookie
    let position = { ...this.ctx.request.body, cookie }
    let apiHost = this.ctx.request.header.apihost
    let infoHash = hash({ ...this.ctx.request.body, apiHost })
    let imgDir = path.resolve(__dirname, `../../tmp/${infoHash}.png`)
    if (checkDirExist(imgDir)) {
      try {
        this.ctx.body = {
          err_no: 0,
          err_msg: '',
          results: { fileName: `${infoHash}.png` }
        }
      } catch (error) {
        this.ctx.body = error
        this.ctx.status = 500
      }
    } else {
      let ShareCompany = require('../src/candidate/ShareCompany.js')
      let Canvas = require('canvas')
      let canvas = new Canvas(670, 717)
      let ctx = canvas.getContext('2d')
      let qrcode = new ShareCompany({ ctx, info: position, apiHost })
      await qrcode.result
        .then(() => {
          let imgBuffer = canvas.toBuffer()
          fs.ensureFileSync(imgDir)
          fs.writeFileSync(imgDir, imgBuffer)
          this.ctx.body = {
            err_no: 0,
            err_msg: '',
            results: { fileName: `${infoHash}.png` }
          }
        })
        .catch(err => {
          this.ctx.logger.info(
            '职位分享图片生成失败',
            err.toString && err.toString()
          )
          this.ctx.body = (err.toString && err.toString()) || '图片生成失败'
          this.ctx.status = 404
        })
    }
  }
}

module.exports = CandidateController
