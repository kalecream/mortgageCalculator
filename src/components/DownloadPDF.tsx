import React from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

interface DownloadPDFProps {
    fileName?: string;
}

const DownloadPDF: React.FC<DownloadPDFProps> = ({
    fileName = `MortgageCalculator.pdf`,
}) => {
    const handleDownloadPDF = async () => {
        try {
            const element = document.getElementById('root');

            if (!element) {
                return;
            }

            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
            });

            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4"); 
            const imgWidth = 210;
            const imgHeight = (canvas.height * imgWidth) / canvas.width; 
            pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
            pdf.save(fileName);
        } catch (error) {
            console.error("Error generating PDF:", error);
        }
    };

    return (
        <button
            onClick={handleDownloadPDF}
        >
            Download
        </button>
    );
};

export default DownloadPDF;
