// ============================================
// Dữ liệu dịch Việt - Hàn
// ============================================
const translations = {
  vi: {
    // Header
    "nav.about": "Giới thiệu",
    "nav.stats": "Thống kê",
    "nav.features": "Tính năng",
    "nav.demo": "Demo",
    "nav.testimonials": "Đánh giá",
    "nav.contact": "Liên hệ",
    "nav.app": "Mở App",
    
    // Hero Section
    "hero.title": "Nước thượng nguồn trong<br/>Thành phố sạch bền vững",
    "hero.description": "Dự án hợp tác quốc tế giữa Đại học Đà Lạt và Hallym University (Hàn Quốc) – nghiên cứu phân loại, phân tích và xử lý rác thải đúng quy định, hướng tới môi trường cao nguyên trong lành và bền vững.",
    "hero.btn.demo": "Thử ngay Demo",
    "hero.btn.learn": "Tìm hiểu thêm",
    "hero.badge1": "Phân loại tại nguồn",
    "hero.badge2": "Ủ phân hữu cơ",
    "hero.badge3": "Tuân thủ Luật 2025",
    
    // Stats Section
    "stats.title": "Thống kê dự án",
    "stats.subtitle": "Kết quả đạt được sau 24 tháng triển khai",
    "stats.waste": "Kg rác đã phân loại",
    "stats.people": "Người tham gia",
    "stats.reduction": "% Giảm rác thải",
    "stats.months": "Tháng hoạt động",
    "stats.chart1": "Phân bố loại rác thu gom",
    "stats.chart2": "Lượng rác phân loại theo tháng",
    
    // Features Section
    "features.title": "Tại sao chọn Green Spring?",
    "features.subtitle": "Dự án kết hợp tri thức từ hai trường đại học, mang đến giải pháp toàn diện cho vấn đề rác thải tại Đà Lạt – thành phố du lịch và thượng nguồn của nhiều dòng nước.",
    "features.dalat.title": "Đà Lạt – Mạch nguồn tự nhiên",
    "features.dalat.desc": "Cao nguyên Đà Lạt là nơi khởi nguồn nhiều dòng nước, cảnh quan thiên nhiên và lối sống địa phương. Nếu "thượng nguồn" sạch thì cả hệ sinh thái phía dưới sẽ trong lành hơn.",
    "features.hallym.title": "Hallym – Mạch nguồn tri thức",
    "features.hallym.desc": "Hallym University (Hàn Quốc) mang đến kinh nghiệm quản lý rác tiên tiến, công nghệ phân loại và hệ thống tái chế hiện đại.",
    "features.spring.title": "Green Spring – Hợp lưu xanh",
    "features.spring.desc": "Khi hai "mạch nguồn" hòa quyện, chúng tạo thành một dòng chảy xanh bền vững, từ nhận thức người dân đến hệ thống quản lý rác thực tế.",
    
    // Demo Section
    "demo.title": "Thử phân loại rác thải",
    "demo.subtitle": "Kéo thả các vật phẩm vào đúng thùng rác!",
    "demo.instruction": "Kéo các vật phẩm này:",
    "demo.bin.recyclable": "Tái chế",
    "demo.bin.organic": "Hữu cơ",
    "demo.bin.other": "Còn lại",
    "demo.result.correct": "✅ Chính xác! Bạn đã phân loại đúng!",
    "demo.result.wrong": "❌ Chưa đúng, hãy thử lại!",
    
    // Testimonials
    "testimonials.title": "Cộng đồng nói gì về chúng tôi?",
    "testimonial1.text": "Dự án này giúp tôi hiểu rõ hơn về phân loại rác. Ứng dụng web rất dễ sử dụng và hữu ích!",
    "testimonial1.author": "Nguyễn Văn A - Sinh viên ĐH Đà Lạt",
    "testimonial2.text": "Green Spring mang đến giải pháp thực tế cho vấn đề môi trường. Tôi rất ủng hộ!",
    "testimonial2.author": "Trần Thị B - Giảng viên",
    "testimonial3.text": "Cách tiếp cận khoa học và có trách nhiệm. Đà Lạt cần nhiều dự án như thế này!",
    "testimonial3.author": "Lê Văn C - Doanh nhân",
    
    // Products Section
    "products.title": "Mục tiêu & Sản phẩm",
    "products.subtitle": "Xây dựng mô hình phân loại – xử lý rác sinh hoạt phù hợp với Đà Lạt, tuân thủ Luật Bảo vệ môi trường 2020.",
    "products.goals.title": "Mục tiêu chính",
    "products.goals.1": "Tăng tỉ lệ phân loại rác tại nguồn (3 nhóm: tái chế – hữu cơ – còn lại)",
    "products.goals.2": "Đề xuất phương án xử lý rác hữu cơ (ủ phân, ứng dụng nông nghiệp)",
    "products.goals.3": "Thiết kế mô hình truyền thông phù hợp với Đà Lạt",
    "products.outputs.title": "Sản phẩm cuối cùng",
    "products.outputs.1": "Web App phân loại rác: Tra cứu, hướng dẫn, bản đồ thu gom",
    "products.outputs.2": "Bộ công cụ truyền thông: Poster, infographic, video",
    "products.outputs.3": "Báo cáo nghiên cứu: Phân tích hiện trạng, mô hình áp dụng",
    "products.cta.title": "Trải nghiệm ứng dụng web",
    "products.cta.button": "Mở Web App",
    
    // Contact Section
    "contact.title": "Liên hệ & Hợp tác",
    "contact.subtitle": "Chúng tôi luôn chào đón sự hợp tác từ các trường đại học, tổ chức môi trường và cộng đồng.",
    "contact.dalat": "Đại học Đà Lạt",
    "contact.hallym": "Hallym University",
    "contact.email": "Email dự án",
    
    // Footer
    "footer.tagline": "From clean source to clean city<br/>Từ nguồn trong đến thành phố sạch",
    "footer.copyright": "© 2025 Green Spring Project. Bảo vệ môi trường – Trách nhiệm của mọi người."
  },
  
  ko: {
    // Header
    "nav.about": "소개",
    "nav.stats": "통계",
    "nav.features": "기능",
    "nav.demo": "데모",
    "nav.testimonials": "리뷰",
    "nav.contact": "연락처",
    "nav.app": "앱 열기",
    
    // Hero Section
    "hero.title": "깨끗한 상류수<br/>지속 가능한 청정 도시",
    "hero.description": "달랏 대학교와 한림대학교(한국) 간의 국제 협력 프로젝트 – 규정에 따라 폐기물을 분류, 분석 및 처리하여 고원 지역의 깨끗하고 지속 가능한 환경을 만듭니다.",
    "hero.btn.demo": "데모 체험",
    "hero.btn.learn": "더 알아보기",
    "hero.badge1": "발생원 분리수거",
    "hero.badge2": "유기물 퇴비화",
    "hero.badge3": "2025 법률 준수",
    
    // Stats Section
    "stats.title": "프로젝트 통계",
    "stats.subtitle": "24개월 시행 후 달성한 결과",
    "stats.waste": "분리수거된 쓰레기 (Kg)",
    "stats.people": "참여자 수",
    "stats.reduction": "쓰레기 감소율 (%)",
    "stats.months": "운영 개월 수",
    "stats.chart1": "수거된 쓰레기 유형별 분포",
    "stats.chart2": "월별 분리수거량",
    
    // Features Section
    "features.title": "왜 Green Spring을 선택해야 하나요?",
    "features.subtitle": "두 대학의 지식을 결합한 프로젝트로, 관광 도시이자 많은 강의 상류인 달랏의 쓰레기 문제에 대한 포괄적인 솔루션을 제공합니다.",
    "features.dalat.title": "달랏 – 자연의 원천",
    "features.dalat.desc": "달랏 고원은 많은 강, 자연 경관 및 지역 생활 방식의 발원지입니다. '상류'가 깨끗하면 하류 전체 생태계도 더욱 깨끗해집니다.",
    "features.hallym.title": "한림 – 지식의 원천",
    "features.hallym.desc": "한림대학교(한국)는 선진 폐기물 관리 경험, 분류 기술 및 현대적인 재활용 시스템을 제공합니다.",
    "features.spring.title": "Green Spring – 녹색 합류",
    "features.spring.desc": "두 '원천'이 합쳐지면 시민의 인식부터 실제 폐기물 관리 시스템까지 지속 가능한 녹색 흐름을 만듭니다.",
    
    // Demo Section
    "demo.title": "쓰레기 분리수거 체험",
    "demo.subtitle": "물건을 올바른 쓰레기통에 드래그하세요!",
    "demo.instruction": "이 물건들을 드래그하세요:",
    "demo.bin.recyclable": "재활용",
    "demo.bin.organic": "유기물",
    "demo.bin.other": "기타",
    "demo.result.correct": "✅ 정확합니다! 올바르게 분리수거했습니다!",
    "demo.result.wrong": "❌ 틀렸습니다, 다시 시도하세요!",
    
    // Testimonials
    "testimonials.title": "커뮤니티 후기",
    "testimonial1.text": "이 프로젝트 덕분에 쓰레기 분리수거에 대해 더 잘 이해하게 되었습니다. 웹 앱이 사용하기 쉽고 유용합니다!",
    "testimonial1.author": "응우옌 반 A - 달랏대학교 학생",
    "testimonial2.text": "Green Spring은 환경 문제에 대한 실용적인 솔루션을 제공합니다. 매우 지지합니다!",
    "testimonial2.author": "짠 티 B - 강사",
    "testimonial3.text": "과학적이고 책임감 있는 접근 방식입니다. 달랏에는 이런 프로젝트가 더 필요합니다!",
    "testimonial3.author": "레 반 C - 사업가",
    
    // Products Section
    "products.title": "목표 및 결과물",
    "products.subtitle": "달랏에 적합한 생활 폐기물 분류 및 처리 모델 구축, 2020 환경보호법 준수.",
    "products.goals.title": "주요 목표",
    "products.goals.1": "발생원 분리수거율 증가 (3개 그룹: 재활용 – 유기물 – 기타)",
    "products.goals.2": "유기물 쓰레기 처리 방안 제안 (퇴비화, 농업 응용)",
    "products.goals.3": "달랏에 적합한 홍보 모델 설계",
    "products.outputs.title": "최종 결과물",
    "products.outputs.1": "쓰레기 분리수거 웹 앱: 검색, 가이드, 수거 지도",
    "products.outputs.2": "홍보 도구 세트: 포스터, 인포그래픽, 비디오",
    "products.outputs.3": "연구 보고서: 현황 분석, 적용 모델",
    "products.cta.title": "웹 애플리케이션 체험",
    "products.cta.button": "웹 앱 열기",
    
    // Contact Section
    "contact.title": "연락처 및 협력",
    "contact.subtitle": "대학, 환경 단체 및 지역 사회와의 협력을 환영합니다.",
    "contact.dalat": "달랏 대학교",
    "contact.hallym": "한림대학교",
    "contact.email": "프로젝트 이메일",
    
    // Footer
    "footer.tagline": "깨끗한 원천에서 깨끗한 도시로<br/>From clean source to clean city",
    "footer.copyright": "© 2025 Green Spring Project. 환경 보호 – 모두의 책임입니다."
  }
};
