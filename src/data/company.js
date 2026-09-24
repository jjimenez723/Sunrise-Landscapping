import { address, businessName, directionsUrl } from "./site";

export { email, phone, phoneHref } from "./site";
export const storeName = businessName;
export const storeAddress = address;
export const storeCoordinates = { lat: 40.6175, lng: -74.4273 };
export const storeHours = "Mon–Sat · 7:00 AM–7:00 PM";

const encodedStoreQuery = encodeURIComponent(`${storeName}, ${storeAddress}`);

export const googleMapsPlaceUrl = `https://www.google.com/maps/search/?api=1&query=${encodedStoreQuery}`;
export const googleMapsDirectionsUrl = directionsUrl;
