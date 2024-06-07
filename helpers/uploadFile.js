const { extname } = require("path");
const { promisify } = require("util");

const uploadFile = async (file, object, property = "image") => {
  if (file && object && object.title) {
    const move = promisify(file.mv);
    if (file.mimetype.startsWith("image/")) {
      // Generate a shortened title without special symbols and spaces
      const shortenedTitle = object.title
        .replace(/[^\w\s]/gi, "")
        .substring(0, 12);

      const fileName =
        shortenedTitle.replace(/ /g, "-") +
        new Date().getTime().toString(36) +
        extname(file.name);
      await move("uploads/" + fileName);
      object[property] = fileName;
    }
  } else {
    throw new Error("Object or object.title is undefined");
  }

  return object; // Return the updated object
};

const uploadFilePdfDoc = async (file, object, property = "file") => {
  if (file && object && object.title) {
    const move = promisify(file.mv);
    const allowedMimeTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      // Generate a shortened title without special symbols and spaces
      const shortenedTitle = object.title
        .replace(/[^\w\s]/gi, "")
        .substring(0, 12);

      const fileName =
        shortenedTitle.replace(/ /g, "-") +
        new Date().getTime().toString(36) +
        extname(file.name);
      await move("uploads/files/" + fileName);
      object[property] = fileName;
    } else {
      throw new Error(
        "Invalid file type. Only PDF and DOC/DOCX files are allowed."
      );
    }
  } else {
    console.error("Object or object.title is undefined", { object, file });
    throw new Error("Object or object.title is undefined");
  }

  return object; // Return the updated object
};

module.exports = { uploadFile, uploadFilePdfDoc };
