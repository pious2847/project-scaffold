const fs = require('fs-extra');
const path = require('path');

async function generateStructure(config) {
  const { projectType, projectName, dependencies, useTypeScript, includeTesting } = config;
  const projectPath = path.join(process.cwd(), projectName);
  
  try {
    await fs.ensureDir(projectPath);
    
    const templatePath = path.join(__dirname, 'templates', projectType);
    await fs.copy(templatePath, projectPath);
    
    // Customize package.json
    const packageJsonPath = path.join(projectPath, 'package.json');
    if (await fs.pathExists(packageJsonPath)) {
      const packageJson = await fs.readJson(packageJsonPath);
      packageJson.name = projectName;

      // Add custom dependencies
      if (dependencies && dependencies.length > 0) {
        dependencies.forEach(dep => {
          packageJson.dependencies[dep] = '*';
        });
      }

      // Add TypeScript if selected
      if (useTypeScript) {
        packageJson.devDependencies['typescript'] = '^4.5.4';
        // You might want to add ts-node, @types/node, etc. as well
      }

      // Add testing setup if selected
      if (includeTesting) {
        packageJson.devDependencies['jest'] = '^27.4.5';
        packageJson.scripts['test'] = 'jest';
      }

      await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
    }

    // Handle TypeScript setup
    if (useTypeScript) {
      const tsConfigPath = path.join(projectPath, 'tsconfig.json');
      const tsConfig = {
        compilerOptions: {
          target: "es6",
          module: "commonjs",
          strict: true,
          esModuleInterop: true,
          skipLibCheck: true,
          forceConsistentCasingInFileNames: true
        }
      };
      await fs.writeJson(tsConfigPath, tsConfig, { spaces: 2 });
      
      // Rename .js files to .ts
      const files = await fs.readdir(path.join(projectPath, 'src'));
      for (const file of files) {
        if (file.endsWith('.js')) {
          await fs.move(
            path.join(projectPath, 'src', file),
            path.join(projectPath, 'src', file.replace('.js', '.ts'))
          );
        }
      }
    }

    // Handle testing setup
    if (includeTesting) {
      const testDir = path.join(projectPath, 'tests');
      await fs.ensureDir(testDir);
      const sampleTestFile = path.join(testDir, 'sample.test.js');
      await fs.writeFile(sampleTestFile, 'test("sample test", () => { expect(true).toBe(true); });');
    }

    console.log(`Project structure for ${projectType} created in ${projectPath}`);
  } catch (error) {
    console.error('Error generating project structure:', error);
  }
}

module.exports = { generateStructure };