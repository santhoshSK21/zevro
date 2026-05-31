import axios from 'axios';

const SHIPROCKET_API_BASE = 'https://apiv2.shiprocket.in/v1/external';

export const shippingService = {
  /**
   * Authenticate and get Shiprocket Bearer Token
   */
  async getToken(): Promise<string> {
    try {
      const response = await axios.post(`${SHIPROCKET_API_BASE}/auth/login`, {
        email: process.env.SHIPROCKET_EMAIL || 'placeholder@email.com',
        password: process.env.SHIPROCKET_PASSWORD || 'placeholder_password'
      });
      return response.data.token;
    } catch (error) {
      console.error('Shiprocket Auth Error:', error);
      throw new Error('Failed to authenticate with shipping provider');
    }
  },

  /**
   * Create a forward shipment order in Shiprocket
   */
  async createShipment(orderData: any) {
    try {
      const token = await this.getToken();
      const response = await axios.post(`${SHIPROCKET_API_BASE}/orders/create/adhoc`, orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Shiprocket Create Shipment Error:', error);
      throw new Error('Failed to create shipment');
    }
  },

  /**
   * Generate AWB for an order
   */
  async generateAWB(shipmentId: string) {
    try {
      const token = await this.getToken();
      const response = await axios.post(`${SHIPROCKET_API_BASE}/courier/assign/awb`, {
        shipment_id: shipmentId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Shiprocket AWB Error:', error);
      throw new Error('Failed to generate AWB');
    }
  },

  /**
   * Generate and fetch Shipping Label
   */
  async generateLabel(shipmentIds: string[]) {
    try {
      const token = await this.getToken();
      const response = await axios.post(`${SHIPROCKET_API_BASE}/courier/generate/label`, {
        shipment_id: shipmentIds
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data; // Contains label URL
    } catch (error) {
      console.error('Shiprocket Label Error:', error);
      throw new Error('Failed to generate label');
    }
  },

  /**
   * Track an order via AWB code
   */
  async trackOrder(awbCode: string) {
    try {
      const token = await this.getToken();
      const response = await axios.get(`${SHIPROCKET_API_BASE}/courier/track/awb/${awbCode}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Shiprocket Track Error:', error);
      throw new Error('Failed to track order');
    }
  }
};
