import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Lock,
  Calendar,
  ChevronRight,
  UserCheck,
  ArrowLeft,
  MapPin,
  Crown,
  Shield,
  Check,
} from "lucide-react";

function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    dob: "",
    gender: "",
    address: "",
    fullName: "",
  });

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setError("");
  };

  const validateStep1 = () => {
    if (!formData.username.trim()) {
      setError("Vui lòng nhập tên người dùng");
      return false;
    }
    if (!formData.email.trim()) {
      setError("Vui lòng nhập email");
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      setError("Email không hợp lệ");
      return false;
    }
    if (!formData.phone.trim()) {
      setError("Vui lòng nhập số điện thoại");
      return false;
    }
    if (!formData.fullName.trim()) {
      setError("Vui lòng nhập họ và tên");
      return false;
    }
    if (!formData.address.trim()) {
      setError("Vui lòng nhập địa chỉ");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.password) {
      setError("Vui lòng nhập mật khẩu");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu không khớp");
      return false;
    }
    if (!formData.dob) {
      setError("Vui lòng chọn ngày sinh");
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const prevStep = () => {
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep2()) {
      return;
    }

    const { username, email, phone, password, dob, gender, address, fullName } =
      formData;

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/signup",
        {
          username: username.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          password,
          dob: new Date(dob).toISOString(),
          gender: gender || "other",
          address: address.trim(),
          fullName: fullName.trim(),
        }
      );

      if (response.status === 201) {
        setStep(3);

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      console.error("Error during signup", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Đã xảy ra lỗi. Vui lòng thử lại sau."
      );
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.3 } },
  };

  // Input component với vintage styling
  const VintageInput = ({ icon: Icon, label, ...props }) => (
    <motion.div variants={itemVariants} className="mb-6">
      <label className="flex items-center text-sm font-medium text-vintage-dark mb-2 vintage-serif vintage-input-label">
        <Icon size={16} className="mr-2 text-vintage-gold" />
        {label}
      </label>
      <input
        {...props}
        className="w-full p-4 border-2 border-vintage-accent/30 rounded-2xl bg-vintage-warm/50 focus:outline-none focus:ring-2 focus:ring-vintage-gold focus:border-vintage-gold transition-all duration-300 vintage-serif placeholder-vintage-neutral/60 backdrop-blur-sm"
      />
    </motion.div>
  );

  // Render form step 1
  const renderStep1 = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-2"
    >
      <motion.div variants={itemVariants} className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-vintage-gold to-vintage-accent rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-vintage-dark vintage-heading mb-2">
          Thông tin cá nhân
        </h3>
        <p className="text-vintage-neutral vintage-serif">
          Nhập thông tin của bạn để bắt đầu hành trình
        </p>
      </motion.div>

      <VintageInput
        icon={User}
        label="Tên người dùng"
        type="text"
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="Nhập tên người dùng của bạn"
      />

      <VintageInput
        icon={User}
        label="Họ và tên đầy đủ"
        type="text"
        name="fullName"
        value={formData.fullName}
        onChange={handleChange}
        placeholder="Nhập họ tên đầy đủ của bạn"
      />

      <VintageInput
        icon={Mail}
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="example@email.com"
      />

      <VintageInput
        icon={Phone}
        label="Số điện thoại"
        type="text"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        placeholder="Nhập số điện thoại của bạn"
      />

      <VintageInput
        icon={MapPin}
        label="Địa chỉ"
        type="text"
        name="address"
        value={formData.address}
        onChange={handleChange}
        placeholder="Nhập địa chỉ của bạn"
      />

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-50 text-red-600 text-sm rounded-2xl border-2 border-red-200 flex items-start vintage-serif"
        >
          <Shield className="h-5 w-5 mr-2 flex-shrink-0" />
          <span>{error}</span>
        </motion.div>
      )}

      <motion.div variants={itemVariants} className="mt-8">
        <button
          type="button"
          onClick={nextStep}
          className="w-full py-4 px-6 bg-gradient-to-r from-vintage-gold to-vintage-accent hover:from-vintage-accent hover:to-vintage-gold text-vintage-dark rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center text-lg vintage-heading group"
        >
          <span>Tiếp tục</span>
          <ChevronRight
            size={20}
            className="ml-2 group-hover:translate-x-1 transition-transform"
          />
        </button>
      </motion.div>
    </motion.div>
  );

  // Render form step 2
  const renderStep2 = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-2"
    >
      <motion.div variants={itemVariants} className="flex items-center mb-6">
        <button
          onClick={prevStep}
          className="text-vintage-neutral hover:text-vintage-gold transition p-2 rounded-full hover:bg-vintage-warm"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="ml-4 text-center flex-1">
          <div className="w-16 h-16 bg-gradient-to-r from-vintage-primary to-vintage-brown rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-vintage-dark vintage-heading mb-2">
            Bảo mật & Thông tin bổ sung
          </h3>
          <p className="text-vintage-neutral vintage-serif">
            Hoàn tất đăng ký tài khoản của bạn
          </p>
        </div>
      </motion.div>

      <VintageInput
        icon={Lock}
        label="Mật khẩu"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="••••••••"
      />

      <VintageInput
        icon={Lock}
        label="Xác nhận mật khẩu"
        type="password"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        placeholder="••••••••"
      />

      <VintageInput
        icon={Calendar}
        label="Ngày sinh"
        type="date"
        name="dob"
        value={formData.dob}
        onChange={handleChange}
      />

      <motion.div variants={itemVariants} className="mb-6">
        <label className="flex items-center text-sm font-medium text-vintage-dark mb-2 vintage-serif">
          <UserCheck size={16} className="mr-2 text-vintage-gold" />
          Giới tính
        </label>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="w-full p-4 border-2 border-vintage-accent/30 rounded-2xl bg-vintage-warm/50 focus:outline-none focus:ring-2 focus:ring-vintage-gold focus:border-vintage-gold transition-all duration-300 vintage-serif appearance-none"
        >
          <option value="">Chọn giới tính</option>
          <option value="male">Nam</option>
          <option value="female">Nữ</option>
          <option value="other">Khác</option>
        </select>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-50 text-red-600 text-sm rounded-2xl border-2 border-red-200 flex items-start vintage-serif"
        >
          <Shield className="h-5 w-5 mr-2 flex-shrink-0" />
          <span>{error}</span>
        </motion.div>
      )}

      <motion.div variants={itemVariants} className="mt-8">
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-4 px-6 bg-gradient-to-r from-vintage-primary to-vintage-brown hover:from-vintage-brown hover:to-vintage-primary text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center text-lg vintage-heading ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              <span>Đang đăng ký...</span>
            </>
          ) : (
            <>
              <Crown className="h-5 w-5 mr-2" />
              <span>Tạo tài khoản</span>
            </>
          )}
        </button>
      </motion.div>
    </motion.div>
  );

  // Render success step
  const renderSuccess = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-8"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
        className="w-24 h-24 bg-gradient-to-r from-vintage-gold to-vintage-accent mx-auto rounded-full flex items-center justify-center mb-6 shadow-golden"
      >
        <Check className="w-12 h-12 text-white" />
      </motion.div>
      <h3 className="text-3xl font-bold text-vintage-dark mb-4 vintage-heading">
        Chào mừng đến với Royal Fitness!
      </h3>
      <p className="text-vintage-neutral mb-6 vintage-serif text-lg">
        Tài khoản của bạn đã được tạo thành công. <br />
        Bạn sẽ được chuyển đến trang đăng nhập.
      </p>
      <div className="w-full h-2 bg-vintage-warm rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-vintage-gold to-vintage-accent"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 2 }}
        />
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-vintage-cream via-vintage-warm to-vintage-cream flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-32 h-32 bg-vintage-gold rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-vintage-accent rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-vintage-primary rounded-full blur-3xl opacity-30"></div>
      </div>

      <div className="w-full max-w-lg relative z-10">
        <div className="text-center mb-10">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-vintage-gold to-vintage-accent rounded-3xl blur-2xl opacity-30"></div>
            <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 border-2 border-vintage-gold/30">
              <h2 className="text-4xl font-bold text-vintage-primary vintage-heading">
                Royal Fitness Club
              </h2>
              <p className="mt-3 text-vintage-neutral vintage-serif text-lg">
                Tham gia cộng đồng fitness đẳng cấp hoàng gia
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="relative"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-vintage-gold/20 to-vintage-accent/20 rounded-3xl blur-xl"></div>
          <div className="relative bg-white/95 backdrop-blur-lg shadow-2xl rounded-3xl p-8 border-2 border-vintage-gold/20">
            <form onSubmit={handleSubmit}>
              {step === 1 && renderStep1()}
              {step === 2 && renderStep2()}
              {step === 3 && renderSuccess()}
            </form>

            {step !== 3 && (
              <div className="mt-8 text-center">
                <p className="text-vintage-neutral vintage-serif">
                  Đã có tài khoản?{" "}
                  <Link
                    to="/login"
                    className="text-vintage-gold font-semibold hover:text-vintage-accent transition-colors vintage-heading link-vintage"
                  >
                    Đăng nhập ngay
                  </Link>
                </p>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center text-sm text-vintage-neutral vintage-serif"
        >
          Bằng việc đăng ký, bạn đồng ý với{" "}
          <a href="#" className="link-vintage">
            Điều khoản dịch vụ
          </a>{" "}
          và{" "}
          <a href="#" className="link-vintage">
            Chính sách bảo mật
          </a>{" "}
          của chúng tôi.
        </motion.div>
      </div>
    </div>
  );
}

export default SignUp;
