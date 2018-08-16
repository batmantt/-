Component({
  externalClasses: ['my-class'],
  properties: {
    msg: {
      type: String,
      value: 'Default value'
    },
    // good: {
    //   type: Object,
    //   value: {}
    // }
    good_src: {            
      type: String,     
      value: '图片链接'  
    },
    good_title: {
      type: String,
      value: '商品标题'
    },
    good_price: {
      type: String,
      value: '原价'
    },
    good_itergral: {
      type: String,
      value: '所需积分'
    }
  },
  data: {
  
  },
  methods: {
    Ex_goods: function (e) {
      console.log(e)
    }
  },
 
})