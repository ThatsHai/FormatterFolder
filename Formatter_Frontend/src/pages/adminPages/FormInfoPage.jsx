import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import api from "../../services/api";

const PageNumberFooter = ({
  totalPages = 1,
  maxPage = 3,
  onPageChange = () => {},
  currentPage = 0,
  setCurrentPage = () => {},
}) => {
  const goToPage = (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
      onPageChange(page);
    }
  };

  // Calculate the range of page numbers to show
  const startPage = Math.floor(currentPage / maxPage) * maxPage;
  const endPage = Math.min(startPage + maxPage, totalPages);

  return (
    <div className="w-full flex justify-center items-center gap-2 my-4">
      <button
        className="px-3 py-1 border rounded disabled:opacity-50"
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 0}
      >
        Trang trước
      </button>

      {Array.from({ length: endPage - startPage }, (_, index) => {
        const page = startPage + index;
        return (
          <button
            key={page}
            className={`px-3 py-1 border rounded ${
              currentPage === page ? "bg-blue-500 text-white" : ""
            }`}
            onClick={() => goToPage(page)}
          >
            {page + 1}
          </button>
        );
      })}

      <button
        className="px-3 py-1 border rounded disabled:opacity-50"
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
      >
        Trang sau
      </button>
    </div>
  );
};

const DesignsListWindow = ({
  isOpen = true,
  text = "Danh sách mẫu",
  form = {},
  onDecline = () => {},
}) => {
  const [designsList, setDesignsList] = useState();
  const [totalPages, setTotalPages] = useState();
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const fetchDesignsFromFormId = async () => {
      if (!form.formId) return;
      const result = await api.get(
        `/designs/search?formId=${form.formId}&n=3&p=${currentPage}`
      );
      setDesignsList(result.data.result.content);
      setTotalPages(result.data.result.totalPages);
    };
    fetchDesignsFromFormId();
  }, [form, currentPage]);

  const handleDownloadPDF = async (design) => {
    try {
      const response = await api.get(
        `/designs/${design.designId}/downloadPdf`,
        {
          responseType: "blob",
        }
      );
      console.log(response);
      const blob = new Blob([response.data], {
        type: "application/pdf",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      link.setAttribute("download", `${design.title}.pdf`);
      document.body.appendChild(link);
      link.click();

      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.log("File download failed: " + e);
    }
  };

  if (!isOpen) return null;
  if (!designsList) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      {/* Modal Box */}
      <div className="bg-white p-6 rounded-xl shadow-lg text-center max-w-sm w-full font-textFont relative">
        {/* X Button inside the modal box */}
        <button
          onClick={onDecline}
          className="absolute top-2 right-4 text-gray-500 hover:text-black font-bold text-lg"
        >
          X
        </button>

        <h2 className="text-lg font-semibold mb-4">{text}</h2>

        <div className="w-full justify-center items-center gap-5 min-h-[320px]">
          {designsList.map((design) => (
            <div key={design.designId} className="border px-2 rounded-md my-2">
              <p className="font-semibold text-left pt-1">{design.title}</p>
              <p className="text-left pb-1">
                {design.description || "Không có mô tả"}
              </p>
              <div className="flex justify-end">
                <button
                  className="text-white font-bold p-1 px-3 mb-2 rounded-md bg-lightBlue"
                  onClick={() => handleDownloadPDF(design)}
                >
                  Tải file PDF
                </button>
              </div>
            </div>
          ))}
        </div>

        <PageNumberFooter
          totalPages={totalPages}
          maxPage={3}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
};

const FormInfoPage = () => {
  const [form, setForm] = useState({});
  const [sortedFields, setSortedFields] = useState([]);
  const [openDesignsListWindow, setOpenDesignsListWindow] = useState(true);
  const { formId } = useParams();

  const closeDesignsListWindow = () => {
    setOpenDesignsListWindow(false);
  };

  const displayDesignsListWindow = () => {
    setOpenDesignsListWindow(true);
  };

  useEffect(() => {
    const fetchFormData = async () => {
      const result = await api.get(`/forms/${formId}`);
      setForm(() => result.data.result);
    };
    fetchFormData();
  }, [formId]);

  useEffect(() => {
    if (form.formFields) {
      setSortedFields(
        [...form.formFields].sort((a, b) => a.position - b.position)
      );
    }
  }, [form]);

  return (
    <div className="p-6">
      <Link to="/admin/forms">
        <p>{"< Quay lại"}</p>
      </Link>
      <div className="m-6 bg-lightGray p-6">
        <div className="bg-white rounded-md p-6 pb-0">
          <div className="relative text-start w-full font-textFont text-lg mb-8 ">
            <h1 className="text-4xl font-headerFont text-darkBlue font-bold text-center mb-6">
              {form.title}
            </h1>
            {form.introduction && (
              <div className="relative text-start w-full font-textFont text-lg">
                <h3 className="text-black font-semibold mb-2">Mô tả</h3>
                <p className="w-full">{form.introduction}</p>
              </div>
            )}
          </div>
          <div className=" rounded-lg font-textFont pb-6">
            <h2 className="text-lg font-bold mb-4">Trường dữ liệu</h2>

            {sortedFields.length === 0 ? (
              <p className="text-gray-500">Không có trường dữ liệu</p>
            ) : (
              <table className="min-w-full table-auto border-collapse border border-gray-200">
                <thead className="text-center">
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2">
                      Tên câu hỏi
                    </th>
                    <th className="border border-gray-300 px-4 py-2">Mô tả</th>
                    <th className="border border-gray-300 px-4 py-2">
                      Dạng câu hỏi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedFields.map(
                    ({ formFieldId, fieldName, description, formType }) => (
                      <tr key={formFieldId} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2">
                          {fieldName}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {description || (
                            <span className="italic text-gray-400">
                              Không có mô tả
                            </span>
                          )}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {formType || (
                            <span className="italic text-gray-400">
                              Chưa định nghĩa
                            </span>
                          )}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            )}
          </div>

          {sortedFields.length > 0 && (
            <div className="flex justify-end w-full text-lg">
              <Link to={`/admin/designs/${formId}`}>
                <button className="border px-4 py-1 my-2 mx-2 mb-4 rounded-md">
                  Tạo mẫu thiết kế
                </button>
              </Link>
              <button
                className="border px-4 py-1 my-2 ml-2 mb-4 rounded-md bg-lightBlue text-white hover:bg-blue-600"
                onClick={displayDesignsListWindow}
              >
                Download File
              </button>
            </div>
          )}
        </div>
      </div>

      {openDesignsListWindow && (
        <DesignsListWindow
          form={form}
          onDecline={closeDesignsListWindow}
        ></DesignsListWindow>
      )}
    </div>
  );
};

export default FormInfoPage;
