const DisabledField = ({
  VNTitle = "Tựa Việt",
  ENTitle = "English Title",
  formData = {},
}) => {
  return (
    <div className="w-full grid grid-cols-3 items-center mb-3">
      <p>{VNTitle}</p>
      <select
        className="col-span-2 bg-gray rounded-md px-4 py-1 appearance-none"
        disabled
      >
        <option>{formData[ENTitle]}</option>
      </select>
    </div>
  );
};

export default DisabledField;
