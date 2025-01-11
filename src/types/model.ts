export interface ModelGeometry {
  texturewidth: number;
  textureheight: number;
  visible_bounds_width: number;
  visible_bounds_height: number;
  visible_bounds_offset: [number, number, number];
  bones: ModelBone[];
}

export interface ModelBone {
  name: string;
  parent?: string;
  pivot: [number, number, number];
  rotation?: [number, number, number];
  cubes?: ModelCube[];
  mirror?: boolean;
}

export interface ModelCube {
  origin: [number, number, number];
  size: [number, number, number];
  uv: [number, number] | {
    north?: [number, number];
    south?: [number, number];
    east?: [number, number];
    west?: [number, number];
    up?: [number, number];
    down?: [number, number];
  };
  inflate?: number;
  mirror?: boolean;
}

export interface CustomModel {
  [geometryName: string]: ModelGeometry;
}