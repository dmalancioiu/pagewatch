import {
  require_react
} from "./chunk-4C3EONJ7.mjs";
import {
  __commonJS,
  __export,
  __name,
  __toESM,
  init_esm
} from "./chunk-JJFB2UO5.mjs";

// node_modules/deepmerge/dist/cjs.js
var require_cjs = __commonJS({
  "node_modules/deepmerge/dist/cjs.js"(exports, module) {
    "use strict";
    init_esm();
    var isMergeableObject = /* @__PURE__ */ __name(function isMergeableObject2(value) {
      return isNonNullObject(value) && !isSpecial(value);
    }, "isMergeableObject");
    function isNonNullObject(value) {
      return !!value && typeof value === "object";
    }
    __name(isNonNullObject, "isNonNullObject");
    function isSpecial(value) {
      var stringValue = Object.prototype.toString.call(value);
      return stringValue === "[object RegExp]" || stringValue === "[object Date]" || isReactElement(value);
    }
    __name(isSpecial, "isSpecial");
    var canUseSymbol = typeof Symbol === "function" && Symbol.for;
    var REACT_ELEMENT_TYPE = canUseSymbol ? Symbol.for("react.element") : 60103;
    function isReactElement(value) {
      return value.$$typeof === REACT_ELEMENT_TYPE;
    }
    __name(isReactElement, "isReactElement");
    function emptyTarget(val) {
      return Array.isArray(val) ? [] : {};
    }
    __name(emptyTarget, "emptyTarget");
    function cloneUnlessOtherwiseSpecified(value, options) {
      return options.clone !== false && options.isMergeableObject(value) ? deepmerge(emptyTarget(value), value, options) : value;
    }
    __name(cloneUnlessOtherwiseSpecified, "cloneUnlessOtherwiseSpecified");
    function defaultArrayMerge(target, source, options) {
      return target.concat(source).map(function(element) {
        return cloneUnlessOtherwiseSpecified(element, options);
      });
    }
    __name(defaultArrayMerge, "defaultArrayMerge");
    function getMergeFunction(key, options) {
      if (!options.customMerge) {
        return deepmerge;
      }
      var customMerge = options.customMerge(key);
      return typeof customMerge === "function" ? customMerge : deepmerge;
    }
    __name(getMergeFunction, "getMergeFunction");
    function getEnumerableOwnPropertySymbols(target) {
      return Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols(target).filter(function(symbol) {
        return Object.propertyIsEnumerable.call(target, symbol);
      }) : [];
    }
    __name(getEnumerableOwnPropertySymbols, "getEnumerableOwnPropertySymbols");
    function getKeys(target) {
      return Object.keys(target).concat(getEnumerableOwnPropertySymbols(target));
    }
    __name(getKeys, "getKeys");
    function propertyIsOnObject(object, property) {
      try {
        return property in object;
      } catch (_2) {
        return false;
      }
    }
    __name(propertyIsOnObject, "propertyIsOnObject");
    function propertyIsUnsafe(target, key) {
      return propertyIsOnObject(target, key) && !(Object.hasOwnProperty.call(target, key) && Object.propertyIsEnumerable.call(target, key));
    }
    __name(propertyIsUnsafe, "propertyIsUnsafe");
    function mergeObject(target, source, options) {
      var destination = {};
      if (options.isMergeableObject(target)) {
        getKeys(target).forEach(function(key) {
          destination[key] = cloneUnlessOtherwiseSpecified(target[key], options);
        });
      }
      getKeys(source).forEach(function(key) {
        if (propertyIsUnsafe(target, key)) {
          return;
        }
        if (propertyIsOnObject(target, key) && options.isMergeableObject(source[key])) {
          destination[key] = getMergeFunction(key, options)(target[key], source[key], options);
        } else {
          destination[key] = cloneUnlessOtherwiseSpecified(source[key], options);
        }
      });
      return destination;
    }
    __name(mergeObject, "mergeObject");
    function deepmerge(target, source, options) {
      options = options || {};
      options.arrayMerge = options.arrayMerge || defaultArrayMerge;
      options.isMergeableObject = options.isMergeableObject || isMergeableObject;
      options.cloneUnlessOtherwiseSpecified = cloneUnlessOtherwiseSpecified;
      var sourceIsArray = Array.isArray(source);
      var targetIsArray = Array.isArray(target);
      var sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;
      if (!sourceAndTargetTypesMatch) {
        return cloneUnlessOtherwiseSpecified(source, options);
      } else if (sourceIsArray) {
        return options.arrayMerge(target, source, options);
      } else {
        return mergeObject(target, source, options);
      }
    }
    __name(deepmerge, "deepmerge");
    deepmerge.all = /* @__PURE__ */ __name(function deepmergeAll(array, options) {
      if (!Array.isArray(array)) {
        throw new Error("first argument should be an array");
      }
      return array.reduce(function(prev, next) {
        return deepmerge(prev, next, options);
      }, {});
    }, "deepmergeAll");
    var deepmerge_1 = deepmerge;
    module.exports = deepmerge_1;
  }
});

// node_modules/react/cjs/react-jsx-runtime.production.min.js
var require_react_jsx_runtime_production_min = __commonJS({
  "node_modules/react/cjs/react-jsx-runtime.production.min.js"(exports) {
    "use strict";
    init_esm();
    var f2 = require_react();
    var k3 = Symbol.for("react.element");
    var l3 = Symbol.for("react.fragment");
    var m = Object.prototype.hasOwnProperty;
    var n2 = f2.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner;
    var p = { key: true, ref: true, __self: true, __source: true };
    function q3(c2, a, g) {
      var b3, d = {}, e2 = null, h2 = null;
      void 0 !== g && (e2 = "" + g);
      void 0 !== a.key && (e2 = "" + a.key);
      void 0 !== a.ref && (h2 = a.ref);
      for (b3 in a) m.call(a, b3) && !p.hasOwnProperty(b3) && (d[b3] = a[b3]);
      if (c2 && c2.defaultProps) for (b3 in a = c2.defaultProps, a) void 0 === d[b3] && (d[b3] = a[b3]);
      return { $$typeof: k3, type: c2, key: e2, ref: h2, props: d, _owner: n2.current };
    }
    __name(q3, "q");
    exports.Fragment = l3;
    exports.jsx = q3;
    exports.jsxs = q3;
  }
});

// node_modules/react/cjs/react-jsx-runtime.development.js
var require_react_jsx_runtime_development = __commonJS({
  "node_modules/react/cjs/react-jsx-runtime.development.js"(exports) {
    "use strict";
    init_esm();
    if (process.env.NODE_ENV !== "production") {
      (function() {
        "use strict";
        var React = require_react();
        var REACT_ELEMENT_TYPE = Symbol.for("react.element");
        var REACT_PORTAL_TYPE = Symbol.for("react.portal");
        var REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");
        var REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode");
        var REACT_PROFILER_TYPE = Symbol.for("react.profiler");
        var REACT_PROVIDER_TYPE = Symbol.for("react.provider");
        var REACT_CONTEXT_TYPE = Symbol.for("react.context");
        var REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref");
        var REACT_SUSPENSE_TYPE = Symbol.for("react.suspense");
        var REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list");
        var REACT_MEMO_TYPE = Symbol.for("react.memo");
        var REACT_LAZY_TYPE = Symbol.for("react.lazy");
        var REACT_OFFSCREEN_TYPE = Symbol.for("react.offscreen");
        var MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
        var FAUX_ITERATOR_SYMBOL = "@@iterator";
        function getIteratorFn(maybeIterable) {
          if (maybeIterable === null || typeof maybeIterable !== "object") {
            return null;
          }
          var maybeIterator = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL];
          if (typeof maybeIterator === "function") {
            return maybeIterator;
          }
          return null;
        }
        __name(getIteratorFn, "getIteratorFn");
        var ReactSharedInternals = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
        function error(format) {
          {
            {
              for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                args[_key2 - 1] = arguments[_key2];
              }
              printWarning("error", format, args);
            }
          }
        }
        __name(error, "error");
        function printWarning(level, format, args) {
          {
            var ReactDebugCurrentFrame2 = ReactSharedInternals.ReactDebugCurrentFrame;
            var stack = ReactDebugCurrentFrame2.getStackAddendum();
            if (stack !== "") {
              format += "%s";
              args = args.concat([stack]);
            }
            var argsWithFormat = args.map(function(item) {
              return String(item);
            });
            argsWithFormat.unshift("Warning: " + format);
            Function.prototype.apply.call(console[level], console, argsWithFormat);
          }
        }
        __name(printWarning, "printWarning");
        var enableScopeAPI = false;
        var enableCacheElement = false;
        var enableTransitionTracing = false;
        var enableLegacyHidden = false;
        var enableDebugTracing = false;
        var REACT_MODULE_REFERENCE;
        {
          REACT_MODULE_REFERENCE = Symbol.for("react.module.reference");
        }
        function isValidElementType(type) {
          if (typeof type === "string" || typeof type === "function") {
            return true;
          }
          if (type === REACT_FRAGMENT_TYPE || type === REACT_PROFILER_TYPE || enableDebugTracing || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || enableLegacyHidden || type === REACT_OFFSCREEN_TYPE || enableScopeAPI || enableCacheElement || enableTransitionTracing) {
            return true;
          }
          if (typeof type === "object" && type !== null) {
            if (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || // This needs to include all possible module reference object
            // types supported by any Flight configuration anywhere since
            // we don't know which Flight build this will end up being used
            // with.
            type.$$typeof === REACT_MODULE_REFERENCE || type.getModuleId !== void 0) {
              return true;
            }
          }
          return false;
        }
        __name(isValidElementType, "isValidElementType");
        function getWrappedName(outerType, innerType, wrapperName) {
          var displayName = outerType.displayName;
          if (displayName) {
            return displayName;
          }
          var functionName = innerType.displayName || innerType.name || "";
          return functionName !== "" ? wrapperName + "(" + functionName + ")" : wrapperName;
        }
        __name(getWrappedName, "getWrappedName");
        function getContextName(type) {
          return type.displayName || "Context";
        }
        __name(getContextName, "getContextName");
        function getComponentNameFromType(type) {
          if (type == null) {
            return null;
          }
          {
            if (typeof type.tag === "number") {
              error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue.");
            }
          }
          if (typeof type === "function") {
            return type.displayName || type.name || null;
          }
          if (typeof type === "string") {
            return type;
          }
          switch (type) {
            case REACT_FRAGMENT_TYPE:
              return "Fragment";
            case REACT_PORTAL_TYPE:
              return "Portal";
            case REACT_PROFILER_TYPE:
              return "Profiler";
            case REACT_STRICT_MODE_TYPE:
              return "StrictMode";
            case REACT_SUSPENSE_TYPE:
              return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
              return "SuspenseList";
          }
          if (typeof type === "object") {
            switch (type.$$typeof) {
              case REACT_CONTEXT_TYPE:
                var context = type;
                return getContextName(context) + ".Consumer";
              case REACT_PROVIDER_TYPE:
                var provider = type;
                return getContextName(provider._context) + ".Provider";
              case REACT_FORWARD_REF_TYPE:
                return getWrappedName(type, type.render, "ForwardRef");
              case REACT_MEMO_TYPE:
                var outerName = type.displayName || null;
                if (outerName !== null) {
                  return outerName;
                }
                return getComponentNameFromType(type.type) || "Memo";
              case REACT_LAZY_TYPE: {
                var lazyComponent = type;
                var payload = lazyComponent._payload;
                var init = lazyComponent._init;
                try {
                  return getComponentNameFromType(init(payload));
                } catch (x3) {
                  return null;
                }
              }
            }
          }
          return null;
        }
        __name(getComponentNameFromType, "getComponentNameFromType");
        var assign = Object.assign;
        var disabledDepth = 0;
        var prevLog;
        var prevInfo;
        var prevWarn;
        var prevError;
        var prevGroup;
        var prevGroupCollapsed;
        var prevGroupEnd;
        function disabledLog() {
        }
        __name(disabledLog, "disabledLog");
        disabledLog.__reactDisabledLog = true;
        function disableLogs() {
          {
            if (disabledDepth === 0) {
              prevLog = console.log;
              prevInfo = console.info;
              prevWarn = console.warn;
              prevError = console.error;
              prevGroup = console.group;
              prevGroupCollapsed = console.groupCollapsed;
              prevGroupEnd = console.groupEnd;
              var props = {
                configurable: true,
                enumerable: true,
                value: disabledLog,
                writable: true
              };
              Object.defineProperties(console, {
                info: props,
                log: props,
                warn: props,
                error: props,
                group: props,
                groupCollapsed: props,
                groupEnd: props
              });
            }
            disabledDepth++;
          }
        }
        __name(disableLogs, "disableLogs");
        function reenableLogs() {
          {
            disabledDepth--;
            if (disabledDepth === 0) {
              var props = {
                configurable: true,
                enumerable: true,
                writable: true
              };
              Object.defineProperties(console, {
                log: assign({}, props, {
                  value: prevLog
                }),
                info: assign({}, props, {
                  value: prevInfo
                }),
                warn: assign({}, props, {
                  value: prevWarn
                }),
                error: assign({}, props, {
                  value: prevError
                }),
                group: assign({}, props, {
                  value: prevGroup
                }),
                groupCollapsed: assign({}, props, {
                  value: prevGroupCollapsed
                }),
                groupEnd: assign({}, props, {
                  value: prevGroupEnd
                })
              });
            }
            if (disabledDepth < 0) {
              error("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
            }
          }
        }
        __name(reenableLogs, "reenableLogs");
        var ReactCurrentDispatcher = ReactSharedInternals.ReactCurrentDispatcher;
        var prefix;
        function describeBuiltInComponentFrame(name2, source, ownerFn) {
          {
            if (prefix === void 0) {
              try {
                throw Error();
              } catch (x3) {
                var match = x3.stack.trim().match(/\n( *(at )?)/);
                prefix = match && match[1] || "";
              }
            }
            return "\n" + prefix + name2;
          }
        }
        __name(describeBuiltInComponentFrame, "describeBuiltInComponentFrame");
        var reentry = false;
        var componentFrameCache;
        {
          var PossiblyWeakMap = typeof WeakMap === "function" ? WeakMap : Map;
          componentFrameCache = new PossiblyWeakMap();
        }
        function describeNativeComponentFrame(fn2, construct) {
          if (!fn2 || reentry) {
            return "";
          }
          {
            var frame = componentFrameCache.get(fn2);
            if (frame !== void 0) {
              return frame;
            }
          }
          var control;
          reentry = true;
          var previousPrepareStackTrace = Error.prepareStackTrace;
          Error.prepareStackTrace = void 0;
          var previousDispatcher;
          {
            previousDispatcher = ReactCurrentDispatcher.current;
            ReactCurrentDispatcher.current = null;
            disableLogs();
          }
          try {
            if (construct) {
              var Fake = /* @__PURE__ */ __name(function() {
                throw Error();
              }, "Fake");
              Object.defineProperty(Fake.prototype, "props", {
                set: /* @__PURE__ */ __name(function() {
                  throw Error();
                }, "set")
              });
              if (typeof Reflect === "object" && Reflect.construct) {
                try {
                  Reflect.construct(Fake, []);
                } catch (x3) {
                  control = x3;
                }
                Reflect.construct(fn2, [], Fake);
              } else {
                try {
                  Fake.call();
                } catch (x3) {
                  control = x3;
                }
                fn2.call(Fake.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (x3) {
                control = x3;
              }
              fn2();
            }
          } catch (sample) {
            if (sample && control && typeof sample.stack === "string") {
              var sampleLines = sample.stack.split("\n");
              var controlLines = control.stack.split("\n");
              var s2 = sampleLines.length - 1;
              var c2 = controlLines.length - 1;
              while (s2 >= 1 && c2 >= 0 && sampleLines[s2] !== controlLines[c2]) {
                c2--;
              }
              for (; s2 >= 1 && c2 >= 0; s2--, c2--) {
                if (sampleLines[s2] !== controlLines[c2]) {
                  if (s2 !== 1 || c2 !== 1) {
                    do {
                      s2--;
                      c2--;
                      if (c2 < 0 || sampleLines[s2] !== controlLines[c2]) {
                        var _frame = "\n" + sampleLines[s2].replace(" at new ", " at ");
                        if (fn2.displayName && _frame.includes("<anonymous>")) {
                          _frame = _frame.replace("<anonymous>", fn2.displayName);
                        }
                        {
                          if (typeof fn2 === "function") {
                            componentFrameCache.set(fn2, _frame);
                          }
                        }
                        return _frame;
                      }
                    } while (s2 >= 1 && c2 >= 0);
                  }
                  break;
                }
              }
            }
          } finally {
            reentry = false;
            {
              ReactCurrentDispatcher.current = previousDispatcher;
              reenableLogs();
            }
            Error.prepareStackTrace = previousPrepareStackTrace;
          }
          var name2 = fn2 ? fn2.displayName || fn2.name : "";
          var syntheticFrame = name2 ? describeBuiltInComponentFrame(name2) : "";
          {
            if (typeof fn2 === "function") {
              componentFrameCache.set(fn2, syntheticFrame);
            }
          }
          return syntheticFrame;
        }
        __name(describeNativeComponentFrame, "describeNativeComponentFrame");
        function describeFunctionComponentFrame(fn2, source, ownerFn) {
          {
            return describeNativeComponentFrame(fn2, false);
          }
        }
        __name(describeFunctionComponentFrame, "describeFunctionComponentFrame");
        function shouldConstruct(Component) {
          var prototype = Component.prototype;
          return !!(prototype && prototype.isReactComponent);
        }
        __name(shouldConstruct, "shouldConstruct");
        function describeUnknownElementTypeFrameInDEV(type, source, ownerFn) {
          if (type == null) {
            return "";
          }
          if (typeof type === "function") {
            {
              return describeNativeComponentFrame(type, shouldConstruct(type));
            }
          }
          if (typeof type === "string") {
            return describeBuiltInComponentFrame(type);
          }
          switch (type) {
            case REACT_SUSPENSE_TYPE:
              return describeBuiltInComponentFrame("Suspense");
            case REACT_SUSPENSE_LIST_TYPE:
              return describeBuiltInComponentFrame("SuspenseList");
          }
          if (typeof type === "object") {
            switch (type.$$typeof) {
              case REACT_FORWARD_REF_TYPE:
                return describeFunctionComponentFrame(type.render);
              case REACT_MEMO_TYPE:
                return describeUnknownElementTypeFrameInDEV(type.type, source, ownerFn);
              case REACT_LAZY_TYPE: {
                var lazyComponent = type;
                var payload = lazyComponent._payload;
                var init = lazyComponent._init;
                try {
                  return describeUnknownElementTypeFrameInDEV(init(payload), source, ownerFn);
                } catch (x3) {
                }
              }
            }
          }
          return "";
        }
        __name(describeUnknownElementTypeFrameInDEV, "describeUnknownElementTypeFrameInDEV");
        var hasOwnProperty = Object.prototype.hasOwnProperty;
        var loggedTypeFailures = {};
        var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;
        function setCurrentlyValidatingElement(element) {
          {
            if (element) {
              var owner = element._owner;
              var stack = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
              ReactDebugCurrentFrame.setExtraStackFrame(stack);
            } else {
              ReactDebugCurrentFrame.setExtraStackFrame(null);
            }
          }
        }
        __name(setCurrentlyValidatingElement, "setCurrentlyValidatingElement");
        function checkPropTypes(typeSpecs, values, location, componentName, element) {
          {
            var has = Function.call.bind(hasOwnProperty);
            for (var typeSpecName in typeSpecs) {
              if (has(typeSpecs, typeSpecName)) {
                var error$1 = void 0;
                try {
                  if (typeof typeSpecs[typeSpecName] !== "function") {
                    var err = Error((componentName || "React class") + ": " + location + " type `" + typeSpecName + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof typeSpecs[typeSpecName] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                    err.name = "Invariant Violation";
                    throw err;
                  }
                  error$1 = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
                } catch (ex) {
                  error$1 = ex;
                }
                if (error$1 && !(error$1 instanceof Error)) {
                  setCurrentlyValidatingElement(element);
                  error("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", componentName || "React class", location, typeSpecName, typeof error$1);
                  setCurrentlyValidatingElement(null);
                }
                if (error$1 instanceof Error && !(error$1.message in loggedTypeFailures)) {
                  loggedTypeFailures[error$1.message] = true;
                  setCurrentlyValidatingElement(element);
                  error("Failed %s type: %s", location, error$1.message);
                  setCurrentlyValidatingElement(null);
                }
              }
            }
          }
        }
        __name(checkPropTypes, "checkPropTypes");
        var isArrayImpl = Array.isArray;
        function isArray(a) {
          return isArrayImpl(a);
        }
        __name(isArray, "isArray");
        function typeName(value) {
          {
            var hasToStringTag = typeof Symbol === "function" && Symbol.toStringTag;
            var type = hasToStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            return type;
          }
        }
        __name(typeName, "typeName");
        function willCoercionThrow(value) {
          {
            try {
              testStringCoercion(value);
              return false;
            } catch (e2) {
              return true;
            }
          }
        }
        __name(willCoercionThrow, "willCoercionThrow");
        function testStringCoercion(value) {
          return "" + value;
        }
        __name(testStringCoercion, "testStringCoercion");
        function checkKeyStringCoercion(value) {
          {
            if (willCoercionThrow(value)) {
              error("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", typeName(value));
              return testStringCoercion(value);
            }
          }
        }
        __name(checkKeyStringCoercion, "checkKeyStringCoercion");
        var ReactCurrentOwner = ReactSharedInternals.ReactCurrentOwner;
        var RESERVED_PROPS = {
          key: true,
          ref: true,
          __self: true,
          __source: true
        };
        var specialPropKeyWarningShown;
        var specialPropRefWarningShown;
        var didWarnAboutStringRefs;
        {
          didWarnAboutStringRefs = {};
        }
        function hasValidRef(config) {
          {
            if (hasOwnProperty.call(config, "ref")) {
              var getter = Object.getOwnPropertyDescriptor(config, "ref").get;
              if (getter && getter.isReactWarning) {
                return false;
              }
            }
          }
          return config.ref !== void 0;
        }
        __name(hasValidRef, "hasValidRef");
        function hasValidKey(config) {
          {
            if (hasOwnProperty.call(config, "key")) {
              var getter = Object.getOwnPropertyDescriptor(config, "key").get;
              if (getter && getter.isReactWarning) {
                return false;
              }
            }
          }
          return config.key !== void 0;
        }
        __name(hasValidKey, "hasValidKey");
        function warnIfStringRefCannotBeAutoConverted(config, self) {
          {
            if (typeof config.ref === "string" && ReactCurrentOwner.current && self && ReactCurrentOwner.current.stateNode !== self) {
              var componentName = getComponentNameFromType(ReactCurrentOwner.current.type);
              if (!didWarnAboutStringRefs[componentName]) {
                error('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. This case cannot be automatically converted to an arrow function. We ask you to manually fix this case by using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', getComponentNameFromType(ReactCurrentOwner.current.type), config.ref);
                didWarnAboutStringRefs[componentName] = true;
              }
            }
          }
        }
        __name(warnIfStringRefCannotBeAutoConverted, "warnIfStringRefCannotBeAutoConverted");
        function defineKeyPropWarningGetter(props, displayName) {
          {
            var warnAboutAccessingKey = /* @__PURE__ */ __name(function() {
              if (!specialPropKeyWarningShown) {
                specialPropKeyWarningShown = true;
                error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", displayName);
              }
            }, "warnAboutAccessingKey");
            warnAboutAccessingKey.isReactWarning = true;
            Object.defineProperty(props, "key", {
              get: warnAboutAccessingKey,
              configurable: true
            });
          }
        }
        __name(defineKeyPropWarningGetter, "defineKeyPropWarningGetter");
        function defineRefPropWarningGetter(props, displayName) {
          {
            var warnAboutAccessingRef = /* @__PURE__ */ __name(function() {
              if (!specialPropRefWarningShown) {
                specialPropRefWarningShown = true;
                error("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", displayName);
              }
            }, "warnAboutAccessingRef");
            warnAboutAccessingRef.isReactWarning = true;
            Object.defineProperty(props, "ref", {
              get: warnAboutAccessingRef,
              configurable: true
            });
          }
        }
        __name(defineRefPropWarningGetter, "defineRefPropWarningGetter");
        var ReactElement = /* @__PURE__ */ __name(function(type, key, ref, self, source, owner, props) {
          var element = {
            // This tag allows us to uniquely identify this as a React Element
            $$typeof: REACT_ELEMENT_TYPE,
            // Built-in properties that belong on the element
            type,
            key,
            ref,
            props,
            // Record the component responsible for creating this element.
            _owner: owner
          };
          {
            element._store = {};
            Object.defineProperty(element._store, "validated", {
              configurable: false,
              enumerable: false,
              writable: true,
              value: false
            });
            Object.defineProperty(element, "_self", {
              configurable: false,
              enumerable: false,
              writable: false,
              value: self
            });
            Object.defineProperty(element, "_source", {
              configurable: false,
              enumerable: false,
              writable: false,
              value: source
            });
            if (Object.freeze) {
              Object.freeze(element.props);
              Object.freeze(element);
            }
          }
          return element;
        }, "ReactElement");
        function jsxDEV(type, config, maybeKey, source, self) {
          {
            var propName;
            var props = {};
            var key = null;
            var ref = null;
            if (maybeKey !== void 0) {
              {
                checkKeyStringCoercion(maybeKey);
              }
              key = "" + maybeKey;
            }
            if (hasValidKey(config)) {
              {
                checkKeyStringCoercion(config.key);
              }
              key = "" + config.key;
            }
            if (hasValidRef(config)) {
              ref = config.ref;
              warnIfStringRefCannotBeAutoConverted(config, self);
            }
            for (propName in config) {
              if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
                props[propName] = config[propName];
              }
            }
            if (type && type.defaultProps) {
              var defaultProps = type.defaultProps;
              for (propName in defaultProps) {
                if (props[propName] === void 0) {
                  props[propName] = defaultProps[propName];
                }
              }
            }
            if (key || ref) {
              var displayName = typeof type === "function" ? type.displayName || type.name || "Unknown" : type;
              if (key) {
                defineKeyPropWarningGetter(props, displayName);
              }
              if (ref) {
                defineRefPropWarningGetter(props, displayName);
              }
            }
            return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
          }
        }
        __name(jsxDEV, "jsxDEV");
        var ReactCurrentOwner$1 = ReactSharedInternals.ReactCurrentOwner;
        var ReactDebugCurrentFrame$1 = ReactSharedInternals.ReactDebugCurrentFrame;
        function setCurrentlyValidatingElement$1(element) {
          {
            if (element) {
              var owner = element._owner;
              var stack = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
              ReactDebugCurrentFrame$1.setExtraStackFrame(stack);
            } else {
              ReactDebugCurrentFrame$1.setExtraStackFrame(null);
            }
          }
        }
        __name(setCurrentlyValidatingElement$1, "setCurrentlyValidatingElement$1");
        var propTypesMisspellWarningShown;
        {
          propTypesMisspellWarningShown = false;
        }
        function isValidElement(object) {
          {
            return typeof object === "object" && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
          }
        }
        __name(isValidElement, "isValidElement");
        function getDeclarationErrorAddendum() {
          {
            if (ReactCurrentOwner$1.current) {
              var name2 = getComponentNameFromType(ReactCurrentOwner$1.current.type);
              if (name2) {
                return "\n\nCheck the render method of `" + name2 + "`.";
              }
            }
            return "";
          }
        }
        __name(getDeclarationErrorAddendum, "getDeclarationErrorAddendum");
        function getSourceInfoErrorAddendum(source) {
          {
            if (source !== void 0) {
              var fileName = source.fileName.replace(/^.*[\\\/]/, "");
              var lineNumber = source.lineNumber;
              return "\n\nCheck your code at " + fileName + ":" + lineNumber + ".";
            }
            return "";
          }
        }
        __name(getSourceInfoErrorAddendum, "getSourceInfoErrorAddendum");
        var ownerHasKeyUseWarning = {};
        function getCurrentComponentErrorInfo(parentType) {
          {
            var info = getDeclarationErrorAddendum();
            if (!info) {
              var parentName = typeof parentType === "string" ? parentType : parentType.displayName || parentType.name;
              if (parentName) {
                info = "\n\nCheck the top-level render call using <" + parentName + ">.";
              }
            }
            return info;
          }
        }
        __name(getCurrentComponentErrorInfo, "getCurrentComponentErrorInfo");
        function validateExplicitKey(element, parentType) {
          {
            if (!element._store || element._store.validated || element.key != null) {
              return;
            }
            element._store.validated = true;
            var currentComponentErrorInfo = getCurrentComponentErrorInfo(parentType);
            if (ownerHasKeyUseWarning[currentComponentErrorInfo]) {
              return;
            }
            ownerHasKeyUseWarning[currentComponentErrorInfo] = true;
            var childOwner = "";
            if (element && element._owner && element._owner !== ReactCurrentOwner$1.current) {
              childOwner = " It was passed a child from " + getComponentNameFromType(element._owner.type) + ".";
            }
            setCurrentlyValidatingElement$1(element);
            error('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', currentComponentErrorInfo, childOwner);
            setCurrentlyValidatingElement$1(null);
          }
        }
        __name(validateExplicitKey, "validateExplicitKey");
        function validateChildKeys(node, parentType) {
          {
            if (typeof node !== "object") {
              return;
            }
            if (isArray(node)) {
              for (var i = 0; i < node.length; i++) {
                var child = node[i];
                if (isValidElement(child)) {
                  validateExplicitKey(child, parentType);
                }
              }
            } else if (isValidElement(node)) {
              if (node._store) {
                node._store.validated = true;
              }
            } else if (node) {
              var iteratorFn = getIteratorFn(node);
              if (typeof iteratorFn === "function") {
                if (iteratorFn !== node.entries) {
                  var iterator = iteratorFn.call(node);
                  var step;
                  while (!(step = iterator.next()).done) {
                    if (isValidElement(step.value)) {
                      validateExplicitKey(step.value, parentType);
                    }
                  }
                }
              }
            }
          }
        }
        __name(validateChildKeys, "validateChildKeys");
        function validatePropTypes(element) {
          {
            var type = element.type;
            if (type === null || type === void 0 || typeof type === "string") {
              return;
            }
            var propTypes;
            if (typeof type === "function") {
              propTypes = type.propTypes;
            } else if (typeof type === "object" && (type.$$typeof === REACT_FORWARD_REF_TYPE || // Note: Memo only checks outer props here.
            // Inner props are checked in the reconciler.
            type.$$typeof === REACT_MEMO_TYPE)) {
              propTypes = type.propTypes;
            } else {
              return;
            }
            if (propTypes) {
              var name2 = getComponentNameFromType(type);
              checkPropTypes(propTypes, element.props, "prop", name2, element);
            } else if (type.PropTypes !== void 0 && !propTypesMisspellWarningShown) {
              propTypesMisspellWarningShown = true;
              var _name = getComponentNameFromType(type);
              error("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", _name || "Unknown");
            }
            if (typeof type.getDefaultProps === "function" && !type.getDefaultProps.isReactClassApproved) {
              error("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
            }
          }
        }
        __name(validatePropTypes, "validatePropTypes");
        function validateFragmentProps(fragment) {
          {
            var keys = Object.keys(fragment.props);
            for (var i = 0; i < keys.length; i++) {
              var key = keys[i];
              if (key !== "children" && key !== "key") {
                setCurrentlyValidatingElement$1(fragment);
                error("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", key);
                setCurrentlyValidatingElement$1(null);
                break;
              }
            }
            if (fragment.ref !== null) {
              setCurrentlyValidatingElement$1(fragment);
              error("Invalid attribute `ref` supplied to `React.Fragment`.");
              setCurrentlyValidatingElement$1(null);
            }
          }
        }
        __name(validateFragmentProps, "validateFragmentProps");
        var didWarnAboutKeySpread = {};
        function jsxWithValidation(type, props, key, isStaticChildren, source, self) {
          {
            var validType = isValidElementType(type);
            if (!validType) {
              var info = "";
              if (type === void 0 || typeof type === "object" && type !== null && Object.keys(type).length === 0) {
                info += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.";
              }
              var sourceInfo = getSourceInfoErrorAddendum(source);
              if (sourceInfo) {
                info += sourceInfo;
              } else {
                info += getDeclarationErrorAddendum();
              }
              var typeString;
              if (type === null) {
                typeString = "null";
              } else if (isArray(type)) {
                typeString = "array";
              } else if (type !== void 0 && type.$$typeof === REACT_ELEMENT_TYPE) {
                typeString = "<" + (getComponentNameFromType(type.type) || "Unknown") + " />";
                info = " Did you accidentally export a JSX literal instead of a component?";
              } else {
                typeString = typeof type;
              }
              error("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", typeString, info);
            }
            var element = jsxDEV(type, props, key, source, self);
            if (element == null) {
              return element;
            }
            if (validType) {
              var children = props.children;
              if (children !== void 0) {
                if (isStaticChildren) {
                  if (isArray(children)) {
                    for (var i = 0; i < children.length; i++) {
                      validateChildKeys(children[i], type);
                    }
                    if (Object.freeze) {
                      Object.freeze(children);
                    }
                  } else {
                    error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
                  }
                } else {
                  validateChildKeys(children, type);
                }
              }
            }
            {
              if (hasOwnProperty.call(props, "key")) {
                var componentName = getComponentNameFromType(type);
                var keys = Object.keys(props).filter(function(k3) {
                  return k3 !== "key";
                });
                var beforeExample = keys.length > 0 ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
                if (!didWarnAboutKeySpread[componentName + beforeExample]) {
                  var afterExample = keys.length > 0 ? "{" + keys.join(": ..., ") + ": ...}" : "{}";
                  error('A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />', beforeExample, componentName, afterExample, componentName);
                  didWarnAboutKeySpread[componentName + beforeExample] = true;
                }
              }
            }
            if (type === REACT_FRAGMENT_TYPE) {
              validateFragmentProps(element);
            } else {
              validatePropTypes(element);
            }
            return element;
          }
        }
        __name(jsxWithValidation, "jsxWithValidation");
        function jsxWithValidationStatic(type, props, key) {
          {
            return jsxWithValidation(type, props, key, true);
          }
        }
        __name(jsxWithValidationStatic, "jsxWithValidationStatic");
        function jsxWithValidationDynamic(type, props, key) {
          {
            return jsxWithValidation(type, props, key, false);
          }
        }
        __name(jsxWithValidationDynamic, "jsxWithValidationDynamic");
        var jsx2 = jsxWithValidationDynamic;
        var jsxs = jsxWithValidationStatic;
        exports.Fragment = REACT_FRAGMENT_TYPE;
        exports.jsx = jsx2;
        exports.jsxs = jsxs;
      })();
    }
  }
});

// node_modules/react/jsx-runtime.js
var require_jsx_runtime = __commonJS({
  "node_modules/react/jsx-runtime.js"(exports, module) {
    "use strict";
    init_esm();
    if (process.env.NODE_ENV === "production") {
      module.exports = require_react_jsx_runtime_production_min();
    } else {
      module.exports = require_react_jsx_runtime_development();
    }
  }
});

// node_modules/@react-email/render/dist/node/index.mjs
init_esm();

// node_modules/html-to-text/lib/html-to-text.mjs
init_esm();

// node_modules/@selderee/plugin-htmlparser2/lib/hp2-builder.mjs
init_esm();

// node_modules/domhandler/lib/esm/index.js
init_esm();

// node_modules/domelementtype/lib/esm/index.js
init_esm();
var ElementType;
(function(ElementType2) {
  ElementType2["Root"] = "root";
  ElementType2["Text"] = "text";
  ElementType2["Directive"] = "directive";
  ElementType2["Comment"] = "comment";
  ElementType2["Script"] = "script";
  ElementType2["Style"] = "style";
  ElementType2["Tag"] = "tag";
  ElementType2["CDATA"] = "cdata";
  ElementType2["Doctype"] = "doctype";
})(ElementType || (ElementType = {}));
function isTag(elem) {
  return elem.type === ElementType.Tag || elem.type === ElementType.Script || elem.type === ElementType.Style;
}
__name(isTag, "isTag");
var Root = ElementType.Root;
var Text = ElementType.Text;
var Directive = ElementType.Directive;
var Comment = ElementType.Comment;
var Script = ElementType.Script;
var Style = ElementType.Style;
var Tag = ElementType.Tag;
var CDATA = ElementType.CDATA;
var Doctype = ElementType.Doctype;

// node_modules/domhandler/lib/esm/node.js
init_esm();
var Node = class {
  static {
    __name(this, "Node");
  }
  constructor() {
    this.parent = null;
    this.prev = null;
    this.next = null;
    this.startIndex = null;
    this.endIndex = null;
  }
  // Read-write aliases for properties
  /**
   * Same as {@link parent}.
   * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
   */
  get parentNode() {
    return this.parent;
  }
  set parentNode(parent) {
    this.parent = parent;
  }
  /**
   * Same as {@link prev}.
   * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
   */
  get previousSibling() {
    return this.prev;
  }
  set previousSibling(prev) {
    this.prev = prev;
  }
  /**
   * Same as {@link next}.
   * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
   */
  get nextSibling() {
    return this.next;
  }
  set nextSibling(next) {
    this.next = next;
  }
  /**
   * Clone this node, and optionally its children.
   *
   * @param recursive Clone child nodes as well.
   * @returns A clone of the node.
   */
  cloneNode(recursive = false) {
    return cloneNode(this, recursive);
  }
};
var DataNode = class extends Node {
  static {
    __name(this, "DataNode");
  }
  /**
   * @param data The content of the data node
   */
  constructor(data) {
    super();
    this.data = data;
  }
  /**
   * Same as {@link data}.
   * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
   */
  get nodeValue() {
    return this.data;
  }
  set nodeValue(data) {
    this.data = data;
  }
};
var Text2 = class extends DataNode {
  static {
    __name(this, "Text");
  }
  constructor() {
    super(...arguments);
    this.type = ElementType.Text;
  }
  get nodeType() {
    return 3;
  }
};
var Comment2 = class extends DataNode {
  static {
    __name(this, "Comment");
  }
  constructor() {
    super(...arguments);
    this.type = ElementType.Comment;
  }
  get nodeType() {
    return 8;
  }
};
var ProcessingInstruction = class extends DataNode {
  static {
    __name(this, "ProcessingInstruction");
  }
  constructor(name2, data) {
    super(data);
    this.name = name2;
    this.type = ElementType.Directive;
  }
  get nodeType() {
    return 1;
  }
};
var NodeWithChildren = class extends Node {
  static {
    __name(this, "NodeWithChildren");
  }
  /**
   * @param children Children of the node. Only certain node types can have children.
   */
  constructor(children) {
    super();
    this.children = children;
  }
  // Aliases
  /** First child of the node. */
  get firstChild() {
    var _a4;
    return (_a4 = this.children[0]) !== null && _a4 !== void 0 ? _a4 : null;
  }
  /** Last child of the node. */
  get lastChild() {
    return this.children.length > 0 ? this.children[this.children.length - 1] : null;
  }
  /**
   * Same as {@link children}.
   * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
   */
  get childNodes() {
    return this.children;
  }
  set childNodes(children) {
    this.children = children;
  }
};
var CDATA2 = class extends NodeWithChildren {
  static {
    __name(this, "CDATA");
  }
  constructor() {
    super(...arguments);
    this.type = ElementType.CDATA;
  }
  get nodeType() {
    return 4;
  }
};
var Document = class extends NodeWithChildren {
  static {
    __name(this, "Document");
  }
  constructor() {
    super(...arguments);
    this.type = ElementType.Root;
  }
  get nodeType() {
    return 9;
  }
};
var Element = class extends NodeWithChildren {
  static {
    __name(this, "Element");
  }
  /**
   * @param name Name of the tag, eg. `div`, `span`.
   * @param attribs Object mapping attribute names to attribute values.
   * @param children Children of the node.
   */
  constructor(name2, attribs, children = [], type = name2 === "script" ? ElementType.Script : name2 === "style" ? ElementType.Style : ElementType.Tag) {
    super(children);
    this.name = name2;
    this.attribs = attribs;
    this.type = type;
  }
  get nodeType() {
    return 1;
  }
  // DOM Level 1 aliases
  /**
   * Same as {@link name}.
   * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
   */
  get tagName() {
    return this.name;
  }
  set tagName(name2) {
    this.name = name2;
  }
  get attributes() {
    return Object.keys(this.attribs).map((name2) => {
      var _a4, _b;
      return {
        name: name2,
        value: this.attribs[name2],
        namespace: (_a4 = this["x-attribsNamespace"]) === null || _a4 === void 0 ? void 0 : _a4[name2],
        prefix: (_b = this["x-attribsPrefix"]) === null || _b === void 0 ? void 0 : _b[name2]
      };
    });
  }
};
function isTag2(node) {
  return isTag(node);
}
__name(isTag2, "isTag");
function isCDATA(node) {
  return node.type === ElementType.CDATA;
}
__name(isCDATA, "isCDATA");
function isText(node) {
  return node.type === ElementType.Text;
}
__name(isText, "isText");
function isComment(node) {
  return node.type === ElementType.Comment;
}
__name(isComment, "isComment");
function isDirective(node) {
  return node.type === ElementType.Directive;
}
__name(isDirective, "isDirective");
function isDocument(node) {
  return node.type === ElementType.Root;
}
__name(isDocument, "isDocument");
function cloneNode(node, recursive = false) {
  let result;
  if (isText(node)) {
    result = new Text2(node.data);
  } else if (isComment(node)) {
    result = new Comment2(node.data);
  } else if (isTag2(node)) {
    const children = recursive ? cloneChildren(node.children) : [];
    const clone = new Element(node.name, { ...node.attribs }, children);
    children.forEach((child) => child.parent = clone);
    if (node.namespace != null) {
      clone.namespace = node.namespace;
    }
    if (node["x-attribsNamespace"]) {
      clone["x-attribsNamespace"] = { ...node["x-attribsNamespace"] };
    }
    if (node["x-attribsPrefix"]) {
      clone["x-attribsPrefix"] = { ...node["x-attribsPrefix"] };
    }
    result = clone;
  } else if (isCDATA(node)) {
    const children = recursive ? cloneChildren(node.children) : [];
    const clone = new CDATA2(children);
    children.forEach((child) => child.parent = clone);
    result = clone;
  } else if (isDocument(node)) {
    const children = recursive ? cloneChildren(node.children) : [];
    const clone = new Document(children);
    children.forEach((child) => child.parent = clone);
    if (node["x-mode"]) {
      clone["x-mode"] = node["x-mode"];
    }
    result = clone;
  } else if (isDirective(node)) {
    const instruction = new ProcessingInstruction(node.name, node.data);
    if (node["x-name"] != null) {
      instruction["x-name"] = node["x-name"];
      instruction["x-publicId"] = node["x-publicId"];
      instruction["x-systemId"] = node["x-systemId"];
    }
    result = instruction;
  } else {
    throw new Error(`Not implemented yet: ${node.type}`);
  }
  result.startIndex = node.startIndex;
  result.endIndex = node.endIndex;
  if (node.sourceCodeLocation != null) {
    result.sourceCodeLocation = node.sourceCodeLocation;
  }
  return result;
}
__name(cloneNode, "cloneNode");
function cloneChildren(childs) {
  const children = childs.map((child) => cloneNode(child, true));
  for (let i = 1; i < children.length; i++) {
    children[i].prev = children[i - 1];
    children[i - 1].next = children[i];
  }
  return children;
}
__name(cloneChildren, "cloneChildren");

// node_modules/domhandler/lib/esm/index.js
var defaultOpts = {
  withStartIndices: false,
  withEndIndices: false,
  xmlMode: false
};
var DomHandler = class {
  static {
    __name(this, "DomHandler");
  }
  /**
   * @param callback Called once parsing has completed.
   * @param options Settings for the handler.
   * @param elementCB Callback whenever a tag is closed.
   */
  constructor(callback, options, elementCB) {
    this.dom = [];
    this.root = new Document(this.dom);
    this.done = false;
    this.tagStack = [this.root];
    this.lastNode = null;
    this.parser = null;
    if (typeof options === "function") {
      elementCB = options;
      options = defaultOpts;
    }
    if (typeof callback === "object") {
      options = callback;
      callback = void 0;
    }
    this.callback = callback !== null && callback !== void 0 ? callback : null;
    this.options = options !== null && options !== void 0 ? options : defaultOpts;
    this.elementCB = elementCB !== null && elementCB !== void 0 ? elementCB : null;
  }
  onparserinit(parser) {
    this.parser = parser;
  }
  // Resets the handler back to starting state
  onreset() {
    this.dom = [];
    this.root = new Document(this.dom);
    this.done = false;
    this.tagStack = [this.root];
    this.lastNode = null;
    this.parser = null;
  }
  // Signals the handler that parsing is done
  onend() {
    if (this.done)
      return;
    this.done = true;
    this.parser = null;
    this.handleCallback(null);
  }
  onerror(error) {
    this.handleCallback(error);
  }
  onclosetag() {
    this.lastNode = null;
    const elem = this.tagStack.pop();
    if (this.options.withEndIndices) {
      elem.endIndex = this.parser.endIndex;
    }
    if (this.elementCB)
      this.elementCB(elem);
  }
  onopentag(name2, attribs) {
    const type = this.options.xmlMode ? ElementType.Tag : void 0;
    const element = new Element(name2, attribs, void 0, type);
    this.addNode(element);
    this.tagStack.push(element);
  }
  ontext(data) {
    const { lastNode } = this;
    if (lastNode && lastNode.type === ElementType.Text) {
      lastNode.data += data;
      if (this.options.withEndIndices) {
        lastNode.endIndex = this.parser.endIndex;
      }
    } else {
      const node = new Text2(data);
      this.addNode(node);
      this.lastNode = node;
    }
  }
  oncomment(data) {
    if (this.lastNode && this.lastNode.type === ElementType.Comment) {
      this.lastNode.data += data;
      return;
    }
    const node = new Comment2(data);
    this.addNode(node);
    this.lastNode = node;
  }
  oncommentend() {
    this.lastNode = null;
  }
  oncdatastart() {
    const text = new Text2("");
    const node = new CDATA2([text]);
    this.addNode(node);
    text.parent = node;
    this.lastNode = text;
  }
  oncdataend() {
    this.lastNode = null;
  }
  onprocessinginstruction(name2, data) {
    const node = new ProcessingInstruction(name2, data);
    this.addNode(node);
  }
  handleCallback(error) {
    if (typeof this.callback === "function") {
      this.callback(error, this.dom);
    } else if (error) {
      throw error;
    }
  }
  addNode(node) {
    const parent = this.tagStack[this.tagStack.length - 1];
    const previousSibling = parent.children[parent.children.length - 1];
    if (this.options.withStartIndices) {
      node.startIndex = this.parser.startIndex;
    }
    if (this.options.withEndIndices) {
      node.endIndex = this.parser.endIndex;
    }
    parent.children.push(node);
    if (previousSibling) {
      node.prev = previousSibling;
      previousSibling.next = node;
    }
    node.parent = parent;
    this.lastNode = null;
  }
};

// node_modules/selderee/lib/selderee.mjs
init_esm();

// node_modules/parseley/lib/parseley.mjs
init_esm();

// node_modules/leac/lib/leac.mjs
init_esm();
var e = /\n/g;
function n(n2) {
  const o2 = [...n2.matchAll(e)].map((e2) => e2.index || 0);
  o2.unshift(-1);
  const s2 = t(o2, 0, o2.length);
  return (e2) => r(s2, e2);
}
__name(n, "n");
function t(e2, n2, r2) {
  if (r2 - n2 == 1) return { offset: e2[n2], index: n2 + 1 };
  const o2 = Math.ceil((n2 + r2) / 2), s2 = t(e2, n2, o2), l3 = t(e2, o2, r2);
  return { offset: s2.offset, low: s2, high: l3 };
}
__name(t, "t");
function r(e2, n2) {
  return function(e3) {
    return Object.prototype.hasOwnProperty.call(e3, "index");
  }(e2) ? { line: e2.index, column: n2 - e2.offset } : r(e2.high.offset < n2 ? e2.high : e2.low, n2);
}
__name(r, "r");
function o(e2, t2 = "", r2 = {}) {
  const o2 = "string" != typeof t2 ? t2 : r2, l3 = "string" == typeof t2 ? t2 : "", c2 = e2.map(s), f2 = !!o2.lineNumbers;
  return function(e3, t3 = 0) {
    const r3 = f2 ? n(e3) : () => ({ line: 0, column: 0 });
    let o3 = t3;
    const s2 = [];
    e: for (; o3 < e3.length; ) {
      let n2 = false;
      for (const t4 of c2) {
        t4.regex.lastIndex = o3;
        const c3 = t4.regex.exec(e3);
        if (c3 && c3[0].length > 0) {
          if (!t4.discard) {
            const e4 = r3(o3), n3 = "string" == typeof t4.replace ? c3[0].replace(new RegExp(t4.regex.source, t4.regex.flags), t4.replace) : c3[0];
            s2.push({ state: l3, name: t4.name, text: n3, offset: o3, len: c3[0].length, line: e4.line, column: e4.column });
          }
          if (o3 = t4.regex.lastIndex, n2 = true, t4.push) {
            const n3 = t4.push(e3, o3);
            s2.push(...n3.tokens), o3 = n3.offset;
          }
          if (t4.pop) break e;
          break;
        }
      }
      if (!n2) break;
    }
    return { tokens: s2, offset: o3, complete: e3.length <= o3 };
  };
}
__name(o, "o");
function s(e2, n2) {
  return { ...e2, regex: l(e2, n2) };
}
__name(s, "s");
function l(e2, n2) {
  if (0 === e2.name.length) throw new Error(`Rule #${n2} has empty name, which is not allowed.`);
  if (function(e3) {
    return Object.prototype.hasOwnProperty.call(e3, "regex");
  }(e2)) return function(e3) {
    if (e3.global) throw new Error(`Regular expression /${e3.source}/${e3.flags} contains the global flag, which is not allowed.`);
    return e3.sticky ? e3 : new RegExp(e3.source, e3.flags + "y");
  }(e2.regex);
  if (function(e3) {
    return Object.prototype.hasOwnProperty.call(e3, "str");
  }(e2)) {
    if (0 === e2.str.length) throw new Error(`Rule #${n2} ("${e2.name}") has empty "str" property, which is not allowed.`);
    return new RegExp(c(e2.str), "y");
  }
  return new RegExp(c(e2.name), "y");
}
__name(l, "l");
function c(e2) {
  return e2.replace(/[-[\]{}()*+!<=:?./\\^$|#\s,]/g, "\\$&");
}
__name(c, "c");

// node_modules/peberminta/lib/core.mjs
init_esm();
function token(onToken, onEnd) {
  return (data, i) => {
    let position = i;
    let value = void 0;
    if (i < data.tokens.length) {
      value = onToken(data.tokens[i], data, i);
      if (value !== void 0) {
        position++;
      }
    } else {
      onEnd?.(data, i);
    }
    return value === void 0 ? { matched: false } : {
      matched: true,
      position,
      value
    };
  };
}
__name(token, "token");
function mapInner(r2, f2) {
  return r2.matched ? {
    matched: true,
    position: r2.position,
    value: f2(r2.value, r2.position)
  } : r2;
}
__name(mapInner, "mapInner");
function mapOuter(r2, f2) {
  return r2.matched ? f2(r2) : r2;
}
__name(mapOuter, "mapOuter");
function map(p, mapper) {
  return (data, i) => mapInner(p(data, i), (v3, j3) => mapper(v3, data, i, j3));
}
__name(map, "map");
function option(p, def) {
  return (data, i) => {
    const r2 = p(data, i);
    return r2.matched ? r2 : {
      matched: true,
      position: i,
      value: def
    };
  };
}
__name(option, "option");
function choice(...ps2) {
  return (data, i) => {
    for (const p of ps2) {
      const result = p(data, i);
      if (result.matched) {
        return result;
      }
    }
    return { matched: false };
  };
}
__name(choice, "choice");
function otherwise(pa3, pb) {
  return (data, i) => {
    const r1 = pa3(data, i);
    return r1.matched ? r1 : pb(data, i);
  };
}
__name(otherwise, "otherwise");
function takeWhile(p, test) {
  return (data, i) => {
    const values = [];
    let success = true;
    do {
      const r2 = p(data, i);
      if (r2.matched && test(r2.value, values.length + 1, data, i, r2.position)) {
        values.push(r2.value);
        i = r2.position;
      } else {
        success = false;
      }
    } while (success);
    return {
      matched: true,
      position: i,
      value: values
    };
  };
}
__name(takeWhile, "takeWhile");
function many(p) {
  return takeWhile(p, () => true);
}
__name(many, "many");
function many1(p) {
  return ab(p, many(p), (head, tail) => [head, ...tail]);
}
__name(many1, "many1");
function ab(pa3, pb, join) {
  return (data, i) => mapOuter(pa3(data, i), (ma3) => mapInner(pb(data, ma3.position), (vb, j3) => join(ma3.value, vb, data, i, j3)));
}
__name(ab, "ab");
function left(pa3, pb) {
  return ab(pa3, pb, (va3) => va3);
}
__name(left, "left");
function right(pa3, pb) {
  return ab(pa3, pb, (va3, vb) => vb);
}
__name(right, "right");
function abc(pa3, pb, pc, join) {
  return (data, i) => mapOuter(pa3(data, i), (ma3) => mapOuter(pb(data, ma3.position), (mb) => mapInner(pc(data, mb.position), (vc, j3) => join(ma3.value, mb.value, vc, data, i, j3))));
}
__name(abc, "abc");
function middle(pa3, pb, pc) {
  return abc(pa3, pb, pc, (ra3, rb) => rb);
}
__name(middle, "middle");
function all(...ps2) {
  return (data, i) => {
    const result = [];
    let position = i;
    for (const p of ps2) {
      const r1 = p(data, position);
      if (r1.matched) {
        result.push(r1.value);
        position = r1.position;
      } else {
        return { matched: false };
      }
    }
    return {
      matched: true,
      position,
      value: result
    };
  };
}
__name(all, "all");
function flatten(...ps2) {
  return flatten1(all(...ps2));
}
__name(flatten, "flatten");
function flatten1(p) {
  return map(p, (vs2) => vs2.flatMap((v3) => v3));
}
__name(flatten1, "flatten1");
function chainReduce(acc, f2) {
  return (data, i) => {
    let loop = true;
    let acc1 = acc;
    let pos = i;
    do {
      const r2 = f2(acc1, data, pos)(data, pos);
      if (r2.matched) {
        acc1 = r2.value;
        pos = r2.position;
      } else {
        loop = false;
      }
    } while (loop);
    return {
      matched: true,
      position: pos,
      value: acc1
    };
  };
}
__name(chainReduce, "chainReduce");
function reduceLeft(acc, p, reducer) {
  return chainReduce(acc, (acc2) => map(p, (v3, data, i, j3) => reducer(acc2, v3, data, i, j3)));
}
__name(reduceLeft, "reduceLeft");
function leftAssoc2(pLeft, pOper, pRight) {
  return chain(pLeft, (v0) => reduceLeft(v0, ab(pOper, pRight, (f2, y2) => [f2, y2]), (acc, [f2, y2]) => f2(acc, y2)));
}
__name(leftAssoc2, "leftAssoc2");
function chain(p, f2) {
  return (data, i) => mapOuter(p(data, i), (m1) => f2(m1.value, data, i, m1.position)(data, m1.position));
}
__name(chain, "chain");

// node_modules/parseley/lib/parseley.mjs
var ws = `(?:[ \\t\\r\\n\\f]*)`;
var nl = `(?:\\n|\\r\\n|\\r|\\f)`;
var nonascii = `[^\\x00-\\x7F]`;
var unicode = `(?:\\\\[0-9a-f]{1,6}(?:\\r\\n|[ \\n\\r\\t\\f])?)`;
var escape = `(?:\\\\[^\\n\\r\\f0-9a-f])`;
var nmstart = `(?:[_a-z]|${nonascii}|${unicode}|${escape})`;
var nmchar = `(?:[_a-z0-9-]|${nonascii}|${unicode}|${escape})`;
var name = `(?:${nmchar}+)`;
var ident = `(?:[-]?${nmstart}${nmchar}*)`;
var string1 = `'([^\\n\\r\\f\\\\']|\\\\${nl}|${nonascii}|${unicode}|${escape})*'`;
var string2 = `"([^\\n\\r\\f\\\\"]|\\\\${nl}|${nonascii}|${unicode}|${escape})*"`;
var lexSelector = o([
  { name: "ws", regex: new RegExp(ws) },
  { name: "hash", regex: new RegExp(`#${name}`, "i") },
  { name: "ident", regex: new RegExp(ident, "i") },
  { name: "str1", regex: new RegExp(string1, "i") },
  { name: "str2", regex: new RegExp(string2, "i") },
  { name: "*" },
  { name: "." },
  { name: "," },
  { name: "[" },
  { name: "]" },
  { name: "=" },
  { name: ">" },
  { name: "|" },
  { name: "+" },
  { name: "~" },
  { name: "^" },
  { name: "$" }
]);
var lexEscapedString = o([
  { name: "unicode", regex: new RegExp(unicode, "i") },
  { name: "escape", regex: new RegExp(escape, "i") },
  { name: "any", regex: new RegExp("[\\s\\S]", "i") }
]);
function sumSpec([a0, a1, a2], [b0, b1, b22]) {
  return [a0 + b0, a1 + b1, a2 + b22];
}
__name(sumSpec, "sumSpec");
function sumAllSpec(ss2) {
  return ss2.reduce(sumSpec, [0, 0, 0]);
}
__name(sumAllSpec, "sumAllSpec");
var unicodeEscapedSequence_ = token((t2) => t2.name === "unicode" ? String.fromCodePoint(parseInt(t2.text.slice(1), 16)) : void 0);
var escapedSequence_ = token((t2) => t2.name === "escape" ? t2.text.slice(1) : void 0);
var anyChar_ = token((t2) => t2.name === "any" ? t2.text : void 0);
var escapedString_ = map(many(choice(unicodeEscapedSequence_, escapedSequence_, anyChar_)), (cs2) => cs2.join(""));
function unescape(escapedString) {
  const lexerResult = lexEscapedString(escapedString);
  const result = escapedString_({ tokens: lexerResult.tokens, options: void 0 }, 0);
  return result.value;
}
__name(unescape, "unescape");
function literal(name2) {
  return token((t2) => t2.name === name2 ? true : void 0);
}
__name(literal, "literal");
var whitespace_ = token((t2) => t2.name === "ws" ? null : void 0);
var optionalWhitespace_ = option(whitespace_, null);
function optionallySpaced(parser) {
  return middle(optionalWhitespace_, parser, optionalWhitespace_);
}
__name(optionallySpaced, "optionallySpaced");
var identifier_ = token((t2) => t2.name === "ident" ? unescape(t2.text) : void 0);
var hashId_ = token((t2) => t2.name === "hash" ? unescape(t2.text.slice(1)) : void 0);
var string_ = token((t2) => t2.name.startsWith("str") ? unescape(t2.text.slice(1, -1)) : void 0);
var namespace_ = left(option(identifier_, ""), literal("|"));
var qualifiedName_ = otherwise(ab(namespace_, identifier_, (ns2, name2) => ({ name: name2, namespace: ns2 })), map(identifier_, (name2) => ({ name: name2, namespace: null })));
var uniSelector_ = otherwise(ab(namespace_, literal("*"), (ns2) => ({ type: "universal", namespace: ns2, specificity: [0, 0, 0] })), map(literal("*"), () => ({ type: "universal", namespace: null, specificity: [0, 0, 0] })));
var tagSelector_ = map(qualifiedName_, ({ name: name2, namespace }) => ({
  type: "tag",
  name: name2,
  namespace,
  specificity: [0, 0, 1]
}));
var classSelector_ = ab(literal("."), identifier_, (fullstop, name2) => ({
  type: "class",
  name: name2,
  specificity: [0, 1, 0]
}));
var idSelector_ = map(hashId_, (name2) => ({
  type: "id",
  name: name2,
  specificity: [1, 0, 0]
}));
var attrModifier_ = token((t2) => {
  if (t2.name === "ident") {
    if (t2.text === "i" || t2.text === "I") {
      return "i";
    }
    if (t2.text === "s" || t2.text === "S") {
      return "s";
    }
  }
  return void 0;
});
var attrValue_ = otherwise(ab(string_, option(right(optionalWhitespace_, attrModifier_), null), (v3, mod) => ({ value: v3, modifier: mod })), ab(identifier_, option(right(whitespace_, attrModifier_), null), (v3, mod) => ({ value: v3, modifier: mod })));
var attrMatcher_ = choice(map(literal("="), () => "="), ab(literal("~"), literal("="), () => "~="), ab(literal("|"), literal("="), () => "|="), ab(literal("^"), literal("="), () => "^="), ab(literal("$"), literal("="), () => "$="), ab(literal("*"), literal("="), () => "*="));
var attrPresenceSelector_ = abc(literal("["), optionallySpaced(qualifiedName_), literal("]"), (lbr, { name: name2, namespace }) => ({
  type: "attrPresence",
  name: name2,
  namespace,
  specificity: [0, 1, 0]
}));
var attrValueSelector_ = middle(literal("["), abc(optionallySpaced(qualifiedName_), attrMatcher_, optionallySpaced(attrValue_), ({ name: name2, namespace }, matcher, { value, modifier }) => ({
  type: "attrValue",
  name: name2,
  namespace,
  matcher,
  value,
  modifier,
  specificity: [0, 1, 0]
})), literal("]"));
var attrSelector_ = otherwise(attrPresenceSelector_, attrValueSelector_);
var typeSelector_ = otherwise(uniSelector_, tagSelector_);
var subclassSelector_ = choice(idSelector_, classSelector_, attrSelector_);
var compoundSelector_ = map(otherwise(flatten(typeSelector_, many(subclassSelector_)), many1(subclassSelector_)), (ss2) => {
  return {
    type: "compound",
    list: ss2,
    specificity: sumAllSpec(ss2.map((s2) => s2.specificity))
  };
});
var combinator_ = choice(map(literal(">"), () => ">"), map(literal("+"), () => "+"), map(literal("~"), () => "~"), ab(literal("|"), literal("|"), () => "||"));
var combinatorSeparator_ = otherwise(optionallySpaced(combinator_), map(whitespace_, () => " "));
var complexSelector_ = leftAssoc2(compoundSelector_, map(combinatorSeparator_, (c2) => (left2, right2) => ({
  type: "compound",
  list: [...right2.list, { type: "combinator", combinator: c2, left: left2, specificity: left2.specificity }],
  specificity: sumSpec(left2.specificity, right2.specificity)
})), compoundSelector_);
var listSelector_ = leftAssoc2(map(complexSelector_, (s2) => ({ type: "list", list: [s2] })), map(optionallySpaced(literal(",")), () => (acc, next) => ({ type: "list", list: [...acc.list, next] })), complexSelector_);
function parse_(parser, str) {
  if (!(typeof str === "string" || str instanceof String)) {
    throw new Error("Expected a selector string. Actual input is not a string!");
  }
  const lexerResult = lexSelector(str);
  if (!lexerResult.complete) {
    throw new Error(`The input "${str}" was only partially tokenized, stopped at offset ${lexerResult.offset}!
` + prettyPrintPosition(str, lexerResult.offset));
  }
  const result = optionallySpaced(parser)({ tokens: lexerResult.tokens, options: void 0 }, 0);
  if (!result.matched) {
    throw new Error(`No match for "${str}" input!`);
  }
  if (result.position < lexerResult.tokens.length) {
    const token2 = lexerResult.tokens[result.position];
    throw new Error(`The input "${str}" was only partially parsed, stopped at offset ${token2.offset}!
` + prettyPrintPosition(str, token2.offset, token2.len));
  }
  return result.value;
}
__name(parse_, "parse_");
function prettyPrintPosition(str, offset, len = 1) {
  return `${str.replace(/(\t)|(\r)|(\n)/g, (m, t2, r2) => t2 ? "␉" : r2 ? "␍" : "␊")}
${"".padEnd(offset)}${"^".repeat(len)}`;
}
__name(prettyPrintPosition, "prettyPrintPosition");
function parse1(str) {
  return parse_(complexSelector_, str);
}
__name(parse1, "parse1");
function serialize(selector) {
  if (!selector.type) {
    throw new Error("This is not an AST node.");
  }
  switch (selector.type) {
    case "universal":
      return _serNs(selector.namespace) + "*";
    case "tag":
      return _serNs(selector.namespace) + _serIdent(selector.name);
    case "class":
      return "." + _serIdent(selector.name);
    case "id":
      return "#" + _serIdent(selector.name);
    case "attrPresence":
      return `[${_serNs(selector.namespace)}${_serIdent(selector.name)}]`;
    case "attrValue":
      return `[${_serNs(selector.namespace)}${_serIdent(selector.name)}${selector.matcher}"${_serStr(selector.value)}"${selector.modifier ? selector.modifier : ""}]`;
    case "combinator":
      return serialize(selector.left) + selector.combinator;
    case "compound":
      return selector.list.reduce((acc, node) => {
        if (node.type === "combinator") {
          return serialize(node) + acc;
        } else {
          return acc + serialize(node);
        }
      }, "");
    case "list":
      return selector.list.map(serialize).join(",");
  }
}
__name(serialize, "serialize");
function _serNs(ns2) {
  return ns2 || ns2 === "" ? _serIdent(ns2) + "|" : "";
}
__name(_serNs, "_serNs");
function _codePoint(char) {
  return `\\${char.codePointAt(0).toString(16)} `;
}
__name(_codePoint, "_codePoint");
function _serIdent(str) {
  return str.replace(
    /(^[0-9])|(^-[0-9])|(^-$)|([-0-9a-zA-Z_]|[^\x00-\x7F])|(\x00)|([\x01-\x1f]|\x7f)|([\s\S])/g,
    (m, d1, d2, hy, safe, nl2, ctrl, other) => d1 ? _codePoint(d1) : d2 ? "-" + _codePoint(d2.slice(1)) : hy ? "\\-" : safe ? safe : nl2 ? "�" : ctrl ? _codePoint(ctrl) : "\\" + other
  );
}
__name(_serIdent, "_serIdent");
function _serStr(str) {
  return str.replace(
    /(")|(\\)|(\x00)|([\x01-\x1f]|\x7f)/g,
    (m, dq, bs2, nl2, ctrl) => dq ? '\\"' : bs2 ? "\\\\" : nl2 ? "�" : _codePoint(ctrl)
  );
}
__name(_serStr, "_serStr");
function normalize(selector) {
  if (!selector.type) {
    throw new Error("This is not an AST node.");
  }
  switch (selector.type) {
    case "compound": {
      selector.list.forEach(normalize);
      selector.list.sort((a, b3) => _compareArrays(_getSelectorPriority(a), _getSelectorPriority(b3)));
      break;
    }
    case "combinator": {
      normalize(selector.left);
      break;
    }
    case "list": {
      selector.list.forEach(normalize);
      selector.list.sort((a, b3) => serialize(a) < serialize(b3) ? -1 : 1);
      break;
    }
  }
  return selector;
}
__name(normalize, "normalize");
function _getSelectorPriority(selector) {
  switch (selector.type) {
    case "universal":
      return [1];
    case "tag":
      return [1];
    case "id":
      return [2];
    case "class":
      return [3, selector.name];
    case "attrPresence":
      return [4, serialize(selector)];
    case "attrValue":
      return [5, serialize(selector)];
    case "combinator":
      return [15, serialize(selector)];
  }
}
__name(_getSelectorPriority, "_getSelectorPriority");
function compareSpecificity(a, b3) {
  return _compareArrays(a, b3);
}
__name(compareSpecificity, "compareSpecificity");
function _compareArrays(a, b3) {
  if (!Array.isArray(a) || !Array.isArray(b3)) {
    throw new Error("Arguments must be arrays.");
  }
  const shorter = a.length < b3.length ? a.length : b3.length;
  for (let i = 0; i < shorter; i++) {
    if (a[i] === b3[i]) {
      continue;
    }
    return a[i] < b3[i] ? -1 : 1;
  }
  return a.length - b3.length;
}
__name(_compareArrays, "_compareArrays");

// node_modules/selderee/lib/selderee.mjs
var DecisionTree = class {
  static {
    __name(this, "DecisionTree");
  }
  constructor(input) {
    this.branches = weave(toAstTerminalPairs(input));
  }
  build(builder) {
    return builder(this.branches);
  }
};
function toAstTerminalPairs(array) {
  const len = array.length;
  const results = new Array(len);
  for (let i = 0; i < len; i++) {
    const [selectorString, val] = array[i];
    const ast = preprocess(parse1(selectorString));
    results[i] = {
      ast,
      terminal: {
        type: "terminal",
        valueContainer: { index: i, value: val, specificity: ast.specificity }
      }
    };
  }
  return results;
}
__name(toAstTerminalPairs, "toAstTerminalPairs");
function preprocess(ast) {
  reduceSelectorVariants(ast);
  normalize(ast);
  return ast;
}
__name(preprocess, "preprocess");
function reduceSelectorVariants(ast) {
  const newList = [];
  ast.list.forEach((sel) => {
    switch (sel.type) {
      case "class":
        newList.push({
          matcher: "~=",
          modifier: null,
          name: "class",
          namespace: null,
          specificity: sel.specificity,
          type: "attrValue",
          value: sel.name
        });
        break;
      case "id":
        newList.push({
          matcher: "=",
          modifier: null,
          name: "id",
          namespace: null,
          specificity: sel.specificity,
          type: "attrValue",
          value: sel.name
        });
        break;
      case "combinator":
        reduceSelectorVariants(sel.left);
        newList.push(sel);
        break;
      case "universal":
        break;
      default:
        newList.push(sel);
        break;
    }
  });
  ast.list = newList;
}
__name(reduceSelectorVariants, "reduceSelectorVariants");
function weave(items) {
  const branches = [];
  while (items.length) {
    const topKind = findTopKey(items, (sel) => true, getSelectorKind);
    const { matches, nonmatches, empty } = breakByKind(items, topKind);
    items = nonmatches;
    if (matches.length) {
      branches.push(branchOfKind(topKind, matches));
    }
    if (empty.length) {
      branches.push(...terminate(empty));
    }
  }
  return branches;
}
__name(weave, "weave");
function terminate(items) {
  const results = [];
  for (const item of items) {
    const terminal = item.terminal;
    if (terminal.type === "terminal") {
      results.push(terminal);
    } else {
      const { matches, rest } = partition(terminal.cont, (node) => node.type === "terminal");
      matches.forEach((node) => results.push(node));
      if (rest.length) {
        terminal.cont = rest;
        results.push(terminal);
      }
    }
  }
  return results;
}
__name(terminate, "terminate");
function breakByKind(items, selectedKind) {
  const matches = [];
  const nonmatches = [];
  const empty = [];
  for (const item of items) {
    const simpsels = item.ast.list;
    if (simpsels.length) {
      const isMatch = simpsels.some((node) => getSelectorKind(node) === selectedKind);
      (isMatch ? matches : nonmatches).push(item);
    } else {
      empty.push(item);
    }
  }
  return { matches, nonmatches, empty };
}
__name(breakByKind, "breakByKind");
function getSelectorKind(sel) {
  switch (sel.type) {
    case "attrPresence":
      return `attrPresence ${sel.name}`;
    case "attrValue":
      return `attrValue ${sel.name}`;
    case "combinator":
      return `combinator ${sel.combinator}`;
    default:
      return sel.type;
  }
}
__name(getSelectorKind, "getSelectorKind");
function branchOfKind(kind, items) {
  if (kind === "tag") {
    return tagNameBranch(items);
  }
  if (kind.startsWith("attrValue ")) {
    return attrValueBranch(kind.substring(10), items);
  }
  if (kind.startsWith("attrPresence ")) {
    return attrPresenceBranch(kind.substring(13), items);
  }
  if (kind === "combinator >") {
    return combinatorBranch(">", items);
  }
  if (kind === "combinator +") {
    return combinatorBranch("+", items);
  }
  throw new Error(`Unsupported selector kind: ${kind}`);
}
__name(branchOfKind, "branchOfKind");
function tagNameBranch(items) {
  const groups = spliceAndGroup(items, (x3) => x3.type === "tag", (x3) => x3.name);
  const variants = Object.entries(groups).map(([name2, group]) => ({
    type: "variant",
    value: name2,
    cont: weave(group.items)
  }));
  return {
    type: "tagName",
    variants
  };
}
__name(tagNameBranch, "tagNameBranch");
function attrPresenceBranch(name2, items) {
  for (const item of items) {
    spliceSimpleSelector(item, (x3) => x3.type === "attrPresence" && x3.name === name2);
  }
  return {
    type: "attrPresence",
    name: name2,
    cont: weave(items)
  };
}
__name(attrPresenceBranch, "attrPresenceBranch");
function attrValueBranch(name2, items) {
  const groups = spliceAndGroup(items, (x3) => x3.type === "attrValue" && x3.name === name2, (x3) => `${x3.matcher} ${x3.modifier || ""} ${x3.value}`);
  const matchers = [];
  for (const group of Object.values(groups)) {
    const sel = group.oneSimpleSelector;
    const predicate = getAttrPredicate(sel);
    const continuation = weave(group.items);
    matchers.push({
      type: "matcher",
      matcher: sel.matcher,
      modifier: sel.modifier,
      value: sel.value,
      predicate,
      cont: continuation
    });
  }
  return {
    type: "attrValue",
    name: name2,
    matchers
  };
}
__name(attrValueBranch, "attrValueBranch");
function getAttrPredicate(sel) {
  if (sel.modifier === "i") {
    const expected = sel.value.toLowerCase();
    switch (sel.matcher) {
      case "=":
        return (actual) => expected === actual.toLowerCase();
      case "~=":
        return (actual) => actual.toLowerCase().split(/[ \t]+/).includes(expected);
      case "^=":
        return (actual) => actual.toLowerCase().startsWith(expected);
      case "$=":
        return (actual) => actual.toLowerCase().endsWith(expected);
      case "*=":
        return (actual) => actual.toLowerCase().includes(expected);
      case "|=":
        return (actual) => {
          const lower = actual.toLowerCase();
          return expected === lower || lower.startsWith(expected) && lower[expected.length] === "-";
        };
    }
  } else {
    const expected = sel.value;
    switch (sel.matcher) {
      case "=":
        return (actual) => expected === actual;
      case "~=":
        return (actual) => actual.split(/[ \t]+/).includes(expected);
      case "^=":
        return (actual) => actual.startsWith(expected);
      case "$=":
        return (actual) => actual.endsWith(expected);
      case "*=":
        return (actual) => actual.includes(expected);
      case "|=":
        return (actual) => expected === actual || actual.startsWith(expected) && actual[expected.length] === "-";
    }
  }
}
__name(getAttrPredicate, "getAttrPredicate");
function combinatorBranch(combinator, items) {
  const groups = spliceAndGroup(items, (x3) => x3.type === "combinator" && x3.combinator === combinator, (x3) => serialize(x3.left));
  const leftItems = [];
  for (const group of Object.values(groups)) {
    const rightCont = weave(group.items);
    const leftAst = group.oneSimpleSelector.left;
    leftItems.push({
      ast: leftAst,
      terminal: { type: "popElement", cont: rightCont }
    });
  }
  return {
    type: "pushElement",
    combinator,
    cont: weave(leftItems)
  };
}
__name(combinatorBranch, "combinatorBranch");
function spliceAndGroup(items, predicate, keyCallback) {
  const groups = {};
  while (items.length) {
    const bestKey = findTopKey(items, predicate, keyCallback);
    const bestKeyPredicate = /* @__PURE__ */ __name((sel) => predicate(sel) && keyCallback(sel) === bestKey, "bestKeyPredicate");
    const hasBestKeyPredicate = /* @__PURE__ */ __name((item) => item.ast.list.some(bestKeyPredicate), "hasBestKeyPredicate");
    const { matches, rest } = partition1(items, hasBestKeyPredicate);
    let oneSimpleSelector = null;
    for (const item of matches) {
      const splicedNode = spliceSimpleSelector(item, bestKeyPredicate);
      if (!oneSimpleSelector) {
        oneSimpleSelector = splicedNode;
      }
    }
    if (oneSimpleSelector == null) {
      throw new Error("No simple selector is found.");
    }
    groups[bestKey] = { oneSimpleSelector, items: matches };
    items = rest;
  }
  return groups;
}
__name(spliceAndGroup, "spliceAndGroup");
function spliceSimpleSelector(item, predicate) {
  const simpsels = item.ast.list;
  const matches = new Array(simpsels.length);
  let firstIndex = -1;
  for (let i = simpsels.length; i-- > 0; ) {
    if (predicate(simpsels[i])) {
      matches[i] = true;
      firstIndex = i;
    }
  }
  if (firstIndex == -1) {
    throw new Error(`Couldn't find the required simple selector.`);
  }
  const result = simpsels[firstIndex];
  item.ast.list = simpsels.filter((sel, i) => !matches[i]);
  return result;
}
__name(spliceSimpleSelector, "spliceSimpleSelector");
function findTopKey(items, predicate, keyCallback) {
  const candidates = {};
  for (const item of items) {
    const candidates1 = {};
    for (const node of item.ast.list.filter(predicate)) {
      candidates1[keyCallback(node)] = true;
    }
    for (const key of Object.keys(candidates1)) {
      if (candidates[key]) {
        candidates[key]++;
      } else {
        candidates[key] = 1;
      }
    }
  }
  let topKind = "";
  let topCounter = 0;
  for (const entry of Object.entries(candidates)) {
    if (entry[1] > topCounter) {
      topKind = entry[0];
      topCounter = entry[1];
    }
  }
  return topKind;
}
__name(findTopKey, "findTopKey");
function partition(src, predicate) {
  const matches = [];
  const rest = [];
  for (const x3 of src) {
    if (predicate(x3)) {
      matches.push(x3);
    } else {
      rest.push(x3);
    }
  }
  return { matches, rest };
}
__name(partition, "partition");
function partition1(src, predicate) {
  const matches = [];
  const rest = [];
  for (const x3 of src) {
    if (predicate(x3)) {
      matches.push(x3);
    } else {
      rest.push(x3);
    }
  }
  return { matches, rest };
}
__name(partition1, "partition1");
var Picker = class {
  static {
    __name(this, "Picker");
  }
  constructor(f2) {
    this.f = f2;
  }
  pickAll(el) {
    return this.f(el);
  }
  pick1(el, preferFirst = false) {
    const results = this.f(el);
    const len = results.length;
    if (len === 0) {
      return null;
    }
    if (len === 1) {
      return results[0].value;
    }
    const comparator = preferFirst ? comparatorPreferFirst : comparatorPreferLast;
    let result = results[0];
    for (let i = 1; i < len; i++) {
      const next = results[i];
      if (comparator(result, next)) {
        result = next;
      }
    }
    return result.value;
  }
};
function comparatorPreferFirst(acc, next) {
  const diff = compareSpecificity(next.specificity, acc.specificity);
  return diff > 0 || diff === 0 && next.index < acc.index;
}
__name(comparatorPreferFirst, "comparatorPreferFirst");
function comparatorPreferLast(acc, next) {
  const diff = compareSpecificity(next.specificity, acc.specificity);
  return diff > 0 || diff === 0 && next.index > acc.index;
}
__name(comparatorPreferLast, "comparatorPreferLast");

// node_modules/@selderee/plugin-htmlparser2/lib/hp2-builder.mjs
function hp2Builder(nodes) {
  return new Picker(handleArray(nodes));
}
__name(hp2Builder, "hp2Builder");
function handleArray(nodes) {
  const matchers = nodes.map(handleNode);
  return (el, ...tail) => matchers.flatMap((m) => m(el, ...tail));
}
__name(handleArray, "handleArray");
function handleNode(node) {
  switch (node.type) {
    case "terminal": {
      const result = [node.valueContainer];
      return (el, ...tail) => result;
    }
    case "tagName":
      return handleTagName(node);
    case "attrValue":
      return handleAttrValueName(node);
    case "attrPresence":
      return handleAttrPresenceName(node);
    case "pushElement":
      return handlePushElementNode(node);
    case "popElement":
      return handlePopElementNode(node);
  }
}
__name(handleNode, "handleNode");
function handleTagName(node) {
  const variants = {};
  for (const variant of node.variants) {
    variants[variant.value] = handleArray(variant.cont);
  }
  return (el, ...tail) => {
    const continuation = variants[el.name];
    return continuation ? continuation(el, ...tail) : [];
  };
}
__name(handleTagName, "handleTagName");
function handleAttrPresenceName(node) {
  const attrName = node.name;
  const continuation = handleArray(node.cont);
  return (el, ...tail) => Object.prototype.hasOwnProperty.call(el.attribs, attrName) ? continuation(el, ...tail) : [];
}
__name(handleAttrPresenceName, "handleAttrPresenceName");
function handleAttrValueName(node) {
  const callbacks = [];
  for (const matcher of node.matchers) {
    const predicate = matcher.predicate;
    const continuation = handleArray(matcher.cont);
    callbacks.push((attr, el, ...tail) => predicate(attr) ? continuation(el, ...tail) : []);
  }
  const attrName = node.name;
  return (el, ...tail) => {
    const attr = el.attribs[attrName];
    return attr || attr === "" ? callbacks.flatMap((cb) => cb(attr, el, ...tail)) : [];
  };
}
__name(handleAttrValueName, "handleAttrValueName");
function handlePushElementNode(node) {
  const continuation = handleArray(node.cont);
  const leftElementGetter = node.combinator === "+" ? getPrecedingElement : getParentElement;
  return (el, ...tail) => {
    const next = leftElementGetter(el);
    if (next === null) {
      return [];
    }
    return continuation(next, el, ...tail);
  };
}
__name(handlePushElementNode, "handlePushElementNode");
var getPrecedingElement = /* @__PURE__ */ __name((el) => {
  const prev = el.prev;
  if (prev === null) {
    return null;
  }
  return isTag2(prev) ? prev : getPrecedingElement(prev);
}, "getPrecedingElement");
var getParentElement = /* @__PURE__ */ __name((el) => {
  const parent = el.parent;
  return parent && isTag2(parent) ? parent : null;
}, "getParentElement");
function handlePopElementNode(node) {
  const continuation = handleArray(node.cont);
  return (el, next, ...tail) => continuation(next, ...tail);
}
__name(handlePopElementNode, "handlePopElementNode");

// node_modules/htmlparser2/lib/esm/index.js
init_esm();

// node_modules/htmlparser2/lib/esm/Parser.js
init_esm();

// node_modules/htmlparser2/lib/esm/Tokenizer.js
init_esm();

// node_modules/entities/lib/esm/decode.js
init_esm();

// node_modules/entities/lib/esm/generated/decode-data-html.js
init_esm();
var decode_data_html_default = new Uint16Array(
  // prettier-ignore
  'ᵁ<Õıʊҝջאٵ۞ޢߖࠏ੊ઑඡ๭༉༦჊ረዡᐕᒝᓃᓟᔥ\0\0\0\0\0\0ᕫᛍᦍᰒᷝ὾⁠↰⊍⏀⏻⑂⠤⤒ⴈ⹈⿎〖㊺㘹㞬㣾㨨㩱㫠㬮ࠀEMabcfglmnoprstu\\bfms¦³¹ÈÏlig耻Æ䃆P耻&䀦cute耻Á䃁reve;䄂Āiyx}rc耻Â䃂;䐐r;쀀𝔄rave耻À䃀pha;䎑acr;䄀d;橓Āgp¡on;䄄f;쀀𝔸plyFunction;恡ing耻Å䃅Ācs¾Ãr;쀀𝒜ign;扔ilde耻Ã䃃ml耻Ä䃄ЀaceforsuåûþėĜĢħĪĀcrêòkslash;或Ŷöø;櫧ed;挆y;䐑ƀcrtąċĔause;戵noullis;愬a;䎒r;쀀𝔅pf;쀀𝔹eve;䋘còēmpeq;扎܀HOacdefhilorsuōőŖƀƞƢƵƷƺǜȕɳɸɾcy;䐧PY耻©䂩ƀcpyŝŢźute;䄆Ā;iŧŨ拒talDifferentialD;慅leys;愭ȀaeioƉƎƔƘron;䄌dil耻Ç䃇rc;䄈nint;戰ot;䄊ĀdnƧƭilla;䂸terDot;䂷òſi;䎧rcleȀDMPTǇǋǑǖot;抙inus;抖lus;投imes;抗oĀcsǢǸkwiseContourIntegral;戲eCurlyĀDQȃȏoubleQuote;思uote;怙ȀlnpuȞȨɇɕonĀ;eȥȦ户;橴ƀgitȯȶȺruent;扡nt;戯ourIntegral;戮ĀfrɌɎ;愂oduct;成nterClockwiseContourIntegral;戳oss;樯cr;쀀𝒞pĀ;Cʄʅ拓ap;才րDJSZacefiosʠʬʰʴʸˋ˗ˡ˦̳ҍĀ;oŹʥtrahd;椑cy;䐂cy;䐅cy;䐏ƀgrsʿ˄ˇger;怡r;憡hv;櫤Āayː˕ron;䄎;䐔lĀ;t˝˞戇a;䎔r;쀀𝔇Āaf˫̧Ācm˰̢riticalȀADGT̖̜̀̆cute;䂴oŴ̋̍;䋙bleAcute;䋝rave;䁠ilde;䋜ond;拄ferentialD;慆Ѱ̽\0\0\0͔͂\0Ѕf;쀀𝔻ƀ;DE͈͉͍䂨ot;惜qual;扐blèCDLRUVͣͲ΂ϏϢϸontourIntegraìȹoɴ͹\0\0ͻ»͉nArrow;懓Āeo·ΤftƀARTΐΖΡrrow;懐ightArrow;懔eåˊngĀLRΫτeftĀARγιrrow;柸ightArrow;柺ightArrow;柹ightĀATϘϞrrow;懒ee;抨pɁϩ\0\0ϯrrow;懑ownArrow;懕erticalBar;戥ǹABLRTaВЪаўѿͼrrowƀ;BUНОТ憓ar;椓pArrow;懵reve;䌑eft˒к\0ц\0ѐightVector;楐eeVector;楞ectorĀ;Bљњ憽ar;楖ightǔѧ\0ѱeeVector;楟ectorĀ;BѺѻ懁ar;楗eeĀ;A҆҇护rrow;憧ĀctҒҗr;쀀𝒟rok;䄐ࠀNTacdfglmopqstuxҽӀӄӋӞӢӧӮӵԡԯԶՒ՝ՠեG;䅊H耻Ð䃐cute耻É䃉ƀaiyӒӗӜron;䄚rc耻Ê䃊;䐭ot;䄖r;쀀𝔈rave耻È䃈ement;戈ĀapӺӾcr;䄒tyɓԆ\0\0ԒmallSquare;旻erySmallSquare;斫ĀgpԦԪon;䄘f;쀀𝔼silon;䎕uĀaiԼՉlĀ;TՂՃ橵ilde;扂librium;懌Āci՗՚r;愰m;橳a;䎗ml耻Ë䃋Āipժկsts;戃onentialE;慇ʀcfiosօֈ֍ֲ׌y;䐤r;쀀𝔉lledɓ֗\0\0֣mallSquare;旼erySmallSquare;斪Ͱֺ\0ֿ\0\0ׄf;쀀𝔽All;戀riertrf;愱cò׋؀JTabcdfgorstר׬ׯ׺؀ؒؖ؛؝أ٬ٲcy;䐃耻>䀾mmaĀ;d׷׸䎓;䏜reve;䄞ƀeiy؇،ؐdil;䄢rc;䄜;䐓ot;䄠r;쀀𝔊;拙pf;쀀𝔾eater̀EFGLSTصلَٖٛ٦qualĀ;Lؾؿ扥ess;招ullEqual;执reater;檢ess;扷lantEqual;橾ilde;扳cr;쀀𝒢;扫ЀAacfiosuڅڋږڛڞڪھۊRDcy;䐪Āctڐڔek;䋇;䁞irc;䄤r;愌lbertSpace;愋ǰگ\0ڲf;愍izontalLine;攀Āctۃۅòکrok;䄦mpńېۘownHumðįqual;扏܀EJOacdfgmnostuۺ۾܃܇܎ܚܞܡܨ݄ݸދޏޕcy;䐕lig;䄲cy;䐁cute耻Í䃍Āiyܓܘrc耻Î䃎;䐘ot;䄰r;愑rave耻Ì䃌ƀ;apܠܯܿĀcgܴܷr;䄪inaryI;慈lieóϝǴ݉\0ݢĀ;eݍݎ戬Āgrݓݘral;戫section;拂isibleĀCTݬݲomma;恣imes;恢ƀgptݿރވon;䄮f;쀀𝕀a;䎙cr;愐ilde;䄨ǫޚ\0ޞcy;䐆l耻Ï䃏ʀcfosuެ޷޼߂ߐĀiyޱ޵rc;䄴;䐙r;쀀𝔍pf;쀀𝕁ǣ߇\0ߌr;쀀𝒥rcy;䐈kcy;䐄΀HJacfosߤߨ߽߬߱ࠂࠈcy;䐥cy;䐌ppa;䎚Āey߶߻dil;䄶;䐚r;쀀𝔎pf;쀀𝕂cr;쀀𝒦րJTaceflmostࠥࠩࠬࡐࡣ঳সে্਷ੇcy;䐉耻<䀼ʀcmnpr࠷࠼ࡁࡄࡍute;䄹bda;䎛g;柪lacetrf;愒r;憞ƀaeyࡗ࡜ࡡron;䄽dil;䄻;䐛Āfsࡨ॰tԀACDFRTUVarࡾࢩࢱࣦ࣠ࣼयज़ΐ४Ānrࢃ࢏gleBracket;柨rowƀ;BR࢙࢚࢞憐ar;懤ightArrow;懆eiling;挈oǵࢷ\0ࣃbleBracket;柦nǔࣈ\0࣒eeVector;楡ectorĀ;Bࣛࣜ懃ar;楙loor;挊ightĀAV࣯ࣵrrow;憔ector;楎Āerँगeƀ;AVउऊऐ抣rrow;憤ector;楚iangleƀ;BEतथऩ抲ar;槏qual;抴pƀDTVषूौownVector;楑eeVector;楠ectorĀ;Bॖॗ憿ar;楘ectorĀ;B॥०憼ar;楒ightáΜs̀EFGLSTॾঋকঝঢভqualGreater;拚ullEqual;扦reater;扶ess;檡lantEqual;橽ilde;扲r;쀀𝔏Ā;eঽা拘ftarrow;懚idot;䄿ƀnpw৔ਖਛgȀLRlr৞৷ਂਐeftĀAR০৬rrow;柵ightArrow;柷ightArrow;柶eftĀarγਊightáοightáϊf;쀀𝕃erĀLRਢਬeftArrow;憙ightArrow;憘ƀchtਾੀੂòࡌ;憰rok;䅁;扪Ѐacefiosuਗ਼੝੠੷੼અઋ઎p;椅y;䐜Ādl੥੯iumSpace;恟lintrf;愳r;쀀𝔐nusPlus;戓pf;쀀𝕄cò੶;䎜ҀJacefostuણધભીଔଙඑ඗ඞcy;䐊cute;䅃ƀaey઴હાron;䅇dil;䅅;䐝ƀgswે૰଎ativeƀMTV૓૟૨ediumSpace;怋hiĀcn૦૘ë૙eryThiî૙tedĀGL૸ଆreaterGreateòٳessLesóੈLine;䀊r;쀀𝔑ȀBnptଢନଷ଺reak;恠BreakingSpace;䂠f;愕ڀ;CDEGHLNPRSTV୕ୖ୪୼஡௫ఄ౞಄ದ೘ൡඅ櫬Āou୛୤ngruent;扢pCap;扭oubleVerticalBar;戦ƀlqxஃஊ஛ement;戉ualĀ;Tஒஓ扠ilde;쀀≂̸ists;戄reater΀;EFGLSTஶஷ஽௉௓௘௥扯qual;扱ullEqual;쀀≧̸reater;쀀≫̸ess;批lantEqual;쀀⩾̸ilde;扵umpń௲௽ownHump;쀀≎̸qual;쀀≏̸eĀfsఊధtTriangleƀ;BEచఛడ拪ar;쀀⧏̸qual;括s̀;EGLSTవశ఼ౄోౘ扮qual;扰reater;扸ess;쀀≪̸lantEqual;쀀⩽̸ilde;扴estedĀGL౨౹reaterGreater;쀀⪢̸essLess;쀀⪡̸recedesƀ;ESಒಓಛ技qual;쀀⪯̸lantEqual;拠ĀeiಫಹverseElement;戌ghtTriangleƀ;BEೋೌ೒拫ar;쀀⧐̸qual;拭ĀquೝഌuareSuĀbp೨೹setĀ;E೰ೳ쀀⊏̸qual;拢ersetĀ;Eഃആ쀀⊐̸qual;拣ƀbcpഓതൎsetĀ;Eഛഞ쀀⊂⃒qual;抈ceedsȀ;ESTലള഻െ抁qual;쀀⪰̸lantEqual;拡ilde;쀀≿̸ersetĀ;E൘൛쀀⊃⃒qual;抉ildeȀ;EFT൮൯൵ൿ扁qual;扄ullEqual;扇ilde;扉erticalBar;戤cr;쀀𝒩ilde耻Ñ䃑;䎝܀Eacdfgmoprstuvලෂ෉෕ෛ෠෧෼ขภยา฿ไlig;䅒cute耻Ó䃓Āiy෎ීrc耻Ô䃔;䐞blac;䅐r;쀀𝔒rave耻Ò䃒ƀaei෮ෲ෶cr;䅌ga;䎩cron;䎟pf;쀀𝕆enCurlyĀDQฎบoubleQuote;怜uote;怘;橔Āclวฬr;쀀𝒪ash耻Ø䃘iŬื฼de耻Õ䃕es;樷ml耻Ö䃖erĀBP๋๠Āar๐๓r;怾acĀek๚๜;揞et;掴arenthesis;揜Ҁacfhilors๿ງຊຏຒດຝະ໼rtialD;戂y;䐟r;쀀𝔓i;䎦;䎠usMinus;䂱Āipຢອncareplanåڝf;愙Ȁ;eio຺ູ໠໤檻cedesȀ;EST່້໏໚扺qual;檯lantEqual;扼ilde;找me;怳Ādp໩໮uct;戏ortionĀ;aȥ໹l;戝Āci༁༆r;쀀𝒫;䎨ȀUfos༑༖༛༟OT耻"䀢r;쀀𝔔pf;愚cr;쀀𝒬؀BEacefhiorsu༾གྷཇའཱིྦྷྪྭ႖ႩႴႾarr;椐G耻®䂮ƀcnrཎནབute;䅔g;柫rĀ;tཛྷཝ憠l;椖ƀaeyཧཬཱron;䅘dil;䅖;䐠Ā;vླྀཹ愜erseĀEUྂྙĀlq྇ྎement;戋uilibrium;懋pEquilibrium;楯r»ཹo;䎡ghtЀACDFTUVa࿁࿫࿳ဢဨၛႇϘĀnr࿆࿒gleBracket;柩rowƀ;BL࿜࿝࿡憒ar;懥eftArrow;懄eiling;按oǵ࿹\0စbleBracket;柧nǔည\0နeeVector;楝ectorĀ;Bဝသ懂ar;楕loor;挋Āerိ၃eƀ;AVဵံြ抢rrow;憦ector;楛iangleƀ;BEၐၑၕ抳ar;槐qual;抵pƀDTVၣၮၸownVector;楏eeVector;楜ectorĀ;Bႂႃ憾ar;楔ectorĀ;B႑႒懀ar;楓Āpuႛ႞f;愝ndImplies;楰ightarrow;懛ĀchႹႼr;愛;憱leDelayed;槴ڀHOacfhimoqstuფჱჷჽᄙᄞᅑᅖᅡᅧᆵᆻᆿĀCcჩხHcy;䐩y;䐨FTcy;䐬cute;䅚ʀ;aeiyᄈᄉᄎᄓᄗ檼ron;䅠dil;䅞rc;䅜;䐡r;쀀𝔖ortȀDLRUᄪᄴᄾᅉownArrow»ОeftArrow»࢚ightArrow»࿝pArrow;憑gma;䎣allCircle;战pf;쀀𝕊ɲᅭ\0\0ᅰt;戚areȀ;ISUᅻᅼᆉᆯ斡ntersection;抓uĀbpᆏᆞsetĀ;Eᆗᆘ抏qual;抑ersetĀ;Eᆨᆩ抐qual;抒nion;抔cr;쀀𝒮ar;拆ȀbcmpᇈᇛሉላĀ;sᇍᇎ拐etĀ;Eᇍᇕqual;抆ĀchᇠህeedsȀ;ESTᇭᇮᇴᇿ扻qual;檰lantEqual;扽ilde;承Tháྌ;我ƀ;esሒሓሣ拑rsetĀ;Eሜም抃qual;抇et»ሓրHRSacfhiorsሾቄ቉ቕ቞ቱቶኟዂወዑORN耻Þ䃞ADE;愢ĀHc቎ቒcy;䐋y;䐦Ābuቚቜ;䀉;䎤ƀaeyብቪቯron;䅤dil;䅢;䐢r;쀀𝔗Āeiቻ኉ǲኀ\0ኇefore;戴a;䎘Ācn኎ኘkSpace;쀀  Space;怉ldeȀ;EFTካኬኲኼ戼qual;扃ullEqual;扅ilde;扈pf;쀀𝕋ipleDot;惛Āctዖዛr;쀀𝒯rok;䅦ૡዷጎጚጦ\0ጬጱ\0\0\0\0\0ጸጽ፷ᎅ\0᏿ᐄᐊᐐĀcrዻጁute耻Ú䃚rĀ;oጇገ憟cir;楉rǣጓ\0጖y;䐎ve;䅬Āiyጞጣrc耻Û䃛;䐣blac;䅰r;쀀𝔘rave耻Ù䃙acr;䅪Ādiፁ፩erĀBPፈ፝Āarፍፐr;䁟acĀekፗፙ;揟et;掵arenthesis;揝onĀ;P፰፱拃lus;抎Āgp፻፿on;䅲f;쀀𝕌ЀADETadps᎕ᎮᎸᏄϨᏒᏗᏳrrowƀ;BDᅐᎠᎤar;椒ownArrow;懅ownArrow;憕quilibrium;楮eeĀ;AᏋᏌ报rrow;憥ownáϳerĀLRᏞᏨeftArrow;憖ightArrow;憗iĀ;lᏹᏺ䏒on;䎥ing;䅮cr;쀀𝒰ilde;䅨ml耻Ü䃜ҀDbcdefosvᐧᐬᐰᐳᐾᒅᒊᒐᒖash;披ar;櫫y;䐒ashĀ;lᐻᐼ抩;櫦Āerᑃᑅ;拁ƀbtyᑌᑐᑺar;怖Ā;iᑏᑕcalȀBLSTᑡᑥᑪᑴar;戣ine;䁼eparator;杘ilde;所ThinSpace;怊r;쀀𝔙pf;쀀𝕍cr;쀀𝒱dash;抪ʀcefosᒧᒬᒱᒶᒼirc;䅴dge;拀r;쀀𝔚pf;쀀𝕎cr;쀀𝒲Ȁfiosᓋᓐᓒᓘr;쀀𝔛;䎞pf;쀀𝕏cr;쀀𝒳ҀAIUacfosuᓱᓵᓹᓽᔄᔏᔔᔚᔠcy;䐯cy;䐇cy;䐮cute耻Ý䃝Āiyᔉᔍrc;䅶;䐫r;쀀𝔜pf;쀀𝕐cr;쀀𝒴ml;䅸ЀHacdefosᔵᔹᔿᕋᕏᕝᕠᕤcy;䐖cute;䅹Āayᕄᕉron;䅽;䐗ot;䅻ǲᕔ\0ᕛoWidtè૙a;䎖r;愨pf;愤cr;쀀𝒵௡ᖃᖊᖐ\0ᖰᖶᖿ\0\0\0\0ᗆᗛᗫᙟ᙭\0ᚕ᚛ᚲᚹ\0ᚾcute耻á䃡reve;䄃̀;Ediuyᖜᖝᖡᖣᖨᖭ戾;쀀∾̳;房rc耻â䃢te肻´̆;䐰lig耻æ䃦Ā;r²ᖺ;쀀𝔞rave耻à䃠ĀepᗊᗖĀfpᗏᗔsym;愵èᗓha;䎱ĀapᗟcĀclᗤᗧr;䄁g;樿ɤᗰ\0\0ᘊʀ;adsvᗺᗻᗿᘁᘇ戧nd;橕;橜lope;橘;橚΀;elmrszᘘᘙᘛᘞᘿᙏᙙ戠;榤e»ᘙsdĀ;aᘥᘦ戡ѡᘰᘲᘴᘶᘸᘺᘼᘾ;榨;榩;榪;榫;榬;榭;榮;榯tĀ;vᙅᙆ戟bĀ;dᙌᙍ抾;榝Āptᙔᙗh;戢»¹arr;捼Āgpᙣᙧon;䄅f;쀀𝕒΀;Eaeiop዁ᙻᙽᚂᚄᚇᚊ;橰cir;橯;扊d;手s;䀧roxĀ;e዁ᚒñᚃing耻å䃥ƀctyᚡᚦᚨr;쀀𝒶;䀪mpĀ;e዁ᚯñʈilde耻ã䃣ml耻ä䃤Āciᛂᛈoninôɲnt;樑ࠀNabcdefiklnoprsu᛭ᛱᜰ᜼ᝃᝈ᝸᝽០៦ᠹᡐᜍ᤽᥈ᥰot;櫭Ācrᛶ᜞kȀcepsᜀᜅᜍᜓong;扌psilon;䏶rime;怵imĀ;e᜚᜛戽q;拍Ŷᜢᜦee;抽edĀ;gᜬᜭ挅e»ᜭrkĀ;t፜᜷brk;掶Āoyᜁᝁ;䐱quo;怞ʀcmprtᝓ᝛ᝡᝤᝨausĀ;eĊĉptyv;榰séᜌnoõēƀahwᝯ᝱ᝳ;䎲;愶een;扬r;쀀𝔟g΀costuvwឍឝឳេ៕៛៞ƀaiuបពរðݠrc;旯p»፱ƀdptឤឨឭot;樀lus;樁imes;樂ɱឹ\0\0ើcup;樆ar;昅riangleĀdu៍្own;施p;斳plus;樄eåᑄåᒭarow;植ƀako៭ᠦᠵĀcn៲ᠣkƀlst៺֫᠂ozenge;槫riangleȀ;dlr᠒᠓᠘᠝斴own;斾eft;旂ight;斸k;搣Ʊᠫ\0ᠳƲᠯ\0ᠱ;斒;斑4;斓ck;斈ĀeoᠾᡍĀ;qᡃᡆ쀀=⃥uiv;쀀≡⃥t;挐Ȁptwxᡙᡞᡧᡬf;쀀𝕓Ā;tᏋᡣom»Ꮜtie;拈؀DHUVbdhmptuvᢅᢖᢪᢻᣗᣛᣬ᣿ᤅᤊᤐᤡȀLRlrᢎᢐᢒᢔ;敗;敔;敖;敓ʀ;DUduᢡᢢᢤᢦᢨ敐;敦;敩;敤;敧ȀLRlrᢳᢵᢷᢹ;敝;敚;敜;教΀;HLRhlrᣊᣋᣍᣏᣑᣓᣕ救;敬;散;敠;敫;敢;敟ox;槉ȀLRlrᣤᣦᣨᣪ;敕;敒;攐;攌ʀ;DUduڽ᣷᣹᣻᣽;敥;敨;攬;攴inus;抟lus;択imes;抠ȀLRlrᤙᤛᤝ᤟;敛;敘;攘;攔΀;HLRhlrᤰᤱᤳᤵᤷ᤻᤹攂;敪;敡;敞;攼;攤;攜Āevģ᥂bar耻¦䂦Ȁceioᥑᥖᥚᥠr;쀀𝒷mi;恏mĀ;e᜚᜜lƀ;bhᥨᥩᥫ䁜;槅sub;柈Ŭᥴ᥾lĀ;e᥹᥺怢t»᥺pƀ;Eeįᦅᦇ;檮Ā;qۜۛೡᦧ\0᧨ᨑᨕᨲ\0ᨷᩐ\0\0᪴\0\0᫁\0\0ᬡᬮ᭍᭒\0᯽\0ᰌƀcpr᦭ᦲ᧝ute;䄇̀;abcdsᦿᧀᧄ᧊᧕᧙戩nd;橄rcup;橉Āau᧏᧒p;橋p;橇ot;橀;쀀∩︀Āeo᧢᧥t;恁îړȀaeiu᧰᧻ᨁᨅǰ᧵\0᧸s;橍on;䄍dil耻ç䃧rc;䄉psĀ;sᨌᨍ橌m;橐ot;䄋ƀdmnᨛᨠᨦil肻¸ƭptyv;榲t脀¢;eᨭᨮ䂢räƲr;쀀𝔠ƀceiᨽᩀᩍy;䑇ckĀ;mᩇᩈ朓ark»ᩈ;䏇r΀;Ecefms᩟᩠ᩢᩫ᪤᪪᪮旋;槃ƀ;elᩩᩪᩭ䋆q;扗eɡᩴ\0\0᪈rrowĀlr᩼᪁eft;憺ight;憻ʀRSacd᪒᪔᪖᪚᪟»ཇ;擈st;抛irc;抚ash;抝nint;樐id;櫯cir;槂ubsĀ;u᪻᪼晣it»᪼ˬ᫇᫔᫺\0ᬊonĀ;eᫍᫎ䀺Ā;qÇÆɭ᫙\0\0᫢aĀ;t᫞᫟䀬;䁀ƀ;fl᫨᫩᫫戁îᅠeĀmx᫱᫶ent»᫩eóɍǧ᫾\0ᬇĀ;dኻᬂot;橭nôɆƀfryᬐᬔᬗ;쀀𝕔oäɔ脀©;sŕᬝr;愗Āaoᬥᬩrr;憵ss;朗Ācuᬲᬷr;쀀𝒸Ābpᬼ᭄Ā;eᭁᭂ櫏;櫑Ā;eᭉᭊ櫐;櫒dot;拯΀delprvw᭠᭬᭷ᮂᮬᯔ᯹arrĀlr᭨᭪;椸;椵ɰ᭲\0\0᭵r;拞c;拟arrĀ;p᭿ᮀ憶;椽̀;bcdosᮏᮐᮖᮡᮥᮨ截rcap;橈Āauᮛᮞp;橆p;橊ot;抍r;橅;쀀∪︀Ȁalrv᮵ᮿᯞᯣrrĀ;mᮼᮽ憷;椼yƀevwᯇᯔᯘqɰᯎ\0\0ᯒreã᭳uã᭵ee;拎edge;拏en耻¤䂤earrowĀlrᯮ᯳eft»ᮀight»ᮽeäᯝĀciᰁᰇoninôǷnt;戱lcty;挭ঀAHabcdefhijlorstuwz᰸᰻᰿ᱝᱩᱵᲊᲞᲬᲷ᳻᳿ᴍᵻᶑᶫᶻ᷆᷍rò΁ar;楥Ȁglrs᱈ᱍ᱒᱔ger;怠eth;愸òᄳhĀ;vᱚᱛ怐»ऊūᱡᱧarow;椏aã̕Āayᱮᱳron;䄏;䐴ƀ;ao̲ᱼᲄĀgrʿᲁr;懊tseq;橷ƀglmᲑᲔᲘ耻°䂰ta;䎴ptyv;榱ĀirᲣᲨsht;楿;쀀𝔡arĀlrᲳᲵ»ࣜ»သʀaegsv᳂͸᳖᳜᳠mƀ;oș᳊᳔ndĀ;ș᳑uit;晦amma;䏝in;拲ƀ;io᳧᳨᳸䃷de脀÷;o᳧ᳰntimes;拇nø᳷cy;䑒cɯᴆ\0\0ᴊrn;挞op;挍ʀlptuwᴘᴝᴢᵉᵕlar;䀤f;쀀𝕕ʀ;emps̋ᴭᴷᴽᵂqĀ;d͒ᴳot;扑inus;戸lus;戔quare;抡blebarwedgåúnƀadhᄮᵝᵧownarrowóᲃarpoonĀlrᵲᵶefôᲴighôᲶŢᵿᶅkaro÷གɯᶊ\0\0ᶎrn;挟op;挌ƀcotᶘᶣᶦĀryᶝᶡ;쀀𝒹;䑕l;槶rok;䄑Ādrᶰᶴot;拱iĀ;fᶺ᠖斿Āah᷀᷃ròЩaòྦangle;榦Āci᷒ᷕy;䑟grarr;柿ऀDacdefglmnopqrstuxḁḉḙḸոḼṉṡṾấắẽỡἪἷὄ὎὚ĀDoḆᴴoôᲉĀcsḎḔute耻é䃩ter;橮ȀaioyḢḧḱḶron;䄛rĀ;cḭḮ扖耻ê䃪lon;払;䑍ot;䄗ĀDrṁṅot;扒;쀀𝔢ƀ;rsṐṑṗ檚ave耻è䃨Ā;dṜṝ檖ot;檘Ȁ;ilsṪṫṲṴ檙nters;揧;愓Ā;dṹṺ檕ot;檗ƀapsẅẉẗcr;䄓tyƀ;svẒẓẕ戅et»ẓpĀ1;ẝẤĳạả;怄;怅怃ĀgsẪẬ;䅋p;怂ĀgpẴẸon;䄙f;쀀𝕖ƀalsỄỎỒrĀ;sỊị拕l;槣us;橱iƀ;lvỚớở䎵on»ớ;䏵ȀcsuvỪỳἋἣĀioữḱrc»Ḯɩỹ\0\0ỻíՈantĀglἂἆtr»ṝess»Ṻƀaeiἒ἖Ἒls;䀽st;扟vĀ;DȵἠD;橸parsl;槥ĀDaἯἳot;打rr;楱ƀcdiἾὁỸr;愯oô͒ĀahὉὋ;䎷耻ð䃰Āmrὓὗl耻ë䃫o;悬ƀcipὡὤὧl;䀡sôծĀeoὬὴctatioîՙnentialåչৡᾒ\0ᾞ\0ᾡᾧ\0\0ῆῌ\0ΐ\0ῦῪ \0 ⁚llingdotseñṄy;䑄male;晀ƀilrᾭᾳ῁lig;耀ﬃɩᾹ\0\0᾽g;耀ﬀig;耀ﬄ;쀀𝔣lig;耀ﬁlig;쀀fjƀaltῙ῜ῡt;晭ig;耀ﬂns;斱of;䆒ǰ΅\0ῳf;쀀𝕗ĀakֿῷĀ;vῼ´拔;櫙artint;樍Āao‌⁕Ācs‑⁒α‚‰‸⁅⁈\0⁐β•‥‧‪‬\0‮耻½䂽;慓耻¼䂼;慕;慙;慛Ƴ‴\0‶;慔;慖ʴ‾⁁\0\0⁃耻¾䂾;慗;慜5;慘ƶ⁌\0⁎;慚;慝8;慞l;恄wn;挢cr;쀀𝒻ࢀEabcdefgijlnorstv₂₉₟₥₰₴⃰⃵⃺⃿℃ℒℸ̗ℾ⅒↞Ā;lٍ₇;檌ƀcmpₐₕ₝ute;䇵maĀ;dₜ᳚䎳;檆reve;䄟Āiy₪₮rc;䄝;䐳ot;䄡Ȁ;lqsؾق₽⃉ƀ;qsؾٌ⃄lanô٥Ȁ;cdl٥⃒⃥⃕c;檩otĀ;o⃜⃝檀Ā;l⃢⃣檂;檄Ā;e⃪⃭쀀⋛︀s;檔r;쀀𝔤Ā;gٳ؛mel;愷cy;䑓Ȁ;Eajٚℌℎℐ;檒;檥;檤ȀEaesℛℝ℩ℴ;扩pĀ;p℣ℤ檊rox»ℤĀ;q℮ℯ檈Ā;q℮ℛim;拧pf;쀀𝕘Āci⅃ⅆr;愊mƀ;el٫ⅎ⅐;檎;檐茀>;cdlqr׮ⅠⅪⅮⅳⅹĀciⅥⅧ;檧r;橺ot;拗Par;榕uest;橼ʀadelsↄⅪ←ٖ↛ǰ↉\0↎proø₞r;楸qĀlqؿ↖lesó₈ií٫Āen↣↭rtneqq;쀀≩︀Å↪ԀAabcefkosy⇄⇇⇱⇵⇺∘∝∯≨≽ròΠȀilmr⇐⇔⇗⇛rsðᒄf»․ilôکĀdr⇠⇤cy;䑊ƀ;cwࣴ⇫⇯ir;楈;憭ar;意irc;䄥ƀalr∁∎∓rtsĀ;u∉∊晥it»∊lip;怦con;抹r;쀀𝔥sĀew∣∩arow;椥arow;椦ʀamopr∺∾≃≞≣rr;懿tht;戻kĀlr≉≓eftarrow;憩ightarrow;憪f;쀀𝕙bar;怕ƀclt≯≴≸r;쀀𝒽asè⇴rok;䄧Ābp⊂⊇ull;恃hen»ᱛૡ⊣\0⊪\0⊸⋅⋎\0⋕⋳\0\0⋸⌢⍧⍢⍿\0⎆⎪⎴cute耻í䃭ƀ;iyݱ⊰⊵rc耻î䃮;䐸Ācx⊼⊿y;䐵cl耻¡䂡ĀfrΟ⋉;쀀𝔦rave耻ì䃬Ȁ;inoܾ⋝⋩⋮Āin⋢⋦nt;樌t;戭fin;槜ta;愩lig;䄳ƀaop⋾⌚⌝ƀcgt⌅⌈⌗r;䄫ƀelpܟ⌏⌓inåގarôܠh;䄱f;抷ed;䆵ʀ;cfotӴ⌬⌱⌽⍁are;愅inĀ;t⌸⌹戞ie;槝doô⌙ʀ;celpݗ⍌⍐⍛⍡al;抺Āgr⍕⍙eróᕣã⍍arhk;樗rod;樼Ȁcgpt⍯⍲⍶⍻y;䑑on;䄯f;쀀𝕚a;䎹uest耻¿䂿Āci⎊⎏r;쀀𝒾nʀ;EdsvӴ⎛⎝⎡ӳ;拹ot;拵Ā;v⎦⎧拴;拳Ā;iݷ⎮lde;䄩ǫ⎸\0⎼cy;䑖l耻ï䃯̀cfmosu⏌⏗⏜⏡⏧⏵Āiy⏑⏕rc;䄵;䐹r;쀀𝔧ath;䈷pf;쀀𝕛ǣ⏬\0⏱r;쀀𝒿rcy;䑘kcy;䑔Ѐacfghjos␋␖␢␧␭␱␵␻ppaĀ;v␓␔䎺;䏰Āey␛␠dil;䄷;䐺r;쀀𝔨reen;䄸cy;䑅cy;䑜pf;쀀𝕜cr;쀀𝓀஀ABEHabcdefghjlmnoprstuv⑰⒁⒆⒍⒑┎┽╚▀♎♞♥♹♽⚚⚲⛘❝❨➋⟀⠁⠒ƀart⑷⑺⑼rò৆òΕail;椛arr;椎Ā;gঔ⒋;檋ar;楢ॣ⒥\0⒪\0⒱\0\0\0\0\0⒵Ⓔ\0ⓆⓈⓍ\0⓹ute;䄺mptyv;榴raîࡌbda;䎻gƀ;dlࢎⓁⓃ;榑åࢎ;檅uo耻«䂫rЀ;bfhlpst࢙ⓞⓦⓩ⓫⓮⓱⓵Ā;f࢝ⓣs;椟s;椝ë≒p;憫l;椹im;楳l;憢ƀ;ae⓿─┄檫il;椙Ā;s┉┊檭;쀀⪭︀ƀabr┕┙┝rr;椌rk;杲Āak┢┬cĀek┨┪;䁻;䁛Āes┱┳;榋lĀdu┹┻;榏;榍Ȁaeuy╆╋╖╘ron;䄾Ādi═╔il;䄼ìࢰâ┩;䐻Ȁcqrs╣╦╭╽a;椶uoĀ;rนᝆĀdu╲╷har;楧shar;楋h;憲ʀ;fgqs▋▌উ◳◿扤tʀahlrt▘▤▷◂◨rrowĀ;t࢙□aé⓶arpoonĀdu▯▴own»њp»०eftarrows;懇ightƀahs◍◖◞rrowĀ;sࣴࢧarpoonó྘quigarro÷⇰hreetimes;拋ƀ;qs▋ও◺lanôবʀ;cdgsব☊☍☝☨c;檨otĀ;o☔☕橿Ā;r☚☛檁;檃Ā;e☢☥쀀⋚︀s;檓ʀadegs☳☹☽♉♋pproøⓆot;拖qĀgq♃♅ôউgtò⒌ôছiíলƀilr♕࣡♚sht;楼;쀀𝔩Ā;Eজ♣;檑š♩♶rĀdu▲♮Ā;l॥♳;楪lk;斄cy;䑙ʀ;achtੈ⚈⚋⚑⚖rò◁orneòᴈard;楫ri;旺Āio⚟⚤dot;䅀ustĀ;a⚬⚭掰che»⚭ȀEaes⚻⚽⛉⛔;扨pĀ;p⛃⛄檉rox»⛄Ā;q⛎⛏檇Ā;q⛎⚻im;拦Ѐabnoptwz⛩⛴⛷✚✯❁❇❐Ānr⛮⛱g;柬r;懽rëࣁgƀlmr⛿✍✔eftĀar০✇ightá৲apsto;柼ightá৽parrowĀlr✥✩efô⓭ight;憬ƀafl✶✹✽r;榅;쀀𝕝us;樭imes;樴š❋❏st;戗áፎƀ;ef❗❘᠀旊nge»❘arĀ;l❤❥䀨t;榓ʀachmt❳❶❼➅➇ròࢨorneòᶌarĀ;d྘➃;業;怎ri;抿̀achiqt➘➝ੀ➢➮➻quo;怹r;쀀𝓁mƀ;egল➪➬;檍;檏Ābu┪➳oĀ;rฟ➹;怚rok;䅂萀<;cdhilqrࠫ⟒☹⟜⟠⟥⟪⟰Āci⟗⟙;檦r;橹reå◲mes;拉arr;楶uest;橻ĀPi⟵⟹ar;榖ƀ;ef⠀भ᠛旃rĀdu⠇⠍shar;楊har;楦Āen⠗⠡rtneqq;쀀≨︀Å⠞܀Dacdefhilnopsu⡀⡅⢂⢎⢓⢠⢥⢨⣚⣢⣤ઃ⣳⤂Dot;戺Ȁclpr⡎⡒⡣⡽r耻¯䂯Āet⡗⡙;時Ā;e⡞⡟朠se»⡟Ā;sျ⡨toȀ;dluျ⡳⡷⡻owîҌefôएðᏑker;斮Āoy⢇⢌mma;権;䐼ash;怔asuredangle»ᘦr;쀀𝔪o;愧ƀcdn⢯⢴⣉ro耻µ䂵Ȁ;acdᑤ⢽⣀⣄sôᚧir;櫰ot肻·Ƶusƀ;bd⣒ᤃ⣓戒Ā;uᴼ⣘;横ţ⣞⣡p;櫛ò−ðઁĀdp⣩⣮els;抧f;쀀𝕞Āct⣸⣽r;쀀𝓂pos»ᖝƀ;lm⤉⤊⤍䎼timap;抸ఀGLRVabcdefghijlmoprstuvw⥂⥓⥾⦉⦘⧚⧩⨕⨚⩘⩝⪃⪕⪤⪨⬄⬇⭄⭿⮮ⰴⱧⱼ⳩Āgt⥇⥋;쀀⋙̸Ā;v⥐௏쀀≫⃒ƀelt⥚⥲⥶ftĀar⥡⥧rrow;懍ightarrow;懎;쀀⋘̸Ā;v⥻ే쀀≪⃒ightarrow;懏ĀDd⦎⦓ash;抯ash;抮ʀbcnpt⦣⦧⦬⦱⧌la»˞ute;䅄g;쀀∠⃒ʀ;Eiop඄⦼⧀⧅⧈;쀀⩰̸d;쀀≋̸s;䅉roø඄urĀ;a⧓⧔普lĀ;s⧓ସǳ⧟\0⧣p肻 ଷmpĀ;e௹ఀʀaeouy⧴⧾⨃⨐⨓ǰ⧹\0⧻;橃on;䅈dil;䅆ngĀ;dൾ⨊ot;쀀⩭̸p;橂;䐽ash;怓΀;Aadqsxஒ⨩⨭⨻⩁⩅⩐rr;懗rĀhr⨳⨶k;椤Ā;oᏲᏰot;쀀≐̸uiöୣĀei⩊⩎ar;椨í஘istĀ;s஠டr;쀀𝔫ȀEest௅⩦⩹⩼ƀ;qs஼⩭௡ƀ;qs஼௅⩴lanô௢ií௪Ā;rஶ⪁»ஷƀAap⪊⪍⪑rò⥱rr;憮ar;櫲ƀ;svྍ⪜ྌĀ;d⪡⪢拼;拺cy;䑚΀AEadest⪷⪺⪾⫂⫅⫶⫹rò⥦;쀀≦̸rr;憚r;急Ȁ;fqs఻⫎⫣⫯tĀar⫔⫙rro÷⫁ightarro÷⪐ƀ;qs఻⪺⫪lanôౕĀ;sౕ⫴»శiíౝĀ;rవ⫾iĀ;eచథiäඐĀpt⬌⬑f;쀀𝕟膀¬;in⬙⬚⬶䂬nȀ;Edvஉ⬤⬨⬮;쀀⋹̸ot;쀀⋵̸ǡஉ⬳⬵;拷;拶iĀ;vಸ⬼ǡಸ⭁⭃;拾;拽ƀaor⭋⭣⭩rȀ;ast୻⭕⭚⭟lleì୻l;쀀⫽⃥;쀀∂̸lint;樔ƀ;ceಒ⭰⭳uåಥĀ;cಘ⭸Ā;eಒ⭽ñಘȀAait⮈⮋⮝⮧rò⦈rrƀ;cw⮔⮕⮙憛;쀀⤳̸;쀀↝̸ghtarrow»⮕riĀ;eೋೖ΀chimpqu⮽⯍⯙⬄୸⯤⯯Ȁ;cerല⯆ഷ⯉uå൅;쀀𝓃ortɭ⬅\0\0⯖ará⭖mĀ;e൮⯟Ā;q൴൳suĀbp⯫⯭å೸åഋƀbcp⯶ⰑⰙȀ;Ees⯿ⰀഢⰄ抄;쀀⫅̸etĀ;eഛⰋqĀ;qണⰀcĀ;eലⰗñസȀ;EesⰢⰣൟⰧ抅;쀀⫆̸etĀ;e൘ⰮqĀ;qൠⰣȀgilrⰽⰿⱅⱇìௗlde耻ñ䃱çృiangleĀlrⱒⱜeftĀ;eచⱚñదightĀ;eೋⱥñ೗Ā;mⱬⱭ䎽ƀ;esⱴⱵⱹ䀣ro;愖p;怇ҀDHadgilrsⲏⲔⲙⲞⲣⲰⲶⳓⳣash;抭arr;椄p;쀀≍⃒ash;抬ĀetⲨⲬ;쀀≥⃒;쀀>⃒nfin;槞ƀAetⲽⳁⳅrr;椂;쀀≤⃒Ā;rⳊⳍ쀀<⃒ie;쀀⊴⃒ĀAtⳘⳜrr;椃rie;쀀⊵⃒im;쀀∼⃒ƀAan⳰⳴ⴂrr;懖rĀhr⳺⳽k;椣Ā;oᏧᏥear;椧ቓ᪕\0\0\0\0\0\0\0\0\0\0\0\0\0ⴭ\0ⴸⵈⵠⵥ⵲ⶄᬇ\0\0ⶍⶫ\0ⷈⷎ\0ⷜ⸙⸫⸾⹃Ācsⴱ᪗ute耻ó䃳ĀiyⴼⵅrĀ;c᪞ⵂ耻ô䃴;䐾ʀabios᪠ⵒⵗǈⵚlac;䅑v;樸old;榼lig;䅓Ācr⵩⵭ir;榿;쀀𝔬ͯ⵹\0\0⵼\0ⶂn;䋛ave耻ò䃲;槁Ābmⶈ෴ar;榵Ȁacitⶕ⶘ⶥⶨrò᪀Āir⶝ⶠr;榾oss;榻nå๒;槀ƀaeiⶱⶵⶹcr;䅍ga;䏉ƀcdnⷀⷅǍron;䎿;榶pf;쀀𝕠ƀaelⷔ⷗ǒr;榷rp;榹΀;adiosvⷪⷫⷮ⸈⸍⸐⸖戨rò᪆Ȁ;efmⷷⷸ⸂⸅橝rĀ;oⷾⷿ愴f»ⷿ耻ª䂪耻º䂺gof;抶r;橖lope;橗;橛ƀclo⸟⸡⸧ò⸁ash耻ø䃸l;折iŬⸯ⸴de耻õ䃵esĀ;aǛ⸺s;樶ml耻ö䃶bar;挽ૡ⹞\0⹽\0⺀⺝\0⺢⺹\0\0⻋ຜ\0⼓\0\0⼫⾼\0⿈rȀ;astЃ⹧⹲຅脀¶;l⹭⹮䂶leìЃɩ⹸\0\0⹻m;櫳;櫽y;䐿rʀcimpt⺋⺏⺓ᡥ⺗nt;䀥od;䀮il;怰enk;怱r;쀀𝔭ƀimo⺨⺰⺴Ā;v⺭⺮䏆;䏕maô੶ne;明ƀ;tv⺿⻀⻈䏀chfork»´;䏖Āau⻏⻟nĀck⻕⻝kĀ;h⇴⻛;愎ö⇴sҀ;abcdemst⻳⻴ᤈ⻹⻽⼄⼆⼊⼎䀫cir;樣ir;樢Āouᵀ⼂;樥;橲n肻±ຝim;樦wo;樧ƀipu⼙⼠⼥ntint;樕f;쀀𝕡nd耻£䂣Ԁ;Eaceinosu່⼿⽁⽄⽇⾁⾉⾒⽾⾶;檳p;檷uå໙Ā;c໎⽌̀;acens່⽙⽟⽦⽨⽾pproø⽃urlyeñ໙ñ໎ƀaes⽯⽶⽺pprox;檹qq;檵im;拨iíໟmeĀ;s⾈ຮ怲ƀEas⽸⾐⽺ð⽵ƀdfp໬⾙⾯ƀals⾠⾥⾪lar;挮ine;挒urf;挓Ā;t໻⾴ï໻rel;抰Āci⿀⿅r;쀀𝓅;䏈ncsp;怈̀fiopsu⿚⋢⿟⿥⿫⿱r;쀀𝔮pf;쀀𝕢rime;恗cr;쀀𝓆ƀaeo⿸〉〓tĀei⿾々rnionóڰnt;樖stĀ;e【】䀿ñἙô༔઀ABHabcdefhilmnoprstux぀けさすムㄎㄫㅇㅢㅲㆎ㈆㈕㈤㈩㉘㉮㉲㊐㊰㊷ƀartぇおがròႳòϝail;検aròᱥar;楤΀cdenqrtとふへみわゔヌĀeuねぱ;쀀∽̱te;䅕iãᅮmptyv;榳gȀ;del࿑らるろ;榒;榥å࿑uo耻»䂻rր;abcfhlpstw࿜ガクシスゼゾダッデナp;極Ā;f࿠ゴs;椠;椳s;椞ë≝ð✮l;楅im;楴l;憣;憝Āaiパフil;椚oĀ;nホボ戶aló༞ƀabrョリヮrò៥rk;杳ĀakンヽcĀekヹ・;䁽;䁝Āes㄂㄄;榌lĀduㄊㄌ;榎;榐Ȁaeuyㄗㄜㄧㄩron;䅙Ādiㄡㄥil;䅗ì࿲âヺ;䑀Ȁclqsㄴㄷㄽㅄa;椷dhar;楩uoĀ;rȎȍh;憳ƀacgㅎㅟངlȀ;ipsླྀㅘㅛႜnåႻarôྩt;断ƀilrㅩဣㅮsht;楽;쀀𝔯ĀaoㅷㆆrĀduㅽㅿ»ѻĀ;l႑ㆄ;楬Ā;vㆋㆌ䏁;䏱ƀgns㆕ㇹㇼht̀ahlrstㆤㆰ㇂㇘㇤㇮rrowĀ;t࿜ㆭaéトarpoonĀduㆻㆿowîㅾp»႒eftĀah㇊㇐rrowó࿪arpoonóՑightarrows;應quigarro÷ニhreetimes;拌g;䋚ingdotseñἲƀahm㈍㈐㈓rò࿪aòՑ;怏oustĀ;a㈞㈟掱che»㈟mid;櫮Ȁabpt㈲㈽㉀㉒Ānr㈷㈺g;柭r;懾rëဃƀafl㉇㉊㉎r;榆;쀀𝕣us;樮imes;樵Āap㉝㉧rĀ;g㉣㉤䀩t;榔olint;樒arò㇣Ȁachq㉻㊀Ⴜ㊅quo;怺r;쀀𝓇Ābu・㊊oĀ;rȔȓƀhir㊗㊛㊠reåㇸmes;拊iȀ;efl㊪ၙᠡ㊫方tri;槎luhar;楨;愞ൡ㋕㋛㋟㌬㌸㍱\0㍺㎤\0\0㏬㏰\0㐨㑈㑚㒭㒱㓊㓱\0㘖\0\0㘳cute;䅛quï➺Ԁ;Eaceinpsyᇭ㋳㋵㋿㌂㌋㌏㌟㌦㌩;檴ǰ㋺\0㋼;檸on;䅡uåᇾĀ;dᇳ㌇il;䅟rc;䅝ƀEas㌖㌘㌛;檶p;檺im;择olint;樓iíሄ;䑁otƀ;be㌴ᵇ㌵担;橦΀Aacmstx㍆㍊㍗㍛㍞㍣㍭rr;懘rĀhr㍐㍒ë∨Ā;oਸ਼਴t耻§䂧i;䀻war;椩mĀin㍩ðnuóñt;朶rĀ;o㍶⁕쀀𝔰Ȁacoy㎂㎆㎑㎠rp;景Āhy㎋㎏cy;䑉;䑈rtɭ㎙\0\0㎜iäᑤaraì⹯耻­䂭Āgm㎨㎴maƀ;fv㎱㎲㎲䏃;䏂Ѐ;deglnprካ㏅㏉㏎㏖㏞㏡㏦ot;橪Ā;q኱ኰĀ;E㏓㏔檞;檠Ā;E㏛㏜檝;檟e;扆lus;樤arr;楲aròᄽȀaeit㏸㐈㐏㐗Āls㏽㐄lsetmé㍪hp;樳parsl;槤Ādlᑣ㐔e;挣Ā;e㐜㐝檪Ā;s㐢㐣檬;쀀⪬︀ƀflp㐮㐳㑂tcy;䑌Ā;b㐸㐹䀯Ā;a㐾㐿槄r;挿f;쀀𝕤aĀdr㑍ЂesĀ;u㑔㑕晠it»㑕ƀcsu㑠㑹㒟Āau㑥㑯pĀ;sᆈ㑫;쀀⊓︀pĀ;sᆴ㑵;쀀⊔︀uĀbp㑿㒏ƀ;esᆗᆜ㒆etĀ;eᆗ㒍ñᆝƀ;esᆨᆭ㒖etĀ;eᆨ㒝ñᆮƀ;afᅻ㒦ְrť㒫ֱ»ᅼaròᅈȀcemt㒹㒾㓂㓅r;쀀𝓈tmîñiì㐕aræᆾĀar㓎㓕rĀ;f㓔ឿ昆Āan㓚㓭ightĀep㓣㓪psiloîỠhé⺯s»⡒ʀbcmnp㓻㕞ሉ㖋㖎Ҁ;Edemnprs㔎㔏㔑㔕㔞㔣㔬㔱㔶抂;櫅ot;檽Ā;dᇚ㔚ot;櫃ult;櫁ĀEe㔨㔪;櫋;把lus;檿arr;楹ƀeiu㔽㕒㕕tƀ;en㔎㕅㕋qĀ;qᇚ㔏eqĀ;q㔫㔨m;櫇Ābp㕚㕜;櫕;櫓c̀;acensᇭ㕬㕲㕹㕻㌦pproø㋺urlyeñᇾñᇳƀaes㖂㖈㌛pproø㌚qñ㌗g;晪ڀ123;Edehlmnps㖩㖬㖯ሜ㖲㖴㗀㗉㗕㗚㗟㗨㗭耻¹䂹耻²䂲耻³䂳;櫆Āos㖹㖼t;檾ub;櫘Ā;dሢ㗅ot;櫄sĀou㗏㗒l;柉b;櫗arr;楻ult;櫂ĀEe㗤㗦;櫌;抋lus;櫀ƀeiu㗴㘉㘌tƀ;enሜ㗼㘂qĀ;qሢ㖲eqĀ;q㗧㗤m;櫈Ābp㘑㘓;櫔;櫖ƀAan㘜㘠㘭rr;懙rĀhr㘦㘨ë∮Ā;oਫ਩war;椪lig耻ß䃟௡㙑㙝㙠ዎ㙳㙹\0㙾㛂\0\0\0\0\0㛛㜃\0㜉㝬\0\0\0㞇ɲ㙖\0\0㙛get;挖;䏄rë๟ƀaey㙦㙫㙰ron;䅥dil;䅣;䑂lrec;挕r;쀀𝔱Ȁeiko㚆㚝㚵㚼ǲ㚋\0㚑eĀ4fኄኁaƀ;sv㚘㚙㚛䎸ym;䏑Ācn㚢㚲kĀas㚨㚮pproø዁im»ኬsðኞĀas㚺㚮ð዁rn耻þ䃾Ǭ̟㛆⋧es膀×;bd㛏㛐㛘䃗Ā;aᤏ㛕r;樱;樰ƀeps㛡㛣㜀á⩍Ȁ;bcf҆㛬㛰㛴ot;挶ir;櫱Ā;o㛹㛼쀀𝕥rk;櫚á㍢rime;怴ƀaip㜏㜒㝤dåቈ΀adempst㜡㝍㝀㝑㝗㝜㝟ngleʀ;dlqr㜰㜱㜶㝀㝂斵own»ᶻeftĀ;e⠀㜾ñम;扜ightĀ;e㊪㝋ñၚot;旬inus;樺lus;樹b;槍ime;樻ezium;揢ƀcht㝲㝽㞁Āry㝷㝻;쀀𝓉;䑆cy;䑛rok;䅧Āio㞋㞎xô᝷headĀlr㞗㞠eftarro÷ࡏightarrow»ཝऀAHabcdfghlmoprstuw㟐㟓㟗㟤㟰㟼㠎㠜㠣㠴㡑㡝㡫㢩㣌㣒㣪㣶ròϭar;楣Ācr㟜㟢ute耻ú䃺òᅐrǣ㟪\0㟭y;䑞ve;䅭Āiy㟵㟺rc耻û䃻;䑃ƀabh㠃㠆㠋ròᎭlac;䅱aòᏃĀir㠓㠘sht;楾;쀀𝔲rave耻ù䃹š㠧㠱rĀlr㠬㠮»ॗ»ႃlk;斀Āct㠹㡍ɯ㠿\0\0㡊rnĀ;e㡅㡆挜r»㡆op;挏ri;旸Āal㡖㡚cr;䅫肻¨͉Āgp㡢㡦on;䅳f;쀀𝕦̀adhlsuᅋ㡸㡽፲㢑㢠ownáᎳarpoonĀlr㢈㢌efô㠭ighô㠯iƀ;hl㢙㢚㢜䏅»ᏺon»㢚parrows;懈ƀcit㢰㣄㣈ɯ㢶\0\0㣁rnĀ;e㢼㢽挝r»㢽op;挎ng;䅯ri;旹cr;쀀𝓊ƀdir㣙㣝㣢ot;拰lde;䅩iĀ;f㜰㣨»᠓Āam㣯㣲rò㢨l耻ü䃼angle;榧ހABDacdeflnoprsz㤜㤟㤩㤭㦵㦸㦽㧟㧤㧨㧳㧹㧽㨁㨠ròϷarĀ;v㤦㤧櫨;櫩asèϡĀnr㤲㤷grt;榜΀eknprst㓣㥆㥋㥒㥝㥤㦖appá␕othinçẖƀhir㓫⻈㥙opô⾵Ā;hᎷ㥢ïㆍĀiu㥩㥭gmá㎳Ābp㥲㦄setneqĀ;q㥽㦀쀀⊊︀;쀀⫋︀setneqĀ;q㦏㦒쀀⊋︀;쀀⫌︀Āhr㦛㦟etá㚜iangleĀlr㦪㦯eft»थight»ၑy;䐲ash»ံƀelr㧄㧒㧗ƀ;beⷪ㧋㧏ar;抻q;扚lip;拮Ābt㧜ᑨaòᑩr;쀀𝔳tré㦮suĀbp㧯㧱»ജ»൙pf;쀀𝕧roð໻tré㦴Ācu㨆㨋r;쀀𝓋Ābp㨐㨘nĀEe㦀㨖»㥾nĀEe㦒㨞»㦐igzag;榚΀cefoprs㨶㨻㩖㩛㩔㩡㩪irc;䅵Ādi㩀㩑Ābg㩅㩉ar;機eĀ;qᗺ㩏;扙erp;愘r;쀀𝔴pf;쀀𝕨Ā;eᑹ㩦atèᑹcr;쀀𝓌ૣណ㪇\0㪋\0㪐㪛\0\0㪝㪨㪫㪯\0\0㫃㫎\0㫘ៜ៟tré៑r;쀀𝔵ĀAa㪔㪗ròσrò৶;䎾ĀAa㪡㪤ròθrò৫að✓is;拻ƀdptឤ㪵㪾Āfl㪺ឩ;쀀𝕩imåឲĀAa㫇㫊ròώròਁĀcq㫒ីr;쀀𝓍Āpt៖㫜ré។Ѐacefiosu㫰㫽㬈㬌㬑㬕㬛㬡cĀuy㫶㫻te耻ý䃽;䑏Āiy㬂㬆rc;䅷;䑋n耻¥䂥r;쀀𝔶cy;䑗pf;쀀𝕪cr;쀀𝓎Ācm㬦㬩y;䑎l耻ÿ䃿Ԁacdefhiosw㭂㭈㭔㭘㭤㭩㭭㭴㭺㮀cute;䅺Āay㭍㭒ron;䅾;䐷ot;䅼Āet㭝㭡træᕟa;䎶r;쀀𝔷cy;䐶grarr;懝pf;쀀𝕫cr;쀀𝓏Ājn㮅㮇;怍j;怌'.split("").map((c2) => c2.charCodeAt(0))
);

// node_modules/entities/lib/esm/generated/decode-data-xml.js
init_esm();
var decode_data_xml_default = new Uint16Array(
  // prettier-ignore
  "Ȁaglq	\x1Bɭ\0\0p;䀦os;䀧t;䀾t;䀼uot;䀢".split("").map((c2) => c2.charCodeAt(0))
);

// node_modules/entities/lib/esm/decode_codepoint.js
init_esm();
var _a;
var decodeMap = /* @__PURE__ */ new Map([
  [0, 65533],
  // C1 Unicode control character reference replacements
  [128, 8364],
  [130, 8218],
  [131, 402],
  [132, 8222],
  [133, 8230],
  [134, 8224],
  [135, 8225],
  [136, 710],
  [137, 8240],
  [138, 352],
  [139, 8249],
  [140, 338],
  [142, 381],
  [145, 8216],
  [146, 8217],
  [147, 8220],
  [148, 8221],
  [149, 8226],
  [150, 8211],
  [151, 8212],
  [152, 732],
  [153, 8482],
  [154, 353],
  [155, 8250],
  [156, 339],
  [158, 382],
  [159, 376]
]);
var fromCodePoint = (
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, node/no-unsupported-features/es-builtins
  (_a = String.fromCodePoint) !== null && _a !== void 0 ? _a : function(codePoint) {
    let output = "";
    if (codePoint > 65535) {
      codePoint -= 65536;
      output += String.fromCharCode(codePoint >>> 10 & 1023 | 55296);
      codePoint = 56320 | codePoint & 1023;
    }
    output += String.fromCharCode(codePoint);
    return output;
  }
);
function replaceCodePoint(codePoint) {
  var _a4;
  if (codePoint >= 55296 && codePoint <= 57343 || codePoint > 1114111) {
    return 65533;
  }
  return (_a4 = decodeMap.get(codePoint)) !== null && _a4 !== void 0 ? _a4 : codePoint;
}
__name(replaceCodePoint, "replaceCodePoint");

// node_modules/entities/lib/esm/decode.js
var CharCodes;
(function(CharCodes3) {
  CharCodes3[CharCodes3["NUM"] = 35] = "NUM";
  CharCodes3[CharCodes3["SEMI"] = 59] = "SEMI";
  CharCodes3[CharCodes3["EQUALS"] = 61] = "EQUALS";
  CharCodes3[CharCodes3["ZERO"] = 48] = "ZERO";
  CharCodes3[CharCodes3["NINE"] = 57] = "NINE";
  CharCodes3[CharCodes3["LOWER_A"] = 97] = "LOWER_A";
  CharCodes3[CharCodes3["LOWER_F"] = 102] = "LOWER_F";
  CharCodes3[CharCodes3["LOWER_X"] = 120] = "LOWER_X";
  CharCodes3[CharCodes3["LOWER_Z"] = 122] = "LOWER_Z";
  CharCodes3[CharCodes3["UPPER_A"] = 65] = "UPPER_A";
  CharCodes3[CharCodes3["UPPER_F"] = 70] = "UPPER_F";
  CharCodes3[CharCodes3["UPPER_Z"] = 90] = "UPPER_Z";
})(CharCodes || (CharCodes = {}));
var TO_LOWER_BIT = 32;
var BinTrieFlags;
(function(BinTrieFlags2) {
  BinTrieFlags2[BinTrieFlags2["VALUE_LENGTH"] = 49152] = "VALUE_LENGTH";
  BinTrieFlags2[BinTrieFlags2["BRANCH_LENGTH"] = 16256] = "BRANCH_LENGTH";
  BinTrieFlags2[BinTrieFlags2["JUMP_TABLE"] = 127] = "JUMP_TABLE";
})(BinTrieFlags || (BinTrieFlags = {}));
function isNumber(code) {
  return code >= CharCodes.ZERO && code <= CharCodes.NINE;
}
__name(isNumber, "isNumber");
function isHexadecimalCharacter(code) {
  return code >= CharCodes.UPPER_A && code <= CharCodes.UPPER_F || code >= CharCodes.LOWER_A && code <= CharCodes.LOWER_F;
}
__name(isHexadecimalCharacter, "isHexadecimalCharacter");
function isAsciiAlphaNumeric(code) {
  return code >= CharCodes.UPPER_A && code <= CharCodes.UPPER_Z || code >= CharCodes.LOWER_A && code <= CharCodes.LOWER_Z || isNumber(code);
}
__name(isAsciiAlphaNumeric, "isAsciiAlphaNumeric");
function isEntityInAttributeInvalidEnd(code) {
  return code === CharCodes.EQUALS || isAsciiAlphaNumeric(code);
}
__name(isEntityInAttributeInvalidEnd, "isEntityInAttributeInvalidEnd");
var EntityDecoderState;
(function(EntityDecoderState2) {
  EntityDecoderState2[EntityDecoderState2["EntityStart"] = 0] = "EntityStart";
  EntityDecoderState2[EntityDecoderState2["NumericStart"] = 1] = "NumericStart";
  EntityDecoderState2[EntityDecoderState2["NumericDecimal"] = 2] = "NumericDecimal";
  EntityDecoderState2[EntityDecoderState2["NumericHex"] = 3] = "NumericHex";
  EntityDecoderState2[EntityDecoderState2["NamedEntity"] = 4] = "NamedEntity";
})(EntityDecoderState || (EntityDecoderState = {}));
var DecodingMode;
(function(DecodingMode2) {
  DecodingMode2[DecodingMode2["Legacy"] = 0] = "Legacy";
  DecodingMode2[DecodingMode2["Strict"] = 1] = "Strict";
  DecodingMode2[DecodingMode2["Attribute"] = 2] = "Attribute";
})(DecodingMode || (DecodingMode = {}));
var EntityDecoder = class {
  static {
    __name(this, "EntityDecoder");
  }
  constructor(decodeTree, emitCodePoint, errors) {
    this.decodeTree = decodeTree;
    this.emitCodePoint = emitCodePoint;
    this.errors = errors;
    this.state = EntityDecoderState.EntityStart;
    this.consumed = 1;
    this.result = 0;
    this.treeIndex = 0;
    this.excess = 1;
    this.decodeMode = DecodingMode.Strict;
  }
  /** Resets the instance to make it reusable. */
  startEntity(decodeMode) {
    this.decodeMode = decodeMode;
    this.state = EntityDecoderState.EntityStart;
    this.result = 0;
    this.treeIndex = 0;
    this.excess = 1;
    this.consumed = 1;
  }
  /**
   * Write an entity to the decoder. This can be called multiple times with partial entities.
   * If the entity is incomplete, the decoder will return -1.
   *
   * Mirrors the implementation of `getDecoder`, but with the ability to stop decoding if the
   * entity is incomplete, and resume when the next string is written.
   *
   * @param string The string containing the entity (or a continuation of the entity).
   * @param offset The offset at which the entity begins. Should be 0 if this is not the first call.
   * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
   */
  write(str, offset) {
    switch (this.state) {
      case EntityDecoderState.EntityStart: {
        if (str.charCodeAt(offset) === CharCodes.NUM) {
          this.state = EntityDecoderState.NumericStart;
          this.consumed += 1;
          return this.stateNumericStart(str, offset + 1);
        }
        this.state = EntityDecoderState.NamedEntity;
        return this.stateNamedEntity(str, offset);
      }
      case EntityDecoderState.NumericStart: {
        return this.stateNumericStart(str, offset);
      }
      case EntityDecoderState.NumericDecimal: {
        return this.stateNumericDecimal(str, offset);
      }
      case EntityDecoderState.NumericHex: {
        return this.stateNumericHex(str, offset);
      }
      case EntityDecoderState.NamedEntity: {
        return this.stateNamedEntity(str, offset);
      }
    }
  }
  /**
   * Switches between the numeric decimal and hexadecimal states.
   *
   * Equivalent to the `Numeric character reference state` in the HTML spec.
   *
   * @param str The string containing the entity (or a continuation of the entity).
   * @param offset The current offset.
   * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
   */
  stateNumericStart(str, offset) {
    if (offset >= str.length) {
      return -1;
    }
    if ((str.charCodeAt(offset) | TO_LOWER_BIT) === CharCodes.LOWER_X) {
      this.state = EntityDecoderState.NumericHex;
      this.consumed += 1;
      return this.stateNumericHex(str, offset + 1);
    }
    this.state = EntityDecoderState.NumericDecimal;
    return this.stateNumericDecimal(str, offset);
  }
  addToNumericResult(str, start, end, base) {
    if (start !== end) {
      const digitCount = end - start;
      this.result = this.result * Math.pow(base, digitCount) + parseInt(str.substr(start, digitCount), base);
      this.consumed += digitCount;
    }
  }
  /**
   * Parses a hexadecimal numeric entity.
   *
   * Equivalent to the `Hexademical character reference state` in the HTML spec.
   *
   * @param str The string containing the entity (or a continuation of the entity).
   * @param offset The current offset.
   * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
   */
  stateNumericHex(str, offset) {
    const startIdx = offset;
    while (offset < str.length) {
      const char = str.charCodeAt(offset);
      if (isNumber(char) || isHexadecimalCharacter(char)) {
        offset += 1;
      } else {
        this.addToNumericResult(str, startIdx, offset, 16);
        return this.emitNumericEntity(char, 3);
      }
    }
    this.addToNumericResult(str, startIdx, offset, 16);
    return -1;
  }
  /**
   * Parses a decimal numeric entity.
   *
   * Equivalent to the `Decimal character reference state` in the HTML spec.
   *
   * @param str The string containing the entity (or a continuation of the entity).
   * @param offset The current offset.
   * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
   */
  stateNumericDecimal(str, offset) {
    const startIdx = offset;
    while (offset < str.length) {
      const char = str.charCodeAt(offset);
      if (isNumber(char)) {
        offset += 1;
      } else {
        this.addToNumericResult(str, startIdx, offset, 10);
        return this.emitNumericEntity(char, 2);
      }
    }
    this.addToNumericResult(str, startIdx, offset, 10);
    return -1;
  }
  /**
   * Validate and emit a numeric entity.
   *
   * Implements the logic from the `Hexademical character reference start
   * state` and `Numeric character reference end state` in the HTML spec.
   *
   * @param lastCp The last code point of the entity. Used to see if the
   *               entity was terminated with a semicolon.
   * @param expectedLength The minimum number of characters that should be
   *                       consumed. Used to validate that at least one digit
   *                       was consumed.
   * @returns The number of characters that were consumed.
   */
  emitNumericEntity(lastCp, expectedLength) {
    var _a4;
    if (this.consumed <= expectedLength) {
      (_a4 = this.errors) === null || _a4 === void 0 ? void 0 : _a4.absenceOfDigitsInNumericCharacterReference(this.consumed);
      return 0;
    }
    if (lastCp === CharCodes.SEMI) {
      this.consumed += 1;
    } else if (this.decodeMode === DecodingMode.Strict) {
      return 0;
    }
    this.emitCodePoint(replaceCodePoint(this.result), this.consumed);
    if (this.errors) {
      if (lastCp !== CharCodes.SEMI) {
        this.errors.missingSemicolonAfterCharacterReference();
      }
      this.errors.validateNumericCharacterReference(this.result);
    }
    return this.consumed;
  }
  /**
   * Parses a named entity.
   *
   * Equivalent to the `Named character reference state` in the HTML spec.
   *
   * @param str The string containing the entity (or a continuation of the entity).
   * @param offset The current offset.
   * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
   */
  stateNamedEntity(str, offset) {
    const { decodeTree } = this;
    let current = decodeTree[this.treeIndex];
    let valueLength = (current & BinTrieFlags.VALUE_LENGTH) >> 14;
    for (; offset < str.length; offset++, this.excess++) {
      const char = str.charCodeAt(offset);
      this.treeIndex = determineBranch(decodeTree, current, this.treeIndex + Math.max(1, valueLength), char);
      if (this.treeIndex < 0) {
        return this.result === 0 || // If we are parsing an attribute
        this.decodeMode === DecodingMode.Attribute && // We shouldn't have consumed any characters after the entity,
        (valueLength === 0 || // And there should be no invalid characters.
        isEntityInAttributeInvalidEnd(char)) ? 0 : this.emitNotTerminatedNamedEntity();
      }
      current = decodeTree[this.treeIndex];
      valueLength = (current & BinTrieFlags.VALUE_LENGTH) >> 14;
      if (valueLength !== 0) {
        if (char === CharCodes.SEMI) {
          return this.emitNamedEntityData(this.treeIndex, valueLength, this.consumed + this.excess);
        }
        if (this.decodeMode !== DecodingMode.Strict) {
          this.result = this.treeIndex;
          this.consumed += this.excess;
          this.excess = 0;
        }
      }
    }
    return -1;
  }
  /**
   * Emit a named entity that was not terminated with a semicolon.
   *
   * @returns The number of characters consumed.
   */
  emitNotTerminatedNamedEntity() {
    var _a4;
    const { result, decodeTree } = this;
    const valueLength = (decodeTree[result] & BinTrieFlags.VALUE_LENGTH) >> 14;
    this.emitNamedEntityData(result, valueLength, this.consumed);
    (_a4 = this.errors) === null || _a4 === void 0 ? void 0 : _a4.missingSemicolonAfterCharacterReference();
    return this.consumed;
  }
  /**
   * Emit a named entity.
   *
   * @param result The index of the entity in the decode tree.
   * @param valueLength The number of bytes in the entity.
   * @param consumed The number of characters consumed.
   *
   * @returns The number of characters consumed.
   */
  emitNamedEntityData(result, valueLength, consumed) {
    const { decodeTree } = this;
    this.emitCodePoint(valueLength === 1 ? decodeTree[result] & ~BinTrieFlags.VALUE_LENGTH : decodeTree[result + 1], consumed);
    if (valueLength === 3) {
      this.emitCodePoint(decodeTree[result + 2], consumed);
    }
    return consumed;
  }
  /**
   * Signal to the parser that the end of the input was reached.
   *
   * Remaining data will be emitted and relevant errors will be produced.
   *
   * @returns The number of characters consumed.
   */
  end() {
    var _a4;
    switch (this.state) {
      case EntityDecoderState.NamedEntity: {
        return this.result !== 0 && (this.decodeMode !== DecodingMode.Attribute || this.result === this.treeIndex) ? this.emitNotTerminatedNamedEntity() : 0;
      }
      // Otherwise, emit a numeric entity if we have one.
      case EntityDecoderState.NumericDecimal: {
        return this.emitNumericEntity(0, 2);
      }
      case EntityDecoderState.NumericHex: {
        return this.emitNumericEntity(0, 3);
      }
      case EntityDecoderState.NumericStart: {
        (_a4 = this.errors) === null || _a4 === void 0 ? void 0 : _a4.absenceOfDigitsInNumericCharacterReference(this.consumed);
        return 0;
      }
      case EntityDecoderState.EntityStart: {
        return 0;
      }
    }
  }
};
function getDecoder(decodeTree) {
  let ret = "";
  const decoder2 = new EntityDecoder(decodeTree, (str) => ret += fromCodePoint(str));
  return /* @__PURE__ */ __name(function decodeWithTrie(str, decodeMode) {
    let lastIndex = 0;
    let offset = 0;
    while ((offset = str.indexOf("&", offset)) >= 0) {
      ret += str.slice(lastIndex, offset);
      decoder2.startEntity(decodeMode);
      const len = decoder2.write(
        str,
        // Skip the "&"
        offset + 1
      );
      if (len < 0) {
        lastIndex = offset + decoder2.end();
        break;
      }
      lastIndex = offset + len;
      offset = len === 0 ? lastIndex + 1 : lastIndex;
    }
    const result = ret + str.slice(lastIndex);
    ret = "";
    return result;
  }, "decodeWithTrie");
}
__name(getDecoder, "getDecoder");
function determineBranch(decodeTree, current, nodeIdx, char) {
  const branchCount = (current & BinTrieFlags.BRANCH_LENGTH) >> 7;
  const jumpOffset = current & BinTrieFlags.JUMP_TABLE;
  if (branchCount === 0) {
    return jumpOffset !== 0 && char === jumpOffset ? nodeIdx : -1;
  }
  if (jumpOffset) {
    const value = char - jumpOffset;
    return value < 0 || value >= branchCount ? -1 : decodeTree[nodeIdx + value] - 1;
  }
  let lo3 = nodeIdx;
  let hi2 = lo3 + branchCount - 1;
  while (lo3 <= hi2) {
    const mid = lo3 + hi2 >>> 1;
    const midVal = decodeTree[mid];
    if (midVal < char) {
      lo3 = mid + 1;
    } else if (midVal > char) {
      hi2 = mid - 1;
    } else {
      return decodeTree[mid + branchCount];
    }
  }
  return -1;
}
__name(determineBranch, "determineBranch");
var htmlDecoder = getDecoder(decode_data_html_default);
var xmlDecoder = getDecoder(decode_data_xml_default);

// node_modules/htmlparser2/lib/esm/Tokenizer.js
var CharCodes2;
(function(CharCodes3) {
  CharCodes3[CharCodes3["Tab"] = 9] = "Tab";
  CharCodes3[CharCodes3["NewLine"] = 10] = "NewLine";
  CharCodes3[CharCodes3["FormFeed"] = 12] = "FormFeed";
  CharCodes3[CharCodes3["CarriageReturn"] = 13] = "CarriageReturn";
  CharCodes3[CharCodes3["Space"] = 32] = "Space";
  CharCodes3[CharCodes3["ExclamationMark"] = 33] = "ExclamationMark";
  CharCodes3[CharCodes3["Number"] = 35] = "Number";
  CharCodes3[CharCodes3["Amp"] = 38] = "Amp";
  CharCodes3[CharCodes3["SingleQuote"] = 39] = "SingleQuote";
  CharCodes3[CharCodes3["DoubleQuote"] = 34] = "DoubleQuote";
  CharCodes3[CharCodes3["Dash"] = 45] = "Dash";
  CharCodes3[CharCodes3["Slash"] = 47] = "Slash";
  CharCodes3[CharCodes3["Zero"] = 48] = "Zero";
  CharCodes3[CharCodes3["Nine"] = 57] = "Nine";
  CharCodes3[CharCodes3["Semi"] = 59] = "Semi";
  CharCodes3[CharCodes3["Lt"] = 60] = "Lt";
  CharCodes3[CharCodes3["Eq"] = 61] = "Eq";
  CharCodes3[CharCodes3["Gt"] = 62] = "Gt";
  CharCodes3[CharCodes3["Questionmark"] = 63] = "Questionmark";
  CharCodes3[CharCodes3["UpperA"] = 65] = "UpperA";
  CharCodes3[CharCodes3["LowerA"] = 97] = "LowerA";
  CharCodes3[CharCodes3["UpperF"] = 70] = "UpperF";
  CharCodes3[CharCodes3["LowerF"] = 102] = "LowerF";
  CharCodes3[CharCodes3["UpperZ"] = 90] = "UpperZ";
  CharCodes3[CharCodes3["LowerZ"] = 122] = "LowerZ";
  CharCodes3[CharCodes3["LowerX"] = 120] = "LowerX";
  CharCodes3[CharCodes3["OpeningSquareBracket"] = 91] = "OpeningSquareBracket";
})(CharCodes2 || (CharCodes2 = {}));
var State;
(function(State2) {
  State2[State2["Text"] = 1] = "Text";
  State2[State2["BeforeTagName"] = 2] = "BeforeTagName";
  State2[State2["InTagName"] = 3] = "InTagName";
  State2[State2["InSelfClosingTag"] = 4] = "InSelfClosingTag";
  State2[State2["BeforeClosingTagName"] = 5] = "BeforeClosingTagName";
  State2[State2["InClosingTagName"] = 6] = "InClosingTagName";
  State2[State2["AfterClosingTagName"] = 7] = "AfterClosingTagName";
  State2[State2["BeforeAttributeName"] = 8] = "BeforeAttributeName";
  State2[State2["InAttributeName"] = 9] = "InAttributeName";
  State2[State2["AfterAttributeName"] = 10] = "AfterAttributeName";
  State2[State2["BeforeAttributeValue"] = 11] = "BeforeAttributeValue";
  State2[State2["InAttributeValueDq"] = 12] = "InAttributeValueDq";
  State2[State2["InAttributeValueSq"] = 13] = "InAttributeValueSq";
  State2[State2["InAttributeValueNq"] = 14] = "InAttributeValueNq";
  State2[State2["BeforeDeclaration"] = 15] = "BeforeDeclaration";
  State2[State2["InDeclaration"] = 16] = "InDeclaration";
  State2[State2["InProcessingInstruction"] = 17] = "InProcessingInstruction";
  State2[State2["BeforeComment"] = 18] = "BeforeComment";
  State2[State2["CDATASequence"] = 19] = "CDATASequence";
  State2[State2["InSpecialComment"] = 20] = "InSpecialComment";
  State2[State2["InCommentLike"] = 21] = "InCommentLike";
  State2[State2["BeforeSpecialS"] = 22] = "BeforeSpecialS";
  State2[State2["SpecialStartSequence"] = 23] = "SpecialStartSequence";
  State2[State2["InSpecialTag"] = 24] = "InSpecialTag";
  State2[State2["BeforeEntity"] = 25] = "BeforeEntity";
  State2[State2["BeforeNumericEntity"] = 26] = "BeforeNumericEntity";
  State2[State2["InNamedEntity"] = 27] = "InNamedEntity";
  State2[State2["InNumericEntity"] = 28] = "InNumericEntity";
  State2[State2["InHexEntity"] = 29] = "InHexEntity";
})(State || (State = {}));
function isWhitespace(c2) {
  return c2 === CharCodes2.Space || c2 === CharCodes2.NewLine || c2 === CharCodes2.Tab || c2 === CharCodes2.FormFeed || c2 === CharCodes2.CarriageReturn;
}
__name(isWhitespace, "isWhitespace");
function isEndOfTagSection(c2) {
  return c2 === CharCodes2.Slash || c2 === CharCodes2.Gt || isWhitespace(c2);
}
__name(isEndOfTagSection, "isEndOfTagSection");
function isNumber2(c2) {
  return c2 >= CharCodes2.Zero && c2 <= CharCodes2.Nine;
}
__name(isNumber2, "isNumber");
function isASCIIAlpha(c2) {
  return c2 >= CharCodes2.LowerA && c2 <= CharCodes2.LowerZ || c2 >= CharCodes2.UpperA && c2 <= CharCodes2.UpperZ;
}
__name(isASCIIAlpha, "isASCIIAlpha");
function isHexDigit(c2) {
  return c2 >= CharCodes2.UpperA && c2 <= CharCodes2.UpperF || c2 >= CharCodes2.LowerA && c2 <= CharCodes2.LowerF;
}
__name(isHexDigit, "isHexDigit");
var QuoteType;
(function(QuoteType2) {
  QuoteType2[QuoteType2["NoValue"] = 0] = "NoValue";
  QuoteType2[QuoteType2["Unquoted"] = 1] = "Unquoted";
  QuoteType2[QuoteType2["Single"] = 2] = "Single";
  QuoteType2[QuoteType2["Double"] = 3] = "Double";
})(QuoteType || (QuoteType = {}));
var Sequences = {
  Cdata: new Uint8Array([67, 68, 65, 84, 65, 91]),
  CdataEnd: new Uint8Array([93, 93, 62]),
  CommentEnd: new Uint8Array([45, 45, 62]),
  ScriptEnd: new Uint8Array([60, 47, 115, 99, 114, 105, 112, 116]),
  StyleEnd: new Uint8Array([60, 47, 115, 116, 121, 108, 101]),
  TitleEnd: new Uint8Array([60, 47, 116, 105, 116, 108, 101])
  // `</title`
};
var Tokenizer = class {
  static {
    __name(this, "Tokenizer");
  }
  constructor({ xmlMode = false, decodeEntities = true }, cbs) {
    this.cbs = cbs;
    this.state = State.Text;
    this.buffer = "";
    this.sectionStart = 0;
    this.index = 0;
    this.baseState = State.Text;
    this.isSpecial = false;
    this.running = true;
    this.offset = 0;
    this.currentSequence = void 0;
    this.sequenceIndex = 0;
    this.trieIndex = 0;
    this.trieCurrent = 0;
    this.entityResult = 0;
    this.entityExcess = 0;
    this.xmlMode = xmlMode;
    this.decodeEntities = decodeEntities;
    this.entityTrie = xmlMode ? decode_data_xml_default : decode_data_html_default;
  }
  reset() {
    this.state = State.Text;
    this.buffer = "";
    this.sectionStart = 0;
    this.index = 0;
    this.baseState = State.Text;
    this.currentSequence = void 0;
    this.running = true;
    this.offset = 0;
  }
  write(chunk) {
    this.offset += this.buffer.length;
    this.buffer = chunk;
    this.parse();
  }
  end() {
    if (this.running)
      this.finish();
  }
  pause() {
    this.running = false;
  }
  resume() {
    this.running = true;
    if (this.index < this.buffer.length + this.offset) {
      this.parse();
    }
  }
  /**
   * The current index within all of the written data.
   */
  getIndex() {
    return this.index;
  }
  /**
   * The start of the current section.
   */
  getSectionStart() {
    return this.sectionStart;
  }
  stateText(c2) {
    if (c2 === CharCodes2.Lt || !this.decodeEntities && this.fastForwardTo(CharCodes2.Lt)) {
      if (this.index > this.sectionStart) {
        this.cbs.ontext(this.sectionStart, this.index);
      }
      this.state = State.BeforeTagName;
      this.sectionStart = this.index;
    } else if (this.decodeEntities && c2 === CharCodes2.Amp) {
      this.state = State.BeforeEntity;
    }
  }
  stateSpecialStartSequence(c2) {
    const isEnd = this.sequenceIndex === this.currentSequence.length;
    const isMatch = isEnd ? (
      // If we are at the end of the sequence, make sure the tag name has ended
      isEndOfTagSection(c2)
    ) : (
      // Otherwise, do a case-insensitive comparison
      (c2 | 32) === this.currentSequence[this.sequenceIndex]
    );
    if (!isMatch) {
      this.isSpecial = false;
    } else if (!isEnd) {
      this.sequenceIndex++;
      return;
    }
    this.sequenceIndex = 0;
    this.state = State.InTagName;
    this.stateInTagName(c2);
  }
  /** Look for an end tag. For <title> tags, also decode entities. */
  stateInSpecialTag(c2) {
    if (this.sequenceIndex === this.currentSequence.length) {
      if (c2 === CharCodes2.Gt || isWhitespace(c2)) {
        const endOfText = this.index - this.currentSequence.length;
        if (this.sectionStart < endOfText) {
          const actualIndex = this.index;
          this.index = endOfText;
          this.cbs.ontext(this.sectionStart, endOfText);
          this.index = actualIndex;
        }
        this.isSpecial = false;
        this.sectionStart = endOfText + 2;
        this.stateInClosingTagName(c2);
        return;
      }
      this.sequenceIndex = 0;
    }
    if ((c2 | 32) === this.currentSequence[this.sequenceIndex]) {
      this.sequenceIndex += 1;
    } else if (this.sequenceIndex === 0) {
      if (this.currentSequence === Sequences.TitleEnd) {
        if (this.decodeEntities && c2 === CharCodes2.Amp) {
          this.state = State.BeforeEntity;
        }
      } else if (this.fastForwardTo(CharCodes2.Lt)) {
        this.sequenceIndex = 1;
      }
    } else {
      this.sequenceIndex = Number(c2 === CharCodes2.Lt);
    }
  }
  stateCDATASequence(c2) {
    if (c2 === Sequences.Cdata[this.sequenceIndex]) {
      if (++this.sequenceIndex === Sequences.Cdata.length) {
        this.state = State.InCommentLike;
        this.currentSequence = Sequences.CdataEnd;
        this.sequenceIndex = 0;
        this.sectionStart = this.index + 1;
      }
    } else {
      this.sequenceIndex = 0;
      this.state = State.InDeclaration;
      this.stateInDeclaration(c2);
    }
  }
  /**
   * When we wait for one specific character, we can speed things up
   * by skipping through the buffer until we find it.
   *
   * @returns Whether the character was found.
   */
  fastForwardTo(c2) {
    while (++this.index < this.buffer.length + this.offset) {
      if (this.buffer.charCodeAt(this.index - this.offset) === c2) {
        return true;
      }
    }
    this.index = this.buffer.length + this.offset - 1;
    return false;
  }
  /**
   * Comments and CDATA end with `-->` and `]]>`.
   *
   * Their common qualities are:
   * - Their end sequences have a distinct character they start with.
   * - That character is then repeated, so we have to check multiple repeats.
   * - All characters but the start character of the sequence can be skipped.
   */
  stateInCommentLike(c2) {
    if (c2 === this.currentSequence[this.sequenceIndex]) {
      if (++this.sequenceIndex === this.currentSequence.length) {
        if (this.currentSequence === Sequences.CdataEnd) {
          this.cbs.oncdata(this.sectionStart, this.index, 2);
        } else {
          this.cbs.oncomment(this.sectionStart, this.index, 2);
        }
        this.sequenceIndex = 0;
        this.sectionStart = this.index + 1;
        this.state = State.Text;
      }
    } else if (this.sequenceIndex === 0) {
      if (this.fastForwardTo(this.currentSequence[0])) {
        this.sequenceIndex = 1;
      }
    } else if (c2 !== this.currentSequence[this.sequenceIndex - 1]) {
      this.sequenceIndex = 0;
    }
  }
  /**
   * HTML only allows ASCII alpha characters (a-z and A-Z) at the beginning of a tag name.
   *
   * XML allows a lot more characters here (@see https://www.w3.org/TR/REC-xml/#NT-NameStartChar).
   * We allow anything that wouldn't end the tag.
   */
  isTagStartChar(c2) {
    return this.xmlMode ? !isEndOfTagSection(c2) : isASCIIAlpha(c2);
  }
  startSpecial(sequence, offset) {
    this.isSpecial = true;
    this.currentSequence = sequence;
    this.sequenceIndex = offset;
    this.state = State.SpecialStartSequence;
  }
  stateBeforeTagName(c2) {
    if (c2 === CharCodes2.ExclamationMark) {
      this.state = State.BeforeDeclaration;
      this.sectionStart = this.index + 1;
    } else if (c2 === CharCodes2.Questionmark) {
      this.state = State.InProcessingInstruction;
      this.sectionStart = this.index + 1;
    } else if (this.isTagStartChar(c2)) {
      const lower = c2 | 32;
      this.sectionStart = this.index;
      if (!this.xmlMode && lower === Sequences.TitleEnd[2]) {
        this.startSpecial(Sequences.TitleEnd, 3);
      } else {
        this.state = !this.xmlMode && lower === Sequences.ScriptEnd[2] ? State.BeforeSpecialS : State.InTagName;
      }
    } else if (c2 === CharCodes2.Slash) {
      this.state = State.BeforeClosingTagName;
    } else {
      this.state = State.Text;
      this.stateText(c2);
    }
  }
  stateInTagName(c2) {
    if (isEndOfTagSection(c2)) {
      this.cbs.onopentagname(this.sectionStart, this.index);
      this.sectionStart = -1;
      this.state = State.BeforeAttributeName;
      this.stateBeforeAttributeName(c2);
    }
  }
  stateBeforeClosingTagName(c2) {
    if (isWhitespace(c2)) {
    } else if (c2 === CharCodes2.Gt) {
      this.state = State.Text;
    } else {
      this.state = this.isTagStartChar(c2) ? State.InClosingTagName : State.InSpecialComment;
      this.sectionStart = this.index;
    }
  }
  stateInClosingTagName(c2) {
    if (c2 === CharCodes2.Gt || isWhitespace(c2)) {
      this.cbs.onclosetag(this.sectionStart, this.index);
      this.sectionStart = -1;
      this.state = State.AfterClosingTagName;
      this.stateAfterClosingTagName(c2);
    }
  }
  stateAfterClosingTagName(c2) {
    if (c2 === CharCodes2.Gt || this.fastForwardTo(CharCodes2.Gt)) {
      this.state = State.Text;
      this.baseState = State.Text;
      this.sectionStart = this.index + 1;
    }
  }
  stateBeforeAttributeName(c2) {
    if (c2 === CharCodes2.Gt) {
      this.cbs.onopentagend(this.index);
      if (this.isSpecial) {
        this.state = State.InSpecialTag;
        this.sequenceIndex = 0;
      } else {
        this.state = State.Text;
      }
      this.baseState = this.state;
      this.sectionStart = this.index + 1;
    } else if (c2 === CharCodes2.Slash) {
      this.state = State.InSelfClosingTag;
    } else if (!isWhitespace(c2)) {
      this.state = State.InAttributeName;
      this.sectionStart = this.index;
    }
  }
  stateInSelfClosingTag(c2) {
    if (c2 === CharCodes2.Gt) {
      this.cbs.onselfclosingtag(this.index);
      this.state = State.Text;
      this.baseState = State.Text;
      this.sectionStart = this.index + 1;
      this.isSpecial = false;
    } else if (!isWhitespace(c2)) {
      this.state = State.BeforeAttributeName;
      this.stateBeforeAttributeName(c2);
    }
  }
  stateInAttributeName(c2) {
    if (c2 === CharCodes2.Eq || isEndOfTagSection(c2)) {
      this.cbs.onattribname(this.sectionStart, this.index);
      this.sectionStart = -1;
      this.state = State.AfterAttributeName;
      this.stateAfterAttributeName(c2);
    }
  }
  stateAfterAttributeName(c2) {
    if (c2 === CharCodes2.Eq) {
      this.state = State.BeforeAttributeValue;
    } else if (c2 === CharCodes2.Slash || c2 === CharCodes2.Gt) {
      this.cbs.onattribend(QuoteType.NoValue, this.index);
      this.state = State.BeforeAttributeName;
      this.stateBeforeAttributeName(c2);
    } else if (!isWhitespace(c2)) {
      this.cbs.onattribend(QuoteType.NoValue, this.index);
      this.state = State.InAttributeName;
      this.sectionStart = this.index;
    }
  }
  stateBeforeAttributeValue(c2) {
    if (c2 === CharCodes2.DoubleQuote) {
      this.state = State.InAttributeValueDq;
      this.sectionStart = this.index + 1;
    } else if (c2 === CharCodes2.SingleQuote) {
      this.state = State.InAttributeValueSq;
      this.sectionStart = this.index + 1;
    } else if (!isWhitespace(c2)) {
      this.sectionStart = this.index;
      this.state = State.InAttributeValueNq;
      this.stateInAttributeValueNoQuotes(c2);
    }
  }
  handleInAttributeValue(c2, quote) {
    if (c2 === quote || !this.decodeEntities && this.fastForwardTo(quote)) {
      this.cbs.onattribdata(this.sectionStart, this.index);
      this.sectionStart = -1;
      this.cbs.onattribend(quote === CharCodes2.DoubleQuote ? QuoteType.Double : QuoteType.Single, this.index);
      this.state = State.BeforeAttributeName;
    } else if (this.decodeEntities && c2 === CharCodes2.Amp) {
      this.baseState = this.state;
      this.state = State.BeforeEntity;
    }
  }
  stateInAttributeValueDoubleQuotes(c2) {
    this.handleInAttributeValue(c2, CharCodes2.DoubleQuote);
  }
  stateInAttributeValueSingleQuotes(c2) {
    this.handleInAttributeValue(c2, CharCodes2.SingleQuote);
  }
  stateInAttributeValueNoQuotes(c2) {
    if (isWhitespace(c2) || c2 === CharCodes2.Gt) {
      this.cbs.onattribdata(this.sectionStart, this.index);
      this.sectionStart = -1;
      this.cbs.onattribend(QuoteType.Unquoted, this.index);
      this.state = State.BeforeAttributeName;
      this.stateBeforeAttributeName(c2);
    } else if (this.decodeEntities && c2 === CharCodes2.Amp) {
      this.baseState = this.state;
      this.state = State.BeforeEntity;
    }
  }
  stateBeforeDeclaration(c2) {
    if (c2 === CharCodes2.OpeningSquareBracket) {
      this.state = State.CDATASequence;
      this.sequenceIndex = 0;
    } else {
      this.state = c2 === CharCodes2.Dash ? State.BeforeComment : State.InDeclaration;
    }
  }
  stateInDeclaration(c2) {
    if (c2 === CharCodes2.Gt || this.fastForwardTo(CharCodes2.Gt)) {
      this.cbs.ondeclaration(this.sectionStart, this.index);
      this.state = State.Text;
      this.sectionStart = this.index + 1;
    }
  }
  stateInProcessingInstruction(c2) {
    if (c2 === CharCodes2.Gt || this.fastForwardTo(CharCodes2.Gt)) {
      this.cbs.onprocessinginstruction(this.sectionStart, this.index);
      this.state = State.Text;
      this.sectionStart = this.index + 1;
    }
  }
  stateBeforeComment(c2) {
    if (c2 === CharCodes2.Dash) {
      this.state = State.InCommentLike;
      this.currentSequence = Sequences.CommentEnd;
      this.sequenceIndex = 2;
      this.sectionStart = this.index + 1;
    } else {
      this.state = State.InDeclaration;
    }
  }
  stateInSpecialComment(c2) {
    if (c2 === CharCodes2.Gt || this.fastForwardTo(CharCodes2.Gt)) {
      this.cbs.oncomment(this.sectionStart, this.index, 0);
      this.state = State.Text;
      this.sectionStart = this.index + 1;
    }
  }
  stateBeforeSpecialS(c2) {
    const lower = c2 | 32;
    if (lower === Sequences.ScriptEnd[3]) {
      this.startSpecial(Sequences.ScriptEnd, 4);
    } else if (lower === Sequences.StyleEnd[3]) {
      this.startSpecial(Sequences.StyleEnd, 4);
    } else {
      this.state = State.InTagName;
      this.stateInTagName(c2);
    }
  }
  stateBeforeEntity(c2) {
    this.entityExcess = 1;
    this.entityResult = 0;
    if (c2 === CharCodes2.Number) {
      this.state = State.BeforeNumericEntity;
    } else if (c2 === CharCodes2.Amp) {
    } else {
      this.trieIndex = 0;
      this.trieCurrent = this.entityTrie[0];
      this.state = State.InNamedEntity;
      this.stateInNamedEntity(c2);
    }
  }
  stateInNamedEntity(c2) {
    this.entityExcess += 1;
    this.trieIndex = determineBranch(this.entityTrie, this.trieCurrent, this.trieIndex + 1, c2);
    if (this.trieIndex < 0) {
      this.emitNamedEntity();
      this.index--;
      return;
    }
    this.trieCurrent = this.entityTrie[this.trieIndex];
    const masked = this.trieCurrent & BinTrieFlags.VALUE_LENGTH;
    if (masked) {
      const valueLength = (masked >> 14) - 1;
      if (!this.allowLegacyEntity() && c2 !== CharCodes2.Semi) {
        this.trieIndex += valueLength;
      } else {
        const entityStart = this.index - this.entityExcess + 1;
        if (entityStart > this.sectionStart) {
          this.emitPartial(this.sectionStart, entityStart);
        }
        this.entityResult = this.trieIndex;
        this.trieIndex += valueLength;
        this.entityExcess = 0;
        this.sectionStart = this.index + 1;
        if (valueLength === 0) {
          this.emitNamedEntity();
        }
      }
    }
  }
  emitNamedEntity() {
    this.state = this.baseState;
    if (this.entityResult === 0) {
      return;
    }
    const valueLength = (this.entityTrie[this.entityResult] & BinTrieFlags.VALUE_LENGTH) >> 14;
    switch (valueLength) {
      case 1: {
        this.emitCodePoint(this.entityTrie[this.entityResult] & ~BinTrieFlags.VALUE_LENGTH);
        break;
      }
      case 2: {
        this.emitCodePoint(this.entityTrie[this.entityResult + 1]);
        break;
      }
      case 3: {
        this.emitCodePoint(this.entityTrie[this.entityResult + 1]);
        this.emitCodePoint(this.entityTrie[this.entityResult + 2]);
      }
    }
  }
  stateBeforeNumericEntity(c2) {
    if ((c2 | 32) === CharCodes2.LowerX) {
      this.entityExcess++;
      this.state = State.InHexEntity;
    } else {
      this.state = State.InNumericEntity;
      this.stateInNumericEntity(c2);
    }
  }
  emitNumericEntity(strict) {
    const entityStart = this.index - this.entityExcess - 1;
    const numberStart = entityStart + 2 + Number(this.state === State.InHexEntity);
    if (numberStart !== this.index) {
      if (entityStart > this.sectionStart) {
        this.emitPartial(this.sectionStart, entityStart);
      }
      this.sectionStart = this.index + Number(strict);
      this.emitCodePoint(replaceCodePoint(this.entityResult));
    }
    this.state = this.baseState;
  }
  stateInNumericEntity(c2) {
    if (c2 === CharCodes2.Semi) {
      this.emitNumericEntity(true);
    } else if (isNumber2(c2)) {
      this.entityResult = this.entityResult * 10 + (c2 - CharCodes2.Zero);
      this.entityExcess++;
    } else {
      if (this.allowLegacyEntity()) {
        this.emitNumericEntity(false);
      } else {
        this.state = this.baseState;
      }
      this.index--;
    }
  }
  stateInHexEntity(c2) {
    if (c2 === CharCodes2.Semi) {
      this.emitNumericEntity(true);
    } else if (isNumber2(c2)) {
      this.entityResult = this.entityResult * 16 + (c2 - CharCodes2.Zero);
      this.entityExcess++;
    } else if (isHexDigit(c2)) {
      this.entityResult = this.entityResult * 16 + ((c2 | 32) - CharCodes2.LowerA + 10);
      this.entityExcess++;
    } else {
      if (this.allowLegacyEntity()) {
        this.emitNumericEntity(false);
      } else {
        this.state = this.baseState;
      }
      this.index--;
    }
  }
  allowLegacyEntity() {
    return !this.xmlMode && (this.baseState === State.Text || this.baseState === State.InSpecialTag);
  }
  /**
   * Remove data that has already been consumed from the buffer.
   */
  cleanup() {
    if (this.running && this.sectionStart !== this.index) {
      if (this.state === State.Text || this.state === State.InSpecialTag && this.sequenceIndex === 0) {
        this.cbs.ontext(this.sectionStart, this.index);
        this.sectionStart = this.index;
      } else if (this.state === State.InAttributeValueDq || this.state === State.InAttributeValueSq || this.state === State.InAttributeValueNq) {
        this.cbs.onattribdata(this.sectionStart, this.index);
        this.sectionStart = this.index;
      }
    }
  }
  shouldContinue() {
    return this.index < this.buffer.length + this.offset && this.running;
  }
  /**
   * Iterates through the buffer, calling the function corresponding to the current state.
   *
   * States that are more likely to be hit are higher up, as a performance improvement.
   */
  parse() {
    while (this.shouldContinue()) {
      const c2 = this.buffer.charCodeAt(this.index - this.offset);
      switch (this.state) {
        case State.Text: {
          this.stateText(c2);
          break;
        }
        case State.SpecialStartSequence: {
          this.stateSpecialStartSequence(c2);
          break;
        }
        case State.InSpecialTag: {
          this.stateInSpecialTag(c2);
          break;
        }
        case State.CDATASequence: {
          this.stateCDATASequence(c2);
          break;
        }
        case State.InAttributeValueDq: {
          this.stateInAttributeValueDoubleQuotes(c2);
          break;
        }
        case State.InAttributeName: {
          this.stateInAttributeName(c2);
          break;
        }
        case State.InCommentLike: {
          this.stateInCommentLike(c2);
          break;
        }
        case State.InSpecialComment: {
          this.stateInSpecialComment(c2);
          break;
        }
        case State.BeforeAttributeName: {
          this.stateBeforeAttributeName(c2);
          break;
        }
        case State.InTagName: {
          this.stateInTagName(c2);
          break;
        }
        case State.InClosingTagName: {
          this.stateInClosingTagName(c2);
          break;
        }
        case State.BeforeTagName: {
          this.stateBeforeTagName(c2);
          break;
        }
        case State.AfterAttributeName: {
          this.stateAfterAttributeName(c2);
          break;
        }
        case State.InAttributeValueSq: {
          this.stateInAttributeValueSingleQuotes(c2);
          break;
        }
        case State.BeforeAttributeValue: {
          this.stateBeforeAttributeValue(c2);
          break;
        }
        case State.BeforeClosingTagName: {
          this.stateBeforeClosingTagName(c2);
          break;
        }
        case State.AfterClosingTagName: {
          this.stateAfterClosingTagName(c2);
          break;
        }
        case State.BeforeSpecialS: {
          this.stateBeforeSpecialS(c2);
          break;
        }
        case State.InAttributeValueNq: {
          this.stateInAttributeValueNoQuotes(c2);
          break;
        }
        case State.InSelfClosingTag: {
          this.stateInSelfClosingTag(c2);
          break;
        }
        case State.InDeclaration: {
          this.stateInDeclaration(c2);
          break;
        }
        case State.BeforeDeclaration: {
          this.stateBeforeDeclaration(c2);
          break;
        }
        case State.BeforeComment: {
          this.stateBeforeComment(c2);
          break;
        }
        case State.InProcessingInstruction: {
          this.stateInProcessingInstruction(c2);
          break;
        }
        case State.InNamedEntity: {
          this.stateInNamedEntity(c2);
          break;
        }
        case State.BeforeEntity: {
          this.stateBeforeEntity(c2);
          break;
        }
        case State.InHexEntity: {
          this.stateInHexEntity(c2);
          break;
        }
        case State.InNumericEntity: {
          this.stateInNumericEntity(c2);
          break;
        }
        default: {
          this.stateBeforeNumericEntity(c2);
        }
      }
      this.index++;
    }
    this.cleanup();
  }
  finish() {
    if (this.state === State.InNamedEntity) {
      this.emitNamedEntity();
    }
    if (this.sectionStart < this.index) {
      this.handleTrailingData();
    }
    this.cbs.onend();
  }
  /** Handle any trailing data. */
  handleTrailingData() {
    const endIndex = this.buffer.length + this.offset;
    if (this.state === State.InCommentLike) {
      if (this.currentSequence === Sequences.CdataEnd) {
        this.cbs.oncdata(this.sectionStart, endIndex, 0);
      } else {
        this.cbs.oncomment(this.sectionStart, endIndex, 0);
      }
    } else if (this.state === State.InNumericEntity && this.allowLegacyEntity()) {
      this.emitNumericEntity(false);
    } else if (this.state === State.InHexEntity && this.allowLegacyEntity()) {
      this.emitNumericEntity(false);
    } else if (this.state === State.InTagName || this.state === State.BeforeAttributeName || this.state === State.BeforeAttributeValue || this.state === State.AfterAttributeName || this.state === State.InAttributeName || this.state === State.InAttributeValueSq || this.state === State.InAttributeValueDq || this.state === State.InAttributeValueNq || this.state === State.InClosingTagName) {
    } else {
      this.cbs.ontext(this.sectionStart, endIndex);
    }
  }
  emitPartial(start, endIndex) {
    if (this.baseState !== State.Text && this.baseState !== State.InSpecialTag) {
      this.cbs.onattribdata(start, endIndex);
    } else {
      this.cbs.ontext(start, endIndex);
    }
  }
  emitCodePoint(cp) {
    if (this.baseState !== State.Text && this.baseState !== State.InSpecialTag) {
      this.cbs.onattribentity(cp);
    } else {
      this.cbs.ontextentity(cp);
    }
  }
};

// node_modules/htmlparser2/lib/esm/Parser.js
var formTags = /* @__PURE__ */ new Set([
  "input",
  "option",
  "optgroup",
  "select",
  "button",
  "datalist",
  "textarea"
]);
var pTag = /* @__PURE__ */ new Set(["p"]);
var tableSectionTags = /* @__PURE__ */ new Set(["thead", "tbody"]);
var ddtTags = /* @__PURE__ */ new Set(["dd", "dt"]);
var rtpTags = /* @__PURE__ */ new Set(["rt", "rp"]);
var openImpliesClose = /* @__PURE__ */ new Map([
  ["tr", /* @__PURE__ */ new Set(["tr", "th", "td"])],
  ["th", /* @__PURE__ */ new Set(["th"])],
  ["td", /* @__PURE__ */ new Set(["thead", "th", "td"])],
  ["body", /* @__PURE__ */ new Set(["head", "link", "script"])],
  ["li", /* @__PURE__ */ new Set(["li"])],
  ["p", pTag],
  ["h1", pTag],
  ["h2", pTag],
  ["h3", pTag],
  ["h4", pTag],
  ["h5", pTag],
  ["h6", pTag],
  ["select", formTags],
  ["input", formTags],
  ["output", formTags],
  ["button", formTags],
  ["datalist", formTags],
  ["textarea", formTags],
  ["option", /* @__PURE__ */ new Set(["option"])],
  ["optgroup", /* @__PURE__ */ new Set(["optgroup", "option"])],
  ["dd", ddtTags],
  ["dt", ddtTags],
  ["address", pTag],
  ["article", pTag],
  ["aside", pTag],
  ["blockquote", pTag],
  ["details", pTag],
  ["div", pTag],
  ["dl", pTag],
  ["fieldset", pTag],
  ["figcaption", pTag],
  ["figure", pTag],
  ["footer", pTag],
  ["form", pTag],
  ["header", pTag],
  ["hr", pTag],
  ["main", pTag],
  ["nav", pTag],
  ["ol", pTag],
  ["pre", pTag],
  ["section", pTag],
  ["table", pTag],
  ["ul", pTag],
  ["rt", rtpTags],
  ["rp", rtpTags],
  ["tbody", tableSectionTags],
  ["tfoot", tableSectionTags]
]);
var voidElements = /* @__PURE__ */ new Set([
  "area",
  "base",
  "basefont",
  "br",
  "col",
  "command",
  "embed",
  "frame",
  "hr",
  "img",
  "input",
  "isindex",
  "keygen",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr"
]);
var foreignContextElements = /* @__PURE__ */ new Set(["math", "svg"]);
var htmlIntegrationElements = /* @__PURE__ */ new Set([
  "mi",
  "mo",
  "mn",
  "ms",
  "mtext",
  "annotation-xml",
  "foreignobject",
  "desc",
  "title"
]);
var reNameEnd = /\s|\//;
var Parser = class {
  static {
    __name(this, "Parser");
  }
  constructor(cbs, options = {}) {
    var _a4, _b, _c, _d, _e3;
    this.options = options;
    this.startIndex = 0;
    this.endIndex = 0;
    this.openTagStart = 0;
    this.tagname = "";
    this.attribname = "";
    this.attribvalue = "";
    this.attribs = null;
    this.stack = [];
    this.foreignContext = [];
    this.buffers = [];
    this.bufferOffset = 0;
    this.writeIndex = 0;
    this.ended = false;
    this.cbs = cbs !== null && cbs !== void 0 ? cbs : {};
    this.lowerCaseTagNames = (_a4 = options.lowerCaseTags) !== null && _a4 !== void 0 ? _a4 : !options.xmlMode;
    this.lowerCaseAttributeNames = (_b = options.lowerCaseAttributeNames) !== null && _b !== void 0 ? _b : !options.xmlMode;
    this.tokenizer = new ((_c = options.Tokenizer) !== null && _c !== void 0 ? _c : Tokenizer)(this.options, this);
    (_e3 = (_d = this.cbs).onparserinit) === null || _e3 === void 0 ? void 0 : _e3.call(_d, this);
  }
  // Tokenizer event handlers
  /** @internal */
  ontext(start, endIndex) {
    var _a4, _b;
    const data = this.getSlice(start, endIndex);
    this.endIndex = endIndex - 1;
    (_b = (_a4 = this.cbs).ontext) === null || _b === void 0 ? void 0 : _b.call(_a4, data);
    this.startIndex = endIndex;
  }
  /** @internal */
  ontextentity(cp) {
    var _a4, _b;
    const index = this.tokenizer.getSectionStart();
    this.endIndex = index - 1;
    (_b = (_a4 = this.cbs).ontext) === null || _b === void 0 ? void 0 : _b.call(_a4, fromCodePoint(cp));
    this.startIndex = index;
  }
  isVoidElement(name2) {
    return !this.options.xmlMode && voidElements.has(name2);
  }
  /** @internal */
  onopentagname(start, endIndex) {
    this.endIndex = endIndex;
    let name2 = this.getSlice(start, endIndex);
    if (this.lowerCaseTagNames) {
      name2 = name2.toLowerCase();
    }
    this.emitOpenTag(name2);
  }
  emitOpenTag(name2) {
    var _a4, _b, _c, _d;
    this.openTagStart = this.startIndex;
    this.tagname = name2;
    const impliesClose = !this.options.xmlMode && openImpliesClose.get(name2);
    if (impliesClose) {
      while (this.stack.length > 0 && impliesClose.has(this.stack[this.stack.length - 1])) {
        const element = this.stack.pop();
        (_b = (_a4 = this.cbs).onclosetag) === null || _b === void 0 ? void 0 : _b.call(_a4, element, true);
      }
    }
    if (!this.isVoidElement(name2)) {
      this.stack.push(name2);
      if (foreignContextElements.has(name2)) {
        this.foreignContext.push(true);
      } else if (htmlIntegrationElements.has(name2)) {
        this.foreignContext.push(false);
      }
    }
    (_d = (_c = this.cbs).onopentagname) === null || _d === void 0 ? void 0 : _d.call(_c, name2);
    if (this.cbs.onopentag)
      this.attribs = {};
  }
  endOpenTag(isImplied) {
    var _a4, _b;
    this.startIndex = this.openTagStart;
    if (this.attribs) {
      (_b = (_a4 = this.cbs).onopentag) === null || _b === void 0 ? void 0 : _b.call(_a4, this.tagname, this.attribs, isImplied);
      this.attribs = null;
    }
    if (this.cbs.onclosetag && this.isVoidElement(this.tagname)) {
      this.cbs.onclosetag(this.tagname, true);
    }
    this.tagname = "";
  }
  /** @internal */
  onopentagend(endIndex) {
    this.endIndex = endIndex;
    this.endOpenTag(false);
    this.startIndex = endIndex + 1;
  }
  /** @internal */
  onclosetag(start, endIndex) {
    var _a4, _b, _c, _d, _e3, _f;
    this.endIndex = endIndex;
    let name2 = this.getSlice(start, endIndex);
    if (this.lowerCaseTagNames) {
      name2 = name2.toLowerCase();
    }
    if (foreignContextElements.has(name2) || htmlIntegrationElements.has(name2)) {
      this.foreignContext.pop();
    }
    if (!this.isVoidElement(name2)) {
      const pos = this.stack.lastIndexOf(name2);
      if (pos !== -1) {
        if (this.cbs.onclosetag) {
          let count = this.stack.length - pos;
          while (count--) {
            this.cbs.onclosetag(this.stack.pop(), count !== 0);
          }
        } else
          this.stack.length = pos;
      } else if (!this.options.xmlMode && name2 === "p") {
        this.emitOpenTag("p");
        this.closeCurrentTag(true);
      }
    } else if (!this.options.xmlMode && name2 === "br") {
      (_b = (_a4 = this.cbs).onopentagname) === null || _b === void 0 ? void 0 : _b.call(_a4, "br");
      (_d = (_c = this.cbs).onopentag) === null || _d === void 0 ? void 0 : _d.call(_c, "br", {}, true);
      (_f = (_e3 = this.cbs).onclosetag) === null || _f === void 0 ? void 0 : _f.call(_e3, "br", false);
    }
    this.startIndex = endIndex + 1;
  }
  /** @internal */
  onselfclosingtag(endIndex) {
    this.endIndex = endIndex;
    if (this.options.xmlMode || this.options.recognizeSelfClosing || this.foreignContext[this.foreignContext.length - 1]) {
      this.closeCurrentTag(false);
      this.startIndex = endIndex + 1;
    } else {
      this.onopentagend(endIndex);
    }
  }
  closeCurrentTag(isOpenImplied) {
    var _a4, _b;
    const name2 = this.tagname;
    this.endOpenTag(isOpenImplied);
    if (this.stack[this.stack.length - 1] === name2) {
      (_b = (_a4 = this.cbs).onclosetag) === null || _b === void 0 ? void 0 : _b.call(_a4, name2, !isOpenImplied);
      this.stack.pop();
    }
  }
  /** @internal */
  onattribname(start, endIndex) {
    this.startIndex = start;
    const name2 = this.getSlice(start, endIndex);
    this.attribname = this.lowerCaseAttributeNames ? name2.toLowerCase() : name2;
  }
  /** @internal */
  onattribdata(start, endIndex) {
    this.attribvalue += this.getSlice(start, endIndex);
  }
  /** @internal */
  onattribentity(cp) {
    this.attribvalue += fromCodePoint(cp);
  }
  /** @internal */
  onattribend(quote, endIndex) {
    var _a4, _b;
    this.endIndex = endIndex;
    (_b = (_a4 = this.cbs).onattribute) === null || _b === void 0 ? void 0 : _b.call(_a4, this.attribname, this.attribvalue, quote === QuoteType.Double ? '"' : quote === QuoteType.Single ? "'" : quote === QuoteType.NoValue ? void 0 : null);
    if (this.attribs && !Object.prototype.hasOwnProperty.call(this.attribs, this.attribname)) {
      this.attribs[this.attribname] = this.attribvalue;
    }
    this.attribvalue = "";
  }
  getInstructionName(value) {
    const index = value.search(reNameEnd);
    let name2 = index < 0 ? value : value.substr(0, index);
    if (this.lowerCaseTagNames) {
      name2 = name2.toLowerCase();
    }
    return name2;
  }
  /** @internal */
  ondeclaration(start, endIndex) {
    this.endIndex = endIndex;
    const value = this.getSlice(start, endIndex);
    if (this.cbs.onprocessinginstruction) {
      const name2 = this.getInstructionName(value);
      this.cbs.onprocessinginstruction(`!${name2}`, `!${value}`);
    }
    this.startIndex = endIndex + 1;
  }
  /** @internal */
  onprocessinginstruction(start, endIndex) {
    this.endIndex = endIndex;
    const value = this.getSlice(start, endIndex);
    if (this.cbs.onprocessinginstruction) {
      const name2 = this.getInstructionName(value);
      this.cbs.onprocessinginstruction(`?${name2}`, `?${value}`);
    }
    this.startIndex = endIndex + 1;
  }
  /** @internal */
  oncomment(start, endIndex, offset) {
    var _a4, _b, _c, _d;
    this.endIndex = endIndex;
    (_b = (_a4 = this.cbs).oncomment) === null || _b === void 0 ? void 0 : _b.call(_a4, this.getSlice(start, endIndex - offset));
    (_d = (_c = this.cbs).oncommentend) === null || _d === void 0 ? void 0 : _d.call(_c);
    this.startIndex = endIndex + 1;
  }
  /** @internal */
  oncdata(start, endIndex, offset) {
    var _a4, _b, _c, _d, _e3, _f, _g, _h, _j, _k;
    this.endIndex = endIndex;
    const value = this.getSlice(start, endIndex - offset);
    if (this.options.xmlMode || this.options.recognizeCDATA) {
      (_b = (_a4 = this.cbs).oncdatastart) === null || _b === void 0 ? void 0 : _b.call(_a4);
      (_d = (_c = this.cbs).ontext) === null || _d === void 0 ? void 0 : _d.call(_c, value);
      (_f = (_e3 = this.cbs).oncdataend) === null || _f === void 0 ? void 0 : _f.call(_e3);
    } else {
      (_h = (_g = this.cbs).oncomment) === null || _h === void 0 ? void 0 : _h.call(_g, `[CDATA[${value}]]`);
      (_k = (_j = this.cbs).oncommentend) === null || _k === void 0 ? void 0 : _k.call(_j);
    }
    this.startIndex = endIndex + 1;
  }
  /** @internal */
  onend() {
    var _a4, _b;
    if (this.cbs.onclosetag) {
      this.endIndex = this.startIndex;
      for (let index = this.stack.length; index > 0; this.cbs.onclosetag(this.stack[--index], true))
        ;
    }
    (_b = (_a4 = this.cbs).onend) === null || _b === void 0 ? void 0 : _b.call(_a4);
  }
  /**
   * Resets the parser to a blank state, ready to parse a new HTML document
   */
  reset() {
    var _a4, _b, _c, _d;
    (_b = (_a4 = this.cbs).onreset) === null || _b === void 0 ? void 0 : _b.call(_a4);
    this.tokenizer.reset();
    this.tagname = "";
    this.attribname = "";
    this.attribs = null;
    this.stack.length = 0;
    this.startIndex = 0;
    this.endIndex = 0;
    (_d = (_c = this.cbs).onparserinit) === null || _d === void 0 ? void 0 : _d.call(_c, this);
    this.buffers.length = 0;
    this.bufferOffset = 0;
    this.writeIndex = 0;
    this.ended = false;
  }
  /**
   * Resets the parser, then parses a complete document and
   * pushes it to the handler.
   *
   * @param data Document to parse.
   */
  parseComplete(data) {
    this.reset();
    this.end(data);
  }
  getSlice(start, end) {
    while (start - this.bufferOffset >= this.buffers[0].length) {
      this.shiftBuffer();
    }
    let slice = this.buffers[0].slice(start - this.bufferOffset, end - this.bufferOffset);
    while (end - this.bufferOffset > this.buffers[0].length) {
      this.shiftBuffer();
      slice += this.buffers[0].slice(0, end - this.bufferOffset);
    }
    return slice;
  }
  shiftBuffer() {
    this.bufferOffset += this.buffers[0].length;
    this.writeIndex--;
    this.buffers.shift();
  }
  /**
   * Parses a chunk of data and calls the corresponding callbacks.
   *
   * @param chunk Chunk to parse.
   */
  write(chunk) {
    var _a4, _b;
    if (this.ended) {
      (_b = (_a4 = this.cbs).onerror) === null || _b === void 0 ? void 0 : _b.call(_a4, new Error(".write() after done!"));
      return;
    }
    this.buffers.push(chunk);
    if (this.tokenizer.running) {
      this.tokenizer.write(chunk);
      this.writeIndex++;
    }
  }
  /**
   * Parses the end of the buffer and clears the stack, calls onend.
   *
   * @param chunk Optional final chunk to parse.
   */
  end(chunk) {
    var _a4, _b;
    if (this.ended) {
      (_b = (_a4 = this.cbs).onerror) === null || _b === void 0 ? void 0 : _b.call(_a4, new Error(".end() after done!"));
      return;
    }
    if (chunk)
      this.write(chunk);
    this.ended = true;
    this.tokenizer.end();
  }
  /**
   * Pauses parsing. The parser won't emit events until `resume` is called.
   */
  pause() {
    this.tokenizer.pause();
  }
  /**
   * Resumes parsing after `pause` was called.
   */
  resume() {
    this.tokenizer.resume();
    while (this.tokenizer.running && this.writeIndex < this.buffers.length) {
      this.tokenizer.write(this.buffers[this.writeIndex++]);
    }
    if (this.ended)
      this.tokenizer.end();
  }
  /**
   * Alias of `write`, for backwards compatibility.
   *
   * @param chunk Chunk to parse.
   * @deprecated
   */
  parseChunk(chunk) {
    this.write(chunk);
  }
  /**
   * Alias of `end`, for backwards compatibility.
   *
   * @param chunk Optional final chunk to parse.
   * @deprecated
   */
  done(chunk) {
    this.end(chunk);
  }
};

// node_modules/domutils/lib/esm/index.js
init_esm();

// node_modules/domutils/lib/esm/stringify.js
init_esm();

// node_modules/dom-serializer/lib/esm/index.js
init_esm();

// node_modules/entities/lib/esm/index.js
init_esm();

// node_modules/entities/lib/esm/encode.js
init_esm();

// node_modules/entities/lib/esm/generated/encode-html.js
init_esm();
function restoreDiff(arr) {
  for (let i = 1; i < arr.length; i++) {
    arr[i][0] += arr[i - 1][0] + 1;
  }
  return arr;
}
__name(restoreDiff, "restoreDiff");
var encode_html_default = new Map(/* @__PURE__ */ restoreDiff([[9, "&Tab;"], [0, "&NewLine;"], [22, "&excl;"], [0, "&quot;"], [0, "&num;"], [0, "&dollar;"], [0, "&percnt;"], [0, "&amp;"], [0, "&apos;"], [0, "&lpar;"], [0, "&rpar;"], [0, "&ast;"], [0, "&plus;"], [0, "&comma;"], [1, "&period;"], [0, "&sol;"], [10, "&colon;"], [0, "&semi;"], [0, { v: "&lt;", n: 8402, o: "&nvlt;" }], [0, { v: "&equals;", n: 8421, o: "&bne;" }], [0, { v: "&gt;", n: 8402, o: "&nvgt;" }], [0, "&quest;"], [0, "&commat;"], [26, "&lbrack;"], [0, "&bsol;"], [0, "&rbrack;"], [0, "&Hat;"], [0, "&lowbar;"], [0, "&DiacriticalGrave;"], [5, { n: 106, o: "&fjlig;" }], [20, "&lbrace;"], [0, "&verbar;"], [0, "&rbrace;"], [34, "&nbsp;"], [0, "&iexcl;"], [0, "&cent;"], [0, "&pound;"], [0, "&curren;"], [0, "&yen;"], [0, "&brvbar;"], [0, "&sect;"], [0, "&die;"], [0, "&copy;"], [0, "&ordf;"], [0, "&laquo;"], [0, "&not;"], [0, "&shy;"], [0, "&circledR;"], [0, "&macr;"], [0, "&deg;"], [0, "&PlusMinus;"], [0, "&sup2;"], [0, "&sup3;"], [0, "&acute;"], [0, "&micro;"], [0, "&para;"], [0, "&centerdot;"], [0, "&cedil;"], [0, "&sup1;"], [0, "&ordm;"], [0, "&raquo;"], [0, "&frac14;"], [0, "&frac12;"], [0, "&frac34;"], [0, "&iquest;"], [0, "&Agrave;"], [0, "&Aacute;"], [0, "&Acirc;"], [0, "&Atilde;"], [0, "&Auml;"], [0, "&angst;"], [0, "&AElig;"], [0, "&Ccedil;"], [0, "&Egrave;"], [0, "&Eacute;"], [0, "&Ecirc;"], [0, "&Euml;"], [0, "&Igrave;"], [0, "&Iacute;"], [0, "&Icirc;"], [0, "&Iuml;"], [0, "&ETH;"], [0, "&Ntilde;"], [0, "&Ograve;"], [0, "&Oacute;"], [0, "&Ocirc;"], [0, "&Otilde;"], [0, "&Ouml;"], [0, "&times;"], [0, "&Oslash;"], [0, "&Ugrave;"], [0, "&Uacute;"], [0, "&Ucirc;"], [0, "&Uuml;"], [0, "&Yacute;"], [0, "&THORN;"], [0, "&szlig;"], [0, "&agrave;"], [0, "&aacute;"], [0, "&acirc;"], [0, "&atilde;"], [0, "&auml;"], [0, "&aring;"], [0, "&aelig;"], [0, "&ccedil;"], [0, "&egrave;"], [0, "&eacute;"], [0, "&ecirc;"], [0, "&euml;"], [0, "&igrave;"], [0, "&iacute;"], [0, "&icirc;"], [0, "&iuml;"], [0, "&eth;"], [0, "&ntilde;"], [0, "&ograve;"], [0, "&oacute;"], [0, "&ocirc;"], [0, "&otilde;"], [0, "&ouml;"], [0, "&div;"], [0, "&oslash;"], [0, "&ugrave;"], [0, "&uacute;"], [0, "&ucirc;"], [0, "&uuml;"], [0, "&yacute;"], [0, "&thorn;"], [0, "&yuml;"], [0, "&Amacr;"], [0, "&amacr;"], [0, "&Abreve;"], [0, "&abreve;"], [0, "&Aogon;"], [0, "&aogon;"], [0, "&Cacute;"], [0, "&cacute;"], [0, "&Ccirc;"], [0, "&ccirc;"], [0, "&Cdot;"], [0, "&cdot;"], [0, "&Ccaron;"], [0, "&ccaron;"], [0, "&Dcaron;"], [0, "&dcaron;"], [0, "&Dstrok;"], [0, "&dstrok;"], [0, "&Emacr;"], [0, "&emacr;"], [2, "&Edot;"], [0, "&edot;"], [0, "&Eogon;"], [0, "&eogon;"], [0, "&Ecaron;"], [0, "&ecaron;"], [0, "&Gcirc;"], [0, "&gcirc;"], [0, "&Gbreve;"], [0, "&gbreve;"], [0, "&Gdot;"], [0, "&gdot;"], [0, "&Gcedil;"], [1, "&Hcirc;"], [0, "&hcirc;"], [0, "&Hstrok;"], [0, "&hstrok;"], [0, "&Itilde;"], [0, "&itilde;"], [0, "&Imacr;"], [0, "&imacr;"], [2, "&Iogon;"], [0, "&iogon;"], [0, "&Idot;"], [0, "&imath;"], [0, "&IJlig;"], [0, "&ijlig;"], [0, "&Jcirc;"], [0, "&jcirc;"], [0, "&Kcedil;"], [0, "&kcedil;"], [0, "&kgreen;"], [0, "&Lacute;"], [0, "&lacute;"], [0, "&Lcedil;"], [0, "&lcedil;"], [0, "&Lcaron;"], [0, "&lcaron;"], [0, "&Lmidot;"], [0, "&lmidot;"], [0, "&Lstrok;"], [0, "&lstrok;"], [0, "&Nacute;"], [0, "&nacute;"], [0, "&Ncedil;"], [0, "&ncedil;"], [0, "&Ncaron;"], [0, "&ncaron;"], [0, "&napos;"], [0, "&ENG;"], [0, "&eng;"], [0, "&Omacr;"], [0, "&omacr;"], [2, "&Odblac;"], [0, "&odblac;"], [0, "&OElig;"], [0, "&oelig;"], [0, "&Racute;"], [0, "&racute;"], [0, "&Rcedil;"], [0, "&rcedil;"], [0, "&Rcaron;"], [0, "&rcaron;"], [0, "&Sacute;"], [0, "&sacute;"], [0, "&Scirc;"], [0, "&scirc;"], [0, "&Scedil;"], [0, "&scedil;"], [0, "&Scaron;"], [0, "&scaron;"], [0, "&Tcedil;"], [0, "&tcedil;"], [0, "&Tcaron;"], [0, "&tcaron;"], [0, "&Tstrok;"], [0, "&tstrok;"], [0, "&Utilde;"], [0, "&utilde;"], [0, "&Umacr;"], [0, "&umacr;"], [0, "&Ubreve;"], [0, "&ubreve;"], [0, "&Uring;"], [0, "&uring;"], [0, "&Udblac;"], [0, "&udblac;"], [0, "&Uogon;"], [0, "&uogon;"], [0, "&Wcirc;"], [0, "&wcirc;"], [0, "&Ycirc;"], [0, "&ycirc;"], [0, "&Yuml;"], [0, "&Zacute;"], [0, "&zacute;"], [0, "&Zdot;"], [0, "&zdot;"], [0, "&Zcaron;"], [0, "&zcaron;"], [19, "&fnof;"], [34, "&imped;"], [63, "&gacute;"], [65, "&jmath;"], [142, "&circ;"], [0, "&caron;"], [16, "&breve;"], [0, "&DiacriticalDot;"], [0, "&ring;"], [0, "&ogon;"], [0, "&DiacriticalTilde;"], [0, "&dblac;"], [51, "&DownBreve;"], [127, "&Alpha;"], [0, "&Beta;"], [0, "&Gamma;"], [0, "&Delta;"], [0, "&Epsilon;"], [0, "&Zeta;"], [0, "&Eta;"], [0, "&Theta;"], [0, "&Iota;"], [0, "&Kappa;"], [0, "&Lambda;"], [0, "&Mu;"], [0, "&Nu;"], [0, "&Xi;"], [0, "&Omicron;"], [0, "&Pi;"], [0, "&Rho;"], [1, "&Sigma;"], [0, "&Tau;"], [0, "&Upsilon;"], [0, "&Phi;"], [0, "&Chi;"], [0, "&Psi;"], [0, "&ohm;"], [7, "&alpha;"], [0, "&beta;"], [0, "&gamma;"], [0, "&delta;"], [0, "&epsi;"], [0, "&zeta;"], [0, "&eta;"], [0, "&theta;"], [0, "&iota;"], [0, "&kappa;"], [0, "&lambda;"], [0, "&mu;"], [0, "&nu;"], [0, "&xi;"], [0, "&omicron;"], [0, "&pi;"], [0, "&rho;"], [0, "&sigmaf;"], [0, "&sigma;"], [0, "&tau;"], [0, "&upsi;"], [0, "&phi;"], [0, "&chi;"], [0, "&psi;"], [0, "&omega;"], [7, "&thetasym;"], [0, "&Upsi;"], [2, "&phiv;"], [0, "&piv;"], [5, "&Gammad;"], [0, "&digamma;"], [18, "&kappav;"], [0, "&rhov;"], [3, "&epsiv;"], [0, "&backepsilon;"], [10, "&IOcy;"], [0, "&DJcy;"], [0, "&GJcy;"], [0, "&Jukcy;"], [0, "&DScy;"], [0, "&Iukcy;"], [0, "&YIcy;"], [0, "&Jsercy;"], [0, "&LJcy;"], [0, "&NJcy;"], [0, "&TSHcy;"], [0, "&KJcy;"], [1, "&Ubrcy;"], [0, "&DZcy;"], [0, "&Acy;"], [0, "&Bcy;"], [0, "&Vcy;"], [0, "&Gcy;"], [0, "&Dcy;"], [0, "&IEcy;"], [0, "&ZHcy;"], [0, "&Zcy;"], [0, "&Icy;"], [0, "&Jcy;"], [0, "&Kcy;"], [0, "&Lcy;"], [0, "&Mcy;"], [0, "&Ncy;"], [0, "&Ocy;"], [0, "&Pcy;"], [0, "&Rcy;"], [0, "&Scy;"], [0, "&Tcy;"], [0, "&Ucy;"], [0, "&Fcy;"], [0, "&KHcy;"], [0, "&TScy;"], [0, "&CHcy;"], [0, "&SHcy;"], [0, "&SHCHcy;"], [0, "&HARDcy;"], [0, "&Ycy;"], [0, "&SOFTcy;"], [0, "&Ecy;"], [0, "&YUcy;"], [0, "&YAcy;"], [0, "&acy;"], [0, "&bcy;"], [0, "&vcy;"], [0, "&gcy;"], [0, "&dcy;"], [0, "&iecy;"], [0, "&zhcy;"], [0, "&zcy;"], [0, "&icy;"], [0, "&jcy;"], [0, "&kcy;"], [0, "&lcy;"], [0, "&mcy;"], [0, "&ncy;"], [0, "&ocy;"], [0, "&pcy;"], [0, "&rcy;"], [0, "&scy;"], [0, "&tcy;"], [0, "&ucy;"], [0, "&fcy;"], [0, "&khcy;"], [0, "&tscy;"], [0, "&chcy;"], [0, "&shcy;"], [0, "&shchcy;"], [0, "&hardcy;"], [0, "&ycy;"], [0, "&softcy;"], [0, "&ecy;"], [0, "&yucy;"], [0, "&yacy;"], [1, "&iocy;"], [0, "&djcy;"], [0, "&gjcy;"], [0, "&jukcy;"], [0, "&dscy;"], [0, "&iukcy;"], [0, "&yicy;"], [0, "&jsercy;"], [0, "&ljcy;"], [0, "&njcy;"], [0, "&tshcy;"], [0, "&kjcy;"], [1, "&ubrcy;"], [0, "&dzcy;"], [7074, "&ensp;"], [0, "&emsp;"], [0, "&emsp13;"], [0, "&emsp14;"], [1, "&numsp;"], [0, "&puncsp;"], [0, "&ThinSpace;"], [0, "&hairsp;"], [0, "&NegativeMediumSpace;"], [0, "&zwnj;"], [0, "&zwj;"], [0, "&lrm;"], [0, "&rlm;"], [0, "&dash;"], [2, "&ndash;"], [0, "&mdash;"], [0, "&horbar;"], [0, "&Verbar;"], [1, "&lsquo;"], [0, "&CloseCurlyQuote;"], [0, "&lsquor;"], [1, "&ldquo;"], [0, "&CloseCurlyDoubleQuote;"], [0, "&bdquo;"], [1, "&dagger;"], [0, "&Dagger;"], [0, "&bull;"], [2, "&nldr;"], [0, "&hellip;"], [9, "&permil;"], [0, "&pertenk;"], [0, "&prime;"], [0, "&Prime;"], [0, "&tprime;"], [0, "&backprime;"], [3, "&lsaquo;"], [0, "&rsaquo;"], [3, "&oline;"], [2, "&caret;"], [1, "&hybull;"], [0, "&frasl;"], [10, "&bsemi;"], [7, "&qprime;"], [7, { v: "&MediumSpace;", n: 8202, o: "&ThickSpace;" }], [0, "&NoBreak;"], [0, "&af;"], [0, "&InvisibleTimes;"], [0, "&ic;"], [72, "&euro;"], [46, "&tdot;"], [0, "&DotDot;"], [37, "&complexes;"], [2, "&incare;"], [4, "&gscr;"], [0, "&hamilt;"], [0, "&Hfr;"], [0, "&Hopf;"], [0, "&planckh;"], [0, "&hbar;"], [0, "&imagline;"], [0, "&Ifr;"], [0, "&lagran;"], [0, "&ell;"], [1, "&naturals;"], [0, "&numero;"], [0, "&copysr;"], [0, "&weierp;"], [0, "&Popf;"], [0, "&Qopf;"], [0, "&realine;"], [0, "&real;"], [0, "&reals;"], [0, "&rx;"], [3, "&trade;"], [1, "&integers;"], [2, "&mho;"], [0, "&zeetrf;"], [0, "&iiota;"], [2, "&bernou;"], [0, "&Cayleys;"], [1, "&escr;"], [0, "&Escr;"], [0, "&Fouriertrf;"], [1, "&Mellintrf;"], [0, "&order;"], [0, "&alefsym;"], [0, "&beth;"], [0, "&gimel;"], [0, "&daleth;"], [12, "&CapitalDifferentialD;"], [0, "&dd;"], [0, "&ee;"], [0, "&ii;"], [10, "&frac13;"], [0, "&frac23;"], [0, "&frac15;"], [0, "&frac25;"], [0, "&frac35;"], [0, "&frac45;"], [0, "&frac16;"], [0, "&frac56;"], [0, "&frac18;"], [0, "&frac38;"], [0, "&frac58;"], [0, "&frac78;"], [49, "&larr;"], [0, "&ShortUpArrow;"], [0, "&rarr;"], [0, "&darr;"], [0, "&harr;"], [0, "&updownarrow;"], [0, "&nwarr;"], [0, "&nearr;"], [0, "&LowerRightArrow;"], [0, "&LowerLeftArrow;"], [0, "&nlarr;"], [0, "&nrarr;"], [1, { v: "&rarrw;", n: 824, o: "&nrarrw;" }], [0, "&Larr;"], [0, "&Uarr;"], [0, "&Rarr;"], [0, "&Darr;"], [0, "&larrtl;"], [0, "&rarrtl;"], [0, "&LeftTeeArrow;"], [0, "&mapstoup;"], [0, "&map;"], [0, "&DownTeeArrow;"], [1, "&hookleftarrow;"], [0, "&hookrightarrow;"], [0, "&larrlp;"], [0, "&looparrowright;"], [0, "&harrw;"], [0, "&nharr;"], [1, "&lsh;"], [0, "&rsh;"], [0, "&ldsh;"], [0, "&rdsh;"], [1, "&crarr;"], [0, "&cularr;"], [0, "&curarr;"], [2, "&circlearrowleft;"], [0, "&circlearrowright;"], [0, "&leftharpoonup;"], [0, "&DownLeftVector;"], [0, "&RightUpVector;"], [0, "&LeftUpVector;"], [0, "&rharu;"], [0, "&DownRightVector;"], [0, "&dharr;"], [0, "&dharl;"], [0, "&RightArrowLeftArrow;"], [0, "&udarr;"], [0, "&LeftArrowRightArrow;"], [0, "&leftleftarrows;"], [0, "&upuparrows;"], [0, "&rightrightarrows;"], [0, "&ddarr;"], [0, "&leftrightharpoons;"], [0, "&Equilibrium;"], [0, "&nlArr;"], [0, "&nhArr;"], [0, "&nrArr;"], [0, "&DoubleLeftArrow;"], [0, "&DoubleUpArrow;"], [0, "&DoubleRightArrow;"], [0, "&dArr;"], [0, "&DoubleLeftRightArrow;"], [0, "&DoubleUpDownArrow;"], [0, "&nwArr;"], [0, "&neArr;"], [0, "&seArr;"], [0, "&swArr;"], [0, "&lAarr;"], [0, "&rAarr;"], [1, "&zigrarr;"], [6, "&larrb;"], [0, "&rarrb;"], [15, "&DownArrowUpArrow;"], [7, "&loarr;"], [0, "&roarr;"], [0, "&hoarr;"], [0, "&forall;"], [0, "&comp;"], [0, { v: "&part;", n: 824, o: "&npart;" }], [0, "&exist;"], [0, "&nexist;"], [0, "&empty;"], [1, "&Del;"], [0, "&Element;"], [0, "&NotElement;"], [1, "&ni;"], [0, "&notni;"], [2, "&prod;"], [0, "&coprod;"], [0, "&sum;"], [0, "&minus;"], [0, "&MinusPlus;"], [0, "&dotplus;"], [1, "&Backslash;"], [0, "&lowast;"], [0, "&compfn;"], [1, "&radic;"], [2, "&prop;"], [0, "&infin;"], [0, "&angrt;"], [0, { v: "&ang;", n: 8402, o: "&nang;" }], [0, "&angmsd;"], [0, "&angsph;"], [0, "&mid;"], [0, "&nmid;"], [0, "&DoubleVerticalBar;"], [0, "&NotDoubleVerticalBar;"], [0, "&and;"], [0, "&or;"], [0, { v: "&cap;", n: 65024, o: "&caps;" }], [0, { v: "&cup;", n: 65024, o: "&cups;" }], [0, "&int;"], [0, "&Int;"], [0, "&iiint;"], [0, "&conint;"], [0, "&Conint;"], [0, "&Cconint;"], [0, "&cwint;"], [0, "&ClockwiseContourIntegral;"], [0, "&awconint;"], [0, "&there4;"], [0, "&becaus;"], [0, "&ratio;"], [0, "&Colon;"], [0, "&dotminus;"], [1, "&mDDot;"], [0, "&homtht;"], [0, { v: "&sim;", n: 8402, o: "&nvsim;" }], [0, { v: "&backsim;", n: 817, o: "&race;" }], [0, { v: "&ac;", n: 819, o: "&acE;" }], [0, "&acd;"], [0, "&VerticalTilde;"], [0, "&NotTilde;"], [0, { v: "&eqsim;", n: 824, o: "&nesim;" }], [0, "&sime;"], [0, "&NotTildeEqual;"], [0, "&cong;"], [0, "&simne;"], [0, "&ncong;"], [0, "&ap;"], [0, "&nap;"], [0, "&ape;"], [0, { v: "&apid;", n: 824, o: "&napid;" }], [0, "&backcong;"], [0, { v: "&asympeq;", n: 8402, o: "&nvap;" }], [0, { v: "&bump;", n: 824, o: "&nbump;" }], [0, { v: "&bumpe;", n: 824, o: "&nbumpe;" }], [0, { v: "&doteq;", n: 824, o: "&nedot;" }], [0, "&doteqdot;"], [0, "&efDot;"], [0, "&erDot;"], [0, "&Assign;"], [0, "&ecolon;"], [0, "&ecir;"], [0, "&circeq;"], [1, "&wedgeq;"], [0, "&veeeq;"], [1, "&triangleq;"], [2, "&equest;"], [0, "&ne;"], [0, { v: "&Congruent;", n: 8421, o: "&bnequiv;" }], [0, "&nequiv;"], [1, { v: "&le;", n: 8402, o: "&nvle;" }], [0, { v: "&ge;", n: 8402, o: "&nvge;" }], [0, { v: "&lE;", n: 824, o: "&nlE;" }], [0, { v: "&gE;", n: 824, o: "&ngE;" }], [0, { v: "&lnE;", n: 65024, o: "&lvertneqq;" }], [0, { v: "&gnE;", n: 65024, o: "&gvertneqq;" }], [0, { v: "&ll;", n: new Map(/* @__PURE__ */ restoreDiff([[824, "&nLtv;"], [7577, "&nLt;"]])) }], [0, { v: "&gg;", n: new Map(/* @__PURE__ */ restoreDiff([[824, "&nGtv;"], [7577, "&nGt;"]])) }], [0, "&between;"], [0, "&NotCupCap;"], [0, "&nless;"], [0, "&ngt;"], [0, "&nle;"], [0, "&nge;"], [0, "&lesssim;"], [0, "&GreaterTilde;"], [0, "&nlsim;"], [0, "&ngsim;"], [0, "&LessGreater;"], [0, "&gl;"], [0, "&NotLessGreater;"], [0, "&NotGreaterLess;"], [0, "&pr;"], [0, "&sc;"], [0, "&prcue;"], [0, "&sccue;"], [0, "&PrecedesTilde;"], [0, { v: "&scsim;", n: 824, o: "&NotSucceedsTilde;" }], [0, "&NotPrecedes;"], [0, "&NotSucceeds;"], [0, { v: "&sub;", n: 8402, o: "&NotSubset;" }], [0, { v: "&sup;", n: 8402, o: "&NotSuperset;" }], [0, "&nsub;"], [0, "&nsup;"], [0, "&sube;"], [0, "&supe;"], [0, "&NotSubsetEqual;"], [0, "&NotSupersetEqual;"], [0, { v: "&subne;", n: 65024, o: "&varsubsetneq;" }], [0, { v: "&supne;", n: 65024, o: "&varsupsetneq;" }], [1, "&cupdot;"], [0, "&UnionPlus;"], [0, { v: "&sqsub;", n: 824, o: "&NotSquareSubset;" }], [0, { v: "&sqsup;", n: 824, o: "&NotSquareSuperset;" }], [0, "&sqsube;"], [0, "&sqsupe;"], [0, { v: "&sqcap;", n: 65024, o: "&sqcaps;" }], [0, { v: "&sqcup;", n: 65024, o: "&sqcups;" }], [0, "&CirclePlus;"], [0, "&CircleMinus;"], [0, "&CircleTimes;"], [0, "&osol;"], [0, "&CircleDot;"], [0, "&circledcirc;"], [0, "&circledast;"], [1, "&circleddash;"], [0, "&boxplus;"], [0, "&boxminus;"], [0, "&boxtimes;"], [0, "&dotsquare;"], [0, "&RightTee;"], [0, "&dashv;"], [0, "&DownTee;"], [0, "&bot;"], [1, "&models;"], [0, "&DoubleRightTee;"], [0, "&Vdash;"], [0, "&Vvdash;"], [0, "&VDash;"], [0, "&nvdash;"], [0, "&nvDash;"], [0, "&nVdash;"], [0, "&nVDash;"], [0, "&prurel;"], [1, "&LeftTriangle;"], [0, "&RightTriangle;"], [0, { v: "&LeftTriangleEqual;", n: 8402, o: "&nvltrie;" }], [0, { v: "&RightTriangleEqual;", n: 8402, o: "&nvrtrie;" }], [0, "&origof;"], [0, "&imof;"], [0, "&multimap;"], [0, "&hercon;"], [0, "&intcal;"], [0, "&veebar;"], [1, "&barvee;"], [0, "&angrtvb;"], [0, "&lrtri;"], [0, "&bigwedge;"], [0, "&bigvee;"], [0, "&bigcap;"], [0, "&bigcup;"], [0, "&diam;"], [0, "&sdot;"], [0, "&sstarf;"], [0, "&divideontimes;"], [0, "&bowtie;"], [0, "&ltimes;"], [0, "&rtimes;"], [0, "&leftthreetimes;"], [0, "&rightthreetimes;"], [0, "&backsimeq;"], [0, "&curlyvee;"], [0, "&curlywedge;"], [0, "&Sub;"], [0, "&Sup;"], [0, "&Cap;"], [0, "&Cup;"], [0, "&fork;"], [0, "&epar;"], [0, "&lessdot;"], [0, "&gtdot;"], [0, { v: "&Ll;", n: 824, o: "&nLl;" }], [0, { v: "&Gg;", n: 824, o: "&nGg;" }], [0, { v: "&leg;", n: 65024, o: "&lesg;" }], [0, { v: "&gel;", n: 65024, o: "&gesl;" }], [2, "&cuepr;"], [0, "&cuesc;"], [0, "&NotPrecedesSlantEqual;"], [0, "&NotSucceedsSlantEqual;"], [0, "&NotSquareSubsetEqual;"], [0, "&NotSquareSupersetEqual;"], [2, "&lnsim;"], [0, "&gnsim;"], [0, "&precnsim;"], [0, "&scnsim;"], [0, "&nltri;"], [0, "&NotRightTriangle;"], [0, "&nltrie;"], [0, "&NotRightTriangleEqual;"], [0, "&vellip;"], [0, "&ctdot;"], [0, "&utdot;"], [0, "&dtdot;"], [0, "&disin;"], [0, "&isinsv;"], [0, "&isins;"], [0, { v: "&isindot;", n: 824, o: "&notindot;" }], [0, "&notinvc;"], [0, "&notinvb;"], [1, { v: "&isinE;", n: 824, o: "&notinE;" }], [0, "&nisd;"], [0, "&xnis;"], [0, "&nis;"], [0, "&notnivc;"], [0, "&notnivb;"], [6, "&barwed;"], [0, "&Barwed;"], [1, "&lceil;"], [0, "&rceil;"], [0, "&LeftFloor;"], [0, "&rfloor;"], [0, "&drcrop;"], [0, "&dlcrop;"], [0, "&urcrop;"], [0, "&ulcrop;"], [0, "&bnot;"], [1, "&profline;"], [0, "&profsurf;"], [1, "&telrec;"], [0, "&target;"], [5, "&ulcorn;"], [0, "&urcorn;"], [0, "&dlcorn;"], [0, "&drcorn;"], [2, "&frown;"], [0, "&smile;"], [9, "&cylcty;"], [0, "&profalar;"], [7, "&topbot;"], [6, "&ovbar;"], [1, "&solbar;"], [60, "&angzarr;"], [51, "&lmoustache;"], [0, "&rmoustache;"], [2, "&OverBracket;"], [0, "&bbrk;"], [0, "&bbrktbrk;"], [37, "&OverParenthesis;"], [0, "&UnderParenthesis;"], [0, "&OverBrace;"], [0, "&UnderBrace;"], [2, "&trpezium;"], [4, "&elinters;"], [59, "&blank;"], [164, "&circledS;"], [55, "&boxh;"], [1, "&boxv;"], [9, "&boxdr;"], [3, "&boxdl;"], [3, "&boxur;"], [3, "&boxul;"], [3, "&boxvr;"], [7, "&boxvl;"], [7, "&boxhd;"], [7, "&boxhu;"], [7, "&boxvh;"], [19, "&boxH;"], [0, "&boxV;"], [0, "&boxdR;"], [0, "&boxDr;"], [0, "&boxDR;"], [0, "&boxdL;"], [0, "&boxDl;"], [0, "&boxDL;"], [0, "&boxuR;"], [0, "&boxUr;"], [0, "&boxUR;"], [0, "&boxuL;"], [0, "&boxUl;"], [0, "&boxUL;"], [0, "&boxvR;"], [0, "&boxVr;"], [0, "&boxVR;"], [0, "&boxvL;"], [0, "&boxVl;"], [0, "&boxVL;"], [0, "&boxHd;"], [0, "&boxhD;"], [0, "&boxHD;"], [0, "&boxHu;"], [0, "&boxhU;"], [0, "&boxHU;"], [0, "&boxvH;"], [0, "&boxVh;"], [0, "&boxVH;"], [19, "&uhblk;"], [3, "&lhblk;"], [3, "&block;"], [8, "&blk14;"], [0, "&blk12;"], [0, "&blk34;"], [13, "&square;"], [8, "&blacksquare;"], [0, "&EmptyVerySmallSquare;"], [1, "&rect;"], [0, "&marker;"], [2, "&fltns;"], [1, "&bigtriangleup;"], [0, "&blacktriangle;"], [0, "&triangle;"], [2, "&blacktriangleright;"], [0, "&rtri;"], [3, "&bigtriangledown;"], [0, "&blacktriangledown;"], [0, "&dtri;"], [2, "&blacktriangleleft;"], [0, "&ltri;"], [6, "&loz;"], [0, "&cir;"], [32, "&tridot;"], [2, "&bigcirc;"], [8, "&ultri;"], [0, "&urtri;"], [0, "&lltri;"], [0, "&EmptySmallSquare;"], [0, "&FilledSmallSquare;"], [8, "&bigstar;"], [0, "&star;"], [7, "&phone;"], [49, "&female;"], [1, "&male;"], [29, "&spades;"], [2, "&clubs;"], [1, "&hearts;"], [0, "&diamondsuit;"], [3, "&sung;"], [2, "&flat;"], [0, "&natural;"], [0, "&sharp;"], [163, "&check;"], [3, "&cross;"], [8, "&malt;"], [21, "&sext;"], [33, "&VerticalSeparator;"], [25, "&lbbrk;"], [0, "&rbbrk;"], [84, "&bsolhsub;"], [0, "&suphsol;"], [28, "&LeftDoubleBracket;"], [0, "&RightDoubleBracket;"], [0, "&lang;"], [0, "&rang;"], [0, "&Lang;"], [0, "&Rang;"], [0, "&loang;"], [0, "&roang;"], [7, "&longleftarrow;"], [0, "&longrightarrow;"], [0, "&longleftrightarrow;"], [0, "&DoubleLongLeftArrow;"], [0, "&DoubleLongRightArrow;"], [0, "&DoubleLongLeftRightArrow;"], [1, "&longmapsto;"], [2, "&dzigrarr;"], [258, "&nvlArr;"], [0, "&nvrArr;"], [0, "&nvHarr;"], [0, "&Map;"], [6, "&lbarr;"], [0, "&bkarow;"], [0, "&lBarr;"], [0, "&dbkarow;"], [0, "&drbkarow;"], [0, "&DDotrahd;"], [0, "&UpArrowBar;"], [0, "&DownArrowBar;"], [2, "&Rarrtl;"], [2, "&latail;"], [0, "&ratail;"], [0, "&lAtail;"], [0, "&rAtail;"], [0, "&larrfs;"], [0, "&rarrfs;"], [0, "&larrbfs;"], [0, "&rarrbfs;"], [2, "&nwarhk;"], [0, "&nearhk;"], [0, "&hksearow;"], [0, "&hkswarow;"], [0, "&nwnear;"], [0, "&nesear;"], [0, "&seswar;"], [0, "&swnwar;"], [8, { v: "&rarrc;", n: 824, o: "&nrarrc;" }], [1, "&cudarrr;"], [0, "&ldca;"], [0, "&rdca;"], [0, "&cudarrl;"], [0, "&larrpl;"], [2, "&curarrm;"], [0, "&cularrp;"], [7, "&rarrpl;"], [2, "&harrcir;"], [0, "&Uarrocir;"], [0, "&lurdshar;"], [0, "&ldrushar;"], [2, "&LeftRightVector;"], [0, "&RightUpDownVector;"], [0, "&DownLeftRightVector;"], [0, "&LeftUpDownVector;"], [0, "&LeftVectorBar;"], [0, "&RightVectorBar;"], [0, "&RightUpVectorBar;"], [0, "&RightDownVectorBar;"], [0, "&DownLeftVectorBar;"], [0, "&DownRightVectorBar;"], [0, "&LeftUpVectorBar;"], [0, "&LeftDownVectorBar;"], [0, "&LeftTeeVector;"], [0, "&RightTeeVector;"], [0, "&RightUpTeeVector;"], [0, "&RightDownTeeVector;"], [0, "&DownLeftTeeVector;"], [0, "&DownRightTeeVector;"], [0, "&LeftUpTeeVector;"], [0, "&LeftDownTeeVector;"], [0, "&lHar;"], [0, "&uHar;"], [0, "&rHar;"], [0, "&dHar;"], [0, "&luruhar;"], [0, "&ldrdhar;"], [0, "&ruluhar;"], [0, "&rdldhar;"], [0, "&lharul;"], [0, "&llhard;"], [0, "&rharul;"], [0, "&lrhard;"], [0, "&udhar;"], [0, "&duhar;"], [0, "&RoundImplies;"], [0, "&erarr;"], [0, "&simrarr;"], [0, "&larrsim;"], [0, "&rarrsim;"], [0, "&rarrap;"], [0, "&ltlarr;"], [1, "&gtrarr;"], [0, "&subrarr;"], [1, "&suplarr;"], [0, "&lfisht;"], [0, "&rfisht;"], [0, "&ufisht;"], [0, "&dfisht;"], [5, "&lopar;"], [0, "&ropar;"], [4, "&lbrke;"], [0, "&rbrke;"], [0, "&lbrkslu;"], [0, "&rbrksld;"], [0, "&lbrksld;"], [0, "&rbrkslu;"], [0, "&langd;"], [0, "&rangd;"], [0, "&lparlt;"], [0, "&rpargt;"], [0, "&gtlPar;"], [0, "&ltrPar;"], [3, "&vzigzag;"], [1, "&vangrt;"], [0, "&angrtvbd;"], [6, "&ange;"], [0, "&range;"], [0, "&dwangle;"], [0, "&uwangle;"], [0, "&angmsdaa;"], [0, "&angmsdab;"], [0, "&angmsdac;"], [0, "&angmsdad;"], [0, "&angmsdae;"], [0, "&angmsdaf;"], [0, "&angmsdag;"], [0, "&angmsdah;"], [0, "&bemptyv;"], [0, "&demptyv;"], [0, "&cemptyv;"], [0, "&raemptyv;"], [0, "&laemptyv;"], [0, "&ohbar;"], [0, "&omid;"], [0, "&opar;"], [1, "&operp;"], [1, "&olcross;"], [0, "&odsold;"], [1, "&olcir;"], [0, "&ofcir;"], [0, "&olt;"], [0, "&ogt;"], [0, "&cirscir;"], [0, "&cirE;"], [0, "&solb;"], [0, "&bsolb;"], [3, "&boxbox;"], [3, "&trisb;"], [0, "&rtriltri;"], [0, { v: "&LeftTriangleBar;", n: 824, o: "&NotLeftTriangleBar;" }], [0, { v: "&RightTriangleBar;", n: 824, o: "&NotRightTriangleBar;" }], [11, "&iinfin;"], [0, "&infintie;"], [0, "&nvinfin;"], [4, "&eparsl;"], [0, "&smeparsl;"], [0, "&eqvparsl;"], [5, "&blacklozenge;"], [8, "&RuleDelayed;"], [1, "&dsol;"], [9, "&bigodot;"], [0, "&bigoplus;"], [0, "&bigotimes;"], [1, "&biguplus;"], [1, "&bigsqcup;"], [5, "&iiiint;"], [0, "&fpartint;"], [2, "&cirfnint;"], [0, "&awint;"], [0, "&rppolint;"], [0, "&scpolint;"], [0, "&npolint;"], [0, "&pointint;"], [0, "&quatint;"], [0, "&intlarhk;"], [10, "&pluscir;"], [0, "&plusacir;"], [0, "&simplus;"], [0, "&plusdu;"], [0, "&plussim;"], [0, "&plustwo;"], [1, "&mcomma;"], [0, "&minusdu;"], [2, "&loplus;"], [0, "&roplus;"], [0, "&Cross;"], [0, "&timesd;"], [0, "&timesbar;"], [1, "&smashp;"], [0, "&lotimes;"], [0, "&rotimes;"], [0, "&otimesas;"], [0, "&Otimes;"], [0, "&odiv;"], [0, "&triplus;"], [0, "&triminus;"], [0, "&tritime;"], [0, "&intprod;"], [2, "&amalg;"], [0, "&capdot;"], [1, "&ncup;"], [0, "&ncap;"], [0, "&capand;"], [0, "&cupor;"], [0, "&cupcap;"], [0, "&capcup;"], [0, "&cupbrcap;"], [0, "&capbrcup;"], [0, "&cupcup;"], [0, "&capcap;"], [0, "&ccups;"], [0, "&ccaps;"], [2, "&ccupssm;"], [2, "&And;"], [0, "&Or;"], [0, "&andand;"], [0, "&oror;"], [0, "&orslope;"], [0, "&andslope;"], [1, "&andv;"], [0, "&orv;"], [0, "&andd;"], [0, "&ord;"], [1, "&wedbar;"], [6, "&sdote;"], [3, "&simdot;"], [2, { v: "&congdot;", n: 824, o: "&ncongdot;" }], [0, "&easter;"], [0, "&apacir;"], [0, { v: "&apE;", n: 824, o: "&napE;" }], [0, "&eplus;"], [0, "&pluse;"], [0, "&Esim;"], [0, "&Colone;"], [0, "&Equal;"], [1, "&ddotseq;"], [0, "&equivDD;"], [0, "&ltcir;"], [0, "&gtcir;"], [0, "&ltquest;"], [0, "&gtquest;"], [0, { v: "&leqslant;", n: 824, o: "&nleqslant;" }], [0, { v: "&geqslant;", n: 824, o: "&ngeqslant;" }], [0, "&lesdot;"], [0, "&gesdot;"], [0, "&lesdoto;"], [0, "&gesdoto;"], [0, "&lesdotor;"], [0, "&gesdotol;"], [0, "&lap;"], [0, "&gap;"], [0, "&lne;"], [0, "&gne;"], [0, "&lnap;"], [0, "&gnap;"], [0, "&lEg;"], [0, "&gEl;"], [0, "&lsime;"], [0, "&gsime;"], [0, "&lsimg;"], [0, "&gsiml;"], [0, "&lgE;"], [0, "&glE;"], [0, "&lesges;"], [0, "&gesles;"], [0, "&els;"], [0, "&egs;"], [0, "&elsdot;"], [0, "&egsdot;"], [0, "&el;"], [0, "&eg;"], [2, "&siml;"], [0, "&simg;"], [0, "&simlE;"], [0, "&simgE;"], [0, { v: "&LessLess;", n: 824, o: "&NotNestedLessLess;" }], [0, { v: "&GreaterGreater;", n: 824, o: "&NotNestedGreaterGreater;" }], [1, "&glj;"], [0, "&gla;"], [0, "&ltcc;"], [0, "&gtcc;"], [0, "&lescc;"], [0, "&gescc;"], [0, "&smt;"], [0, "&lat;"], [0, { v: "&smte;", n: 65024, o: "&smtes;" }], [0, { v: "&late;", n: 65024, o: "&lates;" }], [0, "&bumpE;"], [0, { v: "&PrecedesEqual;", n: 824, o: "&NotPrecedesEqual;" }], [0, { v: "&sce;", n: 824, o: "&NotSucceedsEqual;" }], [2, "&prE;"], [0, "&scE;"], [0, "&precneqq;"], [0, "&scnE;"], [0, "&prap;"], [0, "&scap;"], [0, "&precnapprox;"], [0, "&scnap;"], [0, "&Pr;"], [0, "&Sc;"], [0, "&subdot;"], [0, "&supdot;"], [0, "&subplus;"], [0, "&supplus;"], [0, "&submult;"], [0, "&supmult;"], [0, "&subedot;"], [0, "&supedot;"], [0, { v: "&subE;", n: 824, o: "&nsubE;" }], [0, { v: "&supE;", n: 824, o: "&nsupE;" }], [0, "&subsim;"], [0, "&supsim;"], [2, { v: "&subnE;", n: 65024, o: "&varsubsetneqq;" }], [0, { v: "&supnE;", n: 65024, o: "&varsupsetneqq;" }], [2, "&csub;"], [0, "&csup;"], [0, "&csube;"], [0, "&csupe;"], [0, "&subsup;"], [0, "&supsub;"], [0, "&subsub;"], [0, "&supsup;"], [0, "&suphsub;"], [0, "&supdsub;"], [0, "&forkv;"], [0, "&topfork;"], [0, "&mlcp;"], [8, "&Dashv;"], [1, "&Vdashl;"], [0, "&Barv;"], [0, "&vBar;"], [0, "&vBarv;"], [1, "&Vbar;"], [0, "&Not;"], [0, "&bNot;"], [0, "&rnmid;"], [0, "&cirmid;"], [0, "&midcir;"], [0, "&topcir;"], [0, "&nhpar;"], [0, "&parsim;"], [9, { v: "&parsl;", n: 8421, o: "&nparsl;" }], [44343, { n: new Map(/* @__PURE__ */ restoreDiff([[56476, "&Ascr;"], [1, "&Cscr;"], [0, "&Dscr;"], [2, "&Gscr;"], [2, "&Jscr;"], [0, "&Kscr;"], [2, "&Nscr;"], [0, "&Oscr;"], [0, "&Pscr;"], [0, "&Qscr;"], [1, "&Sscr;"], [0, "&Tscr;"], [0, "&Uscr;"], [0, "&Vscr;"], [0, "&Wscr;"], [0, "&Xscr;"], [0, "&Yscr;"], [0, "&Zscr;"], [0, "&ascr;"], [0, "&bscr;"], [0, "&cscr;"], [0, "&dscr;"], [1, "&fscr;"], [1, "&hscr;"], [0, "&iscr;"], [0, "&jscr;"], [0, "&kscr;"], [0, "&lscr;"], [0, "&mscr;"], [0, "&nscr;"], [1, "&pscr;"], [0, "&qscr;"], [0, "&rscr;"], [0, "&sscr;"], [0, "&tscr;"], [0, "&uscr;"], [0, "&vscr;"], [0, "&wscr;"], [0, "&xscr;"], [0, "&yscr;"], [0, "&zscr;"], [52, "&Afr;"], [0, "&Bfr;"], [1, "&Dfr;"], [0, "&Efr;"], [0, "&Ffr;"], [0, "&Gfr;"], [2, "&Jfr;"], [0, "&Kfr;"], [0, "&Lfr;"], [0, "&Mfr;"], [0, "&Nfr;"], [0, "&Ofr;"], [0, "&Pfr;"], [0, "&Qfr;"], [1, "&Sfr;"], [0, "&Tfr;"], [0, "&Ufr;"], [0, "&Vfr;"], [0, "&Wfr;"], [0, "&Xfr;"], [0, "&Yfr;"], [1, "&afr;"], [0, "&bfr;"], [0, "&cfr;"], [0, "&dfr;"], [0, "&efr;"], [0, "&ffr;"], [0, "&gfr;"], [0, "&hfr;"], [0, "&ifr;"], [0, "&jfr;"], [0, "&kfr;"], [0, "&lfr;"], [0, "&mfr;"], [0, "&nfr;"], [0, "&ofr;"], [0, "&pfr;"], [0, "&qfr;"], [0, "&rfr;"], [0, "&sfr;"], [0, "&tfr;"], [0, "&ufr;"], [0, "&vfr;"], [0, "&wfr;"], [0, "&xfr;"], [0, "&yfr;"], [0, "&zfr;"], [0, "&Aopf;"], [0, "&Bopf;"], [1, "&Dopf;"], [0, "&Eopf;"], [0, "&Fopf;"], [0, "&Gopf;"], [1, "&Iopf;"], [0, "&Jopf;"], [0, "&Kopf;"], [0, "&Lopf;"], [0, "&Mopf;"], [1, "&Oopf;"], [3, "&Sopf;"], [0, "&Topf;"], [0, "&Uopf;"], [0, "&Vopf;"], [0, "&Wopf;"], [0, "&Xopf;"], [0, "&Yopf;"], [1, "&aopf;"], [0, "&bopf;"], [0, "&copf;"], [0, "&dopf;"], [0, "&eopf;"], [0, "&fopf;"], [0, "&gopf;"], [0, "&hopf;"], [0, "&iopf;"], [0, "&jopf;"], [0, "&kopf;"], [0, "&lopf;"], [0, "&mopf;"], [0, "&nopf;"], [0, "&oopf;"], [0, "&popf;"], [0, "&qopf;"], [0, "&ropf;"], [0, "&sopf;"], [0, "&topf;"], [0, "&uopf;"], [0, "&vopf;"], [0, "&wopf;"], [0, "&xopf;"], [0, "&yopf;"], [0, "&zopf;"]])) }], [8906, "&fflig;"], [0, "&filig;"], [0, "&fllig;"], [0, "&ffilig;"], [0, "&ffllig;"]]));

// node_modules/entities/lib/esm/escape.js
init_esm();
var xmlReplacer = /["&'<>$\x80-\uFFFF]/g;
var xmlCodeMap = /* @__PURE__ */ new Map([
  [34, "&quot;"],
  [38, "&amp;"],
  [39, "&apos;"],
  [60, "&lt;"],
  [62, "&gt;"]
]);
var getCodePoint = (
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  String.prototype.codePointAt != null ? (str, index) => str.codePointAt(index) : (
    // http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
    (c2, index) => (c2.charCodeAt(index) & 64512) === 55296 ? (c2.charCodeAt(index) - 55296) * 1024 + c2.charCodeAt(index + 1) - 56320 + 65536 : c2.charCodeAt(index)
  )
);
function encodeXML(str) {
  let ret = "";
  let lastIdx = 0;
  let match;
  while ((match = xmlReplacer.exec(str)) !== null) {
    const i = match.index;
    const char = str.charCodeAt(i);
    const next = xmlCodeMap.get(char);
    if (next !== void 0) {
      ret += str.substring(lastIdx, i) + next;
      lastIdx = i + 1;
    } else {
      ret += `${str.substring(lastIdx, i)}&#x${getCodePoint(str, i).toString(16)};`;
      lastIdx = xmlReplacer.lastIndex += Number((char & 64512) === 55296);
    }
  }
  return ret + str.substr(lastIdx);
}
__name(encodeXML, "encodeXML");
function getEscaper(regex, map2) {
  return /* @__PURE__ */ __name(function escape3(data) {
    let match;
    let lastIdx = 0;
    let result = "";
    while (match = regex.exec(data)) {
      if (lastIdx !== match.index) {
        result += data.substring(lastIdx, match.index);
      }
      result += map2.get(match[0].charCodeAt(0));
      lastIdx = match.index + 1;
    }
    return result + data.substring(lastIdx);
  }, "escape");
}
__name(getEscaper, "getEscaper");
var escapeUTF8 = getEscaper(/[&<>'"]/g, xmlCodeMap);
var escapeAttribute = getEscaper(/["&\u00A0]/g, /* @__PURE__ */ new Map([
  [34, "&quot;"],
  [38, "&amp;"],
  [160, "&nbsp;"]
]));
var escapeText = getEscaper(/[&<>\u00A0]/g, /* @__PURE__ */ new Map([
  [38, "&amp;"],
  [60, "&lt;"],
  [62, "&gt;"],
  [160, "&nbsp;"]
]));

// node_modules/entities/lib/esm/index.js
var EntityLevel;
(function(EntityLevel2) {
  EntityLevel2[EntityLevel2["XML"] = 0] = "XML";
  EntityLevel2[EntityLevel2["HTML"] = 1] = "HTML";
})(EntityLevel || (EntityLevel = {}));
var EncodingMode;
(function(EncodingMode2) {
  EncodingMode2[EncodingMode2["UTF8"] = 0] = "UTF8";
  EncodingMode2[EncodingMode2["ASCII"] = 1] = "ASCII";
  EncodingMode2[EncodingMode2["Extensive"] = 2] = "Extensive";
  EncodingMode2[EncodingMode2["Attribute"] = 3] = "Attribute";
  EncodingMode2[EncodingMode2["Text"] = 4] = "Text";
})(EncodingMode || (EncodingMode = {}));

// node_modules/dom-serializer/lib/esm/foreignNames.js
init_esm();
var elementNames = new Map([
  "altGlyph",
  "altGlyphDef",
  "altGlyphItem",
  "animateColor",
  "animateMotion",
  "animateTransform",
  "clipPath",
  "feBlend",
  "feColorMatrix",
  "feComponentTransfer",
  "feComposite",
  "feConvolveMatrix",
  "feDiffuseLighting",
  "feDisplacementMap",
  "feDistantLight",
  "feDropShadow",
  "feFlood",
  "feFuncA",
  "feFuncB",
  "feFuncG",
  "feFuncR",
  "feGaussianBlur",
  "feImage",
  "feMerge",
  "feMergeNode",
  "feMorphology",
  "feOffset",
  "fePointLight",
  "feSpecularLighting",
  "feSpotLight",
  "feTile",
  "feTurbulence",
  "foreignObject",
  "glyphRef",
  "linearGradient",
  "radialGradient",
  "textPath"
].map((val) => [val.toLowerCase(), val]));
var attributeNames = new Map([
  "definitionURL",
  "attributeName",
  "attributeType",
  "baseFrequency",
  "baseProfile",
  "calcMode",
  "clipPathUnits",
  "diffuseConstant",
  "edgeMode",
  "filterUnits",
  "glyphRef",
  "gradientTransform",
  "gradientUnits",
  "kernelMatrix",
  "kernelUnitLength",
  "keyPoints",
  "keySplines",
  "keyTimes",
  "lengthAdjust",
  "limitingConeAngle",
  "markerHeight",
  "markerUnits",
  "markerWidth",
  "maskContentUnits",
  "maskUnits",
  "numOctaves",
  "pathLength",
  "patternContentUnits",
  "patternTransform",
  "patternUnits",
  "pointsAtX",
  "pointsAtY",
  "pointsAtZ",
  "preserveAlpha",
  "preserveAspectRatio",
  "primitiveUnits",
  "refX",
  "refY",
  "repeatCount",
  "repeatDur",
  "requiredExtensions",
  "requiredFeatures",
  "specularConstant",
  "specularExponent",
  "spreadMethod",
  "startOffset",
  "stdDeviation",
  "stitchTiles",
  "surfaceScale",
  "systemLanguage",
  "tableValues",
  "targetX",
  "targetY",
  "textLength",
  "viewBox",
  "viewTarget",
  "xChannelSelector",
  "yChannelSelector",
  "zoomAndPan"
].map((val) => [val.toLowerCase(), val]));

// node_modules/dom-serializer/lib/esm/index.js
var unencodedElements = /* @__PURE__ */ new Set([
  "style",
  "script",
  "xmp",
  "iframe",
  "noembed",
  "noframes",
  "plaintext",
  "noscript"
]);
function replaceQuotes(value) {
  return value.replace(/"/g, "&quot;");
}
__name(replaceQuotes, "replaceQuotes");
function formatAttributes(attributes, opts) {
  var _a4;
  if (!attributes)
    return;
  const encode = ((_a4 = opts.encodeEntities) !== null && _a4 !== void 0 ? _a4 : opts.decodeEntities) === false ? replaceQuotes : opts.xmlMode || opts.encodeEntities !== "utf8" ? encodeXML : escapeAttribute;
  return Object.keys(attributes).map((key) => {
    var _a5, _b;
    const value = (_a5 = attributes[key]) !== null && _a5 !== void 0 ? _a5 : "";
    if (opts.xmlMode === "foreign") {
      key = (_b = attributeNames.get(key)) !== null && _b !== void 0 ? _b : key;
    }
    if (!opts.emptyAttrs && !opts.xmlMode && value === "") {
      return key;
    }
    return `${key}="${encode(value)}"`;
  }).join(" ");
}
__name(formatAttributes, "formatAttributes");
var singleTag = /* @__PURE__ */ new Set([
  "area",
  "base",
  "basefont",
  "br",
  "col",
  "command",
  "embed",
  "frame",
  "hr",
  "img",
  "input",
  "isindex",
  "keygen",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr"
]);
function render(node, options = {}) {
  const nodes = "length" in node ? node : [node];
  let output = "";
  for (let i = 0; i < nodes.length; i++) {
    output += renderNode(nodes[i], options);
  }
  return output;
}
__name(render, "render");
function renderNode(node, options) {
  switch (node.type) {
    case Root:
      return render(node.children, options);
    // @ts-expect-error We don't use `Doctype` yet
    case Doctype:
    case Directive:
      return renderDirective(node);
    case Comment:
      return renderComment(node);
    case CDATA:
      return renderCdata(node);
    case Script:
    case Style:
    case Tag:
      return renderTag(node, options);
    case Text:
      return renderText(node, options);
  }
}
__name(renderNode, "renderNode");
var foreignModeIntegrationPoints = /* @__PURE__ */ new Set([
  "mi",
  "mo",
  "mn",
  "ms",
  "mtext",
  "annotation-xml",
  "foreignObject",
  "desc",
  "title"
]);
var foreignElements = /* @__PURE__ */ new Set(["svg", "math"]);
function renderTag(elem, opts) {
  var _a4;
  if (opts.xmlMode === "foreign") {
    elem.name = (_a4 = elementNames.get(elem.name)) !== null && _a4 !== void 0 ? _a4 : elem.name;
    if (elem.parent && foreignModeIntegrationPoints.has(elem.parent.name)) {
      opts = { ...opts, xmlMode: false };
    }
  }
  if (!opts.xmlMode && foreignElements.has(elem.name)) {
    opts = { ...opts, xmlMode: "foreign" };
  }
  let tag = `<${elem.name}`;
  const attribs = formatAttributes(elem.attribs, opts);
  if (attribs) {
    tag += ` ${attribs}`;
  }
  if (elem.children.length === 0 && (opts.xmlMode ? (
    // In XML mode or foreign mode, and user hasn't explicitly turned off self-closing tags
    opts.selfClosingTags !== false
  ) : (
    // User explicitly asked for self-closing tags, even in HTML mode
    opts.selfClosingTags && singleTag.has(elem.name)
  ))) {
    if (!opts.xmlMode)
      tag += " ";
    tag += "/>";
  } else {
    tag += ">";
    if (elem.children.length > 0) {
      tag += render(elem.children, opts);
    }
    if (opts.xmlMode || !singleTag.has(elem.name)) {
      tag += `</${elem.name}>`;
    }
  }
  return tag;
}
__name(renderTag, "renderTag");
function renderDirective(elem) {
  return `<${elem.data}>`;
}
__name(renderDirective, "renderDirective");
function renderText(elem, opts) {
  var _a4;
  let data = elem.data || "";
  if (((_a4 = opts.encodeEntities) !== null && _a4 !== void 0 ? _a4 : opts.decodeEntities) !== false && !(!opts.xmlMode && elem.parent && unencodedElements.has(elem.parent.name))) {
    data = opts.xmlMode || opts.encodeEntities !== "utf8" ? encodeXML(data) : escapeText(data);
  }
  return data;
}
__name(renderText, "renderText");
function renderCdata(elem) {
  return `<![CDATA[${elem.children[0].data}]]>`;
}
__name(renderCdata, "renderCdata");
function renderComment(elem) {
  return `<!--${elem.data}-->`;
}
__name(renderComment, "renderComment");

// node_modules/domutils/lib/esm/traversal.js
init_esm();

// node_modules/domutils/lib/esm/manipulation.js
init_esm();

// node_modules/domutils/lib/esm/querying.js
init_esm();

// node_modules/domutils/lib/esm/legacy.js
init_esm();

// node_modules/domutils/lib/esm/helpers.js
init_esm();
var DocumentPosition;
(function(DocumentPosition2) {
  DocumentPosition2[DocumentPosition2["DISCONNECTED"] = 1] = "DISCONNECTED";
  DocumentPosition2[DocumentPosition2["PRECEDING"] = 2] = "PRECEDING";
  DocumentPosition2[DocumentPosition2["FOLLOWING"] = 4] = "FOLLOWING";
  DocumentPosition2[DocumentPosition2["CONTAINS"] = 8] = "CONTAINS";
  DocumentPosition2[DocumentPosition2["CONTAINED_BY"] = 16] = "CONTAINED_BY";
})(DocumentPosition || (DocumentPosition = {}));

// node_modules/domutils/lib/esm/feeds.js
init_esm();

// node_modules/htmlparser2/lib/esm/index.js
function parseDocument(data, options) {
  const handler = new DomHandler(void 0, options);
  new Parser(handler, options).end(data);
  return handler.root;
}
__name(parseDocument, "parseDocument");

// node_modules/html-to-text/lib/html-to-text.mjs
var import_deepmerge = __toESM(require_cjs(), 1);
function limitedDepthRecursive(n2, f2, g = () => void 0) {
  if (n2 === void 0) {
    const f1 = /* @__PURE__ */ __name(function(...args) {
      return f2(f1, ...args);
    }, "f1");
    return f1;
  }
  if (n2 >= 0) {
    return function(...args) {
      return f2(limitedDepthRecursive(n2 - 1, f2, g), ...args);
    };
  }
  return g;
}
__name(limitedDepthRecursive, "limitedDepthRecursive");
function trimCharacter(str, char) {
  let start = 0;
  let end = str.length;
  while (start < end && str[start] === char) {
    ++start;
  }
  while (end > start && str[end - 1] === char) {
    --end;
  }
  return start > 0 || end < str.length ? str.substring(start, end) : str;
}
__name(trimCharacter, "trimCharacter");
function trimCharacterEnd(str, char) {
  let end = str.length;
  while (end > 0 && str[end - 1] === char) {
    --end;
  }
  return end < str.length ? str.substring(0, end) : str;
}
__name(trimCharacterEnd, "trimCharacterEnd");
function unicodeEscape(str) {
  return str.replace(/[\s\S]/g, (c2) => "\\u" + c2.charCodeAt().toString(16).padStart(4, "0"));
}
__name(unicodeEscape, "unicodeEscape");
function mergeDuplicatesPreferLast(items, getKey) {
  const map2 = /* @__PURE__ */ new Map();
  for (let i = items.length; i-- > 0; ) {
    const item = items[i];
    const key = getKey(item);
    map2.set(
      key,
      map2.has(key) ? (0, import_deepmerge.default)(item, map2.get(key), { arrayMerge: overwriteMerge$1 }) : item
    );
  }
  return [...map2.values()].reverse();
}
__name(mergeDuplicatesPreferLast, "mergeDuplicatesPreferLast");
var overwriteMerge$1 = /* @__PURE__ */ __name((acc, src, options) => [...src], "overwriteMerge$1");
function get(obj, path) {
  for (const key of path) {
    if (!obj) {
      return void 0;
    }
    obj = obj[key];
  }
  return obj;
}
__name(get, "get");
function numberToLetterSequence(num, baseChar = "a", base = 26) {
  const digits = [];
  do {
    num -= 1;
    digits.push(num % base);
    num = num / base >> 0;
  } while (num > 0);
  const baseCode = baseChar.charCodeAt(0);
  return digits.reverse().map((n2) => String.fromCharCode(baseCode + n2)).join("");
}
__name(numberToLetterSequence, "numberToLetterSequence");
var I = ["I", "X", "C", "M"];
var V = ["V", "L", "D"];
function numberToRoman(num) {
  return [...num + ""].map((n2) => +n2).reverse().map((v3, i) => v3 % 5 < 4 ? (v3 < 5 ? "" : V[i]) + I[i].repeat(v3 % 5) : I[i] + (v3 < 5 ? V[i] : I[i + 1])).reverse().join("");
}
__name(numberToRoman, "numberToRoman");
var InlineTextBuilder = class {
  static {
    __name(this, "InlineTextBuilder");
  }
  /**
   * Creates an instance of InlineTextBuilder.
   *
   * If `maxLineLength` is not provided then it is either `options.wordwrap` or unlimited.
   *
   * @param { Options } options           HtmlToText options.
   * @param { number }  [ maxLineLength ] This builder will try to wrap text to fit this line length.
   */
  constructor(options, maxLineLength = void 0) {
    this.lines = [];
    this.nextLineWords = [];
    this.maxLineLength = maxLineLength || options.wordwrap || Number.MAX_VALUE;
    this.nextLineAvailableChars = this.maxLineLength;
    this.wrapCharacters = get(options, ["longWordSplit", "wrapCharacters"]) || [];
    this.forceWrapOnLimit = get(options, ["longWordSplit", "forceWrapOnLimit"]) || false;
    this.stashedSpace = false;
    this.wordBreakOpportunity = false;
  }
  /**
   * Add a new word.
   *
   * @param { string } word A word to add.
   * @param { boolean } [noWrap] Don't wrap text even if the line is too long.
   */
  pushWord(word, noWrap = false) {
    if (this.nextLineAvailableChars <= 0 && !noWrap) {
      this.startNewLine();
    }
    const isLineStart = this.nextLineWords.length === 0;
    const cost = word.length + (isLineStart ? 0 : 1);
    if (cost <= this.nextLineAvailableChars || noWrap) {
      this.nextLineWords.push(word);
      this.nextLineAvailableChars -= cost;
    } else {
      const [first, ...rest] = this.splitLongWord(word);
      if (!isLineStart) {
        this.startNewLine();
      }
      this.nextLineWords.push(first);
      this.nextLineAvailableChars -= first.length;
      for (const part of rest) {
        this.startNewLine();
        this.nextLineWords.push(part);
        this.nextLineAvailableChars -= part.length;
      }
    }
  }
  /**
   * Pop a word from the currently built line.
   * This doesn't affect completed lines.
   *
   * @returns { string }
   */
  popWord() {
    const lastWord = this.nextLineWords.pop();
    if (lastWord !== void 0) {
      const isLineStart = this.nextLineWords.length === 0;
      const cost = lastWord.length + (isLineStart ? 0 : 1);
      this.nextLineAvailableChars += cost;
    }
    return lastWord;
  }
  /**
   * Concat a word to the last word already in the builder.
   * Adds a new word in case there are no words yet in the last line.
   *
   * @param { string } word A word to be concatenated.
   * @param { boolean } [noWrap] Don't wrap text even if the line is too long.
   */
  concatWord(word, noWrap = false) {
    if (this.wordBreakOpportunity && word.length > this.nextLineAvailableChars) {
      this.pushWord(word, noWrap);
      this.wordBreakOpportunity = false;
    } else {
      const lastWord = this.popWord();
      this.pushWord(lastWord ? lastWord.concat(word) : word, noWrap);
    }
  }
  /**
   * Add current line (and more empty lines if provided argument > 1) to the list of complete lines and start a new one.
   *
   * @param { number } n Number of line breaks that will be added to the resulting string.
   */
  startNewLine(n2 = 1) {
    this.lines.push(this.nextLineWords);
    if (n2 > 1) {
      this.lines.push(...Array.from({ length: n2 - 1 }, () => []));
    }
    this.nextLineWords = [];
    this.nextLineAvailableChars = this.maxLineLength;
  }
  /**
   * No words in this builder.
   *
   * @returns { boolean }
   */
  isEmpty() {
    return this.lines.length === 0 && this.nextLineWords.length === 0;
  }
  clear() {
    this.lines.length = 0;
    this.nextLineWords.length = 0;
    this.nextLineAvailableChars = this.maxLineLength;
  }
  /**
   * Join all lines of words inside the InlineTextBuilder into a complete string.
   *
   * @returns { string }
   */
  toString() {
    return [...this.lines, this.nextLineWords].map((words) => words.join(" ")).join("\n");
  }
  /**
   * Split a long word up to fit within the word wrap limit.
   * Use either a character to split looking back from the word wrap limit,
   * or truncate to the word wrap limit.
   *
   * @param   { string }   word Input word.
   * @returns { string[] }      Parts of the word.
   */
  splitLongWord(word) {
    const parts = [];
    let idx = 0;
    while (word.length > this.maxLineLength) {
      const firstLine = word.substring(0, this.maxLineLength);
      const remainingChars = word.substring(this.maxLineLength);
      const splitIndex = firstLine.lastIndexOf(this.wrapCharacters[idx]);
      if (splitIndex > -1) {
        word = firstLine.substring(splitIndex + 1) + remainingChars;
        parts.push(firstLine.substring(0, splitIndex + 1));
      } else {
        idx++;
        if (idx < this.wrapCharacters.length) {
          word = firstLine + remainingChars;
        } else {
          if (this.forceWrapOnLimit) {
            parts.push(firstLine);
            word = remainingChars;
            if (word.length > this.maxLineLength) {
              continue;
            }
          } else {
            word = firstLine + remainingChars;
          }
          break;
        }
      }
    }
    parts.push(word);
    return parts;
  }
};
var StackItem = class {
  static {
    __name(this, "StackItem");
  }
  constructor(next = null) {
    this.next = next;
  }
  getRoot() {
    return this.next ? this.next : this;
  }
};
var BlockStackItem = class extends StackItem {
  static {
    __name(this, "BlockStackItem");
  }
  constructor(options, next = null, leadingLineBreaks = 1, maxLineLength = void 0) {
    super(next);
    this.leadingLineBreaks = leadingLineBreaks;
    this.inlineTextBuilder = new InlineTextBuilder(options, maxLineLength);
    this.rawText = "";
    this.stashedLineBreaks = 0;
    this.isPre = next && next.isPre;
    this.isNoWrap = next && next.isNoWrap;
  }
};
var ListStackItem = class extends BlockStackItem {
  static {
    __name(this, "ListStackItem");
  }
  constructor(options, next = null, {
    interRowLineBreaks = 1,
    leadingLineBreaks = 2,
    maxLineLength = void 0,
    maxPrefixLength = 0,
    prefixAlign = "left"
  } = {}) {
    super(options, next, leadingLineBreaks, maxLineLength);
    this.maxPrefixLength = maxPrefixLength;
    this.prefixAlign = prefixAlign;
    this.interRowLineBreaks = interRowLineBreaks;
  }
};
var ListItemStackItem = class extends BlockStackItem {
  static {
    __name(this, "ListItemStackItem");
  }
  constructor(options, next = null, {
    leadingLineBreaks = 1,
    maxLineLength = void 0,
    prefix = ""
  } = {}) {
    super(options, next, leadingLineBreaks, maxLineLength);
    this.prefix = prefix;
  }
};
var TableStackItem = class extends StackItem {
  static {
    __name(this, "TableStackItem");
  }
  constructor(next = null) {
    super(next);
    this.rows = [];
    this.isPre = next && next.isPre;
    this.isNoWrap = next && next.isNoWrap;
  }
};
var TableRowStackItem = class extends StackItem {
  static {
    __name(this, "TableRowStackItem");
  }
  constructor(next = null) {
    super(next);
    this.cells = [];
    this.isPre = next && next.isPre;
    this.isNoWrap = next && next.isNoWrap;
  }
};
var TableCellStackItem = class extends StackItem {
  static {
    __name(this, "TableCellStackItem");
  }
  constructor(options, next = null, maxColumnWidth = void 0) {
    super(next);
    this.inlineTextBuilder = new InlineTextBuilder(options, maxColumnWidth);
    this.rawText = "";
    this.stashedLineBreaks = 0;
    this.isPre = next && next.isPre;
    this.isNoWrap = next && next.isNoWrap;
  }
};
var TransformerStackItem = class extends StackItem {
  static {
    __name(this, "TransformerStackItem");
  }
  constructor(next = null, transform) {
    super(next);
    this.transform = transform;
  }
};
function charactersToCodes(str) {
  return [...str].map((c2) => "\\u" + c2.charCodeAt(0).toString(16).padStart(4, "0")).join("");
}
__name(charactersToCodes, "charactersToCodes");
var WhitespaceProcessor = class {
  static {
    __name(this, "WhitespaceProcessor");
  }
  /**
   * Creates an instance of WhitespaceProcessor.
   *
   * @param { Options } options    HtmlToText options.
   * @memberof WhitespaceProcessor
   */
  constructor(options) {
    this.whitespaceChars = options.preserveNewlines ? options.whitespaceCharacters.replace(/\n/g, "") : options.whitespaceCharacters;
    const whitespaceCodes = charactersToCodes(this.whitespaceChars);
    this.leadingWhitespaceRe = new RegExp(`^[${whitespaceCodes}]`);
    this.trailingWhitespaceRe = new RegExp(`[${whitespaceCodes}]$`);
    this.allWhitespaceOrEmptyRe = new RegExp(`^[${whitespaceCodes}]*$`);
    this.newlineOrNonWhitespaceRe = new RegExp(`(\\n|[^\\n${whitespaceCodes}])`, "g");
    this.newlineOrNonNewlineStringRe = new RegExp(`(\\n|[^\\n]+)`, "g");
    if (options.preserveNewlines) {
      const wordOrNewlineRe = new RegExp(`\\n|[^\\n${whitespaceCodes}]+`, "gm");
      this.shrinkWrapAdd = function(text, inlineTextBuilder, transform = (str) => str, noWrap = false) {
        if (!text) {
          return;
        }
        const previouslyStashedSpace = inlineTextBuilder.stashedSpace;
        let anyMatch = false;
        let m = wordOrNewlineRe.exec(text);
        if (m) {
          anyMatch = true;
          if (m[0] === "\n") {
            inlineTextBuilder.startNewLine();
          } else if (previouslyStashedSpace || this.testLeadingWhitespace(text)) {
            inlineTextBuilder.pushWord(transform(m[0]), noWrap);
          } else {
            inlineTextBuilder.concatWord(transform(m[0]), noWrap);
          }
          while ((m = wordOrNewlineRe.exec(text)) !== null) {
            if (m[0] === "\n") {
              inlineTextBuilder.startNewLine();
            } else {
              inlineTextBuilder.pushWord(transform(m[0]), noWrap);
            }
          }
        }
        inlineTextBuilder.stashedSpace = previouslyStashedSpace && !anyMatch || this.testTrailingWhitespace(text);
      };
    } else {
      const wordRe = new RegExp(`[^${whitespaceCodes}]+`, "g");
      this.shrinkWrapAdd = function(text, inlineTextBuilder, transform = (str) => str, noWrap = false) {
        if (!text) {
          return;
        }
        const previouslyStashedSpace = inlineTextBuilder.stashedSpace;
        let anyMatch = false;
        let m = wordRe.exec(text);
        if (m) {
          anyMatch = true;
          if (previouslyStashedSpace || this.testLeadingWhitespace(text)) {
            inlineTextBuilder.pushWord(transform(m[0]), noWrap);
          } else {
            inlineTextBuilder.concatWord(transform(m[0]), noWrap);
          }
          while ((m = wordRe.exec(text)) !== null) {
            inlineTextBuilder.pushWord(transform(m[0]), noWrap);
          }
        }
        inlineTextBuilder.stashedSpace = previouslyStashedSpace && !anyMatch || this.testTrailingWhitespace(text);
      };
    }
  }
  /**
   * Add text with only minimal processing.
   * Everything between newlines considered a single word.
   * No whitespace is trimmed.
   * Not affected by preserveNewlines option - `\n` always starts a new line.
   *
   * `noWrap` argument is `true` by default - this won't start a new line
   * even if there is not enough space left in the current line.
   *
   * @param { string }            text              Input text.
   * @param { InlineTextBuilder } inlineTextBuilder A builder to receive processed text.
   * @param { boolean }           [noWrap] Don't wrap text even if the line is too long.
   */
  addLiteral(text, inlineTextBuilder, noWrap = true) {
    if (!text) {
      return;
    }
    const previouslyStashedSpace = inlineTextBuilder.stashedSpace;
    let anyMatch = false;
    let m = this.newlineOrNonNewlineStringRe.exec(text);
    if (m) {
      anyMatch = true;
      if (m[0] === "\n") {
        inlineTextBuilder.startNewLine();
      } else if (previouslyStashedSpace) {
        inlineTextBuilder.pushWord(m[0], noWrap);
      } else {
        inlineTextBuilder.concatWord(m[0], noWrap);
      }
      while ((m = this.newlineOrNonNewlineStringRe.exec(text)) !== null) {
        if (m[0] === "\n") {
          inlineTextBuilder.startNewLine();
        } else {
          inlineTextBuilder.pushWord(m[0], noWrap);
        }
      }
    }
    inlineTextBuilder.stashedSpace = previouslyStashedSpace && !anyMatch;
  }
  /**
   * Test whether the given text starts with HTML whitespace character.
   *
   * @param   { string }  text  The string to test.
   * @returns { boolean }
   */
  testLeadingWhitespace(text) {
    return this.leadingWhitespaceRe.test(text);
  }
  /**
   * Test whether the given text ends with HTML whitespace character.
   *
   * @param   { string }  text  The string to test.
   * @returns { boolean }
   */
  testTrailingWhitespace(text) {
    return this.trailingWhitespaceRe.test(text);
  }
  /**
   * Test whether the given text contains any non-whitespace characters.
   *
   * @param   { string }  text  The string to test.
   * @returns { boolean }
   */
  testContainsWords(text) {
    return !this.allWhitespaceOrEmptyRe.test(text);
  }
  /**
   * Return the number of newlines if there are no words.
   *
   * If any word is found then return zero regardless of the actual number of newlines.
   *
   * @param   { string }  text  Input string.
   * @returns { number }
   */
  countNewlinesNoWords(text) {
    this.newlineOrNonWhitespaceRe.lastIndex = 0;
    let counter = 0;
    let match;
    while ((match = this.newlineOrNonWhitespaceRe.exec(text)) !== null) {
      if (match[0] === "\n") {
        counter++;
      } else {
        return 0;
      }
    }
    return counter;
  }
};
var BlockTextBuilder = class {
  static {
    __name(this, "BlockTextBuilder");
  }
  /**
   * Creates an instance of BlockTextBuilder.
   *
   * @param { Options } options HtmlToText options.
   * @param { import('selderee').Picker<DomNode, TagDefinition> } picker Selectors decision tree picker.
   * @param { any} [metadata] Optional metadata for HTML document, for use in formatters.
   */
  constructor(options, picker, metadata = void 0) {
    this.options = options;
    this.picker = picker;
    this.metadata = metadata;
    this.whitespaceProcessor = new WhitespaceProcessor(options);
    this._stackItem = new BlockStackItem(options);
    this._wordTransformer = void 0;
  }
  /**
   * Put a word-by-word transform function onto the transformations stack.
   *
   * Mainly used for uppercasing. Can be bypassed to add unformatted text such as URLs.
   *
   * Word transformations applied before wrapping.
   *
   * @param { (str: string) => string } wordTransform Word transformation function.
   */
  pushWordTransform(wordTransform) {
    this._wordTransformer = new TransformerStackItem(this._wordTransformer, wordTransform);
  }
  /**
   * Remove a function from the word transformations stack.
   *
   * @returns { (str: string) => string } A function that was removed.
   */
  popWordTransform() {
    if (!this._wordTransformer) {
      return void 0;
    }
    const transform = this._wordTransformer.transform;
    this._wordTransformer = this._wordTransformer.next;
    return transform;
  }
  /**
   * Ignore wordwrap option in followup inline additions and disable automatic wrapping.
   */
  startNoWrap() {
    this._stackItem.isNoWrap = true;
  }
  /**
   * Return automatic wrapping to behavior defined by options.
   */
  stopNoWrap() {
    this._stackItem.isNoWrap = false;
  }
  /** @returns { (str: string) => string } */
  _getCombinedWordTransformer() {
    const wt2 = this._wordTransformer ? (str) => applyTransformer(str, this._wordTransformer) : void 0;
    const ce3 = this.options.encodeCharacters;
    return wt2 ? ce3 ? (str) => ce3(wt2(str)) : wt2 : ce3;
  }
  _popStackItem() {
    const item = this._stackItem;
    this._stackItem = item.next;
    return item;
  }
  /**
   * Add a line break into currently built block.
   */
  addLineBreak() {
    if (!(this._stackItem instanceof BlockStackItem || this._stackItem instanceof ListItemStackItem || this._stackItem instanceof TableCellStackItem)) {
      return;
    }
    if (this._stackItem.isPre) {
      this._stackItem.rawText += "\n";
    } else {
      this._stackItem.inlineTextBuilder.startNewLine();
    }
  }
  /**
   * Allow to break line in case directly following text will not fit.
   */
  addWordBreakOpportunity() {
    if (this._stackItem instanceof BlockStackItem || this._stackItem instanceof ListItemStackItem || this._stackItem instanceof TableCellStackItem) {
      this._stackItem.inlineTextBuilder.wordBreakOpportunity = true;
    }
  }
  /**
   * Add a node inline into the currently built block.
   *
   * @param { string } str
   * Text content of a node to add.
   *
   * @param { object } [param1]
   * Object holding the parameters of the operation.
   *
   * @param { boolean } [param1.noWordTransform]
   * Ignore word transformers if there are any.
   * Don't encode characters as well.
   * (Use this for things like URL addresses).
   */
  addInline(str, { noWordTransform = false } = {}) {
    if (!(this._stackItem instanceof BlockStackItem || this._stackItem instanceof ListItemStackItem || this._stackItem instanceof TableCellStackItem)) {
      return;
    }
    if (this._stackItem.isPre) {
      this._stackItem.rawText += str;
      return;
    }
    if (str.length === 0 || // empty string
    this._stackItem.stashedLineBreaks && // stashed linebreaks make whitespace irrelevant
    !this.whitespaceProcessor.testContainsWords(str)) {
      return;
    }
    if (this.options.preserveNewlines) {
      const newlinesNumber = this.whitespaceProcessor.countNewlinesNoWords(str);
      if (newlinesNumber > 0) {
        this._stackItem.inlineTextBuilder.startNewLine(newlinesNumber);
        return;
      }
    }
    if (this._stackItem.stashedLineBreaks) {
      this._stackItem.inlineTextBuilder.startNewLine(this._stackItem.stashedLineBreaks);
    }
    this.whitespaceProcessor.shrinkWrapAdd(
      str,
      this._stackItem.inlineTextBuilder,
      noWordTransform ? void 0 : this._getCombinedWordTransformer(),
      this._stackItem.isNoWrap
    );
    this._stackItem.stashedLineBreaks = 0;
  }
  /**
   * Add a string inline into the currently built block.
   *
   * Use this for markup elements that don't have to adhere
   * to text layout rules.
   *
   * @param { string } str Text to add.
   */
  addLiteral(str) {
    if (!(this._stackItem instanceof BlockStackItem || this._stackItem instanceof ListItemStackItem || this._stackItem instanceof TableCellStackItem)) {
      return;
    }
    if (str.length === 0) {
      return;
    }
    if (this._stackItem.isPre) {
      this._stackItem.rawText += str;
      return;
    }
    if (this._stackItem.stashedLineBreaks) {
      this._stackItem.inlineTextBuilder.startNewLine(this._stackItem.stashedLineBreaks);
    }
    this.whitespaceProcessor.addLiteral(
      str,
      this._stackItem.inlineTextBuilder,
      this._stackItem.isNoWrap
    );
    this._stackItem.stashedLineBreaks = 0;
  }
  /**
   * Start building a new block.
   *
   * @param { object } [param0]
   * Object holding the parameters of the block.
   *
   * @param { number } [param0.leadingLineBreaks]
   * This block should have at least this number of line breaks to separate it from any preceding block.
   *
   * @param { number }  [param0.reservedLineLength]
   * Reserve this number of characters on each line for block markup.
   *
   * @param { boolean } [param0.isPre]
   * Should HTML whitespace be preserved inside this block.
   */
  openBlock({ leadingLineBreaks = 1, reservedLineLength = 0, isPre = false } = {}) {
    const maxLineLength = Math.max(20, this._stackItem.inlineTextBuilder.maxLineLength - reservedLineLength);
    this._stackItem = new BlockStackItem(
      this.options,
      this._stackItem,
      leadingLineBreaks,
      maxLineLength
    );
    if (isPre) {
      this._stackItem.isPre = true;
    }
  }
  /**
   * Finalize currently built block, add it's content to the parent block.
   *
   * @param { object } [param0]
   * Object holding the parameters of the block.
   *
   * @param { number } [param0.trailingLineBreaks]
   * This block should have at least this number of line breaks to separate it from any following block.
   *
   * @param { (str: string) => string } [param0.blockTransform]
   * A function to transform the block text before adding to the parent block.
   * This happens after word wrap and should be used in combination with reserved line length
   * in order to keep line lengths correct.
   * Used for whole block markup.
   */
  closeBlock({ trailingLineBreaks = 1, blockTransform = void 0 } = {}) {
    const block = this._popStackItem();
    const blockText = blockTransform ? blockTransform(getText(block)) : getText(block);
    addText(this._stackItem, blockText, block.leadingLineBreaks, Math.max(block.stashedLineBreaks, trailingLineBreaks));
  }
  /**
   * Start building a new list.
   *
   * @param { object } [param0]
   * Object holding the parameters of the list.
   *
   * @param { number } [param0.maxPrefixLength]
   * Length of the longest list item prefix.
   * If not supplied or too small then list items won't be aligned properly.
   *
   * @param { 'left' | 'right' } [param0.prefixAlign]
   * Specify how prefixes of different lengths have to be aligned
   * within a column.
   *
   * @param { number } [param0.interRowLineBreaks]
   * Minimum number of line breaks between list items.
   *
   * @param { number } [param0.leadingLineBreaks]
   * This list should have at least this number of line breaks to separate it from any preceding block.
   */
  openList({ maxPrefixLength = 0, prefixAlign = "left", interRowLineBreaks = 1, leadingLineBreaks = 2 } = {}) {
    this._stackItem = new ListStackItem(this.options, this._stackItem, {
      interRowLineBreaks,
      leadingLineBreaks,
      maxLineLength: this._stackItem.inlineTextBuilder.maxLineLength,
      maxPrefixLength,
      prefixAlign
    });
  }
  /**
   * Start building a new list item.
   *
   * @param {object} param0
   * Object holding the parameters of the list item.
   *
   * @param { string } [param0.prefix]
   * Prefix for this list item (item number, bullet point, etc).
   */
  openListItem({ prefix = "" } = {}) {
    if (!(this._stackItem instanceof ListStackItem)) {
      throw new Error("Can't add a list item to something that is not a list! Check the formatter.");
    }
    const list = this._stackItem;
    const prefixLength = Math.max(prefix.length, list.maxPrefixLength);
    const maxLineLength = Math.max(20, list.inlineTextBuilder.maxLineLength - prefixLength);
    this._stackItem = new ListItemStackItem(this.options, list, {
      prefix,
      maxLineLength,
      leadingLineBreaks: list.interRowLineBreaks
    });
  }
  /**
   * Finalize currently built list item, add it's content to the parent list.
   */
  closeListItem() {
    const listItem = this._popStackItem();
    const list = listItem.next;
    const prefixLength = Math.max(listItem.prefix.length, list.maxPrefixLength);
    const spacing = "\n" + " ".repeat(prefixLength);
    const prefix = list.prefixAlign === "right" ? listItem.prefix.padStart(prefixLength) : listItem.prefix.padEnd(prefixLength);
    const text = prefix + getText(listItem).replace(/\n/g, spacing);
    addText(
      list,
      text,
      listItem.leadingLineBreaks,
      Math.max(listItem.stashedLineBreaks, list.interRowLineBreaks)
    );
  }
  /**
   * Finalize currently built list, add it's content to the parent block.
   *
   * @param { object } param0
   * Object holding the parameters of the list.
   *
   * @param { number } [param0.trailingLineBreaks]
   * This list should have at least this number of line breaks to separate it from any following block.
   */
  closeList({ trailingLineBreaks = 2 } = {}) {
    const list = this._popStackItem();
    const text = getText(list);
    if (text) {
      addText(this._stackItem, text, list.leadingLineBreaks, trailingLineBreaks);
    }
  }
  /**
   * Start building a table.
   */
  openTable() {
    this._stackItem = new TableStackItem(this._stackItem);
  }
  /**
   * Start building a table row.
   */
  openTableRow() {
    if (!(this._stackItem instanceof TableStackItem)) {
      throw new Error("Can't add a table row to something that is not a table! Check the formatter.");
    }
    this._stackItem = new TableRowStackItem(this._stackItem);
  }
  /**
   * Start building a table cell.
   *
   * @param { object } [param0]
   * Object holding the parameters of the cell.
   *
   * @param { number } [param0.maxColumnWidth]
   * Wrap cell content to this width. Fall back to global wordwrap value if undefined.
   */
  openTableCell({ maxColumnWidth = void 0 } = {}) {
    if (!(this._stackItem instanceof TableRowStackItem)) {
      throw new Error("Can't add a table cell to something that is not a table row! Check the formatter.");
    }
    this._stackItem = new TableCellStackItem(this.options, this._stackItem, maxColumnWidth);
  }
  /**
   * Finalize currently built table cell and add it to parent table row's cells.
   *
   * @param { object } [param0]
   * Object holding the parameters of the cell.
   *
   * @param { number } [param0.colspan] How many columns this cell should occupy.
   * @param { number } [param0.rowspan] How many rows this cell should occupy.
   */
  closeTableCell({ colspan = 1, rowspan = 1 } = {}) {
    const cell = this._popStackItem();
    const text = trimCharacter(getText(cell), "\n");
    cell.next.cells.push({ colspan, rowspan, text });
  }
  /**
   * Finalize currently built table row and add it to parent table's rows.
   */
  closeTableRow() {
    const row = this._popStackItem();
    row.next.rows.push(row.cells);
  }
  /**
   * Finalize currently built table and add the rendered text to the parent block.
   *
   * @param { object } param0
   * Object holding the parameters of the table.
   *
   * @param { TablePrinter } param0.tableToString
   * A function to convert a table of stringified cells into a complete table.
   *
   * @param { number } [param0.leadingLineBreaks]
   * This table should have at least this number of line breaks to separate if from any preceding block.
   *
   * @param { number } [param0.trailingLineBreaks]
   * This table should have at least this number of line breaks to separate it from any following block.
   */
  closeTable({ tableToString: tableToString2, leadingLineBreaks = 2, trailingLineBreaks = 2 }) {
    const table = this._popStackItem();
    const output = tableToString2(table.rows);
    if (output) {
      addText(this._stackItem, output, leadingLineBreaks, trailingLineBreaks);
    }
  }
  /**
   * Return the rendered text content of this builder.
   *
   * @returns { string }
   */
  toString() {
    return getText(this._stackItem.getRoot());
  }
};
function getText(stackItem) {
  if (!(stackItem instanceof BlockStackItem || stackItem instanceof ListItemStackItem || stackItem instanceof TableCellStackItem)) {
    throw new Error("Only blocks, list items and table cells can be requested for text contents.");
  }
  return stackItem.inlineTextBuilder.isEmpty() ? stackItem.rawText : stackItem.rawText + stackItem.inlineTextBuilder.toString();
}
__name(getText, "getText");
function addText(stackItem, text, leadingLineBreaks, trailingLineBreaks) {
  if (!(stackItem instanceof BlockStackItem || stackItem instanceof ListItemStackItem || stackItem instanceof TableCellStackItem)) {
    throw new Error("Only blocks, list items and table cells can contain text.");
  }
  const parentText = getText(stackItem);
  const lineBreaks = Math.max(stackItem.stashedLineBreaks, leadingLineBreaks);
  stackItem.inlineTextBuilder.clear();
  if (parentText) {
    stackItem.rawText = parentText + "\n".repeat(lineBreaks) + text;
  } else {
    stackItem.rawText = text;
    stackItem.leadingLineBreaks = lineBreaks;
  }
  stackItem.stashedLineBreaks = trailingLineBreaks;
}
__name(addText, "addText");
function applyTransformer(str, transformer) {
  return transformer ? applyTransformer(transformer.transform(str), transformer.next) : str;
}
__name(applyTransformer, "applyTransformer");
function compile$1(options = {}) {
  const selectorsWithoutFormat = options.selectors.filter((s2) => !s2.format);
  if (selectorsWithoutFormat.length) {
    throw new Error(
      "Following selectors have no specified format: " + selectorsWithoutFormat.map((s2) => `\`${s2.selector}\``).join(", ")
    );
  }
  const picker = new DecisionTree(
    options.selectors.map((s2) => [s2.selector, s2])
  ).build(hp2Builder);
  if (typeof options.encodeCharacters !== "function") {
    options.encodeCharacters = makeReplacerFromDict(options.encodeCharacters);
  }
  const baseSelectorsPicker = new DecisionTree(
    options.baseElements.selectors.map((s2, i) => [s2, i + 1])
  ).build(hp2Builder);
  function findBaseElements(dom) {
    return findBases(dom, options, baseSelectorsPicker);
  }
  __name(findBaseElements, "findBaseElements");
  const limitedWalk = limitedDepthRecursive(
    options.limits.maxDepth,
    recursiveWalk,
    function(dom, builder) {
      builder.addInline(options.limits.ellipsis || "");
    }
  );
  return function(html, metadata = void 0) {
    return process2(html, metadata, options, picker, findBaseElements, limitedWalk);
  };
}
__name(compile$1, "compile$1");
function process2(html, metadata, options, picker, findBaseElements, walk) {
  const maxInputLength = options.limits.maxInputLength;
  if (maxInputLength && html && html.length > maxInputLength) {
    console.warn(
      `Input length ${html.length} is above allowed limit of ${maxInputLength}. Truncating without ellipsis.`
    );
    html = html.substring(0, maxInputLength);
  }
  const document = parseDocument(html, { decodeEntities: options.decodeEntities });
  const bases = findBaseElements(document.children);
  const builder = new BlockTextBuilder(options, picker, metadata);
  walk(bases, builder);
  return builder.toString();
}
__name(process2, "process");
function findBases(dom, options, baseSelectorsPicker) {
  const results = [];
  function recursiveWalk2(walk, dom2) {
    dom2 = dom2.slice(0, options.limits.maxChildNodes);
    for (const elem of dom2) {
      if (elem.type !== "tag") {
        continue;
      }
      const pickedSelectorIndex = baseSelectorsPicker.pick1(elem);
      if (pickedSelectorIndex > 0) {
        results.push({ selectorIndex: pickedSelectorIndex, element: elem });
      } else if (elem.children) {
        walk(elem.children);
      }
      if (results.length >= options.limits.maxBaseElements) {
        return;
      }
    }
  }
  __name(recursiveWalk2, "recursiveWalk");
  const limitedWalk = limitedDepthRecursive(
    options.limits.maxDepth,
    recursiveWalk2
  );
  limitedWalk(dom);
  if (options.baseElements.orderBy !== "occurrence") {
    results.sort((a, b3) => a.selectorIndex - b3.selectorIndex);
  }
  return options.baseElements.returnDomByDefault && results.length === 0 ? dom : results.map((x3) => x3.element);
}
__name(findBases, "findBases");
function recursiveWalk(walk, dom, builder) {
  if (!dom) {
    return;
  }
  const options = builder.options;
  const tooManyChildNodes = dom.length > options.limits.maxChildNodes;
  if (tooManyChildNodes) {
    dom = dom.slice(0, options.limits.maxChildNodes);
    dom.push({
      data: options.limits.ellipsis,
      type: "text"
    });
  }
  for (const elem of dom) {
    switch (elem.type) {
      case "text": {
        builder.addInline(elem.data);
        break;
      }
      case "tag": {
        const tagDefinition = builder.picker.pick1(elem);
        const format = options.formatters[tagDefinition.format];
        format(elem, walk, builder, tagDefinition.options || {});
        break;
      }
    }
  }
  return;
}
__name(recursiveWalk, "recursiveWalk");
function makeReplacerFromDict(dict) {
  if (!dict || Object.keys(dict).length === 0) {
    return void 0;
  }
  const entries = Object.entries(dict).filter(([, v3]) => v3 !== false);
  const regex = new RegExp(
    entries.map(([c2]) => `(${unicodeEscape([...c2][0])})`).join("|"),
    "g"
  );
  const values = entries.map(([, v3]) => v3);
  const replacer = /* @__PURE__ */ __name((m, ...cgs) => values[cgs.findIndex((cg) => cg)], "replacer");
  return (str) => str.replace(regex, replacer);
}
__name(makeReplacerFromDict, "makeReplacerFromDict");
function formatSkip(elem, walk, builder, formatOptions) {
}
__name(formatSkip, "formatSkip");
function formatInlineString(elem, walk, builder, formatOptions) {
  builder.addLiteral(formatOptions.string || "");
}
__name(formatInlineString, "formatInlineString");
function formatBlockString(elem, walk, builder, formatOptions) {
  builder.openBlock({ leadingLineBreaks: formatOptions.leadingLineBreaks || 2 });
  builder.addLiteral(formatOptions.string || "");
  builder.closeBlock({ trailingLineBreaks: formatOptions.trailingLineBreaks || 2 });
}
__name(formatBlockString, "formatBlockString");
function formatInline(elem, walk, builder, formatOptions) {
  walk(elem.children, builder);
}
__name(formatInline, "formatInline");
function formatBlock$1(elem, walk, builder, formatOptions) {
  builder.openBlock({ leadingLineBreaks: formatOptions.leadingLineBreaks || 2 });
  walk(elem.children, builder);
  builder.closeBlock({ trailingLineBreaks: formatOptions.trailingLineBreaks || 2 });
}
__name(formatBlock$1, "formatBlock$1");
function renderOpenTag(elem) {
  const attrs = elem.attribs && elem.attribs.length ? " " + Object.entries(elem.attribs).map(([k3, v3]) => v3 === "" ? k3 : `${k3}=${v3.replace(/"/g, "&quot;")}`).join(" ") : "";
  return `<${elem.name}${attrs}>`;
}
__name(renderOpenTag, "renderOpenTag");
function renderCloseTag(elem) {
  return `</${elem.name}>`;
}
__name(renderCloseTag, "renderCloseTag");
function formatInlineTag(elem, walk, builder, formatOptions) {
  builder.startNoWrap();
  builder.addLiteral(renderOpenTag(elem));
  builder.stopNoWrap();
  walk(elem.children, builder);
  builder.startNoWrap();
  builder.addLiteral(renderCloseTag(elem));
  builder.stopNoWrap();
}
__name(formatInlineTag, "formatInlineTag");
function formatBlockTag(elem, walk, builder, formatOptions) {
  builder.openBlock({ leadingLineBreaks: formatOptions.leadingLineBreaks || 2 });
  builder.startNoWrap();
  builder.addLiteral(renderOpenTag(elem));
  builder.stopNoWrap();
  walk(elem.children, builder);
  builder.startNoWrap();
  builder.addLiteral(renderCloseTag(elem));
  builder.stopNoWrap();
  builder.closeBlock({ trailingLineBreaks: formatOptions.trailingLineBreaks || 2 });
}
__name(formatBlockTag, "formatBlockTag");
function formatInlineHtml(elem, walk, builder, formatOptions) {
  builder.startNoWrap();
  builder.addLiteral(
    render(elem, { decodeEntities: builder.options.decodeEntities })
  );
  builder.stopNoWrap();
}
__name(formatInlineHtml, "formatInlineHtml");
function formatBlockHtml(elem, walk, builder, formatOptions) {
  builder.openBlock({ leadingLineBreaks: formatOptions.leadingLineBreaks || 2 });
  builder.startNoWrap();
  builder.addLiteral(
    render(elem, { decodeEntities: builder.options.decodeEntities })
  );
  builder.stopNoWrap();
  builder.closeBlock({ trailingLineBreaks: formatOptions.trailingLineBreaks || 2 });
}
__name(formatBlockHtml, "formatBlockHtml");
function formatInlineSurround(elem, walk, builder, formatOptions) {
  builder.addLiteral(formatOptions.prefix || "");
  walk(elem.children, builder);
  builder.addLiteral(formatOptions.suffix || "");
}
__name(formatInlineSurround, "formatInlineSurround");
var genericFormatters = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  block: formatBlock$1,
  blockHtml: formatBlockHtml,
  blockString: formatBlockString,
  blockTag: formatBlockTag,
  inline: formatInline,
  inlineHtml: formatInlineHtml,
  inlineString: formatInlineString,
  inlineSurround: formatInlineSurround,
  inlineTag: formatInlineTag,
  skip: formatSkip
});
function getRow(matrix, j3) {
  if (!matrix[j3]) {
    matrix[j3] = [];
  }
  return matrix[j3];
}
__name(getRow, "getRow");
function findFirstVacantIndex(row, x3 = 0) {
  while (row[x3]) {
    x3++;
  }
  return x3;
}
__name(findFirstVacantIndex, "findFirstVacantIndex");
function transposeInPlace(matrix, maxSize) {
  for (let i = 0; i < maxSize; i++) {
    const rowI = getRow(matrix, i);
    for (let j3 = 0; j3 < i; j3++) {
      const rowJ = getRow(matrix, j3);
      if (rowI[j3] || rowJ[i]) {
        const temp = rowI[j3];
        rowI[j3] = rowJ[i];
        rowJ[i] = temp;
      }
    }
  }
}
__name(transposeInPlace, "transposeInPlace");
function putCellIntoLayout(cell, layout, baseRow, baseCol) {
  for (let r2 = 0; r2 < cell.rowspan; r2++) {
    const layoutRow = getRow(layout, baseRow + r2);
    for (let c2 = 0; c2 < cell.colspan; c2++) {
      layoutRow[baseCol + c2] = cell;
    }
  }
}
__name(putCellIntoLayout, "putCellIntoLayout");
function getOrInitOffset(offsets, index) {
  if (offsets[index] === void 0) {
    offsets[index] = index === 0 ? 0 : 1 + getOrInitOffset(offsets, index - 1);
  }
  return offsets[index];
}
__name(getOrInitOffset, "getOrInitOffset");
function updateOffset(offsets, base, span, value) {
  offsets[base + span] = Math.max(
    getOrInitOffset(offsets, base + span),
    getOrInitOffset(offsets, base) + value
  );
}
__name(updateOffset, "updateOffset");
function tableToString(tableRows, rowSpacing, colSpacing) {
  const layout = [];
  let colNumber = 0;
  const rowNumber = tableRows.length;
  const rowOffsets = [0];
  for (let j3 = 0; j3 < rowNumber; j3++) {
    const layoutRow = getRow(layout, j3);
    const cells = tableRows[j3];
    let x3 = 0;
    for (let i = 0; i < cells.length; i++) {
      const cell = cells[i];
      x3 = findFirstVacantIndex(layoutRow, x3);
      putCellIntoLayout(cell, layout, j3, x3);
      x3 += cell.colspan;
      cell.lines = cell.text.split("\n");
      const cellHeight = cell.lines.length;
      updateOffset(rowOffsets, j3, cell.rowspan, cellHeight + rowSpacing);
    }
    colNumber = layoutRow.length > colNumber ? layoutRow.length : colNumber;
  }
  transposeInPlace(layout, rowNumber > colNumber ? rowNumber : colNumber);
  const outputLines = [];
  const colOffsets = [0];
  for (let x3 = 0; x3 < colNumber; x3++) {
    let y2 = 0;
    let cell;
    const rowsInThisColumn = Math.min(rowNumber, layout[x3].length);
    while (y2 < rowsInThisColumn) {
      cell = layout[x3][y2];
      if (cell) {
        if (!cell.rendered) {
          let cellWidth = 0;
          for (let j3 = 0; j3 < cell.lines.length; j3++) {
            const line = cell.lines[j3];
            const lineOffset = rowOffsets[y2] + j3;
            outputLines[lineOffset] = (outputLines[lineOffset] || "").padEnd(colOffsets[x3]) + line;
            cellWidth = line.length > cellWidth ? line.length : cellWidth;
          }
          updateOffset(colOffsets, x3, cell.colspan, cellWidth + colSpacing);
          cell.rendered = true;
        }
        y2 += cell.rowspan;
      } else {
        const lineOffset = rowOffsets[y2];
        outputLines[lineOffset] = outputLines[lineOffset] || "";
        y2++;
      }
    }
  }
  return outputLines.join("\n");
}
__name(tableToString, "tableToString");
function formatLineBreak(elem, walk, builder, formatOptions) {
  builder.addLineBreak();
}
__name(formatLineBreak, "formatLineBreak");
function formatWbr(elem, walk, builder, formatOptions) {
  builder.addWordBreakOpportunity();
}
__name(formatWbr, "formatWbr");
function formatHorizontalLine(elem, walk, builder, formatOptions) {
  builder.openBlock({ leadingLineBreaks: formatOptions.leadingLineBreaks || 2 });
  builder.addInline("-".repeat(formatOptions.length || builder.options.wordwrap || 40));
  builder.closeBlock({ trailingLineBreaks: formatOptions.trailingLineBreaks || 2 });
}
__name(formatHorizontalLine, "formatHorizontalLine");
function formatParagraph(elem, walk, builder, formatOptions) {
  builder.openBlock({ leadingLineBreaks: formatOptions.leadingLineBreaks || 2 });
  walk(elem.children, builder);
  builder.closeBlock({ trailingLineBreaks: formatOptions.trailingLineBreaks || 2 });
}
__name(formatParagraph, "formatParagraph");
function formatPre(elem, walk, builder, formatOptions) {
  builder.openBlock({
    isPre: true,
    leadingLineBreaks: formatOptions.leadingLineBreaks || 2
  });
  walk(elem.children, builder);
  builder.closeBlock({ trailingLineBreaks: formatOptions.trailingLineBreaks || 2 });
}
__name(formatPre, "formatPre");
function formatHeading(elem, walk, builder, formatOptions) {
  builder.openBlock({ leadingLineBreaks: formatOptions.leadingLineBreaks || 2 });
  if (formatOptions.uppercase !== false) {
    builder.pushWordTransform((str) => str.toUpperCase());
    walk(elem.children, builder);
    builder.popWordTransform();
  } else {
    walk(elem.children, builder);
  }
  builder.closeBlock({ trailingLineBreaks: formatOptions.trailingLineBreaks || 2 });
}
__name(formatHeading, "formatHeading");
function formatBlockquote(elem, walk, builder, formatOptions) {
  builder.openBlock({
    leadingLineBreaks: formatOptions.leadingLineBreaks || 2,
    reservedLineLength: 2
  });
  walk(elem.children, builder);
  builder.closeBlock({
    trailingLineBreaks: formatOptions.trailingLineBreaks || 2,
    blockTransform: /* @__PURE__ */ __name((str) => (formatOptions.trimEmptyLines !== false ? trimCharacter(str, "\n") : str).split("\n").map((line) => "> " + line).join("\n"), "blockTransform")
  });
}
__name(formatBlockquote, "formatBlockquote");
function withBrackets(str, brackets) {
  if (!brackets) {
    return str;
  }
  const lbr = typeof brackets[0] === "string" ? brackets[0] : "[";
  const rbr = typeof brackets[1] === "string" ? brackets[1] : "]";
  return lbr + str + rbr;
}
__name(withBrackets, "withBrackets");
function pathRewrite(path, rewriter, baseUrl, metadata, elem) {
  const modifiedPath = typeof rewriter === "function" ? rewriter(path, metadata, elem) : path;
  return modifiedPath[0] === "/" && baseUrl ? trimCharacterEnd(baseUrl, "/") + modifiedPath : modifiedPath;
}
__name(pathRewrite, "pathRewrite");
function formatImage(elem, walk, builder, formatOptions) {
  const attribs = elem.attribs || {};
  const alt = attribs.alt ? attribs.alt : "";
  const src = !attribs.src ? "" : pathRewrite(attribs.src, formatOptions.pathRewrite, formatOptions.baseUrl, builder.metadata, elem);
  const text = !src ? alt : !alt ? withBrackets(src, formatOptions.linkBrackets) : alt + " " + withBrackets(src, formatOptions.linkBrackets);
  builder.addInline(text, { noWordTransform: true });
}
__name(formatImage, "formatImage");
function formatAnchor(elem, walk, builder, formatOptions) {
  function getHref() {
    if (formatOptions.ignoreHref) {
      return "";
    }
    if (!elem.attribs || !elem.attribs.href) {
      return "";
    }
    let href2 = elem.attribs.href.replace(/^mailto:/, "");
    if (formatOptions.noAnchorUrl && href2[0] === "#") {
      return "";
    }
    href2 = pathRewrite(href2, formatOptions.pathRewrite, formatOptions.baseUrl, builder.metadata, elem);
    return href2;
  }
  __name(getHref, "getHref");
  const href = getHref();
  if (!href) {
    walk(elem.children, builder);
  } else {
    let text = "";
    builder.pushWordTransform(
      (str) => {
        if (str) {
          text += str;
        }
        return str;
      }
    );
    walk(elem.children, builder);
    builder.popWordTransform();
    const hideSameLink = formatOptions.hideLinkHrefIfSameAsText && href === text;
    if (!hideSameLink) {
      builder.addInline(
        !text ? href : " " + withBrackets(href, formatOptions.linkBrackets),
        { noWordTransform: true }
      );
    }
  }
}
__name(formatAnchor, "formatAnchor");
function formatList(elem, walk, builder, formatOptions, nextPrefixCallback) {
  const isNestedList = get(elem, ["parent", "name"]) === "li";
  let maxPrefixLength = 0;
  const listItems = (elem.children || []).filter((child) => child.type !== "text" || !/^\s*$/.test(child.data)).map(function(child) {
    if (child.name !== "li") {
      return { node: child, prefix: "" };
    }
    const prefix = isNestedList ? nextPrefixCallback().trimStart() : nextPrefixCallback();
    if (prefix.length > maxPrefixLength) {
      maxPrefixLength = prefix.length;
    }
    return { node: child, prefix };
  });
  if (!listItems.length) {
    return;
  }
  builder.openList({
    interRowLineBreaks: 1,
    leadingLineBreaks: isNestedList ? 1 : formatOptions.leadingLineBreaks || 2,
    maxPrefixLength,
    prefixAlign: "left"
  });
  for (const { node, prefix } of listItems) {
    builder.openListItem({ prefix });
    walk([node], builder);
    builder.closeListItem();
  }
  builder.closeList({ trailingLineBreaks: isNestedList ? 1 : formatOptions.trailingLineBreaks || 2 });
}
__name(formatList, "formatList");
function formatUnorderedList(elem, walk, builder, formatOptions) {
  const prefix = formatOptions.itemPrefix || " * ";
  return formatList(elem, walk, builder, formatOptions, () => prefix);
}
__name(formatUnorderedList, "formatUnorderedList");
function formatOrderedList(elem, walk, builder, formatOptions) {
  let nextIndex = Number(elem.attribs.start || "1");
  const indexFunction = getOrderedListIndexFunction(elem.attribs.type);
  const nextPrefixCallback = /* @__PURE__ */ __name(() => " " + indexFunction(nextIndex++) + ". ", "nextPrefixCallback");
  return formatList(elem, walk, builder, formatOptions, nextPrefixCallback);
}
__name(formatOrderedList, "formatOrderedList");
function getOrderedListIndexFunction(olType = "1") {
  switch (olType) {
    case "a":
      return (i) => numberToLetterSequence(i, "a");
    case "A":
      return (i) => numberToLetterSequence(i, "A");
    case "i":
      return (i) => numberToRoman(i).toLowerCase();
    case "I":
      return (i) => numberToRoman(i);
    case "1":
    default:
      return (i) => i.toString();
  }
}
__name(getOrderedListIndexFunction, "getOrderedListIndexFunction");
function splitClassesAndIds(selectors) {
  const classes = [];
  const ids = [];
  for (const selector of selectors) {
    if (selector.startsWith(".")) {
      classes.push(selector.substring(1));
    } else if (selector.startsWith("#")) {
      ids.push(selector.substring(1));
    }
  }
  return { classes, ids };
}
__name(splitClassesAndIds, "splitClassesAndIds");
function isDataTable(attr, tables) {
  if (tables === true) {
    return true;
  }
  if (!attr) {
    return false;
  }
  const { classes, ids } = splitClassesAndIds(tables);
  const attrClasses = (attr["class"] || "").split(" ");
  const attrIds = (attr["id"] || "").split(" ");
  return attrClasses.some((x3) => classes.includes(x3)) || attrIds.some((x3) => ids.includes(x3));
}
__name(isDataTable, "isDataTable");
function formatTable(elem, walk, builder, formatOptions) {
  return isDataTable(elem.attribs, builder.options.tables) ? formatDataTable(elem, walk, builder, formatOptions) : formatBlock(elem, walk, builder, formatOptions);
}
__name(formatTable, "formatTable");
function formatBlock(elem, walk, builder, formatOptions) {
  builder.openBlock({ leadingLineBreaks: formatOptions.leadingLineBreaks });
  walk(elem.children, builder);
  builder.closeBlock({ trailingLineBreaks: formatOptions.trailingLineBreaks });
}
__name(formatBlock, "formatBlock");
function formatDataTable(elem, walk, builder, formatOptions) {
  builder.openTable();
  elem.children.forEach(walkTable);
  builder.closeTable({
    tableToString: /* @__PURE__ */ __name((rows) => tableToString(rows, formatOptions.rowSpacing ?? 0, formatOptions.colSpacing ?? 3), "tableToString"),
    leadingLineBreaks: formatOptions.leadingLineBreaks,
    trailingLineBreaks: formatOptions.trailingLineBreaks
  });
  function formatCell(cellNode) {
    const colspan = +get(cellNode, ["attribs", "colspan"]) || 1;
    const rowspan = +get(cellNode, ["attribs", "rowspan"]) || 1;
    builder.openTableCell({ maxColumnWidth: formatOptions.maxColumnWidth });
    walk(cellNode.children, builder);
    builder.closeTableCell({ colspan, rowspan });
  }
  __name(formatCell, "formatCell");
  function walkTable(elem2) {
    if (elem2.type !== "tag") {
      return;
    }
    const formatHeaderCell = formatOptions.uppercaseHeaderCells !== false ? (cellNode) => {
      builder.pushWordTransform((str) => str.toUpperCase());
      formatCell(cellNode);
      builder.popWordTransform();
    } : formatCell;
    switch (elem2.name) {
      case "thead":
      case "tbody":
      case "tfoot":
      case "center":
        elem2.children.forEach(walkTable);
        return;
      case "tr": {
        builder.openTableRow();
        for (const childOfTr of elem2.children) {
          if (childOfTr.type !== "tag") {
            continue;
          }
          switch (childOfTr.name) {
            case "th": {
              formatHeaderCell(childOfTr);
              break;
            }
            case "td": {
              formatCell(childOfTr);
              break;
            }
          }
        }
        builder.closeTableRow();
        break;
      }
    }
  }
  __name(walkTable, "walkTable");
}
__name(formatDataTable, "formatDataTable");
var textFormatters = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  anchor: formatAnchor,
  blockquote: formatBlockquote,
  dataTable: formatDataTable,
  heading: formatHeading,
  horizontalLine: formatHorizontalLine,
  image: formatImage,
  lineBreak: formatLineBreak,
  orderedList: formatOrderedList,
  paragraph: formatParagraph,
  pre: formatPre,
  table: formatTable,
  unorderedList: formatUnorderedList,
  wbr: formatWbr
});
var DEFAULT_OPTIONS = {
  baseElements: {
    selectors: ["body"],
    orderBy: "selectors",
    // 'selectors' | 'occurrence'
    returnDomByDefault: true
  },
  decodeEntities: true,
  encodeCharacters: {},
  formatters: {},
  limits: {
    ellipsis: "...",
    maxBaseElements: void 0,
    maxChildNodes: void 0,
    maxDepth: void 0,
    maxInputLength: 1 << 24
    // 16_777_216
  },
  longWordSplit: {
    forceWrapOnLimit: false,
    wrapCharacters: []
  },
  preserveNewlines: false,
  selectors: [
    { selector: "*", format: "inline" },
    {
      selector: "a",
      format: "anchor",
      options: {
        baseUrl: null,
        hideLinkHrefIfSameAsText: false,
        ignoreHref: false,
        linkBrackets: ["[", "]"],
        noAnchorUrl: true
      }
    },
    { selector: "article", format: "block", options: { leadingLineBreaks: 1, trailingLineBreaks: 1 } },
    { selector: "aside", format: "block", options: { leadingLineBreaks: 1, trailingLineBreaks: 1 } },
    {
      selector: "blockquote",
      format: "blockquote",
      options: { leadingLineBreaks: 2, trailingLineBreaks: 2, trimEmptyLines: true }
    },
    { selector: "br", format: "lineBreak" },
    { selector: "div", format: "block", options: { leadingLineBreaks: 1, trailingLineBreaks: 1 } },
    { selector: "footer", format: "block", options: { leadingLineBreaks: 1, trailingLineBreaks: 1 } },
    { selector: "form", format: "block", options: { leadingLineBreaks: 1, trailingLineBreaks: 1 } },
    { selector: "h1", format: "heading", options: { leadingLineBreaks: 3, trailingLineBreaks: 2, uppercase: true } },
    { selector: "h2", format: "heading", options: { leadingLineBreaks: 3, trailingLineBreaks: 2, uppercase: true } },
    { selector: "h3", format: "heading", options: { leadingLineBreaks: 3, trailingLineBreaks: 2, uppercase: true } },
    { selector: "h4", format: "heading", options: { leadingLineBreaks: 2, trailingLineBreaks: 2, uppercase: true } },
    { selector: "h5", format: "heading", options: { leadingLineBreaks: 2, trailingLineBreaks: 2, uppercase: true } },
    { selector: "h6", format: "heading", options: { leadingLineBreaks: 2, trailingLineBreaks: 2, uppercase: true } },
    { selector: "header", format: "block", options: { leadingLineBreaks: 1, trailingLineBreaks: 1 } },
    {
      selector: "hr",
      format: "horizontalLine",
      options: { leadingLineBreaks: 2, length: void 0, trailingLineBreaks: 2 }
    },
    {
      selector: "img",
      format: "image",
      options: { baseUrl: null, linkBrackets: ["[", "]"] }
    },
    { selector: "main", format: "block", options: { leadingLineBreaks: 1, trailingLineBreaks: 1 } },
    { selector: "nav", format: "block", options: { leadingLineBreaks: 1, trailingLineBreaks: 1 } },
    {
      selector: "ol",
      format: "orderedList",
      options: { leadingLineBreaks: 2, trailingLineBreaks: 2 }
    },
    { selector: "p", format: "paragraph", options: { leadingLineBreaks: 2, trailingLineBreaks: 2 } },
    { selector: "pre", format: "pre", options: { leadingLineBreaks: 2, trailingLineBreaks: 2 } },
    { selector: "section", format: "block", options: { leadingLineBreaks: 1, trailingLineBreaks: 1 } },
    {
      selector: "table",
      format: "table",
      options: {
        colSpacing: 3,
        leadingLineBreaks: 2,
        maxColumnWidth: 60,
        rowSpacing: 0,
        trailingLineBreaks: 2,
        uppercaseHeaderCells: true
      }
    },
    {
      selector: "ul",
      format: "unorderedList",
      options: { itemPrefix: " * ", leadingLineBreaks: 2, trailingLineBreaks: 2 }
    },
    { selector: "wbr", format: "wbr" }
  ],
  tables: [],
  // deprecated
  whitespaceCharacters: " 	\r\n\f​",
  wordwrap: 80
};
var concatMerge = /* @__PURE__ */ __name((acc, src, options) => [...acc, ...src], "concatMerge");
var overwriteMerge = /* @__PURE__ */ __name((acc, src, options) => [...src], "overwriteMerge");
var selectorsMerge = /* @__PURE__ */ __name((acc, src, options) => acc.some((s2) => typeof s2 === "object") ? concatMerge(acc, src) : overwriteMerge(acc, src), "selectorsMerge");
function compile(options = {}) {
  options = (0, import_deepmerge.default)(
    DEFAULT_OPTIONS,
    options,
    {
      arrayMerge: overwriteMerge,
      customMerge: /* @__PURE__ */ __name((key) => key === "selectors" ? selectorsMerge : void 0, "customMerge")
    }
  );
  options.formatters = Object.assign({}, genericFormatters, textFormatters, options.formatters);
  options.selectors = mergeDuplicatesPreferLast(options.selectors, (s2) => s2.selector);
  handleDeprecatedOptions(options);
  return compile$1(options);
}
__name(compile, "compile");
function convert(html, options = {}, metadata = void 0) {
  return compile(options)(html, metadata);
}
__name(convert, "convert");
function handleDeprecatedOptions(options) {
  if (options.tags) {
    const tagDefinitions = Object.entries(options.tags).map(
      ([selector, definition]) => ({ ...definition, selector: selector || "*" })
    );
    options.selectors.push(...tagDefinitions);
    options.selectors = mergeDuplicatesPreferLast(options.selectors, (s2) => s2.selector);
  }
  function set(obj, path, value) {
    const valueKey = path.pop();
    for (const key of path) {
      let nested = obj[key];
      if (!nested) {
        nested = {};
        obj[key] = nested;
      }
      obj = nested;
    }
    obj[valueKey] = value;
  }
  __name(set, "set");
  if (options["baseElement"]) {
    const baseElement = options["baseElement"];
    set(
      options,
      ["baseElements", "selectors"],
      Array.isArray(baseElement) ? baseElement : [baseElement]
    );
  }
  if (options["returnDomByDefault"] !== void 0) {
    set(options, ["baseElements", "returnDomByDefault"], options["returnDomByDefault"]);
  }
  for (const definition of options.selectors) {
    if (definition.format === "anchor" && get(definition, ["options", "noLinkBrackets"])) {
      set(definition, ["options", "linkBrackets"], false);
    }
  }
}
__name(handleDeprecatedOptions, "handleDeprecatedOptions");

// node_modules/@react-email/render/dist/node/index.mjs
var import_react = __toESM(require_react(), 1);

// node_modules/prettier/plugins/html.mjs
var html_exports = {};
__export(html_exports, {
  default: () => Ji,
  languages: () => Vi,
  options: () => Wi,
  parsers: () => Nr,
  printers: () => qo
});
init_esm();
var Lr = Object.defineProperty;
var Pr = /* @__PURE__ */ __name((e2) => {
  throw TypeError(e2);
}, "Pr");
var Zi = /* @__PURE__ */ __name((e2, t2, r2) => t2 in e2 ? Lr(e2, t2, { enumerable: true, configurable: true, writable: true, value: r2 }) : e2[t2] = r2, "Zi");
var Or = /* @__PURE__ */ __name((e2, t2) => {
  for (var r2 in t2) Lr(e2, r2, { get: t2[r2], enumerable: true });
}, "Or");
var Ut = /* @__PURE__ */ __name((e2, t2, r2) => Zi(e2, typeof t2 != "symbol" ? t2 + "" : t2, r2), "Ut");
var es = /* @__PURE__ */ __name((e2, t2, r2) => t2.has(e2) || Pr("Cannot " + r2), "es");
var Fe = /* @__PURE__ */ __name((e2, t2, r2) => (es(e2, t2, "read from private field"), r2 ? r2.call(e2) : t2.get(e2)), "Fe");
var Dr = /* @__PURE__ */ __name((e2, t2, r2) => t2.has(e2) ? Pr("Cannot add the same private member more than once") : t2 instanceof WeakSet ? t2.add(e2) : t2.set(e2, r2), "Dr");
var Ji = {};
Or(Ji, { languages: /* @__PURE__ */ __name(() => Vi, "languages"), options: /* @__PURE__ */ __name(() => Wi, "options"), parsers: /* @__PURE__ */ __name(() => Nr, "parsers"), printers: /* @__PURE__ */ __name(() => qo, "printers") });
var ve = /* @__PURE__ */ __name((e2, t2) => (r2, n2, ...i) => r2 | 1 && n2 == null ? void 0 : (t2.call(n2) ?? n2[e2]).apply(n2, i), "ve");
var ts = String.prototype.replaceAll ?? function(e2, t2) {
  return e2.global ? this.replace(e2, t2) : this.split(e2).join(t2);
};
var rs = ve("replaceAll", function() {
  if (typeof this == "string") return ts;
});
var w = rs;
function ns(e2) {
  return this[e2 < 0 ? this.length + e2 : e2];
}
__name(ns, "ns");
var is = ve("at", function() {
  if (Array.isArray(this) || typeof this == "string") return ns;
});
var M = is;
var ss = /* @__PURE__ */ __name(() => {
}, "ss");
var He = ss;
var Ve = "string";
var Ue = "array";
var lt = "cursor";
var Te = "indent";
var be = "align";
var ct = "trim";
var we = "group";
var ke = "fill";
var xe = "if-break";
var ye = "indent-if-break";
var ut = "line-suffix";
var pt = "line-suffix-boundary";
var $ = "line";
var ht = "label";
var Ae = "break-parent";
var mt = /* @__PURE__ */ new Set([lt, Te, be, ct, we, ke, xe, ye, ut, pt, $, ht, Ae]);
function as(e2) {
  if (typeof e2 == "string") return Ve;
  if (Array.isArray(e2)) return Ue;
  if (!e2) return;
  let { type: t2 } = e2;
  if (mt.has(t2)) return t2;
}
__name(as, "as");
var ft = as;
var os = /* @__PURE__ */ __name((e2) => new Intl.ListFormat("en-US", { type: "disjunction" }).format(e2), "os");
function ls(e2) {
  let t2 = e2 === null ? "null" : typeof e2;
  if (t2 !== "string" && t2 !== "object") return `Unexpected doc '${t2}', 
Expected it to be 'string' or 'object'.`;
  if (ft(e2)) throw new Error("doc is valid.");
  let r2 = Object.prototype.toString.call(e2);
  if (r2 !== "[object Object]") return `Unexpected doc '${r2}'.`;
  let n2 = os([...mt].map((i) => `'${i}'`));
  return `Unexpected doc.type '${e2.type}'.
Expected it to be ${n2}.`;
}
__name(ls, "ls");
var Wt = class extends Error {
  static {
    __name(this, "Wt");
  }
  name = "InvalidDocError";
  constructor(t2) {
    super(ls(t2)), this.doc = t2;
  }
};
var Ir = Wt;
function Gt(e2, t2) {
  if (typeof e2 == "string") return t2(e2);
  let r2 = /* @__PURE__ */ new Map();
  return n2(e2);
  function n2(s2) {
    if (r2.has(s2)) return r2.get(s2);
    let a = i(s2);
    return r2.set(s2, a), a;
  }
  __name(n2, "n");
  function i(s2) {
    switch (ft(s2)) {
      case Ue:
        return t2(s2.map(n2));
      case ke:
        return t2({ ...s2, parts: s2.parts.map(n2) });
      case xe:
        return t2({ ...s2, breakContents: n2(s2.breakContents), flatContents: n2(s2.flatContents) });
      case we: {
        let { expandedStates: a, contents: o2 } = s2;
        return a ? (a = a.map(n2), o2 = a[0]) : o2 = n2(o2), t2({ ...s2, contents: o2, expandedStates: a });
      }
      case be:
      case Te:
      case ye:
      case ht:
      case ut:
        return t2({ ...s2, contents: n2(s2.contents) });
      case Ve:
      case lt:
      case ct:
      case pt:
      case $:
      case Ae:
        return t2(s2);
      default:
        throw new Ir(s2);
    }
  }
  __name(i, "i");
}
__name(Gt, "Gt");
function L(e2, t2 = Rr) {
  return Gt(e2, (r2) => typeof r2 == "string" ? B(t2, r2.split(`
`)) : r2);
}
__name(L, "L");
var D = He;
var dt = He;
var Mr = He;
var Br = He;
function A(e2) {
  return D(e2), { type: Te, contents: e2 };
}
__name(A, "A");
function cs(e2, t2) {
  return Br(e2), D(t2), { type: be, contents: t2, n: e2 };
}
__name(cs, "cs");
function qr(e2) {
  return cs(Number.NEGATIVE_INFINITY, e2);
}
__name(qr, "qr");
var Y = { type: Ae };
function gt(e2) {
  return Mr(e2), { type: ke, parts: e2 };
}
__name(gt, "gt");
function E(e2, t2 = {}) {
  return D(e2), dt(t2.expandedStates, true), { type: we, id: t2.id, contents: e2, break: !!t2.shouldBreak, expandedStates: t2.expandedStates };
}
__name(E, "E");
function j(e2, t2 = "", r2 = {}) {
  return D(e2), t2 !== "" && D(t2), { type: xe, breakContents: e2, flatContents: t2, groupId: r2.groupId };
}
__name(j, "j");
function Fr(e2, t2) {
  return D(e2), { type: ye, contents: e2, groupId: t2.groupId, negate: t2.negate };
}
__name(Fr, "Fr");
function B(e2, t2) {
  D(e2), dt(t2);
  let r2 = [];
  for (let n2 = 0; n2 < t2.length; n2++) n2 !== 0 && r2.push(e2), r2.push(t2[n2]);
  return r2;
}
__name(B, "B");
var S = { type: $ };
var k = { type: $, soft: true };
var us = { type: $, hard: true };
var C = [us, Y];
var ps = { type: $, hard: true, literal: true };
var Rr = [ps, Y];
var Hr = Object.freeze({ character: "'", codePoint: 39 });
var Vr = Object.freeze({ character: '"', codePoint: 34 });
var hs = Object.freeze({ preferred: Hr, alternate: Vr });
var ms = Object.freeze({ preferred: Vr, alternate: Hr });
function fs(e2, t2) {
  let { preferred: r2, alternate: n2 } = t2 === true || t2 === "'" ? hs : ms, { length: i } = e2, s2 = 0, a = 0;
  for (let o2 = 0; o2 < i; o2++) {
    let c2 = e2.charCodeAt(o2);
    c2 === r2.codePoint ? s2++ : c2 === n2.codePoint && a++;
  }
  return (s2 > a ? n2 : r2).character;
}
__name(fs, "fs");
var Ur = fs;
function zt(e2) {
  if (typeof e2 != "string") throw new TypeError("Expected a string");
  return e2.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
}
__name(zt, "zt");
var $t = class {
  static {
    __name(this, "$t");
  }
  #e;
  constructor(t2) {
    this.#e = new Set(t2);
  }
  getLeadingWhitespaceCount(t2) {
    let r2 = this.#e, n2 = 0;
    for (let i = 0; i < t2.length && r2.has(t2.charAt(i)); i++) n2++;
    return n2;
  }
  getTrailingWhitespaceCount(t2) {
    let r2 = this.#e, n2 = 0;
    for (let i = t2.length - 1; i >= 0 && r2.has(t2.charAt(i)); i--) n2++;
    return n2;
  }
  getLeadingWhitespace(t2) {
    let r2 = this.getLeadingWhitespaceCount(t2);
    return t2.slice(0, r2);
  }
  getTrailingWhitespace(t2) {
    let r2 = this.getTrailingWhitespaceCount(t2);
    return t2.slice(t2.length - r2);
  }
  hasLeadingWhitespace(t2) {
    return this.#e.has(t2.charAt(0));
  }
  hasTrailingWhitespace(t2) {
    return this.#e.has(M(0, t2, -1));
  }
  trimStart(t2) {
    let r2 = this.getLeadingWhitespaceCount(t2);
    return t2.slice(r2);
  }
  trimEnd(t2) {
    let r2 = this.getTrailingWhitespaceCount(t2);
    return t2.slice(0, t2.length - r2);
  }
  trim(t2) {
    return this.trimEnd(this.trimStart(t2));
  }
  split(t2, r2 = false) {
    let n2 = `[${zt([...this.#e].join(""))}]+`, i = new RegExp(r2 ? `(${n2})` : n2, "u");
    return t2.split(i);
  }
  hasWhitespaceCharacter(t2) {
    let r2 = this.#e;
    return Array.prototype.some.call(t2, (n2) => r2.has(n2));
  }
  hasNonWhitespaceCharacter(t2) {
    let r2 = this.#e;
    return Array.prototype.some.call(t2, (n2) => !r2.has(n2));
  }
  isWhitespaceOnly(t2) {
    let r2 = this.#e;
    return Array.prototype.every.call(t2, (n2) => r2.has(n2));
  }
  #t(t2) {
    let r2 = Number.POSITIVE_INFINITY;
    for (let n2 of t2.split(`
`)) {
      if (n2.length === 0) continue;
      let i = this.getLeadingWhitespaceCount(n2);
      if (i === 0) return 0;
      n2.length !== i && i < r2 && (r2 = i);
    }
    return r2 === Number.POSITIVE_INFINITY ? 0 : r2;
  }
  dedentString(t2) {
    let r2 = this.#t(t2);
    return r2 === 0 ? t2 : t2.split(`
`).map((n2) => n2.slice(r2)).join(`
`);
  }
};
var Wr = $t;
var ds = ["	", `
`, "\f", "\r", " "];
var gs = new Wr(ds);
var N = gs;
var Yt = class extends Error {
  static {
    __name(this, "Yt");
  }
  name = "UnexpectedNodeError";
  constructor(t2, r2, n2 = "type") {
    super(`Unexpected ${r2} node ${n2}: ${JSON.stringify(t2[n2])}.`), this.node = t2;
  }
};
var Gr = Yt;
var _s = /* @__PURE__ */ new Set(["sourceSpan", "startSourceSpan", "endSourceSpan", "nameSpan", "valueSpan", "keySpan", "tagDefinition", "tokens", "valueTokens", "switchValueSourceSpan", "expSourceSpan", "valueSourceSpan"]);
var Ss = /* @__PURE__ */ new Set(["if", "else if", "for", "switch", "case"]);
function zr(e2, t2, r2) {
  if (e2.kind === "text" || e2.kind === "comment") return null;
  if (e2.kind === "yaml" && delete t2.value, e2.kind === "attribute") {
    let { fullName: n2, value: i } = e2;
    n2 === "style" || n2 === "class" || n2 === "srcset" && (r2.fullName === "img" || r2.fullName === "source") || n2 === "allow" && r2.fullName === "iframe" || n2.startsWith("on") || n2.startsWith("@") || n2.startsWith(":") || n2.startsWith(".") || n2.startsWith("#") || n2.startsWith("v-") || n2 === "vars" && r2.fullName === "style" || (n2 === "setup" || n2 === "generic") && r2.fullName === "script" || n2 === "slot-scope" || n2.startsWith("(") || n2.startsWith("[") || n2.startsWith("*") || n2.startsWith("bind") || n2.startsWith("i18n") || n2.startsWith("on-") || n2.startsWith("ng-") || i?.includes("{{") ? delete t2.value : i && (t2.value = w(0, i, /'|&quot;|&apos;/gu, '"'));
  }
  if (e2.kind === "docType" && (t2.value = w(0, e2.value.toLowerCase(), /\s+/gu, " ")), e2.kind === "angularControlFlowBlock" && e2.parameters?.children) for (let n2 of t2.parameters.children) Ss.has(e2.name) ? delete n2.expression : n2.expression = n2.expression.trim();
  e2.kind === "angularIcuExpression" && (t2.switchValue = e2.switchValue.trim()), e2.kind === "angularLetDeclarationInitializer" && delete t2.value, e2.kind === "element" && e2.isVoid && !e2.isSelfClosing && (t2.isSelfClosing = true);
}
__name(zr, "zr");
zr.ignoredProperties = _s;
var $r = zr;
function X(e2, t2 = true) {
  return [A([k, e2]), t2 ? k : ""];
}
__name(X, "X");
function V2(e2, t2) {
  let r2 = e2.type === "NGRoot" ? e2.node.type === "NGMicrosyntax" && e2.node.body.length === 1 && e2.node.body[0].type === "NGMicrosyntaxExpression" ? e2.node.body[0].expression : e2.node : e2.type === "JsExpressionRoot" ? e2.node : e2;
  return r2 && (r2.type === "ObjectExpression" || r2.type === "ArrayExpression" || (t2.parser === "__vue_expression" || t2.parser === "__vue_ts_expression" || t2.parser === "__ng_binding" || t2.parser === "__ng_directive") && (r2.type === "TemplateLiteral" || r2.type === "StringLiteral"));
}
__name(V2, "V");
async function x(e2, t2, r2, n2) {
  r2 = { __isInHtmlAttribute: true, __embeddedInHtml: true, ...r2 };
  let i = true;
  n2 && (r2.__onHtmlBindingRoot = (a, o2) => {
    i = n2(a, o2);
  });
  let s2 = await t2(e2, r2, t2);
  return i ? E(s2) : X(s2);
}
__name(x, "x");
function Es(e2, t2, r2, n2) {
  let { node: i } = r2, s2 = n2.originalText.slice(i.sourceSpan.start.offset, i.sourceSpan.end.offset);
  return /^\s*$/u.test(s2) ? "" : x(s2, e2, { parser: "__ng_directive", __isInHtmlAttribute: false }, V2);
}
__name(Es, "Es");
var Yr = Es;
var Cs = Array.prototype.toReversed ?? function() {
  return [...this].reverse();
};
var vs = ve("toReversed", function() {
  if (Array.isArray(this)) return Cs;
});
var jr = vs;
function Ts() {
  let e2 = globalThis, t2 = e2.Deno?.build?.os;
  return typeof t2 == "string" ? t2 === "windows" : e2.navigator?.platform?.startsWith("Win") ?? e2.process?.platform?.startsWith("win") ?? false;
}
__name(Ts, "Ts");
var bs = Ts();
function Xr(e2) {
  if (e2 = e2 instanceof URL ? e2 : new URL(e2), e2.protocol !== "file:") throw new TypeError(`URL must be a file URL: received "${e2.protocol}"`);
  return e2;
}
__name(Xr, "Xr");
function ws2(e2) {
  return e2 = Xr(e2), decodeURIComponent(e2.pathname.replace(/%(?![0-9A-Fa-f]{2})/g, "%25"));
}
__name(ws2, "ws");
function ks(e2) {
  e2 = Xr(e2);
  let t2 = decodeURIComponent(e2.pathname.replace(/\//g, "\\").replace(/%(?![0-9A-Fa-f]{2})/g, "%25")).replace(/^\\*([A-Za-z]:)(\\|$)/, "$1\\");
  return e2.hostname !== "" && (t2 = `\\\\${e2.hostname}${t2}`), t2;
}
__name(ks, "ks");
function jt(e2) {
  return bs ? ks(e2) : ws2(e2);
}
__name(jt, "jt");
var Kr = /* @__PURE__ */ __name((e2) => String(e2).split(/[/\\]/u).pop(), "Kr");
var Qr = /* @__PURE__ */ __name((e2) => String(e2).startsWith("file:"), "Qr");
function xs(e2) {
  return Array.isArray(e2) && e2.length > 0;
}
__name(xs, "xs");
var Ne = xs;
function Jr(e2, t2) {
  if (!t2) return;
  let r2 = Kr(t2).toLowerCase();
  return e2.find(({ filenames: n2 }) => n2?.some((i) => i.toLowerCase() === r2)) ?? e2.find(({ extensions: n2 }) => n2?.some((i) => r2.endsWith(i)));
}
__name(Jr, "Jr");
function ys(e2, t2) {
  if (t2) return e2.find(({ name: r2 }) => r2.toLowerCase() === t2) ?? e2.find(({ aliases: r2 }) => r2?.includes(t2)) ?? e2.find(({ extensions: r2 }) => r2?.includes(`.${t2}`));
}
__name(ys, "ys");
var As = void 0;
function Zr(e2, t2) {
  if (t2) {
    if (Qr(t2)) try {
      t2 = jt(t2);
    } catch {
      return;
    }
    if (typeof t2 == "string") return e2.find(({ isSupported: r2 }) => r2?.({ filepath: t2 }));
  }
}
__name(Zr, "Zr");
function Ns(e2, t2) {
  let r2 = jr(0, e2.plugins).flatMap((i) => i.languages ?? []);
  return (ys(r2, t2.language) ?? Jr(r2, t2.physicalFile) ?? Jr(r2, t2.file) ?? Zr(r2, t2.physicalFile) ?? Zr(r2, t2.file) ?? As?.(r2, t2.physicalFile))?.parsers[0];
}
__name(Ns, "Ns");
var _t = Ns;
var St = Symbol.for("PRETTIER_IS_FRONT_MATTER");
function Ls(e2) {
  return !!e2?.[St];
}
__name(Ls, "Ls");
var ie = Ls;
var We = 3;
function Ps(e2) {
  let t2 = e2.slice(0, We);
  if (t2 !== "---" && t2 !== "+++") return;
  let r2 = e2.indexOf(`
`, We);
  if (r2 === -1) return;
  let n2 = e2.slice(We, r2).trim(), i = e2.indexOf(`
${t2}`, r2), s2 = n2;
  if (s2 || (s2 = t2 === "+++" ? "toml" : "yaml"), i === -1 && t2 === "---" && s2 === "yaml" && (i = e2.indexOf(`
...`, r2)), i === -1) return;
  let a = i + 1 + We, o2 = e2.charAt(a + 1);
  if (!/\s?/u.test(o2)) return;
  let c2 = e2.slice(0, a), u;
  return { language: s2, explicitLanguage: n2 || null, value: e2.slice(r2 + 1, i), startDelimiter: t2, endDelimiter: c2.slice(-We), raw: c2, start: { line: 1, column: 0, index: 0 }, end: { index: c2.length, get line() {
    return u ?? (u = c2.split(`
`)), u.length;
  }, get column() {
    return u ?? (u = c2.split(`
`)), M(0, u, -1).length;
  } }, [St]: true };
}
__name(Ps, "Ps");
function Os(e2) {
  let t2 = Ps(e2);
  return t2 ? { frontMatter: t2, get content() {
    let { raw: r2 } = t2;
    return w(0, r2, /[^\n]/gu, " ") + e2.slice(r2.length);
  } } : { content: e2 };
}
__name(Os, "Os");
var Xt = Os;
var en = "inline";
var Kt = { area: "none", base: "none", basefont: "none", datalist: "none", head: "none", link: "none", meta: "none", noembed: "none", noframes: "none", param: "block", rp: "none", script: "block", style: "none", template: "inline", title: "none", html: "block", body: "block", address: "block", blockquote: "block", center: "block", dialog: "block", div: "block", figure: "block", figcaption: "block", footer: "block", form: "block", header: "block", hr: "block", legend: "block", listing: "block", main: "block", p: "block", plaintext: "block", pre: "block", search: "block", xmp: "block", slot: "contents", ruby: "ruby", rt: "ruby-text", article: "block", aside: "block", h1: "block", h2: "block", h3: "block", h4: "block", h5: "block", h6: "block", hgroup: "block", nav: "block", section: "block", dir: "block", dd: "block", dl: "block", dt: "block", menu: "block", ol: "block", ul: "block", li: "list-item", table: "table", caption: "table-caption", colgroup: "table-column-group", col: "table-column", thead: "table-header-group", tbody: "table-row-group", tfoot: "table-footer-group", tr: "table-row", td: "table-cell", th: "table-cell", input: "inline-block", button: "inline-block", fieldset: "block", details: "block", summary: "block", marquee: "inline-block", select: "inline-block", source: "block", track: "block", meter: "inline-block", progress: "inline-block", object: "inline-block", video: "inline-block", audio: "inline-block", option: "block", optgroup: "block" };
var tn = "normal";
var Qt = { listing: "pre", plaintext: "pre", pre: "pre", xmp: "pre", nobr: "nowrap", table: "initial", textarea: "pre-wrap" };
function Ds(e2) {
  return e2.kind === "element" && !e2.hasExplicitNamespace && !["html", "svg"].includes(e2.namespace);
}
__name(Ds, "Ds");
var se = Ds;
var Is = /* @__PURE__ */ __name((e2) => w(0, e2, /^[\t\f\r ]*\n/gu, ""), "Is");
var Jt = /* @__PURE__ */ __name((e2) => Is(N.trimEnd(e2)), "Jt");
var rn = /* @__PURE__ */ __name((e2) => {
  let t2 = e2, r2 = N.getLeadingWhitespace(t2);
  r2 && (t2 = t2.slice(r2.length));
  let n2 = N.getTrailingWhitespace(t2);
  return n2 && (t2 = t2.slice(0, -n2.length)), { leadingWhitespace: r2, trailingWhitespace: n2, text: t2 };
}, "rn");
function Et(e2, t2) {
  return !!(e2.kind === "ieConditionalComment" && e2.lastChild && !e2.lastChild.isSelfClosing && !e2.lastChild.endSourceSpan || e2.kind === "ieConditionalComment" && !e2.complete || ae(e2) && e2.children.some((r2) => r2.kind !== "text" && r2.kind !== "interpolation") || Tt(e2, t2) && !q(e2, t2) && e2.kind !== "interpolation");
}
__name(Et, "Et");
function oe(e2) {
  return e2.kind === "attribute" || !e2.parent || !e2.prev ? false : Rs(e2.prev);
}
__name(oe, "oe");
function Rs(e2) {
  return e2.kind === "comment" && e2.value.trim() === "prettier-ignore";
}
__name(Rs, "Rs");
function O(e2) {
  return e2.kind === "text" || e2.kind === "comment";
}
__name(O, "O");
function q(e2, t2) {
  return e2.kind === "element" && (e2.fullName === "script" || e2.fullName === "style" || e2.fullName === "svg:style" || e2.fullName === "svg:script" || e2.fullName === "mj-style" && t2.parser === "mjml" || se(e2) && (e2.name === "script" || e2.name === "style"));
}
__name(q, "q");
function nn(e2, t2) {
  return e2.children && !q(e2, t2);
}
__name(nn, "nn");
function sn(e2, t2) {
  return q(e2, t2) || e2.kind === "interpolation" || Zt(e2);
}
__name(sn, "sn");
function Zt(e2) {
  return gn(e2).startsWith("pre");
}
__name(Zt, "Zt");
function an(e2, t2) {
  let r2 = n2();
  if (r2 && !e2.prev && e2.parent?.tagDefinition?.ignoreFirstLf) return e2.kind === "interpolation";
  return r2;
  function n2() {
    return ie(e2) || e2.kind === "angularControlFlowBlock" ? false : (e2.kind === "text" || e2.kind === "interpolation") && e2.prev && (e2.prev.kind === "text" || e2.prev.kind === "interpolation") ? true : !e2.parent || e2.parent.cssDisplay === "none" ? false : ae(e2.parent) ? true : !(!e2.prev && (e2.parent.kind === "root" || ae(e2) && e2.parent || q(e2.parent, t2) || $e(e2.parent, t2) || !Vs(e2.parent.cssDisplay)) || e2.prev && !Gs(e2.prev.cssDisplay));
  }
  __name(n2, "n");
}
__name(an, "an");
function on(e2, t2) {
  return ie(e2) || e2.kind === "angularControlFlowBlock" ? false : (e2.kind === "text" || e2.kind === "interpolation") && e2.next && (e2.next.kind === "text" || e2.next.kind === "interpolation") ? true : !e2.parent || e2.parent.cssDisplay === "none" ? false : ae(e2.parent) ? true : !(!e2.next && (e2.parent.kind === "root" || ae(e2) && e2.parent || q(e2.parent, t2) || $e(e2.parent, t2) || !Us(e2.parent.cssDisplay)) || e2.next && !Ws(e2.next.cssDisplay));
}
__name(on, "on");
function ln(e2, t2) {
  return zs(e2.cssDisplay) && !q(e2, t2);
}
__name(ln, "ln");
function Ge(e2) {
  return ie(e2) || e2.next && e2.sourceSpan.end && e2.sourceSpan.end.line + 1 < e2.next.sourceSpan.start.line;
}
__name(Ge, "Ge");
function cn(e2) {
  return er(e2) || e2.kind === "element" && e2.children.length > 0 && (["body", "script", "style"].includes(e2.name) || e2.children.some((t2) => Bs(t2))) || e2.firstChild && e2.firstChild === e2.lastChild && e2.firstChild.kind !== "text" && pn(e2.firstChild) && (!e2.lastChild.isTrailingSpaceSensitive || hn(e2.lastChild));
}
__name(cn, "cn");
function er(e2) {
  return e2.kind === "element" && e2.children.length > 0 && (["html", "head", "ul", "ol", "select"].includes(e2.name) || e2.cssDisplay.startsWith("table") && e2.cssDisplay !== "table-cell");
}
__name(er, "er");
function Ct(e2) {
  return mn(e2) || e2.prev && Ms(e2.prev) || un(e2);
}
__name(Ct, "Ct");
function Ms(e2) {
  return mn(e2) || e2.kind === "element" && e2.fullName === "br" || un(e2);
}
__name(Ms, "Ms");
function un(e2) {
  return pn(e2) && hn(e2);
}
__name(un, "un");
function pn(e2) {
  return e2.hasLeadingSpaces && (e2.prev ? e2.prev.sourceSpan.end.line < e2.sourceSpan.start.line : e2.parent.kind === "root" || e2.parent.startSourceSpan.end.line < e2.sourceSpan.start.line);
}
__name(pn, "pn");
function hn(e2) {
  return e2.hasTrailingSpaces && (e2.next ? e2.next.sourceSpan.start.line > e2.sourceSpan.end.line : e2.parent.kind === "root" || e2.parent.endSourceSpan && e2.parent.endSourceSpan.start.line > e2.sourceSpan.end.line);
}
__name(hn, "hn");
function mn(e2) {
  switch (e2.kind) {
    case "ieConditionalComment":
    case "comment":
    case "directive":
      return true;
    case "element":
      return ["script", "select"].includes(e2.name);
  }
  return false;
}
__name(mn, "mn");
function vt(e2) {
  return e2.lastChild ? vt(e2.lastChild) : e2;
}
__name(vt, "vt");
function Bs(e2) {
  return e2.children?.some((t2) => t2.kind !== "text");
}
__name(Bs, "Bs");
function fn(e2) {
  if (e2) switch (e2) {
    case "module":
    case "text/javascript":
    case "text/babel":
    case "text/jsx":
    case "application/javascript":
      return "babel";
    case "application/x-typescript":
      return "typescript";
    case "text/markdown":
      return "markdown";
    case "text/html":
      return "html";
    case "text/x-handlebars-template":
      return "glimmer";
    default:
      if (e2.endsWith("json") || e2.endsWith("importmap") || e2 === "speculationrules") return "json";
  }
}
__name(fn, "fn");
function qs(e2, t2) {
  let { name: r2, attrMap: n2 } = e2;
  if (r2 !== "script" || Object.prototype.hasOwnProperty.call(n2, "src")) return;
  let { type: i, lang: s2 } = e2.attrMap;
  return !s2 && !i ? "babel" : _t(t2, { language: s2 }) ?? fn(i);
}
__name(qs, "qs");
function Fs(e2, t2) {
  if (!Tt(e2, t2)) return;
  let { attrMap: r2 } = e2;
  if (Object.prototype.hasOwnProperty.call(r2, "src")) return;
  let { type: n2, lang: i } = r2;
  return _t(t2, { language: i }) ?? fn(n2);
}
__name(Fs, "Fs");
function Hs(e2, t2) {
  if (e2.name === "style") {
    let { lang: r2 } = e2.attrMap;
    return r2 ? _t(t2, { language: r2 }) : "css";
  }
  if (e2.name === "mj-style" && t2.parser === "mjml") return "css";
}
__name(Hs, "Hs");
function tr(e2, t2) {
  return qs(e2, t2) ?? Hs(e2, t2) ?? Fs(e2, t2);
}
__name(tr, "tr");
function ze(e2) {
  return e2 === "block" || e2 === "list-item" || e2.startsWith("table");
}
__name(ze, "ze");
function Vs(e2) {
  return !ze(e2) && e2 !== "inline-block";
}
__name(Vs, "Vs");
function Us(e2) {
  return !ze(e2) && e2 !== "inline-block";
}
__name(Us, "Us");
function Ws(e2) {
  return !ze(e2);
}
__name(Ws, "Ws");
function Gs(e2) {
  return !ze(e2);
}
__name(Gs, "Gs");
function zs(e2) {
  return !ze(e2) && e2 !== "inline-block";
}
__name(zs, "zs");
function ae(e2) {
  return gn(e2).startsWith("pre");
}
__name(ae, "ae");
function $s(e2, t2) {
  let r2 = e2;
  for (; r2; ) {
    if (t2(r2)) return true;
    r2 = r2.parent;
  }
  return false;
}
__name($s, "$s");
function dn(e2, t2) {
  if (le(e2, t2)) return "block";
  if (e2.prev?.kind === "comment") {
    let n2 = e2.prev.value.match(/^\s*display:\s*([a-z]+)\s*$/u);
    if (n2) return n2[1];
  }
  let r2 = false;
  if (e2.kind === "element" && e2.namespace === "svg") if ($s(e2, (n2) => n2.fullName === "svg:foreignObject")) r2 = true;
  else return e2.name === "svg" ? "inline-block" : "block";
  switch (t2.htmlWhitespaceSensitivity) {
    case "strict":
      return "inline";
    case "ignore":
      return "block";
    default:
      if (e2.kind === "element" && (!e2.namespace || r2 || se(e2)) && Object.prototype.hasOwnProperty.call(Kt, e2.name)) return Kt[e2.name];
  }
  return en;
}
__name(dn, "dn");
function gn(e2) {
  return e2.kind === "element" && (!e2.namespace || se(e2)) && Object.prototype.hasOwnProperty.call(Qt, e2.name) ? Qt[e2.name] : tn;
}
__name(gn, "gn");
function rr(e2) {
  return w(0, w(0, e2, "&apos;", "'"), "&quot;", '"');
}
__name(rr, "rr");
function b(e2) {
  return rr(e2.value);
}
__name(b, "b");
var Ys = /* @__PURE__ */ new Set(["template", "style", "script"]);
function $e(e2, t2) {
  return le(e2, t2) && !Ys.has(e2.fullName);
}
__name($e, "$e");
function le(e2, t2) {
  return t2.parser === "vue" && e2.kind === "element" && e2.parent.kind === "root" && e2.fullName.toLowerCase() !== "html";
}
__name(le, "le");
function Tt(e2, t2) {
  return le(e2, t2) && ($e(e2, t2) || e2.attrMap.lang && e2.attrMap.lang !== "html");
}
__name(Tt, "Tt");
function _n(e2) {
  let t2 = e2.fullName;
  return t2.charAt(0) === "#" || t2 === "slot-scope" || t2 === "v-slot" || t2.startsWith("v-slot:");
}
__name(_n, "_n");
function Sn(e2, t2) {
  let r2 = e2.parent;
  if (!le(r2, t2)) return false;
  let n2 = r2.fullName, i = e2.fullName;
  return n2 === "script" && i === "setup" || n2 === "style" && i === "vars";
}
__name(Sn, "Sn");
function bt(e2, t2 = e2.value) {
  return e2.parent.isWhitespaceSensitive ? e2.parent.isIndentationSensitive ? L(t2) : L(N.dedentString(Jt(t2)), C) : B(S, N.split(t2));
}
__name(bt, "bt");
function wt(e2, t2) {
  return le(e2, t2) && e2.name === "script";
}
__name(wt, "wt");
function js(e2) {
  let { valueSpan: t2, value: r2 } = e2;
  return t2.end.offset - t2.start.offset === r2.length + 2;
}
__name(js, "js");
function kt(e2, t2) {
  if (js(e2)) return false;
  let { value: r2 } = e2;
  return /^PRETTIER_HTML_PLACEHOLDER_\d+_\d+_IN_JS$/u.test(r2) || t2.parser === "lwc" && r2.startsWith("{") && r2.endsWith("}");
}
__name(kt, "kt");
var En = /\{\{(.+?)\}\}/su;
var Cn = /* @__PURE__ */ __name(({ node: { value: e2 } }) => En.test(e2), "Cn");
async function vn(e2, t2, r2) {
  let n2 = b(r2.node), i = [];
  for (let [s2, a] of n2.split(En).entries()) if (s2 % 2 === 0) i.push(L(a));
  else try {
    i.push(E(["{{", A([S, await x(a, e2, { parser: "__ng_interpolation", __isInHtmlInterpolation: true })]), S, "}}"]));
  } catch {
    i.push("{{", L(a), "}}");
  }
  return i;
}
__name(vn, "vn");
var nr = /* @__PURE__ */ __name((e2) => (t2, r2, n2) => x(b(n2.node), t2, { parser: e2 }, V2), "nr");
var Xs = [{ test(e2) {
  let t2 = e2.node.fullName;
  return t2.startsWith("(") && t2.endsWith(")") || t2.startsWith("on-");
}, print: nr("__ng_action") }, { test(e2) {
  let t2 = e2.node.fullName;
  return t2.startsWith("[") && t2.endsWith("]") || /^bind(?:on)?-/u.test(t2) || /^ng-(?:if|show|hide|class|style)$/u.test(t2);
}, print: nr("__ng_binding") }, { test: /* @__PURE__ */ __name((e2) => e2.node.fullName.startsWith("*"), "test"), print: nr("__ng_directive") }, { test: /* @__PURE__ */ __name((e2) => /^i18n(?:-.+)?$/u.test(e2.node.fullName), "test"), print: Ks }, { test: Cn, print: vn }].map(({ test: e2, print: t2 }) => ({ test: /* @__PURE__ */ __name((r2, n2) => n2.parser === "angular" && e2(r2), "test"), print: t2 }));
function Ks(e2, t2, { node: r2 }) {
  let n2 = b(r2);
  return X(gt(bt(r2, n2.trim())), !n2.includes("@@"));
}
__name(Ks, "Ks");
var Tn = Xs;
var bn = /* @__PURE__ */ __name(({ node: e2 }, t2) => !t2.parentParser && e2.fullName === "class" && !e2.value.includes("{{"), "bn");
var wn = /* @__PURE__ */ __name((e2, t2, r2) => b(r2.node).trim().split(/\s+/u).join(" "), "wn");
var ir = ["onabort", "onafterprint", "onauxclick", "onbeforeinput", "onbeforematch", "onbeforeprint", "onbeforetoggle", "onbeforeunload", "onblur", "oncancel", "oncanplay", "oncanplaythrough", "onchange", "onclick", "onclose", "oncommand", "oncontextlost", "oncontextmenu", "oncontextrestored", "oncopy", "oncuechange", "oncut", "ondblclick", "ondrag", "ondragend", "ondragenter", "ondragleave", "ondragover", "ondragstart", "ondrop", "ondurationchange", "onemptied", "onended", "onerror", "onfocus", "onformdata", "onhashchange", "oninput", "oninvalid", "onkeydown", "onkeypress", "onkeyup", "onlanguagechange", "onload", "onloadeddata", "onloadedmetadata", "onloadstart", "onmessage", "onmessageerror", "onmousedown", "onmouseenter", "onmouseleave", "onmousemove", "onmouseout", "onmouseover", "onmouseup", "onoffline", "ononline", "onpagehide", "onpagereveal", "onpageshow", "onpageswap", "onpaste", "onpause", "onplay", "onplaying", "onpopstate", "onprogress", "onratechange", "onrejectionhandled", "onreset", "onresize", "onscroll", "onscrollend", "onsecuritypolicyviolation", "onseeked", "onseeking", "onselect", "onslotchange", "onstalled", "onstorage", "onsubmit", "onsuspend", "ontimeupdate", "ontoggle", "onunhandledrejection", "onunload", "onvolumechange", "onwaiting", "onwheel"];
var Js = new Set(ir);
var kn = /* @__PURE__ */ __name(({ node: e2 }, t2) => Js.has(e2.fullName) && !t2.parentParser && !e2.value.includes("{{"), "kn");
var xn = /* @__PURE__ */ __name((e2, t2, r2) => x(b(r2.node), e2, { parser: "babel", __isHtmlInlineEventHandler: true }, () => false), "xn");
function Zs(e2) {
  let t2 = [];
  for (let r2 of e2.split(";")) {
    if (r2 = N.trim(r2), !r2) continue;
    let [n2, ...i] = N.split(r2);
    t2.push({ name: n2, value: i });
  }
  return t2;
}
__name(Zs, "Zs");
var yn = Zs;
var An = /* @__PURE__ */ __name(({ node: e2 }, t2) => e2.fullName === "allow" && !t2.parentParser && e2.parent.fullName === "iframe" && !e2.value.includes("{{"), "An");
function Nn(e2, t2, r2) {
  let { node: n2 } = r2, i = yn(b(n2));
  return i.length === 0 ? [""] : X(i.map(({ name: s2, value: a }, o2) => [[s2, ...a].join(" "), o2 === i.length - 1 ? j(";") : [";", S]]));
}
__name(Nn, "Nn");
function Ln(e2) {
  return e2 === "	" || e2 === `
` || e2 === "\f" || e2 === "\r" || e2 === " ";
}
__name(Ln, "Ln");
var ea = /^[ \t\n\r\u000c]+/;
var ta = /^[, \t\n\r\u000c]+/;
var ra = /^[^ \t\n\r\u000c]+/;
var na = /[,]+$/;
var Pn = /^\d+$/;
var ia = /^-?(?:[0-9]+|[0-9]*\.[0-9]+)(?:[eE][+-]?[0-9]+)?$/;
function sa(e2) {
  let t2 = e2.length, r2, n2, i, s2, a, o2 = 0, c2;
  function u(m) {
    let _2, T2 = m.exec(e2.substring(o2));
    if (T2) return [_2] = T2, o2 += _2.length, _2;
  }
  __name(u, "u");
  let p = [];
  for (; ; ) {
    if (u(ta), o2 >= t2) {
      if (p.length === 0) throw new Error("Must contain one or more image candidate strings.");
      return p;
    }
    c2 = o2, r2 = u(ra), n2 = [], r2.slice(-1) === "," ? (r2 = r2.replace(na, ""), g()) : d();
  }
  function d() {
    for (u(ea), i = "", s2 = "in descriptor"; ; ) {
      if (a = e2.charAt(o2), s2 === "in descriptor") if (Ln(a)) i && (n2.push(i), i = "", s2 = "after descriptor");
      else if (a === ",") {
        o2 += 1, i && n2.push(i), g();
        return;
      } else if (a === "(") i += a, s2 = "in parens";
      else if (a === "") {
        i && n2.push(i), g();
        return;
      } else i += a;
      else if (s2 === "in parens") if (a === ")") i += a, s2 = "in descriptor";
      else if (a === "") {
        n2.push(i), g();
        return;
      } else i += a;
      else if (s2 === "after descriptor" && !Ln(a)) if (a === "") {
        g();
        return;
      } else s2 = "in descriptor", o2 -= 1;
      o2 += 1;
    }
  }
  __name(d, "d");
  function g() {
    let m = false, _2, T2, P2, z2, ne = {}, Q, ot2, Ce2, qe2, Vt2;
    for (z2 = 0; z2 < n2.length; z2++) Q = n2[z2], ot2 = Q[Q.length - 1], Ce2 = Q.substring(0, Q.length - 1), qe2 = parseInt(Ce2, 10), Vt2 = parseFloat(Ce2), Pn.test(Ce2) && ot2 === "w" ? ((_2 || T2) && (m = true), qe2 === 0 ? m = true : _2 = qe2) : ia.test(Ce2) && ot2 === "x" ? ((_2 || T2 || P2) && (m = true), Vt2 < 0 ? m = true : T2 = Vt2) : Pn.test(Ce2) && ot2 === "h" ? ((P2 || T2) && (m = true), qe2 === 0 ? m = true : P2 = qe2) : m = true;
    if (!m) ne.source = { value: r2, startOffset: c2 }, _2 && (ne.width = { value: _2 }), T2 && (ne.density = { value: T2 }), P2 && (ne.height = { value: P2 }), p.push(ne);
    else throw new Error(`Invalid srcset descriptor found in "${e2}" at "${Q}".`);
  }
  __name(g, "g");
}
__name(sa, "sa");
var On = sa;
var Dn = /* @__PURE__ */ __name((e2) => e2.node.fullName === "srcset" && (e2.parent.fullName === "img" || e2.parent.fullName === "source"), "Dn");
var In = { width: "w", height: "h", density: "x" };
var aa = Object.keys(In);
function Rn(e2, t2, r2) {
  let n2 = b(r2.node), i = On(n2), s2 = aa.filter((m) => i.some((_2) => Object.prototype.hasOwnProperty.call(_2, m)));
  if (s2.length > 1) throw new Error("Mixed descriptor in srcset is not supported");
  let [a] = s2, o2 = In[a], c2 = i.map((m) => m.source.value), u = Math.max(...c2.map((m) => m.length)), p = i.map((m) => m[a] ? String(m[a].value) : ""), d = p.map((m) => {
    let _2 = m.indexOf(".");
    return _2 === -1 ? m.length : _2;
  }), g = Math.max(...d);
  return X(B([",", S], c2.map((m, _2) => {
    let T2 = [m], P2 = p[_2];
    if (P2) {
      let z2 = u - m.length + 1, ne = g - d[_2], Q = " ".repeat(z2 + ne);
      T2.push(j(Q, " "), P2 + o2);
    }
    return T2;
  })));
}
__name(Rn, "Rn");
var Mn = /* @__PURE__ */ __name(({ node: e2 }, t2) => e2.fullName === "style" && !t2.parentParser && !e2.value.includes("{{"), "Mn");
var Bn = /* @__PURE__ */ __name(async (e2, t2, r2) => X(await e2(b(r2.node), { parser: "css", __isHTMLStyleAttribute: true })), "Bn");
var sr = /* @__PURE__ */ new WeakMap();
function oa(e2, t2) {
  let { root: r2 } = e2;
  return sr.has(r2) || sr.set(r2, r2.children.some((n2) => wt(n2, t2) && ["ts", "typescript"].includes(n2.attrMap.lang))), sr.get(r2);
}
__name(oa, "oa");
var U = oa;
function qn(e2, t2, r2) {
  let n2 = b(r2.node);
  return x(`type T<${n2}> = any`, e2, { parser: "babel-ts", __isEmbeddedTypescriptGenericParameters: true }, V2);
}
__name(qn, "qn");
function Fn(e2, t2, r2, n2) {
  let i = b(r2.node), s2 = U(r2, n2) ? "babel-ts" : "babel";
  return x(`function _(${i}) {}`, e2, { parser: s2, __isVueBindings: true });
}
__name(Fn, "Fn");
async function Hn(e2, t2, r2, n2) {
  let i = b(r2.node), { left: s2, operator: a, right: o2 } = la(i), c2 = U(r2, n2);
  return [E(await x(`function _(${s2}) {}`, e2, { parser: c2 ? "babel-ts" : "babel", __isVueForBindingLeft: true })), " ", a, " ", await x(o2, e2, { parser: c2 ? "__ts_expression" : "__js_expression" })];
}
__name(Hn, "Hn");
function la(e2) {
  let t2 = /(.*?)\s+(in|of)\s+(.*)/su, r2 = /,([^,\]}]*)(?:,([^,\]}]*))?$/u, n2 = /^\(|\)$/gu, i = e2.match(t2);
  if (!i) return;
  let s2 = { for: i[3].trim() };
  if (!s2.for) return;
  let a = w(0, i[1].trim(), n2, ""), o2 = a.match(r2);
  o2 ? (s2.alias = a.replace(r2, ""), s2.iterator1 = o2[1].trim(), o2[2] && (s2.iterator2 = o2[2].trim())) : s2.alias = a;
  let c2 = [s2.alias, s2.iterator1, s2.iterator2];
  if (!c2.some((u, p) => !u && (p === 0 || c2.slice(p + 1).some(Boolean)))) return { left: c2.filter(Boolean).join(","), operator: i[2], right: s2.for };
}
__name(la, "la");
var ca = [{ test: /* @__PURE__ */ __name((e2) => e2.node.fullName === "v-for", "test"), print: Hn }, { test: /* @__PURE__ */ __name((e2, t2) => e2.node.fullName === "generic" && wt(e2.parent, t2), "test"), print: qn }, { test: /* @__PURE__ */ __name(({ node: e2 }, t2) => _n(e2) || Sn(e2, t2), "test"), print: Fn }, { test(e2) {
  let t2 = e2.node.fullName;
  return t2.startsWith("@") || t2.startsWith("v-on:");
}, print: ua }, { test(e2) {
  let t2 = e2.node.fullName;
  return t2.startsWith(":") || t2.startsWith(".") || t2.startsWith("v-bind:");
}, print: pa }, { test: /* @__PURE__ */ __name((e2) => e2.node.fullName.startsWith("v-"), "test"), print: Vn }].map(({ test: e2, print: t2 }) => ({ test: /* @__PURE__ */ __name((r2, n2) => n2.parser === "vue" && e2(r2, n2), "test"), print: t2 }));
async function ua(e2, t2, r2, n2) {
  try {
    return await Vn(e2, t2, r2, n2);
  } catch (a) {
    if (a.cause?.code !== "BABEL_PARSER_SYNTAX_ERROR") throw a;
  }
  let i = b(r2.node), s2 = U(r2, n2) ? "__vue_ts_event_binding" : "__vue_event_binding";
  return x(i, e2, { parser: s2 }, V2);
}
__name(ua, "ua");
function pa(e2, t2, r2, n2) {
  let i = b(r2.node), s2 = U(r2, n2) ? "__vue_ts_expression" : "__vue_expression";
  return x(i, e2, { parser: s2 }, V2);
}
__name(pa, "pa");
function Vn(e2, t2, r2, n2) {
  let i = b(r2.node), s2 = U(r2, n2) ? "__ts_expression" : "__js_expression";
  return x(i, e2, { parser: s2 }, V2);
}
__name(Vn, "Vn");
var Un = ca;
var ha = [{ test: Dn, print: Rn }, { test: Mn, print: Bn }, { test: kn, print: xn }, { test: bn, print: wn }, { test: An, print: Nn }, ...Un, ...Tn].map(({ test: e2, print: t2 }) => ({ test: e2, print: fa(t2) }));
function ma(e2, t2) {
  let { node: r2 } = e2, { value: n2 } = r2;
  if (n2) return kt(r2, t2) ? [r2.rawName, "=", n2] : ha.find(({ test: i }) => i(e2, t2))?.print;
}
__name(ma, "ma");
function fa(e2) {
  return async (t2, r2, n2, i) => {
    let s2 = await e2(t2, r2, n2, i);
    if (s2) return s2 = Gt(s2, (a) => typeof a == "string" ? w(0, a, '"', "&quot;") : a), [n2.node.rawName, '="', E(s2), '"'];
  };
}
__name(fa, "fa");
var Wn = ma;
var K = /* @__PURE__ */ __name((e2) => e2.sourceSpan.start.offset, "K");
var J = /* @__PURE__ */ __name((e2) => e2.sourceSpan.end.offset, "J");
function Ye(e2, t2) {
  return [e2.isSelfClosing ? "" : da(e2, t2), ce(e2, t2)];
}
__name(Ye, "Ye");
function da(e2, t2) {
  return e2.lastChild && he(e2.lastChild) ? "" : [ga(e2, t2), xt(e2, t2)];
}
__name(da, "da");
function ce(e2, t2) {
  return (e2.next ? W(e2.next) : pe(e2.parent)) ? "" : [ue(e2, t2), F(e2, t2)];
}
__name(ce, "ce");
function ga(e2, t2) {
  return pe(e2) ? ue(e2.lastChild, t2) : "";
}
__name(ga, "ga");
function F(e2, t2) {
  return he(e2) ? xt(e2.parent, t2) : je(e2) ? yt(e2.next, t2) : "";
}
__name(F, "F");
function xt(e2, t2) {
  if (zn(e2, t2)) return "";
  switch (e2.kind) {
    case "ieConditionalComment":
      return "<!";
    case "element":
      if (e2.hasHtmComponentClosingTag) return "<//";
    default:
      return `</${e2.rawName}`;
  }
}
__name(xt, "xt");
function ue(e2, t2) {
  if (zn(e2, t2)) return "";
  switch (e2.kind) {
    case "ieConditionalComment":
    case "ieConditionalEndComment":
      return "[endif]-->";
    case "ieConditionalStartComment":
      return "]><!-->";
    case "interpolation":
      return "}}";
    case "angularIcuExpression":
      return "}";
    case "element":
      if (e2.isSelfClosing) return "/>";
    default:
      return ">";
  }
}
__name(ue, "ue");
function zn(e2, t2) {
  return !e2.isSelfClosing && !e2.endSourceSpan && (oe(e2) || Et(e2.parent, t2));
}
__name(zn, "zn");
function W(e2) {
  return e2.prev && e2.prev.kind !== "docType" && e2.kind !== "angularControlFlowBlock" && !O(e2.prev) && e2.isLeadingSpaceSensitive && !e2.hasLeadingSpaces;
}
__name(W, "W");
function pe(e2) {
  return e2.lastChild?.isTrailingSpaceSensitive && !e2.lastChild.hasTrailingSpaces && !O(vt(e2.lastChild)) && !ae(e2);
}
__name(pe, "pe");
function he(e2) {
  return !e2.next && !e2.hasTrailingSpaces && e2.isTrailingSpaceSensitive && O(vt(e2));
}
__name(he, "he");
function je(e2) {
  return e2.next && !O(e2.next) && O(e2) && e2.isTrailingSpaceSensitive && !e2.hasTrailingSpaces;
}
__name(je, "je");
function _a2(e2) {
  let t2 = e2.trim().match(/^prettier-ignore-attribute(?:\s+(.+))?$/su);
  return t2 ? t2[1] ? t2[1].split(/\s+/u) : true : false;
}
__name(_a2, "_a");
function Xe(e2) {
  return !e2.prev && e2.isLeadingSpaceSensitive && !e2.hasLeadingSpaces;
}
__name(Xe, "Xe");
function Sa(e2, t2, r2) {
  let { node: n2 } = e2;
  if (!Ne(n2.attrs)) return n2.isSelfClosing ? " " : "";
  let i = n2.prev?.kind === "comment" && _a2(n2.prev.value), s2 = typeof i == "boolean" ? () => i : Array.isArray(i) ? (d) => i.includes(d.rawName) : () => false, a = e2.map(({ node: d }) => s2(d) ? L(t2.originalText.slice(K(d), J(d))) : r2(), "attrs"), o2 = n2.kind === "element" && n2.fullName === "script" && n2.attrs.length === 1 && n2.attrs[0].fullName === "src" && n2.children.length === 0, u = t2.singleAttributePerLine && n2.attrs.length > 1 && !le(n2, t2) ? C : S, p = [A([o2 ? " " : S, B(u, a)])];
  return n2.firstChild && Xe(n2.firstChild) || n2.isSelfClosing && pe(n2.parent) || o2 ? p.push(n2.isSelfClosing ? " " : "") : p.push(t2.bracketSameLine ? n2.isSelfClosing ? " " : "" : n2.isSelfClosing ? S : k), p;
}
__name(Sa, "Sa");
function Ea(e2) {
  return e2.firstChild && Xe(e2.firstChild) ? "" : At(e2);
}
__name(Ea, "Ea");
function Ke(e2, t2, r2) {
  let { node: n2 } = e2;
  return [me(n2, t2), Sa(e2, t2, r2), n2.isSelfClosing ? "" : Ea(n2)];
}
__name(Ke, "Ke");
function me(e2, t2) {
  return e2.prev && je(e2.prev) ? "" : [H(e2, t2), yt(e2, t2)];
}
__name(me, "me");
function H(e2, t2) {
  return Xe(e2) ? At(e2.parent) : W(e2) ? ue(e2.prev, t2) : "";
}
__name(H, "H");
var Gn = "<!doctype";
function yt(e2, t2) {
  switch (e2.kind) {
    case "ieConditionalComment":
    case "ieConditionalStartComment":
      return `<!--[if ${e2.condition}`;
    case "ieConditionalEndComment":
      return "<!--<!";
    case "interpolation":
      return "{{";
    case "docType": {
      if (e2.value === "html") {
        let { filepath: n2 } = t2;
        if (n2 && /\.html?$/u.test(n2)) return Gn;
      }
      let r2 = K(e2);
      return t2.originalText.slice(r2, r2 + Gn.length);
    }
    case "angularIcuExpression":
      return "{";
    case "element":
      if (e2.condition) return `<!--[if ${e2.condition}]><!--><${e2.rawName}`;
    default:
      return `<${e2.rawName}`;
  }
}
__name(yt, "yt");
function At(e2) {
  switch (e2.kind) {
    case "ieConditionalComment":
      return "]>";
    case "element":
      if (e2.condition) return "><!--<![endif]-->";
    default:
      return ">";
  }
}
__name(At, "At");
function Ca(e2, t2) {
  if (!e2.endSourceSpan) return "";
  let r2 = e2.startSourceSpan.end.offset;
  e2.firstChild && Xe(e2.firstChild) && (r2 -= At(e2).length);
  let n2 = e2.endSourceSpan.start.offset;
  return e2.lastChild && he(e2.lastChild) ? n2 += xt(e2, t2).length : pe(e2) && (n2 -= ue(e2.lastChild, t2).length), t2.originalText.slice(r2, n2);
}
__name(Ca, "Ca");
var Nt = Ca;
var va = /* @__PURE__ */ new Set(["if", "else if", "for", "switch", "case"]);
function Ta(e2, t2) {
  let { node: r2 } = e2;
  switch (r2.kind) {
    case "element":
      if (q(r2, t2) || r2.kind === "interpolation") return;
      if (!r2.isSelfClosing && Tt(r2, t2)) {
        let n2 = tr(r2, t2);
        return n2 ? async (i, s2) => {
          let a = Nt(r2, t2), o2 = /^\s*$/u.test(a), c2 = "";
          return o2 || (c2 = await i(Jt(a), { parser: n2, __embeddedInHtml: true }), o2 = c2 === ""), [H(r2, t2), E(Ke(e2, t2, s2)), o2 ? "" : C, c2, o2 ? "" : C, Ye(r2, t2), F(r2, t2)];
        } : void 0;
      }
      break;
    case "text":
      if (q(r2.parent, t2)) {
        let n2 = tr(r2.parent, t2);
        if (n2) return async (i) => {
          let s2 = n2 === "markdown" ? N.dedentString(r2.value.replace(/^[^\S\n]*\n/u, "")) : r2.value, a = { parser: n2, __embeddedInHtml: true };
          if (t2.parser === "html" && n2 === "babel") {
            let o2 = "script", { attrMap: c2 } = r2.parent;
            c2 && (c2.type === "module" || (c2.type === "text/babel" || c2.type === "text/jsx") && c2["data-type"] === "module") && (o2 = "module"), a.__babelSourceType = o2;
          }
          return [Y, H(r2, t2), await i(s2, a), F(r2, t2)];
        };
      } else if (r2.parent.kind === "interpolation") return async (n2) => {
        let i = { __isInHtmlInterpolation: true, __embeddedInHtml: true };
        return t2.parser === "angular" ? i.parser = "__ng_interpolation" : t2.parser === "vue" ? i.parser = U(e2, t2) ? "__vue_ts_expression" : "__vue_expression" : i.parser = "__js_expression", [A([S, await n2(r2.value, i)]), r2.parent.next && W(r2.parent.next) ? " " : S];
      };
      break;
    case "attribute":
      return Wn(e2, t2);
    case "angularControlFlowBlockParameters":
      return va.has(e2.parent.name) ? Yr : void 0;
    case "angularLetDeclarationInitializer":
      return (n2) => x(r2.value, n2, { parser: "__ng_binding", __isInHtmlAttribute: false });
  }
}
__name(Ta, "Ta");
var $n = Ta;
var Qe = null;
function Je(e2) {
  if (Qe !== null && typeof Qe.property) {
    let t2 = Qe;
    return Qe = Je.prototype = null, t2;
  }
  return Qe = Je.prototype = e2 ?? /* @__PURE__ */ Object.create(null), new Je();
}
__name(Je, "Je");
var ba = 10;
for (let e2 = 0; e2 <= ba; e2++) Je();
function ar(e2) {
  return Je(e2);
}
__name(ar, "ar");
function wa(e2, t2 = "type") {
  ar(e2);
  function r2(n2) {
    let i = n2[t2], s2 = e2[i];
    if (!Array.isArray(s2)) throw Object.assign(new Error(`Missing visitor keys for '${i}'.`), { node: n2 });
    return s2;
  }
  __name(r2, "r");
  return r2;
}
__name(wa, "wa");
var Yn = wa;
var I2 = [["children"], []];
var jn = { root: I2[0], element: ["attrs", "children"], ieConditionalComment: I2[0], ieConditionalStartComment: I2[1], ieConditionalEndComment: I2[1], interpolation: I2[0], text: I2[0], docType: I2[1], comment: I2[1], attribute: I2[1], cdata: I2[1], angularControlFlowBlock: ["children", "parameters"], angularControlFlowBlockParameters: I2[0], angularControlFlowBlockParameter: I2[1], angularLetDeclaration: ["init"], angularLetDeclarationInitializer: I2[1], angularIcuExpression: ["cases"], angularIcuCase: ["expression"] };
var ka = Yn(jn, "kind");
var Xn = ka;
var Kn = "format";
var Qn = /^\s*<!--\s*@(?:noformat|noprettier)\s*-->/u;
var Jn = /^\s*<!--\s*@(?:format|prettier)\s*-->/u;
var Zn = /* @__PURE__ */ __name((e2) => Jn.test(e2), "Zn");
var ei = /* @__PURE__ */ __name((e2) => Qn.test(e2), "ei");
var ti = /* @__PURE__ */ __name((e2) => `<!-- @${Kn} -->

${e2}`, "ti");
var ri = /* @__PURE__ */ new Map([["if", /* @__PURE__ */ new Set(["else if", "else"])], ["else if", /* @__PURE__ */ new Set(["else if", "else"])], ["for", /* @__PURE__ */ new Set(["empty"])], ["defer", /* @__PURE__ */ new Set(["placeholder", "error", "loading"])], ["placeholder", /* @__PURE__ */ new Set(["placeholder", "error", "loading"])], ["error", /* @__PURE__ */ new Set(["placeholder", "error", "loading"])], ["loading", /* @__PURE__ */ new Set(["placeholder", "error", "loading"])]]);
function ni(e2) {
  let t2 = J(e2);
  return e2.kind === "element" && !e2.endSourceSpan && Ne(e2.children) ? Math.max(t2, ni(M(0, e2.children, -1))) : t2;
}
__name(ni, "ni");
function Ze(e2, t2, r2) {
  let n2 = e2.node;
  if (oe(n2)) {
    let i = ni(n2);
    return [H(n2, t2), L(N.trimEnd(t2.originalText.slice(K(n2) + (n2.prev && je(n2.prev) ? yt(n2).length : 0), i - (n2.next && W(n2.next) ? ue(n2, t2).length : 0)))), F(n2, t2)];
  }
  return r2();
}
__name(Ze, "Ze");
function Lt(e2, t2) {
  return O(e2) && O(t2) ? e2.isTrailingSpaceSensitive ? e2.hasTrailingSpaces ? Ct(t2) ? C : S : "" : Ct(t2) ? C : k : je(e2) && (oe(t2) || t2.firstChild || t2.isSelfClosing || t2.kind === "element" && t2.attrs.length > 0) || e2.kind === "element" && e2.isSelfClosing && W(t2) ? "" : !t2.isLeadingSpaceSensitive || Ct(t2) || W(t2) && e2.lastChild && he(e2.lastChild) && e2.lastChild.lastChild && he(e2.lastChild.lastChild) ? C : t2.hasLeadingSpaces ? S : k;
}
__name(Lt, "Lt");
function Le(e2, t2, r2) {
  let { node: n2 } = e2;
  if (er(n2)) return [Y, ...e2.map(() => {
    let s2 = e2.node, a = s2.prev ? Lt(s2.prev, s2) : "";
    return [a ? [a, Ge(s2.prev) ? C : ""] : "", Ze(e2, t2, r2)];
  }, "children")];
  let i = n2.children.map(() => Symbol(""));
  return e2.map(({ node: s2, index: a }) => {
    if (O(s2)) {
      if (s2.prev && O(s2.prev)) {
        let m = Lt(s2.prev, s2);
        if (m) return Ge(s2.prev) ? [C, C, Ze(e2, t2, r2)] : [m, Ze(e2, t2, r2)];
      }
      return Ze(e2, t2, r2);
    }
    let o2 = [], c2 = [], u = [], p = [], d = s2.prev ? Lt(s2.prev, s2) : "", g = s2.next ? Lt(s2, s2.next) : "";
    return d && (Ge(s2.prev) ? o2.push(C, C) : d === C ? o2.push(C) : O(s2.prev) ? c2.push(d) : c2.push(j("", k, { groupId: i[a - 1] }))), g && (Ge(s2) ? O(s2.next) && p.push(C, C) : g === C ? O(s2.next) && p.push(C) : u.push(g)), [...o2, E([...c2, E([Ze(e2, t2, r2), ...u], { id: i[a] })]), ...p];
  }, "children");
}
__name(Le, "Le");
function ii(e2, t2, r2) {
  let { node: n2 } = e2, i = [];
  if (Na(e2) && i.push("} "), i.push("@", n2.name), ya(n2)) return i.push(";"), i;
  if (n2.parameters && i.push(" (", E(r2("parameters")), ")"), !Aa(n2)) {
    i.push(" {");
    let s2 = si(n2);
    n2.children.length > 0 ? (n2.firstChild.hasLeadingSpaces = true, n2.lastChild.hasTrailingSpaces = true, i.push(A([C, Le(e2, t2, r2)])), s2 && i.push(C, "}")) : s2 && i.push("}");
  }
  return E(i, { shouldBreak: true });
}
__name(ii, "ii");
function si(e2) {
  return !(e2.next?.kind === "angularControlFlowBlock" && ri.get(e2.name)?.has(e2.next.name));
}
__name(si, "si");
var xa = /* @__PURE__ */ __name((e2) => e2?.kind === "angularControlFlowBlock" && (e2.name === "case" || e2.name === "default"), "xa");
var ya = /* @__PURE__ */ __name((e2) => e2?.kind === "angularControlFlowBlock" && e2.name === "default never", "ya");
function Aa(e2) {
  return xa(e2) && e2.endSourceSpan && e2.endSourceSpan.start.offset === e2.endSourceSpan.end.offset;
}
__name(Aa, "Aa");
function Na(e2) {
  let { previous: t2 } = e2;
  return t2?.kind === "angularControlFlowBlock" && !oe(t2) && !si(t2);
}
__name(Na, "Na");
function ai(e2, t2, r2) {
  return [A([k, B([";", S], e2.map(r2, "children"))]), k];
}
__name(ai, "ai");
function oi(e2, t2, r2) {
  let { node: n2 } = e2;
  return [me(n2, t2), E([n2.switchValue.trim(), ", ", n2.type, n2.cases.length > 0 ? [",", A([S, B(S, e2.map(r2, "cases"))])] : "", k]), ce(n2, t2)];
}
__name(oi, "oi");
function li(e2, t2, r2) {
  let { node: n2 } = e2;
  return [n2.value, " {", E([A([k, e2.map(({ node: i, isLast: s2 }) => {
    let a = [r2()];
    return i.kind === "text" && (i.hasLeadingSpaces && a.unshift(S), i.hasTrailingSpaces && !s2 && a.push(S)), a;
  }, "expression")]), k]), "}"];
}
__name(li, "li");
function ci(e2, t2, r2) {
  let { node: n2 } = e2;
  if (Et(n2, t2)) return [H(n2, t2), E(Ke(e2, t2, r2)), L(Nt(n2, t2)), ...Ye(n2, t2), F(n2, t2)];
  let i = n2.children.length === 1 && (n2.firstChild.kind === "interpolation" || n2.firstChild.kind === "angularIcuExpression") && n2.firstChild.isLeadingSpaceSensitive && !n2.firstChild.hasLeadingSpaces && n2.lastChild.isTrailingSpaceSensitive && !n2.lastChild.hasTrailingSpaces, s2 = Symbol("element-attr-group-id"), a = /* @__PURE__ */ __name((p) => E([E(Ke(e2, t2, r2), { id: s2 }), p, Ye(n2, t2)]), "a"), o2 = /* @__PURE__ */ __name((p) => i ? Fr(p, { groupId: s2 }) : (q(n2, t2) || $e(n2, t2)) && n2.parent.kind === "root" && t2.parser === "vue" && !t2.vueIndentScriptAndStyle ? p : A(p), "o"), c2 = /* @__PURE__ */ __name(() => i ? j(k, "", { groupId: s2 }) : n2.firstChild.hasLeadingSpaces && n2.firstChild.isLeadingSpaceSensitive ? S : n2.firstChild.kind === "text" && n2.isWhitespaceSensitive && n2.isIndentationSensitive ? qr(k) : k, "c"), u = /* @__PURE__ */ __name(() => (n2.next ? W(n2.next) : pe(n2.parent)) ? n2.lastChild.hasTrailingSpaces && n2.lastChild.isTrailingSpaceSensitive ? " " : "" : i ? j(k, "", { groupId: s2 }) : n2.lastChild.hasTrailingSpaces && n2.lastChild.isTrailingSpaceSensitive ? S : (n2.lastChild.kind === "comment" || n2.lastChild.kind === "text" && n2.isWhitespaceSensitive && n2.isIndentationSensitive) && new RegExp(`\\n[\\t ]{${t2.tabWidth * (e2.ancestors.length - 1)}}$`, "u").test(n2.lastChild.value) ? "" : k, "u");
  return n2.children.length === 0 ? a(n2.hasDanglingSpaces && n2.isDanglingSpaceSensitive ? S : "") : a([cn(n2) ? Y : "", o2([c2(), Le(e2, t2, r2)]), u()]);
}
__name(ci, "ci");
var R = function(e2) {
  return e2[e2.RAW_TEXT = 0] = "RAW_TEXT", e2[e2.ESCAPABLE_RAW_TEXT = 1] = "ESCAPABLE_RAW_TEXT", e2[e2.PARSABLE_DATA = 2] = "PARSABLE_DATA", e2;
}({});
function et(e2, t2 = true) {
  if (e2[0] != ":") return [null, e2];
  let r2 = e2.indexOf(":", 1);
  if (r2 === -1) {
    if (t2) throw new Error(`Unsupported format "${e2}" expecting ":namespace:name"`);
    return [null, e2];
  }
  return [e2.slice(1, r2), e2.slice(r2 + 1)];
}
__name(et, "et");
function or(e2) {
  return et(e2)[1] === "ng-container";
}
__name(or, "or");
function lr(e2) {
  return et(e2)[1] === "ng-content";
}
__name(lr, "lr");
function Pe(e2) {
  return e2 === null ? null : et(e2)[0];
}
__name(Pe, "Pe");
function fe(e2, t2) {
  return e2 ? `:${e2}:${t2}` : t2;
}
__name(fe, "fe");
var cr = { name: "custom-elements" };
var ur = { name: "no-errors-schema" };
var Z = function(e2) {
  return e2[e2.NONE = 0] = "NONE", e2[e2.HTML = 1] = "HTML", e2[e2.STYLE = 2] = "STYLE", e2[e2.SCRIPT = 3] = "SCRIPT", e2[e2.URL = 4] = "URL", e2[e2.RESOURCE_URL = 5] = "RESOURCE_URL", e2[e2.ATTRIBUTE_NO_BINDING = 6] = "ATTRIBUTE_NO_BINDING", e2;
}({});
var La = /-+([a-z0-9])/g;
function ui(e2) {
  return e2.replace(La, (...t2) => t2[1].toUpperCase());
}
__name(ui, "ui");
var Pt;
function pr() {
  return Pt || (Pt = {}, tt(Z.HTML, ["iframe|srcdoc", "*|innerHTML", "*|outerHTML"]), tt(Z.STYLE, ["*|style"]), tt(Z.URL, ["*|formAction", "area|href", "a|href", "a|xlink:href", "form|action", "annotation|href", "annotation|xlink:href", "annotation-xml|href", "annotation-xml|xlink:href", "maction|href", "maction|xlink:href", "malignmark|href", "malignmark|xlink:href", "math|href", "math|xlink:href", "mroot|href", "mroot|xlink:href", "msqrt|href", "msqrt|xlink:href", "merror|href", "merror|xlink:href", "mfrac|href", "mfrac|xlink:href", "mglyph|href", "mglyph|xlink:href", "msub|href", "msub|xlink:href", "msup|href", "msup|xlink:href", "msubsup|href", "msubsup|xlink:href", "mmultiscripts|href", "mmultiscripts|xlink:href", "mprescripts|href", "mprescripts|xlink:href", "mi|href", "mi|xlink:href", "mn|href", "mn|xlink:href", "mo|href", "mo|xlink:href", "mpadded|href", "mpadded|xlink:href", "mphantom|href", "mphantom|xlink:href", "mrow|href", "mrow|xlink:href", "ms|href", "ms|xlink:href", "mspace|href", "mspace|xlink:href", "mstyle|href", "mstyle|xlink:href", "mtable|href", "mtable|xlink:href", "mtd|href", "mtd|xlink:href", "mtr|href", "mtr|xlink:href", "mtext|href", "mtext|xlink:href", "mover|href", "mover|xlink:href", "munder|href", "munder|xlink:href", "munderover|href", "munderover|xlink:href", "semantics|href", "semantics|xlink:href", "none|href", "none|xlink:href", "img|src", "video|src"]), tt(Z.RESOURCE_URL, ["base|href", "embed|src", "frame|src", "iframe|src", "link|href", "object|codebase", "object|data", "script|src", "script|href", "script|xlink:href"]), tt(Z.ATTRIBUTE_NO_BINDING, ["animate|attributeName", "animate|values", "animate|to", "animate|from", "set|to", "set|attributeName", "animateMotion|attributeName", "animateTransform|attributeName", "unknown|attributeName", "unknown|values", "unknown|to", "unknown|from", "iframe|sandbox", "iframe|allow", "iframe|allowFullscreen", "iframe|referrerPolicy", "iframe|csp", "iframe|fetchPriority", "unknown|sandbox", "unknown|allow", "unknown|allowFullscreen", "unknown|referrerPolicy", "unknown|csp", "unknown|fetchPriority"])), Pt;
}
__name(pr, "pr");
function tt(e2, t2) {
  for (let r2 of t2) Pt[r2.toLowerCase()] = e2;
}
__name(tt, "tt");
var pi = class {
  static {
    __name(this, "pi");
  }
};
var Pa = "boolean";
var Oa = "number";
var Da = "string";
var Ia = "object";
var Ra = ["[Element]|textContent,%ariaActiveDescendantElement,%ariaAtomic,%ariaAutoComplete,%ariaBusy,%ariaChecked,%ariaColCount,%ariaColIndex,%ariaColIndexText,%ariaColSpan,%ariaControlsElements,%ariaCurrent,%ariaDescribedByElements,%ariaDescription,%ariaDetailsElements,%ariaDisabled,%ariaErrorMessageElements,%ariaExpanded,%ariaFlowToElements,%ariaHasPopup,%ariaHidden,%ariaInvalid,%ariaKeyShortcuts,%ariaLabel,%ariaLabelledByElements,%ariaLevel,%ariaLive,%ariaModal,%ariaMultiLine,%ariaMultiSelectable,%ariaOrientation,%ariaOwnsElements,%ariaPlaceholder,%ariaPosInSet,%ariaPressed,%ariaReadOnly,%ariaRelevant,%ariaRequired,%ariaRoleDescription,%ariaRowCount,%ariaRowIndex,%ariaRowIndexText,%ariaRowSpan,%ariaSelected,%ariaSetSize,%ariaSort,%ariaValueMax,%ariaValueMin,%ariaValueNow,%ariaValueText,%classList,className,elementTiming,id,innerHTML,*beforecopy,*beforecut,*beforepaste,*fullscreenchange,*fullscreenerror,*search,*webkitfullscreenchange,*webkitfullscreenerror,outerHTML,%part,#scrollLeft,#scrollTop,slot,*message,*mozfullscreenchange,*mozfullscreenerror,*mozpointerlockchange,*mozpointerlockerror,*webglcontextcreationerror,*webglcontextlost,*webglcontextrestored", "[HTMLElement]^[Element]|accessKey,autocapitalize,!autofocus,contentEditable,dir,!draggable,enterKeyHint,!hidden,!inert,innerText,inputMode,lang,nonce,*abort,*animationend,*animationiteration,*animationstart,*auxclick,*beforexrselect,*blur,*cancel,*canplay,*canplaythrough,*change,*click,*close,*contextmenu,*copy,*cuechange,*cut,*dblclick,*drag,*dragend,*dragenter,*dragleave,*dragover,*dragstart,*drop,*durationchange,*emptied,*ended,*error,*focus,*formdata,*gotpointercapture,*input,*invalid,*keydown,*keypress,*keyup,*load,*loadeddata,*loadedmetadata,*loadstart,*lostpointercapture,*mousedown,*mouseenter,*mouseleave,*mousemove,*mouseout,*mouseover,*mouseup,*mousewheel,*paste,*pause,*play,*playing,*pointercancel,*pointerdown,*pointerenter,*pointerleave,*pointermove,*pointerout,*pointerover,*pointerrawupdate,*pointerup,*progress,*ratechange,*reset,*resize,*scroll,*securitypolicyviolation,*seeked,*seeking,*select,*selectionchange,*selectstart,*slotchange,*stalled,*submit,*suspend,*timeupdate,*toggle,*transitioncancel,*transitionend,*transitionrun,*transitionstart,*volumechange,*waiting,*webkitanimationend,*webkitanimationiteration,*webkitanimationstart,*webkittransitionend,*wheel,outerText,!spellcheck,%style,#tabIndex,title,!translate,virtualKeyboardPolicy", "abbr,address,article,aside,b,bdi,bdo,cite,content,code,dd,dfn,dt,em,figcaption,figure,footer,header,hgroup,i,kbd,main,mark,nav,noscript,rb,rp,rt,rtc,ruby,s,samp,search,section,small,strong,sub,sup,u,var,wbr^[HTMLElement]|accessKey,autocapitalize,!autofocus,contentEditable,dir,!draggable,enterKeyHint,!hidden,innerText,inputMode,lang,nonce,*abort,*animationend,*animationiteration,*animationstart,*auxclick,*beforexrselect,*blur,*cancel,*canplay,*canplaythrough,*change,*click,*close,*contextmenu,*copy,*cuechange,*cut,*dblclick,*drag,*dragend,*dragenter,*dragleave,*dragover,*dragstart,*drop,*durationchange,*emptied,*ended,*error,*focus,*formdata,*gotpointercapture,*input,*invalid,*keydown,*keypress,*keyup,*load,*loadeddata,*loadedmetadata,*loadstart,*lostpointercapture,*mousedown,*mouseenter,*mouseleave,*mousemove,*mouseout,*mouseover,*mouseup,*mousewheel,*paste,*pause,*play,*playing,*pointercancel,*pointerdown,*pointerenter,*pointerleave,*pointermove,*pointerout,*pointerover,*pointerrawupdate,*pointerup,*progress,*ratechange,*reset,*resize,*scroll,*securitypolicyviolation,*seeked,*seeking,*select,*selectionchange,*selectstart,*slotchange,*stalled,*submit,*suspend,*timeupdate,*toggle,*transitioncancel,*transitionend,*transitionrun,*transitionstart,*volumechange,*waiting,*webkitanimationend,*webkitanimationiteration,*webkitanimationstart,*webkittransitionend,*wheel,outerText,!spellcheck,%style,#tabIndex,title,!translate,virtualKeyboardPolicy", "media^[HTMLElement]|!autoplay,!controls,%controlsList,%crossOrigin,#currentTime,!defaultMuted,#defaultPlaybackRate,!disableRemotePlayback,!loop,!muted,*encrypted,*waitingforkey,#playbackRate,preload,!preservesPitch,src,%srcObject,#volume", ":svg:^[HTMLElement]|!autofocus,nonce,*abort,*animationend,*animationiteration,*animationstart,*auxclick,*beforexrselect,*blur,*cancel,*canplay,*canplaythrough,*change,*click,*close,*contextmenu,*copy,*cuechange,*cut,*dblclick,*drag,*dragend,*dragenter,*dragleave,*dragover,*dragstart,*drop,*durationchange,*emptied,*ended,*error,*focus,*formdata,*gotpointercapture,*input,*invalid,*keydown,*keypress,*keyup,*load,*loadeddata,*loadedmetadata,*loadstart,*lostpointercapture,*mousedown,*mouseenter,*mouseleave,*mousemove,*mouseout,*mouseover,*mouseup,*mousewheel,*paste,*pause,*play,*playing,*pointercancel,*pointerdown,*pointerenter,*pointerleave,*pointermove,*pointerout,*pointerover,*pointerrawupdate,*pointerup,*progress,*ratechange,*reset,*resize,*scroll,*securitypolicyviolation,*seeked,*seeking,*select,*selectionchange,*selectstart,*slotchange,*stalled,*submit,*suspend,*timeupdate,*toggle,*transitioncancel,*transitionend,*transitionrun,*transitionstart,*volumechange,*waiting,*webkitanimationend,*webkitanimationiteration,*webkitanimationstart,*webkittransitionend,*wheel,%style,#tabIndex", ":svg:graphics^:svg:|", ":svg:animation^:svg:|*begin,*end,*repeat", ":svg:geometry^:svg:|", ":svg:componentTransferFunction^:svg:|", ":svg:gradient^:svg:|", ":svg:textContent^:svg:graphics|", ":svg:textPositioning^:svg:textContent|", "a^[HTMLElement]|charset,coords,download,hash,host,hostname,href,hreflang,name,password,pathname,ping,port,protocol,referrerPolicy,rel,%relList,rev,search,shape,target,text,type,username", "area^[HTMLElement]|alt,coords,download,hash,host,hostname,href,!noHref,password,pathname,ping,port,protocol,referrerPolicy,rel,%relList,search,shape,target,username", "audio^media|", "br^[HTMLElement]|clear", "base^[HTMLElement]|href,target", "body^[HTMLElement]|aLink,background,bgColor,link,*afterprint,*beforeprint,*beforeunload,*blur,*error,*focus,*hashchange,*languagechange,*load,*message,*messageerror,*offline,*online,*pagehide,*pageshow,*popstate,*rejectionhandled,*resize,*scroll,*storage,*unhandledrejection,*unload,text,vLink", "button^[HTMLElement]|!disabled,formAction,formEnctype,formMethod,!formNoValidate,formTarget,name,type,value", "canvas^[HTMLElement]|#height,#width", "content^[HTMLElement]|select", "dl^[HTMLElement]|!compact", "data^[HTMLElement]|value", "datalist^[HTMLElement]|", "details^[HTMLElement]|!open", "dialog^[HTMLElement]|!open,returnValue", "dir^[HTMLElement]|!compact", "div^[HTMLElement]|align", "embed^[HTMLElement]|align,height,name,src,type,width", "fieldset^[HTMLElement]|!disabled,name", "font^[HTMLElement]|color,face,size", "form^[HTMLElement]|acceptCharset,action,autocomplete,encoding,enctype,method,name,!noValidate,target", "frame^[HTMLElement]|frameBorder,longDesc,marginHeight,marginWidth,name,!noResize,scrolling,src", "frameset^[HTMLElement]|cols,*afterprint,*beforeprint,*beforeunload,*blur,*error,*focus,*hashchange,*languagechange,*load,*message,*messageerror,*offline,*online,*pagehide,*pageshow,*popstate,*rejectionhandled,*resize,*scroll,*storage,*unhandledrejection,*unload,rows", "geolocation^[HTMLElement]|accuracymode,!autolocate,*location,*promptaction,*promptdismiss,*validationstatuschange,!watch", "hr^[HTMLElement]|align,color,!noShade,size,width", "head^[HTMLElement]|", "h1,h2,h3,h4,h5,h6^[HTMLElement]|align", "html^[HTMLElement]|version", "iframe^[HTMLElement]|align,allow,!allowFullscreen,!allowPaymentRequest,csp,frameBorder,height,loading,longDesc,marginHeight,marginWidth,name,referrerPolicy,%sandbox,scrolling,src,srcdoc,width", "img^[HTMLElement]|align,alt,border,%crossOrigin,decoding,#height,#hspace,!isMap,loading,longDesc,lowsrc,name,referrerPolicy,sizes,src,srcset,useMap,#vspace,#width", "input^[HTMLElement]|accept,align,alt,autocomplete,!checked,!defaultChecked,defaultValue,dirName,!disabled,%files,formAction,formEnctype,formMethod,!formNoValidate,formTarget,#height,!incremental,!indeterminate,max,#maxLength,min,#minLength,!multiple,name,pattern,placeholder,!readOnly,!required,selectionDirection,#selectionEnd,#selectionStart,#size,src,step,type,useMap,value,%valueAsDate,#valueAsNumber,#width", "li^[HTMLElement]|type,#value", "label^[HTMLElement]|htmlFor", "legend^[HTMLElement]|align", "link^[HTMLElement]|as,charset,%crossOrigin,!disabled,href,hreflang,imageSizes,imageSrcset,integrity,media,referrerPolicy,rel,%relList,rev,%sizes,target,type", "map^[HTMLElement]|name", "marquee^[HTMLElement]|behavior,bgColor,direction,height,#hspace,#loop,#scrollAmount,#scrollDelay,!trueSpeed,#vspace,width", "menu^[HTMLElement]|!compact", "meta^[HTMLElement]|content,httpEquiv,media,name,scheme", "meter^[HTMLElement]|#high,#low,#max,#min,#optimum,#value", "ins,del^[HTMLElement]|cite,dateTime", "ol^[HTMLElement]|!compact,!reversed,#start,type", "object^[HTMLElement]|align,archive,border,code,codeBase,codeType,data,!declare,height,#hspace,name,standby,type,useMap,#vspace,width", "optgroup^[HTMLElement]|!disabled,label", "option^[HTMLElement]|!defaultSelected,!disabled,label,!selected,text,value", "output^[HTMLElement]|defaultValue,%htmlFor,name,value", "p^[HTMLElement]|align", "param^[HTMLElement]|name,type,value,valueType", "picture^[HTMLElement]|", "pre^[HTMLElement]|#width", "progress^[HTMLElement]|#max,#value", "q,blockquote,cite^[HTMLElement]|", "script^[HTMLElement]|!async,charset,%crossOrigin,!defer,event,htmlFor,integrity,!noModule,%referrerPolicy,src,text,type", "select^[HTMLElement]|autocomplete,!disabled,#length,!multiple,name,!required,#selectedIndex,#size,value", "selectedcontent^[HTMLElement]|", "slot^[HTMLElement]|name", "source^[HTMLElement]|#height,media,sizes,src,srcset,type,#width", "span^[HTMLElement]|", "style^[HTMLElement]|!disabled,media,type", "search^[HTMLELement]|", "caption^[HTMLElement]|align", "th,td^[HTMLElement]|abbr,align,axis,bgColor,ch,chOff,#colSpan,headers,height,!noWrap,#rowSpan,scope,vAlign,width", "col,colgroup^[HTMLElement]|align,ch,chOff,#span,vAlign,width", "table^[HTMLElement]|align,bgColor,border,%caption,cellPadding,cellSpacing,frame,rules,summary,%tFoot,%tHead,width", "tr^[HTMLElement]|align,bgColor,ch,chOff,vAlign", "tfoot,thead,tbody^[HTMLElement]|align,ch,chOff,vAlign", "template^[HTMLElement]|", "textarea^[HTMLElement]|autocomplete,#cols,defaultValue,dirName,!disabled,#maxLength,#minLength,name,placeholder,!readOnly,!required,#rows,selectionDirection,#selectionEnd,#selectionStart,value,wrap", "time^[HTMLElement]|dateTime", "title^[HTMLElement]|text", "track^[HTMLElement]|!default,kind,label,src,srclang", "ul^[HTMLElement]|!compact,type", "unknown^[HTMLElement]|", "video^media|!disablePictureInPicture,#height,*enterpictureinpicture,*leavepictureinpicture,!playsInline,poster,#width", ":svg:a^:svg:graphics|", ":svg:animate^:svg:animation|", ":svg:animateMotion^:svg:animation|", ":svg:animateTransform^:svg:animation|", ":svg:circle^:svg:geometry|", ":svg:clipPath^:svg:graphics|", ":svg:defs^:svg:graphics|", ":svg:desc^:svg:|", ":svg:discard^:svg:|", ":svg:ellipse^:svg:geometry|", ":svg:feBlend^:svg:|", ":svg:feColorMatrix^:svg:|", ":svg:feComponentTransfer^:svg:|", ":svg:feComposite^:svg:|", ":svg:feConvolveMatrix^:svg:|", ":svg:feDiffuseLighting^:svg:|", ":svg:feDisplacementMap^:svg:|", ":svg:feDistantLight^:svg:|", ":svg:feDropShadow^:svg:|", ":svg:feFlood^:svg:|", ":svg:feFuncA^:svg:componentTransferFunction|", ":svg:feFuncB^:svg:componentTransferFunction|", ":svg:feFuncG^:svg:componentTransferFunction|", ":svg:feFuncR^:svg:componentTransferFunction|", ":svg:feGaussianBlur^:svg:|", ":svg:feImage^:svg:|", ":svg:feMerge^:svg:|", ":svg:feMergeNode^:svg:|", ":svg:feMorphology^:svg:|", ":svg:feOffset^:svg:|", ":svg:fePointLight^:svg:|", ":svg:feSpecularLighting^:svg:|", ":svg:feSpotLight^:svg:|", ":svg:feTile^:svg:|", ":svg:feTurbulence^:svg:|", ":svg:filter^:svg:|", ":svg:foreignObject^:svg:graphics|", ":svg:g^:svg:graphics|", ":svg:image^:svg:graphics|decoding", ":svg:line^:svg:geometry|", ":svg:linearGradient^:svg:gradient|", ":svg:mpath^:svg:|", ":svg:marker^:svg:|", ":svg:mask^:svg:|", ":svg:metadata^:svg:|", ":svg:path^:svg:geometry|", ":svg:pattern^:svg:|", ":svg:polygon^:svg:geometry|", ":svg:polyline^:svg:geometry|", ":svg:radialGradient^:svg:gradient|", ":svg:rect^:svg:geometry|", ":svg:svg^:svg:graphics|#currentScale,#zoomAndPan", ":svg:script^:svg:|type", ":svg:set^:svg:animation|", ":svg:stop^:svg:|", ":svg:style^:svg:|!disabled,media,title,type", ":svg:switch^:svg:graphics|", ":svg:symbol^:svg:|", ":svg:tspan^:svg:textPositioning|", ":svg:text^:svg:textPositioning|", ":svg:textPath^:svg:textContent|", ":svg:title^:svg:|", ":svg:use^:svg:graphics|", ":svg:view^:svg:|#zoomAndPan", "data^[HTMLElement]|value", "keygen^[HTMLElement]|!autofocus,challenge,!disabled,form,keytype,name", "menuitem^[HTMLElement]|type,label,icon,!disabled,!checked,radiogroup,!default", "summary^[HTMLElement]|", "time^[HTMLElement]|dateTime", ":svg:cursor^:svg:|", ":math:^[HTMLElement]|!autofocus,nonce,*abort,*animationend,*animationiteration,*animationstart,*auxclick,*beforeinput,*beforematch,*beforetoggle,*beforexrselect,*blur,*cancel,*canplay,*canplaythrough,*change,*click,*close,*contentvisibilityautostatechange,*contextlost,*contextmenu,*contextrestored,*copy,*cuechange,*cut,*dblclick,*drag,*dragend,*dragenter,*dragleave,*dragover,*dragstart,*drop,*durationchange,*emptied,*ended,*error,*focus,*formdata,*gotpointercapture,*input,*invalid,*keydown,*keypress,*keyup,*load,*loadeddata,*loadedmetadata,*loadstart,*lostpointercapture,*mousedown,*mouseenter,*mouseleave,*mousemove,*mouseout,*mouseover,*mouseup,*mousewheel,*paste,*pause,*play,*playing,*pointercancel,*pointerdown,*pointerenter,*pointerleave,*pointermove,*pointerout,*pointerover,*pointerrawupdate,*pointerup,*progress,*ratechange,*reset,*resize,*scroll,*scrollend,*securitypolicyviolation,*seeked,*seeking,*select,*selectionchange,*selectstart,*slotchange,*stalled,*submit,*suspend,*timeupdate,*toggle,*transitioncancel,*transitionend,*transitionrun,*transitionstart,*volumechange,*waiting,*webkitanimationend,*webkitanimationiteration,*webkitanimationstart,*webkittransitionend,*wheel,%style,#tabIndex", ":math:math^:math:|", ":math:maction^:math:|", ":math:menclose^:math:|", ":math:merror^:math:|", ":math:mfenced^:math:|", ":math:mfrac^:math:|", ":math:mi^:math:|", ":math:mmultiscripts^:math:|", ":math:mn^:math:|", ":math:mo^:math:|", ":math:mover^:math:|", ":math:mpadded^:math:|", ":math:mphantom^:math:|", ":math:mroot^:math:|", ":math:mrow^:math:|", ":math:ms^:math:|", ":math:mspace^:math:|", ":math:msqrt^:math:|", ":math:mstyle^:math:|", ":math:msub^:math:|", ":math:msubsup^:math:|", ":math:msup^:math:|", ":math:mtable^:math:|", ":math:mtd^:math:|", ":math:mtext^:math:|", ":math:mtr^:math:|", ":math:munder^:math:|", ":math:munderover^:math:|", ":math:semantics^:math:|"];
var hi = new Map(Object.entries({ class: "className", for: "htmlFor", formaction: "formAction", innerHtml: "innerHTML", readonly: "readOnly", tabindex: "tabIndex", "aria-activedescendant": "ariaActiveDescendantElement", "aria-atomic": "ariaAtomic", "aria-autocomplete": "ariaAutoComplete", "aria-busy": "ariaBusy", "aria-checked": "ariaChecked", "aria-colcount": "ariaColCount", "aria-colindex": "ariaColIndex", "aria-colindextext": "ariaColIndexText", "aria-colspan": "ariaColSpan", "aria-controls": "ariaControlsElements", "aria-current": "ariaCurrent", "aria-describedby": "ariaDescribedByElements", "aria-description": "ariaDescription", "aria-details": "ariaDetailsElements", "aria-disabled": "ariaDisabled", "aria-errormessage": "ariaErrorMessageElements", "aria-expanded": "ariaExpanded", "aria-flowto": "ariaFlowToElements", "aria-haspopup": "ariaHasPopup", "aria-hidden": "ariaHidden", "aria-invalid": "ariaInvalid", "aria-keyshortcuts": "ariaKeyShortcuts", "aria-label": "ariaLabel", "aria-labelledby": "ariaLabelledByElements", "aria-level": "ariaLevel", "aria-live": "ariaLive", "aria-modal": "ariaModal", "aria-multiline": "ariaMultiLine", "aria-multiselectable": "ariaMultiSelectable", "aria-orientation": "ariaOrientation", "aria-owns": "ariaOwnsElements", "aria-placeholder": "ariaPlaceholder", "aria-posinset": "ariaPosInSet", "aria-pressed": "ariaPressed", "aria-readonly": "ariaReadOnly", "aria-required": "ariaRequired", "aria-roledescription": "ariaRoleDescription", "aria-rowcount": "ariaRowCount", "aria-rowindex": "ariaRowIndex", "aria-rowindextext": "ariaRowIndexText", "aria-rowspan": "ariaRowSpan", "aria-selected": "ariaSelected", "aria-setsize": "ariaSetSize", "aria-sort": "ariaSort", "aria-valuemax": "ariaValueMax", "aria-valuemin": "ariaValueMin", "aria-valuenow": "ariaValueNow", "aria-valuetext": "ariaValueText" }));
var Ma = Array.from(hi).reduce((e2, [t2, r2]) => (e2.set(t2, r2), e2), /* @__PURE__ */ new Map());
var mi = class extends pi {
  static {
    __name(this, "mi");
  }
  _schema = /* @__PURE__ */ new Map();
  _eventSchema = /* @__PURE__ */ new Map();
  constructor() {
    super(), Ra.forEach((e2) => {
      let t2 = /* @__PURE__ */ new Map(), r2 = /* @__PURE__ */ new Set(), [n2, i] = e2.split("|"), s2 = i.split(","), [a, o2] = n2.split("^");
      a.split(",").forEach((u) => {
        this._schema.set(u.toLowerCase(), t2), this._eventSchema.set(u.toLowerCase(), r2);
      });
      let c2 = o2 && this._schema.get(o2.toLowerCase());
      if (c2) {
        for (let [u, p] of c2) t2.set(u, p);
        for (let u of this._eventSchema.get(o2.toLowerCase())) r2.add(u);
      }
      s2.forEach((u) => {
        if (u.length > 0) switch (u[0]) {
          case "*":
            r2.add(u.substring(1));
            break;
          case "!":
            t2.set(u.substring(1), Pa);
            break;
          case "#":
            t2.set(u.substring(1), Oa);
            break;
          case "%":
            t2.set(u.substring(1), Ia);
            break;
          default:
            t2.set(u, Da);
        }
      });
    });
  }
  hasProperty(e2, t2, r2) {
    if (r2.some((n2) => n2.name === ur.name)) return true;
    if (e2.indexOf("-") > -1) {
      if (or(e2) || lr(e2)) return false;
      if (r2.some((n2) => n2.name === cr.name)) return true;
    }
    return (this._schema.get(e2.toLowerCase()) || this._schema.get("unknown")).has(t2);
  }
  hasElement(e2, t2) {
    return t2.some((r2) => r2.name === ur.name) || e2.indexOf("-") > -1 && (or(e2) || lr(e2) || t2.some((r2) => r2.name === cr.name)) ? true : this._schema.has(e2.toLowerCase());
  }
  securityContext(e2, t2, r2) {
    r2 && (t2 = this.getMappedPropName(t2)), e2 = e2.toLowerCase(), t2 = t2.toLowerCase();
    let n2 = pr()[e2 + "|" + t2];
    return n2 || (n2 = pr()["*|" + t2], n2 || Z.NONE);
  }
  getMappedPropName(e2) {
    return hi.get(e2) ?? e2;
  }
  getDefaultComponentElementName() {
    return "ng-component";
  }
  validateProperty(e2) {
    return e2.toLowerCase().startsWith("on") ? { error: true, msg: `Binding to event property '${e2}' is disallowed for security reasons, please use (${e2.slice(2)})=...
If '${e2}' is a directive input, make sure the directive is imported by the current module.` } : { error: false };
  }
  validateAttribute(e2) {
    return e2.toLowerCase().startsWith("on") ? { error: true, msg: `Binding to event attribute '${e2}' is disallowed for security reasons, please use (${e2.slice(2)})=...` } : { error: false };
  }
  allKnownElementNames() {
    return Array.from(this._schema.keys());
  }
  allKnownAttributesOfElement(e2) {
    let t2 = this._schema.get(e2.toLowerCase()) || this._schema.get("unknown");
    return Array.from(t2.keys()).map((r2) => Ma.get(r2) ?? r2);
  }
  allKnownEventsOfElement(e2) {
    return Array.from(this._eventSchema.get(e2.toLowerCase()) ?? []);
  }
  normalizeAnimationStyleProperty(e2) {
    return ui(e2);
  }
  normalizeAnimationStyleValue(e2, t2, r2) {
    let n2 = "", i = r2.toString().trim(), s2 = null;
    if (Ba(e2) && r2 !== 0 && r2 !== "0") if (typeof r2 == "number") n2 = "px";
    else {
      let a = r2.match(/^[+-]?[\d\.]+([a-z]*)$/);
      a && a[1].length == 0 && (s2 = `Please provide a CSS unit value for ${t2}:${r2}`);
    }
    return { error: s2, value: i + n2 };
  }
};
function Ba(e2) {
  switch (e2) {
    case "width":
    case "height":
    case "minWidth":
    case "minHeight":
    case "maxWidth":
    case "maxHeight":
    case "left":
    case "top":
    case "bottom":
    case "right":
    case "fontSize":
    case "outlineWidth":
    case "outlineOffset":
    case "paddingTop":
    case "paddingLeft":
    case "paddingBottom":
    case "paddingRight":
    case "marginTop":
    case "marginLeft":
    case "marginBottom":
    case "marginRight":
    case "borderRadius":
    case "borderWidth":
    case "borderTopWidth":
    case "borderLeftWidth":
    case "borderRightWidth":
    case "borderBottomWidth":
    case "textIndent":
      return true;
    default:
      return false;
  }
}
__name(Ba, "Ba");
var f = class {
  static {
    __name(this, "f");
  }
  closedByChildren = {};
  contentType;
  closedByParent = false;
  implicitNamespacePrefix;
  isVoid;
  ignoreFirstLf;
  canSelfClose;
  preventNamespaceInheritance;
  constructor({ closedByChildren: e2, implicitNamespacePrefix: t2, contentType: r2 = R.PARSABLE_DATA, closedByParent: n2 = false, isVoid: i = false, ignoreFirstLf: s2 = false, preventNamespaceInheritance: a = false, canSelfClose: o2 = false } = {}) {
    e2 && e2.length > 0 && e2.forEach((c2) => this.closedByChildren[c2] = true), this.isVoid = i, this.closedByParent = n2 || i, this.implicitNamespacePrefix = t2 || null, this.contentType = r2, this.ignoreFirstLf = s2, this.preventNamespaceInheritance = a, this.canSelfClose = o2 ?? i;
  }
  isClosedByChild(e2) {
    return this.isVoid || e2.toLowerCase() in this.closedByChildren;
  }
  getContentType(e2) {
    return typeof this.contentType == "object" ? (e2 === void 0 ? void 0 : this.contentType[e2]) ?? this.contentType.default : this.contentType;
  }
};
var fi;
var rt;
function Oe(e2) {
  return rt || (fi = new f({ canSelfClose: true }), rt = Object.assign(/* @__PURE__ */ Object.create(null), { base: new f({ isVoid: true }), meta: new f({ isVoid: true }), area: new f({ isVoid: true }), embed: new f({ isVoid: true }), link: new f({ isVoid: true }), img: new f({ isVoid: true }), input: new f({ isVoid: true }), param: new f({ isVoid: true }), hr: new f({ isVoid: true }), br: new f({ isVoid: true }), source: new f({ isVoid: true }), track: new f({ isVoid: true }), wbr: new f({ isVoid: true }), p: new f({ closedByChildren: ["address", "article", "aside", "blockquote", "div", "dl", "fieldset", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hgroup", "hr", "main", "nav", "ol", "p", "pre", "section", "table", "ul"], closedByParent: true }), thead: new f({ closedByChildren: ["tbody", "tfoot"] }), tbody: new f({ closedByChildren: ["tbody", "tfoot"], closedByParent: true }), tfoot: new f({ closedByChildren: ["tbody"], closedByParent: true }), tr: new f({ closedByChildren: ["tr"], closedByParent: true }), td: new f({ closedByChildren: ["td", "th"], closedByParent: true }), th: new f({ closedByChildren: ["td", "th"], closedByParent: true }), col: new f({ isVoid: true }), svg: new f({ implicitNamespacePrefix: "svg" }), foreignObject: new f({ implicitNamespacePrefix: "svg", preventNamespaceInheritance: true }), math: new f({ implicitNamespacePrefix: "math" }), li: new f({ closedByChildren: ["li"], closedByParent: true }), dt: new f({ closedByChildren: ["dt", "dd"] }), dd: new f({ closedByChildren: ["dt", "dd"], closedByParent: true }), rb: new f({ closedByChildren: ["rb", "rt", "rtc", "rp"], closedByParent: true }), rt: new f({ closedByChildren: ["rb", "rt", "rtc", "rp"], closedByParent: true }), rtc: new f({ closedByChildren: ["rb", "rtc", "rp"], closedByParent: true }), rp: new f({ closedByChildren: ["rb", "rt", "rtc", "rp"], closedByParent: true }), optgroup: new f({ closedByChildren: ["optgroup"], closedByParent: true }), option: new f({ closedByChildren: ["option", "optgroup"], closedByParent: true }), pre: new f({ ignoreFirstLf: true }), listing: new f({ ignoreFirstLf: true }), style: new f({ contentType: R.RAW_TEXT }), script: new f({ contentType: R.RAW_TEXT }), title: new f({ contentType: { default: R.ESCAPABLE_RAW_TEXT, svg: R.PARSABLE_DATA } }), textarea: new f({ contentType: R.ESCAPABLE_RAW_TEXT, ignoreFirstLf: true }) }), new mi().allKnownElementNames().forEach((t2) => {
    !rt[t2] && Pe(t2) === null && (rt[t2] = new f({ canSelfClose: false }));
  })), rt[e2] ?? fi;
}
__name(Oe, "Oe");
var De = class gi {
  static {
    __name(this, "gi");
  }
  constructor(t2, r2, n2, i) {
    this.file = t2, this.offset = r2, this.line = n2, this.col = i;
  }
  toString() {
    return this.offset != null ? `${this.file.url}@${this.line}:${this.col}` : this.file.url;
  }
  moveBy(t2) {
    let r2 = this.file.content, n2 = r2.length, i = this.offset, s2 = this.line, a = this.col;
    for (; i > 0 && t2 < 0; ) if (i--, t2++, r2.charCodeAt(i) == 10) {
      s2--;
      let o2 = r2.substring(0, i - 1).lastIndexOf(`
`);
      a = o2 > 0 ? i - o2 : i;
    } else a--;
    for (; i < n2 && t2 > 0; ) {
      let o2 = r2.charCodeAt(i);
      i++, t2--, o2 == 10 ? (s2++, a = 0) : a++;
    }
    return new gi(this.file, i, s2, a);
  }
  getContext(t2, r2) {
    let n2 = this.file.content, i = this.offset;
    if (i != null) {
      i > n2.length - 1 && (i = n2.length - 1);
      let s2 = i, a = 0, o2 = 0;
      for (; a < t2 && i > 0 && (i--, a++, !(n2[i] == `
` && ++o2 == r2)); ) ;
      for (a = 0, o2 = 0; a < t2 && s2 < n2.length - 1 && (s2++, a++, !(n2[s2] == `
` && ++o2 == r2)); ) ;
      return { before: n2.substring(i, this.offset), after: n2.substring(this.offset, s2 + 1) };
    }
    return null;
  }
};
var nt = class {
  static {
    __name(this, "nt");
  }
  constructor(e2, t2) {
    this.content = e2, this.url = t2;
  }
};
var h = class {
  static {
    __name(this, "h");
  }
  constructor(e2, t2, r2 = e2, n2 = null) {
    this.start = e2, this.end = t2, this.fullStart = r2, this.details = n2;
  }
  toString() {
    return this.start.file.content.substring(this.start.offset, this.end.offset);
  }
};
var di = function(e2) {
  return e2[e2.WARNING = 0] = "WARNING", e2[e2.ERROR = 1] = "ERROR", e2;
}({});
var ee = class extends Error {
  static {
    __name(this, "ee");
  }
  constructor(e2, t2, r2 = di.ERROR, n2) {
    super(t2), this.span = e2, this.msg = t2, this.level = r2, this.relatedError = n2, Object.setPrototypeOf(this, new.target.prototype);
  }
  contextualMessage() {
    let e2 = this.span.start.getContext(100, 3);
    return e2 ? `${this.msg} ("${e2.before}[${di[this.level]} ->]${e2.after}")` : this.msg;
  }
  toString() {
    let e2 = this.span.details ? `, ${this.span.details}` : "";
    return `${this.contextualMessage()}: ${this.span.start}${e2}`;
  }
};
var de = class {
  static {
    __name(this, "de");
  }
  constructor(e2, t2) {
    this.sourceSpan = e2, this.i18n = t2;
  }
};
var _i = class extends de {
  static {
    __name(this, "_i");
  }
  constructor(e2, t2, r2, n2) {
    super(t2, n2), this.value = e2, this.tokens = r2;
  }
  visit(e2, t2) {
    return e2.visitText(this, t2);
  }
  kind = "text";
};
var Si = class extends de {
  static {
    __name(this, "Si");
  }
  constructor(e2, t2, r2, n2) {
    super(t2, n2), this.value = e2, this.tokens = r2;
  }
  visit(e2, t2) {
    return e2.visitCdata(this, t2);
  }
  kind = "cdata";
};
var Ei = class extends de {
  static {
    __name(this, "Ei");
  }
  constructor(e2, t2, r2, n2, i, s2) {
    super(n2, s2), this.switchValue = e2, this.type = t2, this.cases = r2, this.switchValueSourceSpan = i;
  }
  visit(e2, t2) {
    return e2.visitExpansion(this, t2);
  }
  kind = "expansion";
};
var Ci = class {
  static {
    __name(this, "Ci");
  }
  constructor(e2, t2, r2, n2, i) {
    this.value = e2, this.expression = t2, this.sourceSpan = r2, this.valueSourceSpan = n2, this.expSourceSpan = i;
  }
  visit(e2, t2) {
    return e2.visitExpansionCase(this, t2);
  }
  kind = "expansionCase";
};
var vi = class extends de {
  static {
    __name(this, "vi");
  }
  constructor(e2, t2, r2, n2, i, s2, a) {
    super(r2, a), this.name = e2, this.value = t2, this.keySpan = n2, this.valueSpan = i, this.valueTokens = s2;
  }
  visit(e2, t2) {
    return e2.visitAttribute(this, t2);
  }
  kind = "attribute";
  get nameSpan() {
    return this.keySpan;
  }
};
var te = class extends de {
  static {
    __name(this, "te");
  }
  constructor(e2, t2, r2, n2, i, s2, a, o2 = null, c2 = null, u, p) {
    super(s2, p), this.name = e2, this.attrs = t2, this.directives = r2, this.children = n2, this.isSelfClosing = i, this.startSourceSpan = a, this.endSourceSpan = o2, this.nameSpan = c2, this.isVoid = u;
  }
  visit(e2, t2) {
    return e2.visitElement(this, t2);
  }
  kind = "element";
};
var Ti = class {
  static {
    __name(this, "Ti");
  }
  constructor(e2, t2) {
    this.value = e2, this.sourceSpan = t2;
  }
  visit(e2, t2) {
    return e2.visitComment(this, t2);
  }
  kind = "comment";
};
var bi = class {
  static {
    __name(this, "bi");
  }
  constructor(e2, t2) {
    this.value = e2, this.sourceSpan = t2;
  }
  visit(e2, t2) {
    return e2.visitDocType(this, t2);
  }
  kind = "docType";
};
var ge = class extends de {
  static {
    __name(this, "ge");
  }
  constructor(e2, t2, r2, n2, i, s2, a = null, o2) {
    super(n2, o2), this.name = e2, this.parameters = t2, this.children = r2, this.nameSpan = i, this.startSourceSpan = s2, this.endSourceSpan = a;
  }
  visit(e2, t2) {
    return e2.visitBlock(this, t2);
  }
  kind = "block";
};
var G = class extends de {
  static {
    __name(this, "G");
  }
  constructor(e2, t2, r2, n2, i, s2, a, o2, c2, u = null, p) {
    super(o2, p), this.componentName = e2, this.tagName = t2, this.fullName = r2, this.attrs = n2, this.directives = i, this.children = s2, this.isSelfClosing = a, this.startSourceSpan = c2, this.endSourceSpan = u;
  }
  visit(e2, t2) {
    return e2.visitComponent(this, t2);
  }
  kind = "component";
};
var wi = class {
  static {
    __name(this, "wi");
  }
  constructor(e2, t2, r2, n2, i = null) {
    this.name = e2, this.attrs = t2, this.sourceSpan = r2, this.startSourceSpan = n2, this.endSourceSpan = i;
  }
  visit(e2, t2) {
    return e2.visitDirective(this, t2);
  }
  kind = "directive";
};
var hr = class {
  static {
    __name(this, "hr");
  }
  constructor(e2, t2) {
    this.expression = e2, this.sourceSpan = t2;
  }
  visit(e2, t2) {
    return e2.visitBlockParameter(this, t2);
  }
  kind = "blockParameter";
  startSourceSpan = null;
  endSourceSpan = null;
};
var mr = class {
  static {
    __name(this, "mr");
  }
  constructor(e2, t2, r2, n2, i) {
    this.name = e2, this.value = t2, this.sourceSpan = r2, this.nameSpan = n2, this.valueSpan = i;
  }
  visit(e2, t2) {
    return e2.visitLetDeclaration(this, t2);
  }
  kind = "letDeclaration";
  startSourceSpan = null;
  endSourceSpan = null;
};
function Ot(e2, t2, r2 = null) {
  let n2 = [], i = e2.visit ? (s2) => e2.visit(s2, r2) || s2.visit(e2, r2) : (s2) => s2.visit(e2, r2);
  return t2.forEach((s2) => {
    let a = i(s2);
    a && n2.push(a);
  }), n2;
}
__name(Ot, "Ot");
var fr = class {
  static {
    __name(this, "fr");
  }
  constructor() {
  }
  visitElement(e2, t2) {
    this.visitChildren(t2, (r2) => {
      r2(e2.attrs), r2(e2.directives), r2(e2.children);
    });
  }
  visitAttribute(e2, t2) {
  }
  visitText(e2, t2) {
  }
  visitCdata(e2, t2) {
  }
  visitComment(e2, t2) {
  }
  visitDocType(e2, t2) {
  }
  visitExpansion(e2, t2) {
    return this.visitChildren(t2, (r2) => {
      r2(e2.cases);
    });
  }
  visitExpansionCase(e2, t2) {
  }
  visitBlock(e2, t2) {
    this.visitChildren(t2, (r2) => {
      r2(e2.parameters), r2(e2.children);
    });
  }
  visitBlockParameter(e2, t2) {
  }
  visitLetDeclaration(e2, t2) {
  }
  visitComponent(e2, t2) {
    this.visitChildren(t2, (r2) => {
      r2(e2.attrs), r2(e2.children);
    });
  }
  visitDirective(e2, t2) {
    this.visitChildren(t2, (r2) => {
      r2(e2.attrs);
    });
  }
  visitChildren(e2, t2) {
    let r2 = [], n2 = this;
    function i(s2) {
      s2 && r2.push(Ot(n2, s2, e2));
    }
    __name(i, "i");
    return t2(i), Array.prototype.concat.apply([], r2);
  }
};
var _e = { AElig: "Æ", AMP: "&", amp: "&", Aacute: "Á", Abreve: "Ă", Acirc: "Â", Acy: "А", Afr: "𝔄", Agrave: "À", Alpha: "Α", Amacr: "Ā", And: "⩓", Aogon: "Ą", Aopf: "𝔸", ApplyFunction: "⁡", af: "⁡", Aring: "Å", angst: "Å", Ascr: "𝒜", Assign: "≔", colone: "≔", coloneq: "≔", Atilde: "Ã", Auml: "Ä", Backslash: "∖", setminus: "∖", setmn: "∖", smallsetminus: "∖", ssetmn: "∖", Barv: "⫧", Barwed: "⌆", doublebarwedge: "⌆", Bcy: "Б", Because: "∵", becaus: "∵", because: "∵", Bernoullis: "ℬ", Bscr: "ℬ", bernou: "ℬ", Beta: "Β", Bfr: "𝔅", Bopf: "𝔹", Breve: "˘", breve: "˘", Bumpeq: "≎", HumpDownHump: "≎", bump: "≎", CHcy: "Ч", COPY: "©", copy: "©", Cacute: "Ć", Cap: "⋒", CapitalDifferentialD: "ⅅ", DD: "ⅅ", Cayleys: "ℭ", Cfr: "ℭ", Ccaron: "Č", Ccedil: "Ç", Ccirc: "Ĉ", Cconint: "∰", Cdot: "Ċ", Cedilla: "¸", cedil: "¸", CenterDot: "·", centerdot: "·", middot: "·", Chi: "Χ", CircleDot: "⊙", odot: "⊙", CircleMinus: "⊖", ominus: "⊖", CirclePlus: "⊕", oplus: "⊕", CircleTimes: "⊗", otimes: "⊗", ClockwiseContourIntegral: "∲", cwconint: "∲", CloseCurlyDoubleQuote: "”", rdquo: "”", rdquor: "”", CloseCurlyQuote: "’", rsquo: "’", rsquor: "’", Colon: "∷", Proportion: "∷", Colone: "⩴", Congruent: "≡", equiv: "≡", Conint: "∯", DoubleContourIntegral: "∯", ContourIntegral: "∮", conint: "∮", oint: "∮", Copf: "ℂ", complexes: "ℂ", Coproduct: "∐", coprod: "∐", CounterClockwiseContourIntegral: "∳", awconint: "∳", Cross: "⨯", Cscr: "𝒞", Cup: "⋓", CupCap: "≍", asympeq: "≍", DDotrahd: "⤑", DJcy: "Ђ", DScy: "Ѕ", DZcy: "Џ", Dagger: "‡", ddagger: "‡", Darr: "↡", Dashv: "⫤", DoubleLeftTee: "⫤", Dcaron: "Ď", Dcy: "Д", Del: "∇", nabla: "∇", Delta: "Δ", Dfr: "𝔇", DiacriticalAcute: "´", acute: "´", DiacriticalDot: "˙", dot: "˙", DiacriticalDoubleAcute: "˝", dblac: "˝", DiacriticalGrave: "`", grave: "`", DiacriticalTilde: "˜", tilde: "˜", Diamond: "⋄", diam: "⋄", diamond: "⋄", DifferentialD: "ⅆ", dd: "ⅆ", Dopf: "𝔻", Dot: "¨", DoubleDot: "¨", die: "¨", uml: "¨", DotDot: "⃜", DotEqual: "≐", doteq: "≐", esdot: "≐", DoubleDownArrow: "⇓", Downarrow: "⇓", dArr: "⇓", DoubleLeftArrow: "⇐", Leftarrow: "⇐", lArr: "⇐", DoubleLeftRightArrow: "⇔", Leftrightarrow: "⇔", hArr: "⇔", iff: "⇔", DoubleLongLeftArrow: "⟸", Longleftarrow: "⟸", xlArr: "⟸", DoubleLongLeftRightArrow: "⟺", Longleftrightarrow: "⟺", xhArr: "⟺", DoubleLongRightArrow: "⟹", Longrightarrow: "⟹", xrArr: "⟹", DoubleRightArrow: "⇒", Implies: "⇒", Rightarrow: "⇒", rArr: "⇒", DoubleRightTee: "⊨", vDash: "⊨", DoubleUpArrow: "⇑", Uparrow: "⇑", uArr: "⇑", DoubleUpDownArrow: "⇕", Updownarrow: "⇕", vArr: "⇕", DoubleVerticalBar: "∥", par: "∥", parallel: "∥", shortparallel: "∥", spar: "∥", DownArrow: "↓", ShortDownArrow: "↓", darr: "↓", downarrow: "↓", DownArrowBar: "⤓", DownArrowUpArrow: "⇵", duarr: "⇵", DownBreve: "̑", DownLeftRightVector: "⥐", DownLeftTeeVector: "⥞", DownLeftVector: "↽", leftharpoondown: "↽", lhard: "↽", DownLeftVectorBar: "⥖", DownRightTeeVector: "⥟", DownRightVector: "⇁", rhard: "⇁", rightharpoondown: "⇁", DownRightVectorBar: "⥗", DownTee: "⊤", top: "⊤", DownTeeArrow: "↧", mapstodown: "↧", Dscr: "𝒟", Dstrok: "Đ", ENG: "Ŋ", ETH: "Ð", Eacute: "É", Ecaron: "Ě", Ecirc: "Ê", Ecy: "Э", Edot: "Ė", Efr: "𝔈", Egrave: "È", Element: "∈", in: "∈", isin: "∈", isinv: "∈", Emacr: "Ē", EmptySmallSquare: "◻", EmptyVerySmallSquare: "▫", Eogon: "Ę", Eopf: "𝔼", Epsilon: "Ε", Equal: "⩵", EqualTilde: "≂", eqsim: "≂", esim: "≂", Equilibrium: "⇌", rightleftharpoons: "⇌", rlhar: "⇌", Escr: "ℰ", expectation: "ℰ", Esim: "⩳", Eta: "Η", Euml: "Ë", Exists: "∃", exist: "∃", ExponentialE: "ⅇ", ee: "ⅇ", exponentiale: "ⅇ", Fcy: "Ф", Ffr: "𝔉", FilledSmallSquare: "◼", FilledVerySmallSquare: "▪", blacksquare: "▪", squarf: "▪", squf: "▪", Fopf: "𝔽", ForAll: "∀", forall: "∀", Fouriertrf: "ℱ", Fscr: "ℱ", GJcy: "Ѓ", GT: ">", gt: ">", Gamma: "Γ", Gammad: "Ϝ", Gbreve: "Ğ", Gcedil: "Ģ", Gcirc: "Ĝ", Gcy: "Г", Gdot: "Ġ", Gfr: "𝔊", Gg: "⋙", ggg: "⋙", Gopf: "𝔾", GreaterEqual: "≥", ge: "≥", geq: "≥", GreaterEqualLess: "⋛", gel: "⋛", gtreqless: "⋛", GreaterFullEqual: "≧", gE: "≧", geqq: "≧", GreaterGreater: "⪢", GreaterLess: "≷", gl: "≷", gtrless: "≷", GreaterSlantEqual: "⩾", geqslant: "⩾", ges: "⩾", GreaterTilde: "≳", gsim: "≳", gtrsim: "≳", Gscr: "𝒢", Gt: "≫", NestedGreaterGreater: "≫", gg: "≫", HARDcy: "Ъ", Hacek: "ˇ", caron: "ˇ", Hat: "^", Hcirc: "Ĥ", Hfr: "ℌ", Poincareplane: "ℌ", HilbertSpace: "ℋ", Hscr: "ℋ", hamilt: "ℋ", Hopf: "ℍ", quaternions: "ℍ", HorizontalLine: "─", boxh: "─", Hstrok: "Ħ", HumpEqual: "≏", bumpe: "≏", bumpeq: "≏", IEcy: "Е", IJlig: "Ĳ", IOcy: "Ё", Iacute: "Í", Icirc: "Î", Icy: "И", Idot: "İ", Ifr: "ℑ", Im: "ℑ", image: "ℑ", imagpart: "ℑ", Igrave: "Ì", Imacr: "Ī", ImaginaryI: "ⅈ", ii: "ⅈ", Int: "∬", Integral: "∫", int: "∫", Intersection: "⋂", bigcap: "⋂", xcap: "⋂", InvisibleComma: "⁣", ic: "⁣", InvisibleTimes: "⁢", it: "⁢", Iogon: "Į", Iopf: "𝕀", Iota: "Ι", Iscr: "ℐ", imagline: "ℐ", Itilde: "Ĩ", Iukcy: "І", Iuml: "Ï", Jcirc: "Ĵ", Jcy: "Й", Jfr: "𝔍", Jopf: "𝕁", Jscr: "𝒥", Jsercy: "Ј", Jukcy: "Є", KHcy: "Х", KJcy: "Ќ", Kappa: "Κ", Kcedil: "Ķ", Kcy: "К", Kfr: "𝔎", Kopf: "𝕂", Kscr: "𝒦", LJcy: "Љ", LT: "<", lt: "<", Lacute: "Ĺ", Lambda: "Λ", Lang: "⟪", Laplacetrf: "ℒ", Lscr: "ℒ", lagran: "ℒ", Larr: "↞", twoheadleftarrow: "↞", Lcaron: "Ľ", Lcedil: "Ļ", Lcy: "Л", LeftAngleBracket: "⟨", lang: "⟨", langle: "⟨", LeftArrow: "←", ShortLeftArrow: "←", larr: "←", leftarrow: "←", slarr: "←", LeftArrowBar: "⇤", larrb: "⇤", LeftArrowRightArrow: "⇆", leftrightarrows: "⇆", lrarr: "⇆", LeftCeiling: "⌈", lceil: "⌈", LeftDoubleBracket: "⟦", lobrk: "⟦", LeftDownTeeVector: "⥡", LeftDownVector: "⇃", dharl: "⇃", downharpoonleft: "⇃", LeftDownVectorBar: "⥙", LeftFloor: "⌊", lfloor: "⌊", LeftRightArrow: "↔", harr: "↔", leftrightarrow: "↔", LeftRightVector: "⥎", LeftTee: "⊣", dashv: "⊣", LeftTeeArrow: "↤", mapstoleft: "↤", LeftTeeVector: "⥚", LeftTriangle: "⊲", vartriangleleft: "⊲", vltri: "⊲", LeftTriangleBar: "⧏", LeftTriangleEqual: "⊴", ltrie: "⊴", trianglelefteq: "⊴", LeftUpDownVector: "⥑", LeftUpTeeVector: "⥠", LeftUpVector: "↿", uharl: "↿", upharpoonleft: "↿", LeftUpVectorBar: "⥘", LeftVector: "↼", leftharpoonup: "↼", lharu: "↼", LeftVectorBar: "⥒", LessEqualGreater: "⋚", leg: "⋚", lesseqgtr: "⋚", LessFullEqual: "≦", lE: "≦", leqq: "≦", LessGreater: "≶", lessgtr: "≶", lg: "≶", LessLess: "⪡", LessSlantEqual: "⩽", leqslant: "⩽", les: "⩽", LessTilde: "≲", lesssim: "≲", lsim: "≲", Lfr: "𝔏", Ll: "⋘", Lleftarrow: "⇚", lAarr: "⇚", Lmidot: "Ŀ", LongLeftArrow: "⟵", longleftarrow: "⟵", xlarr: "⟵", LongLeftRightArrow: "⟷", longleftrightarrow: "⟷", xharr: "⟷", LongRightArrow: "⟶", longrightarrow: "⟶", xrarr: "⟶", Lopf: "𝕃", LowerLeftArrow: "↙", swarr: "↙", swarrow: "↙", LowerRightArrow: "↘", searr: "↘", searrow: "↘", Lsh: "↰", lsh: "↰", Lstrok: "Ł", Lt: "≪", NestedLessLess: "≪", ll: "≪", Map: "⤅", Mcy: "М", MediumSpace: " ", Mellintrf: "ℳ", Mscr: "ℳ", phmmat: "ℳ", Mfr: "𝔐", MinusPlus: "∓", mnplus: "∓", mp: "∓", Mopf: "𝕄", Mu: "Μ", NJcy: "Њ", Nacute: "Ń", Ncaron: "Ň", Ncedil: "Ņ", Ncy: "Н", NegativeMediumSpace: "​", NegativeThickSpace: "​", NegativeThinSpace: "​", NegativeVeryThinSpace: "​", ZeroWidthSpace: "​", NewLine: `
`, Nfr: "𝔑", NoBreak: "⁠", NonBreakingSpace: " ", nbsp: " ", Nopf: "ℕ", naturals: "ℕ", Not: "⫬", NotCongruent: "≢", nequiv: "≢", NotCupCap: "≭", NotDoubleVerticalBar: "∦", npar: "∦", nparallel: "∦", nshortparallel: "∦", nspar: "∦", NotElement: "∉", notin: "∉", notinva: "∉", NotEqual: "≠", ne: "≠", NotEqualTilde: "≂̸", nesim: "≂̸", NotExists: "∄", nexist: "∄", nexists: "∄", NotGreater: "≯", ngt: "≯", ngtr: "≯", NotGreaterEqual: "≱", nge: "≱", ngeq: "≱", NotGreaterFullEqual: "≧̸", ngE: "≧̸", ngeqq: "≧̸", NotGreaterGreater: "≫̸", nGtv: "≫̸", NotGreaterLess: "≹", ntgl: "≹", NotGreaterSlantEqual: "⩾̸", ngeqslant: "⩾̸", nges: "⩾̸", NotGreaterTilde: "≵", ngsim: "≵", NotHumpDownHump: "≎̸", nbump: "≎̸", NotHumpEqual: "≏̸", nbumpe: "≏̸", NotLeftTriangle: "⋪", nltri: "⋪", ntriangleleft: "⋪", NotLeftTriangleBar: "⧏̸", NotLeftTriangleEqual: "⋬", nltrie: "⋬", ntrianglelefteq: "⋬", NotLess: "≮", nless: "≮", nlt: "≮", NotLessEqual: "≰", nle: "≰", nleq: "≰", NotLessGreater: "≸", ntlg: "≸", NotLessLess: "≪̸", nLtv: "≪̸", NotLessSlantEqual: "⩽̸", nleqslant: "⩽̸", nles: "⩽̸", NotLessTilde: "≴", nlsim: "≴", NotNestedGreaterGreater: "⪢̸", NotNestedLessLess: "⪡̸", NotPrecedes: "⊀", npr: "⊀", nprec: "⊀", NotPrecedesEqual: "⪯̸", npre: "⪯̸", npreceq: "⪯̸", NotPrecedesSlantEqual: "⋠", nprcue: "⋠", NotReverseElement: "∌", notni: "∌", notniva: "∌", NotRightTriangle: "⋫", nrtri: "⋫", ntriangleright: "⋫", NotRightTriangleBar: "⧐̸", NotRightTriangleEqual: "⋭", nrtrie: "⋭", ntrianglerighteq: "⋭", NotSquareSubset: "⊏̸", NotSquareSubsetEqual: "⋢", nsqsube: "⋢", NotSquareSuperset: "⊐̸", NotSquareSupersetEqual: "⋣", nsqsupe: "⋣", NotSubset: "⊂⃒", nsubset: "⊂⃒", vnsub: "⊂⃒", NotSubsetEqual: "⊈", nsube: "⊈", nsubseteq: "⊈", NotSucceeds: "⊁", nsc: "⊁", nsucc: "⊁", NotSucceedsEqual: "⪰̸", nsce: "⪰̸", nsucceq: "⪰̸", NotSucceedsSlantEqual: "⋡", nsccue: "⋡", NotSucceedsTilde: "≿̸", NotSuperset: "⊃⃒", nsupset: "⊃⃒", vnsup: "⊃⃒", NotSupersetEqual: "⊉", nsupe: "⊉", nsupseteq: "⊉", NotTilde: "≁", nsim: "≁", NotTildeEqual: "≄", nsime: "≄", nsimeq: "≄", NotTildeFullEqual: "≇", ncong: "≇", NotTildeTilde: "≉", nap: "≉", napprox: "≉", NotVerticalBar: "∤", nmid: "∤", nshortmid: "∤", nsmid: "∤", Nscr: "𝒩", Ntilde: "Ñ", Nu: "Ν", OElig: "Œ", Oacute: "Ó", Ocirc: "Ô", Ocy: "О", Odblac: "Ő", Ofr: "𝔒", Ograve: "Ò", Omacr: "Ō", Omega: "Ω", ohm: "Ω", Omicron: "Ο", Oopf: "𝕆", OpenCurlyDoubleQuote: "“", ldquo: "“", OpenCurlyQuote: "‘", lsquo: "‘", Or: "⩔", Oscr: "𝒪", Oslash: "Ø", Otilde: "Õ", Otimes: "⨷", Ouml: "Ö", OverBar: "‾", oline: "‾", OverBrace: "⏞", OverBracket: "⎴", tbrk: "⎴", OverParenthesis: "⏜", PartialD: "∂", part: "∂", Pcy: "П", Pfr: "𝔓", Phi: "Φ", Pi: "Π", PlusMinus: "±", plusmn: "±", pm: "±", Popf: "ℙ", primes: "ℙ", Pr: "⪻", Precedes: "≺", pr: "≺", prec: "≺", PrecedesEqual: "⪯", pre: "⪯", preceq: "⪯", PrecedesSlantEqual: "≼", prcue: "≼", preccurlyeq: "≼", PrecedesTilde: "≾", precsim: "≾", prsim: "≾", Prime: "″", Product: "∏", prod: "∏", Proportional: "∝", prop: "∝", propto: "∝", varpropto: "∝", vprop: "∝", Pscr: "𝒫", Psi: "Ψ", QUOT: '"', quot: '"', Qfr: "𝔔", Qopf: "ℚ", rationals: "ℚ", Qscr: "𝒬", RBarr: "⤐", drbkarow: "⤐", REG: "®", circledR: "®", reg: "®", Racute: "Ŕ", Rang: "⟫", Rarr: "↠", twoheadrightarrow: "↠", Rarrtl: "⤖", Rcaron: "Ř", Rcedil: "Ŗ", Rcy: "Р", Re: "ℜ", Rfr: "ℜ", real: "ℜ", realpart: "ℜ", ReverseElement: "∋", SuchThat: "∋", ni: "∋", niv: "∋", ReverseEquilibrium: "⇋", leftrightharpoons: "⇋", lrhar: "⇋", ReverseUpEquilibrium: "⥯", duhar: "⥯", Rho: "Ρ", RightAngleBracket: "⟩", rang: "⟩", rangle: "⟩", RightArrow: "→", ShortRightArrow: "→", rarr: "→", rightarrow: "→", srarr: "→", RightArrowBar: "⇥", rarrb: "⇥", RightArrowLeftArrow: "⇄", rightleftarrows: "⇄", rlarr: "⇄", RightCeiling: "⌉", rceil: "⌉", RightDoubleBracket: "⟧", robrk: "⟧", RightDownTeeVector: "⥝", RightDownVector: "⇂", dharr: "⇂", downharpoonright: "⇂", RightDownVectorBar: "⥕", RightFloor: "⌋", rfloor: "⌋", RightTee: "⊢", vdash: "⊢", RightTeeArrow: "↦", map: "↦", mapsto: "↦", RightTeeVector: "⥛", RightTriangle: "⊳", vartriangleright: "⊳", vrtri: "⊳", RightTriangleBar: "⧐", RightTriangleEqual: "⊵", rtrie: "⊵", trianglerighteq: "⊵", RightUpDownVector: "⥏", RightUpTeeVector: "⥜", RightUpVector: "↾", uharr: "↾", upharpoonright: "↾", RightUpVectorBar: "⥔", RightVector: "⇀", rharu: "⇀", rightharpoonup: "⇀", RightVectorBar: "⥓", Ropf: "ℝ", reals: "ℝ", RoundImplies: "⥰", Rrightarrow: "⇛", rAarr: "⇛", Rscr: "ℛ", realine: "ℛ", Rsh: "↱", rsh: "↱", RuleDelayed: "⧴", SHCHcy: "Щ", SHcy: "Ш", SOFTcy: "Ь", Sacute: "Ś", Sc: "⪼", Scaron: "Š", Scedil: "Ş", Scirc: "Ŝ", Scy: "С", Sfr: "𝔖", ShortUpArrow: "↑", UpArrow: "↑", uarr: "↑", uparrow: "↑", Sigma: "Σ", SmallCircle: "∘", compfn: "∘", Sopf: "𝕊", Sqrt: "√", radic: "√", Square: "□", squ: "□", square: "□", SquareIntersection: "⊓", sqcap: "⊓", SquareSubset: "⊏", sqsub: "⊏", sqsubset: "⊏", SquareSubsetEqual: "⊑", sqsube: "⊑", sqsubseteq: "⊑", SquareSuperset: "⊐", sqsup: "⊐", sqsupset: "⊐", SquareSupersetEqual: "⊒", sqsupe: "⊒", sqsupseteq: "⊒", SquareUnion: "⊔", sqcup: "⊔", Sscr: "𝒮", Star: "⋆", sstarf: "⋆", Sub: "⋐", Subset: "⋐", SubsetEqual: "⊆", sube: "⊆", subseteq: "⊆", Succeeds: "≻", sc: "≻", succ: "≻", SucceedsEqual: "⪰", sce: "⪰", succeq: "⪰", SucceedsSlantEqual: "≽", sccue: "≽", succcurlyeq: "≽", SucceedsTilde: "≿", scsim: "≿", succsim: "≿", Sum: "∑", sum: "∑", Sup: "⋑", Supset: "⋑", Superset: "⊃", sup: "⊃", supset: "⊃", SupersetEqual: "⊇", supe: "⊇", supseteq: "⊇", THORN: "Þ", TRADE: "™", trade: "™", TSHcy: "Ћ", TScy: "Ц", Tab: "	", Tau: "Τ", Tcaron: "Ť", Tcedil: "Ţ", Tcy: "Т", Tfr: "𝔗", Therefore: "∴", there4: "∴", therefore: "∴", Theta: "Θ", ThickSpace: "  ", ThinSpace: " ", thinsp: " ", Tilde: "∼", sim: "∼", thicksim: "∼", thksim: "∼", TildeEqual: "≃", sime: "≃", simeq: "≃", TildeFullEqual: "≅", cong: "≅", TildeTilde: "≈", ap: "≈", approx: "≈", asymp: "≈", thickapprox: "≈", thkap: "≈", Topf: "𝕋", TripleDot: "⃛", tdot: "⃛", Tscr: "𝒯", Tstrok: "Ŧ", Uacute: "Ú", Uarr: "↟", Uarrocir: "⥉", Ubrcy: "Ў", Ubreve: "Ŭ", Ucirc: "Û", Ucy: "У", Udblac: "Ű", Ufr: "𝔘", Ugrave: "Ù", Umacr: "Ū", UnderBar: "_", lowbar: "_", UnderBrace: "⏟", UnderBracket: "⎵", bbrk: "⎵", UnderParenthesis: "⏝", Union: "⋃", bigcup: "⋃", xcup: "⋃", UnionPlus: "⊎", uplus: "⊎", Uogon: "Ų", Uopf: "𝕌", UpArrowBar: "⤒", UpArrowDownArrow: "⇅", udarr: "⇅", UpDownArrow: "↕", updownarrow: "↕", varr: "↕", UpEquilibrium: "⥮", udhar: "⥮", UpTee: "⊥", bot: "⊥", bottom: "⊥", perp: "⊥", UpTeeArrow: "↥", mapstoup: "↥", UpperLeftArrow: "↖", nwarr: "↖", nwarrow: "↖", UpperRightArrow: "↗", nearr: "↗", nearrow: "↗", Upsi: "ϒ", upsih: "ϒ", Upsilon: "Υ", Uring: "Ů", Uscr: "𝒰", Utilde: "Ũ", Uuml: "Ü", VDash: "⊫", Vbar: "⫫", Vcy: "В", Vdash: "⊩", Vdashl: "⫦", Vee: "⋁", bigvee: "⋁", xvee: "⋁", Verbar: "‖", Vert: "‖", VerticalBar: "∣", mid: "∣", shortmid: "∣", smid: "∣", VerticalLine: "|", verbar: "|", vert: "|", VerticalSeparator: "❘", VerticalTilde: "≀", wr: "≀", wreath: "≀", VeryThinSpace: " ", hairsp: " ", Vfr: "𝔙", Vopf: "𝕍", Vscr: "𝒱", Vvdash: "⊪", Wcirc: "Ŵ", Wedge: "⋀", bigwedge: "⋀", xwedge: "⋀", Wfr: "𝔚", Wopf: "𝕎", Wscr: "𝒲", Xfr: "𝔛", Xi: "Ξ", Xopf: "𝕏", Xscr: "𝒳", YAcy: "Я", YIcy: "Ї", YUcy: "Ю", Yacute: "Ý", Ycirc: "Ŷ", Ycy: "Ы", Yfr: "𝔜", Yopf: "𝕐", Yscr: "𝒴", Yuml: "Ÿ", ZHcy: "Ж", Zacute: "Ź", Zcaron: "Ž", Zcy: "З", Zdot: "Ż", Zeta: "Ζ", Zfr: "ℨ", zeetrf: "ℨ", Zopf: "ℤ", integers: "ℤ", Zscr: "𝒵", aacute: "á", abreve: "ă", ac: "∾", mstpos: "∾", acE: "∾̳", acd: "∿", acirc: "â", acy: "а", aelig: "æ", afr: "𝔞", agrave: "à", alefsym: "ℵ", aleph: "ℵ", alpha: "α", amacr: "ā", amalg: "⨿", and: "∧", wedge: "∧", andand: "⩕", andd: "⩜", andslope: "⩘", andv: "⩚", ang: "∠", angle: "∠", ange: "⦤", angmsd: "∡", measuredangle: "∡", angmsdaa: "⦨", angmsdab: "⦩", angmsdac: "⦪", angmsdad: "⦫", angmsdae: "⦬", angmsdaf: "⦭", angmsdag: "⦮", angmsdah: "⦯", angrt: "∟", angrtvb: "⊾", angrtvbd: "⦝", angsph: "∢", angzarr: "⍼", aogon: "ą", aopf: "𝕒", apE: "⩰", apacir: "⩯", ape: "≊", approxeq: "≊", apid: "≋", apos: "'", aring: "å", ascr: "𝒶", ast: "*", midast: "*", atilde: "ã", auml: "ä", awint: "⨑", bNot: "⫭", backcong: "≌", bcong: "≌", backepsilon: "϶", bepsi: "϶", backprime: "‵", bprime: "‵", backsim: "∽", bsim: "∽", backsimeq: "⋍", bsime: "⋍", barvee: "⊽", barwed: "⌅", barwedge: "⌅", bbrktbrk: "⎶", bcy: "б", bdquo: "„", ldquor: "„", bemptyv: "⦰", beta: "β", beth: "ℶ", between: "≬", twixt: "≬", bfr: "𝔟", bigcirc: "◯", xcirc: "◯", bigodot: "⨀", xodot: "⨀", bigoplus: "⨁", xoplus: "⨁", bigotimes: "⨂", xotime: "⨂", bigsqcup: "⨆", xsqcup: "⨆", bigstar: "★", starf: "★", bigtriangledown: "▽", xdtri: "▽", bigtriangleup: "△", xutri: "△", biguplus: "⨄", xuplus: "⨄", bkarow: "⤍", rbarr: "⤍", blacklozenge: "⧫", lozf: "⧫", blacktriangle: "▴", utrif: "▴", blacktriangledown: "▾", dtrif: "▾", blacktriangleleft: "◂", ltrif: "◂", blacktriangleright: "▸", rtrif: "▸", blank: "␣", blk12: "▒", blk14: "░", blk34: "▓", block: "█", bne: "=⃥", bnequiv: "≡⃥", bnot: "⌐", bopf: "𝕓", bowtie: "⋈", boxDL: "╗", boxDR: "╔", boxDl: "╖", boxDr: "╓", boxH: "═", boxHD: "╦", boxHU: "╩", boxHd: "╤", boxHu: "╧", boxUL: "╝", boxUR: "╚", boxUl: "╜", boxUr: "╙", boxV: "║", boxVH: "╬", boxVL: "╣", boxVR: "╠", boxVh: "╫", boxVl: "╢", boxVr: "╟", boxbox: "⧉", boxdL: "╕", boxdR: "╒", boxdl: "┐", boxdr: "┌", boxhD: "╥", boxhU: "╨", boxhd: "┬", boxhu: "┴", boxminus: "⊟", minusb: "⊟", boxplus: "⊞", plusb: "⊞", boxtimes: "⊠", timesb: "⊠", boxuL: "╛", boxuR: "╘", boxul: "┘", boxur: "└", boxv: "│", boxvH: "╪", boxvL: "╡", boxvR: "╞", boxvh: "┼", boxvl: "┤", boxvr: "├", brvbar: "¦", bscr: "𝒷", bsemi: "⁏", bsol: "\\", bsolb: "⧅", bsolhsub: "⟈", bull: "•", bullet: "•", bumpE: "⪮", cacute: "ć", cap: "∩", capand: "⩄", capbrcup: "⩉", capcap: "⩋", capcup: "⩇", capdot: "⩀", caps: "∩︀", caret: "⁁", ccaps: "⩍", ccaron: "č", ccedil: "ç", ccirc: "ĉ", ccups: "⩌", ccupssm: "⩐", cdot: "ċ", cemptyv: "⦲", cent: "¢", cfr: "𝔠", chcy: "ч", check: "✓", checkmark: "✓", chi: "χ", cir: "○", cirE: "⧃", circ: "ˆ", circeq: "≗", cire: "≗", circlearrowleft: "↺", olarr: "↺", circlearrowright: "↻", orarr: "↻", circledS: "Ⓢ", oS: "Ⓢ", circledast: "⊛", oast: "⊛", circledcirc: "⊚", ocir: "⊚", circleddash: "⊝", odash: "⊝", cirfnint: "⨐", cirmid: "⫯", cirscir: "⧂", clubs: "♣", clubsuit: "♣", colon: ":", comma: ",", commat: "@", comp: "∁", complement: "∁", congdot: "⩭", copf: "𝕔", copysr: "℗", crarr: "↵", cross: "✗", cscr: "𝒸", csub: "⫏", csube: "⫑", csup: "⫐", csupe: "⫒", ctdot: "⋯", cudarrl: "⤸", cudarrr: "⤵", cuepr: "⋞", curlyeqprec: "⋞", cuesc: "⋟", curlyeqsucc: "⋟", cularr: "↶", curvearrowleft: "↶", cularrp: "⤽", cup: "∪", cupbrcap: "⩈", cupcap: "⩆", cupcup: "⩊", cupdot: "⊍", cupor: "⩅", cups: "∪︀", curarr: "↷", curvearrowright: "↷", curarrm: "⤼", curlyvee: "⋎", cuvee: "⋎", curlywedge: "⋏", cuwed: "⋏", curren: "¤", cwint: "∱", cylcty: "⌭", dHar: "⥥", dagger: "†", daleth: "ℸ", dash: "‐", hyphen: "‐", dbkarow: "⤏", rBarr: "⤏", dcaron: "ď", dcy: "д", ddarr: "⇊", downdownarrows: "⇊", ddotseq: "⩷", eDDot: "⩷", deg: "°", delta: "δ", demptyv: "⦱", dfisht: "⥿", dfr: "𝔡", diamondsuit: "♦", diams: "♦", digamma: "ϝ", gammad: "ϝ", disin: "⋲", div: "÷", divide: "÷", divideontimes: "⋇", divonx: "⋇", djcy: "ђ", dlcorn: "⌞", llcorner: "⌞", dlcrop: "⌍", dollar: "$", dopf: "𝕕", doteqdot: "≑", eDot: "≑", dotminus: "∸", minusd: "∸", dotplus: "∔", plusdo: "∔", dotsquare: "⊡", sdotb: "⊡", drcorn: "⌟", lrcorner: "⌟", drcrop: "⌌", dscr: "𝒹", dscy: "ѕ", dsol: "⧶", dstrok: "đ", dtdot: "⋱", dtri: "▿", triangledown: "▿", dwangle: "⦦", dzcy: "џ", dzigrarr: "⟿", eacute: "é", easter: "⩮", ecaron: "ě", ecir: "≖", eqcirc: "≖", ecirc: "ê", ecolon: "≕", eqcolon: "≕", ecy: "э", edot: "ė", efDot: "≒", fallingdotseq: "≒", efr: "𝔢", eg: "⪚", egrave: "è", egs: "⪖", eqslantgtr: "⪖", egsdot: "⪘", el: "⪙", elinters: "⏧", ell: "ℓ", els: "⪕", eqslantless: "⪕", elsdot: "⪗", emacr: "ē", empty: "∅", emptyset: "∅", emptyv: "∅", varnothing: "∅", emsp13: " ", emsp14: " ", emsp: " ", eng: "ŋ", ensp: " ", eogon: "ę", eopf: "𝕖", epar: "⋕", eparsl: "⧣", eplus: "⩱", epsi: "ε", epsilon: "ε", epsiv: "ϵ", straightepsilon: "ϵ", varepsilon: "ϵ", equals: "=", equest: "≟", questeq: "≟", equivDD: "⩸", eqvparsl: "⧥", erDot: "≓", risingdotseq: "≓", erarr: "⥱", escr: "ℯ", eta: "η", eth: "ð", euml: "ë", euro: "€", excl: "!", fcy: "ф", female: "♀", ffilig: "ﬃ", fflig: "ﬀ", ffllig: "ﬄ", ffr: "𝔣", filig: "ﬁ", fjlig: "fj", flat: "♭", fllig: "ﬂ", fltns: "▱", fnof: "ƒ", fopf: "𝕗", fork: "⋔", pitchfork: "⋔", forkv: "⫙", fpartint: "⨍", frac12: "½", half: "½", frac13: "⅓", frac14: "¼", frac15: "⅕", frac16: "⅙", frac18: "⅛", frac23: "⅔", frac25: "⅖", frac34: "¾", frac35: "⅗", frac38: "⅜", frac45: "⅘", frac56: "⅚", frac58: "⅝", frac78: "⅞", frasl: "⁄", frown: "⌢", sfrown: "⌢", fscr: "𝒻", gEl: "⪌", gtreqqless: "⪌", gacute: "ǵ", gamma: "γ", gap: "⪆", gtrapprox: "⪆", gbreve: "ğ", gcirc: "ĝ", gcy: "г", gdot: "ġ", gescc: "⪩", gesdot: "⪀", gesdoto: "⪂", gesdotol: "⪄", gesl: "⋛︀", gesles: "⪔", gfr: "𝔤", gimel: "ℷ", gjcy: "ѓ", glE: "⪒", gla: "⪥", glj: "⪤", gnE: "≩", gneqq: "≩", gnap: "⪊", gnapprox: "⪊", gne: "⪈", gneq: "⪈", gnsim: "⋧", gopf: "𝕘", gscr: "ℊ", gsime: "⪎", gsiml: "⪐", gtcc: "⪧", gtcir: "⩺", gtdot: "⋗", gtrdot: "⋗", gtlPar: "⦕", gtquest: "⩼", gtrarr: "⥸", gvertneqq: "≩︀", gvnE: "≩︀", hardcy: "ъ", harrcir: "⥈", harrw: "↭", leftrightsquigarrow: "↭", hbar: "ℏ", hslash: "ℏ", planck: "ℏ", plankv: "ℏ", hcirc: "ĥ", hearts: "♥", heartsuit: "♥", hellip: "…", mldr: "…", hercon: "⊹", hfr: "𝔥", hksearow: "⤥", searhk: "⤥", hkswarow: "⤦", swarhk: "⤦", hoarr: "⇿", homtht: "∻", hookleftarrow: "↩", larrhk: "↩", hookrightarrow: "↪", rarrhk: "↪", hopf: "𝕙", horbar: "―", hscr: "𝒽", hstrok: "ħ", hybull: "⁃", iacute: "í", icirc: "î", icy: "и", iecy: "е", iexcl: "¡", ifr: "𝔦", igrave: "ì", iiiint: "⨌", qint: "⨌", iiint: "∭", tint: "∭", iinfin: "⧜", iiota: "℩", ijlig: "ĳ", imacr: "ī", imath: "ı", inodot: "ı", imof: "⊷", imped: "Ƶ", incare: "℅", infin: "∞", infintie: "⧝", intcal: "⊺", intercal: "⊺", intlarhk: "⨗", intprod: "⨼", iprod: "⨼", iocy: "ё", iogon: "į", iopf: "𝕚", iota: "ι", iquest: "¿", iscr: "𝒾", isinE: "⋹", isindot: "⋵", isins: "⋴", isinsv: "⋳", itilde: "ĩ", iukcy: "і", iuml: "ï", jcirc: "ĵ", jcy: "й", jfr: "𝔧", jmath: "ȷ", jopf: "𝕛", jscr: "𝒿", jsercy: "ј", jukcy: "є", kappa: "κ", kappav: "ϰ", varkappa: "ϰ", kcedil: "ķ", kcy: "к", kfr: "𝔨", kgreen: "ĸ", khcy: "х", kjcy: "ќ", kopf: "𝕜", kscr: "𝓀", lAtail: "⤛", lBarr: "⤎", lEg: "⪋", lesseqqgtr: "⪋", lHar: "⥢", lacute: "ĺ", laemptyv: "⦴", lambda: "λ", langd: "⦑", lap: "⪅", lessapprox: "⪅", laquo: "«", larrbfs: "⤟", larrfs: "⤝", larrlp: "↫", looparrowleft: "↫", larrpl: "⤹", larrsim: "⥳", larrtl: "↢", leftarrowtail: "↢", lat: "⪫", latail: "⤙", late: "⪭", lates: "⪭︀", lbarr: "⤌", lbbrk: "❲", lbrace: "{", lcub: "{", lbrack: "[", lsqb: "[", lbrke: "⦋", lbrksld: "⦏", lbrkslu: "⦍", lcaron: "ľ", lcedil: "ļ", lcy: "л", ldca: "⤶", ldrdhar: "⥧", ldrushar: "⥋", ldsh: "↲", le: "≤", leq: "≤", leftleftarrows: "⇇", llarr: "⇇", leftthreetimes: "⋋", lthree: "⋋", lescc: "⪨", lesdot: "⩿", lesdoto: "⪁", lesdotor: "⪃", lesg: "⋚︀", lesges: "⪓", lessdot: "⋖", ltdot: "⋖", lfisht: "⥼", lfr: "𝔩", lgE: "⪑", lharul: "⥪", lhblk: "▄", ljcy: "љ", llhard: "⥫", lltri: "◺", lmidot: "ŀ", lmoust: "⎰", lmoustache: "⎰", lnE: "≨", lneqq: "≨", lnap: "⪉", lnapprox: "⪉", lne: "⪇", lneq: "⪇", lnsim: "⋦", loang: "⟬", loarr: "⇽", longmapsto: "⟼", xmap: "⟼", looparrowright: "↬", rarrlp: "↬", lopar: "⦅", lopf: "𝕝", loplus: "⨭", lotimes: "⨴", lowast: "∗", loz: "◊", lozenge: "◊", lpar: "(", lparlt: "⦓", lrhard: "⥭", lrm: "‎", lrtri: "⊿", lsaquo: "‹", lscr: "𝓁", lsime: "⪍", lsimg: "⪏", lsquor: "‚", sbquo: "‚", lstrok: "ł", ltcc: "⪦", ltcir: "⩹", ltimes: "⋉", ltlarr: "⥶", ltquest: "⩻", ltrPar: "⦖", ltri: "◃", triangleleft: "◃", lurdshar: "⥊", luruhar: "⥦", lvertneqq: "≨︀", lvnE: "≨︀", mDDot: "∺", macr: "¯", strns: "¯", male: "♂", malt: "✠", maltese: "✠", marker: "▮", mcomma: "⨩", mcy: "м", mdash: "—", mfr: "𝔪", mho: "℧", micro: "µ", midcir: "⫰", minus: "−", minusdu: "⨪", mlcp: "⫛", models: "⊧", mopf: "𝕞", mscr: "𝓂", mu: "μ", multimap: "⊸", mumap: "⊸", nGg: "⋙̸", nGt: "≫⃒", nLeftarrow: "⇍", nlArr: "⇍", nLeftrightarrow: "⇎", nhArr: "⇎", nLl: "⋘̸", nLt: "≪⃒", nRightarrow: "⇏", nrArr: "⇏", nVDash: "⊯", nVdash: "⊮", nacute: "ń", nang: "∠⃒", napE: "⩰̸", napid: "≋̸", napos: "ŉ", natur: "♮", natural: "♮", ncap: "⩃", ncaron: "ň", ncedil: "ņ", ncongdot: "⩭̸", ncup: "⩂", ncy: "н", ndash: "–", neArr: "⇗", nearhk: "⤤", nedot: "≐̸", nesear: "⤨", toea: "⤨", nfr: "𝔫", nharr: "↮", nleftrightarrow: "↮", nhpar: "⫲", nis: "⋼", nisd: "⋺", njcy: "њ", nlE: "≦̸", nleqq: "≦̸", nlarr: "↚", nleftarrow: "↚", nldr: "‥", nopf: "𝕟", not: "¬", notinE: "⋹̸", notindot: "⋵̸", notinvb: "⋷", notinvc: "⋶", notnivb: "⋾", notnivc: "⋽", nparsl: "⫽⃥", npart: "∂̸", npolint: "⨔", nrarr: "↛", nrightarrow: "↛", nrarrc: "⤳̸", nrarrw: "↝̸", nscr: "𝓃", nsub: "⊄", nsubE: "⫅̸", nsubseteqq: "⫅̸", nsup: "⊅", nsupE: "⫆̸", nsupseteqq: "⫆̸", ntilde: "ñ", nu: "ν", num: "#", numero: "№", numsp: " ", nvDash: "⊭", nvHarr: "⤄", nvap: "≍⃒", nvdash: "⊬", nvge: "≥⃒", nvgt: ">⃒", nvinfin: "⧞", nvlArr: "⤂", nvle: "≤⃒", nvlt: "<⃒", nvltrie: "⊴⃒", nvrArr: "⤃", nvrtrie: "⊵⃒", nvsim: "∼⃒", nwArr: "⇖", nwarhk: "⤣", nwnear: "⤧", oacute: "ó", ocirc: "ô", ocy: "о", odblac: "ő", odiv: "⨸", odsold: "⦼", oelig: "œ", ofcir: "⦿", ofr: "𝔬", ogon: "˛", ograve: "ò", ogt: "⧁", ohbar: "⦵", olcir: "⦾", olcross: "⦻", olt: "⧀", omacr: "ō", omega: "ω", omicron: "ο", omid: "⦶", oopf: "𝕠", opar: "⦷", operp: "⦹", or: "∨", vee: "∨", ord: "⩝", order: "ℴ", orderof: "ℴ", oscr: "ℴ", ordf: "ª", ordm: "º", origof: "⊶", oror: "⩖", orslope: "⩗", orv: "⩛", oslash: "ø", osol: "⊘", otilde: "õ", otimesas: "⨶", ouml: "ö", ovbar: "⌽", para: "¶", parsim: "⫳", parsl: "⫽", pcy: "п", percnt: "%", period: ".", permil: "‰", pertenk: "‱", pfr: "𝔭", phi: "φ", phiv: "ϕ", straightphi: "ϕ", varphi: "ϕ", phone: "☎", pi: "π", piv: "ϖ", varpi: "ϖ", planckh: "ℎ", plus: "+", plusacir: "⨣", pluscir: "⨢", plusdu: "⨥", pluse: "⩲", plussim: "⨦", plustwo: "⨧", pointint: "⨕", popf: "𝕡", pound: "£", prE: "⪳", prap: "⪷", precapprox: "⪷", precnapprox: "⪹", prnap: "⪹", precneqq: "⪵", prnE: "⪵", precnsim: "⋨", prnsim: "⋨", prime: "′", profalar: "⌮", profline: "⌒", profsurf: "⌓", prurel: "⊰", pscr: "𝓅", psi: "ψ", puncsp: " ", qfr: "𝔮", qopf: "𝕢", qprime: "⁗", qscr: "𝓆", quatint: "⨖", quest: "?", rAtail: "⤜", rHar: "⥤", race: "∽̱", racute: "ŕ", raemptyv: "⦳", rangd: "⦒", range: "⦥", raquo: "»", rarrap: "⥵", rarrbfs: "⤠", rarrc: "⤳", rarrfs: "⤞", rarrpl: "⥅", rarrsim: "⥴", rarrtl: "↣", rightarrowtail: "↣", rarrw: "↝", rightsquigarrow: "↝", ratail: "⤚", ratio: "∶", rbbrk: "❳", rbrace: "}", rcub: "}", rbrack: "]", rsqb: "]", rbrke: "⦌", rbrksld: "⦎", rbrkslu: "⦐", rcaron: "ř", rcedil: "ŗ", rcy: "р", rdca: "⤷", rdldhar: "⥩", rdsh: "↳", rect: "▭", rfisht: "⥽", rfr: "𝔯", rharul: "⥬", rho: "ρ", rhov: "ϱ", varrho: "ϱ", rightrightarrows: "⇉", rrarr: "⇉", rightthreetimes: "⋌", rthree: "⋌", ring: "˚", rlm: "‏", rmoust: "⎱", rmoustache: "⎱", rnmid: "⫮", roang: "⟭", roarr: "⇾", ropar: "⦆", ropf: "𝕣", roplus: "⨮", rotimes: "⨵", rpar: ")", rpargt: "⦔", rppolint: "⨒", rsaquo: "›", rscr: "𝓇", rtimes: "⋊", rtri: "▹", triangleright: "▹", rtriltri: "⧎", ruluhar: "⥨", rx: "℞", sacute: "ś", scE: "⪴", scap: "⪸", succapprox: "⪸", scaron: "š", scedil: "ş", scirc: "ŝ", scnE: "⪶", succneqq: "⪶", scnap: "⪺", succnapprox: "⪺", scnsim: "⋩", succnsim: "⋩", scpolint: "⨓", scy: "с", sdot: "⋅", sdote: "⩦", seArr: "⇘", sect: "§", semi: ";", seswar: "⤩", tosa: "⤩", sext: "✶", sfr: "𝔰", sharp: "♯", shchcy: "щ", shcy: "ш", shy: "­", sigma: "σ", sigmaf: "ς", sigmav: "ς", varsigma: "ς", simdot: "⩪", simg: "⪞", simgE: "⪠", siml: "⪝", simlE: "⪟", simne: "≆", simplus: "⨤", simrarr: "⥲", smashp: "⨳", smeparsl: "⧤", smile: "⌣", ssmile: "⌣", smt: "⪪", smte: "⪬", smtes: "⪬︀", softcy: "ь", sol: "/", solb: "⧄", solbar: "⌿", sopf: "𝕤", spades: "♠", spadesuit: "♠", sqcaps: "⊓︀", sqcups: "⊔︀", sscr: "𝓈", star: "☆", sub: "⊂", subset: "⊂", subE: "⫅", subseteqq: "⫅", subdot: "⪽", subedot: "⫃", submult: "⫁", subnE: "⫋", subsetneqq: "⫋", subne: "⊊", subsetneq: "⊊", subplus: "⪿", subrarr: "⥹", subsim: "⫇", subsub: "⫕", subsup: "⫓", sung: "♪", sup1: "¹", sup2: "²", sup3: "³", supE: "⫆", supseteqq: "⫆", supdot: "⪾", supdsub: "⫘", supedot: "⫄", suphsol: "⟉", suphsub: "⫗", suplarr: "⥻", supmult: "⫂", supnE: "⫌", supsetneqq: "⫌", supne: "⊋", supsetneq: "⊋", supplus: "⫀", supsim: "⫈", supsub: "⫔", supsup: "⫖", swArr: "⇙", swnwar: "⤪", szlig: "ß", target: "⌖", tau: "τ", tcaron: "ť", tcedil: "ţ", tcy: "т", telrec: "⌕", tfr: "𝔱", theta: "θ", thetasym: "ϑ", thetav: "ϑ", vartheta: "ϑ", thorn: "þ", times: "×", timesbar: "⨱", timesd: "⨰", topbot: "⌶", topcir: "⫱", topf: "𝕥", topfork: "⫚", tprime: "‴", triangle: "▵", utri: "▵", triangleq: "≜", trie: "≜", tridot: "◬", triminus: "⨺", triplus: "⨹", trisb: "⧍", tritime: "⨻", trpezium: "⏢", tscr: "𝓉", tscy: "ц", tshcy: "ћ", tstrok: "ŧ", uHar: "⥣", uacute: "ú", ubrcy: "ў", ubreve: "ŭ", ucirc: "û", ucy: "у", udblac: "ű", ufisht: "⥾", ufr: "𝔲", ugrave: "ù", uhblk: "▀", ulcorn: "⌜", ulcorner: "⌜", ulcrop: "⌏", ultri: "◸", umacr: "ū", uogon: "ų", uopf: "𝕦", upsi: "υ", upsilon: "υ", upuparrows: "⇈", uuarr: "⇈", urcorn: "⌝", urcorner: "⌝", urcrop: "⌎", uring: "ů", urtri: "◹", uscr: "𝓊", utdot: "⋰", utilde: "ũ", uuml: "ü", uwangle: "⦧", vBar: "⫨", vBarv: "⫩", vangrt: "⦜", varsubsetneq: "⊊︀", vsubne: "⊊︀", varsubsetneqq: "⫋︀", vsubnE: "⫋︀", varsupsetneq: "⊋︀", vsupne: "⊋︀", varsupsetneqq: "⫌︀", vsupnE: "⫌︀", vcy: "в", veebar: "⊻", veeeq: "≚", vellip: "⋮", vfr: "𝔳", vopf: "𝕧", vscr: "𝓋", vzigzag: "⦚", wcirc: "ŵ", wedbar: "⩟", wedgeq: "≙", weierp: "℘", wp: "℘", wfr: "𝔴", wopf: "𝕨", wscr: "𝓌", xfr: "𝔵", xi: "ξ", xnis: "⋻", xopf: "𝕩", xscr: "𝓍", yacute: "ý", yacy: "я", ycirc: "ŷ", ycy: "ы", yen: "¥", yfr: "𝔶", yicy: "ї", yopf: "𝕪", yscr: "𝓎", yucy: "ю", yuml: "ÿ", zacute: "ź", zcaron: "ž", zcy: "з", zdot: "ż", zeta: "ζ", zfr: "𝔷", zhcy: "ж", zigrarr: "⇝", zopf: "𝕫", zscr: "𝓏", zwj: "‍", zwnj: "‌" };
_e.ngsp = "";
var l2 = function(e2) {
  return e2[e2.TAG_OPEN_START = 0] = "TAG_OPEN_START", e2[e2.TAG_OPEN_END = 1] = "TAG_OPEN_END", e2[e2.TAG_OPEN_END_VOID = 2] = "TAG_OPEN_END_VOID", e2[e2.TAG_CLOSE = 3] = "TAG_CLOSE", e2[e2.INCOMPLETE_TAG_OPEN = 4] = "INCOMPLETE_TAG_OPEN", e2[e2.TEXT = 5] = "TEXT", e2[e2.ESCAPABLE_RAW_TEXT = 6] = "ESCAPABLE_RAW_TEXT", e2[e2.RAW_TEXT = 7] = "RAW_TEXT", e2[e2.INTERPOLATION = 8] = "INTERPOLATION", e2[e2.ENCODED_ENTITY = 9] = "ENCODED_ENTITY", e2[e2.COMMENT_START = 10] = "COMMENT_START", e2[e2.COMMENT_END = 11] = "COMMENT_END", e2[e2.CDATA_START = 12] = "CDATA_START", e2[e2.CDATA_END = 13] = "CDATA_END", e2[e2.ATTR_NAME = 14] = "ATTR_NAME", e2[e2.ATTR_QUOTE = 15] = "ATTR_QUOTE", e2[e2.ATTR_VALUE_TEXT = 16] = "ATTR_VALUE_TEXT", e2[e2.ATTR_VALUE_INTERPOLATION = 17] = "ATTR_VALUE_INTERPOLATION", e2[e2.DOC_TYPE_START = 18] = "DOC_TYPE_START", e2[e2.DOC_TYPE_END = 19] = "DOC_TYPE_END", e2[e2.EXPANSION_FORM_START = 20] = "EXPANSION_FORM_START", e2[e2.EXPANSION_CASE_VALUE = 21] = "EXPANSION_CASE_VALUE", e2[e2.EXPANSION_CASE_EXP_START = 22] = "EXPANSION_CASE_EXP_START", e2[e2.EXPANSION_CASE_EXP_END = 23] = "EXPANSION_CASE_EXP_END", e2[e2.EXPANSION_FORM_END = 24] = "EXPANSION_FORM_END", e2[e2.BLOCK_OPEN_START = 25] = "BLOCK_OPEN_START", e2[e2.BLOCK_OPEN_END = 26] = "BLOCK_OPEN_END", e2[e2.BLOCK_CLOSE = 27] = "BLOCK_CLOSE", e2[e2.BLOCK_PARAMETER = 28] = "BLOCK_PARAMETER", e2[e2.INCOMPLETE_BLOCK_OPEN = 29] = "INCOMPLETE_BLOCK_OPEN", e2[e2.LET_START = 30] = "LET_START", e2[e2.LET_VALUE = 31] = "LET_VALUE", e2[e2.LET_END = 32] = "LET_END", e2[e2.INCOMPLETE_LET = 33] = "INCOMPLETE_LET", e2[e2.COMPONENT_OPEN_START = 34] = "COMPONENT_OPEN_START", e2[e2.COMPONENT_OPEN_END = 35] = "COMPONENT_OPEN_END", e2[e2.COMPONENT_OPEN_END_VOID = 36] = "COMPONENT_OPEN_END_VOID", e2[e2.COMPONENT_CLOSE = 37] = "COMPONENT_CLOSE", e2[e2.INCOMPLETE_COMPONENT_OPEN = 38] = "INCOMPLETE_COMPONENT_OPEN", e2[e2.DIRECTIVE_NAME = 39] = "DIRECTIVE_NAME", e2[e2.DIRECTIVE_OPEN = 40] = "DIRECTIVE_OPEN", e2[e2.DIRECTIVE_CLOSE = 41] = "DIRECTIVE_CLOSE", e2[e2.EOF = 42] = "EOF", e2;
}({});
function it(e2) {
  return e2 >= 9 && e2 <= 32 || e2 == 160;
}
__name(it, "it");
function Ie(e2) {
  return 48 <= e2 && e2 <= 57;
}
__name(Ie, "Ie");
function Re(e2) {
  return e2 >= 97 && e2 <= 122 || e2 >= 65 && e2 <= 90;
}
__name(Re, "Re");
function ki(e2) {
  return e2 >= 97 && e2 <= 102 || e2 >= 65 && e2 <= 70 || Ie(e2);
}
__name(ki, "ki");
function Me(e2) {
  return e2 === 10 || e2 === 13;
}
__name(Me, "Me");
function dr(e2) {
  return 48 <= e2 && e2 <= 55;
}
__name(dr, "dr");
function Dt(e2) {
  return e2 === 39 || e2 === 34 || e2 === 96;
}
__name(Dt, "Dt");
var qa = class {
  static {
    __name(this, "qa");
  }
  constructor(e2, t2, r2) {
    this.tokens = e2, this.errors = t2, this.nonNormalizedIcuExpressions = r2;
  }
};
function Pi(e2, t2, r2, n2 = {}) {
  let i = new Ua(new nt(e2, t2), r2, n2);
  return i.tokenize(), new qa(Xa(i.tokens), i.errors, i.nonNormalizedIcuExpressions);
}
__name(Pi, "Pi");
var Fa = /\r\n?/g;
function Se(e2) {
  return `Unexpected character "${e2 === 0 ? "EOF" : String.fromCharCode(e2)}"`;
}
__name(Se, "Se");
function xi(e2) {
  return `Unknown entity "${e2}" - use the "&#<decimal>;" or  "&#x<hex>;" syntax`;
}
__name(xi, "xi");
function Ha(e2, t2) {
  return `Unable to parse entity "${t2}" - ${e2} character reference entities must end with ";"`;
}
__name(Ha, "Ha");
var gr = function(e2) {
  return e2.HEX = "hexadecimal", e2.DEC = "decimal", e2;
}(gr || {});
var Va = ["@if", "@else", "@for", "@switch", "@case", "@default", "@empty", "@defer", "@placeholder", "@loading", "@error"];
var st = { start: "{{", end: "}}" };
var Ua = class {
  static {
    __name(this, "Ua");
  }
  _cursor;
  _tokenizeIcu;
  _leadingTriviaCodePoints;
  _canSelfClose;
  _allowHtmComponentClosingTags;
  _currentTokenStart = null;
  _currentTokenType = null;
  _expansionCaseStack = [];
  _openDirectiveCount = 0;
  _inInterpolation = false;
  _preserveLineEndings;
  _i18nNormalizeLineEndingsInICUs;
  _fullNameStack = [];
  _tokenizeBlocks;
  _tokenizeLet;
  _selectorlessEnabled;
  tokens = [];
  errors = [];
  nonNormalizedIcuExpressions = [];
  constructor(e2, t2, r2) {
    this._getTagContentType = t2, this._tokenizeIcu = r2.tokenizeExpansionForms || false, this._leadingTriviaCodePoints = r2.leadingTriviaChars && r2.leadingTriviaChars.map((i) => i.codePointAt(0) || 0), this._canSelfClose = r2.canSelfClose || false, this._allowHtmComponentClosingTags = r2.allowHtmComponentClosingTags || false;
    let n2 = r2.range || { endPos: e2.content.length, startPos: 0, startLine: 0, startCol: 0 };
    this._cursor = r2.escapedString ? new Ka(e2, n2) : new Oi(e2, n2), this._preserveLineEndings = r2.preserveLineEndings || false, this._i18nNormalizeLineEndingsInICUs = r2.i18nNormalizeLineEndingsInICUs || false, this._tokenizeBlocks = r2.tokenizeBlocks ?? true, this._tokenizeLet = r2.tokenizeLet ?? true, this._selectorlessEnabled = r2.selectorlessEnabled ?? false;
    try {
      this._cursor.init();
    } catch (i) {
      this.handleError(i);
    }
  }
  _processCarriageReturns(e2) {
    return this._preserveLineEndings ? e2 : e2.replace(Fa, `
`);
  }
  tokenize() {
    for (; this._cursor.peek() !== 0; ) {
      let e2 = this._cursor.clone();
      try {
        if (this._attemptCharCode(60)) if (this._attemptCharCode(33)) this._attemptStr("[CDATA[") ? this._consumeCdata(e2) : this._attemptStr("--") ? this._consumeComment(e2) : this._attemptStrCaseInsensitive("doctype") ? this._consumeDocType(e2) : this._consumeBogusComment(e2);
        else if (this._attemptCharCode(47)) this._consumeTagClose(e2);
        else {
          let t2 = this._cursor.clone();
          this._attemptCharCode(63) ? (this._cursor = t2, this._consumeBogusComment(e2)) : this._consumeTagOpen(e2);
        }
        else this._tokenizeLet && this._cursor.peek() === 64 && !this._inInterpolation && this._isLetStart() ? this._consumeLetDeclaration(e2) : this._tokenizeBlocks && this._isBlockStart() ? this._consumeBlockStart(e2) : this._tokenizeBlocks && !this._inInterpolation && !this._isInExpansionCase() && !this._isInExpansionForm() && this._attemptCharCode(125) ? this._consumeBlockEnd(e2) : this._tokenizeIcu && this._tokenizeExpansionForm() || this._consumeWithInterpolation(l2.TEXT, l2.INTERPOLATION, () => this._isTextEnd(), () => this._isTagStart());
      } catch (t2) {
        this.handleError(t2);
      }
    }
    this._beginToken(l2.EOF), this._endToken([]);
  }
  _getBlockName() {
    let e2 = false, t2 = this._cursor.clone();
    return this._attemptCharCodeUntilFn((r2) => it(r2) ? !e2 : ja(r2) ? (e2 = true, false) : true), this._cursor.getChars(t2).trim();
  }
  _consumeBlockStart(e2) {
    this._requireCharCode(64), this._beginToken(l2.BLOCK_OPEN_START, e2);
    let t2 = this._endToken([this._getBlockName()]);
    if (this._cursor.peek() === 40) if (this._cursor.advance(), this._consumeBlockParameters(), this._attemptCharCodeUntilFn(v), this._attemptCharCode(41)) this._attemptCharCodeUntilFn(v);
    else {
      t2.type = l2.INCOMPLETE_BLOCK_OPEN;
      return;
    }
    if (t2.parts[0] === "default never" && this._attemptCharCode(59)) {
      this._beginToken(l2.BLOCK_OPEN_END), this._endToken([]), this._beginToken(l2.BLOCK_CLOSE), this._endToken([]);
      return;
    }
    this._attemptCharCode(123) ? (this._beginToken(l2.BLOCK_OPEN_END), this._endToken([])) : this._isBlockStart() && (t2.parts[0] === "case" || t2.parts[0] === "default") ? (this._beginToken(l2.BLOCK_OPEN_END), this._endToken([]), this._beginToken(l2.BLOCK_CLOSE), this._endToken([])) : t2.type = l2.INCOMPLETE_BLOCK_OPEN;
  }
  _consumeBlockEnd(e2) {
    this._beginToken(l2.BLOCK_CLOSE, e2), this._endToken([]);
  }
  _consumeBlockParameters() {
    for (this._attemptCharCodeUntilFn(Ai); this._cursor.peek() !== 41 && this._cursor.peek() !== 0; ) {
      this._beginToken(l2.BLOCK_PARAMETER);
      let e2 = this._cursor.clone(), t2 = null, r2 = 0;
      for (; this._cursor.peek() !== 59 && this._cursor.peek() !== 0 || t2 !== null; ) {
        let n2 = this._cursor.peek();
        if (n2 === 92) this._cursor.advance();
        else if (n2 === t2) t2 = null;
        else if (t2 === null && Dt(n2)) t2 = n2;
        else if (n2 === 40 && t2 === null) r2++;
        else if (n2 === 41 && t2 === null) {
          if (r2 === 0) break;
          r2 > 0 && r2--;
        }
        this._cursor.advance();
      }
      this._endToken([this._cursor.getChars(e2)]), this._attemptCharCodeUntilFn(Ai);
    }
  }
  _consumeLetDeclaration(e2) {
    if (this._requireStr("@let"), this._beginToken(l2.LET_START, e2), it(this._cursor.peek())) this._attemptCharCodeUntilFn(v);
    else {
      let r2 = this._endToken([this._cursor.getChars(e2)]);
      r2.type = l2.INCOMPLETE_LET;
      return;
    }
    let t2 = this._endToken([this._getLetDeclarationName()]);
    if (this._attemptCharCodeUntilFn(v), !this._attemptCharCode(61)) {
      t2.type = l2.INCOMPLETE_LET;
      return;
    }
    this._attemptCharCodeUntilFn((r2) => v(r2) && !Me(r2)), this._consumeLetDeclarationValue(), this._cursor.peek() === 59 ? (this._beginToken(l2.LET_END), this._endToken([]), this._cursor.advance()) : (t2.type = l2.INCOMPLETE_LET, t2.sourceSpan = this._cursor.getSpan(e2));
  }
  _getLetDeclarationName() {
    let e2 = this._cursor.clone(), t2 = false;
    return this._attemptCharCodeUntilFn((r2) => Re(r2) || r2 === 36 || r2 === 95 || t2 && Ie(r2) ? (t2 = true, false) : true), this._cursor.getChars(e2).trim();
  }
  _consumeLetDeclarationValue() {
    let e2 = this._cursor.clone();
    for (this._beginToken(l2.LET_VALUE, e2); this._cursor.peek() !== 0; ) {
      let t2 = this._cursor.peek();
      if (t2 === 59) break;
      Dt(t2) && (this._cursor.advance(), this._attemptCharCodeUntilFn((r2) => r2 === 92 ? (this._cursor.advance(), false) : r2 === t2)), this._cursor.advance();
    }
    this._endToken([this._cursor.getChars(e2)]);
  }
  _tokenizeExpansionForm() {
    if (this.isExpansionFormStart()) return this._consumeExpansionFormStart(), true;
    if ($a(this._cursor.peek()) && this._isInExpansionForm()) return this._consumeExpansionCaseStart(), true;
    if (this._cursor.peek() === 125) {
      if (this._isInExpansionCase()) return this._consumeExpansionCaseEnd(), true;
      if (this._isInExpansionForm()) return this._consumeExpansionFormEnd(), true;
    }
    return false;
  }
  _beginToken(e2, t2 = this._cursor.clone()) {
    this._currentTokenStart = t2, this._currentTokenType = e2;
  }
  _endToken(e2, t2) {
    if (this._currentTokenStart === null) throw new ee(this._cursor.getSpan(t2), "Programming error - attempted to end a token when there was no start to the token");
    if (this._currentTokenType === null) throw new ee(this._cursor.getSpan(this._currentTokenStart), "Programming error - attempted to end a token which has no token type");
    let r2 = { type: this._currentTokenType, parts: e2, sourceSpan: (t2 ?? this._cursor).getSpan(this._currentTokenStart, this._leadingTriviaCodePoints) };
    return this.tokens.push(r2), this._currentTokenStart = null, this._currentTokenType = null, r2;
  }
  _createError(e2, t2) {
    this._isInExpansionForm() && (e2 += ` (Do you have an unescaped "{" in your template? Use "{{ '{' }}") to escape it.)`);
    let r2 = new ee(t2, e2);
    return this._currentTokenStart = null, this._currentTokenType = null, r2;
  }
  handleError(e2) {
    if (e2 instanceof Er && (e2 = this._createError(e2.msg, this._cursor.getSpan(e2.cursor))), e2 instanceof ee) this.errors.push(e2);
    else throw e2;
  }
  _attemptCharCode(e2) {
    return this._cursor.peek() === e2 ? (this._cursor.advance(), true) : false;
  }
  _attemptCharCodeCaseInsensitive(e2) {
    return Ya(this._cursor.peek(), e2) ? (this._cursor.advance(), true) : false;
  }
  _requireCharCode(e2) {
    let t2 = this._cursor.clone();
    if (!this._attemptCharCode(e2)) throw this._createError(Se(this._cursor.peek()), this._cursor.getSpan(t2));
  }
  _attemptStr(e2) {
    let t2 = e2.length;
    if (this._cursor.charsLeft() < t2) return false;
    let r2 = this._cursor.clone();
    for (let n2 = 0; n2 < t2; n2++) if (!this._attemptCharCode(e2.charCodeAt(n2))) return this._cursor = r2, false;
    return true;
  }
  _attemptStrCaseInsensitive(e2) {
    for (let t2 = 0; t2 < e2.length; t2++) if (!this._attemptCharCodeCaseInsensitive(e2.charCodeAt(t2))) return false;
    return true;
  }
  _requireStr(e2) {
    let t2 = this._cursor.clone();
    if (!this._attemptStr(e2)) throw this._createError(Se(this._cursor.peek()), this._cursor.getSpan(t2));
  }
  _requireStrCaseInsensitive(e2) {
    let t2 = this._cursor.clone();
    if (!this._attemptStrCaseInsensitive(e2)) throw this._createError(Se(this._cursor.peek()), this._cursor.getSpan(t2));
  }
  _attemptCharCodeUntilFn(e2) {
    for (; !e2(this._cursor.peek()); ) this._cursor.advance();
  }
  _requireCharCodeUntilFn(e2, t2) {
    let r2 = this._cursor.clone();
    if (this._attemptCharCodeUntilFn(e2), this._cursor.diff(r2) < t2) throw this._createError(Se(this._cursor.peek()), this._cursor.getSpan(r2));
  }
  _attemptUntilChar(e2) {
    for (; this._cursor.peek() !== e2; ) this._cursor.advance();
  }
  _readChar() {
    let e2 = String.fromCodePoint(this._cursor.peek());
    return this._cursor.advance(), e2;
  }
  _peekStr(e2) {
    let t2 = e2.length;
    if (this._cursor.charsLeft() < t2) return false;
    let r2 = this._cursor.clone();
    for (let n2 = 0; n2 < t2; n2++) {
      if (r2.peek() !== e2.charCodeAt(n2)) return false;
      r2.advance();
    }
    return true;
  }
  _isBlockStart() {
    return this._cursor.peek() === 64 && Va.some((e2) => this._peekStr(e2));
  }
  _isLetStart() {
    return this._cursor.peek() === 64 && this._peekStr("@let");
  }
  _consumeEntity(e2) {
    this._beginToken(l2.ENCODED_ENTITY);
    let t2 = this._cursor.clone();
    if (this._cursor.advance(), this._attemptCharCode(35)) {
      let r2 = this._attemptCharCode(120) || this._attemptCharCode(88), n2 = this._cursor.clone();
      if (this._attemptCharCodeUntilFn(Ga), this._cursor.peek() != 59) {
        this._cursor.advance();
        let s2 = r2 ? gr.HEX : gr.DEC;
        throw this._createError(Ha(s2, this._cursor.getChars(t2)), this._cursor.getSpan());
      }
      let i = this._cursor.getChars(n2);
      this._cursor.advance();
      try {
        let s2 = parseInt(i, r2 ? 16 : 10);
        this._endToken([String.fromCodePoint(s2), this._cursor.getChars(t2)]);
      } catch {
        throw this._createError(xi(this._cursor.getChars(t2)), this._cursor.getSpan());
      }
    } else {
      let r2 = this._cursor.clone();
      if (this._attemptCharCodeUntilFn(za), this._cursor.peek() != 59) this._beginToken(e2, t2), this._cursor = r2, this._endToken(["&"]);
      else {
        let n2 = this._cursor.getChars(r2);
        this._cursor.advance();
        let i = _e.hasOwnProperty(n2) && _e[n2];
        if (!i) throw this._createError(xi(n2), this._cursor.getSpan(t2));
        this._endToken([i, `&${n2};`]);
      }
    }
  }
  _consumeRawText(e2, t2) {
    this._beginToken(e2 ? l2.ESCAPABLE_RAW_TEXT : l2.RAW_TEXT);
    let r2 = [];
    for (; ; ) {
      let n2 = this._cursor.clone(), i = t2();
      if (this._cursor = n2, i) break;
      e2 && this._cursor.peek() === 38 ? (this._endToken([this._processCarriageReturns(r2.join(""))]), r2.length = 0, this._consumeEntity(l2.ESCAPABLE_RAW_TEXT), this._beginToken(l2.ESCAPABLE_RAW_TEXT)) : r2.push(this._readChar());
    }
    this._endToken([this._processCarriageReturns(r2.join(""))]);
  }
  _consumeComment(e2) {
    this._beginToken(l2.COMMENT_START, e2), this._endToken([]), this._consumeRawText(false, () => this._attemptStr("-->")), this._beginToken(l2.COMMENT_END), this._requireStr("-->"), this._endToken([]);
  }
  _consumeBogusComment(e2) {
    this._beginToken(l2.COMMENT_START, e2), this._endToken([]), this._consumeRawText(false, () => this._cursor.peek() === 62), this._beginToken(l2.COMMENT_END), this._cursor.advance(), this._endToken([]);
  }
  _consumeCdata(e2) {
    this._beginToken(l2.CDATA_START, e2), this._endToken([]), this._consumeRawText(false, () => this._attemptStr("]]>")), this._beginToken(l2.CDATA_END), this._requireStr("]]>"), this._endToken([]);
  }
  _consumeDocType(e2) {
    this._beginToken(l2.DOC_TYPE_START, e2), this._endToken([]), this._consumeRawText(false, () => this._cursor.peek() === 62), this._beginToken(l2.DOC_TYPE_END), this._cursor.advance(), this._endToken([]);
  }
  _consumePrefixAndName(e2) {
    let t2 = this._cursor.clone(), r2 = "";
    for (; this._cursor.peek() !== 58 && !Wa(this._cursor.peek()); ) this._cursor.advance();
    let n2;
    this._cursor.peek() === 58 ? (r2 = this._cursor.getChars(t2), this._cursor.advance(), n2 = this._cursor.clone()) : n2 = t2, this._requireCharCodeUntilFn(e2, r2 === "" ? 0 : 1);
    let i = this._cursor.getChars(n2);
    return [r2, i];
  }
  _consumeSingleLineComment() {
    this._attemptCharCodeUntilFn((e2) => Me(e2) || e2 === 0), this._attemptCharCodeUntilFn(v);
  }
  _consumeMultiLineComment() {
    this._attemptCharCodeUntilFn((e2) => {
      if (e2 === 0) return true;
      if (e2 === 42) {
        let t2 = this._cursor.clone();
        return t2.advance(), t2.peek() === 47;
      }
      return false;
    }), this._attemptStr("*/") && this._attemptCharCodeUntilFn(v);
  }
  _consumeTagOpen(e2) {
    let t2, r2, n2, i, s2 = [];
    try {
      if (this._selectorlessEnabled && It(this._cursor.peek())) i = this._consumeComponentOpenStart(e2), [n2, r2, t2] = i.parts, r2 && (n2 += `:${r2}`), t2 && (n2 += `:${t2}`), this._attemptCharCodeUntilFn(v);
      else {
        if (!Re(this._cursor.peek())) throw this._createError(Se(this._cursor.peek()), this._cursor.getSpan(e2));
        i = this._consumeTagOpenStart(e2), r2 = i.parts[0], t2 = n2 = i.parts[1], this._attemptCharCodeUntilFn(v);
      }
      for (; ; ) {
        if (this._attemptStr("//")) {
          this._consumeSingleLineComment();
          continue;
        }
        if (this._attemptStr("/*")) {
          this._consumeMultiLineComment();
          continue;
        }
        if (Li(this._cursor.peek())) break;
        if (this._selectorlessEnabled && this._cursor.peek() === 64) {
          let o2 = this._cursor.clone(), c2 = o2.clone();
          c2.advance(), It(c2.peek()) && this._consumeDirective(o2, c2);
        } else {
          let o2 = this._consumeAttribute();
          s2.push(o2);
        }
      }
      i.type === l2.COMPONENT_OPEN_START ? this._consumeComponentOpenEnd() : this._consumeTagOpenEnd();
    } catch (o2) {
      if (o2 instanceof ee) {
        i ? i.type = i.type === l2.COMPONENT_OPEN_START ? l2.INCOMPLETE_COMPONENT_OPEN : l2.INCOMPLETE_TAG_OPEN : (this._beginToken(l2.TEXT, e2), this._endToken(["<"]));
        return;
      }
      throw o2;
    }
    if (this._canSelfClose && this.tokens[this.tokens.length - 1].type === l2.TAG_OPEN_END_VOID) return;
    let a = this._getTagContentType(t2, r2, this._fullNameStack.length > 0, s2);
    this._handleFullNameStackForTagOpen(r2, t2), a === R.RAW_TEXT ? this._consumeRawTextWithTagClose(r2, i, n2, false) : a === R.ESCAPABLE_RAW_TEXT && this._consumeRawTextWithTagClose(r2, i, n2, true);
  }
  _consumeRawTextWithTagClose(e2, t2, r2, n2) {
    this._consumeRawText(n2, () => !this._attemptCharCode(60) || !this._attemptCharCode(47) || (this._attemptCharCodeUntilFn(v), !this._attemptStrCaseInsensitive(e2 && t2.type !== l2.COMPONENT_OPEN_START ? `${e2}:${r2}` : r2)) ? false : (this._attemptCharCodeUntilFn(v), this._attemptCharCode(62))), this._beginToken(t2.type === l2.COMPONENT_OPEN_START ? l2.COMPONENT_CLOSE : l2.TAG_CLOSE), this._requireCharCodeUntilFn((i) => i === 62, 3), this._cursor.advance(), this._endToken(t2.parts), this._handleFullNameStackForTagClose(e2, r2);
  }
  _consumeTagOpenStart(e2) {
    this._beginToken(l2.TAG_OPEN_START, e2);
    let t2 = this._consumePrefixAndName(Ee);
    return this._endToken(t2);
  }
  _consumeComponentOpenStart(e2) {
    this._beginToken(l2.COMPONENT_OPEN_START, e2);
    let t2 = this._consumeComponentName();
    return this._endToken(t2);
  }
  _consumeComponentName() {
    let e2 = this._cursor.clone();
    for (; Ni(this._cursor.peek()); ) this._cursor.advance();
    let t2 = this._cursor.getChars(e2), r2 = "", n2 = "";
    return this._cursor.peek() === 58 && (this._cursor.advance(), [r2, n2] = this._consumePrefixAndName(Ee)), [t2, r2, n2];
  }
  _consumeAttribute() {
    let [e2, t2] = this._consumeAttributeName(), r2;
    return this._attemptCharCodeUntilFn(v), this._attemptCharCode(61) && (this._attemptCharCodeUntilFn(v), r2 = this._consumeAttributeValue()), this._attemptCharCodeUntilFn(v), { prefix: e2, name: t2, value: r2 };
  }
  _consumeAttributeName() {
    let e2 = this._cursor.peek();
    if (e2 === 39 || e2 === 34) throw this._createError(Se(e2), this._cursor.getSpan());
    this._beginToken(l2.ATTR_NAME);
    let t2;
    if (this._openDirectiveCount > 0) {
      let n2 = 0;
      t2 = /* @__PURE__ */ __name((i) => {
        if (this._openDirectiveCount > 0) {
          if (i === 40) n2++;
          else if (i === 41) {
            if (n2 === 0) return true;
            n2--;
          }
        }
        return Ee(i);
      }, "t");
    } else if (e2 === 91) {
      let n2 = 0;
      t2 = /* @__PURE__ */ __name((i) => (i === 91 ? n2++ : i === 93 && n2--, n2 <= 0 ? Ee(i) : Me(i)), "t");
    } else t2 = Ee;
    let r2 = this._consumePrefixAndName(t2);
    return this._endToken(r2), r2;
  }
  _consumeAttributeValue() {
    let e2;
    if (this._cursor.peek() === 39 || this._cursor.peek() === 34) {
      let t2 = this._cursor.peek();
      this._consumeQuote(t2);
      let r2 = /* @__PURE__ */ __name(() => this._cursor.peek() === t2, "r");
      e2 = this._consumeWithInterpolation(l2.ATTR_VALUE_TEXT, l2.ATTR_VALUE_INTERPOLATION, r2, r2), this._consumeQuote(t2);
    } else {
      let t2 = /* @__PURE__ */ __name(() => Ee(this._cursor.peek()), "t");
      e2 = this._consumeWithInterpolation(l2.ATTR_VALUE_TEXT, l2.ATTR_VALUE_INTERPOLATION, t2, t2);
    }
    return e2;
  }
  _consumeQuote(e2) {
    this._beginToken(l2.ATTR_QUOTE), this._requireCharCode(e2), this._endToken([String.fromCodePoint(e2)]);
  }
  _consumeTagOpenEnd() {
    let e2 = this._attemptCharCode(47) ? l2.TAG_OPEN_END_VOID : l2.TAG_OPEN_END;
    this._beginToken(e2), this._requireCharCode(62), this._endToken([]);
  }
  _consumeComponentOpenEnd() {
    let e2 = this._attemptCharCode(47) ? l2.COMPONENT_OPEN_END_VOID : l2.COMPONENT_OPEN_END;
    this._beginToken(e2), this._requireCharCode(62), this._endToken([]);
  }
  _consumeTagClose(e2) {
    if (this._selectorlessEnabled) {
      let t2 = e2.clone();
      for (; t2.peek() !== 62 && !It(t2.peek()); ) t2.advance();
      if (It(t2.peek())) {
        this._beginToken(l2.COMPONENT_CLOSE, e2);
        let r2 = this._consumeComponentName();
        this._attemptCharCodeUntilFn(v), this._requireCharCode(62), this._endToken(r2);
        return;
      }
    }
    if (this._beginToken(l2.TAG_CLOSE, e2), this._attemptCharCodeUntilFn(v), this._allowHtmComponentClosingTags && this._attemptCharCode(47)) this._attemptCharCodeUntilFn(v), this._requireCharCode(62), this._endToken([]);
    else {
      let [t2, r2] = this._consumePrefixAndName(Ee);
      this._attemptCharCodeUntilFn(v), this._requireCharCode(62), this._endToken([t2, r2]), this._handleFullNameStackForTagClose(t2, r2);
    }
  }
  _consumeExpansionFormStart() {
    this._beginToken(l2.EXPANSION_FORM_START), this._requireCharCode(123), this._endToken([]), this._expansionCaseStack.push(l2.EXPANSION_FORM_START), this._beginToken(l2.RAW_TEXT);
    let e2 = this._readUntil(44), t2 = this._processCarriageReturns(e2);
    if (this._i18nNormalizeLineEndingsInICUs) this._endToken([t2]);
    else {
      let n2 = this._endToken([e2]);
      t2 !== e2 && this.nonNormalizedIcuExpressions.push(n2);
    }
    this._requireCharCode(44), this._attemptCharCodeUntilFn(v), this._beginToken(l2.RAW_TEXT);
    let r2 = this._readUntil(44);
    this._endToken([r2]), this._requireCharCode(44), this._attemptCharCodeUntilFn(v);
  }
  _consumeExpansionCaseStart() {
    this._beginToken(l2.EXPANSION_CASE_VALUE);
    let e2 = this._readUntil(123).trim();
    this._endToken([e2]), this._attemptCharCodeUntilFn(v), this._beginToken(l2.EXPANSION_CASE_EXP_START), this._requireCharCode(123), this._endToken([]), this._attemptCharCodeUntilFn(v), this._expansionCaseStack.push(l2.EXPANSION_CASE_EXP_START);
  }
  _consumeExpansionCaseEnd() {
    this._beginToken(l2.EXPANSION_CASE_EXP_END), this._requireCharCode(125), this._endToken([]), this._attemptCharCodeUntilFn(v), this._expansionCaseStack.pop();
  }
  _consumeExpansionFormEnd() {
    this._beginToken(l2.EXPANSION_FORM_END), this._requireCharCode(125), this._endToken([]), this._expansionCaseStack.pop();
  }
  _consumeWithInterpolation(e2, t2, r2, n2) {
    this._beginToken(e2);
    let i = [];
    for (; !r2(); ) {
      let a = this._cursor.clone();
      this._attemptStr(st.start) ? (this._endToken([this._processCarriageReturns(i.join(""))], a), i.length = 0, this._consumeInterpolation(t2, a, n2), this._beginToken(e2)) : this._cursor.peek() === 38 ? (this._endToken([this._processCarriageReturns(i.join(""))]), i.length = 0, this._consumeEntity(e2), this._beginToken(e2)) : i.push(this._readChar());
    }
    this._inInterpolation = false;
    let s2 = this._processCarriageReturns(i.join(""));
    return this._endToken([s2]), s2;
  }
  _consumeInterpolation(e2, t2, r2) {
    let n2 = [];
    this._beginToken(e2, t2), n2.push(st.start);
    let i = this._cursor.clone(), s2 = null, a = false;
    for (; this._cursor.peek() !== 0 && (r2 === null || !r2()); ) {
      let o2 = this._cursor.clone();
      if (this._isTagStart()) {
        this._cursor = o2, n2.push(this._getProcessedChars(i, o2)), this._endToken(n2);
        return;
      }
      if (s2 === null) if (this._attemptStr(st.end)) {
        n2.push(this._getProcessedChars(i, o2)), n2.push(st.end), this._endToken(n2);
        return;
      } else this._attemptStr("//") && (a = true);
      let c2 = this._cursor.peek();
      this._cursor.advance(), c2 === 92 ? this._cursor.advance() : c2 === s2 ? s2 = null : !a && s2 === null && Dt(c2) && (s2 = c2);
    }
    n2.push(this._getProcessedChars(i, this._cursor)), this._endToken(n2);
  }
  _consumeDirective(e2, t2) {
    for (this._requireCharCode(64), this._cursor.advance(); Ni(this._cursor.peek()); ) this._cursor.advance();
    this._beginToken(l2.DIRECTIVE_NAME, e2);
    let r2 = this._cursor.getChars(t2);
    if (this._endToken([r2]), this._attemptCharCodeUntilFn(v), this._cursor.peek() === 40) {
      for (this._openDirectiveCount++, this._beginToken(l2.DIRECTIVE_OPEN), this._cursor.advance(), this._endToken([]), this._attemptCharCodeUntilFn(v); !Li(this._cursor.peek()) && this._cursor.peek() !== 41; ) this._consumeAttribute();
      if (this._attemptCharCodeUntilFn(v), this._openDirectiveCount--, this._cursor.peek() !== 41) {
        if (this._cursor.peek() === 62 || this._cursor.peek() === 47) return;
        throw this._createError(Se(this._cursor.peek()), this._cursor.getSpan(e2));
      }
      this._beginToken(l2.DIRECTIVE_CLOSE), this._cursor.advance(), this._endToken([]), this._attemptCharCodeUntilFn(v);
    }
  }
  _getProcessedChars(e2, t2) {
    return this._processCarriageReturns(t2.getChars(e2));
  }
  _isTextEnd() {
    return !!(this._isTagStart() || this._cursor.peek() === 0 || this._tokenizeIcu && !this._inInterpolation && (this.isExpansionFormStart() || this._cursor.peek() === 125 && this._isInExpansionCase()) || this._tokenizeBlocks && !this._inInterpolation && !this._isInExpansion() && (this._isBlockStart() || this._isLetStart() || this._cursor.peek() === 125));
  }
  _isTagStart() {
    if (this._cursor.peek() === 60) {
      let e2 = this._cursor.clone();
      e2.advance();
      let t2 = e2.peek();
      if (97 <= t2 && t2 <= 122 || 65 <= t2 && t2 <= 90 || t2 === 47 || t2 === 33) return true;
    }
    return false;
  }
  _readUntil(e2) {
    let t2 = this._cursor.clone();
    return this._attemptUntilChar(e2), this._cursor.getChars(t2);
  }
  _isInExpansion() {
    return this._isInExpansionCase() || this._isInExpansionForm();
  }
  _isInExpansionCase() {
    return this._expansionCaseStack.length > 0 && this._expansionCaseStack[this._expansionCaseStack.length - 1] === l2.EXPANSION_CASE_EXP_START;
  }
  _isInExpansionForm() {
    return this._expansionCaseStack.length > 0 && this._expansionCaseStack[this._expansionCaseStack.length - 1] === l2.EXPANSION_FORM_START;
  }
  isExpansionFormStart() {
    if (this._cursor.peek() !== 123) return false;
    let e2 = this._cursor.clone(), t2 = this._attemptStr(st.start);
    return this._cursor = e2, !t2;
  }
  _handleFullNameStackForTagOpen(e2, t2) {
    let r2 = fe(e2, t2);
    (this._fullNameStack.length === 0 || this._fullNameStack[this._fullNameStack.length - 1] === r2) && this._fullNameStack.push(r2);
  }
  _handleFullNameStackForTagClose(e2, t2) {
    let r2 = fe(e2, t2);
    this._fullNameStack.length !== 0 && this._fullNameStack[this._fullNameStack.length - 1] === r2 && this._fullNameStack.pop();
  }
};
function v(e2) {
  return !it(e2) || e2 === 0;
}
__name(v, "v");
function Ee(e2) {
  return it(e2) || e2 === 62 || e2 === 60 || e2 === 47 || e2 === 39 || e2 === 34 || e2 === 61 || e2 === 0;
}
__name(Ee, "Ee");
function Wa(e2) {
  return (e2 < 97 || 122 < e2) && (e2 < 65 || 90 < e2) && (e2 < 48 || e2 > 57);
}
__name(Wa, "Wa");
function Ga(e2) {
  return e2 === 59 || e2 === 0 || !ki(e2);
}
__name(Ga, "Ga");
function za(e2) {
  return e2 === 59 || e2 === 0 || !(Re(e2) || Ie(e2));
}
__name(za, "za");
function $a(e2) {
  return e2 !== 125;
}
__name($a, "$a");
function Ya(e2, t2) {
  return yi(e2) === yi(t2);
}
__name(Ya, "Ya");
function yi(e2) {
  return e2 >= 97 && e2 <= 122 ? e2 - 97 + 65 : e2;
}
__name(yi, "yi");
function ja(e2) {
  return Re(e2) || Ie(e2) || e2 === 95;
}
__name(ja, "ja");
function Ai(e2) {
  return e2 !== 59 && v(e2);
}
__name(Ai, "Ai");
function It(e2) {
  return e2 === 95 || e2 >= 65 && e2 <= 90;
}
__name(It, "It");
function Ni(e2) {
  return Re(e2) || Ie(e2) || e2 === 95;
}
__name(Ni, "Ni");
function Li(e2) {
  return e2 === 47 || e2 === 62 || e2 === 60 || e2 === 0;
}
__name(Li, "Li");
function Xa(e2) {
  let t2 = [], r2;
  for (let n2 = 0; n2 < e2.length; n2++) {
    let i = e2[n2];
    r2 && r2.type === l2.TEXT && i.type === l2.TEXT || r2 && r2.type === l2.ATTR_VALUE_TEXT && i.type === l2.ATTR_VALUE_TEXT ? (r2.parts[0] += i.parts[0], r2.sourceSpan.end = i.sourceSpan.end) : (r2 = i, t2.push(r2));
  }
  return t2;
}
__name(Xa, "Xa");
var Oi = class _r {
  static {
    __name(this, "_r");
  }
  state;
  file;
  input;
  end;
  constructor(t2, r2) {
    if (t2 instanceof _r) {
      this.file = t2.file, this.input = t2.input, this.end = t2.end;
      let n2 = t2.state;
      this.state = { peek: n2.peek, offset: n2.offset, line: n2.line, column: n2.column };
    } else {
      if (!r2) throw new Error("Programming error: the range argument must be provided with a file argument.");
      this.file = t2, this.input = t2.content, this.end = r2.endPos, this.state = { peek: -1, offset: r2.startPos, line: r2.startLine, column: r2.startCol };
    }
  }
  clone() {
    return new _r(this);
  }
  peek() {
    return this.state.peek;
  }
  charsLeft() {
    return this.end - this.state.offset;
  }
  diff(t2) {
    return this.state.offset - t2.state.offset;
  }
  advance() {
    this.advanceState(this.state);
  }
  init() {
    this.updatePeek(this.state);
  }
  getSpan(t2, r2) {
    t2 = t2 || this;
    let n2 = t2;
    if (r2) for (; this.diff(t2) > 0 && r2.indexOf(t2.peek()) !== -1; ) n2 === t2 && (t2 = t2.clone()), t2.advance();
    let i = this.locationFromCursor(t2);
    return new h(i, this.locationFromCursor(this), n2 !== t2 ? this.locationFromCursor(n2) : i);
  }
  getChars(t2) {
    return this.input.substring(t2.state.offset, this.state.offset);
  }
  charAt(t2) {
    return this.input.charCodeAt(t2);
  }
  advanceState(t2) {
    if (t2.offset >= this.end) throw this.state = t2, new Er('Unexpected character "EOF"', this);
    let r2 = this.charAt(t2.offset);
    r2 === 10 ? (t2.line++, t2.column = 0) : Me(r2) || t2.column++, t2.offset++, this.updatePeek(t2);
  }
  updatePeek(t2) {
    t2.peek = t2.offset >= this.end ? 0 : this.charAt(t2.offset);
  }
  locationFromCursor(t2) {
    return new De(t2.file, t2.state.offset, t2.state.line, t2.state.column);
  }
};
var Ka = class Sr extends Oi {
  static {
    __name(this, "Sr");
  }
  internalState;
  constructor(t2, r2) {
    t2 instanceof Sr ? (super(t2), this.internalState = { ...t2.internalState }) : (super(t2, r2), this.internalState = this.state);
  }
  advance() {
    this.state = this.internalState, super.advance(), this.processEscapeSequence();
  }
  init() {
    super.init(), this.processEscapeSequence();
  }
  clone() {
    return new Sr(this);
  }
  getChars(t2) {
    let r2 = t2.clone(), n2 = "";
    for (; r2.internalState.offset < this.internalState.offset; ) n2 += String.fromCodePoint(r2.peek()), r2.advance();
    return n2;
  }
  processEscapeSequence() {
    let t2 = /* @__PURE__ */ __name(() => this.internalState.peek, "t");
    if (t2() === 92) if (this.internalState = { ...this.state }, this.advanceState(this.internalState), t2() === 110) this.state.peek = 10;
    else if (t2() === 114) this.state.peek = 13;
    else if (t2() === 118) this.state.peek = 11;
    else if (t2() === 116) this.state.peek = 9;
    else if (t2() === 98) this.state.peek = 8;
    else if (t2() === 102) this.state.peek = 12;
    else if (t2() === 117) if (this.advanceState(this.internalState), t2() === 123) {
      this.advanceState(this.internalState);
      let r2 = this.clone(), n2 = 0;
      for (; t2() !== 125; ) this.advanceState(this.internalState), n2++;
      this.state.peek = this.decodeHexDigits(r2, n2);
    } else {
      let r2 = this.clone();
      this.advanceState(this.internalState), this.advanceState(this.internalState), this.advanceState(this.internalState), this.state.peek = this.decodeHexDigits(r2, 4);
    }
    else if (t2() === 120) {
      this.advanceState(this.internalState);
      let r2 = this.clone();
      this.advanceState(this.internalState), this.state.peek = this.decodeHexDigits(r2, 2);
    } else if (dr(t2())) {
      let r2 = "", n2 = 0, i = this.clone();
      for (; dr(t2()) && n2 < 3; ) i = this.clone(), r2 += String.fromCodePoint(t2()), this.advanceState(this.internalState), n2++;
      this.state.peek = parseInt(r2, 8), this.internalState = i.internalState;
    } else Me(this.internalState.peek) ? (this.advanceState(this.internalState), this.state = this.internalState) : this.state.peek = this.internalState.peek;
  }
  decodeHexDigits(t2, r2) {
    let n2 = this.input.slice(t2.internalState.offset, t2.internalState.offset + r2), i = parseInt(n2, 16);
    if (isNaN(i)) throw t2.state = t2.internalState, new Er("Invalid hexadecimal escape sequence", t2);
    return i;
  }
};
var Er = class extends Error {
  static {
    __name(this, "Er");
  }
  constructor(e2, t2) {
    super(e2), this.msg = e2, this.cursor = t2, Object.setPrototypeOf(this, new.target.prototype);
  }
};
var y = class Ri extends ee {
  static {
    __name(this, "Ri");
  }
  static create(t2, r2, n2) {
    return new Ri(t2, r2, n2);
  }
  constructor(t2, r2, n2) {
    super(r2, n2), this.elementName = t2;
  }
};
var Qa = class {
  static {
    __name(this, "Qa");
  }
  constructor(e2, t2) {
    this.rootNodes = e2, this.errors = t2;
  }
};
var Mi = class {
  static {
    __name(this, "Mi");
  }
  constructor(e2) {
    this.getTagDefinition = e2;
  }
  parse(e2, t2, r2, n2 = false, i) {
    let s2 = /* @__PURE__ */ __name((m) => (_2, ...T2) => m(_2.toLowerCase(), ...T2), "s"), a = n2 ? this.getTagDefinition : s2(this.getTagDefinition), o2 = /* @__PURE__ */ __name((m) => a(m).getContentType(), "o"), c2 = n2 ? i : s2(i), u = Pi(e2, t2, i ? (m, _2, T2, P2) => {
      let z2 = c2(m, _2, T2, P2);
      return z2 !== void 0 ? z2 : o2(m);
    } : o2, r2), p = r2 && r2.canSelfClose || false, d = r2 && r2.allowHtmComponentClosingTags || false, g = new Ja(u.tokens, a, p, d, n2);
    return g.build(), new Qa(g.rootNodes, [...u.errors, ...g.errors]);
  }
};
var Ja = class Bi {
  static {
    __name(this, "Bi");
  }
  _index = -1;
  _peek;
  _containerStack = [];
  rootNodes = [];
  errors = [];
  constructor(t2, r2, n2, i, s2) {
    this.tokens = t2, this.tagDefinitionResolver = r2, this.canSelfClose = n2, this.allowHtmComponentClosingTags = i, this.isTagNameCaseSensitive = s2, this._advance();
  }
  build() {
    for (; this._peek.type !== l2.EOF; ) this._peek.type === l2.TAG_OPEN_START || this._peek.type === l2.INCOMPLETE_TAG_OPEN ? this._consumeElementStartTag(this._advance()) : this._peek.type === l2.TAG_CLOSE ? (this._closeVoidElement(), this._consumeElementEndTag(this._advance())) : this._peek.type === l2.CDATA_START ? (this._closeVoidElement(), this._consumeCdata(this._advance())) : this._peek.type === l2.COMMENT_START ? (this._closeVoidElement(), this._consumeComment(this._advance())) : this._peek.type === l2.TEXT || this._peek.type === l2.RAW_TEXT || this._peek.type === l2.ESCAPABLE_RAW_TEXT ? (this._closeVoidElement(), this._consumeText(this._advance())) : this._peek.type === l2.EXPANSION_FORM_START ? this._consumeExpansion(this._advance()) : this._peek.type === l2.BLOCK_OPEN_START ? (this._closeVoidElement(), this._consumeBlockOpen(this._advance())) : this._peek.type === l2.BLOCK_CLOSE ? (this._closeVoidElement(), this._consumeBlockClose(this._advance())) : this._peek.type === l2.INCOMPLETE_BLOCK_OPEN ? (this._closeVoidElement(), this._consumeIncompleteBlock(this._advance())) : this._peek.type === l2.LET_START ? (this._closeVoidElement(), this._consumeLet(this._advance())) : this._peek.type === l2.DOC_TYPE_START ? this._consumeDocType(this._advance()) : this._peek.type === l2.INCOMPLETE_LET ? (this._closeVoidElement(), this._consumeIncompleteLet(this._advance())) : this._peek.type === l2.COMPONENT_OPEN_START || this._peek.type === l2.INCOMPLETE_COMPONENT_OPEN ? this._consumeComponentStartTag(this._advance()) : this._peek.type === l2.COMPONENT_CLOSE ? this._consumeComponentEndTag(this._advance()) : this._advance();
    for (let t2 of this._containerStack) t2 instanceof ge && this.errors.push(y.create(t2.name, t2.sourceSpan, `Unclosed block "${t2.name}"`));
  }
  _advance() {
    let t2 = this._peek;
    return this._index < this.tokens.length - 1 && this._index++, this._peek = this.tokens[this._index], t2;
  }
  _advanceIf(t2) {
    return this._peek.type === t2 ? this._advance() : null;
  }
  _consumeCdata(t2) {
    let r2 = this._advance(), n2 = this._getText(r2), i = this._advanceIf(l2.CDATA_END);
    this._addToParent(new Si(n2, new h(t2.sourceSpan.start, (i || r2).sourceSpan.end), [r2]));
  }
  _consumeComment(t2) {
    let r2 = this._advanceIf(l2.RAW_TEXT), n2 = this._advanceIf(l2.COMMENT_END), i = r2 != null ? r2.parts[0].trim() : null, s2 = n2 == null ? t2.sourceSpan : new h(t2.sourceSpan.start, n2.sourceSpan.end, t2.sourceSpan.fullStart);
    this._addToParent(new Ti(i, s2));
  }
  _consumeDocType(t2) {
    let r2 = this._advanceIf(l2.RAW_TEXT), n2 = this._advanceIf(l2.DOC_TYPE_END), i = r2 != null ? r2.parts[0].trim() : null, s2 = new h(t2.sourceSpan.start, (n2 || r2 || t2).sourceSpan.end);
    this._addToParent(new bi(i, s2));
  }
  _consumeExpansion(t2) {
    let r2 = this._advance(), n2 = this._advance(), i = [];
    for (; this._peek.type === l2.EXPANSION_CASE_VALUE; ) {
      let a = this._parseExpansionCase();
      if (!a) return;
      i.push(a);
    }
    if (this._peek.type !== l2.EXPANSION_FORM_END) {
      this.errors.push(y.create(null, this._peek.sourceSpan, "Invalid ICU message. Missing '}'."));
      return;
    }
    let s2 = new h(t2.sourceSpan.start, this._peek.sourceSpan.end, t2.sourceSpan.fullStart);
    this._addToParent(new Ei(r2.parts[0], n2.parts[0], i, s2, r2.sourceSpan)), this._advance();
  }
  _parseExpansionCase() {
    let t2 = this._advance();
    if (this._peek.type !== l2.EXPANSION_CASE_EXP_START) return this.errors.push(y.create(null, this._peek.sourceSpan, "Invalid ICU message. Missing '{'.")), null;
    let r2 = this._advance(), n2 = this._collectExpansionExpTokens(r2);
    if (!n2) return null;
    let i = this._advance();
    n2.push({ type: l2.EOF, parts: [], sourceSpan: i.sourceSpan });
    let s2 = new Bi(n2, this.tagDefinitionResolver, this.canSelfClose, this.allowHtmComponentClosingTags, this.isTagNameCaseSensitive);
    if (s2.build(), s2.errors.length > 0) return this.errors = this.errors.concat(s2.errors), null;
    let a = new h(t2.sourceSpan.start, i.sourceSpan.end, t2.sourceSpan.fullStart), o2 = new h(r2.sourceSpan.start, i.sourceSpan.end, r2.sourceSpan.fullStart);
    return new Ci(t2.parts[0], s2.rootNodes, a, t2.sourceSpan, o2);
  }
  _collectExpansionExpTokens(t2) {
    let r2 = [], n2 = [l2.EXPANSION_CASE_EXP_START];
    for (; ; ) {
      if ((this._peek.type === l2.EXPANSION_FORM_START || this._peek.type === l2.EXPANSION_CASE_EXP_START) && n2.push(this._peek.type), this._peek.type === l2.EXPANSION_CASE_EXP_END) if (Di(n2, l2.EXPANSION_CASE_EXP_START)) {
        if (n2.pop(), n2.length === 0) return r2;
      } else return this.errors.push(y.create(null, t2.sourceSpan, "Invalid ICU message. Missing '}'.")), null;
      if (this._peek.type === l2.EXPANSION_FORM_END) if (Di(n2, l2.EXPANSION_FORM_START)) n2.pop();
      else return this.errors.push(y.create(null, t2.sourceSpan, "Invalid ICU message. Missing '}'.")), null;
      if (this._peek.type === l2.EOF) return this.errors.push(y.create(null, t2.sourceSpan, "Invalid ICU message. Missing '}'.")), null;
      r2.push(this._advance());
    }
  }
  _getText(t2) {
    let r2 = t2.parts[0];
    if (r2.length > 0 && r2[0] == `
`) {
      var n2;
      let i = this._getClosestElementLikeParent();
      i != null && i.children.length == 0 && (!((n2 = this._getTagDefinition(i)) === null || n2 === void 0) && n2.ignoreFirstLf) && (r2 = r2.substring(1));
    }
    return r2;
  }
  _consumeText(t2) {
    let r2 = [t2], n2 = t2.sourceSpan, i = t2.parts[0];
    if (i.length > 0 && i[0] === `
`) {
      var s2;
      let a = this._getContainer();
      a != null && a.children.length === 0 && (!((s2 = this._getTagDefinition(a)) === null || s2 === void 0) && s2.ignoreFirstLf) && (i = i.substring(1), r2[0] = { type: t2.type, sourceSpan: t2.sourceSpan, parts: [i] });
    }
    for (; this._peek.type === l2.INTERPOLATION || this._peek.type === l2.TEXT || this._peek.type === l2.ENCODED_ENTITY; ) t2 = this._advance(), r2.push(t2), t2.type === l2.INTERPOLATION ? i += t2.parts.join("").replace(/&([^;]+);/g, Ii) : t2.type === l2.ENCODED_ENTITY ? i += t2.parts[0] : i += t2.parts.join("");
    if (i.length > 0) {
      let a = t2.sourceSpan;
      this._addToParent(new _i(i, new h(n2.start, a.end, n2.fullStart, n2.details), r2));
    }
  }
  _closeVoidElement() {
    var t2;
    let r2 = this._getContainer();
    r2 !== null && (!((t2 = this._getTagDefinition(r2)) === null || t2 === void 0) && t2.isVoid) && this._containerStack.pop();
  }
  _consumeElementStartTag(t2) {
    var r2;
    let n2 = [], i = [];
    this._consumeAttributesAndDirectives(n2, i);
    let s2 = this._getElementFullName(t2, this._getClosestElementLikeParent()), a = this._getTagDefinition(s2), o2 = false;
    if (this._peek.type === l2.TAG_OPEN_END_VOID) {
      this._advance(), o2 = true;
      let T2 = this._getTagDefinition(s2);
      this.canSelfClose || T2?.canSelfClose || Pe(s2) !== null || T2?.isVoid || this.errors.push(y.create(s2, t2.sourceSpan, `Only void, custom and foreign elements can be self closed "${t2.parts[1]}"`));
    } else this._peek.type === l2.TAG_OPEN_END && (this._advance(), o2 = false);
    let c2 = this._peek.sourceSpan.fullStart, u = new h(t2.sourceSpan.start, c2, t2.sourceSpan.fullStart), p = new h(t2.sourceSpan.start, c2, t2.sourceSpan.fullStart), d = new h(t2.sourceSpan.start.moveBy(1), t2.sourceSpan.end), g = new te(s2, n2, i, [], o2, u, p, void 0, d, a?.isVoid ?? false), m = this._getContainer(), _2 = m !== null && !!(!((r2 = this._getTagDefinition(m)) === null || r2 === void 0) && r2.isClosedByChild(g.name));
    this._pushContainer(g, _2), o2 ? this._popContainer(s2, te, u) : t2.type === l2.INCOMPLETE_TAG_OPEN && (this._popContainer(s2, te, null), this.errors.push(y.create(s2, u, `Opening tag "${s2}" not terminated.`)));
  }
  _consumeComponentStartTag(t2) {
    var r2;
    let n2 = t2.parts[0], i = [], s2 = [];
    this._consumeAttributesAndDirectives(i, s2);
    let a = this._getClosestElementLikeParent(), o2 = this._getComponentTagName(t2, a), c2 = this._getComponentFullName(t2, a), u = this._peek.type === l2.COMPONENT_OPEN_END_VOID;
    this._advance();
    let p = this._peek.sourceSpan.fullStart, d = new h(t2.sourceSpan.start, p, t2.sourceSpan.fullStart), g = new G(n2, o2, c2, i, s2, [], u, d, new h(t2.sourceSpan.start, p, t2.sourceSpan.fullStart), void 0), m = this._getContainer(), _2 = m !== null && g.tagName !== null && !!(!((r2 = this._getTagDefinition(m)) === null || r2 === void 0) && r2.isClosedByChild(g.tagName));
    this._pushContainer(g, _2), u ? this._popContainer(c2, G, d) : t2.type === l2.INCOMPLETE_COMPONENT_OPEN && (this._popContainer(c2, G, null), this.errors.push(y.create(c2, d, `Opening tag "${c2}" not terminated.`)));
  }
  _consumeAttributesAndDirectives(t2, r2) {
    for (; this._peek.type === l2.ATTR_NAME || this._peek.type === l2.DIRECTIVE_NAME; ) this._peek.type === l2.DIRECTIVE_NAME ? r2.push(this._consumeDirective(this._peek)) : t2.push(this._consumeAttr(this._advance()));
  }
  _consumeComponentEndTag(t2) {
    let r2 = this._getComponentFullName(t2, this._getClosestElementLikeParent());
    if (!this._popContainer(r2, G, t2.sourceSpan)) {
      let n2 = this._containerStack[this._containerStack.length - 1], i;
      n2 instanceof G && n2.componentName === t2.parts[0] ? i = `, did you mean "${n2.fullName}"?` : i = ". It may happen when the tag has already been closed by another tag.";
      let s2 = `Unexpected closing tag "${r2}"${i}`;
      this.errors.push(y.create(r2, t2.sourceSpan, s2));
    }
  }
  _getTagDefinition(t2) {
    return typeof t2 == "string" ? this.tagDefinitionResolver(t2) : t2 instanceof te ? this.tagDefinitionResolver(t2.name) : t2 instanceof G && t2.tagName !== null ? this.tagDefinitionResolver(t2.tagName) : null;
  }
  _pushContainer(t2, r2) {
    r2 && this._containerStack.pop(), this._addToParent(t2), this._containerStack.push(t2);
  }
  _consumeElementEndTag(t2) {
    var r2;
    let n2 = this.allowHtmComponentClosingTags && t2.parts.length === 0 ? null : this._getElementFullName(t2, this._getClosestElementLikeParent());
    if (n2 && (!((r2 = this._getTagDefinition(n2)) === null || r2 === void 0) && r2.isVoid)) this.errors.push(y.create(n2, t2.sourceSpan, `Void elements do not have end tags "${t2.parts[1]}"`));
    else if (!this._popContainer(n2, te, t2.sourceSpan)) {
      let i = `Unexpected closing tag "${n2}". It may happen when the tag has already been closed by another tag. For more info see https://www.w3.org/TR/html5/syntax.html#closing-elements-that-have-implied-end-tags`;
      this.errors.push(y.create(n2, t2.sourceSpan, i));
    }
  }
  _popContainer(t2, r2, n2) {
    let i = false;
    for (let a = this._containerStack.length - 1; a >= 0; a--) {
      var s2;
      let o2 = this._containerStack[a], c2 = o2 instanceof G ? o2.fullName : o2.name;
      if (Pe(c2) ? c2 === t2 : (c2 === t2 || t2 === null) && o2 instanceof r2) return o2.endSourceSpan = n2, o2.sourceSpan.end = n2 !== null ? n2.end : o2.sourceSpan.end, this._containerStack.splice(a, this._containerStack.length - a), !i;
      (o2 instanceof ge || !(!((s2 = this._getTagDefinition(o2)) === null || s2 === void 0) && s2.closedByParent)) && (i = true);
    }
    return false;
  }
  _consumeAttr(t2) {
    let r2 = fe(t2.parts[0], t2.parts[1]), n2 = t2.sourceSpan.end, i;
    this._peek.type === l2.ATTR_QUOTE && (i = this._advance());
    let s2 = "", a = [], o2, c2;
    if (this._peek.type === l2.ATTR_VALUE_TEXT) for (o2 = this._peek.sourceSpan, c2 = this._peek.sourceSpan.end; this._peek.type === l2.ATTR_VALUE_TEXT || this._peek.type === l2.ATTR_VALUE_INTERPOLATION || this._peek.type === l2.ENCODED_ENTITY; ) {
      let p = this._advance();
      a.push(p), p.type === l2.ATTR_VALUE_INTERPOLATION ? s2 += p.parts.join("").replace(/&([^;]+);/g, Ii) : p.type === l2.ENCODED_ENTITY ? s2 += p.parts[0] : s2 += p.parts.join(""), c2 = n2 = p.sourceSpan.end;
    }
    this._peek.type === l2.ATTR_QUOTE && (c2 = n2 = this._advance().sourceSpan.end);
    let u = o2 && c2 && new h(i?.sourceSpan.start ?? o2.start, c2, i?.sourceSpan.fullStart ?? o2.fullStart);
    return new vi(r2, s2, new h(t2.sourceSpan.start, n2, t2.sourceSpan.fullStart), t2.sourceSpan, u, a.length > 0 ? a : void 0, void 0);
  }
  _consumeDirective(t2) {
    let r2 = [], n2 = t2.sourceSpan.end, i = null;
    if (this._advance(), this._peek.type === l2.DIRECTIVE_OPEN) {
      for (n2 = this._peek.sourceSpan.end, this._advance(); this._peek.type === l2.ATTR_NAME; ) r2.push(this._consumeAttr(this._advance()));
      this._peek.type === l2.DIRECTIVE_CLOSE ? (i = this._peek.sourceSpan, this._advance()) : this.errors.push(y.create(null, t2.sourceSpan, "Unterminated directive definition"));
    }
    let s2 = new h(t2.sourceSpan.start, n2, t2.sourceSpan.fullStart), a = new h(s2.start, i === null ? t2.sourceSpan.end : i.end, s2.fullStart);
    return new wi(t2.parts[0], r2, a, s2, i);
  }
  _consumeBlockOpen(t2) {
    let r2 = [];
    for (; this._peek.type === l2.BLOCK_PARAMETER; ) {
      let o2 = this._advance();
      r2.push(new hr(o2.parts[0], o2.sourceSpan));
    }
    this._peek.type === l2.BLOCK_OPEN_END && this._advance();
    let n2 = this._peek.sourceSpan.fullStart, i = new h(t2.sourceSpan.start, n2, t2.sourceSpan.fullStart), s2 = new h(t2.sourceSpan.start, n2, t2.sourceSpan.fullStart), a = new ge(t2.parts[0], r2, [], i, t2.sourceSpan, s2);
    this._pushContainer(a, false);
  }
  _consumeBlockClose(t2) {
    let r2 = this._containerStack.length, n2 = this._containerStack[r2 - 1];
    if (!this._popContainer(null, ge, t2.sourceSpan)) {
      if (this._containerStack.length < r2) {
        let i = n2 instanceof G ? n2.fullName : n2.name;
        this.errors.push(y.create(null, t2.sourceSpan, `Unexpected closing block. The block may have been closed earlier. Did you forget to close the <${i}> element? If you meant to write the \`}\` character, you should use the "&#125;" HTML entity instead.`));
        return;
      }
      this.errors.push(y.create(null, t2.sourceSpan, 'Unexpected closing block. The block may have been closed earlier. If you meant to write the `}` character, you should use the "&#125;" HTML entity instead.'));
    }
  }
  _consumeIncompleteBlock(t2) {
    let r2 = [];
    for (; this._peek.type === l2.BLOCK_PARAMETER; ) {
      let o2 = this._advance();
      r2.push(new hr(o2.parts[0], o2.sourceSpan));
    }
    let n2 = this._peek.sourceSpan.fullStart, i = new h(t2.sourceSpan.start, n2, t2.sourceSpan.fullStart), s2 = new h(t2.sourceSpan.start, n2, t2.sourceSpan.fullStart), a = new ge(t2.parts[0], r2, [], i, t2.sourceSpan, s2);
    this._pushContainer(a, false), this._popContainer(null, ge, null), this.errors.push(y.create(t2.parts[0], i, `Incomplete block "${t2.parts[0]}". If you meant to write the @ character, you should use the "&#64;" HTML entity instead.`));
  }
  _consumeLet(t2) {
    let r2 = t2.parts[0], n2, i;
    if (this._peek.type !== l2.LET_VALUE) {
      this.errors.push(y.create(t2.parts[0], t2.sourceSpan, `Invalid @let declaration "${r2}". Declaration must have a value.`));
      return;
    } else n2 = this._advance();
    if (this._peek.type !== l2.LET_END) {
      this.errors.push(y.create(t2.parts[0], t2.sourceSpan, `Unterminated @let declaration "${r2}". Declaration must be terminated with a semicolon.`));
      return;
    } else i = this._advance();
    let s2 = i.sourceSpan.fullStart, a = new h(t2.sourceSpan.start, s2, t2.sourceSpan.fullStart), o2 = t2.sourceSpan.toString().lastIndexOf(r2), c2 = new h(t2.sourceSpan.start.moveBy(o2), t2.sourceSpan.end), u = new mr(r2, n2.parts[0], a, c2, n2.sourceSpan);
    this._addToParent(u);
  }
  _consumeIncompleteLet(t2) {
    let r2 = t2.parts[0] ?? "", n2 = r2 ? ` "${r2}"` : "";
    if (r2.length > 0) {
      let i = t2.sourceSpan.toString().lastIndexOf(r2), s2 = new h(t2.sourceSpan.start.moveBy(i), t2.sourceSpan.end), a = new h(t2.sourceSpan.start, t2.sourceSpan.start.moveBy(0)), o2 = new mr(r2, "", t2.sourceSpan, s2, a);
      this._addToParent(o2);
    }
    this.errors.push(y.create(t2.parts[0], t2.sourceSpan, `Incomplete @let declaration${n2}. @let declarations must be written as \`@let <name> = <value>;\``));
  }
  _getContainer() {
    return this._containerStack.length > 0 ? this._containerStack[this._containerStack.length - 1] : null;
  }
  _getClosestElementLikeParent() {
    for (let t2 = this._containerStack.length - 1; t2 > -1; t2--) {
      let r2 = this._containerStack[t2];
      if (r2 instanceof te || r2 instanceof G) return r2;
    }
    return null;
  }
  _addToParent(t2) {
    let r2 = this._getContainer();
    r2 === null ? this.rootNodes.push(t2) : r2.children.push(t2);
  }
  _getElementFullName(t2, r2) {
    return fe(this._getPrefix(t2, r2), t2.parts[1]);
  }
  _getComponentFullName(t2, r2) {
    let n2 = t2.parts[0], i = this._getComponentTagName(t2, r2);
    return i === null ? n2 : i.startsWith(":") ? n2 + i : `${n2}:${i}`;
  }
  _getComponentTagName(t2, r2) {
    let n2 = this._getPrefix(t2, r2), i = t2.parts[2];
    return !n2 && !i ? null : !n2 && i ? i : fe(n2, i || "ng-component");
  }
  _getPrefix(t2, r2) {
    var n2;
    let i, s2;
    if (t2.type === l2.COMPONENT_OPEN_START || t2.type === l2.INCOMPLETE_COMPONENT_OPEN || t2.type === l2.COMPONENT_CLOSE ? (i = t2.parts[1], s2 = t2.parts[2]) : (i = t2.parts[0], s2 = t2.parts[1]), i = i || ((n2 = this._getTagDefinition(s2)) === null || n2 === void 0 ? void 0 : n2.implicitNamespacePrefix) || "", !i && r2) {
      let a = r2 instanceof te ? r2.name : r2.tagName;
      if (a !== null) {
        let o2 = et(a)[1], c2 = this._getTagDefinition(o2);
        c2 !== null && !c2.preventNamespaceInheritance && (i = Pe(a));
      }
    }
    return i;
  }
};
function Di(e2, t2) {
  return e2.length > 0 && e2[e2.length - 1] === t2;
}
__name(Di, "Di");
function Ii(e2, t2) {
  return _e[t2] !== void 0 ? _e[t2] || e2 : /^#x[a-f0-9]+$/i.test(t2) ? String.fromCodePoint(parseInt(t2.slice(2), 16)) : /^#\d+$/.test(t2) ? String.fromCodePoint(parseInt(t2.slice(1), 10)) : e2;
}
__name(Ii, "Ii");
var qi = class extends Mi {
  static {
    __name(this, "qi");
  }
  constructor() {
    super(Oe);
  }
  parse(e2, t2, r2, n2 = false, i) {
    return super.parse(e2, t2, r2, n2, i);
  }
};
var Cr;
function Rt(e2, t2 = {}) {
  let { canSelfClose: r2 = false, allowHtmComponentClosingTags: n2 = false, isTagNameCaseSensitive: i = false, getTagContentType: s2, tokenizeAngularBlocks: a = false, tokenizeAngularLetDeclaration: o2 = false, enableAngularSelectorlessSyntax: c2 = false } = t2;
  return Cr ?? (Cr = new qi()), Cr.parse(e2, "angular-html-parser", { tokenizeExpansionForms: a, canSelfClose: r2, allowHtmComponentClosingTags: n2, tokenizeBlocks: a, tokenizeLet: o2, selectorlessEnabled: c2 }, i, s2);
}
__name(Rt, "Rt");
var Za = [to, ro, io, ao, oo, uo, lo, co, po, so];
function eo(e2, t2) {
  for (let r2 of Za) r2(e2, t2);
  return e2;
}
__name(eo, "eo");
function to(e2) {
  e2.walk((t2) => {
    if (t2.kind === "element" && t2.tagDefinition.ignoreFirstLf && t2.children.length > 0 && t2.children[0].kind === "text" && t2.children[0].value[0] === `
`) {
      let r2 = t2.children[0];
      r2.value.length === 1 ? t2.removeChild(r2) : r2.value = r2.value.slice(1);
    }
  });
}
__name(to, "to");
function ro(e2) {
  let t2 = /* @__PURE__ */ __name((r2) => r2.kind === "element" && r2.prev?.kind === "ieConditionalStartComment" && r2.prev.sourceSpan.end.offset === r2.startSourceSpan.start.offset && r2.firstChild?.kind === "ieConditionalEndComment" && r2.firstChild.sourceSpan.start.offset === r2.startSourceSpan.end.offset, "t");
  e2.walk((r2) => {
    if (r2.children) for (let n2 = 0; n2 < r2.children.length; n2++) {
      let i = r2.children[n2];
      if (!t2(i)) continue;
      let s2 = i.prev, a = i.firstChild;
      r2.removeChild(s2), n2--;
      let o2 = new h(s2.sourceSpan.start, a.sourceSpan.end), c2 = new h(o2.start, i.sourceSpan.end);
      i.condition = s2.condition, i.sourceSpan = c2, i.startSourceSpan = o2, i.removeChild(a);
    }
  });
}
__name(ro, "ro");
function no(e2, t2, r2) {
  e2.walk((n2) => {
    if (n2.children) for (let i = 0; i < n2.children.length; i++) {
      let s2 = n2.children[i];
      if (s2.kind !== "text" && !t2(s2)) continue;
      s2.kind !== "text" && (s2.kind = "text", s2.value = r2(s2));
      let a = s2.prev;
      !a || a.kind !== "text" || (a.value += s2.value, a.sourceSpan = new h(a.sourceSpan.start, s2.sourceSpan.end), n2.removeChild(s2), i--);
    }
  });
}
__name(no, "no");
function io(e2) {
  return no(e2, (t2) => t2.kind === "cdata", (t2) => `<![CDATA[${t2.value}]]>`);
}
__name(io, "io");
function so(e2) {
  let t2 = /* @__PURE__ */ __name((r2) => r2.kind === "element" && r2.attrs.length === 0 && r2.children.length === 1 && r2.firstChild.kind === "text" && !N.hasWhitespaceCharacter(r2.children[0].value) && !r2.firstChild.hasLeadingSpaces && !r2.firstChild.hasTrailingSpaces && r2.isLeadingSpaceSensitive && !r2.hasLeadingSpaces && r2.isTrailingSpaceSensitive && !r2.hasTrailingSpaces && r2.prev?.kind === "text" && r2.next?.kind === "text", "t");
  e2.walk((r2) => {
    if (r2.children) for (let n2 = 0; n2 < r2.children.length; n2++) {
      let i = r2.children[n2];
      if (!t2(i)) continue;
      let s2 = i.prev, a = i.next;
      s2.value += `<${i.rawName}>` + i.firstChild.value + `</${i.rawName}>` + a.value, s2.sourceSpan = new h(s2.sourceSpan.start, a.sourceSpan.end), s2.isTrailingSpaceSensitive = a.isTrailingSpaceSensitive, s2.hasTrailingSpaces = a.hasTrailingSpaces, r2.removeChild(i), n2--, r2.removeChild(a);
    }
  });
}
__name(so, "so");
function ao(e2, t2) {
  if (t2.parser === "html") return;
  let r2 = /\{\{(.+?)\}\}/su;
  e2.walk((n2) => {
    if (nn(n2, t2)) for (let i of n2.children) {
      if (i.kind !== "text") continue;
      let s2 = i.sourceSpan.start, a = null, o2 = i.value.split(r2);
      for (let c2 = 0; c2 < o2.length; c2++, s2 = a) {
        let u = o2[c2];
        if (c2 % 2 === 0) {
          a = s2.moveBy(u.length), u.length > 0 && n2.insertChildBefore(i, { kind: "text", value: u, sourceSpan: new h(s2, a) });
          continue;
        }
        a = s2.moveBy(u.length + 4), n2.insertChildBefore(i, { kind: "interpolation", sourceSpan: new h(s2, a), children: u.length === 0 ? [] : [{ kind: "text", value: u, sourceSpan: new h(s2.moveBy(2), a.moveBy(-2)) }] });
      }
      n2.removeChild(i);
    }
  });
}
__name(ao, "ao");
function oo(e2, t2) {
  e2.walk((r2) => {
    let n2 = r2.$children;
    if (!n2) return;
    if (n2.length === 0 || n2.length === 1 && n2[0].kind === "text" && N.trim(n2[0].value).length === 0) {
      r2.hasDanglingSpaces = n2.length > 0, r2.$children = [];
      return;
    }
    let i = sn(r2, t2), s2 = Zt(r2);
    if (!i) for (let a = 0; a < n2.length; a++) {
      let o2 = n2[a];
      if (o2.kind !== "text") continue;
      let { leadingWhitespace: c2, text: u, trailingWhitespace: p } = rn(o2.value), d = o2.prev, g = o2.next;
      u ? (o2.value = u, o2.sourceSpan = new h(o2.sourceSpan.start.moveBy(c2.length), o2.sourceSpan.end.moveBy(-p.length)), c2 && (d && (d.hasTrailingSpaces = true), o2.hasLeadingSpaces = true), p && (o2.hasTrailingSpaces = true, g && (g.hasLeadingSpaces = true))) : (r2.removeChild(o2), a--, (c2 || p) && (d && (d.hasTrailingSpaces = true), g && (g.hasLeadingSpaces = true)));
    }
    r2.isWhitespaceSensitive = i, r2.isIndentationSensitive = s2;
  });
}
__name(oo, "oo");
function lo(e2) {
  e2.walk((t2) => {
    t2.isSelfClosing = !t2.children || t2.kind === "element" && (t2.tagDefinition.isVoid || t2.endSourceSpan && t2.startSourceSpan.start === t2.endSourceSpan.start && t2.startSourceSpan.end === t2.endSourceSpan.end);
  });
}
__name(lo, "lo");
function co(e2, t2) {
  e2.walk((r2) => {
    r2.kind === "element" && (r2.hasHtmComponentClosingTag = r2.endSourceSpan && /^<\s*\/\s*\/\s*>$/u.test(t2.originalText.slice(r2.endSourceSpan.start.offset, r2.endSourceSpan.end.offset)));
  });
}
__name(co, "co");
function uo(e2, t2) {
  e2.walk((r2) => {
    r2.cssDisplay = dn(r2, t2);
  });
}
__name(uo, "uo");
function po(e2, t2) {
  e2.walk((r2) => {
    let { children: n2 } = r2;
    if (n2) {
      if (n2.length === 0) {
        r2.isDanglingSpaceSensitive = ln(r2, t2);
        return;
      }
      for (let i of n2) i.isLeadingSpaceSensitive = an(i, t2), i.isTrailingSpaceSensitive = on(i, t2);
      for (let i = 0; i < n2.length; i++) {
        let s2 = n2[i];
        s2.isLeadingSpaceSensitive = (i === 0 || s2.prev.isTrailingSpaceSensitive) && s2.isLeadingSpaceSensitive, s2.isTrailingSpaceSensitive = (i === n2.length - 1 || s2.next.isLeadingSpaceSensitive) && s2.isTrailingSpaceSensitive;
      }
    }
  });
}
__name(po, "po");
var Fi = eo;
function ho(e2, t2, r2) {
  let { node: n2 } = e2;
  switch (n2.kind) {
    case "root":
      return t2.__onHtmlRoot && t2.__onHtmlRoot(n2), [E(Le(e2, t2, r2)), C];
    case "element":
    case "ieConditionalComment":
      return ci(e2, t2, r2);
    case "angularControlFlowBlock":
      return ii(e2, t2, r2);
    case "angularControlFlowBlockParameters":
      return ai(e2, t2, r2);
    case "angularControlFlowBlockParameter":
      return N.trim(n2.expression);
    case "angularLetDeclaration":
      return E(["@let ", E([n2.id, " =", E(A([S, r2("init")]))]), ";"]);
    case "angularLetDeclarationInitializer":
      return n2.value;
    case "angularIcuExpression":
      return oi(e2, t2, r2);
    case "angularIcuCase":
      return li(e2, t2, r2);
    case "ieConditionalStartComment":
    case "ieConditionalEndComment":
      return [me(n2), ce(n2)];
    case "interpolation":
      return [me(n2, t2), ...e2.map(r2, "children"), ce(n2, t2)];
    case "text": {
      if (n2.parent.kind === "interpolation") {
        let o2 = /\n[^\S\n]*$/u, c2 = o2.test(n2.value), u = c2 ? n2.value.replace(o2, "") : n2.value;
        return [L(u), c2 ? C : ""];
      }
      let i = H(n2, t2), s2 = bt(n2), a = F(n2, t2);
      return s2[0] = [i, s2[0]], s2.push([s2.pop(), a]), gt(s2);
    }
    case "docType":
      return [E([me(n2, t2), " ", w(0, n2.value.replace(/^html\b/iu, "html"), /\s+/gu, " ")]), ce(n2, t2)];
    case "comment":
      return [H(n2, t2), L(t2.originalText.slice(K(n2), J(n2))), F(n2, t2)];
    case "attribute": {
      if (n2.value === null) return n2.rawName;
      let i = rr(n2.value), s2 = kt(n2, t2) ? "" : Ur(i, '"');
      return [n2.rawName, "=", s2, L(s2 === '"' ? w(0, i, '"', "&quot;") : w(0, i, "'", "&apos;")), s2];
    }
    case "frontMatter":
    case "cdata":
    default:
      throw new Gr(n2, "HTML");
  }
}
__name(ho, "ho");
var mo = { features: { experimental_frontMatterSupport: { massageAstNode: true, embed: true, print: true } }, preprocess: Fi, print: ho, insertPragma: ti, massageAstNode: $r, embed: $n, getVisitorKeys: Xn };
var Hi = mo;
var Vi = [{ name: "Angular", type: "markup", aceMode: "html", extensions: [".component.html"], tmScope: "text.html.basic", aliases: ["xhtml"], codemirrorMode: "htmlmixed", codemirrorMimeType: "text/html", parsers: ["angular"], vscodeLanguageIds: ["html"], filenames: [], linguistLanguageId: 146 }, { name: "HTML", type: "markup", aceMode: "html", extensions: [".html", ".hta", ".htm", ".html.hl", ".inc", ".xht", ".xhtml"], tmScope: "text.html.basic", aliases: ["xhtml"], codemirrorMode: "htmlmixed", codemirrorMimeType: "text/html", parsers: ["html"], vscodeLanguageIds: ["html"], linguistLanguageId: 146 }, { name: "Lightning Web Components", type: "markup", aceMode: "html", extensions: [], tmScope: "text.html.basic", aliases: ["xhtml"], codemirrorMode: "htmlmixed", codemirrorMimeType: "text/html", parsers: ["lwc"], vscodeLanguageIds: ["html"], filenames: [], linguistLanguageId: 146 }, { name: "MJML", type: "markup", aceMode: "html", extensions: [".mjml"], tmScope: "text.mjml.basic", aliases: ["MJML", "mjml"], codemirrorMode: "htmlmixed", codemirrorMimeType: "text/html", parsers: ["mjml"], filenames: [], vscodeLanguageIds: ["mjml"], linguistLanguageId: 146 }, { name: "Vue", type: "markup", aceMode: "vue", extensions: [".vue"], tmScope: "source.vue", codemirrorMode: "vue", codemirrorMimeType: "text/x-vue", parsers: ["vue"], vscodeLanguageIds: ["vue"], linguistLanguageId: 391 }];
var vr = { bracketSpacing: { category: "Common", type: "boolean", default: true, description: "Print spaces between brackets.", oppositeDescription: "Do not print spaces between brackets." }, objectWrap: { category: "Common", type: "choice", default: "preserve", description: "How to wrap object literals.", choices: [{ value: "preserve", description: "Keep as multi-line, if there is a newline between the opening brace and first property." }, { value: "collapse", description: "Fit to a single line when possible." }] }, singleQuote: { category: "Common", type: "boolean", default: false, description: "Use single quotes instead of double quotes." }, proseWrap: { category: "Common", type: "choice", default: "preserve", description: "How to wrap prose.", choices: [{ value: "always", description: "Wrap prose if it exceeds the print width." }, { value: "never", description: "Do not wrap prose." }, { value: "preserve", description: "Wrap prose as-is." }] }, bracketSameLine: { category: "Common", type: "boolean", default: false, description: "Put > of opening tags on the last line instead of on a new line." }, singleAttributePerLine: { category: "Common", type: "boolean", default: false, description: "Enforce single attribute per line in HTML, Vue and JSX." } };
var Ui = "HTML";
var fo = { bracketSameLine: vr.bracketSameLine, htmlWhitespaceSensitivity: { category: Ui, type: "choice", default: "css", description: "How to handle whitespaces in HTML.", choices: [{ value: "css", description: "Respect the default value of CSS display property." }, { value: "strict", description: "Whitespaces are considered sensitive." }, { value: "ignore", description: "Whitespaces are considered insensitive." }] }, singleAttributePerLine: vr.singleAttributePerLine, vueIndentScriptAndStyle: { category: Ui, type: "boolean", default: false, description: "Indent script and style tags in Vue files." } };
var Wi = fo;
var Nr = {};
Or(Nr, { angular: /* @__PURE__ */ __name(() => Ro, "angular"), html: /* @__PURE__ */ __name(() => Oo, "html"), lwc: /* @__PURE__ */ __name(() => Bo, "lwc"), mjml: /* @__PURE__ */ __name(() => Io, "mjml"), vue: /* @__PURE__ */ __name(() => Mo, "vue") });
function go(e2, t2) {
  let r2 = new SyntaxError(e2 + " (" + t2.loc.start.line + ":" + t2.loc.start.column + ")");
  return Object.assign(r2, t2);
}
__name(go, "go");
var Gi = go;
var _o = { canSelfClose: true, normalizeTagName: false, normalizeAttributeName: false, allowHtmComponentClosingTags: false, isTagNameCaseSensitive: false, shouldParseFrontMatter: true };
function Mt(e2) {
  return { ..._o, ...e2 };
}
__name(Mt, "Mt");
function Tr(e2) {
  let { canSelfClose: t2, allowHtmComponentClosingTags: r2, isTagNameCaseSensitive: n2, shouldParseAsRawText: i, tokenizeAngularBlocks: s2, tokenizeAngularLetDeclaration: a } = e2;
  return { canSelfClose: t2, allowHtmComponentClosingTags: r2, isTagNameCaseSensitive: n2, getTagContentType: i ? (...o2) => i(...o2) ? R.RAW_TEXT : void 0 : void 0, tokenizeAngularBlocks: s2, tokenizeAngularLetDeclaration: a };
}
__name(Tr, "Tr");
var Bt = /* @__PURE__ */ new Map([["*", /* @__PURE__ */ new Set(["accesskey", "autocapitalize", "autocorrect", "autofocus", "class", "contenteditable", "dir", "draggable", "enterkeyhint", "exportparts", "hidden", "id", "inert", "inputmode", "is", "itemid", "itemprop", "itemref", "itemscope", "itemtype", "lang", "nonce", "part", "popover", "slot", "spellcheck", "style", "tabindex", "title", "translate", "writingsuggestions"])], ["a", /* @__PURE__ */ new Set(["charset", "coords", "download", "href", "hreflang", "name", "ping", "referrerpolicy", "rel", "rev", "shape", "target", "type"])], ["applet", /* @__PURE__ */ new Set(["align", "alt", "archive", "code", "codebase", "height", "hspace", "name", "object", "vspace", "width"])], ["area", /* @__PURE__ */ new Set(["alt", "coords", "download", "href", "hreflang", "nohref", "ping", "referrerpolicy", "rel", "shape", "target", "type"])], ["audio", /* @__PURE__ */ new Set(["autoplay", "controls", "crossorigin", "loop", "muted", "preload", "src"])], ["base", /* @__PURE__ */ new Set(["href", "target"])], ["basefont", /* @__PURE__ */ new Set(["color", "face", "size"])], ["blockquote", /* @__PURE__ */ new Set(["cite"])], ["body", /* @__PURE__ */ new Set(["alink", "background", "bgcolor", "link", "text", "vlink"])], ["br", /* @__PURE__ */ new Set(["clear"])], ["button", /* @__PURE__ */ new Set(["command", "commandfor", "disabled", "form", "formaction", "formenctype", "formmethod", "formnovalidate", "formtarget", "name", "popovertarget", "popovertargetaction", "type", "value"])], ["canvas", /* @__PURE__ */ new Set(["height", "width"])], ["caption", /* @__PURE__ */ new Set(["align"])], ["col", /* @__PURE__ */ new Set(["align", "char", "charoff", "span", "valign", "width"])], ["colgroup", /* @__PURE__ */ new Set(["align", "char", "charoff", "span", "valign", "width"])], ["data", /* @__PURE__ */ new Set(["value"])], ["del", /* @__PURE__ */ new Set(["cite", "datetime"])], ["details", /* @__PURE__ */ new Set(["name", "open"])], ["dialog", /* @__PURE__ */ new Set(["closedby", "open"])], ["dir", /* @__PURE__ */ new Set(["compact"])], ["div", /* @__PURE__ */ new Set(["align"])], ["dl", /* @__PURE__ */ new Set(["compact"])], ["embed", /* @__PURE__ */ new Set(["height", "src", "type", "width"])], ["fieldset", /* @__PURE__ */ new Set(["disabled", "form", "name"])], ["font", /* @__PURE__ */ new Set(["color", "face", "size"])], ["form", /* @__PURE__ */ new Set(["accept", "accept-charset", "action", "autocomplete", "enctype", "method", "name", "novalidate", "target"])], ["frame", /* @__PURE__ */ new Set(["frameborder", "longdesc", "marginheight", "marginwidth", "name", "noresize", "scrolling", "src"])], ["frameset", /* @__PURE__ */ new Set(["cols", "rows"])], ["h1", /* @__PURE__ */ new Set(["align"])], ["h2", /* @__PURE__ */ new Set(["align"])], ["h3", /* @__PURE__ */ new Set(["align"])], ["h4", /* @__PURE__ */ new Set(["align"])], ["h5", /* @__PURE__ */ new Set(["align"])], ["h6", /* @__PURE__ */ new Set(["align"])], ["head", /* @__PURE__ */ new Set(["profile"])], ["hr", /* @__PURE__ */ new Set(["align", "noshade", "size", "width"])], ["html", /* @__PURE__ */ new Set(["manifest", "version"])], ["iframe", /* @__PURE__ */ new Set(["align", "allow", "allowfullscreen", "allowpaymentrequest", "allowusermedia", "frameborder", "height", "loading", "longdesc", "marginheight", "marginwidth", "name", "referrerpolicy", "sandbox", "scrolling", "src", "srcdoc", "width"])], ["img", /* @__PURE__ */ new Set(["align", "alt", "border", "crossorigin", "decoding", "fetchpriority", "height", "hspace", "ismap", "loading", "longdesc", "name", "referrerpolicy", "sizes", "src", "srcset", "usemap", "vspace", "width"])], ["input", /* @__PURE__ */ new Set(["accept", "align", "alpha", "alt", "autocomplete", "checked", "colorspace", "dirname", "disabled", "form", "formaction", "formenctype", "formmethod", "formnovalidate", "formtarget", "height", "ismap", "list", "max", "maxlength", "min", "minlength", "multiple", "name", "pattern", "placeholder", "popovertarget", "popovertargetaction", "readonly", "required", "size", "src", "step", "type", "usemap", "value", "width"])], ["ins", /* @__PURE__ */ new Set(["cite", "datetime"])], ["isindex", /* @__PURE__ */ new Set(["prompt"])], ["label", /* @__PURE__ */ new Set(["for", "form"])], ["legend", /* @__PURE__ */ new Set(["align"])], ["li", /* @__PURE__ */ new Set(["type", "value"])], ["link", /* @__PURE__ */ new Set(["as", "blocking", "charset", "color", "crossorigin", "disabled", "fetchpriority", "href", "hreflang", "imagesizes", "imagesrcset", "integrity", "media", "referrerpolicy", "rel", "rev", "sizes", "target", "type"])], ["map", /* @__PURE__ */ new Set(["name"])], ["menu", /* @__PURE__ */ new Set(["compact"])], ["meta", /* @__PURE__ */ new Set(["charset", "content", "http-equiv", "media", "name", "scheme"])], ["meter", /* @__PURE__ */ new Set(["high", "low", "max", "min", "optimum", "value"])], ["object", /* @__PURE__ */ new Set(["align", "archive", "border", "classid", "codebase", "codetype", "data", "declare", "form", "height", "hspace", "name", "standby", "type", "typemustmatch", "usemap", "vspace", "width"])], ["ol", /* @__PURE__ */ new Set(["compact", "reversed", "start", "type"])], ["optgroup", /* @__PURE__ */ new Set(["disabled", "label"])], ["option", /* @__PURE__ */ new Set(["disabled", "label", "selected", "value"])], ["output", /* @__PURE__ */ new Set(["for", "form", "name"])], ["p", /* @__PURE__ */ new Set(["align"])], ["param", /* @__PURE__ */ new Set(["name", "type", "value", "valuetype"])], ["pre", /* @__PURE__ */ new Set(["width"])], ["progress", /* @__PURE__ */ new Set(["max", "value"])], ["q", /* @__PURE__ */ new Set(["cite"])], ["script", /* @__PURE__ */ new Set(["async", "blocking", "charset", "crossorigin", "defer", "fetchpriority", "integrity", "language", "nomodule", "referrerpolicy", "src", "type"])], ["select", /* @__PURE__ */ new Set(["autocomplete", "disabled", "form", "multiple", "name", "required", "size"])], ["slot", /* @__PURE__ */ new Set(["name"])], ["source", /* @__PURE__ */ new Set(["height", "media", "sizes", "src", "srcset", "type", "width"])], ["style", /* @__PURE__ */ new Set(["blocking", "media", "type"])], ["table", /* @__PURE__ */ new Set(["align", "bgcolor", "border", "cellpadding", "cellspacing", "frame", "rules", "summary", "width"])], ["tbody", /* @__PURE__ */ new Set(["align", "char", "charoff", "valign"])], ["td", /* @__PURE__ */ new Set(["abbr", "align", "axis", "bgcolor", "char", "charoff", "colspan", "headers", "height", "nowrap", "rowspan", "scope", "valign", "width"])], ["template", /* @__PURE__ */ new Set(["shadowrootclonable", "shadowrootcustomelementregistry", "shadowrootdelegatesfocus", "shadowrootmode", "shadowrootserializable"])], ["textarea", /* @__PURE__ */ new Set(["autocomplete", "cols", "dirname", "disabled", "form", "maxlength", "minlength", "name", "placeholder", "readonly", "required", "rows", "wrap"])], ["tfoot", /* @__PURE__ */ new Set(["align", "char", "charoff", "valign"])], ["th", /* @__PURE__ */ new Set(["abbr", "align", "axis", "bgcolor", "char", "charoff", "colspan", "headers", "height", "nowrap", "rowspan", "scope", "valign", "width"])], ["thead", /* @__PURE__ */ new Set(["align", "char", "charoff", "valign"])], ["time", /* @__PURE__ */ new Set(["datetime"])], ["tr", /* @__PURE__ */ new Set(["align", "bgcolor", "char", "charoff", "valign"])], ["track", /* @__PURE__ */ new Set(["default", "kind", "label", "src", "srclang"])], ["ul", /* @__PURE__ */ new Set(["compact", "type"])], ["video", /* @__PURE__ */ new Set(["autoplay", "controls", "crossorigin", "height", "loop", "muted", "playsinline", "poster", "preload", "src", "width"])]]);
var zi = /* @__PURE__ */ new Set(["a", "abbr", "acronym", "address", "applet", "area", "article", "aside", "audio", "b", "base", "basefont", "bdi", "bdo", "bgsound", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "command", "content", "data", "datalist", "dd", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "em", "embed", "fencedframe", "fieldset", "figcaption", "figure", "font", "footer", "form", "frame", "frameset", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "iframe", "image", "img", "input", "ins", "isindex", "kbd", "keygen", "label", "legend", "li", "link", "listing", "main", "map", "mark", "marquee", "math", "menu", "menuitem", "meta", "meter", "multicol", "nav", "nextid", "nobr", "noembed", "noframes", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param", "picture", "plaintext", "pre", "progress", "q", "rb", "rbc", "rp", "rt", "rtc", "ruby", "s", "samp", "script", "search", "section", "select", "selectedcontent", "shadow", "slot", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "svg", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "tt", "u", "ul", "var", "video", "wbr", "xmp"]);
var qt = { attrs: true, children: true, cases: true, expression: true };
var $i = /* @__PURE__ */ new Set(["parent"]);
var re;
var br;
var wr;
var Be = class Be2 {
  static {
    __name(this, "Be");
  }
  constructor(t2 = {}) {
    Dr(this, re);
    Ut(this, "kind");
    Ut(this, "parent");
    for (let r2 of /* @__PURE__ */ new Set([...$i, ...Object.keys(t2)])) this.setProperty(r2, t2[r2]);
    if (ie(t2)) for (let r2 of Object.getOwnPropertySymbols(t2)) this.setProperty(r2, t2[r2]);
  }
  setProperty(t2, r2) {
    if (this[t2] !== r2) {
      if (t2 in qt && (r2 = r2.map((n2) => this.createChild(n2))), !$i.has(t2)) {
        this[t2] = r2;
        return;
      }
      Object.defineProperty(this, t2, { value: r2, enumerable: false, configurable: true });
    }
  }
  map(t2) {
    let r2;
    for (let n2 in qt) {
      let i = this[n2];
      if (i) {
        let s2 = So(i, (a) => a.map(t2));
        r2 !== i && (r2 || (r2 = new Be2({ parent: this.parent })), r2.setProperty(n2, s2));
      }
    }
    if (r2) for (let n2 in this) n2 in qt || (r2[n2] = this[n2]);
    return t2(r2 || this);
  }
  walk(t2) {
    for (let r2 in qt) {
      let n2 = this[r2];
      if (n2) for (let i = 0; i < n2.length; i++) n2[i].walk(t2);
    }
    t2(this);
  }
  createChild(t2) {
    let r2 = t2 instanceof Be2 ? t2.clone() : new Be2(t2);
    return r2.setProperty("parent", this), r2;
  }
  insertChildBefore(t2, r2) {
    let n2 = this.$children;
    n2.splice(n2.indexOf(t2), 0, this.createChild(r2));
  }
  removeChild(t2) {
    let r2 = this.$children;
    r2.splice(r2.indexOf(t2), 1);
  }
  replaceChild(t2, r2) {
    let n2 = this.$children;
    n2[n2.indexOf(t2)] = this.createChild(r2);
  }
  clone() {
    return new Be2(this);
  }
  get $children() {
    return this[Fe(this, re, br)];
  }
  set $children(t2) {
    this[Fe(this, re, br)] = t2;
  }
  get firstChild() {
    return this.$children?.[0];
  }
  get lastChild() {
    return M(1, this.$children, -1);
  }
  get prev() {
    let t2 = Fe(this, re, wr);
    return t2[t2.indexOf(this) - 1];
  }
  get next() {
    let t2 = Fe(this, re, wr);
    return t2[t2.indexOf(this) + 1];
  }
  get rawName() {
    return this.hasExplicitNamespace ? this.fullName : this.name;
  }
  get fullName() {
    return this.namespace ? this.namespace + ":" + this.name : this.name;
  }
  get attrMap() {
    return Object.fromEntries(this.attrs.map((t2) => [t2.fullName, t2.value]));
  }
};
re = /* @__PURE__ */ new WeakSet(), br = /* @__PURE__ */ __name(function() {
  return this.kind === "angularIcuCase" ? "expression" : this.kind === "angularIcuExpression" ? "cases" : "children";
}, "br"), wr = /* @__PURE__ */ __name(function() {
  return this.parent?.$children ?? [];
}, "wr");
var Ft = Be;
function So(e2, t2) {
  let r2 = e2.map(t2);
  return r2.some((n2, i) => n2 !== e2[i]) ? r2 : e2;
}
__name(So, "So");
var Eo = [{ regex: /^(?<openingTagSuffix>\[if(?<condition>[^\]]*)\]>)(?<data>.*?)<!\s*\[endif\]$/su, parse: Co }, { regex: /^\[if(?<condition>[^\]]*)\]><!$/u, parse: vo }, { regex: /^<!\s*\[endif\]$/u, parse: To }];
function Yi(e2, t2) {
  if (e2.value) for (let { regex: r2, parse: n2 } of Eo) {
    let i = e2.value.match(r2);
    if (i) return n2(e2, i, t2);
  }
  return null;
}
__name(Yi, "Yi");
function Co(e2, t2, r2) {
  let { openingTagSuffix: n2, condition: i, data: s2 } = t2.groups, a = 4 + n2.length, o2 = e2.sourceSpan.start.moveBy(a), c2 = o2.moveBy(s2.length), [u, p] = (() => {
    try {
      return [true, r2(s2, o2).children];
    } catch {
      return [false, [{ kind: "text", value: s2, sourceSpan: new h(o2, c2) }]];
    }
  })();
  return { kind: "ieConditionalComment", complete: u, children: p, condition: w(0, i.trim(), /\s+/gu, " "), sourceSpan: e2.sourceSpan, startSourceSpan: new h(e2.sourceSpan.start, o2), endSourceSpan: new h(c2, e2.sourceSpan.end) };
}
__name(Co, "Co");
function vo(e2, t2) {
  let { condition: r2 } = t2.groups;
  return { kind: "ieConditionalStartComment", condition: w(0, r2.trim(), /\s+/gu, " "), sourceSpan: e2.sourceSpan };
}
__name(vo, "vo");
function To(e2) {
  return { kind: "ieConditionalEndComment", sourceSpan: e2.sourceSpan };
}
__name(To, "To");
var kr = class extends fr {
  static {
    __name(this, "kr");
  }
  visitExpansionCase(t2, r2) {
    r2.parseOptions.name === "angular" && this.visitChildren(r2, (n2) => {
      n2(t2.expression);
    });
  }
  visit(t2, { parseOptions: r2 }) {
    xo(t2), yo(t2, r2), No(t2, r2), Ao(t2);
  }
};
function Ki(e2, t2, r2, n2) {
  Ot(new kr(), e2.children, { parseOptions: r2 }), t2 && e2.children.unshift(t2);
  let i = new Ft(e2);
  return i.walk((s2) => {
    if (s2.kind === "comment") {
      let a = Yi(s2, n2);
      a && s2.parent.replaceChild(s2, a);
    }
    bo(s2), wo(s2), ko(s2);
  }), i;
}
__name(Ki, "Ki");
function bo(e2) {
  if (e2.kind === "block") {
    if (e2.name = w(0, e2.name.toLowerCase(), /\s+/gu, " ").trim(), e2.kind = "angularControlFlowBlock", !Ne(e2.parameters)) {
      delete e2.parameters;
      return;
    }
    for (let t2 of e2.parameters) t2.kind = "angularControlFlowBlockParameter";
    e2.parameters = { kind: "angularControlFlowBlockParameters", children: e2.parameters, sourceSpan: new h(e2.parameters[0].sourceSpan.start, M(0, e2.parameters, -1).sourceSpan.end) };
  }
}
__name(bo, "bo");
function wo(e2) {
  e2.kind === "letDeclaration" && (e2.kind = "angularLetDeclaration", e2.id = e2.name, e2.init = { kind: "angularLetDeclarationInitializer", sourceSpan: new h(e2.valueSpan.start, e2.valueSpan.end), value: e2.value }, delete e2.name, delete e2.value);
}
__name(wo, "wo");
function ko(e2) {
  e2.kind === "expansion" && (e2.kind = "angularIcuExpression"), e2.kind === "expansionCase" && (e2.kind = "angularIcuCase");
}
__name(ko, "ko");
function ji(e2, t2) {
  let r2 = e2.toLowerCase();
  return t2(r2) ? r2 : e2;
}
__name(ji, "ji");
function Xi(e2) {
  let t2 = e2.name.startsWith(":") ? e2.name.slice(1).split(":")[0] : null, r2 = e2.nameSpan.toString(), n2 = t2 !== null && r2.startsWith(`${t2}:`), i = n2 ? r2.slice(t2.length + 1) : r2;
  e2.name = i, e2.namespace = t2, e2.hasExplicitNamespace = n2;
}
__name(Xi, "Xi");
function xo(e2) {
  switch (e2.kind) {
    case "element":
      Xi(e2);
      for (let t2 of e2.attrs) Xi(t2), t2.valueSpan ? (t2.value = t2.valueSpan.toString(), /["']/u.test(t2.value[0]) && (t2.value = t2.value.slice(1, -1))) : t2.value = null;
      break;
    case "comment":
      e2.value = e2.sourceSpan.toString().slice(4, -3);
      break;
    case "text":
      e2.value = e2.sourceSpan.toString();
      break;
  }
}
__name(xo, "xo");
function yo(e2, t2) {
  if (e2.kind === "element") {
    let r2 = Oe(t2.isTagNameCaseSensitive ? e2.name : e2.name.toLowerCase());
    !e2.namespace || e2.namespace === r2.implicitNamespacePrefix || se(e2) ? e2.tagDefinition = r2 : e2.tagDefinition = Oe("");
  }
}
__name(yo, "yo");
function Ao(e2) {
  e2.sourceSpan && e2.endSourceSpan && (e2.sourceSpan = new h(e2.sourceSpan.start, e2.endSourceSpan.end));
}
__name(Ao, "Ao");
function No(e2, t2) {
  if (e2.kind === "element" && (t2.normalizeTagName && (!e2.namespace || e2.namespace === e2.tagDefinition.implicitNamespacePrefix || se(e2)) && (e2.name = ji(e2.name, (r2) => zi.has(r2))), t2.normalizeAttributeName)) for (let r2 of e2.attrs) r2.namespace || (r2.name = ji(r2.name, (n2) => Bt.has(e2.name) && (Bt.get("*").has(n2) || Bt.get(e2.name).has(n2))));
}
__name(No, "No");
function yr(e2, t2) {
  let { rootNodes: r2, errors: n2 } = Rt(e2, Tr(t2));
  return n2.length > 0 && xr(n2[0]), { parseOptions: t2, rootNodes: r2 };
}
__name(yr, "yr");
function Qi(e2, t2) {
  let r2 = Tr(t2), { rootNodes: n2, errors: i } = Rt(e2, r2);
  if (n2.some((u) => u.kind === "docType" && u.value === "html" || u.kind === "element" && u.name.toLowerCase() === "html")) return yr(e2, Ht);
  let a, o2 = /* @__PURE__ */ __name(() => a ?? (a = Rt(e2, { ...r2, getTagContentType: void 0 })), "o"), c2 = /* @__PURE__ */ __name((u) => {
    let { offset: p } = u.startSourceSpan.start;
    return o2().rootNodes.find((d) => d.kind === "element" && d.startSourceSpan.start.offset === p) ?? u;
  }, "c");
  for (let [u, p] of n2.entries()) if (p.kind === "element") {
    if (p.isVoid) i = o2().errors, n2[u] = c2(p);
    else if (Lo(p)) {
      let { endSourceSpan: d, startSourceSpan: g } = p, m = o2().errors.find((_2) => _2.span.start.offset > g.start.offset && _2.span.start.offset < d.end.offset);
      m && xr(m), n2[u] = c2(p);
    }
  }
  return i.length > 0 && xr(i[0]), { parseOptions: t2, rootNodes: n2 };
}
__name(Qi, "Qi");
function Lo(e2) {
  if (e2.kind !== "element" || e2.name !== "template") return false;
  let t2 = e2.attrs.find((r2) => r2.name === "lang")?.value;
  return !t2 || t2 === "html";
}
__name(Lo, "Lo");
function xr(e2) {
  let { msg: t2, span: { start: r2, end: n2 } } = e2;
  throw Gi(t2, { loc: { start: { line: r2.line + 1, column: r2.col + 1 }, end: { line: n2.line + 1, column: n2.col + 1 } }, cause: e2 });
}
__name(xr, "xr");
function Po(e2, t2, r2, n2, i, s2) {
  let { offset: a } = n2, o2 = w(0, t2.slice(0, a), /[^\n]/gu, " ") + r2, c2 = Ar(o2, e2, { ...i, shouldParseFrontMatter: false }, s2);
  c2.sourceSpan = new h(n2, M(0, c2.children, -1).sourceSpan.end);
  let u = c2.children[0];
  return u.length === a ? c2.children.shift() : (u.sourceSpan = new h(u.sourceSpan.start.moveBy(a), u.sourceSpan.end), u.value = u.value.slice(a)), c2;
}
__name(Po, "Po");
function Ar(e2, t2, r2, n2 = {}) {
  let { frontMatter: i, content: s2 } = r2.shouldParseFrontMatter ? Xt(e2) : { content: e2 }, a = new nt(e2, n2.filepath), o2 = new De(a, 0, 0, 0), c2 = o2.moveBy(e2.length), { parseOptions: u, rootNodes: p } = t2(s2, r2), d = { kind: "root", sourceSpan: new h(o2, c2), children: p }, g;
  if (i) {
    let [_2, T2] = [i.start, i.end].map((P2) => new De(a, P2.index, P2.line - 1, P2.column));
    g = { ...i, kind: "frontMatter", sourceSpan: new h(_2, T2) };
  }
  return Ki(d, g, u, (_2, T2) => Po(t2, e2, _2, T2, u, n2));
}
__name(Ar, "Ar");
var Ht = Mt({ name: "html", normalizeTagName: true, normalizeAttributeName: true, allowHtmComponentClosingTags: true });
function at(e2) {
  let t2 = Mt(e2), r2 = t2.name === "vue" ? Qi : yr;
  return { parse: /* @__PURE__ */ __name((n2, i) => Ar(n2, r2, t2, i), "parse"), hasPragma: Zn, hasIgnorePragma: ei, astFormat: "html", locStart: K, locEnd: J };
}
__name(at, "at");
var Oo = at(Ht);
var Do = /* @__PURE__ */ new Set(["mj-style", "mj-raw"]);
var Io = at({ ...Ht, name: "mjml", shouldParseAsRawText: /* @__PURE__ */ __name((e2) => Do.has(e2), "shouldParseAsRawText") });
var Ro = at({ name: "angular", tokenizeAngularBlocks: true, tokenizeAngularLetDeclaration: true });
var Mo = at({ name: "vue", isTagNameCaseSensitive: true, shouldParseAsRawText(e2, t2, r2, n2) {
  return e2.toLowerCase() !== "html" && !r2 && (e2 !== "template" || n2.some(({ name: i, value: s2 }) => i === "lang" && s2 !== "html" && s2 !== "" && s2 !== void 0));
} });
var Bo = at({ name: "lwc", canSelfClose: false });
var qo = { html: Hi };

// node_modules/prettier/standalone.mjs
init_esm();
var Zn2 = Object.create;
var Mt2 = Object.defineProperty;
var eo2 = Object.getOwnPropertyDescriptor;
var to2 = Object.getOwnPropertyNames;
var uo2 = Object.getPrototypeOf;
var ro2 = Object.prototype.hasOwnProperty;
var no2 = /* @__PURE__ */ __name((e2, t2) => () => (t2 || e2((t2 = { exports: {} }).exports, t2), t2.exports), "no");
var Yt2 = /* @__PURE__ */ __name((e2, t2) => {
  for (var u in t2) Mt2(e2, u, { get: t2[u], enumerable: true });
}, "Yt");
var oo2 = /* @__PURE__ */ __name((e2, t2, u, r2) => {
  if (t2 && typeof t2 == "object" || typeof t2 == "function") for (let o2 of to2(t2)) !ro2.call(e2, o2) && o2 !== u && Mt2(e2, o2, { get: /* @__PURE__ */ __name(() => t2[o2], "get"), enumerable: !(r2 = eo2(t2, o2)) || r2.enumerable });
  return e2;
}, "oo");
var ao2 = /* @__PURE__ */ __name((e2, t2, u) => (u = e2 != null ? Zn2(uo2(e2)) : {}, oo2(t2 || !e2 || !e2.__esModule ? Mt2(u, "default", { value: e2, enumerable: true }) : u, e2)), "ao");
var dn2 = no2((of, ln2) => {
  var yt2, bt2, At2, _t2, xt2, $e2, bu, Ke2, Bt2, cn2, Tt2, Ve2, Nt2, St2, wt2, pe2, fn2, Ot2, Pt2, Aa2;
  Nt2 = /\/(?![*\/])(?:\[(?:[^\]\\\n\r\u2028\u2029]+|\\.)*\]|[^\/\\\n\r\u2028\u2029]+|\\.)*(\/[$_\u200C\u200D\p{ID_Continue}]*|\\)?/yu;
  Ve2 = /--|\+\+|=>|\.{3}|\??\.(?!\d)|(?:&&|\|\||\?\?|[+\-%&|^]|\*{1,2}|<{1,2}|>{1,3}|!=?|={1,2}|\/(?![\/*]))=?|[?~,:;[\](){}]/y;
  yt2 = /(\x23?)(?=[$_\p{ID_Start}\\])(?:[$_\u200C\u200D\p{ID_Continue}]+|\\u[\da-fA-F]{4}|\\u\{[\da-fA-F]+\})+/yu;
  wt2 = /(['"])(?:[^'"\\\n\r]+|(?!\1)['"]|\\(?:\r\n|[^]))*(\1)?/y;
  Tt2 = /(?:0[xX][\da-fA-F](?:_?[\da-fA-F])*|0[oO][0-7](?:_?[0-7])*|0[bB][01](?:_?[01])*)n?|0n|[1-9](?:_?\d)*n|(?:(?:0(?!\d)|0\d*[89]\d*|[1-9](?:_?\d)*)(?:\.(?:\d(?:_?\d)*)?)?|\.\d(?:_?\d)*)(?:[eE][+-]?\d(?:_?\d)*)?|0[0-7]+/y;
  pe2 = /[`}](?:[^`\\$]+|\\[^]|\$(?!\{))*(`|\$\{)?/y;
  Pt2 = /[\t\v\f\ufeff\p{Zs}]+/yu;
  Ke2 = /\r?\n|[\r\u2028\u2029]/y;
  Bt2 = /\/\*(?:[^*]+|\*(?!\/))*(\*\/)?/y;
  St2 = /\/\/.*/y;
  At2 = /[<>.:={}]|\/(?![\/*])/y;
  bt2 = /[$_\p{ID_Start}][$_\u200C\u200D\p{ID_Continue}-]*/yu;
  _t2 = /(['"])(?:[^'"]+|(?!\1)['"])*(\1)?/y;
  xt2 = /[^<>{}]+/y;
  Ot2 = /^(?:[\/+-]|\.{3}|\?(?:InterpolationIn(?:JSX|Template)|NoLineTerminatorHere|NonExpressionParenEnd|UnaryIncDec))?$|[{}([,;<>=*%&|^!~?:]$/;
  fn2 = /^(?:=>|[;\]){}]|else|\?(?:NoLineTerminatorHere|NonExpressionParenEnd))?$/;
  $e2 = /^(?:await|case|default|delete|do|else|instanceof|new|return|throw|typeof|void|yield)$/;
  bu = /^(?:return|throw|yield)$/;
  cn2 = RegExp(Ke2.source);
  ln2.exports = Aa2 = /* @__PURE__ */ __name(function* (e2, { jsx: t2 = false } = {}) {
    var u, r2, o2, n2, a, s2, i, D2, f2, l3, d, c2, p, F2;
    for ({ length: s2 } = e2, n2 = 0, a = "", F2 = [{ tag: "JS" }], u = [], d = 0, c2 = false; n2 < s2; ) {
      switch (D2 = F2[F2.length - 1], D2.tag) {
        case "JS":
        case "JSNonExpressionParen":
        case "InterpolationInTemplate":
        case "InterpolationInJSX":
          if (e2[n2] === "/" && (Ot2.test(a) || $e2.test(a)) && (Nt2.lastIndex = n2, i = Nt2.exec(e2))) {
            n2 = Nt2.lastIndex, a = i[0], c2 = true, yield { type: "RegularExpressionLiteral", value: i[0], closed: i[1] !== void 0 && i[1] !== "\\" };
            continue;
          }
          if (Ve2.lastIndex = n2, i = Ve2.exec(e2)) {
            switch (p = i[0], f2 = Ve2.lastIndex, l3 = p, p) {
              case "(":
                a === "?NonExpressionParenKeyword" && F2.push({ tag: "JSNonExpressionParen", nesting: d }), d++, c2 = false;
                break;
              case ")":
                d--, c2 = true, D2.tag === "JSNonExpressionParen" && d === D2.nesting && (F2.pop(), l3 = "?NonExpressionParenEnd", c2 = false);
                break;
              case "{":
                Ve2.lastIndex = 0, o2 = !fn2.test(a) && (Ot2.test(a) || $e2.test(a)), u.push(o2), c2 = false;
                break;
              case "}":
                switch (D2.tag) {
                  case "InterpolationInTemplate":
                    if (u.length === D2.nesting) {
                      pe2.lastIndex = n2, i = pe2.exec(e2), n2 = pe2.lastIndex, a = i[0], i[1] === "${" ? (a = "?InterpolationInTemplate", c2 = false, yield { type: "TemplateMiddle", value: i[0] }) : (F2.pop(), c2 = true, yield { type: "TemplateTail", value: i[0], closed: i[1] === "`" });
                      continue;
                    }
                    break;
                  case "InterpolationInJSX":
                    if (u.length === D2.nesting) {
                      F2.pop(), n2 += 1, a = "}", yield { type: "JSXPunctuator", value: "}" };
                      continue;
                    }
                }
                c2 = u.pop(), l3 = c2 ? "?ExpressionBraceEnd" : "}";
                break;
              case "]":
                c2 = true;
                break;
              case "++":
              case "--":
                l3 = c2 ? "?PostfixIncDec" : "?UnaryIncDec";
                break;
              case "<":
                if (t2 && (Ot2.test(a) || $e2.test(a))) {
                  F2.push({ tag: "JSXTag" }), n2 += 1, a = "<", yield { type: "JSXPunctuator", value: p };
                  continue;
                }
                c2 = false;
                break;
              default:
                c2 = false;
            }
            n2 = f2, a = l3, yield { type: "Punctuator", value: p };
            continue;
          }
          if (yt2.lastIndex = n2, i = yt2.exec(e2)) {
            switch (n2 = yt2.lastIndex, l3 = i[0], i[0]) {
              case "for":
              case "if":
              case "while":
              case "with":
                a !== "." && a !== "?." && (l3 = "?NonExpressionParenKeyword");
            }
            a = l3, c2 = !$e2.test(i[0]), yield { type: i[1] === "#" ? "PrivateIdentifier" : "IdentifierName", value: i[0] };
            continue;
          }
          if (wt2.lastIndex = n2, i = wt2.exec(e2)) {
            n2 = wt2.lastIndex, a = i[0], c2 = true, yield { type: "StringLiteral", value: i[0], closed: i[2] !== void 0 };
            continue;
          }
          if (Tt2.lastIndex = n2, i = Tt2.exec(e2)) {
            n2 = Tt2.lastIndex, a = i[0], c2 = true, yield { type: "NumericLiteral", value: i[0] };
            continue;
          }
          if (pe2.lastIndex = n2, i = pe2.exec(e2)) {
            n2 = pe2.lastIndex, a = i[0], i[1] === "${" ? (a = "?InterpolationInTemplate", F2.push({ tag: "InterpolationInTemplate", nesting: u.length }), c2 = false, yield { type: "TemplateHead", value: i[0] }) : (c2 = true, yield { type: "NoSubstitutionTemplate", value: i[0], closed: i[1] === "`" });
            continue;
          }
          break;
        case "JSXTag":
        case "JSXTagEnd":
          if (At2.lastIndex = n2, i = At2.exec(e2)) {
            switch (n2 = At2.lastIndex, l3 = i[0], i[0]) {
              case "<":
                F2.push({ tag: "JSXTag" });
                break;
              case ">":
                F2.pop(), a === "/" || D2.tag === "JSXTagEnd" ? (l3 = "?JSX", c2 = true) : F2.push({ tag: "JSXChildren" });
                break;
              case "{":
                F2.push({ tag: "InterpolationInJSX", nesting: u.length }), l3 = "?InterpolationInJSX", c2 = false;
                break;
              case "/":
                a === "<" && (F2.pop(), F2[F2.length - 1].tag === "JSXChildren" && F2.pop(), F2.push({ tag: "JSXTagEnd" }));
            }
            a = l3, yield { type: "JSXPunctuator", value: i[0] };
            continue;
          }
          if (bt2.lastIndex = n2, i = bt2.exec(e2)) {
            n2 = bt2.lastIndex, a = i[0], yield { type: "JSXIdentifier", value: i[0] };
            continue;
          }
          if (_t2.lastIndex = n2, i = _t2.exec(e2)) {
            n2 = _t2.lastIndex, a = i[0], yield { type: "JSXString", value: i[0], closed: i[2] !== void 0 };
            continue;
          }
          break;
        case "JSXChildren":
          if (xt2.lastIndex = n2, i = xt2.exec(e2)) {
            n2 = xt2.lastIndex, a = i[0], yield { type: "JSXText", value: i[0] };
            continue;
          }
          switch (e2[n2]) {
            case "<":
              F2.push({ tag: "JSXTag" }), n2++, a = "<", yield { type: "JSXPunctuator", value: "<" };
              continue;
            case "{":
              F2.push({ tag: "InterpolationInJSX", nesting: u.length }), n2++, a = "?InterpolationInJSX", c2 = false, yield { type: "JSXPunctuator", value: "{" };
              continue;
          }
      }
      if (Pt2.lastIndex = n2, i = Pt2.exec(e2)) {
        n2 = Pt2.lastIndex, yield { type: "WhiteSpace", value: i[0] };
        continue;
      }
      if (Ke2.lastIndex = n2, i = Ke2.exec(e2)) {
        n2 = Ke2.lastIndex, c2 = false, bu.test(a) && (a = "?NoLineTerminatorHere"), yield { type: "LineTerminatorSequence", value: i[0] };
        continue;
      }
      if (Bt2.lastIndex = n2, i = Bt2.exec(e2)) {
        n2 = Bt2.lastIndex, cn2.test(i[0]) && (c2 = false, bu.test(a) && (a = "?NoLineTerminatorHere")), yield { type: "MultiLineComment", value: i[0], closed: i[1] !== void 0 };
        continue;
      }
      if (St2.lastIndex = n2, i = St2.exec(e2)) {
        n2 = St2.lastIndex, c2 = false, yield { type: "SingleLineComment", value: i[0] };
        continue;
      }
      r2 = String.fromCodePoint(e2.codePointAt(n2)), n2 += r2.length, a = r2, c2 = false, yield { type: D2.tag.startsWith("JSX") ? "JSXInvalid" : "Invalid", value: r2 };
    }
  }, "Aa");
});
var Hn2 = {};
Yt2(Hn2, { __debug: /* @__PURE__ */ __name(() => li2, "__debug"), check: /* @__PURE__ */ __name(() => ci2, "check"), doc: /* @__PURE__ */ __name(() => wu, "doc"), format: /* @__PURE__ */ __name(() => Jn2, "format"), formatWithCursor: /* @__PURE__ */ __name(() => zn2, "formatWithCursor"), getSupportInfo: /* @__PURE__ */ __name(() => fi2, "getSupportInfo"), util: /* @__PURE__ */ __name(() => Pu, "util"), version: /* @__PURE__ */ __name(() => Mn2, "version") });
var X2 = /* @__PURE__ */ __name((e2, t2) => (u, r2, ...o2) => u | 1 && r2 == null ? void 0 : (t2.call(r2) ?? r2[e2]).apply(r2, o2), "X");
var io2 = String.prototype.replaceAll ?? function(e2, t2) {
  return e2.global ? this.replace(e2, t2) : this.split(e2).join(t2);
};
var so2 = X2("replaceAll", function() {
  if (typeof this == "string") return io2;
});
var oe2 = so2;
var Ne2 = class {
  static {
    __name(this, "Ne");
  }
  diff(t2, u, r2 = {}) {
    let o2;
    typeof r2 == "function" ? (o2 = r2, r2 = {}) : "callback" in r2 && (o2 = r2.callback);
    let n2 = this.castInput(t2, r2), a = this.castInput(u, r2), s2 = this.removeEmpty(this.tokenize(n2, r2)), i = this.removeEmpty(this.tokenize(a, r2));
    return this.diffWithOptionsObj(s2, i, r2, o2);
  }
  diffWithOptionsObj(t2, u, r2, o2) {
    var n2;
    let a = /* @__PURE__ */ __name((m) => {
      if (m = this.postProcess(m, r2), o2) {
        setTimeout(function() {
          o2(m);
        }, 0);
        return;
      } else return m;
    }, "a"), s2 = u.length, i = t2.length, D2 = 1, f2 = s2 + i;
    r2.maxEditLength != null && (f2 = Math.min(f2, r2.maxEditLength));
    let l3 = (n2 = r2.timeout) !== null && n2 !== void 0 ? n2 : 1 / 0, d = Date.now() + l3, c2 = [{ oldPos: -1, lastComponent: void 0 }], p = this.extractCommon(c2[0], u, t2, 0, r2);
    if (c2[0].oldPos + 1 >= i && p + 1 >= s2) return a(this.buildValues(c2[0].lastComponent, u, t2));
    let F2 = -1 / 0, C2 = 1 / 0, y2 = /* @__PURE__ */ __name(() => {
      for (let m = Math.max(F2, -D2); m <= Math.min(C2, D2); m += 2) {
        let h2, E2 = c2[m - 1], g = c2[m + 1];
        E2 && (c2[m - 1] = void 0);
        let A2 = false;
        if (g) {
          let Q = g.oldPos - m;
          A2 = g && 0 <= Q && Q < s2;
        }
        let J2 = E2 && E2.oldPos + 1 < i;
        if (!A2 && !J2) {
          c2[m] = void 0;
          continue;
        }
        if (!J2 || A2 && E2.oldPos < g.oldPos ? h2 = this.addToPath(g, true, false, 0, r2) : h2 = this.addToPath(E2, false, true, 1, r2), p = this.extractCommon(h2, u, t2, m, r2), h2.oldPos + 1 >= i && p + 1 >= s2) return a(this.buildValues(h2.lastComponent, u, t2)) || true;
        c2[m] = h2, h2.oldPos + 1 >= i && (C2 = Math.min(C2, m - 1)), p + 1 >= s2 && (F2 = Math.max(F2, m + 1));
      }
      D2++;
    }, "y");
    if (o2) (/* @__PURE__ */ __name(function m() {
      setTimeout(function() {
        if (D2 > f2 || Date.now() > d) return o2(void 0);
        y2() || m();
      }, 0);
    }, "m"))();
    else for (; D2 <= f2 && Date.now() <= d; ) {
      let m = y2();
      if (m) return m;
    }
  }
  addToPath(t2, u, r2, o2, n2) {
    let a = t2.lastComponent;
    return a && !n2.oneChangePerToken && a.added === u && a.removed === r2 ? { oldPos: t2.oldPos + o2, lastComponent: { count: a.count + 1, added: u, removed: r2, previousComponent: a.previousComponent } } : { oldPos: t2.oldPos + o2, lastComponent: { count: 1, added: u, removed: r2, previousComponent: a } };
  }
  extractCommon(t2, u, r2, o2, n2) {
    let a = u.length, s2 = r2.length, i = t2.oldPos, D2 = i - o2, f2 = 0;
    for (; D2 + 1 < a && i + 1 < s2 && this.equals(r2[i + 1], u[D2 + 1], n2); ) D2++, i++, f2++, n2.oneChangePerToken && (t2.lastComponent = { count: 1, previousComponent: t2.lastComponent, added: false, removed: false });
    return f2 && !n2.oneChangePerToken && (t2.lastComponent = { count: f2, previousComponent: t2.lastComponent, added: false, removed: false }), t2.oldPos = i, D2;
  }
  equals(t2, u, r2) {
    return r2.comparator ? r2.comparator(t2, u) : t2 === u || !!r2.ignoreCase && t2.toLowerCase() === u.toLowerCase();
  }
  removeEmpty(t2) {
    let u = [];
    for (let r2 = 0; r2 < t2.length; r2++) t2[r2] && u.push(t2[r2]);
    return u;
  }
  castInput(t2, u) {
    return t2;
  }
  tokenize(t2, u) {
    return Array.from(t2);
  }
  join(t2) {
    return t2.join("");
  }
  postProcess(t2, u) {
    return t2;
  }
  get useLongestToken() {
    return false;
  }
  buildValues(t2, u, r2) {
    let o2 = [], n2;
    for (; t2; ) o2.push(t2), n2 = t2.previousComponent, delete t2.previousComponent, t2 = n2;
    o2.reverse();
    let a = o2.length, s2 = 0, i = 0, D2 = 0;
    for (; s2 < a; s2++) {
      let f2 = o2[s2];
      if (f2.removed) f2.value = this.join(r2.slice(D2, D2 + f2.count)), D2 += f2.count;
      else {
        if (!f2.added && this.useLongestToken) {
          let l3 = u.slice(i, i + f2.count);
          l3 = l3.map(function(d, c2) {
            let p = r2[D2 + c2];
            return p.length > d.length ? p : d;
          }), f2.value = this.join(l3);
        } else f2.value = this.join(u.slice(i, i + f2.count));
        i += f2.count, f2.added || (D2 += f2.count);
      }
    }
    return o2;
  }
};
var jt2 = class extends Ne2 {
  static {
    __name(this, "jt");
  }
  tokenize(t2) {
    return t2.slice();
  }
  join(t2) {
    return t2;
  }
  removeEmpty(t2) {
    return t2;
  }
};
var ku = new jt2();
function Ut2(e2, t2, u) {
  return ku.diff(e2, t2, u);
}
__name(Ut2, "Ut");
var Do2 = /* @__PURE__ */ __name(() => {
}, "Do");
var P = Do2;
var Ru = "cr";
var Lu = "crlf";
var co2 = "lf";
var fo2 = co2;
var Wt2 = "\r";
var Mu = `\r
`;
var Je2 = `
`;
var lo2 = Je2;
function Yu(e2) {
  let t2 = e2.indexOf(Wt2);
  return t2 !== -1 ? e2.charAt(t2 + 1) === Je2 ? Lu : Ru : fo2;
}
__name(Yu, "Yu");
function Se2(e2) {
  return e2 === Ru ? Wt2 : e2 === Lu ? Mu : lo2;
}
__name(Se2, "Se");
var po2 = /* @__PURE__ */ new Map([[Je2, /\n/gu], [Wt2, /\r/gu], [Mu, /\r\n/gu]]);
function $t2(e2, t2) {
  let u = po2.get(t2);
  return e2.match(u)?.length ?? 0;
}
__name($t2, "$t");
var Fo = /\r\n?/gu;
function ju(e2) {
  return oe2(0, e2, Fo, Je2);
}
__name(ju, "ju");
function mo2(e2) {
  return this[e2 < 0 ? this.length + e2 : e2];
}
__name(mo2, "mo");
var Eo2 = X2("at", function() {
  if (Array.isArray(this) || typeof this == "string") return mo2;
});
var b2 = Eo2;
var G2 = "string";
var j2 = "array";
var U2 = "cursor";
var I3 = "indent";
var k2 = "align";
var v2 = "trim";
var x2 = "group";
var w2 = "fill";
var B2 = "if-break";
var R2 = "indent-if-break";
var L2 = "line-suffix";
var M2 = "line-suffix-boundary";
var _ = "line";
var O2 = "label";
var T = "break-parent";
var He2 = /* @__PURE__ */ new Set([U2, I3, k2, v2, x2, w2, B2, R2, L2, M2, _, O2, T]);
function Uu(e2) {
  let t2 = e2.length;
  for (; t2 > 0 && (e2[t2 - 1] === "\r" || e2[t2 - 1] === `
`); ) t2--;
  return t2 < e2.length ? e2.slice(0, t2) : e2;
}
__name(Uu, "Uu");
function Co2(e2) {
  if (typeof e2 == "string") return G2;
  if (Array.isArray(e2)) return j2;
  if (!e2) return;
  let { type: t2 } = e2;
  if (He2.has(t2)) return t2;
}
__name(Co2, "Co");
var H2 = Co2;
var ho2 = /* @__PURE__ */ __name((e2) => new Intl.ListFormat("en-US", { type: "disjunction" }).format(e2), "ho");
function go2(e2) {
  let t2 = e2 === null ? "null" : typeof e2;
  if (t2 !== "string" && t2 !== "object") return `Unexpected doc '${t2}', 
Expected it to be 'string' or 'object'.`;
  if (H2(e2)) throw new Error("doc is valid.");
  let u = Object.prototype.toString.call(e2);
  if (u !== "[object Object]") return `Unexpected doc '${u}'.`;
  let r2 = ho2([...He2].map((o2) => `'${o2}'`));
  return `Unexpected doc.type '${e2.type}'.
Expected it to be ${r2}.`;
}
__name(go2, "go");
var Vt = class extends Error {
  static {
    __name(this, "Vt");
  }
  name = "InvalidDocError";
  constructor(t2) {
    super(go2(t2)), this.doc = t2;
  }
};
var Z2 = Vt;
var Wu = {};
function yo2(e2, t2, u, r2) {
  let o2 = [e2];
  for (; o2.length > 0; ) {
    let n2 = o2.pop();
    if (n2 === Wu) {
      u(o2.pop());
      continue;
    }
    u && o2.push(n2, Wu);
    let a = H2(n2);
    if (!a) throw new Z2(n2);
    if (t2?.(n2) !== false) switch (a) {
      case j2:
      case w2: {
        let s2 = a === j2 ? n2 : n2.parts;
        for (let i = s2.length, D2 = i - 1; D2 >= 0; --D2) o2.push(s2[D2]);
        break;
      }
      case B2:
        o2.push(n2.flatContents, n2.breakContents);
        break;
      case x2:
        if (r2 && n2.expandedStates) for (let s2 = n2.expandedStates.length, i = s2 - 1; i >= 0; --i) o2.push(n2.expandedStates[i]);
        else o2.push(n2.contents);
        break;
      case k2:
      case I3:
      case R2:
      case O2:
      case L2:
        o2.push(n2.contents);
        break;
      case G2:
      case U2:
      case v2:
      case M2:
      case _:
      case T:
        break;
      default:
        throw new Z2(n2);
    }
  }
}
__name(yo2, "yo");
var we2 = yo2;
function Pe2(e2, t2) {
  if (typeof e2 == "string") return t2(e2);
  let u = /* @__PURE__ */ new Map();
  return r2(e2);
  function r2(n2) {
    if (u.has(n2)) return u.get(n2);
    let a = o2(n2);
    return u.set(n2, a), a;
  }
  __name(r2, "r");
  function o2(n2) {
    switch (H2(n2)) {
      case j2:
        return t2(n2.map(r2));
      case w2:
        return t2({ ...n2, parts: n2.parts.map(r2) });
      case B2:
        return t2({ ...n2, breakContents: r2(n2.breakContents), flatContents: r2(n2.flatContents) });
      case x2: {
        let { expandedStates: a, contents: s2 } = n2;
        return a ? (a = a.map(r2), s2 = a[0]) : s2 = r2(s2), t2({ ...n2, contents: s2, expandedStates: a });
      }
      case k2:
      case I3:
      case R2:
      case O2:
      case L2:
        return t2({ ...n2, contents: r2(n2.contents) });
      case G2:
      case U2:
      case v2:
      case M2:
      case _:
      case T:
        return t2(n2);
      default:
        throw new Z2(n2);
    }
  }
  __name(o2, "o");
}
__name(Pe2, "Pe");
function Xe2(e2, t2, u) {
  let r2 = u, o2 = false;
  function n2(a) {
    if (o2) return false;
    let s2 = t2(a);
    s2 !== void 0 && (o2 = true, r2 = s2);
  }
  __name(n2, "n");
  return we2(e2, n2), r2;
}
__name(Xe2, "Xe");
function bo2(e2) {
  if (e2.type === x2 && e2.break || e2.type === _ && e2.hard || e2.type === T) return true;
}
__name(bo2, "bo");
function Ku(e2) {
  return Xe2(e2, bo2, false);
}
__name(Ku, "Ku");
function $u(e2) {
  if (e2.length > 0) {
    let t2 = b2(0, e2, -1);
    !t2.expandedStates && !t2.break && (t2.break = "propagated");
  }
  return null;
}
__name($u, "$u");
function Gu(e2) {
  let t2 = /* @__PURE__ */ new Set(), u = [];
  function r2(n2) {
    if (n2.type === T && $u(u), n2.type === x2) {
      if (u.push(n2), t2.has(n2)) return false;
      t2.add(n2);
    }
  }
  __name(r2, "r");
  function o2(n2) {
    n2.type === x2 && u.pop().break && $u(u);
  }
  __name(o2, "o");
  we2(e2, r2, o2, true);
}
__name(Gu, "Gu");
function Ao2(e2) {
  return e2.type === _ && !e2.hard ? e2.soft ? "" : " " : e2.type === B2 ? e2.flatContents : e2;
}
__name(Ao2, "Ao");
function zu(e2) {
  return Pe2(e2, Ao2);
}
__name(zu, "zu");
function Vu(e2) {
  for (e2 = [...e2]; e2.length >= 2 && b2(0, e2, -2).type === _ && b2(0, e2, -1).type === T; ) e2.length -= 2;
  if (e2.length > 0) {
    let t2 = Oe2(b2(0, e2, -1));
    e2[e2.length - 1] = t2;
  }
  return e2;
}
__name(Vu, "Vu");
function Oe2(e2) {
  switch (H2(e2)) {
    case I3:
    case R2:
    case x2:
    case L2:
    case O2: {
      let t2 = Oe2(e2.contents);
      return { ...e2, contents: t2 };
    }
    case B2:
      return { ...e2, breakContents: Oe2(e2.breakContents), flatContents: Oe2(e2.flatContents) };
    case w2:
      return { ...e2, parts: Vu(e2.parts) };
    case j2:
      return Vu(e2);
    case G2:
      return Uu(e2);
    case k2:
    case U2:
    case v2:
    case M2:
    case _:
    case T:
      break;
    default:
      throw new Z2(e2);
  }
  return e2;
}
__name(Oe2, "Oe");
function qe(e2) {
  return Oe2(xo2(e2));
}
__name(qe, "qe");
function _o2(e2) {
  switch (H2(e2)) {
    case w2:
      if (e2.parts.every((t2) => t2 === "")) return "";
      break;
    case x2:
      if (!e2.contents && !e2.id && !e2.break && !e2.expandedStates) return "";
      if (e2.contents.type === x2 && e2.contents.id === e2.id && e2.contents.break === e2.break && e2.contents.expandedStates === e2.expandedStates) return e2.contents;
      break;
    case k2:
    case I3:
    case R2:
    case L2:
      if (!e2.contents) return "";
      break;
    case B2:
      if (!e2.flatContents && !e2.breakContents) return "";
      break;
    case j2: {
      let t2 = [];
      for (let u of e2) {
        if (!u) continue;
        let [r2, ...o2] = Array.isArray(u) ? u : [u];
        typeof r2 == "string" && typeof b2(0, t2, -1) == "string" ? t2[t2.length - 1] += r2 : t2.push(r2), t2.push(...o2);
      }
      return t2.length === 0 ? "" : t2.length === 1 ? t2[0] : t2;
    }
    case G2:
    case U2:
    case v2:
    case M2:
    case _:
    case O2:
    case T:
      break;
    default:
      throw new Z2(e2);
  }
  return e2;
}
__name(_o2, "_o");
function xo2(e2) {
  return Pe2(e2, (t2) => _o2(t2));
}
__name(xo2, "xo");
function Ju(e2, t2 = Qe2) {
  return Pe2(e2, (u) => typeof u == "string" ? Ie2(t2, u.split(`
`)) : u);
}
__name(Ju, "Ju");
function Bo2(e2) {
  if (e2.type === _) return true;
}
__name(Bo2, "Bo");
function Hu(e2) {
  return Xe2(e2, Bo2, false);
}
__name(Hu, "Hu");
function Ee2(e2, t2) {
  return e2.type === O2 ? { ...e2, contents: t2(e2.contents) } : t2(e2);
}
__name(Ee2, "Ee");
var N2 = P;
var Ze2 = P;
var Xu = P;
var qu = P;
function ae2(e2) {
  return N2(e2), { type: I3, contents: e2 };
}
__name(ae2, "ae");
function De2(e2, t2) {
  return qu(e2), N2(t2), { type: k2, contents: t2, n: e2 };
}
__name(De2, "De");
function Qu(e2) {
  return De2(Number.NEGATIVE_INFINITY, e2);
}
__name(Qu, "Qu");
function et2(e2) {
  return De2({ type: "root" }, e2);
}
__name(et2, "et");
function Zu(e2) {
  return De2(-1, e2);
}
__name(Zu, "Zu");
function tt2(e2, t2, u) {
  N2(e2);
  let r2 = e2;
  if (t2 > 0) {
    for (let o2 = 0; o2 < Math.floor(t2 / u); ++o2) r2 = ae2(r2);
    r2 = De2(t2 % u, r2), r2 = De2(Number.NEGATIVE_INFINITY, r2);
  }
  return r2;
}
__name(tt2, "tt");
var ce2 = { type: T };
var ee2 = { type: U2 };
function er2(e2) {
  return Xu(e2), { type: w2, parts: e2 };
}
__name(er2, "er");
function Kt2(e2, t2 = {}) {
  return N2(e2), Ze2(t2.expandedStates, true), { type: x2, id: t2.id, contents: e2, break: !!t2.shouldBreak, expandedStates: t2.expandedStates };
}
__name(Kt2, "Kt");
function tr2(e2, t2) {
  return Kt2(e2[0], { ...t2, expandedStates: e2 });
}
__name(tr2, "tr");
function ur2(e2, t2 = "", u = {}) {
  return N2(e2), t2 !== "" && N2(t2), { type: B2, breakContents: e2, flatContents: t2, groupId: u.groupId };
}
__name(ur2, "ur");
function rr2(e2, t2) {
  return N2(e2), { type: R2, contents: e2, groupId: t2.groupId, negate: t2.negate };
}
__name(rr2, "rr");
function Ie2(e2, t2) {
  N2(e2), Ze2(t2);
  let u = [];
  for (let r2 = 0; r2 < t2.length; r2++) r2 !== 0 && u.push(e2), u.push(t2[r2]);
  return u;
}
__name(Ie2, "Ie");
function nr2(e2, t2) {
  return N2(t2), e2 ? { type: O2, label: e2, contents: t2 } : t2;
}
__name(nr2, "nr");
var ut2 = { type: _ };
var or2 = { type: _, soft: true };
var ke2 = { type: _, hard: true };
var V3 = [ke2, ce2];
var Gt2 = { type: _, hard: true, literal: true };
var Qe2 = [Gt2, ce2];
function ve2(e2) {
  return N2(e2), { type: L2, contents: e2 };
}
__name(ve2, "ve");
var ar2 = { type: M2 };
var ir2 = { type: v2 };
function te2(e2) {
  if (!e2) return "";
  if (Array.isArray(e2)) {
    let t2 = [];
    for (let u of e2) if (Array.isArray(u)) t2.push(...te2(u));
    else {
      let r2 = te2(u);
      r2 !== "" && t2.push(r2);
    }
    return t2;
  }
  return e2.type === B2 ? { ...e2, breakContents: te2(e2.breakContents), flatContents: te2(e2.flatContents) } : e2.type === x2 ? { ...e2, contents: te2(e2.contents), expandedStates: e2.expandedStates?.map(te2) } : e2.type === w2 ? { type: "fill", parts: e2.parts.map(te2) } : e2.contents ? { ...e2, contents: te2(e2.contents) } : e2;
}
__name(te2, "te");
function sr2(e2) {
  let t2 = /* @__PURE__ */ Object.create(null), u = /* @__PURE__ */ new Set();
  return r2(te2(e2));
  function r2(n2, a, s2) {
    if (typeof n2 == "string") return JSON.stringify(n2);
    if (Array.isArray(n2)) {
      let i = n2.map(r2).filter(Boolean);
      return i.length === 1 ? i[0] : `[${i.join(", ")}]`;
    }
    if (n2.type === _) {
      let i = s2?.[a + 1]?.type === T;
      return n2.literal ? i ? "literalline" : "literallineWithoutBreakParent" : n2.hard ? i ? "hardline" : "hardlineWithoutBreakParent" : n2.soft ? "softline" : "line";
    }
    if (n2.type === T) return s2?.[a - 1]?.type === _ && s2[a - 1].hard ? void 0 : "breakParent";
    if (n2.type === v2) return "trim";
    if (n2.type === I3) return "indent(" + r2(n2.contents) + ")";
    if (n2.type === k2) return n2.n === Number.NEGATIVE_INFINITY ? "dedentToRoot(" + r2(n2.contents) + ")" : n2.n < 0 ? "dedent(" + r2(n2.contents) + ")" : n2.n.type === "root" ? "markAsRoot(" + r2(n2.contents) + ")" : "align(" + JSON.stringify(n2.n) + ", " + r2(n2.contents) + ")";
    if (n2.type === B2) return "ifBreak(" + r2(n2.breakContents) + (n2.flatContents ? ", " + r2(n2.flatContents) : "") + (n2.groupId ? (n2.flatContents ? "" : ', ""') + `, { groupId: ${o2(n2.groupId)} }` : "") + ")";
    if (n2.type === R2) {
      let i = [];
      n2.negate && i.push("negate: true"), n2.groupId && i.push(`groupId: ${o2(n2.groupId)}`);
      let D2 = i.length > 0 ? `, { ${i.join(", ")} }` : "";
      return `indentIfBreak(${r2(n2.contents)}${D2})`;
    }
    if (n2.type === x2) {
      let i = [];
      n2.break && n2.break !== "propagated" && i.push("shouldBreak: true"), n2.id && i.push(`id: ${o2(n2.id)}`);
      let D2 = i.length > 0 ? `, { ${i.join(", ")} }` : "";
      return n2.expandedStates ? `conditionalGroup([${n2.expandedStates.map((f2) => r2(f2)).join(",")}]${D2})` : `group(${r2(n2.contents)}${D2})`;
    }
    if (n2.type === w2) return `fill([${n2.parts.map((i) => r2(i)).join(", ")}])`;
    if (n2.type === L2) return "lineSuffix(" + r2(n2.contents) + ")";
    if (n2.type === M2) return "lineSuffixBoundary";
    if (n2.type === O2) return `label(${JSON.stringify(n2.label)}, ${r2(n2.contents)})`;
    if (n2.type === U2) return "cursor";
    throw new Error("Unknown doc type " + n2.type);
  }
  __name(r2, "r");
  function o2(n2) {
    if (typeof n2 != "symbol") return JSON.stringify(String(n2));
    if (n2 in t2) return t2[n2];
    let a = n2.description || "symbol";
    for (let s2 = 0; ; s2++) {
      let i = a + (s2 > 0 ? ` #${s2}` : "");
      if (!u.has(i)) return u.add(i), t2[n2] = `Symbol.for(${JSON.stringify(i)})`;
    }
  }
  __name(o2, "o");
}
__name(sr2, "sr");
var Dr2 = /* @__PURE__ */ __name(() => /[#*0-9]\uFE0F?\u20E3|[\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23ED-\u23EF\u23F1\u23F2\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB\u25FC\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692\u2694-\u2697\u2699\u269B\u269C\u26A0\u26A7\u26AA\u26B0\u26B1\u26BD\u26BE\u26C4\u26C8\u26CF\u26D1\u26E9\u26F0-\u26F5\u26F7\u26F8\u26FA\u2702\u2708\u2709\u270F\u2712\u2714\u2716\u271D\u2721\u2733\u2734\u2744\u2747\u2757\u2763\u27A1\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B55\u3030\u303D\u3297\u3299]\uFE0F?|[\u261D\u270C\u270D](?:\uD83C[\uDFFB-\uDFFF]|\uFE0F)?|[\u270A\u270B](?:\uD83C[\uDFFB-\uDFFF])?|[\u23E9-\u23EC\u23F0\u23F3\u25FD\u2693\u26A1\u26AB\u26C5\u26CE\u26D4\u26EA\u26FD\u2705\u2728\u274C\u274E\u2753-\u2755\u2795-\u2797\u27B0\u27BF\u2B50]|\u26D3\uFE0F?(?:\u200D\uD83D\uDCA5)?|\u26F9(?:\uD83C[\uDFFB-\uDFFF]|\uFE0F)?(?:\u200D[\u2640\u2642]\uFE0F?)?|\u2764\uFE0F?(?:\u200D(?:\uD83D\uDD25|\uD83E\uDE79))?|\uD83C(?:[\uDC04\uDD70\uDD71\uDD7E\uDD7F\uDE02\uDE37\uDF21\uDF24-\uDF2C\uDF36\uDF7D\uDF96\uDF97\uDF99-\uDF9B\uDF9E\uDF9F\uDFCD\uDFCE\uDFD4-\uDFDF\uDFF5\uDFF7]\uFE0F?|[\uDF85\uDFC2\uDFC7](?:\uD83C[\uDFFB-\uDFFF])?|[\uDFC4\uDFCA](?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDFCB\uDFCC](?:\uD83C[\uDFFB-\uDFFF]|\uFE0F)?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDCCF\uDD8E\uDD91-\uDD9A\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF43\uDF45-\uDF4A\uDF4C-\uDF7C\uDF7E-\uDF84\uDF86-\uDF93\uDFA0-\uDFC1\uDFC5\uDFC6\uDFC8\uDFC9\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF8-\uDFFF]|\uDDE6\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF]|\uDDE7\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF]|\uDDE8\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF7\uDDFA-\uDDFF]|\uDDE9\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF]|\uDDEA\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA]|\uDDEB\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7]|\uDDEC\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE]|\uDDED\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA]|\uDDEE\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9]|\uDDEF\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5]|\uDDF0\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF]|\uDDF1\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE]|\uDDF2\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF]|\uDDF3\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF]|\uDDF4\uD83C\uDDF2|\uDDF5\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE]|\uDDF6\uD83C\uDDE6|\uDDF7\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC]|\uDDF8\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF]|\uDDF9\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF]|\uDDFA\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF]|\uDDFB\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA]|\uDDFC\uD83C[\uDDEB\uDDF8]|\uDDFD\uD83C\uDDF0|\uDDFE\uD83C[\uDDEA\uDDF9]|\uDDFF\uD83C[\uDDE6\uDDF2\uDDFC]|\uDF44(?:\u200D\uD83D\uDFEB)?|\uDF4B(?:\u200D\uD83D\uDFE9)?|\uDFC3(?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D(?:[\u2640\u2642]\uFE0F?(?:\u200D\u27A1\uFE0F?)?|\u27A1\uFE0F?))?|\uDFF3\uFE0F?(?:\u200D(?:\u26A7\uFE0F?|\uD83C\uDF08))?|\uDFF4(?:\u200D\u2620\uFE0F?|\uDB40\uDC67\uDB40\uDC62\uDB40(?:\uDC65\uDB40\uDC6E\uDB40\uDC67|\uDC73\uDB40\uDC63\uDB40\uDC74|\uDC77\uDB40\uDC6C\uDB40\uDC73)\uDB40\uDC7F)?)|\uD83D(?:[\uDC3F\uDCFD\uDD49\uDD4A\uDD6F\uDD70\uDD73\uDD76-\uDD79\uDD87\uDD8A-\uDD8D\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA\uDECB\uDECD-\uDECF\uDEE0-\uDEE5\uDEE9\uDEF0\uDEF3]\uFE0F?|[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC6B-\uDC6D\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDC8F\uDC91\uDCAA\uDD7A\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC](?:\uD83C[\uDFFB-\uDFFF])?|[\uDC6E-\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4\uDEB5](?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDD74\uDD90](?:\uD83C[\uDFFB-\uDFFF]|\uFE0F)?|[\uDC00-\uDC07\uDC09-\uDC14\uDC16-\uDC25\uDC27-\uDC3A\uDC3C-\uDC3E\uDC40\uDC44\uDC45\uDC51-\uDC65\uDC6A\uDC79-\uDC7B\uDC7D-\uDC80\uDC84\uDC88-\uDC8E\uDC90\uDC92-\uDCA9\uDCAB-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDDA4\uDDFB-\uDE2D\uDE2F-\uDE34\uDE37-\uDE41\uDE43\uDE44\uDE48-\uDE4A\uDE80-\uDEA2\uDEA4-\uDEB3\uDEB7-\uDEBF\uDEC1-\uDEC5\uDED0-\uDED2\uDED5-\uDED8\uDEDC-\uDEDF\uDEEB\uDEEC\uDEF4-\uDEFC\uDFE0-\uDFEB\uDFF0]|\uDC08(?:\u200D\u2B1B)?|\uDC15(?:\u200D\uD83E\uDDBA)?|\uDC26(?:\u200D(?:\u2B1B|\uD83D\uDD25))?|\uDC3B(?:\u200D\u2744\uFE0F?)?|\uDC41\uFE0F?(?:\u200D\uD83D\uDDE8\uFE0F?)?|\uDC68(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDC68\uDC69]\u200D\uD83D(?:\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?)|[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?)|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]))|\uD83C(?:\uDFFB(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83D\uDC68\uD83C[\uDFFC-\uDFFF])|\uD83E(?:[\uDD1D\uDEEF]\u200D\uD83D\uDC68\uD83C[\uDFFC-\uDFFF]|[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3])))?|\uDFFC(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83D\uDC68\uD83C[\uDFFB\uDFFD-\uDFFF])|\uD83E(?:[\uDD1D\uDEEF]\u200D\uD83D\uDC68\uD83C[\uDFFB\uDFFD-\uDFFF]|[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3])))?|\uDFFD(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83D\uDC68\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|\uD83E(?:[\uDD1D\uDEEF]\u200D\uD83D\uDC68\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF]|[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3])))?|\uDFFE(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83D\uDC68\uD83C[\uDFFB-\uDFFD\uDFFF])|\uD83E(?:[\uDD1D\uDEEF]\u200D\uD83D\uDC68\uD83C[\uDFFB-\uDFFD\uDFFF]|[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3])))?|\uDFFF(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83D\uDC68\uD83C[\uDFFB-\uDFFE])|\uD83E(?:[\uDD1D\uDEEF]\u200D\uD83D\uDC68\uD83C[\uDFFB-\uDFFE]|[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3])))?))?|\uDC69(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?[\uDC68\uDC69]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?|\uDC69\u200D\uD83D(?:\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?))|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]))|\uD83C(?:\uDFFB(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83D\uDC69\uD83C[\uDFFC-\uDFFF])|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFC-\uDFFF]|\uDEEF\u200D\uD83D\uDC69\uD83C[\uDFFC-\uDFFF])))?|\uDFFC(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83D\uDC69\uD83C[\uDFFB\uDFFD-\uDFFF])|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB\uDFFD-\uDFFF]|\uDEEF\u200D\uD83D\uDC69\uD83C[\uDFFB\uDFFD-\uDFFF])))?|\uDFFD(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83D\uDC69\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF]|\uDEEF\u200D\uD83D\uDC69\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])))?|\uDFFE(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83D\uDC69\uD83C[\uDFFB-\uDFFD\uDFFF])|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB-\uDFFD\uDFFF]|\uDEEF\u200D\uD83D\uDC69\uD83C[\uDFFB-\uDFFD\uDFFF])))?|\uDFFF(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83D\uDC69\uD83C[\uDFFB-\uDFFE])|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB-\uDFFE]|\uDEEF\u200D\uD83D\uDC69\uD83C[\uDFFB-\uDFFE])))?))?|\uDD75(?:\uD83C[\uDFFB-\uDFFF]|\uFE0F)?(?:\u200D[\u2640\u2642]\uFE0F?)?|\uDE2E(?:\u200D\uD83D\uDCA8)?|\uDE35(?:\u200D\uD83D\uDCAB)?|\uDE36(?:\u200D\uD83C\uDF2B\uFE0F?)?|\uDE42(?:\u200D[\u2194\u2195]\uFE0F?)?|\uDEB6(?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D(?:[\u2640\u2642]\uFE0F?(?:\u200D\u27A1\uFE0F?)?|\u27A1\uFE0F?))?)|\uD83E(?:[\uDD0C\uDD0F\uDD18-\uDD1F\uDD30-\uDD34\uDD36\uDD77\uDDB5\uDDB6\uDDBB\uDDD2\uDDD3\uDDD5\uDEC3-\uDEC5\uDEF0\uDEF2-\uDEF8](?:\uD83C[\uDFFB-\uDFFF])?|[\uDD26\uDD35\uDD37-\uDD39\uDD3C-\uDD3E\uDDB8\uDDB9\uDDCD\uDDCF\uDDD4\uDDD6-\uDDDD](?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDDDE\uDDDF](?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDD0D\uDD0E\uDD10-\uDD17\uDD20-\uDD25\uDD27-\uDD2F\uDD3A\uDD3F-\uDD45\uDD47-\uDD76\uDD78-\uDDB4\uDDB7\uDDBA\uDDBC-\uDDCC\uDDD0\uDDE0-\uDDFF\uDE70-\uDE7C\uDE80-\uDE8A\uDE8E-\uDEC2\uDEC6\uDEC8\uDECD-\uDEDC\uDEDF-\uDEEA\uDEEF]|\uDDCE(?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D(?:[\u2640\u2642]\uFE0F?(?:\u200D\u27A1\uFE0F?)?|\u27A1\uFE0F?))?|\uDDD1(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3\uDE70]|\uDD1D\u200D\uD83E\uDDD1|\uDDD1\u200D\uD83E\uDDD2(?:\u200D\uD83E\uDDD2)?|\uDDD2(?:\u200D\uD83E\uDDD2)?))|\uD83C(?:\uDFFB(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFC-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83E\uDDD1\uD83C[\uDFFC-\uDFFF])|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3\uDE70]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF]|\uDEEF\u200D\uD83E\uDDD1\uD83C[\uDFFC-\uDFFF])))?|\uDFFC(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB\uDFFD-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83E\uDDD1\uD83C[\uDFFB\uDFFD-\uDFFF])|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3\uDE70]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF]|\uDEEF\u200D\uD83E\uDDD1\uD83C[\uDFFB\uDFFD-\uDFFF])))?|\uDFFD(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83E\uDDD1\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3\uDE70]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF]|\uDEEF\u200D\uD83E\uDDD1\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])))?|\uDFFE(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB-\uDFFD\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFD\uDFFF])|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3\uDE70]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF]|\uDEEF\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFD\uDFFF])))?|\uDFFF(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB-\uDFFE]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFE])|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3\uDE70]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF]|\uDEEF\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFE])))?))?|\uDEF1(?:\uD83C(?:\uDFFB(?:\u200D\uD83E\uDEF2\uD83C[\uDFFC-\uDFFF])?|\uDFFC(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB\uDFFD-\uDFFF])?|\uDFFD(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])?|\uDFFE(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB-\uDFFD\uDFFF])?|\uDFFF(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB-\uDFFE])?))?)/g, "Dr");
function zt2(e2) {
  return e2 === 12288 || e2 >= 65281 && e2 <= 65376 || e2 >= 65504 && e2 <= 65510;
}
__name(zt2, "zt");
function Jt2(e2) {
  return e2 >= 4352 && e2 <= 4447 || e2 === 8986 || e2 === 8987 || e2 === 9001 || e2 === 9002 || e2 >= 9193 && e2 <= 9196 || e2 === 9200 || e2 === 9203 || e2 === 9725 || e2 === 9726 || e2 === 9748 || e2 === 9749 || e2 >= 9776 && e2 <= 9783 || e2 >= 9800 && e2 <= 9811 || e2 === 9855 || e2 >= 9866 && e2 <= 9871 || e2 === 9875 || e2 === 9889 || e2 === 9898 || e2 === 9899 || e2 === 9917 || e2 === 9918 || e2 === 9924 || e2 === 9925 || e2 === 9934 || e2 === 9940 || e2 === 9962 || e2 === 9970 || e2 === 9971 || e2 === 9973 || e2 === 9978 || e2 === 9981 || e2 === 9989 || e2 === 9994 || e2 === 9995 || e2 === 10024 || e2 === 10060 || e2 === 10062 || e2 >= 10067 && e2 <= 10069 || e2 === 10071 || e2 >= 10133 && e2 <= 10135 || e2 === 10160 || e2 === 10175 || e2 === 11035 || e2 === 11036 || e2 === 11088 || e2 === 11093 || e2 >= 11904 && e2 <= 11929 || e2 >= 11931 && e2 <= 12019 || e2 >= 12032 && e2 <= 12245 || e2 >= 12272 && e2 <= 12287 || e2 >= 12289 && e2 <= 12350 || e2 >= 12353 && e2 <= 12438 || e2 >= 12441 && e2 <= 12543 || e2 >= 12549 && e2 <= 12591 || e2 >= 12593 && e2 <= 12686 || e2 >= 12688 && e2 <= 12773 || e2 >= 12783 && e2 <= 12830 || e2 >= 12832 && e2 <= 12871 || e2 >= 12880 && e2 <= 42124 || e2 >= 42128 && e2 <= 42182 || e2 >= 43360 && e2 <= 43388 || e2 >= 44032 && e2 <= 55203 || e2 >= 63744 && e2 <= 64255 || e2 >= 65040 && e2 <= 65049 || e2 >= 65072 && e2 <= 65106 || e2 >= 65108 && e2 <= 65126 || e2 >= 65128 && e2 <= 65131 || e2 >= 94176 && e2 <= 94180 || e2 >= 94192 && e2 <= 94198 || e2 >= 94208 && e2 <= 101589 || e2 >= 101631 && e2 <= 101662 || e2 >= 101760 && e2 <= 101874 || e2 >= 110576 && e2 <= 110579 || e2 >= 110581 && e2 <= 110587 || e2 === 110589 || e2 === 110590 || e2 >= 110592 && e2 <= 110882 || e2 === 110898 || e2 >= 110928 && e2 <= 110930 || e2 === 110933 || e2 >= 110948 && e2 <= 110951 || e2 >= 110960 && e2 <= 111355 || e2 >= 119552 && e2 <= 119638 || e2 >= 119648 && e2 <= 119670 || e2 === 126980 || e2 === 127183 || e2 === 127374 || e2 >= 127377 && e2 <= 127386 || e2 >= 127488 && e2 <= 127490 || e2 >= 127504 && e2 <= 127547 || e2 >= 127552 && e2 <= 127560 || e2 === 127568 || e2 === 127569 || e2 >= 127584 && e2 <= 127589 || e2 >= 127744 && e2 <= 127776 || e2 >= 127789 && e2 <= 127797 || e2 >= 127799 && e2 <= 127868 || e2 >= 127870 && e2 <= 127891 || e2 >= 127904 && e2 <= 127946 || e2 >= 127951 && e2 <= 127955 || e2 >= 127968 && e2 <= 127984 || e2 === 127988 || e2 >= 127992 && e2 <= 128062 || e2 === 128064 || e2 >= 128066 && e2 <= 128252 || e2 >= 128255 && e2 <= 128317 || e2 >= 128331 && e2 <= 128334 || e2 >= 128336 && e2 <= 128359 || e2 === 128378 || e2 === 128405 || e2 === 128406 || e2 === 128420 || e2 >= 128507 && e2 <= 128591 || e2 >= 128640 && e2 <= 128709 || e2 === 128716 || e2 >= 128720 && e2 <= 128722 || e2 >= 128725 && e2 <= 128728 || e2 >= 128732 && e2 <= 128735 || e2 === 128747 || e2 === 128748 || e2 >= 128756 && e2 <= 128764 || e2 >= 128992 && e2 <= 129003 || e2 === 129008 || e2 >= 129292 && e2 <= 129338 || e2 >= 129340 && e2 <= 129349 || e2 >= 129351 && e2 <= 129535 || e2 >= 129648 && e2 <= 129660 || e2 >= 129664 && e2 <= 129674 || e2 >= 129678 && e2 <= 129734 || e2 === 129736 || e2 >= 129741 && e2 <= 129756 || e2 >= 129759 && e2 <= 129770 || e2 >= 129775 && e2 <= 129784 || e2 >= 131072 && e2 <= 196605 || e2 >= 196608 && e2 <= 262141;
}
__name(Jt2, "Jt");
var cr2 = "©®‼⁉™ℹ↔↕↖↗↘↙↩↪⌨⏏⏱⏲⏸⏹⏺▪▫▶◀◻◼☀☁☂☃☄☎☑☘☝☠☢☣☦☪☮☯☸☹☺♀♂♟♠♣♥♦♨♻♾⚒⚔⚕⚖⚗⚙⚛⚜⚠⚧⚰⚱⛈⛏⛑⛓⛩⛱⛷⛸⛹✂✈✉✌✍✏✒✔✖✝✡✳✴❄❇❣❤➡⤴⤵⬅⬆⬇";
var To2 = /[^\x20-\x7F]/u;
var No2 = new Set(cr2);
function So2(e2) {
  if (!e2) return 0;
  if (!To2.test(e2)) return e2.length;
  e2 = e2.replace(Dr2(), (u) => No2.has(u) ? " " : "  ");
  let t2 = 0;
  for (let u of e2) {
    let r2 = u.codePointAt(0);
    r2 <= 31 || r2 >= 127 && r2 <= 159 || r2 >= 768 && r2 <= 879 || r2 >= 65024 && r2 <= 65039 || (t2 += zt2(r2) || Jt2(r2) ? 2 : 1);
  }
  return t2;
}
__name(So2, "So");
var Re2 = So2;
var wo2 = { type: 0 };
var Oo2 = { type: 1 };
var Ht2 = { value: "", length: 0, queue: [], get root() {
  return Ht2;
} };
function fr2(e2, t2, u) {
  let r2 = t2.type === 1 ? e2.queue.slice(0, -1) : [...e2.queue, t2], o2 = "", n2 = 0, a = 0, s2 = 0;
  for (let p of r2) switch (p.type) {
    case 0:
      f2(), u.useTabs ? i(1) : D2(u.tabWidth);
      break;
    case 3: {
      let { string: F2 } = p;
      f2(), o2 += F2, n2 += F2.length;
      break;
    }
    case 2: {
      let { width: F2 } = p;
      a += 1, s2 += F2;
      break;
    }
    default:
      throw new Error(`Unexpected indent comment '${p.type}'.`);
  }
  return d(), { ...e2, value: o2, length: n2, queue: r2 };
  function i(p) {
    o2 += "	".repeat(p), n2 += u.tabWidth * p;
  }
  __name(i, "i");
  function D2(p) {
    o2 += " ".repeat(p), n2 += p;
  }
  __name(D2, "D");
  function f2() {
    u.useTabs ? l3() : d();
  }
  __name(f2, "f");
  function l3() {
    a > 0 && i(a), c2();
  }
  __name(l3, "l");
  function d() {
    s2 > 0 && D2(s2), c2();
  }
  __name(d, "d");
  function c2() {
    a = 0, s2 = 0;
  }
  __name(c2, "c");
}
__name(fr2, "fr");
function lr2(e2, t2, u) {
  if (!t2) return e2;
  if (t2.type === "root") return { ...e2, root: e2 };
  if (t2 === Number.NEGATIVE_INFINITY) return e2.root;
  let r2;
  return typeof t2 == "number" ? t2 < 0 ? r2 = Oo2 : r2 = { type: 2, width: t2 } : r2 = { type: 3, string: t2 }, fr2(e2, r2, u);
}
__name(lr2, "lr");
function dr2(e2, t2) {
  return fr2(e2, wo2, t2);
}
__name(dr2, "dr");
function Po2(e2) {
  let t2 = 0;
  for (let u = e2.length - 1; u >= 0; u--) {
    let r2 = e2[u];
    if (r2 === " " || r2 === "	") t2++;
    else break;
  }
  return t2;
}
__name(Po2, "Po");
function Xt2(e2) {
  let t2 = Po2(e2);
  return { text: t2 === 0 ? e2 : e2.slice(0, e2.length - t2), count: t2 };
}
__name(Xt2, "Xt");
var W2 = Symbol("MODE_BREAK");
var q2 = Symbol("MODE_FLAT");
var qt2 = Symbol("DOC_FILL_PRINTED_LENGTH");
function rt2(e2, t2, u, r2, o2, n2) {
  if (u === Number.POSITIVE_INFINITY) return true;
  let a = t2.length, s2 = false, i = [e2], D2 = "";
  for (; u >= 0; ) {
    if (i.length === 0) {
      if (a === 0) return true;
      i.push(t2[--a]);
      continue;
    }
    let { mode: f2, doc: l3 } = i.pop(), d = H2(l3);
    switch (d) {
      case G2:
        l3 && (s2 && (D2 += " ", u -= 1, s2 = false), D2 += l3, u -= Re2(l3));
        break;
      case j2:
      case w2: {
        let c2 = d === j2 ? l3 : l3.parts, p = l3[qt2] ?? 0;
        for (let F2 = c2.length - 1; F2 >= p; F2--) i.push({ mode: f2, doc: c2[F2] });
        break;
      }
      case I3:
      case k2:
      case R2:
      case O2:
        i.push({ mode: f2, doc: l3.contents });
        break;
      case v2: {
        let { text: c2, count: p } = Xt2(D2);
        D2 = c2, u += p;
        break;
      }
      case x2: {
        if (n2 && l3.break) return false;
        let c2 = l3.break ? W2 : f2, p = l3.expandedStates && c2 === W2 ? b2(0, l3.expandedStates, -1) : l3.contents;
        i.push({ mode: c2, doc: p });
        break;
      }
      case B2: {
        let p = (l3.groupId ? o2[l3.groupId] || q2 : f2) === W2 ? l3.breakContents : l3.flatContents;
        p && i.push({ mode: f2, doc: p });
        break;
      }
      case _:
        if (f2 === W2 || l3.hard) return true;
        l3.soft || (s2 = true);
        break;
      case L2:
        r2 = true;
        break;
      case M2:
        if (r2) return false;
        break;
    }
  }
  return false;
}
__name(rt2, "rt");
function Ce(e2, t2) {
  let u = /* @__PURE__ */ Object.create(null), r2 = t2.printWidth, o2 = Se2(t2.endOfLine), n2 = 0, a = [{ indent: Ht2, mode: W2, doc: e2 }], s2 = "", i = false, D2 = [], f2 = [], l3 = [], d = [], c2 = 0;
  for (Gu(e2); a.length > 0; ) {
    let { indent: m, mode: h2, doc: E2 } = a.pop();
    switch (H2(E2)) {
      case G2: {
        let g = o2 !== `
` ? oe2(0, E2, `
`, o2) : E2;
        g && (s2 += g, a.length > 0 && (n2 += Re2(g)));
        break;
      }
      case j2:
        for (let g = E2.length - 1; g >= 0; g--) a.push({ indent: m, mode: h2, doc: E2[g] });
        break;
      case U2:
        if (f2.length >= 2) throw new Error("There are too many 'cursor' in doc.");
        f2.push(c2 + s2.length);
        break;
      case I3:
        a.push({ indent: dr2(m, t2), mode: h2, doc: E2.contents });
        break;
      case k2:
        a.push({ indent: lr2(m, E2.n, t2), mode: h2, doc: E2.contents });
        break;
      case v2:
        y2();
        break;
      case x2:
        switch (h2) {
          case q2:
            if (!i) {
              a.push({ indent: m, mode: E2.break ? W2 : q2, doc: E2.contents });
              break;
            }
          case W2: {
            i = false;
            let g = { indent: m, mode: q2, doc: E2.contents }, A2 = r2 - n2, J2 = D2.length > 0;
            if (!E2.break && rt2(g, a, A2, J2, u)) a.push(g);
            else if (E2.expandedStates) {
              let Q = b2(0, E2.expandedStates, -1);
              if (E2.break) {
                a.push({ indent: m, mode: W2, doc: Q });
                break;
              } else for (let re2 = 1; re2 < E2.expandedStates.length + 1; re2++) if (re2 >= E2.expandedStates.length) {
                a.push({ indent: m, mode: W2, doc: Q });
                break;
              } else {
                let Te2 = E2.expandedStates[re2], ne = { indent: m, mode: q2, doc: Te2 };
                if (rt2(ne, a, A2, J2, u)) {
                  a.push(ne);
                  break;
                }
              }
            } else a.push({ indent: m, mode: W2, doc: E2.contents });
            break;
          }
        }
        E2.id && (u[E2.id] = b2(0, a, -1).mode);
        break;
      case w2: {
        let g = r2 - n2, A2 = E2[qt2] ?? 0, { parts: J2 } = E2, Q = J2.length - A2;
        if (Q === 0) break;
        let re2 = J2[A2 + 0], Te2 = J2[A2 + 1], ne = { indent: m, mode: q2, doc: re2 }, vt2 = { indent: m, mode: W2, doc: re2 }, Rt2 = rt2(ne, [], g, D2.length > 0, u, true);
        if (Q === 1) {
          Rt2 ? a.push(ne) : a.push(vt2);
          break;
        }
        let Iu = { indent: m, mode: q2, doc: Te2 }, Lt2 = { indent: m, mode: W2, doc: Te2 };
        if (Q === 2) {
          Rt2 ? a.push(Iu, ne) : a.push(Lt2, vt2);
          break;
        }
        let Xn2 = J2[A2 + 2], qn2 = { indent: m, mode: h2, doc: { ...E2, [qt2]: A2 + 2 } }, Qn2 = rt2({ indent: m, mode: q2, doc: [re2, Te2, Xn2] }, [], g, D2.length > 0, u, true);
        a.push(qn2), Qn2 ? a.push(Iu, ne) : Rt2 ? a.push(Lt2, ne) : a.push(Lt2, vt2);
        break;
      }
      case B2:
      case R2: {
        let g = E2.groupId ? u[E2.groupId] : h2;
        if (g === W2) {
          let A2 = E2.type === B2 ? E2.breakContents : E2.negate ? E2.contents : ae2(E2.contents);
          A2 && a.push({ indent: m, mode: h2, doc: A2 });
        }
        if (g === q2) {
          let A2 = E2.type === B2 ? E2.flatContents : E2.negate ? ae2(E2.contents) : E2.contents;
          A2 && a.push({ indent: m, mode: h2, doc: A2 });
        }
        break;
      }
      case L2:
        D2.push({ indent: m, mode: h2, doc: E2.contents });
        break;
      case M2:
        D2.length > 0 && a.push({ indent: m, mode: h2, doc: ke2 });
        break;
      case _:
        switch (h2) {
          case q2:
            if (E2.hard) i = true;
            else {
              E2.soft || (s2 += " ", n2 += 1);
              break;
            }
          case W2:
            if (D2.length > 0) {
              a.push({ indent: m, mode: h2, doc: E2 }, ...D2.reverse()), D2.length = 0;
              break;
            }
            E2.literal ? (s2 += o2, n2 = 0, m.root && (m.root.value && (s2 += m.root.value), n2 = m.root.length)) : (y2(), s2 += o2 + m.value, n2 = m.length);
            break;
        }
        break;
      case O2:
        a.push({ indent: m, mode: h2, doc: E2.contents });
        break;
      case T:
        break;
      default:
        throw new Z2(E2);
    }
    a.length === 0 && D2.length > 0 && (a.push(...D2.reverse()), D2.length = 0);
  }
  let p = l3.join("") + s2, F2 = [...d, ...f2];
  if (F2.length !== 2) return { formatted: p };
  let C2 = F2[0];
  return { formatted: p, cursorNodeStart: C2, cursorNodeText: p.slice(C2, b2(0, F2, -1)) };
  function y2() {
    let { text: m, count: h2 } = Xt2(s2);
    m && (l3.push(m), c2 += m.length), s2 = "", n2 -= h2, f2.length > 0 && (d.push(...f2.map((E2) => Math.min(E2, c2))), f2.length = 0);
  }
  __name(y2, "y");
}
__name(Ce, "Ce");
function Io2(e2, t2, u = 0) {
  let r2 = 0;
  for (let o2 = u; o2 < e2.length; ++o2) e2[o2] === "	" ? r2 = r2 + t2 - r2 % t2 : r2++;
  return r2;
}
__name(Io2, "Io");
var he2 = Io2;
var Qt2 = class {
  static {
    __name(this, "Qt");
  }
  constructor(t2) {
    this.stack = [t2];
  }
  get key() {
    let { stack: t2, siblings: u } = this;
    return b2(0, t2, u === null ? -2 : -4) ?? null;
  }
  get index() {
    return this.siblings === null ? null : b2(0, this.stack, -2);
  }
  get node() {
    return b2(0, this.stack, -1);
  }
  get parent() {
    return this.getNode(1);
  }
  get grandparent() {
    return this.getNode(2);
  }
  get isInArray() {
    return this.siblings !== null;
  }
  get siblings() {
    let { stack: t2 } = this, u = b2(0, t2, -3);
    return Array.isArray(u) ? u : null;
  }
  get next() {
    let { siblings: t2 } = this;
    return t2 === null ? null : t2[this.index + 1];
  }
  get previous() {
    let { siblings: t2 } = this;
    return t2 === null ? null : t2[this.index - 1];
  }
  get isFirst() {
    return this.index === 0;
  }
  get isLast() {
    let { siblings: t2, index: u } = this;
    return t2 !== null && u === t2.length - 1;
  }
  get isRoot() {
    return this.stack.length === 1;
  }
  get root() {
    return this.stack[0];
  }
  get ancestors() {
    return [...this.#e()];
  }
  getName() {
    let { stack: t2 } = this, { length: u } = t2;
    return u > 1 ? b2(0, t2, -2) : null;
  }
  getValue() {
    return b2(0, this.stack, -1);
  }
  getNode(t2 = 0) {
    let u = this.#t(t2);
    return u === -1 ? null : this.stack[u];
  }
  getParentNode(t2 = 0) {
    return this.getNode(t2 + 1);
  }
  #t(t2) {
    let { stack: u } = this;
    for (let r2 = u.length - 1; r2 >= 0; r2 -= 2) if (!Array.isArray(u[r2]) && --t2 < 0) return r2;
    return -1;
  }
  call(t2, ...u) {
    let { stack: r2 } = this, { length: o2 } = r2, n2 = b2(0, r2, -1);
    for (let a of u) n2 = n2?.[a], r2.push(a, n2);
    try {
      return t2(this);
    } finally {
      r2.length = o2;
    }
  }
  callParent(t2, u = 0) {
    let r2 = this.#t(u + 1), o2 = this.stack.splice(r2 + 1);
    try {
      return t2(this);
    } finally {
      this.stack.push(...o2);
    }
  }
  each(t2, ...u) {
    let { stack: r2 } = this, { length: o2 } = r2, n2 = b2(0, r2, -1);
    for (let a of u) n2 = n2[a], r2.push(a, n2);
    try {
      for (let a = 0; a < n2.length; ++a) r2.push(a, n2[a]), t2(this, a, n2), r2.length -= 2;
    } finally {
      r2.length = o2;
    }
  }
  map(t2, ...u) {
    let r2 = [];
    return this.each((o2, n2, a) => {
      r2[n2] = t2(o2, n2, a);
    }, ...u), r2;
  }
  match(...t2) {
    let u = this.stack.length - 1, r2 = null, o2 = this.stack[u--];
    for (let n2 of t2) {
      if (o2 === void 0) return false;
      let a = null;
      if (typeof r2 == "number" && (a = r2, r2 = this.stack[u--], o2 = this.stack[u--]), n2 && !n2(o2, r2, a)) return false;
      r2 = this.stack[u--], o2 = this.stack[u--];
    }
    return true;
  }
  findAncestor(t2) {
    for (let u of this.#e()) if (t2(u)) return u;
  }
  hasAncestor(t2) {
    for (let u of this.#e()) if (t2(u)) return true;
    return false;
  }
  *#e() {
    let { stack: t2 } = this;
    for (let u = t2.length - 3; u >= 0; u -= 2) {
      let r2 = t2[u];
      Array.isArray(r2) || (yield r2);
    }
  }
};
var pr2 = Qt2;
function ko2(e2) {
  return e2 !== null && typeof e2 == "object";
}
__name(ko2, "ko");
var ge2 = ko2;
function ye2(e2) {
  return (t2, u, r2) => {
    let o2 = !!r2?.backwards;
    if (u === false) return false;
    let { length: n2 } = t2, a = u;
    for (; a >= 0 && a < n2; ) {
      let s2 = t2.charAt(a);
      if (e2 instanceof RegExp) {
        if (!e2.test(s2)) return a;
      } else if (!e2.includes(s2)) return a;
      o2 ? a-- : a++;
    }
    return a === -1 || a === n2 ? a : false;
  };
}
__name(ye2, "ye");
var Fr2 = ye2(/\s/u);
var Y2 = ye2(" 	");
var nt2 = ye2(",; 	");
var ot = ye2(/[^\n\r]/u);
var mr2 = /* @__PURE__ */ __name((e2) => e2 === `
` || e2 === "\r" || e2 === "\u2028" || e2 === "\u2029", "mr");
function vo2(e2, t2, u) {
  let r2 = !!u?.backwards;
  if (t2 === false) return false;
  let o2 = e2.charAt(t2);
  if (r2) {
    if (e2.charAt(t2 - 1) === "\r" && o2 === `
`) return t2 - 2;
    if (mr2(o2)) return t2 - 1;
  } else {
    if (o2 === "\r" && e2.charAt(t2 + 1) === `
`) return t2 + 2;
    if (mr2(o2)) return t2 + 1;
  }
  return t2;
}
__name(vo2, "vo");
var K2 = vo2;
function Ro2(e2, t2, u = {}) {
  let r2 = Y2(e2, u.backwards ? t2 - 1 : t2, u), o2 = K2(e2, r2, u);
  return r2 !== o2;
}
__name(Ro2, "Ro");
var z = Ro2;
function Lo2(e2) {
  return Array.isArray(e2) && e2.length > 0;
}
__name(Lo2, "Lo");
var Er2 = Lo2;
function* be2(e2, t2) {
  let { getVisitorKeys: u, filter: r2 = /* @__PURE__ */ __name(() => true, "r") } = t2, o2 = /* @__PURE__ */ __name((n2) => ge2(n2) && r2(n2), "o");
  for (let n2 of u(e2)) {
    let a = e2[n2];
    if (Array.isArray(a)) for (let s2 of a) o2(s2) && (yield s2);
    else o2(a) && (yield a);
  }
}
__name(be2, "be");
function* Cr2(e2, t2) {
  let u = [e2];
  for (let r2 = 0; r2 < u.length; r2++) {
    let o2 = u[r2];
    for (let n2 of be2(o2, t2)) yield n2, u.push(n2);
  }
}
__name(Cr2, "Cr");
function hr2(e2, t2) {
  return be2(e2, t2).next().done;
}
__name(hr2, "hr");
function gr2(e2, t2, u) {
  let { cache: r2 } = u;
  if (r2.has(e2)) return r2.get(e2);
  let { filter: o2 } = u;
  if (!o2) return [];
  let n2, a = (u.getChildren?.(e2, u) ?? [...be2(e2, { getVisitorKeys: u.getVisitorKeys })]).flatMap((D2) => (n2 ?? (n2 = [e2, ...t2]), o2(D2, n2) ? [D2] : gr2(D2, n2, u))), { locStart: s2, locEnd: i } = u;
  return a.sort((D2, f2) => s2(D2) - s2(f2) || i(D2) - i(f2)), r2.set(e2, a), a;
}
__name(gr2, "gr");
var at2 = gr2;
function Mo2(e2) {
  let t2 = e2.type || e2.kind || "(unknown type)", u = String(e2.name || e2.id && (typeof e2.id == "object" ? e2.id.name : e2.id) || e2.key && (typeof e2.key == "object" ? e2.key.name : e2.key) || e2.value && (typeof e2.value == "object" ? "" : String(e2.value)) || e2.operator || "");
  return u.length > 20 && (u = u.slice(0, 19) + "…"), t2 + (u ? " " + u : "");
}
__name(Mo2, "Mo");
function Zt2(e2, t2) {
  (e2.comments ?? (e2.comments = [])).push(t2), t2.printed = false, t2.nodeDescription = Mo2(e2);
}
__name(Zt2, "Zt");
function fe2(e2, t2) {
  t2.leading = true, t2.trailing = false, Zt2(e2, t2);
}
__name(fe2, "fe");
function ue2(e2, t2, u) {
  t2.leading = false, t2.trailing = false, u && (t2.marker = u), Zt2(e2, t2);
}
__name(ue2, "ue");
function le2(e2, t2) {
  t2.leading = false, t2.trailing = true, Zt2(e2, t2);
}
__name(le2, "le");
var uu = /* @__PURE__ */ new WeakMap();
function br2(e2, t2, u, r2, o2 = []) {
  let { locStart: n2, locEnd: a } = u, s2 = n2(t2), i = a(t2), D2 = at2(e2, o2, { cache: uu, locStart: n2, locEnd: a, getVisitorKeys: u.getVisitorKeys, filter: u.printer.canAttachComment, getChildren: u.printer.getCommentChildNodes }), f2, l3, d = 0, c2 = D2.length;
  for (; d < c2; ) {
    let p = d + c2 >> 1, F2 = D2[p], C2 = n2(F2), y2 = a(F2);
    if (C2 <= s2 && i <= y2) return br2(F2, t2, u, F2, [F2, ...o2]);
    if (y2 <= s2) {
      f2 = F2, d = p + 1;
      continue;
    }
    if (i <= C2) {
      l3 = F2, c2 = p;
      continue;
    }
    throw new Error("Comment location overlaps with node location");
  }
  if (r2?.type === "TemplateLiteral") {
    let { quasis: p } = r2, F2 = tu(p, t2, u);
    f2 && tu(p, f2, u) !== F2 && (f2 = null), l3 && tu(p, l3, u) !== F2 && (l3 = null);
  }
  return { enclosingNode: r2, precedingNode: f2, followingNode: l3 };
}
__name(br2, "br");
var eu = /* @__PURE__ */ __name(() => false, "eu");
function Ar2(e2, t2) {
  let { comments: u } = e2;
  if (delete e2.comments, !Er2(u) || !t2.printer.canAttachComment) return;
  let r2 = [], { printer: { features: { experimental_avoidAstMutation: o2 }, handleComments: n2 = {} }, originalText: a } = t2, { ownLine: s2 = eu, endOfLine: i = eu, remaining: D2 = eu } = n2, f2 = u.map((l3, d) => ({ ...br2(e2, l3, t2), comment: l3, text: a, options: t2, ast: e2, isLastComment: u.length - 1 === d }));
  for (let [l3, d] of f2.entries()) {
    let { comment: c2, precedingNode: p, enclosingNode: F2, followingNode: C2, text: y2, options: m, ast: h2, isLastComment: E2 } = d, g;
    if (o2 ? g = [d] : (c2.enclosingNode = F2, c2.precedingNode = p, c2.followingNode = C2, g = [c2, y2, m, h2, E2]), Yo(y2, m, f2, l3)) c2.placement = "ownLine", s2(...g) || (C2 ? fe2(C2, c2) : p ? le2(p, c2) : F2 ? ue2(F2, c2) : ue2(h2, c2));
    else if (jo(y2, m, f2, l3)) c2.placement = "endOfLine", i(...g) || (p ? le2(p, c2) : C2 ? fe2(C2, c2) : F2 ? ue2(F2, c2) : ue2(h2, c2));
    else if (c2.placement = "remaining", !D2(...g)) if (p && C2) {
      let A2 = r2.length;
      A2 > 0 && r2[A2 - 1].followingNode !== C2 && yr2(r2, m), r2.push(d);
    } else p ? le2(p, c2) : C2 ? fe2(C2, c2) : F2 ? ue2(F2, c2) : ue2(h2, c2);
  }
  if (yr2(r2, t2), !o2) for (let l3 of u) delete l3.precedingNode, delete l3.enclosingNode, delete l3.followingNode;
}
__name(Ar2, "Ar");
var _r2 = /* @__PURE__ */ __name((e2) => !/[\S\n\u2028\u2029]/u.test(e2), "_r");
function Yo(e2, t2, u, r2) {
  let { comment: o2, precedingNode: n2 } = u[r2], { locStart: a, locEnd: s2 } = t2, i = a(o2);
  if (n2) for (let D2 = r2 - 1; D2 >= 0; D2--) {
    let { comment: f2, precedingNode: l3 } = u[D2];
    if (l3 !== n2 || !_r2(e2.slice(s2(f2), i))) break;
    i = a(f2);
  }
  return z(e2, i, { backwards: true });
}
__name(Yo, "Yo");
function jo(e2, t2, u, r2) {
  let { comment: o2, followingNode: n2 } = u[r2], { locStart: a, locEnd: s2 } = t2, i = s2(o2);
  if (n2) for (let D2 = r2 + 1; D2 < u.length; D2++) {
    let { comment: f2, followingNode: l3 } = u[D2];
    if (l3 !== n2 || !_r2(e2.slice(i, a(f2)))) break;
    i = s2(f2);
  }
  return z(e2, i);
}
__name(jo, "jo");
function yr2(e2, t2) {
  let u = e2.length;
  if (u === 0) return;
  let { precedingNode: r2, followingNode: o2 } = e2[0], n2 = t2.locStart(o2), a;
  for (a = u; a > 0; --a) {
    let { comment: s2, precedingNode: i, followingNode: D2 } = e2[a - 1];
    P(i, r2), P(D2, o2);
    let f2 = t2.originalText.slice(t2.locEnd(s2), n2);
    if (t2.printer.isGap?.(f2, t2) ?? /^[\s(]*$/u.test(f2)) n2 = t2.locStart(s2);
    else break;
  }
  for (let [s2, { comment: i }] of e2.entries()) s2 < a ? le2(r2, i) : fe2(o2, i);
  for (let s2 of [r2, o2]) s2.comments && s2.comments.length > 1 && s2.comments.sort((i, D2) => t2.locStart(i) - t2.locStart(D2));
  e2.length = 0;
}
__name(yr2, "yr");
function tu(e2, t2, u) {
  let r2 = u.locStart(t2) - 1;
  for (let o2 = 1; o2 < e2.length; ++o2) if (r2 < u.locStart(e2[o2])) return o2 - 1;
  return 0;
}
__name(tu, "tu");
function Uo(e2, t2) {
  let u = t2 - 1;
  u = Y2(e2, u, { backwards: true }), u = K2(e2, u, { backwards: true }), u = Y2(e2, u, { backwards: true });
  let r2 = K2(e2, u, { backwards: true });
  return u !== r2;
}
__name(Uo, "Uo");
var Le2 = Uo;
function xr2(e2, t2) {
  let u = e2.node;
  return u.printed = true, t2.printer.printComment(e2, t2);
}
__name(xr2, "xr");
function Wo(e2, t2) {
  let u = e2.node, r2 = [xr2(e2, t2)], { printer: o2, originalText: n2, locStart: a, locEnd: s2 } = t2;
  if (o2.isBlockComment?.(u)) {
    let f2 = z(n2, s2(u)) ? z(n2, a(u), { backwards: true }) ? V3 : ut2 : " ";
    r2.push(f2);
  } else r2.push(V3);
  let D2 = K2(n2, Y2(n2, s2(u)));
  return D2 !== false && z(n2, D2) && r2.push(V3), r2;
}
__name(Wo, "Wo");
function $o(e2, t2, u) {
  let r2 = e2.node, o2 = xr2(e2, t2), { printer: n2, originalText: a, locStart: s2 } = t2, i = n2.isBlockComment?.(r2);
  if (u?.hasLineSuffix && !u?.isBlock || z(a, s2(r2), { backwards: true })) {
    let D2 = Le2(a, s2(r2));
    return { doc: ve2([V3, D2 ? V3 : "", o2]), isBlock: i, hasLineSuffix: true };
  }
  return !i || u?.hasLineSuffix ? { doc: [ve2([" ", o2]), ce2], isBlock: i, hasLineSuffix: true } : { doc: [" ", o2], isBlock: i, hasLineSuffix: false };
}
__name($o, "$o");
function Vo(e2, t2) {
  let u = e2.node;
  if (!u) return {};
  let r2 = t2[Symbol.for("printedComments")];
  if ((u.comments || []).filter((i) => !r2.has(i)).length === 0) return { leading: "", trailing: "" };
  let n2 = [], a = [], s2;
  return e2.each(() => {
    let i = e2.node;
    if (r2?.has(i)) return;
    let { leading: D2, trailing: f2 } = i;
    D2 ? n2.push(Wo(e2, t2)) : f2 && (s2 = $o(e2, t2, s2), a.push(s2.doc));
  }, "comments"), { leading: n2, trailing: a };
}
__name(Vo, "Vo");
function Br2(e2, t2, u) {
  let { leading: r2, trailing: o2 } = Vo(e2, u);
  return !r2 && !o2 ? t2 : Ee2(t2, (n2) => [r2, n2, o2]);
}
__name(Br2, "Br");
function Tr2(e2) {
  let { [Symbol.for("comments")]: t2, [Symbol.for("printedComments")]: u } = e2;
  for (let r2 of t2) {
    if (!r2.printed && !u.has(r2)) throw new Error('Comment "' + r2.value.trim() + '" was not printed. Please report this error!');
    delete r2.printed;
  }
}
__name(Tr2, "Tr");
var Nr2 = /* @__PURE__ */ __name(() => P, "Nr");
var Me2 = class extends Error {
  static {
    __name(this, "Me");
  }
  name = "ConfigError";
};
var Ye2 = class extends Error {
  static {
    __name(this, "Ye");
  }
  name = "UndefinedParserError";
};
var Sr2 = { checkIgnorePragma: { category: "Special", type: "boolean", default: false, description: "Check whether the file's first docblock comment contains '@noprettier' or '@noformat' to determine if it should be formatted.", cliCategory: "Other" }, cursorOffset: { category: "Special", type: "int", default: -1, range: { start: -1, end: 1 / 0, step: 1 }, description: "Print (to stderr) where a cursor at the given position would move to after formatting.", cliCategory: "Editor" }, endOfLine: { category: "Global", type: "choice", default: "lf", description: "Which end of line characters to apply.", choices: [{ value: "lf", description: "Line Feed only (\\n), common on Linux and macOS as well as inside git repos" }, { value: "crlf", description: "Carriage Return + Line Feed characters (\\r\\n), common on Windows" }, { value: "cr", description: "Carriage Return character only (\\r), used very rarely" }, { value: "auto", description: `Maintain existing
(mixed values within one file are normalised by looking at what's used after the first line)` }] }, filepath: { category: "Special", type: "path", description: "Specify the input filepath. This will be used to do parser inference.", cliName: "stdin-filepath", cliCategory: "Other", cliDescription: "Path to the file to pretend that stdin comes from." }, insertPragma: { category: "Special", type: "boolean", default: false, description: "Insert @format pragma into file's first docblock comment.", cliCategory: "Other" }, parser: { category: "Global", type: "choice", default: void 0, description: "Which parser to use.", exception: /* @__PURE__ */ __name((e2) => typeof e2 == "string" || typeof e2 == "function", "exception"), choices: [{ value: "flow", description: "Flow" }, { value: "babel", description: "JavaScript" }, { value: "babel-flow", description: "Flow" }, { value: "babel-ts", description: "TypeScript" }, { value: "typescript", description: "TypeScript" }, { value: "acorn", description: "JavaScript" }, { value: "espree", description: "JavaScript" }, { value: "meriyah", description: "JavaScript" }, { value: "css", description: "CSS" }, { value: "less", description: "Less" }, { value: "scss", description: "SCSS" }, { value: "json", description: "JSON" }, { value: "json5", description: "JSON5" }, { value: "jsonc", description: "JSON with Comments" }, { value: "json-stringify", description: "JSON.stringify" }, { value: "graphql", description: "GraphQL" }, { value: "markdown", description: "Markdown" }, { value: "mdx", description: "MDX" }, { value: "vue", description: "Vue" }, { value: "yaml", description: "YAML" }, { value: "glimmer", description: "Ember / Handlebars" }, { value: "html", description: "HTML" }, { value: "angular", description: "Angular" }, { value: "lwc", description: "Lightning Web Components" }, { value: "mjml", description: "MJML" }] }, plugins: { type: "path", array: true, default: [{ value: [] }], category: "Global", description: "Add a plugin. Multiple plugins can be passed as separate `--plugin`s.", exception: /* @__PURE__ */ __name((e2) => typeof e2 == "string" || typeof e2 == "object", "exception"), cliName: "plugin", cliCategory: "Config" }, printWidth: { category: "Global", type: "int", default: 80, description: "The line length where Prettier will try wrap.", range: { start: 0, end: 1 / 0, step: 1 } }, rangeEnd: { category: "Special", type: "int", default: 1 / 0, range: { start: 0, end: 1 / 0, step: 1 }, description: `Format code ending at a given character offset (exclusive).
The range will extend forwards to the end of the selected statement.`, cliCategory: "Editor" }, rangeStart: { category: "Special", type: "int", default: 0, range: { start: 0, end: 1 / 0, step: 1 }, description: `Format code starting at a given character offset.
The range will extend backwards to the start of the first line containing the selected statement.`, cliCategory: "Editor" }, requirePragma: { category: "Special", type: "boolean", default: false, description: "Require either '@prettier' or '@format' to be present in the file's first docblock comment in order for it to be formatted.", cliCategory: "Other" }, tabWidth: { type: "int", category: "Global", default: 2, description: "Number of spaces per indentation level.", range: { start: 0, end: 1 / 0, step: 1 } }, useTabs: { category: "Global", type: "boolean", default: false, description: "Indent with tabs instead of spaces." }, embeddedLanguageFormatting: { category: "Global", type: "choice", default: "auto", description: "Control how Prettier formats quoted code embedded in the file.", choices: [{ value: "auto", description: "Format embedded code if Prettier can automatically identify it." }, { value: "off", description: "Never automatically format embedded code." }] } };
function it2({ plugins: e2 = [], showDeprecated: t2 = false } = {}) {
  let u = e2.flatMap((o2) => o2.languages ?? []), r2 = [];
  for (let o2 of Go(Object.assign({}, ...e2.map(({ options: n2 }) => n2), Sr2))) !t2 && o2.deprecated || (Array.isArray(o2.choices) && (t2 || (o2.choices = o2.choices.filter((n2) => !n2.deprecated)), o2.name === "parser" && (o2.choices = [...o2.choices, ...Ko(o2.choices, u, e2)])), o2.pluginDefaults = Object.fromEntries(e2.filter((n2) => n2.defaultOptions?.[o2.name] !== void 0).map((n2) => [n2.name, n2.defaultOptions[o2.name]])), r2.push(o2));
  return { languages: u, options: r2 };
}
__name(it2, "it");
function* Ko(e2, t2, u) {
  let r2 = new Set(e2.map((o2) => o2.value));
  for (let o2 of t2) if (o2.parsers) {
    for (let n2 of o2.parsers) if (!r2.has(n2)) {
      r2.add(n2);
      let a = u.find((i) => i.parsers && Object.prototype.hasOwnProperty.call(i.parsers, n2)), s2 = o2.name;
      a?.name && (s2 += ` (plugin: ${a.name})`), yield { value: n2, description: s2 };
    }
  }
}
__name(Ko, "Ko");
function Go(e2) {
  let t2 = [];
  for (let [u, r2] of Object.entries(e2)) {
    let o2 = { name: u, ...r2 };
    Array.isArray(o2.default) && (o2.default = b2(0, o2.default, -1).value), t2.push(o2);
  }
  return t2;
}
__name(Go, "Go");
var zo = Array.prototype.toReversed ?? function() {
  return [...this].reverse();
};
var Jo = X2("toReversed", function() {
  if (Array.isArray(this)) return zo;
});
var wr2 = Jo;
function Ho() {
  let e2 = globalThis, t2 = e2.Deno?.build?.os;
  return typeof t2 == "string" ? t2 === "windows" : e2.navigator?.platform?.startsWith("Win") ?? e2.process?.platform?.startsWith("win") ?? false;
}
__name(Ho, "Ho");
var Xo = Ho();
function Or2(e2) {
  if (e2 = e2 instanceof URL ? e2 : new URL(e2), e2.protocol !== "file:") throw new TypeError(`URL must be a file URL: received "${e2.protocol}"`);
  return e2;
}
__name(Or2, "Or");
function qo2(e2) {
  return e2 = Or2(e2), decodeURIComponent(e2.pathname.replace(/%(?![0-9A-Fa-f]{2})/g, "%25"));
}
__name(qo2, "qo");
function Qo(e2) {
  e2 = Or2(e2);
  let t2 = decodeURIComponent(e2.pathname.replace(/\//g, "\\").replace(/%(?![0-9A-Fa-f]{2})/g, "%25")).replace(/^\\*([A-Za-z]:)(\\|$)/, "$1\\");
  return e2.hostname !== "" && (t2 = `\\\\${e2.hostname}${t2}`), t2;
}
__name(Qo, "Qo");
function ru(e2) {
  return Xo ? Qo(e2) : qo2(e2);
}
__name(ru, "ru");
var Pr2 = /* @__PURE__ */ __name((e2) => String(e2).split(/[/\\]/u).pop(), "Pr");
var Ir2 = /* @__PURE__ */ __name((e2) => String(e2).startsWith("file:"), "Ir");
function kr2(e2, t2) {
  if (!t2) return;
  let u = Pr2(t2).toLowerCase();
  return e2.find(({ filenames: r2 }) => r2?.some((o2) => o2.toLowerCase() === u)) ?? e2.find(({ extensions: r2 }) => r2?.some((o2) => u.endsWith(o2)));
}
__name(kr2, "kr");
function Zo(e2, t2) {
  if (t2) return e2.find(({ name: u }) => u.toLowerCase() === t2) ?? e2.find(({ aliases: u }) => u?.includes(t2)) ?? e2.find(({ extensions: u }) => u?.includes(`.${t2}`));
}
__name(Zo, "Zo");
var ea2 = void 0;
function vr2(e2, t2) {
  if (t2) {
    if (Ir2(t2)) try {
      t2 = ru(t2);
    } catch {
      return;
    }
    if (typeof t2 == "string") return e2.find(({ isSupported: u }) => u?.({ filepath: t2 }));
  }
}
__name(vr2, "vr");
function ta2(e2, t2) {
  let u = wr2(0, e2.plugins).flatMap((o2) => o2.languages ?? []);
  return (Zo(u, t2.language) ?? kr2(u, t2.physicalFile) ?? kr2(u, t2.file) ?? vr2(u, t2.physicalFile) ?? vr2(u, t2.file) ?? ea2?.(u, t2.physicalFile))?.parsers[0];
}
__name(ta2, "ta");
var st2 = ta2;
var ie2 = { key: /* @__PURE__ */ __name((e2) => /^[$_a-zA-Z][$_a-zA-Z0-9]*$/.test(e2) ? e2 : JSON.stringify(e2), "key"), value(e2) {
  if (e2 === null || typeof e2 != "object") return JSON.stringify(e2);
  if (Array.isArray(e2)) return `[${e2.map((u) => ie2.value(u)).join(", ")}]`;
  let t2 = Object.keys(e2);
  return t2.length === 0 ? "{}" : `{ ${t2.map((u) => `${ie2.key(u)}: ${ie2.value(e2[u])}`).join(", ")} }`;
}, pair: /* @__PURE__ */ __name(({ key: e2, value: t2 }) => ie2.value({ [e2]: t2 }), "pair") };
var nu = new Proxy(String, { get: /* @__PURE__ */ __name(() => nu, "get") });
var $2 = nu;
var ou = /* @__PURE__ */ __name(() => nu, "ou");
var Rr2 = /* @__PURE__ */ __name((e2, t2, { descriptor: u }) => {
  let r2 = [`${$2.yellow(typeof e2 == "string" ? u.key(e2) : u.pair(e2))} is deprecated`];
  return t2 && r2.push(`we now treat it as ${$2.blue(typeof t2 == "string" ? u.key(t2) : u.pair(t2))}`), r2.join("; ") + ".";
}, "Rr");
var Dt2 = Symbol.for("vnopts.VALUE_NOT_EXIST");
var Ae2 = Symbol.for("vnopts.VALUE_UNCHANGED");
var Lr2 = " ".repeat(2);
var Yr2 = /* @__PURE__ */ __name((e2, t2, u) => {
  let { text: r2, list: o2 } = u.normalizeExpectedResult(u.schemas[e2].expected(u)), n2 = [];
  return r2 && n2.push(Mr2(e2, t2, r2, u.descriptor)), o2 && n2.push([Mr2(e2, t2, o2.title, u.descriptor)].concat(o2.values.map((a) => jr2(a, u.loggerPrintWidth))).join(`
`)), Ur2(n2, u.loggerPrintWidth);
}, "Yr");
function Mr2(e2, t2, u, r2) {
  return [`Invalid ${$2.red(r2.key(e2))} value.`, `Expected ${$2.blue(u)},`, `but received ${t2 === Dt2 ? $2.gray("nothing") : $2.red(r2.value(t2))}.`].join(" ");
}
__name(Mr2, "Mr");
function jr2({ text: e2, list: t2 }, u) {
  let r2 = [];
  return e2 && r2.push(`- ${$2.blue(e2)}`), t2 && r2.push([`- ${$2.blue(t2.title)}:`].concat(t2.values.map((o2) => jr2(o2, u - Lr2.length).replace(/^|\n/g, `$&${Lr2}`))).join(`
`)), Ur2(r2, u);
}
__name(jr2, "jr");
function Ur2(e2, t2) {
  if (e2.length === 1) return e2[0];
  let [u, r2] = e2, [o2, n2] = e2.map((a) => a.split(`
`, 1)[0].length);
  return o2 > t2 && o2 > n2 ? r2 : u;
}
__name(Ur2, "Ur");
var _e2 = [];
var au = [];
function ct2(e2, t2, u) {
  if (e2 === t2) return 0;
  let r2 = u?.maxDistance, o2 = e2;
  e2.length > t2.length && (e2 = t2, t2 = o2);
  let n2 = e2.length, a = t2.length;
  for (; n2 > 0 && e2.charCodeAt(~-n2) === t2.charCodeAt(~-a); ) n2--, a--;
  let s2 = 0;
  for (; s2 < n2 && e2.charCodeAt(s2) === t2.charCodeAt(s2); ) s2++;
  if (n2 -= s2, a -= s2, r2 !== void 0 && a - n2 > r2) return r2;
  if (n2 === 0) return r2 !== void 0 && a > r2 ? r2 : a;
  let i, D2, f2, l3, d = 0, c2 = 0;
  for (; d < n2; ) au[d] = e2.charCodeAt(s2 + d), _e2[d] = ++d;
  for (; c2 < a; ) {
    for (i = t2.charCodeAt(s2 + c2), f2 = c2++, D2 = c2, d = 0; d < n2; d++) l3 = i === au[d] ? f2 : f2 + 1, f2 = _e2[d], D2 = _e2[d] = f2 > D2 ? l3 > D2 ? D2 + 1 : l3 : l3 > f2 ? f2 + 1 : l3;
    if (r2 !== void 0) {
      let p = D2;
      for (d = 0; d < n2; d++) _e2[d] < p && (p = _e2[d]);
      if (p > r2) return r2;
    }
  }
  return _e2.length = n2, au.length = n2, r2 !== void 0 && D2 > r2 ? r2 : D2;
}
__name(ct2, "ct");
function Wr2(e2, t2, u) {
  if (!Array.isArray(t2) || t2.length === 0) return;
  let r2 = u?.maxDistance, o2 = e2.length;
  for (let i of t2) if (i === e2) return i;
  if (r2 === 0) return;
  let n2, a = Number.POSITIVE_INFINITY, s2 = /* @__PURE__ */ new Set();
  for (let i of t2) {
    if (s2.has(i)) continue;
    s2.add(i);
    let D2 = Math.abs(i.length - o2);
    if (D2 >= a || r2 !== void 0 && D2 > r2) continue;
    let f2 = Number.isFinite(a) ? r2 === void 0 ? a : Math.min(a, r2) : r2, l3 = f2 === void 0 ? ct2(e2, i) : ct2(e2, i, { maxDistance: f2 });
    if (r2 !== void 0 && l3 > r2) continue;
    let d = l3;
    if (f2 !== void 0 && l3 === f2 && f2 === r2 && (d = ct2(e2, i)), d < a && (a = d, n2 = i, a === 0)) break;
  }
  if (!(r2 !== void 0 && a > r2)) return n2;
}
__name(Wr2, "Wr");
var ft2 = /* @__PURE__ */ __name((e2, t2, { descriptor: u, logger: r2, schemas: o2 }) => {
  let n2 = [`Ignored unknown option ${$2.yellow(u.pair({ key: e2, value: t2 }))}.`], a = Wr2(e2, Object.keys(o2), { maxDistance: 3 });
  a && n2.push(`Did you mean ${$2.blue(u.key(a))}?`), r2.warn(n2.join(" "));
}, "ft");
var ua2 = ["default", "expected", "validate", "deprecated", "forward", "redirect", "overlap", "preprocess", "postprocess"];
function ra2(e2, t2) {
  let u = new e2(t2), r2 = Object.create(u);
  for (let o2 of ua2) o2 in t2 && (r2[o2] = na2(t2[o2], u, S2.prototype[o2].length));
  return r2;
}
__name(ra2, "ra");
var S2 = class {
  static {
    __name(this, "S");
  }
  static create(t2) {
    return ra2(this, t2);
  }
  constructor(t2) {
    this.name = t2.name;
  }
  default(t2) {
  }
  expected(t2) {
    return "nothing";
  }
  validate(t2, u) {
    return false;
  }
  deprecated(t2, u) {
    return false;
  }
  forward(t2, u) {
  }
  redirect(t2, u) {
  }
  overlap(t2, u, r2) {
    return t2;
  }
  preprocess(t2, u) {
    return t2;
  }
  postprocess(t2, u) {
    return Ae2;
  }
};
function na2(e2, t2, u) {
  return typeof e2 == "function" ? (...r2) => e2(...r2.slice(0, u - 1), t2, ...r2.slice(u - 1)) : () => e2;
}
__name(na2, "na");
var lt2 = class extends S2 {
  static {
    __name(this, "lt");
  }
  constructor(t2) {
    super(t2), this._sourceName = t2.sourceName;
  }
  expected(t2) {
    return t2.schemas[this._sourceName].expected(t2);
  }
  validate(t2, u) {
    return u.schemas[this._sourceName].validate(t2, u);
  }
  redirect(t2, u) {
    return this._sourceName;
  }
};
var dt2 = class extends S2 {
  static {
    __name(this, "dt");
  }
  expected() {
    return "anything";
  }
  validate() {
    return true;
  }
};
var pt2 = class extends S2 {
  static {
    __name(this, "pt");
  }
  constructor({ valueSchema: t2, name: u = t2.name, ...r2 }) {
    super({ ...r2, name: u }), this._valueSchema = t2;
  }
  expected(t2) {
    let { text: u, list: r2 } = t2.normalizeExpectedResult(this._valueSchema.expected(t2));
    return { text: u && `an array of ${u}`, list: r2 && { title: "an array of the following values", values: [{ list: r2 }] } };
  }
  validate(t2, u) {
    if (!Array.isArray(t2)) return false;
    let r2 = [];
    for (let o2 of t2) {
      let n2 = u.normalizeValidateResult(this._valueSchema.validate(o2, u), o2);
      n2 !== true && r2.push(n2.value);
    }
    return r2.length === 0 ? true : { value: r2 };
  }
  deprecated(t2, u) {
    let r2 = [];
    for (let o2 of t2) {
      let n2 = u.normalizeDeprecatedResult(this._valueSchema.deprecated(o2, u), o2);
      n2 !== false && r2.push(...n2.map(({ value: a }) => ({ value: [a] })));
    }
    return r2;
  }
  forward(t2, u) {
    let r2 = [];
    for (let o2 of t2) {
      let n2 = u.normalizeForwardResult(this._valueSchema.forward(o2, u), o2);
      r2.push(...n2.map($r2));
    }
    return r2;
  }
  redirect(t2, u) {
    let r2 = [], o2 = [];
    for (let n2 of t2) {
      let a = u.normalizeRedirectResult(this._valueSchema.redirect(n2, u), n2);
      "remain" in a && r2.push(a.remain), o2.push(...a.redirect.map($r2));
    }
    return r2.length === 0 ? { redirect: o2 } : { redirect: o2, remain: r2 };
  }
  overlap(t2, u) {
    return t2.concat(u);
  }
};
function $r2({ from: e2, to: t2 }) {
  return { from: [e2], to: t2 };
}
__name($r2, "$r");
var Ft2 = class extends S2 {
  static {
    __name(this, "Ft");
  }
  expected() {
    return "true or false";
  }
  validate(t2) {
    return typeof t2 == "boolean";
  }
};
function Kr2(e2, t2) {
  let u = /* @__PURE__ */ Object.create(null);
  for (let r2 of e2) {
    let o2 = r2[t2];
    if (u[o2]) throw new Error(`Duplicate ${t2} ${JSON.stringify(o2)}`);
    u[o2] = r2;
  }
  return u;
}
__name(Kr2, "Kr");
function Gr2(e2, t2) {
  let u = /* @__PURE__ */ new Map();
  for (let r2 of e2) {
    let o2 = r2[t2];
    if (u.has(o2)) throw new Error(`Duplicate ${t2} ${JSON.stringify(o2)}`);
    u.set(o2, r2);
  }
  return u;
}
__name(Gr2, "Gr");
function zr2() {
  let e2 = /* @__PURE__ */ Object.create(null);
  return (t2) => {
    let u = JSON.stringify(t2);
    return e2[u] ? true : (e2[u] = true, false);
  };
}
__name(zr2, "zr");
function Jr2(e2, t2) {
  let u = [], r2 = [];
  for (let o2 of e2) t2(o2) ? u.push(o2) : r2.push(o2);
  return [u, r2];
}
__name(Jr2, "Jr");
function Hr2(e2) {
  return e2 === Math.floor(e2);
}
__name(Hr2, "Hr");
function Xr2(e2, t2) {
  if (e2 === t2) return 0;
  let u = typeof e2, r2 = typeof t2, o2 = ["undefined", "object", "boolean", "number", "string"];
  return u !== r2 ? o2.indexOf(u) - o2.indexOf(r2) : u !== "string" ? Number(e2) - Number(t2) : e2.localeCompare(t2);
}
__name(Xr2, "Xr");
function qr2(e2) {
  return (...t2) => {
    let u = e2(...t2);
    return typeof u == "string" ? new Error(u) : u;
  };
}
__name(qr2, "qr");
function iu(e2) {
  return e2 === void 0 ? {} : e2;
}
__name(iu, "iu");
function su(e2) {
  if (typeof e2 == "string") return { text: e2 };
  let { text: t2, list: u } = e2;
  return oa2((t2 || u) !== void 0, "Unexpected `expected` result, there should be at least one field."), u ? { text: t2, list: { title: u.title, values: u.values.map(su) } } : { text: t2 };
}
__name(su, "su");
function Du(e2, t2) {
  return e2 === true ? true : e2 === false ? { value: t2 } : e2;
}
__name(Du, "Du");
function cu(e2, t2, u = false) {
  return e2 === false ? false : e2 === true ? u ? true : [{ value: t2 }] : "value" in e2 ? [e2] : e2.length === 0 ? false : e2;
}
__name(cu, "cu");
function Vr2(e2, t2) {
  return typeof e2 == "string" || "key" in e2 ? { from: t2, to: e2 } : "from" in e2 ? { from: e2.from, to: e2.to } : { from: t2, to: e2.to };
}
__name(Vr2, "Vr");
function mt2(e2, t2) {
  return e2 === void 0 ? [] : Array.isArray(e2) ? e2.map((u) => Vr2(u, t2)) : [Vr2(e2, t2)];
}
__name(mt2, "mt");
function fu(e2, t2) {
  let u = mt2(typeof e2 == "object" && "redirect" in e2 ? e2.redirect : e2, t2);
  return u.length === 0 ? { remain: t2, redirect: u } : typeof e2 == "object" && "remain" in e2 ? { remain: e2.remain, redirect: u } : { redirect: u };
}
__name(fu, "fu");
function oa2(e2, t2) {
  if (!e2) throw new Error(t2);
}
__name(oa2, "oa");
var Et2 = class extends S2 {
  static {
    __name(this, "Et");
  }
  constructor(t2) {
    super(t2), this._choices = Gr2(t2.choices.map((u) => u && typeof u == "object" ? u : { value: u }), "value");
  }
  expected({ descriptor: t2 }) {
    let u = Array.from(this._choices.keys()).map((a) => this._choices.get(a)).filter(({ hidden: a }) => !a).map((a) => a.value).sort(Xr2).map(t2.value), r2 = u.slice(0, -2), o2 = u.slice(-2);
    return { text: r2.concat(o2.join(" or ")).join(", "), list: { title: "one of the following values", values: u } };
  }
  validate(t2) {
    return this._choices.has(t2);
  }
  deprecated(t2) {
    let u = this._choices.get(t2);
    return u && u.deprecated ? { value: t2 } : false;
  }
  forward(t2) {
    let u = this._choices.get(t2);
    return u ? u.forward : void 0;
  }
  redirect(t2) {
    let u = this._choices.get(t2);
    return u ? u.redirect : void 0;
  }
};
var Ct2 = class extends S2 {
  static {
    __name(this, "Ct");
  }
  expected() {
    return "a number";
  }
  validate(t2, u) {
    return typeof t2 == "number";
  }
};
var ht2 = class extends Ct2 {
  static {
    __name(this, "ht");
  }
  expected() {
    return "an integer";
  }
  validate(t2, u) {
    return u.normalizeValidateResult(super.validate(t2, u), t2) === true && Hr2(t2);
  }
};
var je2 = class extends S2 {
  static {
    __name(this, "je");
  }
  expected() {
    return "a string";
  }
  validate(t2) {
    return typeof t2 == "string";
  }
};
var Qr2 = ie2;
var Zr2 = ft2;
var en2 = Yr2;
var tn2 = Rr2;
var gt2 = class {
  static {
    __name(this, "gt");
  }
  constructor(t2, u) {
    let { logger: r2 = console, loggerPrintWidth: o2 = 80, descriptor: n2 = Qr2, unknown: a = Zr2, invalid: s2 = en2, deprecated: i = tn2, missing: D2 = /* @__PURE__ */ __name(() => false, "D"), required: f2 = /* @__PURE__ */ __name(() => false, "f"), preprocess: l3 = /* @__PURE__ */ __name((c2) => c2, "l"), postprocess: d = /* @__PURE__ */ __name(() => Ae2, "d") } = u || {};
    this._utils = { descriptor: n2, logger: r2 || { warn: /* @__PURE__ */ __name(() => {
    }, "warn") }, loggerPrintWidth: o2, schemas: Kr2(t2, "name"), normalizeDefaultResult: iu, normalizeExpectedResult: su, normalizeDeprecatedResult: cu, normalizeForwardResult: mt2, normalizeRedirectResult: fu, normalizeValidateResult: Du }, this._unknownHandler = a, this._invalidHandler = qr2(s2), this._deprecatedHandler = i, this._identifyMissing = (c2, p) => !(c2 in p) || D2(c2, p), this._identifyRequired = f2, this._preprocess = l3, this._postprocess = d, this.cleanHistory();
  }
  cleanHistory() {
    this._hasDeprecationWarned = zr2();
  }
  normalize(t2) {
    let u = {}, o2 = [this._preprocess(t2, this._utils)], n2 = /* @__PURE__ */ __name(() => {
      for (; o2.length !== 0; ) {
        let a = o2.shift(), s2 = this._applyNormalization(a, u);
        o2.push(...s2);
      }
    }, "n");
    n2();
    for (let a of Object.keys(this._utils.schemas)) {
      let s2 = this._utils.schemas[a];
      if (!(a in u)) {
        let i = iu(s2.default(this._utils));
        "value" in i && o2.push({ [a]: i.value });
      }
    }
    n2();
    for (let a of Object.keys(this._utils.schemas)) {
      if (!(a in u)) continue;
      let s2 = this._utils.schemas[a], i = u[a], D2 = s2.postprocess(i, this._utils);
      D2 !== Ae2 && (this._applyValidation(D2, a, s2), u[a] = D2);
    }
    return this._applyPostprocess(u), this._applyRequiredCheck(u), u;
  }
  _applyNormalization(t2, u) {
    let r2 = [], { knownKeys: o2, unknownKeys: n2 } = this._partitionOptionKeys(t2);
    for (let a of o2) {
      let s2 = this._utils.schemas[a], i = s2.preprocess(t2[a], this._utils);
      this._applyValidation(i, a, s2);
      let D2 = /* @__PURE__ */ __name(({ from: c2, to: p }) => {
        r2.push(typeof p == "string" ? { [p]: c2 } : { [p.key]: p.value });
      }, "D"), f2 = /* @__PURE__ */ __name(({ value: c2, redirectTo: p }) => {
        let F2 = cu(s2.deprecated(c2, this._utils), i, true);
        if (F2 !== false) if (F2 === true) this._hasDeprecationWarned(a) || this._utils.logger.warn(this._deprecatedHandler(a, p, this._utils));
        else for (let { value: C2 } of F2) {
          let y2 = { key: a, value: C2 };
          if (!this._hasDeprecationWarned(y2)) {
            let m = typeof p == "string" ? { key: p, value: C2 } : p;
            this._utils.logger.warn(this._deprecatedHandler(y2, m, this._utils));
          }
        }
      }, "f");
      mt2(s2.forward(i, this._utils), i).forEach(D2);
      let d = fu(s2.redirect(i, this._utils), i);
      if (d.redirect.forEach(D2), "remain" in d) {
        let c2 = d.remain;
        u[a] = a in u ? s2.overlap(u[a], c2, this._utils) : c2, f2({ value: c2 });
      }
      for (let { from: c2, to: p } of d.redirect) f2({ value: c2, redirectTo: p });
    }
    for (let a of n2) {
      let s2 = t2[a];
      this._applyUnknownHandler(a, s2, u, (i, D2) => {
        r2.push({ [i]: D2 });
      });
    }
    return r2;
  }
  _applyRequiredCheck(t2) {
    for (let u of Object.keys(this._utils.schemas)) if (this._identifyMissing(u, t2) && this._identifyRequired(u)) throw this._invalidHandler(u, Dt2, this._utils);
  }
  _partitionOptionKeys(t2) {
    let [u, r2] = Jr2(Object.keys(t2).filter((o2) => !this._identifyMissing(o2, t2)), (o2) => o2 in this._utils.schemas);
    return { knownKeys: u, unknownKeys: r2 };
  }
  _applyValidation(t2, u, r2) {
    let o2 = Du(r2.validate(t2, this._utils), t2);
    if (o2 !== true) throw this._invalidHandler(u, o2.value, this._utils);
  }
  _applyUnknownHandler(t2, u, r2, o2) {
    let n2 = this._unknownHandler(t2, u, this._utils);
    if (n2) for (let a of Object.keys(n2)) {
      if (this._identifyMissing(a, n2)) continue;
      let s2 = n2[a];
      a in this._utils.schemas ? o2(a, s2) : r2[a] = s2;
    }
  }
  _applyPostprocess(t2) {
    let u = this._postprocess(t2, this._utils);
    if (u !== Ae2) {
      if (u.delete) for (let r2 of u.delete) delete t2[r2];
      if (u.override) {
        let { knownKeys: r2, unknownKeys: o2 } = this._partitionOptionKeys(u.override);
        for (let n2 of r2) {
          let a = u.override[n2];
          this._applyValidation(a, n2, this._utils.schemas[n2]), t2[n2] = a;
        }
        for (let n2 of o2) {
          let a = u.override[n2];
          this._applyUnknownHandler(n2, a, t2, (s2, i) => {
            let D2 = this._utils.schemas[s2];
            this._applyValidation(i, s2, D2), t2[s2] = i;
          });
        }
      }
    }
  }
};
var lu;
function ia2(e2, t2, { logger: u = false, isCLI: r2 = false, passThrough: o2 = false, FlagSchema: n2, descriptor: a } = {}) {
  if (r2) {
    if (!n2) throw new Error("'FlagSchema' option is required.");
    if (!a) throw new Error("'descriptor' option is required.");
  } else a = ie2;
  let s2 = o2 ? Array.isArray(o2) ? (d, c2) => o2.includes(d) ? { [d]: c2 } : void 0 : (d, c2) => ({ [d]: c2 }) : (d, c2, p) => {
    let { _: F2, ...C2 } = p.schemas;
    return ft2(d, c2, { ...p, schemas: C2 });
  }, i = sa2(t2, { isCLI: r2, FlagSchema: n2 }), D2 = new gt2(i, { logger: u, unknown: s2, descriptor: a }), f2 = u !== false;
  f2 && lu && (D2._hasDeprecationWarned = lu);
  let l3 = D2.normalize(e2);
  return f2 && (lu = D2._hasDeprecationWarned), l3;
}
__name(ia2, "ia");
function sa2(e2, { isCLI: t2, FlagSchema: u }) {
  let r2 = [];
  t2 && r2.push(dt2.create({ name: "_" }));
  for (let o2 of e2) r2.push(Da2(o2, { isCLI: t2, optionInfos: e2, FlagSchema: u })), o2.alias && t2 && r2.push(lt2.create({ name: o2.alias, sourceName: o2.name }));
  return r2;
}
__name(sa2, "sa");
function Da2(e2, { isCLI: t2, optionInfos: u, FlagSchema: r2 }) {
  let { name: o2 } = e2, n2 = { name: o2 }, a, s2 = {};
  switch (e2.type) {
    case "int":
      a = ht2, t2 && (n2.preprocess = Number);
      break;
    case "string":
      a = je2;
      break;
    case "choice":
      a = Et2, n2.choices = e2.choices.map((i) => i?.redirect ? { ...i, redirect: { to: { key: e2.name, value: i.redirect } } } : i);
      break;
    case "boolean":
      a = Ft2;
      break;
    case "flag":
      a = r2, n2.flags = u.flatMap((i) => [i.alias, i.description && i.name, i.oppositeDescription && `no-${i.name}`].filter(Boolean));
      break;
    case "path":
      a = je2;
      break;
    default:
      throw new Error(`Unexpected type ${e2.type}`);
  }
  if (e2.exception ? n2.validate = (i, D2, f2) => e2.exception(i) || D2.validate(i, f2) : n2.validate = (i, D2, f2) => i === void 0 || D2.validate(i, f2), e2.redirect && (s2.redirect = (i) => i ? { to: typeof e2.redirect == "string" ? e2.redirect : { key: e2.redirect.option, value: e2.redirect.value } } : void 0), e2.deprecated && (s2.deprecated = true), t2 && !e2.array) {
    let i = n2.preprocess || ((D2) => D2);
    n2.preprocess = (D2, f2, l3) => f2.preprocess(i(Array.isArray(D2) ? b2(0, D2, -1) : D2), l3);
  }
  return e2.array ? pt2.create({ ...t2 ? { preprocess: /* @__PURE__ */ __name((i) => Array.isArray(i) ? i : [i], "preprocess") } : {}, ...s2, valueSchema: a.create(n2) }) : a.create({ ...n2, ...s2 });
}
__name(Da2, "Da");
var un2 = ia2;
var ca2 = Array.prototype.findLast ?? function(e2) {
  for (let t2 = this.length - 1; t2 >= 0; t2--) {
    let u = this[t2];
    if (e2(u, t2, this)) return u;
  }
};
var fa2 = X2("findLast", function() {
  if (Array.isArray(this)) return ca2;
});
var du = fa2;
var rn2 = Symbol.for("PRETTIER_IS_FRONT_MATTER");
var pu = [];
function la2(e2) {
  return !!e2?.[rn2];
}
__name(la2, "la");
var de2 = la2;
var nn2 = /* @__PURE__ */ new Set(["yaml", "toml"]);
var Ue2 = /* @__PURE__ */ __name(({ node: e2 }) => de2(e2) && nn2.has(e2.language), "Ue");
async function Fu(e2, t2, u, r2) {
  let { node: o2 } = u, { language: n2 } = o2;
  if (!nn2.has(n2)) return;
  let a = o2.value.trim(), s2;
  if (a) {
    let i = n2 === "yaml" ? n2 : st2(r2, { language: n2 });
    if (!i) return;
    s2 = a ? await e2(a, { parser: i }) : "";
  } else s2 = a;
  return et2([o2.startDelimiter, o2.explicitLanguage ?? "", V3, s2, s2 ? V3 : "", o2.endDelimiter]);
}
__name(Fu, "Fu");
function da2(e2, t2) {
  return Ue2({ node: e2 }) && (delete t2.end, delete t2.raw, delete t2.value), t2;
}
__name(da2, "da");
var mu = da2;
function pa2({ node: e2 }) {
  return e2.raw;
}
__name(pa2, "pa");
var Eu = pa2;
var on2 = /* @__PURE__ */ new Set(["tokens", "comments", "parent", "enclosingNode", "precedingNode", "followingNode"]);
var Fa2 = /* @__PURE__ */ __name((e2) => Object.keys(e2).filter((t2) => !on2.has(t2)), "Fa");
function ma2(e2, t2) {
  let u = e2 ? (r2) => e2(r2, on2) : Fa2;
  return t2 ? new Proxy(u, { apply: /* @__PURE__ */ __name((r2, o2, n2) => de2(n2[0]) ? pu : Reflect.apply(r2, o2, n2), "apply") }) : u;
}
__name(ma2, "ma");
var Cu = ma2;
function gu(e2, t2) {
  if (!t2) throw new Error("parserName is required.");
  let u = du(0, e2, (o2) => o2.parsers && Object.prototype.hasOwnProperty.call(o2.parsers, t2));
  if (u) return u;
  let r2 = `Couldn't resolve parser "${t2}".`;
  throw r2 += " Plugins must be explicitly added to the standalone bundle.", new Me2(r2);
}
__name(gu, "gu");
function an2(e2, t2) {
  if (!t2) throw new Error("astFormat is required.");
  let u = du(0, e2, (o2) => o2.printers && Object.prototype.hasOwnProperty.call(o2.printers, t2));
  if (u) return u;
  let r2 = `Couldn't find plugin for AST format "${t2}".`;
  throw r2 += " Plugins must be explicitly added to the standalone bundle.", new Me2(r2);
}
__name(an2, "an");
function We2({ plugins: e2, parser: t2 }) {
  let u = gu(e2, t2);
  return yu(u, t2);
}
__name(We2, "We");
function yu(e2, t2) {
  let u = e2.parsers[t2];
  return typeof u == "function" ? u() : u;
}
__name(yu, "yu");
async function sn2(e2, t2) {
  let u = e2.printers[t2], r2 = typeof u == "function" ? await u() : u;
  return Ea2(r2);
}
__name(sn2, "sn");
var hu = /* @__PURE__ */ new WeakMap();
var q0 = Symbol("PRINTER_NORMALIZED_MARK");
function Ea2(e2) {
  if (hu.has(e2)) return hu.get(e2);
  let { features: t2, getVisitorKeys: u, embed: r2, massageAstNode: o2, print: n2, ...a } = e2;
  t2 = ya2(t2);
  let s2 = t2.experimental_frontMatterSupport;
  u = Cu(u, s2.massageAstNode || s2.embed || s2.print);
  let i = o2;
  o2 && s2.massageAstNode && (i = new Proxy(o2, { apply(d, c2, p) {
    return mu(...p), Reflect.apply(d, c2, p);
  } }));
  let D2 = r2;
  if (r2) {
    let d;
    D2 = new Proxy(r2, { get(c2, p, F2) {
      return p === "getVisitorKeys" ? (d ?? (d = r2.getVisitorKeys ? Cu(r2.getVisitorKeys, s2.massageAstNode || s2.embed) : u), d) : Reflect.get(c2, p, F2);
    }, apply: /* @__PURE__ */ __name((c2, p, F2) => s2.embed && Ue2(...F2) ? Fu : Reflect.apply(c2, p, F2), "apply") });
  }
  let f2 = n2;
  s2.print && (f2 = new Proxy(n2, { apply(d, c2, p) {
    let [F2] = p;
    return de2(F2.node) ? Eu(F2) : Reflect.apply(d, c2, p);
  } }));
  let l3 = { features: t2, getVisitorKeys: u, embed: D2, massageAstNode: i, print: f2, ...a };
  return hu.set(e2, l3), l3;
}
__name(Ea2, "Ea");
var Ca2 = ["clean", "embed", "print"];
var ha2 = Object.fromEntries(Ca2.map((e2) => [e2, false]));
function ga2(e2) {
  return { ...ha2, ...e2 };
}
__name(ga2, "ga");
function ya2(e2) {
  return { experimental_avoidAstMutation: false, ...e2, experimental_frontMatterSupport: ga2(e2?.experimental_frontMatterSupport) };
}
__name(ya2, "ya");
var Dn2 = { astFormat: "estree", printer: {}, originalText: void 0, locStart: null, locEnd: null, getVisitorKeys: null };
async function ba2(e2, t2 = {}) {
  let u = { ...e2 };
  if (!u.parser) if (u.filepath) {
    if (u.parser = st2(u, { physicalFile: u.filepath }), !u.parser) throw new Ye2(`No parser could be inferred for file "${u.filepath}".`);
  } else throw new Ye2("No parser and no file path given, couldn't infer a parser.");
  let r2 = it2({ plugins: e2.plugins, showDeprecated: true }).options, o2 = { ...Dn2, ...Object.fromEntries(r2.filter((l3) => l3.default !== void 0).map((l3) => [l3.name, l3.default])) }, n2 = gu(u.plugins, u.parser), a = await yu(n2, u.parser);
  u.astFormat = a.astFormat, u.locEnd = a.locEnd, u.locStart = a.locStart;
  let s2 = n2.printers?.[a.astFormat] ? n2 : an2(u.plugins, a.astFormat), i = await sn2(s2, a.astFormat);
  u.printer = i, u.getVisitorKeys = i.getVisitorKeys;
  let D2 = s2.defaultOptions ? Object.fromEntries(Object.entries(s2.defaultOptions).filter(([, l3]) => l3 !== void 0)) : {}, f2 = { ...o2, ...D2 };
  for (let [l3, d] of Object.entries(f2)) (u[l3] === null || u[l3] === void 0) && (u[l3] = d);
  return u.parser === "json" && (u.trailingComma = "none"), un2(u, r2, { passThrough: Object.keys(Dn2), ...t2 });
}
__name(ba2, "ba");
var se2 = ba2;
var pf = ao2(dn2(), 1);
var Au = "ªµºÀ-ÖØ-öø-ˁˆ-ˑˠ-ˤˬˮͰ-ʹͶͷͺ-ͽͿΆΈ-ΊΌΎ-ΡΣ-ϵϷ-ҁҊ-ԯԱ-Ֆՙՠ-ֈא-תׯ-ײؠ-يٮٯٱ-ۓەۥۦۮۯۺ-ۼۿܐܒ-ܯݍ-ޥޱߊ-ߪߴߵߺࠀ-ࠕࠚࠤࠨࡀ-ࡘࡠ-ࡪࡰ-ࢇࢉ-࢏ࢠ-ࣉऄ-हऽॐक़-ॡॱ-ঀঅ-ঌএঐও-নপ-রলশ-হঽৎড়ঢ়য়-ৡৰৱৼਅ-ਊਏਐਓ-ਨਪ-ਰਲਲ਼ਵਸ਼ਸਹਖ਼-ੜਫ਼ੲ-ੴઅ-ઍએ-ઑઓ-નપ-રલળવ-હઽૐૠૡૹଅ-ଌଏଐଓ-ନପ-ରଲଳଵ-ହଽଡ଼ଢ଼ୟ-ୡୱஃஅ-ஊஎ-ஐஒ-கஙசஜஞடணதந-பம-ஹௐఅ-ఌఎ-ఐఒ-నప-హఽౘ-ౚ౜ౝౠౡಀಅ-ಌಎ-ಐಒ-ನಪ-ಳವ-ಹಽ೜-ೞೠೡೱೲഄ-ഌഎ-ഐഒ-ഺഽൎൔ-ൖൟ-ൡൺ-ൿඅ-ඖක-නඳ-රලව-ෆก-ะาำเ-ๆກຂຄຆ-ຊຌ-ຣລວ-ະາຳຽເ-ໄໆໜ-ໟༀཀ-ཇཉ-ཬྈ-ྌက-ဪဿၐ-ၕၚ-ၝၡၥၦၮ-ၰၵ-ႁႎႠ-ჅჇჍა-ჺჼ-ቈቊ-ቍቐ-ቖቘቚ-ቝበ-ኈኊ-ኍነ-ኰኲ-ኵኸ-ኾዀዂ-ዅወ-ዖዘ-ጐጒ-ጕጘ-ፚᎀ-ᎏᎠ-Ᏽᏸ-ᏽᐁ-ᙬᙯ-ᙿᚁ-ᚚᚠ-ᛪᛮ-ᛸᜀ-ᜑᜟ-ᜱᝀ-ᝑᝠ-ᝬᝮ-ᝰក-ឳៗៜᠠ-ᡸᢀ-ᢨᢪᢰ-ᣵᤀ-ᤞᥐ-ᥭᥰ-ᥴᦀ-ᦫᦰ-ᧉᨀ-ᨖᨠ-ᩔᪧᬅ-ᬳᭅ-ᭌᮃ-ᮠᮮᮯᮺ-ᯥᰀ-ᰣᱍ-ᱏᱚ-ᱽᲀ-ᲊᲐ-ᲺᲽ-Ჿᳩ-ᳬᳮ-ᳳᳵᳶᳺᴀ-ᶿḀ-ἕἘ-Ἕἠ-ὅὈ-Ὅὐ-ὗὙὛὝὟ-ώᾀ-ᾴᾶ-ᾼιῂ-ῄῆ-ῌῐ-ΐῖ-Ίῠ-Ῥῲ-ῴῶ-ῼⁱⁿₐ-ₜℂℇℊ-ℓℕ℘-ℝℤΩℨK-ℹℼ-ℿⅅ-ⅉⅎⅠ-ↈⰀ-ⳤⳫ-ⳮⳲⳳⴀ-ⴥⴧⴭⴰ-ⵧⵯⶀ-ⶖⶠ-ⶦⶨ-ⶮⶰ-ⶶⶸ-ⶾⷀ-ⷆⷈ-ⷎⷐ-ⷖⷘ-ⷞ々-〇〡-〩〱-〵〸-〼ぁ-ゖ゛-ゟァ-ヺー-ヿㄅ-ㄯㄱ-ㆎㆠ-ㆿㇰ-ㇿ㐀-䶿一-ꒌꓐ-ꓽꔀ-ꘌꘐ-ꘟꘪꘫꙀ-ꙮꙿ-ꚝꚠ-ꛯꜗ-ꜟꜢ-ꞈꞋ-Ƛ꟱-ꠁꠃ-ꠅꠇ-ꠊꠌ-ꠢꡀ-ꡳꢂ-ꢳꣲ-ꣷꣻꣽꣾꤊ-ꤥꤰ-ꥆꥠ-ꥼꦄ-ꦲꧏꧠ-ꧤꧦ-ꧯꧺ-ꧾꨀ-ꨨꩀ-ꩂꩄ-ꩋꩠ-ꩶꩺꩾ-ꪯꪱꪵꪶꪹ-ꪽꫀꫂꫛ-ꫝꫠ-ꫪꫲ-ꫴꬁ-ꬆꬉ-ꬎꬑ-ꬖꬠ-ꬦꬨ-ꬮꬰ-ꭚꭜ-ꭩꭰ-ꯢ가-힣ힰ-ퟆퟋ-ퟻ豈-舘並-龎ﬀ-ﬆﬓ-ﬗיִײַ-ﬨשׁ-זּטּ-לּמּנּסּףּפּצּ-ﮱﯓ-ﴽﵐ-ﶏﶒ-ﷇﷰ-ﷻﹰ-ﹴﹶ-ﻼＡ-Ｚａ-ｚｦ-ﾾￂ-ￇￊ-ￏￒ-ￗￚ-ￜ";
var pn2 = "·̀-ͯ·҃-֑҇-ׇֽֿׁׂׅׄؐ-ًؚ-٩ٰۖ-ۜ۟-۪ۤۧۨ-ۭ۰-۹ܑܰ-݊ަ-ް߀-߉߫-߽߳ࠖ-࠙ࠛ-ࠣࠥ-ࠧࠩ-࡙࠭-࡛ࢗ-࢟࣊-ࣣ࣡-ःऺ-़ा-ॏ॑-ॗॢॣ०-९ঁ-ঃ়া-ৄেৈো-্ৗৢৣ০-৯৾ਁ-ਃ਼ਾ-ੂੇੈੋ-੍ੑ੦-ੱੵઁ-ઃ઼ા-ૅે-ૉો-્ૢૣ૦-૯ૺ-૿ଁ-ଃ଼ା-ୄେୈୋ-୍୕-ୗୢୣ୦-୯ஂா-ூெ-ைொ-்ௗ௦-௯ఀ-ఄ఼ా-ౄె-ైొ-్ౕౖౢౣ౦-౯ಁ-ಃ಼ಾ-ೄೆ-ೈೊ-್ೕೖೢೣ೦-೯ೳഀ-ഃ഻഼ാ-ൄെ-ൈൊ-്ൗൢൣ൦-൯ඁ-ඃ්ා-ුූෘ-ෟ෦-෯ෲෳัิ-ฺ็-๎๐-๙ັິ-ຼ່-໎໐-໙༘༙༠-༩༹༵༷༾༿ཱ-྄྆྇ྍ-ྗྙ-ྼ࿆ါ-ှ၀-၉ၖ-ၙၞ-ၠၢ-ၤၧ-ၭၱ-ၴႂ-ႍႏ-ႝ፝-፟፩-፱ᜒ-᜕ᜲ-᜴ᝒᝓᝲᝳ឴-៓៝០-៩᠋-᠍᠏-᠙ᢩᤠ-ᤫᤰ-᤻᥆-᥏᧐-᧚ᨗ-ᨛᩕ-ᩞ᩠-᩿᩼-᪉᪐-᪙᪰-᪽ᪿ-᫝᫠-᫫ᬀ-ᬄ᬴-᭄᭐-᭙᭫-᭳ᮀ-ᮂᮡ-ᮭ᮰-᮹᯦-᯳ᰤ-᰷᱀-᱉᱐-᱙᳐-᳔᳒-᳨᳭᳴᳷-᳹᷀-᷿‌‍‿⁀⁔⃐-⃥⃜⃡-⃰⳯-⵿⳱ⷠ-〪ⷿ-゙゚〯・꘠-꘩꙯ꙴ-꙽ꚞꚟ꛰꛱ꠂ꠆ꠋꠣ-ꠧ꠬ꢀꢁꢴ-ꣅ꣐-꣙꣠-꣱ꣿ-꤉ꤦ-꤭ꥇ-꥓ꦀ-ꦃ꦳-꧀꧐-꧙ꧥ꧰-꧹ꨩ-ꨶꩃꩌꩍ꩐-꩙ꩻ-ꩽꪰꪲ-ꪴꪷꪸꪾ꪿꫁ꫫ-ꫯꫵ꫶ꯣ-ꯪ꯬꯭꯰-꯹ﬞ︀-️︠-︯︳︴﹍-﹏０-９＿･";
var af = new RegExp("[" + Au + "]");
var sf = new RegExp("[" + Au + pn2 + "]");
Au = pn2 = null;
var _u = { keyword: ["break", "case", "catch", "continue", "debugger", "default", "do", "else", "finally", "for", "function", "if", "return", "switch", "throw", "try", "var", "const", "while", "with", "new", "this", "super", "class", "extends", "export", "import", "null", "true", "false", "in", "instanceof", "typeof", "void", "delete"], strict: ["implements", "interface", "let", "package", "private", "protected", "public", "static", "yield"], strictBind: ["eval", "arguments"] };
var Df = new Set(_u.keyword);
var cf = new Set(_u.strict);
var ff = new Set(_u.strictBind);
var It2 = /* @__PURE__ */ __name((e2, t2) => (u) => e2(t2(u)), "It");
function mn2(e2) {
  return { keyword: e2.cyan, capitalized: e2.yellow, jsxIdentifier: e2.yellow, punctuator: e2.yellow, number: e2.magenta, string: e2.green, regex: e2.magenta, comment: e2.gray, invalid: It2(It2(e2.white, e2.bgRed), e2.bold), gutter: e2.gray, marker: It2(e2.red, e2.bold), message: It2(e2.red, e2.bold), reset: e2.reset };
}
__name(mn2, "mn");
var hf = mn2(ou(true));
var gf = mn2(ou(false));
function _a3() {
  return new Proxy({}, { get: /* @__PURE__ */ __name(() => (e2) => e2, "get") });
}
__name(_a3, "_a");
var Fn2 = /\r\n|[\n\r\u2028\u2029]/;
function xa2(e2, t2, u) {
  let r2 = Object.assign({ column: 0, line: -1 }, e2.start), o2 = Object.assign({}, r2, e2.end), { linesAbove: n2 = 2, linesBelow: a = 3 } = u || {}, s2 = r2.line, i = r2.column, D2 = o2.line, f2 = o2.column, l3 = Math.max(s2 - (n2 + 1), 0), d = Math.min(t2.length, D2 + a);
  s2 === -1 && (l3 = 0), D2 === -1 && (d = t2.length);
  let c2 = D2 - s2, p = {};
  if (c2) for (let F2 = 0; F2 <= c2; F2++) {
    let C2 = F2 + s2;
    if (!i) p[C2] = true;
    else if (F2 === 0) {
      let y2 = t2[C2 - 1].length;
      p[C2] = [i, y2 - i + 1];
    } else if (F2 === c2) p[C2] = [0, f2];
    else {
      let y2 = t2[C2 - F2].length;
      p[C2] = [0, y2];
    }
  }
  else i === f2 ? i ? p[s2] = [i, 0] : p[s2] = true : p[s2] = [i, f2 - i];
  return { start: l3, end: d, markerLines: p };
}
__name(xa2, "xa");
function En2(e2, t2, u = {}) {
  let o2 = _a3(false), n2 = e2.split(Fn2), { start: a, end: s2, markerLines: i } = xa2(t2, n2, u), D2 = t2.start && typeof t2.start.column == "number", f2 = String(s2).length, d = e2.split(Fn2, s2).slice(a, s2).map((c2, p) => {
    let F2 = a + 1 + p, y2 = ` ${` ${F2}`.slice(-f2)} |`, m = i[F2], h2 = !i[F2 + 1];
    if (m) {
      let E2 = "";
      if (Array.isArray(m)) {
        let g = c2.slice(0, Math.max(m[0] - 1, 0)).replace(/[^\t]/g, " "), A2 = m[1] || 1;
        E2 = [`
 `, o2.gutter(y2.replace(/\d/g, " ")), " ", g, o2.marker("^").repeat(A2)].join(""), h2 && u.message && (E2 += " " + o2.message(u.message));
      }
      return [o2.marker(">"), o2.gutter(y2), c2.length > 0 ? ` ${c2}` : "", E2].join("");
    } else return ` ${o2.gutter(y2)}${c2.length > 0 ? ` ${c2}` : ""}`;
  }).join(`
`);
  return u.message && !D2 && (d = `${" ".repeat(f2 + 1)}${u.message}
${d}`), d;
}
__name(En2, "En");
async function Ba2(e2, t2) {
  let u = await We2(t2), r2 = u.preprocess ? await u.preprocess(e2, t2) : e2;
  t2.originalText = r2;
  let o2;
  try {
    o2 = await u.parse(r2, t2, t2);
  } catch (n2) {
    Ta2(n2, e2);
  }
  return { text: r2, ast: o2 };
}
__name(Ba2, "Ba");
function Ta2(e2, t2) {
  let { loc: u } = e2;
  if (u) {
    let r2 = En2(t2, u, { highlightCode: true });
    throw e2.message += `
` + r2, e2.codeFrame = r2, e2;
  }
  throw e2;
}
__name(Ta2, "Ta");
var Fe2 = Ba2;
async function Cn2(e2, t2, u, r2, o2) {
  if (u.embeddedLanguageFormatting !== "auto") return;
  let { printer: n2 } = u, { embed: a } = n2;
  if (!a) return;
  if (a.length > 2) throw new Error("printer.embed has too many parameters. The API changed in Prettier v3. Please update your plugin. See https://prettier.io/docs/plugins#optional-embed");
  let { hasPrettierIgnore: s2 } = n2, { getVisitorKeys: i } = a, D2 = [];
  d();
  let f2 = e2.stack;
  for (let { print: c2, node: p, pathStack: F2 } of D2) try {
    e2.stack = F2;
    let C2 = await c2(l3, t2, e2, u);
    C2 && o2.set(p, C2);
  } catch (C2) {
    if (globalThis.PRETTIER_DEBUG) throw C2;
  }
  e2.stack = f2;
  function l3(c2, p) {
    return Na2(c2, p, u, r2);
  }
  __name(l3, "l");
  function d() {
    let { node: c2 } = e2;
    if (c2 === null || typeof c2 != "object" || s2?.(e2)) return;
    for (let F2 of i(c2)) Array.isArray(c2[F2]) ? e2.each(d, F2) : e2.call(d, F2);
    let p = a(e2, u);
    if (p) {
      if (typeof p == "function") {
        D2.push({ print: p, node: c2, pathStack: [...e2.stack] });
        return;
      }
      o2.set(c2, p);
    }
  }
  __name(d, "d");
}
__name(Cn2, "Cn");
async function Na2(e2, t2, u, r2) {
  let o2 = await se2({ ...u, ...t2, parentParser: u.parser, originalText: e2, cursorOffset: void 0, rangeStart: void 0, rangeEnd: void 0 }, { passThrough: true }), { ast: n2 } = await Fe2(e2, o2), a = await r2(n2, o2);
  return qe(a);
}
__name(Na2, "Na");
function Sa2(e2, t2, u, r2) {
  let { originalText: o2, [Symbol.for("comments")]: n2, locStart: a, locEnd: s2, [Symbol.for("printedComments")]: i } = t2, { node: D2 } = e2, f2 = a(D2), l3 = s2(D2);
  for (let c2 of n2) a(c2) >= f2 && s2(c2) <= l3 && i.add(c2);
  let { printPrettierIgnored: d } = t2.printer;
  return d ? d(e2, t2, u, r2) : o2.slice(f2, l3);
}
__name(Sa2, "Sa");
var hn2 = Sa2;
async function Ge2(e2, t2) {
  ({ ast: e2 } = await xu(e2, t2));
  let u = /* @__PURE__ */ new Map(), r2 = new pr2(e2), o2 = Nr2(t2), n2 = /* @__PURE__ */ new Map();
  await Cn2(r2, s2, t2, Ge2, n2);
  let a = await gn2(r2, t2, s2, void 0, n2);
  if (Tr2(t2), t2.cursorOffset >= 0) {
    if (t2.nodeAfterCursor && !t2.nodeBeforeCursor) return [ee2, a];
    if (t2.nodeBeforeCursor && !t2.nodeAfterCursor) return [a, ee2];
  }
  return a;
  function s2(D2, f2) {
    return D2 === void 0 || D2 === r2 ? i(f2) : Array.isArray(D2) ? r2.call(() => i(f2), ...D2) : r2.call(() => i(f2), D2);
  }
  __name(s2, "s");
  function i(D2) {
    o2(r2);
    let f2 = r2.node;
    if (f2 == null) return "";
    let l3 = ge2(f2) && D2 === void 0;
    if (l3 && u.has(f2)) return u.get(f2);
    let d = gn2(r2, t2, s2, D2, n2);
    return l3 && u.set(f2, d), d;
  }
  __name(i, "i");
}
__name(Ge2, "Ge");
function gn2(e2, t2, u, r2, o2) {
  let { node: n2 } = e2, { printer: a } = t2, s2;
  switch (a.hasPrettierIgnore?.(e2) ? s2 = hn2(e2, t2, u, r2) : o2.has(n2) ? s2 = o2.get(n2) : s2 = a.print(e2, t2, u, r2), n2) {
    case t2.cursorNode:
      s2 = Ee2(s2, (i) => [ee2, i, ee2]);
      break;
    case t2.nodeBeforeCursor:
      s2 = Ee2(s2, (i) => [i, ee2]);
      break;
    case t2.nodeAfterCursor:
      s2 = Ee2(s2, (i) => [ee2, i]);
      break;
  }
  return a.printComment && !a.willPrintOwnComments?.(e2, t2) && (s2 = Br2(e2, s2, t2)), s2;
}
__name(gn2, "gn");
async function xu(e2, t2) {
  let u = e2.comments ?? [];
  t2[Symbol.for("comments")] = u, t2[Symbol.for("printedComments")] = /* @__PURE__ */ new Set(), Ar2(e2, t2);
  let { printer: { preprocess: r2 } } = t2;
  return e2 = r2 ? await r2(e2, t2) : e2, { ast: e2, comments: u };
}
__name(xu, "xu");
function wa2(e2, t2) {
  let { cursorOffset: u, locStart: r2, locEnd: o2, getVisitorKeys: n2 } = t2, a = /* @__PURE__ */ __name((c2) => r2(c2) <= u && o2(c2) >= u, "a"), s2 = e2, i = [e2];
  for (let c2 of Cr2(e2, { getVisitorKeys: n2, filter: a })) i.push(c2), s2 = c2;
  if (hr2(s2, { getVisitorKeys: n2 })) return { cursorNode: s2 };
  let D2, f2, l3 = -1, d = Number.POSITIVE_INFINITY;
  for (; i.length > 0 && (D2 === void 0 || f2 === void 0); ) {
    s2 = i.pop();
    let c2 = D2 !== void 0, p = f2 !== void 0;
    for (let F2 of be2(s2, { getVisitorKeys: n2 })) {
      if (!c2) {
        let C2 = o2(F2);
        C2 <= u && C2 > l3 && (D2 = F2, l3 = C2);
      }
      if (!p) {
        let C2 = r2(F2);
        C2 >= u && C2 < d && (f2 = F2, d = C2);
      }
    }
  }
  return { nodeBeforeCursor: D2, nodeAfterCursor: f2 };
}
__name(wa2, "wa");
var Bu = wa2;
function Oa2(e2, t2) {
  let { printer: u } = t2, r2 = u.massageAstNode;
  if (!r2) return e2;
  let { getVisitorKeys: o2 } = u, { ignoredProperties: n2 } = r2;
  return a(e2);
  function a(s2, i) {
    if (!ge2(s2)) return s2;
    if (Array.isArray(s2)) return s2.map((d) => a(d, i)).filter(Boolean);
    let D2 = {}, f2 = new Set(o2(s2));
    for (let d in s2) !Object.prototype.hasOwnProperty.call(s2, d) || n2?.has(d) || (f2.has(d) ? D2[d] = a(s2[d], s2) : D2[d] = s2[d]);
    let l3 = r2(s2, D2, i);
    if (l3 !== null) return l3 ?? D2;
  }
  __name(a, "a");
}
__name(Oa2, "Oa");
var yn2 = Oa2;
var Pa2 = Array.prototype.findLastIndex ?? function(e2) {
  for (let t2 = this.length - 1; t2 >= 0; t2--) {
    let u = this[t2];
    if (e2(u, t2, this)) return t2;
  }
  return -1;
};
var Ia2 = X2("findLastIndex", function() {
  if (Array.isArray(this)) return Pa2;
});
var bn2 = Ia2;
var ka2 = /* @__PURE__ */ __name(({ parser: e2 }) => e2 === "json" || e2 === "json5" || e2 === "jsonc" || e2 === "json-stringify", "ka");
function va2(e2, t2) {
  return t2 = new Set(t2), e2.find((u) => xn2.has(u.type) && t2.has(u));
}
__name(va2, "va");
function An2(e2) {
  let t2 = bn2(0, e2, (u) => u.type !== "Program" && u.type !== "File");
  return t2 === -1 ? e2 : e2.slice(0, t2 + 1);
}
__name(An2, "An");
function Ra2(e2, t2, { locStart: u, locEnd: r2 }) {
  let [o2, ...n2] = e2, [a, ...s2] = t2;
  if (o2 === a) return [o2, a];
  let i = u(o2);
  for (let f2 of An2(s2)) if (u(f2) >= i) a = f2;
  else break;
  let D2 = r2(a);
  for (let f2 of An2(n2)) {
    if (r2(f2) <= D2) o2 = f2;
    else break;
    if (o2 === a) break;
  }
  return [o2, a];
}
__name(Ra2, "Ra");
function Tu(e2, t2, u, r2, o2 = [], n2) {
  let { locStart: a, locEnd: s2 } = u, i = a(e2), D2 = s2(e2);
  if (t2 > D2 || t2 < i || n2 === "rangeEnd" && t2 === i || n2 === "rangeStart" && t2 === D2) return;
  let f2 = [e2, ...o2], l3 = at2(e2, f2, { cache: uu, locStart: a, locEnd: s2, getVisitorKeys: u.getVisitorKeys, filter: u.printer.canAttachComment, getChildren: u.printer.getCommentChildNodes });
  for (let d of l3) {
    let c2 = Tu(d, t2, u, r2, f2, n2);
    if (c2) return c2;
  }
  if (r2(e2, o2[0])) return f2;
}
__name(Tu, "Tu");
function La2(e2, t2) {
  return t2 !== "DeclareExportDeclaration" && e2 !== "TypeParameterDeclaration" && (e2 === "Directive" || e2 === "TypeAlias" || e2 === "TSExportAssignment" || e2.startsWith("Declare") || e2.startsWith("TSDeclare") || e2.endsWith("Statement") || e2.endsWith("Declaration"));
}
__name(La2, "La");
var xn2 = /* @__PURE__ */ new Set(["JsonRoot", "ObjectExpression", "ArrayExpression", "StringLiteral", "NumericLiteral", "BooleanLiteral", "NullLiteral", "UnaryExpression", "TemplateLiteral"]);
var Ma2 = /* @__PURE__ */ new Set(["OperationDefinition", "FragmentDefinition", "VariableDefinition", "TypeExtensionDefinition", "ObjectTypeDefinition", "FieldDefinition", "DirectiveDefinition", "EnumTypeDefinition", "EnumValueDefinition", "InputValueDefinition", "InputObjectTypeDefinition", "SchemaDefinition", "OperationTypeDefinition", "InterfaceTypeDefinition", "UnionTypeDefinition", "ScalarTypeDefinition"]);
function _n2(e2, t2, u) {
  if (!t2) return false;
  switch (e2.parser) {
    case "flow":
    case "hermes":
    case "babel":
    case "babel-flow":
    case "babel-ts":
    case "typescript":
    case "acorn":
    case "espree":
    case "meriyah":
    case "oxc":
    case "oxc-ts":
    case "__babel_estree":
      return La2(t2.type, u?.type);
    case "json":
    case "json5":
    case "jsonc":
    case "json-stringify":
      return xn2.has(t2.type);
    case "graphql":
      return Ma2.has(t2.kind);
    case "vue":
      return t2.tag !== "root";
  }
  return false;
}
__name(_n2, "_n");
function Bn2(e2, t2, u) {
  let { rangeStart: r2, rangeEnd: o2, locStart: n2, locEnd: a } = t2;
  P(o2 > r2);
  let s2 = e2.slice(r2, o2).search(/\S/u), i = s2 === -1;
  if (!i) for (r2 += s2; o2 > r2 && !/\S/u.test(e2[o2 - 1]); --o2) ;
  let D2 = Tu(u, r2, t2, (c2, p) => _n2(t2, c2, p), [], "rangeStart");
  if (!D2) return;
  let f2 = i ? D2 : Tu(u, o2, t2, (c2) => _n2(t2, c2), [], "rangeEnd");
  if (!f2) return;
  let l3, d;
  if (ka2(t2)) {
    let c2 = va2(D2, f2);
    l3 = c2, d = c2;
  } else [l3, d] = Ra2(D2, f2, t2);
  return [Math.min(n2(l3), n2(d)), Math.max(a(l3), a(d))];
}
__name(Bn2, "Bn");
var wn2 = "\uFEFF";
var Tn2 = Symbol("cursor");
async function On2(e2, t2, u = 0) {
  if (!e2 || e2.trim().length === 0) return { formatted: "", cursorOffset: -1, comments: [] };
  let { ast: r2, text: o2 } = await Fe2(e2, t2);
  t2.cursorOffset >= 0 && (t2 = { ...t2, ...Bu(r2, t2) });
  let n2 = await Ge2(r2, t2, u);
  u > 0 && (n2 = tt2([V3, n2], u, t2.tabWidth));
  let a = Ce(n2, t2);
  if (u > 0) {
    let i = a.formatted.trim();
    a.cursorNodeStart !== void 0 && (a.cursorNodeStart -= a.formatted.indexOf(i), a.cursorNodeStart < 0 && (a.cursorNodeStart = 0, a.cursorNodeText = a.cursorNodeText.trimStart()), a.cursorNodeStart + a.cursorNodeText.length > i.length && (a.cursorNodeText = a.cursorNodeText.trimEnd())), a.formatted = i + Se2(t2.endOfLine);
  }
  let s2 = t2[Symbol.for("comments")];
  if (t2.cursorOffset >= 0) {
    let i, D2, f2, l3;
    if ((t2.cursorNode || t2.nodeBeforeCursor || t2.nodeAfterCursor) && a.cursorNodeText) if (f2 = a.cursorNodeStart, l3 = a.cursorNodeText, t2.cursorNode) i = t2.locStart(t2.cursorNode), D2 = o2.slice(i, t2.locEnd(t2.cursorNode));
    else {
      if (!t2.nodeBeforeCursor && !t2.nodeAfterCursor) throw new Error("Cursor location must contain at least one of cursorNode, nodeBeforeCursor, nodeAfterCursor");
      i = t2.nodeBeforeCursor ? t2.locEnd(t2.nodeBeforeCursor) : 0;
      let y2 = t2.nodeAfterCursor ? t2.locStart(t2.nodeAfterCursor) : o2.length;
      D2 = o2.slice(i, y2);
    }
    else i = 0, D2 = o2, f2 = 0, l3 = a.formatted;
    let d = t2.cursorOffset - i;
    if (D2 === l3) return { formatted: a.formatted, cursorOffset: f2 + d, comments: s2 };
    let c2 = D2.split("");
    c2.splice(d, 0, Tn2);
    let p = l3.split(""), F2 = Ut2(c2, p), C2 = f2;
    for (let y2 of F2) if (y2.removed) {
      if (y2.value.includes(Tn2)) break;
    } else C2 += y2.count;
    return { formatted: a.formatted, cursorOffset: C2, comments: s2 };
  }
  return { formatted: a.formatted, cursorOffset: -1, comments: s2 };
}
__name(On2, "On");
async function Ya2(e2, t2) {
  let { ast: u, text: r2 } = await Fe2(e2, t2), [o2, n2] = Bn2(r2, t2, u) ?? [0, 0], a = r2.slice(o2, n2), s2 = Math.min(o2, r2.lastIndexOf(`
`, o2) + 1), i = r2.slice(s2, o2).match(/^\s*/u)[0], D2 = he2(i, t2.tabWidth), f2 = await On2(a, { ...t2, rangeStart: 0, rangeEnd: Number.POSITIVE_INFINITY, cursorOffset: t2.cursorOffset > o2 && t2.cursorOffset <= n2 ? t2.cursorOffset - o2 : -1, endOfLine: "lf" }, D2), l3 = f2.formatted.trimEnd(), { cursorOffset: d } = t2;
  d > n2 ? d += l3.length - a.length : f2.cursorOffset >= 0 && (d = f2.cursorOffset + o2);
  let c2 = r2.slice(0, o2) + l3 + r2.slice(n2);
  if (t2.endOfLine !== "lf") {
    let p = Se2(t2.endOfLine);
    d >= 0 && p === `\r
` && (d += $t2(c2.slice(0, d), `
`)), c2 = oe2(0, c2, `
`, p);
  }
  return { formatted: c2, cursorOffset: d, comments: f2.comments };
}
__name(Ya2, "Ya");
function Nu(e2, t2, u) {
  return typeof t2 != "number" || Number.isNaN(t2) || t2 < 0 || t2 > e2.length ? u : t2;
}
__name(Nu, "Nu");
function Nn2(e2, t2) {
  let { cursorOffset: u, rangeStart: r2, rangeEnd: o2 } = t2;
  return u = Nu(e2, u, -1), r2 = Nu(e2, r2, 0), o2 = Nu(e2, o2, e2.length), { ...t2, cursorOffset: u, rangeStart: r2, rangeEnd: o2 };
}
__name(Nn2, "Nn");
function Pn2(e2, t2) {
  let { cursorOffset: u, rangeStart: r2, rangeEnd: o2, endOfLine: n2 } = Nn2(e2, t2), a = e2.charAt(0) === wn2;
  if (a && (e2 = e2.slice(1), u--, r2--, o2--), n2 === "auto" && (n2 = Yu(e2)), e2.includes("\r")) {
    let s2 = /* @__PURE__ */ __name((i) => $t2(e2.slice(0, Math.max(i, 0)), `\r
`), "s");
    u -= s2(u), r2 -= s2(r2), o2 -= s2(o2), e2 = ju(e2);
  }
  return { hasBOM: a, text: e2, options: Nn2(e2, { ...t2, cursorOffset: u, rangeStart: r2, rangeEnd: o2, endOfLine: n2 }) };
}
__name(Pn2, "Pn");
async function Sn2(e2, t2) {
  let u = await We2(t2);
  return !u.hasPragma || u.hasPragma(e2);
}
__name(Sn2, "Sn");
async function ja2(e2, t2) {
  return (await We2(t2)).hasIgnorePragma?.(e2);
}
__name(ja2, "ja");
async function Su(e2, t2) {
  let { hasBOM: u, text: r2, options: o2 } = Pn2(e2, await se2(t2));
  if (o2.rangeStart >= o2.rangeEnd && r2 !== "" || o2.requirePragma && !await Sn2(r2, o2) || o2.checkIgnorePragma && await ja2(r2, o2)) return { formatted: e2, cursorOffset: t2.cursorOffset, comments: [] };
  let n2;
  return o2.rangeStart > 0 || o2.rangeEnd < r2.length ? n2 = await Ya2(r2, o2) : (!o2.requirePragma && o2.insertPragma && o2.printer.insertPragma && !await Sn2(r2, o2) && (r2 = o2.printer.insertPragma(r2)), n2 = await On2(r2, o2)), u && (n2.formatted = wn2 + n2.formatted, n2.cursorOffset >= 0 && n2.cursorOffset++), n2;
}
__name(Su, "Su");
async function In2(e2, t2, u) {
  let { text: r2, options: o2 } = Pn2(e2, await se2(t2)), n2 = await Fe2(r2, o2);
  return u && (u.preprocessForPrint && (n2.ast = await xu(n2.ast, o2)), u.massage && (n2.ast = yn2(n2.ast, o2))), n2;
}
__name(In2, "In");
async function kn2(e2, t2) {
  t2 = await se2(t2);
  let u = await Ge2(e2, t2);
  return Ce(u, t2);
}
__name(kn2, "kn");
async function vn2(e2, t2) {
  let u = sr2(e2), { formatted: r2 } = await Su(u, { ...t2, parser: "__js_expression" });
  return r2;
}
__name(vn2, "vn");
async function Rn2(e2, t2) {
  t2 = await se2(t2);
  let { ast: u } = await Fe2(e2, t2);
  return t2.cursorOffset >= 0 && (t2 = { ...t2, ...Bu(u, t2) }), Ge2(u, t2);
}
__name(Rn2, "Rn");
async function Ln2(e2, t2) {
  return Ce(e2, await se2(t2));
}
__name(Ln2, "Ln");
var wu = {};
Yt2(wu, { builders: /* @__PURE__ */ __name(() => Wa2, "builders"), printer: /* @__PURE__ */ __name(() => $a2, "printer"), utils: /* @__PURE__ */ __name(() => Va2, "utils") });
var Wa2 = { join: Ie2, line: ut2, softline: or2, hardline: V3, literalline: Qe2, group: Kt2, conditionalGroup: tr2, fill: er2, lineSuffix: ve2, lineSuffixBoundary: ar2, cursor: ee2, breakParent: ce2, ifBreak: ur2, trim: ir2, indent: ae2, indentIfBreak: rr2, align: De2, addAlignmentToDoc: tt2, markAsRoot: et2, dedentToRoot: Qu, dedent: Zu, hardlineWithoutBreakParent: ke2, literallineWithoutBreakParent: Gt2, label: nr2, concat: /* @__PURE__ */ __name((e2) => e2, "concat") };
var $a2 = { printDocToString: Ce };
var Va2 = { willBreak: Ku, traverseDoc: we2, findInDoc: Xe2, mapDoc: Pe2, removeLines: zu, stripTrailingHardline: qe, replaceEndOfLine: Ju, canBreak: Hu };
var Mn2 = "3.8.3";
var Pu = {};
Yt2(Pu, { addDanglingComment: /* @__PURE__ */ __name(() => ue2, "addDanglingComment"), addLeadingComment: /* @__PURE__ */ __name(() => fe2, "addLeadingComment"), addTrailingComment: /* @__PURE__ */ __name(() => le2, "addTrailingComment"), getAlignmentSize: /* @__PURE__ */ __name(() => he2, "getAlignmentSize"), getIndentSize: /* @__PURE__ */ __name(() => Yn2, "getIndentSize"), getMaxContinuousCount: /* @__PURE__ */ __name(() => jn2, "getMaxContinuousCount"), getNextNonSpaceNonCommentCharacter: /* @__PURE__ */ __name(() => Un2, "getNextNonSpaceNonCommentCharacter"), getNextNonSpaceNonCommentCharacterIndex: /* @__PURE__ */ __name(() => ni2, "getNextNonSpaceNonCommentCharacterIndex"), getPreferredQuote: /* @__PURE__ */ __name(() => Vn2, "getPreferredQuote"), getStringWidth: /* @__PURE__ */ __name(() => Re2, "getStringWidth"), hasNewline: /* @__PURE__ */ __name(() => z, "hasNewline"), hasNewlineInRange: /* @__PURE__ */ __name(() => Kn2, "hasNewlineInRange"), hasSpaces: /* @__PURE__ */ __name(() => Gn2, "hasSpaces"), isNextLineEmpty: /* @__PURE__ */ __name(() => Di2, "isNextLineEmpty"), isNextLineEmptyAfterIndex: /* @__PURE__ */ __name(() => kt2, "isNextLineEmptyAfterIndex"), isPreviousLineEmpty: /* @__PURE__ */ __name(() => ai2, "isPreviousLineEmpty"), makeString: /* @__PURE__ */ __name(() => si2, "makeString"), skip: /* @__PURE__ */ __name(() => ye2, "skip"), skipEverythingButNewLine: /* @__PURE__ */ __name(() => ot, "skipEverythingButNewLine"), skipInlineComment: /* @__PURE__ */ __name(() => xe2, "skipInlineComment"), skipNewline: /* @__PURE__ */ __name(() => K2, "skipNewline"), skipSpaces: /* @__PURE__ */ __name(() => Y2, "skipSpaces"), skipToLineEnd: /* @__PURE__ */ __name(() => nt2, "skipToLineEnd"), skipTrailingComment: /* @__PURE__ */ __name(() => Be3, "skipTrailingComment"), skipWhitespace: /* @__PURE__ */ __name(() => Fr2, "skipWhitespace") });
function Ka2(e2, t2) {
  if (t2 === false) return false;
  if (e2.charAt(t2) === "/" && e2.charAt(t2 + 1) === "*") {
    for (let u = t2 + 2; u < e2.length; ++u) if (e2.charAt(u) === "*" && e2.charAt(u + 1) === "/") return u + 2;
  }
  return t2;
}
__name(Ka2, "Ka");
var xe2 = Ka2;
function Ga2(e2, t2) {
  return t2 === false ? false : e2.charAt(t2) === "/" && e2.charAt(t2 + 1) === "/" ? ot(e2, t2) : t2;
}
__name(Ga2, "Ga");
var Be3 = Ga2;
function za2(e2, t2) {
  let u = null, r2 = t2;
  for (; r2 !== u; ) u = r2, r2 = Y2(e2, r2), r2 = xe2(e2, r2), r2 = Be3(e2, r2), r2 = K2(e2, r2);
  return r2;
}
__name(za2, "za");
var ze2 = za2;
function Ja2(e2, t2) {
  let u = null, r2 = t2;
  for (; r2 !== u; ) u = r2, r2 = nt2(e2, r2), r2 = xe2(e2, r2), r2 = Y2(e2, r2);
  return r2 = Be3(e2, r2), r2 = K2(e2, r2), r2 !== false && z(e2, r2);
}
__name(Ja2, "Ja");
var kt2 = Ja2;
function Ha2(e2, t2) {
  let u = e2.lastIndexOf(`
`);
  return u === -1 ? 0 : he2(e2.slice(u + 1).match(/^[\t ]*/u)[0], t2);
}
__name(Ha2, "Ha");
var Yn2 = Ha2;
function Ou(e2) {
  if (typeof e2 != "string") throw new TypeError("Expected a string");
  return e2.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
}
__name(Ou, "Ou");
function Xa2(e2, t2) {
  let u = e2.matchAll(new RegExp(`(?:${Ou(t2)})+`, "gu"));
  return u.reduce || (u = [...u]), u.reduce((r2, [o2]) => Math.max(r2, o2.length), 0) / t2.length;
}
__name(Xa2, "Xa");
var jn2 = Xa2;
function qa2(e2, t2) {
  let u = ze2(e2, t2);
  return u === false ? "" : e2.charAt(u);
}
__name(qa2, "qa");
var Un2 = qa2;
var Wn2 = Object.freeze({ character: "'", codePoint: 39 });
var $n2 = Object.freeze({ character: '"', codePoint: 34 });
var Qa2 = Object.freeze({ preferred: Wn2, alternate: $n2 });
var Za2 = Object.freeze({ preferred: $n2, alternate: Wn2 });
function ei2(e2, t2) {
  let { preferred: u, alternate: r2 } = t2 === true || t2 === "'" ? Qa2 : Za2, { length: o2 } = e2, n2 = 0, a = 0;
  for (let s2 = 0; s2 < o2; s2++) {
    let i = e2.charCodeAt(s2);
    i === u.codePoint ? n2++ : i === r2.codePoint && a++;
  }
  return (n2 > a ? r2 : u).character;
}
__name(ei2, "ei");
var Vn2 = ei2;
function ti2(e2, t2, u) {
  for (let r2 = t2; r2 < u; ++r2) if (e2.charAt(r2) === `
`) return true;
  return false;
}
__name(ti2, "ti");
var Kn2 = ti2;
function ui2(e2, t2, u = {}) {
  return Y2(e2, u.backwards ? t2 - 1 : t2, u) !== t2;
}
__name(ui2, "ui");
var Gn2 = ui2;
function ri2(e2, t2, u) {
  return ze2(e2, u(t2));
}
__name(ri2, "ri");
function ni2(e2, t2) {
  return arguments.length === 2 || typeof t2 == "number" ? ze2(e2, t2) : ri2(...arguments);
}
__name(ni2, "ni");
function oi2(e2, t2, u) {
  return Le2(e2, u(t2));
}
__name(oi2, "oi");
function ai2(e2, t2) {
  return arguments.length === 2 || typeof t2 == "number" ? Le2(e2, t2) : oi2(...arguments);
}
__name(ai2, "ai");
function ii2(e2, t2, u) {
  return kt2(e2, u(t2));
}
__name(ii2, "ii");
function si2(e2, t2, u) {
  let r2 = t2 === '"' ? "'" : '"', n2 = oe2(0, e2, /\\(.)|(["'])/gsu, (a, s2, i) => s2 === r2 ? s2 : i === t2 ? "\\" + i : i || (u && /^[^\n\r"'0-7\\bfnrt-vx\u2028\u2029]$/u.test(s2) ? s2 : "\\" + s2));
  return t2 + n2 + t2;
}
__name(si2, "si");
function Di2(e2, t2) {
  return arguments.length === 2 || typeof t2 == "number" ? kt2(e2, t2) : ii2(...arguments);
}
__name(Di2, "Di");
function me2(e2, t2 = 1) {
  return async (...u) => {
    let r2 = u[t2] ?? {}, o2 = r2.plugins ?? [];
    return u[t2] = { ...r2, plugins: Array.isArray(o2) ? o2 : Object.values(o2) }, e2(...u);
  };
}
__name(me2, "me");
var zn2 = me2(Su);
async function Jn2(e2, t2) {
  let { formatted: u } = await zn2(e2, { ...t2, cursorOffset: -1 });
  return u;
}
__name(Jn2, "Jn");
async function ci2(e2, t2) {
  return await Jn2(e2, t2) === e2;
}
__name(ci2, "ci");
var fi2 = me2(it2, 0);
var li2 = { parse: me2(In2), formatAST: me2(kn2), formatDoc: me2(vn2), printToDoc: me2(Rn2), printDocToString: me2(Ln2) };

// node_modules/@react-email/render/dist/node/index.mjs
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
import { Writable } from "node:stream";
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = /* @__PURE__ */ __name((obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value, "__defNormalProp");
var __spreadValues = /* @__PURE__ */ __name((a, b3) => {
  for (var prop in b3 || (b3 = {}))
    if (__hasOwnProp.call(b3, prop))
      __defNormalProp(a, prop, b3[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b3)) {
      if (__propIsEnum.call(b3, prop))
        __defNormalProp(a, prop, b3[prop]);
    }
  return a;
}, "__spreadValues");
var __spreadProps = /* @__PURE__ */ __name((a, b3) => __defProps(a, __getOwnPropDescs(b3)), "__spreadProps");
var __async = /* @__PURE__ */ __name((__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = /* @__PURE__ */ __name((value) => {
      try {
        step(generator.next(value));
      } catch (e2) {
        reject(e2);
      }
    }, "fulfilled");
    var rejected = /* @__PURE__ */ __name((value) => {
      try {
        step(generator.throw(value));
      } catch (e2) {
        reject(e2);
      }
    }, "rejected");
    var step = /* @__PURE__ */ __name((x3) => x3.done ? resolve(x3.value) : Promise.resolve(x3.value).then(fulfilled, rejected), "step");
    step((generator = generator.apply(__this, __arguments)).next());
  });
}, "__async");
var plainTextSelectors = [
  { selector: "img", format: "skip" },
  { selector: "[data-skip-in-text=true]", format: "skip" },
  {
    selector: "a",
    options: { linkBrackets: false }
  }
];
function recursivelyMapDoc(doc, callback) {
  if (Array.isArray(doc)) {
    return doc.map((innerDoc) => recursivelyMapDoc(innerDoc, callback));
  }
  if (typeof doc === "object") {
    if (doc.type === "group") {
      return __spreadProps(__spreadValues({}, doc), {
        contents: recursivelyMapDoc(doc.contents, callback),
        expandedStates: recursivelyMapDoc(
          doc.expandedStates,
          callback
        )
      });
    }
    if ("contents" in doc) {
      return __spreadProps(__spreadValues({}, doc), {
        contents: recursivelyMapDoc(doc.contents, callback)
      });
    }
    if ("parts" in doc) {
      return __spreadProps(__spreadValues({}, doc), {
        parts: recursivelyMapDoc(doc.parts, callback)
      });
    }
    if (doc.type === "if-break") {
      return __spreadProps(__spreadValues({}, doc), {
        breakContents: recursivelyMapDoc(doc.breakContents, callback),
        flatContents: recursivelyMapDoc(doc.flatContents, callback)
      });
    }
  }
  return callback(doc);
}
__name(recursivelyMapDoc, "recursivelyMapDoc");
var modifiedHtml = __spreadValues({}, html_exports);
if (modifiedHtml.printers) {
  const previousPrint = modifiedHtml.printers.html.print;
  modifiedHtml.printers.html.print = (path, options, print, args) => {
    const node = path.getNode();
    const rawPrintingResult = previousPrint(path, options, print, args);
    if (node.type === "ieConditionalComment") {
      const printingResult = recursivelyMapDoc(rawPrintingResult, (doc) => {
        if (typeof doc === "object" && doc.type === "line") {
          return doc.soft ? "" : " ";
        }
        return doc;
      });
      return printingResult;
    }
    return rawPrintingResult;
  };
}
var defaults = {
  endOfLine: "lf",
  tabWidth: 2,
  plugins: [modifiedHtml],
  bracketSameLine: true,
  parser: "html"
};
var pretty = /* @__PURE__ */ __name((str, options = {}) => {
  return Jn2(str.replaceAll("\0", ""), __spreadValues(__spreadValues({}, defaults), options));
}, "pretty");
var decoder = new TextDecoder("utf-8");
var readStream = /* @__PURE__ */ __name((stream) => __async(void 0, null, function* () {
  let result = "";
  if ("pipeTo" in stream) {
    const writableStream = new WritableStream({
      write(chunk) {
        result += decoder.decode(chunk);
      }
    });
    yield stream.pipeTo(writableStream);
  } else {
    const writable = new Writable({
      write(chunk, _encoding, callback) {
        result += decoder.decode(chunk);
        callback();
      }
    });
    stream.pipe(writable);
    yield new Promise((resolve, reject) => {
      writable.on("error", reject);
      writable.on("close", () => {
        resolve();
      });
    });
  }
  return result;
}), "readStream");
var render2 = /* @__PURE__ */ __name((node, options) => __async(void 0, null, function* () {
  const suspendedElement = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, { children: node });
  const reactDOMServer = yield import("./server.node-6SYJ73EA.mjs").then(
    // This is beacuse react-dom/server is CJS
    (m) => m.default
  );
  let html2;
  if (Object.hasOwn(reactDOMServer, "renderToReadableStream")) {
    html2 = yield readStream(
      yield reactDOMServer.renderToReadableStream(suspendedElement)
    );
  } else {
    yield new Promise((resolve, reject) => {
      const stream = reactDOMServer.renderToPipeableStream(suspendedElement, {
        onAllReady() {
          return __async(this, null, function* () {
            html2 = yield readStream(stream);
            resolve();
          });
        },
        onError(error) {
          reject(error);
        }
      });
    });
  }
  if (options == null ? void 0 : options.plainText) {
    return convert(html2, __spreadValues({
      selectors: plainTextSelectors
    }, options.htmlToTextOptions));
  }
  const doctype = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">';
  const document = `${doctype}${html2.replace(/<!DOCTYPE.*?>/, "")}`;
  if (options == null ? void 0 : options.pretty) {
    return pretty(document);
  }
  return document;
}), "render");
var renderAsync = /* @__PURE__ */ __name((element, options) => {
  return render2(element, options);
}, "renderAsync");
export {
  plainTextSelectors,
  pretty,
  render2 as render,
  renderAsync
};
/*! Bundled license information:

react/cjs/react-jsx-runtime.production.min.js:
  (**
   * @license React
   * react-jsx-runtime.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react/cjs/react-jsx-runtime.development.js:
  (**
   * @license React
   * react-jsx-runtime.development.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)
*/
//# sourceMappingURL=node-NBWHEHVG.mjs.map
