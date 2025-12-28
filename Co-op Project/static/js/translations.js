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
// ============================================
// FILE: static/js/translations.js
// Dữ liệu dịch Việt - Hàn
// ============================================

const translations = {
  vi: {
    // HEADER
    nav_about: "Giới thiệu",
    nav_stats: "Thống kê",
    nav_features: "Tính năng",
    nav_demo: "Demo",
    nav_testimonials: "Đánh giá",
    nav_contact: "Liên hệ",
    nav_app: "Mở App",
    
    // HERO SECTION
    hero_title_1: "Nước thượng nguồn trong",
    hero_title_2: "Thành phố sạch bền vững",
    hero_subtitle: "Dự án hợp tác quốc tế giữa Đại học Đà Lạt và Hallym University (Hàn Quốc) – nghiên cứu phân loại, phân tích và xử lý rác thải đúng quy định, hướng tới môi trường cao nguyên trong lành và bền vững.",
    hero_btn_demo: "Thử ngay Demo",
    hero_btn_learn: "Xem Video",
    badge_1: "Phân loại tại nguồn",
    badge_2: "Ủ phân hữu cơ",
    badge_3: "Tuân thủ Luật 2025",
    
    // VIDEO SECTION
    video_title: "Xem Green Spring hoạt động",
    video_subtitle: "Demo 90 giây về web app - Từ phân loại đến thu gom",
    video_btn: "Trải nghiệm ngay",
    
    // STATS SECTION
    stats_title: "Thống kê dự án",
    stats_subtitle: "Kết quả đạt được sau 24 tháng triển khai",
    stats_label_1: "Kg rác đã phân loại",
    stats_label_2: "Người tham gia",
    stats_label_3: "% Giảm rác thải",
    stats_label_4: "Tháng hoạt động",
    
    // TIMELINE SECTION
    timeline_title: "Hành trình 24 tháng",
    timeline_subtitle: "Từ ý tưởng đến hiện thực - Câu chuyện phát triển dự án",
    timeline_cta: "Trải nghiệm ngay",
    
    // TEAM SECTION
    team_title: "Đội ngũ thực hiện",
    team_subtitle: "Những người đứng sau thành công của Green Spring",
    team_cta: "Hợp tác với chúng tôi",
    
    // FAQ SECTION
    faq_title: "Câu hỏi thường gặp",
    faq_subtitle: "Giải đáp mọi thắc mắc về Green Spring",
    faq_cta_text: "Không tìm thấy câu trả lời? Chúng tôi luôn sẵn sàng hỗ trợ!",
    faq_cta_btn: "Liên hệ với chúng tôi",
    
    // FEATURES SECTION
    features_title: "Tại sao chọn Green Spring?",
    features_subtitle: "Dự án kết hợp tri thức từ hai trường đại học, mang đến giải pháp toàn diện cho vấn đề rác thải tại Đà Lạt – thành phố du lịch và thượng nguồn của nhiều dòng nước.",
    
    // CTA SECTION
    cta_title: "Sẵn sàng tạo thay đổi?",
    cta_subtitle: "Tham gia 567+ người đang xây dựng Đà Lạt xanh",
    cta_btn_1: "Bắt đầu ngay",
    cta_btn_2: "Đặt lịch tư vấn",
    
    // CONTACT SECTION
    contact_title: "Liên hệ & Hợp tác",
    contact_subtitle: "Chúng tôi luôn chào đón sự hợp tác từ các trường đại học, tổ chức môi trường và cộng đồng.",
    
    // FOOTER
    footer_tagline: "Từ nguồn trong đến thành phố sạch",
  },
  
  ko: {
    // HEADER
    nav_about: "소개",
    nav_stats: "통계",
    nav_features: "기능",
    nav_demo: "데모",
    nav_testimonials: "리뷰",
    nav_contact: "연락처",
    nav_app: "앱 열기",
    
    // HERO SECTION
    hero_title_1: "깨끗한 수원",
    hero_title_2: "지속 가능한 도시",
    hero_subtitle: "달랏대학교와 한림대학교(한국)의 국제 협력 프로젝트 – 규정에 따른 쓰레기 분류, 분석 및 처리 연구, 고원 환경의 청결하고 지속 가능한 발전을 목표로 합니다.",
    hero_btn_demo: "데모 시도",
    hero_btn_learn: "동영상 보기",
    badge_1: "발생원 분리수거",
    badge_2: "유기농 퇴비",
    badge_3: "2025년 법률 준수",
    
    // VIDEO SECTION
    video_title: "Green Spring 작동 방식",
    video_subtitle: "웹 앱 90초 데모 - 분류부터 수거까지",
    video_btn: "지금 체험하기",
    
    // STATS SECTION
    stats_title: "프로젝트 통계",
    stats_subtitle: "24개월 시행 후 결과",
    stats_label_1: "분류된 쓰레기 (Kg)",
    stats_label_2: "참가자",
    stats_label_3: "% 폐기물 감소",
    stats_label_4: "운영 개월",
    
    // TIMELINE SECTION
    timeline_title: "24개월의 여정",
    timeline_subtitle: "아이디어에서 현실까지 - 프로젝트 개발 이야기",
    timeline_cta: "지금 체험하기",
    
    // TEAM SECTION
    team_title: "실행 팀",
    team_subtitle: "Green Spring의 성공을 뒷받침하는 사람들",
    team_cta: "협력하기",
    
    // FAQ SECTION
    faq_title: "자주 묻는 질문",
    faq_subtitle: "Green Spring에 대한 모든 질문 해결",
    faq_cta_text: "답변을 찾지 못하셨나요? 언제든지 도와드리겠습니다!",
    faq_cta_btn: "문의하기",
    
    // FEATURES SECTION
    features_title: "왜 Green Spring을 선택해야 하나요?",
    features_subtitle: "두 대학의 지식을 결합하여 달랏의 폐기물 문제에 대한 포괄적인 솔루션 제공 – 관광 도시이자 많은 강의 상류.",
    
    // CTA SECTION
    cta_title: "변화를 만들 준비가 되셨나요?",
    cta_subtitle: "달랏을 녹색으로 만들고 있는 567명 이상과 함께하세요",
    cta_btn_1: "지금 시작",
    cta_btn_2: "상담 예약",
    
    // CONTACT SECTION
    contact_title: "연락 및 협력",
    contact_subtitle: "대학, 환경 단체 및 커뮤니티의 협력을 항상 환영합니다.",
    
    // FOOTER
    footer_tagline: "깨끗한 수원에서 깨끗한 도시로",
  }
};
