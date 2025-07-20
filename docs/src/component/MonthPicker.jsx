import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import dayjs from "dayjs";
import "react-datepicker/dist/react-datepicker.css";

const MonthPicker = ({
  label = "Tháng bắt đầu",
  field = "implementationTime", // key trong formData
  value = "",
  onChange,
  error = "",
}) => {
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    if (value) {
      const parsed = dayjs(value, "MM/YYYY");
      setSelectedDate(parsed.isValid() ? parsed.toDate() : null);
    }
  }, [value]);

  const handleChange = (date) => {
    const formatted = dayjs(date).format("MM/YYYY");
    setSelectedDate(date);
    onChange(field, formatted);
  };

  const injectMonthNumbers = () => {
    setTimeout(() => {
      document
        .querySelectorAll(".react-datepicker__month-text")
        .forEach((el, i) => {
          el.textContent = (i + 1).toString().padStart(2, "0");
        });
    }, 10);
  };
  return (
    <div className="relative w-full my-8 m-8 px-10 text-lg font-textFont">
      <p className=" font-semibold text-lg opacity-80 py-2">{label}</p>
      <div className="relative w-full">
        <DatePicker
          selected={selectedDate}
          onChange={handleChange}
          dateFormat="MM/yyyy"
          showMonthYearPicker
          showFullMonthYearPicker
          onCalendarOpen={injectMonthNumbers}
          placeholderText="Chọn tháng/năm"
          minDate={new Date()} // Không cho chọn ngày trong quá khứ
          className="text-xl w-full outline-none bg-transparent border-b border-darkBlue py-2"
        />
      </div>
      {error && <p className="text-redError pt-2">{error}</p>}
    </div>
  );
};

MonthPicker.propTypes = {
  label: PropTypes.string,
  field: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
};

export default MonthPicker;
