// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"js-speedometer.js":[function(require,module,exports) {
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d"); // general settings

var middleX = canvas.width / 2;
var middleY = canvas.height / 2;
var radius = canvas.width / 2 - canvas.width / 10; // beginning and ending of our qrc. Sets by rad * pi

var startAngleIndex = 0.7;
var endAngleIndex = 2.3; // zones settings

var zoneLineWidth = canvas.width / 30;
var counterClockWise = false; // tick settings

var tickWidth = canvas.width / 100;
var tickColor = "#746845";
var tickOffsetFromArc = canvas.width / 40; // Center circle settings

var centerCircleRadius = canvas.width / 20;
var centerCircleColor = "#f2ead9";
var centerCircleBorderWidth = canvas.width / 100; // Arrow settings

var arrowValueIndexCorrect = 0.7 + db['raiting'] / 250;
var arrowColor = "#333333";
var arrowWidth = canvas.width / 50; // Digits settings

var digits = [0, 100, 200, 300, 400];
var digitsColor = "#000";
var digitsFont = "bold 20px Tahoma";
var digitsOffsetFromArc = canvas.width / 12;
var zonesCount = digits.length - 1;
var step = (endAngleIndex - startAngleIndex) / zonesCount; // methods for drawing canvas elem

var DrawZones = function DrawZones() {
  var greenZonesCount = Math.ceil(zonesCount / 4);
  var yellowZonesCount = Math.ceil((zonesCount - greenZonesCount) / 4);
  var redZonesCount = zonesCount - greenZonesCount - yellowZonesCount;
  var startAngle = (startAngleIndex - 0.02) * Math.PI;
  var endGreenAngle = (startAngleIndex + greenZonesCount * step) * Math.PI;
  var endYellowAngle = (startAngleIndex + (greenZonesCount + yellowZonesCount) * step) * Math.PI;
  var endRedAngle = (endAngleIndex - 0.4) * Math.PI;
  var endblueAngle = (endAngleIndex + 0.02) * Math.PI;
  var sectionOptions = [{
    startAngle: startAngle,
    endAngle: endGreenAngle,
    color: "red"
  }, {
    startAngle: endGreenAngle,
    endAngle: endYellowAngle,
    color: "yellow"
  }, {
    startAngle: endYellowAngle,
    endAngle: endRedAngle,
    color: "#009900"
  }, {
    startAngle: endRedAngle,
    endAngle: endblueAngle,
    color: "blue"
  }];

  this.DrawZone = function (options) {
    ctx.beginPath();
    ctx.arc(middleX, middleY, radius, options.startAngle, options.endAngle, counterClockWise);
    ctx.lineWidth = zoneLineWidth;
    ctx.strokeStyle = options.color;
    ctx.lineCap = "butt";
    ctx.stroke();
  };

  sectionOptions.forEach(function (options) {
    DrawZone(options);
  });
}; // method for tricks on speedometer


var DrawTicks = function DrawTicks() {
  this.DrawTick = function (angle) {
    var fromX = middleX + (radius - tickOffsetFromArc) * Math.cos(angle);
    var fromY = middleY + (radius - tickOffsetFromArc) * Math.sin(angle);
    var toX = middleX + (radius + tickOffsetFromArc) * Math.cos(angle);
    var toY = middleY + (radius + tickOffsetFromArc) * Math.sin(angle);
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.lineWidth = tickWidth;
    ctx.lineCap = "round";
    ctx.strokeStyle = tickColor;
    ctx.stroke();
  };

  for (var i = startAngleIndex; i <= endAngleIndex; i += step) {
    var angle = i * Math.PI;
    this.DrawTick(angle);
  }
}; // method for nambers on our speedometer


var DrawDigits = function DrawDigits() {
  var angleIndex = startAngleIndex;
  digits.forEach(function (digit) {
    var angle = angleIndex * Math.PI;
    angleIndex += step;
    var x = middleX + (radius - digitsOffsetFromArc) * Math.cos(angle);
    var y = middleY + (radius - digitsOffsetFromArc) * Math.sin(angle);
    ctx.font = digitsFont;
    ctx.fillStyle = digitsColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(digit, x, y);
  });
}; //method for drawing arrow on speedometer


var DrawArrow = function DrawArrow(arrowValueIndex) {
  var arrowAngle = arrowValueIndex * Math.PI;
  var toX = middleX + radius * Math.cos(arrowAngle);
  var toY = middleY + radius * Math.sin(arrowAngle);
  ctx.beginPath();
  ctx.moveTo(middleX, middleY);
  ctx.lineTo(toX, toY);
  ctx.strokeStyle = arrowColor;
  ctx.lineWidth = arrowWidth;
  ctx.stroke();
};

var DrawCenterCircle = function DrawCenterCircle() {
  ctx.beginPath();
  ctx.arc(middleX, middleY, centerCircleRadius, 0, 2 * Math.PI, false);
  ctx.fillStyle = centerCircleColor;
  ctx.fill();
  ctx.lineWidth = centerCircleBorderWidth;
  ctx.strokeStyle = arrowColor;
  ctx.stroke();
}; //animation of speedometr value


function speedometr_animation() {
  var stop = db["raiting"];
  var start = 0; // document.getElementById("speed-value").innerHTML = stop;

  var raiting_value = setInterval(function () {
    document.getElementById("speed-value").innerHTML = start;
    start = raiting_up(start, stop);
    if (start === -1) clearInterval(raiting_value);
  }, 15);

  function raiting_up(value, stop) {
    up_arrow(value);
    if (value < stop) return value + 1;else return -1;
  }

  ;
}

;

function up_arrow(start) {
  raiting = start;
}

;
speedometr_animation(); //animation of speedometr

var raiting = 0;
var raitingCounter = 0;

function getRaiting() {
  raiting += 1;
  raitingCounter += 1;
  raiting = 0.7 + raiting / 250;
  if (raitingCounter - 1 === db['raiting']) return -1;else return raiting;
}

;

function startDrowing(Index) {
  DrawTicks();
  DrawZones();
  DrawDigits();
  DrawArrow(Index);
  DrawCenterCircle();
}

;
var drawA = setInterval(function () {
  var arrowIndex_value = getRaiting();

  if (arrowIndex_value !== -1) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    startDrowing(arrowIndex_value);
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    clearInterval(drawA);
    startDrowing(arrowValueIndexCorrect);
  }
}, 15);
},{}],"C:/Users/Admin/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "57712" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["C:/Users/Admin/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js-speedometer.js"], null)
//# sourceMappingURL=/js-speedometer.099da37a.js.map