declare global {
  namespace L {
    interface Layer {
      addTo(map: Map): this;
      bindPopup(content: ((layer: Layer) => Content) | Content | Popup, options?: PopupOptions): this;
    }
    interface Path extends Layer {
      getBounds(): LatLngBounds;
    }

    interface Map {
      eachLayer(callback: (layer: any) => void): this;
      removeLayer(layer: Layer): this;
      fitBounds(bounds: LatLngBoundsExpression, options?: FitBoundsOptions): this;
      setView(center: LatLngExpression, zoom: number, options?: ZoomPanOptions): this;
      addLayer(layer: Layer): this;
    }
    interface TileLayerOptions {
      attribution?: string;
      minZoom?: number;
      maxZoom?: number;
      subdomains?: string | string[];
      errorTileUrl?: string;
      tileSize?: number | Point;
    }
    interface TileLayer extends Layer { }

    interface PolylineOptions {
      color?: string;
      weight?: number;
      opacity?: number;
    }

    class Polyline implements Path {
      constructor(latlngs: LatLngExpression[] | LatLngExpression[][], options?: PolylineOptions);

      addTo(map: Map): this;
      bindPopup(content: ((layer: Layer) => Content) | Content | Popup, options?: PopupOptions): this;
      getBounds(): LatLngBounds;
    }

    // FeatureGroup
    interface LayerGroup extends Layer {
      addLayer(layer: Layer): this;
      getLayers(): Layer[];
      getBounds(): LatLngBounds;
    }

    interface LatLng { lat: number; lng: number; alt?: number; }
    type LatLngExpression = [number, number] | { lat: number; lng: number } | { lat: number; lon: number } | LatLng;

    interface LatLngBounds {
      pad(bufferRatio: number): LatLngBounds;
      getCenter(): LatLng;
      isValid(): boolean;
    }
    type LatLngBoundsExpression = LatLngBounds | LatLngExpression[];

    interface Point { x: number; y: number; }

    interface PopupOptions { }
    interface ZoomPanOptions { }
    interface FitBoundsOptions { }
    type Content = string | HTMLElement;
    interface Popup extends Layer { }


    function map(element: string | HTMLElement, options?: any): Map;
    function tileLayer(urlTemplate: string, options?: TileLayerOptions): TileLayer;
    function polyline(latlngs: LatLngExpression[] | LatLngExpression[][], options?: PolylineOptions): Polyline;
    function featureGroup(layers?: Layer[], options?: any): LayerGroup;
  }
}

export { };