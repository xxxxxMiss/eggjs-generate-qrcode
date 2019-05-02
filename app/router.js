'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.get('/img',controller.common.getImg)
  router.post('/candidate/position_detail', controller.candidate.postionDetail);
  router.post('/candidate/company', controller.candidate.company);
  router.post('/drawImg', controller.common.drawImg);
  router.post('/bolePosition', controller.home.bolePosition);
  router.post('/boleCompany', controller.home.boleCompany);
  router.post('/position-list-share', controller.home.shareList)
  router.post('/position-detail-share', controller.home.shareDetail)
  router.post('/positionShort', controller.home.sharePosShort)
  router.post('/share-process', controller.home.shareProcess)
};
