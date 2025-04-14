import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "@/hook/use-media-query.js";
import { ArrowLeft, LogOut, Globe, ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { apiClient } from "@/lib/api-client.js";
import { LOGOUT_ROUTE } from "@/API/index.api.js";
import { useAppStore } from "@/store/index.js";
import { useTranslation } from 'react-i18next'; // Import hook từ react-i18next

const Setting = () => {
  const { setUserInfo } = useAppStore();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  
  // Sử dụng hook useTranslation
  const { t, i18n } = useTranslation();
  
  const handleLogout = () => {
    console.log("User logged out");
    navigate("/login");
  };

  // Hàm thay đổi ngôn ngữ
  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className="min-h-screen pb-10">
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
          <h1 className="text-base font-semibold">{t('settings.title')}</h1>
          <div className="w-9"></div> {/* Empty div for alignment */}
        </div>
      )}

      {/* Main Content */}
      <div className={`${isMobile ? "p-4" : ""}`}>
        {/* Desktop Title (hidden on mobile) */}
        {!isMobile && <h2 className="text-2xl font-semibold mb-6">{t('settings.title')}</h2>}

        <div className="max-w-2xl mx-auto">
          {/* Language Settings */}
          <Card className="mb-4">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Globe className="h-5 w-5 text-green-600 mr-3" />
                  <div>
                    <h3 className="text-lg font-medium">{t('settings.language')}</h3>
                    <p className="text-sm text-gray-500">
                      {t('settings.language_desc')}
                    </p>
                  </div>
                </div>

                {isMobile ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="flex items-center gap-1 text-green-600"
                      >
                        {i18n.language === "vi" ? "Tiếng Việt" : "English"}
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleLanguageChange("vi")}
                        className="flex items-center justify-between"
                      >
                        Tiếng Việt
                        {i18n.language === "vi" && (
                          <Check className="h-4 w-4 ml-2" />
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleLanguageChange("en")}
                        className="flex items-center justify-between"
                      >
                        English
                        {i18n.language === "en" && (
                          <Check className="h-4 w-4 ml-2" />
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant={i18n.language === "vi" ? "default" : "outline"}
                      className={
                        i18n.language === "vi"
                          ? "bg-green-600 hover:bg-green-700"
                          : ""
                      }
                      onClick={() => handleLanguageChange("vi")}
                    >
                      Tiếng Việt
                    </Button>
                    <Button
                      variant={i18n.language === "en" ? "default" : "outline"}
                      className={
                        i18n.language === "en"
                          ? "bg-green-600 hover:bg-green-700"
                          : ""
                      }
                      onClick={() => handleLanguageChange("en")}
                    >
                      English
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* App Version */}
          <Card className="mb-4">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">{t('settings.app_version')}</h3>
                  <p className="text-sm text-gray-500">
                    {t('settings.current_version')}: 1.0.0
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Logout */}
          <Card>
            <CardContent className="p-6">
              <Button
                variant="destructive"
                className="w-full flex items-center justify-center gap-2"
                onClick={async () => {
                  localStorage.removeItem("token");
                  setUserInfo(null);
                  await apiClient.post(LOGOUT_ROUTE, {
                    role: "client",
                  });
                  window.location.reload();
                }}
              >
                <LogOut className="h-5 w-5" />
                {t('settings.logout')}
              </Button>
            </CardContent>
          </Card>

          {/* Version info at bottom */}
          <div className="mt-8 text-center text-gray-500 text-sm">
            <p>NB Pharmacy © 2025</p>
            <p>{t('settings.current_version')}: 1.0.0</p>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('settings.confirm_logout')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('settings.confirm_logout_desc')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('settings.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600"
            >
              {t('settings.logout')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Setting;
