'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ArrayObserver = undefined;

var _lang = require('../../utils/lang');

var _lang2 = _interopRequireDefault(_lang);

var _fs = require('fs');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var isUndefined = _lang2.default.isUndefined,
    isObject = _lang2.default.isObject,
    isArray = _lang2.default.isArray,
    isFunction = _lang2.default.isFunction,
    SymbolFactory = _lang2.default.SymbolFactory;

var obSymbol = SymbolFactory('Observer');
var stateKey = obSymbol('state');
var originKey = obSymbol('origin');

var needOb = function needOb(obj) {
  return isObject(obj) || isArray(obj);
};

var ob = function ob(obj, callback) {
  return needOb(obj) ? new Observer(obj, callback) : obj;
};

var proxyHandler = function proxyHandler(callback) {
  return {
    // get(target, key, receiver) {
    //   let val = Reflect.get(target, key, receiver);
    //   // if(isObject(val) && !isFunction(val) && !(val instanceof Observer)) {
    //   //   val = new Observer(val, callback);
    //   //   target[key] = val;
    //   //   // Reflect.set(target[stateKey], key, val, receiver)
    //   // }
    //   return val ;
    // },
    set: function set(target, key, value, receiver) {
      // TODO: 回调
      if (isFunction(callback)) callback({ target: target, key: key, value: value, receiver: receiver });
      target[originKey][key] = value;
      return Reflect.set(target, key, ob(value, callback), receiver);
    }
  };
};

var Observer =
/**
 * @constructor
 * @param {Object|Array} state 
 * @param {Function} callback 
 */
function Observer(state, callback) {
  var _this = this;

  _classCallCheck(this, Observer);

  this[originKey] = state;
  if (isObject(state)) {
    Object.keys(state).forEach(function (key) {
      _this[key] = ob(state[key], callback);
    });
  }
  if (isArray(state)) {
    return new ArrayObserver(state, callback);
  }
  return new Proxy(this, proxyHandler(callback));
};

exports.default = Observer;
var ArrayObserver = exports.ArrayObserver = function (_Array) {
  _inherits(ArrayObserver, _Array);

  function ArrayObserver(state, callback) {
    var _ret;

    _classCallCheck(this, ArrayObserver);

    var _this2 = _possibleConstructorReturn(this, (ArrayObserver.__proto__ || Object.getPrototypeOf(ArrayObserver)).call(this));

    _this2[originKey] = state;
    state.forEach(function (t) {
      _this2.push(ob(t, callback));
    });
    return _ret = new Proxy(_this2, proxyHandler(callback)), _possibleConstructorReturn(_this2, _ret);
  }

  return ArrayObserver;
}(Array);