export interface BusLocation {
  id: string,
  accuracy: number,
  appTimestamp: number,
  gpsTimestamp: number,
  position: {
    x: number,
    y: number,
  },
  speed: number,
  type: 'WS_TYPE_BUS_POSITION',
}
