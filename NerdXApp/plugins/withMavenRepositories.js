const { withProjectBuildGradle } = require('@expo/config-plugins');

module.exports = function withMavenRepositories(config) {
    return withProjectBuildGradle(config, (config) => {
        if (config.modResults.language === 'groovy') {
            config.modResults.contents = addMavenRepositories(config.modResults.contents);
        } else {
            throw new Error('Cannot add Maven repositories to non-groovy build.gradle');
        }
        return config;
    });
};

function addMavenRepositories(buildGradle) {
    const jfrogRepo = `maven { url "https://releases.jfrog.io/artifactory/oss-releases" }`;

    let newBuildGradle = buildGradle;

    // Add to buildscript repositories
    // Using a regex to find the repositories block inside buildscript
    if (!newBuildGradle.includes('releases.jfrog.io')) {
        newBuildGradle = newBuildGradle.replace(
            /(buildscript\s*\{[\s\S]*?repositories\s*\{)/,
            `$1\n        mavenCentral()\n        jcenter()\n        ${jfrogRepo}`
        );

        // Add to allprojects repositories
        newBuildGradle = newBuildGradle.replace(
            /(allprojects\s*\{[\s\S]*?repositories\s*\{)/,
            `$1\n        mavenCentral()\n        jcenter()\n        ${jfrogRepo}`
        );
    }

    return newBuildGradle;
}
