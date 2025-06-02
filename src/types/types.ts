/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export interface SummaryStat {
  id: string;
  label: string;
  value: string;
  unit: string;
}

// Nested types for the detailed Activity interface
export interface AthleteMeta {
  id: number;
  resource_state: number;
}

export interface MapMeta {
  id: string;
  polyline?: string | null;
  summary_polyline?: string | null;
  resource_state: number;
}

export interface Lap {
  id: number;
  resource_state: number;
  name: string;
  activity: { id: number, resource_state: number, visibility?: string };
  athlete: AthleteMeta;
  elapsed_time: number;
  moving_time: number;
  start_date: string;
  start_date_local: string;
  distance: number;
  average_speed?: number; // Strava API uses this
  max_speed?: number;
  lap_index: number;
  split: number;
  start_index: number;
  end_index: number;
  total_elevation_gain?: number;
  average_cadence?: number;
  device_watts?: boolean;
  average_heartrate?: number;
  max_heartrate?: number;
  pace_zone?: number; // This field was in the provided JSON for laps
}

export interface SplitMetric {
  distance: number;
  elapsed_time: number;
  elevation_difference?: number;
  moving_time: number;
  split: number;
  average_speed: number; // Strava API uses this
  average_grade_adjusted_speed?: number;
  average_heartrate?: number;
  pace_zone: number;
}

export interface BestEffort {
  id: number;
  resource_state: number;
  name: string;
  activity: { id: number, resource_state: number, visibility?: string };
  athlete: AthleteMeta;
  elapsed_time: number;
  moving_time: number;
  start_date: string;
  start_date_local: string;
  distance: number;
  pr_rank?: number | null;
  achievements?: any[]; // Define more strictly if needed
  start_index: number;
  end_index: number;
}

export interface PhotoMeta {
  primary?: any | null; // Define more strictly if needed
  count: number;
}

export interface StatsVisibilityItem {
  type: string;
  visibility: string;
}

export interface Activity {
  // Existing simplified fields (will be populated from detailed data or remain for simpler mock entries)
  // Ensure these are compatible or derived from the detailed fields below
  id: number;
  name: string;
  date: string; // This might be derived from start_date_local for display
  type: string; // Maps to sport_type or type from detailed
  mapPreviewUrl: string; // URL for a static map image preview

  // Detailed fields from Strava-like structure
  resource_state?: number;
  athlete?: AthleteMeta;
  distance: number; // meters, formerly string
  moving_time: number; // seconds, maps to 'duration'
  elapsed_time?: number; // seconds
  total_elevation_gain?: number;
  sport_type?: string;
  workout_type?: string | null;
  start_date?: string; // ISO
  start_date_local?: string; // ISO
  timezone?: string;
  utc_offset?: number;
  location_city?: string | null;
  location_state?: string | null;
  location_country?: string | null;
  achievement_count?: number;
  kudos_count?: number;
  comment_count?: number;
  athlete_count?: number;
  photo_count?: number;
  map?: MapMeta;
  trainer?: boolean;
  commute?: boolean;
  manual?: boolean;
  private?: boolean;
  visibility?: string;
  flagged?: boolean;
  gear_id?: string | null;
  start_latlng?: number[];
  end_latlng?: number[];
  average_speed?: number; // m/s
  max_speed?: number; // m/s
  average_cadence?: number;
  average_temp?: number;
  has_heartrate?: boolean;
  average_heartrate?: number;
  max_heartrate?: number;
  heartrate_opt_out?: boolean;
  display_hide_heartrate_option?: boolean;
  elev_high?: number;
  elev_low?: number;
  upload_id?: number;
  upload_id_str?: string;
  external_id?: string;
  from_accepted_tag?: boolean;
  pr_count?: number;
  total_photo_count?: number;
  has_kudoed?: boolean;
  description?: string | null;
  calories?: number; // numeric, formerly string
  perceived_exertion?: number | null;
  prefer_perceived_exertion?: boolean | null;
  segment_efforts?: any[]; // Define more strictly if needed
  splits_metric?: SplitMetric[];
  splits_standard?: SplitMetric[]; // Assuming similar structure
  laps?: Lap[];
  best_efforts?: BestEffort[];
  photos?: PhotoMeta;
  stats_visibility?: StatsVisibilityItem[];
  hide_from_home?: boolean;
  device_name?: string;
  embed_token?: string;
  available_zones?: any[];

  // Retain old string fields if necessary for compatibility or make them optional.
  // For this refactor, we aim to use numeric types and format them.
  // 'pace' string is removed, will be calculated from average_speed or moving_time/distance.
  // 'heartRate' string (avg) is replaced by numeric average_heartrate.
}
