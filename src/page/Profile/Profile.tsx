import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactCrop from "react-image-crop";
import { AppDispatch, RootState } from "../../redux/store";
import { getProfile } from "../../redux/slice/authSlice";
import { APIUrl } from "../../intl/constants";
import { Modal } from "antd";
import "react-image-crop/dist/ReactCrop.css";
import { generateAvatarUpload } from "../../utils/upload";
import Cookies from "js-cookie";
import { ACCESS_TOKEN_KEY } from "../../utils/constants";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

type Props = {};

const Profile = (props: Props) => {
  const [crop, setCrop] = useState<any>({ unit: "%", width: 30, aspect: 1 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const { data, status } = useSelector((state: RootState) => state.auth);
  const [image, setImage] = useState(data?.avatar);
  const [completedCrop, setCompletedCrop] = useState<any>(null);
  const imgRef = useRef<any>(null);
  const navigate = useNavigate();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    console.log(3);

    setIsModalOpen(false);
    const uploadAvatar = async () => {
      const file = await generateAvatarUpload(
        previewCanvasRef.current,
        completedCrop
      );
      console.log(2);
      if (file) {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", Cookies.get(ACCESS_TOKEN_KEY) || "");

        var formdata = new FormData();
        formdata.append("file", file, file.name);

        fetch("/api/user", {
          method: "PUT",
          headers: myHeaders,
          body: formdata,
          redirect: "follow",
        })
          .then((response) => response.text())
          .then(() => {
            toast.success("Thay đổi thành công!");
          })
          .then(() => {
            dispatch(getProfile());
          })
          .catch((error) => console.log("error", error));
      }
    };
    uploadAvatar();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const changeAvatar = () => {
    if (avatarInputRef.current !== null) avatarInputRef.current.click();
  };
  const onChooseAvatar = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const files = e.target.files;
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as any);
    };
    if (files !== null && files.length) reader.readAsDataURL(files[0]);
    setIsModalOpen(true);
  };
  useEffect(() => {
    dispatch(getProfile());
  }, []);
  const onLoad = useCallback((img: any) => {
    imgRef.current = img;
  }, []);
  const previewCanvasRef = useRef<any>(null);

  useEffect(() => {
    if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
      return;
    }

    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    const crop = completedCrop;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext("2d");
    const pixelRatio = window.devicePixelRatio;

    canvas.width = crop.width * pixelRatio * scaleX;
    canvas.height = crop.height * pixelRatio * scaleY;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    );
  }, [completedCrop]);

  return (
    <div className="flex items-center mt-5 h-screen flex-col">
      <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <div className="flex flex-col items-center pb-5">
          <div className="relative mt-5 w-24 h-24 rounded-full overflow-hidden bg-gray-800">
            <img
              className=" object-cover w-full h-full transition-opacity duration-200 ease-in-out opacity-100 hover:opacity-50 cursor-pointer"
              src={`http://api.training.div3.pgtest.co/${data?.avatar}`}
              alt="Bonnie image"
            />
            <div
              className="absolute bg-indigo-600 bg-opacity-30 inset-0 flex flex-col items-center justify-center text-white opacity-0 transition-opacity duration-200 ease-in-out hover:opacity-100 cursor-pointer"
              onClick={changeAvatar}
            >
              <input
                hidden
                type="file"
                accept="image/*"
                ref={avatarInputRef}
                onChange={onChooseAvatar}
              />
              <span className="profilepic__text uppercase text-xs w-1/2 text-center">
                Upload Avatar
              </span>
            </div>
          </div>
          <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
            Name: {data.name}
          </h5>
          <span className="text-sm text-gray-500 dark:text-gray-400">
           Email: {data.email}
          </span>
          <button
            onClick={() => {
              Cookies.remove(ACCESS_TOKEN_KEY);
              navigate("/login2", { replace: true });
            }}
            className="bg-blue-500 mt-5 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
      </div>
      <Modal
        title="Basic Modal"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <ReactCrop
          src={image ? image : ""}
          crop={crop}
          onChange={(newCrop: any) => {
            console.log("====================================");
            console.log(newCrop);
            console.log("====================================");
            setCrop(newCrop);
          }}
          onImageLoaded={onLoad}
          onComplete={(c: any) => setCompletedCrop(c)}
        />
        <div>
          <canvas
            ref={previewCanvasRef}
            style={{
              width: Math.round(completedCrop?.width ?? 0),
              height: Math.round(completedCrop?.height ?? 0),
            }}
          />
        </div>
      </Modal>
    </div>
  );
};

export default Profile;
