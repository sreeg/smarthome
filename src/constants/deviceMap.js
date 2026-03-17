// Unified status map tracking ALL devices in the home
export const deviceMap = [
  // FANS
  { id: 'mfan', name: 'Master Fan', type: 'fan', url: '/mboardtwostatus', key: '1' },
  { id: 'kfan', name: 'Kids Fan', type: 'fan', url: '/kboardtwostatus', key: '1' },
  { id: 'lfan', name: 'Living Fan', type: 'fan', url: '/lacboardstatus', key: '1' },
  { id: 'dfan', name: 'Drawing Fan', type: 'fan', url: '/dboardstatus', key: '1' },
  { id: 'ofan', name: 'Office Fan', type: 'fan', url: '/oboardtwostatus', key: '1' },
  { id: 'bexhaust', name: 'Balcony Exhaust', type: 'fan', url: '/bboardtwostatus', key: '2' },
  
  // ACs
  { id: 'maczone', name: 'Master AC', type: 'ac', url: '/mboardmainstatus', key: '5' },
  { id: 'dinningaczone', name: 'Dining AC', type: 'ac', url: '/dinningboardstatus', key: '3' },
  { id: 'laczone', name: 'Living AC', type: 'ac', url: '/lboardmainstatus', key: '7' },
  { id: 'dtvzone', name: 'Drawing AC', type: 'ac', url: '/dboardmainstatus', key: '5' },
  { id: 'oaczone', name: 'Office AC', type: 'ac', url: '/oboardmainstatus', key: '3' },
  { id: 'kaczone', name: 'Kids AC', type: 'ac', url: '/kboardmainstatus', key: '5' },

  // GEYSERS
  { id: 'mgyser', name: 'Master Geyser', type: 'geyser', url: '/mgyserstatus', key: '2' },
  { id: 'kgyser', name: 'Kids Geyser', type: 'geyser', url: '/kgyserstatus', key: '8' },
  { id: 'ogyser', name: 'Office Geyser', type: 'geyser', url: '/ogyserstatus', key: '2' },
  
  // LIGHTS - LIVING
  { id: 'lcenterzone', name: 'Living Center', type: 'light', url: '/lboardmainstatus', key: '5' },
  { id: 'lhallway', name: 'Living Hallway', type: 'light', url: '/lboardmainstatus', key: '3' },
  { id: 'lcurtainlight', name: 'Living Curtain Light', type: 'light', url: '/lboardtwostatus', key: '1' },
  { id: 'lscallop', name: 'Living Scallop', type: 'light', url: '/lacboardstatus', key: '5' },
  { id: 'lfloorlamp', name: 'Living Floor Lamp', type: 'light', url: '/ltvboardstatus', key: '2' },
  { id: 'ldigitalclock', name: 'Eiffel Tower', type: 'light', url: '/ltvboardstatus', key: '3' },
  { id: 'ltv', name: 'Living TV', type: 'tv', url: '/ltvboardstatus', key: '4' },
  { id: 'livingtvsocket', name: 'Living Cabinet', type: 'light', url: '/ltvboardstatus', key: '1' },
  
  // LIGHTS - DRAWING
  { id: 'dcenterzone', name: 'Drawing Center', type: 'light', url: '/dboardmainstatus', key: '3' },
  { id: 'dhallway', name: 'Drawing Hallway', type: 'light', url: '/dboardmainstatus', key: '7' },
  { id: 'dgovee', name: 'Drawing Govee', type: 'light', url: '/dboardstatus', key: '2' },
  { id: 'dwalllamp', name: 'Drawing Wall Lamp', type: 'light', url: '/dboardstatus', key: '4' },
  { id: 'dcurtainlight', name: 'Drawing Curtain Light', type: 'light', url: '/dboardstatus', key: '5' },
  { id: 'dwallwasher', name: 'Drawing Wall Washer', type: 'light', url: '/dboardstatus', key: '6' },
  { id: 'dtv', name: 'Drawing TV', type: 'tv', url: '/dboardstatus', key: '8' },

  // LIGHTS - MASTER
  { id: 'mcenterzone', name: 'Master Center', type: 'light', url: '/mboardmainstatus', key: '3' },
  { id: 'mwardrobe', name: 'Master Wardrobe', type: 'light', url: '/mboardmainstatus', key: '7' },
  { id: 'mlight2', name: 'Master Light 2', type: 'light', url: '/mboardtwostatus', key: '2' },
  { id: 'mlight3', name: 'Master Light 3', type: 'light', url: '/mboardtwostatus', key: '3' },
  { id: 'mlight4', name: 'Master Light 4', type: 'light', url: '/mboardtwostatus', key: '4' },
  { id: 'mwalllamp', name: 'Master Wall Lamp', type: 'light', url: '/mentrancestatus', key: '1' },
  { id: 'mtv', name: 'Master TV', type: 'tv', url: '/mtvboardstatus', key: '2' },
  { id: 'mtvunderlight', name: 'Master TV Light', type: 'light', url: '/mtvboardstatus', key: '3' },
  
  // LIGHTS - KITCHEN
  { id: 'kicenterzone', name: 'Kitchen Center', type: 'light', url: '/kiboardmainstatus', key: '3' },
  { id: 'kiservicelight', name: 'Service Light', type: 'light', url: '/kiboardtwostatus', key: '2' },
  { id: 'kiwalllamp', name: 'Kitchen Wall Lamp', type: 'light', url: '/kiboardtwostatus', key: '3' },
  
  // LIGHTS - KIDS
  { id: 'kcenterzone', name: 'Kids Center', type: 'light', url: '/kboardmainstatus', key: '3' },
  { id: 'kwardrobe', name: 'Kids Wardrobe', type: 'light', url: '/kboardmainstatus', key: '7' },
  { id: 'klight2', name: 'Kids Light 2', type: 'light', url: '/kboardtwostatus', key: '2' },
  { id: 'klight4', name: 'Kids Light 4', type: 'light', url: '/kboardtwostatus', key: '4' },
  { id: 'kwalllamp', name: 'Kids Wall Lamp', type: 'light', url: '/ksbstatus', key: '1' },
  { id: 'ksocket1', name: 'Kids Socket 1', type: 'socket', url: '/ksbstatus', key: '2' },
  
  // LIGHTS - OFFICE
  { id: 'ocenterzone', name: 'Office Center', type: 'light', url: '/oboardmainstatus', key: '5' },
  { id: 'owindowside', name: 'Office Window', type: 'light', url: '/oboardmainstatus', key: '7' },
  { id: 'olight3', name: 'Office Light 3', type: 'light', url: '/oboardtwostatus', key: '3' },
  { id: 'olight4', name: 'Office Light 4', type: 'light', url: '/oboardtwostatus', key: '4' },
  { id: 'olight5', name: 'Office Light 5', type: 'light', url: '/oboardtwostatus', key: '5' },
  { id: 'olight6', name: 'Office Light 6', type: 'light', url: '/oboardtwostatus', key: '6' },
  { id: 'olight7', name: 'Office WD Warm', type: 'light', url: '/oboardtwostatus', key: '7' },
  { id: 'olight8', name: 'Office WD Color', type: 'light', url: '/oboardtwostatus', key: '8' },
  { id: 'lines', name: 'Nano Lines', type: 'light', url: '/oboardtwostatus', key: '2' },

  // DINING & POOJA
  { id: 'dinningcenterzone', name: 'Dining Center', type: 'light', url: '/dinningboardstatus', key: '5' },
  { id: 'poojaroom', name: 'Pooja Room', type: 'light', url: '/dinningboardstatus', key: '7' },
  { id: 'poojaroompanel', name: 'Pooja Panel', type: 'light', url: '/poojaboardstatus', key: '1' },
  { id: 'poojaroomunderlight', name: 'Pooja Underlight', type: 'light', url: '/poojaboardstatus', key: '2' },
  { id: 'dlight1', name: 'Dining Light 1', type: 'light', url: '/dinningboardtwostatus', key: '1' },
  { id: 'dlight2', name: 'Dining Light 2', type: 'light', url: '/dinningboardtwostatus', key: '2' },
  { id: 'dlight3', name: 'Dining Light 3', type: 'light', url: '/dinningboardtwostatus', key: '3' },
  { id: 'bchandlier', name: 'Balcony Chandelier', type: 'light', url: '/dinningboardtwostatus', key: '4' },
  { id: 'balconyzone', name: 'Balcony Light', type: 'light', url: '/bboardstatus', key: '3' },
  { id: 'bsocket', name: 'Balcony Socket', type: 'socket', url: '/bboardtwostatus', key: '1' },
  { id: 'bvalve', name: 'Water Valve', type: 'switch', url: '/watervalvestatus', key: 'state' }
];

export const gateway = 'http://192.168.88.122:1880';
