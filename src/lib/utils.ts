import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const downloadPdf = async (element: HTMLElement | string, fileName: string) => {
  const jsPDF = (await import('jspdf')).default;
  const html2canvas = (await import('html2canvas')).default;

  const input = typeof element === 'string' ? document.getElementById(element) : element;
  
  if (input) {
    return html2canvas(input, { scale: 2, useCORS: true, allowTaint: true, backgroundColor: '#ffffff' }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const ratio = canvasWidth / canvasHeight;
      let width = pdfWidth;
      let height = width / ratio;

      if (height > pdfHeight) {
          height = pdfHeight;
          width = height * ratio;
      }
      
      const x = (pdfWidth - width) / 2;

      pdf.addImage(imgData, 'PNG', x, 0, width, height);
      pdf.save(fileName);
    });
  }
  return Promise.reject("Element not found");
};
