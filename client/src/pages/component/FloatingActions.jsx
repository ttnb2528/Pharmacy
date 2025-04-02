"use client";

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowUp, MessageCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const FloatingActions = ({ zaloLink = "https://zalo.me/84866554764" }) => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const location = useLocation();

  // Check if we should hide the buttons based on current path
  const shouldHideButtons = () => {
    const hiddenPaths = ["/cart", "/checkout", "/account"];
    return hiddenPaths.some((path) => location.pathname.startsWith(path));
  };

  // Handle scroll event to show/hide scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (shouldHideButtons()) {
    return null;
  }

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 flex flex-col gap-2 md:gap-3 z-50">
      <style>{`
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(38, 119, 61, 0.7);
          }
          70% {
            box-shadow: 0 0 0 12px rgba(38, 119, 61, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(38, 119, 61, 0);
          }
        }
        .pulse {
          animation: pulse 1.5s infinite;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .fade-in {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
      <TooltipProvider>
        {/* Zalo support button - hidden on mobile */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              className="rounded-full w-16 h-16 bg-[#26773d] hover:bg-[#1e5f31] shadow-lg pulse hidden md:flex"
              onClick={() => window.open(zaloLink, "_blank")}
            >
              <MessageCircle style={{ width: "32px", height: "32px" }} />
              <span className="sr-only">Hỗ trợ trực tiếp qua Zalo</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Hỗ trợ trực tiếp qua Zalo</p>
          </TooltipContent>
        </Tooltip>

        {showScrollTop && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="secondary"
                className="rounded-full w-10 h-10 md:w-16 md:h-16 shadow-lg fade-in"
                onClick={scrollToTop}
              >
                <ArrowUp
                  style={{ width: "18px", height: "18px" }}
                  className="md:w-6 md:h-6"
                />
                <span className="sr-only">Lên đầu trang</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left" className="hidden md:block">
              <p>Lên đầu trang</p>
            </TooltipContent>
          </Tooltip>
        )}
      </TooltipProvider>
    </div>
  );
};

export default FloatingActions;
