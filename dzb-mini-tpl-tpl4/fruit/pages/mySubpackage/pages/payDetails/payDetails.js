// pages/mySubpackage/pages/payDetails/payDetails.js


const date = new Date()
const years = []
const months = []

for (let i = 2018; i <= date.getFullYear(); i++) {
     years.push(i)
}

for (let i = 1; i <= 12; i++) {
     months.push(i)
}


Page({

     /**
      * 页面的初始数据
      */
     data: {
          years,
          year: date.getFullYear(),
          months,
          month: 2,
          isShow:false,
          list:[
               { type: '在线支付', date: '2018-08-16', balance: ' 110.00', payMoney: '-20.00' },
               { type: '提现', date: '2018-08-16', balance: ' 110.00', payMoney: '-20.00' },
               { type: '在线支付', date: '2018-08-16', balance: ' 110.00', payMoney: '-20.00' },
               { type: '提现', date: '2018-08-16', balance: ' 110.00', payMoney: '-20.00' },
               { type: '在线支付', date: '2018-08-16', balance: ' 110.00', payMoney: '-20.00' },
               { type: '提现', date: '2018-08-16', balance: ' 110.00', payMoney: '-20.00' }
          ]
     },

     /**
      * 生命周期函数--监听页面加载
      */
     onLoad: function (options) {

     },
     //查询时间
     queryDate:function(){
          var that = this;
          that.setData({
               isShow:true,
          })
     },
     //取消
     cancle:function(){
          var that = this;
          that.setData({
               isShow: false,
          })
     },
     //完成
     complete:function(){
          var that = this;
          that.setData({
               isShow: false,
          })
     }
})