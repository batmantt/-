Component({
  externalClasses: ['my-class'],
  properties:{
    list: {
      type: Array,
      value: []
    }
  },
  data: {
    week: [
      {
        id: 1,
        val: "一"
      },
      {
        id: 2,
        val: "二"
      },
      {
        id: 3,
        val: "三"
      },
      {
        id: 4,
        val: "四"
      },
      {
        id: 5,
        val: "五"
      },
      {
        id: 6,
        val: "六"
      },
      {
        id: 7,
        val: "日"
      },
    ]
  },
  methods: {
    clickSign: function(e) {
      // 向父组件传值
      this.triggerEvent('clicksign', e.currentTarget.dataset.day)
    }
  }
})