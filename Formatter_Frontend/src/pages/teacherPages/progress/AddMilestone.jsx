import { useState, useEffect } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import api from "../../../services/api";
import dayjs from "dayjs";
import SuccessPopup from "../../../component/SuccessPopup";
import ConfirmationPopup from "../../../component/ConfirmationPopup";
const AddMilestone = ({
  handleFormToggle = () => {},
  onSuccess = () => {},
  initialData = null,
}) => {
  const [name, setName] = useState("");
  const [order, setOrder] = useState(1);
  const [milestones, setMilestones] = useState([]);
  const [deadline, setDeadline] = useState("");
  const today = new Date().toISOString().split("T")[0]; // yyyy-MM-dd
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [displaySuccessPopup, setDisplaySuccessPopup] = useState(false);

  useEffect(() => {
    if (initialData) {
      setMilestones(initialData.milestones || []);
    }
  }, [initialData]);

  // Tạo bản sao của danh sách milestones và chèn giai đoạn mới
  const previewStages = [
    ...milestones
      .slice()
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
      .map(
        (m) =>
          `${m.name}\n[${
            dayjs(m.dueDate).isValid()
              ? dayjs(m.dueDate).format("DD/MM/YYYY")
              : "Chưa đặt"
          }]`
      ),
  ];

  if (name) {
    previewStages.splice(order - 1, 0, name);
  }

  const sendData = async () => {
    const payload = {
      name,
      dueDate: dayjs(deadline).format("DD/MM/YYYY"),
      progressId: initialData.progressId,
      position: order - 1,
    };
    try {
      const response = await api.post(`milestones`, payload);
      setDisplaySuccessPopup(true);
    } catch (e) {
      console.log(e);
    }

    setShowConfirmPopup(false);
  };
  const handleSubmit = () => {
    // TODO: Gọi API tạo milestone
    setShowConfirmPopup(true);
  };
  const onSuccessPopupClosed = () => {
    setShowConfirmPopup(false);
    setDisplaySuccessPopup(false);
    onSuccess();
  };

  if (!initialData) return;
  const previousMilestone = milestones.find((m) => m.position === order - 2);
  const nextMilestone = milestones.find((m) => m.position === order - 1);
  const minDate =
    previousMilestone && dayjs(previousMilestone.dueDate).isValid()
      ? dayjs(previousMilestone.dueDate).format("YYYY-MM-DD")
      : dayjs().format("YYYY-MM-DD");

  const maxDate =
    nextMilestone && dayjs(nextMilestone.dueDate).isValid()
      ? dayjs(nextMilestone.dueDate).format("YYYY-MM-DD")
      : undefined; // không đặt max nếu không có

  return (
    <div>
      <button
        className="absolute -top-4 -right-4 bg-white border border-gray-300 px-4 py-1 rounded-full z-20 shadow-md"
        onClick={handleFormToggle}
      >
        X
      </button>
      <div className="relative z-10 w-full max-w-2xl bg-white rounded ">
        <h2 className="text-2xl font-bold text-center text-blue-800 mb-6">
          Thêm giai đoạn
        </h2>

        <div className="m-4">
          <label className="font-semibold block mb-1">1. TÊN GIAI ĐOẠN</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tên giai đoạn"
            className="w-full border-b border-blue-300 focus:outline-none py-1"
          />
        </div>

        <div className="m-4 flex items-center gap-1">
          <label className="font-semibold block w-1/3">
            2. THỨ TỰ GIAI ĐOẠN
          </label>
          <select
            value={order}
            onChange={(e) => setOrder(Number(e.target.value))}
            className="border border-gray-300 rounded-md p-2 w-1/4"
          >
            {Array.from({ length: milestones.length + 1 }, (_, i) => i + 1).map(
              (o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              )
            )}
          </select>
        </div>

        <div className="m-4 flex items-center gap-1">
          <label htmlFor="deadline" className="font-medium w-1/3">
            3. NGÀY HẾT HẠN
          </label>
          <input
            type="date"
            id="deadline"
            value={deadline}
            min={minDate}
            max={maxDate}
            onChange={(e) => setDeadline(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-1/4"
          />
        </div>

        <div className="m-4">
          <p className="font-semibold mb-2">XEM TRƯỚC</p>
          <div className="flex items-top justify-between overflow-x-auto">
            {previewStages.map((stage, idx) => (
              <div
                key={idx}
                className="relative flex flex-col items-center flex-1"
              >
                {idx < previewStages.length - 1 && (
                  <div className="absolute top-3 left-1/2 w-full h-0.5 bg-green-300 z-0"></div>
                )}
                <div className="z-10  bg-white rounded-full w-7 h-7 flex items-center justify-center">
                  {idx < order - 1 ? (
                    <CheckCircleIcon
                      className="text-green-500"
                      fontSize="large"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-lightGray flex items-center justify-center">
                      <RadioButtonUncheckedIcon
                        className="text-gray"
                        fontSize="large"
                      />
                    </div>
                  )}
                </div>
                <p className="text-center text-sm mt-2 break-words leading-tight max-w-[80px]">
                  {stage}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-6">
          <button
            onClick={handleSubmit}
            className="bg-darkBlue text-white px-6 py-2 rounded hover:bg-lightBlue"
          >
            Thêm giai đoạn
          </button>
        </div>
      </div>
      {showConfirmPopup && (
        <ConfirmationPopup
          isOpen={true}
          text={"Bạn chắc chắn muốn thêm giai đoạn?"}
          onConfirm={() => {
            setShowConfirmPopup(false);
            sendData();
          }}
          onDecline={() => {
            setShowConfirmPopup(false);
          }}
        ></ConfirmationPopup>
      )}
      {displaySuccessPopup && (
        <SuccessPopup
          isOpen={true}
          successPopupText={"Thêm giai đoạn thành công!"}
          onClose={onSuccessPopupClosed}
        />
      )}
    </div>
  );
};

export default AddMilestone;
