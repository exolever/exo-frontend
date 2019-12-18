interface IconMimeInterface {
  icon: string;
  color: string;
  mimetypes: string[];
}

export const MIMES_GREY: IconMimeInterface = {
  icon: 'insert_drive_file',
  color: 'grey',
  mimetypes: [
    'text/plain',
    'application/javascript',
    'application/json',
    'application/x-7z-compressed',
    'application/zip'
  ]
};

export const MIMES_STATIC_DOCUMENT: IconMimeInterface = {
  icon: 'insert_drive_file',
  color: 'red',
  mimetypes: [
    'application/pdf',
  ]
};

export const MIMES_TMIMES_EDITORS: IconMimeInterface = {
  icon: 'insert_drive_file',
  color: 'blue',
  mimetypes: [
    'application/vnd.openxmlformats-officedocument',
    'application/vnd.openofficeorg',
    'application/vnd.oasis.opendocument.tmime',
  ]
};
export const MIMES_PRESENTATION: IconMimeInterface = {
  icon: 'insert_drive_file',
  color: 'amber',
  mimetypes: [
    'application/vnd.ms-excel',
    'application/vnd.oasis.opendocument.spreadsheet',
    'application/vnd.openxmlformats-officedocument.spreadsheetml',
    'application/vnd.openxmlformats-officedocument.presentationml',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ]
};

export const MIMES_LINK: IconMimeInterface = {
  icon: 'link',
  color: 'blue',
  mimetypes: [
    'text/html'
  ]
};

export const MIMES_IMAGE: IconMimeInterface = {
  icon: 'image',
  color: 'purple',
  mimetypes: [
    'image/jpeg',
    'image/gif',
    'image/png',
    'image/tiff',
    'video/jpeg',
    'video/mp4'
  ]
};
