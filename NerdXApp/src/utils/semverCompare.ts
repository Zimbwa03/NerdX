/**
 * Semantic version comparison utility
 * Compares version strings like "1.2.3" and determines if one is greater, equal, or less than another
 */

export interface VersionComparison {
  isGreater: boolean;
  isEqual: boolean;
  isLess: boolean;
}

/**
 * Parses a version string into an array of numbers
 * Handles versions like "1.2.3", "1.2.3-beta", "1.2.3.4"
 */
function parseVersion(version: string): number[] {
  // Remove any non-numeric characters except dots and dashes
  const cleaned = version.replace(/[^0-9.-]/g, '');
  // Split by dots and convert to numbers
  const parts = cleaned.split('.').map(part => {
    // Handle parts with dashes (e.g., "1-beta" -> 1)
    const numPart = part.split('-')[0];
    return parseInt(numPart, 10) || 0;
  });
  return parts;
}

/**
 * Compares two version strings
 * @param version1 First version string (e.g., "1.2.3")
 * @param version2 Second version string (e.g., "1.2.4")
 * @returns -1 if version1 < version2, 0 if equal, 1 if version1 > version2
 */
export function compareVersions(version1: string, version2: string): number {
  const v1Parts = parseVersion(version1);
  const v2Parts = parseVersion(version2);
  
  const maxLength = Math.max(v1Parts.length, v2Parts.length);
  
  for (let i = 0; i < maxLength; i++) {
    const v1Part = v1Parts[i] || 0;
    const v2Part = v2Parts[i] || 0;
    
    if (v1Part < v2Part) return -1;
    if (v1Part > v2Part) return 1;
  }
  
  return 0;
}

/**
 * Checks if version1 is less than version2
 */
export function isVersionLessThan(version1: string, version2: string): boolean {
  return compareVersions(version1, version2) < 0;
}

/**
 * Checks if version1 is greater than version2
 */
export function isVersionGreaterThan(version1: string, version2: string): boolean {
  return compareVersions(version1, version2) > 0;
}

/**
 * Checks if version1 equals version2
 */
export function isVersionEqual(version1: string, version2: string): boolean {
  return compareVersions(version1, version2) === 0;
}

/**
 * Gets the installed app version from package.json or app config
 * This should be set at build time or read from app.json
 */
export function getInstalledVersion(): string {
  // In React Native/Expo, you can use Constants.expoConfig.version
  // For now, return a placeholder - this should be replaced with actual version
  try {
    const { Constants } = require('expo-constants');
    return Constants.expoConfig?.version || Constants.manifest?.version || '1.0.0';
  } catch {
    return '1.0.0';
  }
}
