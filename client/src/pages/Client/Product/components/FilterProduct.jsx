import { Collapse, Input } from "antd";
import { useState } from "react";
import { Checkbox, Radio } from "antd";

const FilterProduct = () => {
  const [priceRange, setPriceRange] = useState(null);
  const [brands, setBrands] = useState([]);
  const [searchBrand, setSearchBrand] = useState("");
  const [origins, setOrigins] = useState([]);
  const [searchOrigin, setSearchOrigin] = useState("");

  const handlePriceChange = (e) => {
    setPriceRange(e.target.value);
  };

  const handleBrandChange = (checkedValues) => {
    setBrands(checkedValues);
  };

  const handleSearchBrandChange = (e) => {
    setSearchBrand(e.target.value);
  };

  const handleOriginChange = (checkedValues) => {
    setOrigins(checkedValues);
  };

  const filterBrands = (brands, searchTerm) => {
    if (!searchTerm) {
      return brands;
    }
    const lowerSearchTerm = searchTerm.toLowerCase();
    return brands.filter((brand) =>
      brand.toLowerCase().includes(lowerSearchTerm)
    );
  };

  const handleSearchOriginChange = (e) => {
    setSearchOrigin(e.target.value);
  };

  const filterOrigins = (origins, searchTerm) => {
    if (!searchTerm) {
      return origins;
    }
    const lowerSearchTerm = searchTerm.toLowerCase();
    return origins.filter((origin) =>
      origin.toLowerCase().includes(lowerSearchTerm)
    );
  };

  const items = [
    {
      key: "1",
      label: (
        <>
          <span className="text-lg font-bold text-gray-400">Khoảng giá</span>
        </>
      ),
      children: (
        <Radio.Group onChange={handlePriceChange} value={priceRange}>
          <Radio value="0-100">Dưới 100.000đ</Radio>
          <Radio value="100-500">100.000đ - 500.000đ</Radio>
          <Radio value="500-1000">500.000đ - 1.000.000đ</Radio>
          <Radio value="1000">Trên 1.000.000đ</Radio>
        </Radio.Group>
      ),
    },
    {
      key: "2",
      label: (
        <>
          <span className="text-lg font-bold text-gray-400">Thương hiệu</span>
        </>
      ),
      children: (
        <>
          <Input
            placeholder="Tìm kiếm thương hiệu"
            onChange={handleSearchBrandChange}
            value={searchBrand}
            className="mb-4"
          />
          <div className="max-h-40 overflow-y-auto">
            <Checkbox.Group
              onChange={handleBrandChange}
              className="flex flex-col space-y-2"
            >
              {filterBrands(
                [
                  "Thương hiệu 1",
                  "Thương hiệu 2",
                  "Thương hiệu 3",
                  "Thương hiệu 4",
                  "Thương hiệu 5",
                  "Thương hiệu 6",
                  "Thương hiệu 7",
                  "Thương hiệu 8",
                  "Thương hiệu 9",
                  "Thương hiệu 10",
                  "Thương hiệu 11",
                  "Thương hiệu 12",
                ],
                searchBrand
              ).map((brand) => (
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
      label: (
        <>
          <span className="text-lg font-bold text-gray-400">Xuất xứ</span>
        </>
      ),
      children: (
        <>
          <Input
            placeholder="Tìm kiếm xuất xứ"
            onChange={handleSearchOriginChange}
            value={searchOrigin}
            className="mb-4"
          />
          <div className="max-h-40 overflow-y-auto">
            <Checkbox.Group
              onChange={handleOriginChange}
              className="flex flex-col space-y-2"
            >
              {filterOrigins(
                [
                  "Việt Nam",
                  "Hoa Kỳ",
                  "Hàn Quốc",
                  "Nhật Bản",
                  "Trung Quốc",
                  "Pháp",
                  "Đức",
                  "Anh",
                  "Nga",
                  "Thái Lan",
                  "Úc",
                  "Canada",
                ],
                searchOrigin
              ).map((origin) => (
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
      <span className="text-xl font-bold">Bộ Lọc Nâng Cao</span>
      <Collapse
        items={items}
        bordered={false}
        defaultActiveKey={["1"]}
        expandIconPosition="end"
      />
      {/* Hiển thị các giá trị đã chọn (nếu cần) */}
      <div>
        <p>Khoảng giá: {priceRange}</p>
        <p>Thương hiệu: {brands.join(", ")}</p>
        <p>Xuất xứ: {origins.join(", ")}</p>
      </div>
    </div>
  );
};

export default FilterProduct;
