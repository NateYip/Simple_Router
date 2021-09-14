# 手写一个Router来切换视图

## 首先，先布局好一个 HTML ：

```HTML
<div class="router_box">
        <a href="/home" class="router">主页</a>
        <a href="/news" class="router">新闻</a>
        <a href="/team" class="router">团队</a>
</div>
<div id="router-view" name="default"></div>
<div id="router-view" name='fir'></div>
<div id="router-view" name='sec'></div>
<script src="./RouterController.js"></script>
<script src="./model.js"></script>
<script src="./index.js"></script>
```

## `index.js` 文件

这是我们入口文件，里面会初始化路由：

想想我们是怎么初始化路由的。在我们初始化路由的时候，需要提前告知我们的Router具体的布局规则`path下对应哪个(或者"哪些")component，以及其他的路由要怎么重定向`

具体配置可以是这样：

```js
routes : [
        {
        path: '/home',
        component: "<h1>Home</h1>"
        }, {
        path: '/news',
        component: {
            default: '<h1>News</h1>',
            fir: '<h1> NEWS FIR</h1>',
            sec: '<h1> NEWS SEC</h1>',
        }
        }, {
        path: '/team',
            component: {
                default: '<h1> Team</h1>',
            sec: '<h1> TEAM SEC</h1>',
            }
        }, {
        path: '*',
        redirect: '/home'
    }]
```

然后我们创建我们的Router：

```js
function MyRouter(RouterConfig){
    this.route = RouterConfig.routes;
    this.init();
}
```

RouterConfig 就是我们前面的具体配置，init 函数是我们的初始化函数：

```js
MyRouter.prototype={
    init: function(){
        this.addRouter();
        new RouterController(this.route);
    }
}
```

初始化函数里头我们又调用两个函数：

1. addRouter() 函数，这个函数我们监听每个 a 标签的 click 事件；
2. RouterController 是我们用来更新视图的函数，细节后面讲；

那么加上 addRouter 函数是这样的：

```js
MyRouter.prototype={
    init: function(){
        this.addRouter();
        new RouterController(this.route);
        
    },
    addRouter: function(){
        //给每一个a标签添加事件监听
        //querySelectorAll 选择每一个 class 为 .router 的 a 标签 
        document.querySelectorAll(".router").forEach((item) => {
            item.addEventListener("click", function(e) {
                console.log("Click Link to change HASH")
                let event = e || window.event;
                event.preventDefault();
                //点击就改变导航栏的 hash 值
                // window.location.hash 是一个 BOM 对象属性
                window.location.hash = this.getAttribute("href");
            }, false);
        });
    }
}
```

最后，你需要创建 MyRouter 的实例：

```js
new MyRouter({
  	//这里的 routes 就是我们前面说的具体配置
    routes : [
        {
        path: '/home',
        component: "<h1>Home</h1>"
        }, {
        path: '/news',
        component: {
            default: '<h1>News</h1>',
            fir: '<h1> NEWS FIR</h1>',
            sec: '<h1> NEWS SEC</h1>',
        }
        }, {
        path: '/team',
            component: {
                default: '<h1> Team</h1>',
            sec: '<h1> TEAM SEC</h1>',
            }
        }, {
        path: '*',
        redirect: '/home'
    }]
})
```

那么现在我们来继续想想 RouterController 该怎么写

## `RouterController.js` 文件

RouterController很简单，在这里你要将前面的路由具体配置传入 Model 文件。

```js
function RouterController(allView) {
    this.init(allView);
}
```

和前面一样，我们一样要初始化这个 RouterController ，看看 init 函数做了什么吧：

```js
RouterController.prototype = {
    init: function (allView) {
        //将router装入Model
        let Model = new RouterModel(allView);
        
        //初始化一下现在导航栏的 URL
        //找到 path 为 '*' 的路径配置 
        let defaultIndex = allView.findIndex((item) => {
            return item.path === '*';
        })
        //找到就修改当前的路由
        if(defaultIndex){
            window.location.hash = allView[defaultIndex].redirect
        }
        window.addEventListener('hashchange', () => {
            console.log('hashchange')
        	//监听导航栏路由的变化，有变化就去告诉 Model 的 RouterChange 函数准备更新视图
            Model.RouteChange();
        });
        //一开始就初始化一下当前的导航栏路由
        Model.RouteChange();
    },
}
```

## `RouterModel.js`文件

```js
function RouterModel (allView){
 	//这里还是前面导入的路由规则
    this.router = allView
}
```

这里说下前面调用的，定义在 RouterModel 中的 RouterChange 函数：

```js
RouterModel.prototype ={
    RouteChange: function(){
 		//获取当前的导航栏 hash 值
        let nowHash = window.location.hash;
        console.log('NowHash is '+nowHash);
        //根据 hash 找到相应的 Router 路径
        this.router.forEach((e)=>{
            // 给 e.path 加上 '#' 来完整匹配 hash 值 
            if(('#' + e.path) === nowHash){
 				//找到就更新视图 View
                ViewUpdate(e.component);
            }
        })
    }
}
```

最后也就是我们的 ViewUpdate 函数了：

```js
function ViewUpdate(item){
    if(!item){
    	//路由配置有问题，component 属性没有值
        alert('error router config');
        return ;
    }
    //找到相应的 component 去更新 router-view 
    //先获取所有的 router-view 视图
    let routeEl = document.querySelectorAll("#router-view");
   	//看第一个路由规则，它的 component 没有指定具体的 router-view 像这样的就更新在 default 里
   	if(typeof item === 'string'){
        routeEl.forEach((e)=>{
            if(e.getAttribute('name') === 'default'){
                console.log('Update String');
                //将 router-view 内容更新为 当前的 component 
                e.innerHTML = item;
                return ;
            }
        })
    }
    //其他有具体配置的，传过来的是一个对象，具体路径具体配置，和上面差不多
    for(let key in item ){
        routeEl.forEach((e)=>{
            if(e.getAttribute('name') === key){
                console.log('Update Object');
                e.innerHTML = item[key];
            }
        })
    }
}
```

大致的思路就是这样了，可能具体的细节没有处理很好，还需要具体的优化，但已经实现了一个普通的 Router ，所有的代码都在 [这里啦](https://github.com/NateYip/Simple_Router) 。

本来我想的是要获取到当前导航栏的 hash 值 ，然后存在一个 Model 中，用 Object.defineProperty() 来设置 set 和 get ，触发相应的更新视图的函数，后来发现监听 "hashchange" 事件，然后 BOM 对象也可以直接设置当前导航栏的 hash 值，所以一切都简单起来了，只需要监听 a 标签的 click 函数然后改变导航栏的 hash 值 ，接着 "hashchange" 事件被监听，根据路由规则，触发更新视图的函数，就 OK 了👻。





























