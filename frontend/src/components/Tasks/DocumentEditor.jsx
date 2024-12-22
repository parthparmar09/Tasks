import React, { useEffect, useState } from "react";
import { Box, Button, CircularProgress } from "@mui/material";
import { toast } from "react-hot-toast";
import Quill from "quill";
import mammoth from "mammoth";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import axios from "axios";

const DocumentEditor = ({ documentUrl, onSave }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [editor, setEditor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize Quill editor
    setTimeout(() => {
      const quill = new Quill("#editor", {
        theme: "snow",
        modules: {
          toolbar: [
            [{ header: "1" }, { header: "2" }, { header: "3" }, { font: [] }],
            [{ size: [] }],
            [{ align: [] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["blockquote", "code-block"],
            ["color", "background"],
            ["clean"],
            ["table"],
          ],
        },
      });
      setEditor(quill);
    }, 500);
  }, []);

  const loadDocument = async () => {
    try {
      const response = await axios.get(documentUrl, {
        responseType: "arraybuffer",
      });
      const buffer = response.data;
      const htmlContent = await convertDocxToHtml(buffer);
      if (editor) {
        editor.root.innerHTML = htmlContent;
      }
      setIsLoading(false);
    } catch (error) {
      toast.error("Error loading the document.");
      setIsLoading(false);
    }
  };

  // Convert .docx file (arraybuffer) to HTML using Mammoth
  const convertDocxToHtml = (buffer) => {
    return new Promise((resolve, reject) => {
      mammoth
        .convertToHtml({ arrayBuffer: buffer })
        .then((result) => resolve(result.value))
        .catch((error) => reject(error));
    });
  };

  // Save the edited document and send it back to the server
  const handleSave = async () => {
    if (!editor) return;
    setIsSaving(true);
    try {
      const htmlContent = editor.root.innerHTML;
      const docxBuffer = await convertHtmlToDocx(htmlContent);
      await onSave(docxBuffer); // Call the onSave function passed as prop to update the document on the server
      toast.success("Document saved successfully!");
    } catch (error) {
      toast.error("Error saving document.");
    } finally {
      setIsSaving(false);
    }
  };

  // Convert the HTML content to .docx using Docxtemplater
  const convertHtmlToDocx = (htmlContent) => {
    const zip = new PizZip();
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    // Add the HTML content into the document
    doc.setData({
      content: htmlContent,
    });

    try {
      doc.render();
    } catch (error) {
      throw new Error("Error rendering document template");
    }

    const out = doc.getZip().generate({ type: "blob" });
    return out;
  };

  useEffect(() => {
    if (documentUrl) {
      loadDocument();
    }
  }, [documentUrl]);

  if (isLoading) return <CircularProgress />;

  return <Box id="editor" sx={{ minHeight: "200px" }}></Box>;
};

export default DocumentEditor;
