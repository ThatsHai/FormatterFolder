const ThesisInfoButtons = () => {
  return (
    <div className="flex w-full justify-end my-5 gap-5">
      <div>
        <p>Các chức năng của sinh viên</p>
        <button className="border p-2 rounded-md px-5 bg-white">
          Xuất file PDF
        </button>
        <button className="border p-2 rounded-md px-5 bg-white">
          Xem lịch sử sửa
        </button>
        <button className="border p-2 rounded-md px-5 bg-white">
          Chỉnh sửa
        </button>
        <button className="border p-2 rounded-md px-5 bg-white">Gửi bài</button>
      </div>
      <div>
        <p>Các chức năng của CBHD</p>
        <button className="border p-2 rounded-md px-5 bg-white">
          Xuất file PDF
        </button>
        <button className="border p-2 rounded-md px-5 bg-white">
          Phê duyệt
        </button>
      </div>
    </div>
  );
};

export default ThesisInfoButtons;
