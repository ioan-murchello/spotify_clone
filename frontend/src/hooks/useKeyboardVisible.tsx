import { useEffect, useState } from "react";

export const useKeyboardVisible = () => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.visualViewport) return;

    const viewport = window.visualViewport;

    const handleResize = () => {
      // Якщо висота візуального в'юпорту значно менша за висоту екрана — клавіатура відкрита
      const isVisible = viewport.height < window.innerHeight * 0.85;
      setKeyboardVisible(isVisible);
    };

    window.visualViewport.addEventListener("resize", handleResize);
    return () =>
      window.visualViewport?.removeEventListener("resize", handleResize);
  }, []);

  return isKeyboardVisible;
};
