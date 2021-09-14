function MyRouter(RouterConfig){
    this.route = RouterConfig.routes;
    this.init();
}

MyRouter.prototype={
    init: function(){
        this.addRouter();
        new RouterController(this.route);
        
    },
    addRouter: function(){
        //给每一个a标签添加事件监听
        document.querySelectorAll(".router").forEach((item, index) => {
            item.addEventListener("click", function(e) {
                console.log("Click Link to change HASH")
                let event = e || window.event;
                event.preventDefault();
                window.location.hash = this.getAttribute("href");
            }, false);
        });
    }
}

new MyRouter({
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
