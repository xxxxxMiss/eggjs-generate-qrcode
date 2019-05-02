'use strict'

const Controller = require('egg').Controller
const axios = require('axios')
const qs = require('../src/utils/qs')
const sharePaints = require('../src/positionShare/share')
class HomeController extends Controller {
  async index() {
    this.ctx.body = 'hi, egg'
  }
  async boleCompany() {
    this.ctx.logger.info('boleCompany request data: %j', this.ctx.request.body)
    let cookie = this.ctx.request.header.cookie
    let apiHost = this.ctx.request.header.apihost
    let Canvas = require('canvas')
    let company = { ...this.ctx.request.body, cookie }
    company.tags = company.tags && company.tags.split(',')
    let ShareCompany = require('../src/boleWX/ShareCompany.js')
    let canvas = new Canvas(750, 630)
    let ctx = canvas.getContext('2d')
    const companyNameFont = '36px PingFangSC-Semibold'
    let companyNameHeight = ShareCompany.getHeight(
      ctx,
      company.organizationName,
      companyNameFont,
      36,
      1.2,
      2
    )
    let companyInfFont = '26px PingFangSC-Regular'
    let otherInfoHeight = ShareCompany.getHeight(
      ctx,
      company.companyInfo,
      companyInfFont,
      32,
      1.5,
      2
    )
    let bottomFont = '24px PingFangSC-Light'
    let bottomHeight = ShareCompany.getHeight(
      ctx,
      company.companyName + '内推小程序',
      bottomFont,
      26,
      1.5,
      2
    )
    let tagHeight = 0
    if (company.tags) {
      if (0 < company.tags.length && company.tags.length < 4) {
        tagHeight = 108
      } else if (4 <= company.tags.length && company.tags.length < 7) {
        tagHeight = 190
      } else if (7 <= company.tags.length && company.tags.length < 10) {
        tagHeight = 272
      }
    }
    const allHeight =
      tagHeight + companyNameHeight + otherInfoHeight + bottomHeight + 794
    canvas = new Canvas(750, allHeight)
    ctx = canvas.getContext('2d')
    const params = {
      allHeight,
      apiHost,
      tagHeight,
      companyNameHeight,
      otherInfoHeight,
      bottomHeight,
      width: 750
    }
    ShareCompany = new ShareCompany({ ctx, info: company, params })
    await ShareCompany.render()
    const config = {
      headers: {
        cookie: cookie
      }
    }
    let data = {
      photo: canvas.toDataURL()
    }
    // this.ctx.logger.info('boleCompany response data: %j', canvas.toDataURL());
    return axios
      .post(apiHost + '/resume/upload_photo_base64', qs.stringify(data), config)
      .then(res => {
        this.ctx.body = { results: res.data.results }
      })
  }
  async bolePosition() {
    this.ctx.logger.info('bolePosition request data: %j', this.ctx.request.body)
    let Canvas = require('canvas')
    let cookie = this.ctx.request.header.cookie
    let apiHost = this.ctx.request.header.apihost
    let SharePosition = require('../src/boleWX/SharePosition.js')
    let canvas = new Canvas(750, 1500)
    let ctx = canvas.getContext('2d')
    let position = { ...this.ctx.request.body, cookie }
    position.tags = position.tags && position.tags.split(',')
    let companyInfFont = '26px PingFangSC-Regular'
    let otherInfoHeight =
      SharePosition.getHeight(
        ctx,
        position.companyInfo,
        companyInfFont,
        32,
        1.5,
        600,
        2
      ) || 0
    let tagHeight = 0
    if (position.tags) {
      if (0 < position.tags.length && position.tags.length < 4) {
        tagHeight = 108
      } else if (4 <= position.tags.length && position.tags.length < 7) {
        tagHeight = 190
      } else if (7 <= position.tags.length && position.tags.length < 10) {
        tagHeight = 272
      }
    }
    const reqFont = '28px PingFangSC-Regula'
    const reqheight =
      SharePosition.getHeight(ctx, position.requirement, reqFont, 48, 1.7) || 0
    const descHeight =
      SharePosition.getHeight(ctx, position.description, reqFont, 48, 1.7) || 0
    const addressHeight =
      SharePosition.getHeight(
        ctx,
        position.address,
        reqFont,
        42,
        1.2,
        600,
        2
      ) || 0
    const posNameFont = '36px PingFangSC-Semibold'
    const posNameHeight =
      SharePosition.getHeight(
        ctx,
        position.positionName,
        posNameFont,
        36,
        1.2,
        600,
        2
      ) || 0
    const allHeight =
      180 +
      60 +
      posNameHeight +
      30 +
      40 +
      50 +
      28 +
      42 +
      20 +
      descHeight +
      50 +
      28 +
      20 +
      reqheight +
      62 +
      28 +
      32 +
      addressHeight +
      146 +
      24 +
      otherInfoHeight +
      tagHeight +
      442 +
      120
    canvas = new Canvas(750, allHeight)
    ctx = canvas.getContext('2d')
    const params = {
      allHeight,
      apiHost,
      tagHeight,
      otherInfoHeight,
      reqheight,
      descHeight,
      addressHeight,
      posNameHeight,
      width: 750
    }
    SharePosition = new SharePosition({ ctx, info: position, params })
    await SharePosition.render()
    return axios
      .post(
        apiHost + '/resume/upload_photo_base64',
        qs.stringify({
          photo: canvas.toDataURL()
        }),
        {
          headers: { cookie }
        }
      )
      .then(res => {
        this.ctx.logger.info('bolePosition response data: %j', res.data.results)
        this.ctx.body = { results: res.data.results }
      })
    // this.ctx.body =  `<img src=${canvas.toDataURL()} />`
  }
  async sharePosShort() {
    this.ctx.logger.info(
      'sharePosShort request data: %j',
      this.ctx.request.body
    )
    let Canvas = require('canvas')
    let { cookie, apihost } = this.ctx.request.header
    let sharePosShort = require('../src/boleWX/sharePosShort.js')
    let canvas = new Canvas(750, 850)
    let ctx = canvas.getContext('2d')
    let position = { ...this.ctx.request.body, cookie }
    let posNameHeight = sharePosShort.getHeight(ctx, position.positionName)
    canvas = new Canvas(750, 770 + posNameHeight)
    ctx = canvas.getContext('2d')
    sharePosShort = new sharePosShort({
      ctx,
      info: position,
      height: 770 + posNameHeight,
      posNameHeight,
      apihost
    })
    const ps = await sharePosShort.render()
    this.ctx.logger.info('sharePosShort ps', ps[0])
    return axios
      .post(
        apihost + '/resume/upload_photo_base64',
        qs.stringify({
          photo: canvas.toDataURL()
        }),
        {
          headers: { cookie }
        }
      )
      .then(res => {
        this.ctx.body = { results: res.data.results }
      })
  }

  async shareList() {
    this.ctx.logger.info('shareList request data: %j', this.ctx.request.body)
    const body = this.ctx.request.body
    const dataURL = await sharePaints.getShareListDataURL(body)

    const { cookie, apihost } = this.ctx.headers
    const res = await axios.post(
      apihost + '/resume/upload_photo_base64',
      qs.stringify({
        photo: dataURL
      }),
      {
        headers: { cookie }
      }
    )
    this.ctx.body = res.data
  }

  async shareDetail() {
    this.ctx.logger.info('shareDetail request data: %j', this.ctx.request.body)
    const body = this.ctx.request.body
    const dataURL = await sharePaints.getShareDetailDataURL(body)

    const { cookie, apihost } = this.ctx.headers
    const res = await axios.post(
      apihost + '/resume/upload_photo_base64',
      qs.stringify({
        photo: dataURL
      }),
      {
        headers: { cookie }
      }
    )
    this.ctx.body = res.data
  }

  async shareProcess() {
    const body = this.ctx.request.body
    const { apihost, cookie } = this.ctx.headers
    const dataURL = await sharePaints.getShareProcessDataURL(
      { ...body, apihost },
      this.ctx
    )

    const res = await this.ctx.curl(apihost + '/resume/upload_photo_base64', {
      method: 'POST',
      data: { photo: dataURL },
      headers: { cookie },
      dataType: 'json'
    })
    this.ctx.body = res.data
    // this.ctx.body = { results: dataURL }
  }
}

module.exports = HomeController
