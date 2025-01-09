import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";

import { useState } from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import VietnameseCalendar from "@/utils/vietnamese-calendar.jsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.jsx";

import { FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const PersonalInfo = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date());
  return (
    <div>
      <div>
        <div className="items-center space-x-4 mb-4 hidden md:block">
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-neutral-900">
              Thông tin cá nhân
            </h1>
          </div>
          <div></div>
        </div>

        <div>
          <div className="rounded-lg bg-white p-6">
            {/* set image */}
            <div className="mb-3">
              <span className="text-sm font-semibold text-neutral-900">
                Ảnh đại diện
              </span>
              <div className="mt-2 flex items-center gap-6">
                {/* logic set image */}
                <img src="" alt="image" />
                <div>
                  <div className="mb-2 flex">
                    <button
                      data-size="sm"
                      type="button"
                      className="relative flex justify-center outline-none font-semibold bg-neutral-200 border-0 hover:bg-neutral-300 focus:ring-neutral-300 text-neutral-900 h-9 items-center rounded-lg p-4 text-sm"
                      onClick={() => {
                        document.getElementById("picture").click();
                      }}
                    >
                      <span>Cập nhật ảnh mới</span>
                    </button>
                    <input
                      id="picture"
                      className="hidden"
                      accept=".jpg, .jpeg, .png, .heic, .heif"
                      type="file"
                    ></input>
                  </div>
                  <div className="grid text-sm font-medium text-neutral-700">
                    <p>Dung lượng file tối đa 5 MB.</p>
                    <p>Định dạng: .JPEG, .PNG</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <form>
                <div className="grid grid-cols-2 gap-5">
                  <div className="col-span-1 grid gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Họ và tên</Label>
                      <Input id="fullName" placeholder="Họ và Tên" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dob">Ngày Sinh</Label>
                      <div>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              id="dob"
                              variant={"outline"}
                              className={cn(
                                "justify-start text-left font-normal w-full",
                                !date && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {date ? (
                                format(date, "dd/MM/yyyy", { locale: vi })
                              ) : (
                                <span>Chọn ngày</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <VietnameseCalendar
                              mode="single"
                              selected={date}
                              onSelect={setDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gender">Giới Tính</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn giới tính" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Nam">Nam</SelectItem>
                          <SelectItem value="Nữ">Nữ</SelectItem>
                          <SelectItem value="Khác">Khác</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="col-span-1 grid gap-4 border-l border-divider pl-5">
                    <div className="flex justify-between">
                      <div className="flex flex-1 flex-col gap-1 text-sm font-semibold text-neutral-900">
                        <p className="">Số điện thoại</p>
                        <p className="font-medium text-neutral-600 break-all">
                          **** *** 764
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <div className="flex-1">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" placeholder="Email" />
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <div className="flex flex-1 flex-col gap-1 text-sm font-semibold text-neutral-900">
                        <p className="">Mật khẩu</p>
                        <div className="text-sm font-medium">Tạo mật khẩu</div>
                      </div>
                      <div className="flex-2 flex cursor-pointer justify-end gap-1 text-sm font-normal" onClick={() => navigate("/account/info/update-password")}>
                        <span className="cursor-pointer text-green-500">
                          Cập nhật
                        </span>
                        <FaChevronRight className="mt-1 text-green-500" />
                      </div>
                    </div>
                  </div>
                </div>
                <Button className="mt-10">Lưu thay đổi</Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
