//在js中关键字 this 总是指向调用该方法的对象
//用于配置命名空间
// Ext.Loader.setConfig({  
//    enabled: true,  
//    paths : {//'类名前缀':'所在路径'  
//       'App.ux' : 'lib'  
//    }  
// });  
//或者用setPath设置匹配路径  
//Ext.Loader.setPath('App.ux', 'lib');//'类名前缀','所在路径'  


//预加载----在js执行onReady方法前，将这几个类加载到内存中进行缓存，当再次调用时不需要进行请求
Ext.require(
  [ 'Ext.data.*',
    'Ext.grid.*',
  ]);
//设置Model,在Model中可以进行Proxy,Associations(模型关联),Validatons(数据校验)
Ext.define( 'Mans',{
  extend: 'Ext.data.Model',
  fields: [ //定义Model中的参数
    {name: 'usName', type: 'string',mapping:'usName'},
    {name: 'age', type: 'int', defaultValue: 18}
  ]
  //,
  // Validatons: [  //可以在Model进行数据验证
  //   {type:'length', fields:'usName', min: 2}
  // ],
  // proxy:{   //也可以在Model进行数据代理,一般来说是在Store中进行,提高了灵活性，方便了同模型对象的Store之间共享代理
  //     type:'ajax',
  //     url:'xxxUrl',
  // }
  //idProperty:'usName'
});
//设置入口
Ext.onReady(function(){
  var data = [{'usName':'xiaoming','age':22},{'usName':'xiaohong','age':20}];
      
    // [ 'xiaoming', 'sss'],
    // [ 'xiaohong', '24']
  // ]
  //由ArrayStore辅助类,将data的数据进行读取,通过Model定义处理,最后将数据集赋值给store
  var store = Ext.create('Ext.data.Store',{
    model:'Mans',
    // proxy:{
    //   type:'ajax',
    //   reader:{
    //     type:'json',
    //     root:'records'
    //   },
      data:data
    // } 
  });
  var grid = Ext.create('Ext.grid.Panel',{
    store:store,//配置数据源
    //stateId:'stateGrid',
    columns:[
      {
        text:'姓名',
        flex:1,   //列宽根据当前设置的flex数目来进行比例分配
        //renderer:  //获取值之前，将值传入指定方法中进行处理，并返回结果，作为值传入
        sortable:true, //为true时，当前列可进行排列
        dataIndex:'usName' //对应Model中的参数名
      },{
        text:'年龄',
        flex:1,
        sortable:false,
        //renderer
        dataIndex:'age'
      }],
    width:300,
    height:200,
    title:'Grid',
    renderTo:'grid-example', //指定渲染的地址
    viewConfig:{
      stripeRows:true //为true,显示斑马线
    }
  });
});



