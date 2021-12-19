"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
(0, mongoose_1.connect)(String(process.env.MONGO_CONNECTION_STRING), function (err) {
    if (err) {
        console.log(err);
    }
    else {
        console.log("Connected to DB");
    }
});
