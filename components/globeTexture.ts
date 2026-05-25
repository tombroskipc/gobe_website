import * as THREE from "three";

export type LandPolygon = {
  id: string;
  points: Array<[number, number]>;
};

export const detailedLandPolygons: LandPolygon[] = [
  {
    id: "north-america",
    points: [
      [-168, 58],
      [-157, 70],
      [-135, 72],
      [-122, 64],
      [-105, 67],
      [-82, 57],
      [-61, 51],
      [-70, 43],
      [-80, 30],
      [-96, 25],
      [-105, 18],
      [-118, 24],
      [-124, 35],
      [-134, 50],
      [-150, 55],
    ],
  },
  {
    id: "central-america",
    points: [
      [-105, 20],
      [-91, 18],
      [-84, 12],
      [-78, 9],
      [-75, 5],
      [-82, 7],
      [-91, 13],
      [-100, 16],
    ],
  },
  {
    id: "south-america",
    points: [
      [-80, 12],
      [-66, 9],
      [-52, -2],
      [-39, -16],
      [-45, -31],
      [-54, -43],
      [-67, -55],
      [-73, -40],
      [-76, -22],
      [-82, -7],
    ],
  },
  {
    id: "greenland",
    points: [
      [-58, 61],
      [-48, 75],
      [-27, 82],
      [-17, 70],
      [-30, 58],
      [-45, 55],
    ],
  },
  {
    id: "europe",
    points: [
      [-11, 36],
      [-6, 50],
      [8, 59],
      [27, 61],
      [41, 53],
      [39, 43],
      [28, 37],
      [15, 41],
      [7, 37],
      [-2, 42],
    ],
  },
  {
    id: "africa",
    points: [
      [-18, 32],
      [0, 36],
      [23, 32],
      [43, 13],
      [51, -9],
      [37, -30],
      [23, -35],
      [12, -29],
      [3, -14],
      [-10, 2],
      [-16, 18],
    ],
  },
  {
    id: "middle-east",
    points: [
      [34, 33],
      [49, 29],
      [58, 19],
      [50, 9],
      [40, 14],
      [35, 23],
    ],
  },
  {
    id: "asia",
    points: [
      [40, 35],
      [56, 55],
      [83, 63],
      [116, 61],
      [149, 50],
      [158, 35],
      [144, 20],
      [124, 17],
      [112, 8],
      [96, 14],
      [82, 7],
      [71, 20],
      [58, 24],
      [48, 31],
    ],
  },
  {
    id: "india",
    points: [
      [68, 24],
      [78, 31],
      [88, 23],
      [86, 10],
      [77, 7],
      [70, 16],
    ],
  },
  {
    id: "southeast-asia-mainland",
    points: [
      [95, 22],
      [108, 23],
      [111, 12],
      [104, 3],
      [96, 8],
    ],
  },
  {
    id: "japan",
    points: [
      [130, 31],
      [141, 32],
      [146, 42],
      [139, 45],
      [132, 38],
    ],
  },
  {
    id: "indonesia",
    points: [
      [96, 5],
      [118, 4],
      [133, -3],
      [128, -9],
      [108, -7],
      [96, -2],
    ],
  },
  {
    id: "papua",
    points: [
      [135, -3],
      [153, -4],
      [154, -10],
      [139, -10],
    ],
  },
  {
    id: "australia",
    points: [
      [112, -12],
      [131, -10],
      [153, -24],
      [146, -40],
      [125, -44],
      [112, -31],
    ],
  },
  {
    id: "new-zealand",
    points: [
      [166, -35],
      [178, -44],
      [172, -47],
      [160, -39],
    ],
  },
  {
    id: "madagascar",
    points: [
      [44, -13],
      [51, -18],
      [49, -26],
      [43, -24],
    ],
  },
];

const borderLines: Array<Array<[number, number]>> = [
  [
    [-125, 49],
    [-95, 48],
    [-70, 45],
  ],
  [
    [-117, 32],
    [-96, 29],
    [-81, 26],
  ],
  [
    [-74, -4],
    [-62, -16],
    [-55, -32],
  ],
  [
    [-62, -10],
    [-50, -17],
    [-45, -25],
  ],
  [
    [-5, 50],
    [15, 50],
    [32, 47],
  ],
  [
    [2, 31],
    [14, 13],
    [24, 0],
    [31, -20],
  ],
  [
    [17, 31],
    [26, 12],
    [36, -3],
  ],
  [
    [43, 29],
    [60, 28],
    [77, 24],
  ],
  [
    [72, 55],
    [92, 48],
    [112, 42],
    [132, 45],
  ],
  [
    [85, 30],
    [102, 25],
    [118, 22],
  ],
  [
    [101, 15],
    [111, 7],
    [121, 0],
  ],
  [
    [119, -22],
    [133, -27],
    [145, -35],
  ],
];

function lonToX(lon: number, width: number) {
  return ((lon + 180) / 360) * width;
}

function latToY(lat: number, height: number) {
  return ((90 - lat) / 180) * height;
}

function tracePolygon(
  context: CanvasRenderingContext2D,
  points: Array<[number, number]>,
  width: number,
  height: number,
) {
  context.beginPath();
  points.forEach(([lon, lat], index) => {
    const x = lonToX(lon, width);
    const y = latToY(lat, height);
    if (index === 0) context.moveTo(x, y);
    else context.lineTo(x, y);
  });
  context.closePath();
}

export function createDetailedGlobeTexture(size = 2048) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size / 2;

  const context = canvas.getContext("2d");
  if (!context) throw new Error("Unable to create globe texture context.");

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#F26522";

  detailedLandPolygons.forEach((polygon) => {
    tracePolygon(context, polygon.points, canvas.width, canvas.height);
    context.fill();
  });

  context.save();
  context.globalCompositeOperation = "source-atop";
  context.strokeStyle = "rgba(255, 202, 164, 0.54)";
  context.lineWidth = Math.max(1, size / 920);
  context.lineCap = "round";
  context.lineJoin = "round";

  borderLines.forEach((line) => {
    context.beginPath();
    line.forEach(([lon, lat], index) => {
      const x = lonToX(lon, canvas.width);
      const y = latToY(lat, canvas.height);
      if (index === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    });
    context.stroke();
  });

  context.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return texture;
}
