import Loadable from "react-loadable";
import Loading from "@/components/Loading";
const Index = Loadable({
  loader: () => import(/*webpackChunkName:'Index'*/ "@/views/index"),
  loading: Loading,
});
const Error404 = Loadable({
  loader: () => import(/*webpackChunkName:'Error404'*/ "@/views/error/404"),
  loading: Loading,
});
const User = Loadable({
  loader: () => import(/*webpackChunkName:'User'*/ "@/views/user"),
  loading: Loading,
});
const Bucket = Loadable({
  loader: () => import(/*webpackChunkName:'Bucket'*/ "@/views/bucket"),
  loading: Loading,
});
const SpaceOverflow = Loadable({
  loader: () =>
    import(
      /*webpackChunkName:'SpaceOverflow'*/ "@/views/bucket/overflow/spaceOverflow"
    ),
  loading: Loading,
});
const FileMsg = Loadable({
  loader: () =>
    import(/*webpackChunkName:'FileMsg'*/ "@/views/bucket/overflow/fileMsg"),
  loading: Loading,
});
const SpaceSet = Loadable({
  loader: () =>
    import(/*webpackChunkName:'SpaceSet'*/ "@/views/bucket/overflow/spaceMsg"),
  loading: Loading,
});
const BackUp = Loadable({
  loader: () => import("@/views/bucket/overflow/backUp"),
  loading: Loading,
});
const Auth = Loadable({
  loader: () =>
    import(/*webpackChunkName:'Auth'*/ "@/views/bucket/overflow/spaceMsg/auth"),
  loading: Loading,
});
const Tag = Loadable({
  loader: () =>
    import(/*webpackChunkName:'Tag'*/ "@/views/bucket/overflow/spaceMsg/tag"),
  loading: Loading,
});
const Person = Loadable({
  loader: () => import(/*webpackChunkName:'Person'*/ "@/views/person"),
  loading: Loading,
});
const Bug = Loadable({
  loader: () => import(/*webpackChunkName:'Bug'*/ "@/views/bug"),
  loading: Loading,
});
const SDK = Loadable({
  loader: () => import("@/views/sdk"),
  loading: Loading,
});

export default [
  { path: "/dashboard", component: Index, roles: ["admin", "user", "guest"] },
  { path: "/user", component: User, roles: ["admin", "user"] },
  { path: "/bucket", component: Bucket, roles: ["admin", "user"] },
  { path: "/spaceOverflow", component: SpaceOverflow, roles: ["user"] },
  { path: "/fileMsg", component: FileMsg, roles: ["user"] },
  { path: "/spaceSet", component: SpaceSet, roles: ["user"] },
  { path: "/backUp", component: BackUp, roles: ["admin", "user", "guest"] },
  { path: "/auth", component: Auth, roles: ["user"] },
  { path: "/tag", component: Tag, roles: ["user"] },
  { path: "/person", component: Person, roles: ["user"] },
  { path: "/bug", component: Bug, roles: ["admin"] },
  { path: "/sdk", component: SDK, roles: ["admin", "user", "guest"] },
  { path: "/error/404", component: Error404 },
];
