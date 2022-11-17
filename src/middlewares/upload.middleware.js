import formidable from "formidable";
import ApiError from "../config/error.config";

const options = {
  uploadDir: `${__dirname}/../../uploads`,
  //   multiple: true,
  maxFieldsSize: 5 * 1024 * 1024,
  filename: function (name, ext, part, form) {
    return part.originalFilename;
  },
  filter: function ({ name, originalFilename, mimetype }) {
    // keep only images
    return mimetype && mimetype.includes("image");
  },
};

const uploadMiddleware = (req, res, next) => {
  const form = formidable(options);

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.log(err);
      next(new ApiError(500, "Failed to upload file"));
      return;
    }

    fields.image = files?.file?.newFilename;
    req.body = fields;
    req.file = files?.file;
    next();
  });
};

module.exports = uploadMiddleware;
