### 1.浅尝使用echart

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>测试Echart</title>
    <style>
        #main{
            width: 300px;
            height: 200px;
        }
    </style>
</head>
<body>
    <!-- 建立dom容器 -->
    <div id="main"></div>
    <!-- 引入echarts -->
    <script src="https://cdn.jsdelivr.net/npm/echarts@5.4.0/dist/echarts.min.js"></script>
    <script>
        // 基于准备好的dom容器，初始化echarts实例
        // echart init(dom)

        const main = document.getElementById('main');
        const chart = echarts.init(main);

        // 指定图标的option 配置项和数据
        //     xAxis x轴 {}
        //         data 类目数据
        //     yAxis y轴
        //     series 系列列表
        //         type 图表类型
        //         data 数据，于xAxis.data相对应

        const option = {
            xAxis:{
                data:['html','css','js']
            },
            yAxis:{},//这里的yAxis可以给空对象
            //y轴上的数据是通过series设置的
            series:{
                type:'bar',
                data:[30,20,100]
            }
        }
        //使用刚指定的配置项和数据显示图表
        chart.setOption(option);

    </script>
</body>
</html>
```

### 2.Echarts的常用组件

+ 标题 title
+ 图例 legend
+ 工具栏 toolbox
+ 提示框 tooltip
+ 坐标轴 xAxis yAxis
+ 系列列表 series
+ 标记点 markPoint
+ 标记线 markLine

#### 1.标题 title

+ 常用属性
  + 主标题 text
  + 副标题 subtext
  + 位置 left
    + left 左对齐
    + right 右对齐
    + center 居中对齐
  + 主标题样式 textStyle
    + color 字体颜色
    + fontSize 字体大小
  + 副标题样式 subtextStyle
    + color 字体颜色
    + fontSize 字体大小
  + 可见性 show
    + true 显示
    + false 隐藏

```js
const option = {
  title:{
    text:'主标题',
    left:'center',
    subtext:'副标题',
    textStyle:{
      color:'blue',
      fontSize:28,
    },
    subtextStyle:{
      color:'#333',
      fontSize:20,
    },
    // show:false
  },
  //绘图区域，可以控制标题跟图表的间距
  grid:{
    top:80
  },
  xAxis:{
    data:['html','css','js']
  },
  yAxis:{},//这里的yAxis可以给空对象
  //y轴上的数据是通过series设置的
  series:{
    type:'bar',
    data:[30,20,100]
  }
}
//使用刚指定的配置项和数据显示图表
chart.setOption(option);
```

#### 2.提示框 tooltip

提示框出发方式trigger：

+ item图形触发，主要在散点图、饼状图等无类目轴的图表中使用
+ axis坐标轴触发，主要在柱状图、折线图等使用类目轴的图表
+ none什么都不触发

```js
tooltip:{
// trigger:'item', 
// trigger:'axis',
trigger:'none'
}
```

#### 3.图例 legend

图例legend：可以对不同系列的数据做标注和过滤，它需要与series搭配使用

```js
legend:{
  left:'right'
},
series:[
  {
    name:'数据1',
    type:'bar',
    data:[1,2,3]
  },
  {
    name:'数据2',
    type:'line',
    data:[3,2,1]
  }
]
//legend的标题是根据series里的name字段获取生成的
```

#### 4.工具栏 toolbox

+ 保存图片 saveAsImage
+ 配置项还原 restore
+ 数据视图工具 dataView
+ 数据区域缩放 dataZoom
+ 动态类型切换 magicType

```js
toolbox:{
  feature:{
  saveAsImage:{
  type:'jpg'//默认是png格式
  },
  dataView:{},
  restore:{},//搭配dataView使用，恢复dataView的改动
  dataZoom:{},
  magicType:{
    type:['line','bar','stack']
    }
  }
}
```

#### 5.坐标轴 xAxis yAxis

+ name 坐标轴名称
+ data 类目数据

Y轴的分割设置

+ splitNumber 分割段数
+ interval 强制设置坐标轴分割间隔
+ minInterval 坐标轴最小间隔
+ maxInterval 坐标轴最大间隔

```js
const option = {
  title: {
    text: '主标题',
    left: 'center',
    subtext: '副标题',
    textStyle: {
      color: 'blue',
      fontSize: 28,
    },
    subtextStyle: {
      color: '#333',
      fontSize: 20,
    },
    // show:false
  },
  //绘图区域，可以控制标题跟图表的间距
  grid: {
    top: 80
  },
  xAxis: {
    name: 'x轴坐标名称',
    data: ['html', 'css', 'js']
  },
  yAxis: {
    name: 'y轴坐标名称',
    // splitNumber:20
    // interval:5,
    minInterval: 20,
    maxInterval: 50

  },//这里的yAxis可以给空对象
  //y轴上的数据是通过series设置的
  tooltip: {
    // trigger:'item', //例如柱状图来说，根据柱状图来提示，而axis则是根据x坐标轴来提示
    // trigger:'axis', //
    trigger: 'none'
  },
  legend: {
    // data:['图例1','图例2'],
    left: 'left'
  },
  series: [
    {
      name: '数据1',
      type: 'bar',
      data: [100, 200, 300]
    },
    {
      name: '数据2',
      type: 'line',
      data: [300, 200, 100]
    }
  ],
  toolbox: {
    feature: {
      saveAsImage: {
        type: 'jpg'//默认是png格式
      },
      dataView: {},
      restore: {},//搭配dataView使用，恢复dataView的改动
      dataZoom: {},
      magicType: {
        type: ['line', 'bar', 'stack']
      }
    }
  }
}
chart.setOption(option);
```

#### 6.系列列表 series

+ 列表类型 type
+ 系列名 name ：用于提示tooltip、图例legend筛选、数据更新
+ 数据 data
+ 标记点 markPoint {}
  + data [] 标记的数据
    + {type:'max'} 最大值
    + {type:'min'} 最小值
    + {value:'值',coord:[x,y]} 坐标位置
+ 标记线 markLine
  + data [] 标记数据
    + name 名称
    + type 类型 'average'、'min'、'max'
    + coord 点位

```js
								series: [{
                    name: '数据1',
                    type: 'bar',
                    data: [100, 200, 300],
                    markPoint: {
                        data: [{
                                type: 'max',
                            }, {
                                type: 'min'
                            },
                            {
                                type: 'average'
                            },
                            {
                                coord: [0, 140], //自定义标点，0代表x轴的第一个，40代表y轴上的具体值的位置
                                value: '140次' //value 代表标点上显示的文字
                            }
                        ]
                    }
                },
                {
                    name: '数据2',
                    type: 'line',
                    data: [300, 200, 100],
                    markLine: {
                        data: [{
                                type: 'average'
                            },
                            {
                                type: 'min'
                            },
                            {
                                type: 'max'
                            },
                            [{
                                    coord: [0, 0]
                                },
                                {
                                    coord: [2, 150],
                                    value: '自定义的markLine'
                                }
                            ]
                        ]
                    }
                }
            ],
```

#### 拓展

深度的交互式数据探索

+ 数据可视化的基本需求是：总览为先，缩放过滤按需查看细节
+ echarts组件就是基于这样的需求而存在的

### 3.熟悉echarts常用图表的基本功能

+ 折线图 line
+ 饼图 pie
+ 散点图 scatter
+ K线 candlestick
+ 雷达 radar
+ 仪表盘 gauge
+ 地图 map

#### 1.折线图 line

折线图主要用来展示数据随着时间的推移的变化

折线图非常适合用于展示一个连续的二维数据，如某网站访问人数或商品销售价格的波动

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>折线</title>
    <style>
        #main{
            margin: 20px;
            width: 700px;
            height: 500px;
        }
    </style>
</head>
<body>
<!--建立dom 容器-->
<div id="main"></div>
<!--引入echarts-->
<script src="https://lib.baomitu.com/echarts/5.1.2/echarts.min.js"></script>
<script>
    const myChart = echarts.init(document.getElementById('main'));

    const option = {
        /* x轴
         *  data 类目轴数据
         *  boundaryGap 边界留白
         *  axisLabel 标签
         *      margin 标签偏移量
        */
        xAxis:{
            data:['html','css','js'],
            boundaryGap:0,
            axisLabel:{
                rotate:60,
                margin: 20
            }
        },
        /* y轴 */
        yAxis:{
            axisLabel:{
                margin:20
            }
        },
        /*series 系列集合
        *   type 系列名称
        *   name 系列名
        *   data 系列数据 [10,20,30]
        *   smooth 平滑
        *   itemStyle 项目样式
        *       color 颜色
        *   areaStyle 区域样式
        *       color 区域颜色
        *       opacity 透明度
        *   symbolSize 标记点大小
        *   symbol 标记形状
        *       内置形状：'circle','rect','roundRect','triangle','diamond','pin','arrow','none'
        *       'image://url'  图片
        *       'path://' svg
        */
        // series:[
        //     {
        //         id:1,
        //         name:'学习人数',
        //         type:'line',
        //         data:[30,20,40,100],
        //         smooth:true,
        //     },
        // ]
        series:{
            type:'line',
            data:[30,20,40,100],
            smooth:true,
            itemStyle:{
                color:'#00acec'
            },
            areaStyle:{
                color:'#00acec',
                opacity:0.3
            },
            symbolSize:40,
            // symbol:'pin',
            // symbol:'image://./images/bs.png'
        }
    };

    setTimeout(()=>{
        myChart.setOption({
            series: [
                {
                    id:1,
                    data:[30,20,0],
                }
            ]
        })
    },1000)

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
</script>
</body>
</html>

```

#### 2.饼图 pie

饼图主要用于展示不同类别数值相对于总数的占比情况

图中扇形的弧长表示该类别的占比大小，所有扇形的弧长的总和为100%

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>饼图</title>
    <style>
        #main{
            margin: 20px;
            width: 700px;
            height: 500px;
        }
    </style>
</head>
<body>
<!--建立dom 容器-->
<div id="main"></div>
<!--引入echarts-->
<script src="https://lib.baomitu.com/echarts/4.7.0/echarts.min.js"></script>
<script>
    // 基于准备好的dom，初始化echarts实例
    const myChart = echarts.init(document.getElementById('main'));
    // 指定图表的配置项和数据
    const option = {
        /*视觉映射 visualMap
        *   min 最小值
        *   max 最大值
        *   inRange 定义 在选中范围中 的视觉元素
        *       colorLightness[0, 1] 亮度
        * */
        visualMap:{
            min:0,
            max:100,
            inRange:{
                colorLightness:[0,1]
            }
        },

        /*饼图 pie
        *   type 图表类型
        *   data 数据 [{name,value},...]
        *   roseType 玫瑰图类型
        *       radius 半径
        *       area 面积
        *   radius 半径，[起始半径，结束半径]可生成环形
        *   itemStyle 项目样式
        *       color 颜色
        * */
        series:{
            type:'pie',
            data:[
                {name:'html',value:30},
                {name:'css',value:20},
                {name:'js',value:40},
                {name:'webgl',value:50},
            ],
            radius:['40%','70%'],
            itemStyle:{
                color:'#00acec'
            },
            label:{
                position:'inside',
                // position:'center',
                // formatter:'{b}\n{d}%',
                formatter:({name,percent})=>{
                    return `${name}\n${Math.round(percent)}%`
                },
                lineHeight:22,
                fontSize:14,
                fontWeight:'bold'
            },
            center:['50%','60%']
        }
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
</script>
</body>
</html>

```

#### 3.散点图 scatter

散点图通常用来识别两个变量之间的相关性或用来观察他们的关系，从而发现某种趋势，对于查找异常数据值或者理解数据分布也很有效

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>散点图</title>
    <style>
        #main{
            margin: 20px;
            width: 700px;
            height: 500px;
        }
    </style>
</head>
<body>
<!--建立dom 容器-->
<div id="main"></div>
<!--引入echarts-->
<script src="https://lib.baomitu.com/echarts/5.1.2/echarts.min.js"></script>
<script>
    // 基于准备好的dom，初始化echarts实例
    const myChart = echarts.init(document.getElementById('main'));
    //数据
    const labels=['9:42:10','9:42:11','9:42:12','9:42:13',]
    /*const data=[
        //x y  z
        [0, 0, 20],
        [1,10,40],
        [2,10,50],
        [3,30,30],
    ];*/
    const data=[
        //x y  z
        [new Date(), 0, 20],
        [new Date(new Date().getTime()+1000*60*60*2),10,40],
        [new Date(new Date().getTime()+1000*60*60*3),20,50],
        [new Date(new Date().getTime()+1000*60*60*4),30,30],
    ];
    // 指定图表的配置项和数据
    const option = {
        /*x 轴*/
        xAxis:{
            show:true,
            type:'time',
            axisTick:{
                show:true,
            },
            axisLabel:{
                show:true,
                // formatter: '{value} kg'
            }
        },
        /*y轴*/
        yAxis:{},
        /*散点图 scatter
        *   data 数据
        *   symbolSize 散点尺寸
        * */
        series:{
            type:'scatter',
            data,
            symbolSize:30,
            /*symbolSize:(data)=>{
                // console.log(data);
                return data[2]
            },
            label:{
                show:true,
                fontSize:14,
                fontWeight:'bold',
                position:'top',
                distance:15,
                // formatter:'{c}',
                formatter:(data)=>{
                    console.log(data);
                    return `散点大小：${data.value[2]}`
                }
            }*/

        }
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
</script>
</body>
</html>

```

#### 4.K线 candlestick

K线通常用于表示股票的走势

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>K线图</title>
    <style>
        #main{
            margin: 20px;
            width: 700px;
            height: 500px;
        }
    </style>
</head>
<body>
<!--建立dom 容器-->
<div id="main"></div>
<!--引入echarts-->
<script src="https://lib.baomitu.com/echarts/5.1.2/echarts.min.js"></script>
<script>
    // 基于准备好的dom，初始化echarts实例
    const myChart = echarts.init(document.getElementById('main'));
    // 指定图表的配置项和数据
    const option = {
        /*x 轴*/
        xAxis:{
            data:['周一','周二','周三','周四',]
        },
        /*y轴*/
        yAxis:{},

        /*k 线图 candlestick
        * data [open, close, lowest, highest]-[开盘值, 收盘值, 最低值, 最高值]
        * */
        series:{
            type:'candlestick',
            data:[
                [30,20,10,40],
                [20,30,10,40],
                [20,30,0,40],
                [20,30,0,50],
            ],
            barWidth:'20%',
            itemStyle:{
                // color:'red',
                /*color:(param)=>{
                    return 'orange'o
                },*/
                // borderColor:'orange',
                // color0:'#00acec',
                // borderColor0:'#00acec'
            }
        }
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
</script>
</body>
</html>

```

#### 5.雷达 radar

雷达图的每一个变量都有一个从中心向外发射的轴线，所有的轴之间的夹角相等，同时每个轴有相同的刻度。雷达图表适合对比变量在数据集内的高低。比如产品性能、排名、评估等

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>雷达</title>
    <style>
        #main{
            margin: 20px;
            width: 700px;
            height: 600px;
        }
    </style>
</head>
<body>
<!--建立dom 容器-->
<div id="main"></div>
<!--引入echarts-->
<script src="https://lib.baomitu.com/echarts/4.7.0/echarts.min.js"></script>
<script>
    // 基于准备好的dom，初始化echarts实例
    const myChart = echarts.init(document.getElementById('main'));
    /*英雄数据
    *   value [生命，攻击，暴击，防御，速度]
    * */
    const data=[
        {
            name:'关羽',
            value:[80,98,80,70,70]
        },
        {
            name:'鲁班',
            value:[85,70,75,95,80]
        },
    ];

    // 指定图表的配置项和数据
    const option = {
        /*标题 title*/
        title:{
            text:'英雄实力对比'
        },

        /*图例 legend
        *   data 数据
        *   orient 排列方式
        *       horizontal 水平，默认
        *       vertical 垂直
        * */
        legend:{},

        //提示
        tooltip:{},

        /*
        * 雷达坐标系组件 radar
        *   indicator 雷达图的指示器集合 []
        *       name 指示器名称
        *       min、max 数据区间，实际数据会在此区间内计算比值
        *       color 标签颜色
        *   shape 雷达形状
        *       polygon 多边形，默认
        *       circle 圆形
        *
        * */
        radar:{
            indicator:[
                {name:'生命',min:0,max:100,color:'green'},
                {name:'攻击',min:0,max:100,color:'red'},
                {name:'暴击',min:0,max:100,color:'orange'},
                {name:'防御',min:0,max:100,color:'#333'},
                {name:'速度',min:0,max:100,color:'blue'},
            ],
            shape:'polygon',
            // shape:'circle',
            splitArea:{
                areaStyle:{
                    color:[
                        'rgba(0,163,236,0)',
                        'rgba(0,163,236,0.1)',
                        'rgba(0,163,236,0.2)',
                        'rgba(0,163,236,0.3)',
                        'rgba(0,163,236,0.4)',
                    ]
                }
            },
            axisLine:{
                lineStyle:{
                    color:'#fff'
                }
            },
            splitLine:{
                lineStyle:{
                    color:'#fff'
                }
            }
        },

        /*
        * 雷达 radar
        *   type 图表类型
        *   data 数据 [{name,value[]},...]
        * */
        series:{
            type:'radar',
            data
        }

    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);



</script>
</body>
</html>

```

#### 6.仪表盘 gauge

仪表盘适合表示量的变化，如速度、体积、温度、进度、完成率、满意度等

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>仪表盘</title>
    <style>
        #main{
            margin: 20px;
            width: 700px;
            height: 500px;
        }
    </style>
</head>
<body>
<!--建立dom 容器-->
<div id="main"></div>
<!--引入echarts-->
<script src="https://lib.baomitu.com/echarts/4.7.0/echarts.min.js"></script>
<script>
    // 基于准备好的dom，初始化echarts实例
    const myChart = echarts.init(document.getElementById('main'));
    // 指定图表的配置项和数据
    const option = {
        /*
        * 仪表盘 gauge
        *   type 图表类型
        *   detail 仪表盘详情{formatter:'{value}%'}
        *   data 数据[{name,value},...]
        * */
        series:{
            type:'gauge',
            detail:{
                formatter:'{value}%'
            },
            data:[
                {name:'速度',value:80}
            ],
            startAngle:270-30,
            endAngle:-60,
            min:-200,
            max:200
        }

    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);

    /*随机修改仪表数值，每隔一秒钟修改一次*/
    setInterval(()=>{
        option.series.data[0].value=Math.round(Math.random()*400)
        myChart.setOption(option)
    },1000)

</script>
</body>
</html>

```

#### 7.地图 map

地图的绘制步骤

+ 下载地图文件
+ 注册地图：charts.registerMap('china',data);
+ 配置地图

JSON文件方式

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>中国地图</title>
    <style>
        #main{
            width: 100%;
            height: 600px;
        }
    </style>
</head>
<body>
<!--建立dom 容器-->
<div id="main"></div>
<!--引入echarts-->
<script src="https://lib.baomitu.com/echarts/4.7.0/echarts.min.js"></script>
<script>
    //初始化echarts实例
    const myChart = echarts.init(document.getElementById('main'));

    /*获取接送文件*/
    fetch('./data/China.json')
        .then((res) => res.json())
        .then(data => {
            //echarts 注册地图 registerMap
            echarts.registerMap('china',data)
            //echarts 配置文件
            const option = {
                title: {
                    text: '中国地图',
                    left:'center'
                },
                /*
                * 地图 map
                *   type 图表类型
                *   map 地图注册名
                * */
                series:{
                    type:'map',
                    map:'china',
                    // roam:'scale',
                    // roam:'move',
                    roam:true,
                    center: [115.97, 29.71],
                    zoom:1,
                    itemStyle:{
                        areaColor:'#00acec',
                        borderColor:'blue'
                    },
                    emphasis:{
                        itemStyle:{
                            areaColor:'rgba(0,163,236,0.5)',
                            borderColor:'#00acec'
                        },
                        label:{
                            color:'blue'
                        }
                    }
                }
            };
            //基于配置文件显示图表
            myChart.setOption(option);
        })

</script>
</body>
</html>

```

GEO组件方式

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>中国地图</title>
    <style>
        body{margin: 0}
        #main{
            width: 100%;
            height: 600px;
            background-color: #044161;
        }
    </style>
</head>
<body>
<!--建立dom 容器-->
<div id="main"></div>
<!--引入echarts-->
<script src="https://lib.baomitu.com/echarts/4.7.0/echarts.min.js"></script>

<script>
    const myChart = echarts.init(document.getElementById('main'));
    /*获取接送文件*/
    fetch('./data/China.json')
        .then((res) => res.json())
        .then(data => {
            echarts.registerMap('china',data);
            const option = {
                title: {
                    text: '中国地图',
                    left:'center',
                    textStyle:{
                        color:'rgba(255,255,255,0.8)',
                    },
                    top:24
                },
                geo: {
                    map: 'china',
                    roam:true,
                    zoom:1,
                    itemStyle:{
                        areaColor:'#004981',
                        borderColor:'#029fd4'
                    },
                    emphasis:{
                        itemStyle:{
                            color:'#029fd4'
                        },
                        label:{
                            color:'#fff'
                        }
                    }
                },
                series: [{
                    name: 'pm2.5',
                    type: 'scatter',
                    coordinateSystem:'geo',
                    data: [
                        {
                            name:'海门',
                            value:[121.15, 31.89, 9]
                        },
                        {
                            name:'鄂尔多斯',
                            value:[109.781327, 39.608266, 12]
                        },
                        {
                            name:'招远',
                            value:[120.38, 37.35, 18]
                        },

                    ],
                    symbolSize: function (val) {
                        return val[2];
                    },
                }]
            };
            myChart.setOption(option);
        })

</script>
</body>
</html>
```

#### 8.案例

1.疫情折线图

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>西虹市 新增确诊/治愈 趋势</title>
    <style>
        #main{
            margin: 20px;
            width: 700px;
            height: 500px;
        }
    </style>
</head>
<body>
<!--建立dom 容器-->
<div id="main"></div>
<!--引入echarts-->
<script src="https://lib.baomitu.com/echarts/4.7.0/echarts.min.js"></script>
<script>
    /*基于准备好的dom，初始化echarts实例*/
    const myChart = echarts.init(document.getElementById('main'));
    /*数据*/
    //日期
    const xData=['3.3', '3.4', '3.5', '3.6', '3.7', '3.8', '3.9'];
    //确诊数据
    const qzData=[200, 170, 90, 80, 30, 40, 10];
    //治愈数据
    const zyData=[10, 20, 40, 70, 120, 145, 150];


    /*指定图表的配置项和数据*/
    const option = {
        /*标题 title {}
        *   主标题 text
        *   副标题 subtext
        *   主标题样式 textStyle
        *       color
        *       fontSize
        * */
        title:{
            text:'西虹市 新增确诊/治愈 趋势',
            subtext:'单位：例',
            textStyle:{
                fontSize:16
            }
        },


        /*提示框 tooltip
        *   trigger 提示框触发方式
        *       item 图形触发，主要在散点图，饼图等无类目轴的图表中使用。
        *       axis 坐标轴触发，主要在柱状图，折线图等会使用类目轴的图表
        *       none 什么都不触发
        *   backgroundColor 背景色
        *   textStyle 文字样式
        *   borderWidth 边界宽度
        *   borderColor 边界颜色
        * */
        tooltip:{
            trigger:'axis',
            backgroundColor:'#fff',
            textStyle:{
                color:'#333'
            },
            borderWidth:1,
            borderColor:'#ddd'
        },

        /*x轴
        *   data 类目轴数据
        *   boundaryGap 边界留白
        *   axisLine 轴线
        *       show 可见性
        *   axisLabel 标签
        *       rotate 旋转
        *       margin 外边距
        *   axisTick 刻度
        *       show 可见性
        * */
        xAxis:{
            data:xData,
            axisTick:{
                show:false,
            },
            boundaryGap:0,
            axisLine:{
                show:false
            },
            axisLabel:{
                rotate:50,
                margin:15
            }
        },


        /*y轴
        *   其属性与x 轴类似
        * */
        yAxis:{
            axisLine:{
                show:false
            },
            axisTick:{
                show:false
            }
        },


        /*图例 legend
        *   data[] 图例的数据,每一项代表一个系列的 name
        *   icon 图表形状
        *   itemGap 元素间隙
        *   itemHeight 元素高度
        *   textStyle 文字样式
        *       fontSize 大小
        *       color 颜色
        *       padding 内间距
        *   left top right bottom 边界位置
        * */
        legend:{
            icon:'circle',
            left:'right',
            top:32,
            itemHeight:7,
            textStyle:{
                padding:[0,0,0,-9],
                color:'#999'
            }
        },

        /*网格 grid
        *   left top right bottom 边界位置
        * */
        grid:{
            left:50,
            right:10,
            top:70
        },

        /*系列列表 series
        *   name 系列名,用于提示tooltip，图例legend 筛选，数据更新
        *   type 列表类型
        *   lineStyle 线的样式
        *       color 颜色
        *   showSymbol 标记点的显示
        *   smooth 线的圆滑
        *   data 数据
        * */
        series:[
            {
                name:'确诊',
                type:'line',
                data:qzData,
                smooth:true,
                lineStyle:{
                    color:'crimson'
                },
                showSymbol:false
            },
            {
                name:'治愈',
                type:'line',
                data:zyData,
                smooth:true,
                /*lineStyle:{
                    color:'lightseagreen'
                },*/
                itemStyle:{
                    color:'lightseagreen'
                },
                symbol:'none'
            },
        ]

    };


    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
</script>
</body>
</html>
```

### 4.Echarts的高级应用

深度认知echarts

提高对复杂图表项目的代发能力

+ 多坐标轴
+ 异步数据
+ 数据集
+ 区域缩放
+ 视觉映射
+ 事件
+ 富文本标签

#### 1.多坐标轴

多坐标轴的常见应用就是一个图表有两个Y轴

```js
const option = {
  /*图例*/
  legend:{data:['学习人数','就业人数']},
  /*提示*/
  tooltip:{},
  /*x 轴*/
  xAxis:{
    data:['html','css','js']
  },

  /*y 轴
        *   name 坐标轴名称
        *   min 刻度最小值
        *   max 刻度最大值
        * */
  yAxis:[
    {max:50},
    {},
  ],

  /*系列列表 series
        *   yAxisIndex 当前系列对应的y 轴的索引位置
        * */
  series:[
    {
      name:'学习人数',
      type:'bar',
      data:[30,20,40],
      yAxisIndex:0
    },
    {
      name:'就业人数',
      type:'bar',
      data:[330,450,850],
      yAxisIndex:1
    }
  ]
};
```

#### 2.数据更新和数据集

请求数据的方式有：Ajax、Fetch

数据的更新有两种思路

+ 请求到数据后，再setOption()
+ 先setOption()，有什么先配置什么，等请求到数据后再追加配置

注：在数据加载的过程中，还可以使用echarts实例对象的loading功能

+ 显示loading：showLoading()
+ 隐藏loading：hideLoading()

```js
const myChart = echarts.init(document.getElementById('main'));
/*有什么先配置什么*/
myChart.setOption({
  title: {
    text: '中国地图',
    left:'center'
  }
});
myChart.showLoading()
fetch('./data/China.json')
  .then((res) => res.json())
  .then(data => {
  myChart.hideLoading()
  /*注册地图*/
  echarts.registerMap('china', data);
  /*等请求到数据后，追加配置*/
  myChart.setOption({
    series: {
      type:'map',
      map:'china',
    }
  });
})
```

##### 数据集 dataset

dataset 数据集组件是从echarts4开始有的，用于数据管理

dataset的优点：

+ 基于原始数据，设置映射关系，形成图表
+ 数据和配置分离，便于单独管理
+ 数据可以被多个系列或者组件复用
+ 支持更多的数据常用格式，例如二维数组、对象数据等



```js
//数据源
/*const source=[
        [null,'学习人数','就业人数'],
        ['html',  30,       40],
        ['css',   20,       30],
        ['js',    40,       50]
    ]*/
const source=[
  {'大前端':'html','学习人数':30,'就业人数':40},
  {'大前端':'css','学习人数':20,'就业人数':30},
  {'大前端':'js','学习人数':40,'就业人数':50},
]

// 指定图表的配置项和数据
const option = {
  legend:{},
  /*
        * dataset数据集
        *   source 数据源 []
        * */
  dataset:{source},

  /*x轴
        *   type 轴的类型
        *       category 类目轴，离散型数据
        *       value 数值轴，连续性数据
        * */
  xAxis:{
    type:'category',
    // data:['html','css','js']
  },
  yAxis:{
    type:'value'
  },

  /*系列列表*/
  series:[
    {
      // name:'学习人数',
      type:'bar',
      // data:[30,20,40]
    },
    {
      type:'bar'
    },
  ]

};
```

数据集的行列映射

```js
    const source=[
        ['大前端','学习人数', '就业人数'],
        ['html',  20,   25],
        ['css',   10,   15],
        ['js',    30,   40]
    ];

    /* 矩阵的转置
    [
        ['大前端','html', 'css','js'],
        ['学习人数',  20,   10,  25],
        ['就业人数',   25,   15, 40],
    ]
    * */

    // 指定图表的配置项和数据
    const option = {
        legend: {},
        tooltip: {},

        /*
        * dataset数据集
        *   source 数据源 []
        *   seriesLayoutBy 行列映射
        *       column 基于列映射
        *       row 基于行映射
        * */
        dataset: {
            source,
        },

        /*grid [{},{}] 在一个echarts 实例中建立多个grid，并设置其位置
        *   bottom 下边距，如'55%'
        *   top 上边距，如'55%'
        * */
        grid:[
            {bottom:'55%'},
            {top:'55%'}
        ],


        /*建立两个x 轴，分属两个网格
        *   type 轴类型，如category
        *   gridIndex 绘图区索引位置
        * */
        xAxis: [
            {type: 'category',gridIndex:0},
            {type: 'category',gridIndex:1},
        ],
        /*建立两个y 轴，分属两个网格*/
        yAxis:[
            {type:'value',gridIndex:0},
            {type:'value',gridIndex:1},
        ],
        /*
        * series系列
        *   type 图表类型
        *   seriesLayoutBy 行列映射
        *       column 列映射，默认
        *       row  行映射
        *   xAxisIndex x轴索引
        *   yAxisIndex y轴索引
        * */
        series: [
            {type: 'bar',xAxisIndex:0,yAxisIndex:0,seriesLayoutBy:'column'},
            {type: 'bar',xAxisIndex:0,yAxisIndex:0,seriesLayoutBy:'column'},
            {
                type:'bar',
                xAxisIndex:1,
                yAxisIndex:1,
                seriesLayoutBy:'row'
            },
            {
                type:'bar',
                xAxisIndex:1,
                yAxisIndex:1,
                seriesLayoutBy:'row'
            },
            {
                type:'bar',
                xAxisIndex:1,
                yAxisIndex:1,
                seriesLayoutBy:'row'
            },
        ]
    };
```

##### 数据集的维度映射

数据集的维度指的就是每个系列的名称name

维度映射作用：对数据的维度信息统一定义和管理

Echarts默认会在dataset.source 的第一行中获取维度信息

但是，如果在dataset里指定了dimensions，那么echarts不再自动从dataset.source中获取维度信息

```js
//数据源
    const source=[
        ['html',  20,   25],
        ['css',   10,   15],
        ['js',    30,   40]
    ];

    //维度映射 dimensions
    const dimensions=[null,{name:'学习人数'}, '就业人数']

    // 指定图表的配置项和数据
    const option = {
        legend: {},
        tooltip: {},
        dataset: {source,dimensions},
        xAxis: {type: 'category'},
        yAxis: {},
        series: [
            {
                // name:'上课人数',
                type: 'bar',
            },
            {
                type: 'bar',
            },
        ]
    };
```

##### 数据集的encode 编辑映射

encode可以定义数据的哪个维度被编码成什么

默认series里的第一个系列对应的就是数据源里的第二列数据，后面的以此类推

可是，如果我们想让series里的第一个系列映射数据源里的第二列，而且还不想改变数据源（数据源是公共资源），应该怎么办呢？这就要用到编码映射

```js
//维度映射
    const dimensions=['大前端','学习人数', '就业人数'];
    //数据源
    const source =[
        ['html',  20,   25],
        ['css',   10,   15],
        ['js',    30,   40],
    ];

    // 指定图表的配置项和数据
    const option = {
        legend:{},
        tooltip:{},
        dataset: {dimensions,source},
        /*设置类目轴和数值轴*/
        xAxis:{type:'category'},
        yAxis:{type:'value'},
        /*encode 编码映射
        *   x x轴维度
        *   y y轴维度
        *   seriesName 系列名，n|[n]|[n,m,...]
        *   tooltip 提示信息，n|[n]|[n,m,...]
        * */
        series:{
            type:'bar',
            encode:{
                // x:0,
                x:'大前端',
                // y:2,
                y:'就业人数',
                // seriesName:2,
                tooltip:[1,2]
            }
        }
    };
```

##### 区域缩放 dataZoom

作用：概览整体，观察细节

区域缩放方式

+ 框选型数据区域缩放组件（dataZoomSelect）：提供一个选框进行数据区域的缩放，即toolbox.feature.dataZoom，配置项在toolbox中
+ 内置型数据区域缩放组件（dataZoomInside）：内置于坐标系中，使用户可以在坐标系上通过鼠标拖拽、鼠标滚轮、手指滑动（触屏上）来缩放或漫游坐标系
+ 滑动条型数据区域缩放组件（dataZoomSlider）：有单独的滑动条，用户在滑动条上进行缩放或漫游

```js
//数据源
    const source = [
        //x   y   z
        [2,  1, 5],
        [4,  2, 10],
        [6,  3, 15],
        [8,  4, 20],
        [10, 5, 25],
        [12, 6, 30],
        [14, 7, 35],
        [16, 8, 40],
        [18, 9, 45],
    ];

    // 指定图表的配置项和数据
    const option = {
        tooltip: {},
        /*工具栏 toolbox
        *   feature{} 工具配置项
        *     dataZoom{} 框选型缩放缩放
        * */
        toolbox:{
            feature:{
                dataZoom:{}
            }
        },

        /*
        * x 轴
        *   min 最小值
        *       dataMin 取所有数据中的最小值
        *   max 最大值
        *       dataMax 取所有数据中的最大值
        * */
        xAxis: {
            type: 'value',
            min: 'dataMin',
            max: 'dataMax',
        },
        yAxis: {
            type: 'value',
            min: 'dataMin',
            max: 'dataMax',
        },
        /*
        * dataZoom 区域缩放 [{},{}]
        *   type 缩放方式
        *       inside 内置缩放，通过鼠标的平移缩放实现
        *       slider 滑动条缩放
        *   xAxisIndex 缩放作用于哪个x轴
        *   yAxisIndex 缩放作用于哪个y轴
        *   start 起始位，百分百 [0,100]
        *   end 结束位，百分百 [0,100]
        * */
        dataZoom:[
            {
                type:'inside',
                // start:50,
                // end:60
            },
            {
                type:'slider',
                xAxisIndex:0
            },
            {
                type:'slider',
                yAxisIndex:0
            },
        ],

        /*数据集*/
        dataset:{source},
        /*系列列表*/
        series: {
            type: 'scatter',
            symbolSize: function (param) {
                return param[2];
            },
        },
    };
```

##### 视觉映射



```js
//数据源
    const source = [
       //x   y   z
        [2,  1, 10],
        [4,  2, 20],
        [6,  3, 30],
        [8,  4, 50],
        [10, 5, 50],
        [12, 6, 60],
        [14, 7, 70],
        [16, 8, 80],
        [18, 9, 90],
    ];

    // 指定图表的配置项和数据
    const option = {
        tooltip: {},
        /*绘图区*/
        grid:{
            left:120
        },
        /*x 轴*/
        xAxis: {},
        /*y 轴*/
        yAxis: {},
        /*数据集*/
        dataset:{source},
        /*
        * visualMap 视觉映射 {}
        *   type 映射方式
        *       continuous 连续型
        *       piecewise 分段型
        *   min 映射区间的起始位置，如0
        *   max 映射区间的接收位置，如90
        *   calculable 是否显示拖拽用的手柄，只适用于连续型
        *   range [] 显示此范围内的项目，百分比类型，只适用于连续型,如[0,100]
        *   dimension 基于哪个维度的数据进行视觉映射
        *   inRange 自定义取色范围
        *       color[] 颜色映射
        *       symbolSize[] 大小映射
        *
        * */
        /*visualMap:{
            type:'continuous',
            dimension:2,
            min:0,
            max:100,
            calculable:true,
            // range:[50,100],
            inRange: {
                symbolSize:[3,80],
                color:['#00acec','yellow','orange']
            }
        },*/
        visualMap:{
            type:'piecewise',
            dimension:2,
            min:0,
            max:100,
            bottom:40,
            inRange: {
                symbolSize:[3,80],
                // color:['#00acec','yellow','orange'],
                colorSaturation:[0,1],
                colorHue:[0,360]
            }
        },

        /*系列列表*/
        series: [
            {
                name: '视觉映射',
                type: 'scatter',
                encode:{
                    tooltip:[0,1,2]
                }
            },
        ]
    };

```



### 5.Echarts监听事件

> Echarts使用on绑定事件，事件名称对应dom事件名称，均为小写的字符串。如

```js
myChart.on('click',function(parmas){
  comsole.log(parmas)
})
```

组件交互事件的监听

在Echarts中基本上所有的组件交互行为都会触发相应的事件

如图例开关的行为会触发legendselectchanged事件

```js
myChart.on('legendselectchanged'function(parmas){
  
})
```

代码触发Echarts中组件的行为

Echarts通过调用echarts实例对象的dispatchAction()方法触发组件行为

```js
myChart.setOption(option);

    /*使用dispatchAction 方法高亮并提示一个扇形
    *   type 触发的行为类型
    *       highlight 高亮
    *       showTip 显示提示
    *       downplay 取消高亮
    *       hideTip 取消提示
    *   seriesIndex 系列索引，用于寻找系列列表中的某个系列
    *   dataIndex 数据所有，用于寻找系列中的某个元素
    * */
    myChart.dispatchAction({
        type:'highlight',
        seriesIndex: 0,
        dataIndex:1
    })
    myChart.dispatchAction({
        type:'showTip',
        seriesIndex: 0,
        dataIndex:1
    })
    myChart.dispatchAction({
        type:'downplay',
        seriesIndex: 0,
        dataIndex:1
    })
    myChart.dispatchAction({
        type:'hideTip',
        seriesIndex: 0,
        dataIndex:1
    })
```

### 6.富文本标签

富文本标签，就是内容丰富的文本标签

富文本的实现步骤

1.用formatter写文本片段

```js
formatter:
	`{a|文字内容}\n' + 
	'{b|文字内容}\n' + 
	'默认样式{x|样式 x}`

//相当于

<span class="a">样式a</span>\n
<span class="b">样式b</span>\n
默认样式<span class="x">x</span>
```

2.用rich设置文本样式 / 文本块和文本片段

```js
// 数据
    const data=[
        {name:'杨戬',value:80,img:'./images/yj.jpg'},
        {name:'鲁班',value:60,img:'./images/lb.jpg'},
        {name:'沈梦溪',value:40,img:'./images/smx.jpg'},
        {name:'诸葛亮',value:30,img:'./images/zgl.jpg'}
    ];

    //获取hero的数据
    // const item=data[0]

    /*自定义标签 label
    *   formatter 文本片段
    *       '{样式名|文字内容}\n 换行'
    *   文本块的样式
    *       textBorderColor 文本描边颜色
    *       textBorderWidth 文本描边宽度
    *       ...
    *   rich 富文本，在其中写入样式
    *       width 宽
    *       height 高
    *       backgroundColor 背景色
    *           image 背景图
    *       fontSize 文字大小
    *       lineHeight 行高
    *       fontWeight 文本加粗
    *       ...
    * */
    data.forEach(item=>{
        item.label={
            formatter:'{img|}\n{name|'+item.name+'}\n{val|战力:'+item.value+'}',
            textBorderColor:'#fff',
            textBorderWidth:5,
            rich:{
                img:{
                    width:60,
                    height:60,
                    backgroundColor:{
                        image:item.img
                    },
                    borderColor:'#fff',
                    borderWidth:5
                },
                name:{
                    fontSize:20,
                    lineHeight:32,
                    fontWeight:'bold'
                }
            }
        }
    })

    /*配置项*/
    const option = {
        title:{text:'英雄战力'},
        series: {
            type: 'pie',
            data,
            radius:'70%',
        }
    };
```

### 7.大屏的制作原理

> 1.大屏的制作原理
>
> 2.Echarts主题样式设置
>
> 3.百度地图
>
> 4.在echarts中使用百度地图

#### 1.大屏的制作原理

> 大屏就是要显示在大屏幕里的网页，大屏幕通常放在公共空间中国展示数据
>
> 大屏的尺寸一般是1920*1080
>
> 大屏可以不用考虑浏览器的兼容性，只要谷歌浏览器能兼容就行
>
> 大屏的制作原理是在浏览器中，建立多个echarts容器，将不同的echarts图表放入其中

#### 2.Echarts主题样式设置

>echarts的样式设置方法有以下几种
>
>+ 颜色主题（theme）
>+ 调色盘（color）
>+ 具体的样式设置（itemStyle、lineStyle、areaStyle、label...）
>+ 视觉映射（visualMap）

颜色主题（theme）

颜色主题是修改全局样式的方法

echarts内置了两套主题，分别是'light'和'dark'，其设置方法为echarts.init(Dom,'light');

若要使用其他主题，需要去主题编辑器下载。

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>主题样式</title>
    <style>
        #main{
            margin: 20px;
            width: 700px;
            height: 500px;
        }
    </style>
</head>
<body>
<!--建立dom 容器-->
<div id="main"></div>
<!--引入echarts-->
<script src="https://lib.baomitu.com/echarts/4.7.0/echarts.min.js"></script>
<script src="./js/vintage.js"></script>
<script>
    const dom= document.getElementById('main');
    // const myChart = echarts.init(dom,'light');
    // const myChart = echarts.init(dom,'dark');
    const myChart = echarts.init(dom,'vintage');
    // const myChart = echarts.init(dom,null);

    const option = {
        series: [
            {
                type:'pie',
                data:[
                    {value:20,name:'html'},
                    {value:10,name:'css'},
                    {value:30,name:'js'},
                    {value:40,name:'vue'},
                ],
            }
        ]
    };

    myChart.setOption(option);


</script>
</body>
</html>

```

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>主题样式</title>
    <style>
        #main{
            margin: 20px;
            width: 700px;
            height: 500px;
        }
    </style>
</head>
<body>
<!--建立dom 容器-->
<div id="main"></div>
<!--引入echarts-->
<script src="https://lib.baomitu.com/echarts/4.7.0/echarts.min.js"></script>
<script src="./js/vintage.js"></script>
<script>
    const dom= document.getElementById('main');

    /*请求样式文件
    *   echarts.registerTheme() 基于json数据注册主题
    * */
    fetch('./lib/wonderland.json')
        .then((res) => res.json())
        .then(data => {
            echarts.registerTheme('wonderland',data)
            draw()
        });

    function draw(){
        const myChart = echarts.init(dom,'wonderland');
        const option = {
            series: [
                {
                    type:'pie',
                    data:[
                        {value:20,name:'html'},
                        {value:10,name:'css'},
                        {value:30,name:'js'},
                        {value:40,name:'vue'},
                    ],
                }
            ]
        };

        myChart.setOption(option);
    }



</script>
</body>
</html>
```

调色盘（color）

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>调色盘</title>
    <style>
        #main{
            margin: 20px;
            width: 700px;
            height: 500px;
        }
    </style>
</head>
<body>
<!--建立dom 容器-->
<div id="main"></div>
<!--引入echarts-->
<script src="https://lib.baomitu.com/echarts/4.7.0/echarts.min.js"></script>
<script src="./js/vintage.js"></script>
<script>
    const dom= document.getElementById('main');
    const myChart = echarts.init(dom);
    /*color 可以设置色盘*/
    const option = {
        color: ['#00acec','#2f4554', '#61a0a8'],
        series:{
            type:'pie',
            data:[
                {name:'css',value:25},
                {name:'html',value:30},
                {name:'js',value:35},
                {name:'canvas',value:15},
                {name:'echarts',value:20},
            ],
            roseType:'radius',
        }
    };

    myChart.setOption(option);
</script>
</body>
</html>

```

拓展：百度地图

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>百度地图</title>
    <style>
        html{height:100%}
        body{height:100%;margin:0px;padding:0px}
        #container{height:100%}
    </style>

</head>
<body>
<div id="container"></div>

<script type="text/javascript" src="https://api.map.baidu.com/api?v=3.0&ak=N4XKk2Y2TPrXzdn7Y0WNoAfoCpdtQmp9"></script>

<script>
    var map = new BMap.Map("container");
    var point = new BMap.Point(116.404, 39.915);
    map.centerAndZoom(point, 10);
    map.enableScrollWheelZoom(true);
    map.addControl(new BMap.NavigationControl());

    var marker = new BMap.Marker(point);        // 创建标注
    map.addOverlay(marker);

    map.setMapStyleV2({
        styleId: '5453dc64d711215271444d4abeaf6b44'
    });
</script>
</body>
</html>

```

大屏完整代码

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>大屏</title>
    <link rel="stylesheet" href="./css/main.css">
</head>
<body>
<!--标题-->
<div id="header">西虹市经济情况可视化</div>
<!--内容-->
<div id="cont">
    <div class="cont-edge">
        <div id="chartL1" class="box"></div>
        <div id="chartL2" class="box"></div>
        <div id="chartL3" class="box"></div>
    </div>
    <div class="cont-center">
        <div class="center-tit">
            <div class="center-row">
                <div class="center-num">12345678</div>
                <div class="center-num">67890542</div>
            </div>
            <div class="center-row">
                <div class="center-text">2019年收入情况</div>
                <div class="center-text">2019年总支出情况</div>
            </div>
        </div>
        <div class="center-cont">
            <!--背景图-->
            <div class="centerImg">
                <!--网格点-->
                <img class="img1" src="./images/lbx.png" alt="">
            </div>
            <div class="centerImg">
                <!--流光-->
                <img class="img2" src="./images/jt.png" alt="">
            </div>
            <!--地图容器-->
            <div id="chartC"></div>
        </div>
    </div>
    <div class="cont-edge">
        <div id="chartR1" class="box"></div>
        <div id="chartR2" class="box"></div>
        <div class="box">
            <div id="chartR3"></div>
        </div>
    </div>
</div>

<!--引入echarts-->
<script src="https://lib.baomitu.com/echarts/4.7.0/echarts.min.js"></script>
<!--引入样式-->
<script src="./js/walden.js"></script>
<!--引入百度地图api-->
<script src="https://api.map.baidu.com/api?v=3.0&ak=EcMeTlWuNyyqL4GwZT5Nmlj9mtpvhE9Y"></script>
<!--引入bmap 组件-->
<script src="https://cdn.jsdelivr.net/npm/echarts/dist/extension/bmap.min.js"></script>
<!--中国地图-->
<script src='./js/China.js'></script>
<!--绘制图表-->
<script>
    /*chartL1 - 折线图*/
    {
        /*数据源*/
        const source=[
            ['年','2014', '2015', '2016', '2017', '2018', '2019', '2020'],
            ['收入',820, 932, 901, 934, 1290, 1330, 1520],
            ['支出',200, 632, 601, 634, 850, 1000, 1100]
        ];

        /*实例化echarts*/
        const chart = echarts.init(document.getElementById('chartL1'),'walden');
        /*配置项
        *   title
        *       text '西虹市人民收入增长情况'
        *   dataset 数据集
        *       source 数据源
        *   xAxis
        *       type
        *           category 类目轴
        *       boundaryGap 边界间隙
        *       axisLabel 坐标轴刻度标签的相关设置
        *           rotate 刻度标签旋转的角度
        *   yAxis
        *       type
        *           value 数值轴
        *   series 系列集合
        *       type 系列类型，如line
        *       seriesLayoutBy 行列映射
        *           column 应到 dataset 的列，默认
        *           row 应到 dataset 的行
        *
        * */
        const option = {
            title:{
                text:'西虹市人民收入增长情况',
                left:'center'
            },
            dataset:{source},
            legend:{
                left:'right'
            },
            xAxis:{
                type:'category'
            },
            yAxis:{},
            series:[
                {
                    type:'line',
                    seriesLayoutBy:'row'
                },
                {
                    type:'line',
                    seriesLayoutBy:'row'
                },
            ]
        };
        /*显示图表*/
        chart.setOption(option);
    }

    /*chartL2 - 饼图*/
    {
        /*数据源*/
        const source=[
            {value:5000,name:'旅游'},
            {value:4500,name:'饮食'},
            {value:6500,name:'服装'},
            {value:3500,name:'电影'},
            {value:2500,name:'其它'}
        ];

        /*实例化echarts*/
        const chart = echarts.init(document.getElementById('chartL2'),'walden');
        /*配置项
        *   title
        *       text '西虹市人民衣食住行消费比'
        *   tooltip 提示
        *       formatter 提示信息格式化，如'{d}%'
        *   dataset 数据集
        *       source 数据源
        *   series 系列集合
        *       type 系列类型，如pie
        *       radius 半径
        *       roseType 南丁格尔图
        *       center 圆心位置
        * */
        const option = {
            title:{
                text:'西虹市人民衣食住行支出比',
                left:'center'
            },
            tooltip:{
                // formatter:'{d}%',
                formatter:({percent})=>{
                    console.log(percent);
                    return Math.round(percent)+'%'
                },
            },
            dataset:{source},
            series:{
                type:'pie',
                center:['50%','57%'],
                roseType:'radius',
                radius:['40%','70%']
            }
        };

        /*显示图表*/
        chart.setOption(option);
    }

    /*chartL3 - 散点图*/
    {
        /*实例化echarts*/
        const chart = echarts.init(document.getElementById('chartL3'),'walden');

        /*维度*/
        const dimensions=['收入','年龄','人口','住址','时间'];

        /*配置项*/
        const option = {
            /*
            * title 标题
            *   text 主标题，如'西虹市人民收入和年龄关系'
            *   left 左对齐方式
            * */
            title:{
                text:'西虹市人民收入和年龄关系',
                left:'center'
            },

            /*
            * 坐标轴
            *   type 坐标轴类型
            *       value  数值轴，适用于连续数据
            *   name 坐标轴名称
            * */
            xAxis:{
                // type:'value',
                // type:'category',
            },
            yAxis:{

            },
            /*
            * dataset 数据集
            *   dimensions 维度映射 []
            *       string，如 '年龄'，等同于 {name: '年龄'}
            *   source 数据源
            * */
            dataset:{
                dimensions
            },

            /*
            * series系列集合
            *   type 图表类型
            *       scatter 散点图
            *   symbolSize 散点大小
            *   encode 编码映射
            *       x  x坐标系的维度映射，如1|'年龄'
            *       y  y坐标系的维度映射，如0|'收入'
            *       tooltip 提示映射，如[0, 1]
            *   itemStyle 项目样式
            *       opacity 项目透明度
            * */
            series:{
                type:'scatter',
                symbolSize:3,
                encode:{
                    x:'年龄',
                    y:0,
                    tooltip:[0,1]
                },
                itemStyle: {
                    opacity:0.5
                }
            }
        };

        /*异步请求数据*/
        fetch('./lib/table.json')
            .then((res) => res.json())
            .then(data => {
                option.dataset.source=data
                chart.setOption(option)
            });

    }


    /*chartR1 - 雷达图*/
    {
        /*数据*/
        const data=[
            {
                name : '预算分配',
                value : [43000, 45000, 42000, 45000, 40000, 49000],
            },
            {
                name : '实际开销',
                value : [30000, 34000, 55000, 35000, 32000, 31000],
            }
        ];
        /*
        * 雷达坐标系组件 radar
        *   indicator 雷达图的指示器集合 []
        *       name 指示器名称, 也就是标签内容
        *       min、max 数据区间，实际数据会在此区间内计算比值
        *       color 标签颜色
        *   shape 雷达形状
        *       polygon 多边形，默认
        *       circle 圆形
        *
        * */
        const indicator=[
            { name: '销售',min:0,max:60000},
            { name: '管理',min:0,max:60000},
            { name: '信息技术',min:0,max:60000},
            { name: '客服',min:0,max:60000},
            { name: '研发',min:0,max:60000},
            { name: '市场',min:0,max:60000}
        ];

        /*实例化echarts*/
        const chart = echarts.init(document.getElementById('chartR1'),'walden');

        /*配置项*/
        const option = {
            /*
            * title 标题
            *   text 主标题，如'西虹市财务开销'
            * */
            title:{
                text:'西虹市财务开销',
            },

            /*
            * tooltip 提示
            * */
            tooltip:{},


            /*legend 图例
            *   data 数据，如['预算分配', '实际开销']
            *   orient 排列方式
            *       vertical 竖排
            *       horizontal 横排，默认
            *   left 左边距，如0
            *   top 上边距，如32
            * */
            legend:{
                data:['预算分配', '实际开销'],
                left:'left',
                top:32,
                orient:'vertical'
            },


            /*
            * 雷达坐标系组件 radar
            *   indicator[] 雷达图的指示器，定义雷达的轴
            * */
            radar:{
                indicator
            },


            /*
            * series系列集合
            *   type 图表类型
            *       radar 雷达图
            *   data 数据
            * */
            series:{
                type:'radar',
                data
            }
        };
        // 使用刚指定的配置项和数据显示图表。
        chart.setOption(option);
    }

    /*chartR2 - 柱状图*/
    {
        /*数据源*/
        const source=[
            ['时间','小麦','玉米','高粱'],
            [2017,  1000,  800,  900],
            [2018,  500,   650,  800],
            [2019,  800,   900,  1200],
        ];

        /*实例化echarts*/
        const chart = echarts.init(document.getElementById('chartR2'),'walden');

        /*配置项*/
        const option = {
            /*
            * title 标题
            *   text 主标题，如'西虹市农作物收成'
            * */
            title:{
                text:'西虹市农作物收成',
                left:'center'
            },
            tooltip:{},
            legend:{
                top:30
            },
            grid:{
                top:72,
                bottom:28
            },
            /*
            * dataset 数据集
            *   source 数据源
            * */
            dataset:{source},

            /*  xAxis
            *       type
            *           category 类目轴
            *   yAxis
            *       type
            *           value 数值轴
            */
            xAxis:{
                type:'category'
            },
            yAxis:{
                type:'value'
            },

            /*
            * series系列集合
            *   type 图表类型
            *       bar 柱状图
            *   color 颜色
            *       image 图像源
            *       repeat 图像的重复方式，如repeat
            * */
            series:[
                {
                    id:1,
                    type:'bar'
                },
                {
                    id:2,
                    type:'bar'
                },
                {
                    id:3,
                    type:'bar'
                },
            ]

        };
        chart.setOption(option);

        /*图像源*/
        //小麦
        const imgXm=new Image();
        imgXm.src='./images/xm.jpg';
        //玉米
        const imgYm=new Image();
        imgYm.src='./images/ym.jpg';
        //高粱
        const imgGl=new Image();
        imgGl.src='./images/gl.jpg';

        //当所有图片都加载成功后再绘图
        Promise.all([imgPro(imgXm),imgPro(imgYm),imgPro(imgGl),]).then(()=>{
            //绘图
            chart.setOption({
                series:[
                    {
                        id:1,
                        color:{
                            image:imgXm
                        }
                    },
                    {
                        id:2,
                        color:{
                            image:imgYm
                        }
                    },
                    {
                        id:3,
                        color:{
                            image:imgGl
                        }
                    },
                ]
            })
        });
        //建立Promise 对象，指定img 加载成功后，执行resolve
        function imgPro(img){
            return new Promise((resolve)=>{
                img.onload=function(){
                    resolve(img);
                }
            });
        }

    }

    /*chartR3 - 百度地图*/
    {
        const chart = echarts.init(document.getElementById('chartR3'),'walden');

        const option = {
            /*
            * title 标题
            *   text 主标题，如'西虹市在哪里'
            *   left 左对齐方式
            *   top 上边距，如12
            * */
            title:{
                text:'西虹市的空气质量',
                left:'center',
                top:12,
            },
            /*
            * bmap 百度地图
            *   center[经度,纬度] 地图中心点位，如[121.48, 31.22]
            *   zoom 缩放级别，如6
            *   roam 是否可以拖拽缩放
            *   mapStyleV2 地图样式
            *       styleId 样式id
            * */
            bmap:{
                center:[121.48, 31.22],
                zoom:6,
                mapStyleV2:{
                    styleId:'5453dc64d711215271444d4abeaf6b44'
                },
                roam:true,
            },

            /*系列列表
            *   type 系列类型
            *       scatter 散点图
            *       effectScatter 特效散点图
            *   coordinateSystem 坐标类型，bmap
            *   data 数据
            *   symbolSize 尺寸
            * */
            series : [
                {
                    id:1,
                    type:'scatter',
                    coordinateSystem:'bmap',
                    symbolSize:(data)=>{
                        return data[2]/10
                    }
                },
                {
                    id:2,
                    type:'effectScatter',
                    coordinateSystem:'bmap',
                    symbolSize:(data)=>{
                        return data[2]/10
                    }
                },
            ]
        };
        chart.setOption(option);

        /*获取空气质量质量数据*/
        fetch('./lib/pm.json')
            .then((res) => res.json())
            .then(data => {
                const len=data.length
                const dataMax=data.splice(len-5,len)
                console.log(dataMax);
                //绘图
                chart.setOption({
                    series:[
                        {
                            id:1,
                            data
                        },
                        {
                            id:2,
                            data:dataMax
                        },
                    ]
                })
            });


        /*获取百度地图的实例 chart.getModel().getComponent('bmap').getBMap()*/
        const map=chart.getModel().getComponent('bmap').getBMap()
        var point = new BMap.Point(121.48, 31.22);
        var marker = new BMap.Marker(point);        // 创建标注
        map.addOverlay(marker);
    }

    /*chartC - echarts地图*/
    {
        const chart = echarts.init(document.getElementById('chartC'),'walden');

        /*配置项*/
        const option = {
            /*
            * title 标题
            *   text 主标题，如'西虹市不同地区的平均收入'
            *   textStyle 主题样式
            *   left 左对齐方式
            *   top 上边距，如12
            * */
            title:{
                text:'西虹市不同地区的平均收入',
                textStyle:{
                    fontSize:24
                },
                left:'center',
                top:32,
            },

            /*
            * tooltip 提示
            *   backgroundColor 背景色，如'rgba(2,177,236,0.6)'
            * */
            tooltip:{},

            /*
            *地理坐标系组件 geo
            *   map 地图名称，如'china'
            *   zoom 缩放比例，如1
            *   roam 是否开启鼠标缩放和平移漫游
            *       scale 缩放
            *       move 平移
            *       true 都开启
            *   itemStyle 地图区样式
            *       areaColor 地图区域的颜色，如 rgba(0,29,132,0.8)
            *       borderColor 图形的描边颜色，如 #02c0ff
            *   emphasis 高亮状态下的多边形和标签样式
            *       itemStyle {} 项目样式
            *           shadowColor 投影颜色
            *
            * */
            geo:{
                map:'china',
                zoom:1,
                roam:true,
                itemStyle:{
                    areaColor:'rgba(0,29,132,0.8)',
                    borderColor:'#02c0ff'
                },
                emphasis:{
                    itemStyle:{
                        shadowColor:'#000',
                        shadowOffsetY:30,
                        shadowBlur:30
                    },
                }
            },


            /*
            * series系列集合
            *   name 名称，如'旅游人数'
            *   type 图表类型
            *       scatter 散点图
            *   coordinateSystem 坐标类型，如'geo'
            *   data 数据
            *   symbolSize 散点大小,可为函数(p)=>{return p[2]}
            *   encode 编码映射
            *       x  x坐标系的维度映射，如'收入'
            *       y  y坐标系的维度映射，如'年龄'
            *       tooltip 提示映射，如[0, 1, 2, 3, 4]
            *   itemStyle 项目样式
            *       color 项目颜色，如'rgba(255,255,255,0.6)'
            *   emphasis 高亮状态
            *       itemStyle 项目样式
            *           color 颜色，如'yellow'
            * */
            series:{
                id:1,
                type:'scatter',
                coordinateSystem:'geo',
                symbolSize:(param)=>{
                    return param[2]/15
                },
                emphasis:{
                    itemStyle:{
                        color:'yellow'
                    },
                }
            }

        };
        chart.setOption(option);

        fetch('./lib/income.json')
            .then((res) => res.json())
            .then(data => {
                dataLen=data.length
                chart.setOption({
                    series:[
                        {
                            id:1,
                            data
                        }
                    ]
                })
                setInterval(anim, 1000);
            });



        let curInd = 0;
        let dataLen = null;

        function anim() {
            /*取消之前高亮的图形
            *   type 触发的行为类型，见action
            *   seriesIndex 系列索引，用于寻找系列列表中的某个系列
            *   dataIndex 数据所有，用于寻找系列中的某个元素
            * */
            chart.dispatchAction({
                type: 'downplay',
                seriesIndex: 0,
                dataIndex: curInd
            });
            /*当前索引递增，不能超过系列元素的总数*/
            curInd = (curInd + 1) % dataLen;

            /*高亮当前图形*/
            chart.dispatchAction({
                type: 'highlight',
                seriesIndex: 0,
                dataIndex: curInd
            });
            /*显示 tooltip*/
            chart.dispatchAction({
                type: 'showTip',
                seriesIndex: 0,
                dataIndex: curInd
            });
        }



    }

</script>
</body>
</html>
```

总结：

有些时候大屏也会被要求自适应屏幕。这种适应必然是有宽高限制的，因为大屏太小的话，就不是大屏了



##### 大屏的自适应

大屏在自适应屏幕时要考虑两个方面

1.echarts容器对屏幕尺寸的自适应

+ css基础知识，如flex布局，百分比定位等...

2.echarts图表对容器尺寸的适应

+ 图表元素百分比定位，如left:'20%'
+ 使用echarts的media功能进行相应式布局

注：echarts的resize()方法，可以在容器大小发生改变时没改变图表尺寸

### 8.知识点拓展

+ 原生图形组件
+ 响应式布局
+ 渲染器
+ 三维echarts
+ webpack中使用echarts
+ 微信中使用echarts

#### 原生图形组件的基本概念

原生图形组件就是可以自定义图形的组件

原生图形组件里绘制的图形，可以绑定鼠标事件、拖拽事件等

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>原生图形</title>
    <style>
        #main{
            margin: 20px;
            width: 800px;
            height: 700px;
            background: antiquewhite;
        }
    </style>
</head>
<body>
<!--建立dom 容器-->
<div id="main"></div>
<!--引入echarts-->
<script src="https://lib.baomitu.com/echarts/5.1.2/echarts.min.js"></script>
<script>
    /*实例化echarts*/
    const myChart = echarts.init(document.getElementById('main'));
    //圆
    const circle={
        id:1,
        type:'circle',
        // position:[300,300],
        x:300,
        y:300,
        shape:{
            r:200
        },
        scaleX:0.5,
        scaleY:0.5,
        style:{
            fill:'#00acec',
            stroke:'#000',
            lineWidth:10
        },
        draggable:true,
        onmouseover:()=>{
            myChart.setOption({
                graphic: [
                    {
                        id:1,
                        style: {
                            fill:'green'
                        }
                    }
                ]
            })
        },
        onmouseout:()=>{
            myChart.setOption({
                graphic: [
                    {
                        id:1,
                        style: {
                            fill:'#00acec'
                        }
                    }
                ]
            })
        },
    }

    //原生图片
    const image={
        type:'image',
        x:100,
        y:100,
        // z:-1,
        rotation:0.5,
        style:{
            image:'./images/dog.jpg'
        }
    }

    //文本
    const text={
        type:'text',
        x:200,
        y:50,
        style:{
            text:'好好学习，天天上上！\n好好学习，天天上上！',
            font: 'italic bolder 32px cursive',
            textAlign:'center',
            textVerticalAlign:'middle',
            fill:'rgba(0,0,0,0)',
            stroke:'#000',
            lineWidth: 1,
        }
    }

    //矩形
    const rect={
        type:'rect',
        x:100,
        y:100,
        shape:{
            width:200,
            height:150,
        },
        style:{
            fill:'#00acec',
            stroke:'#000',
            lineWidth:10
        }
    }

    //圆环
    const ring={
        type:'ring',
        x:300,
        y:300,
        shape:{
            r0:100,
            r:200
        }
    }

    //扇形
    const sector={
        type:'sector',
        x:300,
        y:300,
        shape:{
            r0:50,
            r:200,
            startAngle: -Math.PI/6,
            endAngle: -Math.PI*5/6,
            clockwise:false,
        }
    }

    //圆弧
    const arc={
        type:'arc',
        x:300,
        y:300,
        shape:{
            r:200,
            startAngle: -Math.PI/6,
            endAngle: -Math.PI*5/6,
            // clockwise:false,
        }
    }

    //多边形
    const polygon={
        type:'polygon',
        x:300,
        y:300,
        shape:{
            points:[
                [0,0],
                [-100,100],
                [100,100],
            ]
        }
    }

    //多边形线
    const polyline={
        type:'polyline',
        x:300,
        y:300,
        shape:{
            points:[
                [0,0],
                [-100,100],
                [100,100],
                [100,-100],
            ],
            smooth:0.5
        }
    }

    //线
    const line={
        type:'line',
        x:300,
        y:300,
        shape:{
            x0:0,
            y0:0,
            x1:300,
            y1:0
        }
    }

    //贝塞尔
    const bezierCurve={
        type:'bezierCurve',
        x:300,
        y:300,
        shape:{
            x1:0,
            y1:0,
            cpx1:100,
            cpy1:-100,
            cpx2:200,
            cpy2:200,
            x2:300,
            y2:100
        }
    }


    /*配置项*/
    let option={
        /*graphic 原生图形组件
        *   type 图形类型，image, text, circle, sector, ring...
        *   position 位置
        *   shape 相关于图形的属性
        *   style 图形样式
        *   draggable 可否拖拽
        *   onmouseover 鼠标划上
        *   onmouseup 鼠标抬起
        *   onmouseout 鼠标划出
        * */
        graphic:[
            // circle,
            // image,
            // text,
            // rect,
            // ring,
            // sector
            // arc,
            // polygon,
            // polyline,
            // line,
            bezierCurve
        ]

    };
    /*绘图*/
    myChart.setOption(option);

</script>
</body>
</html>
```

##### 坐标转换

echarts有两种坐标位：图表位、像素位。

图表位有直角坐标系、地理坐标系等

原生图形的位置就是基于像素定位的

echarts实例对象提供了图表位和像素位的转换方法

+ convertToPixel(坐标系,[x,y]) 图表位转像素
+ convertFromPixel坐标系(,[x,y])像素位转图表

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>原生图形</title>
    <style>
        #main{
            margin: 20px;
            width: 700px;
            height: 700px;
            background: antiquewhite;
        }
    </style>
</head>
<body>
<!--建立dom 容器-->
<div id="main"></div>
<!--引入echarts-->
<script src="https://lib.baomitu.com/echarts/5.1.2/echarts.min.js"></script>
<script>
    /*实例化echarts*/
    const chart = echarts.init(document.getElementById('main'));
    /*配置项*/
    let option={
        /*x轴
        *   min,max 刻度区间
        *   type 坐标轴的类型
        *       value 数值轴
        * */
        xAxis: {
            min:0,
            max:50
        },
        /*y 轴
        *   属性同x
        * */
        yAxis: {
            min:0,
            max:50
        },
        /*散点*/
        series:{
            id:1,
            type:'scatter',
            data:[
                [40,40]
            ],
            symbolSize:30
        }
    };

    chart.setOption(option)


    /*原生图形*/
    //chart.convertToPixel('grid',[x,y]) 将某种位置转换为像素位。如直角坐标grid系转像素位，地理坐标系geo 转像素位
    const circle={
        id:1,
        type:'circle',
        shape:{
            r:5
        },
        x:200,
        y:200,
    }
    chart.setOption({
        graphic:[circle]
    })

    //图表位转像素位
    const [x,y]=chart.convertToPixel('grid',[20,20])
    /*chart.setOption({
        graphic:[
            {
                id:1,
                x,y
            }
        ]
    })*/

    //像素位转图表位
    const pos=chart.convertFromPixel('grid',[200,200])
    console.log(pos);
    chart.setOption({
        series:[
            {
                id:1,
                data:[pos]
            }
        ]
    })

</script>
</body>
</html>
```

折线图的拖拽案例

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>拖拽</title>
    <style>
        #main{
            margin: 20px;
            width: 700px;
            height: 700px;
        }
    </style>
</head>
<body>
<!--建立dom 容器-->
<div id="main"></div>
<!--引入echarts-->
<script src="https://lib.baomitu.com/echarts/5.1.2/echarts.min.js"></script>
<script>
    /*折线图节点尺寸*/
    const symbolSize = 20;
    /*点位*/
    const data = [[0,0], [20, 20], [40,40]];

    /*实例化echarts*/
    const chart = echarts.init(document.getElementById('main'));

    /*1.线绘制折线图*/
    const option={
        /*tooltip 提示
        *   triggerOn 提示的触发方式
        *   formatter 格式化提示内容
        * */
        tooltip: {
            triggerOn:'none',
            formatter:({data})=>{
                const [x,y]=data
                return `${Math.round(x)}, ${Math.round(y)}`
            }
        },
        /*x轴
        *   min,max 刻度区间
        *   type 坐标轴的类型
        *       value 数值轴
        * */
        xAxis: {
            min: 0,
            max: 50,
        },
        /*y 轴
        *   属性同x
        * */
        yAxis: {
            min: 0,
            max: 50,
        },
        /*系列 series
        *   id 用于在 option 或者 API 中引用组件
        *   type 类型
        *   smooth 圆弧
        *   symbolSize 标记点尺寸
        *   data 数据
        * */
        series: {
            id:1,
            type:'line',
            data,
            symbolSize,
            smooth:true
        },
    }
    chart.setOption(option);

    /*2.为标记点添加拖拽功能*/
    const {curry}=echarts.util
    const circles=data.map((pos,ind)=>{
        const [x,y]=chart.convertToPixel('grid',pos)
        console.log(x,y);
        return {
            type:'circle',
            x,y,
            shape:{
                r:symbolSize/2
            },
            z:10,
            draggable:true,
            invisible:true,
            ondrag:curry(onPointerDragging,ind),
            onmouseover:curry(showTooltip,ind),
            onmousemove:curry(showTooltip,ind),
            onmouseout:curry(hideTooltip,ind),
        }
    })
    chart.setOption({
        graphic:circles
    })


    /*鼠标拖拽时，让折线中的点位随拖拽点变化*/
    function onPointerDragging(ind) {
        //获取当前原生图形的像素位
        const {x,y}=this
        const pos=chart.convertFromPixel('grid',[x,y])
        console.log(pos);

        //获取当前原生图形的索引位
        data[ind]=pos

        chart.setOption({
            series: [
                {
                    id:1,
                    data
                }
            ]
        })

    }

    /*鼠标在标记点上划入|移动时，触发显示提示事件*/
    function showTooltip(ind){
        chart.dispatchAction({
            type:'showTip',
            seriesIndex:0,
            dataIndex:ind
        })
    }


    /*鼠标在标记点上移出时，触发隐藏提示事件*/
    function hideTooltip(ind){
        chart.dispatchAction({
            type:'hideTip',
            seriesIndex:0,
            dataIndex:ind
        })
    }

</script>
</body>
</html>
```

响应式布局

在echarts里，如何适配不同的尺寸的屏幕呢

+ 简单点的可以通过为尺寸、位置等属性设置百分比来实现
+ 复杂些的就需要自定义响应规则



```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>响应式布局</title>
    <style>
        html,body{margin: 0;height: 100%}
        #main{
            height: 100%;
            background: antiquewhite;
        }
    </style>
</head>
<body>
<!--建立dom 容器-->
<div id="main"></div>
<!--引入echarts-->
<script src="https://lib.baomitu.com/echarts/5.1.2/echarts.min.js"></script>
<script>
    /*实例化echarts*/
    const chart = echarts.init(document.getElementById('main'));
    /*基础配置项*/
    const  baseOption={
        xAxis:[
            {
                gridIndex:0,
                min:0,
                max:50
            },
            {
                gridIndex:1,
                min:0,
                max:50
            },
        ],
        yAxis:[
            {
                gridIndex:0,
                min:0,
                max:50
            },
            {
                gridIndex:1,
                min:0,
                max:50
            },
        ],
    }

    /*media 规则配置列表
    *   query 规则，如maxWidth: 768
    *   option 配置项
    * */
    const media=[
        {
            option:{
                grid:[
                    {left:'10%',right:'55%',top:'10%',bottom:'10%'},
                    {left:'55%',right:'10%',top:'10%',bottom:'10%'},
                ]
            }
        },
        {
            query:{
                maxWidth:768,
            },
            option:{
                grid:[
                    {left:'10%',right:'10%',top:'10%',bottom:'55%'},
                    {left:'10%',right:'10%',top:'55%',bottom:'10%'},
                ]
            }
        }
    ]

    chart.setOption({
        baseOption,
        media
    })

    /*窗口尺寸发生变化时，echarts 实例重置尺寸*/
    window.addEventListener('resize',()=>{
        chart.resize()
    })

</script>
</body>
</html>
```

地球组件

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>地球</title>
    <style>
        html{height: 100%}
        body{height: 100%;margin: 0}
        #main{height: 100%}
    </style>
</head>


<body>
    <div id="main"></div>
    <script src="https://cdn.jsdelivr.net/npm/echarts@5/dist/echarts.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/echarts-gl@2/dist/echarts-gl.min.js"></script>
    <script>
        const chart = echarts.init(document.getElementById('main'));

        const star='./images/star.jpg'
        const world='./images/world.jpg'
        const hdr='./images/ambient.hdr'

        const option={
            globe:{
                //漫反射贴图
                baseTexture:world,
                //凹凸贴图
                heightTexture:world,
                //凹凸强调
                displacementScale:0.02,
                //环境贴图
                environment:star,
                //着色方式
                shading:'realistic',
                //后期处理
                postEffect:{
                    enable:true
                },
                //灯光
                light:{
                    //全局光
                    ambientCubemap:{
                        //贴图
                        texture:hdr,
                        //漫反射亮度
                        diffuseIntensity:2.5
                    }
                }
            },
        }

        chart.setOption(option)

    </script>
</body>

</html>

```

