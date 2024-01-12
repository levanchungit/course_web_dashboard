import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/solid";
import { Home, Profile, Posts, Notifications, Post, Categories } from "@/pages/dashboard";
import { SignIn, SignUp } from "@/pages/auth";
import Category from "./pages/dashboard/category";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "profile",
        path: "/profile",
        element: <Profile />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Post",
        path: "/posts",
        element: <Posts />,
      },
      {
        icon: <DocumentTextIcon {...icon} />,
        name: "categories",
        path: "/categories",
        element: <Categories />,
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "notifications",
        path: "/notifications",
        element: <Notifications />,
      },
      {
        icon: <DocumentTextIcon {...icon} />,
        name: "post",
        path: "/post",
        element: <Post />,
      },
      {
        icon: <DocumentTextIcon {...icon} />,
        name: "category",
        path: "/category",
        element: <Category />,
      },
      
      {
        icon: <DocumentTextIcon {...icon} />,
        name: "edit_post",
        path: "/post/:_id",
        element: <Post />,
      },
      {
        icon: <DocumentTextIcon {...icon} />,
        name: "edit_category",
        path: "/category/:_id",
        element: <Category />,
      },
    ],
  },
  {
    title: "auth pages",
    layout: "auth",
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: "sign in",
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "sign up",
        path: "/sign-up",
        element: <SignUp />,
      },
    ],
  },
];

export default routes;
