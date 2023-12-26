// utils/CustomAlert.jsx
import React, { useEffect } from 'react';
import { Alert } from '@material-tailwind/react';
import { InformationCircleIcon, ExclamationTriangleIcon, CheckCircleIcon} from '@heroicons/react/24/outline';

const validColors = ["blue-gray", "gray", "brown", "deep-orange", "orange", "amber", "yellow", "lime", "light-green", "green", "teal", "cyan", "light-blue", "blue", "indigo", "deep-purple", "purple", "pink", "red"];

export const CustomAlert = ({ alert = { visible: false, content: "", color: "green", duration: 5000 }, onClose }) => {
  const validColor = validColors.includes(alert.color) ? alert.color : "green";

  useEffect(() => {
    // Sử dụng setTimeout để tự động gọi hàm đóng alert sau thời gian duration
    const timerId = setTimeout(() => {
      onClose();
    }, alert.duration);

    // Cleanup effect để tránh lỗi khi component unmount trước khi hàm đóng alert được gọi
    return () => {
      clearTimeout(timerId);
    };
  }, [alert.duration, onClose, alert.visible]);

  return (
    <Alert
      open={alert.visible}
      color={validColor}
      icon={<InformationCircleIcon strokeWidth={2} className="h-6 w-6" />}
      onClose={onClose}
      className="fixed bottom-0 left-1/2 transform -translate-x-1/2 mb-8 w-fit"
    >
      {alert.content}
    </Alert>
  );
};
