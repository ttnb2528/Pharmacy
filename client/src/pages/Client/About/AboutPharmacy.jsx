import { useState } from "react";
import { useMediaQuery } from "@/hook/use-media-query.js";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MapPin,
  Clock,
  Phone,
  Facebook,
  Instagram,
  Award,
  Stethoscope,
  Pill,
  ShoppingBag,
  Users,
} from "lucide-react";

const AboutPharmacy = () => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [activeTab, setActiveTab] = useState("about");

  // Team members data
  const teamMembers = [
    {
      name: "Nguyễn Văn A",
      role: "Dược sĩ trưởng",
      image:
        "https://res.cloudinary.com/thientan/image/upload/v1744290984/ChiefPharmacist_icf0eu.svg",
      description:
        "Dược sĩ chuyên khoa I với hơn 15 năm kinh nghiệm trong lĩnh vực dược phẩm.",
    },
    {
      name: "Trần Thị B",
      role: "Dược sĩ",
      image:
        "https://res.cloudinary.com/thientan/image/upload/v1744293429/Pharmacist_tic0ke.jpg",
      description:
        "Tốt nghiệp Đại học Y Dược TP.HCM, có 8 năm kinh nghiệm tư vấn dược phẩm.",
    },
    {
      name: "Lê Văn C",
      role: "Nhân viên tư vấn",
      image:
        "https://res.cloudinary.com/thientan/image/upload/v1744294391/Consultant_hne9y9.svg",
      description:
        "Chuyên viên tư vấn với kiến thức sâu rộng về các sản phẩm chăm sóc sức khỏe.",
    },
  ];

  // Services data
  const services = [
    {
      icon: <Pill className="h-10 w-10 text-green-600" />,
      title: "Bán thuốc theo đơn",
      description:
        "Cung cấp đầy đủ các loại thuốc theo đơn với sự tư vấn chuyên nghiệp từ dược sĩ.",
    },
    {
      icon: <ShoppingBag className="h-10 w-10 text-green-600" />,
      title: "Sản phẩm chăm sóc sức khỏe",
      description:
        "Đa dạng các sản phẩm chăm sóc sức khỏe, thực phẩm chức năng và vitamin.",
    },
    {
      icon: <Stethoscope className="h-10 w-10 text-green-600" />,
      title: "Tư vấn sức khỏe",
      description:
        "Dịch vụ tư vấn sức khỏe miễn phí từ đội ngũ dược sĩ có chuyên môn cao.",
    },
    {
      icon: <Award className="h-10 w-10 text-green-600" />,
      title: "Chương trình khách hàng thân thiết",
      description:
        "Tích điểm đổi quà và nhiều ưu đãi hấp dẫn cho khách hàng thường xuyên.",
    },
  ];

  // Business hours
  const businessHours = [
    { day: "Thứ Hai - Thứ Sáu", hours: "7:30 - 21:30" },
    { day: "Thứ Bảy", hours: "8:00 - 21:00" },
    { day: "Chủ Nhật", hours: "8:00 - 20:00" },
    { day: "Ngày Lễ", hours: "8:00 - 20:00" },
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-10 mb-2">
      {/* Mobile Header */}
      {isMobile && (
        <div className="sticky top-0 z-10 bg-white p-3 flex items-center justify-between border-b">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-base font-semibold">Về nhà thuốc</h1>
          <div className="w-9"></div> {/* Empty div for alignment */}
        </div>
      )}

      {/* Hero Section */}
      <div className="relative bg-green-600 text-white">
        <div className="container mx-auto px-4 py-12 md:py-20">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">NB Pharmacy</h1>
          <p className="text-lg md:text-xl max-w-2xl">
            Chăm sóc sức khỏe cộng đồng với dịch vụ chuyên nghiệp và sản phẩm
            chất lượng cao
          </p>
        </div>
        <div className="absolute bottom-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
          <div className="w-full h-full bg-[url('/placeholder.svg')] bg-no-repeat bg-contain bg-right-bottom"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Desktop Title (hidden on mobile) */}
        {!isMobile && (
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Về nhà thuốc</h2>
            <div className="h-1 w-20 bg-green-600 mt-2"></div>
          </div>
        )}

        {/* Mobile Tabs */}
        {isMobile && (
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full mb-6"
          >
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="about">Giới thiệu</TabsTrigger>
              <TabsTrigger value="services">Dịch vụ</TabsTrigger>
              <TabsTrigger value="team">Đội ngũ</TabsTrigger>
              <TabsTrigger value="contact">Liên hệ</TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="mt-4">
              <AboutSection />
            </TabsContent>

            <TabsContent value="services" className="mt-4">
              <ServicesSection services={services} />
            </TabsContent>

            <TabsContent value="team" className="mt-4">
              <TeamSection teamMembers={teamMembers} />
            </TabsContent>

            <TabsContent value="contact" className="mt-4">
              <ContactSection businessHours={businessHours} />
            </TabsContent>
          </Tabs>
        )}

        {/* Desktop Layout (hidden on mobile) */}
        {!isMobile && (
          <div className="grid grid-cols-1 gap-12">
            <AboutSection />
            <ServicesSection services={services} />
            <TeamSection teamMembers={teamMembers} />
            <ContactSection businessHours={businessHours} />
          </div>
        )}
      </div>
    </div>
  );
};

// About Section Component
const AboutSection = () => (
  <section id="about" className="bg-white rounded-lg shadow-sm p-6 md:p-8">
    <h3 className="text-2xl font-bold text-gray-800 mb-4">Giới thiệu</h3>
    <div className="space-y-4">
      <p>
        NB Pharmacy được thành lập vào năm 2025, với sứ mệnh cung cấp dịch vụ
        chăm sóc sức khỏe chất lượng cao và đáng tin cậy cho cộng đồng. Chúng
        tôi tự hào là một trong những nhà thuốc hàng đầu tại khu vực, luôn đặt
        sức khỏe và sự an toàn của khách hàng lên hàng đầu.
      </p>
      <p>
        Với đội ngũ dược sĩ chuyên nghiệp và giàu kinh nghiệm, chúng tôi không
        chỉ cung cấp thuốc theo đơn mà còn tư vấn tận tâm để đảm bảo khách hàng
        sử dụng thuốc an toàn và hiệu quả.
      </p>

      <div className="mt-6">
        <h4 className="text-xl font-semibold text-gray-800 mb-3">
          Tầm nhìn & Sứ mệnh
        </h4>
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-6">
              <h5 className="text-lg font-semibold text-green-600 mb-2">
                Tầm nhìn
              </h5>
              <p>
                Trở thành nhà thuốc hàng đầu, được tin cậy và lựa chọn bởi mọi
                gia đình khi có nhu cầu về dược phẩm và chăm sóc sức khỏe.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h5 className="text-lg font-semibold text-green-600 mb-2">
                Sứ mệnh
              </h5>
              <p>
                Cung cấp sản phẩm và dịch vụ chăm sóc sức khỏe chất lượng cao,
                góp phần nâng cao sức khỏe và chất lượng cuộc sống của cộng
                đồng.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-6">
        <h4 className="text-xl font-semibold text-gray-800 mb-3">
          Giá trị cốt lõi
        </h4>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <span className="font-medium">Chất lượng:</span> Cam kết cung cấp
            sản phẩm và dịch vụ chất lượng cao nhất.
          </li>
          <li>
            <span className="font-medium">Tận tâm:</span> Luôn đặt lợi ích và
            sức khỏe của khách hàng lên hàng đầu.
          </li>
          <li>
            <span className="font-medium">Chuyên nghiệp:</span> Đội ngũ nhân
            viên được đào tạo bài bản và làm việc chuyên nghiệp.
          </li>
          <li>
            <span className="font-medium">Đổi mới:</span> Không ngừng cập nhật
            kiến thức và sản phẩm mới nhất trong lĩnh vực dược phẩm.
          </li>
        </ul>
      </div>
    </div>
  </section>
);

// Services Section Component
const ServicesSection = ({ services }) => (
  <section id="services" className="bg-white rounded-lg shadow-sm p-6 md:p-8">
    <h3 className="text-2xl font-bold text-gray-800 mb-6">Dịch vụ</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {services.map((service, index) => (
        <Card key={index}>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center md:flex-row md:text-left md:items-start">
              <div className="mb-4 md:mb-0 md:mr-4">{service.icon}</div>
              <div>
                <h4 className="text-lg font-semibold mb-2">{service.title}</h4>
                <p className="text-gray-600">{service.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </section>
);

// Team Section Component
const TeamSection = ({ teamMembers }) => (
  <section id="team" className="bg-white rounded-lg shadow-sm p-6 md:p-8">
    <h3 className="text-2xl font-bold text-gray-800 mb-6">Đội ngũ</h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {teamMembers.map((member, index) => (
        <Card key={index}>
          <CardContent className="pt-6 flex flex-col items-center text-center">
            <div className="w-32 h-32 rounded-full overflow-hidden mb-4">
              <img
                src={member.image || "/placeholder.svg"}
                alt={member.name}
                className="w-full h-full object-cover"
              />
            </div>
            <h4 className="text-lg font-semibold">{member.name}</h4>
            <p className="text-green-600 mb-2">{member.role}</p>
            <p className="text-gray-600 text-sm">{member.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  </section>
);

// Contact Section Component
const ContactSection = ({ businessHours }) => (
  <section id="contact" className="bg-white rounded-lg shadow-sm p-6 md:p-8">
    <h3 className="text-2xl font-bold text-gray-800 mb-6">Liên hệ & Địa chỉ</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <div className="mb-6">
          <h4 className="text-xl font-semibold mb-4 flex items-center">
            <MapPin className="mr-2 h-5 w-5 text-green-600" />
            Địa chỉ
          </h4>
          <p className="mb-2">Ký túc xá A, Đại học Cần Thơ</p>
          <p>Phường Xuân Khánh, Quận Ninh Kiều, TP. Cần Thơ</p>
        </div>

        <div className="mb-6">
          <h4 className="text-xl font-semibold mb-4 flex items-center">
            <Phone className="mr-2 h-5 w-5 text-green-600" />
            Liên hệ
          </h4>
          <p className="mb-2">
            <span className="font-medium">Điện thoại:</span> 0866 554 764
          </p>
          <p>
            <span className="font-medium">Email:</span> info@nbpharmacy.com
          </p>
        </div>

        <div>
          <h4 className="text-xl font-semibold mb-4 flex items-center">
            <Users className="mr-2 h-5 w-5 text-green-600" />
            Mạng xã hội
          </h4>
          <div className="flex space-x-4">
            <a
              href="#"
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="h-5 w-5 mr-1" />
              <span>Facebook</span>
            </a>
            <a
              href="#"
              className="flex items-center text-pink-600 hover:text-pink-800 transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5 mr-1" />
              <span>Instagram</span>
            </a>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-xl font-semibold mb-4 flex items-center">
          <Clock className="mr-2 h-5 w-5 text-green-600" />
          Giờ làm việc
        </h4>
        <div className="space-y-2">
          {businessHours.map((item, index) => (
            <div
              key={index}
              className="flex justify-between pb-2 border-b border-gray-100"
            >
              <span className="font-medium">{item.day}</span>
              <span>{item.hours}</span>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <h4 className="text-xl font-semibold mb-4">Bản đồ</h4>
          <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
            {/* Placeholder for map - in a real app, you would embed Google Maps here */}
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <p className="text-gray-500">Bản đồ Google Maps</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default AboutPharmacy;
