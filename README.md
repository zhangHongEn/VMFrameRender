### 小程序多次setData合并插件

			
          
          import VMFrameRender from ''
          
          Page({
            onLoad () {
              // 给this添加$setData方法
              new VMFrameRender(this)
              
              /** 多次setData合并 **/
              this.$setData({
                'person.name': '1'
              })
              this.$setData({
                'person.age': '2'
              })
              // 相当于
              this.setData({
                'person.name': '1',
                'person.age': '2'
              })
              
              
              /** 去除重复setData **/
              this.$setData({
                'person.name': '1'
              })
              // 第二次会覆盖第一次的操作
              this.$setData({
                'person': {
                  age: '1'
                }
              })
              // 相当于
              this.setData({
                'person': {
                  age: '1'
                }
              })
              
              
              /**
               * $setData回调函数可以正常使用, 和setData表现一致, 都是渲染完成后回调 
               * 但是未做数据修改, 如有需要可以在TODO处补全 
               **/
               
               this.$setData({
                 name: 1
               }, () => {
                 console.log(this.data.name)  // 1
               })
		       /**
			* 这里是undefined, 时间原因, 源码中未做数据同步, 不过在源码TODO处自行补充后即可和setData表现一致
			*/
               console.log(this.data.name)  // undefined


              
              
            }
          })
