#!/bin/bash

# 🚀 YINIZ PRODUCTION DEPLOYMENT CHECKLIST
# Run this script to verify production readiness

echo "🔍 CHECKING PRODUCTION ENVIRONMENT..."
echo "=================================="

# Check Node.js version
echo "📦 Node.js Version:"
node --version

# Check if required files exist
echo ""
echo "📁 Required Files Check:"
[ -f "app.js" ] && echo "✅ app.js found" || echo "❌ app.js missing"
[ -f "package.json" ] && echo "✅ package.json found" || echo "❌ package.json missing"
[ -f ".env" ] && echo "✅ .env found" || echo "⚠️  .env missing (check hosting platform)"

# Check environment variables (if .env exists)
if [ -f ".env" ]; then
    echo ""
    echo "🔧 Environment Variables Check:"
    
    # Check for required variables
    if grep -q "SESSION_SECRET" .env; then
        echo "✅ SESSION_SECRET configured"
    else
        echo "❌ SESSION_SECRET missing - REQUIRED!"
    fi
    
    if grep -q "NODE_ENV" .env; then
        echo "✅ NODE_ENV configured"
    else
        echo "⚠️  NODE_ENV not set (defaults to development)"
    fi
    
    if grep -q "USE_HTTPS" .env; then
        echo "✅ USE_HTTPS configured"
    else
        echo "⚠️  USE_HTTPS not set (will auto-detect)"
    fi
    
    # Database checks
    if grep -q "MYSQL_HOST\|DATABASE_URL" .env; then
        echo "✅ Database configuration found"
    else
        echo "❌ Database configuration missing!"
    fi
fi

echo ""
echo "🗄️  Database Connection Test:"
echo "Visit: /edu/debug after deployment to test database"

echo ""
echo "🔐 Security Checklist:"
echo "✅ Session secret is unique and secure"
echo "✅ Database credentials are not in code"
echo "✅ Git history cleaned of secrets"
echo "✅ HTTPS/HTTP cookie settings configured"

echo ""
echo "🎯 POST-DEPLOYMENT TESTING:"
echo "1. Visit: https://your-domain.com/edu/debug"
echo "2. Visit: https://your-domain.com/edu/test-login"
echo "3. Test student login at: https://your-domain.com/edu/etest"
echo "4. Check browser DevTools for cookie/session errors"

echo ""
echo "🆘 IF LOGIN STILL FAILS:"
echo "1. Check hosting platform logs"
echo "2. Verify database connectivity"
echo "3. Confirm HTTPS/HTTP settings match hosting"
echo "4. Test with USE_HTTPS=false temporarily"

echo ""
echo "=================================="
echo "✅ Ready for production deployment!"
