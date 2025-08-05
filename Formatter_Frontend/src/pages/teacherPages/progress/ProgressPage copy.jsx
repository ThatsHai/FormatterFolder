import { useEffect, useState } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import api from "../../../services/api";

const ProgressPage = () => {
  const [progress, setProgress] = useState(null);
  const [milestones, setMilestones] = useState([]);
  useEffect(() => {
    const fetchProgress = async () => {
      const result = await api.get(
        `/progresses/29c660fd-70e8-4c36-aa12-cc916057614d`
      );
      setProgress(result.data.result || "");
      setMilestones(result.data.result.milestones || []);
    };
    fetchProgress();
  }, []);
  const currentPhaseIndex = milestones.findIndex((milestone) =>
    milestone.tasks?.some((task) => !task.completed)
  );

  return (
    <div className="bg-lightGray m-5 p-6 rounded-md">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow mt-10">
        <h2 className="text-center text-xl font-bold text-blue-700 mb-6">
          {progress?.formRecord?.topic?.title || "Tên đề tài"}
        </h2>

        {/* Tiến độ */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">1. Tiến độ</h3>
          <div className="flex items-center justify-between max-w-md mx-auto">
            {milestones
              .slice()
              .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
              .map((milestone, index) => (
                <div key={milestone.id} className="flex items-center gap-1">
                  {index < currentPhaseIndex ? (
                    <CheckCircleIcon className="text-green-500" />
                  ) : index === currentPhaseIndex ? (
                    <div className="w-6 h-6 rounded-full border-2 border-green-500 bg-white" />
                  ) : (
                    <RadioButtonUncheckedIcon className="text-gray-400" />
                  )}
                  <span className="text-sm">{milestone.name}</span>
                  {index < milestones.length - 1 && (
                    <div className="w-6 h-1 bg-gray-300 rounded-full mx-2"></div>
                  )}
                </div>
              ))}
          </div>
        </div>

        {/* Công việc */}
        <div>
          <h3 className="font-semibold mb-2">2. Công việc</h3>
          {milestones
            .slice()
            .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
            .map((milestone, i) => (
              <div key={milestone.id} className="border p-4 mb-3 rounded-md">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{milestone.name}</span>
                  <span className="text-sm text-gray-600">
                    Hoàn thành{" "}
                    {milestone.tasks?.filter((t) => t.completed).length}/
                    {milestone.tasks?.length}
                  </span>
                </div>

                {milestone.tasks && milestone.tasks.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {milestone.tasks.map((task, idx) => (
                      <div
                        key={task.id}
                        className="bg-gray-100 p-2 rounded flex justify-between items-center"
                      >
                        <div>
                          <p className="text-sm">{task.name}</p>
                          {task.completedDate ? (
                            <p className="text-xs text-gray-500">
                              Hoàn tất {task.completedDate}
                            </p>
                          ) : (
                            <p className="text-xs text-red">Chưa hoàn tất</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {!task.completed && (
                            <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">
                              Hoàn tất
                            </span>
                          )}
                          <button>
                            <DeleteIcon
                              fontSize="small"
                              className="text-red-500"
                            />
                          </button>
                        </div>
                      </div>
                    ))}
                    <button className="mt-2 text-blue-600 text-sm flex items-center gap-1">
                      <AddIcon fontSize="small" /> Thêm công việc
                    </button>
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;
