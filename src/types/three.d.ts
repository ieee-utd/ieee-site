// three ships no bundled types and @types/three needs a newer TypeScript than
// this project pins, so the modules the scene uses are declared untyped rather
// than pulling in declarations the compiler cannot parse.
declare module "three";
declare module "three/examples/jsm/utils/BufferGeometryUtils.js";
declare module "three/examples/jsm/environments/RoomEnvironment.js";
