export const Footer = () => {
  return (
    <footer className="footer">
      <div className="button-container">
        <button>Download PDF</button>
      <button>Settings</button>
      </div>
      <p>
        Based on the spreadsheet found at{" "}
        <a href="https://financialcentsibility.com/calculators/">
          Financial Centsibility
        </a>
      </p>
      <p>
        Made with ☕ by{" "}
        <a href="https://www.sabrinamedwinter.com/">Sabrina Medwinter</a>
      </p>
      <p> Disclaimer: This calculator is not afflicated with any of the named parties on this page. </p>
    </footer>
  );
};
