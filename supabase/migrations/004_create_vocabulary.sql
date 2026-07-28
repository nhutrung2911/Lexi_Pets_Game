-- 1. Create the vocabulary table
CREATE TABLE IF NOT EXISTS public.vocabulary (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  word text NOT NULL UNIQUE,
  level text NOT NULL, -- 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'
  meaning_vi text NOT NULL, -- Nghĩa tiếng Việt
  created_at timestamp with time zone DEFAULT now()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.vocabulary ENABLE ROW LEVEL SECURITY;

-- 3. Create policies
CREATE POLICY "Allow authenticated users to read vocabulary"
ON public.vocabulary
FOR SELECT
TO authenticated
USING (true);

-- 4. Seed Data (A1 to C2 with Vietnamese meanings)
-- I have provided a massive list of words here to ensure 50 stages have plenty of variety.
INSERT INTO public.vocabulary (word, level, meaning_vi) VALUES
-- A1 (Beginner)
('CAT', 'A1', 'Con mèo'), ('DOG', 'A1', 'Con chó'), ('SUN', 'A1', 'Mặt trời'), ('BOOK', 'A1', 'Quyển sách'),
('APPLE', 'A1', 'Quả táo'), ('HOUSE', 'A1', 'Ngôi nhà'), ('TREE', 'A1', 'Cái cây'), ('CAR', 'A1', 'Xe hơi'),
('MILK', 'A1', 'Sữa'), ('WATER', 'A1', 'Nước'), ('BOY', 'A1', 'Cậu bé'), ('GIRL', 'A1', 'Cô bé'),
('BIRD', 'A1', 'Con chim'), ('FISH', 'A1', 'Con cá'), ('FIRE', 'A1', 'Lửa'), ('SNOW', 'A1', 'Tuyết'),
('RAIN', 'A1', 'Mưa'), ('DOOR', 'A1', 'Cửa ra vào'), ('WALL', 'A1', 'Bức tường'), ('TIME', 'A1', 'Thời gian'),
('DAY', 'A1', 'Ngày'), ('NIGHT', 'A1', 'Đêm'), ('MORNING', 'A1', 'Buổi sáng'), ('EVENING', 'A1', 'Buổi tối'),
('MOTHER', 'A1', 'Mẹ'), ('FATHER', 'A1', 'Cha'), ('BABY', 'A1', 'Em bé'), ('FRIEND', 'A1', 'Bạn bè'),
('SCHOOL', 'A1', 'Trường học'), ('TEACHER', 'A1', 'Giáo viên'), ('STUDENT', 'A1', 'Học sinh'), ('PEN', 'A1', 'Cái bút'),
('PAPER', 'A1', 'Tờ giấy'), ('DESK', 'A1', 'Bàn học'), ('CHAIR', 'A1', 'Cái ghế'), ('BED', 'A1', 'Cái giường'),
('ROOM', 'A1', 'Căn phòng'), ('WINDOW', 'A1', 'Cửa sổ'), ('SHOE', 'A1', 'Chiếc giày'), ('SHIRT', 'A1', 'Áo sơ mi'),
('PANT', 'A1', 'Cái quần'), ('HAT', 'A1', 'Cái mũ'), ('FOOD', 'A1', 'Thức ăn'), ('RICE', 'A1', 'Cơm, gạo'),
('MEAT', 'A1', 'Thịt'), ('BREAD', 'A1', 'Bánh mì'), ('EGG', 'A1', 'Quả trứng'), ('CAKE', 'A1', 'Bánh ngọt'),
('CITY', 'A1', 'Thành phố'), ('STREET', 'A1', 'Đường phố'), ('ROAD', 'A1', 'Con đường'), ('BUS', 'A1', 'Xe buýt'),

-- A2 (Elementary)
('MOUNTAIN', 'A2', 'Ngọn núi'), ('RIVER', 'A2', 'Dòng sông'), ('CLOUD', 'A2', 'Đám mây'), ('STAR', 'A2', 'Ngôi sao'),
('WIND', 'A2', 'Cơn gió'), ('ISLAND', 'A2', 'Hòn đảo'), ('BRIDGE', 'A2', 'Cây cầu'), ('FOREST', 'A2', 'Khu rừng'),
('CHEESE', 'A2', 'Phô mai'), ('PIZZA', 'A2', 'Bánh pizza'), ('FAMILY', 'A2', 'Gia đình'), ('FARMER', 'A2', 'Nông dân'),
('DOCTOR', 'A2', 'Bác sĩ'), ('NURSE', 'A2', 'Y tá'), ('POLICE', 'A2', 'Cảnh sát'), ('DRIVER', 'A2', 'Tài xế'),
('ANIMAL', 'A2', 'Động vật'), ('WINTER', 'A2', 'Mùa đông'), ('SUMMER', 'A2', 'Mùa hè'), ('SPRING', 'A2', 'Mùa xuân'),
('AUTUMN', 'A2', 'Mùa thu'), ('MORNING', 'A2', 'Buổi sáng'), ('AFTERNOON', 'A2', 'Buổi chiều'), ('TICKET', 'A2', 'Vé'),
('FLIGHT', 'A2', 'Chuyến bay'), ('TRAIN', 'A2', 'Xe lửa'), ('STATION', 'A2', 'Nhà ga'), ('AIRPORT', 'A2', 'Sân bay'),
('MARKET', 'A2', 'Chợ'), ('SUPERMARKET', 'A2', 'Siêu thị'), ('HOSPITAL', 'A2', 'Bệnh viện'), ('PHARMACY', 'A2', 'Hiệu thuốc'),
('MONEY', 'A2', 'Tiền'), ('PRICE', 'A2', 'Giá cả'), ('CHEAP', 'A2', 'Rẻ'), ('EXPENSIVE', 'A2', 'Đắt'),
('BEAUTIFUL', 'A2', 'Xinh đẹp'), ('UGLY', 'A2', 'Xấu xí'), ('CLEAN', 'A2', 'Sạch sẽ'), ('DIRTY', 'A2', 'Dơ bẩn'),
('QUICK', 'A2', 'Nhanh chóng'), ('SLOW', 'A2', 'Chậm chạp'), ('STRONG', 'A2', 'Mạnh mẽ'), ('WEAK', 'A2', 'Yếu đuối'),
('HEAVY', 'A2', 'Nặng'), ('LIGHT', 'A2', 'Nhẹ'), ('THICK', 'A2', 'Dày'), ('THIN', 'A2', 'Mỏng'),

-- B1 (Intermediate)
('FREEDOM', 'B1', 'Sự tự do'), ('JOURNEY', 'B1', 'Hành trình'), ('WEATHER', 'B1', 'Thời tiết'), ('CLIMATE', 'B1', 'Khí hậu'),
('SOCIETY', 'B1', 'Xã hội'), ('CULTURE', 'B1', 'Văn hóa'), ('HISTORY', 'B1', 'Lịch sử'), ('NATURE', 'B1', 'Tự nhiên'),
('SCIENCE', 'B1', 'Khoa học'), ('MACHINE', 'B1', 'Máy móc'), ('FACTORY', 'B1', 'Nhà máy'), ('LIBRARY', 'B1', 'Thư viện'),
('THEATER', 'B1', 'Nhà hát'), ('CONCERT', 'B1', 'Buổi hòa nhạc'), ('VILLAGE', 'B1', 'Ngôi làng'), ('COUNTRY', 'B1', 'Quốc gia'),
('CAPITAL', 'B1', 'Thủ đô'), ('STADIUM', 'B1', 'Sân vận động'), ('ECONOMY', 'B1', 'Kinh tế'), ('POLITICS', 'B1', 'Chính trị'),
('BUSINESS', 'B1', 'Kinh doanh'), ('COMPANY', 'B1', 'Công ty'), ('OFFICE', 'B1', 'Văn phòng'), ('MANAGER', 'B1', 'Quản lý'),
('EMPLOYEE', 'B1', 'Nhân viên'), ('CUSTOMER', 'B1', 'Khách hàng'), ('PRODUCT', 'B1', 'Sản phẩm'), ('SERVICE', 'B1', 'Dịch vụ'),
('QUALITY', 'B1', 'Chất lượng'), ('QUANTITY', 'B1', 'Số lượng'), ('KNOWLEDGE', 'B1', 'Kiến thức'), ('EDUCATION', 'B1', 'Giáo dục'),
('LANGUAGE', 'B1', 'Ngôn ngữ'), ('DICTIONARY', 'B1', 'Từ điển'), ('GRAMMAR', 'B1', 'Ngữ pháp'), ('VOCABULARY', 'B1', 'Từ vựng'),
('SENTENCE', 'B1', 'Câu'), ('PARAGRAPH', 'B1', 'Đoạn văn'), ('DOCUMENT', 'B1', 'Tài liệu'), ('ARTICLE', 'B1', 'Bài báo'),

-- B2 (Upper Intermediate)
('PHILOSOPHY', 'B2', 'Triết học'), ('PSYCHOLOGY', 'B2', 'Tâm lý học'), ('TECHNOLOGY', 'B2', 'Công nghệ'), ('INNOVATION', 'B2', 'Sự đổi mới'),
('SUSTAINABLE', 'B2', 'Bền vững'), ('ENVIRONMENT', 'B2', 'Môi trường'), ('GOVERNMENT', 'B2', 'Chính phủ'), ('PARLIAMENT', 'B2', 'Nghị viện'),
('DEMOCRACY', 'B2', 'Dân chủ'), ('INDUSTRY', 'B2', 'Công nghiệp'), ('AGRICULTURE', 'B2', 'Nông nghiệp'), ('ARCHITECTURE', 'B2', 'Kiến trúc'),
('LITERATURE', 'B2', 'Văn học'), ('TRADITION', 'B2', 'Truyền thống'), ('REVOLUTION', 'B2', 'Cuộc cách mạng'), ('INDEPENDENCE', 'B2', 'Sự độc lập'),
('CONSTITUTION', 'B2', 'Hiến pháp'), ('INVESTMENT', 'B2', 'Sự đầu tư'), ('MANAGEMENT', 'B2', 'Sự quản lý'), ('STRATEGY', 'B2', 'Chiến lược'),
('POTENTIAL', 'B2', 'Tiềm năng'), ('SIGNIFICANT', 'B2', 'Đáng kể'), ('APPROPRIATE', 'B2', 'Thích hợp'), ('ALTERNATIVE', 'B2', 'Sự thay thế'),
('PERSPECTIVE', 'B2', 'Quan điểm'), ('CONSEQUENCE', 'B2', 'Hậu quả'), ('CONTRIBUTION', 'B2', 'Sự đóng góp'), ('CHALLENGE', 'B2', 'Thử thách'),
('OPPORTUNITY', 'B2', 'Cơ hội'), ('ACHIEVEMENT', 'B2', 'Thành tựu'), ('EXPERIENCE', 'B2', 'Kinh nghiệm'), ('EVIDENCE', 'B2', 'Bằng chứng'),
('HYPOTHESIS', 'B2', 'Giả thuyết'), ('PHENOMENON', 'B2', 'Hiện tượng'), ('STATISTICS', 'B2', 'Thống kê'), ('ANALYSIS', 'B2', 'Sự phân tích'),

-- C1 (Advanced)
('UBIQUITOUS', 'C1', 'Có mặt khắp nơi'), ('EPHEMERAL', 'C1', 'Phù du, chóng tàn'), ('METICULOUS', 'C1', 'Tỉ mỉ, cẩn thận'), ('PRAGMATIC', 'C1', 'Thực dụng'),
('ELOQUENT', 'C1', 'Có tài hùng biện'), ('RESILIENT', 'C1', 'Kiên cường, mau phục hồi'), ('LUCID', 'C1', 'Minh mẫn, rõ ràng'), ('PROLIFIC', 'C1', 'Sinh sản nhiều, sáng tác nhiều'),
('AMBIGUOUS', 'C1', 'Mơ hồ, nhập nhằng'), ('ANOMALY', 'C1', 'Sự dị thường'), ('DICHOTOMY', 'C1', 'Sự phân đôi, đối lập'), ('PARADIGM', 'C1', 'Mô hình, kiểu mẫu'),
('CONUNDRUM', 'C1', 'Câu đố, vấn đề nan giải'), ('ENIGMA', 'C1', 'Điều bí ẩn'), ('SYNERGY', 'C1', 'Sự hiệp lực'), ('CATALYST', 'C1', 'Chất xúc tác'),
('VINDICATE', 'C1', 'Minh oan, bào chữa'), ('EXACERBATE', 'C1', 'Làm trầm trọng thêm'), ('MITIGATE', 'C1', 'Làm dịu bớt'), ('ALLEVIATE', 'C1', 'Làm giảm nhẹ'),
('ASTUTE', 'C1', 'Sắc sảo, tinh khôn'), ('AUSTERE', 'C1', 'Khắc khổ, mộc mạc'), ('BENEVOLENT', 'C1', 'Nhân từ, rộng lượng'), ('CAPRICIOUS', 'C1', 'Thất thường'),
('CHRONIC', 'C1', 'Mãn tính, kinh niên'), ('COGNITIVE', 'C1', 'Thuộc về nhận thức'), ('COMPREHENSIVE', 'C1', 'Toàn diện'), ('DETRIMENTAL', 'C1', 'Có hại'),
('EMPIRICAL', 'C1', 'Dựa trên kinh nghiệm'), ('FEASIBLE', 'C1', 'Khả thi'), ('HETEROGENEOUS', 'C1', 'Hỗn tạp, không đồng nhất'), ('HOMOGENEOUS', 'C1', 'Đồng nhất'),

-- C2 (Proficient)
('SERENDIPITY', 'C2', 'Sự tình cờ may mắn'), ('QUINTESSENTIAL', 'C2', 'Tinh túy, hoàn hảo nhất'), ('MELLIFLUOUS', 'C2', 'Ngọt ngào, êm tai'), ('INEFFABLE', 'C2', 'Không thể tả xiết'),
('OBFUSCATE', 'C2', 'Làm mờ mịt, gây bối rối'), ('PERSPICACIOUS', 'C2', 'Sáng suốt, nhạy bén'), ('EQUANIMITY', 'C2', 'Sự bình thản, điềm đạm'), ('FASTIDIOUS', 'C2', 'Khó tính, tỉ mỉ'),
('ESOTERIC', 'C2', 'Bí truyền, khó hiểu'), ('CACOPHONY', 'C2', 'Âm thanh chói tai'), ('SYCOPHANT', 'C2', 'Kẻ nịnh hót'), ('IDIOSYNCRASY', 'C2', 'Khí chất đặc thù, kỳ quặc'),
('BELLIGERENT', 'C2', 'Hiếu chiến'), ('MAGNANIMOUS', 'C2', 'Hào hiệp, cao thượng'), ('SUPERFLUOUS', 'C2', 'Thừa thãi, không cần thiết'), ('PANDEMONIUM', 'C2', 'Sự hỗn loạn, ồn ào'),
('RECALCITRANT', 'C2', 'Ngoan cố, cứng đầu'), ('GRANDILOQUENT', 'C2', 'Khoa trương, nói chữ'), ('DEFENESTRATION', 'C2', 'Hành động ném ai ra khỏi cửa sổ'), ('FLUMMOXED', 'C2', 'Bối rối, lúng túng'),
('EPITOME', 'C2', 'Tấm gương hoàn hảo, hình ảnh thu nhỏ'), ('INEFFABLY', 'C2', 'Một cách không thể diễn tả'), ('MUNIFICENT', 'C2', 'Vô cùng hào phóng'), ('OBSTREPEROUS', 'C2', 'Ngỗ ngược, ồn ào'),
('PAUCITY', 'C2', 'Sự khan hiếm, thiếu thốn'), ('PUSILLANIMOUS', 'C2', 'Nhát gan, hèn nhát'), ('QUERULOUS', 'C2', 'Hay cằn nhằn, than phiền'), ('SAGACIOUS', 'C2', 'Thông minh, minh mẫn'),
('TREPIDATION', 'C2', 'Sự lo âu, sợ hãi'), ('VOCIFEROUS', 'C2', 'Om sòm, to tiếng'), ('ZEALOUS', 'C2', 'Hăng hái, nhiệt huyết'), ('ACRIMONIOUS', 'C2', 'Chua cay, gay gắt')
ON CONFLICT (word) DO NOTHING;
