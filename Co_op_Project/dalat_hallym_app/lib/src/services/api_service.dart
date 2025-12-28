import 'package:http/http.dart' as http;

class ApiService {
  // 본인의 맥북 IP 주소로 수정해야 합니다.
  static const String baseUrl = 'http://192.168.x.x:5000';

  static Future<void> uploadImage(String filePath) async {
    var request = http.MultipartRequest('POST', Uri.parse('$baseUrl/predict'));
    request.files.add(await http.MultipartFile.fromPath('file', filePath));

    var response = await request.send();

    if (response.statusCode == 200) {
      print('전송 성공!');
    } else {
      print('전송 실패: ${response.statusCode}');
    }
  }
}