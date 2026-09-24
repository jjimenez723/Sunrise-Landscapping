export const storeName = "New Sunrise Landscape";
export const storeAddress = "301 Maple Ave #244, North Plainfield, NJ 07060";
export const storeCoordinates = { lat: 40.6175, lng: -74.4273 };
export const storeHours = "Mon–Sat · 7:00 AM–7:00 PM";

export const phone = "(908) 319-6763";
export const phoneHref = "tel:+19083196763";
export const email = "info@newsunriselandscape.com";

const encodedStoreQuery = encodeURIComponent(`${storeName}, ${storeAddress}`);
const encodedStoreAddress = encodeURIComponent(storeAddress);

export const googleMapsPlaceUrl = `https://www.google.com/maps/search/?api=1&query=${encodedStoreQuery}`;
export const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedStoreAddress}`;
