import { useState } from "react";

export const useTogglePasswordVisibility = () => {
    const [passwordVisibility, setPasswordVisibility] = useState(true);
    const [confirmPasswordVisibility, setConfirmPasswordVisibility] = useState(true);
    const [rightIcon, setRightIcon] = useState("eye");
    const [rightIconConfirm, setRightIconConfirm] = useState("eye");
  
    const handlePasswordVisibility = () => {
      if (rightIcon === 'eye') {
        setRightIcon('eye-off');
        setPasswordVisibility(!passwordVisibility);
      } else {
        setRightIcon('eye');
        setPasswordVisibility(!passwordVisibility);
      }
    };

    const handleConfirmPasswordVisibility = () => {
      if (rightIconConfirm === 'eye') {
        setRightIconConfirm('eye-off');
        setConfirmPasswordVisibility(!confirmPasswordVisibility);
      } else {
        setRightIconConfirm('eye');
        setConfirmPasswordVisibility(!confirmPasswordVisibility);
      }
    };
  
    return {
      passwordVisibility,
      confirmPasswordVisibility,
      rightIcon,
      rightIconConfirm,
      handlePasswordVisibility,
      handleConfirmPasswordVisibility
    };
  };