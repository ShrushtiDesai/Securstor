// columns.js

export const columns = [
   {
      header: 'File Name',
      accessor: (file) => file.fileName,
   },
   {
      header: 'Size',
      accessor: (file) => `${file.size}kb`,
   },
   {
      header: 'Date',
      accessor: (file) => new Date(file.date * 1000).toLocaleDateString(),
   },
];
