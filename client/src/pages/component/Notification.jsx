import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";

export const ModalNotification = ({
  isOpen,
  onClose,
  title,
  message,
  type = "info",
}) => {
  const icons = {
    success: <CheckCircle2 className="h-6 w-6 text-green-500" />,
    error: <XCircle className="h-6 w-6 text-red-500" />,
    info: <AlertCircle className="h-6 w-6 text-blue-500" />,
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {icons[type]}
            <span>{title}</span>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>{message}</DialogDescription>
        <DialogFooter>
          <Button onClick={onClose}>Đóng</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const useModalNotification = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notificationProps, setNotificationProps] = useState({});

  const showNotification = ({ title, message, type = "info" }) => {
    setNotificationProps({ title, message, type });
    setIsOpen(true);
  };

  const closeNotification = () => {
    setIsOpen(false);
  };

  return {
    showNotification,
    ModalNotificationComponent: (
      <ModalNotification
        isOpen={isOpen}
        onClose={closeNotification}
        {...notificationProps}
      />
    ),
  };
};
