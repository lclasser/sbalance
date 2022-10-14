
function _setHelperFunction(type, obj)
{
    obj.setBgColor = function(color) {
        return this;
    };
    obj.setFgColor = function(color) {
        return this;
    };
    obj.getItem = function(id) {
        var item = obj.querySelector(`#${id}`);
        _setHelperFunction(null, item);
        return item;
    };
    if( type == 'row' ) {
        obj.getData = function() { return obj._data; }
        obj.getIndex = function() { return obj._rowidx; }
    }
    return obj;
};

class CompSGridList
{
    constructor(element, options) {
        // console.log("options:", options);
        this.element = element;
        this.options = Object.assign({
            // "border-color" : "#aaaaaa",
            "valign" : 'middle',
        }, options || {});
        this.columns = [];
        this.ebody = null;
        this.onClickRow = null;

        this.element.setAttribute("border-color", options["border-color"]);
        // this.element.style["margin"] = "0";
        // this.element.style["padding"] = "3px";
        this.element.style["display"] = "flex";
        this.element.style["flex-direction"] = "column";
        this.element.style["flex"] = "1";

        if( this.element.classList.contains("_comp_slist" ) != true ) {
            this.element.classList.add("_comp_slist");
            this.element.classList.add("_sborder");
        }
    };

    getRows() {
        return this.ebody.childNodes;
    }
    removeAllRows() {
        return this.ebody.innerHTML = "";
    }

    createGrid(columns, options) {
        var self = this;
        var based = { id: null, type: 'string', width: '10%', halign: 'center', valign: 'middle', };

        options = options || {};
        options = Object.assign({}, self.options, {
                "bgcolor" : options["col-bgcolor"] || self.options["col-bgcolor"] || '#f7f7f7',
                "fgcolor" : options["col-fgcolor"] || self.options["col-fgcolor"] || '#000000',
                "height"  : options["col-height"]  || self.options["col-height"]  || 40,
                "frozen" : true,
                "kind" : "column",
            },
            options
        );

        // Grid (super)
        self.egrid = null;
        self.egrid = document.createElement("div");
        self.egrid.style["overflow"] = "auto";
        self.egrid.style["flex"] = "1";
        self.egrid.style["border-color"] = self.options["border-color"] && self.options["border-color"];
        self.element.append(self.egrid);

        // Head
        self.columns = [];
        columns.forEach(function(col) {
            col = Object.assign({}, based, col);
            self.columns.push(col);
        });
        
        var cols = { };
        self.columns.forEach(function(col, idx) {
            cols[col.id] = {
                text: col.text,
                type: 'string',
            };
        });
        
        self.ehead = self._insertRow(self.egrid, cols, options, "ghead");
        self.egrid.append(self.ehead);

        // Body
        self.ebody = document.createElement("div");
        self.egrid.append(self.ebody);

        self.element.onclick = function(event) {
            // console.log("onclick:",event);
            var srcElement = event.srcElement;
            var grow = null;
            var gcol = null;

            var found = srcElement;
            while( found ) {
                var grid_type = found.getAttribute('grid-type');
                // console.log("next.....", grid_type);
                switch( grid_type ) {
                case 'grow': grow = found; break;
                case 'gcol': gcol = found; break;
                }
                if( grow != null && gcol != null ) {
                    var gtype = grow.getAttribute('grid-type');
                    if( gtype == "ghead" ) {
                        console.log("onClick COLUMN:", grow, gcol, srcElement);
                        self.onClickCol({
                            owner  : gcol,
                            data   : grow._data,
                            column : gcol._column,
                            element: srcElement,
                        }, event);
                    } else {
                        console.log("onClick ROW   :", grow, gcol, srcElement);
                        gcol._column.onClickCell && gcol._column.onClickCell({
                            owner  : gcol,
                            data   : grow._data,
                            column : gcol._column,
                            element: srcElement,
                        }, event);
                        self.onClickRow && self.onClickRow({
                            owner  : gcol,
                            data   : grow._data,
                            column : gcol._column,
                            element: srcElement,
                        }, event);
                    }
                    break;
                }
                found = found.parentElement;
            }
        }
        return self.columns;
    };

    _callOfValue(argx, val) {
        if( typeof(val) == 'function' ) return val(argx);
        return val;
    }
    _priorityCall(argx, opt1, opt2) {
        return this._callOfValue(argx, opt1) || this._callOfValue(argx, opt2);
    }

    /*
    items = {
        'check'     : '<input class="form-check-input" type="checkbox" id="msg_check">',
        'msg_phone' : mitem.phone
        'msg_date'  : {
            html : fmtDateToDispDate(mitem.msg_date),
            bgcolor : '#00ff00',
            fgcolor : '#000000',
            halign  : 'center',
            valign  : 'middle',
            width   : '10%',
        },
    }
    */
    _insertRow(parent, items, options, gtype) {
        var self = this;
        if( parent == null )
            parent = self.ebody;

        gtype = gtype || "grow";

        // create Row
        var row_obj = document.createElement("div");
        if( row_obj ) {
            row_obj = _setHelperFunction('row', row_obj);
        }

        self.columns.forEach(function(col_dat, idx) {
            var iitem = items[col_dat.id] || "";
            if( typeof(iitem) == 'function' ) {
                iitem = iitem(col_dat);
            }
            var citem = null;
            switch( typeof(iitem) ) {
            case 'object':
                citem = Object.assign({}, col_dat, iitem);
                break;
            default:
                citem = Object.assign({}, col_dat, { text : iitem, });
                break;
            }

            // create Row-Col
            var col_obj = document.createElement("div");
            col_obj.setAttribute('grid-type', 'gcol');
            switch( gtype ) {
            case 'ghead':
                col_obj.className = "_scol _shead";
                break;
            default:
                col_obj.className = "_scol";
                break;
            }
        
            if( self.columns.length <= (idx + 1) ) {
                col_obj.style["flex"] = "1";
            } else {
                col_obj.style["width"] = citem.width;
            }

            col_obj.style["background-color"] = self._priorityCall(col_obj, citem.bgcolor);
            col_obj.style["border-color"] = self.options["border-color"];
            col_obj.style["padding"] = "0.5em";
            if( idx > 0 ) {
                // col_obj.style["margin-left"] = "-1px";
            }

            // create Col-value
            var val_class = citem.class;
            if( typeof(val_class) == 'function' ) {
                val_class = val_class(citem);
            }

            citem.class = self._priorityCall(col_obj, citem.class) || '';
            citem.value  = self._priorityCall(col_obj, citem.text) || '';

            var col_val = null;
            switch( citem.type ) {
            case 'string': {
                    col_val = document.createElement("span");
                    col_val.id        = citem.id;
                    col_val.className = citem.class + '_sval';
                    col_val.innerHTML = citem.value;
                }
                break;
            case 'callback': {
                    col_obj.innerHTML = citem.callback(citem);
                }
                break;
            }
            col_obj._column = col_dat;
            items[col_dat.id] = citem.value;

            if( col_val != null ) col_obj.append(col_val);
            if( col_obj != null ) row_obj.append(col_obj);
        });

        row_obj._data = items;
        row_obj._rowidx = parent.children.length;
        row_obj.setAttribute('grid-type', gtype);
        row_obj.className = "_srow";
        row_obj.style["height"]           = `${options.height}px`; //  `${self.options["row-height"] - 1}px`;
        row_obj.style["background-color"] = self._priorityCall(row_obj, options.bgcolor, self.options.bgcolor);
        row_obj.style["color"] = self._priorityCall(row_obj, options.fgcolor, self.options.fgcolor);

        if( options.frozen == true ) {
            row_obj.style["width"] = "100%";
            row_obj.style["top"] = "0px";
            row_obj.style["position"] = "sticky";
        }
        
        parent.append(row_obj);
        return row_obj;
    };

    insertRow(items, options) {
        options = options || {};
        options.height  = options["height"]  || this.options["row-height"];
        options.bgcolor = options["bgcolor"] || this.options["row-bgcolor"];
        options.fgcolor = options["fgcolor"] || this.options["row-fgcolor"];
        this._insertRow(null, items, options);
    }
};
