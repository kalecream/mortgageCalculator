import Form from "./components/form";
import { Analytics } from "@vercel/analytics/react";
import "./styles/global.scss";

function App() {
    return (
        <main>
            <Analytics />
            <Form />
        </main>
    );
}

export default App;
