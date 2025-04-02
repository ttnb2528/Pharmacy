import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { FaFacebook, FaYoutube, FaTiktok } from "react-icons/fa";

const FooterInfo = () => {
  const [expandedSections, setExpandedSections] = useState({
    about: false,
    categories: false,
    contact: false,
    social: false,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };
  return (
    <footer className="py-6 md:py-8 bg-[#e5e5e5] border-t-[8px] md:border-t-[12px] border-t-[#187733]">
      <div className="w-[95vw] md:w-[90vw] lg:w-[80vw] mx-auto flex flex-col bg-white p-3 md:p-5 rounded-lg">
        <div className="flex flex-col md:flex-row md:gap-5 border-b border-b-[#b2bac6]">
          {/* About Section */}
          <div className="w-full md:flex-[25%_1] mb-4 md:mb-0">
            <div
              className="font-bold text-[#5e6f88] mb-3 md:mb-5 flex justify-between items-center md:block cursor-pointer md:cursor-default"
              onClick={() => toggleSection("about")}
            >
              <span>Về NB Pharmacy</span>
              <span className="md:hidden">
                {expandedSections.about ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </span>
            </div>

            <div
              className={`${
                expandedSections.about ? "block" : "hidden"
              } md:block`}
            >
              <a href="/#" className="footer_top-link">
                <p className="text-[#5e6f88] mb-3 md:mb-5 text-sm md:text-base">
                  Giới thiệu
                </p>
              </a>
              <a href="/#" className="footer_top-link">
                <p className="text-[#5e6f88] mb-3 md:mb-5 text-sm md:text-base">
                  Chính sách đổi trả
                </p>
              </a>
              <a href="/#" className="footer_top-link">
                <p className="text-[#5e6f88] mb-3 md:mb-5 text-sm md:text-base">
                  Chính sách giao hàng
                </p>
              </a>
              <a href="/#" className="footer_top-link">
                <p className="text-[#5e6f88] mb-3 md:mb-5 text-sm md:text-base">
                  Chính sách bảo mật
                </p>
              </a>
              <a href="/#" className="footer_top-link">
                <p className="text-[#5e6f88] mb-3 md:mb-5 text-sm md:text-base">
                  Chính sách thanh toán
                </p>
              </a>
              <a href="/#" className="footer_top-link">
                <p className="text-[#5e6f88] mb-3 md:mb-5 text-sm md:text-base">
                  Câu hỏi thường gặp
                </p>
              </a>
            </div>
          </div>

          {/* Categories Section */}
          <div className="w-full md:flex-[25%_1] mb-4 md:mb-0">
            <div
              className="font-bold text-[#5e6f88] mb-3 md:mb-5 flex justify-between items-center md:block cursor-pointer md:cursor-default"
              onClick={() => toggleSection("categories")}
            >
              <span>Danh mục</span>
              <span className="md:hidden">
                {expandedSections.categories ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </span>
            </div>

            <div
              className={`${
                expandedSections.categories ? "block" : "hidden"
              } md:block`}
            >
              <a href="/#" className="footer_top-link">
                <p className="text-[#5e6f88] mb-3 md:mb-5 text-sm md:text-base">
                  Dược Phẩm
                </p>
              </a>
              <a href="/#" className="footer_top-link">
                <p className="text-[#5e6f88] mb-3 md:mb-5 text-sm md:text-base">
                  Chăm sóc sức khoẻ
                </p>
              </a>
              <a href="/#" className="footer_top-link">
                <p className="text-[#5e6f88] mb-3 md:mb-5 text-sm md:text-base">
                  Chăm sóc cá nhân
                </p>
              </a>
              <a href="/#" className="footer_top-link">
                <p className="text-[#5e6f88] mb-3 md:mb-5 text-sm md:text-base">
                  Thực phẩm chức năng
                </p>
              </a>
              <a href="/#" className="footer_top-link">
                <p className="text-[#5e6f88] mb-3 md:mb-5 text-sm md:text-base">
                  Mẹ và bé
                </p>
              </a>
              <a href="/#" className="footer_top-link">
                <p className="text-[#5e6f88] mb-3 md:mb-5 text-sm md:text-base">
                  Chăm sóc sắc đẹp
                </p>
              </a>
              <a href="/#" className="footer_top-link">
                <p className="text-[#5e6f88] mb-3 md:mb-5 text-sm md:text-base">
                  Thiết bị y tế
                </p>
              </a>
            </div>
          </div>

          {/* Contact Section */}
          <div className="w-full md:flex-[25%_1] mb-4 md:mb-0">
            <div
              className="font-bold text-[#5e6f88] mb-3 md:mb-5 flex justify-between items-center md:block cursor-pointer md:cursor-default"
              onClick={() => toggleSection("contact")}
            >
              <span>
                CSKH{" "}
                <span className="font-bold text-[#187733]">0866554764</span>
              </span>
              <span className="md:hidden">
                {expandedSections.contact ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </span>
            </div>

            <div
              className={`${
                expandedSections.contact ? "block" : "hidden"
              } md:block`}
            >
              <p className="text-[#5e6f88] text-sm md:text-base">
                Tư vấn đặt hàng và chăm sóc khách hàng
              </p>
            </div>
          </div>

          {/* Social Media Section */}
          <div className="w-full md:flex-[25%_1]">
            <div
              className="font-bold text-[#5e6f88] mb-3 md:mb-5 flex justify-between items-center md:block cursor-pointer md:cursor-default"
              onClick={() => toggleSection("social")}
            >
              <span>Theo dõi tôi</span>
              <span className="md:hidden">
                {expandedSections.social ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </span>
            </div>

            <div
              className={`${
                expandedSections.social ? "block" : "hidden"
              } md:block`}
            >
              <a href="/#">
                <p className="flex items-center text-black mb-3 md:mb-5 text-sm md:text-base">
                  <FaFacebook className="text-blue-700 text-lg md:text-xl mr-2" />
                  FaceBook
                </p>
              </a>

              <a href="/#">
                <p className="flex items-center text-black mb-3 md:mb-5 text-sm md:text-base">
                  <FaYoutube className="text-red-700 text-lg md:text-xl mr-2" />
                  Youtube
                </p>
              </a>

              <a href="/#">
                <p className="flex items-center text-black mb-3 md:mb-5 text-sm md:text-base">
                  <FaTiktok className="text-black text-lg md:text-xl mr-2" />
                  Tiktok
                </p>
              </a>

              <a href="/#">
                <p className="flex items-center text-black text-sm md:text-base">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width="24"
                    height="24"
                    viewBox="0 0 48 48"
                    className="mr-2"
                  >
                    <path
                      fill="#2962ff"
                      d="M15,36V6.827l-1.211-0.811C8.64,8.083,5,13.112,5,19v10c0,7.732,6.268,14,14,14h10	c4.722,0,8.883-2.348,11.417-5.931V36H15z"
                    ></path>
                    <path
                      fill="#eee"
                      d="M29,5H19c-1.845,0-3.601,0.366-5.214,1.014C10.453,9.25,8,14.528,8,19	c0,6.771,0.936,10.735,3.712,14.607c0.216,0.301,0.357,0.653,0.376,1.022c0.043,0.835-0.129,2.365-1.634,3.742	c-0.162,0.148-0.059,0.419,0.16,0.428c0.942,0.041,2.843-0.014,4.797-0.877c0.557-0.246,1.191-0.203,1.729,0.083	C20.453,39.764,24.333,40,28,40c4.676,0,9.339-1.04,12.417-2.916C42.038,34.799,43,32.014,43,29V19C43,11.268,36.732,5,29,5z"
                    ></path>
                    <path
                      fill="#2962ff"
                      d="M36.75,27C34.683,27,33,25.317,33,23.25s1.683-3.75,3.75-3.75s3.75,1.683,3.75,3.75	S38.817,27,36.75,27z M36.75,21c-1.24,0-2.25,1.01-2.25,2.25s1.01,2.25,2.25,2.25S39,24.49,39,23.25S37.99,21,36.75,21z"
                    ></path>
                    <path
                      fill="#2962ff"
                      d="M31.5,27h-1c-0.276,0-0.5-0.224-0.5-0.5V18h1.5V27z"
                    ></path>
                    <path
                      fill="#2962ff"
                      d="M27,19.75v0.519c-0.629-0.476-1.403-0.769-2.25-0.769c-2.067,0-3.75,1.683-3.75,3.75	S22.683,27,24.75,27c0.847,0,1.621-0.293,2.25-0.769V26.5c0,0.276,0.224,0.5,0.5,0.5h1v-7.25H27z M24.75,25.5	c-1.24,0-2.25-1.01-2.25-2.25S23.51,21,24.75,21S27,22.01,27,23.25S25.99,25.5,24.75,25.5z"
                    ></path>
                    <path
                      fill="#2962ff"
                      d="M21.25,18h-8v1.5h5.321L13,26h0.026c-0.163,0.211-0.276,0.463-0.276,0.75V27h7.5	c0.276,0,0.5-0.224,0.5-0.5v-1h-5.321L21,19h-0.026c0.163-0.211,0.276-0.463,0.276-0.75V18z"
                    ></path>
                  </svg>
                  Zalo
                </p>
              </a>
            </div>
          </div>
        </div>

        <div className="text-center mt-4 text-sm md:text-base lg:text-xl font-bold">
          <span>&copy; Copyright 2025 NV Pharmacy. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
};

export default FooterInfo;
