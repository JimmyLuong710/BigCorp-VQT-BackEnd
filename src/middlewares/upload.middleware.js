import formidable from "formidable";
import ApiError from "../config/error.config";
import { v4 as uuid } from "uuid";

const options = {
  uploadDir: `${__dirname}/../../uploads`,
  multiples: true,
  maxFieldsSize: 5 * 1024 * 1024,
  filename: function (name, ext, part, form) {
    return uuid() + "_" + new Date().getTime().toString() + "_" + part["originalFilename"];
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

    fields.images = files?.files?.map(file => file.newFilename);
    req.body = fields;
    next();
  });
};

module.exports = uploadMiddleware;


// {
//   files: [
//     PersistentFile {
//       _events: [Object: null prototype],
//       _eventsCount: 1,
//       _maxListeners: undefined,
//       lastModifiedDate: 2022-11-19T07:23:28.040Z,
//       filepath: 'C:\\Users\\ADMIN\\Desktop\\My Project Web\\bigcorp-backend\\uploads\\7e5103e1-9423-4bbb-925d-2e28ca514702_1668842608028_avatar.png',
//       newFilename: '7e5103e1-9423-4bbb-925d-2e28ca514702_1668842608028_avatar.png',
//       originalFilename: 'avatar.png',
//       mimetype: 'image/png',
//       hashAlgorithm: false,
//       size: 91582,
//       _writeStream: [WriteStream],
//       hash: null,
//       [Symbol(kCapture)]: false
//     },
//     PersistentFile {
//       _events: [Object: null prototype],
//       _eventsCount: 1,
//       _maxListeners: undefined,
//       lastModifiedDate: 2022-11-19T07:23:28.041Z,
//       filepath: 'C:\\Users\\ADMIN\\Desktop\\My Project Web\\bigcorp-backend\\uploads\\d2c18ac6-dc2b-4c54-b30d-e23ff1c6d45d_1668842608037_vinh.png',
//       newFilename: 'd2c18ac6-dc2b-4c54-b30d-e23ff1c6d45d_1668842608037_vinh.png',
//       originalFilename: 'vinh.png',
//       mimetype: 'image/png',
//       hashAlgorithm: false,
//       size: 12467,
//       _writeStream: [WriteStream],
//       hash: null,
//       [Symbol(kCapture)]: false
//     }
//   ]
// }