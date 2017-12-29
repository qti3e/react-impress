// `arraify` takes an array-like object and turns it into real Array
// to make all the Array.prototype goodness available.
export function arrayify (a){
 return [].slice.call(a)
}

// `pfx` is a function that takes a standard CSS property name as a parameter
// and returns it's prefixed version valid for current browser it runs in.
// The code is heavily inspired by Modernizr http://www.modernizr.com/
let pfx = (function () {

    var style = document.createElement('dummy').style,
        prefixes = 'Webkit Moz O ms Khtml'.split(' '),
        memory = {};

    return function ( prop ) {
        if ( typeof memory[ prop ] === "undefined" ) {

            var ucProp  = prop.charAt(0).toUpperCase() + prop.substr(1),
                props   = (prop + ' ' + prefixes.join(ucProp + ' ') + ucProp).split(' ');

            memory[ prop ] = null;
            for ( var i in props ) {
                if ( style[ props[i] ] !== undefined ) {
                    memory[ prop ] = props[i];
                    break;
                }
            }

        }

        return memory[ prop ];
    };

})()

// `css` function applies the styles given in `props` object to the element
// given as `el`. It runs all property names through `pfx` function to make
// sure proper prefixed version of the property is used.
export function css(el, props) {
  let key, pkey
  for (key in props) {
    if ( props.hasOwnProperty(key) ) {
      pkey = pfx(key);
      if ( pkey !== null ) {
        el.style[pkey] = props[key]
      }
    }
  }
  return el
}

// `toNumber` takes a value given as `numeric` parameter and tries to turn
// it into a number. If it is not possible it returns 0 (or other value
// given as `fallback`).
export function toNumber(numeric, fallback) {
  return isNaN(numeric) ? (fallback || 0) : Number(numeric)
}

// `byId` returns element with given `id` - you probably have guessed that ;)
export function byId(id) {
  return document.getElementById(id)
}

// `$` returns first element for given CSS `selector` in the `context` of
// the given element or whole document.
export function $(selector, context) {
  context = context || document
  return context.querySelector(selector)
}

// `$$` return an array of elements for given CSS `selector` in the `context` of
// the given element or whole document.
export function $$(selector, context){
  context = context || document
  return arrayify( context.querySelectorAll(selector) )
}

// `translate` builds a translate transform string for given data.
export function translate(t) {
  return " translate3d(" + t.x + "px," + t.y + "px," + t.z + "px) "
}

// `rotate` builds a rotate transform string for given data.
// By default the rotations are in X Y Z order that can be reverted by passing `true`
// as second parameter.
export function rotate(r, revert) {
  let rX = " rotateX(" + r.x + "deg) ",
      rY = " rotateY(" + r.y + "deg) ",
      rZ = " rotateZ(" + r.z + "deg) "

  return revert ? rZ+rY+rX : rX+rY+rZ
}

// `scale` builds a scale transform string for given data.
export function scale(s) {
  return " scale(" + s + ") ";
}

// `perspective` builds a perspective transform string for given data.
export function perspective(p) {
  return " perspective(" + p + "px) "
}

// this function simply do nothing, no operation
export function noop(){
  return null
}

// throttling function calls, by Remy Sharp
// http://remysharp.com/2010/07/21/throttling-function-calls/
export function throttle(fn, delay) {
    var timer = null
    return function () {
        var context = this, args = arguments
        clearTimeout(timer)
        timer = setTimeout(function () {
            fn.apply(context, args)
        }, delay)
    }
}
