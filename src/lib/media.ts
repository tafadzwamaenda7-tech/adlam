import heroTruck from "@/assets/hero-truck.jpg";
import truckRoad from "@/assets/truck-road.jpg";
import fleetTrucks from "@/assets/fleet-trucks.jpg";
import truckLoading from "@/assets/truck-loading.jpg";
import warehouse from "@/assets/warehouse.jpg";
import grainSacks from "@/assets/grain-sacks.jpg";
import grainKernels from "@/assets/grain-kernels.jpg";
import grainDrying from "@/assets/grain-drying.jpg";
import chinaPort from "@/assets/china-port.jpg";
import chinaPortAerial from "@/assets/china-port-aerial.jpg";
import containerYard from "@/assets/container-yard.jpg";
import doorDelivery from "@/assets/door-delivery.jpg";
import doorHandover from "@/assets/door-handover.jpg";
import truck5t from "@/assets/truck-5t.jpg";
import truck7t from "@/assets/truck-7t.jpg";
import truck10t from "@/assets/truck-10t.jpg";
import skuta from "@/assets/skuta.jpg";

export interface MediaImage {
  readonly src: string;
  readonly alt: string;
  readonly width: number;
  readonly height: number;
}

export const media = {
  heroTruck: {
    src: heroTruck,
    alt: "Truck parked before a delivery",
    width: 1920,
    height: 1088,
  },
  truckRoad: {
    src: truckRoad,
    alt: "Cargo truck on a highway",
    width: 1800,
    height: 1200,
  },
  fleetTrucks: {
    src: fleetTrucks,
    alt: "Trucks lined up ready for delivery",
    width: 1800,
    height: 1200,
  },
  truckLoading: {
    src: truckLoading,
    alt: "African workers loading goods onto a truck",
    width: 1800,
    height: 1200,
  },
  warehouse: {
    src: warehouse,
    alt: "Organised warehouse interior",
    width: 1800,
    height: 2700,
  },
  grainSacks: {
    src: grainSacks,
    alt: "Maize kernels in a burlap sack",
    width: 1800,
    height: 2400,
  },
  grainKernels: {
    src: grainKernels,
    alt: "Close-up of yellow maize kernels",
    width: 1800,
    height: 1200,
  },
  grainDrying: {
    src: grainDrying,
    alt: "Maize cobs drying in sunlight",
    width: 1800,
    height: 1200,
  },
  chinaPort: {
    src: chinaPort,
    alt: "Container ship at a port in China",
    width: 1800,
    height: 2400,
  },
  chinaPortAerial: {
    src: chinaPortAerial,
    alt: "Aerial view of a port in China",
    width: 1800,
    height: 1012,
  },
  containerYard: {
    src: containerYard,
    alt: "Container yard in China",
    width: 1800,
    height: 2400,
  },
  doorDelivery: {
    src: doorDelivery,
    alt: "Black courier carrying a parcel to a doorway",
    width: 1800,
    height: 2700,
  },
  doorHandover: {
    src: doorHandover,
    alt: "Black courier carrying a delivery order",
    width: 1800,
    height: 2700,
  },
  truck5t: {
    src: truck5t,
    alt: "Light-duty box cargo truck",
    width: 736,
    height: 736,
  },
  truck7t: {
    src: truck7t,
    alt: "Commercial truck",
    width: 735,
    height: 460,
  },
  truck10t: {
    src: truck10t,
    alt: "Curtain-sided truck",
    width: 736,
    height: 736,
  },
  skuta: {
    src: skuta,
    alt: "Three-wheel skuta",
    width: 736,
    height: 736,
  },
} as const satisfies Record<string, MediaImage>;
