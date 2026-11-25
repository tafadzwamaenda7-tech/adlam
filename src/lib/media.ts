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
    alt: "Goods being loaded onto a truck",
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
    alt: "Courier carrying a delivery bag at a doorway",
    width: 1800,
    height: 2700,
  },
  doorHandover: {
    src: doorHandover,
    alt: "Courier handing over a parcel at a doorstep",
    width: 1800,
    height: 2700,
  },
} as const satisfies Record<string, MediaImage>;
