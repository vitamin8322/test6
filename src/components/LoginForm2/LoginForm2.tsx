import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { fetchApi } from "../../hooks/api";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ILoginParams } from "../../models/auth";
import Cookies from "js-cookie";
import { ACCESS_TOKEN_KEY } from "../../utils/constants";
import { FormattedMessage, useIntl } from "react-intl";

type LoginFormFields = {
  email: string;
  password: string;
  rememberMe: boolean;
};

const LoginForm2 = () => {
  const  intl  = useIntl();

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormFields>({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (formData: LoginFormFields) => {
    try {
      const response = await fetchApi("/api/auth/login", "post", {
        email: formData.email,
        password: formData.password,
      });
      console.log("response", response);
      if (response.code === 200) {
        toast.success("Đăng nhập thành công!");
        console.log("123", formData.rememberMe);

        Cookies.set(ACCESS_TOKEN_KEY, response.data.token, {
          expires: formData.rememberMe ? 7 : undefined,
        });
        setTimeout(() => {
          navigate("/home");
        }, 1000);
      }
      if (response.code === 400) {
        setErrorMessage(response.message);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <div className="w-full max-w-lg mt-10">
      {errorMessage && (
        <>
          <div
            className="border  border-red-400 rounded bg-red-100 px-4 py-3 text-red-700"
            role="alert"
            style={{ width: "100%" }}
          >
            {errorMessage}
          </div>
        </>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-6">
          <div>
            <label className="label" htmlFor="email">
              <FormattedMessage id="email" />
            </label>
          </div>
          <div>
            <input
              className="input"
              id="email"
              type="text"
              {...register("email", {
                required: intl.formatMessage({
                  id: "emailRequire",
                }),
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: intl.formatMessage({
                    id: "emailInvalid",
                  }),
                },
              })}
            />
            {errors.email && (
              <div className="text-red-400/100">{errors.email.message}</div>
            )}
          </div>
        </div>
        <div className="mb-6">
          <div>
            <label className="label" htmlFor="password">
              <FormattedMessage id="password" />
            </label>
          </div>
          <div>
            <input
              className="input"
              id="password"
              type="password"
              {...register("password", {
                required: intl.formatMessage({
                  id: "passwordRequire",
                }),
                minLength: {
                  value: 6,
                  message: intl.formatMessage({
                    id: "minPasswordInvalid",
                  }),
                },
              })}
            />
            {errors.password && (
              <div className="text-red-400/100">{errors.password.message}</div>
            )}
          </div>
        </div>
        <div className=" mb-6">
          <div className="md:w-1/3"></div>
          <label className="md:w-2/3 block text-gray-500 font-bold">
            <input
              className="mr-2 leading-tight"
              {...register("rememberMe")}
              type="checkbox"
            />
            <span className="text-sm">
              <FormattedMessage id="rememberMe" />
            </span>
          </label>
        </div>
        <div className="md:flex md:items-center">
          <div className="md:w-1/3"></div>
          <div className="md:w-2/3">
            <button
              className="shadow bg-blue-500 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
              type="submit"
            >
              Sign Up
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginForm2;
