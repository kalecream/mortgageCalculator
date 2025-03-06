import DownloadPDF from "./DownloadPDF";

export const Footer = () => {
    return (
        <footer className="footer">
            <h1>Mortgage Calculator</h1>
            <div className="button-container">
                <DownloadPDF />
            </div>
            <p>
                Made by{" "}
                <a href="https://www.yunghigue.com/">Yung Higue</a> <br /> based
                on a spreadsheet from{" "}
                <a href="https://financialcentsibility.com/calculators/">
                    Financial Centsibility.
                </a>
            </p>
        </footer>
    );
};
