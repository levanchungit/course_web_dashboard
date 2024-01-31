import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
  DocumentTextIcon,
  FilmIcon,
  AcademicCapIcon,
  TagIcon
} from "@heroicons/react/24/solid";

import { Home, Profile, Posts, Notifications, Post, Categories, Courses, Course, Video, Videos } from "@/pages/dashboard";
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
        icon: <TagIcon {...icon} />,
        name: "categories",
        path: "/categories",
        element: <Categories />,
      },
      {
        icon: <AcademicCapIcon {...icon} />,
        name: "Course",
        path: "/courses",
        element: <Courses />,
      },
      {
        icon: <FilmIcon {...icon} />,
        name: "Video",
        path: "/videos",
        element: <Videos />,
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
        icon: <TagIcon {...icon} />,
        name: "category",
        path: "/category",
        element: <Category />,
      },
      {
        icon: <AcademicCapIcon {...icon} />,
        name: "course",
        path: "/course",
        element: <Course />,
      },
      {
        icon: <DocumentTextIcon {...icon} />,
        name: "edit_post",
        path: "/post/:_id",
        element: <Post />,
      },
      {
        icon: <TagIcon {...icon} />,
        name: "edit_category",
        path: "/category/:_id",
        element: <Category />,
      },
      {
        icon: <AcademicCapIcon {...icon} />,
        name: "edit_course",
        path: "/course/:_id",
        element: <Course />,
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
