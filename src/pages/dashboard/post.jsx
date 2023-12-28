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
import { createPost, getCategories }from '@/services/postApi';
import { LIST_STATUS_POST } from "@/constants/basic";
import { formatDate, parseDate, saveDateToDB } from "@/utils/Common";
import { CustomAlert } from "@/utils/AlertUtils";
import { useNavigate } from "react-router-dom";
import { removeTokens } from "@/configs/authConfig";
import MarkDown from "@/widgets/layout/markdown";
import EditorToolbar from "@/widgets/layout/editor-toolbar";
import { uploadSingle } from "@/services/uploadApi";

export function Post() {
  const navigate = useNavigate();
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
  const [defaultTab, setDefaultTab] = React.useState("Write");

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setResult(content);
    }, 0);
    return () => clearTimeout(timeout);
  }, [content]);

  const markdownProps = {
    remarkPlugins: [gfm],
    children: result,
    onButtonClick: (action) => action(),
  };

  const fetchData = async () => {
    try {
      let limit = 10;
      let page = 1;
      const data = await getCategories(limit, page);
      if(data){
        setCategories(data.results.map((item) => ({ ...item, checked: false })));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  

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
      const data = await createPost(_data);
      if(data){
        setAlert({
          visible: true,
          content: "Tạo bài viết thành công",
          color: "green",
          duration: 3000
        });
        console.log(data);
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
  
        setContent((prevContent) =>
          prevContent.replace(`![Uploading ${file.name}]()`, `![${file.name}](${imageUrl})`)
        );
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const contentRef = React.useRef();

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
          className="m-0 p-4"
        >
          <Typography variant="h5" color="blue-gray">
            Post
          </Typography>
        </CardHeader>
        <CardBody className="flex flex-col p-4 mb-2">
          <form className="flex flex-row gap-4 mx-auto w-full flex-wrap lg:flex-nowrap">
            {/* CONTENT */}
            <div className="flex flex-col gap-4 w-full lg:w-4/5">
              <div className="relative h-72 bg-gray-200 rounded-lg overflow-hidden">
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
              
              <Tabs className="border border-gray-600 rounded-lg h-[524px]" value={defaultTab}>
                
                <TabsHeader className="flex flex-wrap w-full justify-center items-center">
                  {/* TAB WRITE*/}
                  <Tab key={"Write"} value={"Write"}>
                    {"Write"}
                    </Tab>
                  {/* TAB PEWVIEW*/}
                  <Tab key={"Preview"} value={"Preview"}>
                    {"Preview"}
                  </Tab>
                  {/* OPTIONS */}
                  {defaultTab == "Write" ? <EditorToolbar onButtonClick={markdownProps.onButtonClick} content={content} setContent={setContent} /> : null}
                </TabsHeader>
                <TabsBody>
                  {/* WRITE */}
                  <TabPanel className="p-1" key={"Write"} value="Write">
                    <Textarea
                      className="!h-[406px]"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      onDrop={handleDropOrPaste}
                      onPaste={handleDropOrPaste}
                      ref={contentRef}
                      color="gray" 
                      variant="outlined"
                      rows={10}/>
                  </TabPanel>

                  {/* PREVIEW */}
                  <TabPanel key={"Preview"} value="Preview">
                    <MarkDown markdown={content} />
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

              <Button disabled={loadingCoverImage} onClick={handleSave} fullWidth>
                Lưu
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