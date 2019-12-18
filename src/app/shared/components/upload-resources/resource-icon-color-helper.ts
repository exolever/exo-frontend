import {
  MIMES_GREY, MIMES_IMAGE, MIMES_LINK, MIMES_PRESENTATION,
  MIMES_STATIC_DOCUMENT, MIMES_TMIMES_EDITORS
} from './mime-types';

/**
 * retrieve the proper icon and color to display for each mimetype
 * @param mimetype
 */
export function getResourceIconAndColor(mimetype: string): { color: string, icon: string } {
  // all registered mimes listed
  const extToCheck = [
    MIMES_GREY, MIMES_STATIC_DOCUMENT, MIMES_TMIMES_EDITORS, MIMES_PRESENTATION, MIMES_LINK, MIMES_IMAGE
  ];
  let color = 'default';
  let icon = 'insert_drive_file';

  // check if our mimetype os contained in our list and return the proper icon
  extToCheck.forEach(item => {
    if (item.mimetypes.includes(mimetype)) {
      color = item.color;
      icon = item.icon;
    }
  });
  return { color: color, icon: icon };
}
