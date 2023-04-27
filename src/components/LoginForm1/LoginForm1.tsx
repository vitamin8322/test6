import React, { useEffect, useState } from "react";
import { ILoginParams } from "../../models/auth";
import { fetchApi } from "../../hooks/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { ACCESS_TOKEN_KEY } from "../../utils/constants";
import { FormattedMessage } from "react-intl";

type Props = {};

const LoginForm1 = (props: Props) => {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState<ILoginParams>({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState<Partial<ILoginParams>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const hanleSubmit = async () => {
    setIsSubmitting(true);
    const validationErrors = validate(formValues);
    if (Object.keys(validationErrors).length === 0) {
      setErrors({ email: "", password: "" });
      try {
        const response = await fetchApi("/api/auth/login", "post", {
          email: formValues.email,
          password: formValues.password,
        });
        if (response.code === 200) {
          toast.success("Đăng nhập thành công!");

          Cookies.set(ACCESS_TOKEN_KEY, response.data.token, {
            expires: formValues.rememberMe ? 7 : undefined,
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
    } else {
      setErrors(validationErrors);
      setIsSubmitting(false);
    }
  };

  const validate = (values: ILoginParams) => {
    const errors: Partial<ILoginParams> = {};
    if (!values.email) {
      errors.email = "Hãy nhập email ";
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = "Email không hợp lệ";
    }
    if (!values.password) {
      errors.password = "Hãy nhập password";
    } else if (values.password.length < 6) {
      errors.password = "Password phải có ít nhất 6 kí tự";
    }
    return errors;
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
      <form
        onSubmit={(e) => {
          e.preventDefault();
          hanleSubmit();
        }}
      >
        <div className=" mb-6">
          <div className="">
            <label className="label" htmlFor="email">
              <FormattedMessage id="email" />
            </label>
          </div>
          <div className="">
            <input
              className="input"
              id="email"
              type="text"
              value={formValues.email}
              onChange={(e) =>
                setFormValues({ ...formValues, email: e.target.value })
              }
            />
          </div>
          {errors.email && (
            <div className="text-red-400/100">{errors.email}</div>
          )}
        </div>
        <div className=" mb-6">
          <div className="">
            <label className="label" htmlFor="password">
              <FormattedMessage id="password" />
            </label>
          </div>
          <div className="">
            <input
              className="input"
              id="password"
              type="password"
              value={formValues.password}
              onChange={(e) =>
                setFormValues({ ...formValues, password: e.target.value })
              }
            />
          </div>
          {errors.password && (
            <div className="text-red-400/100">{errors.password}</div>
          )}
        </div>
        <div className=" mb-6">
          <div className="md:w-1/3"></div>
          <label className="md:w-2/3 block text-gray-500 font-bold">
            <input
              className="mr-2 leading-tight"
              onChange={(e) =>
                setFormValues({ ...formValues, rememberMe: !!e.target.checked })
              }
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

export default LoginForm1;
