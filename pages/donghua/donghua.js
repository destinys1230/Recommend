var app=getApp()
Page({

  data:{
    aheight: wx.getSystemInfoSync().windowHeight,
  },
 onLoad:function(){
   this.setData({
     paths: wx.getStorageSync('image_cache')
   })

   wx.request({
     url: 'https://zdcd.online/api/recsys.php',
     header: {
       'content-type': 'application/json'
     },
     data:{
       action:'tfapi',
       type:app.globalData.type,
     },
     method:'GET',
     success:function(ret){
       console.log("tfapiret",ret.data[0]);
       app.globalData.reclen=ret.data.length;

       for(var i=0;i<ret.data.length;i++)
       {
         //console.log("url", ret.data[i]);
         wx.request({
           url: ret.data[i],
           header: {
             'content-type': 'application/json'
           },
           data: {
             inputs: [app.globalData.choices],
           },
           method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
           success: function (res) {
             console.log(res);
             var maxs = 0, maxval = 0;
             for (var i = 0; i < res.data.outputs[0].length; i++) {
               if (res.data.outputs[0][i] > maxval) {
                 maxval = res.data.outputs[0][i];
                 maxs = i;
               }
             }
             app.globalData.vals.push(maxs);
             console.log("return",app.globalData.vals);
             wx.setStorageSync('yuce', maxs);
             wx.setStorageSync('prepage', 2);
           }
         })
         console.log("return", app.globalData.vals);
       }
     }

   })
   

   setTimeout(function () {  
     wx.navigateTo({
       url: '../answer/answer',
     })
   }, 2500) //延迟时间 
 }
})