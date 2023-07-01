// Exports router modules for serverless env that doesn't support the dynamic import.
// This module will be updated automaticlly in develoment mode, do NOT edit it manually.

import * as $0 from "./_404.tsx";
import * as $1 from "./_app.tsx";
import * as $2 from "./createBlog.tsx";
import * as $3 from "./todos.tsx";
import * as $4 from "./index.tsx";
import * as $5 from "./blog.tsx";
import * as $6 from "./blogs/[blog].tsx";
import * as $7 from "./images/[image].tsx";

export default {
  "/_404": $0,
  "/_app": $1,
  "/createBlog": $2,
  "/todos": $3,
  "/": $4,
  "/blog": $5,
  "/blogs/:blog": $6,
  "/images/:image": $7,
};
