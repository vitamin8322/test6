import React from "react";
import logo from "../../logo-420-x-108.png";
import RegisterForm from "../../components/RegisterForm/RegisterForm";

type Props = {};

const Register = (props: Props) => {
  return (
    <div className="flex items-center justify-center h-full flex-col">
      <img src={logo} alt="logo" className="max-w-xs" />
        <RegisterForm />
    </div>
  );
};

export default Register;
