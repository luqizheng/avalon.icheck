(function (avalon) {
    var radios = {};

    avalon.component("ms:icheck", {
        $init: function (vm, ele) {
            var msAttrs = [];
            for (var i = 0; i < ele.childNodes.length; i++) {
                var element = ele.childNodes[i];
                if (element.nodeType == 1 && element.tagName == "INPUT") {
                    var type = element.getAttribute("type").toLowerCase();
                    if (type == "checkbox" || type == "radio") {
                        for (var i = 0; i < element.attributes.length; i++) {
                            var attr = element.attributes[i];
                            if (/^ms-(duplex|attr-readonly|attr-disabled)(-\w*)*?/g.test(attr.name)) {
                                msAttrs.push(attr);
                            }
                        }
                        element.setAttribute('ms-on-change', '_change($event)')
                        vm.tmp = ele.innerHTML;
                        vm.$type = type;
                        vm.msAttrs = msAttrs;
                        vm.ctrl.value = function () {
                            console.log(element.value)
                            return element.value;
                        }
                        break;
                    }
                }
            }

        },
        $type: "",
        tmp: "",
        checkboxClass: 'icheckbox_square-blue',
        radioClass: 'iradio_square-blue',
        $replace: 1,
        $template: '<div class="[theme]" [more] ms-class-1="checked:ctrl.checked">{{tmp|html}}<ins class="iCheck-helper"></ins></div>',
        $$template: makeTemp,
        increaseArea: "20%",
        ctrl: {
            checked: false,
            value: avalon.noop,
        },
        _change: avalon.noop,
        $ready: function (vm, ele) {
            vm._change = function (e) {
                console.log(e.target.getAttribute("id"))
                vm.ctrl.checked = e.target.checked;
            }
            for (var i = 0; i < ele.childNodes.length; i++) {
                var element = ele.childNodes[i];
                if (element.tagName == "INPUT") {
                    init(element, vm);
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
            if (/^ms-duplex/.test(v.name) && isRadio) { //要变为另外一种模式，radio才需要进行对比更新
                if (v.name == "ms-duplex-booleam") {
                    msAttr.push(prefix + "='checked:" + v.value + "'");
                }
                else {
                    msAttr.push(prefix + "='checked:ctrl.value()==" + v.value + "'");
                }
            }
            //msAttr.push(v.name + "='" + v.value + "'")
        })
        result = result.replace("[more]", msAttr.join(" "))
        return result;
    }

    function init(ele, settings) {
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
        for (var key in layer) {
            avalon.css(ele, key, layer[key])
        }
    }
})(avalon)
 
 