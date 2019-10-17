// pages/idxSubpackage/pages/limitTime/limitTime.js
Page({

     /**
      * 页面的初始数据
      */
     data: {
          status:'已结束',
          backTopVal: false,
          curIndex: 0,
          tabList: [
               { id: 1, time: '11月18日', status: '已结束' },
               { id: 2, time: '11月19日', status: '今日抢' },
               { id: 3, time: '11月20日', status: '未开始' },
               { id: 4, time: '11月21日', status: '未开始' },
               { id: 5, time: '11月22日', status: '未开始' },
          ],
          proLists: [
               { id: 1, proImg: '/images/goodsImg2.png', proDesc: '丝柔扎染男女家居北欧丝柔扎染男女家居北欧丝扎染男女家居北欧丝柔扎染', status: 0, isHint: true, ysPrice: '68.00', orPrice: '179' },
               { id: 2, proImg: '/images/goodsImg3.png', proDesc: '丝柔扎染男女家居北欧丝柔扎染男女家居北欧丝扎染男女家居北欧丝柔扎染', status: 1, isHint: true, ysPrice: '68.00', orPrice: '179', progress: 95 },
               { id: 3, proImg: '/images/goodsImg4.png', proDesc: '丝柔扎染男女家居北欧丝柔扎染男女家居北欧丝扎染男女家居北欧丝柔扎染', status: 1, isHint: true, ysPrice: '68.00', orPrice: '179', progress: 50 },
               { id: 4, proImg: '/images/goodsImg5.png', proDesc: '丝柔扎染男女家居北欧丝柔扎染男女家居北欧丝扎染男女家居北欧丝柔扎染', status: 1, isHint:true, ysPrice: '68.00', orPrice: '179', progress: 32 },
          ]
     },

     /**
      * 生命周期函数--监听页面加载
      */
     onLoad: function (options) {

     },
     tabFun: function (e) {
          console.log(e)
          var that = this;
          var index = e.currentTarget.dataset.index;
          var status = e.currentTarget.dataset.status;
          that.setData({
               curIndex: index,
               status: status,
          })
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
     //提醒我
     hintMe: function (e) {
          console.log(e.currentTarget.dataset.index)
          var that = this;
          var index = e.currentTarget.dataset.index;
          var proLists = that.data.proLists;
          if (proLists[index].isHint) {
               wx.showToast({
                    icon: 'none',
                    title: '抢购前10分钟提醒您！',
               })
          }
          else {
               wx.showToast({
                    icon: 'none',
                    title: '提醒取消！', 
               })
          }
          proLists[index].isHint = !proLists[index].isHint;
          that.setData({
               curIndex1: index,
               proLists: proLists,
          })
     }
})