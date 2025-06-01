export function formatDuration(totalSeconds: number): string {
  if (isNaN(totalSeconds) || totalSeconds < 0) return 'N/A';

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  let formattedTime = '';
  if (hours > 0) {
    formattedTime += `${hours}h `;
  }
  if (minutes > 0 || hours > 0) { // Show minutes if hours are present or if minutes > 0
    formattedTime += `${minutes}m `;
  }
  formattedTime += `${seconds}s`;

  // Fallback for very short durations or if only seconds are meaningful
  if (hours === 0 && minutes === 0) {
    return `${seconds}s`;
  }
  if (hours === 0 && minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }

  return formattedTime.trim();
}

export function formatDistance(meters: number | undefined, decimals: number = 2): string {
  if (meters === undefined || isNaN(meters)) return 'N/A';
  if (meters < 0) return 'N/A';
  const kilometers = meters / 1000;
  return `${kilometers.toFixed(decimals)} km`;
}

export function formatPace(averageSpeedMps: number | undefined): string {
  if (averageSpeedMps === undefined || isNaN(averageSpeedMps) || averageSpeedMps <= 0) {
    return 'N/A';
  }
  const minutesPerKm = (1 / averageSpeedMps) * (1000 / 60);
  const minutes = Math.floor(minutesPerKm);
  const seconds = Math.round((minutesPerKm - minutes) * 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds} /km`;
}

export function formatSpeed(averageSpeedMps: number | undefined, decimals: number = 2): string {
  if (averageSpeedMps === undefined || isNaN(averageSpeedMps)) return 'N/A';
  const kmPerHour = averageSpeedMps * 3.6;
  return `${kmPerHour.toFixed(decimals)} km/h`;
}

export function formatElevation(meters: number | undefined): string {
  if (meters === undefined || isNaN(meters)) return 'N/A';
  return `${meters.toFixed(0)} m`;
}

export function formatDate(
  isoString: string | undefined,
  options?: Intl.DateTimeFormatOptions
): string {
  if (!isoString) return 'N/A';
  try {
    const date = new Date(isoString);
    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      // timeZoneName: 'short' // Consider adding if timezone is critical to display
    };
    return date.toLocaleDateString(undefined, { ...defaultOptions, ...options });
  } catch (e) {
    return 'Invalid Date';
  }
}

export const typeEmojiMap: { [key: string]: string } = {
  run: '🏃',
  ride: '🚴',
  cycle: '🚴',
  walk: '🚶',
  hike: '🏞️',
  swim: '🏊',
  default: '🏆'
};

export function getActivityEmoji(type: string | undefined): string {
  if (!type) return typeEmojiMap.default;
  return typeEmojiMap[type.toLowerCase()] || typeEmojiMap.default;
}

/**
 * Decodes a polyline string into an array of [latitude, longitude] coordinates.
 * Based on Google's polyline encoding algorithm.
 * @param encodedPolyline The encoded polyline string.
 * @returns Array of [lat, lng] coordinates.
 */
export function decodePolyline(encodedPolyline: string | null | undefined): [number, number][] {
  if (!encodedPolyline) {
    return [];
  }

  let index = 0;
  let lat = 0;
  let lng = 0;
  const coordinates: [number, number][] = [];
  let shift = 0;
  let result = 0;
  let byte, lat_change, lng_change;

  while (index < encodedPolyline.length) {
    // Decode latitude
    shift = 0;
    result = 0;
    do {
      byte = encodedPolyline.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    lat_change = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lat += lat_change;

    // Decode longitude
    shift = 0;
    result = 0;
    do {
      byte = encodedPolyline.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    lng_change = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lng += lng_change;

    coordinates.push([lat / 1e5, lng / 1e5]);
  }
  return coordinates;
}