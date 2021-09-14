function RouterController(allView) {
    this.init(allView);
}

RouterController.prototype = {
    init: function (allView) {
        //将router装入Model
        let Model = new RouterModel(allView);
        
        //初始化一下现在的
        let defaultIndex = allView.findIndex((item) => {
            return item.path === '*';
        })
        console.log(defaultIndex)
        if(!defaultIndex){
            window.location.hash = allView[defaultIndex].redirect
        }
        window.addEventListener('hashchange', () => {
            console.log('hashchange')
            Model.RouteChange();
        });
        Model.RouteChange();
    },
}


