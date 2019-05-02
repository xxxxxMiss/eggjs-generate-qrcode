const Canvas = require('canvas')
const fs = require('fs-extra')
const Image = Canvas.Image
module.exports = function name(ctx, url, ...options) {
    return new Promise((resolve, reject) => {
        fs.readFile(url, (err, src) => {
            if (err) {
                reject(err)
                throw err
            };
            let img = new Image();
            img.src = src;
            ctx.drawImage(img, ...options);
            resolve()
        });
    })
}
