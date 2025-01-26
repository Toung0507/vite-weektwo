console.clear();
import axios from "axios";
import { useState } from "react";

function App() {

    const baseApi = import.meta.env.VITE_BASE_URL;
    const apiPath = import.meta.env.VITE_API_PATH;

    const [account, setAccount] = useState({
        "username": "example@test.com",
        "password": "example"
    });
    const [resErrMessage, setResErrMessage] = useState("");


    const handleInputChange = (e) => {
        const { value, name } = e.target; // 解構的方式去找出對應的值
        setAccount({
            ...account, // 要把原先資料抓進來，不然會每次都只其中一個的資料
            [name]: value
            // [name]: 等同於 username: 或 password:
        });
    }

    const handleSingIn = async (e) => {
        e.preventDefault(); // 可用此方式將預設行為取消掉，讓使用者可以直接按enter就可進入，不限制只透過按鈕點選
        try {
            const res = await axios.post(`${baseApi}/v2/admin/signin`, account);
        }
        catch (error) {
            setResErrMessage(error.response?.data?.message);
        }
    };

    return (
        <div className="d-flex flex-column justify-content-center align-items-center vh-100">
            <h2 className="mb-4">請先登入</h2>
            <form onSubmit={handleSingIn}>
                {/* 通常form會把送出時的資料放在form裡面，而不是用一按鈕去做觸發 */}
                <div className="form-group">
                    <label htmlFor="exampleInputEmail2">電子郵件</label>
                    <input
                        name="username"
                        value={account.username}
                        type="email"
                        className="form-control"
                        id="exampleInputEmail2"
                        placeholder="請輸入信箱"
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group my-3">
                    <label htmlFor="exampleInputPassword2">密碼</label>
                    <input
                        name="password"
                        value={account.password}
                        type="password"
                        className="form-control"
                        id="exampleInputPassword2"
                        placeholder="請輸入密碼"
                        onChange={handleInputChange}
                    />
                </div>
                {resErrMessage && (<p className="text-danger" >{resErrMessage}</p>)}
                <button className="btn btn-success" >
                    登入
                </button>
            </form>
        </div>
    );
};


export default App;