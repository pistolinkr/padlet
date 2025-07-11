"use strict";
exports.__esModule = true;
var react_1 = require("react");
require("./App.css");
function App() {
    // 시스템 테마에 따라 다크모드 자동 적용
    react_1.useEffect(function () {
        var matchDark = window.matchMedia('(prefers-color-scheme: dark)');
        var updateTheme = function () {
            if (matchDark.matches) {
                document.documentElement.classList.add('dark');
            }
            else {
                document.documentElement.classList.remove('dark');
            }
        };
        updateTheme();
        matchDark.addEventListener('change', updateTheme);
        return function () { return matchDark.removeEventListener('change', updateTheme); };
    }, []);
    return (react_1["default"].createElement("div", { className: "min-h-screen flex flex-col items-center justify-center bg-white dark:bg-black transition-colors duration-300" },
        react_1["default"].createElement("div", { className: "w-full max-w-2xl p-8 rounded-xl shadow-lg bg-white/90 dark:bg-black/90 border border-gray-200 dark:border-gray-800" },
            react_1["default"].createElement("h1", { className: "text-3xl font-bold mb-4 text-black dark:text-white" }, "Padlet Clone"),
            react_1["default"].createElement("p", { className: "text-gray-700 dark:text-gray-300 mb-8" }, "\uC18C\uC15C \uB85C\uADF8\uC778, \uC6CC\uD06C\uC2A4\uD398\uC774\uC2A4, \uBCF4\uB4DC \uAD00\uB9AC, \uCD08\uB300/\uC2E4\uC2DC\uAC04 \uCC38\uC5EC \uB4F1 padlet.com \uC2A4\uD0C0\uC77C \uAD6C\uD604 \uC608\uC815"))));
}
exports["default"] = App;
