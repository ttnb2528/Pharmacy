import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="bg-white rounded h-[100vh]">
      <div className="py-14">
        <div className="bg-[url('https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif')] h-[350px] bg-center bg-no-repeat">
          <h1 className="text-center text-[80px]">404</h1>
        </div>

        <div className="text-center space-y-4">
          <p className="text-3xl font-bold">Không tìm thấy trang</p>
          <p>
            Thật không may, địa chỉ URL bạn yêu cầu không được tìm thấy. Thử tìm
            kiếm lại kết quả khác.
          </p>
          <button className="bg-green-600 h-10 text-white w-40 rounded-lg font-bold text-base border-none">
            <Link to="/">Quay lại trang chủ</Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
