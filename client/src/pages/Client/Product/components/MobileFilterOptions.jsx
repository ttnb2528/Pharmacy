import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const MobileFilterOptions = ({ products, filters, setFilters }) => {
  const { t } = useTranslation();
  const [brands, setBrands] = useState([]);
  const [origins, setOrigins] = useState([]);
  const [searchBrand, setSearchBrand] = useState("");
  const [searchOrigin, setSearchOrigin] = useState("");

  useEffect(() => {
    // Extract unique brands from products
    const uniqueBrands = Array.from(
      new Set(products.map((product) => product.brandId.name))
    );
    setBrands(uniqueBrands);

    // Extract unique origins from products
    const uniqueOrigins = Array.from(
      new Set(
        products.map((product) => product?.batches[0]?.ManufactureId?.country)
      )
    );
    setOrigins(uniqueOrigins);
  }, [products]);

  const handlePriceChange = (value) => {
    setFilters((prev) => ({
      ...prev,
      priceRange: value,
    }));
  };

  const handleBrandChange = (brand, checked) => {
    setFilters((prev) => {
      if (checked) {
        return {
          ...prev,
          selectedBrands: [...prev.selectedBrands, brand],
        };
      } else {
        return {
          ...prev,
          selectedBrands: prev.selectedBrands.filter((b) => b !== brand),
        };
      }
    });
  };

  const handleOriginChange = (origin, checked) => {
    setFilters((prev) => {
      if (checked) {
        return {
          ...prev,
          selectedOrigins: [...prev.selectedOrigins, origin],
        };
      } else {
        return {
          ...prev,
          selectedOrigins: prev.selectedOrigins.filter((o) => o !== origin),
        };
      }
    });
  };

  const filterBrands = (brands, searchTerm) =>
    !searchTerm
      ? brands
      : brands.filter((brand) =>
          brand.toLowerCase().includes(searchTerm.toLowerCase())
        );

  const filterOrigins = (origins, searchTerm) =>
    !searchTerm
      ? origins
      : origins.filter((origin) =>
          origin.toLowerCase().includes(searchTerm.toLowerCase())
        );

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="price">
        <AccordionTrigger className="text-base font-semibold">
          {t("Filter.price_range")}
        </AccordionTrigger>
        <AccordionContent>
          <RadioGroup
            value={filters.priceRange}
            onValueChange={handlePriceChange}
            className="flex flex-col gap-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="0-100000" id="price-1" />
              <Label htmlFor="price-1">{t("Filter.under")} 100.000đ</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="100000-500000" id="price-2" />
              <Label htmlFor="price-2">100.000đ - 500.000đ</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="500000-1000000" id="price-3" />
              <Label htmlFor="price-3">500.000đ - 1.000.000đ</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="1000000" id="price-4" />
              <Label htmlFor="price-4">{t("Filter.over")} 1.000.000đ</Label>
            </div>
          </RadioGroup>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="brand">
        <AccordionTrigger className="text-base font-semibold">
        {t("Filter.brand")}
        </AccordionTrigger>
        <AccordionContent>
          <Input
            placeholder={t("Filter.searchBrand")}
            value={searchBrand}
            onChange={(e) => setSearchBrand(e.target.value)}
            className="mb-3"
          />
          <div className="max-h-40 overflow-y-auto space-y-2">
            {filterBrands(brands, searchBrand).map((brand) => (
              <div key={brand} className="flex items-center space-x-2">
                <Checkbox
                  id={`brand-${brand}`}
                  checked={filters.selectedBrands.includes(brand)}
                  onCheckedChange={(checked) =>
                    handleBrandChange(brand, checked)
                  }
                />
                <Label htmlFor={`brand-${brand}`}>{brand}</Label>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="origin">
        <AccordionTrigger className="text-base font-semibold">
          {t("Filter.origin")}
        </AccordionTrigger>
        <AccordionContent>
          <Input
            placeholder={t("Filter.searchOrigin")}
            value={searchOrigin}
            onChange={(e) => setSearchOrigin(e.target.value)}
            className="mb-3"
          />
          <div className="max-h-40 overflow-y-auto space-y-2">
            {filterOrigins(origins, searchOrigin).map((origin) => (
              <div key={origin} className="flex items-center space-x-2">
                <Checkbox
                  id={`origin-${origin}`}
                  checked={filters.selectedOrigins.includes(origin)}
                  onCheckedChange={(checked) =>
                    handleOriginChange(origin, checked)
                  }
                />
                <Label htmlFor={`origin-${origin}`}>{origin}</Label>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default MobileFilterOptions;
