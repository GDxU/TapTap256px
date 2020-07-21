"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function initSeedUi(onSeedChanged) {
    var p = document.createElement('p');
    p.innerHTML = "<button id=\"change\">change</button>\n    seed: <input type=\"number\" id=\"seed\" value=\"0\" style=\"width:80px\"></input>\n    <button id=\"set\">set</button>";
    p.style.textAlign = 'left';
    document.getElementsByTagName('body')[0].appendChild(p);
    var changeElm = document.getElementById('change');
    var seedElm = document.getElementById('seed');
    var setElm = document.getElementById('set');
    changeElm.onclick = function () {
        seedElm.value = Math.floor(Math.random() * 9999999).toString();
        onSeedChanging();
    };
    setElm.onclick = onSeedChanging;
    function onSeedChanging() {
        onSeedChanged(Number(seedElm.value));
    }
}
exports.initSeedUi = initSeedUi;
function enableShowingErrors() {
    var pre = document.createElement('pre');
    pre.style.textAlign = 'left';
    document.getElementsByTagName('body')[0].appendChild(pre);
    window.addEventListener('error', function (error) {
        var message = [error.filename, '@', error.lineno, ':\n', error.message].join('');
        pre.textContent += '\n' + message;
        return false;
    });
}
exports.enableShowingErrors = enableShowingErrors;
