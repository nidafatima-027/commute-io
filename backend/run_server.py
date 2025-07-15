#!/usr/bin/env python3
"""
Development server runner for Commute.io Backend
"""
import uvicorn
import os
from app.main import app

if __name__ == "__main__":
    # Get port from environment or default to 8000
    port = int(os.getenv("PORT", 8000))
    
    print("🚀 Starting Commute.io Backend Server...")
    print(f"📍 Server will be available at: http://localhost:{port}")
    print(f"📚 API Documentation: http://localhost:{port}/docs")
    print(f"🔄 Auto-reload: Enabled")
    print("=" * 50)
    
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=port,
        reload=True,
        log_level="info"
    )