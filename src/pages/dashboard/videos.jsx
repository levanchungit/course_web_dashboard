import React,{useState, useEffect, useContext} from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Chip,
  Button,
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { autoInsertVideosYoutube, getVideos } from "@/services/videoApi";
import { getDateFromDB } from "@/utils/Common";
import { CustomAlert } from "@/widgets/custom/AlertUtils";
import { removeTokens } from "@/configs/authConfig";
import { DialogCustomAnimation } from "@/widgets/custom";
import ReactPaginate from 'react-paginate';


export function Videos() {
  const navigate = useNavigate();
  const [apiCalled, setApiCalled] = React.useState(false);
  const [videos, setVideos] = React.useState([]);
  const [limitVideos, setLimitVideos] = React.useState(10)
  const [pageVideos, setPageVideos] = React.useState(1)
  const [sortVideos, setSortVideos] = React.useState("asc");
  const [videoId, setVideoId] = React.useState("");
  const [alert, setAlert] = React.useState({
    visible: false,
    content: "",
    color: "green",
    duration: 3000
  });
  const [notiDialogConfirm, setNotiDialogConfirm] = React.useState("")
  const [totalVideos, setTotalVideos] = useState(0);


  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getVideos(limitVideos, pageVideos, sortVideos);
        if(res){
          setVideos(res.results);
          setTotalVideos(res.total);
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
  }, [apiCalled, limitVideos, pageVideos, sortVideos]);
  const [openDialog, setOpenDialog] = useState(false);

  const handlePageClick = (selectedPage) => {
    setPageVideos(selectedPage.selected + 1);
    setApiCalled(false);
  };

  const handleSave = () => {
    setOpenDialog(true);
    if(notiDialogConfirm == "public"){
      handleAchivedVideo(videoId, "public");
    }else if (notiDialogConfirm == "delete"){
      //xoá mất khỏi db
      handleDeleteVideo(videoId);
    }else if (notiDialogConfirm == "private"){
      handlePublishVideo(videoId, "private");
    }
  };

  //Cập nhật trạng thái status archived thôi chứ k xoá mất
  const handleAchivedVideo = async (_id, status) => {
    try {
      const data = await updateVideo(_id, {
        status
      });
      if(data){
        setAlert({
          visible: true,
          content: "Cập nhật bài viết thành công",
          color: "green",
          duration: 3000
        });

        //update video status 
        const newVideos = videos.map((video) => {
          if(video._id === _id){
            video.status = status;
          }
          return video;
        })
        setVideos(newVideos);
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

  const handleDeleteVideo = async (_id) => {
    try {
      const data = await deleteVideo(_id);
      if(data){
        setAlert({
          visible: true,
          content: "Xoá bài viết thành công",
          color: "green",
          duration: 3000
        });

        //update video status 
        const newVideos = videos.filter((video) => video._id !== _id);
        setVideos(newVideos);
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

  const handlePublishVideo = async (_id, status) => {
    try {
      const data = await updateVideo(_id, {
        status
      });
      if(data){
        setAlert({
          visible: true,
          content: "Cập nhật bài viết thành công",
          color: "green",
          duration: 3000
        });

        //update video status 
        const newVideos = videos.map((video) => {
          if(video._id === _id){
            video.status = status;
          }
          return video;
        })
        setVideos(newVideos);
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

  const handleEditVideo = (_id) => {
    // Chuyển hướng đến trang chỉnh sửa bài viết với _id
    navigate(`/dashboard/video/${_id}`);
  };

  const handleAutoInsertVideosYoutube = async () => {
    setApiCalled(true);
    try {
      const res = await autoInsertVideosYoutube();
      if(res){
        setAlert({
          visible: true,
          content: "Cập nhật videos thành công",
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
            Videos Table
          </Typography>
          <div className="flex gap-4">
            <Button onClick={handleAutoInsertVideosYoutube} color="green" size="sm">
                Update Videos Youtube
            </Button>
          </div>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
            <tr>
              {['title'].map((el) => (
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
              {videos && videos.length > 0 ? videos.map(
                ({ _id, videoId, title, thumbnails, publish_at, status, description}, ) => {
                  const className = `py-3 px-5 ${
                    _id === videos.length - 1
                      ? ""
                      : "border-b border-blue-gray-50"
                  }`;

                  return (
                    <tr key={_id}>
                      <td className={className}>
                        <div className="flex flex-wrap items-center gap-4">
                          <div className="flex items-center gap-4">
                            <img
                              src={thumbnails ? thumbnails.url : ""}
                              className="rounded-lg w-full h-full object-cover max-w-[400px]"
                              alt="Your Alt Text"
                            />
                          </div>
                          <div className="flex flex-col items-center gap-4">
                            <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-semibold">
                              {title ? title : ""}
                            </Typography>

                            <div className="max-w-[400px] overflow-hidden max-h-[200px]">
                              {description ? description : ""}
                            </div>
                            
                            <Chip
                                key={videoId}
                                value={"videoId: "+videoId}
                                variant="ghost"/>

                            <Typography variant="small" className="text-xs font-semibold text-blue-gray-500">
                              {getDateFromDB(publish_at)}
                            </Typography>
                          </div>
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
        pageCount={Math.ceil(totalVideos / limitVideos)}
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

export default Videos;