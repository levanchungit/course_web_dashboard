import React,{useState, useEffect, useContext} from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Chip,
  Button,
  IconButton,
} from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { deleteCategory, getCategories, updateCategory } from "@/services/categoryApi";
import { getDateFromDB } from "@/utils/Common";
import { CustomAlert } from "@/widgets/custom/AlertUtils";
import { removeTokens } from "@/configs/authConfig";
import { DialogCustomAnimation } from "@/widgets/custom";

export function Categories() {
  const navigate = useNavigate();
  const [apiCalled, setApiCalled] = React.useState(false);
  const [categories, setCategorys] = React.useState([]);
  const [limitCategories, setLimitCategories] = React.useState(10)
  const [pageCategories, setPageCategories] = React.useState(1)
  const [sortCategories, setSortCategories] = React.useState("create_at");
  const [postId, setCategoryId] = React.useState("");
  const [alert, setAlert] = React.useState({
    visible: false,
    content: "",
    color: "green",
    duration: 3000
  });
  const [notiDialogConfirm, setNotiDialogConfirm] = React.useState("")

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getCategories(limitCategories, pageCategories, sortCategories);
        if(res){
          setCategorys(res.results);
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
  }, [apiCalled]);
  const [openDialog, setOpenDialog] = useState(false);

  const handleSave = () => {
    setOpenDialog(true);
    if(notiDialogConfirm == "archived"){
      handleAchivedCategory(postId, "archived");
    }else if (notiDialogConfirm == "delete"){
      //xoá mất khỏi db
      handleDeleteCategory(postId);
    }else if (notiDialogConfirm == "published"){
      handlePublishCategory(postId, "published");
    }
  };

  //Cập nhật trạng thái status archived thôi chứ k xoá mất
  const handleAchivedCategory = async (_id, status) => {
    try {
      const data = await updateCategory(_id, {
        status
      });
      if(data){
        setAlert({
          visible: true,
          content: "Cập nhật bài viết thành công",
          color: "green",
          duration: 3000
        });

        //update post status 
        const newCategorys = categories.map((post) => {
          if(post._id === _id){
            post.status = status;
          }
          return post;
        })
        setCategorys(newCategorys);
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

  const handleDeleteCategory = async (_id) => {
    try {
      const data = await deleteCategory(_id);
      if(data){
        setAlert({
          visible: true,
          content: "Xoá bài viết thành công",
          color: "green",
          duration: 3000
        });

        //update post status 
        const newCategorys = categories.filter((post) => post._id !== _id);
        setCategorys(newCategorys);
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

  const handlePublishCategory = async (_id, status) => {
    try {
      const data = await updateCategory(_id, {
        status
      });
      if(data){
        setAlert({
          visible: true,
          content: "Cập nhật bài viết thành công",
          color: "green",
          duration: 3000
        });

        //update post status 
        const newCategorys = categories.map((post) => {
          if(post._id === _id){
            post.status = status;
          }
          return post;
        })
        setCategorys(newCategorys);
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

  const handleEditCategory = (_id) => {
    // Chuyển hướng đến trang chỉnh sửa bài viết với _id
    navigate(`/dashboard/category/${_id}`);
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="flex flex-row justify-between mb-8 p-6">
          <Typography variant="h6" color="white">
            Category Table
          </Typography>
          <Link to={"/dashboard/category"}>
            <Button color="green" size="sm">
              Create Category
            </Button>
          </Link>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
            <tr>
              {['name', 'create_at', 'update_at', 'control', 'note'].map((el) => (
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
              {categories && categories.map(
                ({ _id, name, create_at, update_at, note}, ) => {
                  return (
                    <tr key={_id}>
                      <td className={"py-3 px-5 border-b border-blue-gray-50"}>
                        <div className="flex items-center gap-4">
                          <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-semibold"
                          >
                            {name ? name : ""}
                          </Typography>
                        </div>
                      </td>
                      
                      <td className={"py-3 px-5 border-b border-blue-gray-50"}>
                        <Typography variant="small" className="text-xs font-semibold text-blue-gray-500">
                          {getDateFromDB(create_at)}
                        </Typography>
                      </td>
                      <td className={"py-3 px-5 border-b border-blue-gray-50"}>
                        <Typography variant="small" className="text-xs font-semibold text-blue-gray-500">
                          {getDateFromDB(update_at)}
                        </Typography>
                      </td>

                      <td className={"py-3 px-5 border-b border-blue-gray-50"}>
                        <div className="flex gap-2">
                         <IconButton onClick={() => handleEditCategory(_id)} variant="gradient">
                              <i className="fas fa-pencil" />
                            </IconButton>
                        <IconButton  variant="gradient" onClick={() => {
                            setNotiDialogConfirm("delete");
                            setOpenDialog(true);
                            setCategoryId(_id);
                          }}>
                            <i className="fas fa-trash" />
                          </IconButton>           
                        </div>
                      </td>

                      <td className={"py-3 px-5 border-b border-blue-gray-50"}>
                        <div className="flex items-center gap-4">
                          <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-semibold"
                          >
                            {note ? note : ""}
                          </Typography>
                        </div>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </CardBody>

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

export default Categories;