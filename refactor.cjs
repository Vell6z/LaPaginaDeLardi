const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

// Map of old paths (relative to src) to new paths (relative to src)
const fileMap = {
  // Core
  'App.tsx': 'core/App.tsx',
  'main.tsx': 'core/main.tsx',
  'index.css': 'core/index.css',

  // Shared
  'components/Navbar.tsx': 'shared/layout/Navbar.tsx',
  'components/Footer.tsx': 'shared/layout/Footer.tsx',
  'components/Sidebar.tsx': 'shared/layout/Sidebar.tsx',
  'components/LoadingScreen.tsx': 'shared/ui/LoadingScreen.tsx',

  // Modules
  // Auth
  'pages/LoginPage.tsx': 'modules/auth/LoginPage.tsx',
  'pages/SignUpPage.tsx': 'modules/auth/SignUpPage.tsx',
  'pages/RecoverPage.tsx': 'modules/auth/RecoverPage.tsx',

  // Landing
  'pages/Home.tsx': 'modules/landing/Home.tsx',
  'pages/FAQPage.tsx': 'modules/landing/FAQPage.tsx',
  'pages/PrivacyPage.tsx': 'modules/landing/PrivacyPage.tsx',
  'components/FAQSection.tsx': 'modules/landing/FAQSection.tsx',
  'components/PrivacySection.tsx': 'modules/landing/PrivacySection.tsx',

  // Dashboard
  'pages/DashboardPage.tsx': 'modules/dashboard/DashboardPage.tsx',

  // Subjects
  'pages/SubjectsPage.tsx': 'modules/subjects/SubjectsPage.tsx',
  'pages/SubjectDetailPage.tsx': 'modules/subjects/SubjectDetailPage.tsx',
  'pages/ClassDetailPage.tsx': 'modules/subjects/ClassDetailPage.tsx',

  // Study
  'pages/ActiveRecallPage.tsx': 'modules/study/ActiveRecallPage.tsx',
  'components/FlashcardFAQ.tsx': 'modules/study/FlashcardFAQ.tsx',

  // Archive
  'pages/ArchivePage.tsx': 'modules/archive/ArchivePage.tsx',

  // Calendar
  'pages/CalendarPage.tsx': 'modules/calendar/CalendarPage.tsx',

  // Settings
  'pages/SettingsPage.tsx': 'modules/settings/SettingsPage.tsx',
};

// Create directories
const newDirs = new Set(Object.values(fileMap).map(p => path.dirname(p)));
for (const dir of newDirs) {
  const fullDir = path.join(srcDir, dir);
  if (!fs.existsSync(fullDir)) {
    fs.mkdirSync(fullDir, { recursive: true });
  }
}

// Ensure the old paths exist before we start moving, some might have been moved
// Let's first move the files physically
for (const [oldPath, newPath] of Object.entries(fileMap)) {
  const oldFull = path.join(srcDir, oldPath);
  const newFull = path.join(srcDir, newPath);
  if (fs.existsSync(oldFull)) {
    fs.renameSync(oldFull, newFull);
    console.log(`Moved: ${oldPath} -> ${newPath}`);
  }
}

// Now we update imports inside all TSX/TS files
function getRelativeImport(fromFile, toFile) {
  const fromDir = path.dirname(fromFile);
  let relPath = path.relative(fromDir, toFile).replace(/\\/g, '/');
  if (!relPath.startsWith('.')) {
    relPath = './' + relPath;
  }
  // Remove extensions .tsx, .ts, .css (wait, css keep extension)
  if (relPath.endsWith('.tsx') || relPath.endsWith('.ts')) {
    relPath = relPath.replace(/\.tsx?$/, '');
  }
  return relPath;
}

const allNewFiles = Object.values(fileMap);

for (const newPath of allNewFiles) {
  const fullPath = path.join(srcDir, newPath);
  if (!fs.existsSync(fullPath) || (!fullPath.endsWith('.tsx') && !fullPath.endsWith('.ts'))) continue;

  let content = fs.readFileSync(fullPath, 'utf8');
  let changed = false;

  // We will replace both import statements and simple relative paths
  // E.g. import { Home } from "./pages/Home" -> import { Home } from "../modules/landing/Home"
  
  for (const [oldImportPath, newImportPath] of Object.entries(fileMap)) {
    // Old import path as it would appear in the code.
    // e.g. "pages/Home" or "components/Navbar" or "../components/Navbar"
    // Since we don't know the exact old relative path used, we can do a regex that matches 
    // the basename or ending of the path if it corresponds to the same file.
    
    // Instead of parsing all old relative paths, it's easier to find occurrences of the old filename
    // and replace the import path completely if the name matches.
    const baseName = path.basename(oldImportPath).replace(/\.tsx?$/, '');
    
    // Match import ... from ".../baseName"
    const regex = new RegExp(`from\\s+['"]([^'"]*\\/${baseName})['"]`, 'g');
    content = content.replace(regex, (match, p1) => {
      const rel = getRelativeImport(newPath, newImportPath);
      changed = true;
      return `from "${rel}"`;
    });

    // Also handle dynamic imports or links if any like import("../pages/...")
    const regex2 = new RegExp(`import\\(['"]([^'"]*\\/${baseName})['"]\\)`, 'g');
    content = content.replace(regex2, (match, p1) => {
      const rel = getRelativeImport(newPath, newImportPath);
      changed = true;
      return `import("${rel}")`;
    });
  }

  // Handle CSS import in main.tsx specially
  if (newPath === 'core/main.tsx') {
    content = content.replace(/['"]\.\/index\.css['"]/, `"${getRelativeImport(newPath, fileMap['index.css'])}"`);
    content = content.replace(/['"]\.\/App['"]/, `"${getRelativeImport(newPath, fileMap['App.tsx'])}"`);
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(fullPath, content);
    console.log(`Updated imports in: ${newPath}`);
  }
}

// Clean up old empty directories
const oldDirs = ['pages', 'components'].map(d => path.join(srcDir, d));
for (const dir of oldDirs) {
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir);
    if (files.length === 0) {
      fs.rmdirSync(dir);
    } else {
        console.warn(`Could not remove ${dir} as it is not empty: `, files);
    }
  }
}

console.log('Refactoring complete.');
