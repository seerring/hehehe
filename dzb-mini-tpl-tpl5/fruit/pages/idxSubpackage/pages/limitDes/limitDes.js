// pages/idxSubpackage/pages/limitDes/limitDes.js
Page({

     /**
      * 页面的初始数据
      */
     data: {
          isShowModal: false,
          swpierIndex: 0,
          proNum: 1,
          swiperList: [
               { images: '/images/banner.png' },
               { images: '/images/banner.png' },
               { images: '/images/banner.png' },
          ],
          lvList: [
               '/pages/common/images/icon-yellow.png',
               '/pages/common/images/icon-yellow.png',
               '/pages/common/images/icon-yellow.png',
               '/pages/common/images/icon-yellow.png',
               '/pages/common/images/icon-yellow.png',
          ],
          comImgList: [
               '/images/goodsImg5.png',
               '/images/goodsImg5.png'
          ],
          swiperList3: [
               { id: 11, images: '/images/mrNew.png', proName: '简约休假家庭旅行必备简约休假家庭旅行必备', yPrice: '279', disPrice: '129' },
               { id: 12, images: '/images/mrNew.png', proName: '简约休假家庭旅行必备简约休假家庭旅行必备', yPrice: '279', disPrice: '129' },
               { id: 13, images: '/images/mrNew.png', proName: '简约休假家庭旅行必备简约休假家庭旅行必备', yPrice: '279', disPrice: '129' },
               { id: 14, images: '/images/mrNew.png', proName: '简约休假家庭旅行必备简约休假家庭旅行必备', yPrice: '279', disPrice: '129' },
          ],
          speclist: [
               { id: 1, name: '蓝色Blue' },
               { id: 2, name: '粉色Pink' },
               { id: 3, name: '黑色Black' },
               { id: 4, name: '绿色Green' },
               { id: 5, name: '黄色Yellow' }
          ]
     },

     /**
      * 生命周期函数--监听页面加载
      */
     onLoad: function (options) {

     },
     //商品主图
     swiperFun(e) {
          // console.log(e.detail.current);
          var that = this;
          that.setData({
               swpierIndex: e.detail.current,
          })
     },
     //关闭模态框
     closeModal: function () {
          var that = this;
          that.setData({
               isShowModal: false,
          })
     },
     //选择商品属性
     chooseAttr: function () {
          var that = this;
          that.setData({
               isShowModal: true,
          })
     },
     //加
     add: function () {
          var that = this;
          var proNum = that.data.proNum;
          that.setData({
               proNum: ++proNum,
          })
     },
     //减
     subtract: function () {
          var that = this;
          var proNum = that.data.proNum;
          if (proNum <= 1) {
               that.setData({
                    proNum: 1,
               })
          }
          else {
               that.setData({
                    proNum: --proNum,
               })
          }
     },
     //选择属性
     chooseSX: function (e) {
          console.log(e)
          var that = this;
          var id = e.currentTarget.dataset.id;
          that.setData({
               currIndex: id,
          })
     }
})