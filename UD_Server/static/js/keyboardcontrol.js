document.addEventListener("keydown", onDocumentKeyDown, false);
var FN_UP=function () {
    alert("FN_UP");
}
var FN_DOWN=function () {
    alert("FN_DOWN");
}
var FN_LEFT=function () {
    alert("FN_LEFT");
}
var FN_RIGHT=function () {
    alert("FN_RIGHT");
}
function onDocumentKeyDown(event) {
    var keyCode = event.which;
    if (keyCode == 38) {
        FN_UP()
    } else if (keyCode == 40) {
        FN_DOWN()
    } else if (keyCode == 37) {
        FN_LEFT()
    } else if (keyCode == 39) {
        FN_RIGHT()
    }
};