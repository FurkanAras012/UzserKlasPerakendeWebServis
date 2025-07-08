// Veri yönetimi modülü
import { fetchCustomers, fetchProducts, fetchVehicles, fetchTigerUsers, fetchCities } from '../services/api.js';
import { loadCitiesDropdown } from '../components/customer.js';
import { LoadingManager } from './loading.js';

export class DataManager {
  static customers = [];
  static products = [];
  static vehicles = [];
  static tigerUsers = [];
  static cities = [];

  static async loadAllData() {
    try {
      console.log('Veriler yükleniyor...');
      LoadingManager.showLoading('Müşteri ve Ürün Verileri Yükleniyor...');
      
      const [customersData, productsData, vehiclesData, tigerUsersData, citiesData] = await Promise.all([
        fetchCustomers(),
        fetchProducts(),
        fetchVehicles(),
        fetchTigerUsers(),
        fetchCities()
      ]);
      
      this.customers = customersData;
      this.products = productsData;
      this.vehicles = vehiclesData;
      this.tigerUsers = tigerUsersData;
      this.cities = citiesData;
      
      console.log('Tüm veriler yüklendi:', {
        customers: this.customers.length,
        products: this.products.length, 
        vehicles: this.vehicles.length,
        tigerUsers: this.tigerUsers.length,
        cities: this.cities.length
      });

      // Cities dropdown'ını yükle
      loadCitiesDropdown(this.cities);

      // Global erişim için window'a ekle
      window.productsData = this.products;
      window.customersData = this.customers;
      window.vehiclesData = this.vehicles;
      window.tigerUsersData = this.tigerUsers;
      window.citiesData = this.cities;

      return {
        customers: this.customers,
        products: this.products,
        vehicles: this.vehicles,
        tigerUsers: this.tigerUsers,
        cities: this.cities
      };
    } catch (error) {
      console.error('Veri yükleme hatası:', error);
      throw error;
    }
  }

  static getCustomers() {
    return this.customers;
  }

  static getProducts() {
    return this.products;
  }

  static getVehicles() {
    return this.vehicles;
  }

  static getTigerUsers() {
    return this.tigerUsers;
  }

  static getCities() {
    return this.cities;
  }
}
