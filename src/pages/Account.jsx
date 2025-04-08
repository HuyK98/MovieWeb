import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Account.css";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import { useLanguage } from "../pages/LanguageContext";

const Account = () => {
    const { language } = useLanguage();
    const navigate = useNavigate();

    const [user, setUser] = useState({
        name: "",
        email: "",
        phone: "",
        cmnd: "",
        dob: "",
        gender: "",
        city: "",
        district: "",
        address: "",
        avatar: "",
    });

    const [searchTerm, setSearchTerm] = useState("");
    const [darkMode, setDarkMode] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [image, setImage] = useState(null);

    const texts = {
        vi: {
            account: "THÔNG TIN TÀI KHOẢN",
            fullName: "* Họ tên:",
            email: "* Email:",
            phone: "* Số điện thoại:",
            idCard: "* CMND/Hộ chiếu:",
            dob: "* Ngày sinh:",
            gender: "Giới tính:",
            city: "Tỉnh/Thành phố:",
            district: "Quận/Huyện:",
            address: "Địa chỉ:",
            updateButton: "Cập nhật",
            changePassword: "Đổi mật khẩu?",
            male: "Nam",
            female: "Nữ",
            other: "Khác",
            change: "Thay đổi",
            save: "Lưu ảnh",
        },
        en: {
            account: "ACCOUNT INFORMATION",
            fullName: "* Full Name:",
            email: "* Email:",
            phone: "* Phone Number:",
            idCard: "* ID Card/Passport:",
            dob: "* Date of Birth:",
            gender: "Gender:",
            city: "City/Province:",
            district: "District:",
            address: "Address:",
            updateButton: "Update",
            changePassword: "Change Password?",
            male: "Male",
            female: "Female",
            other: "Other",
            change: "Change",
            save: "Save Image",
        },
    };

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (!userInfo) {
            navigate("/login");
        } else {
            setUser(userInfo);
        }
    }, [navigate]);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setUser((prevUser) => ({ ...prevUser, [name]: value }));
    };

    const [previewAvatar, setPreviewAvatar] = useState(null);
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                alert("Ảnh quá lớn, vui lòng chọn ảnh dưới 2MB.");
                return;
            }
            setImage(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setUser((prevUser) => ({ ...prevUser, avatar: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpdate = async () => {
        try {
            // Lấy thông tin userInfo từ localStorage, bao gồm token
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const token = userInfo?.token;  

            if (!token) {
                alert("Bạn cần đăng nhập lại.");
                navigate("/login");
                return;
            }

            let formData = new FormData();
            Object.keys(user).forEach((key) => {
                if (user[key]) formData.append(key, user[key]);
            });

            if (image) formData.append("avatar", image);

            const response = await axios.put("http://localhost:5000/api/users/profile", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });

            // Kết hợp dữ liệu mới từ server với token hiện tại
            const updatedUserInfo = {
            ...userInfo,
            ...user, // Giữ nguyên các giá trị cũ, bao gồm token
            ...response.data.user, // Ghi đè các giá trị mới từ server
        };

            // Cập nhật localStorage và state user
            localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));
            setUser({ ...user, ...response.data.user });

            alert("Cập nhật thông tin thành công!");
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Cập nhật thất bại, vui lòng thử lại!";
            alert(errorMessage);
        }
    };

    const handleSearchChange = (e) => setSearchTerm(e.target.value);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.body.classList.toggle("dark-mode", !darkMode);
    };

    const handleLogout = () => {
        localStorage.removeItem("userInfo");
        setUser(null);
        navigate("/");
    };
    

    return (
        <div className={`home-container ${darkMode ? "dark-mode" : ""}`}>
            <Header
                user={user}
                handleLogout={handleLogout}
                searchTerm={searchTerm}
                handleSearchChange={handleSearchChange}
                isScrolled={isScrolled}
            />
            <main>
                <div className="account-container">
                    <h2>{texts[language].account}</h2>
                    <div className="avatar-section">
                        <div className="avatar-container">
                        <img src={user?.avatar || '/default-avatar.png'}  alt="Avatar" className="avatar-image" />
                            <div className="avatar-buttons">
                                <label htmlFor="avatar-input" className="change-avatar-button">{texts[language].change}</label>
                                <input
                                    type="file"
                                    id="avatar-input"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    style={{ display: "none" }}
                                />
                                <button className="save-avatar-button" onClick={handleUpdate}>{texts[language].save}</button>
                            </div>
                        </div>
                    </div>
                    <div className="account-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label>{texts[language].fullName}</label>
                                <input type="text" name="name" value={user?.name ?? ""} onChange={handleInputChange} />
                            </div>
                            <div className="form-group">
                                <label>{texts[language].email}</label>
                                <input type="email" value={user?.email ?? ""} readOnly />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>{texts[language].phone}</label>
                                <input type="tel" name="phone" value={user?.phone ?? ""} onChange={handleInputChange} />
                            </div>
                            <div className="form-group">
                                <label>{texts[language].idCard}</label>
                                <input type="text" name="cmnd" value={user?.cmnd ?? ""} onChange={handleInputChange} />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>{texts[language].dob}</label>
                                <input
                                    type="date"
                                    name="dob"
                                    value={user?.dob ? new Date(user.dob).toISOString().split("T")[0] : ""}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>{texts[language].gender}</label>
                                <select name="gender" value={user?.gender ?? ""} onChange={handleInputChange}>
                                    <option value="">{texts[language].gender}</option>
                                    <option value="male">{texts[language].male}</option>
                                    <option value="female">{texts[language].female}</option>
                                    <option value="other">{texts[language].other}</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>{texts[language].address}</label>
                            <textarea name="address" value={user?.address ?? ""} onChange={handleInputChange} />
                        </div>

                        <button className="update-button" onClick={handleUpdate}>{texts[language].updateButton}</button>
                        <p className="change-password">{texts[language].changePassword}</p>
                    </div>
                </div>
            </main>
            <Footer toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
        </div>
    );
};

export default Account;