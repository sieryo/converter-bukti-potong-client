import { toast } from "sonner";

export const successMessage = (message: string = "Field Updated!") => {
  toast.success(message, {
    richColors: true,
    duration: 2000,
  });
};

export const errorMessage = (message: string = "Failed") => {
  toast.error(message, {
    richColors: true,
  });
};