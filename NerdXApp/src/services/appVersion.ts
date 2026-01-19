import { supabase } from './supabase';
import { compareVersions, getInstalledVersion } from '../utils/semverCompare';
import { Platform } from 'react-native';

export interface AppVersion {
  id: string;
  platform: 'android' | 'ios';
  min_supported_version: string;
  latest_version: string;
  update_required: boolean;
  soft_update: boolean;
  update_message: string;
  update_url: string;
  updated_at: string;
  updated_by: string | null;
  created_at: string;
}

/**
 * Get app version requirements for current platform
 */
export async function getAppVersion(): Promise<AppVersion | null> {
  try {
    const platform = Platform.OS === 'ios' ? 'ios' : 'android';
    
    const { data, error } = await supabase
      .from('app_versions')
      .select('*')
      .eq('platform', platform)
      .single();

    if (error) {
      console.error('Error fetching app version:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getAppVersion:', error);
    return null;
  }
}

/**
 * Check if update is required
 */
export async function checkUpdateRequired(): Promise<{
  updateRequired: boolean;
  isHardUpdate: boolean;
  versionInfo: AppVersion | null;
  installedVersion: string;
}> {
  try {
    const installedVersion = getInstalledVersion();
    const versionInfo = await getAppVersion();

    if (!versionInfo) {
      return {
        updateRequired: false,
        isHardUpdate: false,
        versionInfo: null,
        installedVersion,
      };
    }

    // Check if installed version is less than minimum supported
    const isBelowMinimum = compareVersions(installedVersion, versionInfo.min_supported_version) < 0;
    
    // Update is required if:
    // 1. update_required flag is true, OR
    // 2. installed version is below minimum supported
    const updateRequired = versionInfo.update_required || isBelowMinimum;
    
    // Hard update if update_required is true and soft_update is false
    const isHardUpdate = updateRequired && !versionInfo.soft_update;

    return {
      updateRequired,
      isHardUpdate,
      versionInfo,
      installedVersion,
    };
  } catch (error) {
    console.error('Error in checkUpdateRequired:', error);
    return {
      updateRequired: false,
      isHardUpdate: false,
      versionInfo: null,
      installedVersion: getInstalledVersion(),
    };
  }
}

/**
 * Subscribe to app version updates
 */
export function subscribeToAppVersions(
  platform: 'android' | 'ios',
  onUpdate: (version: AppVersion) => void
) {
  const channel = supabase
    .channel(`app_versions:${platform}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'app_versions',
        filter: `platform=eq.${platform}`,
      },
      (payload) => {
        onUpdate(payload.new as AppVersion);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
