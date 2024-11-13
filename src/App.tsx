import {Liquidity} from "./pages/Liquidity";
import {Swap} from "./pages/Swap";
import {Suspense} from "react";
import {HashRouter, Route, Routes,} from "react-router-dom";
import {ToastContainer, Zoom} from "react-toastify";
function App() {
    return (
        <Suspense>
            <HashRouter>
                <Routes>
                    <Route path={'/'} element={<Swap/>}/>
                    <Route path={'/liquidity'} element={<Liquidity/>}/>
                </Routes>
                <ToastContainer transition={Zoom} theme={"dark"}/>
            </HashRouter>
        </Suspense>
    )
}

export default App
