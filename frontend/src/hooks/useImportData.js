import { useState, useEffect, useCallback } from "react";
import * as XLSX from "xlsx";
import axios from "../axiosInstance";

export const FIELDS = [
  { key: "name",    label: "Name",    required: true  },
  { key: "email",   label: "Email",   required: true  },
  { key: "gender",  label: "Gender",  required: false },
  { key: "contact", label: "Contact", required: false },
  { key: "country", label: "Country", required: false },
  { key: "state",   label: "State",   required: false },
  { key: "city",    label: "City",    required: false },
  { key: "address", label: "Address", required: false },
];

const useImportData = (onSuccess) => {
  const [file,    setFile]    = useState(null);
  const [headers, setHeaders] = useState([]);
  const [rows,    setRows]    = useState([]);
  const [mapping, setMapping] = useState({});
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);

  const getAllErrors = useCallback((currentMapping = mapping) => {
    const errs = {};
    rows.forEach((row, i) => {
      const rowErrs = [];
      FIELDS.forEach((f) => {
        const col = currentMapping[f.key];
        const val = col ? (row[col] ?? "").toString().trim() : "";

        if (f.required && col && !val)
          rowErrs.push(`${f.label} is required`);

        if (f.key === "email" && val && !/\S+@\S+\.\S+/.test(val))
          rowErrs.push("Invalid email format");

        if (f.key === "contact" && val && !/^\d{10}$/.test(val))
          rowErrs.push("Contact must be 10 digits");

        if (f.key === "gender" && val && !["male", "female"].includes(val.toLowerCase()))
          rowErrs.push(`Invalid gender "${val}"`);
      });
      if (rowErrs.length) errs[i] = rowErrs;
    });
    setErrors(errs);
    return errs;
  }, [rows, mapping]);

  useEffect(() => {
    if (rows.length > 0) getAllErrors();
  }, [rows, mapping, getAllErrors]);

  const parseExcel = (selectedFile) => {
    if (!selectedFile) {
      setFile(null);
      setHeaders([]);
      setRows([]);
      setMapping({});
      setErrors({});
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const wb   = XLSX.read(data, { type: "array" });
      const ws   = wb.Sheets[wb.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(ws);

      if (!json || json.length === 0) {
        alert("Excel file is empty or has no data rows.");
        return;
      }

      setHeaders(Object.keys(json[0]));
      setRows(json);
      setFile(selectedFile);
      setMapping({});
      setErrors({});
    };
    reader.readAsArrayBuffer(selectedFile);
  };

  const setFieldMapping = (fieldKey, colName) => {
    setMapping((prev) => ({ ...prev, [fieldKey]: colName }));
  };

  const allFieldsMapped = FIELDS.every((f) => mapping[f.key]);

  const requiredFieldsMapped = FIELDS
    .filter((f) => f.required)
    .every((f) => mapping[f.key]);

  const importData = async () => {
    if (!allFieldsMapped) {
      alert("Please map all fields before importing.");
      return;
    }

    const errs = getAllErrors();
    if (Object.keys(errs).length > 0) {
      alert("Please fix all errors before importing.");
      return;
    }
    if (rows.length === 0) {
      alert("No data to import.");
      return;
    }

    setLoading(true);
    try {
      const userItem = localStorage.getItem("user");
      const user     = JSON.parse(userItem || "{}");
      const ownerId  = user?.id;

      if (!ownerId) {
        alert("Session expired. Please log in again.");
        setLoading(false);
        return;
      }

      const users = rows.map((row) => {
        const u = { ownerId };
        FIELDS.forEach((f) => {
          const val = (row[mapping[f.key]] ?? "").toString().trim();
          u[f.key] = f.key === "gender" ? val.toLowerCase() : val;
        });
        return u;
      });

      await axios.post("/users/import", { users });
      onSuccess && onSuccess();
      parseExcel(null);
      alert("Import successful!");
    } catch (err) {
      alert(err.response?.data?.message || "Import failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return {
    file,
    headers,
    rows,
    mapping,
    errors,
    loading,
    allFieldsMapped,
    requiredFieldsMapped,
    parseExcel,
    setFieldMapping,
    getAllErrors,
    importData,
    FIELDS,
  };
};

export default useImportData;



















// import { useState } from "react";
// import * as XLSX from "xlsx";
// import axios from "../axiosInstance";

// export const FIELDS = [
//   { key: "name",    label: "Name",    required: true  },
//   { key: "email",   label: "Email",   required: true  },
//   { key: "gender",  label: "Gender",  required: false },
//   { key: "contact", label: "Contact", required: false },
//   { key: "country", label: "Country", required: false },
//   { key: "state",   label: "State",   required: false },
//   { key: "city",    label: "City",    required: false },
//   { key: "address", label: "Address", required: false },
// ];

// const useImportData = (onSuccess) => {
//   const [file,    setFile]    = useState(null);
//   const [headers, setHeaders] = useState([]);
//   const [rows,    setRows]    = useState([]);
//   const [mapping, setMapping] = useState({});
//   const [errors,  setErrors]  = useState({});
//   const [loading, setLoading] = useState(false);

//   const parseExcel = (selectedFile) => {
//     if (!selectedFile) {
//       setFile(null);
//       setHeaders([]);
//       setRows([]);
//       setMapping({});
//       setErrors({});
//       return;
//     }

//     const reader = new FileReader();
//     reader.onload = (e) => {
//       const data = new Uint8Array(e.target.result);
//       const wb   = XLSX.read(data, { type: "array" });
//       const ws   = wb.Sheets[wb.SheetNames[0]];
//       const json = XLSX.utils.sheet_to_json(ws);

//       if (!json || json.length === 0) {
//         alert("Excel file is empty or has no data rows. Make sure Row 1 has headers.");
//         return;
//       }

//       setHeaders(Object.keys(json[0]));
//       setRows(json);
//       setFile(selectedFile);
//       setMapping({});  
//       setErrors({});
//     };
//     reader.readAsArrayBuffer(selectedFile);
//   };

//   const setFieldMapping = (fieldKey, colName) => {
//     setMapping((prev) => ({ ...prev, [fieldKey]: colName }));
//   };

//   const getAllErrors = () => {
//     const errs = {};
//     rows.forEach((row, i) => {
//       const rowErrs = [];
//       FIELDS.forEach((f) => {
//         const val = (row[mapping[f.key]] ?? "").toString().trim();

//         if (f.required && !val)
//           rowErrs.push(`${f.label} is required`);

//         if (f.key === "email" && val && !/\S+@\S+\.\S+/.test(val))
//           rowErrs.push("Invalid email format");

//         if (f.key === "contact" && val && !/^\d{10}$/.test(val))
//           rowErrs.push("Contact must be 10 digits");

//         if (f.key === "gender" && val && !["male", "female"].includes(val.toLowerCase()))
//           rowErrs.push(`Invalid gender "${val}"`);
//       });
//       if (rowErrs.length) errs[i] = rowErrs;
//     });
//     setErrors(errs);
//     return errs;
//   };

//   const importData = async () => {
//     const errs = getAllErrors();
//     if (Object.keys(errs).length > 0) {
//       alert("Please fix all errors before importing.");
//       return;
//     }
//     if (rows.length === 0) {
//       alert("No data to import.");
//       return;
//     }

//     setLoading(true);
//     try {
//       const users = rows.map((row) => {
//         const user = { ownerId: JSON.parse(localStorage.getItem("user")).id };
//         FIELDS.forEach((f) => {
//           user[f.key] = (row[mapping[f.key]] ?? "").toString().trim();
//         });
//         return user;
//       });

//       await axios.post("/users/import", { users });
//       onSuccess && onSuccess();
//       parseExcel(null);
//       alert("Import successful!");
//     } catch (err) {
//       alert(err.response?.data?.message || "Import failed. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return {
//     file,
//     headers,
//     rows,
//     mapping,
//     errors,
//     loading,
//     parseExcel,
//     setFieldMapping,
//     getAllErrors,
//     importData,
//     FIELDS,
//   };
// };

// export default useImportData;