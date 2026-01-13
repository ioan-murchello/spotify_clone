import { Loader2 } from "lucide-react";

const Loader = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/10 backdrop-blur-sm transition-opacity">
      <div className="relative flex items-center justify-center">
        <Loader2 className="size-16 text-green-500 animate-spin transition-all duration-1000" />
      </div>
    </div>
  );
};

export default Loader;
