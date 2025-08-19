import { useState, useEffect } from "react";
import NumberInput from "../../component/NumberInput";
import PageNumberFooter from "../../component/PageNumberFooter";
import PropTypes from "prop-types";
import api from "../../services/api";
import { IconButton } from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import InputMask from "react-input-mask";
import { Tooltip } from "@mui/material";
import { useRef } from "react";
import useBootstrapUser from "../../hook/useBootstrapUser";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

const CouncilTeachersInput = ({
  value = ["", "", ""],
  onChange,
  onTeacherDataChange,
}) => {
  const [teacherData, setTeacherData] = useState([null, null, null]);

  const handleInputChange = (index, val) => {
    const updated = [...value];
    updated[index] = val;
    onChange(updated);
  };

  const prevValueRef = useRef();

  useEffect(() => {
    const isSame =
      JSON.stringify(prevValueRef.current) === JSON.stringify(value);
    if (isSame) return;

    prevValueRef.current = value;

    const handler = setTimeout(() => {
      const fetchTeachers = async () => {
        try {
          const response = await api.post("/teachers/getListId", value);
          if (response.data?.result) {
            setTeacherData(response.data.result);
            onTeacherDataChange?.(response.data.result);
          }
        } catch (err) {
          console.error("Error fetching teachers", err);
        }
      };
      fetchTeachers();
    }, 1000);

    return () => clearTimeout(handler);
  }, [value]);

  return (
    <div className="space-y-1">
      {value.map((nameOrId, index) => (
        <Tooltip
          key={index}
          title={
            teacherData[index]
              ? `${teacherData[index].name} - ${teacherData[index].department?.departmentName}`
              : "Không tìm thấy giáo viên"
          }
          arrow
        >
          <input
            type="text"
            className={`border px-1 py-0.5 w-full rounded-md 
              ${nameOrId.trim() && teacherData[index] ? "border-green-500" : ""}
            `}
            placeholder={`Giáo viên ${index + 1} (ID)`}
            value={nameOrId}
            onChange={(e) => handleInputChange(index, e.target.value)}
          />
        </Tooltip>
      ))}
    </div>
  );
};

const EachTeacherTopics = ({ teacher }) => {
  const [expanded, setExpanded] = useState(true);
  const [edits, setEdits] = useState({});

  const handleEditChange = (formRecordId, field, value) => {
    setEdits((prev) => ({
      ...prev,
      [formRecordId]: {
        ...prev[formRecordId],
        [field]: value,
      },
    }));
  };

  const handleCouncilTeachersChange = (recordId, updatedIds) => {
    handleEditChange(recordId, "councilTeachers", updatedIds);
  };

  const handleCouncilTeachersDataChange = (recordId, fetchedData) => {
    handleEditChange(recordId, "councilTeachersData", fetchedData);
  };

  const validateEdits = (edit) => {
    const { councilTeachers, date, time, room } = edit;

    // At least one teacher ID must be filled
    if (
      !Array.isArray(councilTeachers) ||
      councilTeachers.filter((id) => id && id.trim() !== "").length === 0
    ) {
      return { valid: false, reason: "Vui lòng nhập đầy đủ thông tin." };
    }

    // Date format check dd/mm/yyyy
    if (!date || !/^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
      return { valid: false, reason: "Thời gian không hợp lệ" };
    }
    const [day, month, year] = date.split("/").map(Number);
    const dateObj = new Date(year, month - 1, day);
    if (
      dateObj.getFullYear() !== year ||
      dateObj.getMonth() + 1 !== month ||
      dateObj.getDate() !== day
    ) {
      return { valid: false, reason: "Thời gian không hợp lệ" };
    }

    // Time format check hh:mm (24-hour)
    if (!time || !/^\d{2}:\d{2}$/.test(time)) {
      return { valid: false, reason: "Thời gian không hợp lệ" };
    }
    const [hour, minute] = time.split(":").map(Number);
    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
      return { valid: false, reason: "Thời gian không hợp lệ" };
    }

    // Room check
    if (!room || room.trim() === "") {
      return { valid: false, reason: "Vui lòng nhập đầy đủ thông tin." };
    }

    return { valid: true };
  };

  const handleSave = async (formRecordId) => {
    const edit = edits[formRecordId];
    if (!edit) return;
    if (
      edit.councilTeachers?.some(
        (id, i) => id.trim() !== "" && !edit.councilTeachersData?.[i]
      )
    ) {
      alert("Có giáo viên không tồn tại. Vui lòng kiểm tra lại ID.");
      return;
    }

    const { valid, reason } = validateEdits(edit);
    if (!valid) {
      alert(reason);
      return;
    }

    const [day, month, year] = edit.date.split("/");
    const isoString = new Date(
      `${year}-${month}-${day}T${edit.time}:00`
    ).toISOString();

    const payload = [
      {
        // stt: (index + 1).toString().padStart(2, "0"),
        formRecordId,
        teacherIds: edit.councilTeachers?.filter((t) => t.trim() !== "") || [],
        startTime: isoString,
        place: edit.room || "",
      },
    ];

    console.log("Payload to send:", payload);
    const response = await api.post("/defenseSchedules", payload);
    console.log(response);
  };

  return (
    <div>
      <div className="flex items-center">
        <p className="text-xl font-semibold">
          {teacher.teacherName} - {teacher.userId}
        </p>
        <IconButton onClick={() => setExpanded(!expanded)}>
          {expanded ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </div>

      {expanded &&
        teacher.formRecordSchedules &&
        teacher.formRecordSchedules.length > 0 && (
          <div>
            <table className="table-auto border-collapse border border-lightGray w-full mt-2">
              <thead>
                <tr>
                  <th className="border p-2 bg-lightBlue text-white border-black">
                    Tên đề tài
                  </th>
                  <th className="border p-2 bg-lightBlue text-white border-black">
                    Tên sinh viên
                  </th>
                  <th className="border p-2 bg-lightBlue text-white border-black">
                    Cán bộ hội đồng
                  </th>
                  <th className="border p-2 bg-lightBlue text-white border-black">
                    Thời gian
                  </th>
                  <th className="border p-2 bg-lightBlue text-white border-black">
                    Địa điểm
                  </th>
                  <th className="border p-2 bg-lightBlue text-white border-black min-w-20">
                    Lưu
                  </th>
                </tr>
              </thead>
              <tbody>
                {teacher.formRecordSchedules.map((record, index) => {
                  const recordId = record.formRecordId;
                  const defense = record.defenseSchedule || {};
                  const localEdit = edits[recordId] || {};

                  const showInputCouncil =
                    !defense.councilTeachers ||
                    defense.councilTeachers.length === 0;
                  const showInputTime = !defense.time;
                  const showInputRoom = !defense.room;

                  return (
                    <tr key={index}>
                      <td className="border p-2">{record.topicName}</td>
                      <td className="border p-2">{record.studentName}</td>

                      {/* Cán bộ hội đồng */}
                      <td className="border p-2">
                        {showInputCouncil ? (
                          <CouncilTeachersInput
                            value={localEdit.councilTeachers || ["", "", ""]}
                            onChange={(updated) =>
                              handleCouncilTeachersChange(recordId, updated)
                            }
                            onTeacherDataChange={(data) =>
                              handleCouncilTeachersDataChange(recordId, data)
                            }
                          />
                        ) : (
                          <ul className="list-disc pl-4">
                            {defense.councilTeachers?.map((teacher, idx) => (
                              <li key={idx}>{teacher.teacherNames}</li>
                            ))}
                          </ul>
                        )}
                      </td>

                      {/* Thời gian */}
                      <td className="border p-2">
                        {showInputTime ? (
                          <div className="flex gap-1">
                            {/* Date input */}
                            <InputMask
                              mask="99/99/9999"
                              placeholder="DD/MM/YYYY"
                              value={localEdit.date || ""}
                              onChange={(e) =>
                                handleEditChange(
                                  recordId,
                                  "date",
                                  e.target.value
                                )
                              }
                              className="border px-1 py-0.5 w-[110px] rounded-md"
                            />

                            {/* Time input */}
                            <InputMask
                              mask="99:99"
                              placeholder="HH:MM"
                              value={localEdit.time || ""}
                              onChange={(e) =>
                                handleEditChange(
                                  recordId,
                                  "time",
                                  e.target.value
                                )
                              }
                              className="border px-1 py-0.5 w-[80px] rounded-md"
                            />
                          </div>
                        ) : (
                          (() => {
                            const d = new Date(defense.time);
                            const pad = (n) => n.toString().padStart(2, "0");
                            return `${pad(d.getDate())}/${pad(
                              d.getMonth() + 1
                            )}/${d.getFullYear()} ${pad(d.getHours())}:${pad(
                              d.getMinutes()
                            )}`;
                          })()
                        )}
                      </td>

                      {/* Địa điểm */}
                      <td className="border p-2">
                        {showInputRoom ? (
                          <input
                            type="text"
                            className="border px-1 py-0.5 w-full rounded-md"
                            placeholder="Nhập địa điểm"
                            value={localEdit.room || ""}
                            onChange={(e) =>
                              handleEditChange(recordId, "room", e.target.value)
                            }
                          />
                        ) : (
                          defense.room
                        )}
                      </td>

                      {/* Lưu */}
                      <td className="border p-2 text-center">
                        {edits[recordId] && (
                          <button
                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                            onClick={() => handleSave(recordId)}
                          >
                            Lưu
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
    </div>
  );
};

const QueryFields = ({
  semester,
  schoolYear,
  setSemester,
  setSchoolYear,
  handleSearch,
}) => {
  const semesters = ["HK1", "HK2", "HK3"];

  const handleSemesterChange = (e) => {
    setSemester(e.target.value);
    // handleQueryCriteria(e);
  };

  const handleSchoolYearChange = (e) => {
    setSchoolYear(e.target.value);
    // handleQueryCriteria(e);
  };

  return (
    <div>
      <div className="flex justify-center w-full ">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 py-4 rounded-md mb-2">
          {/* School Year Input */}
          <div className="flex flex-col px-8 md:col-span-1">
            <label className="font-semibold mb-1">Năm học</label>
            <NumberInput
              min={2000}
              max={2300}
              name="schoolYear"
              placeholder="2025"
              className="border px-2 py-1 rounded-md"
              value={schoolYear}
              onChange={handleSchoolYearChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSearch();
                }
              }}
            />
          </div>

          {/* Semester Select */}
          <div className="flex flex-col px-8 md:col-span-2">
            <label className="font-semibold mb-1">Học kỳ</label>
            <select
              name="semester"
              className="border px-2 py-1 rounded-md"
              value={semester}
              onChange={handleSemesterChange}
            >
              {semesters.map((s, index) => (
                <option key={index} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          {/* Search Button */}
          <div className="md:col-span-5 flex justify-end mr-8 ">
            <button
              type="button"
              className="bg-darkBlue text-white px-4 py-1 rounded-md shadow-md"
              onClick={handleSearch}
            >
              Tìm kiếm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ArrangeCalendar = () => {
  //Query params
  const [semester, setSemester] = useState("HK3");
  const [schoolYear, setSchoolYear] = useState(new Date().getFullYear());

  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [teachers, setTeachers] = useState([]);

  const handleSearch = async () => {
    if (schoolYear) {
      try {
        const formRecordsResult = await api.get(
          `/formRecords/teacher/group?semester=${semester}&year=${schoolYear}&p=${currentPage}&n=5`
        );

        setTotalPages(formRecordsResult.data.result.totalPages);

        const groupedTeachers = formRecordsResult.data.result.content;
        const allFormRecordIds = groupedTeachers
          .flatMap((teacher) =>
            teacher.formRecordSchedules?.map((fr) => fr.formRecordId)
          )
          .filter(Boolean); // remove undefined/null

        // Then, fetch the defense schedules using POST
        const defenseScheduleResult = await api.post(
          `/defenseSchedules/getByFormRecordIds`,
          allFormRecordIds
        );

        const enrichedData = groupedTeachers.map((teacher) => {
          const updatedFormRecordSchedules = teacher.formRecordSchedules.map(
            (formRecord) => {
              const defenseInfo = defenseScheduleResult.data.result.find(
                (d) => d.formRecord?.formRecordId === formRecord.formRecordId
              );

              return {
                ...formRecord,
                defenseSchedule: defenseInfo || null,
              };
            }
          );
          return {
            ...teacher,
            formRecordSchedules: updatedFormRecordSchedules,
          };
        });
        setTeachers(enrichedData);
        // console.log(teachers);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    }
  };

  useEffect(() => {
    handleSearch();
  }, [currentPage]);

  const { loading } = useBootstrapUser(); // hydrates redux on mount
  const userData = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  if (loading) return null;
  if (userData.role.name !== "ADMIN") {
    navigate("/notFound");
  }

  return (
    <div className="flex justify-center mb-6">
      <div className="w-3/4 border-lightBlue rounded-md border mx-1 p-2 font-textFont px-6">
        <h2 className="border-b border-b-darkBlue text-xl font-medium ">
          Xếp lịch bảo vệ đề tài
        </h2>
        <QueryFields
          semester={semester}
          setSemester={setSemester}
          schoolYear={schoolYear}
          setSchoolYear={setSchoolYear}
          handleSearch={handleSearch}
        ></QueryFields>
        {teachers && teachers.length > 0 ? (
          teachers.map((teacher) => (
            <EachTeacherTopics teacher={teacher} key={teacher.userId} />
          ))
        ) : (
          <p>Dữ liệu trống</p>
        )}

        <PageNumberFooter
          totalPages={totalPages}
          maxPage={5}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        ></PageNumberFooter>
      </div>
    </div>
  );
};

export default ArrangeCalendar;

QueryFields.propTypes = {
  semester: PropTypes.string,
  schoolYear: PropTypes.number,
  setSemester: PropTypes.func,
  setSchoolYear: PropTypes.func,
  handleQueryCriteria: PropTypes.func,
  handleSearch: PropTypes.func,
};

EachTeacherTopics.propTypes = {
  teacher: PropTypes.object,
};
