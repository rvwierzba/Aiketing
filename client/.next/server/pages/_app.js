/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./lib/i18n.ts":
/*!*********************!*\
  !*** ./lib/i18n.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   I18nProvider: () => (/* binding */ I18nProvider),\n/* harmony export */   getLocaleProps: () => (/* binding */ getLocaleProps),\n/* harmony export */   useChangeLocale: () => (/* binding */ useChangeLocale),\n/* harmony export */   useCurrentLocale: () => (/* binding */ useCurrentLocale),\n/* harmony export */   useI18n: () => (/* binding */ useI18n),\n/* harmony export */   useScopedI18n: () => (/* binding */ useScopedI18n)\n/* harmony export */ });\n/* harmony import */ var next_international__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next-international */ \"next-international\");\n/* harmony import */ var next_international__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_international__WEBPACK_IMPORTED_MODULE_0__);\n// lib/i18n.ts\n\nconst { useI18n, useScopedI18n, I18nProvider, useChangeLocale, useCurrentLocale, getLocaleProps } = (0,next_international__WEBPACK_IMPORTED_MODULE_0__.createI18n)({\n    en: ()=>__webpack_require__.e(/*! import() */ \"locales_en_json\").then(__webpack_require__.t.bind(__webpack_require__, /*! ../locales/en.json */ \"./locales/en.json\", 19)),\n    pt: ()=>__webpack_require__.e(/*! import() */ \"locales_pt_json\").then(__webpack_require__.t.bind(__webpack_require__, /*! ../locales/pt.json */ \"./locales/pt.json\", 19)),\n    de: ()=>__webpack_require__.e(/*! import() */ \"locales_de_json\").then(__webpack_require__.t.bind(__webpack_require__, /*! ../locales/de.json */ \"./locales/de.json\", 19)),\n    fr: ()=>__webpack_require__.e(/*! import() */ \"locales_fr_json\").then(__webpack_require__.t.bind(__webpack_require__, /*! ../locales/fr.json */ \"./locales/fr.json\", 19)),\n    ru: ()=>__webpack_require__.e(/*! import() */ \"locales_ru_json\").then(__webpack_require__.t.bind(__webpack_require__, /*! ../locales/ru.json */ \"./locales/ru.json\", 19))\n});\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9saWIvaTE4bi50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLGNBQWM7QUFDa0M7QUFFekMsTUFBTSxFQUNYQyxPQUFPLEVBQ1BDLGFBQWEsRUFDYkMsWUFBWSxFQUNaQyxlQUFlLEVBQ2ZDLGdCQUFnQixFQUNoQkMsY0FBYyxFQUNmLEdBQUdOLDhEQUFVQSxDQUFDO0lBQ2JPLElBQUksSUFBTSxpS0FBTztJQUNqQkMsSUFBSSxJQUFNLGlLQUFPO0lBQ2pCQyxJQUFJLElBQU0saUtBQU87SUFDakJDLElBQUksSUFBTSxpS0FBTztJQUNqQkMsSUFBSSxJQUFNLGlLQUFPO0FBQ25CLEdBQUciLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jbGllbnQvLi9saWIvaTE4bi50cz80OWFlIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIGxpYi9pMThuLnRzXHJcbmltcG9ydCB7IGNyZWF0ZUkxOG4gfSBmcm9tICduZXh0LWludGVybmF0aW9uYWwnO1xyXG5cclxuZXhwb3J0IGNvbnN0IHtcclxuICB1c2VJMThuLFxyXG4gIHVzZVNjb3BlZEkxOG4sXHJcbiAgSTE4blByb3ZpZGVyLCAvLyBOb3RlIHF1ZSBuw6NvIMOpIG1haXMgJ0kxOG5Qcm92aWRlckNsaWVudCdcclxuICB1c2VDaGFuZ2VMb2NhbGUsXHJcbiAgdXNlQ3VycmVudExvY2FsZSxcclxuICBnZXRMb2NhbGVQcm9wc1xyXG59ID0gY3JlYXRlSTE4bih7XHJcbiAgZW46ICgpID0+IGltcG9ydCgnLi4vbG9jYWxlcy9lbi5qc29uJyksXHJcbiAgcHQ6ICgpID0+IGltcG9ydCgnLi4vbG9jYWxlcy9wdC5qc29uJyksXHJcbiAgZGU6ICgpID0+IGltcG9ydCgnLi4vbG9jYWxlcy9kZS5qc29uJyksXHJcbiAgZnI6ICgpID0+IGltcG9ydCgnLi4vbG9jYWxlcy9mci5qc29uJyksXHJcbiAgcnU6ICgpID0+IGltcG9ydCgnLi4vbG9jYWxlcy9ydS5qc29uJylcclxufSk7Il0sIm5hbWVzIjpbImNyZWF0ZUkxOG4iLCJ1c2VJMThuIiwidXNlU2NvcGVkSTE4biIsIkkxOG5Qcm92aWRlciIsInVzZUNoYW5nZUxvY2FsZSIsInVzZUN1cnJlbnRMb2NhbGUiLCJnZXRMb2NhbGVQcm9wcyIsImVuIiwicHQiLCJkZSIsImZyIiwicnUiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./lib/i18n.ts\n");

/***/ }),

/***/ "./pages/_app.tsx":
/*!************************!*\
  !*** ./pages/_app.tsx ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _lib_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../lib/i18n */ \"./lib/i18n.ts\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../styles/globals.css */ \"./styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_2__);\n// pages/_app.tsx\n\n // Mudamos para I18nProvider\n\nfunction MyApp({ Component, pageProps }) {\n    return(// Usamos o I18nProvider e passamos a propriedade 'locale' de pageProps\n    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_lib_i18n__WEBPACK_IMPORTED_MODULE_1__.I18nProvider, {\n        locale: pageProps.locale,\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n            ...pageProps\n        }, void 0, false, {\n            fileName: \"C:\\\\DEV\\\\AIketing\\\\client\\\\pages\\\\_app.tsx\",\n            lineNumber: 10,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"C:\\\\DEV\\\\AIketing\\\\client\\\\pages\\\\_app.tsx\",\n        lineNumber: 9,\n        columnNumber: 5\n    }, this));\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MyApp);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9fYXBwLnRzeCIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSxpQkFBaUI7O0FBRTBCLENBQUMsNEJBQTRCO0FBQ3pDO0FBRS9CLFNBQVNDLE1BQU0sRUFBRUMsU0FBUyxFQUFFQyxTQUFTLEVBQVk7SUFDL0MsT0FDRSx1RUFBdUU7a0JBQ3ZFLDhEQUFDSCxtREFBWUE7UUFBQ0ksUUFBUUQsVUFBVUMsTUFBTTtrQkFDcEMsNEVBQUNGO1lBQVcsR0FBR0MsU0FBUzs7Ozs7Ozs7Ozs7QUFHOUI7QUFFQSxpRUFBZUYsS0FBS0EsRUFBQyIsInNvdXJjZXMiOlsid2VicGFjazovL2NsaWVudC8uL3BhZ2VzL19hcHAudHN4PzJmYmUiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gcGFnZXMvX2FwcC50c3hcclxuaW1wb3J0IHR5cGUgeyBBcHBQcm9wcyB9IGZyb20gJ25leHQvYXBwJztcclxuaW1wb3J0IHsgSTE4blByb3ZpZGVyIH0gZnJvbSAnLi4vbGliL2kxOG4nOyAvLyBNdWRhbW9zIHBhcmEgSTE4blByb3ZpZGVyXHJcbmltcG9ydCAnLi4vc3R5bGVzL2dsb2JhbHMuY3NzJztcclxuXHJcbmZ1bmN0aW9uIE15QXBwKHsgQ29tcG9uZW50LCBwYWdlUHJvcHMgfTogQXBwUHJvcHMpIHtcclxuICByZXR1cm4gKFxyXG4gICAgLy8gVXNhbW9zIG8gSTE4blByb3ZpZGVyIGUgcGFzc2Ftb3MgYSBwcm9wcmllZGFkZSAnbG9jYWxlJyBkZSBwYWdlUHJvcHNcclxuICAgIDxJMThuUHJvdmlkZXIgbG9jYWxlPXtwYWdlUHJvcHMubG9jYWxlfT5cclxuICAgICAgPENvbXBvbmVudCB7Li4ucGFnZVByb3BzfSAvPlxyXG4gICAgPC9JMThuUHJvdmlkZXI+XHJcbiAgKTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgTXlBcHA7Il0sIm5hbWVzIjpbIkkxOG5Qcm92aWRlciIsIk15QXBwIiwiQ29tcG9uZW50IiwicGFnZVByb3BzIiwibG9jYWxlIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./pages/_app.tsx\n");

/***/ }),

/***/ "./styles/globals.css":
/*!****************************!*\
  !*** ./styles/globals.css ***!
  \****************************/
/***/ (() => {



/***/ }),

/***/ "next-international":
/*!*************************************!*\
  !*** external "next-international" ***!
  \*************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next-international");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("./pages/_app.tsx"));
module.exports = __webpack_exports__;

})();