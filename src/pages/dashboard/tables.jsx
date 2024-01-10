import React from "react";
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
import { deletePost, getPosts } from "@/services/postApi";
import { getDateFromDB } from "@/utils/Common";
import { CustomAlert } from "@/utils/AlertUtils";
import { removeTokens } from "@/configs/authConfig";

export function Tables() {
  const navigate = useNavigate();
  const [apiCalled, setApiCalled] = React.useState(false);
  const [posts, setPosts] = React.useState([]);
  const [limitPosts, setLimitPosts] = React.useState(10)
  const [pagePosts, setPagePosts] = React.useState(1)
  const [sortPosts, setSortPosts] = React.useState("created_at");
  const [alert, setAlert] = React.useState({
    visible: false,
    content: "",
    color: "green",
    duration: 3000
  });

  console.log(posts)

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getPosts(limitPosts, pagePosts, sortPosts);
        console.log(res.results);
        if(res){
          setPosts(res.results);
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

  const handleDeletePost = async (_id) => {
    try {
      const data = await deletePost(_id);
      if(data){
        setAlert({
          visible: true,
          content: "Xoá bài viết thành công",
          color: "green",
          duration: 3000
        });

        const newPosts = posts.filter((post) => post._id !== _id);
        setPosts(newPosts);
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
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="flex flex-row justify-between mb-8 p-6">
          <Typography variant="h6" color="white">
            Authors Table
          </Typography>
          <Link to={"/dashboard/post"}>
            <Button color="green" size="sm">
              Create Post
            </Button>
          </Link>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["Tiêu đề", "Ngày tạo", "Ngày xuất bản", "Trạng thái", "Hành động", "Ghi chú"].map((el) => (
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
              {posts.length > 0 ? posts.map(
                ({ _id, title, categories, category_names, create_at, publish_at, status, note}, ) => {
                  const className = `py-3 px-5 ${
                    _id === posts.length - 1
                      ? ""
                      : "border-b border-blue-gray-50"
                  }`;

                  return (
                    <tr key={_id}>
                      <td className={className}>
                        <div className="flex items-center gap-4">
                          <div>
                          <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-semibold"
                            >
                              {title ? title : ""}
                            </Typography>

                            <div className="flex gap-2">
                            {category_names.map((value) => (
                              <Chip
                                  key={value}
                                  value={value}
                                  variant="ghost"/>
                              ))  
                            }
                            </div>
                           
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
                          color={status == "draft" ? "blue-gray" : status == "published" ?  "green" : "orange"}
                          value={status}
                          className="py-0.5 px-2 text-[11px] font-medium w-fit"
                        />
                      </td>
                      <td className={className}>
                        <div className="flex gap-2">
                         <IconButton variant="gradient">
                              <i className="fas fa-pencil" />
                            </IconButton>
                          <IconButton onClick={()=>handleDeletePost(_id)} variant="gradient">
                              <i className="fas fa-trash" />
                            </IconButton>
                          {status == "draft" || status == "schulded" ?
                            (<IconButton variant="gradient">
                            <i className="fas fa-check-circle" />
                          </IconButton>)
                            :
                            (<IconButton variant="gradient">
                            <i className="fas fa-eye-slash" />
                          </IconButton>)}
                        
                        </div>
                      </td>

                      <td className={className}>
                        <Typography variant="small" className="text-xs font-regular text-blue-gray-500">
                          {note ? note : ""}
                        </Typography>
                      </td>
                    </tr>
                  );
                }
              ) : null}
            </tbody>
          </table>
        </CardBody>

        <CustomAlert
          alert={alert}
          onClose={() => setAlert({
            visible: false,
            content: "",
            color: "green",
            duration: 3000
          })}
        />
      </Card>
    </div>
  );
}

export default Tables;