import { useState, useEffect } from 'react';
import { getPendingProducts, updateProductStatus, getPendingServices, updateServiceStatus } from '../../api/adminApi';
import { useAuth } from '../../context/AuthContext';
import { Package, Briefcase, Check, X, ChevronLeft, ChevronRight } from 'lucide-react';
import SafeImage from '../../components/SafeImage';

const AdminApprovals = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productPage, setProductPage] = useState(1);
  const [servicePage, setServicePage] = useState(1);
  const [productTotal, setProductTotal] = useState(0);
  const [serviceTotal, setServiceTotal] = useState(0);
  const limit = 10;

  useEffect(() => {
    if (user?.role !== 'admin') return;
    fetchData();
  }, [user, activeTab, productPage, servicePage]);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'products') {
        const data = await getPendingProducts(productPage, limit);
        setProducts(data.data);
        setProductTotal(data.total);
      } else {
        const data = await getPendingServices(servicePage, limit);
        setServices(data.data);
        setServiceTotal(data.total);
      }
    } catch (error) {
      console.error('Error fetching pending items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductApproval = async (productId, status) => {
    try {
      await updateProductStatus(productId, status);
      fetchData();
    } catch (error) {
      console.error('Error updating product status:', error);
      alert('Failed to update product status');
    }
  };

  const handleServiceApproval = async (serviceId, status) => {
    try {
      await updateServiceStatus(serviceId, status);
      fetchData();
    } catch (error) {
      console.error('Error updating service status:', error);
      alert('Failed to update service status');
    }
  };

  const productTotalPages = Math.ceil(productTotal / limit);
  const serviceTotalPages = Math.ceil(serviceTotal / limit);

  if (user?.role !== 'admin') {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 text-red-500 mx-auto mb-4 flex items-center justify-center">
          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
        <p className="text-gray-600">You don't have permission to access this page.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Pending Approvals</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === 'products'
              ? 'bg-white text-gray-800 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Products ({productTotal})
        </button>
        <button
          onClick={() => setActiveTab('services')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === 'services'
              ? 'bg-white text-gray-800 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Services ({serviceTotal})
        </button>
      </div>

      {activeTab === 'products' ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {products.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No pending products</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {products.map((product) => (
                <div key={product._id} className="p-6 hover:bg-gray-50">
                  <div className="flex gap-4">
                    {product.images?.[0] && (
                      <SafeImage
                        src={product.images[0]}
                        alt={product.title}
                        className="w-24 h-24 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{product.title}</h3>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>
                      <div className="flex items-center gap-4 mt-3">
                        <span className="text-lg font-bold text-teal-600">${product.price.toFixed(2)}</span>
                        <span className="text-sm text-gray-500">{product.category}</span>
                        <span className="text-sm text-gray-500">{product.condition}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                        <span>Seller: {product.sellerId?.name}</span>
                        <span>•</span>
                        <span>{product.sellerId?.email}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleProductApproval(product._id, 'active')}
                        className="flex items-center gap-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                      >
                        <Check className="w-4 h-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleProductApproval(product._id, 'rejected')}
                        className="flex items-center gap-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {productTotalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                Showing {((productPage - 1) * limit) + 1} to {Math.min(productPage * limit, productTotal)} of {productTotal} products
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setProductPage(p => Math.max(1, p - 1))}
                  disabled={productPage === 1}
                  className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="px-3 py-2 text-sm text-gray-600">
                  Page {productPage} of {productTotalPages}
                </span>
                <button
                  onClick={() => setProductPage(p => Math.min(productTotalPages, p + 1))}
                  disabled={productPage === productTotalPages}
                  className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {services.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Briefcase className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No pending services</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {services.map((service) => (
                <div key={service._id} className="p-6 hover:bg-gray-50">
                  <div className="flex gap-4">
                    {service.portfolioImages?.[0] && (
                      <SafeImage
                        src={service.portfolioImages[0]}
                        alt={service.title}
                        className="w-24 h-24 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{service.title}</h3>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{service.description}</p>
                      <div className="flex items-center gap-4 mt-3">
                        <span className="text-lg font-bold text-teal-600">${service.price.toFixed(2)}</span>
                        <span className="text-sm text-gray-500">{service.category}</span>
                        <span className="text-sm text-gray-500">{service.deliveryTimeInDays} days delivery</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                        <span>Provider: {service.providerId?.name}</span>
                        <span>•</span>
                        <span>{service.providerId?.email}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleServiceApproval(service._id, 'active')}
                        className="flex items-center gap-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                      >
                        <Check className="w-4 h-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleServiceApproval(service._id, 'rejected')}
                        className="flex items-center gap-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {serviceTotalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                Showing {((servicePage - 1) * limit) + 1} to {Math.min(servicePage * limit, serviceTotal)} of {serviceTotal} services
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setServicePage(p => Math.max(1, p - 1))}
                  disabled={servicePage === 1}
                  className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="px-3 py-2 text-sm text-gray-600">
                  Page {servicePage} of {serviceTotalPages}
                </span>
                <button
                  onClick={() => setServicePage(p => Math.min(serviceTotalPages, p + 1))}
                  disabled={servicePage === serviceTotalPages}
                  className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminApprovals;
