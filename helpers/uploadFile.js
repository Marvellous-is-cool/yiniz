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

const uploadFilePdf = async (file, object, property = "pdf") => {
  if (file && object && object.title) {
    const move = promisify(file.mv);
    if (file.mimetype.startsWith("application/pdf")) {
      // Generate a shortened title without special symbols and spaces
      const shortenedTitle = object.title
        .replace(/[^\w\s]/gi, "")
        .substring(0, 12);

      const fileName =
        shortenedTitle.replace(/ /g, "-") +
        new Date().getTime().toString(36) +
        extname(file.name);
      await move("uploads/pdfs/" + fileName);
      object[property] = fileName;
    }
  } else {
    console.error("Object or object.title is undefined", { object, file });
    throw new Error("Object or object.title is undefined");
  }

  return object; // Return the updated object
};

module.exports = { uploadFile, uploadFilePdf };
