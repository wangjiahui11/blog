var a = (function () {
  var count = 0;
  var button = document.getElementById("count");
  button.onclick = function () {
    Event.trigger("add", count++);
  }
})();
