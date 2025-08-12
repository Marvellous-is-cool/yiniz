# 🚨 PRODUCTION LOGIN ISSUES - TROUBLESHOOTING GUIDE

## Problem: Students can't login in production (page refreshes/reloads)

### Quick Diagnosis Steps:

1. **Check Debug Info**
   - Visit: `https://your-domain.com/edu/debug`
   - Look for session configuration and environment settings

2. **Test Login**  
   - Visit: `https://your-domain.com/edu/test-login`
   - Try the simple test form first

### Common Causes & Solutions:

## 🔐 **Issue 1: HTTPS/Cookie Security**
**Symptoms:** Login works locally but fails in production

**Cause:** Production uses HTTPS but session cookies are set incorrectly

**Solution:** Set environment variable:
```bash
USE_HTTPS=true  # If your site uses HTTPS
USE_HTTPS=false # If your site uses HTTP (some free hosting)
```

## 🗄️ **Issue 2: Database Connection**
**Symptoms:** "Session not found" or database errors

**Solution:** Check production database settings in `.env`:
```bash
# For hosted databases (Aiven, PlanetScale, etc.)
DATABASE_URL=mysql://user:pass@host:port/database

# OR traditional format:
MYSQL_HOST=your-host
MYSQL_USER=your-user  
MYSQL_PASSWORD=your-password
MYSQL_DATABASE=yiniz_db
```

## ⚙️ **Issue 3: Environment Variables**
**Must have in production:**
```bash
NODE_ENV=production
SESSION_SECRET=your-unique-secret-key
USE_HTTPS=true  # or false based on your hosting
```

## 🏗️ **Issue 4: Session Storage** 
**For production with multiple servers:**
- Database session storage is enabled automatically
- Memory storage works for single instance only

### Step-by-Step Fix:

1. **Update Environment Variables:**
```bash
NODE_ENV=production
USE_HTTPS=true  # Change to false if using HTTP
SESSION_SECRET=your-super-secret-key
```

2. **Check Database Connection:**
```bash
# Test database connectivity
mysql -h your-host -u your-user -p your-database
```

3. **Verify HTTPS Settings:**
- If site uses HTTPS → `USE_HTTPS=true`
- If site uses HTTP → `USE_HTTPS=false`

4. **Deploy Updated Configuration**

### Production-Specific Settings Already Applied:

✅ **Flexible Cookie Security** - Adapts to HTTP/HTTPS
✅ **SameSite Policy** - Prevents CSRF attacks  
✅ **Custom Session Name** - Avoids conflicts
✅ **Database Session Store** - Scales across servers

### Testing Checklist:

- [ ] Visit `/edu/debug` - Check environment config
- [ ] Visit `/edu/test-login` - Test simple login form
- [ ] Check browser DevTools → Network → Check for session cookies
- [ ] Check server logs for database connection errors
- [ ] Verify environment variables are loaded correctly

### If Still Not Working:

1. Check hosting platform documentation for session/cookie requirements
2. Some platforms (Vercel, Netlify) may have special requirements
3. Consider enabling request logging temporarily to debug requests

### Emergency Fallback:
If needed, temporarily disable secure cookies for debugging:
```javascript
// In app.js - TEMPORARY DEBUG ONLY
secure: false,  // Always false for debugging
```
**⚠️ Remove this after debugging - security risk!**
