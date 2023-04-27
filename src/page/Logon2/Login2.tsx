import React from "react";
import LoginForm2 from "../../components/LoginForm2/LoginForm2";
import logo from '../../logo-420-x-108.png';

type Props = {};

const Login2 = (props: Props) => {
  return (
    <div className="flex items-center justify-center h-screen flex-col">
      <img src={logo} alt="logo" className="max-w-xs" />
      <LoginForm2 />
    </div>
  );
};

export default Login2;
