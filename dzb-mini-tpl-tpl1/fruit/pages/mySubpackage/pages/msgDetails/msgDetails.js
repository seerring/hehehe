// pages/mySubpackage/pages/msgDetails/msgDetails.js
Page({

     /**
      * 页面的初始数据
      */
     data: {
          msgList:[
               { id: 1, title: '亲爱的用户', content: '您好！您所购买的艺福堂法兰西玫瑰花查干玫瑰特级天然法兰，快递小哥正在路上加速为您送达，祝您生活愉快！', date: '2018.08.08' },
               { id: 1, title: '亲爱的用户', content: '您好！您所购买的艺福堂法兰西玫瑰花查干玫瑰特级天然法兰，快递小哥正在路上加速为您送达，祝您生活愉快！', date: '2018.08.08' },
               { id: 1, title: '亲爱的用户', content: '您好！您所购买的艺福堂法兰西玫瑰花查干玫瑰特级天然法兰，快递小哥正在路上加速为您送达，祝您生活愉快！', date: '2018.08.08' },
          ]
     },

     /**
      * 生命周期函数--监听页面加载
      */
     onLoad: function (options) {
          console.log(options);
          var name = options.name;
          //重置标题
          wx.setNavigationBarTitle({
               title:name,
          })
          var that = this;
     },
})