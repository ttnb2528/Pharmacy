import { Collapse, Input, Checkbox, Radio } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaRedo } from "react-icons/fa";

const FilterProduct = ({ products, onFilter, setIsLoading }) => {
  const { t } = useTranslation();
  const [priceRange, setPriceRange] = useState(null);
  const [brands, setBrands] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [searchBrand, setSearchBrand] = useState("");
  const [selectedOrigins, setSelectedOrigins] = useState([]);
  const [searchOrigin, setSearchOrigin] = useState("");
  const [origins, setOrigins] = useState([]);

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

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      onFilter({ priceRange, selectedBrands, selectedOrigins });
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [priceRange, selectedBrands, selectedOrigins]);

  const handlePriceChange = (e) => {
    setPriceRange(e.target.value);
  };

  const handleBrandChange = (checkedValues) => {
    setSelectedBrands(checkedValues);
  };

  const handleSearchBrandChange = (e) => {
    setSearchBrand(e.target.value);
  };

  const handleOriginChange = (checkedValues) => {
    setSelectedOrigins(checkedValues);
  };

  const handleSearchOriginChange = (e) => {
    setSearchOrigin(e.target.value);
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

  const isFilterApplied =
    priceRange || selectedBrands.length > 0 || selectedOrigins.length > 0;

  const handleResetFilter = () => {
    if (priceRange) setPriceRange(null);

    if (selectedBrands.length > 0) {
      setSelectedBrands([]);
      setSearchBrand("");
    }
    if (selectedOrigins.length > 0) {
      setSelectedOrigins([]);
      setSearchOrigin("");
    }
  };

  const items = [
    {
      key: "1",
      label: (
        <span className="text-lg font-bold text-gray-400">{t("Filter.price_range")}</span>
      ),
      children: (
        <Radio.Group onChange={handlePriceChange} value={priceRange}>
          <Radio value="0-100000">{t("Filter.under")} 100.000đ</Radio>
          <Radio value="100000-500000">100.000đ - 500.000đ</Radio>
          <Radio value="500000-1000000">500.000đ - 1.000.000đ</Radio>
          <Radio value="1000000">{t("Filter.over")} 1.000.000đ</Radio>
        </Radio.Group>
      ),
    },
    {
      key: "2",
      label: (
        <span className="text-lg font-bold text-gray-400">{t("Filter.brand")}</span>
      ),
      children: (
        <>
          <Input
            placeholder={t("Filter.searchBrand")}
            onChange={handleSearchBrandChange}
            value={searchBrand}
            className="mb-4"
          />
          <div className="max-h-40 overflow-y-auto">
            <Checkbox.Group
              onChange={handleBrandChange}
              className="flex flex-col space-y-2"
              value={selectedBrands}
            >
              {filterBrands(brands, searchBrand).map((brand) => (
                <Checkbox key={brand} value={brand} className="text-base">
                  {brand}
                </Checkbox>
              ))}
            </Checkbox.Group>
          </div>
        </>
      ),
    },
    {
      key: "3",
      label: <span className="text-lg font-bold text-gray-400">{t("Filter.origin")}</span>,
      children: (
        <>
          <Input
            placeholder={t("Filter.searchOrigin")}
            onChange={handleSearchOriginChange}
            value={searchOrigin}
            className="mb-4"
          />
          <div className="max-h-40 overflow-y-auto">
            <Checkbox.Group
              onChange={handleOriginChange}
              className="flex flex-col space-y-2"
              value={selectedOrigins}
            >
              {filterOrigins(origins, searchOrigin).map((origin) => (
                <Checkbox key={origin} value={origin} className="text-base">
                  {origin}
                </Checkbox>
              ))}
            </Checkbox.Group>
          </div>
        </>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-lg p-5 w-1/4 sticky top-3 h-fit">
      <span className="text-xl font-bold">{t("Filter.title")}</span>
      <Collapse
        items={items}
        bordered={false}
        defaultActiveKey={["1"]}
        expandIconPosition="end"
      />
      {isFilterApplied && (
        <div
          className="mt-4 flex justify-end items-center text-sm font-semibold text-neutral-500 cursor-pointer"
          onClick={handleResetFilter}
        >
          <FaRedo className="mr-2" /> <span>{t("Filter.reset")}</span>
        </div>
      )}
    </div>
  );
};

export default FilterProduct;
