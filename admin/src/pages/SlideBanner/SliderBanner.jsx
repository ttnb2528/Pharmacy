import { useContext, useState } from "react";
import Header from "../component/Header.jsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button.jsx";
import { Edit, Plus, Trash } from "lucide-react";
import AdminSliderBannerForm from "./Component/AdminAddSliderBannerForm.jsx";
import { SliderBannerContext } from "@/context/SliderBannerContext.jsx";
import EditSliderDialog from "./Component/EditSliderDialog.jsx";
import ConfirmForm from "../component/ConfirmForm.jsx";
import { apiClient } from "@/lib/api-admin.js";
import { toast } from "sonner";
import { DELETE_SLIDER_BANNER_ROUTE } from "@/API/index.api.js";
import Loading from "../component/Loading.jsx";
import ImagePreview from "../Product/components/ImageReview.jsx";
import CustomPagination from "../component/Pagination.jsx";

const SliderBanner = () => {
  const { sliders, setSliders } = useContext(SliderBannerContext);
  const [isLoading, setIsLoading] = useState(false);

  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [selectedSlider, setSelectedSlider] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [previewImage, setPreviewImage] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Lọc các slider chưa bị xóa
  const activeSliders = sliders.filter((slider) => !slider.deleted);

  const handleEdit = (slider) => {
    setSelectedSlider(slider);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setSelectedSlider(null);
    setIsEditing(false);
  };

  const totalPages = Math.ceil(activeSliders.length / itemsPerPage);
  const paginatedSliders = activeSliders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCancel = () => {
    setIsAdding(false);
  };

  const handleOpenConfirm = (slider) => {
    setSelectedSlider(slider);
    setConfirmDelete(true);
  };

  const handleDeleteSlider = async (slider) => {
    try {
      setIsLoading(true);
      const res = await apiClient.delete(
        `${DELETE_SLIDER_BANNER_ROUTE}/${slider._id}`
      );

      if (res.status === 200 && res.data.status === 200) {
        toast.success(res.data.message);
        setSelectedSlider(null);
        setConfirmDelete(false);
        setSliders((prevSliders) =>
          prevSliders.map((item) =>
            item._id === slider._id ? { ...item, deleted: true } : item
          )
        );
      }
    } catch (error) {
      console.log(error);
      toast.error("Có lỗi xảy ra khi xóa slider");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageClick = (image) => {
    setPreviewImage(image);
    setIsPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    setTimeout(() => {
      setPreviewImage(null);
    }, 200); // Đợi animation đóng dialog kết thúc
  };

  return (
    <div>
      {isLoading && <Loading />}
      <Header title={"Slider ảnh"} />
      <main className="p-6">
        <div className="flex justify-end items-center mb-4">
          <Dialog open={isAdding} onOpenChange={setIsAdding}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="hidden sm:block mr-2 h-4 w-4" /> Thêm Slider
                ảnh
              </Button>
            </DialogTrigger>
            <DialogContent
              className="max-w-2xl"
              onPointerDownOutside={(e) => {
                e.preventDefault();
              }}
            >
              <DialogHeader>
                <DialogTitle>Thêm Slider ảnh</DialogTitle>
              </DialogHeader>
              <DialogDescription></DialogDescription>
              <AdminSliderBannerForm handleCancel={handleCancel} />
            </DialogContent>
          </Dialog>
        </div>
        <div className="w-full overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">STT</TableHead>
                <TableHead className="whitespace-nowrap">Ảnh</TableHead>
                <TableHead className="whitespace-nowrap">Vị trí</TableHead>
                <TableHead className="whitespace-nowrap">Mô tả</TableHead>
                <TableHead className="whitespace-nowrap">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedSliders.length > 0 ? (
                paginatedSliders.map((slider, index) => (
                  <TableRow key={slider._id}>
                    <TableCell className="text-center whitespace-nowrap">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </TableCell>
                    <TableCell>
                      <div className="w-[160px] h-[90px] overflow-hidden rounded-md">
                        <img
                          onClick={() => handleImageClick(slider.image)}
                          src={slider.image || "/placeholder.svg"}
                          alt={`Slider ${index + 1}`}
                          className="w-full h-full object-contain bg-gray-100"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {slider.position}
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[230px] whitespace-nowrap overflow-hidden text-ellipsis">
                        {slider.description}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2 whitespace-nowrap">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(slider)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleOpenConfirm(slider)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Không có slider nào
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <CustomPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </main>
      {confirmDelete && (
        <ConfirmForm
          info={selectedSlider}
          open={confirmDelete}
          onClose={() => {
            setConfirmDelete(false);
            setSelectedSlider(null);
          }}
          handleConfirm={() => handleDeleteSlider(selectedSlider)}
          type="slider"
        />
      )}

      {isEditing && (
        <EditSliderDialog
          slider={selectedSlider}
          isOpen={isEditing}
          onClose={handleCancelEdit}
        />
      )}

      <ImagePreview
        imageUrl={previewImage}
        isOpen={isPreviewOpen}
        onClose={handleClosePreview}
      />
    </div>
  );
};

export default SliderBanner;
