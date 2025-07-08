// Event yönetimi modülü
import { toggleOrderInfo, handleEnter } from '../components/ui.js';
import { addProduct, resetProductForm, removeProductHandler, editProduct, updateProduct } from '../components/product.js';
import { kaydetMas, generateProforma, createOrder } from '../components/sales.js';
import { openNewCustomerModal, saveNewCustomer, openCustomerDetailModal } from '../components/customer.js';
import { openNewVehicleModal, saveNewVehicle, openVehicleDetailModal } from '../components/vehicle.js';
import { fetchCustomers, fetchProducts, fetchVehicles } from '../services/api.js';

export class EventManager {
  static setupEventHandlers(customers, products, tigerUsers) {
    // Buton ve klavye event'leri
    document.getElementById('toggleOrderInfo').onclick = toggleOrderInfo;
    document.getElementById('productQuantity').onkeypress = e => handleEnter(e, addProduct);
    
    // Global fonksiyonları window'a ekle
    window.createOrder = createOrder;
    window.openNewCustomerModal = openNewCustomerModal;
    window.openNewVehicleModal = openNewVehicleModal;
    window.saveNewCustomer = saveNewCustomer;
    window.saveNewVehicle = saveNewVehicle;

    // Sipariş üst bilgi ve kalem işlemleri
    window.kaydetMas = () => kaydetMas(customers, products, tigerUsers);
    window.addProduct = addProduct;
    window.removeProductHandler = removeProductHandler;
    window.editProduct = editProduct;
    window.updateProduct = updateProduct;
    window.resetProductForm = resetProductForm;

    // Proforma ve sipariş oluşturma
    window.generateProforma = generateProforma;

    // Lookup fonksiyonları
    window.fetchCustomers = fetchCustomers;
    window.fetchProducts = fetchProducts;
    window.fetchVehicles = fetchVehicles;

    // Detay görüntüleme fonksiyonları
    window.openCustomerDetailModal = openCustomerDetailModal;
    window.openVehicleDetailModal = openVehicleDetailModal;
  }
}
