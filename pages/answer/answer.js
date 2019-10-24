// pages/index/index.js
let windowWidth = 0;
let itemWidth = 0;
var app=getApp();
Page({

  data: {
    tab1Index:0,
    imageHistoryRect: {},
    isGoumai:0,
    fangang_txt:"",
  },

  onLoad: function (options) 
  {
    var that = this;

    var valstr = "";
    for(var i = 0; i < app.globalData.reclen; i++) 
    {
      valstr = valstr + "0" + app.globalData.vals[i];
    }
    app.globalData.valstr=valstr;
    var now_time = (new Date()).getTime();
    app.globalData.timestamp=now_time;
    console.log("timestamp",app.globalData.timestamp);

    
    //首先判断是不是有收藏，设定左下角的星初始状态
    wx.request
    ({
      url: 'https://zdcd.online/api/db.php',
      data:
      {
        action:"isstar",
        unionId:wx.getStorageSync('unionid'),
        type:app.globalData.type,
        valstr:app.globalData.valstr,
      },
      method:'GET',
      success:function(ret)
      {
        console.log("isstar",ret);
        if(ret.data.length!=0)
        {
          isClick:1;
        }
        else
        {
          isClick:0;
        }
      }
    })

    //添加历史
    wx.request({
      url: 'https://zdcd.online/api/db.php',
      data:
      {
        action:"insert",
        unionId:wx.getStorageSync('unionid'),
        type:app.globalData.type,
        valstr:app.globalData.valstr,
        ordered: 0,
        time:app.globalData.timestamp,
      },
      method:'GET',
      success: function(ret){
        console.log("add history success",ret);
      }
    })

    //获取解释内容
    for(var i=1;i<=app.globalData.reclen;i++)
    {
      console.log("val", app.globalData.vals[i-1]);
      console.log("i", i);
      wx.request({
        url: 'https://zdcd.online/api/recsys.php',
        data: {
          action:'explain',
          type: app.globalData.type,
          model : i,
          val: app.globalData.vals[i-1],
        },

        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        success: function (res) {
          console.log("++++",res);
          that.setData({
            fangang_txt: that.data.fangang_txt+ "\n" + res.data[0]['words'],
          })
        }
      })
      setTimeout(function () {
      }, 200);
    }
    
    //获取图片
    
    wx.request({
      url: 'https://zdcd.online/api/recsys.php',
      header: {
        'content-type': 'application/json'
      },
      data: 
      {
        action:'img',
        type: app.globalData.type,
        valstr: app.globalData.valstr,
        batch: 1,
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) 
      {
        console.log("imgs",res);
        that.setData({
          myData: res.data,
        })
        console.log(that.data.myData[0]);
      }
    })
  

   
  },//end onload
  
  //左下角收藏的星点击函数
  haveSave(e) 
  {
    let that = this;
    if (!this.data.isClick == true) 
    {
      wx.showToast({
        title: '已收藏',
      });

      wx.request
        ({
          url: 'https://zdcd.online/api/db.php',
          data: {
            action: 'star',
            unionId: wx.getStorageSync('unionid'),
            type: app.globalData.type,
            valstr: app.globalData.valstr,
          },
          method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          success: function (res) 
          {
            console.log(that.data.commonTime)
            console.log(res);
          }
        })
    }
    else 
    {
      wx.showToast({
        title: '已取消收藏',
      });
      wx.request
        ({
          url: 'https://zdcd.online/api/db.php',
          data: 
          {
            action: 'unstar',
            unionId: wx.getStorageSync('unionid'),
            type: app.globalData.type,
            valstr: app.globalData.valstr,
          },
          method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          success: function (res) 
          {
            console.log(res);
          }
        })

      var now_time = (new Date()).getTime();
      that.setData({
        commonTime: now_time,
      })
      
    }
    this.setData({
      isClick: !this.data.isClick
    })
  },
  swiperChange(event) 
  {
    this.setData({
      tab1Index: event.detail.current,
    })
  },
  onImageLoad: function (e) 
  {
    var viewWidth = 750;
    wx.getSystemInfo({
      success: function (res) 
      {
        viewWidth=res.windowWidth;
      }
    })
    var $width = e.detail.width,    //获取图片真实宽度
      $height = e.detail.height,
      ratio = $height / $width,    //图片的真实宽高比例
      viewHeight = viewWidth*ratio ;    //计算的高度值

    console.log("wid",$width);
    console.log("hei",$height);
    console.log("rati",ratio);
    console.log(viewWidth);
    console.log(viewHeight);
    this.setData({
      imageHistoryRect: 
      {
        width: viewWidth,
        height: viewHeight
      }
    })
  },


  
  purchase(e) 
  {
    let that = this;
    if (that.data.isGoumai==0)
    {
      wx.showToast({
        title: '已加入订单',
      });
      var commonTime = (new Date()).getTime();
      console.log(commonTime);
      that.setData({
        commonTime: commonTime
      })
      wx.setStorageSync('zhifutime', that.data.commonTime)
      wx.request({
        url: 'https://zdcd.online/api/db.php',
        data: {
          unionId: wx.getStorageSync('unionid'),
          set: 1,
          valstr: '0102',
          ordered: '1',
          time: that.data.commonTime,
          action: 'insert',
          person: 'hanlin',
          price: 100.1,
          words: 'hanjiz',
        },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        success: function (res) {
          wx.navigateTo({
            url: '../jieguo/jieguo',
          })
        }
      })
    }
    else
    {
      //console.log(wx.getStorageSync('zhifutime'));
      wx.showToast({
        title: '已在订单中',
        icon: 'loading',
      });
      wx.navigateTo({
        url: '../jieguo/jieguo',
      })
    }

    
  },
  onUnload:function(){
    if(wx.getStorageSync('prepage')==2)
    {
      wx.navigateBack({
        delta: 2,
      })
    }
   
    //wx.redirectTo({
    //  url: wx.getStorageSync('prepage'),
    //})
  }
})
