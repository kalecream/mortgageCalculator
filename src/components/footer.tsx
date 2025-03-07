import DownloadPDF from "./DownloadPDF";

export const Footer = () => {
    return (
        <footer className="footer">
            <DownloadPDF />
            <p>
                Made by <a href="https://www.yunghigue.com/">Yung Higue</a>{" "}
                based on a spreadsheet from{" "}
                <a href="https://financialcentsibility.com/calculators/">
                    Financial Centsibility.
                </a>
            </p>
        </footer>
    );
};
