# 🗄️ Yiniz Database Setup Guide

This directory contains the complete database schema for the Yiniz project.

## 📋 **Database Tables Overview**

Based on analysis of your entire codebase, here are all the tables your project needs:

### **🎓 Edutest Module (E-learning/Testing System)**

- `yiniz_teststudents` - Student information and scores
- `yiniz_etest` - Test questions with multiple choice options
- `yiniz_test_sessions` - Time-based test session management

### **📝 Blog Module**

- `yiniz_bloggers` - Blogger accounts and profiles
- `yiniz_bloggerposts` - Blog posts and articles
- `yiniz_post_likes` - Track post likes by IP address
- `yiniz_post_dislikes` - Track post dislikes by IP address

### **📋 Assignment Submission Module**

- `yiniz_submitusers` - Users for assignment submission system
- `yiniz_submissions` - File submissions by students

### **🛍️ Ecommerce Module**

- `yiniz_sellers` - Seller accounts and business info
- `yiniz_products` - Product catalog

### **🔐 Session Management**

- `sessions` (MySQL) / `session` (PostgreSQL) - User session storage

---

## 🚀 **Quick Setup Instructions**

### **For MySQL/MariaDB (Railway, Heroku, DigitalOcean)**

```sql
-- Run this file in your MySQL database
source database/yiniz_schema.sql
```

### **For PostgreSQL (Render - RECOMMENDED)**

```sql
-- Run this file in your PostgreSQL database
\i database/yiniz_postgresql_schema.sql
```

---

## 🛠️ **Platform-Specific Setup**

### **🆓 Render (PostgreSQL) - RECOMMENDED**

1. Create PostgreSQL database in Render
2. Connect to database using provided credentials
3. Run: `database/yiniz_postgresql_schema.sql`
4. Environment variable automatically provided: `DATABASE_URL`

### **💰 Railway (MySQL)**

1. Add MySQL service to your Railway project
2. Connect to database using Railway's MySQL client
3. Run: `database/yiniz_schema.sql`
4. Environment variables auto-configured by Railway

### **💰 Heroku (MySQL via JawsDB)**

1. Add JawsDB addon: `heroku addons:create jawsdb:kitefin`
2. Get connection details: `heroku config:get JAWSDB_URL`
3. Connect and run: `database/yiniz_schema.sql`

---

## 📊 **Sample Data Included**

Both schema files include sample data:

- ✅ 5 test students (for edutest)
- ✅ 5 sample questions (various subjects)
- ✅ 2 test sessions (morning & evening)
- ✅ Sample blogger account
- ✅ Sample admin user
- ✅ Sample seller and product

---

## 🔧 **Key Features**

### **Smart Design Features:**

- ✅ **Auto-incrementing IDs** for all tables
- ✅ **Proper foreign keys** and cascading deletes
- ✅ **Indexes** for performance optimization
- ✅ **Timestamp tracking** (created_at, updated_at)
- ✅ **Data validation** with constraints
- ✅ **UTF-8 support** for international characters

### **Security Features:**

- ✅ **Unique constraints** prevent duplicates
- ✅ **IP tracking** for likes/dislikes (prevents spam)
- ✅ **Role-based access** (admin/student)
- ✅ **Session management** for user authentication

---

## 📝 **Database Connection in Your Code**

Your `models/connection.js` already supports both:

```javascript
// Automatically detects connection type
const getDatabaseConfig = () => {
  // PostgreSQL connection string (Render style)
  if (process.env.DATABASE_URL) {
    const url = new URL(process.env.DATABASE_URL);
    return {
      host: url.hostname,
      user: url.username,
      password: url.password,
      database: url.pathname.slice(1),
      port: parseInt(url.port) || 3306,
    };
  }

  // Traditional MySQL environment variables
  return {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT || 3306,
  };
};
```

---

## 🎯 **What This Enables**

With this database schema, your app will have:

1. **✅ Complete E-test System** - Students can login, take timed tests, view scores
2. **✅ Full Blog Platform** - Create posts, like/dislike, categorize content
3. **✅ Assignment Submission** - File uploads, admin review, grading system
4. **✅ Ecommerce Ready** - Sellers, products, inventory management
5. **✅ User Management** - Authentication, sessions, role-based access

---

## 🚨 **Important Notes**

### **Password Hashing**

- Sample data uses placeholder hashes
- In production, use `bcrypt` (already in your code)
- Example: `const hashedPassword = await bcrypt.hash(password, 10);`

### **File Upload Paths**

- `yiniz_submissions.file_path` stores relative paths
- Your `uploadFile.js` helper handles file naming
- Files stored in `/uploads` directory (already in `.gitignore`)

### **Session Management**

- Sessions table auto-created for user authentication
- Express-session uses this for persistent login
- Your `app.js` already configured for this

---

## 🎉 **Ready to Deploy!**

Your database schema is now **production-ready** and supports all features in your application. The schema includes:

- **Performance optimization** with proper indexes
- **Data integrity** with foreign keys and constraints
- **Scalability** with efficient table design
- **Security** with role-based access and IP tracking
- **Flexibility** with support for both MySQL and PostgreSQL

Choose your deployment platform and run the appropriate SQL file! 🚀
