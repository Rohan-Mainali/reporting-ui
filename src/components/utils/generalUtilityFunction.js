export const convertFileSizeToHumanReadable = (size) => {
  const fileSizeInBytes = size
  const fileSizeInKB = fileSizeInBytes / 1024;
  const fileSizeInMB = fileSizeInKB / 1024;
  const fileSizeInGB = fileSizeInMB / 1024;
  let displaySize;
  if (fileSizeInGB >= 1) {
    displaySize = fileSizeInGB.toFixed(2) + ' GB';
  } else if (fileSizeInMB >= 1) {
    displaySize = fileSizeInMB.toFixed(2) + ' MB';
  } else if (fileSizeInKB >= 1) {
    displaySize = fileSizeInKB.toFixed(2) + ' KB';
  } else {
    displaySize = fileSizeInBytes + ' bytes';
  }
  return displaySize;
}
