var Application = (function () {
    function Application() {
    }
    Application.prototype.initTabControls = function () {
        var tabs = document.querySelectorAll(".tab-control");
        var _loop_1 = function (x) {
            var tab = tabs[x];
            var searcher = tab.dataset.searcher + " [data-variant]";
            var variants = document.querySelectorAll(searcher);
            if (variants.length == 0)
                return "continue";
            tab.addEventListener("click", function (ev) {
                var tag = ev.currentTarget;
                if (ev.target.tagName != "LI")
                    return;
                var oldli = tag.querySelector("li.selected");
                var newli = ev.target;
                if (oldli == newli)
                    return;
                oldli.classList.remove("selected");
                newli.classList.add("selected");
                var newid = newli.dataset.id;
                var oldid = oldli.dataset.id;
                for (var y = 0; y < variants.length; ++y) {
                    var variant = variants[y];
                    if (variant.dataset.variant == newid)
                        variant.classList.remove("hidden");
                    else if (variant.dataset.variant == oldid)
                        variant.classList.add("hidden");
                }
            });
        };
        for (var x = 0; x < tabs.length; ++x) {
            _loop_1(x);
        }
    };
    Application.prototype.initCheckBoxes = function () {
        var checks = document.querySelectorAll(".checkbox");
        var current = null;
        var _loop_2 = function (x) {
            var check = checks[x];
            var input = check.querySelector("input");
            var span = check.querySelector("span");
            check.addEventListener("click", function (ev) {
                var tag = ev.currentTarget;
                input.focus();
                if (tag.classList.contains("checked")) {
                    input.checked = false;
                    tag.classList.remove("checked");
                }
                else {
                    input.checked = true;
                    tag.classList.add("checked");
                }
                ev.preventDefault();
                current = null;
            });
            check.addEventListener("mousedown", function (ev) {
                current = ev.currentTarget;
            });
            input.addEventListener("focus", function (ev) {
                if (!check.classList.contains("focused"))
                    check.classList.add("focused");
            });
            input.addEventListener("blur", function (ev) {
                if (current != null) {
                    var input_1 = current.querySelector("input");
                    if (input_1 == ev.currentTarget) {
                        ev.preventDefault();
                        return;
                    }
                }
                if (check.classList.contains("focused"))
                    check.classList.remove("focused");
            });
        };
        for (var x = 0; x < checks.length; ++x) {
            _loop_2(x);
        }
    };
    return Application;
}());
document.addEventListener("DOMContentLoaded", function () {
    var app = new Application();
    app.initTabControls();
    app.initCheckBoxes();
});
//# sourceMappingURL=application.js.map