import React from "react";
import {
  Button,
  Dialog as TailwindDialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";

export function DialogCustomAnimation({ status, open, setOpen, handle }) {
  const handleConfirm = () => {
    // Đóng Dialog khi nhấn "Confirm"
    setOpen(false);

    // Gọi hàm handle truyền từ trang
    handle();
  };

  const handleCancel = () => {
    // Đóng Dialog khi nhấn "Cancel"
    setOpen(false);
  };

  

  return (
    <TailwindDialog open={open} handler={() => setOpen(!open)}>
      <div className={`transition-transform transform ${open ? 'scale-100 translate-y-0' : 'scale-90 -translate-y-10'}`}>
        <DialogHeader>Cảnh báo!</DialogHeader>
      </div>
      <DialogBody>
      {"Bạn đang thao tác " + status +" . Vui lòng kiểm tra chắc chắn trước khi xác nhận!"}
      </DialogBody>
      <DialogFooter>
        <Button
          variant="text"
          color="red"
          onClick={handleCancel}
          className="mr-1"
        >
          <span>Huỷ bỏ</span>
        </Button>
        <Button variant="gradient" color="green" onClick={handleConfirm}>
          <span>Đồng ý</span>
        </Button>
      </DialogFooter>
    </TailwindDialog>
  );
}
