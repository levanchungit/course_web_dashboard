import React from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  Button,
  Input,
  Textarea,
  Select,
  Option,
  Popover,
  PopoverHandler,
  PopoverContent,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Checkbox,
  Tabs,
  TabsHeader,
  TabsBody,
  TabPanel,
  Tab,
} from "@material-tailwind/react";
import { DayPicker } from "react-day-picker";
import vi from 'date-fns/locale/vi'
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import { createCourse, getCourse, updateCourse}from '@/services/courseApi';
import { getCategories }from '@/services/categoryApi';
import { LIST_STATUS_COURSE, LIST_STATUS_POST } from "@/constants/basic";
import { formatDate, parseDate, saveDateToDB } from "@/utils/Common";
import { CustomAlert } from "@/widgets/custom/AlertUtils";
import { Link, useNavigate, useParams } from "react-router-dom";
import { removeTokens } from "@/configs/authConfig";
import MarkDown from "@/widgets/layout/markdown";
import { uploadSingle } from "@/services/uploadApi";
import { findDOMNode } from "react-dom";
import MDEditor from "@uiw/react-md-editor";

export function Course() {
  const navigate = useNavigate();
  let { _id } = useParams(); // Lấy _id từ URL

  const [publishAt, setPublishAt] = React.useState(new Date());
  const [coverImage, setCoverImage] = React.useState("")
  const [loadingCoverImage, setLoadingCoverImage] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [content, setContent] = React.useState("");
  const [categories, setCategories] = React.useState([]);
  const [idPlaylist, setIdPlaylist] = React.useState([]);
  const [selectedCategories, setSelectedCategories] = React.useState([]);
  const [items, setItems] = React.useState([]);
  const [note, setNote] = React.useState("");
  const [statusComment, setStatusComment] = React.useState(false);
  const [status, setStatus] = React.useState(LIST_STATUS_POST.draft);
  const [alert, setAlert] = React.useState({
    visible: false,
    content: "",
    color: "green",
    duration: 3000
  });
  const [result, setResult] = React.useState("");
  const [defaultTab, setDefaultTab] = React.useState("Content");
  const [loading, setLoading] = React.useState(false);

  const goBack = () => {
    navigate(-1);
  }

  const fetchDataCategories = async () => {
    try {
      let limit = 10;
      let page = 1;
      const data = await getCategories(limit, page);
      if (data) {
        return data;
      }
    } catch (error) {
      console.error('Error fetching categories data:', error);
      throw error;
    }
  };
  
  const fetchDataCourseById = async (_id) => {
    try {
      const data = await getCourse(_id);
      if (data) {
        return data;
      }
    } catch (error) {
      console.error('Error fetching course data:', error);
      throw error;
    }
  };
  
  const fetchData = async () => {
    setLoading(true);
    try {
      const [categoriesData, courseDetailData] = await Promise.all([
        fetchDataCategories(),
        _id ? fetchDataCourseById(_id) : Promise.resolve(null), // Thay _id bằng giá trị tương ứng
  
      ]);
  
      // Xử lý dữ liệu danh mục
      const categories = categoriesData?.results || [];
      setCategories(categories);
  
      // Xử lý dữ liệu bài viết (nếu có)
      if (courseDetailData) {
        setTitle(courseDetailData.result.title);
        setDescription(courseDetailData.result.description);
        setContent(courseDetailData.result.content);
        setCoverImage(courseDetailData.result.cover_image);
        setStatus(courseDetailData.result.status);
        setPublishAt(courseDetailData.result.publish_at);
        setItems(courseDetailData.result.items);
        setStatusComment(courseDetailData.result.statusComment);
        setIdPlaylist(courseDetailData.result.idPlaylist);
        
        // Tạo một mảng danh mục mới với trạng thái checked dựa trên danh sách đã chọn
        const updatedCategories = categories.map((category) => ({
          ...category,
          checked: courseDetailData.result.categories.some(
            (selectedCategory) => selectedCategory === category._id
          ),
        }));

        setCategories(updatedCategories);
        setSelectedCategories(updatedCategories.filter((item) => item.checked));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  React.useEffect(() => {
    fetchData();
  }, [_id]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setResult(content);
    }, 0);
    return () => clearTimeout(timeout);
  }, [content]);

  const handleDate = (selectedDate) => {
    const parsedDate = parseDate(selectedDate);
    setPublishAt(parsedDate);
  }

  const handleChangeTime = (selectedTime) => {
    if(!selectedTime) return;
    const [hours, minutes] = selectedTime.split(':');
    const updatedDateTime = new Date(publishAt);
    updatedDateTime.setHours(parseInt(hours, 10));
    updatedDateTime.setMinutes(parseInt(minutes, 10));
    setPublishAt(updatedDateTime);
  }

  const handleCategories = (_id) => {
    const newCategories = categories.map((item) =>
      item._id === _id ? { ...item, checked: !item.checked } : item
    );
    setCategories(newCategories);
    const selected = newCategories.filter((item) => item.checked);
    setSelectedCategories(selected);
  };

  const handleStatus = (name) => {
    setStatus(name);
  };

  const handleNote = (note) => {
    setNote(note);
  };


  const handleImageChange = async (event) => {
    setCoverImage("");
    setLoadingCoverImage(true);
    const file = event.target.files[0];
  
    const uploadImage = async (file) => {
      try {
        const formData = new FormData();
        formData.append('file', file);
        const data = await uploadSingle(formData);
        return data.secure_url;
      } catch (error) {
        throw error.response ? error.response.data.message : 'Tải hình ảnh thất bại';
      }
    };
  
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const imageUrl = await uploadImage(file);
          setAlert({
            visible: true,
            content: 'Tải hình ảnh thành công',
            color: 'green',
            duration: 3000
          });
          setCoverImage(imageUrl);
        } catch (error) {
          console.error(error);
          setAlert({
            visible: true,
            content: error,
            color: 'red',
            duration: 3000
          });
        } finally {
          setLoadingCoverImage(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  let footer = <p>Please pick a day.</p>;
  if (publishAt) {
    footer = <p>You picked {formatDate(publishAt)}</p>;
  }

  return (
    <div className="">
      <Card>
        <CardHeader
          color="transparent"
          floated={false}
          shadow={false}
          // row
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
            {_id ? "Chỉnh sửa" : "Tạo mới"}
          </Typography>
        </CardHeader>

        <CardBody className="flex flex-col p-4 mb-2">
          <form className="flex flex-row gap-4 mx-auto w-full flex-wrap lg:flex-nowrap">

            <div className="flex flex-col gap-4 w-full">
              <div className="flex flex-col items-center">
                {coverImage && (
                    <img
                      className="w-full max-w-[450px] center"
                      src={coverImage}
                      alt="Selected Image"
                    />
                )}
                  <Link to={`https://www.youtube.com/playlist?list=${idPlaylist}`} target="_blank" className="text-blue-500 hover:underline">
                    <Typography className="!text-sm">
                      {`https://youtu.be/playlist?list=${idPlaylist}`}
                    </Typography>
                  </Link>

                
              </div>

              <Input
                size="lg"
                placeholder="Tiêu đề"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900 !min-w-0 !relative !h-auto"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <Textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)} 
                color="gray"
                variant="outlined"
                label="Description"
                rows={2}/>

              {/* SELECT STATUS */}
              <Select
                label="Trạng thái"
                animate={{
                  mount: { y: 0 },
                  unmount: { y: 25 },
                }}
                value={status}
                onChange={handleStatus}
                >
                {Object.values(LIST_STATUS_COURSE).map((item) => {
                  return <Option className="capitalize" key={item} value={item}>{`${item}`}</Option>;
                })}
              </Select>

              {/* Items */}
              <div className="flex flex-row items-center gap-2">
                <Typography variant="h6" color="blue-gray">
                  Items
                </Typography>
              </div>

              <div className="flex flex-col gap-4 w-full h-96 pr-4 overflow-y-auto">
                {items && items.length > 0 && items.map((item, index) => {
                    return (
                      // item
                      <div key={index} className="flex flex-col gap-2 border p-4 rounded-md shadow-md">
                        <div className="flex flex-col items-center gap-2">
                          <img
                            className="w-full max-w-[450px] object-cover object-center"
                            src={item.thumbnails.url}
                            alt="Selected Image"
                          />
                          <p className="text-xs text-gray-600">videoId: {item.videoId}</p>

                        </div>
                        <div className="flex flex-row items-center justify-between">
                          <div className="flex flex-col gap-1 w-full">
                            <p className="text-sm text-gray-600">{item.title}</p>
                            <p className="text-xs text-gray-500 overflow-hidden">{item.description}</p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500">{formatDate(item.publish_at)}</p>

                      </div>
                    );
                })}
              </div>
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

export default Course;