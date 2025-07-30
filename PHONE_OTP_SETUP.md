# Phone OTP Setup Guide

## 🚀 Quick Start Commands

### **Step 1: Start Backend Server**
```bash
cd backend
python run_server.py
```

### **Step 2: Test Backend API (Optional)**
```bash
cd backend
python test_phone_otp.py
```

### **Step 3: Start Frontend (Expo)**
```bash
npx expo start
```

## 📱 Complete Flow Testing

### **Backend Testing:**
1. **Start the backend server** (Command 1 above)
2. **Run the test script** (Command 2 above) - This will send an OTP to your WhatsApp
3. **Check backend console** for OTP logs
4. **Check WhatsApp** for the OTP message

### **Frontend Testing:**
1. **Start Expo development server** (Command 3 above)
2. **Open Expo Go app** on your phone
3. **Scan the QR code** to open the app
4. **Navigate to signup screen**
5. **Click "Continue with Phone"**
6. **Enter your phone number** (e.g., 03363109779)
7. **Click "Next"**
8. **Check your WhatsApp** for the OTP
9. **Enter the OTP** in the app
10. **Verify authentication** works

## 🔧 Configuration Details

### **Backend Configuration:**
- **API Base URL**: `http://localhost:8000/api`
- **WhatsApp Integration**: UltraMsg API
- **OTP Expiry**: 5 minutes
- **Phone Validation**: Pakistani numbers only (+92)
- **Development Mode**: Logs OTPs to console + sends WhatsApp

### **Frontend Configuration:**
- **API Base URL**: Automatically detects localhost:8000
- **Phone Format**: 03XX-XXXXXXX (converts to +923XX-XXXXXXX)
- **Error Handling**: Comprehensive error messages

## 📋 API Endpoints

### **Send OTP:**
- **URL**: `POST /api/auth/send-mobile-otp`
- **Payload**: `{"phone": "+923363109779"}`
- **Response**: `{"message": "OTP processed successfully"}`

### **Verify OTP:**
- **URL**: `POST /api/auth/verify-mobile-otp`
- **Payload**: `{"phone": "+923363109779", "otp": "123456"}`
- **Response**: `{"access_token": "...", "is_new_user": true, ...}`

## 🐛 Troubleshooting

### **Backend Issues:**
1. **Server not starting:**
   ```bash
   cd backend
   pip install -r requirements.txt
   python run_server.py
   ```

2. **API not responding:**
   - Check if server is running on port 8000
   - Verify API endpoints with `/api/health`

3. **WhatsApp not sending:**
   - Check UltraMsg credentials
   - Verify phone number format (+92)
   - Check backend console for error logs

### **Frontend Issues:**
1. **Cannot connect to backend:**
   - Ensure backend is running on localhost:8000
   - Check network connectivity
   - Verify API base URL in `services/api.ts`

2. **Phone validation errors:**
   - Enter phone in format: 03XX-XXXXXXX
   - Ensure it's a Pakistani number

3. **OTP not received:**
   - Check WhatsApp for message
   - Check backend console for OTP log
   - Verify phone number is correct

## ✅ Success Indicators

### **Backend Success:**
- Server starts without errors
- API endpoints respond with 200 status
- OTP logs appear in console
- WhatsApp messages sent successfully

### **Frontend Success:**
- App loads without errors
- Phone number validation works
- OTP request sends successfully
- OTP verification completes
- User authentication works

## 📞 Support

If you encounter issues:
1. Check backend console for error logs
2. Verify WhatsApp message delivery
3. Test API endpoints manually
4. Ensure all dependencies are installed

---

**Status**: ✅ Ready for Testing
**Last Updated**: January 2025 