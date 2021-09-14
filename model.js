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
        alert('error');
        return ;
    }
    //找到相应的component去更新router-view 
    let routeEl = document.querySelectorAll("#router-view");
    if(typeof item === 'string'){
        routeEl.forEach((e)=>{
            if(e.getAttribute('name') === 'default'){
                console.log('Update String');
                e.innerHTML = item
                return ;
            }
        })
    }
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