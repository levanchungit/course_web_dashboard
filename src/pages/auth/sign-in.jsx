import React, { useEffect } from "react";
import {
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import { checkAccessTokenValidity, login } from "@/services/authApi";
import { CustomAlert } from "@/utils/AlertUtils";
import { removeTokens, setTokens } from "@/configs/authConfig";
import { setLoading, setLoggedIn, useMaterialTailwindController } from "@/context";
import { useNavigate } from "react-router-dom";

function getMachineId() {
  let machineId = localStorage.getItem('MachineId');
  if (!machineId) {
      machineId = crypto.randomUUID();
      localStorage.setItem('MachineId', machineId);
  }
  return machineId;
}

export function SignIn() {
  const navigate = useNavigate();
  const [dispatch] = useMaterialTailwindController();
  const [email, setEmail] = React.useState("author@gmail.com");
  const [passwordHash, setPasswordHash] = React.useState("123");
  const [device_id, setDevice_id] = React.useState(getMachineId());
  
  React.useEffect(() => {
    const checkLoginStatus = async () => {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      if (accessToken && refreshToken) {
        try {
          await checkAccessTokenValidity(accessToken);
          navigate("/", { replace: true });
        } catch (error) {
          console.log("CATCH: ",error)
          removeTokens();
          navigate("/auth/sign-in", { replace: true });
        }
      }else{
        navigate("/auth/sign-in", { replace: true });
      }
    };

    checkLoginStatus();
  }, []);

  const [alert, setAlert] = React.useState({
    visible: false,
    content: "",
    color: "green",
    duration: 3000
  });

  const handleLogin = async () => {
    try{
      const res = await login(email, passwordHash, device_id);
      // console.log("data", data, res);
      if(res){
        setAlert({
          visible: true,
          content: res?.message,
          color: "green",
          duration: 3000
        });
        setTokens(res?.access_token, res?.refresh_token);

        window.location.href = "/";
      }
    }catch(error){
      // console.error('handleLogin error:', error);
      setAlert({
        visible: true,
        content: error.response?.data?.message || 'An error occurred during login.',
        color: "red",
        duration: 3000
      });
    }
  }
  
  return (
    <section className="m-8 flex gap-4">
      <div className="w-full lg:w-3/5 mt-24">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">Sign In</Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">Enter your email and password to Sign In.</Typography>
        </div>
        <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2">
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Your email
            </Typography>
            <Input
              size="lg"
              placeholder="name@mail.com"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Password
            </Typography>
            <Input
              type="password"
              size="lg"
              placeholder="********"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              value={passwordHash}
              onChange={(e) => setPasswordHash(e.target.value)}
            />
          </div>

          <Button onClick={handleLogin} className="mt-6" fullWidth>
            Sign In
          </Button>
        </form>

      </div>

      <div className="w-2/5 h-full hidden lg:block">
        <img
          src="/img/pattern.png"
          className="h-full w-full object-cover rounded-3xl"
        />
      </div>

      <CustomAlert
        alert={alert}
        onClose={() => setAlert({
          visible: false,
          content: "",
          color: "green",
          duration: 3000
        })}
      />

    </section>
  );
}

export default SignIn;
