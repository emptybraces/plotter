function InitializeContextMenu(e){

    //
    // add object handler
    //
    function addObject(e, geometryId)
    {
        e.objMgr.add(Geometry.get(geometryId));
    }
    //
    // copy object handler
    //
    function copyObject(e)
    {
        // e.objMgr.copy(e.objMgr.getSelected());
    }
    //
    // delete object handler
    //
    function deleteObject(e) {
        e.objMgr.getSelected().forEach(function(elem){
            e.objMgr.remove(elem);
        });
    };
    //
    // show context menu event
    //
    function showContextMenu(e, ctx, opt) {
        // this is the trigger element
        // var $this = this;
        // import states from data store
        var data = ctx.data();
        // initialize parameter
        data.MoveTypeSelection = typeof data.MoveTypeSelection  !== 'undefined'
                                 ? data.MoveTypeSelection : 1;
        data.isObjectSelected = e.objMgr.isSelected();
        $.contextMenu.setInputValues(opt, data);
        // this basically fills the input commands from an object
        // like {name: "foo", yesno: true, radio: "3", …}
    }
    //
    // hide contextmenu event
    //
    function hideContextMenu(e, ctx, opt) {
        // this is the trigger element
        // var $this = this;
        // export states to data store
        var data = $.contextMenu.getInputValues(opt, ctx.data());
        // console.log($this.data())
        switch (data.MoveTypeSelection){
            case "1": Global.OBJECT_MOVE_TYPE = 'XY'; break;
            case "2": Global.OBJECT_MOVE_TYPE = 'XZ'; break;
            case "3": Global.OBJECT_MOVE_TYPE = 'YZ'; break;
        }
        var objMgr = e.objMgr;
        objMgr.getName("ObjectMoveRangeSquare")[0].ins.updatePosition(objMgr);
        // this basically dumps the input commands' values to an object
        // like {name: "foo", yesno: true, radio: "3", …}
    }

    $.contextMenu({
        selector: '#canvas', 
        callback: function(key, options)
        {
            switch (key){
                case "add_sphere":
                    addObject(e, "sphere");
                    break;
                case "add_cube":
                    addObject(e, "cube");
                    break;
                case "copy":
                    copyObject(e);
                    break;
                case "delete":
                    deleteObject(e);
                    break;
            }
        },
        items: {
            isObjectSelected: {
                name: "object selected", 
                type: 'checkbox', 
                selected: false,
                disabled: true
            },
            MoveTypeSelection: {
                name: "DrugMoveType", 
                type: 'select', 
                options: {1: 'XY plane', 2: 'XZ plane', 3: 'YZ plane'}, 
            },
            "sep1": "---------",
            "add": {
                name: "Add Object",
                items: {
                    "add_sphere": {
                        name: "Sphere"
                    },
                    "add_cube": {
                        name: "Cube"
                    },
                },
            },
            "copy": {
                name: "Copy Object",
                icon: "copy",
                disabled: function() {return !this.data().isObjectSelected; },
            },
            "delete": {
                name: "Delete Object", 
                icon: "delete",
                disabled: function() {return !this.data().isObjectSelected; },
            },
            "quit": {name: "Quit Menu", icon: "quit"}
        },
        events: {
            show: (function(opt){
                showContextMenu(e, this, opt);
            }),         
            hide: (function(opt){
                hideContextMenu(e, this, opt);
            }),         
        }
    });
}
