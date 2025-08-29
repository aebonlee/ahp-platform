# 🗂️ AHP Research Platform - Backup System

## 📋 Overview
Comprehensive backup system for AHP Research Platform project with organized structure and easy recovery procedures.

## 📁 Directory Structure

```
C:\Users\ASUS\backup\
├── 📂 ahp-project/              # Complete project backups
│   └── ahp-research-platform-complete-YYYYMMDD-HHMM.tar.gz
├── 📂 stable-versions/          # Stable release versions
│   └── v1.0-evaluation-test-complete-20250829/
│       └── v1.0-evaluation-test-complete-20250829-source.tar.gz
├── 📂 source-archives/          # Development source backups
│   └── ahp-research-platform-latest-20250829.tar.gz
├── 📂 documentation/            # Project docs and metadata
│   ├── README.md
│   ├── DEVELOPMENT-STATUS.md
│   ├── git-status.txt
│   └── various git info files
├── 📂 scripts/                  # Backup and recovery scripts
│   └── restore-stable.bat
└── 📄 README.md                 # This file
```

## 🏷️ Current Stable Version

### v1.0-evaluation-test-complete (2025-08-29)
- **Status**: ✅ Production Ready
- **Git Tag**: `v1.0-evaluation-test-complete`
- **GitHub**: https://github.com/aebonlee/ahp-research-platform
- **Build Size**: 331.93 kB (gzipped)
- **TypeScript**: Zero compilation errors

#### Key Features Implemented
- ✅ **Evaluation Test System**: Complete preview and simulation functionality
- ✅ **Template Integration**: Full header/sidebar layout integration
- ✅ **Optimized Routing**: Independent App.tsx processing
- ✅ **Production Build**: Optimized and error-free

## 🔄 Recovery Procedures

### Method 1: Git Tag Recovery (Recommended)
```bash
cd C:\Users\ASUS\ahp-research-platform
git checkout v1.0-evaluation-test-complete
npm install
npm run build
```

### Method 2: One-Click Recovery
```batch
# Windows batch script
C:\Users\ASUS\backup\scripts\restore-stable.bat
```

### Method 3: Archive Recovery
```bash
cd C:\Users\ASUS
# Extract stable version
tar -xzf backup/stable-versions/v1.0-evaluation-test-complete-20250829/v1.0-evaluation-test-complete-20250829-source.tar.gz

# Or extract latest complete backup
tar -xzf backup/ahp-project/ahp-research-platform-complete-YYYYMMDD-HHMM.tar.gz
```

## 📊 Backup Types

### 1. Complete Project Backup
- **Location**: `ahp-project/`
- **Content**: Full project with all source files
- **Frequency**: Major milestones and releases
- **Size**: ~1.3MB compressed

### 2. Stable Version Backup
- **Location**: `stable-versions/`
- **Content**: Verified stable releases only
- **Frequency**: When tagged as stable
- **Purpose**: Safe rollback points

### 3. Source Archives
- **Location**: `source-archives/`
- **Content**: Development snapshots
- **Frequency**: Regular development backups
- **Purpose**: Latest changes preservation

### 4. Documentation Backup
- **Location**: `documentation/`
- **Content**: Project docs, git info, development status
- **Purpose**: Context and metadata preservation

## 🛠️ Maintenance

### Regular Tasks
```bash
# Verify backup integrity
tar -tzf backup/ahp-project/[backup-file].tar.gz > /dev/null && echo "OK"

# Check backup sizes
du -sh backup/*/

# Clean old backups (keep latest 5)
cd backup/ahp-project && ls -t *.tar.gz | tail -n +6 | xargs rm -f
```

### Backup Verification Checklist
- [ ] Archive extracts without errors
- [ ] npm install works after extraction
- [ ] Build process succeeds
- [ ] All major features functional
- [ ] Git history preserved (if applicable)

## ⚠️ Important Notes

1. **Dependencies**: Always run `npm install` after recovery
2. **Environment**: Verify `.env` files and configurations
3. **Git Setup**: Reconnect to remote repository if needed
4. **Build Test**: Confirm `npm run build` succeeds
5. **Feature Test**: Verify evaluation test system works

## 📞 Quick Reference

- **Project GitHub**: https://github.com/aebonlee/ahp-research-platform
- **Backup Location**: `C:\Users\ASUS\backup\`
- **Stable Tag**: `v1.0-evaluation-test-complete`
- **Recovery Script**: `backup\scripts\restore-stable.bat`

## 🎯 System Status Summary

- ✅ **Project Status**: Production ready and stable
- ✅ **Backup System**: Fully operational with multiple recovery methods
- ✅ **Documentation**: Complete guides and procedures
- ✅ **Automation**: One-click recovery available
- ✅ **Version Control**: Git tags synchronized with GitHub

---
**Created**: 2025-08-29 16:00 KST  
**Last Updated**: 2025-08-29 16:00 KST  
**System Version**: 2.0 (Simplified Structure)