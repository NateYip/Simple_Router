function RouterModel (allView){
    this.router = allView
}
RouterModel.prototype ={
    RouteChange: function(){
        let nowHash = window.location.hash;
        console.log('NowHash is '+nowHash);
        //找到相应的Router路径
        this.router.forEach((e)=>{
            if(('#' + e.path) === nowHash){

                ViewUpdate(e.component);
            }
        })
    }
}

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


//  <a href="/home" class="router">主页</a>
//  <a href="/news" class="router">新闻</a>
//  <a href="/team" class="router">团队</a>

//  <div id="router-view" name="default"></div>
//  <div id="router-view" name ='fir'></div>
//  <div id="router-view" name ='sec'></div>