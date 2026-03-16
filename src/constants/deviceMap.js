// Unified status map tracking ALL devices in the home
export const deviceMap = [
  // FANS
  { id: 'mfan', name: 'Master Fan', type: 'fan', url: '/mboardtwostatus', key: '1' },
  { id: 'kfan', name: 'Kitchen Fan', type: 'fan', url: '/kboardtwostatus', key: '1' },
  { id: 'lfan', name: 'Living Fan', type: 'fan', url: '/lacboardstatus', key: '1' },
  { id: 'dfan', name: 'Drawing Fan', type: 'fan', url: '/dboardstatus', key: '1' },
  { id: 'ofan', name: 'Office Fan', type: 'fan', url: '/oboardtwostatus', key: '1' },
  
  // ACs
  { id: 'maczone', name: 'Master AC', type: 'ac', url: '/mboardmainstatus', key: '5' },
  { id: 'dinningaczone', name: 'Dining AC', type: 'ac', url: '/dinningboardstatus', key: '3' },
  { id: 'laczone', name: 'Living AC', type: 'ac', url: '/lboardmainstatus', key: '7' },
  { id: 'dtvzone', name: 'Drawing AC', type: 'ac', url: '/dboardmainstatus', key: '5' },

  // GEYSERS
  { id: 'mgyser', name: 'Master Geyser', type: 'geyser', url: '/mgyserstatus', key: '2' },
  { id: 'kgyser', name: 'Kitchen Geyser', type: 'geyser', url: '/kgyserstatus', key: '8' },
  { id: 'ogyser', name: 'Office Geyser', type: 'geyser', url: '/ogyserstatus', key: '2' },
  
  // LIVING ROOM LIGHTS
  { id: 'lcenterzone', name: 'Living Center', type: 'light', url: '/lboardmainstatus', key: '5' },
  { id: 'lhallway', name: 'Living Hallway', type: 'light', url: '/lboardmainstatus', key: '3' },
  { id: 'lcurtainlight', name: 'Living Curtain Light', type: 'light', url: '/lboardtwostatus', key: '1' },
  { id: 'lscallop', name: 'Living Scallop', type: 'light', url: '/lacboardstatus', key: '5' },
  { id: 'lfloorlamp', name: 'Living Floor Lamp', type: 'light', url: '/ltvboardstatus', key: '2' },
  { id: 'ltv', name: 'Living TV', type: 'tv', url: '/ltvboardstatus', key: '4' },
  
  // DRAWING ROOM LIGHTS
  { id: 'dcenterzone', name: 'Drawing Center', type: 'light', url: '/dboardmainstatus', key: '3' },
  { id: 'dhallway', name: 'Drawing Hallway', type: 'light', url: '/dboardmainstatus', key: '7' },
  { id: 'dgovee', name: 'Drawing Govee', type: 'light', url: '/dboardstatus', key: '2' },
  { id: 'dwalllamp', name: 'Drawing Wall Lamp', type: 'light', url: '/dboardstatus', key: '4' },
  { id: 'dcurtainlight', name: 'Drawing Curtain Light', type: 'light', url: '/dboardstatus', key: '5' },
  { id: 'dwallwasher', name: 'Drawing Wall Washer', type: 'light', url: '/dboardstatus', key: '6' },
  { id: 'dtv', name: 'Drawing TV', type: 'tv', url: '/dboardstatus', key: '8' },

  // MASTER BEDROOM LIGHTS
  { id: 'mcenterzone', name: 'Master Center', type: 'light', url: '/mboardmainstatus', key: '3' },
  { id: 'mwardrobe', name: 'Master Wardrobe', type: 'light', url: '/mboardmainstatus', key: '7' },
  { id: 'mlight2', name: 'Master Light 2', type: 'light', url: '/mboardtwostatus', key: '2' },
  { id: 'mlight3', name: 'Master Light 3', type: 'light', url: '/mboardtwostatus', key: '3' },
  { id: 'mlight4', name: 'Master Light 4', type: 'light', url: '/mboardtwostatus', key: '4' },
  { id: 'mwalllamp', name: 'Master Wall Lamp', type: 'light', url: '/mentrancestatus', key: '1' },
  { id: 'mtv', name: 'Master TV', type: 'tv', url: '/mtvboardstatus', key: '2' },
  { id: 'mtvunderlight', name: 'Master TV Light', type: 'light', url: '/mtvboardstatus', key: '3' },
  
  // KITCHEN LIGHTS
  { id: 'kicenterzone', name: 'Kitchen Center', type: 'light', url: '/kiboardmainstatus', key: '3' },
  { id: 'kiservicelight', name: 'Service Light', type: 'light', url: '/kiboardtwostatus', key: '2' },
  { id: 'kiwalllamp', name: 'Kitchen Wall Lamp', type: 'light', url: '/kiboardtwostatus', key: '3' },
  
  // BALCONY & POOJA
  { id: 'dinningcenterzone', name: 'Dining Center', type: 'light', url: '/dinningboardstatus', key: '5' },
  { id: 'poojaroom', name: 'Pooja Room', type: 'light', url: '/dinningboardstatus', key: '7' },
  { id: 'poojaroompanel', name: 'Pooja Panel', type: 'light', url: '/poojaboardstatus', key: '1' },
  { id: 'poojaroomunderlight', name: 'Pooja Underlight', type: 'light', url: '/poojaboardstatus', key: '2' },
  { id: 'dlight1', name: 'Dining Light 1', type: 'light', url: '/dinningboardtwostatus', key: '1' },
  { id: 'dlight2', name: 'Dining Light 2', type: 'light', url: '/dinningboardtwostatus', key: '2' },
  { id: 'dlight3', name: 'Dining Light 3', type: 'light', url: '/dinningboardtwostatus', key: '3' },
  { id: 'bchandlier', name: 'Balcony Chandelier', type: 'light', url: '/dinningboardtwostatus', key: '4' },
  { id: 'balconyzone', name: 'Balcony', type: 'light', url: '/bboardstatus', key: '3' },
  { id: 'bsocket', name: 'Balcony Socket', type: 'socket', url: '/bboardtwostatus', key: '1' },
  { id: 'bexhaust', name: 'Balcony Exhaust', type: 'fan', url: '/bboardtwostatus', key: '2' }
];

export const gateway = 'http://192.168.88.122:1880';
