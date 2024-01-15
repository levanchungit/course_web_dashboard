import React from "react";
import PropTypes from "prop-types";
import { checkAccessTokenValidity } from "@/services/authApi";
import { removeTokens } from "@/configs/authConfig";
import { useNavigate } from "react-router-dom";

export const MaterialTailwind = React.createContext(null);
MaterialTailwind.displayName = "MaterialTailwindContext";

export function reducer(state, action) {
  switch (action.type) {
    case "OPEN_SIDENAV": {
      return { ...state, openSidenav: action.value };
    }
    case "SIDENAV_TYPE": {
      return { ...state, sidenavType: action.value };
    }
    case "SIDENAV_COLOR": {
      return { ...state, sidenavColor: action.value };
    }
    case "TRANSPARENT_NAVBAR": {
      return { ...state, transparentNavbar: action.value };
    }
    case "FIXED_NAVBAR": {
      return { ...state, fixedNavbar: action.value };
    }
    case "OPEN_CONFIGURATOR": {
      return { ...state, openConfigurator: action.value };
    }
    case "SET_LOADING": {
      return { ...state, isLoading: action.value };
    }
    case "SET_LOGGED_IN": {
      return { ...state, isLoggedIn: action.value };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

export function MaterialTailwindControllerProvider({ children }) {
  const navigate = useNavigate();
  const initialState = {
    openSidenav: false,
    // sidenavColor: "dark",
    sidenavType: "white",
    transparentNavbar: true,
    fixedNavbar: false,
    openConfigurator: false,
    isLoading: true, // Thêm trạng thái tải
    isLoggedIn: false, // Thêm trạng thái đăng nhập
  };

  const [controller, dispatch] = React.useReducer(reducer, initialState);
  const value = React.useMemo(
    () => [controller, dispatch],
    [controller, dispatch]
  );

  React.useEffect(() => {
    const checkLoginStatus = async () => {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      if (accessToken && refreshToken) {
        try {
          const response = await checkAccessTokenValidity(accessToken);
          if(response.status == 200){
            dispatch({ type: "SET_LOGGED_IN", value: true });
            navigate("/", {replace: true});
          }
        } catch (error) {
          dispatch({ type: "SET_LOGGED_IN", value: false });
          removeTokens();
          navigate("/auth/sign-in", { replace: true });
        }
      }

      // Đánh dấu là đã kiểm tra xong
      dispatch({ type: "SET_LOADING", value: false });
    };

    checkLoginStatus();
  }, []);

  return (
    <MaterialTailwind.Provider value={value}>
      {children}
    </MaterialTailwind.Provider>
  );
}
export function useMaterialTailwindController() {
  const context = React.useContext(MaterialTailwind);

  if (!context) {
    throw new Error(
      "useMaterialTailwindController should be used inside the MaterialTailwindControllerProvider."
    );
  }

  return context;
}

MaterialTailwindControllerProvider.displayName = "/src/context/index.jsx";

MaterialTailwindControllerProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const setOpenSidenav = (dispatch, value) =>
  dispatch({ type: "OPEN_SIDENAV", value });
export const setSidenavType = (dispatch, value) =>
  dispatch({ type: "SIDENAV_TYPE", value });
export const setSidenavColor = (dispatch, value) =>
  dispatch({ type: "SIDENAV_COLOR", value });
export const setTransparentNavbar = (dispatch, value) =>
  dispatch({ type: "TRANSPARENT_NAVBAR", value });
export const setFixedNavbar = (dispatch, value) =>
  dispatch({ type: "FIXED_NAVBAR", value });
export const setOpenConfigurator = (dispatch, value) =>
  dispatch({ type: "OPEN_CONFIGURATOR", value });
export const setLoading = (dispatch, value) =>
  dispatch({ type: "SET_LOADING", value }); // Thêm action set loading
export const setLoggedIn = (dispatch, value) =>
  dispatch({ type: "SET_LOGGED_IN", value }); // Thêm action set đăng nhập
