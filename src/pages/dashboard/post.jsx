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
import { createPost, getPost, updateComment, updatePost}from '@/services/postApi';
import { getCategories }from '@/services/categoryApi';
import { LIST_STATUS_POST } from "@/constants/basic";
import { formatDate, parseDate, saveDateToDB } from "@/utils/Common";
import { CustomAlert } from "@/widgets/custom/AlertUtils";
import { useNavigate, useParams } from "react-router-dom";
import { removeTokens } from "@/configs/authConfig";
import MarkDown from "@/widgets/layout/markdown";
import { uploadSingle } from "@/services/uploadApi";
import { findDOMNode } from "react-dom";
import MDEditor from "@uiw/react-md-editor";

export function Post() {
  const navigate = useNavigate();
  let { _id } = useParams(); // Lấy _id từ URL

  const [publishAt, setPublishAt] = React.useState(new Date());
  const [coverImage, setCoverImage] = React.useState("")
  const [loadingCoverImage, setLoadingCoverImage] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [categories, setCategories] = React.useState([]);
  const [selectedCategories, setSelectedCategories] = React.useState([]);
  const [comments, setComments] = React.useState([]);
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
  
  const fetchDataPostById = async (_id) => {
    try {
      const data = await getPost(_id);
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
      const [categoriesData, postDetailData] = await Promise.all([
        fetchDataCategories(),
        _id ? fetchDataPostById(_id) : Promise.resolve(null), // Thay _id bằng giá trị tương ứng
  
      ]);
  
      // Xử lý dữ liệu danh mục
      const categories = categoriesData?.results || [];
      setCategories(categories);
  
      // Xử lý dữ liệu bài viết (nếu có)
      if (postDetailData) {
        setTitle(postDetailData.result.title);
        setContent(postDetailData.result.content);
        setCoverImage(postDetailData.result.cover_image);
        setStatus(postDetailData.result.status);
        setNote(postDetailData.result.note);
        setPublishAt(new Date(postDetailData.result.publish_at));
        setComments(postDetailData.result.comments);
        setStatusComment(postDetailData.result.statusComment);
        
        // Tạo một mảng danh mục mới với trạng thái checked dựa trên danh sách đã chọn
        const updatedCategories = categories.map((category) => ({
          ...category,
          checked: postDetailData.result.categories.some(
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

  const handleSubmit = (statusComment) => {
    setLoading(true);
    if (_id) {
      handleSave(statusComment);
    } else {
      handleCreate();
    }
  };
  
  const handleCreate = async () => {
    let _idCategories = selectedCategories.map((item) => item._id);
    let _data = {
      title: title,
      content: content,
      cover_image: coverImage,
      author: "656ee29ca4fca328dc6f0c89",
      categories: _idCategories,
      publish_at: (status == "published" || status == "schedule") ? saveDateToDB(publishAt) : null,
      status: status,
      note: note
    }

    try {
      const data = await createPost(_data);
      if(data){
        setAlert({
          visible: true,
          content: "Tạo bài viết thành công",
          color: "green",
          duration: 3000
        });
        _id = data.id;
        console.log(_id)
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

  const handleSave = async (statusComment) => {
    console.log("statusComment ",statusComment)
    let _idCategories = selectedCategories.map((item) => item._id);
    let _data = {
      title: title,
      content: content,
      cover_image: coverImage,
      author: "656ee29ca4fca328dc6f0c89",
      categories: _idCategories,
      publish_at: (status == "published" || status == "schedule") ? saveDateToDB(publishAt) : null,
      status: status,
      note: note,
    }

    //nếu có truyền thì mới cập nhật statusComment
    if(statusComment != undefined){
      _data.statusComment = !statusComment;
    }

    try {
      const data = await updatePost(_id, _data);
      if(data){
        setAlert({
          visible: true,
          content: "Cập nhật bài viết thành công",
          color: "green",
          duration: 3000
        });

        setStatusComment(!statusComment);
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
      console.log('Error fetching data handleSave:', error.statusText);
    } finally {
      setLoading(false);
    }
  }

  // DROP IMAGE
  const handleRegularPaste = async (event) => {
    const items = (event.clipboardData || window.clipboardData).items;
    
    for (const item of items) {
      if (item.type.indexOf('image') !== -1) {
        const file = item.getAsFile();
        if (file) {
          await handleImageUpload(file);
        }
      } else if (item.type === 'text/plain') {
        const text = await new Promise((resolve) => {
          item.getAsString((str) => {
            resolve(str);
          });
        });

        setContent((prevContent) => `${prevContent}${text}`);
      }
    }
  };
  
  const handleDropOrPaste = async (event) => {
    event.preventDefault();
  
    if (event.type === 'drop') {
      const file = event.dataTransfer.files[0];
      if (file) {
        await handleImageUpload(file);
      }
    } else if (event.type === 'paste') {
      handleRegularPaste(event);
    }
  };

  const handleImageUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
  
      const placeholderRegex = /!\[Uploading .*?\]\((.*?)\)/;
      const existingPlaceholder = content.substring(
        contentRef.current.selectionStart,
        contentRef.current.selectionEnd
      ).match(placeholderRegex);
  
      let imageUrl = '';
  
      if (existingPlaceholder) {
        imageUrl = existingPlaceholder[1];
        setContent((prevContent) =>
          prevContent.replace(placeholderRegex, `![${file.name}](${imageUrl})`)
        );
      } else {
        // Display placeholder immediately
        setContent((prevContent) => `${prevContent}![Uploading ${file.name}]()`);
        
        const data = await uploadSingle(formData);
        imageUrl = data.secure_url;
        if(data){
          setAlert({
            visible: true,
            content: `Tải ảnh ${file.name} thành công`,
            color: 'green',
            duration: 3000
          });
        }
  
        setContent((prevContent) =>
          prevContent.replace(`![Uploading ${file.name}]()`, `![${file.name}](${imageUrl})`)
        );
      }
    } catch (error) {
      setAlert({
        visible: true,
        content: `Tải ảnh ${file.name} thất bại`,
        color: 'red',
        duration: 3000
      });
      console.error('Error uploading image:', error);
    }
  };

  const handleFormat = (format) => {
    const textarea = findDOMNode(contentRef.current).querySelector("textarea");
  
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = textarea.value.substring(start, end);
  
      // Thêm định dạng vào đầu và cuối của đoạn văn bản đã chọn
      const formattedText = `${format}${selectedText}${format}`;
  
      // Tạo đoạn văn bản mới với định dạng
      const updatedContent = textarea.value.substring(0, start) + formattedText + textarea.value.substring(end);
  
      // Cập nhật nội dung của Textarea
      setContent(updatedContent);
    } else {
      console.error("Textarea reference is not available.");
    }
  };

  const handleFormatButtonClick = (format) => {
    const textarea = findDOMNode(contentRef.current).querySelector("textarea");

    if (textarea) {
      let start = textarea.selectionStart;
      let end = textarea.selectionEnd;
      const selectedText = textarea.value.substring(start, end).trim();

      // Kiểm tra xem đoạn văn bản đã có định dạng hay không
      const isFormatted = textarea.value.substring(start - format.length, start) === format &&
                          textarea.value.substring(end, end + format.length) === format;

      // Loại bỏ định dạng nếu đã có
      const formattedText = isFormatted ? selectedText : `${format}${selectedText}${format}`;

      // Cập nhật lại start và end nếu có định dạng
      if (isFormatted) {
        start -= format.length;
        end += format.length;
      } else {
        end = start + formattedText.length;
      }

      const updatedContent = textarea.value.substring(0, start) + formattedText + textarea.value.substring(end);

      setContent(updatedContent);
    } else {
      console.error("Textarea reference is not available.");
    }
  };

  const contentRef = React.useRef();

  let footer = <p>Please pick a day.</p>;
  if (publishAt) {
    footer = <p>You picked {formatDate(publishAt)}</p>;
  }
  
  const handleChangeContent = (content) => {
    setContent(content);
  }

  const handleEditComment = async (_idComment, status, favorites) => {
    const _data = {
      status,
      favorites
    }
    try {
      console.log("_data ",_data)
      const data = await updateComment(_idComment,_data);
      if(data){
        setAlert({
          visible: true,
          content: "Cập nhật comment thành công",
          color: "green",
          duration: 3000
        });

        //cập nhật lại status, favorites
        const updatedComments = comments.map((item) =>
          item._id === _idComment ? { ...item, status: status, favorites: favorites } : item
        );
        setComments(updatedComments);


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
      console.log('Error fetching data handleSave:', error.statusText);
    }

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
            {_id ? "Chỉnh sửa bài viết" : "Tạo bài viết"}
          </Typography>
        </CardHeader>
        <CardBody className="flex flex-col p-4 mb-2">
          <form className="flex flex-row gap-4 mx-auto w-full flex-wrap lg:flex-nowrap">
            {/* CONTENT */}
            <div className="flex flex-col gap-4 w-full lg:w-4/5">
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
              
              <Tabs className="border border-gray-600 rounded-lg" value={defaultTab}>
                <TabsHeader className="flex flex-wrap w-full justify-center items-center">
                  {/* TAB CONTENT*/}
                  <Tab key={"Content"} value={"Content"}>
                    {"Content"}
                  </Tab>
                </TabsHeader>
                <TabsBody>
                  {/* CONTENT */}
                  <TabPanel className="p-0" key={"Content"} value="Content">
                    {/* Trình soạn thảo văn bản */}
                    <MDEditor
                      className="!h-[100vh] !text-[#616161] !p-0 !border-b-0!p-4 hover:!border-b-0 active:!border-b-0 focus:!border-b-0"
                      value={content}
                      onChange={handleChangeContent}
                    />
                  </TabPanel>
                </TabsBody>
              </Tabs>
            </div>

            {/* OPTIONS */}
            <div className="flex flex-col gap-4 w-full lg:w-1/4">
              <Menu>
                <MenuHandler>
                  <Input
                      label="Thể loại"
                      value={selectedCategories.map((category) => category.name).join(', ')}
                      onChange={() => {}}
                  />
                </MenuHandler>
                <MenuList className="w-100">
                  {categories.map((item) => {
                      return <MenuItem key={item._id} className="p-0">
                      <label
                        htmlFor={item._id}
                        className="flex cursor-pointer items-center gap-2 p-2"
                      >
                        <Checkbox
                          ripple={false}
                          id={item._id}
                          containerProps={{ className: "p-0" }}
                          className="hover:before:content-none"
                          checked={item.checked}
                          onChange={() => {
                            handleCategories(item._id);
                          }}
                          />
                        {item.name}
                      </label>
                    </MenuItem>
                  })}
                </MenuList>
              </Menu>              

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
                {Object.values(LIST_STATUS_POST).map((item) => {
                  return <Option className="capitalize" key={item} value={item}>{`${item}`}</Option>;
                })}
              </Select>

              {/* SELECT DATE TIME */}
              {(status == "published" || status == "schedule") && (<Popover placement="bottom">
                  <PopoverHandler>
                    <Input
                      label="Ngày xuất bản"
                      onChange={handleDate}
                      value={publishAt ? formatDate(publishAt) : ""}
                    />
                  </PopoverHandler>
                  <PopoverContent>
                    <DayPicker
                      mode="single"
                      selected={publishAt}
                      onSelect={setPublishAt}
                      required
                      locale={vi}
                      showOutsideDays
                      footer={footer}
                      className="border-0"
                      classNames={{
                        caption: "flex justify-center py-2 mb-4 relative items-center",
                        caption_label: "text-sm font-medium text-gray-900",
                        nav: "flex items-center",
                        nav_button:
                          "h-6 w-6 bg-transparent hover:bg-blue-gray-50 p-1 rounded-md transition-colors duration-300",
                        nav_button_previous: "absolute left-1.5",
                        nav_button_next: "absolute right-1.5",
                        table: "w-full border-collapse",
                        head_row: "flex font-medium text-gray-900",
                        head_cell: "m-0.5 w-9 font-normal text-sm",
                        row: "flex w-full mt-2",
                        cell: "text-gray-600 rounded-md h-9 w-9 text-center text-sm p-0 m-0.5 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-gray-900/20 [&:has([aria-selected].day-outside)]:text-white [&:has([aria-selected])]:bg-gray-900/50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                        day: "h-9 w-9 p-0 font-normal",
                        day_range_end: "day-range-end",
                        day_selected:
                          "rounded-md bg-gray-900 text-white hover:bg-gray-900 hover:text-white focus:bg-gray-900 focus:text-white",
                        day_today: "rounded-md bg-gray-200 text-gray-900",
                        day_outside:
                          "day-outside text-gray-500 opacity-50 aria-selected:bg-gray-500 aria-selected:text-gray-900 aria-selected:bg-opacity-10",
                        day_disabled: "text-gray-500 opacity-50",
                        day_hidden: "invisible",
                      }}
                      components={{
                        IconLeft: ({ ...props }) => (
                          <ChevronLeftIcon {...props} className="h-4 w-4 stroke-2" />
                        ),
                        IconRight: ({ ...props }) => (
                          <ChevronRightIcon {...props} className="h-4 w-4 stroke-2" />
                        ),
                      }}
                    />

                  <TimePicker locale="sv-sv" onChange={handleChangeTime} value={publishAt} />
                  </PopoverContent>
              </Popover>)}

              <Textarea 
                value={note}
                onChange={(e) => handleNote(e.target.value)} 
                color="gray"
                variant="outlined"
                label="Ghi chú"
                rows={2}/>
                
              <Button disabled={loadingCoverImage || loading} onClick={handleSubmit} fullWidth>
                {_id ? "Cập nhật" : "Lưu"}
              </Button>

              {/* COMMENTS */}
              <div className="flex flex-row items-center gap-2">
                <Typography variant="h6" color="blue-gray">
                  Bình luận
                </Typography>

                <Button
                    disabled={loadingCoverImage || loading}
                    onClick={() => handleSubmit(statusComment)}
                    size="sm"
                    variant="text"
                    color={statusComment == false ? "green" : "red"}
                  >
                    {statusComment == false ? 'Hiện bình luận' : 'Tắt bình luận'}
                  </Button>
              </div>

                {comments && comments.length > 0 && comments.map((item, index) => {
                  return (
                    // item
                    <div key={index} className="flex flex-col gap-2 border p-4 rounded-md shadow-md">
                      <div className="flex flex-row items-center justify-between">
                        <div className="flex flex-col gap-1">
                          <p className="text-sm text-gray-600">{item.name}</p>
                          <p className="text-xs text-gray-500">{item.email}</p>
                        </div>
                        <p className="text-xs text-gray-500">{formatDate(item.create_at)}</p>
                      </div>
                      <p className="text-sm text-gray-800">{item.content}</p>
                      <div className="flex gap-2 justify-between">
                        <Button
                            onClick={() => handleEditComment(item._id, item.status == 'public' ? 'private' : 'public', item.favorites)}
                            size="sm" 
                          >
                          {item.status === 'public' ? 'Public' : 'Private'}
                        </Button>

                        {/* icon heart */}
                        <Button
                          size="sm"
                          variant="text"
                          onClick={() => handleEditComment(item._id, item.status, !item.favorites)}
                        >
                          {item.favorites == true ? 
                          (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" className="w-6 h-6">
                            <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                          </svg>)
                          :
                          (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="black" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                          </svg>
                          )}

                          <span className="text-xs text-gray-500">{item.favorites}</span>
                        </Button>
                      </div>
                    </div>
                  );
                })}
              
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

export default Post;