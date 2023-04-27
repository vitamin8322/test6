import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { fetchApi } from "../../hooks/api";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FormattedMessage, useIntl } from "react-intl";
import { LangContext, messages } from "../../App";
import { LS_LANG } from "../../utils/constants";
import { Auth } from "../../models/auth";
import { RegisterFormFields } from "../../models/auth";
import { useSelector, useDispatch } from "react-redux";
import { getProductFetch } from "../../redux/slice/productSlice";
import { AppDispatch } from "../../redux/store";


type Props = {};


interface Locatin {
  id: number;
  pid: number | null;
  name: string;
  createdAt: string;
}

const RegisterForm = (props: Props) => {
  const { locale } = useContext(LangContext);
  const dispatch = useDispatch<AppDispatch>();

  const currentLang = locale;
  const intl = useIntl();
  const navigate = useNavigate();
  const [location, setLocation] = useState([]);
  const [state, setState] = useState([]);
  const [formValue, setFormValue] = useState<RegisterFormFields>({
    email: "",
    password: "",
    repeatPassword: "",
    name: "",
    gender: "",
    state: 0,
    region: 0,
  });
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormFields>({
    defaultValues: {
      email: "",
      password: "",
      repeatPassword: "",
      name: "",
      gender: "",
      region: 0,
      state: 0,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetchApi("/api/location", "get");
      //   setFormValue({ ...formValue, location: res.data });
      setLocation(res.data);
    };
    fetchData();
    
  }, []);

  const onSubmit = async (formData: RegisterFormFields) => {
    console.log(formData);

    try {
      const response = await fetchApi("/api/auth/register", "post", {
        email: formData.email,
        password: formData.password,
        repeatPassword: formData.repeatPassword,
        name: formData.name,
        gender: "male",
        region: formData.region,
        state: formData.state,
      });
      console.log("response", response);
      if (response.code === 200) {
        toast.success("Đăng ký thành công!");
        setTimeout(() => {
          navigate("/home");
        }, 1000);
      }
      if (response.code === 400) {
        // setErrorMessage(response.message);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    
  }, [])

  const fetchApiState = async (id: number) => {
    const res = await fetchApi(`/api/location?pid=${id}`, "get");
    
    setState(res.data);
  };

  const hanleChangeLocation = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormValue({ ...formValue, region: parseInt(e.target.value, 10) });

    fetchApiState(parseInt(e.target.value, 10));
  };

  return (
    <div className="w-full max-w-lg mt-10">
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
            {errors.email &&
              (errors.email.type == "required" ? (
                <div className="text-red-400/100">
                  <FormattedMessage id="emailRequire" />{" "}
                </div>
              ) : (
                <div className="text-red-400/100">
                  <FormattedMessage id="emailInvalid" />
                </div>
              ))}
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
              type="text"
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
            {errors.password &&
              (errors.password.type == "required" ? (
                <div className="text-red-400/100">
                  <FormattedMessage id="passwordRequire" />{" "}
                </div>
              ) : (
                <div className="text-red-400/100">
                  <FormattedMessage id="minPasswordInvalid" />
                </div>
              ))}
          </div>
        </div>
        <div className="mb-6">
          <div>
            <label className="label" htmlFor="repeatPassword">
              <FormattedMessage id="repeatPassword" />
            </label>
          </div>
          <div>
            <input
              className="input"
              id="repeatPassword"
              type="text"
              {...register("repeatPassword", {
                required: true,
                validate: (val: string) => {
                  if (watch("password") != val) {
                    return intl.formatMessage({
                      id: "repeatPasswordWrong",
                    });
                  }
                },
              })}
            />
            {errors.repeatPassword && (
              <div className="text-red-400/100">
                <FormattedMessage id="repeatPasswordWrong" />
              </div>
            )}
          </div>
        </div>
        <div className="mb-6">
          <div>
            <label className="label" htmlFor="name">
              <FormattedMessage id="name" />
            </label>
          </div>
          <div>
            <input
              className="input"
              id="name"
              type="text"
              {...register("name", {
                required: intl.formatMessage({
                  id: "nameRequire",
                }),
              })}
            />

            {errors.name && (
              <div className="text-red-400/100">
                <FormattedMessage id="nameRequire" />
              </div>
            )}
          </div>
        </div>
        <div className="mb-6">
          <label htmlFor="location" className="label">
            <FormattedMessage id="region" />
          </label>
          <select
            id="region"
            {...register("region", {
              required: intl.formatMessage({
                id: "regionRequire",
              }),
            })}
            className="select"
            onChange={(e) => hanleChangeLocation(e)}
          >
            <option key="default" value="">
              -- Select an option --
            </option>
            {location &&
              location.map((loc: any, id: number) => (
                <option key={id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
          </select>
          {errors.region && (
            <div className="text-red-400/100">
              <FormattedMessage id="regionRequire" />
            </div>
          )}
        </div>
        {state.length > 0 && (
          <div className="mb-6">
            <label htmlFor="state" className="label">
              <FormattedMessage id="state" />
            </label>
            <select
              id="state"
              {...register("state", {
                required: intl.formatMessage({
                  id: "stateRequire",
                }),
              })}
              className="select"
            >
              <option key="default" value="">
                -- Select an option --
              </option>
              {state &&
                state.map((loc: any, id: number) => (
                  <option key={id} value={loc.pid}>
                    {loc.name}
                  </option>
                ))}
            </select>
            {errors.state && (
              <div className="text-red-400/100">
                <FormattedMessage id="stateRequire" />
              </div>
            )}
          </div>
        )}
        <div className="md:flex md:items-center">
          <div className="md:w-1/3"></div>
          <div className="md:w-2/3">
            <button
              className="shadow bg-blue-500 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
              type="submit"
            >
              <FormattedMessage id="register" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
