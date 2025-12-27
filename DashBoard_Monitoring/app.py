from flask import Flask, render_template, request, redirect, url_for, flash, session, jsonify
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps
from datetime import datetime, timedelta
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-change-this-in-production'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///greenspring.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# ============================================
# DATABASE MODELS
# ============================================

class Admin(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    avatar = db.Column(db.String(200))
    points = db.Column(db.Integer, default=0)
    total_kg = db.Column(db.Float, default=0)
    rank = db.Column(db.Integer, default=0)
    level = db.Column(db.Integer, default=1)
    location = db.Column(db.String(100))
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class WasteLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    waste_type = db.Column(db.String(50))
    weight_kg = db.Column(db.Float)
    points_earned = db.Column(db.Integer)
    accuracy = db.Column(db.Float)
    image_url = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user = db.relationship('User', backref='waste_logs')

class Reward(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    category = db.Column(db.String(50))
    points_required = db.Column(db.Integer)
    stock = db.Column(db.Integer, default=0)
    redeemed_count = db.Column(db.Integer, default=0)
    image = db.Column(db.String(200))
    is_featured = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Badge(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    requirement = db.Column(db.String(200))
    icon = db.Column(db.String(50))
    color = db.Column(db.String(50))
    rarity = db.Column(db.String(20))
    earned_count = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Campaign(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    slogan = db.Column(db.String(200))
    description = db.Column(db.Text)
    start_date = db.Column(db.Date)
    end_date = db.Column(db.Date)
    goal_kg = db.Column(db.Float)
    current_kg = db.Column(db.Float, default=0)
    participants = db.Column(db.Integer, default=0)
    points_awarded = db.Column(db.Integer, default=0)
    status = db.Column(db.String(20))
    color_start = db.Column(db.String(20), default='#5865F2')
    color_end = db.Column(db.String(20), default='#10B981')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class CollectionPoint(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    address = db.Column(db.String(200))
    area = db.Column(db.String(100))
    type = db.Column(db.String(50))
    lat = db.Column(db.Float)
    lng = db.Column(db.Float)
    status = db.Column(db.String(20), default='active')
    capacity_percent = db.Column(db.Integer, default=0)
    usage_count = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# ============================================
# CONTEXT PROCESSORS - AUTO-INJECT VARIABLES
# ============================================

@app.context_processor
def inject_global_vars():
    """Inject current_user and other global vars into all templates"""
    current_admin = None
    if 'admin_id' in session:
        current_admin = Admin.query.get(session['admin_id'])
    
    return dict(
        current_user=current_admin,
        total_users=User.query.count() if User.query.count() else 0
    )

# ============================================
# DECORATORS
# ============================================

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'admin_id' not in session:
            flash('Vui lòng đăng nhập để tiếp tục', 'error')
            return redirect(url_for('admin_login'))
        return f(*args, **kwargs)
    return decorated_function

# ============================================
# ADMIN ROUTES
# ============================================

@app.route('/admin/login', methods=['GET', 'POST'])
def admin_login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        
        admin = Admin.query.filter_by(email=email).first()
        
        if admin and check_password_hash(admin.password_hash, password):
            session['admin_id'] = admin.id
            session['admin_name'] = admin.name
            flash('Đăng nhập thành công!', 'success')
            return redirect(url_for('admin_dashboard'))
        else:
            flash('Email hoặc mật khẩu không đúng', 'error')
    
    return render_template('admin/login.html')

@app.route('/admin/logout')
def logout():
    session.clear()
    flash('Đã đăng xuất thành công', 'success')
    return redirect(url_for('admin_login'))

@app.route('/admin')
@app.route('/admin/dashboard')
@login_required
def admin_dashboard():
    # Calculate stats
    total_users = User.query.count()
    total_waste_kg = db.session.query(db.func.sum(WasteLog.weight_kg)).scalar() or 0
    total_points = db.session.query(db.func.sum(User.points)).scalar() or 0
    total_scans = WasteLog.query.filter(
        WasteLog.created_at >= datetime.utcnow() - timedelta(days=1)
    ).count()
    
    # Waste distribution
    waste_distribution = [450, 380, 84, 320]  # Mock data
    
    # Top users
    top_users = User.query.order_by(User.points.desc()).limit(5).all()
    
    # Recent activities (mock)
    recent_activities = [
        {
            'user_name': 'Nguyễn Văn A',
            'action': 'đã phân loại 2.5kg rác tái chế',
            'time_ago': '5 phút trước',
            'type': 'scan',
            'icon': 'fa-camera'
        },
    ]
    
    stats = {
        'total_users': total_users,
        'total_waste_kg': round(total_waste_kg, 1),
        'total_points': total_points,
        'total_scans': total_scans,
        'user_growth': 12,
        'waste_growth': 8.5,
        'scan_growth': 24,
        'waste_distribution': waste_distribution,
        'monthly_labels': ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'],
        'monthly_users': [120, 145, 180, 210, 245, 280]
    }
    
    return render_template('admin/dashboard.html',
                         stats=stats,
                         top_users=top_users,
                         recent_activities=recent_activities)

@app.route('/admin/users')
@login_required
def admin_users():
    users = User.query.all()
    return render_template('admin/users.html', users=users)

@app.route('/admin/rankings')
@login_required
def admin_rankings():
    rankings = User.query.order_by(User.points.desc()).limit(100).all()
    
    if not rankings or len(rankings) < 5:
        rankings = []
        
        # ⭐ DATA 100% VIỆT NAM - ĐÀ LẠT
        users_data = [
            {'name': 'Nguyễn Văn An', 'avatar': 'https://randomuser.me/api/portraits/men/32.jpg', 
             'school': 'THPT Trần Phú', 'class': 'Lớp 12A1', 'location': 'Phường Xuân Hương'},
            {'name': 'Trần Thị Bảo', 'avatar': 'https://randomuser.me/api/portraits/women/44.jpg',
             'school': 'THPT Nguyễn Huệ', 'class': 'Lớp 11A2', 'location': 'Phường Cam Ly'},
            {'name': 'Lê Minh Chiến', 'avatar': 'https://randomuser.me/api/portraits/men/54.jpg',
             'school': 'THPT Lê Quý Đôn', 'class': 'Lớp 12B3', 'location': 'Phường Lâm Viên'},
            {'name': 'Phạm Thu Duyên', 'avatar': 'https://randomuser.me/api/portraits/women/68.jpg',
             'school': 'THPT Chu Văn An', 'class': 'Lớp 10D1', 'location': 'Phường Xuân Trường'},
            {'name': 'Hoàng Minh Em', 'avatar': 'https://randomuser.me/api/portraits/men/75.jpg',
             'school': 'THPT Hà Nội Amsterdam', 'class': 'Lớp 11C2', 'location': 'Phường Lang Biang'},
            {'name': 'Vũ Thị Phương', 'avatar': 'https://randomuser.me/api/portraits/women/28.jpg',
             'school': 'THPT Trần Phú', 'class': 'Lớp 10A3', 'location': 'Phường Xuân Hương'},
            {'name': 'Đỗ Văn Gia', 'avatar': 'https://randomuser.me/api/portraits/men/62.jpg',
             'school': 'THPT Nguyễn Huệ', 'class': 'Lớp 12C1', 'location': 'Phường Cam Ly'},
            {'name': 'Ngô Thu Hà', 'avatar': 'https://randomuser.me/api/portraits/women/52.jpg',
             'school': 'THPT Lê Quý Đôn', 'class': 'Lớp 11B2', 'location': 'Phường Lâm Viên'},
            {'name': 'Bùi Văn Inh', 'avatar': 'https://randomuser.me/api/portraits/men/45.jpg',
             'school': 'THPT Chu Văn An', 'class': 'Lớp 12A4', 'location': 'Phường Xuân Trường'},
            {'name': 'Lý Thị Khánh', 'avatar': 'https://randomuser.me/api/portraits/women/65.jpg',
             'school': 'THPT Trần Phú', 'class': 'Lớp 11D2', 'location': 'Phường Lang Biang'},
        ]
        
        for i in range(10):
            data = users_data[i]
            badges = [type('obj', (), {
                'name': f'Badge {j+1}',
                'icon': f'https://ui-avatars.com/api/?name=B{j+1}&size=32&background=10B981&color=fff',
                'color': '#10B981'
            })() for j in range(3)]
            
            user = type('obj', (), {
                'id': i+1,
                'name': data['name'],
                'school': data['school'],
                'class_name': data['class'],
                'email': f'user{i+1}@test.com',
                'avatar': data['avatar'],
                'points': 2500 - (i * 200),
                'total_kg': round(50.0 - (i * 3.5), 1),
                'rank': i + 1,
                'level': 5 - (i // 3),
                'location': data['location'],
                'badges': badges,
                'total_scans': 120 - (i * 10),
                'accuracy': 95 - (i * 2),
                'rank_change': [2, -1, 0, 3, 1, -2, 0, 1, -1, 2][i]
            })()
            rankings.append(user)
    
    # ⭐ TOP PHƯỜNG - ĐÀ LẠT
    top_areas = [
        type('obj', (), {
            'name': 'Phường Xuân Hương',
            'city': 'Đà Lạt',
            'total_kg': 567.8,
            'members': 1245,
            'avg_points': 1856
        })(),
        type('obj', (), {
            'name': 'Phường Cam Ly',
            'city': 'Đà Lạt',
            'total_kg': 512.3,
            'members': 1180,
            'avg_points': 1742
        })(),
        type('obj', (), {
            'name': 'Phường Lâm Viên',
            'city': 'Đà Lạt',
            'total_kg': 489.2,
            'members': 980,
            'avg_points': 1598
        })(),
       
    ]
    
    # ⭐ TOP TRƯỜNG HỌC - ĐÀ LẠT
    top_schools = [
        type('obj', (), {
            'name': 'THPT Trần Phú',
            'city': 'Đà Lạt',
            'total_kg': 245.5,
            'members': 450,
            'avg_points': 1856
        })(),
        type('obj', (), {
            'name': 'THPT Tây Sơn',
            'city': 'Đà Lạt',
            'total_kg': 223.8,
            'members': 380,
            'avg_points': 1742
        })(),
        type('obj', (), {
            'name': 'THPT Lê Quý Đôn',
            'city': 'Đà Lạt',
            'total_kg': 198.3,
            'members': 420,
            'avg_points': 1598
        })(),
        
    ]
    
    top_classes = []
    
    return render_template('admin/rankings.html',
                         rankings=rankings,
                         top_schools=top_schools,
                         top_classes=top_classes,
                         top_areas=top_areas)

@app.route('/admin/rewards')
@login_required
def admin_rewards():
    rewards = Reward.query.all()
    
    # ⭐ DATA ĐA DẠNG MẶT HÀNG
    if not rewards:
        rewards = []
        fake_rewards_data = [
            {
                'name': 'Voucher Shopee 50k',
                'description': 'Mã giảm giá Shopee trị giá 50.000đ - Áp dụng cho đơn từ 100k',
                'category': 'voucher',
                'points_required': 500,
                'stock': 50,
                'redeemed_count': 125,
                'image': 'https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/voucher_shopee_hom_nay_thumb_aba00454b4.jpg',
                'is_featured': True
            },
            {
                'name': 'Thẻ cào Viettel 100k',
                'description': 'Thẻ cào điện thoại Viettel mệnh giá 100.000đ - Giao trong 1 phút',
                'category': 'digital',
                'points_required': 1000,
                'stock': 30,
                'redeemed_count': 89,
                'image': 'https://www.gamecardsvn.com/img/97428',
                'is_featured': True
            },
            {
                'name': 'Bình giữ nhiệt GreenSpring 500ml',
                'description': 'Bình giữ nhiệt inox 304 cao cấp - Giữ nhiệt 12h, giữ lạnh 24h',
                'category': 'product',
                'points_required': 1500,
                'stock': 15,
                'redeemed_count': 45,
                'image': 'https://homemart247.com/wp-content/uploads/2024/01/Bo-ly-Reduce-1l9-600x600.jpg',
                'is_featured': False
            },
            {
                'name': 'Túi vải canvas GreenSpring',
                'description': 'Túi vải canvas thân thiện môi trường - Kích thước 35x40cm',
                'category': 'product',
                'points_required': 800,
                'stock': 10,
                'redeemed_count': 210,
                'image': 'https://yvesrocher.vn/media/catalog/product/cache/a7cc7342a2f92a295dcb391475ae6446/t/o/tote-th_ng.jpg',
                'is_featured': False
            },
            {
                'name': 'Voucher Grab Food 100k',
                'description': 'Mã giảm giá Grab Food 100.000đ - Áp dụng cho đơn từ 150k',
                'category': 'voucher',
                'points_required': 1000,
                'stock': 0,
                'redeemed_count': 67,
                'image': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400',
                'is_featured': True
            },
            {
                'name': 'Cây xanh mini văn phòng',
                'description': 'Cây sen đá mini trang trí bàn làm việc - Dễ chăm sóc',
                'category': 'product',
                'points_required': 600,
                'stock': 8,
                'redeemed_count': 34,
                'image': 'https://images.unsplash.com/photo-1459156212016-c812468e2115?w=400',
                'is_featured': False
            },
            {
                'name': 'Thẻ cào Vinaphone 50k',
                'description': 'Thẻ cào điện thoại Vinaphone mệnh giá 50.000đ',
                'category': 'digital',
                'points_required': 500,
                'stock': 45,
                'redeemed_count': 92,
                'image': 'https://vn-test-11.slatic.net/p/fc9f3dd2b2649dcb7a7f90ea0d2b488f.jpg',
                'is_featured': False
            },
            {
                'name': 'Voucher The Coffee House 50k',
                'description': 'Phiếu quà tặng The Coffee House trị giá 50.000đ',
                'category': 'voucher',
                'points_required': 550,
                'stock': 20,
                'redeemed_count': 78,
                'image': 'https://img.giftpop.vn/brand/THECOFFEEHOUSE/MP2302200011_BASIC_origin.jpg',
                'is_featured': True
            },
            {
                'name': 'Bộ đũa tre GreenSpring',
                'description': 'Bộ 5 đôi đũa tre tự nhiên kèm hộp đựng - An toàn sức khỏe',
                'category': 'product',
                'points_required': 700,
                'stock': 12,
                'redeemed_count': 56,
                'image': 'https://trevietxanh.com/wp-content/uploads/2025/05/Dua-tre.jpg',
                'is_featured': False
            },
            {
                'name': 'Thẻ cào Mobifone 100k',
                'description': 'Thẻ cào điện thoại Mobifone mệnh giá 100.000đ',
                'category': 'digital',
                'points_required': 1000,
                'stock': 35,
                'redeemed_count': 102,
                'image': 'https://www.gamecardsvn.com/img/82655',
                'is_featured': False
            },
            {
                'name': 'Voucher Highlands Coffee 100k',
                'description': 'Phiếu quà tặng Highlands Coffee trị giá 100.000đ',
                'category': 'voucher',
                'points_required': 1100,
                'stock': 18,
                'redeemed_count': 43,
                'image': 'https://img.giftpop.vn/brand/HIGHLANDS/MP2208180064_BASIC_origin.jpg',
                'is_featured': False
            },
            {
                'name': 'Ống hút inox GreenSpring',
                'description': 'Bộ 4 ống hút inox kèm cọ rửa - Bảo vệ môi trường',
                'category': 'product',
                'points_required': 450,
                'stock': 22,
                'redeemed_count': 89,
                'image': 'https://laxanh.net/wp-content/uploads/2019/07/ong-hut-qua-tang.jpg',
                'is_featured': False
            },
        ]
        
        for data in fake_rewards_data:
            reward = type('obj', (), data)()
            rewards.append(reward)
    
    rewards_stats = {
        'total_rewards': len(rewards),
        'redeemed': sum(r.redeemed_count for r in rewards),
        'total_points_used': sum(r.points_required * r.redeemed_count for r in rewards),
        'out_of_stock': sum(1 for r in rewards if r.stock <= 0)
    }
    
    # ⭐ LỊCH SỬ ĐỔI QUÀ
    recent_redemptions = [
        {
            'created_at': '27/12/2025 16:45',
            'user_name': 'Nguyễn Văn An',
            'user_avatar': 'https://randomuser.me/api/portraits/men/32.jpg',
            'reward_name': 'Voucher Shopee 50k',
            'points_used': 500,
            'status': 'pending',
            'status_text': 'Chờ xác nhận'
        },
        {
            'created_at': '27/12/2025 16:30',
            'user_name': 'Trần Thị Bảo',
            'user_avatar': 'https://randomuser.me/api/portraits/women/44.jpg',
            'reward_name': 'Thẻ cào Viettel 100k',
            'points_used': 1000,
            'status': 'completed',
            'status_text': 'Đã giao'
        },
        {
            'created_at': '27/12/2025 16:15',
            'user_name': 'Lê Minh Chiến',
            'user_avatar': 'https://randomuser.me/api/portraits/men/54.jpg',
            'reward_name': 'Bình giữ nhiệt GreenSpring',
            'points_used': 1500,
            'status': 'processing',
            'status_text': 'Đang xử lý'
        },
        {
            'created_at': '27/12/2025 16:00',
            'user_name': 'Phạm Thu Duyên',
            'user_avatar': 'https://randomuser.me/api/portraits/women/68.jpg',
            'reward_name': 'Voucher Grab Food 100k',
            'points_used': 1000,
            'status': 'completed',
            'status_text': 'Đã giao'
        },
        {
            'created_at': '27/12/2025 15:45',
            'user_name': 'Hoàng Minh Em',
            'user_avatar': 'https://randomuser.me/api/portraits/men/75.jpg',
            'reward_name': 'Cây xanh mini',
            'points_used': 600,
            'status': 'cancelled',
            'status_text': 'Đã hủy'
        },
    ]
    
    return render_template('admin/rewards.html',
                         rewards=rewards,
                         rewards_stats=rewards_stats,
                         recent_redemptions=recent_redemptions)


@app.route('/admin/badges')
@login_required
def admin_badges():
    badges = Badge.query.all()
    
    # ⭐ TẠO FAKE DATA NẾU CHƯA CÓ
    if not badges:
        badges = []
        fake_badges_data = [
            {
                'name': 'Người tiên phong',
                'icon': 'fa-seedling',
                'color': '#10B981',
                'description': 'Người dùng đầu tiên tham gia hệ thống GreenSpring',
                'requirement': 'Đăng ký tài khoản và hoàn thành profile',
                'rarity': 'common',
                'earned_count': 245,
                'earn_rate': 85
            },
            {
                'name': 'Chiến binh xanh',
                'icon': 'fa-recycle',
                'color': '#3B82F6',
                'description': 'Phân loại thành công 100kg rác tái chế',
                'requirement': 'Đạt 100kg rác tái chế được phân loại',
                'rarity': 'rare',
                'earned_count': 89,
                'earn_rate': 31
            },
            {
                'name': 'Vô địch môi trường',
                'icon': 'fa-trophy',
                'color': '#F59E0B',
                'description': 'Đứng đầu bảng xếp hạng tháng',
                'requirement': 'Đạt TOP 1 bảng xếp hạng trong tháng',
                'rarity': 'epic',
                'earned_count': 12,
                'earn_rate': 4
            },
            {
                'name': 'Ngôi sao xanh',
                'icon': 'fa-star',
                'color': '#8B5CF6',
                'description': 'Duy trì streak 30 ngày liên tiếp',
                'requirement': 'Tham gia liên tục 30 ngày không nghỉ',
                'rarity': 'rare',
                'earned_count': 45,
                'earn_rate': 16
            },
            {
                'name': 'Trái tim xanh',
                'icon': 'fa-heart',
                'color': '#EC4899',
                'description': 'Huy hiệu đặc biệt cho người có đóng góp xuất sắc',
                'requirement': 'Được ban tổ chức trao tặng',
                'rarity': 'legendary',
                'earned_count': 3,
                'earn_rate': 1
            },
            {
                'name': 'Streak Master',
                'icon': 'fa-fire',
                'color': '#EF4444',
                'description': 'Hoàn thành 50 ngày streak liên tiếp',
                'requirement': '50 ngày tham gia liên tục',
                'rarity': 'epic',
                'earned_count': 23,
                'earn_rate': 8
            },
            {
                'name': 'Eco Guardian',
                'icon': 'fa-shield-alt',
                'color': '#10B981',
                'description': 'Phân loại chính xác 500 lượt quét',
                'requirement': '500 lượt quét với độ chính xác >95%',
                'rarity': 'rare',
                'earned_count': 67,
                'earn_rate': 23
            },
            {
                'name': 'Green Leader',
                'icon': 'fa-crown',
                'color': '#F59E0B',
                'description': 'Dẫn đầu chiến dịch môi trường',
                'requirement': 'Đạt TOP 1 trong 1 chiến dịch',
                'rarity': 'legendary',
                'earned_count': 8,
                'earn_rate': 3
            },
            {
    'name': 'Planet Saver',
    'icon': 'fa-globe-asia',
    'color': '#06B6D4',
    'description': 'Bảo vệ hành tinh xanh với 1000 lượt phân loại',
    'requirement': 'Hoàn thành 1000 lượt quét thành công',
    'rarity': 'epic',
    'earned_count': 18,
    'earn_rate': 6
},

        ]
        
        for data in fake_badges_data:
            badge = type('obj', (), data)()
            badges.append(badge)
    
    # ⭐ PHÂN LOẠI BADGES
    badges_by_category = {
        'participation': [],
        'achievement': [],
        'special': [],
        'rank': []
    }
    
    # Phân loại đơn giản (có thể thêm logic phức tạp hơn)
    for badge in badges:
        category = getattr(badge, 'category', 'achievement')
        if category in badges_by_category:
            badges_by_category[category].append(badge)
        else:
            badges_by_category['achievement'].append(badge)
    
    return render_template('admin/badges.html',
                         badges=badges,
                         badges_by_category=badges_by_category)


@app.route('/admin/statistics')
@login_required
def admin_statistics():
    # ⭐ FAKE DATA ĐẦY ĐỦ
    stats = {
        'total_users': User.query.count() or 287,
        'total_waste_kg': 1856.5,
        'total_scans': 3421,
        'avg_accuracy': 92.5,
        'user_growth': 12,
        'waste_growth': 8.5,
        'scan_growth': 24,
        'accuracy_change': 0.5
    }
    
    # ⭐ THỐNG KÊ THEO KHU VỰC - ĐÀ LẠT
    stats_by_location = [
        {
            'name': 'Phường Xuân Hương',
            'users': 78,
            'total_kg': 456.8,
            'scans': 892,
            'accuracy': 94
        },
        {
            'name': 'Phường Cam Ly',
            'users': 65,
            'total_kg': 398.2,
            'scans': 756,
            'accuracy': 91
        },
        {
            'name': 'Phường Lâm Viên',
            'users': 52,
            'total_kg': 312.5,
            'scans': 623,
            'accuracy': 93
        },
        {
            'name': 'Phường Xuân Trường',
            'users': 48,
            'total_kg': 289.3,
            'scans': 587,
            'accuracy': 90
        },
        {
            'name': 'Phường Lang Biang',
            'users': 44,
            'total_kg': 267.7,
            'scans': 563,
            'accuracy': 92
        },
        {
            'name': 'Phường Đà Lạt',
            'users': 35,
            'total_kg': 198.4,
            'scans': 412,
            'accuracy': 89
        },
    ]
    
    # ⭐ THỐNG KÊ THEO LOẠI RÁC
    stats_by_category = [
        {
            'name': 'Nhựa',
            'type': 'plastic',
            'total_kg': 678.4,
            'percentage': 36.5,
            'scans': 1245,
            'co2_saved': 1356.8
        },
        {
            'name': 'Giấy',
            'type': 'paper',
            'total_kg': 512.3,
            'percentage': 27.6,
            'scans': 987,
            'co2_saved': 1024.6
        },
        {
            'name': 'Kim loại',
            'type': 'metal',
            'total_kg': 389.2,
            'percentage': 21.0,
            'scans': 645,
            'co2_saved': 778.4
        },
        {
            'name': 'Thủy tinh',
            'type': 'glass',
            'total_kg': 276.6,
            'percentage': 14.9,
            'scans': 544,
            'co2_saved': 553.2
        },
    ]
    
    start_date = (datetime.utcnow() - timedelta(days=30)).strftime('%Y-%m-%d')
    end_date = datetime.utcnow().strftime('%Y-%m-%d')
    
    return render_template('admin/statistics.html',
                         stats=stats,
                         stats_by_location=stats_by_location,
                         stats_by_category=stats_by_category,
                         start_date=start_date,
                         end_date=end_date)

@app.route('/admin/campaigns')
@login_required
def admin_campaigns():
    # ⭐ FAKE DATA CHIẾN DỊCH
    fake_campaigns = [
        {
            'name': 'Tháng Hành động Vì Môi trường',
            'slogan': 'Cùng nhau xây dựng Đà Lạt xanh - sạch - đẹp',
            'status': 'active',
            'color_start': '#10B981',
            'color_end': '#059669',
            'start_date': datetime(2025, 12, 1),
            'end_date': datetime(2025, 12, 31),
            'participants': 156,
            'total_kg': 1245.5,
            'points_awarded': 24890,
            'progress': 83,
            'current_kg': 1245.5,
            'goal_kg': 1500,
            'rewards': ['Điểm x2', 'Huy hiệu đặc biệt', 'Voucher 200k']
        },
        {
            'name': 'Tuần lễ Giảm Thiểu Nhựa',
            'slogan': 'Nói không với túi nilon - Chọn sống xanh',
            'status': 'active',
            'color_start': '#3B82F6',
            'color_end': '#2563EB',
            'start_date': datetime(2025, 12, 20),
            'end_date': datetime(2025, 12, 27),
            'participants': 89,
            'total_kg': 456.8,
            'points_awarded': 9136,
            'progress': 61,
            'current_kg': 456.8,
            'goal_kg': 750,
            'rewards': ['Túi vải canvas', 'Điểm +500', 'Huy hiệu Eco']
        },
        {
            'name': 'Thử thách Năm Mới Xanh',
            'slogan': '365 ngày - Mỗi ngày 1 hành động',
            'status': 'upcoming',
            'color_start': '#F59E0B',
            'color_end': '#D97706',
            'start_date': datetime(2026, 1, 1),
            'end_date': datetime(2026, 1, 31),
            'participants': 0,
            'total_kg': 0,
            'points_awarded': 0,
            'progress': 0,
            'current_kg': 0,
            'goal_kg': 2000,
            'rewards': ['Điểm x3', 'Quà tặng đặc biệt', 'Cúp vô địch']
        },
        {
            'name': 'Chiến dịch Thu gom Pin cũ',
            'slogan': 'Pin an toàn - Môi trường bền vững',
            'status': 'ended',
            'color_start': '#8B5CF6',
            'color_end': '#7C3AED',
            'start_date': datetime(2025, 11, 1),
            'end_date': datetime(2025, 11, 30),
            'participants': 234,
            'total_kg': 1876.3,
            'points_awarded': 37526,
            'progress': 100,
            'current_kg': 1876.3,
            'goal_kg': 1500,
            'rewards': ['Huy hiệu vàng', 'Điểm +1000', 'Giấy khen']
        },
    ]
    
    # ⭐ TOP PARTICIPANTS
    fake_top_participants = [
        {
            'name': 'Nguyễn Văn An',
            'avatar': 'https://randomuser.me/api/portraits/men/32.jpg',
            'campaign_name': 'Tháng Hành động Vì Môi trường',
            'contribution_kg': 234.5,
            'points_earned': 4690,
            'progress': 94
        },
        {
            'name': 'Trần Thị Bảo',
            'avatar': 'https://randomuser.me/api/portraits/women/44.jpg',
            'campaign_name': 'Tuần lễ Giảm Thiểu Nhựa',
            'contribution_kg': 189.2,
            'points_earned': 3784,
            'progress': 88
        },
        {
            'name': 'Lê Minh Chiến',
            'avatar': 'https://randomuser.me/api/portraits/men/54.jpg',
            'campaign_name': 'Tháng Hành động Vì Môi trường',
            'contribution_kg': 167.8,
            'points_earned': 3356,
            'progress': 82
        },
        {
            'name': 'Phạm Thu Duyên',
            'avatar': 'https://randomuser.me/api/portraits/women/68.jpg',
            'campaign_name': 'Tuần lễ Giảm Thiểu Nhựa',
            'contribution_kg': 145.3,
            'points_earned': 2906,
            'progress': 76
        },
        {
            'name': 'Hoàng Minh Em',
            'avatar': 'https://randomuser.me/api/portraits/men/75.jpg',
            'campaign_name': 'Tháng Hành động Vì Môi trường',
            'contribution_kg': 123.6,
            'points_earned': 2472,
            'progress': 71
        },
    ]
    
    # Phân loại campaigns
    campaigns_active = [c for c in fake_campaigns if c['status'] == 'active']
    campaigns_upcoming = [c for c in fake_campaigns if c['status'] == 'upcoming']
    campaigns_ended = [c for c in fake_campaigns if c['status'] == 'ended']
    
    return render_template('admin/campaigns.html',
                         campaigns=fake_campaigns,
                         campaigns_active=campaigns_active,
                         campaigns_upcoming=campaigns_upcoming,
                         campaigns_ended=campaigns_ended,
                         top_participants=fake_top_participants)


@app.route('/admin/collection-points')
@login_required
def admin_collection_points():
    # ⭐ FAKE DATA ĐIỂM THU GOM ĐÀ LẠT - MỞ RỘNG
    fake_collection_points = [
        # === KHU VỰC TRUNG TÂM ===
        {
            'id': 1,
            'name': 'Trung tâm Thu gom Xuân Hương',
            'icon': 'fa-recycle',
            'type': 'general',
            'type_name': 'Tái chế chung',
            'address': '123 Trần Phú, P. Xuân Hương',
            'area': 'Đà Lạt',
            'status': 'active',
            'capacity_percent': 45,
            'usage_count': 1245,
            'lat': 11.9404,
            'lng': 108.4383
        },
        {
            'id': 2,
            'name': 'Điểm thu gom Chợ Đà Lạt',
            'icon': 'fa-shopping-basket',
            'type': 'general',
            'type_name': 'Tái chế chung',
            'address': 'Nguyễn Thị Minh Khai, P. Cam Ly',
            'area': 'Đà Lạt',
            'status': 'active',
            'capacity_percent': 78,
            'usage_count': 2156,
            'lat': 11.9380,
            'lng': 108.4400
        },
        {
            'id': 3,
            'name': 'Trạm thu gom Hồ Xuân Hương',
            'icon': 'fa-leaf',
            'type': 'organic',
            'type_name': 'Rác hữu cơ',
            'address': 'Đường Trần Quốc Toản',
            'area': 'Đà Lạt',
            'status': 'active',
            'capacity_percent': 34,
            'usage_count': 876,
            'lat': 11.9338,
            'lng': 108.4424
        },
        
        # === ĐẠI HỌC ĐÀ LẠT - NHIỀU ĐIỂM ===
        {
            'id': 4,
            'name': 'ĐH Đà Lạt - Cổng chính',
            'icon': 'fa-graduation-cap',
            'type': 'general',
            'type_name': 'Tái chế chung',
            'address': 'Cổng chính, Phù Đổng Thiên Vương',
            'area': 'Đà Lạt',
            'status': 'active',
            'capacity_percent': 82,
            'usage_count': 3421,
            'lat': 11.9525,
            'lng': 108.4381
        },
        {
            'id': 5,
            'name': 'ĐH Đà Lạt - Thư viện',
            'icon': 'fa-book',
            'type': 'general',
            'type_name': 'Tái chế chung',
            'address': 'Thư viện Trường ĐH Đà Lạt',
            'area': 'Đà Lạt',
            'status': 'active',
            'capacity_percent': 56,
            'usage_count': 2134,
            'lat': 11.9530,
            'lng': 108.4390
        },
        {
            'id': 6,
            'name': 'ĐH Đà Lạt - Ký túc xá A',
            'icon': 'fa-building',
            'type': 'general',
            'type_name': 'Tái chế chung',
            'address': 'Ký túc xá A, ĐH Đà Lạt',
            'area': 'Đà Lạt',
            'status': 'active',
            'capacity_percent': 91,
            'usage_count': 4567,
            'lat': 11.9518,
            'lng': 108.4395
        },
        {
            'id': 7,
            'name': 'ĐH Đà Lạt - Ký túc xá B',
            'icon': 'fa-building',
            'type': 'general',
            'type_name': 'Tái chế chung',
            'address': 'Ký túc xá B, ĐH Đà Lạt',
            'area': 'Đà Lạt',
            'status': 'full',
            'capacity_percent': 95,
            'usage_count': 4890,
            'lat': 11.9522,
            'lng': 108.4402
        },
        {
            'id': 8,
            'name': 'ĐH Đà Lạt - Khoa Công nghệ',
            'icon': 'fa-laptop-code',
            'type': 'hazardous',
            'type_name': 'Rác nguy hại',
            'address': 'Khoa CNTT, ĐH Đà Lạt',
            'area': 'Đà Lạt',
            'status': 'active',
            'capacity_percent': 43,
            'usage_count': 1876,
            'lat': 11.9535,
            'lng': 108.4385
        },
        {
            'id': 9,
            'name': 'ĐH Đà Lạt - Khoa Nông nghiệp',
            'icon': 'fa-seedling',
            'type': 'organic',
            'type_name': 'Rác hữu cơ',
            'address': 'Khoa Nông nghiệp, ĐH Đà Lạt',
            'area': 'Đà Lạt',
            'status': 'active',
            'capacity_percent': 38,
            'usage_count': 1543,
            'lat': 11.9540,
            'lng': 108.4395
        },
        {
            'id': 10,
            'name': 'ĐH Đà Lạt - Căng tin trung tâm',
            'icon': 'fa-utensils',
            'type': 'organic',
            'type_name': 'Rác hữu cơ',
            'address': 'Căng tin, ĐH Đà Lạt',
            'area': 'Đà Lạt',
            'status': 'active',
            'capacity_percent': 88,
            'usage_count': 5234,
            'lat': 11.9528,
            'lng': 108.4388
        },
        {
            'id': 11,
            'name': 'ĐH Đà Lạt - Sân vận động',
            'icon': 'fa-futbol',
            'type': 'general',
            'type_name': 'Tái chế chung',
            'address': 'Sân vận động, ĐH Đà Lạt',
            'area': 'Đà Lạt',
            'status': 'active',
            'capacity_percent': 52,
            'usage_count': 2341,
            'lat': 11.9515,
            'lng': 108.4375
        },
        {
            'id': 12,
            'name': 'ĐH Đà Lạt - Giảng đường A',
            'icon': 'fa-chalkboard-teacher',
            'type': 'general',
            'type_name': 'Tái chế chung',
            'address': 'Giảng đường A, ĐH Đà Lạt',
            'area': 'Đà Lạt',
            'status': 'active',
            'capacity_percent': 67,
            'usage_count': 2987,
            'lat': 11.9533,
            'lng': 108.4378
        },
        {
            'id': 13,
            'name': 'ĐH Đà Lạt - Giảng đường B',
            'icon': 'fa-school',
            'type': 'general',
            'type_name': 'Tái chế chung',
            'address': 'Giảng đường B, ĐH Đà Lạt',
            'area': 'Đà Lạt',
            'status': 'active',
            'capacity_percent': 71,
            'usage_count': 3156,
            'lat': 11.9537,
            'lng': 108.4383
        },
        {
            'id': 14,
            'name': 'ĐH Đà Lạt - Khu thực hành',
            'icon': 'fa-flask',
            'type': 'hazardous',
            'type_name': 'Rác nguy hại',
            'address': 'Phòng thí nghiệm, ĐH Đà Lạt',
            'area': 'Đà Lạt',
            'status': 'active',
            'capacity_percent': 29,
            'usage_count': 876,
            'lat': 11.9542,
            'lng': 108.4392
        },
        
        # === KHU VỰC KHÁC ===
        {
            'id': 15,
            'name': 'Trung tâm Thu gom Cam Ly',
            'icon': 'fa-industry',
            'type': 'hazardous',
            'type_name': 'Rác nguy hại',
            'address': '56 Hoàng Văn Thụ, P. Cam Ly',
            'area': 'Đà Lạt',
            'status': 'active',
            'capacity_percent': 23,
            'usage_count': 456,
            'lat': 11.9290,
            'lng': 108.4450
        },
        {
            'id': 16,
            'name': 'Điểm thu gom Bệnh viện Lâm Đồng',
            'icon': 'fa-hospital',
            'type': 'hazardous',
            'type_name': 'Rác nguy hại',
            'address': 'Đường 3 Tháng 4, P. Xuân Hương',
            'area': 'Đà Lạt',
            'status': 'maintenance',
            'capacity_percent': 12,
            'usage_count': 234,
            'lat': 11.9455,
            'lng': 108.4370
        },
        {
            'id': 17,
            'name': 'Trạm thu gom Vườn Hoa Thành Phố',
            'icon': 'fa-tree',
            'type': 'organic',
            'type_name': 'Rác hữu cơ',
            'address': 'Trần Quốc Toản, P. Xuân Hương',
            'area': 'Đà Lạt',
            'status': 'active',
            'capacity_percent': 56,
            'usage_count': 987,
            'lat': 11.9370,
            'lng': 108.4410
        },
        {
            'id': 18,
            'name': 'Điểm thu gom KDC Lâm Viên',
            'icon': 'fa-home',
            'type': 'general',
            'type_name': 'Tái chế chung',
            'address': 'Khu dân cư Lâm Viên, P. Lâm Viên',
            'area': 'Đà Lạt',
            'status': 'active',
            'capacity_percent': 67,
            'usage_count': 1532,
            'lat': 11.9500,
            'lng': 108.4400
        },
        {
            'id': 19,
            'name': 'Điểm thu gom Linh Phương',
            'icon': 'fa-recycle',
            'type': 'general',
            'type_name': 'Tái chế chung',
            'address': 'Phường Linh Phương',
            'area': 'Đà Lạt',
            'status': 'active',
            'capacity_percent': 41,
            'usage_count': 1123,
            'lat': 11.9260,
            'lng': 108.4320
        },
        {
            'id': 20,
            'name': 'Trạm thu gom Hòa Bình',
            'icon': 'fa-dumpster',
            'type': 'general',
            'type_name': 'Tái chế chung',
            'address': 'Phường Hòa Bình',
            'area': 'Đà Lạt',
            'status': 'active',
            'capacity_percent': 59,
            'usage_count': 1876,
            'lat': 11.9480,
            'lng': 108.4510
        },
        {
            'id': 21,
            'name': 'Điểm thu gom Công viên Yersin',
            'icon': 'fa-leaf',
            'type': 'organic',
            'type_name': 'Rác hữu cơ',
            'address': 'Công viên Yersin',
            'area': 'Đà Lạt',
            'status': 'active',
            'capacity_percent': 48,
            'usage_count': 1345,
            'lat': 11.9365,
            'lng': 108.4395
        },
        {
            'id': 22,
            'name': 'Trung tâm Thu gom Khu Hòa Bình',
            'icon': 'fa-warehouse',
            'type': 'general',
            'type_name': 'Tái chế chung',
            'address': 'Khu Hòa Bình, Đà Lạt',
            'area': 'Đà Lạt',
            'status': 'active',
            'capacity_percent': 73,
            'usage_count': 2654,
            'lat': 11.9470,
            'lng': 108.4520
        },
        {
            'id': 23,
            'name': 'Điểm thu gom Khu du lịch Hồ Than Thở',
            'icon': 'fa-umbrella-beach',
            'type': 'general',
            'type_name': 'Tái chế chung',
            'address': 'Hồ Than Thở',
            'area': 'Đà Lạt',
            'status': 'active',
            'capacity_percent': 35,
            'usage_count': 876,
            'lat': 11.9310,
            'lng': 108.4480
        },
        {
            'id': 24,
            'name': 'Trạm thu gom Quảng trường Lâm Viên',
            'icon': 'fa-monument',
            'type': 'general',
            'type_name': 'Tái chế chung',
            'address': 'Quảng trường Lâm Viên',
            'area': 'Đà Lạt',
            'status': 'active',
            'capacity_percent': 62,
            'usage_count': 1987,
            'lat': 11.9420,
            'lng': 108.4360
        },
        {
            'id': 25,
            'name': 'Điểm thu gom Ga Đà Lạt',
            'icon': 'fa-train',
            'type': 'general',
            'type_name': 'Tái chế chung',
            'address': 'Ga Đà Lạt, Quang Trung',
            'area': 'Đà Lạt',
            'status': 'active',
            'capacity_percent': 54,
            'usage_count': 1654,
            'lat': 11.9350,
            'lng': 108.4420
        },
    ]
    
    points_stats = {
        'total': len(fake_collection_points),
        'active': sum(1 for p in fake_collection_points if p['status'] == 'active'),
        'pending': 0,
        'full': sum(1 for p in fake_collection_points if p['status'] == 'full')
    }
    
    return render_template('admin/collection_points.html',
                         collection_points=fake_collection_points,
                         points_stats=points_stats)



# ============================================
# PUBLIC ROUTES
# ============================================

@app.route('/')
def index():
    return render_template('index.html')

# ============================================
# DATABASE INITIALIZATION
# ============================================

def init_db():
    with app.app_context():
        db.create_all()
        
        # Create default admin
        if not Admin.query.filter_by(email='admin@greenspring.com').first():
            admin = Admin(
                name='Admin',
                email='admin@greenspring.com',
                password_hash=generate_password_hash('admin123')
            )
            db.session.add(admin)
            db.session.commit()
            print('✅ Default admin created: admin@greenspring.com / admin123')


if __name__ == '__main__':
    init_db()
    app.run(debug=True, port=5000)
