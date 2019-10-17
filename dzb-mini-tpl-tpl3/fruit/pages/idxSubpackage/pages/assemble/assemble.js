// pages/idxSubpackage/pages/assemble/assemble.js
Page({

     /**
      * 页面的初始数据
      */
     data: {
          lists:[
               { id: 1, proImg: '/images/goodsImg1.png', proName: '丝柔扎染男女家居北欧丝柔扎染男女家居北欧', proNum: 2, pt_price: '68.00', status: 1 , dj_price: '190' },
               { id: 2, proImg: '/images/goodsImg2.png', proName: '丝柔扎染男女家居北欧丝柔扎染男女家居北欧', proNum: 2, pt_price: '68.00', status: 0, dj_price: '190' },
               { id: 3, proImg: '/images/goodsImg3.png', proName: '丝柔扎染男女家居北欧丝柔扎染男女家居北欧', proNum: 2, pt_price: '68.00', status: 0, dj_price: '190' },
               { id: 4, proImg: '/images/goodsImg4.png', proName: '丝柔扎染男女家居北欧丝柔扎染男女家居北欧', proNum: 2, pt_price: '68.00', status: 0, dj_price: '190' },
               { id: 5, proImg: '/images/goodsImg5.png', proName: '丝柔扎染男女家居北欧丝柔扎染男女家居北欧', proNum: 2, pt_price: '68.00', status: 0, dj_price: '190' },
               { id: 6, proImg: '/images/goodsImg6.png', proName: '丝柔扎染男女家居北欧丝柔扎染男女家居北欧', proNum: 2, pt_price: '68.00', status: 0, dj_price: '190' }
          ]
     },

     /**
      * 生命周期函数--监听页面加载
      */
     onLoad: function (options) {

     },
     //监听滚动条坐标
     onPageScroll(e) {
          var that = this;
          var scrollTop = e.scrollTop;
          var backTopVal = scrollTop > 0 ? true : false;
          that.setData({
               backTopVal: backTopVal,
          })
     },
     //返回顶部
     backTop() {
          //控制滚动
          wx.pageScrollTo({
               scrollTop: 0,
          })
     },

})