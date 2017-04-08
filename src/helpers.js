/**
 * @file Index file of the Project
 * @author Sathish Jayaraman <sathishj.official@gmail.com>
 */

 /**
  *
  *
  * Create Anchor element for parsing the given url
  * @function getUrlObj
  * @param {string} url
  * @returns {object}
  */
 var getUrlObj = function (url) {
    var anchor = document.createElement('a');
    anchor.href = url;
    return anchor;
 };

 /**
 *
 *
 * Get cookie with the name provided
 * @function getCookie
 * @param {string} name
 * @returns {array}
 */
var getCookie = function(name) {
  var b = [], c = document['cookie']['split'](';');
  var a = new RegExp('^\\s*' + name + '=\\s*(.*?)\\s*$');
  for (var d = 0, len = c['length']; d < len; d++) {
      var e = c[d]['match'](a);
      e && b.push(e[1]);
  }
  return b;
};

/**
 *
 *
 * Set cookie with the name, value, expiry, path, domain provided
 * @function getCookie
 * @param {string} cookieName
 * @param {string} value
 * @param {string} expirydays
 */
var setCookie = function(cookieName, value, expirydays) {
  if (!navigator.cookieEnabled) {
      return;
  }
  debugger;
  var expiryDate = new Date();
  var expTime = (expirydays!=1)? (365 * 86400000) : (expirydays * 1800000);
  expiryDate.setTime(expiryDate.getTime() + expTime);
  document.cookie = cookieName + '=' + encodeURIComponent(value)
                    + (expirydays ? ';expires=' + expiryDate.toGMTString() : '')
                    + ';path=' + '/'
                    + ';domain=' + '';
};


/**
 *
 *
 * Get query string as object for the given url
 * @function getValuesFromUrl
 * @param {string} url
 * @returns {object}
 */
var getValuesFromUrl = function (url) {
  var anchor = getUrlObj(url);
  var query = anchor.search.substr(1);
  var result = {};

  if(query){
     var vals = query.split('&');
     for(var i=0,len=vals.length; i<len; i++){
       var part = vals[i];
       var item = part.split('=');
       result[item[0]] = decodeURIComponent(item[1]);
     }
  }

  return result;
 };


 /**
  *
  *
  * Returns plaint text value of given Dom node
  * @function getPlainText
  * @param {object} node
  * @returns {string}
  */
 var getPlainText = function(node){
   var normalize = function(a){
     // clean up double line breaks and spaces
     if(!a) return '';
     return a.replace(/ +/g, ' ')
           .replace(/[\t]+/gm, '')
           .replace(/[ ]+$/gm, '')
           .replace(/^[ ]+/gm, '')
           .replace(/\n+/g, '')
           .replace(/\n+$/, '')
           .replace(/^\n+/, '')
           .replace(/\nNEWLINE\n/g, '')
           .replace(/NEWLINE\n/g, ''); // IE
   };
   var removeWhiteSpace = function(node){
     // getting rid of empty text nodes
     var isWhite = function(node) {
       return !(/[^\t\n\r ]/.test(node.nodeValue));
     };
     var ws = [];
     var findWhite = function(node){
       for(var i=0; i<node.childNodes.length;i++){
         var n = node.childNodes[i];
         if (n.nodeType==3 && isWhite(n)){
           ws.push(n);
         }else if(n.hasChildNodes()){
           findWhite(n);
         }
       }
     };
     findWhite(node);
     for(var i=0;i<ws.length;i++){
       ws[i].parentNode.removeChild(ws[i]);
     }

   };
   var sty = function(n, prop){
     // Get the style of the node.
     // Assumptions are made here based on tagName.
     if(n.style[prop]) return n.style[prop];
     var s = n.currentStyle || n.ownerDocument.defaultView.getComputedStyle(n, null);
     if(n.tagName == 'SCRIPT') return 'none';
     if(!s[prop]) return 'LI,P,TR'.indexOf(n.tagName) > -1 ? 'block' : n.style[prop];
     if(s[prop] =='block' && n.tagName=='TD') return 'feaux-inline';
     return s[prop];
   };

   var blockTypeNodes = 'table-row,block,list-item';
   var isBlock = function(n){
     // diaply:block or something else
     var s = sty(n, 'display') || 'feaux-inline';
     if(blockTypeNodes.indexOf(s) > -1) return true;
     return false;
   };
   var recurse = function(n){
     // Loop through all the child nodes
     // and collect the text, noting whether
     // spaces or line breaks are needed.
     if(/pre/.test(sty(n, 'whiteSpace'))) {
       t += n.innerHTML
         .replace(/\t/g, ' ')
         .replace(/\n/g, ' '); // to match IE
       return '';
     }
     var s = sty(n, 'display');
     if(s == 'none') return '';
     var gap = isBlock(n) ? '\n' : ' ';
     t += gap;
     for(var i=0; i<n.childNodes.length;i++){
       var c = n.childNodes[i];
       if(c.nodeType == 3) t += c.nodeValue;
       if(c.childNodes.length) recurse(c);
     }
     t += gap;
     return t;
   };
   // Use a copy because stuff gets changed
   node = node.cloneNode(true);
   // Line breaks aren't picked up by textContent
   node.innerHTML = node.innerHTML.replace(/<br>/g, '\n');

   // Double line breaks after P tags are desired, but would get
   // stripped by the final RegExp. Using placeholder text.
   var paras = node.getElementsByTagName('p');
   for(var i=0; i<paras.length;i++){
     paras[i].innerHTML += 'NEWLINE';
   }

   var t = '';
   removeWhiteSpace(node);
   // Make the call!
   return normalize(recurse(node));
 };


module.exports.getUrlObj = getUrlObj;
module.exports.getValuesFromUrl = getValuesFromUrl;
module.exports.setCookie = setCookie;
module.exports.getCookie = getCookie;
module.exports.getPlainText = getPlainText;
