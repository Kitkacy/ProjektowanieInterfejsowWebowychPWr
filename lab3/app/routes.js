import { index } from "@react-router/dev/routes";

export default [
  index("routes/home.jsx"),
  {
    path: "/new",
    lazy: () => import("./routes/new.jsx")
  }
];