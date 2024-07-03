const fs = require('fs-extra');

async function detectProjectType() {
  try {
    const files = await fs.readdir(process.cwd());
    
    if (files.includes('package.json')) {
      const packageJson = await fs.readJson('./package.json');
      
      if (packageJson.dependencies && packageJson.dependencies.react) {
        return 'react';
      }
      if (packageJson.dependencies && packageJson.dependencies.express) {
        return 'express';
      }
      if (packageJson.dependencies && packageJson.dependencies.vue) {
        return 'vue';
      }
      if (packageJson.dependencies && packageJson.dependencies['@angular/core']) {
        return 'angular';
      }
    }
    
    if (files.includes('index.html')) {
      return 'static';
    }
    
    return null;
  } catch (error) {
    console.error('Error detecting project type:', error);
    return null;
  }
}

module.exports = { detectProjectType };