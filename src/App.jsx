console.clear();
import axios from "axios";
import { useState } from "react";
const baseApi = import.meta.env.VITE_BASE_URL;
const apiPath = import.meta.env.VITE_API_PATH;

function App() {
    const [isAuth, setIsAuth] = useState(false);
    const [account, setAccount] = useState({
        "username": "user@exapmle.com",
        "password": "example"
    });
    const [resErrMessage, setResErrMessage] = useState("");
    const [resMessage, setResMessage] = useState("");
    const [tempProduct, setTempProduct] = useState({});
    const [products, setProducts] = useState([]);

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
            // 解構是{} 不是[]
            const { token, expired } = res.data;
            // 存入cookie中，記得轉為日期格式
            document.cookie = `signInHexoToken = ${token}; expires = ${new Date(expired)}`;
            setIsAuth(true);
            // 將token帶入後，以後的請求，都會將token帶入header並傳送出去
            axios.defaults.headers.common['Authorization'] = token;

            // 抓取資料
            // 複製貼上時，在Vscode看到方框要將方框用刪掉，不然會有錯誤
            try {
                const res = await axios.get(`${baseApi}/v2/api/${apiPath}/admin/products`);
                setProducts(res.data.products);
            }
            catch (error) {
                console.error(error);
            }
        }
        catch (error) {
            setResErrMessage(error.response?.data?.message);
            console.error(error);
        }
    };

    const authSignIn = async (e) => {
        try {
            await axios.post(`${baseApi}/v2/api/user/check`);
            setResMessage('使用者您已登入成功');
        }
        catch (error) {
            console.error(error);
        }
    };
    return (
        <>
            {
                isAuth ? (<div className="container">
                    <div className="row mt-3">
                        <button className="btn btn-success mb-4" onClick={() => authSignIn()}>驗證登入</button>
                        {resMessage && (<p className="text-success text-center" >{resMessage}</p>)}
                        <div className="col-md-6">
                            <h2>產品列表</h2>
                            <table className="table text-center table-striped table-hover">
                                <thead>
                                    <tr>
                                        <th>產品名稱</th>
                                        <th>原價</th>
                                        <th>售價</th>
                                        <th>是否啟用</th>
                                        <th>查看細節</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((item) => (
                                        <tr key={item.id}>
                                            <td>{item.title}</td>
                                            <td>{item.origin_price}</td>
                                            <td>{item.price}</td>
                                            <td>{item.is_enabled ? "是" : "否"}</td>
                                            <td>
                                                <button
                                                    className="btn btn-primary"
                                                    onClick={() => setTempProduct(item)}
                                                >
                                                    查看細節
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="col-md-6">
                            <h2>單一產品細節</h2>
                            {tempProduct.title ? (
                                <div className="card mb-3">
                                    <img
                                        src={tempProduct.imageUrl}
                                        className="card-img-top primary-image"
                                        alt="主圖"
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title">
                                            {tempProduct.title}
                                            <span className="badge bg-primary ms-2">
                                                {tempProduct.category}
                                            </span>
                                        </h5>
                                        <p className="card-text">商品描述：{tempProduct.description}</p>
                                        <p className="card-text">商品內容：{tempProduct.content}</p>
                                        <div className="d-flex">
                                            <p className="card-text text-secondary">
                                                <del>{tempProduct.origin_price}</del>
                                            </p>
                                            元 / {tempProduct.price} 元
                                        </div>
                                        <h5 className="mt-3">更多圖片：</h5>
                                        <div className="d-flex flex-wrap">
                                            {tempProduct.imagesUrl?.map((item, index) => (
                                                <img
                                                    data-id={index}
                                                    src={item}
                                                    className="images"
                                                    alt="主圖"
                                                    style={{ objectFit: "cover", maxWidth: "300px" }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-secondary">請選擇一個商品查看</p>
                            )}
                        </div>
                    </div>
                </div>) :
                    (<div className="d-flex flex-column justify-content-center align-items-center vh-100">
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
                    </div>)
            }
        </>

    );
};


export default App;