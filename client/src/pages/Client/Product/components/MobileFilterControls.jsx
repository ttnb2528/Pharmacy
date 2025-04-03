import { useState } from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MobileFilterOptions from "./MobileFilterOptions.jsx";

const MobileFilterControls = ({ products, onFilter, onSort }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: null,
    selectedBrands: [],
    selectedOrigins: [],
  });

  const handleApplyFilters = () => {
    onFilter(filters);
    setIsOpen(false);
  };

  const handleResetFilters = () => {
    setFilters({
      priceRange: null,
      selectedBrands: [],
      selectedOrigins: [],
    });
  };

  const handleSortChange = (value) => {
    onSort(value);
  };

  const isFilterApplied =
    filters.priceRange ||
    filters.selectedBrands.length > 0 ||
    filters.selectedOrigins.length > 0;

  return (
    <div className="bg-white p-3 sticky top-14 z-50 shadow-sm md:hidden">
      <div className="flex justify-between items-center">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={`flex items-center gap-1 ${
                isFilterApplied ? "border-[#26773d] text-[#26773d]" : ""
              }`}
            >
              <Filter className="h-4 w-4" />
              Bộ lọc
              {isFilterApplied && (
                <span className="ml-1 h-5 w-5 rounded-full bg-[#26773d] text-white text-xs flex items-center justify-center">
                  {filters.selectedBrands.length +
                    filters.selectedOrigins.length +
                    (filters.priceRange ? 1 : 0)}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh]">
            <SheetHeader>
              <SheetTitle>Bộ lọc</SheetTitle>
            </SheetHeader>

            <div className="py-4 overflow-auto h-[calc(100%-120px)]">
              <MobileFilterOptions
                products={products}
                filters={filters}
                setFilters={setFilters}
              />
            </div>

            <SheetFooter className="flex flex-row gap-3 border-t pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleResetFilters}
                disabled={!isFilterApplied}
              >
                Thiết lập lại
              </Button>
              <Button
                className="flex-1 bg-[#26773d] hover:bg-[#1e5f31]"
                onClick={handleApplyFilters}
              >
                Áp dụng
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>

        <Select onValueChange={handleSortChange}>
          <SelectTrigger className="w-[140px] h-9 text-sm">
            <SelectValue placeholder="Sắp xếp theo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Mặc định</SelectItem>
            <SelectItem value="price-asc">Giá tăng dần</SelectItem>
            <SelectItem value="price-desc">Giá giảm dần</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default MobileFilterControls;
