import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        style: {
          background: "linear-gradient(135deg, #fffbeb, #fef3c7)",
          border: "1px solid #fbbf24",
          color: "#92400e",
          boxShadow: "0 4px 16px rgba(251,191,36,0.25)",
          borderRadius: "14px",
          fontWeight: "500",
        },
        classNames: {
          error: "!bg-gradient-to-r !from-orange-100 !to-amber-100 !border-orange-400 !text-orange-900",
          success: "!bg-gradient-to-r !from-yellow-100 !to-amber-100 !border-yellow-400 !text-amber-900",
          warning: "!bg-gradient-to-r !from-yellow-50 !to-orange-50 !border-yellow-400 !text-yellow-900",
          info: "!bg-gradient-to-r !from-amber-50 !to-yellow-100 !border-amber-300 !text-amber-900",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
