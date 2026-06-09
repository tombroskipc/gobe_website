PRAGMA foreign_keys = ON;

-- Remove the earlier placeholder job that used the old article slug and incomplete fields.
DELETE FROM careers_responsibilities WHERE _parent_id IN (SELECT id FROM careers WHERE slug = 'tuyen-dung-marketing-google-ads-full-time');
DELETE FROM careers_requirements WHERE _parent_id IN (SELECT id FROM careers WHERE slug = 'tuyen-dung-marketing-google-ads-full-time');
DELETE FROM careers_benefits WHERE _parent_id IN (SELECT id FROM careers WHERE slug = 'tuyen-dung-marketing-google-ads-full-time');
DELETE FROM careers WHERE slug = 'tuyen-dung-marketing-google-ads-full-time';

INSERT INTO careers (title, slug, status, tag, published_at, date_label, department, employment_type, location, quantity, excerpt, lark_url, apply_url, description, working_time, notes, _status)
VALUES
('Marketing Google Ads Toàn thời gian', 'marketing-google-ads', 'published', 'marketing', '2025-12-08T00:00:00.000Z', '08 Th12', 'Marketing hiệu suất', 'Toàn thời gian', 'St Moritz, 1014 Đường Phạm Văn Đồng, TP. Hồ Chí Minh', '01', 'Tối ưu chiến dịch Google Ads, đọc tín hiệu thị trường và scale sản phẩm e-commerce quốc tế.', 'https://gobe.asia/tuyen-dung-marketing-google-ads-full-time/', 'mailto:tuyendung@gobe.asia?subject=%5BGOBEYOND%20-%20MARKETING%20GOOGLE%20ADS%5D%20Ho%20va%20ten', 'Vai trò dành cho người thích test nhanh, đo dữ liệu rõ ràng và tối ưu tăng trưởng theo hiệu suất.', '8:00-17:30, từ thứ 2 đến thứ 6, thứ 7 remote. Nghỉ trưa: 12:00-13:30.', 'Seed từ website cũ gobe.asia/tuyen-dung/', 'published'),
('Marketing Facebook Ads Toàn thời gian', 'marketing-facebook-ads', 'published', 'marketing', '2025-12-08T00:00:00.000Z', '08 Th12', 'Marketing hiệu suất', 'Toàn thời gian', 'St Moritz, 1014 Đường Phạm Văn Đồng, TP. Hồ Chí Minh', '01', 'Triển khai, phân tích và scale chiến dịch Facebook Ads cho thị trường quốc tế.', 'https://gobe.asia/tuyen-dung-marketing-facebook-ads-full-time/', 'mailto:tuyendung@gobe.asia?subject=%5BGOBEYOND%20-%20MARKETING%20FACEBOOK%20ADS%5D%20Ho%20va%20ten', 'Bạn sẽ phối hợp với creative và vận hành để tìm angle bán hàng, tối ưu funnel và cải thiện hiệu quả quảng cáo.', '8:00-17:30, từ thứ 2 đến thứ 6, thứ 7 remote. Nghỉ trưa: 12:00-13:30.', 'Seed từ website cũ gobe.asia/tuyen-dung/', 'published'),
('Sáng tạo Video', 'creative-video', 'published', 'creative', '2025-12-08T00:00:00.000Z', '08 Th12', 'Sáng tạo', 'Toàn thời gian', 'St Moritz, 1014 Đường Phạm Văn Đồng, TP. Hồ Chí Minh', '01', 'Sản xuất video ngắn, visual angle và nội dung sáng tạo phục vụ chiến dịch e-commerce.', 'https://gobe.asia/tuyen-dung-creative-video-full-time/', 'mailto:tuyendung@gobe.asia?subject=%5BGOBEYOND%20-%20CREATIVE%20VIDEO%5D%20Ho%20va%20ten', 'Vai trò dành cho người có mắt nhìn visual, biết biến insight thành video ngắn có khả năng tạo chuyển đổi.', '8:00-17:30, từ thứ 2 đến thứ 6, thứ 7 remote. Nghỉ trưa: 12:00-13:30.', 'Seed từ website cũ gobe.asia/tuyen-dung/', 'published'),
('Chăm sóc khách hàng Toàn thời gian', 'customer-service', 'published', 'customerService', '2025-01-05T00:00:00.000Z', '05 Th1', 'Chăm sóc khách hàng', 'Toàn thời gian', 'St Moritz, 1014 Đường Phạm Văn Đồng, TP. Hồ Chí Minh', '01', 'Chăm sóc khách hàng, xử lý phản hồi và phối hợp vận hành để trải nghiệm mua hàng mượt mà.', 'https://gobe.asia/tuyen-dung-customer-service-full-time/', 'mailto:tuyendung@gobe.asia?subject=%5BGOBEYOND%20-%20CUSTOMER%20SERVICE%5D%20Ho%20va%20ten', 'Vị trí kết nối trực tiếp với khách hàng và team vận hành để xử lý phản hồi nhanh, rõ ràng, đúng quy trình.', '8:00-17:30, từ thứ 2 đến thứ 6, thứ 7 remote. Nghỉ trưa: 12:00-13:30.', 'Seed từ website cũ gobe.asia/tuyen-dung/', 'published'),
('Nhân sự Toàn thời gian', 'human-resource', 'published', 'humanResource', '2025-08-29T00:00:00.000Z', '29 Th8', 'Nhân sự', 'Toàn thời gian', 'St Moritz, 1014 Đường Phạm Văn Đồng, TP. Hồ Chí Minh', '01', 'Tuyển dụng, phát triển con người và xây dựng văn hóa vận hành chủ động trong đội ngũ.', 'https://gobe.asia/tuyen-dung-human-resource/', 'mailto:tuyendung@gobe.asia?subject=%5BGOBEYOND%20-%20HUMAN%20RESOURCE%5D%20Ho%20va%20ten', 'Vai trò hỗ trợ tuyển dụng, trải nghiệm nhân sự và văn hóa nội bộ trong môi trường tăng trưởng nhanh.', '8:00-17:30, từ thứ 2 đến thứ 6, thứ 7 remote. Nghỉ trưa: 12:00-13:30.', 'Seed từ website cũ gobe.asia/tuyen-dung/', 'published'),
('Fulfillment Toàn thời gian', 'fulfillment-full-time', 'published', 'operations', '2025-04-21T00:00:00.000Z', '21 Th4', 'Vận hành', 'Toàn thời gian', 'St Moritz, 1014 Đường Phạm Văn Đồng, TP. Hồ Chí Minh', '02', 'Quản lý đơn hàng, điều phối supplier, logistics và theo dõi vận hành từ lúc nhận đơn đến khi giao thành công.', 'https://gobe.asia/tuyen-dung-fulfillment-full-time-3/', 'mailto:tuyendung@gobe.asia?subject=%5BGOBEYOND%20-%20FULFILLMENT%20FULL-TIME%5D%20Ho%20va%20ten', 'GoBeyond đang tìm kiếm nhân viên Fulfillment tài năng và nhiệt huyết để gia nhập đội ngũ vận hành e-commerce toàn cầu.', '8:00-17:30, từ thứ 2 đến thứ 6, thứ 7 remote. Nghỉ trưa: 12:00-13:30.', 'Seed từ website cũ gobe.asia/tuyen-dung/', 'published'),
('Thực tập Vận hành sàn Etsy', 'van-hanh-san-etsy-intern', 'published', 'internship', '2025-04-21T00:00:00.000Z', '21 Th4', 'Vận hành marketplace', 'Thực tập', 'St Moritz, 1014 Đường Phạm Văn Đồng, TP. Hồ Chí Minh', '01', 'Thực tập vận hành sàn Etsy, hỗ trợ listing, tracking và quy trình xử lý dữ liệu sản phẩm.', 'https://gobe.asia/3250-2/', 'mailto:tuyendung@gobe.asia?subject=%5BGOBEYOND%20-%20ETSY%20OPERATIONS%20INTERN%5D%20Ho%20va%20ten', 'Vị trí thực tập dành cho người muốn học cách vận hành marketplace, xử lý listing và hỗ trợ dữ liệu sản phẩm.', '8:00-17:30, từ thứ 2 đến thứ 6, thứ 7 remote. Nghỉ trưa: 12:00-13:30.', 'Seed từ website cũ gobe.asia/tuyen-dung/', 'published')
ON CONFLICT(slug) DO UPDATE SET
  title = excluded.title,
  status = excluded.status,
  tag = excluded.tag,
  published_at = excluded.published_at,
  date_label = excluded.date_label,
  department = excluded.department,
  employment_type = excluded.employment_type,
  location = excluded.location,
  quantity = excluded.quantity,
  excerpt = excluded.excerpt,
  lark_url = excluded.lark_url,
  apply_url = excluded.apply_url,
  description = excluded.description,
  working_time = excluded.working_time,
  notes = excluded.notes,
  _status = excluded._status,
  updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now');

DELETE FROM careers_responsibilities WHERE _parent_id IN (SELECT id FROM careers WHERE slug IN ('marketing-google-ads','marketing-facebook-ads','creative-video','customer-service','human-resource','fulfillment-full-time','van-hanh-san-etsy-intern'));
DELETE FROM careers_requirements WHERE _parent_id IN (SELECT id FROM careers WHERE slug IN ('marketing-google-ads','marketing-facebook-ads','creative-video','customer-service','human-resource','fulfillment-full-time','van-hanh-san-etsy-intern'));
DELETE FROM careers_benefits WHERE _parent_id IN (SELECT id FROM careers WHERE slug IN ('marketing-google-ads','marketing-facebook-ads','creative-video','customer-service','human-resource','fulfillment-full-time','van-hanh-san-etsy-intern'));

INSERT INTO careers_responsibilities (_order, _parent_id, id, text)
SELECT 0, id, 'seed-resp-' || slug || '-1', 'Theo dõi mục tiêu vị trí và biến kế hoạch thành kết quả thực tế theo từng tuần.' FROM careers WHERE slug IN ('marketing-google-ads','marketing-facebook-ads','creative-video','customer-service','human-resource','fulfillment-full-time','van-hanh-san-etsy-intern')
UNION ALL SELECT 1, id, 'seed-resp-' || slug || '-2', 'Phối hợp với các team liên quan để vận hành chiến dịch e-commerce quốc tế.' FROM careers WHERE slug IN ('marketing-google-ads','marketing-facebook-ads','creative-video','customer-service','human-resource','fulfillment-full-time','van-hanh-san-etsy-intern')
UNION ALL SELECT 2, id, 'seed-resp-' || slug || '-3', 'Chủ động phân tích dữ liệu, phát hiện vấn đề và đề xuất cách tối ưu.' FROM careers WHERE slug IN ('marketing-google-ads','marketing-facebook-ads','creative-video','customer-service','human-resource','fulfillment-full-time','van-hanh-san-etsy-intern');

INSERT INTO careers_requirements (_order, _parent_id, id, text)
SELECT 0, id, 'seed-req-' || slug || '-1', 'Có tư duy ownership, giao tiếp rõ ràng và thích môi trường tăng trưởng nhanh.' FROM careers WHERE slug IN ('marketing-google-ads','marketing-facebook-ads','creative-video','customer-service','human-resource','fulfillment-full-time','van-hanh-san-etsy-intern')
UNION ALL SELECT 1, id, 'seed-req-' || slug || '-2', 'Biết ưu tiên công việc, theo sát deadline và phối hợp tốt với đồng đội.' FROM careers WHERE slug IN ('marketing-google-ads','marketing-facebook-ads','creative-video','customer-service','human-resource','fulfillment-full-time','van-hanh-san-etsy-intern')
UNION ALL SELECT 2, id, 'seed-req-' || slug || '-3', 'Kinh nghiệm liên quan đến e-commerce, POD hoặc marketplace là lợi thế.' FROM careers WHERE slug IN ('marketing-google-ads','marketing-facebook-ads','creative-video','customer-service','human-resource','fulfillment-full-time','van-hanh-san-etsy-intern');

INSERT INTO careers_benefits (_order, _parent_id, id, text)
SELECT 0, id, 'seed-benefit-' || slug || '-1', 'Môi trường trẻ, tốc độ cao và nhiều cơ hội học từ các bài toán scale thật.' FROM careers WHERE slug IN ('marketing-google-ads','marketing-facebook-ads','creative-video','customer-service','human-resource','fulfillment-full-time','van-hanh-san-etsy-intern')
UNION ALL SELECT 1, id, 'seed-benefit-' || slug || '-2', 'Được tham gia hệ thống e-commerce toàn cầu với quy trình và công cụ rõ ràng.' FROM careers WHERE slug IN ('marketing-google-ads','marketing-facebook-ads','creative-video','customer-service','human-resource','fulfillment-full-time','van-hanh-san-etsy-intern')
UNION ALL SELECT 2, id, 'seed-benefit-' || slug || '-3', 'Review hiệu suất định kỳ, lương thưởng theo năng lực và hoạt động nội bộ.' FROM careers WHERE slug IN ('marketing-google-ads','marketing-facebook-ads','creative-video','customer-service','human-resource','fulfillment-full-time','van-hanh-san-etsy-intern');

INSERT INTO news (title, slug, status, tag, template, published_at, excerpt, notes, _status)
VALUES
('Lì xì khai xuân 2026 - Khởi đầu rực rỡ cùng Go Beyond', 'li-xi-khai-xuan-2026-khoi-dau-ruc-ro-cung-go-beyond', 'published', 'news', 'companyUpdate', '2026-02-24T00:00:00.000Z', 'GoBeyond mở đầu năm mới bằng tinh thần hứng khởi, lời chúc may mắn và năng lượng tích cực dành cho toàn đội ngũ.', 'Seed từ website cũ: https://gobe.asia/chuyen-muc/tin-tuc/', 'published'),
('Đội ngũ Go Beyond chính thức cán mốc $100K sau 3 tháng', 'doi-ngu-beyond-chinh-thuc-can-moc-100k-sau-3-thang', 'published', 'news', 'companyUpdate', '2025-11-27T00:00:00.000Z', 'Một cột mốc tăng trưởng đáng nhớ, ghi nhận nỗ lực của đội ngũ trong hành trình scale thương mại điện tử toàn cầu.', 'Seed từ website cũ: https://gobe.asia/chuyen-muc/tin-tuc/', 'published'),
('Brainstorm - Nơi những ý tưởng "bùng cháy"', 'brainstorm-noi-nhung-y-tuong-bung-chay', 'published', 'news', 'editorial', '2025-06-21T00:00:00.000Z', 'Không gian để Gobe-ers cùng thử nghiệm góc nhìn mới, chia sẻ insight và biến ý tưởng thành hướng triển khai cụ thể.', 'Seed từ website cũ: https://gobe.asia/chuyen-muc/tin-tuc/', 'published'),
('Đếm ngược đến đại lễ 30/4 - GoBeyond sẵn sàng cho những khoảnh khắc ý nghĩa', 'dem-nguoc-den-dai-le-30-4-gobeyond-san-sang-cho-nhung-khoanh-khac-y-nghia', 'published', 'news', 'companyUpdate', '2025-04-29T00:00:00.000Z', 'GoBeyond chuẩn bị cho dịp lễ 30/4 bằng tinh thần tri ân, tự hào và gắn kết nội bộ.', 'Seed từ website cũ: https://gobe.asia/chuyen-muc/tin-tuc/', 'published'),
('Cuộc chiến bất bại giữa những chiến binh Gobe-ers', 'cuoc-chien-bat-bai-giua-nhung-chien-binh-gobe-ers', 'published', 'news', 'companyUpdate', '2025-03-29T00:00:00.000Z', 'Một câu chuyện nội bộ về tinh thần thi đua, sự quyết liệt và năng lượng chiến đấu của Gobe-ers.', 'Seed từ website cũ: https://gobe.asia/chuyen-muc/tin-tuc/', 'published'),
('Behind the POD: Hậu trường sau mùa Black Friday cuối năm 2024', 'behind-the-pod-hau-truong-sau-mua-black-friday-cuoi-nam-2024', 'published', 'news', 'caseStudy', '2025-03-18T00:00:00.000Z', 'Nhìn lại hậu trường mùa cao điểm POD, nơi từng bước vận hành đều cần tốc độ, độ chính xác và phối hợp chặt chẽ.', 'Seed từ website cũ: https://gobe.asia/chuyen-muc/tin-tuc/', 'published'),
('Kick Off 2026: Gobe-ers "bật công tắc", quyết tâm phá đảo năm mới', 'kick-off-2026-gobe-ers-bat-cong-tac-quyet-tam-pha-dao-nam-moi', 'published', 'activity', 'activity', '2026-03-06T00:00:00.000Z', 'Buổi kick-off mở đầu năm 2026 với tinh thần bứt phá, đặt mục tiêu rõ ràng và khởi động chặng tăng trưởng mới.', 'Seed từ website cũ: https://gobe.asia/chuyen-muc/hoat-dong/', 'published'),
('Xuân Bính Ngọ 2026 | Go Beyond trao quà, gửi trọn tri ân', 'xuan-binh-ngo-2026-go-beyond-trao-qua-gui-tron-tri-an', 'published', 'activity', 'activity', '2026-02-11T00:00:00.000Z', 'Hoạt động trao quà đầu xuân như lời cảm ơn gửi tới những đóng góp bền bỉ của đội ngũ GoBeyond.', 'Seed từ website cũ: https://gobe.asia/chuyen-muc/hoat-dong/', 'published'),
('YEP 2025 - Khép năm tự hào, mở chặng bứt phá cùng Go Beyond', 'yep-2025-khep-nam-tu-hao-mo-chang-but-pha-cung-go-beyond', 'published', 'activity', 'activity', '2026-02-09T00:00:00.000Z', 'Year End Party 2025 ghi lại những dấu mốc đáng nhớ và mở ra chặng tăng trưởng tiếp theo cho GoBeyond.', 'Seed từ website cũ: https://gobe.asia/chuyen-muc/hoat-dong/', 'published'),
('Race to $2.3M - Phá mốc cuối năm cùng Go Beyond', 'race-to-2-3m-pha-moc-cuoi-nam-cung-go-beyond', 'published', 'activity', 'activity', '2025-11-27T00:00:00.000Z', 'Chiến dịch nội bộ thúc đẩy tinh thần race cuối năm, tập trung vào mục tiêu tăng trưởng và phối hợp vận hành.', 'Seed từ website cũ: https://gobe.asia/chuyen-muc/hoat-dong/', 'published'),
('Go Beyond Kick Off Q2/2025 - Một chuyến đi, ngàn kỷ niệm', 'go-beyond-kick-off-q2-2025-mot-chuyen-di-ngan-ky-niem', 'published', 'activity', 'activity', '2025-08-11T00:00:00.000Z', 'Chuyến kick-off Q2/2025 tạo thêm kết nối nội bộ và tiếp thêm năng lượng cho quý mới.', 'Seed từ website cũ: https://gobe.asia/chuyen-muc/hoat-dong/', 'published'),
('Go Beyond vừa chốt 100.000 đơn', 'go-beyond-vua-chot-100-000-don', 'published', 'activity', 'activity', '2025-06-20T00:00:00.000Z', 'Dấu mốc 100.000 đơn ghi nhận năng lực vận hành và sự phối hợp của toàn hệ thống GoBeyond.', 'Seed từ website cũ: https://gobe.asia/chuyen-muc/hoat-dong/', 'published'),
('Hưởng ứng đại lễ 30/4 - Go Beyond tưởng nhớ, tri ân và tự hào', 'huong-ung-dai-le-30-4-go-beyond-tuong-nho-tri-an-va-tu-hao', 'published', 'activity', 'activity', '2025-04-30T00:00:00.000Z', 'Hoạt động nội bộ nhân dịp 30/4 lan tỏa tinh thần tưởng nhớ, tri ân và tự hào dân tộc.', 'Seed từ website cũ: https://gobe.asia/chuyen-muc/hoat-dong/', 'published'),
('Go Beyond chúc mừng ngày Quốc tế Phụ nữ 8/3', 'go-beyond-chuc-mung-ngay-quoc-te-phu-nu-8-3', 'published', 'activity', 'activity', '2025-03-08T00:00:00.000Z', 'Một hoạt động ấm áp dành cho các thành viên nữ, gửi lời chúc và sự trân trọng từ GoBeyond.', 'Seed từ website cũ: https://gobe.asia/chuyen-muc/hoat-dong/', 'published')
ON CONFLICT(slug) DO UPDATE SET
  title = excluded.title,
  status = excluded.status,
  tag = excluded.tag,
  template = excluded.template,
  published_at = excluded.published_at,
  excerpt = excluded.excerpt,
  notes = excluded.notes,
  _status = excluded._status,
  updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now');

DELETE FROM news_blocks_lead WHERE _parent_id IN (SELECT id FROM news WHERE notes LIKE 'Seed từ website cũ:%');
DELETE FROM news_blocks_body_copy WHERE _parent_id IN (SELECT id FROM news WHERE notes LIKE 'Seed từ website cũ:%');
DELETE FROM news_blocks_cta WHERE _parent_id IN (SELECT id FROM news WHERE notes LIKE 'Seed từ website cũ:%');

INSERT INTO news_blocks_lead (_order, _parent_id, _path, id, kicker, heading, body)
SELECT 0, id, 'layout', 'seed-lead-' || slug, CASE WHEN tag = 'activity' THEN 'Hoạt động GoBeyond' ELSE 'Tin tức GoBeyond' END, title, excerpt
FROM news WHERE notes LIKE 'Seed từ website cũ:%';

INSERT INTO news_blocks_body_copy (_order, _parent_id, _path, id, content)
SELECT 1, id, 'layout', 'seed-body-' || slug,
CASE
  WHEN tag = 'activity' THEN excerpt || char(10) || char(10) || 'Nội dung này được nhập vào admin từ trang hoạt động cũ của GoBeyond để đội ngũ có thể tiếp tục chỉnh sửa, bổ sung hình ảnh và xuất bản trên website mới.'
  ELSE excerpt || char(10) || char(10) || 'Nội dung này được nhập vào admin từ trang tin tức cũ của GoBeyond để đội ngũ có thể tiếp tục chỉnh sửa, bổ sung hình ảnh và xuất bản trên website mới.'
END
FROM news WHERE notes LIKE 'Seed từ website cũ:%';

INSERT INTO news_blocks_cta (_order, _parent_id, _path, id, heading, body, label, href)
SELECT 2, id, 'layout', 'seed-cta-' || slug,
CASE WHEN tag = 'activity' THEN 'Theo dõi thêm hoạt động của GoBeyond' ELSE 'Theo dõi thêm cập nhật của GoBeyond' END,
'Bài viết này đang được quản lý trong admin/Payload CMS.',
CASE WHEN tag = 'activity' THEN 'Xem hoạt động' ELSE 'Xem tin tức' END,
CASE WHEN tag = 'activity' THEN '/hoat-dong' ELSE '/tin-tuc' END
FROM news WHERE notes LIKE 'Seed từ website cũ:%';
