const { getContext, getTextWidth, getMaxLimit, drawImage, drawRoundRect, drawCircle, drawLine } = require('./tools')
const path = require('path')

module.exports = {
  async getShareListDataURL (data) {
    let { name, scale, totalPosition, kind } = data
    const ctx = getContext()
    const dividerW = getTextWidth(ctx, '|')
    ctx.rect(0, 0, 500, 400)
    ctx.fillStyle = '#fff'
    ctx.fill()
    ctx.font = '500 32px PingFangSC'
    ctx.fillStyle = '#000'

    name = getMaxLimit(ctx, name)
    ctx.fillText(name, 10, 40, 480)

    let startX = 10
    kind = getMaxLimit(ctx, kind, 3, 120)
    ctx.fillStyle = '#666666'
    ctx.font = 'normal 24px PingFangSC'
    ctx.fillText(kind, startX, 97, 120)

    if (scale) {
      startX += getTextWidth(ctx, kind) + 20
      ctx.save()
      ctx.fillStyle = '#ccc'
      ctx.fillText('|', startX, 98)
      startX += 20 + dividerW
      ctx.restore()
      ctx.fillText(scale, startX, 98)
    }

    if (totalPosition) {
      startX += getTextWidth(ctx, scale) + 20
      ctx.save()
      ctx.fillStyle = '#ccc'
      ctx.fillText('|', startX, 98)
      startX += 20 + dividerW
      const TEXT = '在招职位'
      ctx.restore()
      ctx.fillText(TEXT, startX, 98)
      startX += getTextWidth(ctx, TEXT) + 14
      ctx.font = '500 24px PingFangSC-Medium'
      ctx.fillStyle = '#2A2A2A'
      ctx.fillText(totalPosition, startX, 98)
    }

    await drawImage(ctx, path.join(__dirname, '../../assets/share-image@2x.png'), 0, 153, 500, 247)
    return ctx.canvas.toDataURL()
  },
  async getShareDetailDataURL (data) {
    let { name, salary, number, workplace, experience, degrees_detail } = data
    const ctx = getContext()
    const dividerW = getTextWidth(ctx, '|')
    ctx.rect(0, 0, 500, 400)
    ctx.fillStyle = '#fff'
    ctx.fill()
    ctx.font = '500 32px PingFangSC'
    ctx.fillStyle = '#000'
    name = getMaxLimit(ctx, name)
    ctx.fillText(name, 10, 44, 480)

    let startX = 10
    ctx.fillStyle = '#FF6644'
    ctx.font = 'normal 24px'
    salary = salary.replace(/\s+/g, '')
    ctx.fillText(salary, startX, 97)

    ctx.fillStyle = '#666666'
    ctx.font = 'normal 24px PingFangSC'
    if (workplace) {
      startX += getTextWidth(ctx, salary) + 46
      workplace = workplace.split('、')[0].replace('市', '') + '...'
      ctx.fillText(workplace, startX, 97)
      startX += getTextWidth(ctx, workplace) + 14
    }
    if (experience) {
      ctx.save()
      ctx.fillStyle = '#ccc'
      ctx.fillText('|', startX, 97)
      startX += dividerW + 14
      ctx.restore()
      ctx.fillText(experience, startX, 97)
      startX += getTextWidth(ctx, experience) + 14
    }
    if (degrees_detail) {
      ctx.save()
      ctx.fillStyle = '#ccc'
      ctx.fillText('|', startX, 97)
      startX += dividerW + 14
      ctx.restore()
      ctx.fillText(degrees_detail, startX, 97)
      startX += getTextWidth(ctx, degrees_detail) + 14
    }
    if (number && number != 0) {
      ctx.save()
      ctx.fillStyle = '#ccc'
      ctx.fillText('|', startX, 97)
      startX += dividerW + 14
      ctx.restore()
      number = number * 1 > 99 ? '99+' : number
      ctx.fillText(number + '人', startX, 97)
    }

    await drawImage(ctx, path.join(__dirname, '../../assets/share-image@2x.png'), 0, 153, 500, 247)
    return ctx.canvas.toDataURL()
  },
  async getShareProcessDataURL (data, eggCtx) {
    let { resume_photo, resume_name, resume_gender, position_name, userName, avatarUrl, company, flow_id, apihost } = data
    const cookie = eggCtx.headers.cookie
    // TODO: can remove with node-canvas@2.x
    if (resume_photo) {
      const result = await eggCtx.curl(resume_photo, { headers: { cookie } })
      resume_photo = result.data
    } else {
      resume_photo = resume_gender == 2
      ? path.join(__dirname, '../boleWX/image/head-girl.png')
      : path.join(__dirname, '../boleWX/image/head-portrait.png')
    }
    
    if (avatarUrl) {
      const result = await eggCtx.curl(avatarUrl, { headers: { cookie } })
      avatarUrl = result.data
    }

    const ctx = getContext(750, 830)
    ctx.fillStyle = '#FF6644'
    ctx.fillRect(0, 0, 750, 830)
    await drawImage(ctx, path.join(__dirname, '../boleWX/image/header-bg.png'), 292, 0, 458, 190)
    await drawImage(ctx, path.join(__dirname, '../boleWX/image/footer-bg.png'), 292, 760)
    drawCircle(ctx, 95, 95, 45, {
      type: 'fill',
      fillStyle: '#fff'
    })
    ctx.save()
    ctx.clip()
    await drawImage(ctx, avatarUrl, 50, 50, 90, 90)
    ctx.restore()
    ctx.font = '500 28px PingFangSC'
    ctx.textBaseline = 'hanging'
    ctx.fillStyle = '#fff'
    ctx.fillText(`我是${userName}，我帮你内推`, 170, 50)
    ctx.font = '400 26px PingFangSC'
    company = getMaxLimit(ctx, company, 10, 539)
    ctx.fillText(company, 170, 105)
    drawRoundRect(ctx, 0, 181, 750, 578, 18, {
      type: 'fill',
      fillStyle: '#fff'
    })
    drawRoundRect(ctx, 50, 240, 88, 88, 6, {
      strokeStyle: '#ddd'
    })
    ctx.save()
    ctx.clip()
    await drawImage(ctx, resume_photo, 50, 240, 88, 88)
    ctx.restore()
    ctx.font = '600 36px PingFangSC'
    ctx.fillStyle = '#333'
    ctx.fillText(resume_name, 160, 238)
    ctx.font = '400 28px PingFangSC'
    position_name = getMaxLimit(ctx, position_name, 10, 539)
    ctx.fillText(position_name, 160, 298)
    drawLine(ctx, 50, 388, 700, 388, {
      strokeStyle: '#ddd',
      dashSegments: [5, 5]
    })

    const result = await eggCtx.curl(`${apihost}/common/flow_qrcode`, {
      data: { flow_id },
      headers: { cookie }
    })
    await drawImage(ctx, result.data, 275, 445, 200, 200)
    ctx.font = '400 26px PingFangSC'
    ctx.fillStyle = '#666'
    ctx.textAlign = 'center'
    ctx.fillText('扫码查看内推进度', 750 / 2, 680)

    return ctx.canvas.toDataURL()
  }
}
