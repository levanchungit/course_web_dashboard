import React,{useState} from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Chip,
  Button,
  IconButton,
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { createCourseOrUpdatePlayListYoutube, deleteCourse, getCourses, updateCourse } from "@/services/courseApi";
import { getDateFromDB } from "@/utils/Common";
import { CustomAlert } from "@/widgets/custom/AlertUtils";
import { removeTokens } from "@/configs/authConfig";
import { DialogCustomAnimation } from "@/widgets/custom";
import ReactPaginate from 'react-paginate';

export function Courses() {
  const navigate = useNavigate();
  const [apiCalled, setApiCalled] = React.useState(false);
  const [courses, setCourses] = React.useState([]);
  const [limitCourses, setLimitCourses] = React.useState(10)
  const [pageCourses, setPageCourses] = React.useState(1)
  const [sortCourses, setSortCourses] = React.useState("asc");
  const [courseId, setCourseId] = React.useState("");
  const [alert, setAlert] = React.useState({
    visible: false,
    content: "",
    color: "green",
    duration: 3000
  });
  const [notiDialogConfirm, setNotiDialogConfirm] = React.useState("")
  const [totalCourses, setTotalCourses] = useState(0);

  const handlePageClick = (selectedPage) => {
    setPageCourses(selectedPage.selected + 1);
    setApiCalled(false);
  };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getCourses(limitCourses, pageCourses, sortCourses);
        if(res){
          setCourses(res.results);
          setTotalCourses(res.total);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setApiCalled(true);
      }
    };

    if (!apiCalled) {
      fetchData();
    }
  }, [apiCalled, limitCourses, pageCourses, sortCourses]);
  const [openDialog, setOpenDialog] = useState(false);

  const handleSave = () => {
    setOpenDialog(true);
    if(notiDialogConfirm == "public"){
      handleAchivedCourse(courseId, "public");
    }else if (notiDialogConfirm == "delete"){
      //xoá mất khỏi db
      handleDeleteCourse(courseId);
    }else if (notiDialogConfirm == "private"){
      handlePublishCourse(courseId, "private");
    }
  };

  //Cập nhật trạng thái status archived thôi chứ k xoá mất
  const handleAchivedCourse = async (_id, status) => {
    try {
      const data = await updateCourse(_id, {
        status
      });
      if(data){
        setAlert({
          visible: true,
          content: "Cập nhật bài viết thành công",
          color: "green",
          duration: 3000
        });

        //update course status 
        const newCourses = courses.map((course) => {
          if(course._id === _id){
            course.status = status;
          }
          return course;
        })
        setCourses(newCourses);
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
      console.log('Error fetching data handleSave:', error);
    }finally{
      setOpenDialog(false);
    }
  }

  const handleDeleteCourse = async (_id) => {
    try {
      const data = await deleteCourse(_id);
      if(data){
        setAlert({
          visible: true,
          content: "Xoá bài viết thành công",
          color: "green",
          duration: 3000
        });

        //update course status 
        const newCourses = courses.filter((course) => course._id !== _id);
        setCourses(newCourses);
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
      console.log('Error fetching data handleSave:', error);
    }finally{
      setOpenDialog(false);
    }
  }

  const handlePublishCourse = async (_id, status) => {
    try {
      const data = await updateCourse(_id, {
        status
      });
      if(data){
        setAlert({
          visible: true,
          content: "Cập nhật bài viết thành công",
          color: "green",
          duration: 3000
        });

        //update course status 
        const newCourses = courses.map((course) => {
          if(course._id === _id){
            course.status = status;
          }
          return course;
        })
        setCourses(newCourses);
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
      console.log('Error fetching data handleSave:', error);
    }finally{
      setOpenDialog(false);
    }
  }

  const handleEditCourse = (_id) => {
    // Chuyển hướng đến trang chỉnh sửa bài viết với _id
    navigate(`/dashboard/course/${_id}`);
  };

  const handleUpdatePlaylistYoutube = async () => {
    setApiCalled(true);
    try {
      const res = await createCourseOrUpdatePlayListYoutube();
      if(res){
        setAlert({
          visible: true,
          content: "Cập nhật playlist thành công",
          color: "green",
          duration: 3000
        })
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setApiCalled(false);
    }
  }

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="flex flex-row justify-between mb-8 p-6">
          <Typography variant="h6" color="white">
            Courses Table
          </Typography>
          <div className="flex gap-4">
            <Button onClick={handleUpdatePlaylistYoutube} color="green" size="sm">
                Update PlayList Youtube
            </Button>
          </div>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
            <tr>
              {['title', 'create_at', 'update_at', 'status', 'control'].map((el) => (
                <th
                  key={el}
                  className="border-b border-blue-gray-50 py-3 px-5 text-left"
                >
                  <Typography
                    variant="small"
                    className="text-[11px] font-bold uppercase text-blue-gray-400"
                  >
                    {el}
                  </Typography>
                </th>
              ))}
            </tr>
            </thead>
            <tbody>
              {courses && courses.length > 0 ? courses.map(
                ({ _id, idPlaylist, title, cover_image, create_at, update_at, items, category, status, description, publish_at, slug, category_names}, ) => {
                  const className = `py-3 px-5 ${
                    _id === courses.length - 1
                      ? ""
                      : "border-b border-blue-gray-50"
                  }`;

                  return (
                    <tr key={_id}>
                      <td className={className}>
                        <div className="flex flex-wrap items-center gap-4">
                          <div className="">
                            <img
                              src={cover_image ? cover_image : "https://i.ytimg.com/vi/3jWRrafhO7M/maxresdefault.jpg"}
                              className="rounded-lg w-full h-full object-cover max-w-[400px]"
                              alt="Your Alt Text"
                            />
                          </div>
                          <div>
                          <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-semibold">
                            {title ? title : ""}
                          </Typography>

                            <div className="flex gap-2">
                              <Typography variant="small" className="text-xs font-regular text-blue-gray-500">
                                {description ? description : ""}
                              </Typography>
                            </div>

                            <Chip
                                  key={idPlaylist}
                                  value={"idPlaylist: "+idPlaylist}
                                  variant="ghost"/>

                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-semibold">
                            Items: {items ? items.length : 0}
                          </Typography>
                          </div>
                        </div>
                      </td>
                      
                      <td className={className}>
                        <Typography variant="small" className="text-xs font-semibold text-blue-gray-500">
                          {getDateFromDB(create_at)}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography variant="small" className="text-xs font-semibold text-blue-gray-500">
                          {getDateFromDB(publish_at)}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Chip
                          variant="gradient"
                          color={status == "private" ? "blue-gray" : status == "public" ?  "green" : "red"}
                          value={status}
                          className="py-0.5 px-2 text-[11px] font-medium w-fit"
                        />
                      </td>
                      <td className={className}>
                        <div className="flex gap-2">
                         <IconButton onClick={() => handleEditCourse(_id)} variant="gradient">
                              <i className="fas fa-pencil" />
                            </IconButton>
                          <IconButton  variant="gradient" onClick={() => {
                              setNotiDialogConfirm("delete");
                              setOpenDialog(true);
                              setCourseId(_id);
                            }}>
                              <i className="fas fa-trash" />
                            </IconButton>
                            
                          {status == "private" || status == "delete" ?
                            (<IconButton variant="gradient" onClick={() => {
                              setNotiDialogConfirm("public");
                              setOpenDialog(true);
                              setCourseId(_id);
                            }}>
                              <i className="fas fa-check-circle" />
                            </IconButton>)
                            :
                            (<IconButton variant="gradient" onClick={() => {
                              setNotiDialogConfirm("private");
                              setOpenDialog(true);
                              setCourseId(_id);
                            }}>
                              <i className="fas fa-eye-slash" />
                            </IconButton>)}
                        
                        </div>
                      </td>
                    </tr>
                  );
                }
              ) : null}
            </tbody>
          </table>
        </CardBody>

        <ReactPaginate
        previousLabel={'Previous'}
        nextLabel={'Next'}
        pageCount={Math.ceil(totalCourses / limitCourses)}
        onPageChange={handlePageClick}
        containerClassName={'pagination flex justify-center m-4'}
        activeClassName={'text-white bg-black'}
        previousClassName={'px-3 py-1 rounded-lg text-gray mr-2 hover:bg-gray-300'}
        nextClassName={'px-3 py-1 rounded-lg ml-2 hover:bg-gray-300'}
        breakClassName={'px-3 py-1 rounded-lg'}
        pageClassName={'px-3 py-1 rounded-lg mr-2 hover:bg-gray-400'}
        disabledClassName={'opacity-50'}
        />

        <DialogCustomAnimation status={notiDialogConfirm} open={openDialog} setOpen={setOpenDialog} handle={handleSave} />

        <CustomAlert
            alert={alert}
            onClose={() => setAlert({
              visible: false,
              content: "",
              color: "green",
              duration: 3000
            })}/>
      </Card>
    </div>
  );
}

export default Courses;