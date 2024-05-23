<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="./assets/css/email.css">
    <title>Thông báo trúng tuyển</title>
</head>

<body>
    <div id="app">
        <div id="header">
            <div class="wrap">
                <table style="width:100%">
                    <tr>
                        <td class="wrap_nav_left" style="width:25%">
                            <div class="wrap_nav_left-logo">
                                <img src="https://caodanghanoi.edu.vn/wp-content/uploads/2023/05/icon.png" alt="logo hnc">
                            </div>
                            <div class="wrap_nav_left-title">
                                <p class="wrap_nav_left-title-hanoi">HANOI</p>
                                <P class="wrap_nav_left-title-college">COLLEGE</P>
                            </div>
                        </td>
                        <td class="wrap_nav_right" style="width:75%">
                            <div class="wrap_nav_right-top">
                                <p class="wrap_nav_right-top-bldtb">BỘ LAO ĐỘNG - THƯƠNG BINH VÀ XÃ HỘI</p>
                                <P class="wrap_nav_right-top-tcdhn">TRƯỜNG CAO ĐẲNG HÀ NỘI</P>
                            </div>

                            <div class="line"></div>

                            <div class="wrap_nav_right-bottom">
                                <p class="wrap_nav_right-bottom-gbkq">GIẤY BÁO KẾT QUẢ XÉT TUYỂN</p>
                                <P class="wrap_nav_right-bottom-hcd">(Hệ cao đẳng, trung cấp chính quy năm học 2024)</P>
                            </div>
                        </td>
                    </tr>
                </table>

            </div>
        </div>

        <div id="content">
            <div class="infomation_study">
                <div class="colfullname" style="margin-bottom: 10px;">Gửi Em: <span class="name" style="text-transform: uppercase">{{ $fullName }}</span></div>
                <div class="coldayofbirth" style="margin-bottom: 10px;">Sinh ngày: <span class="daymonthyear">{{ $ngaySinh }}</span></div>
                <div class="colgioitinh" style="margin-bottom: 10px;">Giới tính: <span class="gioitinh">{{ $gioiTinh }}</span></div>
                <div class="infomation_study-hktc" style="margin-bottom: 10px">Địa chỉ: <span class="hktc-study">{{ $diaChi }}</span></div>

            </div>

            <p class="rowhappy">Trường Cao đẳng Hà Nội (HNC) chúc mừng em đã đủ điều kiện trúng tuyển Hệ Cao đẳng chính quy vào ngành học:
                <span class="nganhhoc" style="text-transform: uppercase;color:red;font-weight: 700;">{{ $nganhHoc }}</span>
            </p>

            <div class="yeucaukhac">
                <p class="nguyenvongthaydoi"> Dựa trên kết quả xét tuyển hồ sơ đã đăng ký với Nhà trường,
                     nếu Em có nguyện vọng thay đổi chuyên ngành đã lựa chọn, em có thể truy cập
                     Website: https://caodanghanoi.edu.vn/ hoặc liên hệ với Thầy/Cô hướng dẫn để được hỗ trợ.
                      Vui lòng tham khảo các chuyên ngành nhà trường đang đào tạo dưới đây: </p>

                <div class="list_nganhhoc">
                    <table>
                        <thead>
                            <tr>
                                <th style="text-align: center"> KHỐI NGÀNH SỨC KHỎE</th>
                                <th style="text-align: center"> KHỐI NGÀNH NGOẠI NGỮ</th>

                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>+ Điều Dưỡng</td>
                                <td>+ Tiếng Hàn Quốc</td>
                            </tr>
                            <tr>
                                <td>+ Kỹ thuật phục hồi chức năng</td>
                                <td>+ Tiếng Trung</td>
                            </tr>
                            <tr>
                                <td>+ Dược</td>
                                <td>+ Tiếng Nhật</td>
                            </tr>
                            <tr>
                                <td>+ Y Sỹ Y học cổ truyền</td>
                                <td>+ Tiếng Anh</td>
                            </tr>

                        </tbody>
                    </table>
                </div>

                <div class="yeucau">
                    Để trở thành sinh viên hệ chính quy của Trường Cao đẳng Hà Nội,
                    em cần tốt nghiệp THPT hoặc hệ tương đương, đồng thời hoàn thành
                    thủ tục nhập học theo quy định của nhà trường. Mời em
                    <span class="time">7</span> giờ ngày <span class="day">22</span > tháng <span class="month">2</span> năm <span class="yaer">2023</span>
                    có mặt tại Nhà trường để làm thủ tục nhập học <span class="yeucau_timeword">(buổi sáng: 8h - 11h30; buổi chiều: 13h30 -17h00) </span>
                </div>

                <div class="diachi-truong">
                    <p class="diachi"> Địa chỉ: Trường Cao đẳng Hà Nội: Km3 + 350 đường Phan Trọng Tuệ, Thanh Trì, Hà Nội  </p>
                    <p class="luu_y">Xin vui lòng mang theo Giấy báo này khi đến nhập học (học sinh xem Hướng dẫn thủ tục ở mặt sau)</p>
                </div>

                <p class="chian">Một lần nữa xin chúc mừng và chào đón em tại Trường Cao đẳng Hà Nội</p>

                <table style="width: 100%;">
                    <tbody>
                        <tr>
                            <td class="table-mobile__left" ></td>
                            <td class="table-mobile__right" >
                                <table class="tb_xacnhan">
                                    <tbody>
                                        <tr>
                                            <td style="text-align: center; border: none; color: #128080;">Hà Nội, Ngày
                                                <span class="day"><?php echo date("d"); ?></span> tháng
                                                <span class="month"><?php echo date("m"); ?></span> năm
                                                <span class="year"><?php echo date("Y"); ?></span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="text-align: center; border: none; color: #128080; font-weight: 700;">CHỦ TỊCH HỘI ĐỒNG TUYỂN SINH</td>
                                        </tr>
                                        <tr>
                                            <td style="text-align: center; border: none; color: #128080;">Đã ký</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>

            </div>
        </div>

        <div id="footer">
            <h4 class="footer_title">Hướng dẫn thủ tục nhập học</h4>
            <div class="footer_hsnh">
                <h4 class="footer_hsnh-title">1. HỒ SƠ NHẬP HỌC</h4>
                <div class="footer_hsnh-content">
                    <div class="footer_hsnh-left">
                        <p class="footer_hsnh-item">+ Giấy báo kết quả xét tuyển</p>
                        <p class="footer_hsnh-item">+ Bản sao công chứng CCCD (02 bản)</p>
                        <p class="footer_hsnh-item"> + Bản sao công chứng giấy khai sinh (01 bản)</p>
                        <p class="footer_hsnh-item"> + Bản sao công chứng bằng tốt nghiệp trung học phổ thông</p>
                        <p class="footer_hsnh-item">+ Giấy chứng nhận tốt nghiệp tạm thời (2024)</p>
                        <p class="footer_hsnh-item">+ Bản sao công chứng Học bạ THPT</p>
                    </div>

                    <div class="footer_hsnh-right">
                        <p class="footer_hsnh-item">+ Lý lịch sinh viên (có xác nhận của địa phương)</p>
                        <p class="footer_hsnh-item"> + Giấy khám sức khỏe</p>
                        <p class="footer_hsnh-item"> + Ảnh 3x4cm (2 cái)</p>
                        <p class="footer_hsnh-item">+ Giấy di chuyển nghĩa vụ quân sự (đối với nam)</p>
                        <p class="footer_hsnh-item"> + Giấy di chuyển sinh hoạt Đoàn (sổ Đoàn), Đảng (nếu có)</p>
                    </div>
                </div>
            </div>

            <div class="footer_prices">
                <h4 class="footer_prices-title">2. CÁC KHOẢN KINH PHÍ KHI NHẬP HỌC</h4>
                <div class="footer_price-hocphi">
                    <p class="footer_price-hocphi-title">2.1. Học phí:</p>
                    <div class="footer_price-hocphi-noidung">
                        <p class="footer-item">+ Khối ngành ngoại ngữ (Tiếng hàn, Tiếng nhật, Tiếng Trung, Tiếng Anh): 8.750.000đ/1 học kỳ</p>
                        <p class="footer-item">+ Khối ngành Sức Khỏe (Điều dưỡng, Kỹ thuật PHCN, Dược, Y sỹ Y học cổ truyền): 9.250.000đ/1 học kỳ</p>
                        <p class="footer-item">+ Sinh viên Hệ Cao đẳng  học 3 năm (6 kỳ); Hệ Trung cấp học 2 năm (4 kỳ).</p>
                    </div>
                </div>

                <div class="footer_price-fisrt-year">
                    <p class="footer_price-fisrt-year-title">2.2. Các khoản thu đầu năm:</p>
                    <div class="footer_price-fisrt-year-noidung">
                        <p class="footer-item">+ Lệ phí xét tuyển vào nhập học: 170.000đ</p>
                        <p class="footer-item">+ Thẻ (tích hợp thẻ từ xe, thẻ ra vào trường): 150.000đ</p>
                        <p class="footer-item">+ Đoàn phí: 180.000 (Hệ cao đẳng), 120.000đ (Hệ trung cấp)</p>
                    </div>

                    <div class="footer_price-fisrt-year-luu-y">
                        <ul class="footer_price-fisrt-year-luu-y-content">
                            <li class="luu_y-price">
                                Lưu ý:
                            </li>
                            <li class="item"> Sinh viên hoàn thành các nghĩa vụ tài chính trên 1 lần khi làm thủ tục nhập học.</li>
                            <li class="item">Sinh viên nhập học sớm để thuận lợi cho việc đăng ký ở ký túc xá, tìm nhà trọ (Nhà trường hỗ trợ).</li>
                            <li class="item">Tuần sinh hoạt công dân bắt đầu vào: Ngày <span class="day">22</span > tháng <span class="month">2 </span> năm <span class="yaer">2023</span></li>
                        </ul>
                    </div>
                </div>

                <div class="footer_thongtin-chuy">
                    <p class="thongtin_row-1">
                        Sinh viên được chuyển đổi ngành học theo nguyện vọng khi đến nhập học;
                         Đươc tham gia chương trình học bổng học chuyển tiếp sang các trường đại
                         học tại Đài Loan với 100% học bổng năm đầu tiên tại các trường đại học
                          tại Đài Loan;Được tham gia chương trình việc làm  - định cư tại Australia
                          . Áp dụng cho sinh viên đang tham gia học các chuyên ngành sau của trường;
                        Điều dưỡng, Kỹ thuật Phục hồi chức năng... với thu nhập 100 triệu/tháng.
                    </p>
                    <p class="thongtin_row-2">
                        Nhà trường trao học bổng cho học sinh có điểm xét tuyển đầu vào cao, trong
                         quá trình học sinh viên xết loại giỏi và rèn luyện tốt bằng quỹ học bổng của nhà trường.
                          Các sinh viên khối chuyên ngành sức khỏe tốt nghiệp loại giỏi hoặc xuất sắc, sẽ tạo điều
                          kiện học tập và bố trí việc làm tại cơ sở khám chữa bệnh của Trường tại Hà Nội và được tạo điều
                           kiện nếu học lên đại học khi có nguyện vọng và theo quy định. Chi tiết về khung chương trình đào tạo,
                        tổng số tín chỉ sinh viên tham khảo cuốn: Sổ tay sinh viên và Website: https://caodanghanoi.edu.vn/
                    </p>

                    <p class="thongtin_chuy"><span class="thongtin_chuy-red">*</span><span class="thongtin_chuy-title">Lưu ý: </span>Giấy báo
                         kết quả xét tuyển này không có giá trị để làm thủ tục di chuyển nghĩa vụ quân sự,
                         sinh viên nam sau khi hoàn thành thủ tục nhập học sẽ được cấp giấy tờ hợp lệ để làm thủ tục tại địa phương.</p>
                </div>


            </div>

        </div>
    </div>
</body>

</html>
