let fs = require('fs-extra')
let SharePosition = require('./share/SharePosition.js')
let Canvas = require('canvas')
// var Canvas = require('canvas')
//     , Image = Canvas.Image
//     , canvas = new Canvas(64, 64)
//     , ctx = canvas.getContext('2d');

// fs.readFile('./assets/urgency.png', function (err, squid) {
//     if (err) throw err;
//     let img = new Image;
//     img.src = squid;
//     ctx.drawImage(img, 0, 0, img.width, img.height);
//     fs.writeFile('./tmp/pic.png', canvas.toBuffer(), (err) => {
//         if (err) throw err;
//         console.log('图片已保存');
//     });
// });
// ctx.font = '30px Impact';
// ctx.rotate(.1);
// ctx.fillText("Awesome!", 50, 100);

// var te = ctx.measureText('Awesome!');
// ctx.strokeStyle = 'rgba(0,0,0,0.5)';
// ctx.beginPath();
// ctx.lineTo(50, 102);
// ctx.lineTo(50 + te.width, 102);
// ctx.stroke();


// console.log('<img src="' + canvas.toDataURL() + '" />');

const position = {
    positionName: '职位名职位名职职位位位位位职位名职位名职职位位位位位',
    companyName: '链家链家链家链家链家链家链家链',
    isUrgency: true,
    requirement: '岗位职责：\n1、基于IOS平台设计、开发和调试应用软件；\n2、负责相关技术文档的编写工作；\n3、根据公司的业务发展方向，开发设计和完善相应的手机客户端产品。\n任职要求：\n1、熟悉IOS平台，对IOS有所了解；\n4、本科在读学生，计算机相关专业；\n网申地址：http://campus.51job.com/ztgame/岗位职责：\n1、基于IOS平台设计、开发和调试应用软件；\n2、负责相关技术文档的编写工作；\n3、根据公司的业务发展方向，开发设计和完善相应的手机客户端产品。\n任职要求：\n1、熟悉IOS平台，对IOS有所了解；\n4、本科在读学生，计算机相关专业；\n网申地址：http://campus.51job.com/ztgame/岗位职责：\n1、基于IOS平台设计、开发和调试应用软件；\n2、负责相关技术文档的编写工作；\n3、根据公司的业务发展方向，开sdfsdan3、根据公司的业务发展方向，开sdfsda',
    description: '岗位职责：\n1、基于IOS平台设计、开发和调试应用软件；\n2、负责相关技术文档的编写工作；\n3、根据公司的业务发展方向，开发设计和完善相应的手机客户端产品。\n任职要求：\n1、熟悉IOS平台，对IOS有所了解；\n4、本科在读学生，计算机相关专业；\n网申地址：http://campus.51job.com/ztgame/'
};
let canvas = new Canvas(670, 1000)
let ctx = canvas.getContext('2d');
const height = SharePosition.getHeight(ctx, position.requirement);
canvas = new Canvas(670, height)
ctx = canvas.getContext('2d');
let qrcode = new SharePosition(ctx, position, height)
qrcode.result.then(() => {
    fs.writeFile('./tmp/pic.png', canvas.toBuffer(), (err) => {
        if (err) throw err;
        console.log('图片已保存');
    });
})
