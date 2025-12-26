import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart'; // 그래프용

void main() => runApp(const MaterialApp(home: EcoWarriorDashBoard(), debugShowCheckedModeBanner: false));

class EcoWarriorDashBoard extends StatelessWidget {
  const EcoWarriorDashBoard({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FBF9), // 배경색
      body: SingleChildScrollView(
        child: Column(
          children: [
            _buildHeader(), // 상단 초록색 프로필 영역
            _buildGoalWidget(), // 이번 달 목표 영역
            _buildGraphWidget(), // 주간 분리수거 추이 그래프
            _buildActionButtons(context), // 카메라 인식 & 이름 검색 버튼
            _buildTipWidget(), // 오늘의 환경 팁
          ],
        ),
      ),
      bottomNavigationBar: _buildBottomNav(), // 하단 내비게이션 바
    );
  }

  // 1. 상단 헤더 영역
  Widget _buildHeader() {
    return Container(
      padding: const EdgeInsets.only(top: 60, left: 20, right: 20, bottom: 30),
      decoration: const BoxDecoration(
        color: Color(0xFF00A344), // 디자인의 메인 초록색
        borderRadius: BorderRadius.only(bottomLeft: Radius.circular(30), bottomRight: Radius.circular(30)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text("안녕하세요!\n에코 워리어님 🌱", style: TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.bold)),
              Row(children: [
                IconButton(onPressed: () {}, icon: const Icon(Icons.translate, color: Colors.white)),
                IconButton(onPressed: () {}, icon: const Icon(Icons.bookmark_border, color: Colors.white)),
              ]),
            ],
          ),
          const SizedBox(height: 20),
          Row(
            children: [
              _buildHeaderCard("보유 포인트", "3,240P"),
              const SizedBox(width: 15),
              _buildHeaderCard("이번 달 총량", "12.4 kg"),
            ],
          )
        ],
      ),
    );
  }

  Widget _buildHeaderCard(String title, String value) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(15),
        decoration: BoxDecoration(color: Colors.white.withOpacity(0.2), borderRadius: BorderRadius.circular(15)),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(title, style: const TextStyle(color: Colors.white70, fontSize: 12)),
            const SizedBox(height: 5),
            Text(value, style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
          ],
        ),
      ),
    );
  }

  // 2. 이번 달 목표 위젯
  Widget _buildGoalWidget() {
    return Container(
      margin: const EdgeInsets.all(20),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(20), boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10)]),
      child: Column(
        children: [
          const Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(children: [Icon(Icons.gps_fixed, color: Colors.green, size: 20), SizedBox(width: 8), Text("이번 달 목표 달성률", style: TextStyle(fontWeight: FontWeight.bold))]),
              Text("62%", style: TextStyle(color: Colors.green, fontWeight: FontWeight.bold)),
            ],
          ),
          const SizedBox(height: 15),
          ClipRRect(
            borderRadius: BorderRadius.circular(10),
            child: const LinearProgressIndicator(value: 0.62, minHeight: 12, backgroundColor: Color(0xFFEEEEEE), valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF00A344))),
          ),
          const SizedBox(height: 10),
          const Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [Text("현재 12.4kg", style: TextStyle(color: Colors.grey, fontSize: 12)), Text("목표 20kg", style: TextStyle(color: Colors.grey, fontSize: 12))]),
        ],
      ),
    );
  }

  // 3. 주간 그래프 영역 (간단한 예시 데이터)
  Widget _buildGraphWidget() {
    return Container(
      height: 200,
      margin: const EdgeInsets.symmetric(horizontal: 20),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(20)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(children: [Icon(Icons.trending_up, color: Colors.green, size: 20), SizedBox(width: 8), Text("주간 분리수거 추이", style: TextStyle(fontWeight: FontWeight.bold))]),
          Expanded(
            child: LineChart(LineChartData(
              gridData: const FlGridData(show: false),
              titlesData: const FlTitlesData(show: false),
              borderData: FlBorderData(show: false),
              lineBarsData: [
                LineChartBarData(
                  spots: [const FlSpot(0, 3), const FlSpot(1, 4), const FlSpot(2, 7), const FlSpot(3, 12)],
                  isCurved: true,
                  color: Colors.green,
                  barWidth: 3,
                  belowBarData: BarAreaData(show: true, color: Colors.green.withOpacity(0.1)),
                ),
              ],
            )),
          ),
        ],
      ),
    );
  }

  // 4. 액션 버튼 (카메라 & 검색)
  Widget _buildActionButtons(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(20),
      child: Row(
        children: [
          _buildBigButton(Icons.camera_alt, "카메라 인식", "분리수거 시작", const Color(0xFF00CC52)),
          const SizedBox(width: 15),
          _buildBigButton(Icons.search, "이름으로 검색", "품목 찾기", const Color(0xFF2B70FF)),
        ],
      ),
    );
  }

  Widget _buildBigButton(IconData icon, String title, String subTitle, Color color) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 25, horizontal: 15),
        decoration: BoxDecoration(color: color, borderRadius: BorderRadius.circular(20)),
        child: Column(
          children: [
            Icon(icon, color: Colors.white, size: 35),
            const SizedBox(height: 10),
            Text(title, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
            Text(subTitle, style: const TextStyle(color: Colors.white70, fontSize: 12)),
          ],
        ),
      ),
    );
  }

  // 5. 오늘의 팁
  Widget _buildTipWidget() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 20),
      padding: const EdgeInsets.all(15),
      decoration: BoxDecoration(color: const Color(0xFFFFF9EB), borderRadius: BorderRadius.circular(15), border: Border.all(color: Colors.orange.shade100)),
      child: const Row(
        children: [
          Text("💡 오늘의 환경 팁", style: TextStyle(fontWeight: FontWeight.bold, color: Colors.brown)),
          SizedBox(width: 10),
          Expanded(child: Text("오늘도 지구를 위한 한 걸음, 최고예요!", style: TextStyle(color: Colors.brown, fontSize: 13))),
        ],
      ),
    );
  }

  // 6. 하단 내비게이션 바
  Widget _buildBottomNav() {
    return BottomNavigationBar(
      type: BottomNavigationBarType.fixed,
      selectedItemColor: const Color(0xFF00A344),
      unselectedItemColor: Colors.grey,
      showUnselectedLabels: true,
      items: const [
        BottomNavigationBarItem(icon: Icon(Icons.home), label: '홈'),
        BottomNavigationBarItem(icon: Icon(Icons.camera_enhance_outlined), label: '카메라'),
        BottomNavigationBarItem(icon: Icon(Icons.search), label: '검색'),
        BottomNavigationBarItem(icon: Icon(Icons.emoji_events_outlined), label: '랭킹'),
        BottomNavigationBarItem(icon: Icon(Icons.card_giftcard), label: '리워드'),
        BottomNavigationBarItem(icon: Icon(Icons.location_on_outlined), label: '지도'),
      ],
    );
  }
}