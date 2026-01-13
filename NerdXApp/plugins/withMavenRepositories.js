const { withProjectBuildGradle, withSettingsGradle } = require('@expo/config-plugins');

module.exports = function withMavenRepositories(config) {
    config = withProjectBuildGradle(config, (config) => {
        if (config.modResults.language === 'groovy') {
            config.modResults.contents = addMavenRepositoriesToBuildGradle(config.modResults.contents);
        } else {
            throw new Error('Cannot add Maven repositories to non-groovy build.gradle');
        }
        return config;
    });

    config = withSettingsGradle(config, (config) => {
        if (config.modResults.language === 'groovy') {
            config.modResults.contents = addMavenRepositoriesToSettingsGradle(config.modResults.contents);
        } else {
            throw new Error('Cannot add Maven repositories to non-groovy settings.gradle');
        }
        return config;
    });

    return config;
};

function addMavenRepositoriesToBuildGradle(buildGradle) {
    const jfrogRepo = `maven { url "https://releases.jfrog.io/artifactory/oss-releases" }`;
    const gradlePluginsRepo = `maven { url "https://plugins.gradle.org/m2/" }`;

    let newBuildGradle = buildGradle;

    // Add to buildscript repositories
    if (!newBuildGradle.includes('releases.jfrog.io')) {
        newBuildGradle = newBuildGradle.replace(
            /(buildscript\s*\{[\s\S]*?repositories\s*\{)/,
            `$1\n        ${jfrogRepo}\n        mavenCentral()\n        ${gradlePluginsRepo}`
        );

        // Add to allprojects repositories
        newBuildGradle = newBuildGradle.replace(
            /(allprojects\s*\{[\s\S]*?repositories\s*\{)/,
            `$1\n        ${jfrogRepo}\n        mavenCentral()\n        ${gradlePluginsRepo}`
        );
    }

    return newBuildGradle;
}

function addMavenRepositoriesToSettingsGradle(settingsGradle) {
    const jfrogRepo = `maven { url "https://releases.jfrog.io/artifactory/oss-releases" }`;
    const gradlePluginsRepo = `maven { url "https://plugins.gradle.org/m2/" }`;

    let newSettingsGradle = settingsGradle;

    // The default template might have pluginManagement { repositories { ... } }
    // Or it might be empty.

    // Pattern to match: pluginManagement { ... repositories {
    const pluginManagementReposPattern = /(pluginManagement\s*\{[\s\S]*?repositories\s*\{)/;

    if (newSettingsGradle.match(pluginManagementReposPattern)) {
        if (!newSettingsGradle.includes('releases.jfrog.io')) {
            newSettingsGradle = newSettingsGradle.replace(
                pluginManagementReposPattern,
                `$1\n        ${jfrogRepo}\n        mavenCentral()\n        ${gradlePluginsRepo}`
            );
        }
    } else if (newSettingsGradle.includes('pluginManagement {')) {
        // pluginManagement exists but maybe no repositories block?
        // Insert repositories block at the start of pluginManagement
        newSettingsGradle = newSettingsGradle.replace(
            /pluginManagement\s*\{/,
            `pluginManagement {\n    repositories {\n        ${jfrogRepo}\n        mavenCentral()\n        ${gradlePluginsRepo}\n        google()\n        maven { url "https://www.jitpack.io" }\n    }\n`
        );
    } else {
        // Fallback: prepend pluginManagement block if missing entirely
        const pluginManagementBlock = `pluginManagement {
    repositories {
        ${jfrogRepo}
        mavenCentral()
        ${gradlePluginsRepo}
        google()
        maven { url "https://www.jitpack.io" }
    }
}
`;
        newSettingsGradle = pluginManagementBlock + newSettingsGradle;
    }

    return newSettingsGradle;
}
