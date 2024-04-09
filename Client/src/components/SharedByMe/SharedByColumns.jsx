// columns.js
import { formatFileSize } from "@/lib/utils";

export const columns = [
   {
      header: 'File Name',
      accessor: (file) => file.fileName,
   },
   {
      header: 'Size',
      accessor: (file) => formatFileSize(file.size),
   },
   {
      header: 'Date',
      accessor: (file) => new Date(file.date * 1000).toLocaleDateString(),
   },
];
