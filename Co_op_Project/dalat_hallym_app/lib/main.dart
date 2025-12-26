import 'package:flutter/material.dart';
import 'package:camera/camera.dart';
import 'src/screens/camera_screen.dart';

List<CameraDescription> cameras = [];

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  // 사용 가능한 카메라 목록을 가져옵니다.
  cameras = await availableCameras();
  runApp(const GarbageApp());
}

class GarbageApp extends StatelessWidget {
  const GarbageApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: ThemeData(primarySwatch: Colors.green),
      home: HomeScreen(cameras: cameras),
    );
  }
}

class HomeScreen extends StatelessWidget {
  final List<CameraDescription> cameras;
  const HomeScreen({super.key, required this.cameras});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('AI Garbage Classifier')),
      body: Center(
        child: ElevatedButton.icon(
          onPressed: () {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => CameraScreen(cameras: cameras)),
            );
          },
          icon: const Icon(Icons.camera_alt),
          label: const Text('쓰레기 촬영 시작'),
        ),
      ),
    );
  }
}