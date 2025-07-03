import { useEffect, useRef, useState } from "react";
import React from "react";

const MAX_PAGE_HEIGHT = 600; // px

const FormRecordFieldsPaginated = ({
  formRecordFields,
  externalPage = 0,
  onTotalPageChange = () => {},
  forceRerenderOnPageChange,
}) => {
  const containerRef = useRef(null);
  const [pages, setPages] = useState([]);
  const fieldRefs = useRef([]);

  useEffect(() => {
    // Tạo ref cho mỗi field
    fieldRefs.current = formRecordFields.map(
      (_, i) => fieldRefs.current[i] ?? React.createRef()
    );
  }, [formRecordFields]);

  useEffect(() => {
    const buildPages = () => {
      const newPages = [];
      let currentGroup = [];
      let currentHeight = 0;

      formRecordFields.forEach((field, i) => {
        const el = fieldRefs.current[i]?.current;
        if (!el) return;

        const height = el.getBoundingClientRect().height;

        if (currentHeight + height <= MAX_PAGE_HEIGHT) {
          currentGroup.push(field);
          currentHeight += height;
        } else {
          newPages.push(currentGroup);
          currentGroup = [field];
          currentHeight = height;
        }
      });

      if (currentGroup.length > 0) {
        newPages.push(currentGroup);
      }

      setPages(newPages);
      onTotalPageChange(newPages.length);
    };

    // Delay nhẹ để đảm bảo DOM được render trước khi đo
    setTimeout(buildPages, 0);
  }, [formRecordFields, forceRerenderOnPageChange]);

  return (
    <div
      ref={containerRef}
      className="relative min-h-[300px] max-h-[600px] border p-4 bg-white rounded shadow"
    >
      {pages.length > 0 &&
        pages[externalPage]?.map((field) => (
          <div
            key={field.formRecordFieldId}
            ref={
              fieldRefs.current.find(
                (_, idx) =>
                  formRecordFields[idx].formRecordFieldId ===
                  field.formRecordFieldId
              )
            }
            className="mb-3"
          >
            <p className="font-medium">
              {field.formField?.label || "Trường không rõ"}:
            </p>
            <div
              className="pl-4"
              dangerouslySetInnerHTML={{ __html: field.value }}
            />
          </div>
        ))}
    </div>
  );
};

export default FormRecordFieldsPaginated;
