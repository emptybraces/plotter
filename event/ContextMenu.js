//
// context menu construction
//
function InitializeContextMenu(){

    //
    // add object handler
    //
    function addObject(geometryId)
    {
        ObjectManager.add(GeometryManager.get(geometryId));
    }
    //
    // copy object handler
    //
    function copyObject()
    {
        // ObjectManager.copy(ObjectManager.getSelected());
    }
    //
    // delete object handler
    //
    function deleteObject() {
        ObjectManager.getSelected().forEach(function(elem){
            ObjectManager.remove(elem);
        });
    };
    //
    // show context menu event
    //
    function showContextMenu(ctx, opt) {
        // this is the trigger element
        // var $this = this;
        // import states from data store
        var data = ctx.data();
        // initialize parameter
        data.MoveTypeSelection = typeof data.MoveTypeSelection  !== 'undefined'
                                 ? data.MoveTypeSelection : 1;
        data.isObjectSelected = ObjectManager.isSelected();
        $.contextMenu.setInputValues(opt, data);
        // this basically fills the input commands from an object
        // like {name: "foo", yesno: true, radio: "3", …}
    }
    //
    // hide contextmenu event
    //
    function hideContextMenu(ctx, opt) {
        // this is the trigger element
        // var $this = this;
        // export states to data store
        var data = $.contextMenu.getInputValues(opt, ctx.data());
        // console.log($this.data())
        switch (data.MoveTypeSelection){
            case "1": CommonManager.OBJECT_MOVE_TYPE = 'XY'; break;
            case "2": CommonManager.OBJECT_MOVE_TYPE = 'XZ'; break;
            case "3": CommonManager.OBJECT_MOVE_TYPE = 'YZ'; break;
        }
        ObjectManager.getObjectByName("ObjectMoveRangeSquare")[0].ins.updatePosition();
        // this basically dumps the input commands' values to an object
        // like {name: "foo", yesno: true, radio: "3", …}
    }

    $.contextMenu({
        selector : '#canvas', 
        callback : function(key, options)
        {
            switch (key){
                case "add_sphere":
                    addObject("sphere");
                    break;
                case "add_cube":
                    addObject("cube");
                    break;
                case "copy":
                    copyObject();
                    break;
                case "delete":
                    deleteObject();
                    break;
            }
        },
        items : {
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
                showContextMenu(this, opt);
            }),         
            hide: (function(opt){
                hideContextMenu(this, opt);
            }),         
        }
    });
}
