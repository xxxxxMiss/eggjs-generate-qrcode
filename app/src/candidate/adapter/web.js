const assetsMap = {};
let loadPromise = Promise.resolve(assetsMap);

const loadAssets = (callback) => {
    loadPromise = loadPromise.then(() => {
        return callback().then((assets) => {
            return Object.assign(assetsMap, assets);
        });
    });
};

module.exports = {
    loadAssets,
    getImageData: (uri) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        loadPromise.then((assetsMap) => {
            img.src = assetsMap(uri);
            return new Promise((resolve, reject) => {
                img.onload=()=>{
                    resolve(img);
                };
                img.onerror=()=>{
                    reject();
                }
            });
        });
    }
};
