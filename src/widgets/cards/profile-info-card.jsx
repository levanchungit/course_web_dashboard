import PropTypes from "prop-types";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Tooltip,
  Button,
} from "@material-tailwind/react";
import { PencilIcon } from "@heroicons/react/24/solid";
import { useState, useEffect } from "react";
import { updateMe } from "@/services/userApi";
import { CustomAlert } from "../custom";

export function ProfileInfoCard({ title, dataProfile }) {
  const [visibleEditProfile, setVisibleEditProfile] = useState(false);
  const [data, setData] = useState(dataProfile);
  const [alert, setAlert] = useState({
    visible: false,
    content: "",
    color: "green",
    duration: 3000
  });

  useEffect(() => {
    setData(dataProfile);
  }, [dataProfile]);

  const handleUpdateMe = async () => {
    // console.log(data)
    let _data = {
      email: data.email,
      passwordHash: data.passwordHash,
      instagram: data.author.instagram,
      linkedin: data.author.linkedin,
      youtube: data.author.youtube,
      avatar: data.author.avatar,
      facebook: data.author.facebook,
      introduction: data.author.introduction,
      name: data.author.name
  };

  console.log(_data);
    try {
      const response = await updateMe(_data);
      if(response){
        console.log(response)
        setAlert({
          visible: true,
          content: "Cập nhật thành công",
          color: "green",
          duration: 3000
        });
      }
    } catch (e) {
      console.log("error: ", e);
    }
  };

  return (
    <Card color="transparent" shadow={false}>
      <CardHeader
        color="transparent"
        shadow={false}
        floated={false}
        className="mx-0 mt-0 mb-4 flex items-center justify-between gap-4"
      >
        <Typography variant="h6" color="blue-gray">
          {title}
        </Typography>

        <Tooltip content="Edit Profile">
          <PencilIcon onClick={()=> setVisibleEditProfile(!visibleEditProfile)} className="h-4 w-4 cursor-pointer text-blue-gray-500" />
        </Tooltip>
      </CardHeader>
      <CardBody className="p-0">    
        {data && data.author && (
          <ul className="flex flex-col gap-4 p-0">
            {Object.keys(data.author).map((el, key) => (
              <li key={key} className="flex items-center gap-4">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-semibold capitalize"
              >
                {el}:
              </Typography>
              {!visibleEditProfile && 
              (typeof data.author[el] === "string" ? (
                <Typography
                  variant="small"
                  className="font-normal text-blue-gray-500"
                >
                  {data.author[el]}
                </Typography>
              ) : (
                data.author[el]
              ))}
              {visibleEditProfile && (<textarea disabled={el === "_id" || el === "create_at" || el === "update_at"}
              value={data.author[el]} onChange={(e)=> setData({...data, author: {...data.author, [el]: e.target.value}})}
              className="p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>)
            }
            </li>
            ))}
          </ul>
        )}


        {visibleEditProfile && 
        (<>
        <Typography
            variant="small"
            color="blue-gray"
            className="font-semibold capitalize"
          >
            Mật khẩu
          </Typography>

        <textarea
          value={data.passwordHash} onChange={(e)=> setData({...data, passwordHash: e.target.value})}
          className="p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>

        </>)}

        {visibleEditProfile && (<Button onClick={handleUpdateMe}>Lưu</Button>)}
      </CardBody>

      <CustomAlert
        alert={alert}
        onClose={() => setAlert({
          visible: false,
          content: "",
          color: "green",
          duration: 3000
        })}/>
    </Card>
  );
}

ProfileInfoCard.defaultProps = {
  action: null,
  description: null,
  details: {},
};

ProfileInfoCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.node,
  details: PropTypes.object,
};

ProfileInfoCard.displayName = "/src/widgets/cards/profile-info-card.jsx";

export default ProfileInfoCard;
