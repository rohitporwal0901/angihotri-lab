export interface LabTest {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  preparation: string[];
  description: string;
  sampleType: string;
  reportTime: string;
  popular?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}
