// pages/i
// pages/order/order.js
const util = require('../../utils/util.js')
var arr = new Array();         //先声明一维
for (var i = 0; i < 4; i++)          //一维长度为4
  arr[i] = new Array();    //在声明二维


var shuju_value = new Array();         //先声明一维
for (var i = 0; i < 4; i++)          //一维长度为4
  shuju_value[i] = new Array();    //在声明二维
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currtab: 0,
    swipertab: [{ name: '管理方案', index: 0 }, { name: '视觉设计', index: 1 }, { name: '营销方案', index: 2 },{ name: '个性方案', index: 3 }],
    shuju:new Array(),
  },
  chaxun: function(now_j,res_data){
    let that = this;

    var nums=0;
    
    //console.log(res_data)
    var now_i = res_data[now_j].problemSet-1;
    var val1_string = res_data[now_j].valstr.substring(0, 2);
    var val1 = parseInt(val1_string);
    var val2_string = res_data[now_j].valstr.substring(2, 4);
    var val2 = parseInt(val2_string);

    shuju_value[now_i][now_j] = { val1: val1, val2: val2, valstr: res_data[now_j].valstr};
    wx.request({
      url: 'https://zdcd.online/api/recsys.php',
      data: {
        action: 'explain',
        set: 1,
        result: 1,
        val: 1,
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        //console.log(res.data);
        //console.log(now_i);
        //console.log(now_j);
        arr[now_i][now_j] = { name: res.data, status: res.data, star: parseInt(res_data[now_j].star)};
        if(now_j+1<res_data.length)
        that.chaxun(now_j + 1, res_data)
        else
        {
          that.setData({
            shuju:arr,
          })
        }
        console.log(that.data.shuju);
      }
    })

    },


  lishipage:function(e){
    let that = this;
   // console.log(e);
    var now_index_i = that.data.currtab;
    var now_index_j = e.currentTarget.dataset.index;
   // console.log(shuju_value[now_index_i][now_index_j]);
    wx.setStorageSync('prepage', 1);
    wx.setStorageSync('programSet', now_index_i+1)
    wx.setStorageSync('val1', shuju_value[now_index_i][now_index_j].val1)
    wx.setStorageSync('val2', shuju_value[now_index_i][now_index_j].val2)
    wx.setStorageSync('valstr', shuju_value[now_index_i][now_index_j].valstr)
    
     wx.navigateTo({
        url: '../answer/answer',
      })
  } ,
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    
    let that = this;
    for (var i = 0; i < 4; i++)          //一维长度为4
      arr[i] = [];    //在声明二维


    for (var i = 0; i < 4; i++)          //一维长度为4
      shuju_value[i] = [];    //在声明二维
    for(var i=0; i<4; i++)
    {
      wx.request({
        url: 'https://zdcd.online/api/db.php',
        data: {
          unionId: wx.getStorageSync('unionid'),
          set: i+1,
          action: 'history',
        },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        success: function (res) {
            console.log(res.data);
          //console.log(res.data.length);
          if(res.data.length>0)
            that.chaxun(0, res.data);
          }

          // var tpx_index = "shuju[" + i + "]";
          // this.setData({
          //   [tpx_index]:{ result1: 1, val1: res.data. },
          // })
      })
    }
    

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 页面渲染完成
    this.getDeviceInfo()
  },

  getDeviceInfo: function () {
    let that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          deviceW: res.windowWidth,
          deviceH: res.windowHeight
        })
      }
    })
  },

  /**
  * @Explain：选项卡点击切换
  */
  tabSwitch: util.throttle( function (e) {
    var that = this
    if (this.data.currtab === e.target.dataset.current) {
      return false
    } else {
      that.setData({
        currtab: e.target.dataset.current
      })
    }
  }, 500),

  tabChange: util.throttle(function (e) {
    this.setData({ currtab: e.detail.current })
  }, 500),

})
