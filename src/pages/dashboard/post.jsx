import React from "react";
import gfm from "remark-gfm";
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
  Spinner
} from "@material-tailwind/react";
import { DayPicker } from "react-day-picker";
import vi from 'date-fns/locale/vi'
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";

import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import { createPost, getPost, updatePost}from '@/services/postApi';
import { getCategories }from '@/services/categoryApi';
import { LIST_STATUS_POST } from "@/constants/basic";
import { formatDate, parseDate, saveDateToDB } from "@/utils/Common";
import { CustomAlert } from "@/widgets/custom/AlertUtils";
import { useNavigate, useParams } from "react-router-dom";
import { removeTokens } from "@/configs/authConfig";
import MarkDown from "@/widgets/layout/markdown";
import EditorToolbar from "@/widgets/layout/editor-toolbar";
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
  const [note, setNote] = React.useState("");
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

  console.log(_id)

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

  const handleSubmit = () => {
    setLoading(true);
    if (_id) {
      handleSave();
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

  const handleSave = async () => {
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
      const data = await updatePost(_id, _data);
      if(data){
        setAlert({
          visible: true,
          content: "Cập nhật bài viết thành công",
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

    console.log("content ", content);
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
          size="small"
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
              
              {/* COVER IMAGE */}
              {/* <div className="relative h-72 bg-gray-200 rounded-lg overflow-hidden">
                <input
                  disabled={loadingCoverImage}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute z-50 inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                
                {coverImage && (
                  <img
                    className="h-full w-full object-cover object-center"
                    src={coverImage}
                    alt="Selected Image"
                  />
                )}

                {!coverImage && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    
                    {loadingCoverImage ? <Spinner className="h-16 w-16 text-gray-900/50" /> :
                    (<> <span className="font-bold text-red-600">{`Chọn hình ảnh hoặc kéo thả vào`}</span>
                        <span className="text-gray-600">{`(*Hình ảnh sẽ tự động lấy từ nội dung có hình ảnh đầu tiên)`}</span>
                    </>)}
                  </div>
                )}
              </div> */}

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
                  {/* TAB WRITE*/}
                  {/* <Tab key={"Write"} value={"Write"}>
                    {"Write"}
                  </Tab> */}

                  {/* TAB PEWVIEW*/}
                  {/* <Tab key={"Preview"} value={"Preview"}>
                    {"Preview"}
                  </Tab> */}

                  {/* TAB CONTENT*/}
                  <Tab key={"Content"} value={"Content"}>
                    {"Content"}
                  </Tab>
                  {/* OPTIONS */}
                  {/* {defaultTab == "Write" ? <EditorToolbar onFormatButtonClick={handleFormatButtonClick}/> : null} */}
                </TabsHeader>
                <TabsBody>
                  {/* WRITE */}
                  <TabPanel className="p-0" key={"Write"} value="Write">
                    <Textarea
                      className="!h-[850px] !text-base !font-light !text-[#616161] !leading-[1.625] !p-0 !border-b-0 !text-justify !p-4 hover:!border-b-0 active:!border-b-0 focus:!border-b-0"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      onDrop={handleDropOrPaste}
                      onPaste={handleDropOrPaste}
                      ref={contentRef}
                      color="gray" 
                      variant="standard"
                      spellCheck="false"
                      rows={10}/>
                  </TabPanel>

                  {/* Preview CONTENT */}
                  <TabPanel className="p-0" key={"Preview"} value="Preview">
                    <MarkDown markdown={content} />
                  </TabPanel>

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