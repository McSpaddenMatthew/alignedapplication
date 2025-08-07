"use strict";
(() => {
var exports = {};
exports.id = 436;
exports.ids = [436];
exports.modules = {

/***/ 2885:
/***/ ((module) => {

module.exports = require("@supabase/supabase-js");

/***/ }),

/***/ 9743:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ handler)
});

// EXTERNAL MODULE: external "@supabase/supabase-js"
var supabase_js_ = __webpack_require__(2885);
;// CONCATENATED MODULE: ./supabase/client.ts

const supabaseUrl = "https://wvnlmkedacuhldjcmcsp.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind2bmxta2VkYWN1aGxkamNtY3NwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1MzY4NTAsImV4cCI6MjA3MDExMjg1MH0.w44OkJlJoW-5bCodexomigsPQh02-vGJn7LghxI0ySQ";
const supabase = (0,supabase_js_.createClient)(supabaseUrl, supabaseAnonKey);

;// CONCATENATED MODULE: ./pages/api/supabase-test.ts

async function handler(req, res) {
    const { data, error } = await supabase.from("your_table_name").select("*").limit(1);
    if (error) {
        console.error("❌ Supabase error:", error);
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
    res.status(200).json({
        success: true,
        data
    });
}


/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__(9743));
module.exports = __webpack_exports__;

})();