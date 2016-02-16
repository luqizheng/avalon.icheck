(function (avalon) {
    avalon.icheck={
        checkboxClass: 'icheckbox_square-blue',
        radioClass: 'iradio_square-blue',
    }
    var _mobile = /ipad|iphone|ipod|android|blackberry|windows phone|opera mini|silk/i.test(navigator.userAgent);
    avalon.component("ms:icheck", {
        $init: function (vm, ele) {
            var msAttrs = [];
            for (var i = 0; i < ele.childNodes.length; i++) {
                var inputEle = ele.childNodes[i];
                if (inputEle.nodeType == 1 && inputEle.tagName == "INPUT") {
                    var type = inputEle.getAttribute("type").toLowerCase();
                    if (type == "checkbox" || type == "radio") {
                        for (var i = 0; i < inputEle.attributes.length; i++) {
                            var attr = inputEle.attributes[i];
                            if (/^ms-(duplex|attr-readonly|attr-disabled)(-\w*)*?/g.test(attr.name)) {
                                msAttrs.push(attr);
                            }
                        }
                        inputEle.setAttribute('ms-on-change', '_change($event)')
                        vm.tmp = ele.innerHTML;
                        vm.$type = type;
                        vm.msAttrs = msAttrs;
                                               
                        break;
                    }
                }
            }

        },
        $type: "",
        tmp: "",
        checkboxClass: avalon.icheck.checkboxClass,
        radioClass: avalon.icheck.radioClass,
        $replace: 1,
        //$template: '<div class="[theme]" ms-hover="hover" [more] ms-class-1="checked:ctrl.checked">{{tmp|html}}<ins ms-click="_change($event)" class="iCheck-helper" style="[insStyle]"></ins></div>',
        $template: '<div class="[theme]" ms-hover="hover" [more] ms-class-1="checked:ctrl.checked">{{tmp|html}}</div>',//没有想到怎样用ins代替checkbox引发更新时间。         
        $$template: makeTemp,
        increaseArea: "0%",
        ctrl: {
            checked: false,
            value: avalon.noop            
        },
        contains:function(val,array){
           for(var i=0;i<array.length;i++){
               if (val==array[i].toString())
                return true;
           }
           return false;
        },
        $element:null,
        _change: avalon.noop,
        $ready: function (vm, ele) {
            vm._change = function (e) {               
                vm.ctrl.checked = vm.$element.checked;
            }
            avalon.css(ele, "position") == "static" && avalon.css(ele, "position", 'relative')
            for (var i = 0; i < ele.childNodes.length; i++) {
                var element = ele.childNodes[i];
                if (element.tagName == "INPUT") {
                    vm.$element=element;
                    init(element, vm);
                    vm.ctrl.value = function () { //检查value的值的                            
                        return element.value;
                    }
                    vm.ctrl.checked=element.checked;
                    break;
                }
            }
        }

    });

    function makeTemp(temp) {
        var isRadio = this.$type == 'radio',
            result = temp.replace("[theme]", isRadio ? this.radioClass : this.checkboxClass),
            msAttr = [],
            classIndex = 2;


        avalon.each(this.msAttrs, function (i, v) {
            var prefix = "ms-class-" + classIndex;
            classIndex++;
            if (v.name == "ms-attr-disabled") { //要变为 ms-class-n="disabled:attr-value"
                msAttr.push(prefix + "='disabled:" + v.value + "'");
                return true;
            }
            if (/^ms-duplex/.test(v.name)) { //要变为另外一种模式，radio才需要进行对比更新
            
                if (v.name == "ms-duplex-booleam" && isRadio) {
                    msAttr.push(prefix + "='checked:" + v.value + "'");
                }
                else if(isRadio){
                    msAttr.push(prefix + "='checked:ctrl.value()==" + v.value + "'");
                }
                else{
                    msAttr.push(prefix + "='checked:contains(ctrl.value()," + v.value + ")'");
                }
            }
            //msAttr.push(v.name + "='" + v.value + "'")
        })
        result = result.replace("[more]", msAttr.join(" ")).replace("[insStyle]", toCss(getStyle(this)));

        return result;
    }

    function init(ele, settings) {
        // Choose how to hide input
        var area = ('' + settings.increaseArea).replace('%', '') | 0;
        // Clickable area limit
        if (area < -50) {
            area = -50;
        }

        var hide = _mobile ? {
            position: 'absolute',
            visibility: 'hidden'
        } : area ? getStyle(settings) : {
            position: 'absolute',
            opacity: 0
        };
        for (var key in hide) {
            avalon.css(ele, key, hide[key])
        }
    }
    function getStyle(settings) {
        var area = ('' + settings.increaseArea).replace('%', '') | 0;
        // Clickable area limit
        if (area < -50) {
            area = -50;
        }
        var offset = -area + '%',
            size = 100 + (area * 2) + '%',
            layer = {
                position: 'absolute',
                top: offset,
                left: offset,
                display: 'block',
                width: size,
                height: size,
                margin: 0,
                padding: 0,
                background: '#fff',
                border: 0,
                opacity: 0
            };
        return layer;
    }
    function toCss(obj) {
        var s = [];
        for (var key in obj) {
            s.push(key + ":" + obj[key])
        }
        return s.join(";");
    }
})(avalon)
 
 