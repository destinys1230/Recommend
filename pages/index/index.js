// pages/index/index.js
const util = require('../../utils/util.js')
let windowWidth = 0;
let itemWidth = 0;
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tab1Index:0,
    daan:new Array(),
  },
  onLoad: function (options) {
    var that = this;

    that.setData({
      type : options.type      
    })
    app.globalData.type=that.data.type

    //console.log('https://zdcd.online/api/'+that.data.type+'.json')

    wx.request({
      url: 'https://zdcd.online/api/json/'+that.data.type+'.json',
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        //console.log(res.data);
        that.setData({
          myData: res.data,
        });
      }
    })
  },


  xuanze: util.throttle(function (e) {
    let that = this;
    var obj = e.detail.value;
    //console.log(e.currentTarget.dataset.index)
    var tpx_index = "daan[" + this.data.tab1Index + "]";
    this.setData({
      [tpx_index]: e.currentTarget.dataset.index+1,
    })
    console.log(this.data.daan);
    if (this.data.tab1Index != this.data.myData.length-1) {
      this.setData({
        tab1Index: this.data.tab1Index+1,
      })
    }
    else
    {
      var flag=0;
      for (var i = 0; i < this.data.daan.length; i++) {
        if (typeof (this.data.daan[i]) == "undefined")
        {
          wx.showModal({
            title: '该题未选',
            content: '请选择此题后，重新选择最后一题！',
            showCancel:false,
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
          this.setData({
            tab1Index: i,
          })
          flag=1;
          break;
        }
      }
      if(flag==0)
      {
        app.globalData.choices=that.data.daan;
        wx.navigateTo({
          url: '../donghua/donghua',
        })
      }
      
    }
  },500),
  
  

  /**
   * current 改变时会触发 change 事件
   */
  swiperChange: util.throttle(function (event) {
    this.setData({
      tab1Index: event.detail.current,
    })
  }, 500),
  /**
   * 动画结束时会触发 animationfinish 事件
   */
  animationfinish(event){
    this.setData({
    })
  },
  jiesi_tumu:function(e){
    wx.showModal({
      title: '题目解释',
      content: '这是题目解释',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    //console.log(this.data.questionData)

  }
  
})