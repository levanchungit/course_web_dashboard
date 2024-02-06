import React from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  Input,
  Textarea,
  Button
} from "@material-tailwind/react";

import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import { createCategory, getCategory, updateCategory }from '@/services/categoryApi';
import { LIST_STATUS_POST } from "@/constants/basic";
import { saveDateToDB } from "@/utils/Common";
import { CustomAlert } from "@/widgets/custom/AlertUtils";
import { useNavigate, useParams } from "react-router-dom";
import { removeTokens } from "@/configs/authConfig";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";


export function Category() {
  const navigate = useNavigate();
  const { _id } = useParams(); // Lấy _id từ URL
  const [name, setName] = React.useState("");
  const [note, setNote] = React.useState("");
  const [alert, setAlert] = React.useState({
    visible: false,
    content: "",
    color: "green",
    duration: 3000
  });
  const [loading, setLoading] = React.useState(false);

  
  const fetchDataPostById = async (_id) => {
    try {
      const data = await getCategory(_id);
      if (data) {
        return data;
      }
    } catch (error) {
      console.error('Error fetching post data:', error);
      throw error;
    }
  };
  
  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await fetchDataPostById(_id);
      if (data) {
        setName(data.result.name);
        setNote(data.result.note);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  React.useEffect(() => {
    if(_id){
      fetchData();
    }
  }, [_id]);

  const handleSubmit = () => {
    setLoading(true);
    if (_id) {
      handleSave();
    } else {
      handleCreate();
    }
  };
  
  const handleCreate = async () => {
    let _data = {
      name: name,
      note: note
    }

    try {
      const data = await createCategory(_data);
      if(data){
        setAlert({
          visible: true,
          content: "Tạo thành công",
          color: "green",
          duration: 3000
        });
      }
    } catch (error) {
      setAlert({
        visible: true,
        content: error.data.message,
        color: "red",
        duration: 3000
      });
      if(error.status === 401){
        removeTokens();
        navigate("/auth/sign-in", { replace: true });
      }
      console.log('Error fetching data handleCreate:', error.statusText);
    } finally {
      setLoading(false);
    }
  }

  const handleSave = async () => {
    let _data = {
      name: name,
      note: note
    }

    try {
      const data = await updateCategory(_id, _data);
      if(data){
        setAlert({
          visible: true,
          content: "Cập nhật thành công",
          color: "green",
          duration: 3000
        });
      }
    } catch (error) {
      setAlert({
        visible: true,
        content: error.statusText || error.data.message,
        color: "red",
        duration: 3000
      });
      if(error.status === 401){
        removeTokens();
        navigate("/auth/sign-in", { replace: true });
      }
      console.log('Error fetching data handleSave:', error.statusText);
    } finally {
      setLoading(false);
    }
  }

  const goBack = () => {
    navigate(-1);
  }

  return (
    <div className="">
      <Card>
        <CardHeader
          color="transparent"
          floated={false}
          shadow={false}
          className="flex items-center"
        >
          {/* arrow back */}
          <Button
            size="sm"
            variant="text"
            onClick={goBack}
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </Button>

          <Typography variant="h5" color="blue-gray">
            {_id ? "Chỉnh sửa thể loại" : "Tạo thể loại"}
          </Typography>
        </CardHeader>
        <CardBody className="flex flex-col p-4 mb-2">
          <form className="flex flex-row gap-4 mx-auto w-full flex-wrap lg:flex-nowrap">
            {/* CONTENT */}
            <div className="flex flex-col gap-4 w-full">
              <Input
                size="lg"
                placeholder="Tên thể loại"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900 !min-w-0 !relative !h-auto"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <Textarea
                value={note}
                placeholder="Ghi chú"
                onChange={(e) => setNote(e.target.value)}
                variant="outlined"
                spellCheck="false"
                rows={5}/> 

              <Button disabled={loading} onClick={handleSubmit} fullWidth>
                {_id ? "Cập nhật" : "Lưu"}
              </Button>
            </div>

          </form>
        </CardBody>
      </Card>

      <CustomAlert
          alert={alert}
          onClose={() => setAlert({
            visible: false,
            content: "",
            color: "green",
            duration: 3000
          })}
        />
    </div>
  );
}

export default Category;